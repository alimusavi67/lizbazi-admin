/*
=================================================================================
= ~Controller : adpostController
= ~Author     : Petra
= ~License    : Petra
= ~Developer  : EH7AN
= ~Date       : 1398/11/12
=================================================================================
*/

angular.module('MetronicApp')
.controller('adpostController',
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
        $scope.newAdPost = {};
        $scope.editStudentItem = {};
        $scope.studentExtraData = {};
        $scope.imageList = [];
        $scope.adpost = [];
        $scope.countryList = [];
        $scope.resortItem = {};
        getAllCountry();
        if ($stateParams.countryId) {
            var mode = 'update';
            var countryId = $stateParams.countryId;
            getCountry();
        }
        else {
            getAdPost();
        }
        // =============== Register countries ================
        $scope.registerAdPost = function() {
            // create a new user when mode is `create`
            if (mode === 'create'){
                var el = $('.mt-ladda-btn')[0];
                UIButtons.startSpin(el);
                var url = 'adPost';
                $scope.newAdPost.pictureUrls = $scope.imageList.map( x => x.id);
                console.log($scope.newAdPost);
                initService.postMethod($scope.newAdPost, url)
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
                            $scope.newCountry = {};
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
                var url = `baseInfo/countries/${$stateParams.countryId}`;
                initService.postMethod($scope.newCountry, url)
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
                            $scope.newCountry = {};
                        }

                    })
                    .catch(function (error) {
                        UIButtons.stopSpin(el);
                        var msg = error.data.message;
                        UIToastr.init('warning', msg);
                    });
            }

        };

        // =============== Show all adPost ================
        function getAdPost()
        {
     		var	data = {'params' :{}};
        	initService.getMethod(data, 'adPost')
	        .then(function (resault) {
	            $scope.adpost = resault.data.content;
	            $timeout(function(){
                    initTable();
	      			toolTipHandler();
                    UIConfirmations.init();
	            },100);
	        })
	        .catch(function (error) {

	        });
        }
        // =============== getAllCountry ================
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
        // ======== Get country by id
        function getCountry()
        {
            var data = {'params' :{}};
            initService.getMethod(data, `baseInfo/countries/${countryId}`)
            .then(function (resault) {
                $scope.newCountry = resault.data.content;
                if ($scope.newCountry.flagPhoto) {
                    $scope.newCountry.flagPhotoMediaId = $scope.newCountry.flagPhoto.id;
                }
                $timeout(function(){
                    ComponentsSelect2.init();
                }, 500);
            })
            .catch(function (error) {

            });
        }
        $scope.goToEditFeature = function(feature) {
        	var	url = '';
        	if (feature.id) {
        		url = '/resort/'+ resortId +'/feature/' + feature.id + '/edit';
                $location.path(url);
        	}
        };
        // ======== generate insert link
        $scope.goToAddFeature = function() {
                url = '#/resort/'+ resortId +'/feature/register';
                return url
        };
        // =============== Delete a resort feature ================
        deleteMethod = function(id,index) {
            var data = {};
            var url = `baseInfo/countries/${id}`;

            initService.deleteMethod(data, url)
            .then(function (resault) {
                if ( resault.data.code === 0 ) {
                    var msg = resault.data.message;
                    UIToastr.init('success', msg);
                    $scope.countries.splice(index,1);
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
            UIButtons.startSpin(el);
            var file=files[0];
            compactImages(file, function(myBolb){
                var canceller = $q.defer();
                file.canceler = canceller;
                var fd = new FormData(document.forms[0]);
                fd.append('file', myBolb);
                var url = 'media/upload';
                initService.uploader(fd, file, url,function(result){
                    if (result.data.code === 0) {
                        UIButtons.stopSpin(el);
                        $scope.imageList.push(result.data.content);
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
                    [0, "asc"]
                ], // set first column as a default sort by asc
                "language": Constants.tableTranslations
            });
        };
        $scope.goToEditCountry = function(country) {
            var url = '';
            if (country.id) {
                url = '/country/'+ country.id +'/edit';
                $location.path(url);
            }
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
            var day = new persianDate(date).format('YYYY/MM/DD');
            return day;
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

    });
}]);
