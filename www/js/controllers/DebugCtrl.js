; (function () {
    "use strict";
    angular.module('sol.controllers')
    .controller('DebugCtrl', ['$scope', '$log', function ($scope, $log) {

        angular.element(document)
            .on("pagecreate", "#debug", function (event, ui) {
                //$log.debug("PAGECREATE - #ROZVRH - STUDENT");
            })
            .on("pagebeforeshow", "#debug", function (event, ui) {
                $('#debugContent').hide();
            })
            .on("pageshow", "#debug", function (event, ui) {
                $scope.init();
            });

        $scope.init = function () {
            $scope.$apply(function() {
                $scope.loadData();
            });
        };


        $scope.loadData = function () {
            $scope.data = {};
            $scope.data.device = (typeof device !== "undefined") ? device : {};
            $scope.data.navigator = (typeof navigator !== "undefined") ? navigator : {};
            $scope.data.app = {};


            if (typeof cordova !== "undefined" && cordova.getAppVersion) {
                cordova.getAppVersion().then(function (version) {
                    //$('.appVersion').text(version);
                    $scope.data.app = { "version": version };
                });
            }


            $('#debugContent').show();
        };


    }]);
})();