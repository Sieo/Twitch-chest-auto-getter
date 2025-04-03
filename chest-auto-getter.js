// ==UserScript==
// @name         Twitch chest auto getter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Let you get the chest automatically
// @author       Sieo
// @match      https://www.twitch.tv/*
// @match      https://*.ext-twitch.tv/*
// @grant        none
// @run-at       document-end
// ==/UserScript==
(function () {
    'use strict';

    let number_chest_got = 0;
    let chestObserver = null; // Stocke l'observateur
    let chestClicked = false; // Empêche le spam de clics

    // Icône du coffre
    const tw_chest_icon = `
        <div style="width: 2rem; height: 2rem; fill: var(--color-text-base); margin-right: 0.5rem !important; cursor: pointer">
            <div class="tw-icon">
                <svg width="100%" height="100%" viewBox="0 0 20 20">
                    <g>
                        <path fill-rule="evenodd" d="M16.503 3.257L18 7v11H2V7l1.497-3.743A2 2 0 015.354 2h9.292a2 2 0 011.857 1.257zM5.354 4h9.292l1.2 3H4.154l1.2-3zM4 9v7h12V9h-3v4H7V9H4zm7 0v2H9V9h2z" clip-rule="evenodd"></path>
                    </g>
                </svg>
            </div>
        </div>`;

    // Fonction pour attendre un élément dans le DOM
    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    // Met à jour le compteur de coffres récupérés
    function updateChestCount() {
        const chestCounter = document.getElementById('numberOfChestGot');
        if (chestCounter) {
            chestCounter.innerText = ++number_chest_got;
        }
    }

    // Vérifie et clique sur un coffre si présent
    function checkAndClickChest() {
        const button_div = document.querySelector(".claimable-bonus__icon");
        if (button_div && !chestClicked) {
            const button_to_click = button_div.closest('button');
            if (button_to_click) {
                chestClicked = true; // Empêche un double clic
                button_to_click.click();
                updateChestCount();

                setTimeout(() => { chestClicked = false; }, 500); // Réactive après un petit délai
            }
        }
    }

    // Assure que l'icône du coffre et le compteur sont affichés
    function ensureChestIcon() {
        const elm = document.querySelector('.community-points-summary');
        if (!elm || document.getElementById('numberOfChestGot')) return;

        const chestContainer = document.createElement('div');
        chestContainer.innerHTML = `
            <div title="Nombre de coffres récupérés"
                class="tw-mg-l-05 tw-core-button-label tw-core-button--secondary
                tw-align-middle tw-border-radius-medium tw-align-items-center tw-flex tw-full-height">
                <span class="tw-animated-number tw-semibold tw-mg-r-05" id="numberOfChestGot">${number_chest_got}</span>
                ${tw_chest_icon}
            </div>`;
        elm.appendChild(chestContainer);
    }

    // Observe les changements de DOM pour détecter les coffres
    function observeForChanges() {
        if (chestObserver) chestObserver.disconnect();

        chestObserver = new MutationObserver(() => {
            ensureChestIcon();
            checkAndClickChest();
        });

        chestObserver.observe(document.body, { childList: true, subtree: true });
    }

    // Démarrage du script une fois que Twitch est chargé
    waitForElm('.community-points-summary').then(() => {
        ensureChestIcon();
        checkAndClickChest();
        observeForChanges();
    });

})();

