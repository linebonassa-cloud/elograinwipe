// ==========================================
// MÓDULO VISUAL: SANTUÁRIO ELO-GRAIN (MINIFAZENDA)
// ==========================================

const SANCTUARY_CONFIG = {
    costs: {
        'flowers': { name: 'Plantar Flores', cost: 15, type: 'item', desc: 'Flores silvestres e canteiros.' },
        'tree': { name: 'Árvore Frutífera', cost: 50, type: 'item', desc: 'Sombra fresca e frutos.' },
        'pig': { name: 'Porquinho (Amora)', cost: 120, type: 'animal', personality: 'Curiosa e adora carinho na orelha.' },
        'chicken': { name: 'Galinhas (Clotilde)', cost: 150, type: 'animal', personality: 'Sempre atentas e liderando o galinheiro.' },
        'duck': { name: 'Patos (Lipe e Pato)', cost: 180, type: 'animal', personality: 'Inseparáveis e adoram banho de sol.' },
        'cow': { name: 'Vaca (Estrela)', cost: 300, type: 'animal', personality: 'Dócil, gigante e muito pacífica.' }
    }
};

// Gerenciamento de Dados Local
function getSanctuaryData() {
    let data = localStorage.getItem('elograin_sanctuary_game');
    if (!data) {
        data = { points: 50, items: [], animals: [] };
        localStorage.setItem('elograin_sanctuary_game', JSON.stringify(data));
        return data;
    }
    return JSON.parse(data);
}

function saveSanctuaryData(data) {
    localStorage.setItem('elograin_sanctuary_game', JSON.stringify(data));
}

// Adicionar pontos por interações no app
window.addSanctuaryPoints = function(amount, actionName) {
    let data = getSanctuaryData();
    data.points += amount;
    saveSanctuaryData(data);
    updateSanctuaryFloatUI();
    showToastNotification(`🌱 +${amount} pts: ${actionName}`);
};

function showToastNotification(text) {
    const toast = document.createElement('div');
    toast.style.cssText = 'position: fixed; bottom: 90px; right: 20px; z-index: 999999; background: #D99A58; color: #241A18; padding: 10px 16px; border-radius: 12px; font-weight: bold; font-size: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);';
    toast.innerText = text;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Inicializa o Botão Flutuante
function initSanctuaryModule() {
    if (document.getElementById('elograin-sanctuary-float')) return;
    let data = getSanctuaryData();

    const floatBtn = document.createElement('div');
    floatBtn.id = 'elograin-sanctuary-float';
    floatBtn.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 99999;';
    floatBtn.innerHTML = `
        <button onclick="openSanctuaryDashboard()" style="background: #241A18; color: #F4E7D8; padding: 10px 18px; border-radius: 999px; border: 2px solid #D99A58; box-shadow: 0 8px 24px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 10px; cursor: pointer;">
            <span style="font-size: 22px;">🐷</span>
            <div style="text-align: left; line-height: 1.2;">
                <div style="font-size: 9px; text-transform: uppercase; color: #D99A58; font-weight: bold;">Santuário</div>
                <div id="float-sanctuary-pts" style="font-size: 13px; font-weight: 800; color: #FFFFFF;">${data.points} pts</div>
            </div>
        </button>
    `;
    document.body.appendChild(floatBtn);
}

function updateSanctuaryFloatUI() {
    let data = getSanctuaryData();
    const badge = document.getElementById('float-sanctuary-pts');
    if (badge) badge.innerText = `${data.points} pts`;
}

// Seleciona a imagem visual começando obrigatoriamente pelo terreno vazio
function getSanctuaryVisualImage(data) {
    if (data.animals.some(function(a) { return a.animal_name.includes('Vaca') || a.animal_name.includes('Patos'); })) {
        return 'img/vaca_patos.jpg';[cite: 14]
    }
    if (data.animals.some(function(a) { return a.animal_name.includes('Galinhas'); })) {
        return 'img/galinhas.jpg';[cite: 13]
    }
    if (data.animals.some(function(a) { return a.animal_name.includes('Porquinho'); })) {
        return 'img/porquinho.jpg';[cite: 12]
    }
    if (data.items.some(function(i) { return i.item_name.includes('Frutífera') || i.item_name.includes('Flores'); })) {
        return 'img/jardim_cultivado.jpg';[cite: 15]
    }
    if (data.items.length > 0) {
        return 'img/terra_arada.jpg';[cite: 14]
    }
    return 'img/terreno_inicial.jpg';[cite: 13]
}

// Abre o Painel Visual do Santuário
window.openSanctuaryDashboard = function() {
    let data = getSanctuaryData();
    const existing = document.getElementById('sanctuary-modal-container');
    if (existing) existing.remove();

    let currentImage = getSanctuaryVisualImage(data);

    let itemsHTML = data.items.length === 0
        ? '<span style="color: #A39284; font-style: italic; font-size: 12px;">O terreno está vazio e pronto para ser cultivado. Escolha uma opção na loja! 🌱</span>'
        : data.items.map(function(i) { return '<span style="padding: 4px 10px; background: #241A18; color: #D99A58; border-radius: 10px; font-size: 11px; font-weight: 600; border: 1px solid rgba(217,154,88,0.3);">🌿 ' + i.item_name + '</span>'; }).join('');

    let animalsHTML = data.animals.length === 0
        ? '<span style="color: #A39284; font-style: italic; font-size: 12px;">Nenhum morador resgatado ainda. Junte pontos para acolher o primeiro animal!</span>'
        : data.animals.map(function(a) { 
            return '<div style="background: #241A18; padding: 10px 14px; border-radius: 14px; border: 1px solid rgba(217,154,88,0.4); display: flex; align-items: center; gap: 10px; text-align: left;"><span style="font-size: 22px;">✨</span><div><h5 style="margin: 0; font-size: 12px; font-weight: bold; color: #F4E7D8;">' + a.animal_name + '</h5><p style="margin: 2px 0 0; font-size: 10px; color: #D99A58; font-style: italic;">"' + a.personality + '"</p></div></div>'; 
        }).join('');

    const storeItems = [
        { key: 'flowers', label: '🌿 Plantar Flores', cost: 15, btnText: 'Plantar', color: '#777C50' },
        { key: 'tree', label: '🍎 Árvore Frutífera', cost: 50, btnText: 'Plantar', color: '#F0784E' },
        { key: 'pig', label: '🐷 Porquinho (Amora)', cost: 120, btnText: 'Acolher', color: '#F0784E' },
        { key: 'chicken', label: '🐔 Galinhas (Clotilde)', cost: 150, btnText: 'Acolher', color: '#F0784E' },
        { key: 'duck', label: '🦆 Patos', cost: 180, btnText: 'Acolher', color: '#F0784E' },
        { key: 'cow', label: '🐮 Vaca (Estrela)', cost: 300, btnText: 'Acolher', color: '#F0784E' }
    ];

    let storeHTML = storeItems.map(function(item) {
        return '<div style="background: #1A1513; padding: 12px; border-radius: 14px; border: 1px solid #3D332C; display: flex; align-items: center; justify-content: space-between; gap: 8px;"><div><h4 style="margin: 0; font-size: 12px; font-weight: bold; color: #F4E7D8;">' + item.label + '</h4><p style="margin: 2px 0 0; font-size: 10px; color: #A39284;">Custo: <span style="color: #D99A58;">' + item.cost + ' pts</span></p></div><button onclick="buySanctuaryStoreItem(\'' + item.key + '\')" style="padding: 6px 12px; background: ' + item.color + '; color: #FFF; border: none; border-radius: 10px; font-weight: 800; font-size: 11px; cursor: pointer;">' + item.btnText + '</button></div>';
    }).join('');

    const modal = document.createElement('div');
    modal.id = 'sanctuary-modal-container';
    modal.style.cssText = 'position: fixed; inset: 0; z-index: 999999; background: rgba(0,0,0,0.8); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 16px;';
    
    modal.innerHTML = `
        <div style="background: #241A18; border: 2px solid #D99A58; width: 100%; max-width: 780px; border-radius: 28px; padding: 24px; color: #F4E7D8; box-shadow: 0 24px 48px rgba(0,0,0,0.7); max-height: 90vh; overflow-y: auto;">
            
            <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 14px; border-bottom: 1px solid #3D332C;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="background: rgba(217,154,88,0.15); padding: 8px; border-radius: 14px; font-size: 22px;">🏡🐷</div>
                    <div>
                        <h2 style="margin: 0; font-size: 18px; font-weight: bold;">Santuário EloGrain</h2>
                        <p style="margin: 2px 0 0; font-size: 11px; color: #D99A58; font-style: italic;">Cada atitude cultiva um novo começo.</p>
                    </div>
                </div>
                <button onclick="document.getElementById('sanctuary-modal-container').remove()" style="width: 34px; height: 34px; border-radius: 50%; background: #3D332C; color: #FFF; border: none; font-weight: bold; cursor: pointer;">✕</button>
            </div>

            <div style="margin: 16px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div style="background: #1A1513; padding: 12px; border-radius: 16px; border: 1px solid #3D332C; text-align: center;">
                    <span style="font-size: 10px; text-transform: uppercase; color: #777C50; font-weight: 800;">Saldo Disponível</span>
                    <h3 style="margin: 4px 0 0; font-size: 22px; font-weight: 900; color: #F0784E;">${data.points} pts</h3>
                </div>
                <div style="background: #1A1513; padding: 12px; border-radius: 16px; border: 1px solid #3D332C; display: flex; align-items: center; justify-content: center;">
                    <button onclick="alert('ℹ️ COMO GANHAR PONTOS:\\n• Fazer publicação: +20 pts\\n• Compartilhar receita: +25 pts\\n• Comentar: +5 pts\\n• Pesquisar produto/local: +3 pts\\n• Usar o Chatbot: +5 pts')" style="width: 100%; padding: 10px; background: #D99A58; color: #241A18; border: none; border-radius: 12px; font-weight: 800; font-size: 11px; cursor: pointer;">
                        📖 Como Ganhar Pontos
                    </button>
                </div>
            </div>

            <!-- ILUSTRAÇÃO VISUAL DA FAZENDA COM ANIMAÇÃO DE CRESCIMENTO -->
            <div style="margin-bottom: 20px; background: #1A1513; border: 2px solid #777C50; border-radius: 20px; overflow: hidden; text-align: center; box-shadow: 0 8px 24px rgba(0,0,0,0.4);">
                <div style="background: #241A18; padding: 8px; font-size: 11px; color: #D99A58; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                    🌾 Visual Atual do seu Santuário
                </div>
                <div id="sanctuary-image-wrapper" style="position: relative; overflow: hidden;">
                    <img id="sanctuary-main-img" src="${currentImage}" alt="Santuário EloGrain" style="width: 100%; max-height: 280px; object-fit: cover; display: block; transition: opacity 0.6s ease-in-out, transform 0.6s ease-in-out;" />
                </div>
                <div style="padding: 12px; background: #1A1513; display: flex; flex-wrap: wrap; justify-content: center; gap: 8px;">
                    ${itemsHTML}
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <h3 style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: #D99A58; margin-bottom: 8px;">✨ Moradores do Santuário</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px;">
                    ${animalsHTML}
                </div>
            </div>

            <h3 style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: #D99A58; margin-bottom: 8px;">🌱 Loja do Santuário</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 10px;">
                ${storeHTML}
            </div>

        </div>
    `;
    document.body.appendChild(modal);
}

// Animação visual de crescimento ao plantar/acolher
function playGrowingAnimation(callback) {
    const imgElement = document.getElementById('sanctuary-main-img');
    if (!imgElement) {
        if (callback) callback();
        return;
    }

    // Efeito de transição de foco (zoom leve e fade out)
    imgElement.style.transform = 'scale(0.95)';
    imgElement.style.opacity = '0.3';

    setTimeout(function() {
        if (callback) callback();
        // Restaura com zoom in elegante revelando a nova fase da fazenda
        const newImg = document.getElementById('sanctuary-main-img');
        if (newImg) {
            newImg.style.transform = 'scale(1)';
            newImg.style.opacity = '1';
        }
    }, 600);
}

// Compra de Itens e Animais com Animação
window.buySanctuaryStoreItem = async function(itemKey) {
    let data = getSanctuaryData();
    const itemInfo = SANCTUARY_CONFIG.costs[itemKey];
    if (!itemInfo) return;

    if (data.points < itemInfo.cost) {
        alert("Ops! Você precisa de mais pontos. Continue participando ativamente do EloGrain para cultivar o santuário!");
        return;
    }

    data.points -= itemInfo.cost;

    if (itemInfo.type === 'animal') {
        data.animals.push({ animal_name: itemInfo.name, personality: itemInfo.personality });
    } else {
        data.items.push({ item_name: itemInfo.name });
    }

    saveSanctuaryData(data);
    updateSanctuaryFloatUI();

    // Executa a animação visual antes de atualizar o modal
    playGrowingAnimation(function() {
        openSantraryDashboardSilently();
    });

    if (itemInfo.type === 'animal') {
        alert(`🎉 Parabéns! Você acolheu ${itemInfo.name} no seu Santuário! Agora ele tem um lar seguro.`);
    } else {
        alert(`🌿 A semente brotou! "${itemInfo.name}" cresceu, floresceu e deu frutos no seu terreno.`);
    }
};

function openSantraryDashboardSilently() {
    const existing = document.getElementById('sanctuary-modal-container');
    if (existing) existing.remove();
    window.openSanctuaryDashboard();
}

// Gatilho de pontuação
document.addEventListener('click', function(e) {
    const text = e.target.innerText || '';
    if (text.includes('Publicar') || text.includes('Criar publicação')) {
        window.addSanctuaryPoints(20, 'Nova publicação');
    }
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSanctuaryModule);
} else {
    initSanctuaryModule();
}
