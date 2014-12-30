; (function () {
    "use strict";
    var module = angular.module('sol.services');

    module.factory('ObdobiRokuService', ['$http', '$q', '$log', 'NastaveniService', 'AuthorizationService', function ($http, $q, $log, NastaveniService, AuthorizationService) {
        //$log.debug('ObdobiRokuService');

        function all() {
            //$log.debug('ObdobiRokuService - all');
            var url = AuthorizationService.getApiUrl() + 'ObdobiRoku';

            $http.defaults.headers.common.Authorization = AuthorizationService.getAuthorizationHeader();

            return $http.get(url, { cache: true });
        };

        function getByDate(date) {
            var allObdobi = all();
            //$log.info("getByDate");
            //$log.info(date);

            var deferred = $q.defer();

            allObdobi.then(
                // {data: Object, status: 200, headers: function, config: Object, statusText: "OK"}
                function (result) {
                    //$log.info("getByDate - success");
                    //$log.info(result.data);

                    if (result.data.Status.Code == "OK") {
                        var seq = result.data.Data;

                        for (var i = 0, len = seq.length; i < len; i++) {
                            if (seq[i].DATUM_OD <= date && seq[i].DATUM_DO >= date) {
                                deferred.resolve(seq[i]);
                                return;
                            }
                        }
                    }

                    deferred.reject(null);
                },
                function (err) {
                    $log.error(err);
                    deferred.reject(err);
                });

            return deferred.promise;
        };


        return {
            all: all,
            getByDate: getByDate

        };
    }]);
})();

