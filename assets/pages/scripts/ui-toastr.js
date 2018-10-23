var UIToastr = function () {

    return {
        //main function to initiate the module
        init: function (toastType, msg) {
            var i = -1,
                toastCount = 0,
                $toastlast;
                var shortCutFunction = toastType;
                var msg = msg;
                var title = 'کاربر گرامی :';
                var showDuration = 1000;
                var hideDuration = 1000;
                var timeOut = 5000;
                var extendedTimeOut = 1000;
                var showEasing = 'swing';
                var hideEasing = 'linear';
                var showMethod = 'fadeIn';
                var hideMethod = 'fadeOut';
                var toastIndex = toastCount++;

                toastr.options = {
                    closeButton: true,
                    debug: false,
                    positionClass: 'toast-top-left',
                    onclick: null
                };

                toastr.options.showDuration = showDuration;
                toastr.options.hideDuration = hideDuration;
                toastr.options.timeOut = timeOut;
                toastr.options.extendedTimeOut = extendedTimeOut;
                toastr.options.showEasing = showEasing;
                toastr.options.hideEasing = hideEasing;
                toastr.options.showMethod = showMethod;
                toastr.options.hideMethod = hideMethod;
                $("#toastrOptions").text("Command: toastr[" + shortCutFunction + "](\"" + msg + (title ? "\", \"" + title : '') + "\")\n\ntoastr.options = " + JSON.stringify(toastr.options, null, 2));
                var $toast = toastr[shortCutFunction](msg, title); // Wire up an event handler to a button in the toast, if it exists
                $toastlast = $toast;
        }

    };

}();
