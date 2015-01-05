; (function () {
    "use strict";
    var module = angular.module('sol.services');

    module.factory('RozvrhService', ['$http', '$q', '$log', 'NastaveniService', 'AuthorizationService', 'SelectedDateService', function ($http, $q, $log, NastaveniService, AuthorizationService, SelectedDateService) {
        //$log.debug('RozvrhService');

        var me = {};

        me.selectedUdalostID = null;
        me.selectedUdalostPoradi = null;
        me.selectedDatum = null;

        me.getByDatum = function (date) {
            //$log.debug('RozvrhService - getByDatum');

            var url = AuthorizationService.getApiUrl() + 'RozvrhoveUdalosti' + '/' + date.format("YYYY-MM-DD");

            $http.defaults.headers.common.Authorization = AuthorizationService.getAuthorizationHeader();

            return $http.get(url);
        };

        me.getByDatumAndOsobaId = function (date, osobaID) {
            //$log.debug('RozvrhService - getByDatum');

            var url = AuthorizationService.getApiUrl() + 'RozvrhoveUdalosti' + '/' + date.format("YYYY-MM-DD") + '/' + osobaID;

            $http.defaults.headers.common.Authorization = AuthorizationService.getAuthorizationHeader();

            return $http.get(url);
        };


        return me;
    }]);
})();


