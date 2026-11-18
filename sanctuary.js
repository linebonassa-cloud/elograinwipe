// Função para criar o HTML do Santuário do Porquinho dinamicamente
function renderSanctuaryWidget(containerId, level = 1, rescuedCount = 2) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const stages = {
        1: { title: "Terra Fértil & Brotos", icon: "🌱", desc: "Seu santuário está começando a florescer." },
        2: { title: "Bosque em Crescimento", icon: "🌳", desc: "A vegetação ganha força e vida." },
        3: { title: "Santuário Pleno", icon: "🏡🐷", desc: "Um refúgio seguro e cheio de vida!" }
    };

    const currentStage = stages[level] || stages[1];

    container.innerHTML = `
        <div class="w-full bg-[#2A2421] border border-[#3D332C] rounded-2xl p-5 mb-6 text-[#F3EFEA] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-[#3D332C] flex items-center justify-center text-2xl shadow-inner">
                    ${currentStage.icon}
                </div>
                <div>
                    <span class="text-xs uppercase tracking-wider text-[#A39284] font-medium">
                        Seu Santuário EloGrain
                    </span>
                    <h3 class="text-lg font-bold text-[#F3EFEA] flex items-center gap-2 mt-0.5">
                        ${currentStage.title}
                    </h3>
                    <p class="text-sm text-[#C4B5A5] mt-0.5">
                        <strong class="text-[#E07A5F]">${rescuedCount} animais salvos</strong> — conforme você participa, mais vidas encontram um lar. Os animais agradecem! 🐷💚
                    </p>
                </div>
            </div>
            <button id="btn-view-sanctuary" class="w-full md:w-auto px-5 py-2.5 bg-[#E07A5F] hover:bg-[#D06A4F] text-white rounded-xl font-medium text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer">
                Ver meu Jardim
            </button>
        </div>
    `;

    // Evento do botão
    document.getElementById('btn-view-sanctuary').addEventListener('click', () => {
        alert("Abrir visualização completa do Santuário!");
    });
}
