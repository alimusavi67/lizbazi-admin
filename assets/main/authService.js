angular.module('MetronicApp')
.service('authService', function ($http, $window, $route, $rootScope , $location, $cookieStore, $q, Constants) {
    // get all users
    this.postMethod = function (data,url) {
        var deferred = $q.defer();
        var url = Constants.serverUrl + '/' + url;
        $http.post(url,data)
            .then(function (response) {
                deferred.resolve(response);
            }).catch(function (response) {
                deferred.reject(response.status);
            });
        return deferred.promise;
    };
    // Handle requested urls 
    this.accessUrlControl = function(user)
    {
        if (!String.prototype.includes) {
             String.prototype.includes = function() {
                 'use strict';
                 return String.prototype.indexOf.apply(this, arguments) !== -1;
             };
        }
        var rquested_url = $location.$$url;
        var user_roles = user.role;
        if ( Constants.accessZone.hasOwnProperty(rquested_url) ) {
            var allowd_roles = Constants.accessZone[rquested_url].roles;
            if (!allowd_roles.includes(user_roles)) {
                $location.path('/404');
            }
        }      
    }
    // Check menus is accessable for current user or no
    this.setMenusAccessability = function(user) {
        debugger
        $rootScope.menuAccess = {};
        var accessList = Constants.accessZone;
        var user_roles = user.role;
        for(let key in accessList) {
            var allowd_roles = accessList[key].roles;
            var menu_name = accessList[key].menuName;
            if (allowd_roles.includes(user_roles)) {
                $rootScope.menuAccess[menu_name] = true;
            }
            else {
                $rootScope.menuAccess[menu_name] = false;
            }
        }
    }
 });