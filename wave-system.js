(() => {
    "use strict";

    const waveSystem = {
        title: "Wave System",

        description:
            "Um sistema responsável por organizar as ondas de inimigos, " +
            "controlar os spawns e distribuir os adversários durante a partida. " +
            "Confira a lógica dos Blueprints e a execução do sistema no jogo.",

        videos: [
            {
                file: "GmCore2x.mp4",
                number: "01",
                title: "GM Core",
                description:
                    "A lógica central do sistema de ondas, incluindo o fluxo " +
                    "de execução e a organização das etapas.",
                label: "GAME MODE · WAVE LOGIC"
            },
            {
                file: "EnemySpawn2x.mp4",
                number: "02",
                title: "Enemy Spawn",
                description:
                    "A configuração dos spawners e a lógica utilizada " +
                    "para definir a quantidade e a seleção dos inimigos.",
                label: "BLUEPRINTS · ENEMY SPAWN"
            },
            {
                file: "Spawnando2x.mp4",
                number: "03",
                title: "Sistema em execução",
                description:
                    "Demonstração prática do nascimento dos inimigos " +
                    "e da distribuição das ondas durante o gameplay.",
                label: "GAMEPLAY · WAVE SYSTEM"
            }
        ]
    };

    let presentationOverlay = null;
    let presentationWindow = null;
    let presentationVideo = null;

    let previousFocusedElement = null;
    let sourcePlayerForPresentation = null;

    let presentationVideoOriginalParent = null;
    let presentationVideoOriginalNextSibling = null;

    let openingAnimationFrame = null;
    let closeAnimationTimer = null;
    let isClosing = false;

    // ==========================================
    // CARREGA O CSS
    // ==========================================

    function loadStylesheet() {
        if (document.querySelector("#wave-system-styles")) {
            return;
        }

        const stylesheet = document.createElement("link");

        stylesheet.id = "wave-system-styles";
        stylesheet.rel = "stylesheet";
        stylesheet.href = "wave-system.css";

        document.head.appendChild(stylesheet);
    }

    // ==========================================
    // CRIA A APRESENTAÇÃO
    // ==========================================

    function createPresentation() {
        if (presentationOverlay) {
            return;
        }

        presentationOverlay = document.createElement("div");
        presentationOverlay.className = "wave-presentation-overlay";

        presentationOverlay.innerHTML = `
            <section
                class="wave-presentation-window"
                role="dialog"
                aria-modal="true"
                aria-labelledby="wave-presentation-title"
            >
                <div class="wave-presentation-video-area">
                    <div class="wave-presentation-topline mono">
                        <span class="wave-presentation-status">
                            WAVE SYSTEM / PRESENTATION
                        </span>

                        <span class="wave-presentation-counter"></span>
                    </div>

                    <video
                        class="wave-presentation-video"
                        controls
                        playsinline
                        preload="metadata"
                    >
                        Seu navegador não suporta a reprodução de vídeo.
                    </video>

                    <div class="wave-presentation-video-name mono"></div>
                </div>

                <aside class="wave-presentation-info">
                    <button
                        class="wave-presentation-close"
                        type="button"
                        aria-label="Fechar apresentação"
                        title="Fechar apresentação"
                    >×</button>

                    <p class="wave-presentation-eyebrow mono">
                        DETALHES DO SISTEMA
                    </p>

                    <h2
                        class="wave-presentation-title"
                        id="wave-presentation-title"
                    ></h2>

                    <div class="wave-presentation-line"></div>

                    <p class="wave-presentation-summary"></p>

                    <div class="wave-presentation-more">
                        <div class="wave-presentation-more-inner">
                            <p class="wave-presentation-extra">
                                Você está vendo mais detalhes! Este é o espaço
                                reservado para a explicação completa do vídeo.
                                Aqui poderemos apresentar as etapas do Blueprint,
                                suas funções e a lógica utilizada no sistema.
                            </p>
                        </div>
                    </div>

                    <button
                        class="wave-presentation-toggle"
                        type="button"
                        aria-expanded="false"
                    >
                        <span class="wave-presentation-toggle-label">
                            Ver mais
                        </span>

                        <span
                            class="wave-presentation-toggle-arrow"
                            aria-hidden="true"
                        >↓</span>
                    </button>

                    <div class="wave-presentation-bottom mono">
                        MIGUEL CORAL · UNREAL ENGINE 5
                    </div>
                </aside>
            </section>
        `;

        document.body.appendChild(presentationOverlay);

        presentationWindow = presentationOverlay.querySelector(
            ".wave-presentation-window"
        );

        presentationVideo = presentationOverlay.querySelector(
            ".wave-presentation-video"
        );

        presentationOverlay
            .querySelector(".wave-presentation-close")
            .addEventListener("click", closePresentation);

        presentationOverlay
            .querySelector(".wave-presentation-toggle")
            .addEventListener("click", toggleMore);

        presentationOverlay.addEventListener("click", (event) => {
            if (event.target === presentationOverlay) {
                closePresentation();
            }
        });
    }

    // ==========================================
    // VER MAIS / VER MENOS
    // ==========================================

    function toggleMore() {
        if (!presentationOverlay || isClosing) {
            return;
        }

        const morePanel = presentationOverlay.querySelector(
            ".wave-presentation-more"
        );

        const toggleButton = presentationOverlay.querySelector(
            ".wave-presentation-toggle"
        );

        const toggleLabel = presentationOverlay.querySelector(
            ".wave-presentation-toggle-label"
        );

        const expanded =
            toggleButton.getAttribute("aria-expanded") === "true";

        toggleButton.setAttribute("aria-expanded", String(!expanded));

        toggleLabel.textContent = expanded
            ? "Ver mais"
            : "Ver menos";

        morePanel.classList.toggle("is-expanded", !expanded);
    }

    // ==========================================
    // ABRE A JANELA A PARTIR DO PLAYER CLICADO
    // ==========================================

    function openPresentation(videoData, sourcePlayer) {
        createPresentation();

        if (closeAnimationTimer) {
            clearTimeout(closeAnimationTimer);
            closeAnimationTimer = null;
        }

        if (openingAnimationFrame) {
            cancelAnimationFrame(openingAnimationFrame);
            openingAnimationFrame = null;
        }

        isClosing = false;

        previousFocusedElement = sourcePlayer;
        sourcePlayerForPresentation = sourcePlayer;

        const title = presentationOverlay.querySelector(
            ".wave-presentation-title"
        );

        const summary = presentationOverlay.querySelector(
            ".wave-presentation-summary"
        );

        const counter = presentationOverlay.querySelector(
            ".wave-presentation-counter"
        );

        const videoName = presentationOverlay.querySelector(
            ".wave-presentation-video-name"
        );

        const morePanel = presentationOverlay.querySelector(
            ".wave-presentation-more"
        );

        const toggleButton = presentationOverlay.querySelector(
            ".wave-presentation-toggle"
        );

        const toggleLabel = presentationOverlay.querySelector(
            ".wave-presentation-toggle-label"
        );

        const info = presentationOverlay.querySelector(
            ".wave-presentation-info"
        );

        // Guarda a posição original do player.
        const sourceRect = sourcePlayer.getBoundingClientRect();

        // Prepara o conteúdo.
        morePanel.classList.remove("is-expanded");
        toggleButton.setAttribute("aria-expanded", "false");
        toggleLabel.textContent = "Ver mais";

        title.textContent = videoData.title;

        summary.textContent =
            "Nesta apresentação, você vai conhecer uma parte do sistema " +
            "de ondas de inimigos e entender como ela participa do funcionamento " +
            "do jogo. A explicação detalhada poderá ser consultada em seguida.";

        counter.textContent =
            `${videoData.number} / ${String(waveSystem.videos.length).padStart(2, "0")}`;

        videoName.textContent = videoData.label;

        // Prepara o player ampliado.
        presentationVideo.pause();
        presentationVideo.removeAttribute("src");
        presentationVideo.replaceChildren();

        const source = document.createElement("source");

        source.src = `assets/pirate/videos/${videoData.file}`;
        source.type = "video/mp4";

        presentationVideo.appendChild(source);
        presentationVideo.load();

        // Reseta o estado visual do painel antes de abrir.
        info.style.animation = "none";
        info.style.transition = "none";
        info.style.transform = "translateX(-40px)";
        info.style.opacity = "0";

        // Prepara a janela para a animação.
        presentationOverlay.classList.remove("is-open");

        presentationWindow.style.transition = "none";
        presentationWindow.style.transform = "none";
        presentationWindow.style.transformOrigin = "center center";
        presentationWindow.style.opacity = "0";

        document.body.style.overflow = "hidden";

        // Mede a janela centralizada sem mostrá-la.
        presentationOverlay.style.visibility = "hidden";
        presentationOverlay.style.opacity = "0";
        presentationOverlay.style.pointerEvents = "none";

        presentationOverlay.classList.add("is-open");

        const targetRect = presentationWindow.getBoundingClientRect();

        const sourceCenterX = sourceRect.left + sourceRect.width / 2;
        const sourceCenterY = sourceRect.top + sourceRect.height / 2;

        const targetCenterX = targetRect.left + targetRect.width / 2;
        const targetCenterY = targetRect.top + targetRect.height / 2;

        const translateX = sourceCenterX - targetCenterX;
        const translateY = sourceCenterY - targetCenterY;

        const scaleX = Math.max(
            0.05,
            sourceRect.width / targetRect.width
        );

        const scaleY = Math.max(
            0.05,
            sourceRect.height / targetRect.height
        );

        // Define a origem da animação.
        presentationOverlay.classList.remove("is-open");

        presentationOverlay.style.visibility = "visible";
        presentationOverlay.style.opacity = "1";
        presentationOverlay.style.pointerEvents = "auto";

        presentationWindow.style.transform =
            `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;

        presentationWindow.style.opacity = "1";

        presentationWindow.getBoundingClientRect();

        // Expande o vídeo e revela o painel ao mesmo tempo.
        openingAnimationFrame = requestAnimationFrame(() => {
            openingAnimationFrame = null;

            presentationWindow.style.transition = "";
            presentationWindow.style.transform = "";
            presentationWindow.style.opacity = "";

            // Mesmo tempo e mesma curva da expansão da janela.
            info.style.transition =
                "transform 2s cubic-bezier(0.16, 1, 0.3, 1), " +
                "opacity 2s cubic-bezier(0.16, 1, 0.3, 1)";

            info.style.transform = "translateX(0)";
            info.style.opacity = "1";

            presentationOverlay.classList.add("is-open");

            const playPromise = presentationVideo.play();

            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(() => {
                    // Os controles permanecem disponíveis se o autoplay
                    // for bloqueado pelo navegador.
                });
            }

            presentationOverlay
                .querySelector(".wave-presentation-close")
                .focus();
        });
    }

    // ==========================================
    // FINALIZA O FECHAMENTO
    // ==========================================

    function finishClosing() {
        if (!presentationOverlay || !isClosing) {
            return;
        }

        if (closeAnimationTimer) {
            clearTimeout(closeAnimationTimer);
            closeAnimationTimer = null;
        }

        /*
         * O vídeo foi temporariamente movido para o overlay
         * para que sua animação use coordenadas da tela.
         * Agora ele volta para seu lugar original na janela.
         */
        if (
            presentationVideoOriginalParent &&
            presentationVideoOriginalParent.isConnected
        ) {
            if (
                presentationVideoOriginalNextSibling &&
                presentationVideoOriginalNextSibling.parentNode ===
                    presentationVideoOriginalParent
            ) {
                presentationVideoOriginalParent.insertBefore(
                    presentationVideo,
                    presentationVideoOriginalNextSibling
                );
            } else {
                presentationVideoOriginalParent.appendChild(
                    presentationVideo
                );
            }
        }

        presentationOverlay.classList.remove("is-open");

        presentationWindow.style.transition = "";
        presentationWindow.style.transform = "";
        presentationWindow.style.transformOrigin = "";
        presentationWindow.style.opacity = "";
        presentationWindow.style.background = "";
        presentationWindow.style.borderColor = "";
        presentationWindow.style.boxShadow = "";
        presentationWindow.style.overflow = "";

        if (presentationVideo) {
            presentationVideo.style.position = "";
            presentationVideo.style.left = "";
            presentationVideo.style.top = "";
            presentationVideo.style.width = "";
            presentationVideo.style.height = "";
            presentationVideo.style.margin = "";
            presentationVideo.style.zIndex = "";
            presentationVideo.style.transform = "";
            presentationVideo.style.transformOrigin = "";
            presentationVideo.style.transition = "";
            presentationVideo.style.opacity = "";
        }

        const info = presentationOverlay.querySelector(
            ".wave-presentation-info"
        );

        const topline = presentationOverlay.querySelector(
            ".wave-presentation-topline"
        );

        const videoName = presentationOverlay.querySelector(
            ".wave-presentation-video-name"
        );

        const videoArea = presentationOverlay.querySelector(
            ".wave-presentation-video-area"
        );

        // Restaura os estilos originais para a próxima abertura.
        if (info) {
            info.style.transition = "";
            info.style.transform = "";
            info.style.opacity = "";
            info.style.animation = "";
        }

        [topline, videoName].forEach((element) => {
            if (element) {
                element.style.transition = "";
                element.style.opacity = "";
            }
        });

        if (videoArea) {
            videoArea.style.background = "";
            videoArea.style.border = "";
            videoArea.style.boxShadow = "";
        }

        presentationOverlay.style.visibility = "";
        presentationOverlay.style.opacity = "";
        presentationOverlay.style.pointerEvents = "";

        document.body.style.overflow = "";

        isClosing = false;

        if (
            previousFocusedElement &&
            previousFocusedElement.isConnected
        ) {
            previousFocusedElement.focus();
        }

        previousFocusedElement = null;
        sourcePlayerForPresentation = null;
        presentationVideoOriginalParent = null;
        presentationVideoOriginalNextSibling = null;
    }

    // ==========================================
    // FECHA ANIMANDO O PLAYER E O PAINEL JUNTOS
    // ==========================================

    function closePresentation() {
        if (
            !presentationOverlay ||
            isClosing ||
            !presentationOverlay.classList.contains("is-open")
        ) {
            return;
        }

        if (openingAnimationFrame) {
            cancelAnimationFrame(openingAnimationFrame);
            openingAnimationFrame = null;
        }

        isClosing = true;

        if (presentationVideo) {
            presentationVideo.pause();
        }

        const info = presentationOverlay.querySelector(
            ".wave-presentation-info"
        );

        // Se o player original não existir, fecha normalmente.
        if (
            !sourcePlayerForPresentation ||
            !sourcePlayerForPresentation.isConnected
        ) {
            if (info) {
                info.style.transition =
                    "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), " +
                    "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1)";

                info.style.transform = "translateX(-40px)";
                info.style.opacity = "0";
            }

            presentationOverlay.classList.remove("is-open");

            closeAnimationTimer = setTimeout(() => {
                finishClosing();
            }, 1200);

            return;
        }

        /*
         * PRIMEIRO: mede o vídeo e o player de origem
         * enquanto ambos ainda estão em seus lugares.
         */
        const videoRect = presentationVideo.getBoundingClientRect();
        const sourceRect =
            sourcePlayerForPresentation.getBoundingClientRect();

        const translateX = sourceRect.left - videoRect.left;
        const translateY = sourceRect.top - videoRect.top;

        const scaleX = Math.max(
            0.05,
            sourceRect.width / videoRect.width
        );

        const scaleY = Math.max(
            0.05,
            sourceRect.height / videoRect.height
        );

        /*
         * Guarda o local original do vídeo para recolocá-lo
         * corretamente depois da animação.
         */
        presentationVideoOriginalParent = presentationVideo.parentNode;
        presentationVideoOriginalNextSibling = presentationVideo.nextSibling;

        const topline = presentationOverlay.querySelector(
            ".wave-presentation-topline"
        );

        const videoName = presentationOverlay.querySelector(
            ".wave-presentation-video-name"
        );

        const videoArea = presentationOverlay.querySelector(
            ".wave-presentation-video-area"
        );

        /*
         * O painel lateral recolhe para a esquerda
         * no mesmo tempo e com a mesma curva do vídeo.
         */
        if (info) {
            info.style.animation = "none";

            info.style.transition =
                "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), " +
                "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1)";

            info.style.transform = "translateX(-40px)";
            info.style.opacity = "0";
        }

        // Os elementos decorativos da área do vídeo desaparecem.
        [topline, videoName].forEach((element) => {
            if (element) {
                element.style.transition = "opacity 0.9s ease";
                element.style.opacity = "0";
            }
        });

        /*
         * Deixa a janela transparente e sem moldura.
         * A animação visual será somente a do vídeo e do painel.
         */
        presentationWindow.style.background = "transparent";
        presentationWindow.style.borderColor = "transparent";
        presentationWindow.style.boxShadow = "none";
        presentationWindow.style.overflow = "visible";

        if (videoArea) {
            videoArea.style.background = "transparent";
            videoArea.style.border = "none";
            videoArea.style.boxShadow = "none";
        }

        /*
         * Move o vídeo diretamente para o overlay, fora da janela
         * transformada. Assim, position: fixed usa as coordenadas
         * da tela e não as coordenadas internas da janela ampliada.
         */
        presentationVideo.remove();

        presentationOverlay.appendChild(presentationVideo);

        presentationVideo.style.position = "fixed";
        presentationVideo.style.left = `${videoRect.left}px`;
        presentationVideo.style.top = `${videoRect.top}px`;
        presentationVideo.style.width = `${videoRect.width}px`;
        presentationVideo.style.height = `${videoRect.height}px`;
        presentationVideo.style.margin = "0";
        presentationVideo.style.zIndex = "100000";
        presentationVideo.style.transformOrigin = "top left";
        presentationVideo.style.transition = "none";
        presentationVideo.style.transform = "translate(0, 0) scale(1, 1)";
        presentationVideo.style.opacity = "1";

        /*
         * Mantém o overlay visível durante o retorno do vídeo.
         * O fundo e o desfoque continuam desaparecendo via CSS.
         */
        presentationOverlay.style.visibility = "visible";
        presentationOverlay.style.opacity = "1";
        presentationOverlay.style.pointerEvents = "none";

        presentationVideo.getBoundingClientRect();

        // Retorno do vídeo: 0,9 segundo.
        presentationVideo.style.transition =
            "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), " +
            "opacity 0.35s ease";

        presentationVideo.style.transform =
            `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;

        // O fundo escurecido desaparece enquanto o vídeo retorna.
        presentationOverlay.classList.remove("is-open");

        let hasStartedFading = false;

        function handleTransitionEnd(event) {
            if (
                event.target !== presentationVideo ||
                event.propertyName !== "transform" ||
                hasStartedFading
            ) {
                return;
            }

            hasStartedFading = true;

            presentationVideo.removeEventListener(
                "transitionend",
                handleTransitionEnd
            );

            // O vídeo desaparece somente depois de chegar ao destino.
            presentationVideo.style.opacity = "0";

            closeAnimationTimer = setTimeout(() => {
                finishClosing();
            }, 400);
        }

        presentationVideo.addEventListener(
            "transitionend",
            handleTransitionEnd
        );

        // Proteção caso o navegador não dispare transitionend.
        closeAnimationTimer = setTimeout(() => {
            presentationVideo.removeEventListener(
                "transitionend",
                handleTransitionEnd
            );

            if (!hasStartedFading) {
                hasStartedFading = true;
                presentationVideo.style.opacity = "0";

                closeAnimationTimer = setTimeout(() => {
                    finishClosing();
                }, 400);
            }
        }, 1200);
    }

    // ==========================================
    // TECLADO
    // ==========================================

    function handleKeydown(event) {
        if (
            event.key === "Escape" &&
            presentationOverlay &&
            presentationOverlay.classList.contains("is-open")
        ) {
            closePresentation();
        }
    }

    // ==========================================
    // CRIA OS CARDS DOS VÍDEOS
    // ==========================================

    function render(detailMedia) {
        if (!detailMedia) {
            return;
        }

        detailMedia.replaceChildren();
        detailMedia.classList.add("wave-system-media");

        waveSystem.videos.forEach((item) => {
            const card = document.createElement("article");
            card.className = "wave-video-card";

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

            const video = document.createElement("video");

            video.className = "wave-video-player";
            video.controls = true;
            video.preload = "metadata";
            video.playsInline = true;

            video.setAttribute(
                "aria-label",
                `Abrir apresentação ampliada: ${item.title}`
            );

            const source = document.createElement("source");

            source.src = `assets/pirate/videos/${item.file}`;
            source.type = "video/mp4";

            video.appendChild(source);

            video.appendChild(
                document.createTextNode(
                    "Seu navegador não suporta a reprodução de vídeo."
                )
            );

            video.addEventListener("click", (event) => {
                event.preventDefault();
                openPresentation(item, video);
            });

            const footer = document.createElement("div");
            footer.className = "wave-video-footer mono";
            footer.textContent = item.label;

            card.append(heading, video, footer);
            detailMedia.appendChild(card);
        });
    }

    // ==========================================
    // INICIALIZA O SISTEMA
    // ==========================================

    function init(elementCards) {
        if (!elementCards || !elementCards.length) {
            return;
        }

        loadStylesheet();

        const firstCard = elementCards[0];

        firstCard.dataset.title = waveSystem.title;
        firstCard.dataset.description = waveSystem.description;

        const firstCardTitle = firstCard.querySelector(
            ".element-card-title"
        );

        if (firstCardTitle) {
            firstCardTitle.textContent = waveSystem.title;
        }

        document.removeEventListener("keydown", handleKeydown);
        document.addEventListener("keydown", handleKeydown);
    }

    window.WaveSystem = {
        init,
        render
    };
})();