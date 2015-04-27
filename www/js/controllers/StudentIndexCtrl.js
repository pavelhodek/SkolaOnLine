; (function () {
    "use strict";
    angular.module('sol.controllers').controller('StudentIndexCtrl', ['$scope', '$rootScope', '$log', '$http', '$timeout', 'AuthorizationService', 'ZastupceOsobyService', function ($scope, $rootScope, $log, $http, $timeout, AuthorizationService, ZastupceOsobyService) {
        //$log.debug('IndexCtrl');

        angular.element(document)
        .on("pagecreate", "#indexStudent", function (event, ui) {
            //$log.debug("PAGECREATE - #ROZVRH");
        })
        .on("pagebeforeshow", "#indexStudent", function (event, ui) {
            $('#indexStudentContent').hide();
        })
        .on("pageshow", "#indexStudent", function (event, ui) {
            //$log.debug("PAGESHOW - #ROZVRH");
            $scope.$apply(function() {
                $scope.init();
            });
        });

        $scope.init = function () {
            $scope.data = {};

            $scope.loadData();

            $scope.pocetStudentu = 0;
        };



        $scope.loadData = function() {
            if (!$rootScope.shared) {
                //$log.log("STUDENT_ID: null");
                $rootScope.shared = { STUDENT_ID: null };
            }

            var currentUser = AuthorizationService.getCurrentUser();

            if (currentUser != null) {
 
                ZastupceOsobyService.all().then(function(success) {
                    //$log.log(success);

                    $scope.data.Studenti = _(success.data.Data).sortBy(function (x) { return x.JMENO; }).value();
                    $scope.pocetStudentu = $scope.data.Studenti.length;

                    if (! $rootScope.shared.STUDENT_ID) {
                        $rootScope.shared.STUDENT_ID = ($scope.data.Studenti.length > 0) ? $scope.data.Studenti[0].OSOBA_ID : currentUser.OSOBA_ID;
                        //$log.log("STUDENT_ID: " + $rootScope.shared.STUDENT_ID);
                    }

                    $timeout(function () { $("#student").selectmenu('refresh'); }, 0);

                    //$log.log("$rootScope.shared.STUDENT_ID", $rootScope.shared.STUDENT_ID);
                    $('#indexStudentContent').show();
                }, function(error) {
                    $log.error(error);
                    $('#indexStudentContent').show();
                });


                $scope.data.userInfo = currentUser.username; //"Jan Novák (2.X)";
            }
        };

    }]);
})();