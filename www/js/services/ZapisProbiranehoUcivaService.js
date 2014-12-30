; (function () {
    "use strict";
    var module = angular.module('sol.services');

    module.factory('ZapisProbiranehoUcivaService', ['$http', '$q', '$log', 'NastaveniService', 'AuthorizationService', 'RozvrhService', function ($http, $q, $log, NastaveniService, AuthorizationService, RozvrhService) {
        
        var me = {};

        me.getByRozvrhovaUdalost = function (udalostId, poradi) {
            me.selectedUdalostID = udalostId;
            me.selectedUdalostPoradi = poradi;

            var url = AuthorizationService.getApiUrl() + 'ZapisProbiranehoUciva/' + udalostId + '/' + poradi;
            $http.defaults.headers.common.Authorization = AuthorizationService.getAuthorizationHeader();

            return $http.get(url);
        };


        me.save = function (udalostId, poradi, data) {
            var url = AuthorizationService.getApiUrl() + 'ZapisProbiranehoUciva/' + udalostId + '/' + poradi;
            $http.defaults.headers.common.Authorization = AuthorizationService.getAuthorizationHeader();

            return $http.put(url, data);
        };

        return me;
    }]);
})();

