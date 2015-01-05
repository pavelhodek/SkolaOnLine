; (function () {
    "use strict";
    //angular.module('sol.controllers').controller('StudentIndexCtrl', ['$scope', '$rootScope', '$log', '$http', 'AuthorizationService', 'ZastupceOsobyService', function ($scope, $rootScope, $log, $http, AuthorizationService, ZastupceOsobyService) {
    angular.module('sol.controllers').controller('StudentIndexCtrl', function ($scope, $rootScope, $log, $http, AuthorizationService, ZastupceOsobyService) {
        //$log.debug('IndexCtrl');

        angular.element(document)
        .on("pagecreate", "#indexStudent", function (event, ui) {
            //$log.debug("PAGECREATE - #ROZVRH");
        })
        .on("pageshow", "#indexStudent", function (event, ui) {
            //$log.debug("PAGESHOW - #ROZVRH");
            $scope.init();
        });

        $scope.init = function () {
            $scope.data = {};
            $scope.loadData();
            $scope.pocetStudentu = 0;
        };



        $scope.loadData = function() {
            //if (! $rootScope.shared) {
                $rootScope.shared = { STUDENT_ID: null };
            //}

            var currentUser = AuthorizationService.getCurrentUser();

            if (currentUser != null) {
 
                ZastupceOsobyService.all().then(function(success) {
                    $log.log(success);

                    $scope.data.Studenti = _(success.data.Data).sortBy(function (x) { return x.JMENO; }).value();
                    $scope.pocetStudentu = $scope.data.Studenti.length;

                    //if (! $rootScope.shared.STUDENT_ID) {
                        $rootScope.shared.STUDENT_ID = ($scope.data.Studenti.length > 0) ? $scope.data.Studenti[0].OSOBA_ID : currentUser.OSOBA_ID;
                    //}

                    setTimeout(function() { $("#student").selectmenu('refresh'); }, 0);

                    $log.log("$rootScope.shared.STUDENT_ID", $rootScope.shared.STUDENT_ID);

                }, function(error) {
                    $log.error(error);
                });


                //$scope.data.Studenti = [
                //    { OSOBA_ID: "S1", JMENO: "Alice" },
                //    { OSOBA_ID: "S2", JMENO: "Bob" },
                //    { OSOBA_ID: "S3", JMENO: "Claire" }
                //];


                $scope.data.userInfo = currentUser.username; //"Jan Novák (2.X)";


            }
        };


        $scope.inc = function() {

            var url = AuthorizationService.getApiUrl() + 'Values/counter/inc';
            $http.defaults.headers.common.Authorization = AuthorizationService.getAuthorizationHeader();

            return $http.get(url, { cache: true }).then(function(result) {
            //return $http.get(url).then(function (result) {
                $log.log(result);
                $scope.counter = result.data;
            }, 
            function(error) {
                $log.error(error);
                $scope.counter = "error";
            });

        };


//    }]);
    });
})();