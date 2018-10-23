
/*
=================================================================================
= ~Service    : initService
= ~Author     : Faraz pardazan CO
= ~License    : Faraz Pardazan
= ~Developer  : EH7AN
= ~Date       : 1396/06/06
=================================================================================
*/
angular.module('MetronicApp')
.service('initService', function ($http, $route, $rootScope, $location, $cookies, $q, $state, Constants) {
    // GENERAL GET METHOD
    this.getMethod = function (data,url) {
        var deferred = $q.defer();
        var config = Constants.defaultHeader();
        data.params.token =  $cookies.get('token');
        config.params = data.params;
        var url = Constants.serverUrl + '/' + url;
        var That = this;
        $http.get(url, config)
            .then(function (response) {
                deferred.resolve(response);
            }).catch(function (response) {
                if (response.status == 401) {
                    That.logOutUser();
                }
                // deferred.reject(response);
            });
        return deferred.promise;
    };
    // GENERAL POST METHOD
    this.postMethod = function (data,url) {
        var deferred = $q.defer();
        var config = Constants.defaultHeader();
        var url = Constants.serverUrl + '/' + url;
        config.params = {};
        config.params.token = $cookies.get('token');
        $http.post(url, data, config)
            .then(function (response) {
                deferred.resolve(response);
            }).catch(function (response) {
                deferred.reject(response);
            });
        return deferred.promise;
    };
    // GENERAL PUT METHOD
    this.putMethod = function (data,url) {
        var deferred = $q.defer();
        var config = Constants.defaultHeader();
        var url = Constants.serverUrl + '/' + url;
        config.params = {};
        config.params.token = $cookies.get('token');
        $http.put(url, data, config)
            .then(function (response) {
                deferred.resolve(response);
            }).catch(function (response) {
                deferred.reject(response);
            });
        return deferred.promise;
    };
    // GENERAL DELETE METHOD
     this.deleteMethod = function (data,url) {
        var deferred = $q.defer();
        var config = Constants.defaultHeader();
        config.params = {};
        config.params.token = $cookies.get('token');
        var url = Constants.serverUrl + '/' + url;
        $http.delete(url, config)
            .then(function (response) {
                deferred.resolve(response);
            }).catch(function (response) {
                deferred.reject(response);
            });
        return deferred.promise;
    }
    // LOGOUT USER FROM DASHBOARD
    this.logOutUser = function(){
        $cookies.remove('token');
        UIToastr.init('warning', 'Token has expired');
        $state.reload();
    }
    this.uploader = function(fd, file, url, callback){
        var deferred = $q.defer();
        var header = Constants.defaultHeader();
        var url = Constants.serverUrl + '/' + url;

        $http.post(url, fd, {
            timeout: file.canceler.promise ,
            transformRequest: angular.identity,
            headers : { 'Content-Type': undefined,
                "X-Platform" : "Web",
                "X-Version" : "1.0",
                "X-BuildNo" : "1"}
        }).then(function (response) {
            deferred.resolve(response);
            callback(response);
        }).catch(function (response) {
            deferred.reject(response.status);
            callback(response.status);
        });
    }

 });