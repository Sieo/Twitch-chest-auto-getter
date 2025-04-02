// ==UserScript==
// @name         Twitch chest auto getter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Let you get the chest automatically
// @author       Hugo Mallaroni-Cosentino
// @match      https://www.twitch.tv/*
// @match      https://*.ext-twitch.tv/*
// @grant        none
// @run-at       document-end
// ==/UserScript==
(function() {
   'use strict';
   let number_chest_got = 0;
   const tw_chest_icon = '<div style="width: 2rem; height: 2rem; fill: var(--color-text-base); margin-right: 0.5rem !important; cursor: pointer"><div class="tw-icon"><svg width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px" class="ScIconSVG-sc-1bgeryd-1 cMQeyU"><g><path fill-rule="evenodd" d="M16.503 3.257L18 7v11H2V7l1.497-3.743A2 2 0 015.354 2h9.292a2 2 0 011.857 1.257zM5.354 4h9.292l1.2 3H4.154l1.2-3zM4 9v7h12V9h-3v4H7V9H4zm7 0v2H9V9h2z" clip-rule="evenodd"></path></g></svg></div></div>';

   function waitForElm(selector) {
       return new Promise(resolve => {
           const existingElement = document.querySelector(selector);
           if (existingElement) return resolve(existingElement);

           const observer = new MutationObserver(() => {
               const element = document.querySelector(selector);
               if (element) {
                   resolve(element);
                   observer.disconnect();
               }
           });
           observer.observe(document.body, { childList: true, subtree: true });
       });
   }

   function updateChestCount() {
       const chestCounter = document.getElementById('numberOfChestGot');
       if (chestCounter) {
           chestCounter.innerText = ++number_chest_got;
       }
   }

   function checkAndClickChest() {
       const button_div = document.querySelector(".claimable-bonus__icon");
       if (button_div) {
           const button_to_click = button_div.closest('button');
           if (button_to_click) {
               button_to_click.click();
               updateChestCount();
           }
       }
   }

   function ensureChestIcon(elm) {
       let chestDisplay = document.getElementById('numberOfChestGot');
       if (!chestDisplay) {
           const chestContainer = document.createElement('div');
           chestContainer.innerHTML = `
               <div title="Nombre de coffres récupérés" class="tw-mg-l-05 tw-core-button-label tw-core-button--secondary tw-align-middle tw-border-radius-medium tw-align-items-center tw-flex tw-full-height">
                   <span class="tw-animated-number tw-semibold tw-mg-r-05" id="numberOfChestGot">${number_chest_got}</span>
                   ${tw_chest_icon}
               </div>`;
           elm.appendChild(chestContainer);
       }
   }

   function observeForChanges() {
       const observer = new MutationObserver(() => {
           ensureChestIcon(document.querySelector('.community-points-summary'));
           checkAndClickChest();
       });

       observer.observe(document.body, { childList: true, subtree: true });
   }

   waitForElm('.community-points-summary').then((elm) => {
       ensureChestIcon(elm);
       checkAndClickChest();
       observeForChanges();
   });

})();
