; (function () {
    "use strict";
    var module = angular.module('sol.services');

    module.factory('RozvrhService', ['$http', '$q', '$log', 'NastaveniService', 'AuthorizationService', function ($http, $q, $log, NastaveniService, AuthorizationService) {
        //$log.debug('RozvrhService');

        var me = {};

        me.selectedUdalostID = null;
        me.selectedUdalostPoradi = null;
        me.selectedDatum = null;

        me.getByDatum = function (date) {
            //$log.debug('RozvrhService - getByDatum');

            var url = AuthorizationService.getApiUrl() + 'RozvrhoveUdalosti' + '/' + dateToIsoString(date);

            $http.defaults.headers.common.Authorization = AuthorizationService.getAuthorizationHeader();

            return $http.get(url);
        };

        return me;
    }]);
})();


