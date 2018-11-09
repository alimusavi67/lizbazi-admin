/*
=================================================================================
= ~Controller : instructorController
= ~Author     : Petra
= ~License    : Petra
= ~Developer  : EH7AN
= ~Date       : 1397/08/01 
=================================================================================
*/

angular.module('MetronicApp').controller('DashboardController',
 function($rootScope, $scope, $http, $timeout, $cookies, $location,initService) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
       App.initAjax();
       var c = $location.$$url;
       UIIdleTimeout.init($location.$$url);
       $rootScope.loggedIn = true;
       $('.page-content').attr('style','');
    });
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
         UIIdleTimeout.destroy();
    })
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    // ======================= INITALIZ VARIABLES ====================
    //   getAllsuggestion();
    //   getAllmerchants();
    //   getAlloperators();
    //   getAllVersions();
    //==========================================================
    //=             Server Side Handler                        =
    //==========================================================
    // get all suggestions
    function getAllsuggestion()
    {
      var data = {};
      var url = 'suggestion/';
      $scope.sugCount = 0;

        initService.getMethod(data, url)
        .then(function (result) {
          if ( result.data.code === 0 ) {
            $scope.sugCount = result.data.content.length;
          }
        })
        .catch(function (error) {
            var msg = error.data.message;
            console.log(msg);
        });
    }
    // get all merchants
    function getAllmerchants()
    {
      var data = {};
      var url = 'merchant';
      $scope.merCount = 0;

        initService.getMethod(data, url)
        .then(function (result) {
          if ( result.data.code === 0 ) {
            $scope.merCount = result.data.content.length;
          }
        })
        .catch(function (error) {
            var msg = error.data.message;
            console.log(msg);
        });
    }
    // get all oprators
    function getAlloperators()
    {
      var data = {};
      var url = 'operator';
      $scope.oprCount = 0;

        initService.getMethod(data, url)
        .then(function (result) {
          if ( result.data.code === 0 ) {
            $scope.oprCount = result.data.content.operators.length;
          }
        })
        .catch(function (error) {
            var msg = error.data.message;
            console.log(msg);
        });
    }
    // get all versions
    function getAllVersions()
    {
      var data = {};
      var url = 'version';
      $scope.vCount = 0;

        initService.getMethod(data, url)
        .then(function (result) {
          if ( result.data.code === 0 ) {
            $scope.vCount = result.data.content.length;
          }
        })
        .catch(function (error) {
            var msg = error.data.message;
            console.log(msg);
        });
    }
});