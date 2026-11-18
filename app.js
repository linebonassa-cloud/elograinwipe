
// Fallback: se as animações não carregarem, o app continua funcionando (coração/estrela simples)
if (typeof Elo === 'undefined') { window.Elo = { heartHTML: function(id, l) { return '<span class="heart-wrap">' + (l ? '❤️' : '🤍') + '</span>'; }, setHeart: function(b, l) { b.querySelector('.heart-wrap').textContent = l ? '❤️' : '🤍'; }, mountRating: function(box) { if (box) box.innerHTML = '<p style="color:var(--text-light);font-size:.85rem">Avaliação indisponível no momento.</p>'; } }; }
// ============================================
// ELOGRAIN v3 - Swipe to Delete + Lixeira + OpenStreetMap
// ============================================

const GOOGLE_API_KEY = localStorage.getItem('elograin_google_api_key') || '';

const MOCK_POSTS = [
  { id: 1, author: "Ana Verde", avatar: "🌱", time: "2h", content: "Finalmente encontrei um queijo vegano que derrete igual o original! Testei na lasanha e ficou perfeito. Alguem mais ja experimentou a marca Natureza?", tag: "dica", likes: 24, comments: 8, liked: false, image: null },
  { id: 2, author: "Carlos Lima", avatar: "🦁", time: "4h", content: "Hoje visitei o restaurante Raizes em SP e simplesmente incrivel! O strogonoff de palmito e de outro mundo. Super recomendo para quem esta levando amigos nao-veganos!", tag: "experiencia", likes: 45, comments: 12, liked: true, image: null },
  { id: 3, author: "Mariana Souza", avatar: "🦋", time: "6h", content: "Gente, preciso de ajuda! Estou tentando fazer um pao de queijo vegano mas fica borrachudo. Alguem tem uma receita infalivel?", tag: "duvida", likes: 8, comments: 15, liked: false, image: null },
  { id: 4, author: "Pedro Alves", avatar: "🐻", time: "8h", content: "Dica de supermercado: o Extra da Paulista tem uma secao enorme de produtos veganos agora! Ate nuggets de grao-de-bico encontrei.", tag: "dica", likes: 32, comments: 5, liked: false, image: null },
  { id: 5, author: "Julia Costa", avatar: "🌸", time: "12h", content: "Fui no Festival Vegano de Curitiba no fim de semana e foi magico! Tantas opcoes, musica boa e energia incrivel. Quem vai no proximo?", tag: "experiencia", likes: 67, comments: 20, liked: false, image: null },
  { id: 6, author: "Rafael Mendes", avatar: "🌵", time: "1d", content: "Acabei de fazer um bolo de chocolate vegano para o aniversario da minha mae e ela nem percebeu! A receita e daqui do app, da @AnaVerde. Obrigado pela dica!", tag: "experiencia", likes: 56, comments: 9, liked: true, image: null }
];

const MOCK_RECIPES = [
  { id: 1, photo: "ensopado", title: "Strogonoff de Grao-de-Bico", author: "Ana Verde", avatar: "🌱", time: "45 min", difficulty: "Facil", rating: 4.8, reviews: 34, category: "economica", tags: ["💰 Economica", "🥘 Principal"], image: "🍛", ingredients: ["2 xicaras grao-de-bico cozido", "1 cebola picada", "2 dentes alho", "200ml creme de castanha", "1 colher ketchup", "1 colher mostarda", "Sal e pimenta"], steps: ["Refogue cebola e alho ate dourar.", "Adicione o grao-de-bico e tempere.", "Misture ketchup, mostarda e creme de castanha.", "Cozinhe por 10 min e sirva com arroz."] },
  { id: 2, photo: "bolo-chocolate", title: "Bolo de Chocolate Vegano", author: "Julia Costa", avatar: "🌸", time: "50 min", difficulty: "Medio", rating: 4.9, reviews: 52, category: "sobremesa", tags: ["🍰 Sobremesa", "🎉 Festa"], image: "🍫", ingredients: ["2 xicaras farinha", "1 xicara cacau", "1 xicara acucar", "1 xicara leite vegetal", "1/2 xicara oleo", "1 colher fermento", "1 colher vinagre"], steps: ["Misture secos em uma tigela.", "Adicione umidos e mexa ate homogeneizar.", "Leve ao forno a 180C por 35 min.", "Decore com ganache de chocolate vegano."] },
  { id: 3, photo: "tofu-mexido", title: "Tofu Mexido de Cafe da Manha", author: "Carlos Lima", avatar: "🦁", time: "15 min", difficulty: "Facil", rating: 4.5, reviews: 18, category: "rapida", tags: ["⚡ Rapida", "🌅 Cafe"], image: "🍳", ingredients: ["200g tofu firme", "1/2 colher curcuma", "2 colheres levedura nutricional", "Sal, pimenta e azeite", "Vegetais a gosto"], steps: ["Escorra e esfarele o tofu.", "Refogue com azeite e vegetais.", "Adicione curcuma e levedura.", "Cozinhe por 5 min e sirva quente."] },
  { id: 4, photo: "macarrao", title: "Lasanha de Berinjela", author: "Mariana Souza", avatar: "🦋", time: "60 min", difficulty: "Medio", rating: 4.7, reviews: 28, category: "economica", tags: ["💰 Economica", "🥘 Principal"], image: "🍲", ingredients: ["2 berinjelas em rodelas", "Molho de tomate caseiro", "Creme de castanha", "Queijo vegano ralado", "Manjericao fresco"], steps: ["Grelhe as rodelas de berinjela.", "Monte camadas: molho, berinjela, creme.", "Finalize com queijo vegano.", "Asse a 200C por 25 min."] },
  { id: 5, photo: "bowl-frutas", title: "Sorvete de Banana e Peanut", author: "Pedro Alves", avatar: "🐻", time: "5 min", difficulty: "Facil", rating: 4.6, reviews: 41, category: "sobremesa", tags: ["🍰 Sobremesa", "❄️ Gelado"], image: "🍦", ingredients: ["3 bananas congeladas", "2 colheres pasta de amendoim", "1 colher cacau (opcional)", "Granola para decorar"], steps: ["Bata as bananas congeladas no processador.", "Adicione pasta de amendoim e bata mais.", "Sirva imediatamente com granola."] },
  { id: 6, photo: "hamburguer", title: "Hamburguer de Lentilha", author: "Rafael Mendes", avatar: "🌵", time: "30 min", difficulty: "Facil", rating: 4.4, reviews: 22, category: "economica", tags: ["💰 Economica", "🍔 Lanche"], image: "🍔", ingredients: ["1 xicara lentilha cozida", "1/2 xicara aveia em flocos", "1 cebola caramelizada", "Alho e cominho", "Sal e pimenta"], steps: ["Processe lentilha e aveia.", "Misture temperos e cebola.", "Modele hamburgueres.", "Grelhe 4 min de cada lado."] },
  { id: 7, photo: "bowl-frutas", title: "Smoothie Bowl Verde", author: "Ana Verde", avatar: "🌱", time: "10 min", difficulty: "Facil", rating: 4.3, reviews: 15, category: "rapida", tags: ["⚡ Rapida", "💚 Saudavel"], image: "🥣", ingredients: ["1 banana congelada", "1 xicara espinafre", "1/2 xicara leite de coco", "1/2 abacate", "Toppings: semente, frutas"], steps: ["Bata banana, espinafre, leite e abacate.", "Coloque em uma tigela.", "Decore com sementes e frutas.", "Aproveite imediatamente!"] },
  { id: 8, photo: "brigadeiros", title: "Brigadeiro Vegano", author: "Julia Costa", avatar: "🌸", time: "20 min", difficulty: "Facil", rating: 4.9, reviews: 63, category: "sobremesa", tags: ["🍰 Sobremesa", "🎉 Festa"], image: "🍬", ingredients: ["1 xicara leite condensado de aveia", "1/2 xicara cacau em po", "1 colher manteiga vegetal", "Granulado vegano"], steps: ["Misture leite condensado e cacau.", "Cozinhe em fogo baixo ate desgrudar.", "Adicione manteiga e misture.", "Enrole e passe no granulado."] }
];

const MOCK_PLACES = [
  { id: 9, name: "Mont Zion Vegan", type: "100% Vegano", category: "restaurante", rating: 0, reviews: 0, address: "Rua Caio Graco, 393 - Vila Romana, São Paulo - SP", query: ["Rua Caio Graco, 393, Vila Romana, São Paulo, SP, Brasil", "Rua Caio Graco, Vila Romana, São Paulo, SP, Brasil"], hours: "Terça a sábado, das 10h às 17h", lat: null, lng: null, icon: "🍽️", badge: "vegan", real: true },
  { id: 10, name: "Amarama Vegan", type: "100% Vegano", category: "confeitaria", rating: 0, reviews: 0, address: "Rua Caio Graco, 745 - Vila Romana, São Paulo - SP", query: ["Rua Caio Graco, 745, Vila Romana, São Paulo, SP, Brasil", "Rua Caio Graco, Vila Romana, São Paulo, SP, Brasil"], hours: "", lat: null, lng: null, icon: "🥐", badge: "vegan", real: true, description: "Confeitaria vegana: refeições, pizzas, pães, doces e tortas." },
  { id: 1, name: "Raizes Restaurante", type: "100% Vegano", category: "restaurante", rating: 4.9, reviews: 120, address: "R. Augusta, 500 - SP", lat: -23.5505, lng: -46.6512, icon: "🍽️", badge: "vegan" },
  { id: 2, name: "Sorveteria Verde", type: "100% Vegano", category: "sorveteria", rating: 4.7, reviews: 85, address: "Av. Paulista, 1000 - SP", lat: -23.5629, lng: -46.6544, icon: "🍦", badge: "vegan" },
  { id: 3, name: "Padaria Flor", type: "Vegan Friendly", category: "padaria", rating: 4.3, reviews: 45, address: "R. Oscar Freire, 200 - SP", lat: -23.5615, lng: -46.6723, icon: "🥐", badge: "friendly" },
  { id: 4, name: "Burger Plant", type: "100% Vegano", category: "lanchonete", rating: 4.6, reviews: 92, address: "R. Fidalga, 80 - SP", lat: -23.5558, lng: -46.6878, icon: "🍔", badge: "vegan" },
  { id: 5, name: "Cafe Moka", type: "Vegan Friendly", category: "cafe", rating: 4.2, reviews: 38, address: "R. Harmonia, 150 - SP", lat: -23.5389, lng: -46.6890, icon: "☕", badge: "friendly" },
  { id: 6, name: "Emporio Natural", type: "100% Vegano", category: "restaurante", rating: 4.8, reviews: 67, address: "Av. Brasil, 300 - SP", lat: -23.5445, lng: -46.6361, icon: "🥗", badge: "vegan" },
  { id: 7, name: "Gelato Amor", type: "Vegan Friendly", category: "sorveteria", rating: 4.4, reviews: 52, address: "R. dos Pinheiros, 90 - SP", lat: -23.5650, lng: -46.6820, icon: "🍨", badge: "friendly" },
  { id: 8, name: "Lanchonete Sol", type: "Vegan Friendly", category: "lanchonete", rating: 4.1, reviews: 29, address: "Av. Reboucas, 400 - SP", lat: -23.5570, lng: -46.6600, icon: "🥪", badge: "friendly" }
];

const MOCK_EVENTS = [
  { id: 1, title: "Festival Vegano de SP", date: "25 Ago 2026", location: "Parque Ibirapuera", type: "Festival", icon: "🎪", attendees: 340 },
  { id: 2, title: "Feira de Produtos Naturais", date: "30 Ago 2026", location: "Expo Center Norte", type: "Feira", icon: "🛍️", attendees: 120 },
  { id: 3, title: "Encontro Vegano de Curitiba", date: "05 Set 2026", location: "Praca Osorio", type: "Encontro", icon: "🤝", attendees: 85 },
  { id: 4, title: "Workshop de Culinaria Vegana", date: "10 Set 2026", location: "Casa Natural - SP", type: "Workshop", icon: "👨‍🍳", attendees: 25 },
  { id: 5, title: "Marcha Animal Rights", date: "15 Set 2026", location: "Av. Paulista", type: "Marcha", icon: "🐾", attendees: 500 }
];

const MOCK_REVIEWS = [
  { id: 1, place: "Raizes Restaurante", author: "Carlos Lima", avatar: "🦁", rating: 5, text: "Simplesmente o melhor strogonoff que ja comi! O atendimento e impecavel e o ambiente e super aconchegante. Levei meus pais nao-veganos e eles amaram!", date: "2 dias atras", likes: 18 },
  { id: 2, place: "Sorveteria Verde", author: "Ana Verde", avatar: "🌱", rating: 5, text: "O sabor de pistache e surreal! Textura cremosa e nenhum gosto artificial. Preco justo para a qualidade.", date: "1 semana atras", likes: 12 },
  { id: 3, place: "Burger Plant", author: "Pedro Alves", avatar: "🐻", rating: 4, text: "Hamburguer muito bom, mas o tempo de espera foi longo. Recomendo ir em dia de semana. O milkshake de ovomaltine e must-try!", date: "3 dias atras", likes: 8 },
  { id: 4, place: "Padaria Flor", author: "Mariana Souza", avatar: "🦋", rating: 4, text: "Bom para encontrar opcoes, mas ainda tem poucas variedades doces. O pao de fermentacao natural e excelente!", date: "5 dias atras", likes: 5 },
  { id: 5, place: "Emporio Natural", author: "Julia Costa", avatar: "🌸", rating: 5, text: "Buffet por quilo com dezenas de opcoes! Tudo muito fresco e saboroso. O suco detox e maravilhoso.", date: "1 dia atras", likes: 22 }
];

const MOCK_PRODUCTS_MARKET = [
  { id: 1, name: "Leite de Aveita Organico", brand: "Aveita", category: "Bebidas", price: "R$ 12,90", icon: "🥛", vegan: true, stores: ["Carrefour", "Extra", "Mundo Verde"] },
  { id: 2, name: "Nuggets de Grao-de-Bico", brand: "Fazenda Futuro", category: "Congelados", price: "R$ 24,50", icon: "🍗", vegan: true, stores: ["Carrefour", "Pao de Acucar"] },
  { id: 3, name: "Queijo Cheddar Vegano", brand: "New Roots", category: "Frios", price: "R$ 32,00", icon: "🧀", vegan: true, stores: ["Mundo Verde", "Emporio Alto dos Pinheiros"] },
  { id: 4, name: "Iogurte de Coco Natural", brand: "CocoVeg", category: "Laticinios", price: "R$ 8,90", icon: "🥣", vegan: true, stores: ["Extra", "Carrefour"] },
  { id: 5, name: "Hamburguer de Soja", brand: "Seara Veg", category: "Congelados", price: "R$ 19,90", icon: "🍔", vegan: true, stores: ["Carrefour", "Extra", "Pao de Acucar"] },
  { id: 6, name: "Barra de Chocolate 70%", brand: "Mendoa", category: "Doces", price: "R$ 14,50", icon: "🍫", vegan: true, stores: ["Mundo Verde", "Carrefour"] },
  { id: 7, name: "Requeijao de Castanha", brand: "Veggs", category: "Frios", price: "R$ 18,90", icon: "🧈", vegan: true, stores: ["Emporio Natural", "Mundo Verde"] },
  { id: 8, name: "Granola Sem Mel", brand: "Kolln", category: "Cereais", price: "R$ 16,90", icon: "🥣", vegan: true, stores: ["Carrefour", "Extra"] }
];

const MOCK_PRODUCTS_BEAUTY = [
  { id: 1, name: "Shampoo Solido Lavanda", brand: "Lush", category: "Cabelo", price: "R$ 45,00", icon: "🧴", vegan: true, crueltyFree: true, stores: ["Lush Online", "Sephora"] },
  { id: 2, name: "Hidratante Facial Chia", brand: "B.A.E.", category: "Skincare", price: "R$ 29,90", icon: "🧴", vegan: true, crueltyFree: true, stores: ["O Boticario"] },
  { id: 3, name: "Batom Liquido Matte", brand: "Vizzela", category: "Maquiagem", price: "R$ 19,90", icon: "💄", vegan: true, crueltyFree: true, stores: ["Beleza Na Web", "Magalu"] },
  { id: 4, name: "Sabonete Artesanal Argila", brand: "Terra Brasil", category: "Corpo", price: "R$ 12,00", icon: "🧼", vegan: true, crueltyFree: true, stores: ["Mundo Verde", "Loja Natural"] },
  { id: 5, name: "Protetor Solar Mineral", brand: "Simple Organic", category: "Skincare", price: "R$ 68,00", icon: "☀️", vegan: true, crueltyFree: true, stores: ["Simple Organic Online"] },
  { id: 6, name: "Desodorante Natural", brand: "Biossance", category: "Corpo", price: "R$ 35,00", icon: "🌸", vegan: true, crueltyFree: true, stores: ["Sephora Online"] }
];

const MOCK_PROFILES = [
  { id: 1, name: "Luna Silva", age: 26, city: "São Paulo, SP", avatar: "🌙", bio: "Chef vegana em transicao. Amo trilhas e cafe da manha!", interests: ["Culinaria", "Natureza", "Yoga"], type: "encontros" },
  { id: 2, name: "Gabriel Costa", age: 29, city: "Curitiba, PR", avatar: "🎸", bio: "Musico e ativista. Procurando alguem para ir a festivais veganos!", interests: ["Musica", "Ativismo", "Cinema"], type: "encontros" },
  { id: 3, name: "Isabela Ferreira", age: 24, city: "Rio de Janeiro, RJ", avatar: "🎨", bio: "Ilustradora e amante de animais. Adoro experimentar receitas novas!", interests: ["Arte", "Animais", "Receitas"], type: "encontros" },
  { id: 4, name: "Thiago Mendes", age: 31, city: "São Paulo, SP", avatar: "🏃", bio: "Corredor e nutricionista esportivo vegano. Vamos correr no parque?", interests: ["Esportes", "Nutricao", "Viagens"], type: "amizades" },
  { id: 5, name: "Camila Rocha", age: 27, city: "Belo Horizonte, MG", avatar: "📚", bio: "Escritora e bookaholic. Procurando amigos para clubes do livro vegano!", interests: ["Leitura", "Escrita", "Cafes"], type: "amizades" },
  { id: 6, name: "Bruno Alves", age: 33, city: "Curitiba, PR", avatar: "🌵", bio: "Engenheiro e pai de plantas. Adoro compartilhar dicas de jardinagem!", interests: ["Plantas", "Tecnologia", "Board Games"], type: "amizades" }
];

let state = {
  currentView: 'home',
  darkMode: true,
  posts: [...MOCK_POSTS],
  recipes: [...MOCK_RECIPES],
  places: [...MOCK_PLACES],
  events: [...MOCK_EVENTS],
  reviews: [...MOCK_REVIEWS],
  productsMarket: [...MOCK_PRODUCTS_MARKET],
  productsBeauty: [...MOCK_PRODUCTS_BEAUTY],
  profiles: [...MOCK_PROFILES],
  myRecipes: [],
  recipeRatings: {},
  myReviews: [],
  user: { name: "Voce", avatar: "🦁", bio: "Membro da comunidade Elograin" },
  exploreTab: 'mapa',
  consumeTab: 'mercado',
  connectTab: 'encontros',
  createType: 'post',
  osmMap: null,
  osmMarkers: [],
  googlePlacesLoaded: false,
  isLoading: { feed: false, recipes: false, explore: false },
  deleteTargetId: null
};

function loadState() {
  try {
    const saved = localStorage.getItem('elograin_state_v3');
    if (saved) {
      const parsed = JSON.parse(saved);
      delete parsed.recipes;   // receitas embutidas vêm do código, nunca de uma cópia salva (evitava lista velha/duplicada)
      state = Object.assign({}, state, parsed);
    }
  } catch (e) {}
  state.myRecipes = cleanMyRecipes(state.myRecipes);
  state.recipeRatings = (state.recipeRatings && typeof state.recipeRatings === 'object') ? state.recipeRatings : {};
  state.user = Object.assign(userDefaults(), state.user || {});
  saveState();
  if (!localStorage.getItem('elograin_identity_v66')) { state.darkMode = true; localStorage.setItem('elograin_identity_v66', '1'); }   // nova identidade: abre no escuro uma vez
  if (state.darkMode) document.documentElement.setAttribute('data-theme', 'dark');
  else document.documentElement.removeAttribute('data-theme');
}

function saveState() {
  try {
    localStorage.setItem('elograin_state_v3', JSON.stringify({
      darkMode: state.darkMode,
      myRecipes: state.myRecipes,
      recipeRatings: state.recipeRatings,
      myReviews: state.myReviews,
      posts: state.posts,
      user: state.user
    }));
    return true;
  } catch (e) { return false; }
}

function toast(msg, actionLabel, action) {
  const container = document.getElementById('toastContainer');
  const el = document.createElement('div');
  el.className = 'toast';
  el.setAttribute('role', 'status');
  el.textContent = msg;
  if (actionLabel) {
    const b = document.createElement('button');
    b.className = 'toast-action';
    b.textContent = actionLabel;
    b.onclick = function() { action(); el.remove(); };
    el.appendChild(b);
  }
  container.appendChild(el);
  setTimeout(function() { el.remove(); }, actionLabel ? 5000 : 3000);
}

// Escapa HTML: texto digitado pelo usuário nunca pode virar código (evita XSS)
function esc(s) { return String(s).replace(/[&<>"']/g, function(c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
var TAG_LABEL = { dica: 'Dica', experiencia: 'Experiência', duvida: 'Dúvida' };
function activeFeedTag() { var t = document.querySelector('#feedTags .tag.active'); return t ? t.dataset.tag : 'todos'; }

// ===== SKELETON HELPERS =====
function showSkeleton(view) {
  if (view === 'recipes') {
    var sk = document.getElementById('recipesSkeleton');
    var list = document.getElementById('recipesList');
    if (sk) sk.classList.remove('hidden');
    if (list) list.classList.add('hidden');
    return;
  }
  if (view === 'explore') {
    var sk = document.getElementById('exploreSkeleton');
    var real = document.getElementById('exploreRealContent');
    if (sk) sk.classList.remove('hidden');
    if (real) real.classList.add('hidden');
    return;
  }
  var sk = document.getElementById(view + 'Skeleton');
  var content = document.getElementById(view + 'Posts');
  if (sk) sk.classList.remove('hidden');
  if (content) content.classList.add('hidden');
}

function hideSkeleton(view) {
  if (view === 'recipes') {
    var sk = document.getElementById('recipesSkeleton');
    var list = document.getElementById('recipesList');
    if (sk) sk.classList.add('hidden');
    if (list) list.classList.remove('hidden');
    return;
  }
  if (view === 'explore') {
    var sk = document.getElementById('exploreSkeleton');
    var real = document.getElementById('exploreRealContent');
    if (sk) sk.classList.add('hidden');
    if (real) real.classList.remove('hidden');
    return;
  }
  var sk = document.getElementById(view + 'Skeleton');
  var content = document.getElementById(view + 'Posts');
  if (sk) sk.classList.add('hidden');
  if (content) content.classList.remove('hidden');
}

var loadedViews = {};
function simulateLoading(view, callback, delay) {
  if (loadedViews[view]) { callback(); return; }   // já carregou antes: mostra na hora, sem skeleton
  loadedViews[view] = true;
  delay = delay || 450;
  showSkeleton(view);
  state.isLoading[view] = true;
  setTimeout(function() {
    callback();
    hideSkeleton(view);
    state.isLoading[view] = false;
  }, delay);
}

// ===== SWIPE TO DELETE LOGIC =====
var swipeState = {
  isDragging: false,
  startX: 0,
  currentX: 0,
  trackWidth: 0,
  handleWidth: 48,
  maxDrag: 0,
  threshold: 0.85
};

function openSwipeModal(postId) {
  state.deleteTargetId = postId;
  var post = state.posts.find(function(p) { return p.id === postId; });
  var title = post ? (post.content.substring(0, 50) + '...') : 'este post';
  document.getElementById('swipePostTitle').textContent = 'Voce esta excluindo: "' + title + '". Esta acao nao pode ser desfeita.';
  document.getElementById('swipeOverlay').classList.add('active');
  resetSwipe();
}

function closeSwipeModal() {
  document.getElementById('swipeOverlay').classList.remove('active');
  state.deleteTargetId = null;
  resetSwipe();
}

function resetSwipe() {
  swipeState.isDragging = false;
  var handle = document.getElementById('swipeHandle');
  var progress = document.getElementById('swipeProgress');
  var label = document.getElementById('swipeLabel');
  var success = document.getElementById('swipeSuccess');
  handle.style.left = '4px';
  handle.style.transform = 'translateY(-50%)';
  handle.classList.remove('completed');
  progress.style.width = '0%';
  progress.classList.remove('complete');
  label.classList.remove('hidden');
  success.classList.remove('active');
}

function initSwipeEvents() {
  var track = document.getElementById('swipeTrack');
  var handle = document.getElementById('swipeHandle');

  function onStart(e) {
    swipeState.isDragging = true;
    swipeState.trackWidth = track.offsetWidth;
    swipeState.maxDrag = swipeState.trackWidth - swipeState.handleWidth - 8;
    var clientX = e.touches ? e.touches[0].clientX : e.clientX;
    swipeState.startX = clientX;
    handle.style.transition = 'none';
    document.getElementById('swipeProgress').style.transition = 'none';
  }

  function onMove(e) {
    if (!swipeState.isDragging) return;
    e.preventDefault();
    var clientX = e.touches ? e.touches[0].clientX : e.clientX;
    var delta = clientX - swipeState.startX;
    if (delta < 0) delta = 0;
    if (delta > swipeState.maxDrag) delta = swipeState.maxDrag;
    swipeState.currentX = delta;
    var pct = (delta / swipeState.maxDrag) * 100;
    handle.style.left = (4 + delta) + 'px';
    document.getElementById('swipeProgress').style.width = pct + '%';

    if (pct > 50) {
      document.getElementById('swipeLabel').classList.add('hidden');
    } else {
      document.getElementById('swipeLabel').classList.remove('hidden');
    }

    if (pct >= swipeState.threshold * 100) {
      handle.classList.add('completed');
    } else {
      handle.classList.remove('completed');
    }
  }

  function onEnd(e) {
    if (!swipeState.isDragging) return;
    swipeState.isDragging = false;
    var pct = (swipeState.currentX / swipeState.maxDrag) * 100;

    if (pct >= swipeState.threshold * 100) {
      // Confirmed!
      handle.style.transition = 'left 0.2s ease';
      document.getElementById('swipeProgress').style.transition = 'width 0.2s ease';
      handle.style.left = (swipeState.maxDrag + 4) + 'px';
      document.getElementById('swipeProgress').style.width = '100%';
      document.getElementById('swipeProgress').classList.add('complete');
      document.getElementById('swipeSuccess').classList.add('active');

      setTimeout(function() {
        confirmDelete();
      }, 400);
    } else {
      // Reset
      handle.style.transition = 'left 0.3s ease';
      document.getElementById('swipeProgress').style.transition = 'width 0.3s ease';
      resetSwipe();
    }
  }

  handle.addEventListener('touchstart', onStart, { passive: false });
  handle.addEventListener('mousedown', onStart);
  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('mousemove', onMove);
  document.addEventListener('touchend', onEnd);
  document.addEventListener('mouseup', onEnd);
}

function confirmDelete() {
  if (state.deleteTargetId !== null) {
    var idx = state.posts.findIndex(function(p) { return p.id === state.deleteTargetId; });
    if (idx > -1) {
      var removed = state.posts.splice(idx, 1)[0];
      var delTimer = null;
      if (sb && cloud.user && removed.user_id) {
        pendingDel++;
        delTimer = setTimeout(function() {
          sb.from('posts').delete().eq('id', removed.id).then(function(r) { pendingDel--; if (r.error) toast('Não foi possível excluir.'); loadPostsCloud(); });
        }, 5200);
      }
      saveState();
      toast('Post excluído', 'Desfazer', function() {
        if (delTimer) { clearTimeout(delTimer); pendingDel--; }
        state.posts.splice(idx, 0, removed); saveState(); renderFeed(); renderProfile();
      });
      renderFeed();
      renderProfile();
    }
    state.deleteTargetId = null;
  }
  closeSwipeModal();
}

// ===== GOOGLE MAPS + OSM =====
async function fetchGooglePlacesVegan() {
  if (!GOOGLE_API_KEY) return null;
  try {
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.types,places.editorialSummary'
      },
      body: JSON.stringify({ textQuery: "restaurante vegano Sao Paulo", languageCode: "pt-BR", maxResultCount: 10 })
    });
    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    if (data.places && data.places.length > 0) {
      return data.places.map(function(p, idx) {
        return {
          id: 100 + idx,
          name: (p.displayName && p.displayName.text) ? p.displayName.text : (p.displayName || 'Restaurante Vegano'),
          type: (p.types && p.types.includes('vegan_restaurant')) ? "100% Vegano" : "Vegan Friendly",
          category: "restaurante", rating: p.rating || 4.5, reviews: p.userRatingCount || 10,
          address: p.formattedAddress || 'Sao Paulo, SP',
          lat: (p.location && p.location.latitude) ? p.location.latitude : -23.5505,
          lng: (p.location && p.location.longitude) ? p.location.longitude : -46.6512,
          icon: "🍽️", badge: (p.types && p.types.includes('vegan_restaurant')) ? "vegan" : "friendly",
          description: (p.editorialSummary && p.editorialSummary.text) ? p.editorialSummary.text : ''
        };
      });
    }
    return null;
  } catch (err) { return null; }
}

async function loadPlacesWithGoogle() {
  if (state.googlePlacesLoaded) return;
  const googlePlaces = await fetchGooglePlacesVegan();
  if (googlePlaces && googlePlaces.length > 0) {
    state.places = googlePlaces.concat(MOCK_PLACES);
    state.googlePlacesLoaded = true;
    toast('Dados reais do Google Maps carregados!');
  } else {
    state.places = [...MOCK_PLACES];
  }
}

// ----- Lugares reais: o endereço vira coordenada via OpenStreetMap (Nominatim), com cache -----
function ratingLine(p) { return p.reviews ? '⭐ ' + p.rating + ' • ' + p.reviews + ' avaliações' : '⭐ Seja o primeiro a avaliar'; }
function mapsQuery(p) { return p.query ? encodeURIComponent(p.address) : (p.lat + ',' + p.lng); }
function geocodePlace(p) {
  if (p.lat != null) return Promise.resolve();
  var cache = {};
  try { cache = JSON.parse(localStorage.getItem('elograin_geo') || '{}'); } catch (e) {}
  if (cache[p.id]) { p.lat = cache[p.id][0]; p.lng = cache[p.id][1]; return Promise.resolve(); }
  var queries = p.query.slice();
  function next() {
    if (!queries.length) return Promise.resolve();
    return fetch('https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=br&q=' + encodeURIComponent(queries.shift()))
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (d && d[0]) {
          p.lat = parseFloat(d[0].lat); p.lng = parseFloat(d[0].lon);
          cache[p.id] = [p.lat, p.lng];
          try { localStorage.setItem('elograin_geo', JSON.stringify(cache)); } catch (e) {}
        } else return next();
      })
      .catch(function() {});
  }
  return next();
}

function initOSMMap() {
  if (state.osmMap) { state.osmMap.invalidateSize(); return; }
  var mapContainer = document.createElement('div');
  mapContainer.id = 'osmMap';
  mapContainer.style.cssText = 'width:100%;height:100%;border-radius:16px;';
  var wrapper = document.createElement('div');
  wrapper.className = 'map-container-osm';
  wrapper.appendChild(mapContainer);
  var realContent = document.getElementById('exploreRealContent');
  if (!realContent) return;
  realContent.insertBefore(wrapper, realContent.firstChild);
  state.osmMap = L.map('osmMap', { zoomControl: false, attributionControl: false }).setView([-23.5505, -46.6512], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: 'OpenStreetMap' }).addTo(state.osmMap);
  addMarkersToMap();
}

function addMarkersToMap() {
  if (!state.osmMap) return;
  Promise.all(state.places.map(geocodePlace)).then(drawMarkers);
}

function drawMarkers() {
  if (!state.osmMap) return;
  state.osmMarkers.forEach(function(m) { state.osmMap.removeLayer(m); });
  state.osmMarkers = [];
  state.places.forEach(function(place) {
    if (place.lat == null) return;   // endereço não encontrado: continua na lista, sem pino
    var color = place.badge === 'vegan' ? '#9AA06A' : '#D99A58';
    var marker = L.circleMarker([place.lat, place.lng], {
      radius: place.real ? 13 : 10, fillColor: color, color: '#fff', weight: place.real ? 3 : 2, opacity: 1, fillOpacity: 0.9
    }).addTo(state.osmMap);
    var popupContent = '<div style="font-family:Inter,sans-serif;min-width:180px">' +
      '<div style="font-weight:800;font-size:1rem;margin-bottom:4px">' + place.icon + ' ' + place.name + '</div>' +
      '<div style="font-size:0.8rem;color:#666;margin-bottom:4px">' + place.type + '</div>' +
      '<div style="font-size:0.8rem;margin-bottom:4px">' + ratingLine(place) + '</div>' + (place.hours ? '<div style="font-size:0.8rem;margin-bottom:4px">🕒 ' + place.hours + '</div>' : '') +
      '<div style="font-size:0.75rem;color:#888">📍 ' + place.address + '</div>' +
      (place.description ? '<div style="font-size:0.75rem;color:#666;margin-top:6px;font-style:italic">' + place.description + '</div>' : '') +
      '</div>';
    marker.bindPopup(popupContent);
    marker.on('click', function() { showPlaceDetail(place.id); });
    state.osmMarkers.push(marker);
  });
  if (state.osmMarkers.length > 0) {
    var group = new L.featureGroup(state.osmMarkers);
    state.osmMap.fitBounds(group.getBounds().pad(0.1));
  }
}

// ===== NAVIGATION =====
function showView(viewName) {
  state.currentView = viewName;
  document.querySelectorAll('.view').forEach(function(v) { v.classList.remove('active'); });
  document.getElementById(viewName + 'View').classList.add('active');
  document.querySelectorAll('.nav-item, .side-item').forEach(function(n) { n.classList.remove('active'); });
  document.querySelectorAll('.nav-item[data-view="' + viewName + '"], .side-item[data-view="' + viewName + '"]').forEach(function(n) { n.classList.add('active'); });
  window.scrollTo(0, 0);
  renderCurrentView();
}

function renderCurrentView() {
  if (state.currentView === 'home') renderHome();
  if (state.currentView === 'feed') simulateLoading('feed', function() { renderFeed(); });
  if (state.currentView === 'recipes') simulateLoading('recipes', function() { renderRecipes(); });
  if (state.currentView === 'explore') simulateLoading('explore', function() { renderExplore(); });
  if (state.currentView === 'consume') renderConsume();
  if (state.currentView === 'connect') renderConnect();
  if (state.currentView === 'profile') renderProfile();
}

// ===== FEED =====
function renderFeed(filterTag) {
  filterTag = filterTag || activeFeedTag();   // a busca respeita o filtro ativo
  var fc = document.getElementById('feedComposer'); if (fc) fc.innerHTML = composerBarHTML();
  var container = document.getElementById('feedPosts');
  var searchEl = document.getElementById('feedSearch');
  var search = searchEl ? searchEl.value.toLowerCase() : '';
  var posts = state.posts;
  if (filterTag !== 'todos') posts = posts.filter(function(p) { return p.tag === filterTag; });
  if (search) posts = posts.filter(function(p) { return p.content.toLowerCase().includes(search) || p.author.toLowerCase().includes(search); });

  container.innerHTML = posts.map(function(post) {
    var badgeClass = post.tag === 'dica' ? 'vegan' : (post.tag === 'experiencia' ? 'friendly' : 'econ');
    var menu = '<button role="menuitem" onclick="closePostMenus();toast(\'Post salvo! 🔖\')">🔖 Salvar post</button><button role="menuitem" onclick="copyPost(' + post.id + ')">📋 Copiar texto</button><button role="menuitem" class="danger" onclick="closePostMenus();toast(\'Obrigado! Vamos analisar o post.\')">🚩 Denunciar</button>';
    var canDel = !(post.user_id && cloud.user && post.user_id !== cloud.user.id);   // só o autor vê a lixeira
    return '<article class="card' + (canDel ? '' : ' nodel') + '" data-id="' + post.id + '">' +
      (canDel ? '<button class="delete-btn" onclick="openSwipeModal(' + post.id + ')" aria-label="Excluir post">Excluir</button>' : '') +
      '<button class="more-btn" onclick="togglePostMenu(' + post.id + ',event)" aria-label="Mais opções" aria-haspopup="menu">⋯</button>' +
      '<div class="post-menu" id="pm-' + post.id + '" role="menu">' + menu + '</div>' +
      '<div class="card-header"><div class="avatar">' + avatarInner(post.avatar, isMyPost(post)) + '</div>' +
      '<div class="card-meta"><div class="name">' + esc(post.author) + '</div>' +
      '<div class="time">' + esc(post.time) + ' • <span class="badge badge-' + badgeClass + '">' + (TAG_LABEL[post.tag] || esc(post.tag)) + '</span></div></div></div>' +
      '<p class="card-text' + (isLong(post.content) ? ' clamp' : '') + '">' + esc(post.content) + '</p>' +
      (isLong(post.content) ? '<button class="more-link" onclick="toggleExpand(this)">Ver mais</button>' : '') +
      '<div class="card-actions">' +
      '<button class="action-btn heart-btn ' + (post.liked ? 'liked' : '') + '" data-post="' + post.id + '" onclick="toggleLike(' + post.id + ')" aria-label="Curtir" aria-pressed="' + !!post.liked + '">' +
      Elo.heartHTML('p' + post.id, post.liked) + '<span class="cnt">' + post.likes + '</span></button>' +
      '<button class="action-btn cmt-btn" data-post="' + post.id + '" onclick="showComments(' + post.id + ')" aria-label="Comentários"><span>💬</span> <span class="cc">' + post.comments + '</span></button>' +
      '<button class="action-btn" onclick="sharePost(' + post.id + ')"><span>🔗</span> Compartilhar</button>' +
      '</div></article>';
  }).join('');
  if (posts.length === 0) container.innerHTML = state.posts.length ? emptyState('Nenhum post encontrado', '🔍') : emptyState('Ainda não há posts. Seja o primeiro a publicar! 🌱', '🌱');
}

// Post longo (ex.: receita colada): mostra só o começo e um botão "Ver mais"
function isLong(t) { return t.length > 280 || t.split('\n').length > 6; }
function toggleExpand(btn) {
  var p = btn.previousElementSibling, open = p.classList.toggle('clamp');
  btn.textContent = open ? 'Ver mais' : 'Ver menos';
}
// Limpa texto colado da internet: caixinhas ▢ viram marcadores e linhas em branco demais são removidas
function cleanPostText(t) {
  return t.replace(/[\u25A2\u25A1\u2610\u2B1C]\s*/g, '• ').replace(/\r\n?/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

function togglePostMenu(id, e) {
  e.stopPropagation();
  var m = document.getElementById('pm-' + id), wasOpen = m.classList.contains('open');
  closePostMenus();
  if (!wasOpen) m.classList.add('open');
}
function closePostMenus() { document.querySelectorAll('.post-menu.open').forEach(function(m) { m.classList.remove('open'); }); }
function findPost(id) { return state.posts.find(function(p) { return p.id === id; }); }
function copyPost(id) {
  var p = findPost(id); closePostMenus();
  if (p && navigator.clipboard) navigator.clipboard.writeText(p.content).then(function() { toast('Texto copiado!'); });
}

function toggleLike(postId) {
  var post = findPost(postId);
  if (post) {
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
    if (sb && cloud.user && post.user_id) {
      var q = post.liked ? sb.from('likes').insert({ post_id: postId }) : sb.from('likes').delete().match({ post_id: postId, user_id: cloud.user.id });
      q.then(function(r) { if (r.error) { post.liked = !post.liked; post.likes += post.liked ? 1 : -1; renderFeed(); toast('Não foi possível curtir. Tente de novo.'); } });
    }
    saveState();
    // Não re-renderiza o feed: só anima o coração clicado (senão a animação seria interrompida)
    var btn = document.querySelector('.heart-btn[data-post="' + postId + '"]');
    if (btn) { btn.classList.toggle('liked', post.liked); btn.setAttribute('aria-pressed', post.liked); btn.querySelector('.cnt').textContent = post.likes; Elo.setHeart(btn, post.liked); }
    else renderFeed();
  }
}

// Toque duplo no texto do post = curtir (como no Instagram/Facebook)
function likeFromTap(id, card) {
  var post = findPost(id);
  if (post && !post.liked) toggleLike(id);
  var h = document.createElement('div');
  h.className = 'big-heart'; h.textContent = '❤️';
  card.appendChild(h); setTimeout(function() { h.remove(); }, 800);
  if (navigator.vibrate) navigator.vibrate(12);
}

function commentsHTML(post) {
  var list = post.commentList || [];
  if (!list.length) return '<p class="cmt-empty">Seja o primeiro a comentar 💬</p>';
  return list.map(function(c) {
    return '<div class="cmt-item"><div class="avatar avatar-sm">' + esc(c.avatar) + '</div><div class="cmt-bubble"><b>' + esc(c.author) + '</b><span>' + esc(c.text) + '</span></div></div>';
  }).join('');
}

function showComments(postId) {
  var post = findPost(postId);
  if (!post) return;
  openDetailModal('💬 Comentários',
    '<div class="card" style="margin-bottom:16px"><div class="card-header"><div class="avatar">' + esc(post.avatar) + '</div>' +
    '<div class="card-meta"><div class="name">' + esc(post.author) + '</div><div class="time">' + esc(post.time) + '</div></div></div>' +
    '<p class="card-text">' + esc(post.content) + '</p></div>' +
    '<div id="cmtList" class="cmt-list">' + commentsHTML(post) + '</div>',
    '<form class="cmt-form" onsubmit="addComment(' + postId + ');return false">' +
    '<input id="cmtInput" type="text" maxlength="300" placeholder="Escreva um comentário..." autocomplete="off" aria-label="Comentário">' +
    '<button class="btn btn-primary" type="submit">Enviar</button></form>');
  setTimeout(function() { var i = document.getElementById('cmtInput'); if (i) i.focus(); }, 150);
}

function addComment(postId) {
  var post = findPost(postId), input = document.getElementById('cmtInput');
  var text = input ? input.value.trim() : '';
  if (!post || !text) return;
  post.commentList = post.commentList || [];
  post.commentList.push({ author: state.user.name, avatar: state.user.avatar, text: text });
  post.comments++;
  saveState();
  if (sb && cloud.user && post.user_id) sb.from('comments').insert({ post_id: postId, content: text }).then(function(r) { if (r.error) toast('Comentário não foi salvo. Tente de novo.'); });
  input.value = '';
  var list = document.getElementById('cmtList');
  list.innerHTML = commentsHTML(post); list.scrollTop = list.scrollHeight;
  var cc = document.querySelector('.cmt-btn[data-post="' + postId + '"] .cc');
  if (cc) cc.textContent = post.comments;
}

function sharePost(postId) {
  var post = findPost(postId); if (!post) return;
  var data = { title: 'Elograin', text: post.author + ': ' + post.content, url: location.origin };
  if (navigator.share) { navigator.share(data).catch(function() {}); return; }
  if (navigator.clipboard) navigator.clipboard.writeText(data.text + ' ' + data.url).then(function() { toast('Link copiado! 🔗'); }, function() { toast('Não foi possível copiar'); });
  else toast('Compartilhar não é suportado neste navegador');
}

// ===== RECIPES =====
function renderRecipes() {
  var container = document.getElementById('recipesList');
  var searchEl = document.getElementById('recipeSearch');
  var search = searchEl ? searchEl.value.toLowerCase() : '';
  var activeTabEl = document.querySelector('#recipeTabs .tab.active');
  var activeTab = activeTabEl ? activeTabEl.dataset.tab : 'todas';
  var recipes = allRecipes();
  if (activeTab !== 'todas') recipes = recipes.filter(function(r) { return r.category === activeTab; });
  if (search) recipes = recipes.filter(function(r) { return r.title.toLowerCase().includes(search) || r.author.toLowerCase().includes(search); });

  container.innerHTML = recipes.map(function(r) {
    return '<article class="recipe-card" onclick="showRecipeDetail(' + r.id + ')">' +
      '<div class="recipe-thumb"><img src="' + photoSrc(recipePhotoName(r)) + '" alt="" loading="lazy"></div>' +
      '<div class="recipe-info"><h3>' + esc(r.title) + '</h3>' +
      '<div class="recipe-meta"><div class="rating"><span class="stars">⭐</span> ' + r.rating + ' (' + r.reviews + ')</div>' +
      '<div style="margin-top:4px">⏱️ ' + esc(r.time) + ' • 👤 ' + esc(r.author) + '</div>' +
      '<div class="tag-list" style="margin-top:6px">' + r.tags.map(function(t) { return '<span class="tag" style="padding:2px 8px;font-size:0.7rem">' + t + '</span>'; }).join('') + '</div></div></div></article>';
  }).join('');
  if (recipes.length === 0) container.innerHTML = emptyState('Nenhuma receita encontrada', '🍽️');
}

function showRecipeDetail(recipeId) {
  var r = allRecipes().find(function(x) { return x.id === recipeId; });
  if (!r) return;
  openDetailModal(r.title,
    '<div class="rd-hero">' + photo(recipePhotoName(r), 'Foto ilustrativa: ' + r.title) + '</div>' +
    '<div style="display:flex;gap:12px;justify-content:center;margin-bottom:16px;flex-wrap:wrap">' +
    '<span class="badge badge-vegan">⭐ ' + r.rating + '</span>' +
    '<span class="badge badge-friendly">⏱️ ' + r.time + '</span>' +
    '<span class="badge badge-econ">📊 ' + esc(r.difficulty) + '</span></div>' +
    '<div style="margin-bottom:16px"><label>Ingredientes</label>' +
    '<ul style="padding-left:20px;color:var(--text-light);font-size:0.9rem;line-height:1.8">' + r.ingredients.map(function(i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul></div>' +
    '<div><label>Modo de Preparo</label>' +
    '<ol style="padding-left:20px;color:var(--text-light);font-size:0.9rem;line-height:1.8">' + r.steps.map(function(s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol></div>' +
    '<div style="margin-top:16px"><label>Sua avaliação</label><div id="rateBox"></div></div>' +
    '<div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border)">' +
    '<div style="font-size:0.85rem;color:var(--text-light)">Por ' + esc(r.author) + '</div></div>',
    '<button class="btn btn-secondary" onclick="toast(\'Salvo nos favoritos!\')">💾 Salvar</button>');
  Elo.mountRating(document.getElementById('rateBox'), { noun: 'Receita', onConfirm: function(score) { rateRecipe(r.id, score); } });
}

function rateRecipe(id, score) {
  // Atualiza a média (o modal continua aberto para a animação terminar). Receita embutida: guarda só a nota, nunca a receita.
  if (!score) return;
  var r = allRecipes().find(function(x) { return x.id === id; });
  if (!r) return;
  var next = { rating: Math.round(((r.rating * r.reviews + score) / (r.reviews + 1)) * 10) / 10, reviews: r.reviews + 1 };
  var mine = (state.myRecipes || []).find(function(x) { return x.id === id; });
  if (mine) Object.assign(mine, next); else state.recipeRatings[id] = next;
  saveState();
}

// ===== EXPLORE =====
function renderExplore() {
  var content = document.getElementById('exploreRealContent');
  if (state.exploreTab === 'mapa') renderMap(content);
  else if (state.exploreTab === 'eventos') renderEvents(content);
  else if (state.exploreTab === 'avaliacoes') renderReviews(content);
}

function renderMap(container) {
  loadPlacesWithGoogle().then(function() {
    var apiBtn = !GOOGLE_API_KEY ? '<button class="section-link" onclick="promptApiKey()">🔑 Configurar API</button>' : '';
    container.innerHTML = '<div class="map-legend">' +
      '<div class="map-legend-item"><div class="legend-dot" style="background:var(--sprout)"></div> 100% Vegano</div>' +
      '<div class="map-legend-item"><div class="legend-dot" style="background:var(--secondary)"></div> Vegan Friendly</div></div>' +
      '<div class="section-header"><h3 class="section-title">Proximos a Voce</h3>' + apiBtn + '</div>' +
      '<div>' + state.places.map(function(p) {
        return '<div class="place-card" onclick="showPlaceDetail(' + p.id + ')">' +
          '<div class="place-img">' + p.icon + '</div>' +
          '<div class="place-info"><h4>' + p.name + '</h4>' +
          '<div class="place-type"><span class="badge badge-' + (p.badge === 'vegan' ? 'vegan' : 'friendly') + '">' + p.type + '</span></div>' +
          '<div class="rating">' + ratingLine(p) + '</div>' + (p.hours ? '<div style="font-size:0.8rem;color:var(--text-light);margin-top:2px">🕒 ' + p.hours + '</div>' : '') +
          '<div style="font-size:0.8rem;color:var(--text-light);margin-top:2px">📍 ' + p.address + '</div>' +
          (p.description ? '<div style="font-size:0.75rem;color:var(--text-light);margin-top:4px;font-style:italic">' + p.description + '</div>' : '') +
          '</div></div>';
      }).join('') + '</div>';
    setTimeout(function() { initOSMMap(); }, 100);
  });
}

function promptApiKey() {
  var key = prompt('Insira sua Google Places API Key (New):\n\n1. Acesse console.cloud.google.com\n2. Crie um projeto e ative "Places API (New)"\n3. Gere uma API Key\n4. Cole aqui:');
  if (key) { localStorage.setItem('elograin_google_api_key', key); location.reload(); }
}

function showPlaceDetail(placeId) {
  var p = state.places.find(function(x) { return x.id === placeId; });
  if (!p) return;
  var descBlock = p.description ? '<div style="background:var(--cream);padding:12px;border-radius:12px;margin-bottom:16px;font-size:0.9rem;color:var(--text-light);font-style:italic">' + p.description + '</div>' : '';
  openDetailModal(p.name,
    '<div style="text-align:center;font-size:4rem;margin-bottom:12px">' + p.icon + '</div>' +
    '<div style="text-align:center;margin-bottom:16px"><span class="badge badge-' + (p.badge === 'vegan' ? 'vegan' : 'friendly') + '">' + p.type + '</span></div>' +
    '<div class="rating" style="justify-content:center;margin-bottom:12px;font-size:1.1rem">' + ratingLine(p) + '</div>' + (p.hours ? '<div style="text-align:center;margin-bottom:8px;font-size:0.9rem">🕒 ' + p.hours + '</div>' : '') +
    '<div style="text-align:center;color:var(--text-light);margin-bottom:16px">📍 ' + p.address + '</div>' + descBlock +
    '<div style="display:flex;gap:8px;justify-content:center;margin-bottom:16px;flex-wrap:wrap">' +
    '<span class="tag">🍽️ Restaurante</span><span class="tag">♿ Acessivel</span><span class="tag">💳 Cartao</span></div>' +
    '<div style="background:var(--cream);padding:12px;border-radius:12px">' +
    '<div style="font-size:0.8rem;font-weight:700;margin-bottom:4px">📍 Coordenadas</div>' +
    '<div style="font-size:0.8rem;color:var(--text-light);font-family:monospace">Lat: ' + (p.lat != null ? p.lat.toFixed(6) : '—') + ' | Lng: ' + (p.lng != null ? p.lng.toFixed(6) : '—') + '</div></div>',
    '<button class="btn btn-primary" onclick="openReviewModal(\'' + p.name.replace(/'/g, "\\'") + '\')">⭐ Avaliar</button>' +
    '<button class="btn btn-secondary" onclick="window.open(\'https://www.google.com/maps/search/?api=1&query=' + mapsQuery(p) + '\', \'_blank\')">🗺️ Abrir no Maps</button>');
}

function renderEvents(container) {
  container.innerHTML = '<div class="section-header"><h3 class="section-title">Eventos Proximos</h3></div>' +
    state.events.map(function(e) {
      return '<div class="card" style="cursor:pointer" onclick="showEventDetail(' + e.id + ')">' +
        '<div class="card-header"><div class="avatar" style="font-size:1.8rem">' + e.icon + '</div>' +
        '<div class="card-meta"><div class="name">' + e.title + '</div><div class="time">' + e.date + ' • ' + e.location + '</div></div></div>' +
        '<div style="display:flex;gap:8px;margin-top:8px"><span class="badge badge-econ">' + e.type + '</span>' +
        '<span class="badge badge-vegan">👥 ' + e.attendees + ' confirmados</span></div></div>';
    }).join('');
}

function showEventDetail(eventId) {
  var e = state.events.find(function(x) { return x.id === eventId; });
  if (!e) return;
  openDetailModal(e.title,
    '<div style="text-align:center;font-size:4rem;margin-bottom:12px">' + e.icon + '</div>' +
    '<div style="text-align:center;margin-bottom:16px"><span class="badge badge-econ">' + e.type + '</span></div>' +
    '<div style="margin-bottom:12px"><strong>📅 Data:</strong> ' + e.date + '</div>' +
    '<div style="margin-bottom:12px"><strong>📍 Local:</strong> ' + e.location + '</div>' +
    '<div style="margin-bottom:12px"><strong>👥 Confirmados:</strong> ' + e.attendees + ' pessoas</div>' +
    '<div style="padding:12px;background:var(--cream);border-radius:12px;margin-top:12px">' +
    '<div style="font-size:0.85rem;color:var(--text-light)">Vai participar? Confirme sua presenca!</div></div>',
    '<button class="btn btn-primary" onclick="toast(\'Presenca confirmada! 🎉\')">✅ Confirmar</button>' +
    '<button class="btn btn-secondary" onclick="toast(\'Evento salvo!\')">💾 Salvar</button>');
}

function renderReviews(container) {
  var allReviews = state.reviews.concat(state.myReviews);
  container.innerHTML = '<div class="section-header"><h3 class="section-title">Avaliacoes Recentes</h3></div>' +
    allReviews.map(function(r) {
      return '<div class="card"><div class="card-header"><div class="avatar">' + r.avatar + '</div>' +
        '<div class="card-meta"><div class="name">' + r.author + '</div><div class="time">' + r.place + ' • ' + (r.date || 'Agora') + '</div></div></div>' +
        '<div class="rating" style="margin-bottom:8px">' + '⭐'.repeat(r.rating) + '</div>' +
        '<p class="card-text">' + r.text + '</p>' +
        '<div class="card-actions"><button class="action-btn" onclick="toast(\'Util marcado!\')">👍 Util (' + (r.likes || 0) + ')</button></div></div>';
    }).join('');
}

// ===== CONSUME =====
function renderConsume() {
  var content = document.getElementById('consumeContent');
  if (state.consumeTab === 'mercado') renderMarket(content);
  else renderBeauty(content);
}

function renderMarket(container) {
  container.innerHTML = '<div class="search-bar"><span class="search-icon">🔍</span>' +
    '<input type="text" placeholder="Buscar produtos no mercado..." oninput="filterProducts(this.value, \'market\')"></div>' +
    '<div id="marketList">' + state.productsMarket.map(function(p) { return productCard(p); }).join('') + '</div>';
}

function renderBeauty(container) {
  container.innerHTML = '<div class="search-bar"><span class="search-icon">🔍</span>' +
    '<input type="text" placeholder="Buscar produtos de beleza..." oninput="filterProducts(this.value, \'beauty\')"></div>' +
    '<div id="beautyList">' + state.productsBeauty.map(function(p) { return productCard(p, true); }).join('') + '</div>';
}

function productCard(p, isBeauty) {
  isBeauty = isBeauty || false;
  var cf = isBeauty ? '<span class="badge badge-friendly">🐰 Cruelty Free</span>' : '';
  return '<div class="product-card"><div class="product-img">' + p.icon + '</div>' +
    '<div style="flex:1;min-width:0"><div style="font-weight:700;font-size:0.95rem;margin-bottom:2px">' + p.name + '</div>' +
    '<div style="font-size:0.8rem;color:var(--text-light);margin-bottom:4px">' + p.brand + ' • ' + p.category + '</div>' +
    '<div style="display:flex;gap:6px;flex-wrap:wrap"><span class="badge badge-vegan">🌿 Vegano</span>' + cf + '</div>' +
    '<div style="font-size:0.8rem;color:var(--text-light);margin-top:6px">🏪 ' + p.stores.slice(0, 2).join(', ') + (p.stores.length > 2 ? '...' : '') + '</div></div>' +
    '<div style="font-weight:800;color:var(--primary);font-size:1rem;white-space:nowrap">' + p.price + '</div></div>';
}

function filterProducts(query, type) {
  query = query.toLowerCase();
  var list = type === 'market' ? state.productsMarket : state.productsBeauty;
  var filtered = list.filter(function(p) { return p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query); });
  var container = document.getElementById(type === 'market' ? 'marketList' : 'beautyList');
  container.innerHTML = filtered.map(function(p) { return productCard(p, type === 'beauty'); }).join('');
  if (filtered.length === 0) container.innerHTML = emptyState('Nenhum produto encontrado', '🔍');
}

// ===== CONNECT =====

// ===== PROFILE =====
function renderProfile() {
  updateHeaderAvatar();
  var u = state.user;
  document.getElementById('profileName').textContent = u.name;
  document.getElementById('profileAvatar').innerHTML = avatarInner(u.avatar, true);
  document.getElementById('profileBio').textContent = u.bio || DEFAULT_BIO;
  renderProfileMeta(u);
  var pe = document.getElementById('profileEmail'); if (pe) pe.textContent = state.user.email || '';
  document.getElementById('statPosts').textContent = state.posts.filter(function(p) { return p.author === state.user.name; }).length;
  document.getElementById('statRecipes').textContent = state.myRecipes.length;
  document.getElementById('statLikes').textContent = state.posts.reduce(function(a, p) { return a + (p.author === state.user.name ? p.likes : 0); }, 0);

  var myRecipesContainer = document.getElementById('myRecipes');
  if (state.myRecipes.length === 0) {
    myRecipesContainer.innerHTML = emptyState('Voce ainda nao criou receitas', '🍽️');
  } else {
    myRecipesContainer.innerHTML = state.myRecipes.map(function(r) {
      return '<div class="recipe-card" onclick="showRecipeDetail(' + r.id + ')"><div class="recipe-thumb"><img src="' + photoSrc(recipePhotoName(r)) + '" alt="" loading="lazy"></div>' +
        '<div class="recipe-info"><h3>' + esc(r.title) + '</h3><div class="recipe-meta">⭐ ' + r.rating + ' • ⏱️ ' + esc(r.time) + '</div></div></div>';
    }).join('');
  }

  var myReviewsContainer = document.getElementById('myReviews');
  if (state.myReviews.length === 0) {
    myReviewsContainer.innerHTML = emptyState('Voce ainda nao fez avaliacoes', '⭐');
  } else {
    myReviewsContainer.innerHTML = state.myReviews.map(function(r) {
      return '<div class="card"><div style="font-weight:700;margin-bottom:4px">' + r.place + '</div>' +
        '<div class="rating" style="margin-bottom:6px">' + '⭐'.repeat(r.rating) + '</div>' +
        '<p style="font-size:0.85rem;color:var(--text-light)">' + r.text + '</p></div>';
    }).join('');
  }
}

// ===== MODALS =====
function openDetailModal(title, body, footer) {
  footer = footer || '';
  document.getElementById('detailTitle').textContent = title;
  document.getElementById('detailBody').innerHTML = body;
  document.getElementById('detailFooter').innerHTML = footer;
  document.getElementById('detailModal').classList.add('active');
}

function closeDetailModal() {
  document.getElementById('detailModal').classList.remove('active');
}

function openCreateModal() {
  document.getElementById('createModal').classList.add('active');
  renderCreateForm();
}

function closeCreateModal() {
  document.getElementById('createModal').classList.remove('active');
}



function submitReview() {
  var place = document.getElementById('reviewPlace').value.trim();
  var rating = parseInt(document.getElementById('reviewRating').value);
  var text = document.getElementById('reviewText').value.trim();
  if (!place || !text) { toast('Preencha todos os campos!'); return; }
  var newReview = { id: Date.now(), place: place, author: state.user.name, avatar: state.user.avatar, rating: rating, text: text, date: 'Agora', likes: 0 };
  state.myReviews.unshift(newReview);
  saveState();
  closeCreateModal();
  toast('Avaliacao publicada! ⭐');
  if (state.currentView === 'explore') renderExplore();
  if (state.currentView === 'profile') renderProfile();
}

function openReviewModal(placeName) {
  closeDetailModal();
  state.createType = 'review';
  openCreateModal();
  setTimeout(function() {
    var input = document.getElementById('reviewPlace');
    if (input) input.value = placeName;
  }, 100);
}

function emptyState(text, icon) {
  return '<div class="empty-state"><div class="empty-icon">' + icon + '</div><h3>' + text + '</h3><p style="font-size:0.85rem">Nada por aqui ainda. Seja o primeiro!</p></div>';
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', function() {
  loadState();
  initAuth();

  document.querySelectorAll('.nav-item, .side-item').forEach(function(btn) {
    btn.addEventListener('click', function() { showView(btn.dataset.view); });
  });

  document.getElementById('fabBtn').addEventListener('click', openCreateMenu);

  document.getElementById('closeCreateModal').addEventListener('click', closeCreateModal);
  document.getElementById('closeDetailModal').addEventListener('click', closeDetailModal);
  document.getElementById('createModal').addEventListener('click', function(e) {
    if (e.target === document.getElementById('createModal')) closeCreateModal();
  });
  document.getElementById('detailModal').addEventListener('click', function(e) {
    if (e.target === document.getElementById('detailModal')) closeDetailModal();
  });

  document.querySelectorAll('#createTabs .tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('#createTabs .tab').forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      state.createType = tab.dataset.create;
      renderCreateForm();
    });
  });

  document.querySelectorAll('#exploreTabs .tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('#exploreTabs .tab').forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      state.exploreTab = tab.dataset.tab;
      renderExplore();
    });
  });

  document.querySelectorAll('#consumeTabs .tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('#consumeTabs .tab').forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      state.consumeTab = tab.dataset.tab;
      renderConsume();
    });
  });

  document.querySelectorAll('#connectTabs .tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('#connectTabs .tab').forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      state.connectTab = tab.dataset.tab;
      renderConnect();
    });
  });

  document.querySelectorAll('#feedTags .tag').forEach(function(tag) {
    tag.addEventListener('click', function() {
      document.querySelectorAll('#feedTags .tag').forEach(function(t) { t.classList.remove('active'); });
      tag.classList.add('active');
      renderFeed(tag.dataset.tag);
    });
  });

  document.querySelectorAll('#recipeTabs .tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('#recipeTabs .tab').forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      renderRecipes();
    });
  });

  var feedSearch = document.getElementById('feedSearch');
  var feedTimer;
  if (feedSearch) feedSearch.addEventListener('input', function() { clearTimeout(feedTimer); feedTimer = setTimeout(function() { renderFeed(); }, 150); });
  document.addEventListener('click', closePostMenus);
  setInterval(function() { if (!document.hidden && sb && cloud.user) loadPostsCloud(); }, 15000);
  document.addEventListener('visibilitychange', function() { if (!document.hidden && sb && cloud.user) loadPostsCloud(); });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') { closePostMenus(); closeDetailModal(); closeCreateModal(); } });
  var lastTap = { id: 0, t: 0 };
  document.getElementById('feedPosts').addEventListener('pointerup', function(e) {
    var txt = e.target.closest('.card-text'); if (!txt) return;
    var card = txt.closest('.card'), id = +card.dataset.id, now = Date.now();
    if (lastTap.id === id && now - lastTap.t < 320) { likeFromTap(id, card); lastTap = { id: 0, t: 0 }; }
    else lastTap = { id: id, t: now };
  });

  var recipeSearch = document.getElementById('recipeSearch');
  if (recipeSearch) recipeSearch.addEventListener('input', function() { renderRecipes(); });

  var themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', function() {
    state.darkMode = !state.darkMode;
    if (state.darkMode) document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
    themeToggle.textContent = state.darkMode ? '☀️' : '🌙';
    saveState();
  });
  themeToggle.textContent = state.darkMode ? '☀️' : '🌙';

  document.getElementById('notifBtn').addEventListener('click', openNotifs);   // sem número inventado: mostra o estado real

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function() {});
  }

  initSwipeEvents();
  updateHeaderAvatar();
  showView('home');
});

// ===== LOGIN / CADASTRO =====
// Contas ficam neste aparelho (localStorage). A senha NUNCA é guardada: só um hash PBKDF2 com sal aleatório.
// Para contas na nuvem (entrar de qualquer celular) é preciso um servidor, ex.: Supabase Auth.
var AVATARS = ['🌱', '🦁', '🦋', '🐻', '🌸', '🌵', '🥑', '🐝'];
var auth = { mode: 'login', avatar: '🌱', fails: 0, lockUntil: 0 };

function getAccounts() { try { return JSON.parse(localStorage.getItem('elograin_accounts') || '{}'); } catch (e) { return {}; } }
function setAccounts(a) { localStorage.setItem('elograin_accounts', JSON.stringify(a)); }
function toB64(buf) { return btoa(String.fromCharCode.apply(null, new Uint8Array(buf))); }
function hashPw(pw, saltB64) {
  var salt = Uint8Array.from(atob(saltB64), function(c) { return c.charCodeAt(0); });
  return crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveBits'])
    .then(function(k) { return crypto.subtle.deriveBits({ name: 'PBKDF2', salt: salt, iterations: 150000, hash: 'SHA-256' }, k, 256); })
    .then(toB64);
}

function authMode(mode) {
  auth.mode = mode;
  var signup = mode === 'signup', rec = mode === 'recovery';
  document.getElementById('tabLogin').classList.toggle('on', mode === 'login');
  document.getElementById('tabSignup').classList.toggle('on', signup);
  document.querySelector('.auth-tabs').style.display = rec ? 'none' : '';
  document.getElementById('fEmail').style.display = rec ? 'none' : '';
  document.getElementById('fName').hidden = !signup;
  document.getElementById('fAvatar').hidden = !signup;
  document.getElementById('pwHint').hidden = !(signup || rec);
  document.getElementById('forgotLink').style.display = (mode === 'login' && sb) ? '' : 'none';
  document.getElementById('pwLabel').textContent = rec ? 'Nova senha' : 'Senha';
  document.getElementById('authBtn').textContent = rec ? 'Salvar nova senha' : (signup ? 'Criar conta' : 'Entrar');
  document.getElementById('aPass').autocomplete = (signup || rec) ? 'new-password' : 'current-password';
  authError('');
}
function authError(msg, ok) {
  var el = document.getElementById('authErr');
  el.textContent = msg; el.classList.toggle('ok', !!ok);
}
function togglePw() {
  var i = document.getElementById('aPass'), show = i.type === 'password';
  i.type = show ? 'text' : 'password';
  document.getElementById('pwToggle').textContent = show ? '🙈' : '👁️';
  document.getElementById('pwToggle').setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
}
function pickAvatar(a) {
  auth.avatar = a;
  document.querySelectorAll('#avPick button').forEach(function(b) { b.classList.toggle('on', b.textContent === a); });
}

function submitAuth(e) {
  e.preventDefault();
  if (auth.mode === 'recovery') { submitRecovery(); return; }
  if (!window.crypto || !crypto.subtle) { authError('Este navegador não suporta login seguro. Abra o app em https.'); return; }
  var wait = Math.ceil((auth.lockUntil - Date.now()) / 1000);
  if (wait > 0) { authError('Muitas tentativas. Aguarde ' + wait + 's.'); return; }
  var email = document.getElementById('aEmail').value.trim().toLowerCase();
  var pass = document.getElementById('aPass').value;
  var name = document.getElementById('aName').value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { authError('Digite um e-mail válido.'); return; }
  if (!pass) { authError('Digite sua senha.'); return; }
  if (sb) { cloudAuth(email, pass, name); return; }
  var accounts = getAccounts(), btn = document.getElementById('authBtn');
  btn.disabled = true;

  if (auth.mode === 'signup') {
    if (name.length < 2) { authError('Digite seu nome (mínimo 2 letras).'); btn.disabled = false; return; }
    if (pass.length < 8) { authError('A senha precisa ter no mínimo 8 caracteres.'); btn.disabled = false; return; }
    if (accounts[email]) { authError('Este e-mail já tem conta. Toque em "Entrar".'); btn.disabled = false; return; }
    var salt = toB64(crypto.getRandomValues(new Uint8Array(16)));
    hashPw(pass, salt).then(function(h) {
      accounts[email] = { name: name, avatar: auth.avatar, salt: salt, hash: h, created: Date.now() };
      setAccounts(accounts); startSession(email, true);
    }).catch(function() { authError('Não foi possível criar a conta.'); }).then(function() { btn.disabled = false; });
  } else {
    var acc = accounts[email];
    // mesmo tempo de resposta e mesma mensagem para e-mail inexistente ou senha errada
    hashPw(pass, acc ? acc.salt : toB64(new Uint8Array(16))).then(function(h) {
      if (acc && h === acc.hash) { auth.fails = 0; startSession(email, false); }
      else {
        auth.fails++;
        if (auth.fails >= 5) { auth.lockUntil = Date.now() + 30000; auth.fails = 0; authError('Muitas tentativas. Aguarde 30s.'); }
        else authError('E-mail ou senha incorretos.');
      }
    }).catch(function() { authError('Não foi possível entrar.'); }).then(function() { btn.disabled = false; });
  }
}

function startSession(email, isNew) {
  var acc = getAccounts()[email];
  if (!acc) return;
  localStorage.setItem('elograin_session', email);
  state.user = Object.assign(userDefaults(), { name: acc.name, avatar: acc.avatar, email: email }, loadExtras(email));
  saveState();
  document.getElementById('authScreen').hidden = true;
  document.getElementById('authForm').reset();
  authError('');
  showView('home'); renderProfile();
  toast(isNew ? 'Bem-vindo(a) ao Elograin, ' + acc.name + '! 🌿' : 'Que bom te ver, ' + acc.name + '! 👋');
}

function logout() {
  if (sb) { sb.auth.signOut(); cloud.user = null; state.posts = []; saveState(); }
  localStorage.removeItem('elograin_session');
  closeChat(); syncChatFab();
  closePostMenus();
  authMode('login');
  document.getElementById('authScreen').hidden = false;
}

function initAuth() {
  var pick = document.getElementById('avPick');
  pick.innerHTML = AVATARS.map(function(a) { return '<button type="button" onclick="pickAvatar(\'' + a + '\')" aria-label="Avatar ' + a + '">' + a + '</button>'; }).join('');
  pickAvatar(auth.avatar);
  if (sb) {
    document.getElementById('authScreen').hidden = false;
    sb.auth.getSession().then(function(r) {
      var ses = r.data && r.data.session;
      if (ses && RECOVERY) authMode('recovery');           // veio do e-mail: pede a nova senha em vez de entrar direto
      else if (ses) startCloudSession(ses.user, null);
    }).catch(function() {});
    sb.auth.onAuthStateChange(function(ev) {
      if (ev === 'PASSWORD_RECOVERY') { document.getElementById('authScreen').hidden = false; authMode('recovery'); }
    });
    return;
  }
  setTimeout(function() { toast('⚠️ Sem conexão com o servidor. Usando modo local.'); }, 800);
  var email = localStorage.getItem('elograin_session');
  var acc = email && getAccounts()[email];
  if (acc) { state.user = Object.assign({}, state.user, { name: acc.name, avatar: acc.avatar, email: email }, loadExtras(email)); document.getElementById('authScreen').hidden = true; }
  else document.getElementById('authScreen').hidden = false;
}

// ===== NUVEM (Supabase): contas, posts, curtidas e comentários compartilhados =====
// A chave "publishable" é pública por natureza. Quem protege os dados são as regras (RLS) criadas no banco.
var SUPABASE_URL = 'https://lkbuejiqkjocmcdqcyxv.supabase.co';
var SUPABASE_KEY = 'sb_publishable_ecUzPh2z2oBWsOQm6HIC8g_nDOFPnqL';
var RECOVERY = /type=recovery/.test(location.hash + location.search);
var sb = (window.supabase && window.supabase.createClient) ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;
var cloud = { user: null };
var pendingDel = 0;   // exclusões aguardando o fim do "Desfazer"
function postsSignature() { return state.posts.map(function(p) { return p.id + ':' + p.likes + ':' + p.comments + ':' + (p.liked ? 1 : 0); }).join('|'); }

function timeAgo(iso) {
  var s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return 'Agora';
  var m = Math.floor(s / 60); if (m < 60) return m + 'min';
  var h = Math.floor(m / 60); if (h < 24) return h + 'h';
  return Math.floor(h / 24) + 'd';
}

function mapPost(r) {
  var pr = r.profiles || {};
  var cms = (r.comments || []).slice().sort(function(a, b) { return new Date(a.created_at) - new Date(b.created_at); });
  return {
    id: r.id, user_id: r.user_id, author: pr.name || 'Membro', avatar: pr.avatar || '🌱',
    time: timeAgo(r.created_at), content: r.content, tag: r.tag,
    likes: (r.likes || []).length,
    liked: !!cloud.user && (r.likes || []).some(function(l) { return l.user_id === cloud.user.id; }),
    comments: cms.length,
    commentList: cms.map(function(c) { var p = c.profiles || {}; return { author: p.name || 'Membro', avatar: p.avatar || '🌱', text: c.content }; }),
    image: null
  };
}

function loadPostsCloud() {
  if (!sb || !cloud.user || pendingDel > 0) return Promise.resolve();
  return sb.from('posts')
    .select('id,user_id,tag,content,created_at,profiles!posts_user_id_fkey(name,avatar),likes(user_id),comments(id,content,created_at,profiles!comments_user_id_fkey(name,avatar))')
    .order('created_at', { ascending: false }).limit(60)
    .then(function(r) {
      if (r.error) { toast('Não foi possível carregar o feed. Puxe para atualizar.'); return; }
      var before = postsSignature();
      state.posts = r.data.map(mapPost);
      saveState();
      if (postsSignature() !== before) { renderFeed(); renderProfile(); }   // só redesenha se algo mudou (não interrompe a animação do coração)
    });
}

function publishError(e) {
  var m = ((e && e.message) || '').toLowerCase();
  if (m.indexOf('check constraint') > -1 || m.indexOf('posts_content_check') > -1) return 'O banco ainda limita o post a 500 caracteres. Rode o SQL de atualização no Supabase.';
  if (m.indexOf('foreign key') > -1) return 'Seu perfil não foi encontrado. Saia da conta e crie uma nova.';
  if (m.indexOf('jwt') > -1 || m.indexOf('row-level') > -1 || m.indexOf('permission') > -1) return 'Sua sessão expirou. Saia e entre de novo.';
  return 'Não foi possível publicar: ' + ((e && e.message) || 'tente de novo.');
}

function authMsg(err) {
  console.error('Erro de autenticação:', err);
  var m = ((err && err.message) || '').toLowerCase();
  if (m.indexOf('invalid login') > -1) return 'E-mail ou senha incorretos.';
  if (m.indexOf('already registered') > -1) return 'Este e-mail já tem conta. Toque em "Entrar".';
  if (m.indexOf('not confirmed') > -1) return 'Confirme seu e-mail antes de entrar.';
  if (m.indexOf('rate limit') > -1 || m.indexOf('too many') > -1) return 'Muitas tentativas. Aguarde um pouco.';
  if (m.indexOf('same password') > -1 || m.indexOf('different from the old') > -1) return 'Escolha uma senha diferente da anterior.';
  if (m.indexOf('password') > -1) return 'Senha fraca. Use no mínimo 8 caracteres.';
  if (m.indexOf('fetch') > -1 || m.indexOf('network') > -1 || m.indexOf('load failed') > -1 || (err && err.status === 0)) return 'Sem conexão com o servidor. Confira a internet. Se continuar, o projeto do Supabase pode estar pausado.';
  if (m.indexOf('expired') > -1 || m.indexOf('token') > -1) return 'Link expirado ou inválido. Peça um novo em "Esqueci minha senha".';
  return 'Não foi possível concluir' + (m ? ' (' + m.slice(0, 80) + ')' : '') + '. Tente de novo.';
}

function cloudAuth(email, pass, name) {
  var btn = document.getElementById('authBtn'), signup = auth.mode === 'signup', p;
  if (signup) {
    if (name.length < 2) { authError('Digite seu nome (mínimo 2 letras).'); return; }
    if (pass.length < 8) { authError('A senha precisa ter no mínimo 8 caracteres.'); return; }
  }
  btn.disabled = true;
  if (signup) {
    p = sb.auth.signUp({ email: email, password: pass, options: { data: { name: name, avatar: auth.avatar } } }).then(function(r) {
      if (r.error) throw r.error;
      if (!r.data.session) { authMode('login'); toast('Conta criada! Confirme seu e-mail para entrar. 📧'); return null; }
      return r.data.user;
    });
  } else {
    p = sb.auth.signInWithPassword({ email: email, password: pass }).then(function(r) { if (r.error) throw r.error; return r.data.user; });
  }
  p.then(function(user) { if (user) return startCloudSession(user, signup); })
   .catch(function(err) { authError(authMsg(err)); })
   .then(function() { btn.disabled = false; });
}

function startCloudSession(user, isNew) {
  cloud.user = user;
  return sb.from('profiles').select('name,avatar').eq('id', user.id).maybeSingle().then(function(r) {
    var meta = user.user_metadata || {}, pr = r.data || { name: meta.name || 'Membro', avatar: meta.avatar || '🌱' };
    state.user = Object.assign(userDefaults(), { name: pr.name, avatar: pr.avatar, email: user.email }, loadExtras(user.email, meta));
    state.posts = [];
    saveState();
    document.getElementById('authScreen').hidden = true;
    document.getElementById('authForm').reset();
    authError('');
    showView('home'); renderProfile(); syncChatFab();
    if (isNew === true) toast('Bem-vindo(a) ao Elograin, ' + pr.name + '! 🌿');
    else if (isNew === false) toast('Que bom te ver, ' + pr.name + '! 👋');
    return loadPostsCloud();
  });
}

// ===== Recuperação de senha =====
function forgotPassword() {
  if (!sb) return;
  var email = document.getElementById('aEmail').value.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { authError('Digite seu e-mail acima e toque em "Esqueci minha senha" de novo.'); return; }
  authError('Enviando...', true);
  sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + '/' }).then(function(r) {
    if (r.error) { console.error(r.error); authError(authMsg(r.error)); return; }
    authError('Pronto! Se esse e-mail tiver conta, enviamos um link para criar uma nova senha. Olhe também o spam.', true);
  });
}
function submitRecovery() {
  var pass = document.getElementById('aPass').value, btn = document.getElementById('authBtn');
  if (pass.length < 8) { authError('A senha precisa ter no mínimo 8 caracteres.'); return; }
  btn.disabled = true;
  sb.auth.updateUser({ password: pass }).then(function(r) {
    btn.disabled = false;
    if (r.error) { console.error(r.error); authError(authMsg(r.error)); return; }
    RECOVERY = false; history.replaceState(null, '', location.pathname);
    authMode('login'); startCloudSession(r.data.user, false);
    toast('Senha atualizada! ✅');
  });
}

// ===== CHAT COM A ELO (assistente de IA) =====
// O app conversa com /api/chat (função no Vercel); a chave da IA nunca fica no navegador.
var LOGO_SVG = '<svg viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="mgc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F0784E"/><stop offset="1" stop-color="#D99A58"/></linearGradient></defs><path d="M24 41C10 31 6 24 6 17.5 6 12.8 9.7 9 14.4 9c3.6 0 7 2.2 9.6 5.5C26.6 11.2 30 9 33.6 9 38.3 9 42 12.8 42 17.5 42 24 38 31 24 41z" fill="none" stroke="url(#mgc)" stroke-width="3.4" stroke-linejoin="round"/><path d="M22.5 31c0-7.5 4.5-12 12.5-13 0 8-4.5 12.5-12.5 13z" fill="url(#mgc)"/><path d="M23.5 30.5c3-3.5 6-6 9.5-8" stroke="#241A18" stroke-width="1.4" stroke-linecap="round" fill="none"/></svg>';
var chat = { msgs: [], busy: false, err: '', built: false };
var CHAT_SUGS = ['Como substituir ovo em um bolo?', 'O que costuma ter origem animal nos rótulos?', 'Ideia de jantar rápido e barato', 'Como garantir vitamina B12?'];

function fmtChat(t) { return esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>'); }

function buildChat() {
  if (chat.built) return; chat.built = true;
  var fab = document.createElement('button');
  fab.id = 'chatFab'; fab.className = 'chat-fab'; fab.setAttribute('aria-label', 'Conversar com a Elo');
  fab.innerHTML = '<span aria-hidden="true">🌿</span> Elo'; fab.title = 'Toque para conversar · arraste para mover'; fab.classList.add('is-off');
  var box = document.createElement('div');
  box.id = 'chatBox'; box.className = 'chat-box'; box.hidden = true;
  box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Chat com a Elo');
  box.innerHTML = '<div class="chat-head"><div class="chat-av">' + LOGO_SVG + '</div><div class="chat-title"><b>Elo</b><small>Assistente vegana do Elograin</small></div>' +
    '<button class="chat-x" onclick="resetChat()" aria-label="Nova conversa" title="Nova conversa">↺</button>' +
    '<button class="chat-x" onclick="closeChat()" aria-label="Fechar">✕</button></div>' +
    '<div class="chat-body"><div class="chat-msgs" id="chatMsgs" aria-live="polite" tabindex="0"></div><button type="button" class="chat-down" id="chatDown" hidden aria-label="Ir para a última mensagem" onclick="chatToBottom()">↓</button></div><div class="chat-sugs" id="chatSugs"></div>' +
    '<form class="chat-form" onsubmit="sendChat(event)"><input id="chatInput" maxlength="500" autocomplete="off" placeholder="Pergunte sobre receitas, rótulos..." aria-label="Mensagem">' +
    '<button type="submit" id="chatSend" aria-label="Enviar">➤</button></form>' +
    '<p class="chat-note">A Elo é uma IA e pode errar. Não substitui nutricionista ou médico.</p>';
  document.body.appendChild(fab); document.body.appendChild(box);
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeChat(); });
  document.getElementById('chatMsgs').addEventListener('scroll', updateChatDown, { passive: true });
  initChatFab(fab);
  renderChat();
  syncChatFab();
}
function openChat() {
  if (!sb || !cloud.user) { toast('Entre na sua conta para falar com a Elo.'); return; }
  var box = document.getElementById('chatBox');
  box.classList.toggle('on-left', chatFabSide() === 'l');   // no computador, a janela abre do mesmo lado do botão
  box.hidden = false; syncChatFab();
  setTimeout(function() { document.getElementById('chatInput').focus(); updateChatDown(); }, 100);
}
function closeChat() {
  var b = document.getElementById('chatBox'); if (!b || b.hidden) return;
  b.hidden = true; syncChatFab();
  var f = document.getElementById('chatFab'); if (f && !f.classList.contains('is-off')) f.focus({ preventScroll: true });
}
function resetChat() { chat.msgs = []; chat.err = ''; renderChat(); }

function renderChat(mode) {
  var list = document.getElementById('chatMsgs');
  var html = '<div class="cb bot">Oi! Eu sou a Elo 🌿 Posso ajudar com receitas, substituições, dúvidas de rótulos e dicas para quem é vegano ou está começando. Como posso ajudar?</div>';
  html += chat.msgs.map(function(m) { return '<div class="cb ' + (m.role === 'user' ? 'me' : 'bot') + '">' + fmtChat(m.content) + '</div>'; }).join('');
  if (chat.busy) html += '<div class="cb bot typing" aria-label="Elo está digitando"><i></i><i></i><i></i></div>';
  if (chat.err) html += '<div class="cb err">' + esc(chat.err) + '</div>';
  list.innerHTML = html;
  if (mode === 'reply') {   // resposta nova: mostra o COMEÇO dela (não pula pro fim de um texto longo)
    var bots = list.querySelectorAll('.cb.bot:not(.typing)'), last = bots[bots.length - 1];
    list.scrollTop = last ? Math.max(0, last.offsetTop - 12) : list.scrollHeight;
  } else if (mode !== 'keep') list.scrollTop = list.scrollHeight;
  updateChatDown();
  document.getElementById('chatSugs').innerHTML = chat.msgs.length ? '' : CHAT_SUGS.map(function(s) { return '<button type="button" onclick="askChat(this.textContent)">' + esc(s) + '</button>'; }).join('');
  document.getElementById('chatSend').disabled = chat.busy;
}
function sendChat(e) {
  e.preventDefault();
  var i = document.getElementById('chatInput'), t = i.value.trim();
  if (!t) return;
  i.value = ''; askChat(t);
}
function askChat(text) {
  text = (text || '').trim();
  if (!text || chat.busy) return;
  if (!sb || !cloud.user) { toast('Entre na sua conta para falar com a Elo.'); return; }
  chat.msgs.push({ role: 'user', content: text.slice(0, 500) });
  chat.busy = true; chat.err = ''; renderChat();
  sb.auth.getSession().then(function(r) {
    var s = r.data && r.data.session;
    if (!s) throw new Error('Sua sessão expirou. Saia e entre de novo.');
    return fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + s.access_token },
      body: JSON.stringify({ messages: chat.msgs.slice(-12).map(function(m) { return { role: m.role, content: m.content }; }) })
    });
  }).then(function(res) {
    return res.json().catch(function() { return {}; }).then(function(d) {
      if (res.status === 404) throw new Error('O chat ainda não foi ativado no servidor.');
      if (!res.ok) throw new Error(d.error || 'Não foi possível responder agora.');
      return d;
    });
  }).then(function(d) {
    chat.msgs.push({ role: 'assistant', content: d.reply });
  }).catch(function(err) {
    chat.err = (err && err.message && err.message !== 'Failed to fetch') ? err.message : 'Sem conexão. Confira sua internet e tente de novo.';
  }).then(function() { chat.busy = false; renderChat(chat.err ? 'bottom' : 'reply'); });
}
document.addEventListener('DOMContentLoaded', buildChat);

// ===== REDESIGN v7: início, busca global, favoritos e menu de criação =====
var ICO = {"home": "<path d=\"M3 11.5 12 4l9 7.5\"/><path d=\"M5.5 10v9.5h13V10\"/><path d=\"M10 19.5v-5h4v5\"/>", "food": "<path d=\"M7 3v7a2.5 2.5 0 0 0 5 0V3M9.5 3v18\"/><path d=\"M17 3c-2.2 1.8-3 4.5-3 8h3v10\"/>", "bread": "<path d=\"M4 11a8 6 0 0 1 16 0v1H4z\"/><path d=\"M5.5 12v6.5h13V12\"/>", "bag": "<path d=\"M5 8.5h14l-1.1 11.5H6.1z\"/><path d=\"M9 8.5V7a3 3 0 0 1 6 0v1.5\"/>", "bowl": "<path d=\"M3 12h18a9 9 0 0 1-18 0z\"/><path d=\"M8.5 8.5c-.8-1 .8-2 0-3M12.5 8.5c-.8-1 .8-2 0-3M16.5 8.5c-.8-1 .8-2 0-3\"/>", "heart": "<path d=\"M12 20s-7.5-4.6-9.2-9.4A5 5 0 0 1 12 7.6a5 5 0 0 1 9.2 3C19.5 15.4 12 20 12 20z\"/>", "people": "<circle cx=\"9\" cy=\"8\" r=\"3\"/><path d=\"M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6\"/><circle cx=\"17\" cy=\"9\" r=\"2.4\"/><path d=\"M17 14c2.5 0 4.5 2 4.5 4.5\"/>", "leaf": "<path d=\"M5 19c0-8 5-13 14-14 0 9-5 14-14 14z\"/><path d=\"M5 19c3-4 6-7 10-9\"/>", "compass": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"m15.6 8.4-2 5.2-5.2 2 2-5.2z\"/>", "user": "<circle cx=\"12\" cy=\"8\" r=\"4\"/><path d=\"M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8\"/>", "pin": "<path d=\"M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z\"/><circle cx=\"12\" cy=\"9.5\" r=\"2.5\"/>", "search": "<circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m20 20-3.5-3.5\"/>", "arrow": "<path d=\"M5 12h14M13 6l6 6-6 6\"/>", "gear": "<circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8\"/>", "help": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17v.01\"/>", "out": "<path d=\"M9 4H5v16h4M16 8l4 4-4 4M20 12H9\"/>", "chat": "<path d=\"M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z\"/>", "bell": "<path d=\"M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z\"/><path d=\"M10 21h4\"/>", "plus": "<path d=\"M12 5v14M5 12h14\"/>"};
function ic(n) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (ICO[n] || '') + '</svg>'; }
var PLACE_CAT = { restaurante: 'Restaurante', confeitaria: 'Confeitaria', padaria: 'Padaria', cafe: 'Cafeteria', lanchonete: 'Lanchonete', sorveteria: 'Sorveteria', mercado: 'Mercado', loja: 'Loja' };
var HERO_SVG = '<img class="hero-photo" src="' + photoSrc('bowl-tofu') + '" alt="Bowl vegano com tofu grelhado, abacate, tomate e grãos" width="338" height="270" decoding="async">';


// ----- fotos (recortes da colagem em img/; trocar por fotos do estabelecimento/autor quando houver envio de imagens) -----
var PHOTO_ALT = 'Foto ilustrativa de prato vegano';
function photoSrc(n) { if (/^(data:|blob:|https?:)/.test(n)) return n; return (window.PHOTOS && window.PHOTOS[n]) || ('img/' + n + '.jpg'); }
function photo(name, alt) { var own = /^(data:|blob:|https?:)/.test(name); return '<img src="' + photoSrc(name) + '" alt="' + esc(alt || PHOTO_ALT) + '" loading="lazy" decoding="async">' + (own ? '' : '<span class="tillus">Foto ilustrativa</span>'); }
function recipePhotoName(r) {
  if (r.photo) return r.photo;   // foto escolhida (a sugerida na hora de publicar, ou a enviada pela pessoa)
  var t = normTxt(r.title), hit = photoByRules(t) || photoByRules(t + ' ' + normTxt((r.ingredients || []).join(' ')));
  if (hit) return hit;
  var c = String(r.category || '').toLowerCase();
  if (c.indexOf('sobremesa') > -1) return 'brownie'; if (c.indexOf('rapid') > -1) return 'macarrao'; if (c.indexOf('econ') > -1) return 'ensopado';
  return 'bowl-graos';
}
function placePhotoName(p) { return ({ restaurante: 'legumes', confeitaria: 'cheesecake', padaria: 'croissant', cafe: 'bolo-chocolate', lanchonete: 'hamburguer', sorveteria: 'smoothie', mercado: 'vegetais', loja: 'vegetais' })[p.category] || 'bowl-graos'; }

// Se uma foto de img/ não carregar, esconde o ícone quebrado e o selo (o cartão continua bonito, só sem foto)
document.addEventListener('error', function(e) {
  var t = e.target;
  if (!t || t.tagName !== 'IMG' || String(t.src).indexOf('/img/') === -1) return;
  t.style.display = 'none';
  if (t.classList.contains('hero-photo') && t.parentNode) t.parentNode.classList.add('noimg');
  var chip = t.parentNode && t.parentNode.querySelector('.tillus'); if (chip) chip.style.display = 'none';
  console.warn('Foto não encontrada:', t.src);
}, true);

// ----- favoritos (salvos neste aparelho) -----
function favKeys() { try { return JSON.parse(localStorage.getItem('elograin_favs') || '[]'); } catch (e) { return []; } }
function isFav(k) { return favKeys().indexOf(k) > -1; }
function toggleFav(k, btn, e) {
  if (e) e.stopPropagation();
  var f = favKeys(), i = f.indexOf(k);
  if (i > -1) f.splice(i, 1); else f.push(k);
  try { localStorage.setItem('elograin_favs', JSON.stringify(f)); } catch (x) {}
  btn.classList.toggle('on', i === -1); btn.setAttribute('aria-pressed', i === -1);
  toast(i === -1 ? 'Salvo nos favoritos deste aparelho' : 'Removido dos favoritos');
}
function favBtn(k) { var on = isFav(k); return '<button class="fav-btn' + (on ? ' on' : '') + '" aria-label="Favoritar" aria-pressed="' + on + '" onclick="toggleFav(\'' + k + '\',this,event)">' + ic('heart') + '</button>'; }

// ----- dados reais (nada inventado) -----
function placesReal() { return (state.places || []).filter(function(p) { return p.real; }); }
function realRecipes() { return (sb && cloud.user) ? (state.myRecipes || []).slice() : allRecipes(); }
function topPosts(n) { return (state.posts || []).slice().sort(function(a, b) { return (b.likes || 0) - (a.likes || 0); }).slice(0, n); }
function goTo(v) { if (v === 'more') openMore(); else showView(v); }

// ----- cartões "Em alta" -----
function tcard(cls, chip, icon, cover, body) {
  return '<article class="tcard ' + cls + '"><div class="tcover"><span class="tchip">' + ic(icon) + ' ' + chip + '</span>' + cover + '</div><div class="tbody">' + body + '</div></article>';
}
function placeCard(p) {
  var cat = PLACE_CAT[p.category] || p.type;
  return tcard('t-rest', 'Restaurante', 'pin', favBtn('p:' + p.id) + photo(placePhotoName(p), 'Foto ilustrativa de ' + cat.toLowerCase()),
    '<h3>' + esc(p.name) + '</h3><p class="tmeta">' + esc(cat) + ' · ' + esc(p.type) + '</p>' + (p.hours ? '<p class="tsub">🕒 ' + esc(p.hours) + '</p>' : '<p class="tsub">' + esc(p.address) + '</p>') +
    '<button class="tbtn" onclick="showPlaceDetail(' + p.id + ')">' + ic('pin') + ' Ver no mapa</button>');
}
function recipeCard(r) {
  var rt = r.reviews ? '<span>⭐ ' + r.rating + ' (' + r.reviews + ')</span>' : '<span>Nova receita</span>';
  return tcard('t-rec', 'Receita', 'bowl', favBtn('r:' + r.id) + photo(recipePhotoName(r)),
    '<h3>' + esc(r.title) + '</h3><p class="tmeta">por ' + esc(r.author) + '</p><p class="tsub">' + rt + ' · ⏱️ ' + esc(r.time) + '</p>' +
    '<button class="tbtn" onclick="showRecipeDetail(' + r.id + ')">' + ic('bowl') + ' Ver receita</button>');
}
function postCard(p) {
  return tcard('t-post', 'Comunidade', 'people', '',
    '<div class="thead"><div class="avatar">' + esc(p.avatar) + '</div><div><b>' + esc(p.author) + '</b><small>' + esc(p.time) + '</small></div></div>' +
    '<p class="tclamp">' + esc(p.content) + '</p><p class="tsub">♥ ' + (p.likes || 0) + ' · 💬 ' + (p.comments || 0) + '</p>' +
    '<button class="tbtn" onclick="showView(\'feed\')">' + ic('chat') + ' Ver publicação</button>');
}
function ctaCard(cls, chip, icon, emoji, title, text, label, action) {
  return tcard(cls + ' t-cta', chip, icon, emoji.indexOf('img:') === 0 ? photo(emoji.slice(4)) : '<span class="tbig">' + emoji + '</span>', '<h3>' + title + '</h3><p class="tsub">' + text + '</p><button class="tbtn" onclick="' + action + '">' + label + '</button>');
}
function trendCards() {
  var c = [], pl = placesReal().slice(0, 2), rc = realRecipes().slice(0, 2), ps = topPosts(2);
  pl.forEach(function(p) { c.push(placeCard(p)); });
  if (rc.length) rc.forEach(function(r) { c.push(recipeCard(r)); });
  else c.push(ctaCard('t-rec', 'Receita', 'bowl', '🍽️', 'Compartilhe a primeira receita', 'Mostre seu prato favorito para a comunidade.', 'Compartilhar receita', "startCreate('recipe')"));
  if (ps.length) ps.forEach(function(p) { c.push(postCard(p)); });
  else c.push(ctaCard('t-post', 'Comunidade', 'people', '💬', 'Comece a conversa', 'Ainda não há publicações. Que tal dividir uma dica?', 'Publicar dica', "startCreate('post','dica')"));
  c.push(ctaCard('t-mkt', 'Mercado', 'bag', 'img:vegetais', 'Produtos veganos', 'Veja o que a comunidade encontra nos mercados e lojas.', 'Explorar mercado', "showView('consume')"));
  return c.join('');
}

// ----- tela inicial -----
function sidePanels() {
  var pl = placesReal().slice(0, 3), rc = realRecipes().slice().sort(function(a, b) { return (b.rating || 0) - (a.rating || 0); }).slice(0, 3);
  var near = pl.length ? pl.map(function(p) { return '<button class="prow" onclick="showPlaceDetail(' + p.id + ')"><span class="pico">' + esc(p.icon || '📍') + '</span><span><b>' + esc(p.name) + '</b><small>' + esc(PLACE_CAT[p.category] || p.type) + '</small></span></button>'; }).join('') : '<p class="tsub">Nenhum estabelecimento cadastrado ainda.</p>';
  var pop = rc.length ? rc.map(function(r) { return '<button class="prow" onclick="showRecipeDetail(' + r.id + ')"><span class="pico">' + esc(r.image || '🍽️') + '</span><span><b>' + esc(r.title) + '</b><small>' + (r.reviews ? '⭐ ' + r.rating : 'por ' + esc(r.author)) + '</small></span></button>'; }).join('') : '<p class="tsub">As receitas mais bem avaliadas vão aparecer aqui.</p>';
  return '<section class="panel"><div class="phead"><h3>' + ic('pin') + ' Por perto de você</h3><button class="plink" onclick="showView(\'explore\')">Ver mapa</button></div>' + near + '</section>' +
    '<section class="panel"><div class="phead"><h3>' + ic('people') + ' Conecte-se</h3></div><p class="tsub">Encontre pessoas que compartilham seus interesses e faça novas amizades.</p><button class="tbtn" onclick="showView(\'connect\')">' + ic('people') + ' Ver conexões</button></section>' +
    '<section class="panel"><div class="phead"><h3>' + ic('bowl') + ' Receitas populares</h3><button class="plink" onclick="showView(\'recipes\')">Ver todas</button></div>' + pop + '</section>';
}
function renderHome() {
  var D = [['food', 'Restaurantes e Lanchonetes', 'explore', 'bowl-graos'], ['bread', 'Padarias e Confeitarias', 'explore', 'croissant'], ['bag', 'Mercados e Lojas', 'consume', 'vegetais'], ['bowl', 'Receitas', 'recipes', 'macarrao'], ['heart', 'Relacionamentos', 'connect'], ['people', 'Comunidade', 'feed']];
  var M = [['food', 'Restaurantes', 'explore'], ['bowl', 'Receitas', 'recipes'], ['bag', 'Mercado', 'consume'], ['people', 'Comunidade', 'feed'], ['heart', 'Conexões', 'connect'], ['leaf', 'Mais', 'more']];
  var cat = function(a) { return '<button class="cat" onclick="goTo(\'' + a[2] + '\')"><span class="cico">' + ic(a[0]) + '</span><span>' + a[1] + '</span>' + (a[3] ? '<img class="cthumb" src="' + photoSrc(a[3]) + '" alt="" loading="lazy" width="48" height="48">' : '') + '</button>'; };
document.getElementById('homeContent').innerHTML = 
    '<div id="sanctuary-widget-container"></div>' +
    '<div class="home-grid"><div class="home-main">' +
    '<section class="hero"><div class="hero-copy"><span class="hero-kicker">Mais sabor. Mais conexões. Zero crueldade.</span>' +
    '<h1>Descubra, compartilhe e conecte-se com uma <em>vida 100% vegetal!</em></h1><p>Restaurantes, receitas, produtos e uma comunidade incrível te esperam aqui.</p></div>' +
    '<div class="hero-art-wrap">' + HERO_SVG + '</div>' +
    '<form class="hero-search" onsubmit="heroSearch(event)"><label class="hs-loc">' + ic('pin') + '<input id="heroLoc" placeholder="Sua cidade" aria-label="Localização" autocomplete="off"></label>' +
    '<label class="hs-q">' + ic('search') + '<input id="heroQ" placeholder="O que você procura?" aria-label="O que você procura?" autocomplete="off"></label>' +
    '<button type="submit" aria-label="Pesquisar">' + ic('arrow') + '</button></form></section>' +
    '<div class="cats cats-d">' + D.map(cat).join('') + '</div><div class="cats cats-m">' + M.map(cat).join('') + '</div>' +
    composerBarHTML() + '<div class="section-header"><h2 class="section-title">🔥 Em alta na comunidade</h2><button class="plink" onclick="showView(\'feed\')">Ver mais ' + ic('arrow') + '</button></div>' +
    '<div class="trend">' + trendCards() + '</div></div><aside class="home-side">' + sidePanels() + '</aside></div>';
}

// ----- busca global (restaurantes, receitas, produtos, posts) -----
function searchAll(q, loc) {
  q = (q || '').toLowerCase().trim(); loc = (loc || '').toLowerCase().trim();
  var has = function() { for (var i = 0; i < arguments.length; i++) { if (arguments[i] && String(arguments[i]).toLowerCase().indexOf(q) > -1) return true; } return false; };
  var prods = (state.productsMarket || []).concat(state.productsBeauty || []);
  return {
    places: (state.places || []).filter(function(p) { return (!q || has(p.name, p.address, p.type, p.description, p.category)) && (!loc || String(p.address || '').toLowerCase().indexOf(loc) > -1); }),
    recipes: !q ? [] : realRecipes().filter(function(r) { return has(r.title, r.author) || (r.ingredients || []).some(function(i) { return has(i); }); }),
    posts: !q ? [] : (state.posts || []).filter(function(p) { return has(p.content, p.author); }),
    products: !q ? [] : prods.filter(function(p) { return has(p.name, p.brand, p.category); })
  };
}
var lastQ = '';
function runSearch(q, loc) {
  q = (q || '').trim(); loc = (loc || '').trim();
  if (!q && !loc) { toast('Digite o que você procura'); return; }
  lastQ = q;
  var r = searchAll(q, loc), total = r.places.length + r.recipes.length + r.posts.length + r.products.length;
  var row = function(i, t, s, act) { return '<button class="sr" onclick="' + act + '"><span class="pico">' + i + '</span><span><b>' + esc(t) + '</b><small>' + esc(s) + '</small></span></button>'; };
  var sec = function(t, a) { return a.length ? '<h4 class="srh">' + t + '</h4>' + a.join('') : ''; };
  var body = total ? sec('Restaurantes e lojas', r.places.slice(0, 8).map(function(p) { return row(p.icon || '📍', p.name, p.address || p.type, 'showPlaceDetail(' + p.id + ')'); })) +
    sec('Receitas', r.recipes.slice(0, 8).map(function(x) { return row(x.image || '🍽️', x.title, 'por ' + x.author, 'showRecipeDetail(' + x.id + ')'); })) +
    sec('Produtos', r.products.slice(0, 8).map(function(x) { return row(x.icon || '🛒', x.name, x.brand + ' · ' + x.category, "closeDetailModal();showView('consume')"); })) +
    sec('Publicações', r.posts.slice(0, 6).map(function(x) { return row(x.avatar, x.author, x.content.slice(0, 70), 'openFeedSearch()'); }))
    : emptyState('Nada encontrado para "' + esc(q || loc) + '"', '🔍');
  openDetailModal('Resultados da busca', body);
}
function openFeedSearch() { closeDetailModal(); showView('feed'); var i = document.getElementById('feedSearch'); if (i) { i.value = lastQ; renderFeed(); } }
function globalSearch(e) { e.preventDefault(); runSearch(document.getElementById('gSearch').value, ''); }
function heroSearch(e) { e.preventDefault(); runSearch(document.getElementById('heroQ').value, document.getElementById('heroLoc').value); }

// ----- criar, mais, configurações, ajuda, notificações -----
function startCreate(type, tag) {
  closeDetailModal(); state.createType = type || 'post'; state.createTag = tag || ''; openCreateModal();
}
function openCreateMenu() { startCreate('post'); }
function menuList(items) { return '<div class="cmenu">' + items.map(function(x) { return '<button onclick="' + x[1] + '"><span class="ci">' + x[0] + '</span>' + x[2] + '</button>'; }).join('') + '</div>'; }
function openMore() {
  openDetailModal('Mais', menuList([['👤', "closeDetailModal();showView('profile')", 'Meu perfil'], ['✏️', "closeDetailModal();openProfileEditor()", 'Editar perfil e privacidade'], ['🗺️', "closeDetailModal();showView('explore')", 'Eventos e avaliações'], ['🌓', "closeDetailModal();document.getElementById('themeToggle').click()", 'Trocar tema claro/escuro'], ['🌿', "closeDetailModal();openChat()", 'Falar com a Elo'], ['🚪', "closeDetailModal();logout()", 'Sair da conta']]));
}
function openSettings() { openDetailModal('Configurações', menuList([['✏️', "closeDetailModal();openProfileEditor()", 'Editar perfil e privacidade'], ['🌓', "closeDetailModal();document.getElementById('themeToggle').click()", 'Trocar tema claro/escuro'], ['👤', "closeDetailModal();showView('profile')", 'Meu perfil'], ['🚪', "closeDetailModal();logout()", 'Sair da conta']])); }
function openHelp() {
  openDetailModal('Ajuda', '<p class="tsub" style="margin-bottom:14px">Use <b>Restaurantes</b> para achar lugares, <b>Receitas</b> para cozinhar, <b>Mercado</b> para produtos e <b>Comunidade</b> para trocar dicas. Tem dúvida sobre veganismo? A Elo responde.</p>' + menuList([['🌿', "closeDetailModal();openChat()", 'Perguntar à Elo']]));
}
function openNotifs() { openDetailModal('Notificações', emptyState('Você ainda não tem notificações', '🔔') + '<p class="tsub" style="text-align:center">Avisos de curtidas e comentários vão aparecer aqui quando esse recurso for ativado.</p>'); }
function updateHeaderAvatar() { var b = document.getElementById('headerAvatar'); if (b && state.user) b.innerHTML = avatarInner(state.user.avatar || '🌱', true); }


// ============================================================
// v7.7 — receitas sem duplicatas, publicar mais simples,
//        perfil (foto, idade, cidade, público/privado) e Elo flutuante
// ============================================================

/* ---------- utilitários ---------- */
// Texto sem acento/pontuação, em minúsculas: base de todas as comparações (nome de receita, regras de foto, etc.)
function normTxt(s) { return String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim(); }
function splitLines(s) {
  return String(s || '').split('\n').map(function(l) { return l.replace(/^[•\-\*]\s*/, '').replace(/^\d+[\.\)]\s+/, '').trim(); }).filter(Boolean);
}
// Reduz a foto no próprio aparelho (cabe no armazenamento e não gasta dados). square=true recorta o centro (foto de perfil).
function resizeImage(file, max, quality, square) {
  return new Promise(function(resolve, reject) {
    if (!file || !/^image\//.test(file.type)) { reject(new Error('Escolha um arquivo de imagem.')); return; }
    var url = URL.createObjectURL(file), img = new Image();
    img.onload = function() {
      var sw = img.width, sh = img.height, sx = 0, sy = 0, tw, th;
      if (square) { var m = Math.min(sw, sh); sx = (sw - m) / 2; sy = (sh - m) / 2; sw = sh = m; tw = th = Math.min(max, m); }
      else { var k = Math.min(1, max / Math.max(sw, sh)); tw = Math.round(sw * k); th = Math.round(sh * k); }
      var c = document.createElement('canvas'); c.width = tw; c.height = th;
      var ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, tw, th); ctx.drawImage(img, sx, sy, sw, sh, 0, 0, tw, th);
      URL.revokeObjectURL(url); resolve(c.toDataURL('image/jpeg', quality));
    };
    img.onerror = function() { URL.revokeObjectURL(url); reject(new Error('Não foi possível ler essa imagem.')); };
    img.src = url;
  });
}
// Avatar: foto da pessoa (se ela enviou) ou o emoji
function avatarInner(av, isMe) {
  if (isMe && state.user && state.user.photo) return '<img src="' + esc(state.user.photo) + '" alt="">';
  return esc(av);
}
function isMyPost(p) { return (p.user_id && cloud.user) ? p.user_id === cloud.user.id : (p.author === (state.user && state.user.name)); }

/* ---------- RECEITAS: uma lista só, sem duplicatas ---------- */
var BUILTIN_IDS = {}; MOCK_RECIPES.forEach(function(r) { BUILTIN_IDS[r.id] = 1; });
function recipeSig(r) { return normTxt(r.title) + '|' + normTxt(r.author) + '|' + normTxt((r.ingredients || []).join(' ')) + '|' + normTxt((r.steps || []).join(' ')); }
var BUILTIN_SIGS = {}; MOCK_RECIPES.forEach(function(r) { BUILTIN_SIGS[recipeSig(r)] = 1; });   // cópia idêntica de uma receita embutida nunca vale mais que o original

// Receitas da pessoa + embutidas, com as notas aplicadas. Cópias idênticas (mesmo id ou mesmo conteúdo) aparecem uma vez só.
function allRecipes() {
  var seenId = {}, seenSig = {}, out = [], rt = state.recipeRatings || {};
  (state.myRecipes || []).concat(MOCK_RECIPES).forEach(function(r) {
    if (!r) return;
    var sig = recipeSig(r);
    if (!BUILTIN_IDS[r.id] && BUILTIN_SIGS[sig]) return;   // cópia salva de uma embutida: ignora (o original aparece)
    if (seenId[r.id] || seenSig[sig]) return;
    seenId[r.id] = seenSig[sig] = 1;
    out.push(BUILTIN_IDS[r.id] && rt[r.id] ? Object.assign({}, r, { rating: rt[r.id].rating, reviews: rt[r.id].reviews }) : r);
  });
  return out;
}
// Limpa o que estava salvo: tira registros inválidos, cópias idênticas e ids repetidos
function cleanMyRecipes(list) {
  var seen = {}, used = {}, out = [];
  (Array.isArray(list) ? list : []).forEach(function(r) {
    if (!r || typeof r !== 'object' || !r.title || !Array.isArray(r.ingredients) || !Array.isArray(r.steps)) return;
    var sig = recipeSig(r); if (seen[sig] || BUILTIN_SIGS[sig]) return; seen[sig] = 1;
    var id = r.id;
    while (id == null || used[id] || BUILTIN_IDS[id]) id = (typeof id === 'number' ? id : Date.now()) + 1;
    used[id] = 1; out.push(id === r.id ? r : Object.assign({}, r, { id: id }));
  });
  return out;
}
function uniqueId() {
  var used = {}; (state.myRecipes || []).forEach(function(r) { used[r.id] = 1; });
  var id = Date.now(); while (used[id] || BUILTIN_IDS[id]) id++; return id;
}

// Foto sugerida pelo nome da receita (e, se o nome não ajudar, pelos ingredientes). O texto já vem sem acentos.
var PHOTO_RULES = [
  [/tofu mexido|ovo mexido|mexido de tofu|scramble/, 'tofu-mexido'],
  [/brownie/, 'brownie'], [/cheesecake/, 'cheesecake'],
  [/brigadeiro|bombom|trufa|docinho|beijinho|cajuzinho/, 'brigadeiros'],
  [/pizza/, 'pizza'], [/hamburguer|burger|hamb /, 'hamburguer'],
  [/bolo|torta|cupcake|muffin|pudim/, 'bolo-chocolate'],
  [/macarr|espaguete|spaghetti|lasanha|nhoque|talharim|penne|massa/, 'macarrao'],
  [/panqueca|crepe|tapioca|waffle/, 'panquecas'],
  [/smoothie bowl|acai|bowl de frutas|salada de frutas|sorvete|granola|iogurte|overnight|mingau/, 'bowl-frutas'],
  [/vitamina|smoothie|suco|shake|batida/, 'smoothie'],
  [/\bpao\b|\bpaes\b|croissant|focaccia|rosca|bisnaga/, 'croissant'],
  [/tofu/, 'bowl-tofu'],
  [/grao|feijao|lentilha|ervilha|ensopado|sopa|caldo|strogonoff|curry|moqueca|feijoada|chili/, 'ensopado'],
  [/legume|vegetais|refogado|wok|brocolis|abobrinha|berinjela/, 'legumes'],
  [/salada|quinoa|bowl/, 'bowl-graos']
];
function photoByRules(txt) { for (var i = 0; i < PHOTO_RULES.length; i++) if (PHOTO_RULES[i][0].test(txt)) return PHOTO_RULES[i][1]; return ''; }

function guessCategory(title, ingredients, time) {
  var t = normTxt(title), ing = normTxt(ingredients.join(' '));
  if (/bolo|doce|sobremesa|brigadeiro|sorvete|pudim|torta|mousse|brownie|cookie|trufa|cheesecake|bombom|beijinho/.test(t)) return 'sobremesa';
  if ((ing.match(/cacau|chocolate|acucar|leite condensado|confeiteiro/g) || []).length >= 2) return 'sobremesa';
  var m = String(time || '').match(/\d+/); if (m && +m[0] <= 20 && !/h/.test(String(time).toLowerCase())) return 'rapida';
  return 'economica';
}

/* ---------- PUBLICAR: um só lugar, sem escolher "sobre o que é" ---------- */
function freshDraft() { return { text: '', title: '', ingredients: '', steps: '', time: '', diff: 'Facil', cat: 'auto', photo: '', askedRecipe: false }; }
var draft = freshDraft(), publishing = false;

function composerBarHTML() {
  var u = state.user || {};
  return '<button type="button" class="composer-bar" onclick="startCreate(\'post\')"><span class="avatar avatar-sm">' + avatarInner(u.avatar || '🌱', true) + '</span><span class="cb-ph">No que você está pensando' + (u.name && u.name !== 'Voce' ? ', ' + esc(u.name.split(' ')[0]) : '') + '?</span><span class="cb-go">Publicar</span></button>';
}
function syncCreateTabs() { document.querySelectorAll('#createTabs .tab').forEach(function(t) { t.classList.toggle('active', t.dataset.create === state.createType); }); }
function collectDraft() {   // guarda o que já foi digitado (rascunho), mesmo se a pessoa trocar de aba ou fechar
  var g = function(id) { var e = document.getElementById(id); return e ? e.value : null; }, v;
  if ((v = g('postContent')) !== null) draft.text = v;
  if ((v = g('recipeTitle')) !== null) draft.title = v;
  if ((v = g('recipeIngredients')) !== null) draft.ingredients = v;
  if ((v = g('recipeSteps')) !== null) draft.steps = v;
  if ((v = g('recipeTime')) !== null) draft.time = v;
  if ((v = g('recipeDiff')) !== null) draft.diff = v;
  if ((v = g('recipeCategory')) !== null) draft.cat = v;
}

function renderCreateForm() {
  collectDraft(); syncCreateTabs();
  var form = document.getElementById('createForm'), u = state.user || {}, el;
  if (state.createType === 'post') {
    form.innerHTML =
      '<div class="comp-who"><div class="avatar avatar-sm">' + avatarInner(u.avatar || '🌱', true) + '</div><b>' + esc(u.name || 'Você') + '</b></div>' +
      '<textarea id="postContent" class="comp-text" maxlength="5000" rows="6" placeholder="Compartilhe uma dica, uma experiência ou tire uma dúvida com a comunidade..." oninput="postInput(this)" onkeydown="postKey(event)" aria-label="Sua publicação"></textarea>' +
      '<div id="recipeSuggest" class="comp-suggest" hidden><span>🍽️ Parece uma receita! Ela fica melhor na aba Receitas.</span><button type="button" class="btn-mini" onclick="moveToRecipe()">Publicar em Receitas</button></div>' +
      '<small id="postHint" class="comp-hint"></small>' +
      '<button class="btn btn-primary w-full" id="postBtn" onclick="submitPost()" disabled>Publicar</button>';
    el = document.getElementById('postContent'); el.value = draft.text; postInput(el);
    setTimeout(function() { el.focus(); }, 80);
  } else if (state.createType === 'recipe') {
    form.innerHTML =
      '<label for="recipeTitle">Nome da receita</label><input type="text" id="recipeTitle" maxlength="80" placeholder="Ex: Tofu mexido" oninput="recipeInput()" autocomplete="off">' +
      '<label for="recipeIngredients">Ingredientes <small>(um por linha)</small></label><textarea id="recipeIngredients" placeholder="200g de tofu firme\n1 colher de cúrcuma\nSal a gosto" oninput="recipeInput()"></textarea>' +
      '<label for="recipeSteps">Modo de preparo <small>(um passo por linha)</small></label><textarea id="recipeSteps" placeholder="Esfarele o tofu com as mãos.\nRefogue com os temperos por 5 minutos." oninput="recipeInput()"></textarea>' +
      '<div class="rf-photo"><div class="rf-thumb" id="rfThumb"></div><div class="rf-side"><b>Foto</b><small id="rfNote"></small><div class="rf-btns"><label class="btn-mini">📷 Enviar minha foto<input type="file" accept="image/*" hidden onchange="pickRecipePhoto(this)"></label><button type="button" class="btn-mini ghost" id="rfReset" onclick="resetRecipePhoto()" hidden>Usar a sugerida</button></div></div></div>' +
      '<details class="rf-more" id="rfMore"><summary>Mais detalhes (opcional)</summary>' +
      '<label for="recipeTime">Tempo de preparo</label><input type="text" id="recipeTime" placeholder="Ex: 20 min">' +
      '<label for="recipeDiff">Dificuldade</label><select id="recipeDiff"><option value="Facil">Fácil</option><option value="Medio">Médio</option><option value="Dificil">Difícil</option></select>' +
      '<label for="recipeCategory">Categoria</label><select id="recipeCategory"><option value="auto">Automática (recomendado)</option><option value="economica">💰 Econômica</option><option value="rapida">⚡ Rápida</option><option value="sobremesa">🍰 Sobremesa</option></select></details>' +
      '<button class="btn btn-primary w-full" id="recipeBtn" onclick="submitRecipe()">Publicar receita</button>';
    document.getElementById('recipeTitle').value = draft.title; document.getElementById('recipeIngredients').value = draft.ingredients;
    document.getElementById('recipeSteps').value = draft.steps; document.getElementById('recipeTime').value = draft.time;
    document.getElementById('recipeDiff').value = draft.diff; document.getElementById('recipeCategory').value = draft.cat;
    document.getElementById('rfMore').open = !!(draft.time || draft.cat !== 'auto' || draft.diff !== 'Facil');
    updateRecipePhoto();
  } else if (state.createType === 'review') {
    form.innerHTML = '<label>Estabelecimento</label><input type="text" id="reviewPlace" placeholder="Nome do restaurante/lugar">' +
      '<label>Nota</label><div id="reviewStars"></div><input type="hidden" id="reviewRating" value="5">' +
      '<label>Sua Experiencia</label><textarea id="reviewText" placeholder="Conte como foi sua visita..."></textarea>' +
      '<button class="btn btn-primary w-full" onclick="submitReview()">Publicar Avaliacao</button>';
    Elo.mountRating(document.getElementById('reviewStars'), { initial: 5, confirm: false, onChange: function(v) { document.getElementById('reviewRating').value = v; } });
  }
}

// --- publicação geral ---
function looksLikeRecipe(t) {
  var n = normTxt(t); if (n.length < 80) return false;
  var hasIng = /\bingredientes?\b/.test(n), hasSteps = /\b(modo de (preparo|fazer)|preparo|como fazer|passo a passo)\b/.test(n);
  if (hasIng && hasSteps) return true;
  var units = (n.match(/\b\d+ ?(g|kg|ml|l|xicaras?|xic|colheres?|colher|copos?|unidades?|dentes?|pitadas?)\b/g) || []).length;
  return units >= 4 && String(t).split('\n').length >= 6;
}
// A categoria (dica/experiência/dúvida) é deduzida do texto: ninguém precisa escolher
function inferTag(t) {
  var n = normTxt(t);
  if (/\?/.test(t) || /^(alguem|como|qual|quais|onde|quem|por que|sera|pode|posso)\b/.test(n)) return 'duvida';
  if (/\bdica\b|\bdicas\b|recomendo|vale a pena|truque|segredo/.test(n)) return 'dica';
  return state.createTag || 'experiencia';
}
function postInput(el) {
  draft.text = el.value;
  var btn = document.getElementById('postBtn'); if (btn) btn.disabled = !el.value.trim();
  var rec = looksLikeRecipe(el.value), sug = document.getElementById('recipeSuggest'); if (sug) sug.hidden = !rec;
  if (!rec) draft.askedRecipe = false;
  var h = document.getElementById('postHint'); if (h) h.textContent = el.value.length > 4000 ? el.value.length + '/5000' : '';
}
function postKey(e) { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); submitPost(); } }

function submitPost() {
  if (publishing) return;
  collectDraft();
  var content = cleanPostText(draft.text);
  if (!content) { toast('Escreva algo antes de publicar!'); return; }
  if (looksLikeRecipe(content) && !draft.askedRecipe) {   // receita não vai pro feed por engano: pergunta uma vez
    draft.askedRecipe = true;
    var s = document.getElementById('recipeSuggest'); if (s) { s.hidden = false; s.classList.remove('nudge'); void s.offsetWidth; s.classList.add('nudge'); }
    toast('Parece uma receita! Toque em "Publicar em Receitas" — ou publique de novo para postar no feed.');
    return;
  }
  var tag = inferTag(content), btn = document.getElementById('postBtn');
  publishing = true; if (btn) { btn.disabled = true; btn.textContent = 'Publicando...'; }
  var free = function() { publishing = false; if (btn) { btn.disabled = false; btn.textContent = 'Publicar'; } };
  var finish = function() {
    draft = freshDraft(); document.getElementById('createForm').innerHTML = ''; state.createTag = '';
    closeCreateModal(); free();
    toast('Publicado na Comunidade! 🎉', state.currentView === 'feed' ? null : 'Ver', function() { showView('feed'); });
    if (state.currentView === 'feed') { renderFeed(); window.scrollTo(0, 0); }
    if (state.currentView === 'home') renderHome();
    if (state.currentView === 'profile') renderProfile();
  };
  if (sb && cloud.user) {
    sb.from('posts').insert({ tag: tag, content: content.slice(0, 5000) }).then(function(r) {
      if (r.error) { console.error('Erro ao publicar:', r.error); free(); toast(publishError(r.error)); return; }
      finish(); loadPostsCloud();
    }, function() { free(); toast('Sem conexão com a internet. Tente de novo.'); });
    return;
  }
  state.posts.unshift({ id: Date.now(), author: state.user.name, avatar: state.user.avatar, time: 'Agora', content: content, tag: tag, likes: 0, comments: 0, liked: false, image: null });
  saveState(); finish();
}

// --- receita ---
function parseRecipeText(t) {   // separa um texto colado em título / ingredientes / passos
  var lines = cleanPostText(t).split('\n').map(function(l) { return l.trim(); }).filter(Boolean), title = '', ing = [], steps = [], mode = 'head';
  lines.forEach(function(l) {
    var n = normTxt(l);
    if (/^ingredientes?\b/.test(n)) { mode = 'ing'; return; }
    if (/^(modo de (preparo|fazer)|preparo|como fazer|passo a passo|instrucoes)\b/.test(n)) { mode = 'steps'; return; }
    if (mode === 'head') { if (!title) title = l.replace(/^[#\s*]+/, '').slice(0, 80); return; }
    (mode === 'ing' ? ing : steps).push(l.replace(/^[•\-\*]\s*/, '').replace(/^\d+[\.\)]\s+/, ''));
  });
  if (!ing.length && !steps.length) steps = lines.slice(1);
  return { title: title, ing: ing, steps: steps };
}
function moveToRecipe() {
  collectDraft();
  var p = parseRecipeText(draft.text);
  draft.title = p.title; draft.ingredients = p.ing.join('\n'); draft.steps = p.steps.join('\n');
  state.createType = 'recipe'; renderCreateForm();
  toast('Separamos os campos da receita. Confira e publique.');
}
function effectiveCategory() { return draft.cat !== 'auto' ? draft.cat : guessCategory(draft.title, splitLines(draft.ingredients), draft.time); }
var photoTimer;
function recipeInput() { collectDraft(); clearTimeout(photoTimer); photoTimer = setTimeout(updateRecipePhoto, 150); }
function updateRecipePhoto() {
  var th = document.getElementById('rfThumb'); if (!th) return;
  var name = draft.photo || recipePhotoName({ title: draft.title, category: effectiveCategory(), ingredients: splitLines(draft.ingredients) });
  th.innerHTML = '<img src="' + photoSrc(name) + '" alt="">';
  document.getElementById('rfNote').textContent = draft.photo ? 'Sua foto' : 'Sugerida pelo nome da receita (foto ilustrativa)';
  document.getElementById('rfReset').hidden = !draft.photo;
}
function pickRecipePhoto(input) {
  var f = input.files && input.files[0]; input.value = '';
  resizeImage(f, 720, 0.78).then(function(d) { draft.photo = d; updateRecipePhoto(); }).catch(function(e) { toast(e.message); });
}
function resetRecipePhoto() { draft.photo = ''; updateRecipePhoto(); }

function submitRecipe() {
  if (publishing) return;
  collectDraft();
  var title = draft.title.trim(), ingredients = splitLines(draft.ingredients), steps = splitLines(draft.steps);
  if (!title) { toast('Dê um nome para a receita.'); return; }
  if (!ingredients.length) { toast('Liste pelo menos um ingrediente.'); return; }
  if (!steps.length) { toast('Descreva o modo de preparo.'); return; }
  var nt = normTxt(title), similar = allRecipes().find(function(r) { var o = normTxt(r.title); return o === nt || o.indexOf(nt) === 0 || nt.indexOf(o) === 0; });
  if (similar && !confirm('Já existe uma receita parecida: "' + similar.title + '".\nPublicar a sua mesmo assim?')) return;
  publishing = true;
  var btn = document.getElementById('recipeBtn'); if (btn) btn.disabled = true;
  var cat = effectiveCategory(), tagMap = { economica: '💰 Economica', rapida: '⚡ Rapida', sobremesa: '🍰 Sobremesa' };
  var recipe = { id: uniqueId(), title: title, author: state.user.name, avatar: state.user.avatar, time: draft.time.trim() || '—', difficulty: draft.diff, rating: 0, reviews: 0, category: cat,
    tags: [tagMap[cat], '🆕 Nova'], image: '🍽️', ingredients: ingredients, steps: steps,
    photo: draft.photo || recipePhotoName({ title: title, category: cat, ingredients: ingredients }) };   // a foto fica gravada: não muda se as regras mudarem
  state.myRecipes.unshift(recipe);
  if (!saveState()) { state.myRecipes.shift(); publishing = false; if (btn) btn.disabled = false; toast('Não coube no armazenamento do aparelho. Tente uma foto menor ou sem foto.'); return; }
  draft = freshDraft(); document.getElementById('createForm').innerHTML = '';
  closeCreateModal(); publishing = false;
  document.querySelectorAll('#recipeTabs .tab').forEach(function(t) { t.classList.toggle('active', t.dataset.tab === 'todas'); });
  var rs = document.getElementById('recipeSearch'); if (rs) rs.value = '';
  showView('recipes');   // receita aparece na aba Receitas, no topo
  toast('Receita publicada em Receitas! 🍽️');
}

/* ---------- PERFIL: foto, idade, cidade e privacidade ---------- */
var DEFAULT_BIO = 'Membro da comunidade Elograin';
function userDefaults() { return { name: 'Voce', avatar: '🦁', bio: DEFAULT_BIO, photo: '', age: '', city: '', visibility: 'public', showAge: true, showCity: true }; }
function profileStore() { try { return JSON.parse(localStorage.getItem('elograin_profiles') || '{}'); } catch (e) { return {}; } }
// Dados extras do perfil por e-mail. Na nuvem, os campos pequenos acompanham a conta (user_metadata); a foto fica só neste aparelho.
function loadExtras(email, meta) {
  var local = (email && profileStore()[email]) || {}, m = meta || {}, out = {};
  ['bio', 'age', 'city', 'visibility', 'showAge', 'showCity'].forEach(function(k) {
    if (m[k] !== undefined && m[k] !== null) out[k] = m[k]; else if (local[k] !== undefined) out[k] = local[k];
  });
  if (local.photo) out.photo = local.photo;
  return out;
}
function saveExtras(u) {
  if (!u.email) return true;
  var s = profileStore(); s[u.email] = { bio: u.bio, age: u.age, city: u.city, visibility: u.visibility, showAge: u.showAge, showCity: u.showCity, photo: u.photo || '' };
  try { localStorage.setItem('elograin_profiles', JSON.stringify(s)); return true; } catch (e) { return false; }
}
function renderProfileMeta(u) {
  var priv = u.visibility === 'private', chips = [priv ? '<span class="pchip priv">🔒 Perfil privado</span>' : '<span class="pchip pub">🌍 Perfil público</span>'];
  if (u.age) chips.push('<span class="pchip">🎂 ' + esc(u.age) + ' anos</span>');
  if (u.city) chips.push('<span class="pchip">📍 ' + esc(u.city) + '</span>');
  var b = document.getElementById('profileBadges'); if (b) b.innerHTML = chips.join('');
  var seen = [];
  if (u.photo) seen.push('foto'); if (u.age && u.showAge) seen.push('idade'); if (u.city && u.showCity) seen.push('cidade');
  var n = document.getElementById('profileVisNote');
  if (n) n.textContent = priv ? 'Só você vê seus dados. Nas publicações aparecem apenas seu nome e avatar.' : 'Outras pessoas veem: nome' + (seen.length ? ', ' + seen.join(', ') : '') + '.';
}

var pe = { photo: '', avatar: '🌱' };
function openProfileEditor() {
  var u = state.user || userDefaults(); pe = { photo: u.photo || '', avatar: u.avatar || '🌱' };
  var vis = u.visibility === 'private' ? 'private' : 'public';
  var body = '<div class="pe">' +
    '<div class="pe-photo"><div class="avatar avatar-lg" id="pePreview"></div><div class="pe-btns"><label class="btn-mini">📷 Escolher foto<input id="peFile" type="file" accept="image/*" hidden onchange="peFile(this)"></label><button type="button" class="btn-mini ghost" id="peRemove" onclick="peRemovePhoto()">Remover foto</button></div></div>' +
    '<label>Avatar <small>(aparece quando não há foto)</small></label><div class="av-pick" id="peAv">' + AVATARS.map(function(a) { return '<button type="button" onclick="peAvatar(\'' + a + '\')" aria-label="Avatar ' + a + '">' + a + '</button>'; }).join('') + '</div>' +
    '<label for="peName">Nome</label><input id="peName" maxlength="30" value="' + esc(u.name || '') + '" autocomplete="name">' +
    '<label for="peBio">Sobre você</label><textarea id="peBio" maxlength="140" rows="2" placeholder="Conte em poucas palavras quem você é">' + esc(u.bio && u.bio !== DEFAULT_BIO ? u.bio : '') + '</textarea>' +
    '<div class="pe-row"><div><label for="peAge">Idade</label><input id="peAge" type="number" inputmode="numeric" min="13" max="120" placeholder="Ex: 28" value="' + esc(u.age || '') + '"></div>' +
    '<div><label for="peCity">Cidade</label><input id="peCity" maxlength="60" placeholder="Ex: São Paulo, SP" value="' + esc(u.city || '') + '" autocomplete="address-level2"></div></div>' +
    '<button type="button" class="btn-mini ghost" onclick="peLocate()">📍 Usar minha localização</button> <small id="peLocNote" class="pe-note"></small>' +
    '<label>Quem pode ver seu perfil</label><div class="pe-vis" role="radiogroup" aria-label="Visibilidade do perfil">' +
    '<label class="pe-opt"><input type="radio" name="peVis" value="public"' + (vis === 'public' ? ' checked' : '') + ' onchange="peVisChange()"><span><b>🌍 Público</b><small>Você aparece em Conexões e outras pessoas veem o que você permitir abaixo.</small></span></label>' +
    '<label class="pe-opt"><input type="radio" name="peVis" value="private"' + (vis === 'private' ? ' checked' : '') + ' onchange="peVisChange()"><span><b>🔒 Privado</b><small>Só você vê seus dados. Você não aparece em Conexões; nas publicações, só nome e avatar.</small></span></label></div>' +
    '<div class="pe-share" id="peShare"><label class="pe-chk"><input type="checkbox" id="peShowAge"' + (u.showAge !== false ? ' checked' : '') + '> Mostrar minha idade</label>' +
    '<label class="pe-chk"><input type="checkbox" id="peShowCity"' + (u.showCity !== false ? ' checked' : '') + '> Mostrar minha cidade</label></div>' +
    '</div>';
  openDetailModal('Editar perfil', body, '<button class="btn btn-secondary" onclick="closeDetailModal()">Cancelar</button><button class="btn btn-primary" onclick="saveProfile()">Salvar</button>');
  peRefreshPhoto(); peVisChange();
}
function peRefreshPhoto() {
  var pv = document.getElementById('pePreview'); if (!pv) return;
  pv.innerHTML = pe.photo ? '<img src="' + esc(pe.photo) + '" alt="Sua foto">' : esc(pe.avatar);
  document.getElementById('peRemove').hidden = !pe.photo;
  document.querySelectorAll('#peAv button').forEach(function(b) { b.classList.toggle('on', b.textContent === pe.avatar); });
}
function peFile(input) {
  var f = input.files && input.files[0]; input.value = '';
  resizeImage(f, 256, 0.82, true).then(function(d) { pe.photo = d; peRefreshPhoto(); }).catch(function(e) { toast(e.message); });
}
function peRemovePhoto() { pe.photo = ''; peRefreshPhoto(); }
function peAvatar(a) { pe.avatar = a; peRefreshPhoto(); }
function peVisChange() {
  var r = document.querySelector('input[name="peVis"]:checked'), priv = r && r.value === 'private', box = document.getElementById('peShare');
  if (!box) return;
  box.classList.toggle('off', !!priv);
  box.querySelectorAll('input').forEach(function(i) { i.disabled = !!priv; });
}
function peLocate() {
  var note = document.getElementById('peLocNote');
  if (!navigator.geolocation) { note.textContent = 'Este navegador não permite localização. Digite sua cidade.'; return; }
  note.textContent = 'Buscando...';
  navigator.geolocation.getCurrentPosition(function(pos) {
    fetch('https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=10&accept-language=pt-BR&lat=' + pos.coords.latitude + '&lon=' + pos.coords.longitude)
      .then(function(r) { return r.json(); })
      .then(function(d) {
        var a = (d && d.address) || {}, city = a.city || a.town || a.village || a.municipality || a.county || '';
        var iso = a['ISO3166-2-lvl4'], st = iso ? String(iso).split('-')[1] : (a.state || '');
        if (!city) { note.textContent = 'Não consegui identificar a cidade. Digite manualmente.'; return; }
        document.getElementById('peCity').value = city + (st ? ', ' + st : '');
        note.textContent = 'Só a cidade é salva — a posição exata não é guardada.';
      }).catch(function() { note.textContent = 'Sem conexão para achar a cidade. Digite manualmente.'; });
  }, function() { note.textContent = 'Sem permissão de localização. Digite sua cidade.'; }, { timeout: 10000, maximumAge: 600000 });
}
function saveProfile() {
  var name = document.getElementById('peName').value.trim(), ageRaw = document.getElementById('peAge').value.trim(), age = '';
  if (name.length < 2) { toast('Digite seu nome (mínimo 2 letras).'); return; }
  if (ageRaw !== '') {
    var n = parseInt(ageRaw, 10);
    if (!(n >= 13 && n <= 120)) { toast('Informe uma idade entre 13 e 120 anos.'); return; }
    age = n;
  }
  var vis = (document.querySelector('input[name="peVis"]:checked') || {}).value === 'private' ? 'private' : 'public';
  var u = state.user = Object.assign({}, state.user, {
    name: name, bio: document.getElementById('peBio').value.trim() || DEFAULT_BIO, avatar: pe.avatar, photo: pe.photo, age: age,
    city: document.getElementById('peCity').value.trim(), visibility: vis,
    showAge: document.getElementById('peShowAge').checked, showCity: document.getElementById('peShowCity').checked
  });
  if (!(saveState() && saveExtras(u))) toast('Não coube no armazenamento do aparelho. Tente uma foto menor.');
  if (sb && cloud.user) {   // nuvem: nome/avatar na tabela de perfis; o resto acompanha a conta
    sb.from('profiles').update({ name: u.name, avatar: u.avatar }).eq('id', cloud.user.id).then(function(r) { if (r.error) { console.error(r.error); toast('Perfil salvo neste aparelho, mas o nome não sincronizou com a nuvem.'); } });
    sb.auth.updateUser({ data: { name: u.name, avatar: u.avatar, bio: u.bio, age: u.age, city: u.city, visibility: u.visibility, showAge: u.showAge, showCity: u.showCity } }).then(function(r) { if (r.error) console.error(r.error); });
  } else {
    var acc = getAccounts(); if (u.email && acc[u.email]) { acc[u.email].name = u.name; acc[u.email].avatar = u.avatar; setAccounts(acc); }
  }
  closeDetailModal(); updateHeaderAvatar(); renderProfile();
  if (state.currentView === 'connect') renderConnect();
  if (state.currentView === 'home') renderHome();
  if (state.currentView === 'feed') renderFeed();
  toast('Perfil atualizado ✅');
}

/* ---------- CONEXÕES: filtro por idade e cidade ---------- */
var connectFilter = { age: 'all', city: '' }, connectTimer;
var AGE_RANGES = [['all', 'Todas as idades'], ['18-25', '18 a 25'], ['26-35', '26 a 35'], ['36-50', '36 a 50'], ['51+', '51 ou mais']];
function ageInRange(age, r) {
  if (r === 'all') return true;
  if (r === '51+') return age >= 51;
  var p = r.split('-'); return age >= +p[0] && age <= +p[1];
}
function renderConnect() {
  var content = document.getElementById('connectContent'), u = state.user || {}, priv = u.visibility === 'private';
  var note = priv
    ? '<div class="conn-note">🔒 Seu perfil é <b>privado</b>: você não aparece para outras pessoas aqui. <button type="button" class="plink" onclick="openProfileEditor()">Mudar</button></div>'
    : '<div class="conn-note">🌍 Seu perfil é <b>público</b> e pode aparecer em Conexões. <button type="button" class="plink" onclick="openProfileEditor()">Ajustar</button></div>';
  var filt = '<div class="cf"><label class="cf-f"><span>Idade</span><select id="cfAge" onchange="connectSetAge(this.value)">' +
    AGE_RANGES.map(function(a) { return '<option value="' + a[0] + '"' + (connectFilter.age === a[0] ? ' selected' : '') + '>' + a[1] + '</option>'; }).join('') + '</select></label>' +
    '<label class="cf-f"><span>Cidade</span><input id="cfCity" type="search" placeholder="Ex: Curitiba" value="' + esc(connectFilter.city) + '" oninput="connectSetCity(this.value)" autocomplete="off"></label>' +
    (u.city ? '<button type="button" class="btn-mini ghost cf-mine" onclick="connectMyCity()">📍 Minha cidade</button>' : '') + '</div>';
  content.innerHTML = note + filt + '<div id="connectList"></div>';
  renderConnectList();
}
function connectSetAge(v) { connectFilter.age = v; renderConnectList(); }
function connectSetCity(v) { connectFilter.city = v; clearTimeout(connectTimer); connectTimer = setTimeout(renderConnectList, 200); }
function connectMyCity() { var c = String((state.user || {}).city || '').split(',')[0].trim(); connectFilter.city = c; var i = document.getElementById('cfCity'); if (i) i.value = c; renderConnectList(); }
function renderConnectList() {
  var box = document.getElementById('connectList'); if (!box) return;
  var u = state.user || {}, tab = state.connectTab;
  if (tab === 'encontros' && u.age && +u.age < 18) { box.innerHTML = emptyState('Encontros é só para maiores de 18 anos', '🔞') ; return; }
  var q = normTxt(connectFilter.city);
  var list = state.profiles.filter(function(p) {
    return p.type === tab && ageInRange(p.age, connectFilter.age) && (!q || normTxt(p.city).indexOf(q) > -1);
  });
  box.innerHTML = list.length ? list.map(matchCard).join('') : emptyState('Ninguém encontrado com esses filtros', '🔍');
}
function matchCard(p) {
  return '<div class="match-card"><div class="match-img">' + esc(p.avatar) + '</div>' +
    '<div class="match-body"><h3 style="font-size:1.2rem;margin-bottom:4px">' + esc(p.name) + ', ' + p.age + '</h3>' +
    (p.city ? '<p class="match-city">📍 ' + esc(p.city) + '</p>' : '') +
    '<p style="color:var(--text-light);font-size:0.9rem;margin-bottom:8px">' + esc(p.bio) + '</p>' +
    '<div class="tag-list">' + p.interests.map(function(i) { return '<span class="tag" style="padding:4px 10px;font-size:0.75rem">' + esc(i) + '</span>'; }).join('') + '</div></div>' +
    '<div class="match-actions">' +
    '<button class="match-btn match-btn-secondary" onclick="toast(\'Passado 👋\')">👋 Pular</button>' +
    '<button class="match-btn match-btn-primary" onclick="toast(\'Match! 💕 Inicie uma conversa.\')">💕 Curtir</button></div></div>';
}

/* ---------- ELO: botão flutuante livre por toda a tela (360°) ---------- */
// Toque abre o chat; arrastar move para qualquer posição (X e Y) da tela e salva para todas as abas. Setas do teclado também movem.
var chatFabState = { xr: null, yr: null };
function chatFabSide() {
  if (typeof chatFabState.xr === 'number') return chatFabState.xr < 0.5 ? 'l' : 'r';
  return window.innerWidth >= 1024 ? 'r' : 'l';
}
function syncChatFab() {
  var fab = document.getElementById('chatFab'), box = document.getElementById('chatBox'); if (!fab) return;
  var show = !!(sb && cloud.user) && (!box || box.hidden);   // só aparece logado (sem login a Elo não responde) e com o chat fechado
  fab.classList.toggle('is-off', !show);
  if (show) {
    if (window.chatFabPlace) window.chatFabPlace();
    try { if (!localStorage.getItem('elograin_fab_hint')) { localStorage.setItem('elograin_fab_hint', '1'); setTimeout(function() { toast('Dica: arraste o botão da Elo para qualquer lugar da tela 👆'); }, 1200); } } catch (e) {}
  }
}
function initChatFab(fab) {
  var M = 12, drag = null, justDragged = false;
  try {
    var sv = JSON.parse(localStorage.getItem('elograin_chatfab') || 'null');
    if (sv && typeof sv.yr === 'number') {
      if (typeof sv.xr === 'number') chatFabState = { xr: sv.xr, yr: sv.yr };
      else if (sv.side === 'l' || sv.side === 'r') chatFabState = { xr: sv.side === 'l' ? 0 : 1, yr: sv.yr };
    }
  } catch (e) {}
  function vp() { return { w: window.innerWidth, h: window.innerHeight }; }
  function size() { return { w: fab.offsetWidth || 92, h: fab.offsetHeight || 48 }; }
  function safeBottom() {
    var p = document.createElement('div'); p.style.cssText = 'position:fixed;left:0;bottom:0;height:env(safe-area-inset-bottom,0px);width:0;visibility:hidden';
    document.body.appendChild(p); var h = p.offsetHeight; p.remove(); return h;
  }
  function leftBound() { var sb2 = document.querySelector('.sidebar'); return (sb2 && getComputedStyle(sb2).display !== 'none') ? Math.round(sb2.getBoundingClientRect().right) + M : M; }
  function rightBound() { return Math.max(leftBound(), vp().w - size().w - M); }
  function clampX(x) { return Math.min(Math.max(x, leftBound()), rightBound()); }
  function clampY(y) { var v = vp(), s = size(); return Math.min(Math.max(y, 8), v.h - s.h - 8); }
  function defaultX() { return window.innerWidth >= 1024 ? rightBound() : leftBound(); }
  function defaultY() { var v = vp(), s = size(); return v.w >= 1024 ? v.h - 160 : v.h - (72 + safeBottom() + 16) - s.h - 4; }
  function place() {
    var v = vp(), s = size(), minX = leftBound(), maxX = rightBound(), maxY = Math.max(8, v.h - s.h - 8);
    var x = chatFabState.xr == null ? defaultX() : minX + chatFabState.xr * Math.max(0, maxX - minX);
    var y = chatFabState.yr == null ? defaultY() : 8 + chatFabState.yr * Math.max(0, maxY - 8);
    fab.style.right = 'auto'; fab.style.bottom = 'auto';
    fab.style.left = clampX(x) + 'px';
    fab.style.top = clampY(y) + 'px';
  }
  function save() { try { localStorage.setItem('elograin_chatfab', JSON.stringify(chatFabState)); } catch (e) {} }
  function saveFreePosition() {   // salva a posição exata (X e Y proporcionais) onde o usuário soltou
    var v = vp(), s = size(), minX = leftBound(), maxX = rightBound(), maxY = Math.max(8, v.h - s.h - 8);
    var curX = clampX(fab.offsetLeft), curY = clampY(fab.offsetTop);
    fab.style.left = curX + 'px';
    fab.style.top = curY + 'px';
    var xr = maxX > minX ? (curX - minX) / (maxX - minX) : 0;
    var yr = maxY > 8 ? (curY - 8) / (maxY - 8) : 0;
    chatFabState = { xr: Math.min(1, Math.max(0, xr)), yr: Math.min(1, Math.max(0, yr)) };
    save();
  }
  window.chatFabPlace = place;
  fab.addEventListener('pointerdown', function(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    drag = { id: e.pointerId, sx: e.clientX, sy: e.clientY, ox: fab.offsetLeft, oy: fab.offsetTop, on: false };
    try { fab.setPointerCapture(e.pointerId); } catch (x) {}
  });
  fab.addEventListener('pointermove', function(e) {
    if (!drag || e.pointerId !== drag.id) return;
    var dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
    if (!drag.on) { if (Math.abs(dx) + Math.abs(dy) < 6) return; drag.on = true; fab.classList.add('dragging'); fab.classList.remove('snap'); }
    e.preventDefault();
    fab.style.left = clampX(drag.ox + dx) + 'px';
    fab.style.top = clampY(drag.oy + dy) + 'px';
  });
  function end(e) {
    if (!drag || e.pointerId !== drag.id) return;
    var moved = drag.on; drag = null;
    try { fab.releasePointerCapture(e.pointerId); } catch (x) {}
    fab.classList.remove('dragging');
    if (moved) { justDragged = true; setTimeout(function() { justDragged = false; }, 60); saveFreePosition(); }
  }
  fab.addEventListener('pointerup', end); fab.addEventListener('pointercancel', end);
  fab.addEventListener('click', function(e) { if (justDragged) { e.preventDefault(); return; } openChat(); });
  fab.addEventListener('keydown', function(e) {   // acessível: setas movem o botão livremente
    var k = e.key, step = 36;
    if (k === 'ArrowLeft') fab.style.left = clampX(fab.offsetLeft - step) + 'px';
    else if (k === 'ArrowRight') fab.style.left = clampX(fab.offsetLeft + step) + 'px';
    else if (k === 'ArrowUp') fab.style.top = clampY(fab.offsetTop - step) + 'px';
    else if (k === 'ArrowDown') fab.style.top = clampY(fab.offsetTop + step) + 'px';
    else return;
    e.preventDefault(); saveFreePosition();
  });
  window.addEventListener('resize', place); window.addEventListener('orientationchange', function() { setTimeout(place, 200); });
}

/* ---------- ELO: rolagem do chat ---------- */
function updateChatDown() {
  var l = document.getElementById('chatMsgs'), b = document.getElementById('chatDown'); if (!l || !b) return;
  b.hidden = (l.scrollHeight - l.scrollTop - l.clientHeight) < 140;
}
function chatToBottom() { var l = document.getElementById('chatMsgs'); if (l) l.scrollTo({ top: l.scrollHeight, behavior: 'smooth' }); }
// ==========================================
// SISTEMA DE GAMIFICAÇÃO: SANTUÁRIO ELO-GRAIN
// ==========================================

// 1. Carrega ou inicializa os dados do Santuário no localStorage
function getSanctuaryData() {
    let data = localStorage.getItem('elograin_sanctuary_game');
    if (!data) {
        data = {
            points: 15,          // Pontos disponíveis para gastar
            totalEarned: 15,     // Histórico total acumulado
            items: [],           // Itens comprados/desbloqueados (grama, flores, árvores, animais)
            rescuedAnimals: []   // Animais resgatados
        };
        localStorage.setItem('elograin_sanctuary_game', JSON.stringify(data));
        return data;
    }
    return JSON.parse(data);
}

// 2. Sistema de Pontuação por Ações no App
function rewardSanctuaryAction(actionType) {
    let data = getSanctuaryData();
    let earned = 0;

    switch (actionType) {
        case 'login': earned = 5; break;         // Entrar no app / diário
        case 'search': earned = 2; break;        // Usar localização / busca
        case 'post': earned = 8; break;          // Fazer postagem comum
        case 'recipe': earned = 12; break;       // Publicar receita
        case 'bot': earned = 4; break;           // Usar chat bot Elo
        case 'review': earned = 6; break;        // Avaliar restaurante/produto
        default: earned = 2;
    }

    data.points += earned;
    data.totalEarned += earned;
    localStorage.setItem('elograin_sanctuary_game', JSON.stringify(data));
    updateSanctuaryFloatingButton();
}

// 3. Comprar itens ou resgatar animais com pontos
function buySanctuaryItem(itemType, cost, itemName) {
    let data = getSanctuaryData();
    if (data.points < cost) {
        alert("Ops! Você precisa de mais pontos. Interaja mais com o EloGrain (busque, poste receitas, use o chat) para ganhar pontos!");
        return;
    }

    data.points -= cost;
    if (itemType === 'animal') {
        data.rescuedAnimals.push(itemName);
        alert(`🎉 Parabéns! Você resgatou um(a) ${itemName} para o seu Santuário! Ele agora vive seguro e feliz.`);
    } else {
        data.items.push({ type: itemName, date: new Date().toLocaleDateString() });
        alert(`🌱 Item "${itemName}" plantado com sucesso no seu terreno!`);
    }

    localStorage.setItem('elograin_sanctuary_game', JSON.stringify(data));
    openSanctuaryModal(); // Atualiza a aba aberta
}

// 4. Criação do Botão Flutuante Exclusivo na Tela
function initSanctuaryFloatingButton() {
    if (document.getElementById('sanctuary-float-btn')) return;

    const floatBtn = document.createElement('div');
    floatBtn.id = 'sanctuary-float-btn';
    floatBtn.innerHTML = `
        <button onclick="openSanctuaryModal()" class="fixed bottom-6 left-6 z-50 bg-gradient-to-r from-[#E07A5F] to-[#81B29A] hover:scale-105 text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-2.5 font-bold text-sm border-2 border-[#3D332C] transition-all cursor-pointer animate-bounce">
            <span class="text-xl">🐷</span>
            <span id="float-points-badge" class="bg-[#1A1513] text-[#F3EFEA] px-2 py-0.5 rounded-full text-xs">15 pts</span>
        </button>
    `;
    document.body.appendChild(floatBtn);
    updateSanctuaryFloatingButton();
}

function updateSanctuaryFloatingButton() {
    let data = getSanctuaryData();
    const badge = document.getElementById('float-points-badge');
    if (badge) badge.innerText = `${data.points} pts`;
}

// 5. Abre a Aba / Modal Estilo "Minifazenda" com todas as opções
function openSanctuaryModal() {
    let data = getSanctuaryData();
    
    // Remove modal anterior se já existir
    const existing = document.getElementById('sanctuary-modal-overlay');
    if (existing) existing.remove();

    // Monta a listagem visual dos animais resgatados pelo usuário
    let animalsHTML = data.rescuedAnimals.length === 0 
        ? '<p class="text-xs text-[#A39284] italic">Nenhum animal resgatado ainda. Junte pontos e salve o primeiro!</p>'
        : data.rescuedAnimals.map(a => `<span class="px-3 py-1.5 bg-[#3D332C] text-[#F3EFEA] rounded-xl text-xs font-semibold flex items-center gap-1.5">✨ ${a}</span>`).join('');

    // Monta a listagem dos itens plantados no terreno
    let itemsHTML = data.items.length === 0
        ? '<p class="text-xs text-[#A39284] italic">Seu terreno está vazio. Comece a plantar grama e flores!</p>'
        : data.items.map(i => `<span class="px-2.5 py-1 bg-[#1A1513] text-[#81B29A] rounded-lg text-xs">🌿 ${i.type}</span>`).join('');

    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'sanctuary-modal-overlay';
    modalOverlay.className = 'fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in';
    
    modalOverlay.innerHTML = `
        <div class="bg-[#2A2421] border border-[#3D332C] w-full max-w-3xl rounded-3xl p-6 text-[#F3EFEA] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <!-- Cabeçalho -->
            <div class="flex justify-between items-center pb-4 border-b border-[#3D332C]">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-2xl bg-[#3D332C] flex items-center justify-center text-2xl shadow-inner">
                        🏡🐷
                    </div>
                    <div>
                        <h2 class="text-xl font-bold text-[#F3EFEA]">Santuário EloGrain</h2>
                        <p class="text-xs text-[#A39284]">Seu refúgio de paz, vegetação e resgate animal</p>
                    </div>
                </div>
                <button onclick="document.getElementById('sanctuary-modal-overlay').remove()" class="w-9 h-9 rounded-full bg-[#3D332C] hover:bg-[#E07A5F] text-[#F3EFEA] flex items-center justify-center font-bold text-base transition">
                    ✕
                </button>
            </div>

            <!-- Meus Pontos e Status -->
            <div class="my-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-[#1E1815] p-4 rounded-2xl border border-[#3D332C] text-center">
                    <span class="text-xs text-[#A39284] uppercase tracking-wider">Pontos Disponíveis</span>
                    <h3 class="text-2xl font-black text-[#E07A5F] mt-1">${data.points} pts</h3>
                </div>
                <div class="bg-[#1E1815] p-4 rounded-2xl border border-[#3D332C] text-center">
                    <span class="text-xs text-[#A39284] uppercase tracking-wider">Total Acumulado</span>
                    <h3 class="text-2xl font-bold text-[#81B29A] mt-1">${data.totalEarned} pts</h3>
                </div>
                <div class="bg-[#1E1815] p-4 rounded-2xl border border-[#3D332C] text-center flex flex-col justify-center">
                    <button onclick="alert('ℹ️ COMO GANHAR PONTOS:\\n- Entrar no app: +5 pts\\n- Buscar restaurantes/local: +2 pts\\n- Usar o Chatbot Elo: +4 pts\\n- Fazer postagens: +8 pts\\n- Publicar receitas: +12 pts\\n- Avaliar conteúdos: +6 pts')" class="w-full py-2 bg-[#3D332C] hover:bg-[#4D413A] text-xs font-bold rounded-xl text-[#F3EFEA] transition">
                        📖 Como Conseguir Pontos?
                    </button>
                </div>
            </div>

            <!-- O Terreno / Fazenda Visual -->
            <div class="mb-6 bg-[#1A1513] border-2 border-dashed border-[#3D332C] rounded-2xl p-6 text-center">
                <span class="text-xs text-[#A39284] uppercase tracking-widest font-bold">🌾 Seu Terreno e Moradores</span>
                <div class="flex flex-wrap items-center justify-center gap-3 my-4 min-h-[80px]">
                    ${itemsHTML}
                    ${animalsHTML}
                </div>
                <p class="text-xs text-[#C4B5A5]">Plante vegetação e resgate animais para encher seu santuário de vida!</p>
            </div>

            <!-- Loja / O que fazer com a pontuação -->
            <h3 class="text-sm font-bold uppercase tracking-wider text-[#A39284] mb-3">🌱 Loja do Santuário (Gastar Pontos)</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                
                <!-- Grama e Flores -->
                <div class="bg-[#1E1815] p-3.5 rounded-2xl border border-[#3D332C] flex items-center justify-between">
                    <div>
                        <h4 class="text-sm font-bold text-[#F3EFEA]">🌿 Grama e Flores Silvestres</h4>
                        <p class="text-xs text-[#A39284]">Custo: 10 pts</p>
                    </div>
                    <button onclick="buySanctuaryItem('item', 10, 'Grama e Flores')" class="px-3.5 py-2 bg-[#81B29A] hover:bg-[#68937D] text-[#1A1513] font-bold text-xs rounded-xl transition">
                        Plantar (10 pts)
                    </button>
                </div>

                <!-- Árvore Frutífera -->
                <div class="bg-[#1E1815] p-3.5 rounded-2xl border border-[#3D332C] flex items-center justify-between">
                    <div>
                        <h4 class="text-sm font-bold text-[#F3EFEA]">🍎 Árvore Frutífera</h4>
                        <p class="text-xs text-[#A39284]">Custo: 25 pts</p>
                    </div>
                    <button onclick="buySanctuaryItem('item', 25, 'Árvore Frutífera')" class="px-3.5 py-2 bg-[#E07A5F] hover:bg-[#C9684F] text-white font-bold text-xs rounded-xl transition">
                        Plantar (25 pts)
                    </button>
                </div>

                <!-- Resgatar Coelhinho -->
                <div class="bg-[#1E1815] p-3.5 rounded-2xl border border-[#3D332C] flex items-center justify-between">
                    <div>
                        <h4 class="text-sm font-bold text-[#F3EFEA]">🐰 Resgatar Coelhinho</h4>
                        <p class="text-xs text-[#A39284]">Custo: 30 pts</p>
                    </div>
                    <button onclick="buySanctuaryItem('animal', 30, 'Coelhinho 🐰')" class="px-3.5 py-2 bg-[#E07A5F] hover:bg-[#C9684F] text-white font-bold text-xs rounded-xl transition">
                        Resgatar (30 pts)
                    </button>
                </div>

                <!-- Resgatar Porquinho -->
                <div class="bg-[#1E1815] p-3.5 rounded-2xl border border-[#3D332C] flex items-center justify-between">
                    <div>
                        <h4 class="text-sm font-bold text-[#F3EFEA]">🐷 Resgatar Porquinho</h4>
                        <p class="text-xs text-[#A39284]">Custo: 50 pts</p>
                    </div>
                    <button onclick="buySanctuaryItem('animal', 50, 'Porquinho 🐷')" class="px-3.5 py-2 bg-[#E07A5F] hover:bg-[#C9684F] text-white font-bold text-xs rounded-xl transition">
                        Resgatar (50 pts)
                    </button>
                </div>

                <!-- Resgatar Ave / Frango -->
                <div class="bg-[#1E1815] p-3.5 rounded-2xl border border-[#3D332C] flex items-center justify-between">
                    <div>
                        <h4 class="text-sm font-bold text-[#F3EFEA]">🐔 Resgatar Ave Resgatada</h4>
                        <p class="text-xs text-[#A39284]">Custo: 40 pts</p>
                    </div>
                    <button onclick="buySanctuaryItem('animal', 40, 'Ave Resgatada 🐔')" class="px-3.5 py-2 bg-[#E07A5F] hover:bg-[#C9684F] text-white font-bold text-xs rounded-xl transition">
                        Resgatar (40 pts)
                    </button>
                </div>

                <!-- Resgatar Vaca -->
                <div class="bg-[#1E1815] p-3.5 rounded-2xl border border-[#3D332C] flex items-center justify-between">
                    <div>
                        <h4 class="text-sm font-bold text-[#F3EFEA]">🐮 Resgatar Vaca</h4>
                        <p class="text-xs text-[#A39284]">Custo: 80 pts</p>
                    </div>
                    <button onclick="buySanctuaryItem('animal', 80, 'Vaca 🐮')" class="px-3.5 py-2 bg-[#E07A5F] hover:bg-[#C9684F] text-white font-bold text-xs rounded-xl transition">
                        Resgatar (80 pts)
                    </button>
                </div>

            </div>

        </div>
    `;

    document.body.appendChild(modalOverlay);
}

// 6. Ativa os gatilhadores automáticos ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    initSanctuaryFloatingButton();
    rewardSanctuaryAction('login'); // Ganha pontos ao abrir/logar no app

    // Detecta cliques em buscas de restaurantes/local
    const searchForm = document.querySelector('.hero-search');
    if (searchForm) {
        searchForm.addEventListener('submit', () => rewardSanctuaryAction('search'));
    }

    // Detecta interações de postagem
    document.addEventListener('click', (e) => {
        if (e.target.innerText && e.target.innerText.includes('Publicar')) {
            rewardSanctuaryAction('post');
        }
    });
});
