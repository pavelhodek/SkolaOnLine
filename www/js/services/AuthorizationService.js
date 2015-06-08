; (function () {
    "use strict";
    var module = angular.module('sol.services');

    module.factory('AuthorizationService', ['$http', '$q', '$log', '$rootScope', '$cacheFactory', 'NastaveniService', function ($http, $q, $log, $rootScope, $cacheFactory, NastaveniService) {
        var me = {};

        me.getApiUrl = function() {
            var user = me.getCurrentUser();

            //if (user) {
            //    return user.apiUrl;
            //}

            //return "";

            return getApiUrlByUser(user);

        };

        //me.findApi ByUsername = function (username) {

        //    var apis = NastaveniService.getApis();

        //    var foundUrl = [];


        //    var suitableApis = apis.map(function (api, i) {
        //        return function() {

        //            return $http({
        //                url: api.url + "UzivatelInfo",
        //                method: "POST",
        //                data: JSON.stringify(utf8_to_b64(username)),
        //                headers: { 'Content-Type': 'application/json' }
        //                })
        //                .then(function (data) {

        //                if (data.data.Status.Code == "OK") {
        //                    foundUrl.push(api);
        //                    return api;
        //                }
        //            });
        //        }
        //    });

        //    var deferred = $q.defer();

        //    var deferredUrls = [];
        //    suitableApis.forEach(function (x) { deferredUrls.push(x()); });

        //    $q.all(deferredUrls).then(function (results) {

        //        if (foundUrl.length > 0) {

        //            // TODO: zde je potřeba nechat uživatele vybrat URL (uživatelský název)

        //            deferred.resolve(foundUrl[foundUrl.length - 1]);
        //        } else {
        //            deferred.reject(null);
        //        }
        //    });

        //    return deferred.promise;
        //};


        me.setAuthorizationHeader = function () {
            $http.defaults.headers.common.Authorization = me.getAuthorizationHeader();
            //$http.defaults.headers['base64'] = "1";
        }


        function utf8_to_b64(str) {
            return window.btoa(unescape(encodeURIComponent(str)));
        }

        me.getAuthorizationHeader = function (username, password) {
            //if (username && password) {
            //    return 'Basic ' + base64.encode(username + ":" + password);
            //} else {
            //    var currentUser = me.getCurrentUser();
            //    var basicAuthHash = base64.encode(currentUser.username + ":" + currentUser.password);
            //    return 'Basic ' + basicAuthHash;
            //}

            if (username && password) {
                //var sanitizedUsername = username.replace(/:/g, '\\:');
                //var sanitizedPassword = username.replace(/:/g, '\\:');

                var sanitizedUsername = utf8_to_b64(username);
                var sanitizedPassword = utf8_to_b64(password);

                //$log.info('Basic', utf8_to_b64(sanitizedUsername + ":" + sanitizedPassword));


                return 'Basic ' + utf8_to_b64(sanitizedUsername + ":" + sanitizedPassword);
            } else {
                var currentUser = me.getCurrentUser();
                var sanitizedCurrentUsername = utf8_to_b64(currentUser.username);
                var sanitizedCurrentPassword = utf8_to_b64(currentUser.password);

                var basicAuthHash = utf8_to_b64(sanitizedCurrentUsername + ":" + sanitizedCurrentPassword);
                return 'Basic ' + basicAuthHash;
            }

        }

        me.getStoredCredentials = function () {
            if (me.getRemember()) {
                //var username = me.getUsername();
                //var password = me.getPassword();

                var currentUser = me.getCurrentUser();

                if ($.trim(currentUser.username) != "" && $.trim(currentUser.password) != "") {

                    var apiId = currentUser.apiId || NastaveniService.getApiByUrl(currentUser.apiUrl).id;

                    return { username: currentUser.username, password: currentUser.password, apiId: apiId };
                }
            }

            return null;
        }


        me.getCurrentUser = function () {
            return JSON.parse(localStorage.getItem("currentUser"));
        }


        function getApiUrlByUser(user) {
            if (user) {
                if (user.apiUrl) return user.apiUrl;
                if (user.apiId) return NastaveniService.getApiById(user.apiId).url;
            }

            return '';
        }

        me.getCurrentUserEnvironmentCode = function() {
            var user = me.getCurrentUser();

            if (user) {
                if (user.apiUrl) return NastaveniService.getEnvironmentCodeByApiUrl(user.apiUrl);
                if (user.apiId) return NastaveniService.getEnvironmentCodeByApiId(user.apiId);
            }

            return null;
        }

        me.getRemember = function () {
            return !!JSON.parse(localStorage.getItem("login.remember"));
        }


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

            var $httpDefaultCache = $cacheFactory.get('$http');
            $httpDefaultCache.removeAll();

        };

        me.checkAuthorizationIsValid = function(apiUrl, username, password) {
            //var url = NastaveniService.getApiURL() + 'AuthorizationStatus';
            var url = apiUrl + 'AuthorizationStatus';
            //$log.info("checkAuthorizationIsValid", url);

            $http.defaults.headers.common.Authorization = me.getAuthorizationHeader(username, password);

            //return $http.get(url, {
            //    headers: { 'base64': '1' }
            //});

            return $http.get(url);
        };


        me.getUserInfo = function(apiUrl, username) {

            
            //var url = apiUrl + 'UzivatelInfo/' + escape(username);
            //$http.defaults.headers.common.Authorization = me.getAuthorizationHeader(username, password);
            //return $http.get(url);

            var url = apiUrl + 'UzivatelInfo';
            $http.defaults.headers.common.Authorization = me.getAuthorizationHeader(username, password);

            return $http({
                url: url,
                method: "POST",
                data: JSON.stringify(utf8_to_b64(username)),
                headers: { 'Content-Type': 'application/json' }
            });


        };


        me.getUserProfiles = function() {
            var userProfiles = JSON.parse(localStorage.getItem("userProfiles")) || [];
            return userProfiles;
        };

        me.setUserProfiles = function(userProfiles) {
            localStorage.setItem("userProfiles", JSON.stringify(userProfiles));
        };


        me.getApis = function() {
            return NastaveniService.getApis();
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

        /*
        me.storeLogin = function(username, password, apiUrl) {
            //$log.info("STORE LOGIN");
            //localStorage.setItem("login.username", username);
            //localStorage.setItem("login.password", password);

            var currentUser = {
                "username": username,
                "password": password,
                "apiUrl": apiUrl,
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
        */


        return me;
    }]);
})();


