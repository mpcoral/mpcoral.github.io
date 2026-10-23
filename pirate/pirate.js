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
    // CONFIGURAÇÃO DO WAVE SYSTEM
    // ==========================================

    const waveSystem = {
        title: "Wave System",

        description:
            "Um sistema responsável por organizar as ondas de inimigos, " +
            "controlar os spawns e distribuir os adversários durante a partida. " +
            "Confira a lógica dos Blueprints e a execução do sistema no jogo.",

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
    };

    // ==========================================
    // INICIALIZA O WAVE SYSTEM
    // ==========================================

    const firstCard = elementCards[0];

    firstCard.dataset.title = waveSystem.title;
    firstCard.dataset.description = waveSystem.description;

    const firstCardTitle = firstCard.querySelector(
        ".element-card-title"
    );

    if (firstCardTitle) {
        firstCardTitle.textContent = waveSystem.title;
    }

    // ==========================================
    // CRIA OS CARDS DOS VÍDEOS
    // ==========================================

    function renderWaveSystem() {
        detailMedia.replaceChildren();
        detailMedia.classList.add("wave-system-media");

        waveSystem.videos.forEach((item) => {
            const card = document.createElement("article");
            card.className = "wave-video-card";

            // CABEÇALHO DO CARD

            const heading = document.createElement("div");
            heading.className = "wave-video-heading";

            const number = document.createElement("span");
            number.className = "wave-video-number mono";
            number.textContent = item.number;

            const textContainer = document.createElement("div");

            const title = document.createElement("h4");
            title.className = "wave-video-title";
            title.textContent = item.title;

            const description = document.createElement("p");
            description.className = "wave-video-description";
            description.textContent = item.description;

            textContainer.append(title, description);
            heading.append(number, textContainer);

            // PLAYER DO VÍDEO

            const video = document.createElement("video");

            video.className = "wave-video-player";
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
                summary: waveSystem.presentationSummary,
                extra: waveSystem.presentationExtra,
                eyebrow: "DETALHES DO SISTEMA",
                context: `${waveSystem.title.toUpperCase()} / PRESENTATION`,
                label: item.label,
                number: item.number,
                total: String(waveSystem.videos.length),
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
            footer.className = "wave-video-footer mono";
            footer.textContent = item.label;

            // MONTA O CARD

            card.append(heading, video, footer);
            detailMedia.appendChild(card);
        });
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

        if (index === 0) {
            renderWaveSystem();
        } else {
            detailMedia.classList.remove("wave-system-media");
            detailMedia.replaceChildren();

            const placeholder = document.createElement("span");

            placeholder.className = "mono";
            placeholder.textContent = "ANIMAÇÃO / GIF EM BREVE";

            detailMedia.appendChild(placeholder);
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

    selectElement(firstCard, 0, false);
});