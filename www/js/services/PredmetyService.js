; (function () {
    "use strict";
    var module = angular.module('sol.services');

    module.factory('PredmetyService', ['$http', '$q', '$log', 'NastaveniService', 'AuthorizationService', function ($http, $q, $log, NastaveniService, AuthorizationService) {
        //$log.debug('PredmetyService');

        return {
            all: function () {
                //$log.debug('PredmetyService - all');
                var url = AuthorizationService.getApiUrl() + 'Predmety';

                $http.defaults.headers.common.Authorization = AuthorizationService.getAuthorizationHeader();

                return $http.get(url, { cache: true });
            }
        };

    }]);
})();

