/*
=================================================================================
= ~Controller : commentController
= ~Author     : Petra
= ~License    : Petra
= ~Developer  : EH7AN
= ~Date       : 1397/08/01 
=================================================================================
*/

angular.module('MetronicApp')
.controller('commentController',
	['$timeout','$rootScope','$location','$stateParams', '$state', '$window', '$scope','$q','$cookieStore', '$timeout','settings','initService','$state','Constants','$interval',
 function($timeout,$rootScope,$location,$stateParams, $state, $window,  $scope,$q,$cookieStore, $timeout, settings,initService,$state,Constants,$interval) {
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
        $scope.comments = [];
        $scope.mediaType = '';
        $scope.desUrl = '';
        $scope.userList = {};
        $scope.moderationStatus = 'WaitForApprove';

        if ($stateParams.mediaType) { // If user id is set so Mode is update
            $scope.mediaType = $stateParams.mediaType;
            let data = {'params' :{
                page: 1,
                size: 10
            }};
            switch($scope.mediaType) {
                case 'resort':
                    $scope.desUrl = `/api/comment/resort/filter`;
                    $scope.moderateUrl = 'comment/resort/';
                    break;
                case 'video':
                    $scope.desUrl = `/api/comment/learningVideo/filter`;
                    $scope.moderateUrl = 'comment/learningVideo/';
                    break;
            }
            initil_table();
            mode = 'create';
        }
        $scope.registerVideo = function() {
            // create a new user when mode is `create`
            if (mode === 'create'){
                var el = $('.mt-ladda-btn')[0];
                UIButtons.startSpin(el);
                initService.postMethod($scope.newVideo, 'learningVideo')
                    .then(function (resault) {
                        UIButtons.stopSpin(el);
                        if ( resault.code === 0 ) {
                            var msg = 'عملیات با موفقیت انجام شد';
                            UIToastr.init('success', msg);
                        }
                        else {
                            var msg = resault.data.message;
                            UIToastr.init('info', msg);
                            $scope.newResort = {};
                        }

                    })
                    .catch(function (error) {
                        UIButtons.stopSpin(el);
                        var msg = error.data.message;
                        UIToastr.init('warning', msg);
                    });
            } else if (mode === 'update') {
                var el = $('.mt-ladda-btn')[0];
                UIButtons.startSpin(el);
                initService.postMethod($scope.newVideo, `learningVideo/${videoId}`)
                    .then(function (resault) {
                        UIButtons.stopSpin(el);
                        if ( resault.data.code === 0 ) {
                            var msg = 'عملیات با موفقیت انجام شد';
                            UIToastr.init('success', msg);
                            $location.path('videos/all');

                        }
                        else {
                            var msg = resault.data.message;
                            UIToastr.init('info', msg);
                            $scope.newResort = {};
                        }

                    })
                    .catch(function (error) {
                        UIButtons.stopSpin(el);
                        var msg = error.data.message;
                        UIToastr.init('warning', msg);
                    });
            }

        };

       function getComments(data)
        {
            data.params.moderationStatus = 'WaitForApprove';
            initService.getMethod(data, $scope.desUrl)
                .then(function (resault) {
                    $scope.comments = resault.data.content.comments;
                    $timeout(()=>{
                        initTable();
                    },500)
                })
                .catch(function (error) {

                });
        }
        $scope.activateUser = function(user) {
            let data = {};
            data.userId = user.id;
            initService.postMethod(data, `user/${user.id}/active`)
                .then(function (resault) {
                   if (resault.status == 200) {
                    UIToastr.init('info', 'با موفقیت انجام شد');
                   }
                })
                .catch(function (error) {
                    UIToastr.init('warning', 'خطای سرور');
                });
        }
        $scope.verifyUser = function(user) {
            let data = {};
            data.username = user.username;
            initService.postMethod(data, `user/verify`)
                .then(function (resault) {
                    debugger
                   if (resault.status == 200) {

                    UIToastr.init('info', 'با موفقیت انجام شد');
                   }
                })
                .catch(function (error) {
                    UIToastr.init('warning', 'خطای سرور');
                });
        }
        // ================= get all parent ==========
        function getAllCountry()
        {
            var	data = {
                'params' :{

                }
            };
            initService.getMethod(data, 'baseInfo/countries')
                .then(function (resault) {
                    $scope.countryList = resault.data.content.countries;
                })
                .catch(function (error) {

                });
        }
        // =============== Get a user ================
        function getVideo()
        {
            var	data = {
                'params' :{

                }
            };
            var url = 'learningVideo/' + videoId;

            initService.getMethod(data, url)
                .then(function (resault) {
                    $scope.newVideo = resault.data.content;
                    $scope.newVideo.coverPhotoMediaId = resault.data.content.coverPhoto.id;
                    $scope.newVideo.farsiVideoMediaId =  $scope.newVideo.farsiVideo.id;
                    $scope.newVideo.englishVideoMediaId =  $scope.newVideo.englishVideo.id;

                    delete $scope.newVideo.farsiVideo;
                    delete $scope.newVideo.englishVideo;

                })
                .catch(function (error) {

                });
        }

        $scope.goToEditResort = function(resort) {
        	var	url = '';
        	if (resort.id) {
        		url = '/resort/'+ resort.id +'/edit';
                $location.path(url);
        	}
        };

        $scope.goToResortFeature = function(resort) {
            var	url = '';
            if (resort.id) {
                url = '/resort/'+ resort.id +'/feature';
                $location.path(url);
            }
        };
        // =============== Delete a user ================
        deleteMethod = function(uniqueId,index) {
            var data = {};
            var url = 'learningVideo/' + uniqueId;

            initService.deleteMethod(data, url)
            .then(function (resault) {
                if ( resault.data.code === 0 ) {
                    var msg = resault.data.message;
                    UIToastr.init('success', msg);
                    $scope.videoList.splice(index,1);
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
        };
        // go to edit
        $scope.goToEdit = function(video) {
            let url = '/video/' + video.id;
            $location.path(url);
        }
        //============= upload files   =======
        $scope.fileUploader = function(files, type) {

            // var el = $('.ladda-changepic')[0];
            $('.uplodp-btn').removeClass('green');
            // UIButtons.startSpin(el);
            var file=files[0];
                var canceller = $q.defer();
                file.canceler = canceller;
                var fd = new FormData(document.forms[0]);
            fd.append('file', file);;
                var url = '/media/upload';
                var formData = new FormData();
                initService.uploader(fd, file, url,function(result){
                    if (result.data.code == 0) {
                        // UIButtons.stopSpin(el);
                        if (type === 'english') {
                            $scope.newVideo.englishVideoMediaId = result.data.content.id;
                            $scope.englishFileName =  result.data.content.fileName;
                        }
                        if (type === 'farsi') {
                            $scope.newVideo.farsiVideoMediaId = result.data.content.id;
                            $scope.farsiFileName =  result.data.content.fileName;
                        }

                    }
                    else {
                        var msg = result.data.message;
                        UIToastr.init('error', msg);
                    }
                })
        };
         //============= upload coverImage   =======
         $scope.avatarUploader = function(files) {

            var el = $('.ladda-changepic')[0];
            $('.uplodp-btn').removeClass('green');
            // UIButtons.startSpin(el);
            // ===============================

            var file=files[0];
            var canceller = $q.defer();
            file.canceler = canceller;

            var fd = new FormData();
            fd.append('contentMedia', file);;
            fd.append("file",file);
            var url = '/media/upload';
            var formData = new FormData();
            initService.uploader(fd, file, url,function(result){
                if (result.data.code == 0) {
                    UIButtons.stopSpin(el);
                    $scope.newVideo.coverPhotoMediaId = result.data.content.id;
                }
                else {
                    var msg = result.data.message;
                    UIToastr.init('error', msg);
                }
            })
        };
        // ============================= Compact images using convas  ===============================
        function compactImages(myFile,callBack)
        {

            var fr = new FileReader;
            var reader = new FileReader();
            var bolb_obj = '';

            reader.onload = function(e) {
                if (!myFile){
                    return
                }

                var img = new Image;
                img.onload = function() {
                    var width = img.width;
                    var height = img.height;
                    var canvas = document.createElement('canvas');
                    // ======= BEGIN initializing resize =============
                    var MAX_WIDTH = 800;
                    var MAX_HEIGHT = 800;
                    var quality = 0.7;
                    var type = myFile.type;
                    // ======= END initializing resize =============
                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height = Math.round(height *= MAX_WIDTH / width);
                            width = height;
                        }
                        else {
                            height = width;
                        }
                    }
                    else {
                        if (height > MAX_HEIGHT) {
                            width = Math.round(width *= MAX_HEIGHT / height);
                            height = width;
                        }
                        else {
                            width = height
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);

                    var dataURL = canvas.toDataURL(type);
                    bolb_obj = dataURItoBlob(dataURL);
                    $.event.trigger({
                        type: "imageResized",
                        blob: bolb_obj,
                        url: dataURL
                    });
                    callBack(bolb_obj);
                };
                img.src = e.target.result;
            }
            if (myFile){
                reader.readAsDataURL(myFile);
            }
        }
        // =========================Convert Data Url to bolb object ========================================
        function dataURItoBlob(dataURI) {
            // convert base64/URLEncoded data component to raw binary data held in a string
            var byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataURI.split(',')[1]);
            else
                byteString = unescape(dataURI.split(',')[1]);

            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

            // write the bytes of the string to a typed array
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            var cmBlob = new Blob([ia], {type:mimeString});
            return cmBlob;
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
                        $scope.newResort = {};
                    }
                    else {
                        var msg = resault.data.message;
                        UIToastr.init('info', msg);
                        $scope.newResort = {};
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
                    [30, 60, 100, -1],
                    [30, 60, 100, "همه"] // change per page values here
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
                "pageLength": 30,            
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
                    [0, "asc"]
                ], // set first column as a default sort by asc
                "language": Constants.tableTranslations
            });
        };

        // ================= date settings ===================
        function listingDate() {
            $timeout(function(){
                $('.date-input').val('');
                $('.date-input').addClass('edited');
                $('#fromDate').pDatepicker({
                    format: 'LL',
                    altField:'#fromDateTS',
                });

            }, 500);
        }

        function listingDate2(time) {
            $timeout(function(){
                $('.date-input').val(time);
                $('.date-input').addClass('edited');
                $('#fromDate').pDatepicker({
                    format: 'LL',
                    altField:'#fromDateTS',
                });

            }, 500);
        }
        // ==================== Persian date to timestamp ===============
        function pDateTimeStamp(date) {
            let cDate = date;
            let intDate = $.map(cDate.split('/'), function(value) {
                return parseInt(value, 10);
            });
            p_date = persianDate(intDate);
            var unix_timestamp = p_date.unix();
            var out = unix_timestamp * 1000;
            return out;
        }

        function fillBirthDateValue(time) {
            if (time != null && time != "") {
                var time_stamp = parseInt(time);
                val = convertDate(time_stamp)
                listingDate2(time_stamp);
            }
        }

        function convertDate(date) {
            var day = new persianDate(date).format('LLLL');
            return day;
        }
       $scope.approveComment = function() {
           let data = {
               "moderationStatus": 'Approved'
           }
           initService.postMethod(data, `${$scope.moderateUrl}/${$scope.commentObj.id}/moderate`)
                .then(function (resault) {
                    var msg = 'عملیات با موفقیت انجام شد';
                    UIToastr.init('success', msg);
                })
                .catch(function (error) {
                    var msg = 'خطایی رخ داد';
                    UIToastr.init('warning', msg);
                });
       }
       $scope.rejectComment = function() {
           let data = {
               "moderationStatus": 'Rejected'
           }
               initService.postMethod(data,`${$scope.moderateUrl}/${$scope.commentObj.id}/moderate`)
               .then(function (resault) {
                    var msg = 'عملیات با موفقیت انجام شد';
                    UIToastr.init('success', msg);
                })
                .catch(function (error) {
                    var msg = 'خطایی رخ داد';
                    UIToastr.init('warning', msg);
                });
       }
       $scope.dataTime =function(fromDate) 
          {
            let day = new persianDate(fromDate).format('LLLL');
             return day
          }
         // ============== initil functions ================
        //
        function initil_table() {
            var oldExportAction = function(self, e, dt, button, config) {
                    if (button[0].className.indexOf('buttons-excel') >= 0) {
                        if ($.fn.dataTable.ext.buttons.excelHtml5.available(dt, config)) {
                            $.fn.dataTable.ext.buttons.excelHtml5.action.call(self, e, dt, button, config);
                        } else {
                            $.fn.dataTable.ext.buttons.excelFlash.action.call(self, e, dt, button, config);
                        }
                    } else if (button[0].className.indexOf('buttons-print') >= 0) {
                        $.fn.dataTable.ext.buttons.print.action(e, dt, button, config);
                    }
            };
            var newExportAction = function(e, dt, button, config) {
                var self = this;
                var oldStart = dt.settings()[0]._iDisplayStart;

                dt.one('preXhr', function(e, s, data) {
                    // Just this once, load all data from the server...
                    data.start = 0;
                    data.limit = -1;

                    dt.one('preDraw', function(e, settings) {
                        // Call the original action function 
                        oldExportAction(self, e, dt, button, config);

                        dt.one('preXhr', function(e, s, data) {
                            // DataTables thinks the first item displayed is index 0, but we're not drawing that.
                            // Set the property to what it was before exporting.
                            settings._iDisplayStart = oldStart;
                            data.start = oldStart;
                        });

                        // Reload the grid with the original page. Otherwise, API functions like table.cell(this) don't work properly.
                        setTimeout(dt.ajax.reload, 0);

                        // Prevent rendering of the full data to the DOM
                        return false;
                    });
                });

                // Requery the server with the new one-time export settings
                dt.ajax.reload();
            };
            var table = $('#users_table2').DataTable({
                "processing": true,
                "serverSide": true,
                "bFilter": false,
                "info": false,

                "lengthMenu": [
                    [5, 15, 20],
                    [5, 15, 20] // change per page values here
                ],
                "pagingType": "full_numbers",
                "ajax": {
                    "url": $scope.desUrl,                    
                    error: function( objAJAXRequest, strError ){
                        $("#balance_report_processing").css("height", "60px");

                        $( "#balance_report_processing" ).text(
                       "پاسخ در زمان مناسب دریافت نشد"
                        );
                        },
                    dataSrc: function(json){
                       json.draw = json.content.draw;
                       json.recordsTotal = Number(json.content.totalCount);
                       json.recordsFiltered = Number(json.content.filteredCount);
                       $scope.comments = json.content.comments;
                       return json.content.comments;
                    },
                    'beforeSend': function (request) {
                        request.setRequestHeader('Content-Type','application/json;charset=utf-8');
                        request.setRequestHeader('Accept','application/json');
                        request.setRequestHeader("X-Platform" ,"Web");
                        request.setRequestHeader("X-Version" ,"1.0");
                        request.setRequestHeader("X-BuildNo" ,"1");
                    },
                    "data": function(d) {
                        // get time and convert
                        $scope.pageIndex = (d.start / d.length);
                        $scope.pageSize = d.length;
                        return $.extend({}, d, {
                            "page": (d.start / d.length),
                            "size": d.length,
                            "moderationStatus": $scope.moderationStatus
                        });
                    }
                },
                // ======== Read data from server and show in rows
                // ======== Add default column for show details
                "aoColumnDefs": [
                    { bSortable: false, aTargets: [0,1,2,3,4] },
                    {
                        "aTargets": [ 0 ],
                        "mData": "rowNumber",
                        "mRender": function ( data, type, full, rowData ) {
                             let row = ($scope.pageIndex  * $scope.pageSize)+ (rowData.row + 1)
                            return row;
                        }
                    }, 
                    {
                      "aTargets": [ 1 ],
                      "mData": "author",
                      "mRender": function ( data, type, full ) {
                        return data.fullName;
                      }
                    },
                    {
                        "aTargets": [ 2 ],
                        "data": "country",
                        "mRender": function ( data, type, full ) {
                            return data.name;
                        }
                    },
                    {
                    "aTargets": [ 3 ],
                      "mData": "creationDate",
                      "mRender": function ( data, type, full ) {
                          let day = '---';
                          if (data) {
                              day = convertDate(data);
                          }
                        return day;
                      }
                    },
                     {
                      "aTargets": [ 4 ],
                      "mData": "text",
                      "mRender": function ( data, type, full,rowdata ) {
                          let content = `<a data-text="${rowdata.row}" class="cm-text">---</a>`
                          if (data) {
                              content = `<a data-text="${rowdata.row}" class="cm-text"> 
                                    ${data.substr(0, 160)}...
                                </a>`;
                          }
                            return content;
                      }
                    }
                ],
                "columnDefs": [{ // set default column settings
                    'orderable': false,
                    'targets': [0, 1, 2, 3, 4]
                }],
                "language": Constants.tableTranslations,
                dom: 'Blfrtip',
                buttons: [{
                        extend: 'excelHtml5',
                        title: 'گزارش موجودی',
                        text: 'خروجی excel',
                        action: newExportAction,
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4]
                        },
                    },

                    {
                        extend: 'print',
                        title: 'گزارش موجودی',
                        text: 'پرینت لیست',
                        action: newExportAction,
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4, 5]
                        },
                        customize: function(win) {
                            $(win.document.body)
                                .css('font-size', '10pt')
                                .css('text-align', 'center')
                                .css('padding-right', '10%')
                                .css('background-color', '#c2c2c2')
                                .prepend(
                                    '<span>همراه کارت</span>'
                                );

                            $(win.document.body).find('table')
                                .addClass('print-preview')
                        }
                    }
                ],

            });
            $scope.dataTableObj = table;
        }
        // =================== Get report data by ajax =============
        $scope.getAjaxData = function()
        {
            $scope.dataTableObj.draw();
        }
        // ================== Jquery handler ==================
        $(document).on('click','ul.pagination > li  ',function(event){
            $timeout(function(){
                toolTipHandler();
            },500)
        })
        $(document).ready(function(){
            $(".nav-tabs a[data-toggle=tab]").on("click", function(e) {
                if ($(this).hasClass("disabled")) {
                    e.preventDefault();
                    return false;
                }
            });
        });
        function setCommentObj(index) {
            $scope.commentObj = $scope.comments[index];
            $scope.$apply();
            $('#idle-timeout-dialog').modal('show');
        }
        $(document).on('click', '.cm-text', function(e){
            let index = $(this).attr('data-text');
            setCommentObj(index)
        });

    });
}]);