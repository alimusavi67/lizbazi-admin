angular.module('MetronicApp')
    .service('cookieService', function ($http, $route, $timeout ,$rootScope, $location, $cookieStore,$cookies, $q, Constants) {
        
        this.getServerAddress = function () {
            return Constants.serverUrl;
        };
    
        this.getToken = function () {
            var userData = $cookieStore.get(Constants.cookieName);
            if (userData) {
                return userData.token;
            }
            return "";
        };

        this.getUsername = function () {
            var userData = $cookieStore.get(Constants.cookieName);
            if (userData) {
                return userData.user.username;
            }
            return "";
        };
    
        this.validateUserInfo = function () {
            var deferred = $q.defer();

            var userData = $cookieStore.get(Constants.cookieName);
            if (userData) {
                var username = userData.username;
                var token = userData.token;
                if (username && token) {
                    $http.post(Constants.serverUrl + "/validateToken", userData)
                        .then(function (response) {
                            if (response.statusText == "OK") {
                                //console.log("validate token. TCPStatus: [" + response.statusText +
                                //    "], status: [" + response.data.status + "]");

                                if (response.data.status == 200) {
                                    var info = {
                                        username: userData.username,
                                        token: userData.token
                                    };
                                    $cookieStore.put(Constants.cookieName, info, {'expires': getCookieExpireDate()});
                                    deferred.resolve(info);
                                } else {
                                    $cookieStore.remove(Constants.cookieName);
                                    deferred.reject(response.data.body);
                                }
                            } else {
                                deferred.reject("exception in validateToken");
                            }
                        });
                } else {
                    deferred.reject("invalid cookies data");
                }
            } else {
                deferred.reject("empty cookies");
            }
            return deferred.promise;
        };
        // ========= Login operations ==============
        this.login = function (username, password,remember) {
            var deferred = $q.defer();
            var deviceId = fingerPrint();
            var loginReq = {
                username: username,
                password: password,
                platform: 'Web',
                buildNo: 1
            };
            var url = Constants.serverUrl + "/user/login";
            var config = Constants.defaultHeader();
    
            $http.post(url, loginReq, config)
                .then(function (response) {
                    var expireDate = nxtWeekExpire();
                        if (response.status === 200) {
                           var user = response.data.content.userInfo;
                             var userInfo = JSON.stringify(user);
                            if (remember) {
                                $cookies.put(Constants.cookieName, userInfo,{'expires' : expireDate});
                                $cookies.put("token", response.data.content.token,{'expires' : expireDate});
                            }
                            else {
                                $cookies.put(Constants.cookieName, userInfo);
                                $cookies.put("token", response.data.content.token);
                            }
                   }
                     deferred.resolve(response);
                }).catch(function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        };
        // ================= Log out opration =================
        var logoutFromServer = function () {
            var deferred = $q.defer();
            var url = Constants.serverUrl + "/operator/logout";
            var config = Constants.defaultHeader();
            var data = {};
            $http.post(url, data, config)
                .then(function (response) {
                    deferred.resolve(response);
                    $cookieStore.remove("token");
                }).catch(function (response) {
                    deferred.reject(response.status);
                    $cookieStore.remove("token");
                });
            return deferred.promise;
        };
         // ========= Validation operations ==============
        this.validateSession = function () {
            var user = $cookies.get(Constants.cookieName);
            if (user) {
                user = JSON.parse(user);
            }
            var sessionId = $cookies.get("token");
            if (user) {
                return user;
            } else {
                return false;
            }
        };

        var getCookieExpireDate = function () {
            var myDate = new Date();
            var nextMonth = new Date(myDate);
            nextMonth.setMonth(myDate.getMonth() + 1);
            return nextMonth;

        };
         var nxtWeekExpire = function () {
            var myDate = new Date();
            myDate.setTime(myDate.getTime()+(7*24*60*60*1000));
            var expireTime = myDate.toGMTString();
            return expireTime;

        };
    
        this.logout = function(){
            $('.loader').removeClass('hide');
            logoutFromServer();
            $cookieStore.remove(Constants.cookieName);
            location.reload();
        };
        var fingerPrint = function() {
            var navigator_info = window.navigator;
            var screen_info = window.screen;
            var uid = navigator_info.mimeTypes.length;
            uid += navigator_info.userAgent.replace(/\D+/g, '');
            uid += navigator_info.plugins.length;
            uid += screen_info.height || '';
            uid += screen_info.width || '';
            uid += screen_info.pixelDepth || '';
            return uid;
        }
        function addCustomHeader()
        {
            var config = {
                headers:  {
                'Content-Type' : 'application/json;charset=utf-8',
                'Accept': 'application/json',
                }
            };
            return config;
        }
    });