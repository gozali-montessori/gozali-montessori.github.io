$("document").ready(function () {
	"use strict";

	function init() {

		gozali.history.start();
		gozali.pages.start();
		gozali.menu.start();

		$("#site-logo").click(onLogoClick);

		doIntroAnimation();
	}

	function doIntroAnimation() {
		setTimeout(function () {
			gozali.pages.initializeContent();
			gozali.pages.toggleDelayedElement(".intro-delayed", true);
		}, 150);
	}

	function onLogoClick() {
		ga("send", "event", "action", "site-logo-click", "user-interaction");
		gozali.pages.navigateToHome();
	}

	init();
});