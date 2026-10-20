
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

    elementCards.forEach((card, index) => {
        card.addEventListener("click", () => {
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

            detailMedia.replaceChildren();

            const placeholder = document.createElement("span");
            placeholder.className = "mono";
            placeholder.textContent = "ANIMAÇÃO / GIF EM BREVE";

            detailMedia.appendChild(placeholder);

            // Rola suavemente até os detalhes do elemento selecionado.
            detailSection.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        });
    });
});
