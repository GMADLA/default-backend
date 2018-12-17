/**
 * jQuery yiiactiveform extension plugin file @author Gmad
 */

;(function($) {

	/**
	 * Given a YiiActiveForm element, find all the validating attributes.
	 */
	$.fn.yiiactiveform.getValidatingAttributes = function(form) {
		var settings = $(form).data('settings');
		if (settings) {
			return settings.attributes;
		} else {
			return new Array();
	  } 
  };
	
	
	
})(jQuery);
