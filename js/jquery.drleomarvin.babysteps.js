/*
 * UTILIZES custom jquery events found in custom gmad yiiactiveform javascript file "gmadYiiValidate"
 * Additionally, it offers hooks by calling other events, which can be bound in views to trigger functionality:
 * 	EVENT:
 * 		"gmadChange" - by default, this event is trigggered on a change to allow the CLIENT developer to hook into some last minute functionality.
 * 					 Example) a user alters an input and we want to do some filtering or formatting on the input after the user interacted with it.
 * 								$(someElement).bind('gmadChange', function(e){$(this).val().replace('blah','')});
 */

_dr_leo_debug_mode=false;	// enable logging.

//logger
_console_dr_leo = function(msg) {
	if (_dr_leo_debug_mode===true) {
  		console.log(msg);
  }
}


//Extend jquery providing babystep functionality - creates a closure!
;(function ($) {
	
	//NOTE: uiSpecialRequired is a css class used for ui/jquery purposes in determining when to skip uiRequired functionality.
	
	//given a container(s), initialize babysteps!
	$.fn.drleomarvinbabysteps = function(options) {
		
		//merge defaults with specified settings.
		var callBackz = $.extend({}, $.fn.drleomarvinbabysteps.defaultSettings.callbacks, options.callbacks);
		var settings = $.extend( {}, $.fn.drleomarvinbabysteps.defaultSettings, options );
		settings.callbacks = callBackz;
		
		
		var statusBar = $(settings.statusBar);
		if (statusBar===undefined) {
			settings.statusBar=undefined;
		}
		
		if (settings.navBar===undefined || settings.navBar.container===undefined) {
			settings.navBar=undefined;
		} else {
			$.fn.drleomarvinbabysteps.setupNavBar(settings);
		}
		
		$this=$(this);
		$.data( this[0], 'settings', settings); // store in form dom elemnt
		
		// initialize the view first
		var subForms=new Array();
		var actives=new Array();
		if(settings.masterAnimate) {
			subForms = $this.find(settings.subForms).hide();
			actives = subForms.filter(settings.actives).first().show();
		}
		
		if (subForms.length!=0 && statusBar!==undefined) {
			$.fn.drleomarvinbabysteps.setupStatusBar(settings, subForms);
		}
		
		//bind events to each item for each subform
		$.each(subForms, function(){
			var thisSubForm=$(this);
			var uiTestElements=thisSubForm.find(settings.testThese);
			//foreach input in subform
			$.each( uiTestElements, function(i,v) {
				
				//bind listed callbacks to every ui element
				$.each(settings.callbacks.uiReady, function(eventName, eventHandler) {
					$( uiTestElements[i] ).bind(eventName, settings, eventHandler);	
				});
				
				// trigger Dr Leo Marvin, aka Richard Dreyfus :), to investigate the subform to possibly submit
				$( uiTestElements[i] ).bind( settings.autoswitchOnEvents, settings, function(){
					if ( $.fn.drleomarvinbabysteps.determineReady($(this)) ) {
						if ($.fn.drleomarvinbabysteps.checkSubForm(settings, thisSubForm, uiTestElements)) {
							$.fn.drleomarvinbabysteps.subFormCompleted(settings, thisSubForm);
						}
					}
				});
			});
		});

	};//end drleomarvinbabysteps plugin initializer 
	
	
	
	
	// DEFAULTS Settings/Options:	//TODO: Refactor so the settings actually holds pointers to dom elements, instead of their selectors?
	$.fn.drleomarvinbabysteps.defaultSettings = {
		masterAnimate:true,
		maxContainerContext: undefined,	// everything is done within the scope of this dom element
		formObject: undefined,
		navBar: {
			container: undefined,
			prev: ".previousSubForm",
			next: ".nextSubForm"
		},
		
		statusBar: undefined,
		actives: ".activeSubForm",
		viewGroup: ".drLeoMarvinViewGroup",
		subForms: ".subForm",
		testThese: ".uiRequired",
		statusCheck: "babystepReady",
		
		displayStyle: "oneSubFormAtATime",	// set to null to disable
		
		//specify an event name for dr leo marvin to attempt to move to next subform
		autoswitchOnEvents: "drLeoSubFormReady",
		
		
		callbacks: {
			onFormComplete: function(settings) {
				$(settings.formObject).submit();
			},
			updateViewGroups: function(settings) {
				var a=$(settings.maxContainerContext).find(settings.actives);
				var aVG=$(settings.maxContainerContext).find(settings.actives).closest(settings.viewGroup);
				$(settings.maxContainerContext).find(settings.viewGroup).not(aVG).not(':hidden').slideUp(600);
				$(aVG).filter(':hidden').slideDown(600);
			},
			hideSubForm: function(settings, subForm) {
				$(subForm).slideUp(700);	// insert animate method here
			},
			showSubForm: function(settings, subForm) {
				$(subForm).slideDown(700);
			},
			uiReady: {
				//blur was here,
				change: function(ev) {
					var settings = ev.data;
					var $inputItem = $(this);
					var ready=false;
					//run the deafult attached validation handlers
					$inputItem.trigger('gmadChange');	//first
					$inputItem.trigger('gmadYiiValidate');	//second
					//check validation then do dr leo marvin
					if ($.fn.drleomarvinbabysteps.hasError($inputItem)) {
						ready = false;
						$.fn.drleomarvinbabysteps.makeNotReady(this);
					} else {
						ready = true;
						var active = $(this).closest(settings.actives);
						if ($.fn.drleomarvinbabysteps.doAutoSwitch(active)) {
							$inputItem.trigger(settings.autoswitchOnEvents);
						}
						$.fn.drleomarvinbabysteps.makeReady(this);
					}
					return ready;	// ev.stopPropagation();
				}
			}
			
		}//callbacks
		
		
	}; // end default settings
	
	
	
	
	//Check if subform is readyand valid
	$.fn.drleomarvinbabysteps.checkSubForm = function(settings, thisSubForm, uiTestElements) {
		_console_dr_leo('called checkSubForm');
		if (uiTestElements===undefined)
			uiTestElements=$(thisSubForm).find(settings.testThese);
		var subFormReady=true;
		$.each(uiTestElements, function(i,v) {
			var itemReady=$.fn.drleomarvinbabysteps.determineReady(uiTestElements[i]);
			subFormReady = subFormReady && itemReady;
			if(!subFormReady)
				return false;
		});
		if (subFormReady) {
			$.fn.drleomarvinbabysteps.makeReady(thisSubForm);
			return true;
		} else {
			$.fn.drleomarvinbabysteps.makeNotReady(thisSubForm);
		}
		return false;
	};
	
	
	//On SubForm ready and valid
	$.fn.drleomarvinbabysteps.subFormCompleted = function(settings, active) {
		_console_dr_leo('called subFormCompleted');
		$(settings.navBar.container).find(settings.navBar.prev).show().filter('.dummy').hide();
		var coll = $(settings.maxContainerContext).find(settings.subForms);
		var indAct = coll.index(active);
		if (settings.displayStyle!==undefined && settings.displayStyle=='oneSubFormAtATime') {
			settings.callbacks.hideSubForm( settings, active ); 
		}
		active.removeClass(settings.actives.substring(1));
		active.addClass('avoidAutoSwitch');
		var updateGroups=true;
		if (indAct<coll.length-1) {
			var nextSubForm = coll.get(indAct+1);      
			if (nextSubForm === undefined) {
				throw "Missing subform";
			}
			settings.callbacks.showSubForm( settings, $(nextSubForm) );
			$(nextSubForm).addClass(settings.actives.substring(1));
		} else {
			updateGroups=false;
			var allGood = true;
			var uiTestItems = $(settings.testThese);
			$.each( uiTestItems, function(i, v) {
				if (!$.fn.drleomarvinbabysteps.determineReady(uiTestItems[i])) {
					return allGood=false;//break;
				}
			});
			if (allGood) { 
				settings.callbacks.onFormComplete(settings);	
			}
		}
		if (updateGroups ) {
			settings.callbacks.updateViewGroups(settings);
		}
	};
	
	
	$.fn.drleomarvinbabysteps.setupNavBar = function(settings) {
		var navBar = $(settings.navBar.container);
		//navBar.show();
		if (settings.navBar.prev!==undefined) {
			$(settings.navBar.prev).click(function(e){
				var container=$(settings.maxContainerContext);
				var active=container.find(settings.actives);
				var subForms=container.find(settings.subForms);
				var indAct=subForms.index(active);
				if (indAct > 0 && subForms.length>1) {
					var prev = subForms.get(indAct-1);
					if (indAct-1 ===0) {
						$(navBar).find(settings.navBar.prev).hide().filter('.dummy').show();
					}
					$.fn.drleomarvinbabysteps.gotoStep(settings, subForms, active, $(prev));
					if (settings.navBar.next!==undefined) {
						$(navBar).find(settings.navBar.next).show();
					}
				}
			});
		}
		if (settings.navBar.next!==undefined) {
			$(settings.navBar.next).click(function(e){
				var container=$(settings.maxContainerContext);
				var active=container.find(settings.actives);
				var uiItems=active.find(settings.testThese);
				uiItems.trigger('gmadYiiValidate');
				uiItems.last().trigger(settings.autoswitchOnEvents);
			});
		}
	};
	
	$.fn.drleomarvinbabysteps.gotoStep = function(settings, subForms, currentActive, gotoThis) {
		_console_dr_leo('called gotostep');
		$.fn.drleomarvinbabysteps.makeNotReady(currentActive);
		$.fn.drleomarvinbabysteps.makeNotReady(gotoThis);
		settings.callbacks.hideSubForm( settings, currentActive );
		currentActive.removeClass(settings.actives.substring(1));
		settings.callbacks.showSubForm( settings, gotoThis );
		gotoThis.addClass(settings.actives.substring(1));
		settings.callbacks.updateViewGroups(settings);
	};
	
	$.fn.drleomarvinbabysteps.setupStatusBar = function(settings, subForms) {
		//TODO: Implement if necessary
	};
	
	
	
	//TODO: Make this a callback in settings, and use this as default.
	$.fn.drleomarvinbabysteps.determineReady = function(inputItem) {		
		// $(inputItem).trigger('gmadYiiValidate');
		var v=(inputItem=$(inputItem)).val();
		v=$.trim(v);
		var checked=inputItem.attr('checked');
		var ready=false;
		var hasError = $.fn.drleomarvinbabysteps.hasError(inputItem);
		var skipReady=inputItem.hasClass('uiSpecialRequired');
		if ( skipReady || ( hasError==false && ((v!==undefined && v.length>0) || (checked!==undefined && checked=='checked') ) ) ) {
			ready = true;
		}
		if (!ready) {
			$.fn.drleomarvinbabysteps.makeNotReady(inputItem);
		} else {
			$.fn.drleomarvinbabysteps.makeReady(inputItem);
		}
		return ready;
	};
	
	$.fn.drleomarvinbabysteps.isBabystepReady = function(inputItem) {
		if ( $(inputItem).hasClass('babystepReady') ) {
			return true;
		}
		return false;
	};
	
	$.fn.drleomarvinbabysteps.hasBeenAltered = function(inputItem) {
		if ($(inputItem).hasClass('babystepReady') || $(inputItem).hasClass('babystepNotReady')) {
			_console_dr_leo('has been altered');
			return true;
		}
		_console_dr_leo('has NOT been altered');
		return false;
	};
	
	
	$.fn.drleomarvinbabysteps.makeReady = function(theItem) {
		$(theItem).addClass('babystepReady');
		$(theItem).removeClass('babystepNotReady');
		_console_dr_leo('uiRequired determined ready');
	};
	
	$.fn.drleomarvinbabysteps.makeNotReady = function(theItem) {
		$(theItem).removeClass('babystepReady');
		$(theItem).addClass('babystepNotReady');
		_console_dr_leo('uiRequired determined NOT ready');
	};
	
	$.fn.drleomarvinbabysteps.hasError = function(theItem) {
		if ($(theItem).hasClass('input_error') ) {
			_console_dr_leo('uiRequired has error class');
			return true;
		}
		_console_dr_leo('uiRequired has NO error class');
		return false;
	};
	
	$.fn.drleomarvinbabysteps.doAutoSwitch = function(subForm) {
		return !$(subForm).hasClass('avoidAutoSwitch');
	};
	
	//private functions & properties:
}) (jQuery);
