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
.controller('instructorController',
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
        // ================Init process========================
        var token = $cookieStore.get(Constants.cookieName).token;
        var mode = 'create';
        $scope.newinstructor = {};
        $scope.instructors = [];
        getAllCountry();
        getSportFields();
        if ($stateParams.instructorId) {
            var instructorId = $stateParams.instructorId;
            getInstructorById();
            var mode = 'update';
        }
        else {
            getinstructor();
        }



        $scope.registerInstructor = function() {
            // create a new user when mode is `create`
            if (mode === 'create'){
                var el = $('.mt-ladda-btn')[0];
                UIButtons.startSpin(el);
                var url = `instructor`
                initService.postMethod($scope.newinstructor, url)
                    .then(function (resault) {
                        UIButtons.stopSpin(el);
                        if ( resault.code === 0 ) {
                            var msg = 'عملیات با موفقیت انجام شد';
                            UIToastr.init('success', msg);
                            $timeout(function(){
                                $window.history.back();
                            }, 1000);
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
                var url = `instructor/${instructorId}`;
                initService.postMethod($scope.newinstructor, url)
                    .then(function (resault) {
                        UIButtons.stopSpin(el);
                        if ( resault.data.code === 0 ) {
                            var msg = 'عملیات با موفقیت انجام شد';
                            UIToastr.init('success', msg);
                            $timeout(function(){
                                $window.history.back();
                            }, 1000);
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
        // ================= get all countries ==========
        function getAllCountry()
        {
            var data = {
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
         function getSportFields()
        {
            var data = {
                'params' :{

                }
            };
            initService.getMethod(data, 'baseInfo/sportFields')
                .then(function (resault) {
                    $scope.sportFields = resault.data.content;
                })
                .catch(function (error) {

                });
        }
        // =============== Show all getinstructor ================
        function getinstructor()
        {
     		var	data = {'params' :{}};
        	initService.getMethod(data, 'instructor/admin')
	        .then(function (resault) {
	            $scope.instructors = resault.data.content.instructors;

	            $timeout(function(){
                    initTable();
	      			toolTipHandler();
                    UIConfirmations.init();
	            },100);
	        })
	        .catch(function (error) {

	        });
        }
        // ======== Get country by id
        function getInstructorById()
        {
            var data = {'params' :{}};
            initService.getMethod(data, `instructor/${instructorId}`)
            .then(function (resault) {
                $scope.newinstructor = resault.data.content;
                $scope.newinstructor.countryId = resault.data.content.country.id;
                if ( $scope.newinstructor.listPhotoMedia){
                    $scope.newinstructor.listPhotoMediaId =  $scope.newinstructor.listPhotoMedia.id;
                }
                if ($scope.newinstructor.contactInfoPhotoMedia){
                    $scope.newinstructor.contactInfoPhotoMediaId =  $scope.newinstructor.contactInfoPhotoMedia.id;
                }

                $timeout(function(){
                    ComponentsSelect2.init();
                }, 500);
            })
            .catch(function (error) {

            });
        }
        // =============== Delete a resort feature ================
        deleteMethod = function(id,index) {
            var data = {};
            var url = `instructor/${id}`;

            initService.deleteMethod(data, url)
            .then(function (resault) {
                if ( resault.data.code === 0 ) {
                    var msg = resault.data.message;
                    UIToastr.init('success', msg);
                    $scope.instructors.splice(index,1);
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

        // ================ statick js ========================

        //============= upload files   =======
        $scope.fileUploader = function(files) {

            var el = $('.ladda-changepic')[0];
            $('.uplodp-btn').removeClass('green');
            var file=files[0];
            var canceller = $q.defer();
            file.canceler = canceller;

            var fd = new FormData();
            fd.append('contentMedia', file);;
            fd.append("file",file);
                var url = 'media/upload';
                var formData = new FormData();
                initService.uploader(fd, file, url,function(result){
                    if (result.data.code == 0) {
                        UIButtons.stopSpin(el);
                        $scope.newinstructor.listPhotoMediaId = result.data.content.id;
                    }
                    else {
                        var msg = result.data.message;
                        UIToastr.init('error', msg);
                    }
                })
            // });
        };
        $scope.fileUploader2 = function(files) {

            var el = $('.ladda-changepic')[0];
            $('.uplodp-btn').removeClass('green');
            // UIButtons.startSpin(el);
            var file=files[0];
            compactImages(file, function(myBolb){
                var canceller = $q.defer();
                file.canceler = canceller;
                var fd = new FormData(document.forms[0]);
                fd.append('file', myBolb);
                var url = 'media/upload';
                var formData = new FormData();
                initService.uploader(fd, file, url,function(result){
                    if (result.data.code == 0) {
                        UIButtons.stopSpin(el);
                        $scope.newinstructor.contactInfoPhotoMediaId = result.data.content.id;
                    }
                    else {
                        var msg = result.data.message;
                        UIToastr.init('error', msg);
                    }
                })
            });
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
        $scope.goToEditInstructor = function(instructor) {
            var url = '';
            if (instructor.id) {
                url = '/instructor/'+ instructor.id +'/edit';
                $location.path(url);
            }
        };

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

    });
}]);
