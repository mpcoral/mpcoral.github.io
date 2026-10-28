document.addEventListener("DOMContentLoaded", () => {
    const elementCards = document.querySelectorAll(".element-card");

    const detailSection = document.getElementById("element-detail");
    const detailTitle = document.getElementById("element-detail-title");
    const detailDescription = document.getElementById("element-detail-description");
    const detailIndex = document.getElementById("element-detail-index");
    const detailMedia = document.getElementById("element-detail-media");

    if (
        !elementCards.length ||
        !detailSection ||
        !detailTitle ||
        !detailDescription ||
        !detailIndex ||
        !detailMedia
    ) {
        return;
    }

    // ==========================================
    // SISTEMAS COM VÍDEOS
    // Cada chave corresponde ao data-system de um card no pirate.html.
    // O título e a descrição do card ficam no próprio HTML.
    // ==========================================

    const systems = {
        "wave-system": {
            context: "WAVE SYSTEM / PRESENTATION",

            presentationSummary:
                "Nesta apresentação, você vai conhecer uma parte do sistema " +
                "de ondas de inimigos e entender como ela participa do funcionamento " +
                "do jogo. A explicação detalhada poderá ser consultada em seguida.",

            presentationExtra:
                "Você está vendo mais detalhes! Este é o espaço reservado para a " +
                "explicação completa do vídeo. Aqui poderemos apresentar as etapas " +
                "do Blueprint, suas funções e a lógica utilizada no sistema.",

            videos: [
                {
                    file: "gm-core-2x.mp4",
                    number: "01",
                    title: "GM Core",
                    description:
                        "A lógica central do sistema de ondas, incluindo o fluxo " +
                        "de execução e a organização das etapas.",
                    label: "GAME MODE · WAVE LOGIC"
                },
                {
                    file: "enemy-spawn-2x.mp4",
                    number: "02",
                    title: "Enemy Spawn",
                    description:
                        "A configuração dos spawners e a lógica utilizada " +
                        "para definir a quantidade e a seleção dos inimigos.",
                    label: "BLUEPRINTS · ENEMY SPAWN"
                },
                {
                    file: "spawning-2x.mp4",
                    number: "03",
                    title: "Sistema em execução",
                    description:
                        "Demonstração prática do nascimento dos inimigos " +
                        "e da distribuição das ondas durante o gameplay.",
                    label: "GAMEPLAY · WAVE SYSTEM"
                }
            ]
        },

        "enemy-ai": {
            context: "ENEMY AI / PRESENTATION",

            presentationSummary:
                "Nesta apresentação, você vai conhecer como os inimigos decidem " +
                "o que atacar e como o navio se torna um objetivo a ser defendido " +
                "durante a partida.",

            presentationExtra:
                "Cada inimigo procura um Target Spot livre ao redor do navio e o " +
                "reserva para si. Se todos estiverem ocupados, ele passa a perseguir " +
                "o jogador. Ao chegar, vira na direção indicada pelo Spot e ataca; " +
                "quando morre, o Spot é liberado para outro inimigo. Por conta própria, " +
                "estendi o ataque para também causar dano ao navio e liguei a " +
                "destruição dele à tela de derrota.",

            videos: [
                {
                    file: "enemy-target-spots.mp4",
                    number: "01",
                    title: "Escolha do alvo",
                    description:
                        "O AI Controller encontra os Target Spots ao redor do navio, " +
                        "reserva um ponto livre e usa o jogador como alvo quando não há espaço.",
                    label: "AI CONTROLLER · TARGET SPOTS"
                },
                {
                    file: "enemy-attack-trace.mp4",
                    number: "02",
                    title: "Ataque ao navio",
                    description:
                        "O golpe do inimigo usa um Line Trace e aplica dano " +
                        "quando atinge o jogador ou o navio.",
                    label: "BLUEPRINTS · ENEMY ATTACK"
                },
                {
                    file: "ship-defense-gameplay.mp4",
                    number: "03",
                    title: "Defesa em ação",
                    description:
                        "Os inimigos surgem, cercam o navio e atacam " +
                        "enquanto o jogador defende a posição.",
                    label: "GAMEPLAY · SHIP DEFENSE"
                }
            ]
        },

        "store": {
            context: "STORE / PRESENTATION",

            presentationSummary:
                "Nesta apresentação, você vai ver a loja em funcionamento: o jogador " +
                "abre o Merchant durante a partida e troca as moedas coletadas por " +
                "vida, munição e barris explosivos.",

            presentationExtra:
                "Os produtos ficam em uma Data Table, com descrição, preço e quantidade " +
                "de cada item, então mudar um preço não exige mexer na lógica. Ao clicar " +
                "em um produto, a função CanBuy verifica se o jogador tem moedas " +
                "suficientes; se tiver, o valor é descontado e o item é entregue, com a " +
                "vida chegando ao personagem por uma Blueprint Interface, sem Cast. " +
                "Enquanto a loja está aberta, o jogador não pode atacar.",

            videos: [
                {
                    file: "store.mp4",
                    number: "01",
                    title: "Loja em ação",
                    description:
                        "O jogador abre a loja e compra vida, munição e barril explosivo, " +
                        "com as moedas sendo descontadas a cada compra.",
                    label: "GAMEPLAY · STORE"
                }
            ]
        },

        "interaction": {
            context: "INTERACTION SYSTEM / PRESENTATION",

            presentationSummary:
                "Nesta apresentação, você vai conhecer o sistema que permite ao " +
                "jogador interagir com objetos do mundo, desde beber uma bebida " +
                "até carregar o baú de ouro até o navio.",

            presentationExtra:
                "Toda a lógica fica em um Actor Component adicionado ao jogador, " +
                "separada do personagem. Os objetos herdam de uma classe base e " +
                "implementam uma Blueprint Interface, então o jogador conversa com " +
                "qualquer um deles sem Cast. Um Sphere Trace a partir da câmera " +
                "confirma qual objeto está na mira, e um Enum define se a interação " +
                "é um toque ou se o botão precisa ser segurado, com uma barra de " +
                "progresso. Entregar o baú ao navio é o que inicia a partida.",

            videos: [
                {
                    file: "interaction-detection.mp4",
                    number: "01",
                    title: "Detectar e mirar",
                    description:
                        "O InteractionComponent registra os objetos próximos e usa um " +
                        "Sphere Trace da câmera para mostrar o botão só no objeto em foco.",
                    label: "ACTOR COMPONENT · INTERACTION"
                },
                {
                    file: "interaction-types.mp4",
                    number: "02",
                    title: "Tipos de interação",
                    description:
                        "Uma Blueprint Interface e um Enum definem se o objeto é usado " +
                        "com um toque ou segurando o botão, como a bebida e o baú.",
                    label: "INTERFACE · PRESS & HOLD"
                },
                {
                    file: "chest-to-ship.mp4",
                    number: "03",
                    title: "Do baú ao navio",
                    description:
                        "O jogador carrega o baú, com as ações limitadas, e o entrega " +
                        "ao navio para iniciar as ondas de inimigos.",
                    label: "GAMEPLAY · GOLD CHEST"
                }
            ]
        },

        "explosive-barrel": {
            context: "EXPLOSIVE BARREL / PRESENTATION",

            presentationSummary:
                "Nesta apresentação, você vai ver o ciclo completo do barril " +
                "explosivo: posicionar no mapa os barris comprados na loja e " +
                "usá-los contra os inimigos.",

            presentationExtra:
                "Com a tecla 1, o jogador entra no modo de posicionamento: um barril " +
                "provisório acompanha o ponto para onde a câmera aponta, e o ataque " +
                "confirma a posição, criando o barril real. A quantidade disponível vem " +
                "dos barris comprados, consultada por uma Blueprint Interface; sem " +
                "barris, um som de erro avisa o jogador. Ao receber dano, o barril " +
                "aplica dano em área e um Radial Force, e a colisão do ragdoll dos " +
                "inimigos foi ajustada para que eles sejam lançados pela explosão.",

            videos: [
                {
                    file: "barrel-placement.mp4",
                    number: "01",
                    title: "Posicionamento",
                    description:
                        "O modo de posicionamento usa um trace da câmera para mover um barril " +
                        "provisório e confirma a colocação com o ataque.",
                    label: "INTERACTION COMPONENT · SETTING"
                },
                {
                    file: "barrel-explosion.mp4",
                    number: "02",
                    title: "Explosão",
                    description:
                        "O barril aplica dano em área e força radial, lançando os " +
                        "inimigos atingidos pela explosão.",
                    label: "BLUEPRINTS · RADIAL DAMAGE"
                }
            ]
        },

        "menus": {
            context: "GAME MENUS / PRESENTATION",

            presentationSummary:
                "Nesta apresentação, você vai acompanhar o caminho do jogador pelas " +
                "telas do jogo: do menu principal à partida, passando pelas " +
                "configurações, pela pausa e pelo fim de jogo.",

            presentationExtra:
                "O menu principal fica em um mapa próprio, com um Game Mode e uma HUD " +
                "exclusivos, sem criar o personagem jogável. Entre os mapas, uma tela " +
                "de loading assíncrona evita que o jogo pareça travado. A pausa é " +
                "controlada pelo PlayerController, e a tela de vitória é disparada por " +
                "um Event Dispatcher quando as ondas terminam. Todos os menus usam o " +
                "mesmo botão reutilizável, com animação e som de hover.",

            videos: [
                {
                    file: "menu-flow.mp4",
                    number: "01",
                    title: "Fluxo das telas",
                    description:
                        "Menu principal, configurações gráficas, loading, pausa e " +
                        "tela de derrota, todos conectados.",
                    label: "UI · GAME FLOW"
                }
            ]
        }
    };

    // ==========================================
    // CRIA OS CARDS DOS VÍDEOS DE UM SISTEMA
    // ==========================================

    function renderSystemVideos(system, systemTitle) {
        detailMedia.replaceChildren();
        detailMedia.classList.add("system-videos");

        system.videos.forEach((item) => {
            const card = document.createElement("article");
            card.className = "system-video-card";

            // CABEÇALHO DO CARD

            const heading = document.createElement("div");
            heading.className = "system-video-heading";

            const number = document.createElement("span");
            number.className = "system-video-number mono";
            number.textContent = item.number;

            const textContainer = document.createElement("div");

            const title = document.createElement("h4");
            title.className = "system-video-title";
            title.textContent = item.title;

            const description = document.createElement("p");
            description.className = "system-video-description";
            description.textContent = item.description;

            textContainer.append(title, description);
            heading.append(number, textContainer);

            // PLAYER DO VÍDEO

            const video = document.createElement("video");

            video.className = "system-video-player";
            video.controls = true;
            video.preload = "metadata";
            video.playsInline = true;

            video.setAttribute(
                "aria-label",
                `Abrir apresentação ampliada: ${item.title}`
            );

            // O clique abre a apresentação ampliada
            // (ver js/video-presentation.js).
            Object.assign(video.dataset, {
                presentation: "",
                title: item.title,
                summary: system.presentationSummary,
                extra: system.presentationExtra,
                eyebrow: "DETALHES DO SISTEMA",
                context: system.context || `${systemTitle.toUpperCase()} / PRESENTATION`,
                label: item.label,
                number: item.number,
                total: String(system.videos.length),
                footer: "MIGUEL CORAL · UNREAL ENGINE 5"
            });

            const source = document.createElement("source");

            source.src = `../assets/pirate/videos/${item.file}`;
            source.type = "video/mp4";

            video.appendChild(source);

            video.appendChild(
                document.createTextNode(
                    "Seu navegador não suporta a reprodução de vídeo."
                )
            );

            // RODAPÉ DO CARD

            const footer = document.createElement("div");
            footer.className = "system-video-footer mono";
            footer.textContent = item.label;

            // MONTA O CARD

            card.append(heading, video, footer);
            detailMedia.appendChild(card);
        });
    }

    // ==========================================
    // ESPAÇO RESERVADO PARA CARDS SEM VÍDEOS
    // ==========================================

    function renderPlaceholder() {
        detailMedia.classList.remove("system-videos");
        detailMedia.replaceChildren();

        const placeholder = document.createElement("span");

        placeholder.className = "mono";
        placeholder.textContent = "ANIMAÇÃO / GIF EM BREVE";

        detailMedia.appendChild(placeholder);
    }

    // ==========================================
    // SELEÇÃO DOS ELEMENTOS DO JOGO
    // ==========================================

    function selectElement(card, index, shouldScroll = true) {
        elementCards.forEach((item) => {
            item.classList.remove("is-active");
        });

        card.classList.add("is-active");

        detailTitle.textContent =
            card.dataset.title || "Elemento do jogo";

        detailDescription.textContent =
            card.dataset.description || "Descrição em breve.";

        detailIndex.textContent =
            `${String(index + 1).padStart(2, "0")} / ` +
            `${String(elementCards.length).padStart(2, "0")}`;

        const system = systems[card.dataset.system];

        if (system) {
            renderSystemVideos(system, detailTitle.textContent);
        } else {
            renderPlaceholder();
        }

        if (shouldScroll) {
            detailSection.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    }

    // ==========================================
    // EVENTOS DOS CARDS
    // ==========================================

    elementCards.forEach((card, index) => {
        card.addEventListener("click", () => {
            selectElement(card, index);
        });
    });

    // ==========================================
    // ESTADO INICIAL
    // ==========================================

    selectElement(elementCards[0], 0, false);
});
