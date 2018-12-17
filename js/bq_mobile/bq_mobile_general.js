// JavaScript Document

var statesRequiringReload = new Array('NY','MT','UT',/*'MA',*/'WA');

$(document).ready(function() {
  $(".stateSelect_autochange").change(function(event) {
  		var stateValue=$(this).val();
  		$('.stateSelect_autochange').val(stateValue);
  		$(this).closest("form").submit();
  })
});

var menuOpen = false;
function showHideMenu() {
  if (!menuOpen) {
    $('.top_menu').fadeIn(); 
    $('.top_menu_click_to_show').hide(); 
    $('.top_menu_click_to_hide').show(); 
    $('#top_menu_layer_blocker').show();
    menuOpen = true;
  }
  else {
    $('.top_menu').fadeOut(); 
    $('.top_menu_click_to_hide').hide(); 
    $('.top_menu_click_to_show').show(); 
    $('#top_menu_layer_blocker').hide();
    menuOpen = false;
  }
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
	$('#stateFormOnDetail').submit();
	return false;
	/*
	var stateVal = $(name='state');
	if ( stateVal != '' ) {
		$('#stateFormOnDetail').submit();
	}
	return false;
	*/
}

function checkIfSubmitOrExpand(showForm) 
{
	var getStateValue = $("#state_chooser").val();
	if (getStateValue!=undefined && getStateValue!="") 
	{    
		var getOriginalStateValue = $('#state').val();
		var stateException = determinePageReloadByState( getStateValue, getOriginalStateValue );
		if ( stateException ) {
			$('#state').val( getStateValue );
			$('#homepage_state_chooser').submit();
			return true;
		}
		
		var hiddenForm = $('.mainpage_form').is(':hidden');
		if (hiddenForm) {
			if('function'==typeof(recordEventMainMobileForm)) {
				recordEventMainMobileForm();
			}
		}
		if (showForm==true) {
		  showMainForm();
        }      
		$('#InquiryForm_state').val( getStateValue );
		
		postStateByAjax(getStateValue);
		// window.location.href = '#formtop';
		return false;
	}
  else return false;
}

function showMainForm() {
	$('.more_info').hide();
    $('.list_header').slideUp();
    $('#slogan').slideUp('slow');
    $('.mainpage_form').slideDown();
}

function checkStateForRefresh() {
	var optimizeForUX = true;
	var getOriginalStateValue = $('#state').val();
	var getStateValue = $('#InquiryForm_state').val();
	
	if ( getStateValue != '') {
		var stateException = determinePageReloadByState(getStateValue,getOriginalStateValue);

		if ( stateException ) {
			$('#state').val( $('#InquiryForm_state').val() );
			if (optimizeForUX) {
				var xdat = document.createElement('input');
				xdat.type="hidden"; 
				xdat.name="pre_inquiry"; 
				xdat.value = $('#inquiryFormMobile').serialize();
				$('#stateForm').append(xdat);
			}
			$('#stateForm').submit();
			return true;
		}
	}
}

function checkForChildBox() {
  if (!$('#InquiryFormMobile_juvenile').attr('checked')) {
    $('.juv_add_promo').slideDown('slow');
    $('.mainpage_form').slideUp('slow');
    return false;
  }
}

function lastFunctionsBeforeSubmit(hasError) {
  if (hasError===false) {
  $('.mainpage_form').slideUp('slow');
  }
  return true;
}

function determinePageReloadByState(getStateValue,getOriginalStateValue) {
	for(var x=0; x<statesRequiringReload.length; x++) {
		if ( (getStateValue == statesRequiringReload[x] && getOriginalStateValue != statesRequiringReload[x]) || (getStateValue != statesRequiringReload[x] && getOriginalStateValue == statesRequiringReload[x]) ) {
			return true;
		}
	}	
	return false;
}

function ExpandAdultBox() {
  var visible = $('#adult_choose_state').toggle().is(":visible");
  if (visible) {
    $('#arrow_right_adult').attr('src','/images/bq_mobile/buttons/red_arrow_down.png');
  } else { 
    $('#arrow_right_adult').attr('src','/images/bq_mobile/buttons/red_arrow_right.png');
  }
}

function ExpandChildBox() {
  var visible = $('#child_choose_state').toggle().is(":visible");
  if (visible) {
    $('#arrow_right_child').attr('src','/images/bq_mobile/buttons/red_arrow_down.png');
  } else { 
    $('#arrow_right_child').attr('src','/images/bq_mobile/buttons/red_arrow_right.png');
  }
}



function child_popup_yes() {
    $.get('ajaxaddchild', 'child_option=Y', function(response){
    	/*
    	if (undefined!=response.redirect_to_appsite && true==response.redirect_to_appsite) {
    		postToAppSite();
    	}
    	*/
	}, 'json');	
	return true;
}

function child_popup_no() {
    $.get('ajaxaddchild', 'child_option=N', function(response){
    	/*
    	if (undefined!=response.redirect_to_appsite && true==response.redirect_to_appsite) {
    		postToAppSite();	
    	}
    	*/
	}, 'json');	
    return true;
}




var ArticleNum = 1;

function getNextArticle(ArticleMax) {
  if ( ArticleNum < ArticleMax ) {
    $('#article_list_'+ArticleNum).hide();
    $('#article_list_'+(ArticleNum+1)).show();
    ArticleNum++;
    $('#current_article_num').html(ArticleNum);
    if (ArticleNum==ArticleMax) {
      $('#article_right_arrow').attr('src','/images/bq_mobile/buttons/gray_arrow_right.png');
    } else
      $('#article_right_arrow').attr('src','/images/bq_mobile/buttons/blue_arrow_right.png');
    $('#article_left_arrow').attr('src','/images/bq_mobile/buttons/blue_arrow_left.png');
  }
  else {
    $('#article_right_arrow').attr('src','/images/bq_mobile/buttons/gray_arrow_right.png');
  }
}
function getPrevArticle(ArticleMax) {
  if ( ArticleNum > 1 ) {
    $('#article_list_'+ArticleNum).hide();
    $('#article_list_'+(ArticleNum-1)).show();

    $('#article_left_arrow').attr('src','/images/bq_mobile/buttons/blue_arrow_left.png');
    ArticleNum--;
    $('#current_article_num').html(ArticleNum);
    if (ArticleNum==1)
      $('#article_left_arrow').attr('src','/images/bq_mobile/buttons/gray_arrow_left.png');
    else
      $('#article_left_arrow').attr('src','/images/bq_mobile/buttons/blue_arrow_left.png');
    $('#article_right_arrow').attr('src','/images/bq_mobile/buttons/blue_arrow_right.png');
  }
  else {
    $('#article_left_arrow').attr('src','/images/bq_mobile/buttons/gray_arrow_left.png');
  }
}
function removeSpacesFromEmail(inputID) {
    $('#'+inputID).blur(function() {
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
                    var stateValue = result.region;
                    $('#state_chooser').val(stateValue);
                    // $('#state').val(result.region);
                    //checkIfSubmitOrExpand(false);   
                    postStateByAjax(stateValue);
                    di_cue('prepop_state_by_ip', stateValue); 
                    var getOriginalStateValue = $('#state').val();
  
		            var stateException = determinePageReloadByState( stateValue, getOriginalStateValue );
                    if (stateException) {
                        $('#state').val(result.region);
                        location.reload();
                    }                         
                }
            }
    	});
}

