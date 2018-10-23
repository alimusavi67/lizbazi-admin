var UIButtons = function () {
    var startSpin = function(el) {
        var l = Ladda.create(el);
        l.start();
    };
    var stopSpin = function(el) {
        var l = Ladda.create(el);
        l.stop();
    }
    return {
        //main function to initiate the module
            startSpin : startSpin,
            stopSpin : stopSpin
    }
}();
