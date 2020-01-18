/*
=================================================================================
= ~Controller : instructorController
= ~Author     : Petra
= ~License    : Petra
= ~Developer  : EH7AN
= ~Date       : 1397/08/01 
=================================================================================
*/

angular.module('MetronicApp').controller('responsemanController',
 ['$rootScope', '$scope', '$timeout', '$location', '$stateParams', 'settings', 'responsemanService', 'Constants',
 function($rootScope, $scope, $timeout, $location, $stateParams, settings, responsemanService , Constants ) {
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
        // ======================= INITALIZ VARIABLES ====================
        var mode = 'create';
        $scope.responseModel = {};
        $scope.responseList = [];
        $scope.paramList = [];


        if ($stateParams.responseId) {
            var responseId = $stateParams.responseId;
            getResponseById();
        }
        if ($location.$$url == '/response/all') {
            getAllResponse();
        }
        //==========================================================
        //=	         		Server Side Handler 				   =
        //==========================================================

        // =============== GET ALL MERCHANTS ================
        function getAllResponse()
        {
     		var	data = {};
     		var url = 'response/';
 
        	responsemanService.getMethod(data, url)
	        .then(function (resault) {
	        	if ( resault.data.code === 0 ) {
	        		$scope.responseList = resault.data.content;
	        	}
	        	else {
	        		var msg = resault.data.message;
                    UIToastr.init('success', msg);
	        	}
	            $timeout(function(){
                    initTable();
	      			toolTipHandler();
                    UIConfirmations.init();
	            },100);
	        })
	        .catch(function (error) {
	           	var msg = error.data.message;
                UIToastr.init('warning', msg);
	        });
        }
        // ======================= Get Response by id =====================
            function getResponseById()
            {
                var data = {};
                var url = 'response/' + responseId;
     
                responsemanService.getMethod(data, url)
                .then(function (resault) {
                    if ( resault.data.code === 0 ) {
                        $scope.responseModel = resault.data.content;
                        if (resault.data.content.params) {
                            $scope.paramList = resault.data.content.params.split(',');
                        }
                         $timeout(function(){
                          ComponentsSelect2.init();   
                         }, 50);
                        // Put inputs on edit mode
                        $('.form-group .form-control').addClass('edited');
                    }
                    else {
                        var msg = resault.data.message;
                        UIToastr.init('success', msg);
                    }
                })
                .catch(function (error) {
                    var msg = error.data.message;
                    UIToastr.init('warning', msg);
                });
            }
        // ======================= Submit merchant ========================
            $scope.sumbitResponse= function() {
                if ( !$scope.paramList ) {
                    insertVersion();
                }
                else {
                    validateResponse();
                }
            }
        // ======================= Inser new merchant =====================
        var insertVersion  = function() {

            var el = $('.mt-ladda-btn')[0];
            UIButtons.startSpin(el);
            var url = 'response/' + responseId;
 
            responsemanService.postMethod($scope.responseModel, url)
            .then(function (resault) {
                UIButtons.stopSpin(el);
                if ( resault.data.code === 0 ) {
                    var msg = resault.data.message;
                    UIToastr.init('success', msg);
                }
                else {
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
        // =========================================================
        //=	         		CLient Side Handler 				   =
        //==========================================================

        // ======================== INI DATATABLE ======================
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
        // ==============  TOOLTIP HANDLER ================
        function toolTipHandler()
        {
        	$('[data-toggle="tooltip"]').tooltip({
	           animation: true,
	           delay: { "show": 100, "hide": 250 },
	        });
        }
        // =========== Insert merchant validation =============
            var validateResponse = function() {
                // == Intial variables
                var pos = {};
                var word = $scope.responseModel.message;//response msg
                var start_sign = "{";// start sign for inserted param
                var end_sign = "}";// end sign for inserted param
                var flag = true; // Centeral flag to decide operation is valid or not
                var i = 0;//use as counter
                var log_msg = 'پارامتر های ورودی زیر صحیح نمی باشند : \n';
                // === Find all positions that ends with `{`
                for (var index = word.indexOf(start_sign)
                    ;index >= 0;
                    index = word.indexOf(start_sign, index + 1) )
                {
                   pos[i] = {};
                   pos[i].start = index;
                   i++;
                }
                i = 0;
                // === Find all positions that start with `{` 
                for (var index = word.indexOf(end_sign)
                    ;index >= 0;
                    index = word.indexOf(end_sign, index + 1) )
                {
                   pos[i].end = index;
                   i++;
                }
                // === check if user params is in server params
                for(index in pos) {
                    let start = ++pos[index].start;
                    let end = pos[index].end;
                    var temp = word.slice(start,end)
                    if ( !$scope.paramList.includes(temp) ) {
                        flag = false;
                        log_msg += temp + " ";
                    }
                }
                // == Check if user inserted valid params
                if (flag) {
                    insertVersion();
                }
                // == Show error in case user inserted false params
                else {
                    UIToastr.init('error', log_msg);
                }
                
            }
        // ======== Edit merchant handller =========
           $scope.editResponse = function(response) {
                if (response.code) {
                    url = '/response/' + response.code + '/edit';
                    $location.path(url);
                }
           }
        // ========== Insert param handler =================
            $scope.insertParam = function(sel_param,index) {
                var tmp = `{${sel_param}}`;
                $scope.responseModel.message += tmp;
                var el = $('.reseditor .content');
                moveCaretToEnd(el);
                var c = putMaskOn.getEOT(el);
                var d = chale.getFirstName().getLastName().getFullName();
            }
            function moveCaretToEnd(el) {
                
                if (typeof el.selectionStart == "number") {
                    el.selectionStart = el.selectionEnd = el.value.length;
                } else if (typeof el.createTextRange != "undefined") {
                    el.focus();
                    var range = el.createTextRange();
                    range.collapse(false);
                    range.select();
                }
            }
            var putMaskOn = function() {

                var get_eot_position = function(el) {
                    var eot = el.prop("selectionStart");
                    return eot
                }
                return {
                    getEOT : get_eot_position
                }
            }();
            var chale = {
                        user : {
                            sname : 'ehsan ghasemi'
                        },
                        getFirstName : function(){
                            var name = this.user.sname.split(" ");
                            this.user.name = name[0];
                            return this; 
                        },
                        getLastName : function() {
                            var name = this.user.sname.split(" ");
                            this.user.family = name[1];
                            return this; 
                        },
                        getFullName : function() {
                            var fullName = `${this.user.name} ${this.user.family}`;
                            return fullName;
                        }
                };
    });
}]);
