/*
=================================================================================
= ~Controller : campaignController
= ~Author     : Petra
= ~License    : Petra
= ~Developer  : EH7AN
= ~Date       : 1397/08/01 
=================================================================================
*/

angular.module('MetronicApp')
.controller('campaignController',
	['$timeout','$rootScope','$location','$stateParams', '$state', '$window', '$scope','$q','$cookieStore', '$timeout','settings','initService','$state','Constants','$interval', '$http',
 function($timeout,$rootScope,$location,$stateParams, $state, $window,  $scope,$q,$cookieStore, $timeout, settings,initService,$state,Constants,$interval, $http) {
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
        $scope.newCampaign = {};
        $scope.campaignStatus = true;
        $scope.countryId = '';
        $scope.campaingList = [];
        $scope.countryList = [];
        getAllCountry();
        if ($stateParams.resortId) { // If user id is set so Mode is update
            var resortId = $stateParams.resortId;
            mode = 'update';
        } else if ($location.$$url == '/campaign/show') {
            getAllCampaign();
        } else if ($location.$$url == '/campaign/new') {
            initDatePickers2();
        }
        // =============== Show all users ================
        $scope.getAllCampaignFilter = function() {
           var    data = {
                 'params' :{
                   active: $scope.campaignStatus,
                   countryId: $scope.countryId
                }
            };

            initService.getMethod(data, 'campaign')
            .then(function (resault) {
                $scope.campaingList = resault.data.content.campaigns;
                for (let item of $scope.campaingList) {
                    item.startDate = new persianDate(item.startDate).format('LLLL');
                    item.endDate = new persianDate(item.endDate).format('LLLL');
                }
            })
            .catch(function (error) {
               
            }); 
        }
        function getAllCampaign()
        {
     		var	data = {
     		    'params' :{
                   active: $scope.campaignStatus,
                   countryId: $scope.countryId
                }
            };

        	initService.getMethod(data, 'campaign')
	        .then(function (resault) {
	            $scope.campaingList = resault.data.content.campaigns;
                for (let item of $scope.campaingList) {
                    item.startDate = new persianDate(item.startDate).format('LLLL');
                    item.endDate = new persianDate(item.endDate).format('LLLL');
                }
	            $timeout(function(){
                    initTable();
	      			toolTipHandler();
                    UIConfirmations.init();
	            },100);
	        })
	        .catch(function (error) {
	           
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
 
        // =============== Delete a user ================
        deleteMethod = function(uniqueId,index) {
            var data = {};
            var url = 'resort/' + uniqueId;

            initService.deleteMethod(data, url)
            .then(function (resault) {
                if ( resault.data.code === 0 ) {
                    var msg = resault.data.message;
                    UIToastr.init('success', msg);
                    $scope.resortList.splice(index,1);
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
        //============= upload files   =======
        $scope.fileUploader = function(files, type) {

            var el = $('.ladda-changepic')[0];
            $('.uplodp-btn').removeClass('green');
            // UIButtons.startSpin(el);
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
                    if (type === 'image') {
                        $scope.imageList.push(result.data.content);
                        // $scope.newResort.photoMediaIds.push(result.data.content.id);
                        submitPhotos(result.data.content.id);

                    } else {
                        $scope.newResort.mapPhotoMediaId = result.data.content.id;
                    }
                }
                else {
                    var msg = result.data.message;
                    UIToastr.init('error', msg);
                }
            })
        };
        function submitPhotos(mediaId) {
            let data = {
                photoMediaIds : [mediaId]
            }
            let url = `resort/${resortId}/photos`;
            initService.postMethod(data, url)
                .then(function (resault) {
                    if (resault.data.code === 0) {
                        UIToastr.init('info', 'با موفقیت آپلود شد');
                    }  
                })
                .catch(function (error) {

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
        // ======================= Inser new merchant =====================
             $scope.insertCampaign = function () {
                var el = $('.mt-ladda-btn')[0];
                UIButtons.startSpin(el);

                $scope.newCampaign.startDate = $scope.userAccFromDate;
                $scope.newCampaign.endDate = $scope.userAccToDate;


                if (mode === 'create') {
                    var url = 'campaign';
                } else if (mode === 'edit') {
                    $('.form-control').addClass('edited');
                    var url = 'campaign/' + campaignId;
                } else {
                    var msg = 'شما مجاز به انجام این عمل نمی باشید.';
                    UIToastr.init('success', msg);
                }
                if ($scope.newCampaign.startDate > $scope.newCampaign.endDate) {
                    UIToastr.init('error', "تاریخ پایان باید بعد از تاریخ آغاز باشد");
                    initDatePickers2();
                    UIButtons.stopSpin(el);
                    return
                }
                initService.postMethod($scope.newCampaign, url)
                    .then(function (resault) {
                        UIButtons.stopSpin(el);
                        if (resault.data.code === 0) {
                            var msg = resault.data.message;
                            UIToastr.init('success', "کاربر گرامی کمپین با موفقیت ثبت شد.");
                            $scope.newCampaign = {};
                            initDatePickers2();
                            url = '/campaign/show';
                            $timeout(function () {
                                $location.path(url);
                            }, 3000);

                        } else {
                            $scope.newCampaign.startDate = new persianDate($scope.newCampaign.startDate).format('LLLL');
                            $scope.newCampaign.endDate = new persianDate($scope.newCampaign.endDate).format('LLLL');
                            var msg = resault.data.message;
                            UIToastr.init('success', msg);
                        }
                    })
                    .catch(function (error) {
                        UIButtons.stopSpin(el);
                        var msg = error.data.message;
                        UIToastr.init('warning', msg);
                    });
            }
            // ================== Active/Deactive a campaign ============
            $scope.activateCampaign = function (campaignId, method='active') {
                var data = {};
                let url = `campaign/${campaignId}`
                if (method === 'active') {
                    initService.putMethod({}, url)
                    .then(function (resault) {
                         if (resault.data.code === 0) {
                            var msg = resault.data.message;
                             UIToastr.init('success', msg);
                              $timeout(function() {
                                $state.reload();
                             },3000)
                        } else {
                            var msg = resault.data.message;
                            UIToastr.init('success', msg);
                           
                        }
                    })
                    .catch(function (error) {
                        var msg = error.data.message;
                        UIToastr.init('warning', msg);
                    });
                } else {
                    initService.deleteMethod({}, url)
                    .then(function (resault) {
                        if (resault.data.code === 0) {
                            var msg = resault.data.message;
                             UIToastr.init('success', msg);
                             $timeout(function() {
                                $state.reload();
                             },3000)
                        } else {
                            var msg = resault.data.message;
                            UIToastr.init('success', msg);
                           
                        }
                    })
                    .catch(function (error) {
                        var msg = error.data.message;
                        UIToastr.init('warning', msg);
                    });
                }

                
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
                    [0, "asc"]
                ], // set first column as a default sort by asc
                "language": Constants.tableTranslations
            });
        };

        // ================= date settings ===================
         function initDatePickers() {
                $timeout(function () {
                    $('.date-input').val('');
                    $('.date-input').addClass('edited');
                    $('#toDate').pDatepicker({
                        format: 'LL',
                        altField: '#toDateTS',
                    });
                    $('#fromDate').pDatepicker({
                        format: 'LL',
                        altField: '#fromDateTS',
                    });
                }, 10);
            }
             function initDatePickers2() {
                $timeout(function () {
                    $('.date-input').val('');
                    $('.date-input').addClass('edited');
                    $('#toDate').pDatepicker({
                        format: 'LL',
                        altField: '#toDateTS',
                    });
                    $('#fromDate').pDatepicker({
                        format: 'LL',
                        altField: '#fromDateTS',
                    });
                }, 1);
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
        // ========== Get default features
        function getFeatureList()
        {
            $http.get('views/resorts/resortFeatures.json').then(function(response) {
               $scope.defaultFeature = response.data;
            });
        }
        // ========== submit default features
        function submitDefaultFeature(resortId)
        {
            let i = 0;
            for(feature of $scope.defaultFeature)
            {
                var url = `resort/${resortId}/features`
                initService.postMethod(feature, url)
                    .then(function (resault) {
                        console.log(`Feature ${i} stored !`);
                        i ++;
                    })
                    .catch(function (error) {
                        // TODO : if smth went wrong re store feature
                    });
            }
        }
        // ========== CLose And Open Resort
        $scope.activateResort = function(resortId, event)
        {
             let data = {
                status: "Open"
            };
            let target = $(event.target);
             if ( target.hasClass('fa-check-circle-o') ) {
                 data.status = "Close";
             }
            initService.putMethod(data, `resort/${resortId}?status=${data.status}`)
                .then(function (resault) {
                    if (resault.data.code === 0) {
                        if (resault.data.content.status === 'Close') {
                        target.removeClass('fa-check-circle-o');
                        target.removeClass('font-green-seagreen');
                        target.addClass('font-yellow-gold');
                        target.addClass('fa-times-circle-o');
                        } else {
                            target.removeClass('fa-times-circle-o');
                            target.removeClass('font-yellow-gold');
                            target.addClass('font-green-seagreen');
                            target.addClass('fa-check-circle-o');
                        }
                    } else if (resault.data.code === 142) {
                        UIToastr.init('warning', resault.data.message);
                    }
                })
                .catch(function (error) {
                    UIToastr.init('info', 'با موفقیت حذف شد');
                });

        }
        function getSportFields()
        {
            var data = {'params' :{}};
            initService.getMethod(data, 'baseInfo/sportCategories')
                .then(function (resault) {
                    $scope.sportFields = resault.data.content;
                })
                .catch(function (error) {

                });
        }
        // ====== init date pickers =============
            function initDatePickers2() {
                $timeout(function () {
                    $('.date-input').val('');
                    $('.date-input').addClass('edited');
                    $('#toDate').pDatepicker({
                        format: 'LL',
                        altField: '#toDateTS',
                    });
                    $('#fromDate').pDatepicker({
                        format: 'LL',
                        altField: '#fromDateTS',
                    });
                }, 1);
            }

    });
}]);