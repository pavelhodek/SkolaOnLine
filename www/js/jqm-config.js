// musí se nahrát před jquery.mobile.js
$(document).on("mobileinit", function () {
    //app.log("MOBILEINIT");

    //// ANGULAR binding
    //$.mobile.ajaxEnabled = false;
    //$.mobile.linkBindingEnabled = false;
    //$.mobile.hashListeningEnabled = false;
    //$.mobile.pushStateEnabled = false;


    //// Remove page from DOM when it's being replaced
    //$('div[data-role="page"]').on('pagehide', function (event, ui) {
    //    $(event.currentTarget).remove();
    //});


    // We want popups to cover the page behind them with a dark background
    //$.mobile.popup.prototype.options.overlayTheme = "b";


    // Set a namespace for jQuery Mobile data attributes
    //$.mobile.ns = "jqm-";


    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;

    //$.support.cors = true;
    //$.mobile.allowCrossDomainPages = true;
    //$.mobile.phonegapNavigationEnabled = true;


    //// RID PAGE TRANSITIONS
    //$.mobile.defaultPageTransition = 'none';
    //$.mobile.defaultDialogTransition = 'none';

    //$.mobile.transitionFallbacks.slideout = "none";

    //$.mobile.defaultTransition = 'none';

    ////$.mobile.useFastClick = true;


    //$.mobile.page.prototype.options.addBackBtn = true;


    //$.mobile.page.prototype.options.degradeInputs.date = true;
    //app.log("MOBILEINIT - OK");
});



// START
$(function () {

    // Bind an event to window.orientationchange that, when the device is turned,
    // gets the orientation and displays it to on screen.
    $(window).on("orientationchange", function (event) {
        $("#orientation").text("API test: zařízení je orientováno v režimu: " + event.orientation);
    });

    // You can also manually force this event to fire.
    $(window).orientationchange();
});



