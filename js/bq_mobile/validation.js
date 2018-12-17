function setSelectBox( obj, value )
{
		if(!obj) 
			return;
        if(value.length)
                for(var j=0; j<obj.length; j++)
                {
                        if(obj[j].value == value)
                        {
                               obj.selectedIndex = j;
                               break;
                        }
                }
}

function checkForErrors(getValue, error_class)
{
  if (getValue!='') {
    $("." + error_class + "_error").hide(); 
    $('#' + error_class).css("background","#F3FFF6");  
  }
  else {
    $("." + error_class + "_error").show(); 
    $('#' + error_class).css("background","#FFCDC9");
  }
}

function do_prefill( state )
{
		if(document.forms[0])
	        setSelectBox( document.forms[0].state, state );
		if(document.state)
	        setSelectBox( document.state.state, state );
		if(document.adult)
	        setSelectBox( document.adult.state, state );
		if(document.child)
	        setSelectBox( document.child.state, state );
}


/** This is the Checker function modified for Autosubmits **/
function AutoChecker (theFormName)
{
    var theForm = document.forms[theFormName];
    var isOk = validate_form(theForm, false);

    if( isOk )
    {
      if (theForm.clickedSubmitted.value != "true")
      {
        var OmnEvents = new Array("event16");
    	  var GMADevents = new Array("gmadInquirySubmissionMethod=autosubmit"); 
        CallThirdPartyEvent("exec_bus_event", "Submitted without a Checkbox", OmnEvents, GMADevents, theForm.omniture_uniq_id.value);        
        SetDefaults(theForm);
      }
    } 
    return isOk;
}


var second_try = false;

function Checker (theForm, page)
{
  $('#SubmitForm').hide();
    var isOk = validate_form (theForm, true);
    if( isOk && !second_try  )
    {
      second_try = true;
      isOk = VerifyChoices(theForm);
    } else if (isOk) SetDefaults(theForm);

		if(isOk)
		{	// This is not an automatic submission b/c javascript was activated by a click or "enter"
      autosubmit = false;
			theForm['button'].value = 'submit';
		}
		else { $('#SubmitForm').show(); }
		//tweak the action URL to reflect the users choice
    if( theForm['adult'].checked == true && theForm['juvenile'].checked == true )
		{
			theForm.action = page + '/combo';
		}
		else if ( theForm['juvenile'].checked == true )
		{
			theForm.action = page + '/child';
		}
		else
		{
			theForm.action = page + '/adult';
		}
		// return false;
    return isOk;
}

function SetDefaults (theForm)
{
  var adultChecked  = ( (theForm['adult'].checked == true && theForm['juvenile'].checked == false) ? true : false );
  var childChecked  = ( (theForm['adult'].checked == false && theForm['juvenile'].checked == true) ? true : false );
  var comboChecked  = ( (theForm['adult'].checked == true && theForm['juvenile'].checked == true) ? true : false );
  var noChecked     = ( (theForm['adult'].checked == false && theForm['juvenile'].checked == false) ? true : false ); 
  
	// Only when no boxes are checked
	if ( noChecked )
	{
  	/* Code to track Blank Form Checkboxes  */ 
    var OmnEvents = new Array("event2");
	  var GMADevents = new Array("gmadInquiryProductChosen=none"); 
    CallThirdPartyEvent("exec_bus_event", "Form boxes blank", OmnEvents, GMADevents, theForm['omniture_uniq_id'].value);
    theForm['adultHolder'].value = "Y";
  } 
  else
	{
    if (childChecked) { // Child Checked
      var OmnEvents = new Array("event4");
	    var GMADevents = new Array("gmadInquiryProductChosen=childSolo"); 
      CallThirdPartyEvent("exec_bus_event", "Checked Child on Form", OmnEvents, GMADevents, theForm['omniture_uniq_id'].value);
    } else if (comboChecked) { // Combo Checked
      var OmnEvents = new Array("event5");
	    var GMADevents = new Array("gmadInquiryProductChosen=combo"); 
      CallThirdPartyEvent("exec_bus_event", "Checked Combo on Form", OmnEvents, GMADevents, theForm['omniture_uniq_id'].value);
    } else { // Adult Checked
      var OmnEvents = new Array("event3"); 
	    var GMADevents = new Array("gmadInquiryProductChosen=adultSolo"); 
      CallThirdPartyEvent("exec_bus_event", "Checked Adult on Form", OmnEvents, GMADevents, theForm['omniture_uniq_id'].value);
    }
	}
	return true;
}

function VerifyChoices (theForm)
{
    SetDefaults(theForm);
		if (theForm['juvenile'].checked == false  ) {
    	var PageNameArray = new Array();
      var OmnEvents = new Array("event10");
	    var GMADevents = new Array("gmadInquiryAddlJuvOffered=true");   
    	PageNameArray['PageName'] = 'Child Popup';
      CallThirdPartyEvent("exec_bus_event_and_pagename", "Child Popup Offered", OmnEvents, GMADevents, theForm['omniture_uniq_id'].value, PageNameArray);  
          
      $('div.inquire_holder').hide(1500).fadeOut("slow");     
      $('div.inquire_child').show(1500).fadeIn("slow");                 
			return false;
    } 
    else if ( checkShowHealth(document.Inquire) ) {   
      var OmnEvents = new Array();
	    var GMADevents = new Array("gmadInquiryAddlJuvOffered=false"); 
      CallThirdPartyEvent("exec_bus_event", "Clicked Child checkbox, Child Popup NOT Shown", OmnEvents, GMADevents, "", PageNameArray);  
 
      $('div.inquire_holder').hide(1500).fadeOut("slow");     
      $('div.healthLayer').show(1500).fadeIn("slow");         
			return false;
    }
    else {
      var OmnEvents = new Array();
	    var GMADevents = new Array("gmadInquiryAddlJuvOffered=false"); 
      CallThirdPartyEvent("exec_bus_event", "Clicked Child checkbox, Child Popup NOT Shown", OmnEvents, GMADevents, "", PageNameArray);  
 
      $('div.inquire_holder').hide("fast");
	    $('div.loadingReceipt').show(1500).fadeIn("fast"); 
	    $('div.glInquiryHeaderText').text("Next: Get Your FREE Quote And Apply Online"); 
      return true;
    }
}

/******
 * NEW INQUIRY FORM
 * The new Inquiry form uses the following functions: 
 *  AutoChecker2(), Checker2()  
 *  
 ******/

/** This is the Checker function modified for Autosubmits **/
function AutoChecker2 (theFormName)
{
    var theForm = document.forms[theFormName];
    var isOk = validate_form(theForm, false);

    if( isOk )
    {
      if (theForm.clickedSubmitted.value != "true")
      {
        var OmnEvents = new Array("event16");
    	  var GMADevents = new Array("gmadInquirySubmissionMethod=autosubmit"); 
        CallThirdPartyEvent("exec_bus_event", "Submitted without a Checkbox", OmnEvents, GMADevents, theForm.omniture_uniq_id.value);        
        SetDefaults2(theForm);
      }
    } 

    return isOk;
}


function Checker2 (theForm, page)
{

    var isOk = validate_form(theForm, true);
    if( isOk && !second_try  )
    {
      second_try = true;
      isOk = VerifyChoices2(theForm);
    } else if (isOk) SetDefaults(theForm);

		if(isOk)
		{	// This is not an automatic submission b/c javascript was activated by a click or "enter"
      autosubmit = false;
			theForm['button'].value = 'submit';
		}	
		
		if( theForm['policy_type'].value == 'combo' )
		{
			theForm.action = page + '/combo';
		}
		else if ( theForm['policy_type'].value == 'juvenile' )
		{
			theForm.action = page + '/child';
		}
		else
		{
			theForm.action = page + '/adult';
		}
		
		// return false;
    return isOk;
}

function SetDefaults2 (theForm)
{
  var adultChecked  = ( (theForm['policy_type'].value == 'adult') ? true : false );
  var childChecked  = ( (theForm['policy_type'].value == 'juvenile') ? true : false );
  var comboChecked  = ( (theForm['policy_type'].value == 'combo') ? true : false );
  var noChecked     = ( (theForm['policy_type'].value == '') ? true : false );   
  
	if ( noChecked )
	{
  	/* Code to track Blank Form Checkboxes  */ 
    var OmnEvents = new Array("event2");
	  var GMADevents = new Array("gmadInquiryProductChosen=none"); 
    CallThirdPartyEvent("exec_bus_event", "Form boxes blank", OmnEvents, GMADevents, theForm['omniture_uniq_id'].value);
    theForm['adultHolder'].value = "Y";
  } 
  else
	{
    if (childChecked) { // Child Checked
      var OmnEvents = new Array("event4");
	    var GMADevents = new Array("gmadInquiryProductChosen=childSolo"); 
      CallThirdPartyEvent("exec_bus_event", "Checked Child on Form", OmnEvents, GMADevents, theForm['omniture_uniq_id'].value);
    } else if (comboChecked) { // Combo Checked
      var OmnEvents = new Array("event5");
	    var GMADevents = new Array("gmadInquiryProductChosen=combo"); 
      CallThirdPartyEvent("exec_bus_event", "Checked Combo on Form", OmnEvents, GMADevents, theForm['omniture_uniq_id'].value);
    } else { // Adult Checked
      var OmnEvents = new Array("event3"); 
	    var GMADevents = new Array("gmadInquiryProductChosen=adultSolo"); 
      CallThirdPartyEvent("exec_bus_event", "Checked Adult on Form", OmnEvents, GMADevents, theForm['omniture_uniq_id'].value);
    }
	}
	return true;
}

function VerifyChoices2 (theForm)
{   
    SetDefaults2(theForm);
		if (theForm['policy_type'].value == 'adult' ) {
    	var PageNameArray = new Array();
      var OmnEvents = new Array("event10");
	    var GMADevents = new Array("gmadInquiryAddlJuvOffered=true");   
    	PageNameArray['PageName'] = 'Child Popup';
      CallThirdPartyEvent("exec_bus_event_and_pagename", "Child Popup Offered", OmnEvents, GMADevents, theForm['omniture_uniq_id'].value, PageNameArray);  
          
      $('div.inquire_holder').hide(1500).fadeOut("slow");     
      $('div.inquire_child').show(1500).fadeIn("slow");                 
			return false;
    } 
    else if ( checkShowHealth(document.Inquire) ) {   
      var OmnEvents = new Array();
	    var GMADevents = new Array("gmadInquiryAddlJuvOffered=false"); 
      CallThirdPartyEvent("exec_bus_event", "Clicked Child checkbox, Child Popup NOT Shown", OmnEvents, GMADevents, "", PageNameArray);  
 
      $('div.inquire_holder').hide(1500).fadeOut("slow");     
      $('div.healthLayer').show(1500).fadeIn("slow");         
			return false;
    }
    else {
      var OmnEvents = new Array();
	    var GMADevents = new Array("gmadInquiryAddlJuvOffered=false"); 
      CallThirdPartyEvent("exec_bus_event", "Clicked Child checkbox, Child Popup NOT Shown", OmnEvents, GMADevents, "", PageNameArray);  
 
      $('div.inquire_holder').hide("fast");
	    $('div.loadingReceipt').show(1500).fadeIn("fast"); 
      return true;
    }    
}

/** End of NEW INQUIRY FORM  **/


function FormElement(name,description,validator,type)
{
        this.name = name;               //name of the <INPUT> to validate, ex: 'bdate'
        this.description = description; //description of the field, ex: 'Birthdate'
        this.validator = validator;     //validation pattern to match against, ex: 'datePat'
        this.type = type                //description of what type of data this should be, ex: 'date'
}

var PatternsDict = new Object();
    PatternsDict.textPat = /.+/;				// matches any text
    PatternsDict.zipPat = /^\d{5}(-\d{4})?$/;	// matches zip+4 (+4 is optional)
    PatternsDict.numbPat = /^\d+?$/;	// matches zip+4 (+4 is optional)
    PatternsDict.codePat = /^\d{4}$/; 

fe = new Array();
fe[0] = new FormElement('line1', 'Street Address', 'textPat', 'address');
fe[1] = new FormElement('city',  'City',           'textPat', 'city');
fe[2] = new FormElement('state', 'State',          'textPat', 'selection');
fe[3] = new FormElement('zip',   'Zip',            'textPat',  'zip code');

function validate_form(theForm,showAlert)
{
  var toReturn = true;
  var toAlert = '';
  if (!PatternsDict['textPat'].exec(document.Inquire.fname.value))
  { 
    toAlert += '- First Name cannot be blank!\n';  
		if (showAlert) { 
        document.Inquire.fname.focus();
        $('#fname').css("background","#FFCDC9"); 
    }
  }
  if (!PatternsDict['textPat'].exec(document.Inquire.lname.value))
  { 
    toAlert += '- Last Name cannot be blank!\n';  
		if (showAlert) { 
        document.Inquire.lname.focus();
        $('#lname').css("background","#FFCDC9"); 
    }
  }  
  if (!PatternsDict['textPat'].exec(document.Inquire.line1.value))
  { 
    toAlert += '- Street address does not contain a valid address!\n';  
		if (showAlert) { 
        document.Inquire.line1.focus();
        $('#line1').css("background","#FFCDC9"); 
    }
  }
  if ((!PatternsDict['textPat'].exec(document.Inquire.city.value) && !PatternsDict['zipPat'].exec(document.Inquire.zip.value)) )
    { 
      if (!PatternsDict['textPat'].exec(document.Inquire.city.value)) {
        toAlert += '- City does not contain a valid city!\n';
        if (showAlert) $('#city').css("background","#FFCDC9");         
      }
      if (!PatternsDict['numbPat'].exec(document.Inquire.zip.value)) {
        toAlert += '- Zip Code does not contain a valid zip!\n';
        if (showAlert) $('#zip').css("background","#FFCDC9");      
      }  
  		if (showAlert) document.Inquire.city.focus();
    }
  if (!PatternsDict['textPat'].exec(document.Inquire.state.value))
  { 
    toAlert += '- Please choose a State!\n';
    if (showAlert) $('#state').css("background","#FFCDC9");  
  }
	if (toAlert!='' && showAlert) {
    alert (toAlert + 'Please enter this information before proceeding.');
  	var toReturn = false;  
  }
 return toReturn;
}

function AlertUsers()
{
  alert('Please select a policy before filling out this form');
}

function RolloverButtons(product,overStatus)
{
  if (overStatus=="over") var endOfName = 'down.jpg';
  else var endOfName = 'up.jpg';

  var filename = "/img/blue/gl_" + product + "_button_p2_" + endOfName;
  $('#' + product + '_info_button').attr({src: filename});     
}

function ChangePolicyPics(thisValue)
{
  $('#form_table').unbind("click");
  
  $('div#inquiry_main_buttons').fadeOut("fast");
  $('div#inquire_top_message').html("Enter your name and address in the form below:");
  $('div.inquiry_small_buttons').fadeIn("fast");
  $('div.glInquiryFormType').fadeIn("fast");
  $('div#InquirySubmitButton').fadeIn("fast");  
  $('input.glSubmitButton').show(1500).fadeIn("slow");

  if (thisValue == "adult") {
    $('#adultPic').attr({src: "/img/blue/glinquiry_adultPic.jpg"}); 
    $('#childPic').attr({src: "/img/blue/glinquiry_childPic-gray.jpg"});    
    $('#comboPic').attr({src: "/img/blue/glinquiry_familyPic-gray.jpg"}); 
    document.getElementById('policy_type').value = "adult";
  }
  else if (thisValue == "juvenile") {
    $('#adultPic').attr({src: "/img/blue/glinquiry_adultPic-gray.jpg"}); 
    $('#childPic').attr({src: "/img/blue/glinquiry_childPic.jpg"});    
    $('#comboPic').attr({src: "/img/blue/glinquiry_familyPic-gray.jpg"});       
    document.getElementById('policy_type').value = "juvenile";
  }
  else if (thisValue == "combo") {
    $('#adultPic').attr({src: "/img/blue/glinquiry_adultPic-gray.jpg"}); 
    $('#childPic').attr({src: "/img/blue/glinquiry_childPic-gray.jpg"});    
    $('#comboPic').attr({src: "/img/blue/glinquiry_familyPic.jpg"});     
    document.getElementById('policy_type').value = "combo";
  }
} 
