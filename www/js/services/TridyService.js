; (function () {
    "use strict";
    var module = angular.module('sol.services');

    module.factory('TridyService', ['$http', '$q', '$log', '$filter', 'NastaveniService', 'AuthorizationService', function ($http, $q, $log, $filter, NastaveniService, AuthorizationService) {
        //$log.debug('TridyService');
        var me = {};

        me.all = function () {
            //$log.debug('TridyService - all');
            var url = AuthorizationService.getApiUrl() + 'Tridy';

            //$log.info(AuthorizationService.getAuthorizationHeader());

            $http.defaults.headers.common.Authorization = AuthorizationService.getAuthorizationHeader();

            return $http.get(url, { cache: true });
        };

        me.getNazev = function (id) {
            me.all().then(function (result) {
                for (var i = 0, len = result.data.Data.length; i < len; i++) {
                    if (result.data.Data[i].SKUPINA_ID == id) {
                        return result.data.Data[i].NAZEV;
                    }
                }

                return '';
            });
        };


        return me;

    }]);
})();

