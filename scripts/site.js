$("document").ready(function () {
"use strict";

	var ui = {
        	selectedContent : null
        },        
        mobileMenuItemsCopied = false,
		selectedContentId, siteContent;

	function init() {
		initSiteContent();
		doIntroAnimation();
		initUi();
		copyMobileMenuItems();
		registerEvents();

		//$("#screen-res").append("height=" + screen.height + " - width=" + screen.width);
	}

	function initSiteContent() {

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
			meals: {
				title: "מה אוכלים",
				textElement: "#meals-content"
			},
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
			}
		};
	}

	function copyMobileMenuItems() {

		if (!mobileMenuItemsCopied) {
			var items = ui.menuItems.clone();

			items.addClass("mobile");
			items.appendTo(ui.mobileMenuItems);

			ui.menuItems = ui.menuItems.add(items);

			mobileMenuItemsCopied = true;
		}
	}

	function initUi() {
		ui.overlay = {
			container:   $("#overlay"),
			content: $("#overlay #overlay-content"),
			close: $("#overlay #overlay-close")
		};

		ui.body = $("body");
		ui.pageContentContainer = $("#page-content-container");
		ui.menuItems = $(".main-menu-item");
		ui.mobileMenuItems = $("#mobile-menu-items");
		ui.mobileMenuContainer = $("#mobile-menu-container");
		ui.contentTitle = $("#page-content-container h2");
		ui.homeContent = $("#home-content-container");
		ui.mobileMenu = $("#mobile-menu");
		ui.contactButton = $("#page-tab-phone");
		ui.fbButton = $("#page-tab-fb");
		ui.contactMap = $("#contact-map-img");
		ui.readStatus = $("#content-read-status");
	}

	function registerEvents() {

		ui.menuItems.click(onMenuItemClick);
		ui.mobileMenu.click(onMobileMenuClick);
		ui.contactButton.click(onContactClick);
		ui.fbButton.click(onFacebookClick);
		ui.contactMap.click(onContactMapClick);

		ui.overlay.close.click(onOverlayCloseClick);

		$("#site-logo").click(onLogoClick);
		$("body").click(onBodyClick);
	}

	function doIntroAnimation() {
		setTimeout(function () {

			var bgImgFilter = "blur(6px) contrast(60%) drop-shadow(6px 10px 4px rgb(20, 220, 55)) ";
			$("#bgimg").css({ "-webkit-filter": bgImgFilter, "filter": bgImgFilter });

			toggleDelayedElement(".intro-delayed", true);

		}, 150);
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

	function onBodyClick(e) {
		var target = e.target || e.srcElement;

		if (target !== ui.mobileMenu[0]) {
			ui.body.toggleClass("mobile-menu-open", false);
			e.stopPropagation();
		}
	}

	function onFacebookClick(e){
		var target = $(e.target || e.srcElement);
		var href = target.data("href");
		window.open(href);

		ga("send", "event", "action", "fb-page-button-click", "user-interaction");
	}

	function onContactClick(){
		ga("send", "event", "action", "contact-button-click", "user-interaction");
		onMenuItemClick.call(this);
	}

	function onMenuItemClick() {

		var contentId = this.dataset.menuItem;
		
		showPageContent(contentId);
		setActiveMenuItem(contentId);
	}

	function showOverlay(contentId, content){

		if (ui.overlay.content.data("contentId")!== contentId){
			ui.overlay.content
			.data("contentId", contentId)
			.html(content);
		}	

		ui.overlay.container.css({"opacity": "1", "left": "0", "width": "100%"});
	}

	function hideOverlay(){
		ui.overlay.container.css({"opacity": "0", "left": "-110px", "width": "100px"}); //, "width": "100%"});
	}

	function onContactMapClick(){

			ga("send", "event", "action", "contant-map-open", "user-interaction");

			showOverlay("contactMap", "<span class=\"map-loading\">טוען...</span><iframe " 
						  + "width=\"300\" "  
						  + "height=\"150\" "
						  + "frameborder=\"0\" " 
						  + "src=\"https://www.google.com/maps/embed/v1/place?key=AIzaSyDy2owgl0qFFsLhcSyyFDW_YqsOuhynzWg&q=Neve Amirim, Hertsliya&zoom=15\" allowfullscreen> " 
						+ "</iframe>");

			var mapLoadingIndicator = ui.overlay.content.find(".map-loading").css("font-size", "2em");
			
			$("#overlay iframe").on("load", function(){
				mapLoadingIndicator.remove();
			});
	}

	function onOverlayCloseClick(){
		hideOverlay();
	}

	function setActiveMenuItem(contentId) {

		if (selectedContentId) {
			ui.pageContentContainer.removeClass("active-content-" + selectedContentId); //remove previous
		}

		ui.menuItems.each(function (idx, item) {

			if (item.dataset.menuItem === contentId) {

				ui.pageContentContainer.addClass("active-content-" + contentId);
				item.classList.add("active");
			}
			else {
				item.classList.remove("active");
			}
		});

		selectedContentId = contentId;
	}	

	function showPageContent(contentId) {

		var contentItem = siteContent[contentId],
			alreadyShowingContent = !!ui.selectedContent;

		if (contentItem) {

			hideSelectedContent(alreadyShowingContent);

			if (!alreadyShowingContent) {
				toggleDelayedElement(ui.homeContent, false);
				toggleDelayedElement("#page-container", true);
			}

			ui.contentTitle.text(contentItem.title);
			ui.selectedContent = $(contentItem.textElement);
			ui.selectedContent.toggleClass("content-visible", true);

			ga("send", "pageview",{page: "/"+contentId, title: contentItem.title});

			toggleDelayedElement(ui.selectedContent, true);
			initReadStatusForCotnent(ui.selectedContent, contentId);
		}
		else {
			console.error("couldnt find content item: " + contentId);
		}
	}

	function initReadStatusForCotnent(selectedContent, id){

		calcReadStatusForCotnent(selectedContent);

		selectedContent.on("scroll", function(){
			calcReadStatusForCotnent(selectedContent);
		});
	}

	function calcReadStatusForCotnent(selectedContent){
		
		var contentElm = selectedContent[0],
			currentScrollTop = contentElm.scrollTop,
	 		readStatus = Math.floor(((currentScrollTop + contentElm.clientHeight +1) / contentElm.scrollHeight * 100)),
		 	statusWidth = ui.pageContentContainer.width() * (readStatus / 100),
		 	stateLevel = (Math.floor((readStatus * 5 /100))+1);		
		
		ui.readStatus
			.attr("class", "read-status-level-" + stateLevel)
			.css("width", statusWidth);
	}	

	function hideSelectedContent(dontHideContainer) {

		if (ui.selectedContent) {

			if (!dontHideContainer) {
				toggleDelayedElement("#page-container", false, true);
			}
			
			ui.selectedContent.off("scroll");
			ui.selectedContent.toggleClass("content-visible", false);
			ui.pageContentContainer.removeClass("active-content-" + selectedContentId);

			setActiveMenuItem(null);
			ui.selectedContent = null;
		}
	}

	function onMobileMenuClick(e) {
		ui.body.toggleClass("mobile-menu-open");

		if (ui.selectedContent) {
			if (ui.body.hasClass("mobile-menu-open")) {
				$(".main-menu-item.mobile.active")[0].scrollIntoView();
			}
		}
		
		e.stopPropagation();
	}

	function onLogoClick() {
		ga("send", "event", "action", "site-logo-click", "user-interaction");
		hideSelectedContent();
		toggleDelayedElement(ui.homeContent, true);		
	}

	init();
});