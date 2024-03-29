var UIIdleTimeout = function () {

    return {

        //main function to initiate the module
        init: function (currentPath) {
            // cache a reference to the countdown element so we don't have to query the DOM for it on each ping.
            var $countdown;
            $('body').append('');
                    
            // start the idle timer plugin
            $.idleTimeout('#idle-timeout-dialog', '.modal-content button:last', {
                idleAfter: 300, // 5 seconds
                timeout: 30000, //30 seconds to timeout
                onTimeout: function(){
                    $('#idle-timeout-dialog').modal('hide');
                    window.location = `/#/lockscreen?path=${currentPath}`;
                },
                onIdle: function(){
                    $('#idle-timeout-dialog').modal('show');
                    $countdown = $('#idle-timeout-counter');
                    $('#idle-timeout-dialog-keepalive').on('click', function () { 
                        $('#idle-timeout-dialog').modal('hide');
                    });

                    $('#idle-timeout-dialog-logout').on('click', function () { 
                        $('#idle-timeout-dialog').modal('hide');
                        $.idleTimeout.options.onTimeout.call(this);
                    });
                },
                onCountdown: function(counter){
                    $countdown.html(counter); // update the counter
                }
            });
        },
        destroy : function() {
            $.idleTimer('destroy');
        }

    };

}();