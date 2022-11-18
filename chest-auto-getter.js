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
   var number_chest_got = 0;

    function waitForElm(selector) {
        console.log('--------------In promise--------------');
        return new Promise(resolve => {
            console.log("QuerySelector 1 : ", document.querySelector(selector));
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    console.log("QuerySelector 2 : ", document.querySelector(selector));
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    console.log("-------------------------We are connected-------------------------");

    waitForElm('.community-points-summary').then((elm) => {
        console.log('Element is ready');
        console.log(elm);
        var observerChest = new MutationObserver(function (mutations) {
            const button_div = document.querySelector(".claimable-bonus__icon");
            if(button_div != undefined) {
                var button_to_click = button_div.parentNode.parentNode.parentNode;
                // update the number of chest got while afk
                button_to_click.addEventListener('click', function () {
                    document.getElementById('numberOfChestGot').innerText = ++number_chest_got;
                });
                button_to_click.click();
                button_to_click.removeEventListener('click',function () {
                    document.getElementById('numberOfChestGot').innerText = ++number_chest_got;
                });
            }
        });
        const number_chest_get_element = document.createElement('div');
        const tw_chest_icon = '<div style="width: 2rem; height: 2rem;"><div class="ScIconLayout-sc-1bgeryd-0 kbOjdP tw-icon"><div class="ScAspectRatio-sc-1sw3lwy-1 dNNaBC tw-aspect"><div class="ScAspectSpacer-sc-1sw3lwy-0 gkBhyN"></div><svg width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px" class="ScIconSVG-sc-1bgeryd-1 cMQeyU"><g><path fill-rule="evenodd" d="M16.503 3.257L18 7v11H2V7l1.497-3.743A2 2 0 015.354 2h9.292a2 2 0 011.857 1.257zM5.354 4h9.292l1.2 3H4.154l1.2-3zM4 9v7h12V9h-3v4H7V9H4zm7 0v2H9V9h2z" clip-rule="evenodd"></path></g></svg></div></div></div>';
        number_chest_get_element.innerHTML =
            '<div title="Nombre de coffres récupérés"'+
            'class="tw-mg-l-05 tw-core-button-label tw-core-button--secondary'+
            'tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium'+
            'tw-border-top-left-radius-medium tw-border-top-right-radius tw-align-items-center tw-flex tw-full-height"'+
            '><span class="tw-animated-number tw-semibold tw-mg-r-05" id="numberOfChestGot">' + number_chest_got + '</span>' + tw_chest_icon + '</div>';
        elm.append(number_chest_get_element);
        observerChest.observe(elm, {childList: true, attributes: true, subtree: true});
    });
})();
