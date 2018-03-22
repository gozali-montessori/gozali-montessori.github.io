(function (global) {
	"use strict";

	var gozali = global.gozali = global.gozali || {};

	var ui = {},
		hashChangeReceived = false,
		selectedContentId,
		siteContent = {
			about: {
				title: "על גוזלי",
				textElement: "#about-content"
			},
			mandu: {
				title: "מונטסורי ויונג",
				textElement: "#mandu-content"
			},
			aboutus: {
				title: "קצת עלינו",
				textElement: "#us-content"
			},
			//meals: {
			//	title: "מה �?וכלי�?",
			//	textElement: "#meals-content"
			//},
			community: {
				title: "גוזלי למען הקהילה",
				textElement: "#community-content"
			},
			day: {
				title: "פעילות המשפחתון",
				textElement: "#day-content"
			},
			contact: {
				title: "צור קשר",
				textElement: "#contact-content"
			},
			blog: {
				title: "הבלוג",
				textElement: "#blog-content"
			}
		};

	function start() {

		ui.pageContentContainer = $("#page-content-container");
		ui.contentTitle = $("#page-content-container h2");
		ui.readStatus = $("#content-read-status");
		ui.homeContent = $("#home-content-container");
		ui.bgImg = $("#bgimg");
		ui.body = $("body");

		gozali.history.addListener(_onPageHashChange);
	}

	function initializeContent() {
		if (!hashChangeReceived) {
			_showHomeContent();
		}
	}

	function setActiveContent(contentId) {
		ui.pageContentContainer.addClass("active-content-" + contentId);
		selectedContentId = contentId;
	}

	function removeActiveContent() {
		if (selectedContentId) {
			ui.pageContentContainer.removeClass("active-content-" + selectedContentId); //remove previous
		}
	}

	function navigateToHome() {
		gozali.history.change("");
	}

	function showPageContent(contentId) {

		var contentItem = siteContent[contentId];

		if (contentItem) {
			gozali.history.change(contentId);
		}
		else {
			console.error("couldnt find content item: " + contentId);
		}
	}

	function toggleDelayedElement(selector, show, quickHide) {
		selector = (selector instanceof jQuery) ? selector : $(selector);

		if (quickHide) {
			selector.hide();
			setTimeout(function () {
				selector.show();
			}, 1);
		}

		selector.toggleClass("delayed-visible", show);
	}

	function showBackgroundEffect() {
		var bgImgFilter = "blur(6px) contrast(60%) drop-shadow(6px 10px 4px rgb(101, 173, 169)) ";
		ui.bgImg.css({"-webkit-filter": bgImgFilter, "filter": bgImgFilter});
	}

	function removeBackgroundEffect() {
		ui.bgImg.css({"-webkit-filter": "", "filter": ""});
	}

	function _hideSelectedContent(dontHideContainer) {

		if (ui.selectedContent) {

			if (!dontHideContainer) {
				toggleDelayedElement("#page-container", false, true);
			}

			ui.selectedContent.off("scroll");
			ui.selectedContent.toggleClass("content-visible", false);
			ui.body.toggleClass("content-visible", false);
			ui.pageContentContainer.removeClass("active-content-" + selectedContentId);

			gozali.menu.setActiveMenuItem(null);
			ui.selectedContent = null;
		}
	}

	function _onPageHashChange(hash) {

		var contentId = hash.replace("#", ""),
			contentItem = siteContent[contentId];

		hashChangeReceived = true;

		if (contentItem) {
			_showContentForItem(contentId, contentItem);
			gozali.menu.setActiveMenuItem(contentId);
		}
		else {
			if (contentId !== "") {
				console.error("couldnt find matching content item for hash: " + hash);
			}

			_showHomeContent();			//fallback to home
		}
	}

	function _showHomeContent() {
		_hideSelectedContent();
		showBackgroundEffect();
		toggleDelayedElement(ui.homeContent, true);
	}

	function _showContentForItem(contentId, contentItem) {
		var alreadyShowingContent = !!ui.selectedContent;

		_hideSelectedContent(alreadyShowingContent);

		if (!alreadyShowingContent) {
			toggleDelayedElement(ui.homeContent, false);
			toggleDelayedElement("#page-container", true);
		}

		ui.contentTitle.text(contentItem.title);
		ui.selectedContent = $(contentItem.textElement);
		removeBackgroundEffect();
		ui.selectedContent.toggleClass("content-visible", true);
		ui.body.toggleClass("content-visible", true);

		ga("send", "pageview", {page: "/" + contentId, title: contentItem.title});

		toggleDelayedElement(ui.selectedContent, true);
		_initReadStatusForContent(ui.selectedContent, contentId);
	}

	function _initReadStatusForContent(selectedContent, id) {

		_calcReadStatusForContent(selectedContent);

		selectedContent.on("scroll", function () {
			_calcReadStatusForContent(selectedContent);
		});
	}

	function _calcReadStatusForContent(selectedContent) {

		var contentElm = selectedContent[0],
			currentScrollTop = contentElm.scrollTop,
			readStatus = Math.floor(((currentScrollTop + contentElm.clientHeight + 1) / contentElm.scrollHeight * 100)),
			statusWidth = ui.pageContentContainer.width() * (readStatus / 100),
			stateLevel = (Math.floor((readStatus * 5 / 100)) + 1);

		ui.readStatus
			.attr("class", "read-status-level-" + stateLevel)
			.css("width", statusWidth);
	}

	gozali.pages = {
		start: start,
		initializeContent: initializeContent,
		showPageContent: showPageContent,
		toggleDelayedElement: toggleDelayedElement,
		setActiveContent: setActiveContent,
		removeActiveContent: removeActiveContent,
		showBackgroundEffect: showBackgroundEffect,
		navigateToHome: navigateToHome,
		removeBackgroundEffect: removeBackgroundEffect
	};
})(window);