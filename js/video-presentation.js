/*
 * ==========================================
 * VIDEO PRESENTATION
 * ==========================================
 *
 * Abre um vídeo em uma apresentação ampliada: o player cresce a
 * partir do vídeo clicado, um painel de detalhes sai de trás dele
 * e, ao fechar, tudo volta para o lugar de origem.
 *
 * ------------------------------------------
 * 1. INCLUA OS ARQUIVOS NA PÁGINA
 * ------------------------------------------
 *
 *   <link rel="stylesheet" href="css/video-presentation.css">
 *   <script src="js/video-presentation.js" defer></script>
 *
 *   (Ajuste os caminhos conforme a pasta da página, ex.: "../css/...")
 *
 * ------------------------------------------
 * 2. MARQUE O VÍDEO COM data-presentation
 * ------------------------------------------
 *
 *   <video data-presentation
 *          data-title="GM Core"
 *          data-summary="Resumo exibido no painel."
 *          data-extra="Texto exibido ao clicar em Ver mais.">
 *       <source src="videos/gm-core.mp4" type="video/mp4">
 *   </video>
 *
 *   Pronto. Nenhum JavaScript extra é necessário, inclusive para
 *   vídeos criados depois do carregamento da página.
 *
 *   Atributos disponíveis (todos opcionais):
 *
 *   data-title      Título do painel.
 *   data-summary    Texto principal do painel.
 *   data-extra      Texto do "Ver mais". Sem ele, o botão some.
 *   data-highlights Destaques do "Ver mais", em JSON: uma lista de
 *                   { "name": "NextWave", "text": "Explicação..." }.
 *                   Cada nome vira um botão; ao clicar, o texto
 *                   dele aparece logo abaixo.
 *   data-eyebrow    Linha pequena acima do título.
 *   data-context    Texto no topo do player.
 *   data-label      Legenda abaixo do player.
 *   data-number     Número do vídeo no contador (ex.: "01").
 *   data-total      Total do contador (ex.: "03").
 *   data-footer     Rodapé do painel. Sem ele, o rodapé some.
 *   data-src        Vídeo a abrir, se for diferente do player.
 *                   Sem ele, usa as <source> do próprio vídeo.
 *
 *   O atributo também funciona em outros elementos, como uma
 *   imagem ou um card. Nesse caso, data-src é obrigatório.
 *
 * ------------------------------------------
 * 3. (OPCIONAL) USO PELO JAVASCRIPT
 * ------------------------------------------
 *
 *   VideoPresentation.open({ title: "...", src: "..." }, elemento);
 *   VideoPresentation.close();
 *
 *   // Pelo JavaScript, os destaques podem ser passados direto:
 *   VideoPresentation.open({
 *       title: "GM Core",
 *       src: "videos/gm-core.mp4",
 *       highlights: [{ name: "NextWave", text: "..." }]
 *   }, elemento);
 *
 *   // Textos padrão usados quando o vídeo não define o seu:
 *   VideoPresentation.setDefaults({ footer: "MIGUEL CORAL" });
 *
 * ------------------------------------------
 * 4. (OPCIONAL) CORES E FONTES
 * ------------------------------------------
 *
 *   O CSS usa as variáveis do site (--accent, --mono, --sans)
 *   quando existem. Para trocar só na apresentação:
 *
 *   .video-presentation-overlay { --vp-accent: #ff8a3d; }
 */

(() => {
    "use strict";

    // Evita uma segunda inicialização se o script for incluído duas vezes.
    if (window.VideoPresentation) {
        return;
    }

    // ==========================================
    // TEXTOS PADRÃO
    // ==========================================

    const defaults = {
        context: "VIDEO PRESENTATION",
        eyebrow: "DETALHES DO VÍDEO",
        title: "Apresentação",
        summary: "",
        extra: "",
        footer: "",
        moreLabel: "Ver mais",
        lessLabel: "Ver menos",
        highlightsLabel: "DESTAQUES DO VÍDEO",
        closeLabel: "Fechar apresentação"
    };

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

    const PANEL_CLOSE_DURATION = 700;
    const PANEL_CLOSE_EASING = "cubic-bezier(0.7, 0, 0.84, 0)";

    // Em telas estreitas o painel fica abaixo do player.
    const STACKED_LAYOUT_QUERY = "(max-width: 760px)";

    // ==========================================
    // POSIÇÃO DO PAINEL ESCONDIDO ATRÁS DO PLAYER
    // ==========================================

    function getHiddenPanelTransform() {
        return window.matchMedia(STACKED_LAYOUT_QUERY).matches
            ? "translateY(-100%)"
            : "translateX(-100%)";
    }

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
                    <div class="video-presentation-topline">
                        <span class="video-presentation-status"></span>
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

                    <div class="video-presentation-video-name"></div>
                </div>

                <aside class="video-presentation-info">
                    <button
                        class="video-presentation-close"
                        type="button"
                    >×</button>

                    <p class="video-presentation-eyebrow"></p>

                    <h2
                        class="video-presentation-title"
                        id="video-presentation-title"
                    ></h2>

                    <div class="video-presentation-line"></div>

                    <p class="video-presentation-summary"></p>

                    <div class="video-presentation-more">
                        <div class="video-presentation-more-inner">
                            <div class="video-presentation-highlights">
                                <p class="video-presentation-highlights-label"></p>

                                <div class="video-presentation-chips"></div>

                                <div
                                    class="video-presentation-highlight"
                                    aria-live="polite"
                                >
                                    <p class="video-presentation-highlight-text"></p>
                                </div>
                            </div>

                            <p class="video-presentation-extra"></p>
                        </div>
                    </div>

                    <button
                        class="video-presentation-toggle"
                        type="button"
                        aria-expanded="false"
                    >
                        <span class="video-presentation-toggle-label"></span>

                        <span
                            class="video-presentation-toggle-arrow"
                            aria-hidden="true"
                        >↓</span>
                    </button>

                    <div class="video-presentation-bottom"></div>
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
            ? defaults.moreLabel
            : defaults.lessLabel;

        morePanel.classList.toggle("is-expanded", !expanded);
    }

    // ==========================================
    // DESTAQUES DO VER MAIS
    // ==========================================

    let currentHighlights = [];
    let highlightHeightTimer = null;

    // Cria um botão para cada destaque e já abre o primeiro.
    function renderHighlights(highlights) {
        const container = presentationOverlay.querySelector(
            ".video-presentation-highlights"
        );

        const label = presentationOverlay.querySelector(
            ".video-presentation-highlights-label"
        );

        const chips = presentationOverlay.querySelector(
            ".video-presentation-chips"
        );

        currentHighlights = highlights;

        chips.replaceChildren();
        label.textContent = defaults.highlightsLabel;
        container.hidden = !highlights.length;

        highlights.forEach((highlight, index) => {
            const chip = document.createElement("button");

            chip.type = "button";
            chip.className = "video-presentation-chip";
            chip.textContent = highlight.name;
            chip.setAttribute("aria-pressed", "false");

            // Usado no CSS para os botões entrarem um após o outro.
            chip.style.setProperty("--chip-index", index);

            chip.addEventListener("click", () => {
                selectHighlight(index, true);
            });

            chips.appendChild(chip);
        });

        if (highlights.length) {
            selectHighlight(0, false);
        }
    }

    function selectHighlight(index, animate) {
        const highlight = currentHighlights[index];

        if (!highlight) {
            return;
        }

        const chips = presentationOverlay.querySelectorAll(
            ".video-presentation-chip"
        );

        const panel = presentationOverlay.querySelector(
            ".video-presentation-highlight"
        );

        const text = presentationOverlay.querySelector(
            ".video-presentation-highlight-text"
        );

        chips.forEach((chip, chipIndex) => {
            const isActive = chipIndex === index;

            chip.classList.toggle("is-active", isActive);
            chip.setAttribute("aria-pressed", String(isActive));
        });

        if (!animate) {
            text.textContent = highlight.text;
            return;
        }

        // A altura do quadro acompanha o tamanho do novo texto.
        const previousHeight = panel.offsetHeight;

        text.textContent = highlight.text;

        clearTimeout(highlightHeightTimer);
        panel.style.height = "";

        const nextHeight = panel.offsetHeight;

        panel.style.height = `${previousHeight}px`;
        void panel.offsetHeight;
        panel.style.height = `${nextHeight}px`;

        highlightHeightTimer = setTimeout(() => {
            panel.style.height = "";
        }, 400);

        // Reinicia a animação de entrada do texto.
        text.classList.remove("is-entering");
        void text.offsetWidth;
        text.classList.add("is-entering");
    }

    // Aceita a lista pronta ou o JSON vindo do data-highlights.
    function parseHighlights(value) {
        let list = value;

        if (typeof value === "string") {
            try {
                list = JSON.parse(value);
            } catch {
                return [];
            }
        }

        if (!Array.isArray(list)) {
            return [];
        }

        return list.filter(
            (item) => item && item.name && item.text
        );
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

        const closeButton = presentationOverlay.querySelector(
            ".video-presentation-close"
        );

        /*
         * Os nomes longos (contextLabel, extraDescription, totalVideos)
         * continuam aceitos para manter compatibilidade.
         */
        const extra =
            videoData.extra ?? videoData.extraDescription ?? defaults.extra;

        const total = videoData.total ?? videoData.totalVideos;

        const highlights = parseHighlights(videoData.highlights);
        const hasMore = Boolean(extra) || highlights.length > 0;

        morePanel.classList.remove("is-expanded");

        toggleButton.setAttribute("aria-expanded", "false");
        toggleLabel.textContent = defaults.moreLabel;

        closeButton.setAttribute("aria-label", defaults.closeLabel);
        closeButton.title = defaults.closeLabel;

        title.textContent = videoData.title || defaults.title;

        summary.textContent =
            videoData.summary ?? videoData.description ?? defaults.summary;

        counter.textContent = videoData.number
            ? `${videoData.number} / ${String(Number(total) || 1).padStart(2, "0")}`
            : "";

        videoName.textContent = videoData.label || "";

        status.textContent =
            videoData.context ?? videoData.contextLabel ?? defaults.context;

        eyebrow.textContent = videoData.eyebrow ?? defaults.eyebrow;

        extraDescription.textContent = extra;

        renderHighlights(highlights);

        footer.textContent = videoData.footer ?? defaults.footer;

        // Partes sem texto ficam ocultas.
        summary.hidden = !summary.textContent;
        eyebrow.hidden = !eyebrow.textContent;
        footer.hidden = !footer.textContent;
        extraDescription.hidden = !extra;
        morePanel.hidden = !hasMore;
        toggleButton.hidden = !hasMore;
    }

    // ==========================================
    // PREPARA O PLAYER AMPLIADO
    // ==========================================

    const VIDEO_TYPES = {
        mp4: "video/mp4",
        m4v: "video/mp4",
        webm: "video/webm",
        ogv: "video/ogg",
        ogg: "video/ogg",
        mov: "video/quicktime"
    };

    function guessVideoType(src) {
        const extension = String(src)
            .split(/[?#]/)[0]
            .split(".")
            .pop()
            .toLowerCase();

        return VIDEO_TYPES[extension] || "";
    }

    function getVideoSources(videoData) {
        if (Array.isArray(videoData.sources) && videoData.sources.length) {
            return videoData.sources;
        }

        const src = videoData.src || videoData.file;

        return src
            ? [{ src, type: videoData.type || guessVideoType(src) }]
            : [];
    }

    function preparePresentationVideo(videoData) {
        presentationVideo.pause();
        presentationVideo.removeAttribute("src");
        presentationVideo.replaceChildren();

        getVideoSources(videoData).forEach(({ src, type }) => {
            const source = document.createElement("source");

            source.src = src;

            if (type) {
                source.type = type;
            }

            presentationVideo.appendChild(source);
        });

        presentationVideo.appendChild(
            document.createTextNode(
                "Seu navegador não suporta a reprodução de vídeo."
            )
        );

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
        presentationWindow.style.background = "";
        presentationWindow.style.pointerEvents = "";
        presentationWindow.style.willChange = "";

        presentationWindow.getBoundingClientRect();

        presentationWindow.style.transition = "";

        // A borda e a sombra aparecem com as transições do CSS.
        presentationWindow.style.borderColor = "";
        presentationWindow.style.boxShadow = "";

        const info = presentationOverlay.querySelector(
            ".video-presentation-info"
        );

        if (info) {
            info.style.transition = "none";
            info.style.transform = "";
            info.style.opacity = "";
            info.style.overflow = "";
            info.style.width = "";

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

        // O painel lateral começa escondido atrás do player.
        info.style.animation = "none";
        info.style.transition = "none";
        info.style.transform = getHiddenPanelTransform();
        info.style.opacity = "";
        info.style.visibility = "";

        /*
         * Com a janela ainda pequena, o texto do painel não cabe
         * e vazaria para fora do player no layout empilhado.
         */
        info.style.overflow = "hidden";

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

        const targetInfoWidth = info.getBoundingClientRect().width;

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
         * O painel já nasce com a largura final. Assim o texto não
         * é redistribuído em novas linhas enquanto a janela cresce;
         * o que passar da janela fica cortado pelo overflow.
         */
        info.style.width = `${targetInfoWidth}px`;

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

        /*
         * Sem fundo, borda e sombra durante a expansão, o espaço
         * do painel fica vazio e ele parece sair de trás do player.
         */
        presentationWindow.style.background = "transparent";
        presentationWindow.style.borderColor = "transparent";
        presentationWindow.style.boxShadow = "none";
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

        /*
         * Fallback se transitionend não for disparado ou se os quadros
         * não rodarem (ex.: aba em segundo plano). A janela aparece
         * pronta em vez de ficar presa no meio da abertura.
         */
        openingFallbackTimer = setTimeout(() => {
            presentationOverlay.classList.add("is-open");
            finishOpening();
        }, OPEN_DURATION + 350);

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
                `border-radius ${OPEN_DURATION}ms ${OPEN_EASING}`;

            // O painel desliza para fora durante a expansão.
            info.style.transition =
                `transform ${OPEN_DURATION}ms ${OPEN_EASING}`;

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

                info.style.transform = "none";

                presentationOverlay.classList.add("is-open");
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
        presentationWindow.style.visibility = "";
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
            info.style.visibility = "";
            info.style.overflow = "";
            info.style.width = "";
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
    // FECHA A APRESENTAÇÃO
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

        hidePanelBehindPlayer(shrinkToSourcePlayer);
    }

    // ==========================================
    // RECOLHE O PAINEL PARA TRÁS DO PLAYER
    // ==========================================

    function hidePanelBehindPlayer(onHidden) {
        const info = presentationOverlay.querySelector(
            ".video-presentation-info"
        );

        if (!info) {
            onHidden();
            return;
        }

        let hasFinished = false;

        function finish() {
            if (hasFinished) {
                return;
            }

            hasFinished = true;

            info.removeEventListener("transitionend", handleTransitionEnd);

            if (closeAnimationTimer) {
                clearTimeout(closeAnimationTimer);
                closeAnimationTimer = null;
            }

            onHidden();
        }

        function handleTransitionEnd(event) {
            if (
                event.target === info &&
                event.propertyName === "transform"
            ) {
                finish();
            }
        }

        /*
         * A janela perde fundo, borda e sombra para que o painel
         * pareça entrar atrás do player, como na abertura.
         */
        presentationWindow.style.transition = "none";
        presentationWindow.style.overflow = "hidden";
        presentationWindow.style.background = "transparent";
        presentationWindow.style.borderColor = "transparent";
        presentationWindow.style.boxShadow = "none";

        // O cabeçalho e a legenda do player somem junto com o painel.
        presentationOverlay
            .querySelectorAll(
                ".video-presentation-topline, .video-presentation-video-name"
            )
            .forEach((element) => {
                element.style.transition =
                    `opacity ${PANEL_CLOSE_DURATION}ms ease`;
                element.style.opacity = "0";
            });

        info.style.animation = "none";
        info.style.overflow = "hidden";
        info.style.transition =
            `transform ${PANEL_CLOSE_DURATION}ms ${PANEL_CLOSE_EASING}`;

        info.addEventListener("transitionend", handleTransitionEnd);

        info.style.transform = getHiddenPanelTransform();

        // Fallback se transitionend não for disparado.
        closeAnimationTimer = setTimeout(
            finish,
            PANEL_CLOSE_DURATION + 150
        );
    }

    // ==========================================
    // FECHA ANIMANDO O PLAYER DE VOLTA À ORIGEM
    // ==========================================

    function shrinkToSourcePlayer() {
        const info = presentationOverlay.querySelector(
            ".video-presentation-info"
        );

        // O painel já está atrás do player e não volta a aparecer
        // quando o vídeo sair da janela.
        if (info) {
            info.style.visibility = "hidden";
        }

        // Fallback se o player original tiver sido removido.
        if (
            !sourcePlayerForPresentation ||
            !sourcePlayerForPresentation.isConnected
        ) {
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

        /*
         * Move o vídeo para o overlay para que position: fixed
         * use as coordenadas da tela.
         */
        presentationVideo.remove();

        presentationOverlay.appendChild(presentationVideo);

        /*
         * Sem o vídeo, a janela não tem mais nada a mostrar.
         * Ela é escondida para que sua sombra e o restante da
         * moldura não encolham junto com o player.
         */
        presentationWindow.style.visibility = "hidden";

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

    // ==========================================
    // ATIVAÇÃO PELO ATRIBUTO data-presentation
    // ==========================================

    const TRIGGER_SELECTOR = "[data-presentation]";

    const DATA_KEYS = [
        "title",
        "summary",
        "extra",
        "highlights",
        "eyebrow",
        "context",
        "label",
        "number",
        "total",
        "footer"
    ];

    function getDataFromElement(element) {
        const data = {};

        DATA_KEYS.forEach((key) => {
            if (element.dataset[key] !== undefined) {
                data[key] = element.dataset[key];
            }
        });

        if (element.dataset.src) {
            data.src = element.dataset.src;
            return data;
        }

        // Sem data-src, o vídeo usa as próprias fontes.
        if (element.tagName === "VIDEO") {
            const sources = [...element.querySelectorAll("source")]
                .filter((source) => source.getAttribute("src"))
                .map((source) => ({
                    src: source.src,
                    type: source.type || guessVideoType(source.src)
                }));

            if (sources.length) {
                data.sources = sources;
            } else if (element.currentSrc || element.src) {
                data.src = element.currentSrc || element.src;
            }
        }

        return data;
    }

    function getTrigger(target) {
        const trigger =
            target instanceof Element
                ? target.closest(TRIGGER_SELECTOR)
                : null;

        // Ignora elementos dentro da própria apresentação.
        if (
            !trigger ||
            (presentationOverlay && presentationOverlay.contains(trigger))
        ) {
            return null;
        }

        return trigger;
    }

    function openFromTrigger(trigger, event) {
        event.preventDefault();

        // Impede o player original de disputar a reprodução
        // com o vídeo da apresentação ampliada.
        if (trigger.tagName === "VIDEO") {
            trigger.pause();
        }

        openPresentation(getDataFromElement(trigger), trigger);
    }

    document.addEventListener("click", (event) => {
        const trigger = getTrigger(event.target);

        if (trigger) {
            openFromTrigger(trigger, event);
        }
    });

    // Enter abre a apresentação quando o elemento está em foco.
    document.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") {
            return;
        }

        const trigger = getTrigger(event.target);

        if (trigger && trigger === event.target) {
            openFromTrigger(trigger, event);
        }
    });

    // ==========================================
    // ACESSIBILIDADE DOS ELEMENTOS ATIVADORES
    // ==========================================

    const FOCUSABLE_TAGS = ["A", "BUTTON", "VIDEO"];

    function prepareTrigger(element) {
        element.setAttribute("aria-haspopup", "dialog");

        // Cards e imagens passam a ser alcançáveis pelo teclado.
        if (
            !FOCUSABLE_TAGS.includes(element.tagName) &&
            !element.hasAttribute("tabindex")
        ) {
            element.tabIndex = 0;
            element.setAttribute("role", "button");
        }
    }

    function prepareTriggers(root) {
        if (!(root instanceof Element)) {
            return;
        }

        if (root.matches(TRIGGER_SELECTOR)) {
            prepareTrigger(root);
        }

        root.querySelectorAll(TRIGGER_SELECTOR).forEach(prepareTrigger);
    }

    // ==========================================
    // INICIALIZAÇÃO
    // ==========================================

    function init() {
        // Prepara o overlay antes do primeiro clique.
        createPresentation();

        prepareTriggers(document.body);

        // Prepara também os elementos adicionados depois.
        new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "attributes") {
                    prepareTriggers(mutation.target);
                    return;
                }

                mutation.addedNodes.forEach(prepareTriggers);
            });
        }).observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["data-presentation"]
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    // ==========================================
    // API PÚBLICA
    // ==========================================

    window.VideoPresentation = {
        open: openPresentation,
        close: closePresentation,

        setDefaults(options) {
            Object.assign(defaults, options);
        }
    };
})();