; (function () {
    "use strict";
    var module = angular.module('sol.services');

    module.factory('ObdobiDneService', ['$http', '$q', '$log', 'NastaveniService', 'AuthorizationService', function ($http, $q, $log, NastaveniService, AuthorizationService) {
        //$log.debug('ObdobiDneService');

        return {
            all: function () {
                //$log.debug('ObdobiDneService - all');
                var url = AuthorizationService.getApiUrl() + 'ObdobiDne';

                $http.defaults.headers.common.Authorization = AuthorizationService.getAuthorizationHeader();

                return $http.get(url, { cache: true });
            }
        };

    }]);
})();

