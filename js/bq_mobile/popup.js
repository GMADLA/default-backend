/* Clicked YES on Child Popup */
function child_yes()
{
	var theForm = document.Inquire;

	window.autosubmit = false;
	theForm['button'].value = 'submit';
  theForm['juvenileHolder'].value = "Y";

  /* Autosubmit Juvenile keycode only */
	$.ajax({
        type: "GET",
        url: "autosubmit",
        dataType: "xml",
        data: "just_insert_policy=J",
        cache: false,
        success: function(result){ result; } });

	/* Code to track Yes clicks on Child popup */  
	var OmnEvents = new Array("event6");
	var GMADevents = new Array("gmadInquiryAddlJuvChosen=Y");
  CallThirdPartyEvent("exec_bus_event", "Child Pop - Clicked Yes", OmnEvents, GMADevents, theForm['omniture_uniq_id'].value);
	
  $('div.inquire_child').hide();
	
  //show the health popup? 
	if ( checkShowHealth( theForm ) )
	{
		$('div.healthLayer').show(1500).fadeIn("slow");   	
		return true;
	}
	else
	{
	 	$('div.loadingReceipt').show(); 
	  $('div.glInquiryHeaderText').text("Next: Get Your FREE Quote And Apply Online.");
		document.Inquire.submit();
	}
}

/* Clicked NO on Child Popup */
function child_no()
{
	var theForm = document.Inquire;
	
	window.autosubmit = false;
	theForm['button'].value = 'submit';

	/* Code to track No clicks on Child popup */  
	var OmnEvents = new Array("event7");
	var GMADevents = new Array("gmadInquiryAddlJuvChosen=N");
  CallThirdPartyEvent("exec_bus_event", "Child Pop - Clicked No", OmnEvents, GMADevents, theForm['omniture_uniq_id'].value);

  $('div.inquire_child').hide();
	//show the health popup?  
	if ( checkShowHealth( theForm ) )
	{
		$('div.healthLayer').show(1500).fadeIn("slow");
		return true;
	}
	else
	{
		$('div.loadingReceipt').show();
	  $('div.glInquiryHeaderText').text("Next: Get Your FREE Quote And Apply Online.");
		document.Inquire.submit();
	}
}

/* Check to see if site should show Health Popup */
function checkShowHealth(theForm)
{
  /****
   * We're no longer showing the health popup, so simply return false
   ****/
   return false;
}
