; (function () {
    "use strict";
    var module = angular.module('sol.services');

    module.factory('ZapisHodnoceniService', ['$http', '$q', '$log', 'NastaveniService', 'AuthorizationService',
        function ($http, $q, $log, NastaveniService, AuthorizationService) {
            //$log.debug('ZapisHodnoceniService');

            var me = {};

            me.selectedUdalostID = null;
            me.selectedUdalostPoradi = null;

            me.getByRozvrhovaUdalost = function (udalostID, poradi) {
                me.selectedUdalostID = udalostID;
                me.selectedUdalostPoradi = poradi;

                //$log.debug('ZapisHodnoceniService - getByRozvrhovaUdalost');


                var url = AuthorizationService.getApiUrl() + 'ZapisHodnoceni/' + udalostID + '/' + poradi;
                $http.defaults.headers.common.Authorization = AuthorizationService.getAuthorizationHeader();

                return $http.get(url);
            };

            me.save = function (data) {
                var url = AuthorizationService.getApiUrl() + 'ZapisHodnoceni/';
                $http.defaults.headers.common.Authorization = AuthorizationService.getAuthorizationHeader();

                return $http.post(url, data);
            };

            return me;
        }]);
})();

