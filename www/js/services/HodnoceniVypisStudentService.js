
; (function () {
    "use strict";
    var module = angular.module('sol.services');

    module.factory('HodnoceniVypisStudentService', ['$http', '$q', '$log', 'NastaveniService', 'AuthorizationService', 'SelectedDateService', function ($http, $q, $log, NastaveniService, AuthorizationService, SelectedDateService) {
        //$log.debug('RozvrhService');

        var me = {};

        me.selectedUdalostID = null;
        me.selectedUdalostPoradi = null;
        me.selectedDatum = null;

        me.getAllOfCurrentSemester = function (osobaID) {
            //$log.debug('RozvrhService - getByDatum');

            if (osobaID) {
                var url = AuthorizationService.getApiUrl() + 'VypisHodnoceniStudent' + '/' + osobaID;
            } else {
                var url = AuthorizationService.getApiUrl() + 'VypisHodnoceniStudent';
            }

            $http.defaults.headers.common.Authorization = AuthorizationService.getAuthorizationHeader();

            return $http.get(url);
        };

        return me;
    }]);
})();


