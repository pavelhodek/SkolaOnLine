; (function () {
    "use strict";
    var module = angular.module('sol.services');

    module.factory('SkolniRokyService', ['$http', '$q', '$log', '$resource', 'NastaveniService', 'AuthorizationService', function ($http, $q, $log, $resource, NastaveniService, AuthorizationService) {
        //$log.debug('SkolniRokyService');

        //var url = AuthorizationService.getApiUrl() + 'SkolniRoky';

        //var data = $resource(url).get();

        //var me = {};

        //me.all = function () {
        //    return data.$promise;
        //};

        //return me;


        return {
            all: function () {
                //$log.debug('PredmetyService - all');
                var url = AuthorizationService.getApiUrl() + 'SkolniRoky';

                $http.defaults.headers.common.Authorization = AuthorizationService.getAuthorizationHeader();

                return $http.get(url, { cache: true });
            }
        };




    }]);
})();

