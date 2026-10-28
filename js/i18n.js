/*
 * ==========================================
 * I18N (PORTUGUÊS / INGLÊS)
 * ==========================================
 *
 * O texto em português fica no HTML, como sempre. A versão em
 * inglês fica ao lado, em atributos:
 *
 *   data-en="Texto"            troca o texto do elemento
 *   data-en-html="Texto<br>"   troca o conteúdo com HTML (quebras, spans)
 *   data-en-attrs='{"alt": "Texto", "aria-label": "Texto"}'
 *                              troca atributos (alt, title, content,
 *                              data-title de vídeos...)
 *
 *   <p data-en="Hello">Olá</p>
 *
 * O botão de idioma é qualquer elemento com data-lang-toggle; dentro
 * dele, os elementos com data-lang="pt" / data-lang="en" marcam a
 * opção ativa.
 *
 * Textos criados pelo JavaScript da página usam a API:
 *
 *   I18n.lang                      "pt" ou "en"
 *   I18n.pick({ pt: "Olá", en: "Hello" })   texto no idioma atual
 *   I18n.onChange((lang) => { ... })        roda agora e a cada troca
 *
 * A escolha fica salva no navegador. Na primeira visita, o idioma
 * segue o do navegador (português para pt-*, inglês para o resto).
 */

(() => {
    "use strict";

    const STORAGE_KEY = "lang";
    const LANGS = ["pt", "en"];

    // Textos originais em português, guardados na primeira troca.
    const originals = new WeakMap();
    const listeners = [];

    function readSaved() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch {
            return null;
        }
    }

    function save(lang) {
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch {
            // Sem armazenamento (modo privado): vale só nesta visita.
        }
    }

    function detect() {
        const saved = readSaved();

        if (LANGS.includes(saved)) {
            return saved;
        }

        return (navigator.language || "pt").toLowerCase().startsWith("pt") ? "pt" : "en";
    }

    let lang = detect();

    // ------------------------------------------
    // TRADUÇÃO DO HTML
    // ------------------------------------------

    function remember(element) {
        if (originals.has(element)) {
            return originals.get(element);
        }

        const original = { attrs: {} };

        if (element.hasAttribute("data-en")) {
            original.text = element.textContent;
        }

        if (element.hasAttribute("data-en-html")) {
            original.html = element.innerHTML;
        }

        if (element.hasAttribute("data-en-attrs")) {
            Object.keys(parseAttrs(element)).forEach((name) => {
                original.attrs[name] = element.getAttribute(name);
            });
        }

        originals.set(element, original);

        return original;
    }

    function parseAttrs(element) {
        try {
            return JSON.parse(element.getAttribute("data-en-attrs")) || {};
        } catch {
            return {};
        }
    }

    function translate(root = document) {
        const selector = "[data-en], [data-en-html], [data-en-attrs]";
        const elements = [...root.querySelectorAll(selector)];

        if (root instanceof Element && root.matches(selector)) {
            elements.unshift(root);
        }

        elements.forEach((element) => {
            const original = remember(element);
            const english = lang === "en";

            if ("text" in original) {
                element.textContent = english ? element.getAttribute("data-en") : original.text;
            }

            if ("html" in original) {
                element.innerHTML = english ? element.getAttribute("data-en-html") : original.html;
            }

            const attrs = parseAttrs(element);

            Object.keys(attrs).forEach((name) => {
                const value = english ? attrs[name] : original.attrs[name];

                if (value === null || value === undefined) {
                    element.removeAttribute(name);
                } else {
                    element.setAttribute(name, value);
                }
            });
        });
    }

    // ------------------------------------------
    // BOTÃO DE IDIOMA
    // ------------------------------------------

    function updateToggles() {
        document.querySelectorAll("[data-lang-toggle]").forEach((toggle) => {
            toggle.querySelectorAll("[data-lang]").forEach((option) => {
                option.classList.toggle("is-active", option.dataset.lang === lang);
            });

            toggle.setAttribute("aria-label", lang === "pt"
                ? "Mudar o idioma para inglês"
                : "Switch language to Portuguese");
        });
    }

    function apply() {
        document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
        translate();
        updateToggles();
        listeners.forEach((listener) => listener(lang));
    }

    function setLang(next) {
        if (!LANGS.includes(next) || next === lang) {
            return;
        }

        lang = next;
        save(lang);
        apply();
    }

    document.addEventListener("click", (event) => {
        const toggle = event.target.closest("[data-lang-toggle]");

        if (!toggle) {
            return;
        }

        const option = event.target.closest("[data-lang]");

        setLang(option ? option.dataset.lang : (lang === "pt" ? "en" : "pt"));
    });

    // ------------------------------------------
    // API PARA O JAVASCRIPT DAS PÁGINAS
    // ------------------------------------------

    window.I18n = {
        get lang() {
            return lang;
        },

        set: setLang,

        // Escolhe o texto do idioma atual em { pt, en }.
        // Strings simples passam direto.
        pick(value) {
            if (value && typeof value === "object" && "pt" in value) {
                return value[lang] ?? value.pt;
            }

            return value;
        },

        // Traduz um trecho criado depois do carregamento.
        translate,

        // Roda agora e a cada troca de idioma.
        onChange(listener) {
            listeners.push(listener);
            listener(lang);
        }
    };

    // Este script é carregado antes dos outros (defer, em ordem),
    // então a página já nasce no idioma certo.
    apply();
})();
