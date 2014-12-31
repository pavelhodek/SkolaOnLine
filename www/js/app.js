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
        }
    ]);
})();

var app = {
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
        document.addEventListener('pause', this.onPause, false);
        document.addEventListener('resume', this.onResume, false);
        document.addEventListener('backbutton', this.onBackButton, false);
        document.addEventListener('menubutton', this.onMenuButton, false);
        // Events added by org.apache.cordova.network-information:
        document.addEventListener('online', this.onOnline, false);
        document.addEventListener('offline', this.onOffline, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {

        document.addEventListener("menubutton", this.onMenuKeyDown, false);
    },
    onMenuKeyDown: function () {
        $('#solSidePanel').panel("toggle");
    },
    onPause: function() {
    },
    onResume: function() {
    },
    onBackButton: function() {
    },
    onMenuButton: function() {
    },	
    onOnline: function() {
    },	
    onOffline: function() {
    },		

    isUserLoggedIn: false,
    isUserRoleInternal: false,
    isUserRoleExternal: false

};



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
        <h1>Menu</h1> \
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
            solSidePanel += '<li data-icon="home" class="ui-nodisc-icon ui-alt-icon"><a href="#indexStudent" >Domů</a></li>';
            solSidePanel += '<li data-icon="calendar" class="ui-nodisc-icon ui-alt-icon"><a href="#rozvrhStudent" >Rozvrh</a></li>';
            solSidePanel += '<li data-icon="edit" class="ui-nodisc-icon ui-alt-icon"><a href="#hodnoceniVypisStudent" >Známky</a></li>';
            solSidePanel += '<li data-icon="edit" class="ui-nodisc-icon ui-alt-icon"><a href="#absenceVypisStudent" >Absence</a></li>';
        }

        solSidePanel += '<li data-role="list-divider"></li> <li data-icon="delete" class="ui-nodisc-icon ui-alt-icon"><a href="#logout" >Odhlásit</a></li>';
    } else {
        solSidePanel += '<li data-icon="user" class="ui-nodisc-icon ui-alt-icon"><a href="#login" >Přihlásit</a></li>';
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


//<li data-icon="gear"><a href="#nastaveni" >Nastavení</a></li> \
//<li data-icon="gear"><a href="#skolni-rok" >Školní roky</a></li> \


//$(document).one('pagebeforecreate', function () {
$(document).on('pagebeforeshow', function () {
    //console.log("PAGEBEFORESHOW");
    $("#solSidePanel").remove();

    $.mobile.pageContainer.prepend(getSidePanel());
    $("#solSidePanel").panel().enhanceWithin();
});


// "Unclicking" all jQuery mobile buttons after onClick
jQuery(function ($) {
    $(document).on('click', '.ui-btn', function () {
        setTimeout(function () {
            $('.ui-btn-active').removeClass('ui-btn-active ui-focus');
        }, 0);
    });
});
