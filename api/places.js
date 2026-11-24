
const cache = new Map();

const NOMINATIM_USER_AGENT =
  'Elograin/1.0 (https://elograin-ashen.vercel.app/)';

function clean(value) {
  return String(value || '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const mode = req.query.mode;

    // 1. TRANSFORMAR CIDADE/ENDEREÇO EM COORDENADAS
    if (mode === 'geocode') {
      const q = clean(req.query.q);

      if (q.length < 3 || q.length > 120) {
        return res.status(400).json({ error: 'Informe uma localização válida.' });
      }

      const key = 'geo:' + q.toLowerCase();
      if (cache.has(key)) {
        return res.status(200).json(cache.get(key));
      }

      const url = new URL('https://nominatim.openstreetmap.org/search');
      url.searchParams.set('format', 'jsonv2');
      url.searchParams.set('limit', '1');
      url.searchParams.set('country', 'Brazil');
      url.searchParams.set('q', q);

      const response = await fetch(url.toString(), {
        headers: {
          'User-Agent': NOMINATIM_USER_AGENT,
          'Accept-Language': 'pt-BR'
        }
      });

      if (!response.ok) {
        return res.status(503).json({ error: 'Serviço de localização indisponível.' });
      }

      const data = await response.json();

      if (!data.length) {
        return res.status(404).json({ error: 'Localização não encontrada.' });
      }

      const result = {
        lat: Number(data[0].lat),
        lon: Number(data[0].lon),
        display_name: clean(data[0].display_name)
      };

      cache.set(key, result);
      return res.status(200).json(result);
    }

    // 2. BUSCAR ESTABELECIMENTOS COM INFORMAÇÕES VEGANAS
    if (mode === 'nearby') {
      const lat = Number(req.query.lat);
      const lon = Number(req.query.lon);
      const radius = Math.min(Math.max(Number(req.query.radius) || 3000, 500), 5000);

      if (
        !Number.isFinite(lat) || !Number.isFinite(lon) ||
        Math.abs(lat) > 90 || Math.abs(lon) > 180
      ) {
        return res.status(400).json({ error: 'Coordenadas inválidas.' });
      }

      const key = `near:${lat.toFixed(3)}:${lon.toFixed(3)}:${radius}`;

      if (cache.has(key)) {
        return res.status(200).json(cache.get(key));
      }

      const query = `
        [out:json][timeout:25];
        (
          nwr(around:${radius},${lat},${lon})["amenity"~"^(restaurant|cafe|fast_food|bar|pub|ice_cream|food_court)$"]["diet:vegan"~"^(yes|only)$"];
          nwr(around:${radius},${lat},${lon})["amenity"~"^(restaurant|cafe|fast_food|bar|pub|ice_cream|food_court)$"]["vegan"~"^(yes|only)$"];
          nwr(around:${radius},${lat},${lon})["amenity"~"^(restaurant|cafe|fast_food|bar|pub|ice_cream|food_court)$"]["cuisine"~"vegan",i];

          nwr(around:${radius},${lat},${lon})["shop"~"^(bakery|confectionery|pastry|deli|tea|coffee)$"]["diet:vegan"~"^(yes|only)$"];
          nwr(around:${radius},${lat},${lon})["shop"~"^(bakery|confectionery|pastry|deli|tea|coffee)$"]["vegan"~"^(yes|only)$"];
          nwr(around:${radius},${lat},${lon})["shop"~"^(bakery|confectionery|pastry|deli|tea|coffee)$"]["cuisine"~"vegan",i];
        );
        out center tags 150;
      `;

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': NOMINATIM_USER_AGENT
        },
        body: 'data=' + encodeURIComponent(query)
      });

      if (!response.ok) {
        return res.status(503).json({
          error: 'A busca no OpenStreetMap está temporariamente indisponível.'
        });
      }

      const data = await response.json();

      const places = (data.elements || []).map(function(el) {
        const tags = el.tags || {};
        const latValue = el.lat != null ? el.lat : el.center && el.center.lat;
        const lonValue = el.lon != null ? el.lon : el.center && el.center.lon;

        if (!tags.name || latValue == null || lonValue == null) return null;

        const veganTag = tags['diet:vegan'] || tags.vegan || '';
        const cuisine = tags.cuisine || '';

        const isFullyVegan =
          veganTag === 'only' ||
          /(^|;)vegan(;|$)/i.test(cuisine);

        const address =
          tags['addr:full'] ||
          [
            tags['addr:street'],
            tags['addr:housenumber'],
            tags['addr:suburb'],
            tags['addr:city']
          ].filter(Boolean).join(', ') ||
          'Endereço não informado';

        const category = tags.amenity || tags.shop || 'estabelecimento';

        return {
          id: 'osm-' + el.type + '-' + el.id,
          name: clean(tags.name),
          type: isFullyVegan
            ? '100% Vegano (informação do mapa)'
            : 'Opções veganas indicadas no mapa',
          category: category,
          rating: 0,
          reviews: 0,
          address: clean(address),
          lat: Number(latValue),
          lng: Number(lonValue),
          hours: clean(tags.opening_hours),
          icon: category === 'bakery' ? '🥐' :
                category === 'cafe' ? '☕' :
                category === 'ice_cream' ? '🍦' : '🍽️',
          badge: isFullyVegan ? 'vegan' : 'friendly',
          description: clean(tags.description || ''),
          real: true,
          source: 'OpenStreetMap'
        };
      }).filter(Boolean);

      const result = { places: places };
      cache.set(key, result);

      return res.status(200).json(result);
    }

    return res.status(400).json({ error: 'Modo de busca inválido.' });

  } catch (error) {
    console.error('Erro na busca de locais:', error);
    return res.status(500).json({ error: 'Não foi possível realizar a busca.' });
  }
};
