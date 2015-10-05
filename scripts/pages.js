(function (global) {
    "use strict";

    var gozali = global.gozali = global.gozali || {};

    var ui = {},
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
            }
        };

    function start() {

        ui.pageContentContainer = $("#page-content-container");
        ui.contentTitle = $("#page-content-container h2");
        ui.readStatus = $("#content-read-status");
        ui.homeContent = $("#home-content-container");
        ui.bgImg = $("#bgimg");
        ui.body = $("body");
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

    function showHomeContent(){
        toggleDelayedElement(ui.homeContent, true);
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
            removeBackgroundEffect();
            ui.selectedContent.toggleClass("content-visible", true);
            ui.body.toggleClass("content-visible", true);

            ga("send", "pageview", {page: "/" + contentId, title: contentItem.title});

            toggleDelayedElement(ui.selectedContent, true);
            _initReadStatusForContent(ui.selectedContent, contentId);
        }
        else {
            console.error("couldnt find content item: " + contentId);
        }
    }

    function hideSelectedContent(dontHideContainer) {

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

    function showBackgroundEffect(){
        var bgImgFilter = "blur(6px) contrast(60%) drop-shadow(6px 10px 4px rgb(20, 220, 55)) ";
        ui.bgImg.css({"-webkit-filter": bgImgFilter, "filter": bgImgFilter});
    }

    function removeBackgroundEffect(){
        ui.bgImg.css({"-webkit-filter": "", "filter": ""});
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
        showPageContent: showPageContent,
        toggleDelayedElement: toggleDelayedElement,
        setActiveContent: setActiveContent,
        removeActiveContent: removeActiveContent,
        hideSelectedContent: hideSelectedContent,
        showBackgroundEffect: showBackgroundEffect,
        showHomeContent: showHomeContent,
        removeBackgroundEffect: removeBackgroundEffect
    };

})(window);