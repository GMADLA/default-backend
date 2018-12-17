// b500 JavaScript Document

var statesRequiringReload = new Array('NY','MT','UT','WA','MA');

function SetupFancyCheckbox(checkboxId) {
		
	// necessary for browsers that don't support the :hover pseudo class on labels
	
	var input = $('#'+checkboxId);
	var label = $('label[for='+checkboxId+']');
	
	$('.customCheckboxHolder').addClass('customCheckbox');	
	
	if(input.is(':checked')){ 
		label.addClass('checked');
	}	
	label.hover(
		function(){ 
			$(this).addClass('hover'); 
			if(input.is(':checked')){ 
				label.addClass('checked#Hover');
			}
		},
		function(){ $(this).removeClass('hover checkedHover'); }
	);
	
	//bind custom event, trigger it, bind click,focus,blur events					
	input.bind('updateState', function(){
		if (input.is(':checked')) {
			label.addClass('checked');
		}
		else { label.removeClass('checked checkedHover checkedFocus'); }			
	});
	input.click(function(){ 
		$(this).trigger('updateState');
	});
}

  function getThisSelection2(selection)
  {
    if (selection == 'existing_client') {
      $('div.contact_chooserHolder').show(500).fadeOut("fast");
      $('div.UpdatingPage_contact').show(1500).fadeIn("slow");
      setTimeout('loadNewWindows(\'https://www.globeontheweb.com/eservicecenter/\')',2500);
    }
    else if (selection == 'other_question') {
      $('#submit_form').fadeIn();
    }
    else alert ("Please choose a reason for contacting Globe Life & Accident Insurance");
  }

  function loadNewWindows(fullUrl)
  {	
  	var load = window.open( fullUrl,'GlobeOnTheWeb','scrollbars=yes,menubar=no,height=600,width=800,resizable=yes,toolbar=no,location=no,status=no');
  }
  
function child_popup_yes(sendToAppSite) {
	$('#childPopup').slideUp();
	$('#receipt_holder').slideDown();
	
	$.ajax({
        type: "GET",
        url: "/ajax_inquiry",
        dataType: "html",
        async: false,        
        data: "just_insert_policy=J",
        cache: false,
        success: function(result){ result }
	});

	if (sendToAppSite) postToAppSite();
	
	return false;
}

function child_popup_no(sendToAppSite) {
	$('#childPopup').slideUp();
	$('#receipt_holder').slideDown();
	
	if (sendToAppSite) postToAppSite();
	
	return false;
}


function postToAppSite() {
	$('#post_to_globe').submit();
}

function determinePageReloadByState(getStateValue,getOriginalStateValue) {
	for(var x=0; x<statesRequiringReload.length; x++) {
		if ( (getStateValue == statesRequiringReload[x] && getOriginalStateValue != statesRequiringReload[x]) || (getStateValue != statesRequiringReload[x] && getOriginalStateValue == statesRequiringReload[x]) ) {
			return true;
		}
	}	
	return false;
}

function checkStateAndShowForm() {
	var optimizeForUX = true;
	var getOriginalStateValue = $('#state').val();
	var getStateValue = $('#InquiryForm_state').val();
	
	if ( getStateValue != '') {
		var stateException = determinePageReloadByState(getStateValue,getOriginalStateValue);

  	var hiddenForm = $('.inquire_form_input_row').last().is(':hidden');
  	if(hiddenForm) {
  		if('function'==typeof(recordEventShowLongForm)) {
  			recordEventShowLongForm();
  		}
  	}
  
		if ( stateException ) {
			$('#state').val( $('#InquiryForm_state').val() );
			if (optimizeForUX) {
				var xdat = document.createElement('input');
				xdat.type="hidden"; 
				xdat.name="pre_inquiry"; 
				xdat.value = $('#inquiryForm').serialize();
				$('#stateForm').append(xdat);
			}
			$('#stateForm').submit();
			return true;
		}
		else {
			$('#state').val( $('#InquiryForm_state').val() );
			postStateByAjax(getStateValue);
			showStateForm();
		}
	}
}
/*
function checkStateAndShowForm() {
	var getOriginalStateValue = $('#state').val();
	var getStateValue = $('#InquiryForm_state').val();
	
	if ( getStateValue != '') {
		var stateException = determinePageReloadByState(getStateValue,getOriginalStateValue);

		if ( stateException ) {
			$('#state').val( $('#InquiryForm_state').val() );
			$('#stateForm').submit();
			return true;
		}
	}
}
*/

function postStateByAjax(stateValue) {
	$.ajax({
        type: "GET",
        url: "/ajax_dummypage",
        dataType: "html",
        async: false,        
        data: "state="+stateValue,
        cache: false,
        success: function(result){ result }
	});
}


function removeSpacesFromEmail(inputID) {
    $('#'+inputID).keyup(function() {
        var email_address = $('#'+inputID).val();
        var fixed_email_address = email_address.replace(/\s/g, '');
        $('#'+inputID).val(fixed_email_address);
    });
}
