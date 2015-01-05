; (function () {
    "use strict";
    var module = angular.module('sol.services');

    module.factory('AuthorizationService', ['$http', '$q', '$log', '$rootScope', 'NastaveniService', function ($http, $q, $log, $rootScope, NastaveniService) {
        var me = {};

        me.getApiUrl = function() {
            var user = me.getCurrentUser();
            if (user) {
                return user.apiUrl;
            }

        //if ($rootScope.currentUser) {
            //    return $rootScope.currentUser.apiUrl;
            //}

            return "";
        };

        me.findApiUrl = function(username) {
            //if ($rootScope.currentUser) {
            //    var currentUser = $rootScope.currentUser || {};
            //    if (currentUser.username == username) {
            //        return currentUser.apiUrl;
            //    }
            //}

            var apiUrls = NastaveniService.defaultApiUrls;

            //for (var i = 0, length = urls.length; i < length; i++) {
            //    //h ttp://localhost/SOLWebApi/api/UzivatelInfo/ada
            //    var url = urls[i] + 'UzivatelInfo/' + username;
            //    return $http.get(url);

            //}

            var foundUrl = [];

            //var context = {};
            //context.foundUrl = [];


            var urls = apiUrls.map(function(url, i) {
                return function() {
                    return $http.get(url + "UzivatelInfo/" + username).then(function(data) {
                        $log.debug("then: ", url, data);

                        if (data.data.Status.Code == "OK") {
                            $log.debug("OK", url);
                            //$log.debug(context.foundUrl.length);
                            //context.foundUrl.push(url);
                            foundUrl.push(url);
                            //$log.debug(context.foundUrl.length);
                            //context.foundUrl.push(url);
                            return url;
                        } else {
                            //context.foundUrl.push("xxx");
                            //return null;
                            //return data.data.Status.Code;
                        }
                    });
                }
            });

            var deferred = $q.defer();

            //var deferredUrls = urls.forEach(function(t) { return t(); });
            var deferredUrls = [];
            urls.forEach(function (x) { deferredUrls.push(x()); });


            //$.when.apply(this, urls.forEach(function(t) { return t(); })).then(function(results) {
            //$.when(urls.forEach(function (t) { return t(); })).then(function (results) {
            //$.when(urls.forEach(function (t) { return t(); })).then(function (results) {
            $q.all(deferredUrls).then(function (results) {
                $log.info("results:", results);
                //$log.info("foundUrl: ", context.foundUrl);
                $log.info("foundUrl: ", foundUrl);

                //if (context.foundUrl.length > 0) {
                if (foundUrl.length > 0) {
                    //deferred.resolve(context.foundUrl[0]);
                    //deferred.resolve(foundUrl[0]);

                    // TODO: zde je potřeba nechat uživatele vybrat URL (uživatelský název)

                    deferred.resolve(foundUrl[foundUrl.length - 1]);
                } else {
                    deferred.reject("nic");
                }
            });

            return deferred.promise;

            //var url = NastaveniService.getApiURL() + 'AuthorizationStatus';

            //$http.defaults.headers.common.Authorization = me.getAuthorizationHeader();

            //return $http.get(url);

            //return "";
            //return localStorage.getItem("nastaveni.apiURL") || defaultApiUrl;
        };


        me.setAuthorizationHeader = function () {
            $http.defaults.headers.common.Authorization = me.getAuthorizationHeader();
        }

        me.getAuthorizationHeader = function (username, password) {
            if (username && password) {
                return 'Basic ' + base64.encode(username + ":" + password);
            } else {
                var currentUser = me.getCurrentUser();
                var basicAuthHash = base64.encode(currentUser.username + ":" + currentUser.password);
                return 'Basic ' + basicAuthHash;
            }
        }

        me.getStoredCredentials = function () {
            if (me.getRemember()) {
                //var username = me.getUsername();
                //var password = me.getPassword();

                var currentUser = me.getCurrentUser();

                if ($.trim(currentUser.username) != "" && $.trim(currentUser.password) != "") {
                    return { username: currentUser.username, password: currentUser.password, apiUrl: currentUser.apiUrl };
                }
            }

            return null;
        }


        me.getCurrentUser = function () {
            return JSON.parse(localStorage.getItem("currentUser"));
        }


        //me.getUsername = function () {
        //    return localStorage.getItem("login.username");
        //}

        //me.getPassword = function () {
        //    return localStorage.getItem("login.password");
        //}

        me.getRemember = function () {
            return !!JSON.parse(localStorage.getItem("login.remember"));
        }


        //me.setUsername = function (value) {
        //    //$log.info("SET USERNAME");
        //    localStorage.setItem("login.username", value);
        //}

        //me.setPassword = function (value) {
        //    //$log.info("SET PASSWORD");
        //    localStorage.setItem("login.password", value);
        //}

        me.setRemember = function (value) {
            //$log.info("SET REMEMBER");
            localStorage.setItem("login.remember", value);
        }

        me.logout = function() {
            //$log.info("LOGOUT");
            //localStorage.removeItem("login.remember");
            //localStorage.removeItem("login.username");
            //localStorage.removeItem("login.password");

            localStorage.removeItem("currentUser");

            $http.defaults.headers.common.Authorization = "";

            app.isUserLoggedIn = false;
            app.isUserRoleInternal = false;
            app.isUserRoleExternal = false;

        };

        me.checkAuthorizationIsValid = function(apiUrl, username, password) {
            //var url = NastaveniService.getApiURL() + 'AuthorizationStatus';
            var url = apiUrl + 'AuthorizationStatus';

            $http.defaults.headers.common.Authorization = me.getAuthorizationHeader(username, password);

            return $http.get(url);
        };

        me.getUserInfo = function(apiUrl, username) {
            var url = apiUrl + 'UzivatelInfo/' + username;
            $http.defaults.headers.common.Authorization = me.getAuthorizationHeader(username, password);
            return $http.get(url);
        };


        me.getUserProfiles = function() {
            var userProfiles = JSON.parse(localStorage.getItem("userProfiles")) || [];
            return userProfiles;
        };

        me.setUserProfiles = function(userProfiles) {
            localStorage.setItem("userProfiles", JSON.stringify(userProfiles));
        };


        //me.setCurrentUser = function(username, password, apiUrl) {
        //    //$log.info("STORE LOGIN");
        //    //localStorage.setItem("login.username", username);
        //    //localStorage.setItem("login.password", password);

        //    var currentUser = {
        //        "username": username,
        //        "password": password,
        //        //"remember": remember || false,
        //        "apiUrl": apiUrl
        //    };

        //    localStorage.setItem("currentUser", JSON.stringify(currentUser));

        //};


        me.setCurrentUser = function (currentUser) {
            //$log.info("STORE LOGIN");
            //localStorage.setItem("login.username", username);
            //localStorage.setItem("login.password", password);

            localStorage.setItem("currentUser", JSON.stringify(currentUser));
        };




        me.saveUserProfile = function (user) {
            //$log.info("STORE LOGIN");
            //localStorage.setItem("login.username", username);
            //localStorage.setItem("login.password", password);

            var userProfiles = me.getUserProfiles();

            var foundProfile = _(userProfiles).find(function (x) { return x.username == user.username; });
            if (typeof foundProfile === "undefined") {
                userProfiles.push(user);
            }

            me.setUserProfiles(userProfiles);
            //localStorage.setItem("userProfiles", JSON.stringify(userProfiles));


            //alert(foundProfile);
            //setAuthorizationHeader();
        };


        me.storeLogin = function(username, password, apiUrl) {
            //$log.info("STORE LOGIN");
            //localStorage.setItem("login.username", username);
            //localStorage.setItem("login.password", password);

            var currentUser = {
                "username": username,
                "password": password,
                "apiUrl": apiUrl
            };

            localStorage.setItem("currentUser", JSON.stringify(currentUser));

            var userProfiles = me.getUserProfiles();

            var foundProfile = _(userProfiles).find(function(x) { return x.username == username; });
            if (typeof foundProfile === "undefined") {
                userProfiles.push(currentUser);
            }

            me.setUserProfiles(userProfiles);
            //localStorage.setItem("userProfiles", JSON.stringify(userProfiles));


            //alert(foundProfile);
            //setAuthorizationHeader();
        };



        return me;
    }]);
})();


