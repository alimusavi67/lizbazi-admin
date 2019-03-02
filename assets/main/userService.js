angular.module('MetronicApp')
.service('userService', function ($http, $route, $location, $cookieStore, $q, Constants) {
    // register a new user 
    this.register = function (data) {
        var deferred = $q.defer();
        var config = Constants.defaultHeader();
        var url = Constants.serverUrl + "/operator/register";
        $http.post(url, data, config)
            .then(function (response) {
                deferred.resolve(response);
            }).catch(function (response) {
                deferred.reject(response);
            });
        return deferred.promise;
    };
    // change user password
    this.changePassword = function (data) {
        var deferred = $q.defer();
        var config = Constants.defaultHeader();
        var url = Constants.serverUrl + "/operator/password";
        $http.post(url, data, config)
            .then(function (response) {
                deferred.resolve(response);
            }).catch(function (response) {
                deferred.reject(response);
            });
        return deferred.promise;
    };
    // update a new user 
    this.updateUser = function (data) {
        var deferred = $q.defer();
        $http.post(Constants.serverUrl + "/editUser", 
                  data)
            .then(function (response) {
                deferred.resolve(response);
            }).catch(function (response) {
                deferred.reject(response.status);
            });
        return deferred.promise;
    };
    // delete an user 
    this.deleteUser = function (data) {
        var deferred = $q.defer();
        $http.post(Constants.serverUrl + "/deleteUser", 
                  data)
            .then(function (response) {
                deferred.resolve(response);
            }).catch(function (response) {
                deferred.reject(response.status);
            });
        return deferred.promise;
    };
    // get all users
    this.showAllUsers = function (data) {

        var deferred = $q.defer();
        var url = Constants.serverUrl + "studentProfile";
        var config = Constants.defaultHeader();

        $http.get(url, config)
            .then(function (response) {
                deferred.resolve(response);
            }).catch(function (response) {
                deferred.reject(response.status);
            });
        return deferred.promise;
    };
    // get all branches
    this.getAllBranches = function (data) {
        var deferred = $q.defer();
        $http.get(Constants.serverUrl + "/markaz")
            .then(function (response) {
                deferred.resolve(response);
            }).catch(function (response) {
                deferred.reject(response.status);
            });
        return deferred.promise;
    };
    // get all roles
    this.getAllRoles = function (data) {
        var deferred = $q.defer();
        var config = Constants.defaultHeader();
        var url = Constants.serverUrl + "/baseInfo/operatorRoles";
        $http.get(url, config)
            .then(function (response) {
                deferred.resolve(response);
            }).catch(function (response) {
                deferred.reject(response.status);
            });
        return deferred.promise;
    };
    // get a user
    this.getUser = function (data) {
        var deferred = $q.defer();
        var url = Constants.serverUrl + "/operator/" + data.operatorUniqueId; 
        var config = Constants.defaultHeader();
        $http.get(url, config)
            .then(function (response) {
                deferred.resolve(response);
            }).catch(function (response) {
                deferred.reject(response);
            });
        return deferred.promise;
    }; 
    // activate users
    this.activateUser = function (data) {
        var deferred = $q.defer();
        $http.post(Constants.serverUrl + "/activateUser", 
                  data)
            .then(function (response) {
                deferred.resolve(response);
            }).catch(function (response) {
                deferred.reject(response.status);
            });
        return deferred.promise;
    };
    // deactivate users
    this.deactivate = function (data) {
        var deferred = $q.defer();
        $http.post(Constants.serverUrl + "/deactivateUser", 
                  data)
            .then(function (response) {
                deferred.resolve(response);
            }).catch(function (response) {
                deferred.reject(response.status);
            });
        return deferred.promise;
    };
 });