/* Setup sign in controller */
angular.module('MetronicApp')
    .controller('loginController', 
        ['$rootScope', '$scope', '$timeout', '$location', 'settings', 'cookieService', '$state','$rootScope', '$cookies',
         function($rootScope, $scope, $timeout, $location, settings, cookieService, $state, $rootScope, $cookies) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
        normalCss();
        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;   
        $rootScope.loggedIn = false;// To hide side bar and header
    });
    // =========== BEGIN init values ===========
    $scope.username = '';
    $scope.password = '';
    $scope.remember = false;
    // ============ END init values ========
    $('.form-control').keypress(function(e){
        if(e.which == 13){//Enter key pressed
            e.preventDefault();
            var This = $(this);
            if ( This.hasClass('lockinput') ) {
                $scope.ulock();
                return;
            }
            $("#login-form").submit();
        }
    });
    // =============Login main function ==============
    $scope.login = function(user, pass) {

        var redirectPath = $location.search().path;
        var el = $('.mt-ladda-btn')[0];
        UIButtons.startSpin(el);
        cookieService.login(user, pass, $scope.remember)
        .then(function (response) {
            UIButtons.stopSpin(el);
            if (response.status === 200) {
                $rootScope.setCurrentUser(user);
                if (redirectPath) {
                    $location.url(redirectPath)
                }
                else {
                    $state.go('dashboard');
                }
            }
            else {
                UIButtons.stopSpin(el);
                $scope.loginMsg = response.data.message;
                $timeout(function(){
                    $scope.loginMsg = '';
                },2500);
            } 
        })
        .catch(function (error) {
            console.log(error)
            UIButtons.stopSpin(el);
            $scope.loginMsg = 'خطایی در شبکه رخ داده است لطفا ارتباط خود را بررسی نمایید';
            $timeout(function(){
                $scope.loginMsg = '';
            },6000);
            
        });
    };
    // =================== Validate login info ========================
    $( "#login-form" ).validate({
            rules: {
            'username' : {
              required: true
            },
            'password' : {
              required: true
            }
          },
          messages: {
            'username' : {
                required: "این فیلد نمی تواند خالی باشد"
            },
            'password' : {
                required: "این فیلد نمی تواند خالی باشد"
            }
          },
            errorPlacement: function(error, element) {
                error.insertAfter(element); // for other inputs, just perform default behavior
            },
            highlight: function(element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },
            unhighlight: function(element) { // revert the change done by hightlight
                $(element)
                    .closest('.form-group').removeClass('has-error'); // set error class to the control group
            },
            success: function(label) {
                label
                    .closest('.form-group').removeClass('has-error'); // set success class to the control group
            },
            submitHandler: function (form) { // for submit
                $scope.login($scope.username, $scope.password);  // for submit
            }
        }); 
    // =================== Validate login info ========================
        $scope.ulock = function() {
            $scope.login($rootScope.currentUser.username, $scope.password);  // for submit
        }
        // init background slide images
        $.backstretch([
            "../assets/pages/media/bg/a1.jpg",
            "../assets/pages/media/bg/a2.jpg",
            "../assets/pages/media/bg/a3.jpg",
            "../assets/pages/media/bg/a4.jpg",
            ], {
              fade: 1000,
              duration: 3000
            }
        );
        // ====================login normalize scripts
        function normalCss()
        {
            $('.page-container').css('background-color','transparent');
            $('.page-content').css('background-color','transparent');
            $('.page-content').css('margin-right','auto');
        }
}]);
