
; (function () {
    "use strict";
    var module = angular.module('sol.services');

    module.factory('HodnoceniVypisStudentService', ['$http', '$q', '$log', 'NastaveniService', 'AuthorizationService', 'SelectedDateService', function ($http, $q, $log, NastaveniService, AuthorizationService, SelectedDateService) {
        //$log.debug('RozvrhService');

        var me = {};

        me.selectedUdalostID = null;
        me.selectedUdalostPoradi = null;
        me.selectedDatum = null;

        me.getAllOfCurrentSemester = function () {
            //$log.debug('RozvrhService - getByDatum');

            var url = AuthorizationService.getApiUrl() + 'VypisHodnoceniStudent';

            $http.defaults.headers.common.Authorization = AuthorizationService.getAuthorizationHeader();

            return $http.get(url);
        };

        return me;
    }]);
})();


