var slimScroller = function () {

    return {
        //main function to initiate the module
        init: function () {
            $('.scroller').slimScroll({
                width: '100%',
                size: '5px',
                position: 'left',
                color: '#ffcc00',
                alwaysVisible: false,
                distance: '5px',
                railVisible: true,
                railColor: '#222',
                railOpacity: 0.3,
                wheelStep: 5,
                allowPageScroll: true,
                disableFadeOut: false
            });
        }
    };
}();