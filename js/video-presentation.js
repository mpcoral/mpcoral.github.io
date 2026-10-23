(() => {
    "use strict";

    let presentationOverlay = null;
    let presentationWindow = null;
    let presentationVideo = null;

    let previousFocusedElement = null;
    let sourcePlayerForPresentation = null;

    let presentationVideoOriginalParent = null;
    let presentationVideoOriginalNextSibling = null;

    let openingAnimationFrame = null;
    let openingAnimationFrameSecond = null;
    let openingFallbackTimer = null;
    let openingTransitionEndHandler = null;

    let closeAnimationTimer = null;

    let isOpening = false;
    let isClosing = false;

    let previousBodyOverflow = "";

    const OPEN_DURATION = 2000;
    const OPEN_EASING = "cubic-bezier(0.16, 1, 0.3, 1)";

    // ==========================================
    // CRIA A APRESENTAÇÃO
    // ==========================================

    function createPresentation() {
        if (presentationOverlay) {
            return;
        }

        presentationOverlay = document.createElement("div");
        presentationOverlay.className = "video-presentation-overlay";

        presentationOverlay.innerHTML = `
            <section
                class="video-presentation-window"
                role="dialog"
                aria-modal="true"
                aria-labelledby="video-presentation-title"
            >
                <div class="video-presentation-video-area">
                    <div class="video-presentation-topline mono">
                        <span class="video-presentation-status">
                            VIDEO PRESENTATION
                        </span>

                        <span class="video-presentation-counter"></span>
                    </div>

                    <video
                        class="video-presentation-video"
                        controls
                        playsinline
                        preload="metadata"
                    >
                        Seu navegador não suporta a reprodução de vídeo.
                    </video>

                    <div class="video-presentation-video-name mono"></div>
                </div>

                <aside class="video-presentation-info">
                    <button
                        class="video-presentation-close"
                        type="button"
                        aria-label="Fechar apresentação"
                        title="Fechar apresentação"
                    >×</button>

                    <p class="video-presentation-eyebrow mono">
                        VIDEO DETAILS
                    </p>

                    <h2
                        class="video-presentation-title"
                        id="video-presentation-title"
                    ></h2>

                    <div class="video-presentation-line"></div>

                    <p class="video-presentation-summary"></p>

                    <div class="video-presentation-more">
                        <div class="video-presentation-more-inner">
                            <p class="video-presentation-extra"></p>
                        </div>
                    </div>

                    <button
                        class="video-presentation-toggle"
                        type="button"
                        aria-expanded="false"
                    >
                        <span class="video-presentation-toggle-label">
                            Ver mais
                        </span>

                        <span
                            class="video-presentation-toggle-arrow"
                            aria-hidden="true"
                        >↓</span>
                    </button>

                    <div class="video-presentation-bottom mono">
                        MIGUEL CORAL · PORTFOLIO
                    </div>
                </aside>
            </section>
        `;

        document.body.appendChild(presentationOverlay);

        presentationWindow = presentationOverlay.querySelector(
            ".video-presentation-window"
        );

        presentationVideo = presentationOverlay.querySelector(
            ".video-presentation-video"
        );

        presentationOverlay
            .querySelector(".video-presentation-close")
            .addEventListener("click", closePresentation);

        presentationOverlay
            .querySelector(".video-presentation-toggle")
            .addEventListener("click", toggleMore);

        presentationOverlay.addEventListener("click", (event) => {
            if (
                event.target === presentationOverlay &&
                !isOpening &&
                !isClosing
            ) {
                closePresentation();
            }
        });
    }


    // ==========================================
    // VER MAIS / VER MENOS
    // ==========================================

    function toggleMore() {
        if (
            !presentationOverlay ||
            isOpening ||
            isClosing
        ) {
            return;
        }

        const morePanel = presentationOverlay.querySelector(
            ".video-presentation-more"
        );

        const toggleButton = presentationOverlay.querySelector(
            ".video-presentation-toggle"
        );

        const toggleLabel = presentationOverlay.querySelector(
            ".video-presentation-toggle-label"
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
    // CONTROLA OS QUADROS DA ABERTURA
    // ==========================================

    function clearOpeningSchedule() {
        if (openingAnimationFrame) {
            cancelAnimationFrame(openingAnimationFrame);
            openingAnimationFrame = null;
        }

        if (openingAnimationFrameSecond) {
            cancelAnimationFrame(openingAnimationFrameSecond);
            openingAnimationFrameSecond = null;
        }

        if (openingFallbackTimer) {
            clearTimeout(openingFallbackTimer);
            openingFallbackTimer = null;
        }

        if (openingTransitionEndHandler && presentationWindow) {
            presentationWindow.removeEventListener(
                "transitionend",
                openingTransitionEndHandler
            );

            openingTransitionEndHandler = null;
        }
    }

    // ==========================================
    // PREPARA O CONTEÚDO
    // ==========================================

    function updatePresentationContent(videoData) {
        const title = presentationOverlay.querySelector(
            ".video-presentation-title"
        );

        const summary = presentationOverlay.querySelector(
            ".video-presentation-summary"
        );

        const counter = presentationOverlay.querySelector(
            ".video-presentation-counter"
        );

        const videoName = presentationOverlay.querySelector(
            ".video-presentation-video-name"
        );

        const status = presentationOverlay.querySelector(
            ".video-presentation-status"
        );

        const eyebrow = presentationOverlay.querySelector(
            ".video-presentation-eyebrow"
        );

        const extraDescription = presentationOverlay.querySelector(
            ".video-presentation-extra"
        );

        const footer = presentationOverlay.querySelector(
            ".video-presentation-bottom"
        );

        const morePanel = presentationOverlay.querySelector(
            ".video-presentation-more"
        );

        const toggleButton = presentationOverlay.querySelector(
            ".video-presentation-toggle"
        );

        const toggleLabel = presentationOverlay.querySelector(
            ".video-presentation-toggle-label"
        );

        morePanel.classList.remove("is-expanded");

        toggleButton.setAttribute("aria-expanded", "false");
        toggleLabel.textContent = "Ver mais";

        title.textContent = videoData.title || "Video Presentation";

        summary.textContent =
            videoData.summary ||
            videoData.description ||
            "Veja a demonstração deste vídeo e consulte mais detalhes nesta apresentação.";

        const totalVideos = Number(videoData.totalVideos) || 1;

        counter.textContent = videoData.number
            ? `${videoData.number} / ${String(totalVideos).padStart(2, "0")}`
            : "";

        videoName.textContent = videoData.label || "";

        status.textContent =
            videoData.contextLabel || "VIDEO PRESENTATION";

        eyebrow.textContent =
            videoData.eyebrow || "VIDEO DETAILS";

        extraDescription.textContent =
            videoData.extraDescription || "Mais detalhes sobre este vídeo.";

        footer.textContent =
            videoData.footer || "PORTFOLIO / VIDEO";
    }

    // ==========================================
    // PREPARA O PLAYER AMPLIADO
    // ==========================================

    function preparePresentationVideo(videoData) {
        presentationVideo.pause();
        presentationVideo.removeAttribute("src");
        presentationVideo.replaceChildren();

        const source = document.createElement("source");

        source.src = videoData.src || videoData.file || "";
        source.type = "video/mp4";

        presentationVideo.appendChild(source);
        presentationVideo.load();
    }

    // ==========================================
    // FINALIZA A ABERTURA
    // ==========================================

    function finishOpening() {
        if (!isOpening || !presentationWindow) {
            return;
        }

        clearOpeningSchedule();

        /*
         * Desativa as transições de geometria antes de restaurar
         * o layout normal da janela.
         *
         * A posição final já corresponde ao layout centralizado.
         */
        presentationWindow.style.transition = "none";

        presentationWindow.style.position = "";
        presentationWindow.style.left = "";
        presentationWindow.style.top = "";
        presentationWindow.style.width = "";
        presentationWindow.style.height = "";
        presentationWindow.style.maxHeight = "";
        presentationWindow.style.borderRadius = "";
        presentationWindow.style.overflow = "";
        presentationWindow.style.transform = "";
        presentationWindow.style.opacity = "";
        presentationWindow.style.boxShadow = "";
        presentationWindow.style.pointerEvents = "";
        presentationWindow.style.willChange = "";

        presentationWindow.getBoundingClientRect();

        presentationWindow.style.transition = "";

        const info = presentationOverlay.querySelector(
            ".video-presentation-info"
        );

        if (info) {
            info.style.transition = "none";
            info.style.transform = "";
            info.style.opacity = "";

            info.getBoundingClientRect();

            info.style.transition = "";
        }

        presentationOverlay.style.visibility = "";
        presentationOverlay.style.opacity = "";
        presentationOverlay.style.pointerEvents = "";

        const closeButton = presentationOverlay.querySelector(
            ".video-presentation-close"
        );

        closeButton.disabled = false;

        isOpening = false;

        // A reprodução começa depois da expansão, para não competir
        // com a transição de geometria.
        const playPromise = presentationVideo.play();

        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(() => {
                // Os controles continuam disponíveis se o autoplay
                // for bloqueado pelo navegador.
            });
        }

        closeButton.focus();
    }

    // ==========================================
    // ABRE A JANELA A PARTIR DO PLAYER CLICADO
    // ==========================================

    function openPresentation(videoData, sourcePlayer) {
        if (!sourcePlayer || !sourcePlayer.isConnected) {
            return;
        }

        createPresentation();

        // Ignora cliques repetidos durante a abertura, apresentação
        // e fechamento.
        if (
            isOpening ||
            isClosing ||
            presentationOverlay.classList.contains("is-open")
        ) {
            return;
        }

        clearOpeningSchedule();

        if (closeAnimationTimer) {
            clearTimeout(closeAnimationTimer);
            closeAnimationTimer = null;
        }

        isOpening = true;
        isClosing = false;

        previousFocusedElement = sourcePlayer;
        sourcePlayerForPresentation = sourcePlayer;

        previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        /*
         * Mede o player depois de bloquear a rolagem, para usar
         * as coordenadas atuais do layout.
         */
        const sourceRect = sourcePlayer.getBoundingClientRect();

        if (sourceRect.width <= 0 || sourceRect.height <= 0) {
            document.body.style.overflow = previousBodyOverflow;
            previousBodyOverflow = "";
            isOpening = false;
            return;
        }

        updatePresentationContent(videoData);
        preparePresentationVideo(videoData);

        const info = presentationOverlay.querySelector(
            ".video-presentation-info"
        );

        const closeButton = presentationOverlay.querySelector(
            ".video-presentation-close"
        );

        // Prepara o painel lateral.
        info.style.animation = "none";
        info.style.transition = "none";
        info.style.transform = "translateX(-40px)";
        info.style.opacity = "0";

        closeButton.disabled = true;

        // Limpa possíveis estilos de geometria de uma abertura anterior.
        /*
         * As transições do overlay no CSS (visibility com atraso de
         * 2.1s e opacity de 1.8s) também seriam aplicadas aos estilos
         * inline abaixo, mantendo o overlay invisível durante toda a
         * expansão. Elas ficam desativadas até o overlay aparecer.
         */
        presentationOverlay.style.transition = "none";

        presentationOverlay.classList.remove("is-open");

        presentationOverlay.style.visibility = "hidden";
        presentationOverlay.style.opacity = "0";
        presentationOverlay.style.pointerEvents = "none";

        presentationWindow.style.transition = "none";
        presentationWindow.style.position = "";
        presentationWindow.style.left = "";
        presentationWindow.style.top = "";
        presentationWindow.style.width = "";
        presentationWindow.style.height = "";
        presentationWindow.style.maxHeight = "";
        presentationWindow.style.borderRadius = "";
        presentationWindow.style.overflow = "";
        presentationWindow.style.transform = "none";
        presentationWindow.style.opacity = "0";
        presentationWindow.style.boxShadow = "";
        presentationWindow.style.pointerEvents = "none";

        /*
         * Mede a geometria final da janela no layout normal.
         * O overlay permanece invisível durante essa medição.
         */
        presentationOverlay.classList.add("is-open");

        const targetRect = presentationWindow.getBoundingClientRect();

        const targetBorderRadius =
            getComputedStyle(presentationWindow).borderTopLeftRadius;

        presentationOverlay.classList.remove("is-open");

        if (targetRect.width <= 0 || targetRect.height <= 0) {
            presentationOverlay.style.visibility = "";
            presentationOverlay.style.opacity = "";
            presentationOverlay.style.pointerEvents = "";
            presentationOverlay.style.transition = "";

            presentationWindow.style.transition = "";
            presentationWindow.style.transform = "";
            presentationWindow.style.opacity = "";
            presentationWindow.style.pointerEvents = "";

            document.body.style.overflow = previousBodyOverflow;
            previousBodyOverflow = "";
            closeButton.disabled = false;
            isOpening = false;

            return;
        }

        /*
         * Em vez de transformar a janela, posiciona-a sobre o
         * player original e anima sua geometria até o tamanho final.
         */
        presentationWindow.style.position = "fixed";
        presentationWindow.style.left = `${sourceRect.left}px`;
        presentationWindow.style.top = `${sourceRect.top}px`;
        presentationWindow.style.width = `${sourceRect.width}px`;
        presentationWindow.style.height = `${sourceRect.height}px`;
        presentationWindow.style.maxHeight = "none";
        presentationWindow.style.borderRadius = "0px";
        presentationWindow.style.overflow = "hidden";
        presentationWindow.style.transform = "none";
        presentationWindow.style.opacity = "1";
        presentationWindow.style.boxShadow =
            "0 40px 140px rgba(0, 0, 0, 0.75)";
        presentationWindow.style.pointerEvents = "none";
        presentationWindow.style.willChange =
            "left, top, width, height";

        presentationOverlay.style.visibility = "visible";
        presentationOverlay.style.opacity = "1";
        presentationOverlay.style.pointerEvents = "auto";

        /*
         * Registra o estado inicial antes de configurar
         * a transição de geometria.
         */
        presentationWindow.getBoundingClientRect();
        presentationOverlay.getBoundingClientRect();

        /*
         * O overlay já está visível. Restaura as transições do CSS
         * para que o fundo escureça junto com a expansão.
         */
        presentationOverlay.style.transition = "";

        // Primeiro quadro: configura as transições.
        openingAnimationFrame = requestAnimationFrame(() => {
            openingAnimationFrame = null;

            if (!isOpening || isClosing) {
                return;
            }

            presentationWindow.style.transition =
                `left ${OPEN_DURATION}ms ${OPEN_EASING}, ` +
                `top ${OPEN_DURATION}ms ${OPEN_EASING}, ` +
                `width ${OPEN_DURATION}ms ${OPEN_EASING}, ` +
                `height ${OPEN_DURATION}ms ${OPEN_EASING}, ` +
                `border-radius ${OPEN_DURATION}ms ${OPEN_EASING}, ` +
                "box-shadow 1.6s ease";

            info.style.transition =
                `transform ${OPEN_DURATION}ms ${OPEN_EASING}, ` +
                `opacity ${OPEN_DURATION}ms ${OPEN_EASING}`;

            // Força o navegador a registrar a geometria de origem.
            presentationWindow.getBoundingClientRect();

            // Segundo quadro: inicia a expansão real.
            openingAnimationFrameSecond = requestAnimationFrame(() => {
                openingAnimationFrameSecond = null;

                if (!isOpening || isClosing) {
                    return;
                }

                openingTransitionEndHandler = (event) => {
                    if (
                        event.target === presentationWindow &&
                        event.propertyName === "width"
                    ) {
                        finishOpening();
                    }
                };

                presentationWindow.addEventListener(
                    "transitionend",
                    openingTransitionEndHandler
                );

                /*
                 * Essas propriedades mudam a geometria real da janela.
                 * Não dependem da transformação de escala anterior.
                 */
                presentationWindow.style.left = `${targetRect.left}px`;
                presentationWindow.style.top = `${targetRect.top}px`;
                presentationWindow.style.width = `${targetRect.width}px`;
                presentationWindow.style.height = `${targetRect.height}px`;
                presentationWindow.style.borderRadius = targetBorderRadius;

                info.style.transform = "translateX(0)";
                info.style.opacity = "1";

                presentationOverlay.classList.add("is-open");

                // Fallback se transitionend não for disparado.
                openingFallbackTimer = setTimeout(
                    finishOpening,
                    OPEN_DURATION + 350
                );
            });
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
         * O vídeo foi movido temporariamente para o overlay durante
         * o fechamento. Agora volta para o local original.
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

        // Limpa os estilos temporários da janela.
        presentationWindow.style.transition = "none";
        presentationWindow.style.position = "";
        presentationWindow.style.left = "";
        presentationWindow.style.top = "";
        presentationWindow.style.width = "";
        presentationWindow.style.height = "";
        presentationWindow.style.maxHeight = "";
        presentationWindow.style.borderRadius = "";
        presentationWindow.style.transform = "";
        presentationWindow.style.transformOrigin = "";
        presentationWindow.style.opacity = "";
        presentationWindow.style.background = "";
        presentationWindow.style.borderColor = "";
        presentationWindow.style.boxShadow = "";
        presentationWindow.style.overflow = "";
        presentationWindow.style.pointerEvents = "";
        presentationWindow.style.willChange = "";

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
            ".video-presentation-info"
        );

        const topline = presentationOverlay.querySelector(
            ".video-presentation-topline"
        );

        const videoName = presentationOverlay.querySelector(
            ".video-presentation-video-name"
        );

        const videoArea = presentationOverlay.querySelector(
            ".video-presentation-video-area"
        );

        // Restaura os estilos originais do painel.
        if (info) {
            info.style.transition = "none";
            info.style.transform = "";
            info.style.opacity = "";
            info.style.animation = "";

            info.getBoundingClientRect();

            info.style.transition = "";
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

        /*
         * Esconde o overlay imediatamente, sem as transições do CSS,
         * para que ele não continue visível por mais 2.1s depois
         * que o vídeo já voltou ao player original.
         */
        presentationOverlay.style.transition = "none";
        presentationOverlay.style.visibility = "";
        presentationOverlay.style.opacity = "";
        presentationOverlay.style.pointerEvents = "";

        presentationOverlay.getBoundingClientRect();

        presentationOverlay.style.transition = "";

        document.body.style.overflow = previousBodyOverflow;
        previousBodyOverflow = "";

        isOpening = false;
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
    // FECHA ANIMANDO O PLAYER DE VOLTA À ORIGEM
    // ==========================================

    function closePresentation() {
        if (
            !presentationOverlay ||
            isOpening ||
            isClosing ||
            !presentationOverlay.classList.contains("is-open")
        ) {
            return;
        }

        isClosing = true;

        if (presentationVideo) {
            presentationVideo.pause();
        }

        const info = presentationOverlay.querySelector(
            ".video-presentation-info"
        );

        // Fallback se o player original tiver sido removido.
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
         * Mede o vídeo ampliado e o player original antes de mover
         * o elemento para fora da janela.
         */
        const videoRect = presentationVideo.getBoundingClientRect();

        const sourceRect =
            sourcePlayerForPresentation.getBoundingClientRect();

        if (
            videoRect.width <= 0 ||
            videoRect.height <= 0 ||
            sourceRect.width <= 0 ||
            sourceRect.height <= 0
        ) {
            presentationOverlay.classList.remove("is-open");

            closeAnimationTimer = setTimeout(() => {
                finishClosing();
            }, 1200);

            return;
        }

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

        // Guarda o local original do vídeo.
        presentationVideoOriginalParent = presentationVideo.parentNode;

        presentationVideoOriginalNextSibling = presentationVideo.nextSibling;

        const topline = presentationOverlay.querySelector(
            ".video-presentation-topline"
        );

        const videoName = presentationOverlay.querySelector(
            ".video-presentation-video-name"
        );

        const videoArea = presentationOverlay.querySelector(
            ".video-presentation-video-area"
        );

        // O painel lateral recolhe para a esquerda.
        if (info) {
            info.style.animation = "none";

            info.style.transition =
                "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), " +
                "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1)";

            info.style.transform = "translateX(-40px)";
            info.style.opacity = "0";
        }

        // Os elementos decorativos desaparecem.
        [topline, videoName].forEach((element) => {
            if (element) {
                element.style.transition = "opacity 0.9s ease";
                element.style.opacity = "0";
            }
        });

        // Torna a moldura transparente durante o retorno.
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
         * Move o vídeo para o overlay para que position: fixed
         * use as coordenadas da tela.
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

        presentationOverlay.style.visibility = "visible";
        presentationOverlay.style.opacity = "1";
        presentationOverlay.style.pointerEvents = "none";

        presentationVideo.getBoundingClientRect();

        // Mantém a animação original de retorno.
        presentationVideo.style.transition =
            "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), " +
            "opacity 0.35s ease";

        presentationVideo.style.transform =
            `translate(${translateX}px, ${translateY}px) ` +
            `scale(${scaleX}, ${scaleY})`;

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

            presentationVideo.style.opacity = "0";

            closeAnimationTimer = setTimeout(() => {
                finishClosing();
            }, 400);
        }

        presentationVideo.addEventListener(
            "transitionend",
            handleTransitionEnd
        );

        // Fallback caso transitionend não seja disparado.
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
            !isOpening &&
            presentationOverlay.classList.contains("is-open")
        ) {
            closePresentation();
        }
    }

    document.addEventListener("keydown", handleKeydown);

    // Prepara o overlay antes do primeiro clique.
    createPresentation();

    window.VideoPresentation = {
        open: openPresentation,
        close: closePresentation
    };
})();