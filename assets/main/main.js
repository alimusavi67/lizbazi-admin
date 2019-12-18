
/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    "ngCookies",
    "ngRoute",
]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: '../assets',
        globalPath: '../assets/global',
        layoutPath: '../assets/layouts/layout2',
    };

    $rootScope.settings = settings;

    return settings;
}]);

/* Setup App Main Controller */
MetronicApp.controller('AppController',
 ['$scope', '$rootScope','cookieService', 'userService',
 function($scope, $rootScope, cookieService, userService) {
        $rootScope.currentUser = false;

        $rootScope.logUserOut = function () {
            $rootScope.currentUser = null;
            cookieService.logout();
        };

        $rootScope.setCurrentUser = function (user) {
            $rootScope.currentUser = user;
        };
    $scope.$on('$viewContentLoaded', function() {
        //App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive
    });
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$state', '$scope', function($state, $scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar($state); // init sidebar
    });
}]);

/* Setup Layout Part - Quick Sidebar */
MetronicApp.controller('QuickSidebarController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
       setTimeout(function(){
            QuickSidebar.init(); // init quick sidebar
        }, 2000)
    });
}]);

/* Setup Layout Part - Theme Panel */
MetronicApp.controller('ThemePanelController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);
/* Setup Constants */
MetronicApp.constant('Constants', {
    serverUrl: "/api",
    cookieName: "userInfo",
    contentType: "application/json",
    version: "1.0",
    mediaUrl: function(id) {
        if (!id) {
            return false;
        }
         var url = this.serverUrl + '/media/' + id + '/file?preview=true';
         return url;
    },
    defaultHeader:function()
    {
        var config = {
            headers:  {
                'Content-Type' : 'application/json;charset=utf-8',
                'Accept': 'application/json',
                "X-Platform" : "Web",
                "X-Version" : "1.0",
                "X-BuildNo" : "1"
            }
        };
        return config;
    },
    tableTranslations: {
        "sEmptyTable":     "هیچ داده ای در جدول وجود ندارد",
        "sInfo":           "نمایش _START_ تا _END_ از _TOTAL_ رکورد",
        "sInfoEmpty":      "نمایش 0 تا 0 از 0 رکورد",
        "sInfoFiltered":   "(فیلتر شده از _MAX_ رکورد)",
        "sInfoPostFix":    "",
        "sInfoThousands":  ",",
        "sLengthMenu":     "نمایش _MENU_ رکورد",
        "sLoadingRecords": "در حال بارگزاری...",
        "sProcessing":     "در حال پردازش...",
        "sSearch":         "جستجو:",
        "sZeroRecords":    "رکوردی با این مشخصات پیدا نشد",
        "oPaginate": {
            "sFirst":    "ابتدا",
            "sLast":     "انتها",
            "sNext":     "بعدی",
            "sPrevious": "قبلی",
            "page": "صفحه",
            "pageOf": "از"
        },
        "oAria": {
            "sSortAscending":  ": فعال سازی نمایش به صورت صعودی",
            "sSortDescending": ": فعال سازی نمایش به صورت نزولی"
        }
    },
    accessZone: {
        '/login' : {
            menuName : 'login',
            url : '/login',
            roles: 'Admin'
        },
        // =================== Resorts
        '/resorts/all' : {
            menuName : 'showresorts',
            url : '/login',
            roles: 'Admin'
        },
        '/resort/register' : {
            menuName : 'newresort',
            url : '/resort/register',
            roles: 'Admin'
        },
        '/resort/:resortId/edit' : {
            menuName : 'editresort',
            url : '/resort/:resortId/edit',
            roles: 'Admin'
        },
        // =================== Resort Features
        '/resort/:resortId/feature' : {
            menuName : 'showresortsfeature',
            url : '/resort/:resortId/feature',
            roles: 'Admin'
        },
        '/resort/:resortId/feature/register' : {
            menuName : 'newresortfeature',
            url : '/resort/:resortId/feature/register',
            roles: 'Admin'
        },
        '/resort/:resortId/feature/:featureId/edit' : {
            menuName : 'editresortfeature',
            url : '/resort/:resortId/edit',
            roles: 'Admin'
        },
        // =================== Show all learning videos
        '/videos/all' : {
            menuName : 'showvideos',
            url : '/videos/all',
            roles: 'Admin'
        },
        '/video/register' : {
            menuName : 'newvideo',
            url : '/video/register',
            roles: 'Admin'
        },
        '/video/:videoId' : {
            menuName : 'editvideo',
            url : '/video/:videoId',
            roles: 'Admin'
        },
        // =================== allCountries
        '/country/all' : {
            menuName : 'allCountries',
            url : '/country/all',
            roles: 'Admin'
        },
        '/country/new' : {
            menuName : 'storeCountry',
            url : '/country/new',
            roles: 'Admin'
        },
        '/country/:countryId/edit' : {
            menuName : 'editCountry',
            url : '/country/:countryId/edit',
            roles: 'Admin'
        },
        // =================== Show all instructor
        '/instructor/all' : {
            menuName : 'allInstructor',
            url : '/instructor/all',
            roles: 'Admin'
        },
        '/instructor/new' : {
            menuName : 'storeInstructor',
            url : '/instructor/new',
            roles: 'Admin'
        },
        '/instructor/:instructorId/edit' : {
            menuName : 'editInstructor',
            url : '/instructor/:instructorId/edit',
            roles: 'Admin'
        },
        // =================== Show all instructor
        '/users/all' : {
            menuName : 'allUsers',
            url : '/users/all',
            roles: 'Admin'
        },
        // =================== Show all version
        '/version/all' : {
            menuName : 'allVersions',
            url : '/version/all',
            roles: 'Admin'
        },
        '/version/new' : {
            menuName : 'storeVersion',
            url : '/version/new',
            roles: 'Admin'
        },
        '/version/:versionId/edit' : {
            menuName : 'editVersion',
            url : '/version/:versionId/edit',
            roles: 'Admin'
        },
        // =================== Show all version
        '/notification/all' : {
            menuName : 'notification',
            url : '/notification/all',
            roles: 'Admin'
        },
        '/notification/insert' : {
            menuName : 'newnotif',
            url : '/notification/insert',
            roles: 'Admin'
        },
        // =================== Show all version
        '/comments/:mediaType' : {
            menuName : 'showComments',
            url : '/comments/:mediaType',
            roles: 'Admin'
        },
        // =================== Agenda Resorts
        '/agenda/resorts' : {
            menuName: 'agendaResorts',
            url : '/agenda/resorts',
            roles: 'Admin,Agent'

        }
    }
});
/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/dashboard");

    $stateProvider

        // Dashboard
        .state('dashboard', {
            url: "/dashboard",
            templateUrl: "views/dashboard.html",
            data: {pageTitle: 'داشبورد'},
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',


                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',
                            '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/pages/scripts/dashboard.min.js',
                            '../assets/main/controll/DashboardController.js',
                        ]
                    });
                }]
            }
        })
        // Login Page
        .state('login', {
            url: "/login",
            templateUrl: "views/login/login.html",
            data: {pageTitle: 'ورود'},
            controller: "loginController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            '../assets/pages/css/login-4-rtl.css',

                            '../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            '../assets/global/plugins/backstretch/jquery.backstretch.min.js',
                            '../assets/pages/scripts/ui-buttons.js',

                            '../assets/main/controll/loginController.js',
                        ]
                    });
                }]
            }
        })
        // User lock Page
        .state('lockscreen', {
            url: "/lockscreen",
            templateUrl: "views/login/user_lock.html",
            data: {pageTitle: 'ورود به پنل'},
            controller: "loginController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            '../assets/pages/css/lock-2-rtl.min.css',

                            '../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            '../assets/global/plugins/backstretch/jquery.backstretch.min.js',
                            '../assets/pages/scripts/ui-buttons.js',

                            '../assets/main/controll/loginController.js',
                        ]
                    });
                }]
            }
        })
        // Show all students
        .state('showresorts', {
            url: "/resorts/all",
            templateUrl: "views/resorts/show_resorts.html",
            data: {
                pageTitle: 'پیست ها'
            },
            controller: "resortController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            '../assets/global/plugins/bootstrap-toastr/toastr-rtl.min.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            '../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            '../assets/pages/scripts/components-select2.min.js',
                            '../assets/global/plugins/bootstrap-confirmation/bootstrap-confirmation.js',
                            '../assets/pages/scripts/ui-confirmations.js',
                            '../assets/global/plugins/bootstrap-toastr/toastr.min.js',
                            '../assets/pages/scripts/ui-toastr.js',


                            '../assets/main/controll/resortController.js?1505'
                        ]
                    });
                }]
            }
        })
        // Register new resort
        .state('newresort', {
            url: "/resort/register",
            templateUrl: "views/resorts/register_resort.html",
            data: {
                pageTitle: 'ثبت پیست'
            },
            controller: "resortController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [

                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            '../assets/global/plugins/bootstrap-toastr/toastr-rtl.min.css',
                            '../assets/global/plugins/persian-datepicker/css/persian-datepicker-0.4.5.min.css',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',

                            '../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            '../assets/pages/scripts/components-select2.min.js',
                            '../assets/global/plugins/bootstrap-toastr/toastr.min.js',
                            '../assets/global/plugins/persian-datepicker/js/persian-date.js',
                            '../assets/global/plugins/persian-datepicker/js/persian-datepicker-0.4.5.min.js',
                            '../assets/pages/scripts/ui-toastr.js',
                            '../assets/pages/scripts/ui-buttons.js',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            '../assets/main/controll/resortController.js?1505'
                        ]
                    });
                }]
            }
        })
        // Edit resort
        .state('editresort', {
            url: "/resort/:resortId/edit",
            templateUrl: "views/resorts/register_resort.html",
            data: {
                pageTitle: 'ویرایش پیست'
            },
            controller: "resortController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [

                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            '../assets/global/plugins/bootstrap-toastr/toastr-rtl.min.css',
                            '../assets/global/plugins/persian-datepicker/css/persian-datepicker-0.4.5.min.css',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',

                            '../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            '../assets/pages/scripts/components-select2.min.js',
                            '../assets/global/plugins/bootstrap-toastr/toastr.min.js',
                            '../assets/global/plugins/persian-datepicker/js/persian-date.js',
                            '../assets/global/plugins/persian-datepicker/js/persian-datepicker-0.4.5.min.js',
                            '../assets/pages/scripts/ui-toastr.js',
                            '../assets/pages/scripts/ui-buttons.js',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            '../assets/main/controll/resortController.js?1505'
                        ]
                    });
                }]
            }
        })

        // Show all resort feature
        .state('showresortsfeature', {
            url: "/resort/:resortId/feature",
            templateUrl: "views/resorts/show_resorts_feature.html",
            data: {
                pageTitle: 'ویژگی پیست '
            },
            controller: "resortFeatureController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            '../assets/global/plugins/bootstrap-toastr/toastr-rtl.min.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            '../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            '../assets/pages/scripts/components-select2.min.js',
                            '../assets/global/plugins/bootstrap-confirmation/bootstrap-confirmation.js',
                            '../assets/pages/scripts/ui-confirmations.js',
                            '../assets/global/plugins/bootstrap-toastr/toastr.min.js',
                            '../assets/pages/scripts/ui-toastr.js',


                            '../assets/main/controll/resortFeatureController.js'
                        ]
                    });
                }]
            }
        })
        // Register new resort feature
        .state('newresortfeature', {
            url: "/resort/:resortId/feature/register",
            templateUrl: "views/resorts/register_resort_feature.html",
            data: {
                pageTitle: 'ثبت ویژگی پیست'
            },
            controller: "resortFeatureController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [

                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            '../assets/global/plugins/bootstrap-toastr/toastr-rtl.min.css',
                            '../assets/global/plugins/persian-datepicker/css/persian-datepicker-0.4.5.min.css',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',

                            '../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            '../assets/pages/scripts/components-select2.min.js',
                            '../assets/global/plugins/bootstrap-toastr/toastr.min.js',
                            '../assets/global/plugins/persian-datepicker/js/persian-date.js',
                            '../assets/global/plugins/persian-datepicker/js/persian-datepicker-0.4.5.min.js',
                            '../assets/pages/scripts/ui-toastr.js',
                            '../assets/pages/scripts/ui-confirmations.js',
                            '../assets/pages/scripts/ui-buttons.js',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            '../assets/main/controll/resortFeatureController.js'
                        ]
                    });
                }]
            }
        })
        // edit feature
        .state('editresortfeature', {
            url: "/resort/:resortId/feature/:featureId/edit",
            templateUrl: "views/resorts/register_resort_feature.html",
            data: {
                pageTitle: 'ویرایش ویژگی پیست'
            },
            controller: "resortFeatureController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [

                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            '../assets/global/plugins/bootstrap-toastr/toastr-rtl.min.css',
                            '../assets/global/plugins/persian-datepicker/css/persian-datepicker-0.4.5.min.css',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',

                            '../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            '../assets/pages/scripts/components-select2.min.js',
                            '../assets/global/plugins/bootstrap-toastr/toastr.min.js',
                            '../assets/global/plugins/persian-datepicker/js/persian-date.js',
                            '../assets/global/plugins/persian-datepicker/js/persian-datepicker-0.4.5.min.js',
                            '../assets/pages/scripts/ui-toastr.js',
                            '../assets/pages/scripts/ui-buttons.js',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            '../assets/main/controll/resortFeatureController.js'
                        ]
                    });
                }]
            }
        })
        // Show all learning videos
        .state('showvideos', {
            url: "/videos/all",
            templateUrl: "views/learning-video/show_videos.html",
            data: {
                pageTitle: 'ویدیو ها'
            },
            controller: "learningVideoController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            '../assets/global/plugins/bootstrap-toastr/toastr-rtl.min.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            '../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            '../assets/pages/scripts/components-select2.min.js',
                            '../assets/global/plugins/bootstrap-confirmation/bootstrap-confirmation.js',
                            '../assets/pages/scripts/ui-confirmations.js',
                            '../assets/global/plugins/bootstrap-toastr/toastr.min.js',
                            '../assets/pages/scripts/ui-toastr.js',


                            '../assets/main/controll/learningVideoController.js?1501'
                        ]
                    });
                }]
            }
        })
        // Register new video
        .state('newvideo', {
            url: "/video/register",
            templateUrl: "views/learning-video/register_video.html",
            data: {
                pageTitle: 'ثبت ویدیو'
            },
            controller: "learningVideoController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [

                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            '../assets/global/plugins/bootstrap-toastr/toastr-rtl.min.css',
                            '../assets/global/plugins/persian-datepicker/css/persian-datepicker-0.4.5.min.css',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',

                            '../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            '../assets/pages/scripts/components-select2.min.js',
                            '../assets/global/plugins/bootstrap-toastr/toastr.min.js',
                            '../assets/global/plugins/persian-datepicker/js/persian-date.js',
                            '../assets/global/plugins/persian-datepicker/js/persian-datepicker-0.4.5.min.js',
                            '../assets/pages/scripts/ui-toastr.js',
                            '../assets/pages/scripts/ui-buttons.js',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            '../assets/main/controll/learningVideoController.js?1501'
                        ]
                    });
                }]
            }
        })
        // edit new video
        .state('editvideo', {
            url: "/video/:videoId",
            templateUrl: "views/learning-video/register_video.html",
            data: {
                pageTitle: 'ویرایش ویدیو'
            },
            controller: "learningVideoController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [

                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            '../assets/global/plugins/bootstrap-toastr/toastr-rtl.min.css',
                            '../assets/global/plugins/persian-datepicker/css/persian-datepicker-0.4.5.min.css',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',

                            '../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            '../assets/pages/scripts/components-select2.min.js',
                            '../assets/global/plugins/bootstrap-toastr/toastr.min.js',
                            '../assets/global/plugins/persian-datepicker/js/persian-date.js',
                            '../assets/global/plugins/persian-datepicker/js/persian-datepicker-0.4.5.min.js',
                            '../assets/pages/scripts/ui-toastr.js',
                            '../assets/pages/scripts/ui-buttons.js',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            '../assets/main/controll/learningVideoController.js?1501'
                        ]
                    });
                }]
            }
        })
        // Show all Countries
        .state('allCountries', {
            url: "/country/all",
            templateUrl: "views/countries/coutires_all.html",
            data: {
                pageTitle: 'کشور ها'
            },
            controller: "countryController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            '../assets/global/plugins/bootstrap-toastr/toastr-rtl.min.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            '../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            '../assets/pages/scripts/components-select2.min.js',
                            '../assets/global/plugins/bootstrap-confirmation/bootstrap-confirmation.js',
                            '../assets/pages/scripts/ui-confirmations.js',
                            '../assets/global/plugins/bootstrap-toastr/toastr.min.js',
                            '../assets/pages/scripts/ui-toastr.js',
                            '../assets/pages/scripts/ui-buttons.js',


                            '../assets/main/controll/countryController.js'
                        ]
                    });
                }]
            }
        })
        // Store new Country
        .state('storeCountry', {
            url: "/country/new",
            templateUrl: "views/countries/new_country.html",
            data: {
                pageTitle: 'ثبت کشور'
            },
            controller: "countryController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            '../assets/global/plugins/bootstrap-toastr/toastr-rtl.min.css',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            '../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            '../assets/pages/scripts/components-select2.min.js',
                            '../assets/global/plugins/bootstrap-confirmation/bootstrap-confirmation.js',
                            '../assets/pages/scripts/ui-confirmations.js',
                            '../assets/global/plugins/bootstrap-toastr/toastr.min.js',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            '../assets/pages/scripts/ui-toastr.js',
                            '../assets/pages/scripts/ui-buttons.js',

                            '../assets/main/controll/countryController.js'
                        ]
                    });
                }]
            }
        })
        // edit Country
        .state('editCountry', {
            url: "/country/:countryId/edit",
            templateUrl: "views/countries/new_country.html",
            data: {
                pageTitle: 'ویرایش کشور'
            },
            controller: "countryController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            '../assets/global/plugins/bootstrap-toastr/toastr-rtl.min.css',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            '../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            '../assets/pages/scripts/components-select2.min.js',
                            '../assets/global/plugins/bootstrap-confirmation/bootstrap-confirmation.js',
                            '../assets/pages/scripts/ui-confirmations.js',
                            '../assets/global/plugins/bootstrap-toastr/toastr.min.js',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            '../assets/pages/scripts/ui-toastr.js',
                            '../assets/pages/scripts/ui-buttons.js',

                            '../assets/main/controll/countryController.js'
                        ]
                    });
                }]
            }
        })
        // Show all instructor
        .state('allInstructor', {
            url: "/instructor/all",
            templateUrl: "views/instructor/instructor_all.html",
            data: {
                pageTitle: 'مربیان'
            },
            controller: "instructorController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            '../assets/global/plugins/bootstrap-toastr/toastr-rtl.min.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            '../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            '../assets/pages/scripts/components-select2.min.js',
                            '../assets/global/plugins/bootstrap-confirmation/bootstrap-confirmation.js',
                            '../assets/pages/scripts/ui-confirmations.js',
                            '../assets/global/plugins/bootstrap-toastr/toastr.min.js',
                            '../assets/pages/scripts/ui-toastr.js',


                            '../assets/main/controll/instructorController.js'
                        ]
                    });
                }]
            }
        })
        // Store new instructor
        .state('storeInstructor', {
            url: "/instructor/new",
            templateUrl: "views/instructor/new_instructor.html",
            data: {
                pageTitle: 'ثبت مربی'
            },
            controller: "instructorController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            '../assets/global/plugins/bootstrap-toastr/toastr-rtl.min.css',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            '../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            '../assets/pages/scripts/components-select2.min.js',
                            '../assets/global/plugins/bootstrap-confirmation/bootstrap-confirmation.js',
                            '../assets/pages/scripts/ui-confirmations.js',
                            '../assets/global/plugins/bootstrap-toastr/toastr.min.js',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            '../assets/pages/scripts/ui-toastr.js',
                            '../assets/pages/scripts/ui-buttons.js',


                            '../assets/main/controll/instructorController.js'
                        ]
                    });
                }]
            }
        })
        // Edit new instructor
        .state('editInstructor', {
            url: "/instructor/:instructorId/edit",
            templateUrl: "views/instructor/new_instructor.html",
            data: {
                pageTitle: 'ویرایش مربی'
            },
            controller: "instructorController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            '../assets/global/plugins/bootstrap-toastr/toastr-rtl.min.css',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            '../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            '../assets/pages/scripts/components-select2.min.js',
                            '../assets/global/plugins/bootstrap-confirmation/bootstrap-confirmation.js',
                            '../assets/pages/scripts/ui-confirmations.js',
                            '../assets/global/plugins/bootstrap-toastr/toastr.min.js',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            '../assets/pages/scripts/ui-toastr.js',
                            '../assets/pages/scripts/ui-buttons.js',


                            '../assets/main/controll/instructorController.js'
                        ]
                    });
                }]
            }
        })
        // Show All Users
        .state('allUsers', {
            url: "/users/all",
            templateUrl: "views/app-users/user_all.html",
            data: {
                pageTitle: 'همه کاربران'
            },
            controller: "appUsersController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            '../assets/global/plugins/bootstrap-toastr/toastr-rtl.min.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            '../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            '../assets/pages/scripts/components-select2.min.js',
                            '../assets/global/plugins/bootstrap-confirmation/bootstrap-confirmation.js',
                            '../assets/pages/scripts/ui-confirmations.js',
                            '../assets/global/plugins/bootstrap-toastr/toastr.min.js',
                            '../assets/global/plugins/persian-datepicker/js/persian-date.js',
                            '../assets/global/plugins/persian-datepicker/js/persian-datepicker-0.4.5.min.js',
                            '../assets/pages/scripts/ui-toastr.js',
                            '../assets/pages/scripts/ui-buttons.js',


                            '../assets/main/controll/appUsersController.js?1509'
                        ]
                    });
                }]
            }
        })
        // Show all versions
        .state('allVersions', {
            url: "/version/all",
            templateUrl: "views/versions/version_all.html",
            data: {
                pageTitle: 'نسخه ها'
            },
            controller: "versionController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            '../assets/global/plugins/bootstrap-toastr/toastr-rtl.min.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            '../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            '../assets/pages/scripts/components-select2.min.js',
                            '../assets/global/plugins/bootstrap-confirmation/bootstrap-confirmation.js',
                            '../assets/pages/scripts/ui-confirmations.js',
                            '../assets/global/plugins/bootstrap-toastr/toastr.min.js',
                            '../assets/global/plugins/persian-datepicker/js/persian-date.js',
                            '../assets/global/plugins/persian-datepicker/js/persian-datepicker-0.4.5.min.js',
                            '../assets/pages/scripts/ui-toastr.js',
                            '../assets/pages/scripts/ui-buttons.js',


                            '../assets/main/controll/versionController.js'
                        ]
                    });
                }]
            }
        })
        // Store new version
        .state('storeVersion', {
            url: "/version/new",
            templateUrl: "views/versions/new_version.html",
            data: {
                pageTitle: 'ثبت نسخه'
            },
            controller: "versionController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            '../assets/global/plugins/bootstrap-toastr/toastr-rtl.min.css',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            '../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            '../assets/pages/scripts/components-select2.min.js',
                            '../assets/global/plugins/bootstrap-confirmation/bootstrap-confirmation.js',
                            '../assets/pages/scripts/ui-confirmations.js',
                            '../assets/global/plugins/bootstrap-toastr/toastr.min.js',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            '../assets/pages/scripts/ui-toastr.js',
                            '../assets/pages/scripts/ui-buttons.js',

                            '../assets/main/controll/versionController.js'
                        ]
                    });
                }]
            }
        })
        // Store new version
        .state('editVersion', {
            url: "/version/:versionId/edit",
            templateUrl: "views/versions/new_version.html",
            data: {
                pageTitle: 'ویرایش نسخه'
            },
            controller: "versionController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            '../assets/global/plugins/bootstrap-toastr/toastr-rtl.min.css',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            '../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            '../assets/pages/scripts/components-select2.min.js',
                            '../assets/global/plugins/bootstrap-confirmation/bootstrap-confirmation.js',
                            '../assets/pages/scripts/ui-confirmations.js',
                            '../assets/global/plugins/bootstrap-toastr/toastr.min.js',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            '../assets/global/plugins/persian-datepicker/js/persian-date.js',
                            '../assets/global/plugins/persian-datepicker/js/persian-datepicker-0.4.5.min.js',
                            '../assets/pages/scripts/ui-toastr.js',
                            '../assets/pages/scripts/ui-buttons.js',

                            '../assets/main/controll/versionController.js'
                        ]
                    });
                }]
            }
        })
        // Show all attendance
        .state('notification', {
            url: "/notification/all",
            templateUrl: "views/notification/notification.html",
            data: {
                pageTitle: ' حضور و غیاب'
            },
            controller: "notificationController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            '../assets/global/plugins/bootstrap-toastr/toastr-rtl.min.css',
                            '../assets/global/plugins/persian-datepicker/css/persian-datepicker-0.4.5.min.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            '../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            '../assets/pages/scripts/components-select2.min.js',
                            '../assets/global/plugins/bootstrap-confirmation/bootstrap-confirmation.js',
                            '../assets/pages/scripts/ui-confirmations.js',
                            '../assets/global/plugins/bootstrap-toastr/toastr.min.js',
                            '../assets/global/plugins/persian-datepicker/js/persian-date.js',
                            '../assets/global/plugins/persian-datepicker/js/persian-datepicker-0.4.5.min.js',
                            '../assets/pages/scripts/ui-toastr.js',


                            '../assets/main/controll/notificationController.js'
                        ]
                    });
                }]
            }
        })
        // Register new notif
        .state('newnotif', {
            url: "/notification/insert",
            templateUrl: "views/notification/register_notification.html",
            data: {
                pageTitle: 'ثبت پیام'
            },
            controller: "notificationController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [

                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            '../assets/global/plugins/bootstrap-toastr/toastr-rtl.min.css',
                            '../assets/global/plugins/persian-datepicker/css/persian-datepicker-0.4.5.min.css',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',

                            '../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            '../assets/pages/scripts/components-select2.min.js',
                            '../assets/global/plugins/bootstrap-toastr/toastr.min.js',
                            '../assets/global/plugins/persian-datepicker/js/persian-date.js',
                            '../assets/global/plugins/persian-datepicker/js/persian-datepicker-0.4.5.min.js',
                            '../assets/pages/scripts/ui-toastr.js',
                            '../assets/pages/scripts/ui-buttons.js',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            '../assets/main/controll/notificationController.js'
                        ]
                    });
                }]
            }
        })
        // Show Comments
        .state('showComments', {
            url: "/comments/:mediaType",
            templateUrl: "views/comments/comments_all.html",
            data: {
                pageTitle: 'کامنت ها'
            },
            controller: "commentController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            '../assets/global/plugins/bootstrap-toastr/toastr-rtl.min.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            '../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            '../assets/pages/scripts/components-select2.min.js',
                            '../assets/global/plugins/bootstrap-confirmation/bootstrap-confirmation.js',
                            '../assets/global/plugins/persian-datepicker/js/persian-date.js',
                            '../assets/global/plugins/persian-datepicker/js/persian-datepicker-0.4.5.min.js',
                            '../assets/pages/scripts/ui-confirmations.js',
                            '../assets/global/plugins/bootstrap-toastr/toastr.min.js',
                            '../assets/pages/scripts/ui-toastr.js',


                            '../assets/main/controll/commentController.js?1506'
                        ]
                    });
                }]
            }
        })
        // 
        // Show all students
        .state('agendaResorts', {
            url: "/agenda/resorts",
            templateUrl: "views/agenda/show_resorts.html",
            data: {
                pageTitle: 'پیست ها'
            },
            controller: "agendaResortController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            '../assets/global/plugins/bootstrap-toastr/toastr-rtl.min.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            '../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            '../assets/pages/scripts/components-select2.min.js',
                            '../assets/global/plugins/bootstrap-confirmation/bootstrap-confirmation.js',
                            '../assets/pages/scripts/ui-confirmations.js',
                            '../assets/global/plugins/bootstrap-toastr/toastr.min.js',
                            '../assets/pages/scripts/ui-toastr.js',


                            '../assets/main/controll/agenda/agendaResortController.js?1506'
                        ]
                    });
                }]
            }
        })

}]);
/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "authService","settings", "$state",'$timeout', 'cookieService', 'userService',
 function($rootScope, authService, settings, $state, $timeout, cookieService, userService) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
        var user = cookieService.validateSession();
        if (!user) {
            if (toState.name != 'login') {
                event.preventDefault();
                $state.go('login');
                $timeout(function() { $('.page-spinner-bar').addClass('hide');}, 100);
            }
        } else {
            if (toState.name != 'dashboard')
                $rootScope.loggedIn = true;
                $rootScope.setCurrentUser(user);
                authService.accessUrlControl(user);
                authService.setMenusAccessability(user);
        }
    })
}]);
