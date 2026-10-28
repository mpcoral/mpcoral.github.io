/*
 * ==========================================
 * SLIDESHOW
 * ==========================================
 *
 * Troca as imagens de um bloco com fade e um zoom lento.
 * Os estilos ficam em css/global.css.
 *
 * Uso:
 *
 *   <div class="slideshow" data-interval="6000">
 *       <img class="slideshow-slide is-active" src="..." alt="...">
 *       <img class="slideshow-slide" src="..." alt="..." aria-hidden="true">
 *   </div>
 *
 *   <script src="js/slideshow.js" defer></script>
 *
 *   data-interval (opcional): tempo de cada imagem em milissegundos.
 *   A primeira imagem deve vir com a classe is-active, para aparecer
 *   mesmo sem JavaScript.
 */

(() => {
    "use strict";

    const DEFAULT_INTERVAL = 6000;

    // Quem prefere menos animação vê só a primeira imagem, parada.
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    function showSlide(slide) {
        slide.classList.add("is-active");
        slide.removeAttribute("aria-hidden");
    }

    function hideSlide(slide) {
        slide.classList.remove("is-active");
        slide.setAttribute("aria-hidden", "true");
    }

    /*
     * A primeira imagem já chega ativa pelo HTML, então o navegador
     * nunca a vê "entrando" e o zoom não seria animado. Aqui ela volta
     * ao estado inicial sem piscar e é ativada de novo.
     */
    function replayFirstSlide(slide) {
        slide.style.transition = "none";
        slide.style.opacity = "1";
        slide.classList.remove("is-active");

        // Força o navegador a registrar o estado sem zoom.
        slide.getBoundingClientRect();

        slide.style.transition = "";
        slide.style.opacity = "";
        slide.classList.add("is-active");
    }

    function startSlideshow(slideshow) {
        const slides = slideshow.querySelectorAll(".slideshow-slide");

        if (slides.length < 2 || prefersReducedMotion) {
            return;
        }

        const interval =
            Number(slideshow.dataset.interval) || DEFAULT_INTERVAL;

        let currentIndex = 0;

        replayFirstSlide(slides[currentIndex]);

        setInterval(() => {
            // Não troca enquanto a aba estiver em segundo plano.
            if (document.hidden) {
                return;
            }

            hideSlide(slides[currentIndex]);

            currentIndex = (currentIndex + 1) % slides.length;

            showSlide(slides[currentIndex]);
        }, interval);
    }

    function init() {
        document.querySelectorAll(".slideshow").forEach(startSlideshow);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
