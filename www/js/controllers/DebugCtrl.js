; (function () {
    "use strict";
    angular.module('sol.controllers')
    .controller('DebugCtrl', ['$scope', '$log', '$timeout', 'NastaveniService', function ($scope, $log, $timeout, NastaveniService) {   

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
            //$scope.$apply(function() {
                $scope.loadData();
            //});
        };


        $scope.updateEnvironment = function () {
            $log.log($scope.data.selectedEnvironmentCode);

            //$scope.data.selectedEnvironmentCode = $scope.selectedEnvironment.code;

            NastaveniService.setEnvironment($scope.data.selectedEnvironmentCode);

            // use $scope.selectedItem.code and $scope.selectedItem.name here
            // for other stuff ...
        }

        $scope.enhanceFields = function () {
            $timeout(function () {
                angular.element('#ddlEnvironment').selectmenu('refresh');
            }, 0);
        };




        $scope.loadData = function () {
            $scope.data = {};
            $scope.data.device = (typeof device !== "undefined") ? device : {};
            $scope.data.navigator = (typeof navigator !== "undefined") ? navigator : {};
            $scope.data.app = { version: app.version };
            

            //if (typeof cordova !== "undefined" && cordova.getAppVersion) {
            //    cordova.getAppVersion().then(function (version) {
            //        //$('.appVersion').text(version);
            //        $scope.data.app = { "version": version };
            //        $scope.$apply();
            //    });
            //}

            $scope.data.environments = [
                { "name": "produkce", "code": "prod" },
                { "name": "testování", "code": "test" },
                { "name": "vývoj", "code": "dev" }
            ];

            //$scope.data.selectedEnvironment = $scope.data.environments[0];
            $scope.data.selectedEnvironmentCode = NastaveniService.selectedEnvironmentCode;

            $scope.$apply();

            $scope.enhanceFields();


            $('#debugContent').show();





        };


    }]);
})();