(function () {
    //angular.module('sol', ['ngResource', 'sol.controllers', 'sol.services']);
    angular.module('sol', ['sol.controllers', 'sol.services']);
    angular.module('sol.controllers', []);
    angular.module('sol.services', []);


    var sol = angular.module("sol");

    sol.config([
        '$httpProvider', function($httpProvider) {
            //$httpProvider.defaults.useXDomain = true;
            ////$httpProvider.defaults.withCredentials = true;
            //delete $httpProvider.defaults.headers.common["X-Requested-With"];
            //$httpProvider.defaults.headers.common["Accept"] = "application/json";
            //$httpProvider.defaults.headers.common["Content-Type"] = "application/json";


            //// toto simuluje latency 3s na každém http požadavku
            //var handlerFactory = function ($q, $timeout) {
            //    return function (promise) {
            //        return promise.then(function (response) {
            //            return $timeout(function () {
            //                return response;
            //            }, 3000);
            //        }, function (response) {
            //            return $q.reject(response);
            //        });
            //    };
            //}
            //$httpProvider.responseInterceptors.push(handlerFactory);



        }
    ]);
})();

var app = {
    version: '1.0.9',

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);

    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //navigator.splashscreen.show();
        //navigator.splashscreen.hide();
        if (typeof cordova !== "undefined") cordova.exec(null, null, "SplashScreen", "hide", []);

        //if (typeof StatusBar !== "undefined") StatusBar.hide();


        /*
        cordova.exec(null, null, "SplashScreen", "show", []);
        setTimeout(function() {
            //navigator.splashscreen.hide();
            cordova.exec(null, null, "SplashScreen", "hide", []);
        }, 4000);
        */



        //document.addEventListener('pause', app.onPause, false);
        //document.addEventListener('resume', app.onResume, false);
        //document.addEventListener('backbutton', app.onBackButton, false);
        document.addEventListener('menubutton', app.onMenuButton, false);
        // Events added by org.apache.cordova.network-information:
        //document.addEventListener('online', app.onOnline, false);
        //document.addEventListener('offline', app.onOffline, false);
    },
    onPause: function() {
    },
    onResume: function() {
    },
    onBackButton: function() {
    },
    onMenuButton: function() {
        toggleSidePanel();
    },	
    onOnline: function() {
    },	
    onOffline: function() {
    },		

    isUserLoggedIn: false,
    isUserRoleInternal: false,
    isUserRoleExternal: false

};

function toggleSidePanel() {
    sidePanelHeaderClickedCounter = 0;
    $('#solSidePanel').panel("toggle");
}

function getSidePanel() {
//    var solSidePanel = '\
//<div data-role="panel" id="solSidePanel" data-position="left" data-display="push" data-theme="a" class="sol-sidebar" > \
//    <div data-role="header"> \
//        <h1>Menu</h1> \
//        <a href="#" data-role="button" data-rel="close" class="ui-btn ui-btn-right ui-btn-icon-notext ui-icon-delete  ui-corner-all" >Zavřít</a> \
//    </div> \
//    <ul data-role="listview" data-inset="true"> \
//        <li data-icon="calendar"><a href="#rozvrh" >Rozvrh</a></li> \
//        <li data-role="list-divider"></li> \
//        <li data-icon="user"><a href="#login" >Přihlášení</a></li> \
//        <li data-icon="delete" ><a href="#logout" >Odhlášení</a></li> \
//    </ul> \
//</div>';


    var solSidePanel = '\
<div data-role="panel" id="solSidePanel" data-position="left" data-display="push" data-theme="a" class="sol-sidebar" > \
    <div data-role="header"> \
        <h1 onclick="sidePanelHeaderClicked()">Menu</h1> \
        <a href="#" data-role="button" data-rel="close" class="ui-btn ui-btn-right ui-btn-icon-notext ui-icon-delete ui-nodisc-icon ui-alt-icon" >Zavřít</a> \
    </div> \
    <ul data-role="listview" data-inset="true"> ';

    if (app.isUserLoggedIn) {
        // ucitel nebo admin
        if (app.isUserRoleInternal) {
            solSidePanel += '<li data-icon="calendar" class="ui-nodisc-icon ui-alt-icon" ><a href="#rozvrh" >Rozvrh</a></li>';
        }

        // student nebo rodic
        if (app.isUserRoleExternal) {
            //solSidePanel += '<li data-icon="home" class="ui-nodisc-icon ui-alt-icon"><a href="#indexStudent" >Domů</a></li>';
            //solSidePanel += '<li data-icon="calendar" class="ui-nodisc-icon ui-alt-icon"><a href="#rozvrhStudent" >Rozvrh</a></li>';
            //solSidePanel += '<li data-icon="edit" class="ui-nodisc-icon ui-alt-icon"><a href="#hodnoceniVypisStudent" >Hodnocení</a></li>';

            solSidePanel += '<li data-icon="home" class="ui-nodisc-icon ui-alt-icon"><a href="javascript:void(0)" onclick="navigateToPageId(\'indexStudent\')" >Domů</a></li>';
            solSidePanel += '<li data-icon="calendar" class="ui-nodisc-icon ui-alt-icon"><a href="javascript:void(0)" onclick="navigateToPageId(\'rozvrhStudent\')" >Rozvrh</a></li>';
            solSidePanel += '<li data-icon="edit" class="ui-nodisc-icon ui-alt-icon"><a href="javascript:void(0)" onclick="navigateToPageId(\'hodnoceniVypisStudent\')" >Hodnocení</a></li>';

            //solSidePanel += '<li data-icon="edit" class="ui-nodisc-icon ui-alt-icon"><a href="#absenceVypisStudent" >Absence</a></li>';
        }

        //solSidePanel += '<li data-role="list-divider"></li> <li data-icon="delete" class="ui-nodisc-icon ui-alt-icon"><a href="#logout" >Odhlásit</a></li>';
        solSidePanel += '<li data-role="list-divider"></li> <li data-icon="delete" class="ui-nodisc-icon ui-alt-icon"><a href="javascript:void(0)" onclick="navigateToPageId(\'logout\')" >Odhlásit</a></li>';
    } else {
        //solSidePanel += '<li data-icon="user" class="ui-nodisc-icon ui-alt-icon"><a href="#login" >Přihlásit</a></li>';

        solSidePanel += '<li data-icon="user" class="ui-nodisc-icon ui-alt-icon"><a href="javascript:void(0)" onclick="navigateToPageId(\'login\')" >Přihlásit</a></li>';
    }

    /*
    <li data-icon="calendar"><a href="#rozvrh" >Rozvrh</a></li> \

        <li data-icon="user"><a href="#login" >Přihlášení</a></li> \
        <li data-icon="delete" ><a href="#logout" >Odhlášení</a></li> \
        */
solSidePanel += '\
    </ul> \
</div>';


    /*
    app.isUserLoggedIn = true;
    app.isUserRoleInternal = jeInterniRole;
    app.isUserRoleExternal = !jeInterniRole;
    */

    return solSidePanel;

}


function navigateToPageId(pageId) {
    var currentPageId = $.mobile.activePage.attr('id');
    if (currentPageId === pageId) {
        var $sidePanel = $(".sol-sidebar");
        var isPanelOpen = $sidePanel.hasClass("ui-panel-open");
        if (isPanelOpen) {
            $sidePanel.panel("toggle");
        }
    } else {
        $.mobile.changePage("#" + pageId);
    }
}


var sidePanelHeaderClickedCounter = 0;
function sidePanelHeaderClicked() {
    sidePanelHeaderClickedCounter++;
    if (sidePanelHeaderClickedCounter === 10) {
        sidePanelHeaderClickedCounter = 0;
        $.mobile.changePage("#debug");
    }
}


//<li data-icon="gear"><a href="#nastaveni" >Nastavení</a></li> \
//<li data-icon="gear"><a href="#skolni-rok" >Školní roky</a></li> \


//$(document).one('pagebeforecreate', function () {
$(document).on('pagebeforeshow', function () {
    //console.log("PAGEBEFORESHOW");
    $("#solSidePanel").remove();

    $.mobile.pageContainer.prepend(getSidePanel());
    $("#solSidePanel").panel().enhanceWithin();
});






jQuery(function ($) {

    // "Unclicking" all jQuery mobile buttons after onClick
    $(document).on('click', '.ui-btn', function () {
        setTimeout(function () {
            $('.ui-btn-active').removeClass('ui-btn-active ui-focus');
        }, 0);
    });


    // na virtuální klávesnici tlačítko "Go" / "Přejdi" způsobí stisk tlačítka "Přihlásit"
    $('#password').on('keyup', function (e) {
        var theEvent = e || window.event;
        var keyPressed = theEvent.keyCode || theEvent.which;
        if (keyPressed == 13) {
            $('#submitLogin').trigger('click');
        }
        return true;
    });

    // stranka "#index" odebrana z historie - slouzi pouze pro navigaci na "#rozvrh" nebo nebo "#indexStudent" nebo "#login"
    $(document).on("pagecontainershow", function (e, ui) {
        //console.log(ui.prevPage);
        //console.log(ui.toPage);

        if (typeof ui.toPage[0] !== "undefined" && ui.toPage[0].id == "index") {
            if (typeof navigator !== "undefined" && navigator.app && navigator.app.exitApp) {
                navigator.app.exitApp();
            }
            
        }

        //if (typeof ui.prevPage[0] !== "undefined" && ui.prevPage[0].id == "index") {
        //    $.mobile.navigate.history.stack.splice(0, 1);
        //    $(ui.prevPage).remove();
        //}
    });



});
