/*
=================================================================================
= ~Controller : instructorController
= ~Author     : Petra
= ~License    : Petra
= ~Developer  : EH7AN
= ~Date       : 1397/08/01 
=================================================================================
*/

angular.module('MetronicApp')
.controller('usersController',
	['$timeout','$rootScope','$location','$stateParams', '$state', '$window', '$scope','$cookieStore', '$timeout','settings','userService','$state','Constants','$interval',
 function($timeout,$rootScope,$location,$stateParams, $state, $window,  $scope,$cookieStore, $timeout, settings,userService,$state,Constants,$interval) {    
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        ComponentsSelect2.init();
        $('.page-content').attr('style','');
        UIIdleTimeout.init($location.$$url);
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
         UIIdleTimeout.destroy();
        })
        // ================Init process========================
        var token = $cookieStore.get(Constants.cookieName).token;
        var mode = 'create';
        $scope.NewUser = {};
        $scope.usersList = [];
        $scope.NewUser.role = [];
        $scope.userRoles = [];
        $scope.userPass = {};
        if ($stateParams.userId) { // If user id is set so Mode is update
            var userId = $stateParams.userId;
            mode = 'update';
            getUser();
        }
        if ($location.$$url == '/users/all') {
        	getAllUsers();
        }
        getAllRoles();
        // =============== Register a new user ================
        $scope.registerUser = function(event) {
            handleValidation();
        	$('#insertUserForm').submit();
        }
        $scope.submitUserForm = function() {
            // create a new user when mode is `create`
            var el = $('.mt-ladda-btn')[0];
            UIButtons.startSpin(el);

            if (mode == 'create') {
                if ($scope.NewUser.password != $scope.NewUser.repass) {
                    var msg = 'کلمات عبور یکسان نمی باشند لطفا بررسی نمایید';
                    UIToastr.init('warning', msg);
                    return
                    // warning,success,error,info
                }
                delete $scope.NewUser.repass;
                userService.register($scope.NewUser)
                .then(function (resault) {
                    UIButtons.stopSpin(el);
                    if ( resault.data.code === 0 ) {
                        var msg = 'عملیات با موفقیت انجام شد';
                        UIToastr.init('success', msg);
                        $scope.NewUser = {};
                    }
                    else {
                        var msg = resault.data.message;
                        UIToastr.init('info', msg);
                        $scope.NewUser = {};
                    }
                    
                })
                .catch(function (error) {
                    UIButtons.stopSpin(el);
                    var msg = error.data.message;
                    UIToastr.init('warning', msg);
                });
            }
            // Update user when mode changes to `update`
            else if (mode == 'update') {
                delete $scope.NewUser.active;
                delete $scope.NewUser.id;
                if ($scope.NewUser.password != $scope.NewUser.repass) {
                    $scope.registerLog = 'کلمات عبور یکسان نمی باشند لطفا بررسی نمایید';
                    $('#register-response').modal('show');
                    return
                }
                delete $scope.NewUser.repass;
                delete $scope.NewUser.username;
                
                $scope.NewUser.userId = userId;
                userService.updateUser($scope.NewUser)
                .then(function (resault) {
                    $scope.registerLog = checkStatus(resault.status);
                    $('#register-response').modal('show');
                    $('#register-response').on('hidden.bs.modal', function() {
                        $state.reload();
                    });
                })
                .catch(function (error) {
                    $scope.registerLog = checkStatus(error);
                    $('#register-response').modal('show');
                });
            }
        }
        // =============== Show all users ================
        function getAllUsers()
        {
     		var	data = {};

        	userService.showAllUsers(data)
	        .then(function (resault) {
	            $scope.usersList = resault.data.content.operators;
                
	            $timeout(function(){
                    initTable();
	      			toolTipHandler();
                    UIConfirmations.init();
	            },100);
	        })
	        .catch(function (error) {
	           
	        });
        }
        // =============== Get a user ================
        function getUser()
        {
            var data = {};
            data.operatorUniqueId = userId;
            userService.getUser(data)
            .then(function (result) {
                var response = result.data.content;
                $scope.NewUser = response;
                $scope.NewUser.roleId = response.operatorRole.id;
                $timeout(function(){
                          ComponentsSelect2.init();   
                }, 50);
                // Put inputs on edit mode
                $('.form-group .form-control').addClass('edited');
            })
            .catch(function (error) {
                
            });
        }
        // =================== Get All branches ============
        function getAllBranches()
        {

            userService.getAllBranches()
            .then(function (resault) {
                $scope.brancheList = resault.data.data;
                if ($scope.brancheList) {
                    if (mode=='create') {
                   
                    }
                    else if (mode=='update') {
                        for (var i = $scope.brancheList.length - 1; i >= 0; i--) {
                            if ($scope.brancheList[i].id == $scope.NewUser.markazId) {
                                $scope.brancheList.selected = $scope.brancheList[i].id;
                            }
                        }
                    }
                }
                $timeout(function(){
                    $('.bs-select').selectpicker('refresh');
                },500)
            })
            .catch(function (error) {
                  
            });
        }
        // =================== Get All Roles ============
        function getAllRoles()
        {
            userService.getAllRoles()
            .then(function (resault) {
                $scope.userRoles = resault.data.content;
            })
            .catch(function (error) {
                  
            });
        }
        // =================== Activate user ================
        $scope.activateUser = function(user,event) {
            var data = {};
            if (user.id ==  $rootScope.currentUser.id) {
                alert('شما مجاز به انجام این کار نمی باشید.');
                return;
            }
            data.token = token;
            data.userId = user.id;
            var target = $(event.target);
             if ( target.hasClass('fa-check-circle-o') ) {
               userService.deactivate(data)
                .then(function (resault) {
                    activeUser(resault.data.active,target);
                })
                .catch(function (error) {
                    
                }); 
            }
            else {
                    userService.activateUser(data)
                    .then(function (resault) {
                        activeUser(resault.data.active,target);
                    })
                    .catch(function (error) {
                        
                    }); 
                }
        }
        $scope.editUser = function(user) {
        	var	url = '';
        	if (user.uniqueId) {
        		url = '/user/'+ user.uniqueId +'/edit';
                $location.path(url);
        	}
        }
        // =============== Delete a user ================
        deleteMethod = function(uniqueId,index) {
            var data = {};
            var url = 'suggestion/' + uniqueId;

            suggestionService.deleteMethod(data, url)
            .then(function (resault) {
                if ( resault.data.code === 0 ) {
                    var msg = resault.data.message;
                    UIToastr.init('success', msg);
                    $scope.suggestionList.splice(index,1);
                    $state.reload();
                }
                else if (resault.data.code === 101){
                        var msg = resault.data.message;
                        console.log(msg);
                    }
                else {
                    var msg = resault.data.message;
                    UIToastr.init('success', msg);
                }
            })
            .catch(function (error) {
                var msg = error.data.message;
                console.log(msg);
            });
        }
        // =============== Show a user Modal================
        $(document).on('click','.show-op',function(){
            var This = $(this);
            var id = This.attr('userId');
            var data = {};
            data.token = token;
            data.userId = id;
            userService.getUser(data)
            .then(function (resault) {
                $scope.userModal = resault.data;

                $('#usersModal').modal('show');
            })
            .catch(function (error) {
              
            });
        })
        // =================== Form validation ====================
         var handleValidation = function() {
            // for more info visit the official plugin documentation: 
            // http://docs.jquery.com/Plugins/Validation
            var form = $('#insertUserForm');
            form.validate({
                errorElement: 'span', //default input error message container
                errorClass: 'help-block help-block-error', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                ignore: "", // validate all fields including form hidden input
                
                invalidHandler: function(event, validator) { //display error alert on form submit              
                    App.scrollTo(form, -200);
                },
                rules: {
                    'firstName' : {
                      required: true
                    },
                    'lastName' : {
                      required: true
                    },
                    'password' : {
                      required: true
                    },
                    'repass' : {
                      required: true
                    },
                    'roles' : {
                      required: true
                    },
                    'userName' : {
                      required: true
                    }
                  },
                  messages: {
                    'firstName' : {
                        required: "این فیلد نمی تواند خالی باشد"
                    },
                    'lastName' : {
                        required: "این فیلد نمی تواند خالی باشد"
                    },
                    'password' : {
                        required: "این فیلد نمی تواند خالی باشد"
                    },
                    'repass' : {
                        required: "این فیلد نمی تواند خالی باشد"
                    },
                    'roles' : {
                        required: "این فیلد نمی تواند خالی باشد"
                    },
                    'userName' : {
                        required: "این فیلد نمی تواند خالی باشد"
                    }
                  },

                errorPlacement: function(error, element) {
                    if (element.is(':checkbox')) {
                        error.insertAfter(element.closest(".md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline"));
                    } else if (element.is(':radio')) {
                        error.insertAfter(element.closest(".md-radio-list, .md-radio-inline, .radio-list,.radio-inline"));
                    } else {
                        error.insertAfter(element); // for other inputs, just perform default behavior
                    }
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

                submitHandler: function(form) {
                    $scope.submitUserForm();
                }
            });
        }
        // =================== Change pass Form validation ====================
        $scope.changePassword = function(event) {
            changePassValidation();
            $('#change-pass-form').submit();
        }
        function changeUserPass() {
            if ($scope.userPass.newPassword != $scope.userPass.repass) {
                    var msg = 'کلمات عبور یکسان نمی باشند لطفا بررسی نمایید';
                    UIToastr.init('warning', msg);
                    return
                    // warning,success,error,info
                }
                delete $scope.userPass.repass;

                userService.changePassword($scope.userPass)
                .then(function (resault) {
                    if ( resault.data.code === 0 ) {
                        var msg = 'عملیات با موفقیت انجام شد';
                        UIToastr.init('success', msg);
                        $scope.NewUser = {};
                    }
                    else {
                        var msg = resault.data.message;
                        UIToastr.init('info', msg);
                        $scope.NewUser = {};
                    }
                    
                })
                .catch(function (error) {
                    var msg = error.data.message;
                    UIToastr.init('warning', msg);
                });
        }
         var changePassValidation = function() {
            // for more info visit the official plugin documentation: 
            // http://docs.jquery.com/Plugins/Validation
            var form = $('#change-pass-form');
            form.validate({
                errorElement: 'span', //default input error message container
                errorClass: 'help-block help-block-error', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                ignore: "", // validate all fields including form hidden input
                
                invalidHandler: function(event, validator) { //display error alert on form submit              
                    App.scrollTo(form, -200);
                },
                rules: {
                    'curpass' : {
                      required: true
                    },
                    'newpass' : {
                      required: true
                    },
                    'repass' : {
                      required: true
                    }
                  },
                  messages: {
                    'curpass' : {
                        required: "این فیلد نمی تواند خالی باشد"
                    },
                    'newpass' : {
                        required: "این فیلد نمی تواند خالی باشد"
                    },
                    'repass' : {
                        required: "این فیلد نمی تواند خالی باشد"
                    }
                  },

                errorPlacement: function(error, element) {
                    if (element.is(':checkbox')) {
                        error.insertAfter(element.closest(".md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline"));
                    } else if (element.is(':radio')) {
                        error.insertAfter(element.closest(".md-radio-list, .md-radio-inline, .radio-list,.radio-inline"));
                    } else {
                        error.insertAfter(element); // for other inputs, just perform default behavior
                    }
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

                submitHandler: function(form) {
                    changeUserPass();
                }
            });
        }
        // =================== check server response ==============
        function checkStatus(code)
        {
        	var msg= '';
        	switch(code) {
			    case 200:
			        msg = 'عملیات با موفقیت انجام شد.';
			        break;
			    case 401:
			        msg = 'شما مجاز به انجام این عملیات نمی باشید';
			        break;
			    case 406:
			        msg = 'کاربر در حال حاضر موجود می باشد';
			        break;
			    case 403:
			        msg = 'کاربری شما غیر فعال است لطفا مجدد وارد پنل شوید';
			        break;
			    case 204:
			        msg = 'شماره مرکز صحیح نمی باشد';
			        break;
			    case 400:
			    	msg = 'لطفا تمامی فیلد ها را پر نمایید';
			        break;
			    default:
			    	msg = 'خطای در مرکز داده لطفا با پشتیبانی تماس بگیرید';
			    	break;
			} 
			return msg;
        }
        // ================ statick js ========================

        function toolTipHandler()
        {
        	$('[data-toggle="tooltip"]').tooltip({
	           animation: true,
	           delay: { "show": 100, "hide": 250 },
	        });
        }
        function activeUser(flag,target)
        {
             
            var active = $(target).hasClass('fa-check-circle-o');
            var deactive = $(target).hasClass('fa-times-circle-o');
            if ( !flag && active ) {
                $(target).removeClass('fa-check-circle-o');
                $(target).addClass('fa-times-circle-o');
            }
            else if( flag && deactive) {
                $(target).removeClass('fa-times-circle-o');
                $(target).addClass('fa-check-circle-o');
            }
        }
    
        function initTable() {
            var table = $('#users_table');

            table.dataTable({
                "bStateSave": true, // save datatable state(pagination, sort, etc) in cookie.

                "lengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "همه"] // change per page values here
                ],
                "fnDrawCallback": function( oSettings ) {
                    $timeout(function(){
                        toolTipHandler();
                        UIConfirmations.init();
                    }, 100);        
                },
                dom: 'Blfrtip',
                 buttons: [
                     {
                        extend: 'excelHtml5',
                        title: 'لیست کاربران',
                        text: 'خروجی excel',
                        exportOptions: {
                            columns: [ 1, 2, 3, 4]
                        },
                    },
                    {
                        extend: 'print',
                        title: 'لیست کاربران',
                        text: 'پرینت لیست',
                        exportOptions: {
                            columns: [ 1, 2, 3, 4]
                        },
                        customize: function ( win ) {
                        $(win.document.body)
                        .css( 'font-size', '10pt' )
                        .css( 'text-align', 'center' )
                        .css( 'padding-right', '10%' )
                        .prepend(
                            '<span>چتر سبز</span>'
                        );
 
                        $(win.document.body).find( 'table' )
                        .addClass( 'print-preview' )
                        }
                    }
                ],
                // set the initial value
                "pageLength": 5,            
                "pagingType": "bootstrap_full_number",
                "columnDefs": [
                    {  // set default column settings
                        'orderable': false,
                        'targets': [0]
                    }, 
                    {
                        "searchable": false,
                        "targets": [0]
                    },
                    {
                        "className": "dt-right", 
                        //"targets": [2]
                    }
                ],
                "order": [
                    [1, "asc"]
                ], // set first column as a default sort by asc
                "language": Constants.tableTranslations
            });
        };
        
       
        // ================== Jquery handler ==================
        $(document).on('click','ul.pagination > li  ',function(event){
            $timeout(function(){
                toolTipHandler();
            },500)
        })

    });
}]);