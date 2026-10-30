/*
 * ==========================================
 * SCREEN TOUR
 * ==========================================
 *
 * Apresenta as telas de um app guiada por um bonequinho palito.
 *
 * - Ele cai sobre o primeiro card (que treme com o peso) e
 *   atravessa o card andando: a caminhada é o tempo da tela.
 * - No fim do card, finca uma bandeirinha, pisa para fora da
 *   borda e cai no card de baixo, andando no sentido contrário
 *   (zigue-zague).
 * - Telas com vários prints têm painéis de vidro no card: ele
 *   chuta o vidro, o vidro racha e estoura, e o print troca.
 * - Depois do último card ele comemora, as bandeiras somem e
 *   tudo recomeça.
 * - A barra da janela tem uma bolinha por print: ela enche no
 *   tempo da tela e dá um brilho quando o print termina.
 *
 * No celular e no tablet (até 900 px), os cards viram uma trilha
 * numerada logo acima do print, para os dois caberem juntos na tela.
 * Nela ele anda só para a direita, espera com a tela à mostra e
 * pula de um trecho para o outro.
 *
 * ------------------------------------------
 * 1. INCLUA OS ARQUIVOS NA PÁGINA
 * ------------------------------------------
 *
 *   <link rel="stylesheet" href="css/screen-tour.css">
 *   <script src="js/screen-tour.js" defer></script>
 *
 *   (Ajuste os caminhos conforme a pasta da página, ex.: "../css/...")
 *
 * ------------------------------------------
 * 2. CRIE UM CONTAINER VAZIO
 * ------------------------------------------
 *
 *   <div id="screen-tour" aria-label="Telas do app"></div>
 *
 *   O tour monta tudo dentro dele: cards, janela, bonequinho,
 *   bandeiras, vidros e a imagem ampliada.
 *
 * ------------------------------------------
 * 3. CHAME ScreenTour.create COM AS TELAS
 * ------------------------------------------
 *
 *   (em um script carregado depois deste)
 *
 *   ScreenTour.create(document.getElementById("screen-tour"), [
 *       {
 *           name: "Caixa",
 *           description: "Abertura e fechamento",
 *           images: ["caixa-1.png", "caixa-2.png"],  // 2 prints = 1 vidro
 *           points: ["Destaque 1", "Destaque 2"]
 *       }
 *   ]);
 *
 * O mouse sobre a tela pausa tudo e o bonequinho senta.
 * Clicar em um card leva o bonequinho direto até ele.
 * Clicar na tela abre o print ampliado.
 *
 * ------------------------------------------
 * 4. (OPCIONAL) TEXTOS E TROCA DE IDIOMA
 * ------------------------------------------
 *
 *   const tour = ScreenTour.create(elemento, telas, {
 *       labels: { zoom: "Enlarge image", close: "Close", screen: "Screen:" }
 *   });
 *
 *   // labels.tag mostra uma etiqueta na barra da janela (ex.: "Dados fictícios").
 *
 *   // Troca nomes, descrições e destaques sem reiniciar o passeio:
 *   tour.update(telasEmOutroIdioma, rotulosEmOutroIdioma);
 *
 * ------------------------------------------
 * 5. (OPCIONAL) CORES E FONTES
 * ------------------------------------------
 *
 *   O CSS usa as variáveis do site (--accent, --mono, --surface...)
 *   quando existem. Para trocar só no tour:
 *
 *   #screen-tour { --st-accent: #ff8a3d; }
 *
 * ------------------------------------------
 * 6. (OPCIONAL) BONEQUINHO SENTADO
 * ------------------------------------------
 *
 *   Sem o tour, ele só senta na borda de um elemento, balança as
 *   pernas e faz gracinhas. O elemento precisa de position: relative.
 *
 *   <a class="card" data-stickman-perch>...</a>
 *
 *   Para mudar o lugar: .card .stickman-perch { right: 80px; }
 */

(() => {
    "use strict";

    // Tempo que cada print fica na tela (= tempo de um trecho da caminhada).
    const PRINT_DURATION = 5500;

    const DROP_DURATION = 650;
    const FALL_DURATION = 520;
    const JUMP_DURATION = 720;
    const STEP_OFF_DURATION = 260;

    // Quanto ele avança para fora da borda antes de cair.
    const STEP_OFF_DISTANCE = 22;

    // Distância entre o bonequinho e a borda do card ao começar a andar.
    const EDGE_MARGIN = 6;

    // Trilha do celular: velocidade da caminhada (px/s), quanto ele
    // ocupa do trecho anterior ao pousar e a altura do pulo entre trechos.
    const TRACK_SPEED = 45;
    const TRACK_OVERHANG = 8;
    const TRACK_JUMP_HEIGHT = 26;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Mesmo limite do CSS (css/screen-tour.css, seção RESPONSIVIDADE).
    const trackLayout = window.matchMedia("(max-width: 900px)");

    // Erro usado para interromper o passeio quando um card é clicado.
    const CANCELLED = Symbol("cancelled");

    // Sentado há um tempo, ele faz gracinhas, uma de cada vez.
    const TRICKS = ["is-trick-wave", "is-trick-flex", "is-trick-double"];
    const TRICK_FIRST_DELAY = 2500;
    const TRICK_DURATION = 2400;
    const TRICK_GAP = 2200;

    // ==========================================
    // DESENHOS (SVG)
    // ==========================================

    // Boneco articulado: braço e antebraço, coxa e canela.
    // Cada parte gira em torno da articulação (ombro, cotovelo,
    // quadril, joelho), e o CSS monta as poses e a caminhada.
    const STICKMAN_SVG = `
        <svg viewBox="0 0 30 44" aria-hidden="true">
            <g class="stickman-figure">
                <g class="stickman-rig">
                    <g class="stickman-upper">
                        <circle class="stickman-head" cx="15" cy="6" r="4.5" />
                        <line x1="15" y1="10.5" x2="15" y2="25" />

                        <g class="stickman-arm is-left">
                            <line x1="15" y1="13" x2="15" y2="19.5" />
                            <path class="stickman-bicep" d="M15 14 Q11.2 16.5 15 19" />
                            <g class="stickman-forearm">
                                <line x1="15" y1="19.5" x2="15" y2="25" />
                            </g>
                        </g>

                        <g class="stickman-arm is-right">
                            <line x1="15" y1="13" x2="15" y2="19.5" />
                            <path class="stickman-bicep" d="M15 14 Q18.8 16.5 15 19" />
                            <g class="stickman-forearm">
                                <line x1="15" y1="19.5" x2="15" y2="25" />
                            </g>
                        </g>
                    </g>

                    <g class="stickman-leg is-left">
                        <line x1="15" y1="25" x2="15" y2="34" />
                        <g class="stickman-shin">
                            <line x1="15" y1="34" x2="15" y2="43" />
                        </g>
                    </g>

                    <g class="stickman-leg is-right">
                        <line x1="15" y1="25" x2="15" y2="34" />
                        <g class="stickman-shin">
                            <line x1="15" y1="34" x2="15" y2="43" />
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    `;

    const FLAG_SVG = `
        <svg viewBox="0 0 22 34" aria-hidden="true">
            <line class="flag-pole" x1="3" y1="2" x2="3" y2="34" />
            <path class="flag-cloth" d="M3 3 L20 8 L3 13 Z" />
        </svg>
    `;

    // Painel de vidro: rachaduras saem do ponto do chute (6, 26).
    // Os cacos cobrem o painel e voam quando ele estoura.
    const GLASS_SVG = `
        <svg viewBox="0 0 12 46" aria-hidden="true">
            <g class="glass-pane">
                <rect x="1" y="1" width="10" height="44" rx="1.5" />
                <line class="glass-shine" x1="3.5" y1="5" x2="3.5" y2="16" />
            </g>
            <g class="glass-cracks">
                <path pathLength="1" d="M6 26 L2.5 17 L3 9" />
                <path pathLength="1" d="M6 26 L9.5 15 L8 4" />
                <path pathLength="1" d="M6 26 L1.5 32" />
                <path pathLength="1" d="M6 26 L10.5 35 L9 43" />
                <path pathLength="1" d="M6 26 L4.5 41" />
            </g>
            <g class="glass-shards">
                <polygon points="1,1 11,1 9.5,15 6,26 2.5,17" />
                <polygon points="2.5,17 6,26 1,32 1,1" />
                <polygon points="11,1 11,35 10.5,35 6,26 9.5,15" />
                <polygon points="1,32 6,26 4.5,41 1,45" />
                <polygon points="6,26 10.5,35 11,45 4.5,45 4.5,41" />
            </g>
        </svg>
    `;

    // ==========================================
    // GRACINHAS E BONEQUINHO SENTADO
    // ==========================================

    // Alterna as gracinhas de um bonequinho sentado.
    function createTricks(stickman) {
        let timer = null;
        let next = 0;

        function stop() {
            clearTimeout(timer);
            timer = null;
            stickman.classList.remove(...TRICKS);
        }

        function schedule(delay) {
            timer = setTimeout(() => {
                const trick = TRICKS[next];

                next = (next + 1) % TRICKS.length;
                stickman.classList.add(trick);

                timer = setTimeout(() => {
                    stickman.classList.remove(trick);
                    schedule(TRICK_GAP);
                }, TRICK_DURATION);
            }, delay);
        }

        return { stop, schedule, isScheduled: () => timer !== null };
    }

    // Senta o bonequinho na borda de cima de um elemento.
    function perch(element) {
        const seat = document.createElement("div");

        seat.className = "stickman-perch";
        seat.setAttribute("aria-hidden", "true");
        seat.innerHTML = `<div class="stickman is-visible is-sitting">${STICKMAN_SVG}</div>`;
        element.appendChild(seat);

        const tricks = createTricks(seat.firstElementChild);

        // Só se mexe enquanto está à vista.
        new IntersectionObserver((entries) => {
            const isVisible = entries[0].isIntersecting;

            seat.classList.toggle("is-offscreen", !isVisible);
            tricks.stop();

            if (isVisible && !reduceMotion) {
                tricks.schedule(TRICK_FIRST_DELAY);
            }
        }).observe(seat);
    }

    // ==========================================
    // CRIA O TOUR
    // ==========================================

    // Textos da interface do tour. Podem ser trocados pela opção
    // { labels } do create ou depois, pelo update (ex.: troca de idioma).
    const DEFAULT_LABELS = {
        zoom: "Ampliar imagem",
        enlarged: "Imagem ampliada",
        close: "Fechar",
        screen: "Tela de",
        part: "parte",
        tag: ""
    };

    function create(root, screens, options = {}) {
        if (!root || !screens.length) {
            return null;
        }

        let labels = { ...DEFAULT_LABELS, ...options.labels };

        root.classList.add("tour");

        root.innerHTML = `
            <ol class="tour-list"></ol>

            <div class="tour-stage">
                <div class="tour-device">
                    <div class="tour-bar">
                        <span class="tour-dots" aria-hidden="true"></span>
                        <span class="tour-name"></span>
                        <span class="tour-tag"></span>
                        <span class="tour-counter"></span>
                    </div>
                    <button class="tour-window" type="button" title="${labels.zoom}"></button>
                </div>
                <ul class="tour-points" aria-live="polite"></ul>
            </div>

            <div class="stickman" aria-hidden="true">${STICKMAN_SVG}</div>

            <dialog class="tour-lightbox" aria-label="${labels.enlarged}">
                <div class="tour-lightbox-scroll"></div>
                <button class="tour-lightbox-close" type="button" aria-label="${labels.close}">×</button>
            </dialog>
        `;

        const list = root.querySelector(".tour-list");
        const stage = root.querySelector(".tour-stage");
        const windowButton = root.querySelector(".tour-window");
        const nameLabel = root.querySelector(".tour-name");
        const dotList = root.querySelector(".tour-dots");
        const tag = root.querySelector(".tour-tag");
        const counter = root.querySelector(".tour-counter");
        const points = root.querySelector(".tour-points");
        const stickman = root.querySelector(".stickman");
        const figure = stickman.querySelector("svg");
        const lightbox = root.querySelector(".tour-lightbox");
        const lightboxScroll = root.querySelector(".tour-lightbox-scroll");

        tag.textContent = labels.tag;

        // Estado do passeio
        let current = -1;       // card ativo
        let currentPart = 0;    // print ativo dentro do card
        let position = { x: 0, y: 0 };
        let runToken = 0;       // muda a cada novo passeio, cancelando o anterior
        let isPaused = false;
        let isVisible = false;
        let hasStarted = false;

        // Animações em andamento (para pausar e cancelar juntas)
        const running = new Set();

        // Bandeiras fincadas e vidros de cada card
        const flags = new Map();
        let walls = [];

        // Carrega os prints de antemão, para a troca ser imediata.
        screens.forEach((screen) => {
            screen.images.forEach((src) => {
                new Image().src = src;
            });
        });

        // ------------------------------------------
        // CARDS
        // ------------------------------------------

        const cards = screens.map((screen, index) => {
            const item = document.createElement("li");
            const card = document.createElement("button");

            card.type = "button";
            card.className = "tour-card";

            // Um trecho por print, separados pelo vidro "esticado" no card.
            // Nos cards percorridos da direita para a esquerda, a ordem inverte.
            card.innerHTML = `
                <span class="tour-card-parts" aria-hidden="true">
                    ${"<i></i>".repeat(screen.images.length)}
                </span>
                <strong></strong>
                <small></small>
            `;

            card.classList.toggle("is-reverse", direction(index) < 0);

            // Na trilha, cada card ocupa espaço conforme o número de prints.
            item.style.setProperty("--parts", screen.images.length);

            card.querySelector("strong").textContent = screen.name;
            card.querySelector("small").textContent = screen.description || "";

            card.addEventListener("click", () => {
                if (index !== current || !hasStarted) {
                    startTour(index, "jump");
                }
            });

            item.appendChild(card);
            list.appendChild(item);

            return card;
        });

        // ------------------------------------------
        // MEDIDAS (relativas ao tour)
        // ------------------------------------------

        function cardBox(index) {
            const rootRect = root.getBoundingClientRect();
            const rect = cards[index].getBoundingClientRect();

            return {
                left: rect.left - rootRect.left,
                right: rect.right - rootRect.left,
                top: rect.top - rootRect.top
            };
        }

        // Cards pares andam para a direita; ímpares, para a esquerda.
        // Na trilha, sempre para a direita.
        function direction(index) {
            return trackLayout.matches || index % 2 === 0 ? 1 : -1;
        }

        // Onde os pés tocam a borda de cima do card.
        function groundY(index) {
            return cardBox(index).top - stickman.offsetHeight + 1;
        }

        function startX(index) {
            const box = cardBox(index);

            if (trackLayout.matches) {
                return box.left - TRACK_OVERHANG;
            }

            return direction(index) > 0
                ? box.left + EDGE_MARGIN
                : box.right - EDGE_MARGIN - stickman.offsetWidth;
        }

        function endX(index) {
            const box = cardBox(index);

            if (trackLayout.matches) {
                return box.right - stickman.offsetWidth;
            }

            return direction(index) > 0
                ? box.right - EDGE_MARGIN - stickman.offsetWidth
                : box.left + EDGE_MARGIN;
        }

        // Posição horizontal de cada vidro (divide o card em trechos iguais).
        function wallX(index, wall) {
            const box = cardBox(index);
            const parts = screens[index].images.length;
            const fraction = wall / parts;

            return direction(index) > 0
                ? box.left + (box.right - box.left) * fraction
                : box.right - (box.right - box.left) * fraction;
        }

        // ------------------------------------------
        // ANIMAÇÕES QUE PODEM SER PAUSADAS E CANCELADAS
        // ------------------------------------------

        function check(token) {
            if (token !== runToken) {
                throw CANCELLED;
            }
        }

        async function play(element, keyframes, options, token) {
            check(token);

            const animation = element.animate(keyframes, options);

            running.add(animation);

            if (isPaused || !isVisible) {
                animation.pause();
            }

            try {
                await animation.finished;
            } catch {
                throw CANCELLED;
            } finally {
                running.delete(animation);
            }

            check(token);
        }

        // Espera que também respeita a pausa.
        function hold(ms, token) {
            return play(root, [{}, {}], { duration: ms }, token);
        }

        function moveTo(x, y) {
            position = { x, y };
            stickman.style.transform = `translate(${x}px, ${y}px)`;
        }

        function translate(x, y) {
            return { transform: `translate(${x}px, ${y}px)` };
        }

        function face(dir) {
            stickman.classList.toggle("is-facing-left", dir < 0);
        }

        // ------------------------------------------
        // MOVIMENTOS DO BONEQUINHO
        // ------------------------------------------

        // Pousa com um amassado e o card treme com o peso.
        async function land(index, token) {
            stickman.classList.remove("is-jumping", "is-falling");

            await Promise.all([
                play(figure, [
                    { transform: "scale(1.18, 0.78)" },
                    { transform: "scale(1)" }
                ], { duration: 240, easing: "ease-out" }, token),

                play(cards[index], [
                    { transform: "translateY(0)" },
                    { transform: "translateY(4px)", offset: 0.25 },
                    { transform: "translateY(-1.5px)", offset: 0.6 },
                    { transform: "translateY(0)" }
                ], { duration: 340, easing: "ease-out" }, token)
            ]);
        }

        // Cai do alto até o começo do card.
        async function drop(index, token) {
            const x = startX(index);
            const y = groundY(index);

            face(direction(index));
            stickman.classList.add("is-visible", "is-falling");

            await play(stickman, [
                { transform: `translate(${x}px, ${y - 170}px)`, opacity: 0 },
                { transform: `translate(${x}px, ${y - 130}px)`, opacity: 1, offset: 0.2 },
                translate(x, y)
            ], { duration: DROP_DURATION, easing: "cubic-bezier(0.55, 0, 1, 0.45)" }, token);

            moveTo(x, y);
            await land(index, token);
        }

        // Do lado de fora da borda, cai até o card de baixo.
        async function fall(index, token) {
            const x = startX(index);
            const y = groundY(index);

            stickman.classList.add("is-falling");

            await play(stickman, [
                translate(position.x, position.y),
                translate(x, y)
            ], { duration: FALL_DURATION, easing: "cubic-bezier(0.5, 0, 0.9, 0.6)" }, token);

            moveTo(x, y);

            // Pousou: vira para o sentido do novo card (zigue-zague).
            face(direction(index));
            await land(index, token);
        }

        // Pulo em arco até um card qualquer (quando um card é clicado).
        async function jump(index, token) {
            const x = startX(index);
            const y = groundY(index);
            const peak = Math.min(position.y, y) - (trackLayout.matches ? TRACK_JUMP_HEIGHT : 70);

            face(x >= position.x ? 1 : -1);
            stickman.classList.add("is-jumping");

            await play(stickman, [
                translate(position.x, position.y),
                { ...translate((position.x + x) / 2, peak), offset: 0.45 },
                translate(x, y)
            ], { duration: JUMP_DURATION, easing: "ease-in-out" }, token);

            moveTo(x, y);
            face(direction(index));
            await land(index, token);
        }

        // Anda até x no tempo indicado.
        async function walk(x, duration, token) {
            stickman.classList.add("is-walking");

            try {
                await play(stickman, [
                    translate(position.x, position.y),
                    translate(x, position.y)
                ], { duration, easing: "linear" }, token);
            } finally {
                stickman.classList.remove("is-walking");
            }

            moveTo(x, position.y);
        }

        // Finca a bandeira no fim do card: tum!
        async function plantFlag(index, token) {
            const flag = document.createElement("div");

            flag.className = "tour-flag";
            flag.innerHTML = FLAG_SVG;
            root.appendChild(flag);
            flags.set(index, flag);
            placeFlag(index);

            stickman.classList.add("is-planting");

            try {
                await play(flag.querySelector("svg"), [
                    { transform: "translateY(-18px)", opacity: 0 },
                    { transform: "translateY(2px)", opacity: 1, offset: 0.7 },
                    { transform: "translateY(0)" }
                ], { duration: 380, easing: "cubic-bezier(0.3, 0, 0.2, 1.4)" }, token);
            } finally {
                stickman.classList.remove("is-planting");
            }

            // O card sente a batida.
            await play(cards[index], [
                { transform: "translateY(0)" },
                { transform: "translateY(2px)" },
                { transform: "translateY(0)" }
            ], { duration: 160 }, token);
        }

        function placeFlag(index) {
            const flag = flags.get(index);

            if (!flag) {
                return;
            }

            const box = cardBox(index);
            const x = direction(index) > 0 ? box.right - 16 : box.left - 4;

            flag.style.transform = `translate(${x}px, ${box.top - 33}px)`;
        }

        // Pisa para fora da borda, pronto para cair.
        async function stepOff(index, token) {
            const x = position.x + direction(index) * STEP_OFF_DISTANCE;

            await walk(x, STEP_OFF_DURATION, token);
        }

        // ------------------------------------------
        // VIDROS
        // ------------------------------------------

        function buildWalls(index) {
            removeWalls();

            const parts = screens[index].images.length;

            for (let wall = 1; wall < parts; wall++) {
                const element = document.createElement("div");

                element.className = "tour-glass";
                element.innerHTML = GLASS_SVG;
                element.dataset.wall = String(wall);
                root.appendChild(element);
                walls.push(element);
            }

            placeWalls(index);
        }

        function placeWalls(index) {
            walls.forEach((element) => {
                const x = wallX(index, Number(element.dataset.wall)) - element.offsetWidth / 2;
                const y = cardBox(index).top - element.offsetHeight + 1;

                element.style.transform = `translate(${x}px, ${y}px)`;
            });
        }

        function removeWalls() {
            walls.forEach((element) => element.remove());
            walls = [];
        }

        // Chuta, racha e estoura o vidro.
        async function breakWall(element, token) {
            stickman.classList.add("is-kicking");

            await hold(140, token);

            element.classList.add("is-cracked");
            stickman.classList.remove("is-kicking");

            // As rachaduras se espalham.
            await Promise.all([...element.querySelectorAll(".glass-cracks path")].map((path, i) =>
                play(path, [
                    { strokeDashoffset: 1 },
                    { strokeDashoffset: 0 }
                ], { duration: 220, delay: i * 25, easing: "ease-out", fill: "forwards" }, token)
            ));

            await hold(200, token);

            // Estoura em cacos.
            element.classList.add("is-shattered");

            await Promise.all([...element.querySelectorAll(".glass-shards polygon")].map((shard, i) => {
                const dx = (i % 2 === 0 ? 1 : -1) * (8 + i * 4);
                const dy = -10 + i * 9;
                const spin = (i % 2 === 0 ? 1 : -1) * (90 + i * 40);

                return play(shard, [
                    { transform: "translate(0, 0) rotate(0deg)", opacity: 1 },
                    { transform: `translate(${dx}px, ${dy}px) rotate(${spin}deg)`, opacity: 0 }
                ], { duration: 650, easing: "cubic-bezier(0.2, 0.6, 0.4, 1)", fill: "forwards" }, token);
            }));

            element.remove();
            walls = walls.filter((wall) => wall !== element);
        }

        // ------------------------------------------
        // TELA
        // ------------------------------------------

        // Acende os cards: os já percorridos inteiros e,
        // no card atual, os trechos até o print em que ele está.
        function lightCards(index, part) {
            cards.forEach((card, cardIndex) => {
                card.classList.toggle("is-active", cardIndex === index);
                card.classList.toggle("is-done", cardIndex < index);
                card.setAttribute("aria-current", String(cardIndex === index));

                card.querySelectorAll(".tour-card-parts i").forEach((segment, segmentIndex) => {
                    segment.classList.toggle("is-lit",
                        cardIndex < index || (cardIndex === index && segmentIndex <= part));
                });
            });
        }

        function imageAlt(screen, part) {
            return `${labels.screen} ${screen.name}` +
                (screen.images.length > 1 ? `, ${labels.part} ${part + 1}` : "");
        }

        // Bolinhas da barra: uma por print da tela atual.
        function dots() {
            return [...dotList.children];
        }

        function markDots(part) {
            dots().forEach((dot, dotIndex) => {
                dot.classList.toggle("is-full", dotIndex < part || (reduceMotion && dotIndex === part));
                dot.classList.toggle("is-current", dotIndex === part);
            });
        }

        // Enche no tempo do print, pausando junto com o passeio.
        function fillDot(part, duration, token) {
            return play(dots()[part].firstElementChild, [
                { transform: "scaleY(0)" },
                { transform: "scaleY(1)" }
            ], { duration, fill: "forwards" }, token);
        }

        // Print terminado: brilho forte, uma vez.
        function flashDot(part) {
            const dot = dots()[part];

            dot.classList.remove("is-current");
            dot.classList.add("is-full", "is-flash");
        }

        function showScreen(index) {
            const screen = screens[index];

            nameLabel.textContent = screen.name.toUpperCase();
            dotList.innerHTML = "<i><b></b></i>".repeat(screen.images.length);

            points.replaceChildren(...(screen.points || []).map((text, pointIndex) => {
                const point = document.createElement("li");

                point.textContent = text;
                point.style.animationDelay = `${pointIndex * 90}ms`;

                return point;
            }));

            showPart(index, 0);
        }

        function showPart(index, part) {
            const screen = screens[index];
            const image = document.createElement("img");

            currentPart = part;
            lightCards(index, part);
            markDots(part);

            image.className = "tour-image";
            image.src = screen.images[part];
            image.alt = imageAlt(screen, part);

            windowButton.replaceChildren(image);
            image.animate([{ opacity: 0, transform: "scale(1.02)" }, { opacity: 1, transform: "scale(1)" }],
                { duration: 380, easing: "ease-out" });

            counter.textContent = screen.images.length > 1
                ? `${part + 1} / ${screen.images.length}`
                : "";
        }

        // ------------------------------------------
        // O PASSEIO
        // ------------------------------------------

        // Atravessa um card inteiro: trechos, vidros e bandeira.
        async function visitCard(index, token) {
            const parts = screens[index].images.length;
            const dir = direction(index);
            const from = startX(index);
            const to = endX(index);

            current = index;
            showScreen(index);
            buildWalls(index);

            for (let part = 0; part < parts; part++) {
                const isLast = part === parts - 1;
                let target = to;

                if (!isLast) {
                    // Para logo antes do vidro.
                    const glass = wallX(index, part + 1);

                    target = dir > 0
                        ? glass - stickman.offsetWidth
                        : glass;
                }

                const distance = Math.abs(target - position.x);
                const full = Math.abs(to - from) / parts;
                const walkTime = PRINT_DURATION * Math.min(1, distance / full);

                if (trackLayout.matches) {
                    // Na trilha o trecho é curto demais para durar o tempo todo:
                    // ele espera com a tela à mostra e só então anda.
                    const trackWalkTime = Math.min(distance / TRACK_SPEED * 1000, PRINT_DURATION / 2);

                    await Promise.all([
                        fillDot(part, PRINT_DURATION, token),
                        hold(PRINT_DURATION - trackWalkTime, token)
                            .then(() => walk(target, trackWalkTime, token))
                    ]);
                } else {
                    await Promise.all([
                        fillDot(part, walkTime, token),
                        walk(target, walkTime, token)
                    ]);
                }

                if (!isLast) {
                    await breakWall(walls[0], token);
                    flashDot(part);
                    showPart(index, part + 1);
                }
            }

            flashDot(parts - 1);
            await plantFlag(index, token);
        }

        // Depois do último card: comemora e recolhe as bandeiras.
        async function celebrate(token) {
            stickman.classList.add("is-cheering");
            await hold(900, token);
            stickman.classList.remove("is-cheering");

            for (const [index, flag] of [...flags.entries()].reverse()) {
                await play(flag, [
                    { opacity: 1, transform: flag.style.transform },
                    { opacity: 0, transform: `${flag.style.transform} translateY(-16px)` }
                ], { duration: 220, easing: "ease-in" }, token);

                flag.remove();
                flags.delete(index);
            }

            lightCards(-1, 0);

            await play(stickman, [
                { opacity: 1, transform: stickman.style.transform },
                { opacity: 0, transform: `${stickman.style.transform} translateY(-30px)` }
            ], { duration: 300, easing: "ease-in" }, token);

            stickman.classList.remove("is-visible");
        }

        // Começa (ou recomeça) o passeio a partir de um card.
        async function startTour(index, entry) {
            hasStarted = true;

            const token = ++runToken;

            running.forEach((animation) => animation.cancel());
            running.clear();
            removeWalls();
            stickman.className = "stickman" + (stickman.classList.contains("is-visible") ? " is-visible" : "");

            if (reduceMotion) {
                current = index;
                showScreen(index);
                return;
            }

            // Bandeiras dos cards que ainda não foram visitados saem.
            flags.forEach((flag, flagIndex) => {
                if (flagIndex >= index) {
                    flag.remove();
                    flags.delete(flagIndex);
                }
            });

            try {
                let card = index;
                let mode = entry;

                while (true) {
                    if (mode === "drop" || !stickman.classList.contains("is-visible")) {
                        await drop(card, token);
                    } else if (mode === "jump") {
                        await jump(card, token);
                    } else {
                        await fall(card, token);
                    }

                    await visitCard(card, token);

                    if (card === screens.length - 1) {
                        await celebrate(token);
                        card = 0;
                        mode = "drop";
                    } else if (trackLayout.matches) {
                        card += 1;
                        mode = "jump";
                    } else {
                        await stepOff(card, token);
                        card += 1;
                        mode = "fall";
                    }
                }
            } catch (error) {
                if (error !== CANCELLED) {
                    throw error;
                }
            }
        }

        // ------------------------------------------
        // PAUSA: O BONEQUINHO SENTA E ESPERA
        // ------------------------------------------

        const tricks = createTricks(stickman);

        // ------------------------------------------
        // SENTAR E LEVANTAR COM TRANSIÇÃO
        // As poses são classes CSS. Para não pular de uma para a
        // outra, cada parte do corpo parte da posição em que está
        // agora (inclusive no meio de um passo) e desliza até a nova.
        // ------------------------------------------

        const SIT_DURATION = 450;
        const STAND_DURATION = 350;

        const BODY_PARTS = stickman.querySelectorAll(
            ".stickman-figure, .stickman-rig, .stickman-upper, .stickman-arm, " +
            ".stickman-forearm, .stickman-leg, .stickman-shin"
        );

        let poseTimer = null;
        let resumeTimer = null;

        function changePose(applyPose, duration) {
            // Congela cada parte onde ela está neste instante.
            BODY_PARTS.forEach((part) => {
                const now = getComputedStyle(part).transform;

                part.style.transition = "none";
                part.style.animation = "none";
                part.style.transform = now === "none" ? "" : now;
            });

            applyPose();

            // Garante que o navegador registrou a posição congelada.
            stickman.getBoundingClientRect();

            // Solta: cada parte desliza até a pose nova.
            BODY_PARTS.forEach((part) => {
                part.style.transition = `transform ${duration}ms cubic-bezier(0.3, 0.7, 0.3, 1)`;
                part.style.transform = "";
            });

            // Terminada a transição, as animações da pose (balançar as
            // pernas, caminhar) voltam a valer.
            clearTimeout(poseTimer);

            poseTimer = setTimeout(() => {
                BODY_PARTS.forEach((part) => {
                    part.style.transition = "";
                    part.style.animation = "";
                });
            }, duration);
        }

        function updatePause() {
            const paused = isPaused || !isVisible;
            const wasSitting = stickman.classList.contains("is-sitting");
            const standsUp = wasSitting && !isPaused;

            root.classList.toggle("is-offscreen", !isVisible);

            if (isPaused && !wasSitting) {
                changePose(() => stickman.classList.add("is-sitting"), reduceMotion ? 0 : SIT_DURATION);
            } else if (standsUp) {
                changePose(() => {
                    tricks.stop();
                    stickman.classList.remove("is-sitting");
                }, reduceMotion ? 0 : STAND_DURATION);
            }

            // Só faz gracinhas se estiver sentado e à vista.
            if (isPaused && isVisible && !reduceMotion) {
                if (!wasSitting || !tricks.isScheduled()) {
                    tricks.stop();
                    tricks.schedule(TRICK_FIRST_DELAY);
                }
            } else {
                tricks.stop();
            }

            clearTimeout(resumeTimer);

            if (paused) {
                running.forEach((animation) => animation.pause());
                return;
            }

            // Ao levantar, só volta a andar depois de ficar de pé.
            const resume = () => {
                running.forEach((animation) => {
                    if (animation.playState === "paused") {
                        animation.play();
                    }
                });
            };

            if (standsUp && !reduceMotion) {
                resumeTimer = setTimeout(resume, STAND_DURATION);
            } else {
                resume();
            }
        }

        stage.addEventListener("mouseenter", () => {
            isPaused = true;
            updatePause();
        });

        stage.addEventListener("mouseleave", () => {
            isPaused = false;
            updatePause();
        });

        // ------------------------------------------
        // IMAGEM AMPLIADA
        // ------------------------------------------

        windowButton.addEventListener("click", () => {
            const screen = screens[current];

            if (!screen) {
                return;
            }

            const image = document.createElement("img");

            image.src = screen.images[currentPart];
            image.alt = imageAlt(screen, currentPart);
            lightboxScroll.replaceChildren(image);

            isPaused = true;
            updatePause();
            lightbox.showModal();
        });

        root.querySelector(".tour-lightbox-close").addEventListener("click", () => lightbox.close());

        lightbox.addEventListener("click", (event) => {
            if (event.target === lightbox) {
                lightbox.close();
            }
        });

        lightbox.addEventListener("close", () => {
            // No toque, o :hover fica preso depois de fechar a imagem.
            isPaused = window.matchMedia("(hover: hover)").matches && stage.matches(":hover");
            updatePause();
        });

        // ------------------------------------------
        // INÍCIO, VISIBILIDADE E TAMANHO
        // ------------------------------------------

        // Começa quando o tour aparece e pausa quando sai da tela.
        const observer = new IntersectionObserver((entries) => {
            isVisible = entries[0].isIntersecting;

            if (isVisible && !hasStarted) {
                startTour(0, "drop");
            }

            updatePause();
        }, { threshold: 0.3 });

        observer.observe(root);

        // Mostra a primeira tela antes mesmo do bonequinho chegar.
        showScreen(0);
        lightCards(-1, 0);

        // Com a página redimensionada, recomeça o card atual.
        // Só a largura conta: no celular, a barra do navegador muda a
        // altura da tela ao rolar a página.
        let resizeTimer = null;
        let lastWidth = window.innerWidth;

        window.addEventListener("resize", () => {
            if (window.innerWidth === lastWidth) {
                return;
            }

            lastWidth = window.innerWidth;
            clearTimeout(resizeTimer);

            resizeTimer = setTimeout(() => {
                cards.forEach((card, index) => card.classList.toggle("is-reverse", direction(index) < 0));
                flags.forEach((flag, index) => placeFlag(index));

                if (hasStarted && current >= 0) {
                    stickman.classList.remove("is-visible");
                    startTour(current, "drop");
                }
            }, 250);
        });

        // ------------------------------------------
        // TROCA DE TEXTOS (ex.: idioma) SEM REINICIAR O PASSEIO
        // ------------------------------------------

        function update(nextScreens, nextLabels) {
            if (nextLabels) {
                labels = { ...labels, ...nextLabels };

                tag.textContent = labels.tag;
                windowButton.title = labels.zoom;
                lightbox.setAttribute("aria-label", labels.enlarged);
                root.querySelector(".tour-lightbox-close").setAttribute("aria-label", labels.close);
            }

            (nextScreens || []).forEach((next, index) => {
                const screen = screens[index];

                if (!screen) {
                    return;
                }

                screen.name = next.name;
                screen.description = next.description;
                screen.points = next.points;

                cards[index].querySelector("strong").textContent = next.name;
                cards[index].querySelector("small").textContent = next.description || "";
            });

            // Atualiza a tela que está aparecendo.
            const shown = screens[Math.max(current, 0)];
            const image = windowButton.querySelector("img");

            nameLabel.textContent = shown.name.toUpperCase();
            points.replaceChildren(...(shown.points || []).map((text) => {
                const point = document.createElement("li");

                point.textContent = text;
                return point;
            }));

            if (image) {
                image.alt = imageAlt(shown, currentPart);
            }
        }

        return { update };
    }

    document.querySelectorAll("[data-stickman-perch]").forEach(perch);

    window.ScreenTour = { create };
})();
