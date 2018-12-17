gmad_console_debug_mode=false;	//allow logging

//logger
if ( (typeof gmad_console)!=='function') {
	if ( (typeof console)!=='object') {
		function gmad_console(msg) {}
	} else {
		function gmad_console(msg) {
			if (gmad_console_debug_mode===true) {
				console.log(msg);
			}
		}
	}
}

// extend standard js
if (!String.prototype.trim) {
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g,'');
	};
}

//global functions and objects
function isDefined(test) {
	return (typeof test !== 'undefined');
}

var menuOpen = false;
function showHideMenu() {
  if (!menuOpen) {
    $('#headerMenu1').fadeIn();
    $('.top_menu_click_to_show').hide();
    $('.top_menu_click_to_hide').show();
    $('#top_menu_layer_blocker').show();
    menuOpen = true;
  }
  else {
    $('#headerMenu1').fadeOut();
    $('.top_menu_click_to_hide').hide();
    $('.top_menu_click_to_show').show();
    $('#top_menu_layer_blocker').hide();
    menuOpen = false;
  }
}

function lockThisElement(element, millisToLock, hide) {
	if (millisToLock!=undefined && millisToLock>0) {
		if (hide==undefined) hide=false;
		var e = $(element);
		e.attr('disabled','disabled');
		if (hide)
			e.hide();
		setTimeout( function() {
			e.removeAttr('disabled');
			if (hide)
				e.show();
		} , millisToLock);
	}
}

//
// GmadAppForm class and sublcasses expect a global variables named GmadAppForm to exist!
//


GmadUtils = {
	regexEmail: /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/,
	asCssClass: function(className) {
		return '.'+className;
	},
	asId: function(className) {
		return '#'+className;
	},
	isChecked: function(node) {
		var checked = $(node).attr('checked');
		if ( !isDefined(checked) || checked!=='checked') {
			return false;
		}
		return true;
	},
	isValueEmpty: function(node) {
		return ( $(node).val().trim().length===0 );
	},
	validateLength: function(strValue, min, max) { //max is exclusive
		var len=strValue.length;
		if (len<min || len>=max) {
			return false;
		}
		return true;
	},
	isEmail: function(strEmail) {
		return GmadUtils.regexEmail.test(strEmail);
	},
	isDefined: function(test) {
		return (typeof test !== 'undefined');
	},

	validateType:	function(thisValue, type) {
		if (type && thisValue)
		{
			var regE = false;
			if (type === 'chars')
				regE = /^[a-zA-Z]*\s{0,1}[a-zA-Z]*\s*$/i;
			else if (type === 'state')
				regE = /^[a-zA-Z]{2,}$/;
			else if (type === 'numbers')
				regE = /^[0-9]*$/;
			else if (type === 'zip')
				regE = /^[0-9]{5}$/;
			else if (type === 'zipplusfour')
				regE = /^[0-9]{4}$/;
			else if (type === 'phone')
				regE  = /^[1-9]\d{2}\-?\d{3}\-?\d{4}$/;
			else if (type === 'email')
				regE  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

			if (regE && !regE.test(thisValue)) {
				return false;
			} else {
				return true;
			}
		}
		return false;
	}
};
// end Static Objects






// Gmad Prototypes:

function CGmadException(msg, htmlMsg, name, level, exceptionObject) {
	if (!isDefined(exceptionObject)) {
		return {
			name:		isDefined(name)		? name	:	"noName",
			level:		isDefined(level) 	? level 	: "noLevel",
			msg:		msg,//required
			htmlMsg:	isDefined(htmlMsg)	? htmlMsg 	: ""
		};
	} else {
		exceptionObject.name 		= name;
		exceptionObject.level 		= level;
		exceptionObject.msg			= msg;
		exceptionObject.htmlMsg		= htmlMsg;
		return exceptionObject;
	}
}





//=====================================================================================
// CGmadAppForm component:
//=====================================================================================
function CGmadAppForm(strIdFormName) {
	this.myThis=this;
	this.formId		= strIdFormName;
	this.bValid=false;
	this.cssClassCustomValidation='gen_validation_err';

	this.callbackUpdateAjaxResult = function(pageResult) {
		$('#main_form_loading_overlay').fadeIn();
		try {
			var container=$('#page_holder_middle');
			$('#div_main_form_holder').fadeOut( function(){
				container.html(pageResult);
				$('#div_main_form_holder').fadeIn();
        $('input').filter(':visible:first').focus();
			});
			// container.css('border','1px solid red'); // use for debugging ONLY
		} catch(e) {
			gmad_console(e);
		}
	};

	this.ajaxAfterValidateObject = {//default
        type: "POST",
        url: "app_form_ajax",
        dataType: "html",
        async: false,
        data: '',	// must be overriden
        cache: false,
        success: this.callbackUpdateAjaxResult,
		error: this.ajaxFailMessage
	};

	this.ajaxNavigateObject = { //default
        type: "get",
        url: '',	// must be overriden
        dataType: "html",
        async: false,
        cache: false,
        success: function(pageResult){
        	this.callbackUpdateAjaxResult(pageResult);
		},
		error: function(){this.ajaxFailMessage();}
	};

	this.navigationDirection = function(formElement, dir) {}//

};

CGmadAppForm.prototype.validate		= function() {
	return true;	// abstract method
};

// CGmadAppForm method definition
CGmadAppForm.prototype.afterValidateAjax = function(form, data, hasError){
	if (typeof GmadAppForm ==='undefined') {
		throw new exception('Misconfigured javascript for app form');
	}
	if (hasError===false) {
		var appFormObject = GmadAppForm; // GLobal, because this is essentially a yii callback implementation
		gmad_console('Ajax Send!');
		if (!hasError) {
			var getFormData = $(form).serialize();
			var ajaxSend = appFormObject.ajaxAfterValidateObject;
			ajaxSend.data = getFormData;
			ajaxSend.success = appFormObject.callbackUpdateAjaxResult;
			$.ajax(ajaxSend);
		}
	}
	return false;
};

CGmadAppForm.prototype.ajaxFailMessage = function() {
	gmad_console('Ajax Failed!');
};

CGmadAppForm.prototype.ajaxNavigate = function(ajaxUrl, appFormObject) {
	gmad_console('Ajax Navigate');
	var ajaxSend = appFormObject.ajaxNavigateObject;
	ajaxSend.url = ajaxUrl;
	gmad_console('AJAX URL : ' + ajaxUrl);
	ajaxSend.success = appFormObject.callbackUpdateAjaxResult;
	$.ajax(ajaxSend);
	return false;
};


CGmadAppForm.prototype.getYiiErrorNode	= function(idPrefix, questionNumber, applicantNumber, attribute, suffix) {//TODO: refactor so this is used
	var d='_';//delimiter
	var selector = idPrefix +d+applicantNumber +d+questionNumber +d+attribute;
	if (isDefined(suffix)) {
		selector += d+suffix;
	}
	var item = $(GmadUtils.asId(selector));
	if (item === null) {
		return false;
	}
	return item;
};

CGmadAppForm.prototype.helpGetInfoFromYiiAttribute 		= function(node) {
	var nodeId = $(node).attr('id');
	var parts=nodeId.split('_');
	var addrCount=(parts[2]) ? parts[2] : FALSE;
	return [parts[1],addrCount];
};
CGmadAppForm.prototype.helpGetInfoFromYiiAttributeId		= function(nodeId) {
	var node = $(node);
	return this.helpGetInfoFromYiiAttribute(node);
};

// static method defintions
CGmadAppForm.prototype.helpGetArrayCounters = function(nodeId) {
	var parts=nodeId.split('_');
	var addrCount=(parts[2]) ? parts[2] : FALSE;
	return new Array(parts[1],addrCount);
};
//CGmadAppForm method definition
CGmadAppForm.prototype.getArrayCountsFromNode = function(node) {
	return this.helpGetArrayCounters($(node).attr('id'));
};


//=====================================================================================




//=====================================================================================
// ChooseQuote component
//=====================================================================================
CGmadChooseQuote.prototype = new CGmadAppForm();
function CGmadChooseQuote( arrQuoteOptionElementIds ) {
	CGmadAppForm.apply(this,arguments);//super()
	this.arrayOptionIds = arrQuoteOptionElementIds;
}


CGmadChooseQuote.prototype.validate = function() {
	var bValid = false;
	for(var i=0; i < this.arrayOptionIds.length; i++) {
		var node=$("#"+this.arrayOptionIds[i]);
		if (isDefined(node) && GmadUtils.isChecked(node)) {
			bValid = true;	break;
		}
	}
	if (bValid) {
		return true;
	} else {
		return false;
	}
};


//=====================================================================================



//=====================================================================================
//Beneficiary // NOTE: Depends on arrBeneficiaryObjects being defined
//=====================================================================================
CGmadBeneficiary.prototype = new CGmadAppForm();
function CGmadBeneficiary(criteria, beneCounter) {
	CGmadAppForm.apply(this,arguments);//super()
	this.criteriaCheckExplanation=criteria;
	this.checkExplanation=false;
	this.explanationErrorMessage='Please explain "Other" relationship.';


	this.validateOtherBeneficiary=function(beneRelationshipElem, otherDescrElement) {
		var other = 'Other';
		beneRelationshipElem=$(beneRelationshipElem);
		otherDescrElement=$(otherDescrElement);
		var thisVal = beneRelationshipElem.val();
		this.checkExplanation = (thisVal === other);
		if (this.checkExplanation) {
			otherDescrElement.removeClass('uiSpecialRequired');	// play nicely with dr leo please!
		} else {
			otherDescrElement.addClass('uiSpecialRequired');
		}
		//otherDescrElement.trigger('gmadYiiValidate');
		if (this.checkExplanation) {
			otherDescrElement.parent().slideDown();
		} else {
			otherDescrElement.parent().slideUp();
			otherDescrElement.val('');
		}
		return false;
	}

}

CGmadBeneficiary.prototype.afterValidateAttributeRelationship = function(form, attribute, data, hasError) {
	var _id = attribute.inputID.replace(/Beneficiary_(\d+)_\S+/,'$1');
	var myThis = arrBeneficiaryObjects[_id];	//global reference
	if (!hasError && attribute.value === myThis.criteriaCheckExplanation) {
		myThis.checkExplanation=true;
	} else {
		myThis.checkExplanation=false;
	}
};
CGmadBeneficiary.prototype.beforeValidateAttributeExplanation = function(form,attribute) {
	var _id = attribute.inputID.replace(/Beneficiary_(\d+)_\S+/,'$1');
	var myThis = arrBeneficiaryObjects[_id];	//global reference
	var error=!myThis.validateExplanation(attribute.id);
	if (error) {
		var attr = $(GmadUtils.asId(attribute.id));
		var msgs=null;
		if(attr.val().length===0) {
			error=true;
			msgs=[];
			var attrMsgs=[];
			attrMsgs[0] = myThis.explanationErrorMessage;
			msgs[attribute.id] = attrMsgs;
		} else {
			$('#'+attribute.id).removeClass('errors');
		}
		//$(form).yiiactiveform.updateInput(attribute, msgs, $(form));
		form = $(form);
		$.fn.yiiactiveform.updateInput(attribute, msgs, form);
	}
	return !error;
};
CGmadBeneficiary.prototype.validateExplanation = function(attrId) {
	var _id = attrId.replace(/Beneficiary_(\d+)_\S+/,'$1');
	var myThis = arrBeneficiaryObjects[_id];	//global reference
	var attr=$("#"+attrId);
	if (myThis.checkExplanation && attr.val().length===0) {
		return false;
	}
	return true;
}
//=====================================================================================




//=====================================================================================
//HEALTH QUESTIONS COMPONENT:
//=====================================================================================
CGmadHealthQuestions.prototype = new CGmadAppForm();
function CGmadHealthQuestions() {
	CGmadAppForm.apply(this,arguments);//super()
	this.radioYes = 'Y';
	this.radioNo = 'N';
}

CGmadHealthQuestions.prototype.hideErrors	= function(optionalCssClass) {
	if (!isDefined(optionalCssClass)) {
		optionalCssClass = this.cssClassCustomValidation;
	}
	$('.'+optionalCssClass).hide();
};

CGmadHealthQuestions.prototype.postRenderFilter		= function(){

};

CGmadHealthQuestions.prototype.getErrorNode			= function(postFix) {
	var thisObject=this;
	var node = $('#ChildHealthQuestion'+postFix);
	if (node.length===0) {
		node = $('#HealthQuestion'+postFix);
	}
	if (node.length===0) {
		return false;
	}
	return node;
};

CGmadHealthQuestions.prototype.pushErrorMessage		= function(msg, postFix) {
	var thisObject=this;
	var node = thisObject.getErrorNode(postFix);
	if(node!=false) {
		node.html(msg);
		node.show();
		return true;
	}
};
CGmadHealthQuestions.prototype.removeErrorMessage	= function(postFix) {
	var thisObject=this;
	var node = thisObject.getErrorNode(postFix);
	if (node!==false) {
		node.hide();
	}
};

CGmadHealthQuestions.prototype.showLongAnswer		= function(answerValue,appCounter,questNumber) {
	if (answerValue==='Y') {
		$('#longAnswerHolder_'+appCounter+'_'+questNumber).fadeIn();
	} else {
		$('#longAnswerHolder_'+appCounter+'_'+questNumber).hide();
	}
	$('#HealthQuestion_'+appCounter+'_'+questNumber+'_shortAnswer').val(answerValue);
};

CGmadHealthQuestions.prototype.validate		= function() {
	var thisObject = this;
	var valid=true;
	$('.check_radio_onload').filter('[value=Y]').each(function(i,v){
		var chkAttr=$(this).attr('checked');
		if ( isDefined(chkAttr) && chkAttr==='checked') {
			parts=thisObject.getArrayCountsFromNode($(this));
			appCounter=parts[0];
			questNumber=parts[1];
			var partialId='#HealthQuestion_'+appCounter+'_'+questNumber;
			var node=$(partialId+'_longAnswer');
			if ( GmadUtils.isValueEmpty(node) ) {
				//error:
				node=$(partialId+'_longAnswer_em_');
				node.html('Please explain your "Yes" answer:');
				node.show();
				this.bValid=valid=false;
			} else {
				node=$(partialId+'_longAnswer_em_');
				node.hide();
			}
		}
	});
	return valid;
};
//=====================================================================================




//=====================================================================================
// CHILD HEALTH QUESTIONS COMPONENT:
//=====================================================================================
CGmadChildHealthQuestions.prototype = new CGmadHealthQuestions();

function CGmadChildHealthQuestions() {
	CGmadHealthQuestions.apply(this,arguments);//super()
	this.arrActivePolicyIds = [];
	this.idPrefixLongAnswerHolder='#longAnswerHolder_';

	this.errMsgYesAnswer 			= 'Please explain why you answered yes:';
	this.errMsgRequiresOneChild		= 'Please choose a child and describe the ailment.';
}

CGmadChildHealthQuestions.prototype.initialize		= function(arrPolicyIds) {
	this.arrActivePolicyIds = arrPolicyIds;
};

CGmadChildHealthQuestions.prototype.postRenderFilter		= function(){
	var thisObject=this;
    $('.check_radio_onload').filter('[value=Y]').each( function(i,v){
    	var myThis = $(this);
    	var parts = thisObject.getArrayCountsFromNode(myThis);
    	var postfixId = parseInt(parts[0]) +'_'+ parseInt(parts[1])
        var node = $( thisObject.idPrefixLongAnswerHolder + postfixId);
    	var val = myThis.val();
        var chkAttr=myThis.attr('checked');
        if (isDefined(chkAttr) && chkAttr==='checked') {
			node.show();
        } else {
			node.hide();
        }
	});
};

CGmadChildHealthQuestions.prototype.getErrorNode			= function(postFix) {
	var thisObject=this;
	var node = $('#ChildHealthQuestion'+postFix);
	if (node.length===0)
		node = $('#HealthQuestion'+postFix);
	if (node.length===0)
		return false;
	return node;
};


CGmadChildHealthQuestions.prototype.showLongAnswer 		= function(answerValue, appCounter,questNumber) {
	var thisObject=this;
	var infixId = appCounter+'_'+questNumber;
	if (answerValue==thisObject.radioYes)
		$( thisObject.idPrefixLongAnswerHolder +infixId ).fadeIn();
	else
		$(thisObject.idPrefixLongAnswerHolder +infixId ).hide();
	$('#HealthQuestion_' +infixId +'_shortAnswer').val(answerValue);
};

CGmadChildHealthQuestions.prototype.validate		= function() {
	var thisObject=this;//preserve
	var validationMap=[];
	var bValid=true;
	var numOfApplicants = this.arrActivePolicyIds.length;

	var count=0;
	$('.check_radio_onload').filter('[value='+this.radioYes+']').each(function(i,v){
		myThis = $(this);
		if (GmadUtils.isChecked(myThis)) {
			var isValid = thisObject.validateChildLongQuestions( myThis, count);
			if (isValid===true)
				validationMap[count]=true;
			else {
				validationMap[count]=new Array(false);
				bValid = isValid && bValid;
			}
		}
		else
			validationMap[count]=new Array(null);
		count++;
	});

	count=0;
	$('.check_radio_onload').filter('[value='+thisObject.radioNo+']').each(function(i,v){
		if (validationMap[count]!==true) {
			if( validationMap[count][0]===null ) {
				myThis = $(this);
				if (GmadUtils.isChecked(myThis))
					validationMap[count]=true;
				else {
					bValid=false;
					validationMap[count].push(null);
				}
			}
		}
		count++;
	});


	count=0;
	for(count in validationMap) {
		var radCheck=null;
		var qMap = validationMap[count];
		var prefixId = '_0_' + count+'_shortAnswer_em_';
		if (qMap===true) { //ok
			//thisObject.removeErrorMessage('#ChildHealthQuestion'+prefixId);
			continue;
		}
		if (qMap[0]===null && qMap[1]===null) { //nothing selected
			thisObject.pushErrorMessage('Please answer yes or no', prefixId);
		}
/*
		else if (qMap[0]==false) { // yes selected, but errors on long
			thisObject.pushErrorMessage('Please select a child and describe the ailment', prefixId);
		}
*/
	}
/*
	if (!bValid) {
		for(var count in validationMap) {
			var prefixId='_0_'+count+'_';
			if ( validationMap[count]===true) {
				thisObject.removeErrorMessage(prefixId); continue;
			}
			if (!validationMap[count]) {
				thisObject.pushErrorMessage('Please answer', prefixId);
			}
		}
	}
*/
	thisObject.bValid = bValid;
	return thisObject.bValid;
};

CGmadChildHealthQuestions.prototype.validateChildLongQuestions		= function(shortAnswerNode, questionNumber) {
	var thisObject=this;
	var numOfApplicants = this.arrActivePolicyIds.length;

	var bValid=true;

	var node;
	if ($(shortAnswerNode).hasClass('apply_all_long_answer')) {
		if ( $('#ChildHealthQuestion_0_' +questionNumber+ '_longAnswer').val().trim().length === 0 ) {
			node=$('#HealthQuestion_0_'+questionNumber+'_shortAnswer_em_');
			node.html('Please explain your "Yes" answer:');
			node.show();
			return false;
		} else {
			node=$('#HealthQuestion_0_'+questionNumber+'_shortAnswer_em_').hide();
			return true;
		}
	}

	var selectNoExpl=false;
	var anySelected=false;
	var thisElem;
	var prefix = '#ChildHealthQuestionLongAnswer_';
	for(var i=0; i<numOfApplicants; i++) {
		thisElem=$( prefix +i+ '_'+questionNumber+'_policyId');
		var chkAttr = thisElem.attr('checked');
		if (isDefined(chkAttr) && chkAttr==='checked') {
			anySelected=true;
			var partialId = prefix +i+'_'+ questionNumber;
			node=$(partialId+'_longAnswer');
			if (  !(thisObject.validateSingleLongAnswer(node) && true)  ) {
				node=$(partialId+'_longAnswer_em_');
				node.html(thisObject.errMsgYesAnswer);
				node.show();
				selectNoExpl=true;
			}
		}
	}

	if (!anySelected || selectNoExpl) {
		this.bValid=bValid=false;

		thisElem = $('#ChildHealthQuestion_0_'+questionNumber+'_shortAnswer_em_');
		if (!anySelected && !selectNoExpl) {
			thisElem.html(thisObject.errMsgRequiresOneChild);
			thisElem.show();
		} else
			thisElem.hide();
	}

	return bValid;
};

CGmadChildHealthQuestions.prototype.validateSingleLongAnswer	= function(longAnswerNode) {
	if ($(longAnswerNode).val().trim().length!==0)
		return true; //todo: add in other validation
	return false;
};
//=====================================================================================




//=====================================================================================
// Gmad Payment:
//=====================================================================================
CGmadPayment.prototype = new CGmadAppForm();
function CGmadPayment() {
	CGmadAppForm.apply(this,arguments);//super()
}
CGmadPayment.prototype.changePaymentType = function(paymentTypeValue, applicantCounter) {
	$('#Payment_'+applicantCounter+'_paymentType').val(paymentTypeValue);
};
//=====================================================================================



// Add to CGmadAppForm eventually.
function getArrayCountsFromNode(node) {
	return helpGetArrayCounters($(node).attr('id'));
}
function helpGetArrayCounters(nodeId) {
	var parts=nodeId.split('_');
	var addrCount=(parts[2]) ? parts[2] : FALSE;
	return new Array(parts[1],addrCount);
}

function handleChosenButton(chosenObject,chosenValue) {
	var parentContext=$(chosenObject).closest('.subForm');
	parentContext.find('.choose_quote_button').removeClass('choose_quote_button_default').removeClass('choose_quote_button_yes').addClass('choose_quote_button_disabled');
	$(chosenObject).find('.choose_quote_button').removeClass('choose_quote_button_default').removeClass('choose_quote_button_disabled').addClass('choose_quote_button_yes');
	parentContext.find(".chooseByRadio").attr('checked',false);
	parentContext.find("input:radio[value='"+chosenValue+"']").attr('checked',true);
	//$('#AppForm').submit();
	(typeof appIns !== 'undefined') ? appIns.nextStep() : $(chosenObject).closest('form').submit();
}

function calculateAge(dateString) {
	var dob = new Date(dateString);
	var now = new Date;
	now.setHours(0,0,0,0);
	var constNum=31557600000;
	var age = ( (now - dob) / constNum );
	gmad_console('Age calculated at: ' + age);
	return age;
}

// mailingaddress
function updateCharCount(step, inputObject, rowNumber) {
    var count = inputObject.value.length;
    var remainCount = 30 - count;
    $('#'+step+'_charCount'+rowNumber).html(remainCount);
}

// mailingaddress yes/no
function assignValue(step, number, value){
	if(value=='y'){
		$('#'+step+'_longHolder_'+number).show();
		$('#'+step+'_hide_'+number).val('y');
	}else{
		$('#'+step+'_longHolder_'+number).hide();
		$('#'+step+'_hide_'+number).val('n');
	}
};

if (typeof(renderFbLike)=='undefined') {
	function renderFbLike() {
	    $('#fb_like_div').html('<iframe src="//www.facebook.com/plugins/like.php?href=http%3A%2F%2Fwww.facebook.com%2Fpages%2FGlobe-Life-And-Accident-Insurance-Company%2F327814440569624&amp;send=false&amp;layout=button&amp;width=70&amp;show_faces=false&amp;action=like&amp;colorscheme=dark&amp;font=lucida+grande&amp;height=35&amp;share=false&amp;appId=328144860541863" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:53px; height:23px;" allowTransparency="true"></iframe>');
	}
}

