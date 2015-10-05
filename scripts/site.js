$("document").ready(function () {
    "use strict";

    function init() {

        gozali.pages.start();
        gozali.menu.start();

        $("#site-logo").click(onLogoClick);

        doIntroAnimation();
    }

    function doIntroAnimation() {
        setTimeout(function () {
            gozali.pages.showBackgroundEffect();
            gozali.pages.toggleDelayedElement(".intro-delayed", true);
        }, 150);
    }

    function onLogoClick() {
        ga("send", "event", "action", "site-logo-click", "user-interaction");
        gozali.pages.hideSelectedContent();
        gozali.pages.showBackgroundEffect();
        gozali.pages.showHomeContent();
    }

    init();
});