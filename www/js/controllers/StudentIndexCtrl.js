; (function () {
    "use strict";
    angular.module('sol.controllers').controller('StudentIndexCtrl', ['$scope', '$rootScope', '$log', 'AuthorizationService', function ($scope, $rootScope, $log, AuthorizationService) {
        //$log.debug('IndexCtrl');

        angular.element(document)
        .on("pagecreate", "#studentIndex", function (event, ui) {
            //$log.debug("PAGECREATE - #ROZVRH");
        })
        .on("pageshow", "#studentIndex", function (event, ui) {
            //$log.debug("PAGESHOW - #ROZVRH");
            $scope.init();
        });

        $scope.init = function () {
            $scope.data = {};
            $scope.loadData();
        };


        $scope.loadData = function() {
            var currentUser = AuthorizationService.getCurrentUser();
            if (currentUser != null) {

                $scope.data.userInfo = "Jan Novák (2.X)";


            };
        };

        

    }]);
})();