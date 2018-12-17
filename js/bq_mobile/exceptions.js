// JavaScript Document for Globe Inquiry Site

/****** 
 * functions in this file *
 createQuery(form)
 SyncStates(astate), 
 WindowStatus(msg), 
 ValidateState(obj)
 ChangeState(thisValue,state, thisUrl)
 Allow2Options()
 getThisSelection(selection)
 ReloadPage(thisValue)
 checkContactInfo()
 showPolicy()
 hideSubmit()
*******/

function createQuery(form)
{
	var elements = form.elements;
	var pairs = new Array();

	pairs.push('tracking=ignore');
	for (var i = 0; i < elements.length; i++) {
		var element = elements[i];
		if ( element.name && element.value )
		{
			 var value = '';
			 if( element.type == 'select-one' )
				value = element[ element.selectedIndex ].value;
		   else if( element.type == 'radio' || element.type == 'checkbox' )
			 { 
				 if( element.checked )
					value = element.value;
			 }
		   else
			  value = element.value;
			 
			if( value.length )
				pairs.push(element.name + "=" + encodeURIComponent(value));
		}
	}
	return pairs.join("&");
}

function SyncStates(astate)
{
	var idx = astate.selectedIndex;

	if(document.forms[0]) document.forms['state'].state.selectedIndex = idx;
  else if (document.state) document.state.state.selectedIndex = idx;
  
	if(document.forms[1]) document.forms['adult'].state.selectedIndex = idx;
  else if (document.adult) document.adult.state.selectedIndex = idx;
  
	if(document.forms[2]) document.forms['child'].state.selectedIndex = idx;
  else if (document.child) document.child.state.selectedIndex = idx;

	return true;
}

function WindowStatus( msg )
{
	window.status = msg;
	return true;
}

function ValidateState( obj )
{
	 if( obj.state.selectedIndex == 0 )
	 {
	 	alert('Please choose a state and click GO again!')
	  	return false;
	 } 
	 return true;
}

var state = '';

function ChangeState(thisValue, thisform)
{
  document.forms[thisform].submit();
}
function InquireChangeState(thisValue, thisform)
{
  if ( (thisValue == 'NY' && state != 'NY') || (thisValue == 'MT' && state != 'MT') || (thisValue == 'UT' && state != 'UT') ||
       (thisValue != 'NY' && state == 'NY') || (thisValue != 'MT' && state == 'MT') || (thisValue != 'UT' && state == 'UT'))
    {
      document.getElementById('UpdatingPage').innerHTML = '<span style="color: white; font-weight: bold; font-size: 16px; padding-right: 50px;">Page is reloading. Please stand by ...</span>';
      $('div.UpdatingPage').show(1500).fadeIn("fast");
      setTimeout('ReloadPage1(\'' + thisValue + '\',\'' + thisform + '\')',1500);
    }
}
function ReloadPage1(thisValue, thisform)
{
  document.forms[thisform].action = '';
  document.forms[thisform].submit();
}

function Allow2Options() //This function only works on inquiry form.
{
	//prevent more than 2 selections of age boxes
	$(document).ready( function()
	{
		var checkCount = 0;
		//if they got to the page via Back button, there 
		//may already be boxes checked
		$( 'input[name^=age]' ).each( function()
		{
			if ( this.checked )
			{
				checkCount++;
			}
		});
		
		$( 'input[name^=age]' ).click( function(evt)
		{	
			if ( evt.target.checked )
			{
				checkCount++;
			}
			else
			{
				checkCount--;
			}
			if ( checkCount > 2 )
			{
			//	alert( "Only two selections are permitted." );
			  $('div.alertbox').show('fast');
				//lower the checked count since we are cancelling the last check event
				checkCount--;
				return false;	
			}
			else $('div.alertbox').hide('fast');
			//return false;	
		} )	;
	} ); 
}

  function getThisSelection(selection)
  {
    if (selection == 'existing_client') {
      $('div.contact_chooserHolder').show(500).fadeOut("fast");
      $('div.UpdatingPage_contact').show(1500).fadeIn("slow");
      setTimeout('ReloadPage(\'https://www.globeontheweb.com/eservicecenter/\')',2500);
    }
    else if (selection == 'other_question') {
      document.getElementById('chooser_holder').style.marginBottom = '0';
      document.getElementById('submit_form').style.display='block';
    }
    else alert ("Please choose a reason for contacting Globe Life & Accident Insurance");
  }
  
  function ReloadPage(thisValue)
  {
    document.location.href = thisValue;
  }
  
  function checkContactInfo()
  {
    if ( ((document.getElementById('globeAddress').value=='' || document.getElementById('globeCity').value=='' || document.getElementById('globeState').value=='')
         && (document.getElementById('globePhone').value=='') && (document.getElementById('globeEmail').value=='')) 
         || (document.getElementById('globeReason').value=='')  )
    {
        alert ("Globe Life Insurance would like to contact you regarding your question/comment below, but you will need to:\n\n 1) select a 'Reason for Inquiry' and \n\n 2) fill in at least one of the following: \n     A) your address, city, and state OR \n     B) your phone number OR \n     C) e-mail address.\n\nThank you for your understanding.");
        return false;
    }
    else if (document.getElementById('globeCaptcha').value=='' || document.getElementById('globeCaptcha').value=='')
    {
      alert ("Please complete the security check at the bottom of the form.");
      return false;
    }
    else return true;
  }
  
  function showPolicy()
  {
    var selectValue = document.getElementById('globeReason').value;
    if (selectValue == 'CustomerService' || selectValue == 'Other')
      $('div#policy_num').show(1500).fadeIn("fast");
  }
  
  function hideSubmit()
  {
    $('div#showSubmit').show(500).fadeOut("fast");
    $('div#showLoading').show(1500).fadeIn("slow");   
  }
