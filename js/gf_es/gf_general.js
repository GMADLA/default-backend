// JavaScript Document

function addAsyncScript(url) {
	var r = document.createElement('script');
	r.async=true;
	r.type='text/javascript';
	r.src=url;
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(r, s);
}



var currentTab = 1;
var performLoadAction = true;

var statesRequiringReload = new Array('NY','MT','UT',/*'MA',*/'WA');

function switchTabs(tabNumber) {
	if (currentTab==tabNumber) { var performLoadAction = false; }
	else { currentTab = tabNumber; var performLoadAction = true; }
	
	for (x=1; x<=3; x++) {
		if (x==tabNumber) $('#page_tab'+x).removeClass('page_tab_down').addClass('page_tab_up');
		else $('#page_tab'+x).removeClass('page_tab_up').addClass('page_tab_down');
	}
	if (tabNumber==3) {
		$('#page_tabs').attr('id','page_tabs_for_right_tab');
	}
	else {
		$('#page_tabs_for_right_tab').attr('id','page_tabs');
	}
	
}

function loadPage(pageURI) {
	if (performLoadAction==true) {
		var fullURI = pageURI + '?ajx=true';
		$.ajax({
			url: fullURI,
			dataType: 'html',
			cache: false,
			success: function(html){
			  $('#page_holder_middle div').fadeOut( function(){
			  	$('#page_holder_middle').html(html);
			  });
			}
			/** Put in error handling here **/
		});
		}
}


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

function determinePageReloadByState(getStateValue,getOriginalStateValue) {
	for(var x=0; x<statesRequiringReload.length; x++) {
		if ( (getStateValue == statesRequiringReload[x] && getOriginalStateValue != statesRequiringReload[x]) || (getStateValue != statesRequiringReload[x] && getOriginalStateValue == statesRequiringReload[x]) ) {
			return true;
		}
	}	
	return false;
}


function checkStateAndShowForm(showForm) {
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
			if (showForm==true) {
                showStateForm();
            }
		}
	}
}

function showStateForm() {
	$('#inquire_next_button').hide();
	$('.join_globe_message').slideUp('slow');
	$('.inquire_form_input_row').fadeIn('slow');
	$('.inquire_form_checkboxes').slideDown('slow');
	$('#inquire_form_submit').slideDown('slow');
	/* $('.join_globe_message').addClass('join_globe_message_left'); */
	$('.join_globe_message_left').slideDown('slow');
    $('.main-form-holder').addClass('show-full-form');
}

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

function checkStateAndReloadPage() {
	var stateVal = $(name='state').val();
	if ( stateVal != '' ) {
		$('#stateFormOnDetail').submit();
	}	
	return false;
}

var countArticles = 5;
var rememberPosition = 1;
function moveSlider(direction){
	// alert('here: ' + direction + ', rememberPosition=' + rememberPosition);
	if (direction == 'left' && rememberPosition > 1) {
		$('.article_slider_moving_box').animate({left: '+=274'});
		$('#article_slider_right').attr("src","/images/gf/article_slider_right_arrow_up.jpg");
		rememberPosition--;
	}
	else if (direction == 'right' && rememberPosition <= (countArticles-3)) {
		$('.article_slider_moving_box').animate({left: '-=274'});
		$('#article_slider_left').attr("src","/images/gf/article_slider_left_arrow_up.jpg");
		rememberPosition++;
	}

	if (rememberPosition==1) {
		$('#article_slider_left').attr("src","/images/gf/article_slider_left_arrow_down.jpg");
	}
	else if (rememberPosition==(countArticles-2)) {
		$('#article_slider_right').attr("src","/images/gf/article_slider_right_arrow_down.jpg");
	}
}


function child_popup_yes() {
	$('#childPopup').slideUp();
	$('#receipt_holder').slideDown();

    $.get('/ajaxaddchild', 'child_option=Y', function(response){
    	if (undefined!=response.redirect_to_appsite && true==response.redirect_to_appsite) {
    		postToAppSite();
    	}
	}, 'json');	
	return false;
}

function child_popup_no() {
	$('#childPopup').slideUp();
	$('#receipt_holder').slideDown();
	
    $.get('/ajaxaddchild', 'child_option=N', function(response){
    	if (undefined!=response.redirect_to_appsite && true==response.redirect_to_appsite) {
    		postToAppSite();
    	}
	}, 'json');	
	return false;
}

function postToAppSite() {
	$('#post_to_globe').submit();
}

if(typeof(renderFbLike)=='undefined') {
	function renderFbLike() {
		 /* (function(d, s, id) {
		    var js, fjs = d.getElementsByTagName(s)[0];
		    if (d.getElementById(id)) return;
		    js = d.createElement(s); js.id = id;
		    js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=328144860541863";
		    fjs.parentNode.insertBefore(js, fjs);
		  }(document, 'script', 'facebook-jssdk')); */

		$('#fb_like_div').html('<iframe src="//www.facebook.com/plugins/like.php?href=http%3A%2F%2Fwww.facebook.com%2Fpages%2FGlobe-Life-And-Accident-Insurance-Company%2F327814440569624&amp;send=false&amp;layout=button&amp;width=70&amp;show_faces=false&amp;action=like&amp;colorscheme=dark&amp;font=lucida+grande&amp;height=35&amp;share=false&amp;appId=328144860541863" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:53px; height:23px;" allowTransparency="true"></iframe>');
	}
}

if (typeof(renderGooglePlus)=='undefined') {
	function renderGooglePlus(){
		  (function() {
		    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
		    po.src = 'https://apis.google.com/js/plusone.js';
		    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
		  })();
	}	
}

function removeSpacesFromEmail(inputID) {
    $('#'+inputID).keyup(function() {
        var email_address = $('#'+inputID).val();
        var fixed_email_address = email_address.replace(/\s/g, '');
        $('#'+inputID).val(fixed_email_address);
    });
}

function prepopState() {
    	$.ajax({
            type: "GET",
            url: "/utils/get_state_by_ip.php",
            dataType: "json",
            async: true,        
            cache: false,
            success: function(result){
                if (typeof result === 'object' && result.status=='success' && result.region!='') {
                    $('.stateDropDown').val(result.region);
                    // $('#state').val(result.region);
                    checkStateAndShowForm(false);
                    di_cue('prepop_state_by_ip', result.region);
                }
            }
    	});
}

