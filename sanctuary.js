// ==========================================
// MÓDULO DA ABA SANTUÁRIO ELO-GRAIN (MINIFAZENDA)
// ==========================================

function getSanctuaryData() {
    var data = localStorage.getItem('elograin_sanctuary_game');
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

// Função global para adicionar pontos de qualquer lugar do app
window.addSanctuaryPoints = function(amount, actionName) {
    var data = getSanctuaryData();
    data.points += amount;
    saveSanctuaryData(data);
    updateSanctuaryUI();
};

function updateSanctuaryUI() {
    var data = getSanctuaryData();
    
    // Atualiza saldo na aba se estiver aberta
    var ptsEl = document.getElementById('sanctuary-user-points');
    if (ptsEl) ptsEl.innerText = data.points + ' pts';

    // Atualiza imagem do terreno conforme itens/animais
    var imgEl = document.getElementById('sanctuary-active-img');
    if (imgEl) {
        if (data.animals.length > 0) {
            var lastAnimal = data.animals[data.animals.length - 1];
            if (lastAnimal.name.indexOf('Vaca') !== -1) {
                imgEl.src = 'img/vaca_patos.jpg';
            } else if (lastAnimal.name.indexOf('Galinha') !== -1) {
                imgEl.src = 'img/galinhas.jpg';
            } else {
                imgEl.src = 'img/porquinho.jpg';
            }
        } else if (data.items.length > 0) {
            imgEl.src = 'img/jardim_cultivado.jpg';
        } else {
            imgEl.src = 'img/terreno_inicial.jpg';
        }
    }

    // Atualiza inventário visual na tela
    var invEl = document.getElementById('sanctuary-inventory-items');
    if (invEl) {
        if (data.items.length === 0 && data.animals.length === 0) {
            invEl.innerHTML = '<span style="color: #A39284; font-style: italic; font-size: 12px;">O terreno está vazio e pronto para ser cultivado. 🌱</span>';
        } else {
            var html = '';
            data.items.forEach(function(i) {
                html += '<span style="padding: 6px 12px; background: #241A18; color: #D99A58; border-radius: 12px; font-size: 11px; font-weight: 600; border: 1px solid rgba(217,154,88,0.3);">🌿 ' + i.name + '</span>';
            });
            data.animals.forEach(function(a) {
                html += '<span style="padding: 6px 12px; background: #241A18; color: #F0784E; border-radius: 12px; font-size: 11px; font-weight: 600; border: 1px solid rgba(240,120,78,0.4);">✨ ' + a.name + '</span>';
            });
            invEl.innerHTML = html;
        }
    }
}

// Lógica de compra na loja do Santuário
window.buySanctuaryItem = function(key, cost, name) {
    var data = getSanctuaryData();
    if (data.points < cost) {
        alert("Ops! Você precisa de mais pontos. Continue interagindo no EloGrain para acumular pontos!");
        return;
    }

    data.points -= cost;
    
    if (key === 'pig' || key === 'chicken') {
        data.animals.push({ name: name, personality: 'Acolhido com amor no santuário.' });
        alert('🎉 Parabéns! ' + name + ' foi resgatado e agora vive livre e seguro no seu santuário!');
    } else {
        data.items.push({ name: name });
        alert('🌿 Sucesso! ' + name + ' foi cultivado no terreno.');
    }

    saveSanctuaryData(data);
    updateSanctuaryUI();
};

// Interceptador para dar pontos em ações do app
document.addEventListener('click', function(e) {
    var text = e.target.innerText || '';
    if (text.includes('Publicar') || text.includes('Criar publicação')) {
        window.addSanctuaryPoints(20, 'Nova publicação');
    }
    if (text.includes('Compartilhar receita') || text.includes('Salvar receita')) {
        window.addSanctuaryPoints(25, 'Receita compartilhada');
    }
});

// Atualiza a UI sempre que a aba do santuário for aberta
document.addEventListener('click', function(e) {
    if (e.target && e.target.innerText && e.target.innerText.includes('Santuário')) {
        setTimeout(updateSanctuaryUI, 100);
    }
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateSanctuaryUI);
} else {
    updateSanctuaryUI();
}
