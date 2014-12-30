; (function () {
    "use strict";
    var module = angular.module('sol.services');

    module.factory('DruhyHodnoceniService', ['$http', '$q', '$log', 'NastaveniService', 'AuthorizationService', function ($http, $q, $log, NastaveniService, AuthorizationService) {
        //$log.debug('DruhyHodnoceniService');

        function all() {
            //$log.debug('DruhyHodnoceniService - all');
            var url = AuthorizationService.getApiUrl() + 'DruhyHodnoceni';

            $http.defaults.headers.common.Authorization = AuthorizationService.getAuthorizationHeader();

            return $http.get(url, { cache: true });
        }

        function formatNazevVaha(item) {
            return item.NAZEV + " [" + item.VAHA.toLocaleString() + "]";
        }


        return {
            all: all,
            formatNazevVaha: formatNazevVaha
        };

    }]);
})();

