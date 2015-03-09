; (function () {
    "use strict";
    angular.module('sol.controllers')

        .controller('IndexCtrl', ['$scope', '$rootScope', '$log', '$timeout', 'AuthorizationService', function ($scope, $rootScope, $log, $timeout, AuthorizationService) {
            //$log.debug('IndexCtrl');

            $scope.redirectToLogin = function () {
                $.mobile.pageContainer.pagecontainer("change", "#login");
                //$.mobile.changePage('#login');
            }

            var isLoginRemember = AuthorizationService.getRemember();
            if (isLoginRemember) {

                //var credentials = AuthorizationService.getStoredCredentials();
                var currentUser = AuthorizationService.getCurrentUser();
                $log.info("currentUser", currentUser);

                if (currentUser != null) {

                    var result = AuthorizationService.checkAuthorizationIsValid(currentUser.apiUrl, currentUser.username, currentUser.password);

                    result.success(function (data, status, headers, config) {
                        if (data.Data) {
                            $log.info(data);
                            var jeInterniRole = (currentUser.kategorie.split(',').filter(function(a) { return (a == "KAT_STUDENT" || a == "KAT_RODIC"); }).length == 0);

                            app.isUserRoleInternal = jeInterniRole;
                            app.isUserRoleExternal = !jeInterniRole;

                            if (app.isUserRoleInternal) {
                                //$.mobile.changePage('#rozvrh', 'slide', true, true);
                                $timeout(function () { $.mobile.changePage('#rozvrh'); }, 0);
                            } else if (app.isUserRoleExternal) {
                                //$.mobile.changePage('#rozvrhStudent', 'slide', true, true);
                                //$timeout(function () { $.mobile.changePage('#rozvrhStudent'); }, 0);
                                $timeout(function () { $.mobile.changePage('#indexStudent'); }, 0);
                            }

                            //$timeout(function () { $.mobile.changePage('#rozvrh'); }, 0);
                        } else {
                            $timeout(function () { $.mobile.changePage('#login'); }, 0);
                        }
                    });
                } else {
                    $timeout(function () { $.mobile.changePage('#login'); }, 0);
                }
            } else {
                $timeout(function () { $.mobile.changePage('#login'); }, 0);
            }
        }]);
})();