; (function () {
    "use strict";
    var module = angular.module('sol.services');

    module.factory('ZastupceOsobyService', ['$http', '$log', 'AuthorizationService', function ($http, $log, AuthorizationService) {
        //$log.debug('ZastupceOsobyService');

        function all() {
            //$log.debug('ZastupceOsobyService - all');
            var url = AuthorizationService.getApiUrl() + 'ZastupceOsoby';

            $http.defaults.headers.common.Authorization = AuthorizationService.getAuthorizationHeader();

            return $http.get(url, { cache: true });
        }

        return {
            all: all
        };

    }]);
})();

