; (function () {
    "use strict";
    var module = angular.module('sol.services');

    module.factory('NastaveniService', ['$log', '$http', '$rootScope', function ($log, $http, $rootScope) {
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
                me.setApiProd();
            } else if (environmentCode == 'test') {
                me.setApiTest();
            } else if (environmentCode == 'dev') {
                me.setApiDev();
            }
        }

        var apis = {};
        apis['dev'] = [
            {
                id: 'emulator',
                nazev: 'emulator',
                url: 'http://10.0.2.2/SOLWebApi/api/'
            },
            {
                id: 'localhost',
                nazev: 'localhost',
                url: 'http://localhost/SOLWebApi/api/'
            }
        ];

        apis['test'] = [
            {
                id: 'sol.cca.cz',
                nazev: 'sol.cca.cz',
                url: 'https://sol.cca.cz/SOLWebApi/api/'
            }
        ];

        apis['prod'] = [
            {
                id: 'aplikace.skolaonline.cz',
                nazev: 'aplikace.skolaonline.cz',
                url: 'https://aplikace.skolaonline.cz/SOLWebApi/api/'
            },
            {
                id: 'skola.plzen-edu.cz',
                nazev: 'skola.plzen-edu.cz',
                url: 'https://skola.plzen-edu.cz/SOLWebApi/api/'
            }
        ];


        me.getApiById = function (apiId)
        {
            var wanted = apis['prod'].filter(function (item) { return (item.id == apiId); });
            if (wanted.length > 0) return wanted[0];

            wanted = apis['test'].filter(function (item) { return (item.id == apiId); });
            if (wanted.length > 0) return wanted[0];

            wanted = apis['dev'].filter(function (item) { return (item.id == apiId); });
            if (wanted.length > 0) return wanted[0];

            return null;
        }

        me.getApiByUrl = function (apiUrl) {
            var wanted = apis['prod'].filter(function (item) { return (item.url == apiUrl); });
            if (wanted.length > 0) return wanted[0];

            wanted = apis['test'].filter(function (item) { return (item.url == apiUrl); });
            if (wanted.length > 0) return wanted[0];

            wanted = apis['dev'].filter(function (item) { return (item.url == apiUrl); });
            if (wanted.length > 0) return wanted[0];

            return null;
        }


        me.getEnvironmentCodeByApiUrl = function(apiUrl) {
            //if (url == 'https://aplikace.skolaonline.cz/SOLWebApi/api/') return 'prod';
            //if (url == 'https://skola.plzen-edu.cz/SOLWebApi/api/') return 'prod';
            //if (url == 'https://sol.cca.cz/SOLWebApi/api/') return 'test';
            ////if (url == 'http://10.0.2.2/SOLWebApi/api/') return 'dev';
            //if (url == 'http://localhost/SOLWebApi/api/') return 'dev';
            //return '';

            var wanted = apis['prod'].filter(function(item) { return (item.url == apiUrl); });
            if (wanted.length > 0) return 'prod';

            wanted = apis['test'].filter(function(item) { return (item.url == apiUrl); });
            if (wanted.length > 0) return 'test';

            wanted = apis['dev'].filter(function(item) { return (item.url == apiUrl); });
            if (wanted.length > 0) return 'dev';

            return '';
        };

        me.getEnvironmentCodeByApiId = function (apiId) {

            var wanted = apis['prod'].filter(function (item) { return (item.id == apiId); });
            if (wanted.length > 0) return 'prod';

            wanted = apis['test'].filter(function (item) { return (item.id == apiId); });
            if (wanted.length > 0) return 'test';

            wanted = apis['dev'].filter(function (item) { return (item.id == apiId); });
            if (wanted.length > 0) return 'dev';

            return '';
        };



        me.setApiDev = function () {
            me.apis = [].concat(apis['dev']);

            me.selectedEnvironmentCode = 'dev';
            me.selectedApi = me.apis[0];
        };

        me.setApiTest = function () {
            me.apis = [].concat(apis['test']);

            me.selectedEnvironmentCode = 'test';
            me.selectedApi = me.apis[0];
        };

        me.setApiProd = function() {
            me.apis = [].concat(apis['prod']);
            
            me.selectedEnvironmentCode = 'prod';
            me.selectedApi = me.apis[0];
        };


        me.getApis = function() {
            return me.apis;
        };


        me.setApiProd();


        return me;
    }]);
})();