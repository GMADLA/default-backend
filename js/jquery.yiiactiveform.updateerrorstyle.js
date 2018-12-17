// JavaScript Document
(function()
{
         
        // Define overriding method.
        jQuery.fn.yiiactiveform.updateInput = function(attribute, messages, form) 
        {
                attribute.status = 1;
                var hasError = messages!=null && $.isArray(messages[attribute.id]) && messages[attribute.id].length>0;
                var $error = $('#'+attribute.errorID, form);
                var $container = $.fn.yiiactiveform.getInputContainer(attribute, form);
                $container.removeClass(attribute.validatingCssClass).removeClass(attribute.errorCssClass).removeClass(attribute.successCssClass);
                if(hasError) {
		                $error.html(messages[attribute.id][0]).hide().fadeIn(1500);
						if ($('#'+attribute.inputID, form).is(':checkbox')) {
						// blank for now
						}
						else {
							$('#'+attribute.inputID, form).css('border','1px solid #C97273').addClass('input_error'); /**border was #D6D39D **/
							$container.addClass(attribute.errorCssClass);
						}
                }
                else if(attribute.enableAjaxValidation || attribute.clientValidation) {
                		if ($('#'+attribute.inputID, form).is(':checkbox')) {
                		// blank for now
                		}
                		else {             		
                        	$container.addClass(attribute.successCssClass);
							$('#'+attribute.inputID, form).css('border','1px solid #4F9D4A').removeClass('input_error');
						}
                } else {
                	$container.addClass(attribute.successCssClass);
					$('#'+attribute.inputID, form).css('border','1px solid #4F9D4A').removeClass('input_error');
                }
                if(!attribute.hideErrorMessage) {
                        $error.toggle(hasError);
				}

                attribute.value = $('#'+attribute.inputID, form).val();

                return hasError;
                 
        }
})();