(function (global) {
    "use strict";

    var gozali = global.gozali = global.gozali || {};

    var ui = {},
        mobileMenuItemsCopied = false;

    function start() {

        ui.body = $("body");
        ui.menuItems = $(".main-menu-item");
        ui.mobileMenuItems = $("#mobile-menu-items");
        ui.mobileMenuContainer = $("#mobile-menu-container");
        ui.mobileMenu = $("#mobile-menu");
        ui.contactButton = $("#page-tab-phone");
        ui.fbButton = $("#page-tab-fb");
        ui.contactMap = $("#contact-map-img");

        ui.overlay = {
            container: $("#overlay"),
            content: $("#overlay-content"),
            close: $("#overlay-close")
        };

        _copyMobileMenuItems();
        _registerEvents();
    }

    function setActiveMenuItem(contentId) {

        gozali.pages.removeActiveContent();

        ui.menuItems.each(function (idx, item) {

            if (item.dataset.menuItem === contentId) {

                gozali.pages.setActiveContent(contentId);
                item.classList.add("active");
            }
            else {
                item.classList.remove("active");
            }
        });
    }

    function _registerEvents() {
        ui.menuItems.click(_onMenuItemClick);
        ui.mobileMenu.click(_onMobileMenuClick);
        ui.contactButton.click(_onContactClick);
        ui.fbButton.click(_onFacebookClick);
        ui.contactMap.click(_onContactMapClick);

        ui.overlay.close.click(_onOverlayCloseClick);
        ui.body.click(_onBodyClick);
    }

    function _onOverlayCloseClick() {
        _hideOverlay();
    }

    function _onBodyClick(e) {
        var target = e.target || e.srcElement;

        if (target !== ui.mobileMenu[0]) {
            ui.body.toggleClass("mobile-menu-open", false);
            e.stopPropagation();
        }
    }

    function _onMenuItemClick() {

        var contentId = this.dataset.menuItem;

        gozali.pages.showPageContent(contentId);
        setActiveMenuItem(contentId);
    }

    function _onMobileMenuClick(e) {
        ui.body.toggleClass("mobile-menu-open");

        if (ui.selectedContent) {
            if (ui.body.hasClass("mobile-menu-open")) {
                setTimeout(function () {
                    $(".main-menu-item.mobile.active")[0].scrollIntoView();
                }, 1);
            }
        }
        else{
            gozali.pages.removeBackgroundEffect();
        }

        e.stopPropagation();
    }

    function _copyMobileMenuItems() {

        if (!mobileMenuItemsCopied) {
            var items = ui.menuItems.clone();

            items.addClass("mobile");
            items.appendTo(ui.mobileMenuItems);

            ui.menuItems = ui.menuItems.add(items);

            mobileMenuItemsCopied = true;
        }
    }

    function _onContactClick() {
        ga("send", "event", "action", "contact-button-click", "user-interaction");
        _onMenuItemClick.call(this);
    }

    function _onFacebookClick(e) {
        var target = $(e.target || e.srcElement);
        var href = target.data("href");
        window.open(href);

        ga("send", "event", "action", "fb-page-button-click", "user-interaction");
    }

    function _onContactMapClick() {

        ga("send", "event", "action", "contant-map-open", "user-interaction");

        _showOverlay("contactMap", "<span class=\"map-loading\">טוען...</span><iframe "
            + "width=\"300\" "
            + "height=\"150\" "
            + "frameborder=\"0\" "
            + "src=\"https://www.google.com/maps/embed/v1/place?key=AIzaSyDy2owgl0qFFsLhcSyyFDW_YqsOuhynzWg&q=Neve Amirim, Hertsliya&zoom=15\" allowfullscreen> "
            + "</iframe>");

        var mapLoadingIndicator = ui.overlay.content.find(".map-loading").css("font-size", "2em");

        $("#overlay iframe").on("load", function () {
            mapLoadingIndicator.remove();
        });
    }

    function _showOverlay(contentId, content) {

        if (ui.overlay.content.data("contentId") !== contentId) {
            ui.overlay.content
                .data("contentId", contentId)
                .html(content);
        }

        ui.overlay.container.css({"opacity": "1", "left": "0", "width": "100%"});
    }

    function _hideOverlay() {
        ui.overlay.container.css({"opacity": "0", "left": "-110px", "width": "100px"}); //, "width": "100%"});
    }

    gozali.menu = {
        start: start,
        setActiveMenuItem: setActiveMenuItem
    };
})(window);