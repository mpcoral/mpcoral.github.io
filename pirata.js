
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

    if (!window.WaveSystem) {
        console.error(
            "WaveSystem não foi carregado. Verifique o script wave-system.js no HTML."
        );
        return;
    }

    // ==========================================
    // INICIALIZA O WAVE SYSTEM
    // ==========================================

    const firstCard = elementCards[0];

    window.WaveSystem.init(elementCards);

    // ==========================================
    // SELEÇÃO DOS CARDS
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
            window.WaveSystem.render(detailMedia);
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
