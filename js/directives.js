/***
GLobal Directives
***/

// Route State Load Spinner(used on page or content load)
MetronicApp.directive('ngSpinnerBar', ['$rootScope', '$state',
    function($rootScope, $state) {
        return {
            link: function(scope, element, attrs) {
                // by defult hide the spinner bar
                element.addClass('hide'); // hide spinner bar by default

                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$stateChangeStart', function() {
                    element.removeClass('hide'); // show spinner bar
                });

                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$stateChangeSuccess', function(event) {
                    element.addClass('hide'); // hide spinner bar
                    $('body').removeClass('page-on-load'); // remove page loading indicator
                    Layout.setAngularJsSidebarMenuActiveLink('match', null, event.currentScope.$state); // activate selected link in the sidebar menu
                   
                    // auto scorll to page top
                    setTimeout(function () {
                        App.scrollTop(); // scroll to the top on content load
                    }, $rootScope.settings.layout.pageAutoScrollOnLoad);     
                });

                // handle errors
                $rootScope.$on('$stateNotFound', function() {
                    element.addClass('hide'); // hide spinner bar
                });

                // handle errors
                $rootScope.$on('$stateChangeError', function() {
                    element.addClass('hide'); // hide spinner bar
                });
            }
        };
    }
])

// Handle global LINK click
MetronicApp.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function(e) {
                    e.preventDefault(); // prevent link click for above criteria
                });
            }
        }
    };
});

// Handle Dropdown Hover Plugin Integration
MetronicApp.directive('dropdownMenuHover', function () {
  return {
    link: function (scope, elem) {
      elem.dropdownHover();
    }
  };  
});
// ================= Make from time
MetronicApp.directive('fromTime', function () {
    return {
        restrict: 'E',
        scope: {
            userdate: '@',
        },
        templateUrl: 'templates/fromTimePicker.html',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            scope.$watch('userdate', function(newValue, oldValue) {
                if (newValue && typeof scope.userdate !== typeof undefined) {
                    if (scope.userdate !== "") {
                        var fromDate = parseInt(scope.userdate);
                        var fromTime = $('#from-time').val();
                        fromTime = fromTime.split(':')
                        var date = new Date(fromDate);
                        fromDate = date.setHours(fromTime[0],fromTime[1],0,0);
                        ngModelCtrl.$setViewValue(fromDate);
                        ngModelCtrl.$render();
                    }
                }
            }, true);
            $(document).on('change','#from-time',function(){
                if (typeof scope.userdate !== typeof undefined) {
                    if (scope.userdate !== "") {
                        var fromDate = parseInt(scope.userdate);
                        var fromTime = $('#from-time').val();
                        fromTime = fromTime.split(':')
                        var date = new Date(fromDate);
                        fromDate = date.setHours(fromTime[0],fromTime[1],0,0);
                        ngModelCtrl.$setViewValue(fromDate);
                        ngModelCtrl.$render();
                    }
                }
            })
        }
    }
});
// ================= Make to time
MetronicApp.directive('toTime', function () {
    return {
        restrict: 'E',
        scope: {
            userdate: '@',
        },
        templateUrl: 'templates/toTimePicker.html',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            scope.$watch('userdate', function(newValue, oldValue) {
                if (newValue && typeof scope.userdate !== typeof undefined) {
                    if (scope.userdate !== "") {
                        var fromDate = parseInt(scope.userdate);
                        var fromTime = $('#to-time').val();
                        fromTime = fromTime.split(':');
                        var date = new Date(fromDate);
                        fromDate = date.setHours(fromTime[0],fromTime[1],59,999);
                        ngModelCtrl.$setViewValue(fromDate);
                        ngModelCtrl.$render();
                    }
                }
            }, true);
            $(document).on('change','#to-time',function(){
                if (typeof scope.userdate !== typeof undefined) {
                    if (scope.userdate !== "") {
                        var fromDate = parseInt(scope.userdate);
                        var fromTime = $('#to-time').val();
                        fromTime = fromTime.split(':')
                        var date = new Date(fromDate);
                        fromDate = date.setHours(fromTime[0],fromTime[1],59,999);
                        ngModelCtrl.$setViewValue(fromDate);
                        ngModelCtrl.$render();
                    }
                }
            })
        }
    }
});