; (function () {
    "use strict";
    var module = angular.module('sol.services');

    module.factory('UdalostService',
    ['$http', '$q', '$log', '$filter', 'NastaveniService', 'AuthorizationService', 'TridyService', 'ObdobiDneService', 'PredmetyService',
    function ($http, $q, $log, $filter, NastaveniService, AuthorizationService, TridyService, ObdobiDneService, PredmetyService) {

        //$log.debug('UdalostService');

        var me = {};

        me.getUdalostInfo = function (udalostId, udalostPoradi) {
            //$log.debug('getUdalostInfo');

            var url = AuthorizationService.getApiUrl() + 'Udalosti/' + udalostId + '/' + udalostPoradi;

            $http.defaults.headers.common.Authorization = AuthorizationService.getAuthorizationHeader();

            return $http.get(url);
        };


        function findInCollection(coll, pred) {
            for (var i = 0, len = coll.length; i < len; i++) {
                if (pred(coll[i])) {
                    return coll[i];
                }
            }
            return null;
        }

        me.getPopisHodiny = function (udalostID, udalostPoradi) {
            var obdobiDne = ObdobiDneService.all();
            var predmety = PredmetyService.all();

            var udalost = me.getUdalostInfo(udalostID, udalostPoradi);
            var deferred = $q.defer();

            // pockam na vsechny promise
            $q.all([udalost, obdobiDne, predmety]).then(function (results) {
                //$log.log("getPopisHodiny - all resloved");

                var udalost = results[0].data.Data;
                var obdobiDne = results[1].data.Data;
                var predmety = results[2].data.Data;

                var datum = $filter('date')(udalost.CAS_OD, 'd.M.yyyy');

                var obdobiDneOd = findInCollection(obdobiDne, function (x) { return x.OBDOBI_DNE_ID == udalost.OBDOBI_DNE_OD_ID; });

                var nazevObdobi = obdobiDneOd.NAZEV;

                if (udalost.OBDOBI_DNE_OD_ID != udalost.OBDOBI_DNE_DO_ID) {
                    var obdobiDneDo = findInCollection(obdobiDne, function (x) { return x.OBDOBI_DNE_ID == udalost.OBDOBI_DNE_DO_ID; });
                    nazevObdobi = nazevObdobi + ' - ' + obdobiDneDo.NAZEV;
                }

                var nazevUdalosti = udalost.NAZEV;

                //if (udalost.TYP_UDALOSTI_ID == 'ROZVRH') {

                if (udalost.REALIZACE_ID != null) {
                    var predmet = findInCollection(predmety, function (x) { return x.REALIZACE_ID == udalost.REALIZACE_ID; });

                    if (predmet) {
                        nazevUdalosti = predmet.NAZEV;
                        if (predmet.ZKRATKA != null) {
                            nazevUdalosti = predmet.ZKRATKA + ' (' + nazevUdalosti + ')';
                        }
                    }
                }

                var popisHodiny = datum + ' (' + nazevObdobi + '): ' + nazevUdalosti;

                deferred.resolve({ data: popisHodiny });
            });

            return deferred.promise;
        };


        return me;
    }]);
})();