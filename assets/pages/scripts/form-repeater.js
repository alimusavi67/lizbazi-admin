var FormRepeater = function () {

    return {
        //main function to initiate the module
        init: function () {
        	$('.mt-repeater').each(function(){
        		$(this).repeater({
        			show: function () {
	                	$(this).slideDown();
                        $('.select2-container').remove();
                        $('.select-reqtype').select2({
                          placeholder: "Placeholder text",
                          allowClear: true
                        });
                        $('.select2-container').css('width','100%');
		            },

		            hide: function (deleteElement) {
		                if(confirm('ایا از حذف این ردیف اطمینان دارید ؟')) {
		                    $(this).slideUp(deleteElement);
		                }
		            },

		            ready: function (setIndexes) {
                        
		            }

        		});
        	});
        }

    };

}();
