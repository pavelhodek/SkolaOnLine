; (function () {
    "use strict";
    angular.module('sol.controllers')

        .controller('SkolniRokyCtrl', function ($scope, $log, $timeout, SkolniRokyService) {
            //$log.debug('SkolniRokyCtrl');

            angular.element(document)
                .on("pagecreate", "#skolni-rok", function (event, ui) {
                    //$log.debug("PAGECREATE - #skolni-rok");
                })
                .on("pageshow", "#skolni-rok", function (event, ui) {
                    $log.debug("PAGESHOW - #skolni-rok");

                    //$scope.$apply(function () {
                    $scope.loadData();
                    //$log.debug("PAGESHOW - #skolni-rok - init ");
                    //});
                });


            //$scope.init = function () {
            //    $scope.loadData();
            //}

            $scope.loadData = function () {
                $log.debug('SkolniRokyCtrl - LOAD DATA');

                SkolniRokyService.all()
                    .then(function (result) {
                        //$log.log(result);
                        $scope.statusMessage = result.Status.Message;
                        $scope.statusCode = result.Status.Code;
                        $scope.skolniRoky = result.Data;

                        // refresh (kvůli jqm extenzi)
                        $timeout(function () {
                            $("#skolni-roky-list").listview("refresh");
                        }, 0);
                    }, function (error) {
                        $log.error(error);
                    });

            }

        });
})();