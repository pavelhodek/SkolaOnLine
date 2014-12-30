; (function () {
    "use strict";
    angular.module('sol.controllers')

        .controller('IndexCtrl', ['$scope', '$rootScope', '$log', 'AuthorizationService', function ($scope, $rootScope, $log, AuthorizationService) {
            //$log.debug('IndexCtrl');

            $scope.redirectToLogin = function () {
                $.mobile.pageContainer.pagecontainer("change", "#login");
                //$.mobile.changePage('#login');
            }

            var isLoginRemember = AuthorizationService.getRemember();
            if (isLoginRemember) {

                //var credentials = AuthorizationService.getStoredCredentials();
                var currentUser = AuthorizationService.getCurrentUser();
                if (currentUser != null) {
                    var result = AuthorizationService.checkAuthorizationIsValid();

                    result.success(function (data, status, headers, config) {
                        if (data.Data) {

                            app.isUserRoleInternal = jeInterniRole;
                            app.isUserRoleExternal = !jeInterniRole;

                            if (app.isUserRoleInternal) {
                                //$.mobile.changePage('#rozvrh', 'slide', true, true);
                                setTimeout(function () { $.mobile.changePage('#rozvrh'); }, 0);
                            } else if (app.isUserRoleExternal) {
                                //$.mobile.changePage('#rozvrhStudent', 'slide', true, true);
                                //setTimeout(function () { $.mobile.changePage('#rozvrhStudent'); }, 0);
                                setTimeout(function () { $.mobile.changePage('#indexStudent'); }, 0);
                            }

                            //setTimeout(function () { $.mobile.changePage('#rozvrh'); }, 0);
                        } else {
                            setTimeout(function () { $.mobile.changePage('#login'); }, 0);
                        }
                    });
                } else {
                    setTimeout(function () { $.mobile.changePage('#login'); }, 0);
                }
            } else {
                setTimeout(function () { $.mobile.changePage('#login'); }, 0);
            }
        }]);
})();