; (function () {
    "use strict";
    var module = angular.module('sol.services');

    module.factory('NastaveniService', ['$http', '$rootScope', function ($http, $rootScope) {
        var me = {};

        me.timeFormat = "H:mm";
        me.dateFormat = "EEEE d.M.yyyy";

        // localhost: "http://localhost/SOLWebApi/api/";
        // localhost (cordova): "http://10.0.2.2/SOLWebApi/api/";
        // prod server: "http://172.20.2.26/SOLWebApi/api/";
        // test server: "https://sol.cca.cz/SOLWebApi/api/";

        //var defaultApiUrl = "https://sol.cca.cz/SOLWebApi/api/";
        //var defaultApiUrl = "https://aplikace.skolaonline.cz/SOLWebApi/api/";

        //me.defaultApiUrls = [];
        //me.defaultApiUrls[me.defaultApiUrls.length] = { id: "sol", url: "https://aplikace.skolaonline.cz/SOLWebApi/api/" }
        //me.defaultApiUrls[me.defaultApiUrls.length] = { id: "cca", url: "http://sol.cca.cz/SOLWebApi/api/" }
        //me.defaultApiUrls[me.defaultApiUrls.length] = { id: "localhost", url: "http://localhost/SOLWebApi/api/" }

        //me.defaultApiUrls[1] = "http://sol.cca.cz/SOLWebApi/api/";
        //me.defaultApiUrls[me.defaultApiUrls.length] = "http://localhost/SOLWebApi/api/";
        //me.defaultApiUrls[me.defaultApiUrls.length] = "http://sol.cca.cz/SOLWebApi/api/";

        //me.defaultApiUrls = [];
        //me.defaultApiUrls[me.defaultApiUrls.length] = "https://aplikace.skolaonline.cz/SOLWebApi/api/";

        me.environments = ['prod', 'test', 'dev'];
        me.selectedEnvironmentCode = 'prod';

        me.setEnvironment = function(environmentCode) {
            if (environmentCode == 'prod') {
                me.setApiUrlProd();
            } 
            else if (environmentCode == 'test') {
                me.setApiUrlTest();
            }
            else if (environmentCode == 'dev') {
                me.setApiUrlDev();
            }
        }


        me.getEnvironmentCodeByApiUrl = function(url) {
            if (url == 'https://aplikace.skolaonline.cz/SOLWebApi/api/') return 'prod';
            if (url == 'https://sol.cca.cz/SOLWebApi/api/') return 'test';
            //if (url == 'http://10.0.2.2/SOLWebApi/api/') return 'dev';
            if (url == 'http://localhost/SOLWebApi/api/') return 'dev';
            return '';
        }


        me.setApiUrlDev = function () {
            me.defaultApiUrls = [];
            //me.defaultApiUrls.push('http://10.0.2.2/SOLWebApi/api/');
            me.defaultApiUrls.push('http://localhost/SOLWebApi/api/');
            me.selectedEnvironmentCode = 'dev';
        };

        me.setApiUrlTest = function () {
            me.defaultApiUrls = [];
            me.defaultApiUrls.push('https://sol.cca.cz/SOLWebApi/api/');
            me.selectedEnvironmentCode = 'test';
        };

        me.setApiUrlProd = function () {
            me.defaultApiUrls = [];
            me.defaultApiUrls.push('https://aplikace.skolaonline.cz/SOLWebApi/api/');
            me.selectedEnvironmentCode = 'prod';
        };



        me.setApiUrlProd();


        //me.getApiUrl = function () {
        //    var currentUser = $rootScope.currentUser || {};

        //    return currentUser.apiUrl;

        //    //return localStorage.getItem("nastaveni.apiURL") || defaultApiUrl;
        //}

        //me.setApiUrl = function (value) {
        //    if (value && value.slice(-1) != "/")
        //        value = value + "/";

        //    return localStorage.setItem("nastaveni.apiURL", value);
        //}





        return me;
    }]);
})();