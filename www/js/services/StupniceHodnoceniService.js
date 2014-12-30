; (function () {
    "use strict";
    var module = angular.module('sol.services');

    module.factory('StupniceHodnoceniService', ['$http', '$q', '$log', 'NastaveniService', 'AuthorizationService', function ($http, $q, $log, NastaveniService, AuthorizationService) {
        //$log.debug('StupniceHodnoceniService');

        return {
            all: function () {
                //$log.debug('StupniceHodnoceniService - all');
                var url = AuthorizationService.getApiUrl() + 'StupniceHodnoceni';

                $http.defaults.headers.common.Authorization = AuthorizationService.getAuthorizationHeader();

                return $http.get(url, { cache: true });
            }
        };

    }]);
})();

