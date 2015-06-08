; (function () {
    "use strict";
    angular.module('sol.controllers')

        .controller('LoginCtrl', ['$scope', '$rootScope', '$log', '$timeout', 'AuthorizationService', 'NastaveniService', function ($scope, $rootScope, $log, $timeout, AuthorizationService, NastaveniService) {
            //$log.debug('LoginCtrl');

            angular.element(document)
                .on("pagecreate", "#login", function (event, ui) {
                    //$log.debug("PAGECREATE - #LOGIN");
                })
                .on("pageshow", "#login", function (event, ui) {
                    //.on("pagebeforeshow", "#login", function (event, ui) {
                    //$log.debug("PAGESHOW - #LOGIN");

                    $scope.$apply(function () {
                        $scope.init();
                        //$log.debug("PAGESHOW - #LOGIN init");
                    });
                });



            $rootScope.$on('logout', function () {
                //$log.debug("LoginCtrl - on logout");
                //$scope.resetForm();
                $scope.init();
            });

        var initial = {
            data: {
                username: null,
                password: null,
                remember: true,
                selectedApi: null
            }
        };


            $scope.resetForm = function () {
                //$log.debug("LoginCtrl - resetForm");

                angular.extend($scope, initial);

                // refresh radiobuttonu (kvůli jqm extenzi)
                $timeout(function () {
                    $("#remember").checkboxradio("refresh");
                }, 0);

            }



            $scope.init = function () {
                $scope.data = {};
                $rootScope.shared = {};
                $scope.data.remember = true; //AuthorizationService.getRemember();

                $scope.data.userProfiles = AuthorizationService.getUserProfiles();

                var apis = AuthorizationService.getApis();
                var apiUrls = [];
                apiUrls.push({ nazev: 'Výběr serveru', url: apis[0].url, id: apis[0].id });
                apiUrls = apiUrls.concat(apis);
                $scope.data.apiUrls = apiUrls;

                $scope.data.selectedApi = apiUrls[0];


                var currentUser = AuthorizationService.getCurrentUser();

                if (currentUser) {
                    $scope.data.username = currentUser.username; //AuthorizationService.getUsername();
                    $scope.data.password = null;

                    if (currentUser.apiId) {
                        $scope.data.selectedApi = NastaveniService.getApiById(currentUser.apiId);
                    } else {
                        $scope.data.selectedApi = NastaveniService.getApiByUrl(currentUser.apiUrl);
                    }


                    if ($scope.data.remember) {
                        $scope.data.password = currentUser.password; //AuthorizationService.getPassword();
                    }
                }

                $timeout(function () {
                    $("#login-userProfiles").listview("refresh");
                    $("#loginApis").selectmenu("refresh");
                    $("#remember").checkboxradio("refresh");
                }, 0);
            }


        function loginInternal(api, username, password, remember) {

            var authResult = AuthorizationService.checkAuthorizationIsValid(api.url, username, password);

            authResult
                .success(function (data, status, headers, config) {
                    if (data.Data) {

                        var userInfoResult = AuthorizationService.getUserInfo(api.url, username);
                        userInfoResult.then(
                            function (success) {
                                //$log.info(success);

                                //AuthorizationService.setCurrentUser(username, password, apiUrl);
                                // {"username":"ada","password":"welcome12","apiUrl":"http://sol.cca.cz/SOLWebApi/api/"}
                                var kategorie = success.data.Data.KATEGORIE_ID_CSV;
                                var id = success.data.Data.OSOBA_ID;

                                var currentUser = {
                                    username: username,
                                    password: password,
                                    apiId: api.id,
                                    //apiUrl: apiUrl.url,
                                    kategorie: kategorie,
                                    id: id
                                };
                                AuthorizationService.setCurrentUser(currentUser);

                                //var currentUser = AuthorizationService.getCurrentUser();

                                //$log.info("currentUser", currentUser);
                                $rootScope.currentUser = currentUser; // AuthorizationService.getUsername();


                                //$log.info("remember", remember);
                                if (remember === true) {
                                    AuthorizationService.saveUserProfile(currentUser);
                                }

                                var jeInterniRole = (
                                    currentUser.kategorie.indexOf("KAT_ADMIN") > -1
                                    || currentUser.kategorie.indexOf("KAT_UCITEL") > -1
                                );

                                //$log.info("jeInterniRole", jeInterniRole);


                                app.isUserLoggedIn = true;
                                app.isUserRoleInternal = jeInterniRole;
                                app.isUserRoleExternal = !jeInterniRole;

                                if (jeInterniRole) {
                                    $.mobile.changePage('#rozvrh', 'slide', true, true);
                                } else {
                                    //$.mobile.changePage('#rozvrhStudent', 'slide', true, true);    
                                    $.mobile.loading("hide");
                                    $.mobile.changePage('#indexStudent');
                                }
                                
                                

                            },
                            function (error) {
                                $.mobile.loading("hide");
                                $log.error(error);
                            });

                    } else {
                        $rootScope.currentUser = null;

                        app.isUserLoggedIn = false;
                        app.isUserRoleInternal = false;
                        app.isUserRoleExternal = false;

                        $.mobile.loading("hide");

                        if (data.Status.Code == "ACCOUNT_LOCKED") {
                            $("#loginNotifier").html("Účet je uzamčen.").popup("open");
                        } else {
                            $("#loginNotifier").html("Neplatné přihlášení.").popup("open");
                        }

                    }
                });
        }


        $scope.login = function () {
                //$log.debug("LOGIN");
                $rootScope.currentUser = null;
                $rootScope.$broadcast('login');


                if (navigator.network && navigator.network.connection.type === Connection.NONE) {
                    navigator.notification.alert(
                          'Vaše zařízení není připojeno k Interentu. Data nemohou být přijata.',
                          function () { },
                          'Chybí připojení'
                        );

                    return;
                }

                $.mobile.loading("show", {
                    text: "načítám...",
                    textVisible: true,
                    theme: "a",
                    html: ""
                });

                //var apiResult = AuthorizationService.findApiByUsername($scope.data.username);

                //apiResult.then(
                //    function(api) {
                //        loginInternal(api, $scope.data.username, $scope.data.password, $scope.data.remember);
                //        $.mobile.loading("hide");
                //    },
                //    function(reason) {
                //        $.mobile.loading("hide");
                //        $("#loginNotifier").html("Neplatné přihlášení.").popup("open");
                //        //$log.error("error: ", reason);
                //    });

            var api = $scope.data.selectedApi;
            loginInternal(api, $scope.data.username, $scope.data.password, $scope.data.remember);
            $.mobile.loading("hide");

        };

        $scope.loginProfile = function (profile) {
            if (navigator.network && navigator.network.connection.type === Connection.NONE) {
                navigator.notification.alert(
                      'Vaše zařízení není připojeno k Interentu. Data nemohou být přijata.',
                      function () { },
                      'Chybí připojení'
                    );

                return;
            }

            $.mobile.loading("show", {
                text: "načítám...",
                textVisible: true,
                theme: "a",
                html: ""
            });

            $rootScope.$broadcast('login');

            var api = null;
            if (profile.apiUrl)
                api = NastaveniService.getApiByUrl(profile.apiUrl);
            else if (profile.apiId)
                api = NastaveniService.getApiById(profile.apiId);

            loginInternal(api, profile.username, profile.password);
        };


        $scope.deleteProfile = function (profile, index) {
            $scope.data.userProfiles.splice(index, 1);
            AuthorizationService.setUserProfiles($scope.data.userProfiles);
        };


    }]);
})();