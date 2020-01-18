
/*
=================================================================================
= ~Service    : mediaService
= ~Author     : Faraz pardazan CO
= ~License    : Faraz Pardazan
= ~Developer  : EH7AN
= ~Date       : 1396/06/12
=================================================================================
*/
angular.module('MetronicApp')
.service('mediaService', function ($http, $route, $location, $cookieStore, $q, Constants) {
    // GENERAL POST METHOD
    this.postMethod = function (data,url) {
        var deferred = $q.defer();
        var config = Constants.defaultHeader();
        var url = Constants.serverUrl + '/' + url;
        $http.post(url, data, config)
            .then(function (response) {
                deferred.resolve(response);
            }).catch(function (response) {
                deferred.reject(response);
            });
        return deferred.promise;
    };
    // GENERAL GET METHOD
    this.getMethod = function (data,url) {
        var deferred = $q.defer();
        var config = Constants.defaultHeader();
        config.params = data.params;
        var url = Constants.serverUrl + '/' + url;
        $http.get(url, config)
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
        var url = Constants.serverUrl + '/' + url;
        $http.delete(url, config)
            .then(function (response) {
                deferred.resolve(response);
            }).catch(function (response) {
                deferred.reject(response.status);
            });
        return deferred.promise;
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