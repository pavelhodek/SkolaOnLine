﻿; (function () {
    "use strict";
    angular.module('sol.controllers')

        .controller('LoginCtrl', ['$scope', '$rootScope', '$log', '$timeout', 'AuthorizationService', function ($scope, $rootScope, $log, $timeout, AuthorizationService) {
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

            var initial = {data: {
                username: null,
                password: null,
                remember: true
            }};


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

                var currentUser = AuthorizationService.getCurrentUser();

                if (currentUser) {
                    $scope.data.username = currentUser.username; //AuthorizationService.getUsername();
                    $scope.data.password = null;

                    if ($scope.data.remember) {
                        $scope.data.password = currentUser.password; //AuthorizationService.getPassword();
                    }
                }

                $scope.data.userProfiles = AuthorizationService.getUserProfiles();


                $timeout(function () {
                    $("#login-userProfiles").listview("refresh");
                    $("#remember").checkboxradio("refresh");
                }, 0);
            }


        function loginInternal(apiUrl, username, password, remember) {

            var authResult = AuthorizationService.checkAuthorizationIsValid(apiUrl, username, password);

            authResult
                .success(function (data, status, headers, config) {
                    if (data.Data) {

                        var userInfoResult = AuthorizationService.getUserInfo(apiUrl, username);
                        userInfoResult.then(
                            function (success) {
                                $log.info(success);

                                //AuthorizationService.setCurrentUser(username, password, apiUrl);
                                // {"username":"ada","password":"welcome12","apiUrl":"http://sol.cca.cz/SOLWebApi/api/"}
                                var kategorie = success.data.Data.KATEGORIE_ID_CSV;
                                var id = success.data.Data.OSOBA_ID;

                                var currentUser = {
                                    username: username,
                                    password: password,
                                    apiUrl: apiUrl,
                                    kategorie: kategorie,
                                    id: id
                                };
                                AuthorizationService.setCurrentUser(currentUser);

                                //var currentUser = AuthorizationService.getCurrentUser();

                                $log.info("currentUser", currentUser);
                                $rootScope.currentUser = currentUser; // AuthorizationService.getUsername();


                                $log.info("remember", remember);
                                if (remember === true) {
                                    AuthorizationService.saveUserProfile(currentUser);
                                }

                                var jeInterniRole = (
                                    currentUser.kategorie.indexOf("KAT_ADMIN") > -1
                                    || currentUser.kategorie.indexOf("KAT_UCITEL") > -1
                                );

                                $log.info("jeInterniRole", jeInterniRole);


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
                $log.debug("LOGIN");
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

                var apiUrlResult = AuthorizationService.findApiUrl($scope.data.username);

                apiUrlResult.then(
                    function(apiUrl) {
                        $log.info("apiUrlResult", apiUrl);
                        //AuthorizationService.storeLogin($scope.data.username, $scope.data.password, $scope.data.remember);
                        loginInternal(apiUrl, $scope.data.username, $scope.data.password, $scope.data.remember);
                        $.mobile.loading("hide");
                    },
                    function(reason) {
                        $.mobile.loading("hide");
                        $("#loginNotifier").html("Neplatné přihlášení.").popup("open");
                        //$log.error("error: ", reason);
                    });
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
            //AuthorizationService.storeLogin(profile.username, profile.password, profile.apiUrl);

            loginInternal(profile.apiUrl, profile.username, profile.password);
        };


        $scope.deleteProfile = function (profile, index) {
            $scope.data.userProfiles.splice(index, 1);
            AuthorizationService.setUserProfiles($scope.data.userProfiles);
        };


    }]);
})();