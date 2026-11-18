const SANCTUARY_CONFIG = {
    costs: {
        'clean_area': { name: 'Limpar área pequena', cost: 30, type: 'item' },
        'soil_bed': { name: 'Arar canteiro', cost: 20, type: 'item' },
        'flowers': { name: 'Plantar flores', cost: 15, type: 'item' },
        'veggies': { name: 'Plantar hortaliças', cost: 20, type: 'item' },
        'tree': { name: 'Plantar árvore', cost: 50, type: 'item' },
        'lake': { name: 'Criar um lago', cost: 100, type: 'item' },
        'rest_area': { name: 'Área de descanso', cost: 100, type: 'item' },
        'pig': { name: 'Porquinho (Amora)', cost: 120, type: 'animal', personality: 'Curiosa e adora carinho na orelha.' },
        'chicken': { name: 'Galinhas (Clotilde e filhotes)', cost: 150, type: 'animal', personality: 'Sempre atentas e liderando o galinheiro.' },
        'duck': { name: 'Patos (Lipe e Pato)', cost: 180, type: 'animal', personality: 'Inseparáveis e adoram banho de sol.' },
        'sheep': { name: 'Ovelha (Lola)', cost: 220, type: 'animal', personality: 'Tranquila, desfruta da sombra das árvores.' },
        'cow': { name: 'Vaca (Estrela)', cost: 300, type: 'animal', personality: 'Dócil, gigante e muito pacífica.' }
    }
};

let userSanctuaryState = { points: 15, items: [], animals: [] };

function initSanctuaryModule() {
    if (document.getElementById('elograin-sanctuary-float')) return;

    const floatBtn = document.createElement('div');
    floatBtn.id = 'elograin-sanctuary-float';
    floatBtn.style.cssText = 'position: fixed; bottom: 88px; right: 20px; z-index: 99999;';
    floatBtn.innerHTML = `
        <button onclick="openSanctuaryDashboard()" style="background: #241A18; color: #F4E7D8; padding: 10px 16px; border-radius: 999px; border: 2px solid #D99A58; box-shadow: 0 8px 24px rgba(0,0,0,0.4); display: flex; align-items: center; gap: 10px; cursor: pointer; font-family: inherit;">
            <span style="font-size: 22px;">🐷</span>
            <div style="text-align: left; line-height: 1.2;">
                <div style="font-size: 10px; text-transform: uppercase; color: #D99A58; font-weight: bold;">Santuário</div>
                <div id="float-sanctuary-pts" style="font-size: 13px; font-weight: 800; color: #FFFFFF;">15 pts</div>
            </div>
        </button>
    `;
    document.body.appendChild(floatBtn);
    loadUserSanctuaryData();
}

async function loadUserSanctuaryData() {
    try {
        if (typeof supabaseClient === 'undefined') return;
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) return;

        let { data: ptsData } = await supabaseClient.from('user_points').select('*').eq('user_id', user.id).single();
        if (ptsData) userSanctuaryState.points = ptsData.total_points;

        let { data: itemsData } = await supabaseClient.from('sanctuary_items').select('*').eq('user_id', user.id);
        if (itemsData) userSanctuaryState.items = itemsData;

        let { data: animalsData } = await supabaseClient.from('sanctuary_animals').select('*').eq('user_id', user.id);
        if (animalsData) userSanctuaryState.animals = animalsData;

        updateSanctuaryFloatUI();
    } catch (e) {
        console.log("Santuário carregado em modo local.");
    }
}

function updateSanctuaryFloatUI() {
    const badge = document.getElementById('float-sanctuary-pts');
    if (badge) badge.innerText = `${userSanctuaryState.points} pts`;
}

function openSanctuaryDashboard() {
    const existing = document.getElementById('sanctuary-modal-container');
    if (existing) existing.remove();

    let itemsHTML = userSanctuaryState.items.length === 0
        ? '<p style="font-size: 12px; color: #A39284; font-style: italic;">O terreno está vazio. Use pontos para plantar e cultivar!</p>'
        : userSanctuaryState.items.map(i => `<span style="padding: 6px 12px; background: #241A18; color: #D99A58; border-radius: 12px; font-size: 12px; font-weight: 600; border: 1px solid rgba(217,154,88,0.3);">🌿 ${i.item_name}</span>`).join('');

    let animalsHTML = userSanctuaryState.animals.length === 0
        ? '<p style="font-size: 12px; color: #A39284; font-style: italic;">Nenhum morador resgatado ainda. Conquiste pontos para acolher o primeiro animal!</p>'
        : userSanctuaryState.animals.map(a => `
            <div style="background: #241A18; padding: 12px; border-radius: 16px; border: 1px solid rgba(217,154,88,0.4); display: flex; align-items: center; gap: 10px; text-align: left;">
                <span style="font-size: 20px;">✨</span>
                <div>
                    <h5 style="margin: 0; font-size: 13px; font-weight: bold; color: #F4E7D8;">${a.animal_name}</h5>
                    <p style="margin: 2px 0 0; font-size: 11px; color: #D99A58; font-style: italic;">"${a.personality}"</p>
                </div>
            </div>
        `).join('');

    const storeItems = [
        { key: 'flowers', label: '🌿 Plantar Flores', cost: 15, btnText: 'Plantar', color: '#777C50' },
        { key: 'tree', label: '🍎 Árvore Frutífera', cost: 50, btnText: 'Plantar', color: '#F0784E' },
        { key: 'pig', label: '🐷 Porquinho (Amora)', cost: 120, btnText: 'Acolher', color: '#F0784E' },
        { key: 'chicken', label: '🐔 Galinhas (Clotilde)', cost: 150, btnText: 'Acolher', color: '#F0784E' },
        { key: 'cow', label: '🐮 Vaca (Estrela)', cost: 300, btnText: 'Acolher', color: '#F0784E' }
    ];

    const storeHTML = storeItems.map(item => `
        <div style="background: #1A1513; padding: 12px; border-radius: 16px; border: 1px solid #3D332C; display: flex; align-items: center; justify-content: space-between; gap: 8px;">
            <div>
                <h4 style="margin: 0; font-size: 13px; font-weight: bold; color: #F4E7D8;">${item.label}</h4>
                <p style="margin: 2px 0 0; font-size: 11px; color: #A39284;">Custo: ${item.cost} pts</p>
            </div>
            <button onclick="buySanctuaryStoreItem('${item.key}')" style="padding: 8px 14px; background: ${item.color}; color: #FFF; border: none; border-radius: 12px; font-weight: bold; font-size: 12px; cursor: pointer;">
                ${item.btnText}
            </button>
        </div>
    `).join('');

    const modal = document.createElement('div');
    modal.id = 'sanctuary-modal-container';
    modal.style.cssText = 'position: fixed; inset: 0; z-index: 999999; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 16px;';
    
    modal.innerHTML = `
        <div style="background: #241A18; border: 2px solid #D99A58; width: 100%; max-width: 720px; border-radius: 24px; padding: 24px; color: #F4E7D8; box-shadow: 0 20px 40px rgba(0,0,0,0.6); max-height: 90vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 16px; border-bottom: 1px solid #3D332C;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="font-size: 28px;">🏡🐷</span>
                    <div>
                        <h2 style="margin: 0; font-size: 18px; font-weight: bold;">Santuário EloGrain</h2>
                        <p style="margin: 2px 0 0; font-size: 12px; color: #D99A58;">Cada atitude cultiva um novo começo.</p>
                    </div>
                </div>
                <button onclick="document.getElementById('sanctuary-modal-container').remove()" style="width: 34px; height: 34px; border-radius: 50%; background: #3D332C; color: #FFF; border: none; font-weight: bold; cursor: pointer;">✕</button>
            </div>

            <div style="margin: 20px 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px;">
                <div style="background: #1A1513; padding: 14px; border-radius: 16px; border: 1px solid #3D332C; text-align: center;">
                    <span style="font-size: 11px; text-transform: uppercase; color: #A39284; font-weight: bold;">Saldo Disponível</span>
                    <h3 style="margin: 4px 0 0; font-size: 24px; font-weight: 900; color: #F0784E;">${userSanctuaryState.points} pts</h3>
                </div>
                <div style="background: #1A1513; padding: 14px; border-radius: 16px; border: 1px solid #3D332C; display: flex; align-items: center; justify-content: center;">
                    <button onclick="alert('COMO GANHAR PONTOS:\\n• Publicação válida: +20 pts\\n• Compartilhar receita: +25 pts\\n• Comentar: +5 pts\\n• Pesquisar produto/local: +3 pts\\n• Usar o Chatbot: +5 pts')" style="width: 100%; padding: 10px; background: #D99A58; color: #241A18; border: none; border-radius: 12px; font-weight: 800; font-size: 12px; cursor: pointer;">
                        📖 Como Ganhar Pontos
                    </button>
                </div>
            </div>

            <div style="margin-bottom: 20px; background: #1A1513; border: 2px dashed #777C50; border-radius: 20px; padding: 20px; text-align: center;">
                <span style="font-size: 11px; color: #D99A58; text-transform: uppercase; font-weight: bold;">🌾 Seu Terreno e Habitantes</span>
                <div style="margin: 16px 0; display: flex; flex-wrap: wrap; justify-content: center; gap: 8px;">${itemsHTML}</div>
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #3D332C; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">${animalsHTML}</div>
            </div>

            <h3 style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: #D99A58; margin-bottom: 12px;">🌱 Loja do Santuário</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 10px;">${storeHTML}</div>
        </div>
    `;
    document.body.appendChild(modal);
}

async function buySanctuaryStoreItem(itemKey) {
    const itemInfo = SANCTUARY_CONFIG.costs[itemKey];
    if (!itemInfo) return;

    if (userSanctuaryState.points < itemInfo.cost) {
        alert("Você precisa de mais pontos. Continue participando do EloGrain para cultivar seu santuário!");
        return;
    }

    userSanctuaryState.points -= itemInfo.cost;

    try {
        if (typeof supabaseClient !== 'undefined') {
            const { data: { user } } = await supabaseClient.auth.getUser();
            if (user) {
                await supabaseClient.from('user_points').update({ total_points: userSanctuaryState.points }).eq('user_id', user.id);

                if (itemInfo.type === 'animal') {
                    await supabaseClient.from('sanctuary_animals').insert({
                        user_id: user.id,
                        animal_type: itemKey,
                        animal_name: itemInfo.name,
                        personality: itemInfo.personality
                    });
                    userSanctuaryState.animals.push({ animal_name: itemInfo.name, personality: itemInfo.personality });
                } else {
                    await supabaseClient.from('sanctuary_items').insert({
                        user_id: user.id,
                        item_type: itemKey,
                        item_name: itemInfo.name,
                        purchase_cost: itemInfo.cost
                    });
                    userSanctuaryState.items.push({ item_name: itemInfo.name });
                }
            }
        }
    } catch (e) {
        console.error("Erro ao sincronizar compra com Supabase", e);
    }

    updateSanctuaryFloatUI();
    openSanctuaryDashboard();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSanctuaryModule);
} else {
    initSanctuaryModule();
}
