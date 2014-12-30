; (function () {
    "use strict";
    angular.module('sol.controllers')

        .controller('LogoutCtrl', ['$scope', '$rootScope', '$log', 'AuthorizationService', function ($scope, $rootScope, $log, AuthorizationService) {
            //$log.debug('LogoutCtrl');

            $scope.logout = function () {
                //$log.debug('LOGOUT');
                AuthorizationService.logout();

                $rootScope.$broadcast('logout');
                $rootScope.currentUser = null;

                $.mobile.changePage('#login', 'slide', true, true);
            };

        }]);
})();