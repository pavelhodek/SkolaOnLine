; (function () {
    "use strict";
    angular.module('sol.controllers')

        .controller('NastaveniCtrl', ['$scope', '$rootScope', '$http', '$log', 'NastaveniService', function ($scope, $rootScope, $http, $log, NastaveniService) {
            //$log.debug('NastaveniCtrl');

            //$scope.apiURL = NastaveniService.getApiURL();


            $scope.save = function () {
                //$log.debug('NastaveniCtrl - SAVE');

                NastaveniService.setApiURL($scope.apiURL);

                $http({
                    method: 'GET', url: $scope.apiURL + "/Test", timeout: 5000
                }).
                    success(function (data, status, headers, config) {
                        $("#nastaveniNotifier").html("Nastavení uloženo. <br>Zadané URL je platné.").popup("open");
                    }).
                    error(function (data, status, headers, config) {
                        $log.error(data);
                        $log.error(status);
                        $log.error(headers);
                        $log.error(config);
                        $("#nastaveniNotifier").html("Nastavení uloženo. <br>Nepopdařilo se však ověřit platnost URL.").popup("open");
                    });
            };

        }]);
})();