var UIConfirmations = function () {

        var handleSample = function () {
            $('[data-toggle=confirmation]').confirmation({
              rootSelector: '[data-toggle=confirmation]',
              // other options
            });
            $('.fa-trash-o').on('confirmed.bs.confirmation', function () {
              var that = $('.confirmation ').siblings('.fa-trash-o');
              var merchantId = that.attr('data-content');
              var index = that.attr('data-index');
              deleteMethod(merchantId, index);
            });
        }
    return {
        //main function to initiate the module
        init: function () {
           handleSample();
        }
    };

}();