
; (function () {
    "use strict";
    var module = angular.module('sol.services');

    module.factory('HodnoceniDetailService', ['$http', '$log', 'AuthorizationService', function ($http, $log, AuthorizationService) {
        //$log.debug('HodnoceniDetailService');

        function getHodnoceniDetail(udalostID, studentID) {
            //$log.debug('HodnoceniDetailService - getHodnoceniDetail');

            var url = AuthorizationService.getApiUrl() + 'HodnoceniDetail' + '/udalost/' + udalostID + '/student/' + studentID;

            $http.defaults.headers.common.Authorization = AuthorizationService.getAuthorizationHeader();

            return $http.get(url);
        };

        return {
            getHodnoceniDetail: getHodnoceniDetail
        };

    }]);
})();


