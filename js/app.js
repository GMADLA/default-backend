// All app site validation

// this is a filter/formatter rather than a validator
$.validator.addMethod("removeUnwantedChars", function(thisValue, element) {
	thisValue = thisValue.replace(/\\/g,"");
	$(element).val(thisValue);
	return true;
}, "");

$.validator.addMethod("phoneUS", function(phone_number, element) {
	phone_number = phone_number.replace(/\s+/g, "");
	return this.optional(element) || phone_number.length > 9 &&
		phone_number.match(/^(\+?1-?)?(\([2-9]([02-9]\d|1[02-9])\)|[2-9]([02-9]\d|1[02-9]))-?[2-9]([02-9]\d|1[02-9])-?\d{4}$/);
}, "Please specify a valid phone number");


$.validator.addMethod("ageValidate", function(dob, element) {
	if (dob == '') return true;
	var adult = false;
	if(element.id.match(/^a_/)){
		adult = true;
	}

	var minAge, maxAge;
	if(adult){
		minAge = 18;
		maxAge = 80;
	}else{
		minAge = 0;
		maxAge = 25;
	}

	var age = calculateAge(dob);
	var valid = true;
	if(age >= maxAge){
		valid = false;
	} else if(age<minAge){
		valid = false;
	} else {
 		var m = dob.substring(5,7);
 		var d = dob.substring(8,10);
 		var y = dob.substring(0,4);
 		var valid = (m > 0 && m < 13 && y > 0 && y < 32768 && d > 0 && d <= (new Date(y, m, 0)).getDate());
	}

	return valid;

}, function(params, element){

	return getBirthErr(element.id, element.value);

});


function getBirthErr(id, dob){

	if (dob == '') return true;
	var adult = false;
	if(id.match(/^a_/)){
		adult = true;
	}

	var minAge, maxAge;
	if(adult){
		minAge = 18;
		maxAge = 80;
	}else{
		minAge = 0;
		maxAge = 25;
	}

	var errMsg = 'You supplied an invalid date of birth';
	var errMsg1 = 'Sorry, but we can only accept applicants under '+maxAge+' years of age in your state';
	var errMsg2 = 'Sorry, but we can only accept applicants over '+minAge+' years of age in your state';

	var age = calculateAge(dob);

	var valid = true;
	if(age >= maxAge){
		errMsg = errMsg1;
		valid = false;
	} else if(age<minAge){
		errMsg = errMsg2;
		valid = false;
	} else {
 		var m = dob.substring(5,7);
 		var d = dob.substring(8,10);
 		var y = dob.substring(0,4);
 		 	    
 		var valid = (m > 0 && m < 13 && y > 0 && y < 32768 && d > 0 && d <= (new Date(y, m, 0)).getDate());
 		if(!valid){
 			errMsg = 'You supplied an invalid date of birth.';
 		}
	}

	return errMsg;
}


$.validator.addMethod("notIn", function(thisValue, element, params){
	if (params.range==undefined || params.range.length<1) return true;
	var bIsCaseSensitive = params.caseSensitive!=undefined && params.caseSensitive;
	for (i=0; i<params.range.length; i++) {
		var s = params.range[i];
		if (!bIsCaseSensitive) {
			s = s.toLowerCase();
			thisValue=thisValue.toLowerCase();
		}
		if (s==thisValue) {
			return false;
		}
	}
	return true;
});

$.validator.addMethod("validatecc", function(ccNumber, element, param) {
	if (/[^0-9\-]+/.test(ccNumber)) {
		return false;
	}

	ccNumber = ccNumber.replace(/\D/g, "");

	var first = "" + ccNumber.charAt(0);
	var second = "" + ccNumber.charAt(1);
	var third = "" + ccNumber.charAt(2);
	var firstTwo = ccNumber + second;
	var firstFour = firstTwo + third + ccNumber.charAt(3);
	var ccType = param.ccType;

	if(ccType == "MC")
	{
		if(first != "5" || second < "1" || second > "5" || ccNumber.length != 16)
		 return false;
	}
	else if(ccType == "Visa")
	{
		if(first != "4" || (ccNumber.length != 13 && ccNumber.length != 16) )
		{
			return false;
		}
	}
	else if(ccType == "AMEX")
	{
		if(first != "3" || (second != "4" && second != "7") || ccNumber.length != 15)
		return false;
	}
	else if(ccType == "DISC")
	{
		if(firstFour != "6011" || ccNumber.length != 16)
		return false;
	}

	// now check the credit card suffix and length vs. the type

	if (ccNumber.length < 13 || ccNumber.length > 16) return false;

	var total = 0;
	// do the check sum
	for(loc = ccNumber.length - 2; loc >= 0; loc -= 2)
	{
		total += 1 * ccNumber.charAt(loc +1);
		tmp = ccNumber.charAt(loc) * 2;
		if(tmp > 9) total += 1;
		total += tmp%10;
	}
	if(ccNumber.length % 2 > 0)
	total += 1 * ccNumber.charAt(0);

	var checkRemainder = total % 10;

	if (checkRemainder>0) { return false; }
	else return true;

}, "Please enter a valid credit card number.");


function composeAge(strStep){
	var month = $('#'+strStep+'_dob_month').val();
	var day = $('#'+strStep+'_dob_day').val();
	var year = $('#'+strStep+'_dob_year').val();

	if(month!='' && day!='' && year!=''){
		$('#'+strStep+'_dob_detail').val(year+'-'+month+'-'+day);
	} else {
		$('#'+strStep+'_dob_detail').val('');
	}
}

function switchConfirm(form) {
	var strState = $(form).find(".g_input_state").first().val();
	var isConfirm = true;

	if (isNyDomain) {
		if (strState!='NY') {
			isConfirm = confirm("Because you have chosen the state that is not New York, you can get your free quote and apply online from the Globe Life And Accident Insurance Company web site.\n\nClick 'OK' and you will automatically be redirected to Globe Life.");
			if (isConfirm) {
				window.location.href = appSite + '?git=' + jsGit + '&orState=' + strState.toUpperCase();
				return false; 		// by returning false, the normal submit should not occur !
			}
		}

	} else {
		if (strState=='NY') {
			isConfirm = confirm("Because you have chosen the state of New York, you can get your free quote and apply online from the Globe Life Insurance Company of New York web site.\n\nClick 'OK' and you will automatically be redirected to Globe Life Insurance Company of New York.");
			if (isConfirm) {
				window.location.href = nycSite + '?git=' + jsGit + '&orState=' + strState.toUpperCase();
				return false;		// by returning false, the normal submit should not occur !
			}
		}
	}
	return isConfirm;	// if true, will submit form normally.
}

function validate_choosenum(strStep){

}

function validate_namebirth(strStep){

}

function validate_appname(strStep){

}

function validate_appbirth(strStep){

}

function validate_choosequote(strStep){

}

function validate_chooseadb(strStep){

}

function validate_childchooseadb(strStep){

}

function validate_mailingaddress(strStep){

}

function validate_relationship(strStep){

}

function validate_childrelationship(strStep){

}

function validate_beneficiary(strStep){

}

function validate_childbeneficiary(strStep){

}

function validate_healthquestions(strStep){
	//window.onbeforeunload = "";
}

function validate_childhealthquestions(strStep){
	//window.onbeforeunload = "";
}

function validate_paymentmodel(strStep){
	//window.onbeforeunload = gmadCallbackOnBeforeUnload;
}

function validate_billingaddress(strStep){
	//window.onbeforeunload = "";
}


// app jquery plugin, handle form validation, form switch animation, form submition
(function($){
	//var _setting = {};

	/**
	 *
	 * options = {
	 * 		'curStep': 'a_1_appname',
	 * 		'allStep': ["choosenum","a_1_appname","a_1_appbirth","a_1_choosequote","a_1_beneficiary","a_1_healthquestion"],
	 * 		'submitStep': ["a_1_choosequote"],
	 * 		'isCurFormA': true,
	 *
	 * };
	 *
	 *
	 */
	$.fn.appexec = function(options) {

		this.options = options;

		this.options.isCurFormA = true;

		this.options.isAjaxing = false;

		var self = this;

		// a flag mark the current form wrapper using curstep_a
		//var isCurFormA = true;

		// bind the continue/submit button
		$('#continue-button').click(function(){

			self.nextStep();

		});

		// initilize the back|next link
		$('#navBack').attr("href", "javascript:void(0);").click(function(){
			self.prevStep();
		});
		$('#navNext').attr("href", "javascript:void(0);").click(function(){
			self.nextStep();
		});


		/* The JS below is for v5 only */
		// This continue button is for theme v5.
		$('.new-main-section-holder').on('click', '.continue-button', function(e){
			e.preventDefault();
			self.nextStep();

		});
		// This back button is for theme v5.
		$('.new-main-section-holder').on('click', '.navBack', function(e){
			e.preventDefault();
			self.prevStep();
		});
		/* v5 end */



		// get the next step string
		this.getNextStep = function(){
			var j = 0;
			var arrTemp = this.options.allStep;
			for(var i = 0; i < arrTemp.length; i++){
				if(arrTemp[i] == this.options.curStep){
					j = i;
				}
			}
			//console.log('getNextStep:'+arrTemp[j+2]);
			return arrTemp[j+1];
		};

		// get the previous step string
		this.getPrevStep = function(){
			var j = 0;
			var arrTemp = this.options.allStep;
			for(var i = 0; i < arrTemp.length; i++){
				if(arrTemp[i] == this.options.curStep){
					j = i;
				}
			}
			//console.log('getPrevStep:'+arrTemp[j-1]);
			return arrTemp[j-1];
		};

		// check if the last step
		this.isLastStep = function(){
			var j = 0;
			var arrTemp = this.options.allStep;
			for(var i = 0; i < arrTemp.length; i++){
				if(arrTemp[i] == this.options.curStep){
					j = i;
				}
			}
			return j == (arrTemp.length-1);
		};


		/**
		 * initilize the first step
		 */
		this.initFirstStep = function(){

			//validate_appname(this.options.curStep);

			// handle continue button
			$('#continue_button_js').show();
			$('.continue_button_div').hide();

			var strNext = this.getNextStep();
			var strPrev = this.getPrevStep();

			var contentNext = this.bufferStep(strNext, 'nextstep');
			var contentPrev = this.bufferStep(strPrev, 'prevstep');


			//$("#nextstep").html(contentNext);
			//$("#prevstep").html(contentPrev);

			this.ValidateForm(this.options.curStep);

			this.checkBillmePopup();

			//console.log(strNext);
			//console.log(strPrev);

		};

		/**
		 * check the step variable if paymentmodel step
		 */
		this.isPaymentStep = function(tStep){
			var patt = new RegExp("paymentmodel");
			return patt.test(tStep);
		};


		/**
		 * central function to control bill me later pop up.
		 */
		this.checkBillmePopup = function(){
			if(this.isPaymentStep(this.options.curStep)){
				//console.log('wake billme pop');
				window.onbeforeunload = gmadCallbackOnBeforeUnload;
			} else {
				//console.log('disable billme pop');
				window.onbeforeunload = "";
			}
		};


		/**
		 * Call the next[submit] function
		 *
		 * 1) Form validation
		 * 2) Slide form (hidestep inject with proper content, curstep hide, hidestep show)
		 * 3) Form submition
		 * 4) 4.1 - Error return, then slide back
		 *    4.2 - Success, return with new form element. (replace prestep or nextstep with return form content)
		 *    4.3 - Flip curstep and hidestep (curstep show and replace with hidestep content, empty hidestep)
		 *
		 */
		this.nextStep = function(){

			// get the current form id
			var _tid = this.options.curStep + "_form";

			// check if the form valid
			if($("#"+_tid).valid()){
				//console.log($("#"+_tid).serialize()); // check serialize form elements

				// check if the current step in submit step, submit step will use page submit, not ajax submit
				if(self.options.submitStep.length>0){
					//var n, submitStep;
					for(n=0; n<self.options.submitStep.length; n++){
						// if next step is the submitstep then do a regular form submit
						if(self.options.submitStep[n] == self.getNextStep()){
							$("#"+_tid).submit();
							return false;
						}
					}
				}

				// check if the last step then just submit the form
				if(self.isLastStep()){
					$("#"+_tid).submit();
					return false;
				}

				// hijack here for credit card process
				//if(this.options.curStep == 'a_a_paymentmodel' || this.options.curStep == 'j_a_paymentmodel'){
				if(this.isPaymentStep(this.options.curStep)){
					if(ccExecute()){  // this function located in paymentmodel template
						// console.log("payment here");
						$('.form-submit-wrapper .continue_button').hide();
						return false;
					}
				}

				// hijack here for appbirth firstname prefill
				if(self.isAppname()){
					$("#"+self.getNextStep()+"_fname_holder1").html($("#"+this.options.curStep+"_fname").val() + "&rsquo;s");
					$("#"+self.getNextStep()+"_fname_holder2").html($("#"+this.options.curStep+"_fname").val() + "&rsquo;s");
				}

				//console.log(this.options.curStep);
				//return false;


				this.nextStepSubmit();

				$('.continue_button_div').hide();

				this.scrollToTop();
				//this.setNavBar();
				//

			}
			//$(_tid).valid();


			//console.log('call next');
		};


		/**
		 * this is the actual submit for next step, be really careful call this directly, shoud use nextStep instead.
		 */
		this.nextStepSubmit = function(){

			//console.log('nextStepSubmit');
			// get the current form id
			var _tid = this.options.curStep + "_form";

			this.slideForm('next');

			this.options.isAjaxing = true;

			this.triggerNext('next');

			jQuery.post(
				'/ajaxnext',
				$("#"+_tid).serialize(),
				function(data){

					self.options.curStep = self.getNextStep();


					self.gatrack();

					// try convert to json data
					var result = self.getJson(data);

					// if not proper json data return then consider something goes wrong
					if(result == false){
						//console.log('json fail need to slide back');
						self.slideForm('prev');
						self.options.curStep = self.getPrevStep();
						var v = confirm("We experienced a system issue. Please click OK to refresh the page. If the problem persists, please contact us.");
						window.location.reload();
						return false;
					}

					if(result.success){
						//console.log('next success');
						// flip the form flag
						self.confirmForm();

						// check if tls available
						if(!result.tls12){
							checkTlsSupport();	// this function located in appnew_layout.php
						}

						// set the current step
						//self.options.curStep = self.getNextStep();

						//console.log($('#'+self.getPreFormDivId()).html());

						//TODO: need to check make sure the ajax reture success, otherwise need to slide back

						// create new step_div dom, when it's not the last step
						if(!self.isLastStep()){
						//if(!$("#"+self.getNextStep()+"_div").length){
							self.createStepDiv(self.getNextStep());
							$("#"+self.getNextStep()+"_div").html(result.content);
						}

						// modify form div
						//$('#nextstep').html(data.content);
						//$('#prevstep').html($('#'+self.getPreFormDivId()).html());

						// modify left panel div
						$('#prevstep_left').html($('#curstep_left').html());
						$('#curstep_left').hide().html($('#nextstep_left').html()).fadeIn(1000);
						$('#nextstep_left').html(result.left);

						if(typeof result.allStep != 'undefined'){
							self.options.allStep = result.allStep;
						}

						// setup form validation
						self.ValidateForm();


						// if payment page submit need to send a buffer ajax call to reload the payment page
						if(self.isPaymentStep(self.getPrevStep())){
							self.bufferStep(self.getPrevStep(), 'prevstep');
						}

						self.setNavBar();
						self.options.isAjaxing = false;
						self.triggerNext('next');

					}else{

						if(result.content == 'expired'){
							window.location.href = '/gotostart';
							return false;
						}

						alert('Form submit fail, Please review your data and try again.');
						self.slideForm('prev');
						self.options.curStep = self.getPrevStep();

						// show errors
					}

					self.checkBillmePopup();

				}
			);

		};



		/**
		 * call the previous step
		 */
		this.prevStep = function(){

			// get the current form id
			var _tid = this.options.curStep + "_form";

			//console.log($("#"+_tid).serialize());

			var tempStep = self.getPrevStep();
			var strRequestedStep = tempStep;

			if (tempStep == "choosenum" || tempStep == "undefined") {
				strRequestedStep = '';
			} else {
				this.slideForm('prev');
			}

			//return false;

			this.options.isAjaxing = true;

			this.triggerNext('prev');

			$.ajax({
				url:'/ajaxdummyprev',
				async:true,
				type:'POST',
				data: {requestedStep:strRequestedStep}
			});

			jQuery.post(
				'/ajaxprev',
				{},
				function(data){

					if(data.success){

						// flip the form flag
						self.confirmForm();

						// check if tls available
						if(!data.tls12){
							checkTlsSupport();	// this function located in appnew_layout.php
						}

						var tempStep = self.getPrevStep();
						if(tempStep == "choosenum" || tempStep == "undefined") {
							window.location.href = '/';
							return false;
						}

						// set the current step
						self.options.curStep = self.getPrevStep();


						self.gatrack();

						// modify form div
						//$('#nextstep').html($('#'+self.getPreFormDivId()).html());
						//$('#prevstep').html(data.content);

						// create new step_div dom
						if(!$("#"+self.getPrevStep()+"_div").length){
							self.createStepDiv(self.getPrevStep());
							if(self.getPrevStep() == "choosenum"){
								// do nothing for now.
							} else {
								$("#"+self.getPrevStep()+"_div").html(data.content);
							}

						}


						// modify left panel div
						$('#nextstep_left').html($('#curstep_left').html());
						$('#curstep_left').hide().html($('#prevstep_left').html()).fadeIn();
						$('#prevstep_left').html(data.left);

						$('.continue_button_div').hide();

						// setup form validation
						self.ValidateForm();

						self.setNavBar();

						self.options.isAjaxing = false;

						self.triggerNext('prev');

					}else{

						if(data.content == 'expired'){
							window.location.href = '/gotostart';
							return false;
						}
						self.slideForm('next');
						// show errors
					}

					self.checkBillmePopup();
					//console.log(data);



				},'json'
			);


			// this.scrollToTop();
			//this.setNavBar();

			//console.log('call previous');

		};


		this.scrollToTop = function(){
			// console.log('scrollToTop');
	        if($('body').scrollTop()>0){
	            $('body').scrollTop(0);         //Chrome,Safari
	        }else{
	            if($('html').scrollTop()>0){    //IE, FF
	                $('html').scrollTop(0);
	            }
	        }
		};

		// old way of doing the form flip
		this.getCurFormDivId = function(){
			return this.options.isCurFormA ? 'curstep_a' : 'curstep_b';
		};

		// old way of doing the form flip
		this.getPreFormDivId = function(){
			return this.options.isCurFormA ? 'curstep_b' : 'curstep_a';
		};

		// flip the current form value
		this.confirmForm = function(){
			this.options.isCurFormA = this.options.isCurFormA ? false : true;
		};

		// trigger next link
		this.triggerNext = function(direction){
			if(direction == 'next'){
				if(this.options.isAjaxing){
					//$('#navNext').hide();
					$('#continue-button').hide();
					$('#continue-button-off').show();
					//$('.choose_quote_button').prop('disabled', true);
					$('#form_cover').removeClass('hide').addClass('pending_cover');
//$('.btn_back_next').removeClass('hide').addClass('pending_cover');
$('.btn_back_next').hide();
$('.choose_quote_form_overlay').show();
$(".continue-button").attr("disabled", "disabled");
$(".continue-button2").attr("disabled", "disabled");
$("fieldset").attr("disabled", "disabled");
				}else{
					//$('#navNext').show();
$(".app_main_page_title").html( $(".step").not(".hiddenstep").children(".app_title_section").html() );
					$('#continue-button').show();
					$('#continue-button-off').hide();
					//$('.choose_quote_button').prop('disabled', false);
$('.btn_back_next').fadeIn();
$('.choose_quote_form_overlay').fadeOut();
$(".continue-button").removeAttr("disabled");
$(".continue-button2").removeAttr("disabled");
$("fieldset").removeAttr("disabled");
					$('#form_cover').removeClass('pending_cover').addClass('hide');
				}
			}else{
				if(this.options.isAjaxing){
					//$('#navBack').hide();
					$('#form_cover').removeClass('hide').addClass('pending_cover');
$('.btn_back_next').hide();
$('.choose_quote_form_overlay').show();
$(".continue-button").attr("disabled", "disabled");
$(".continue-button2").attr("disabled", "disabled");
$("fieldset").attr("disabled", "disabled");
//$('.btn_back_next').removeClass('hide').addClass('pending_cover');
				}else{
					//$('#navBack').show();
$(".app_main_page_title").html( $(".step").not(".hiddenstep").children(".app_title_section").html() );
					$('#form_cover').removeClass('pending_cover').addClass('hide');
//$('.btn_back_next').removeClass('pending_cover').addClass('hide');
$('.choose_quote_form_overlay').fadeOut();
$(".continue-button").removeAttr("disabled");
$(".continue-button2").removeAttr("disabled");
$("fieldset").removeAttr("disabled");
$('.btn_back_next').fadeIn();
				}
			}
		};

		// check if the return value a proper json object
		this.getJson = function(strData){
			var isJson = true;
			var result;
			try{
				result = jQuery.parseJSON(strData);
			} catch(e){
				isJson = false;
			}
			if(isJson){
				return result;
			}else{
				return false;
			}
		};

		/**
		 * Slide the form with animation.
		 *
		 * Makes use of several CSS classes w/transitions;
		 * preprocessed, processed, hiddenstep.
		 *
		 * @param string direction
		 *   Sets the transition direction.
		 */
		this.slideForm = function(direction){
			var stepRaw = this.options.curStep;
			var currentStep = "#"+this.options.curStep+"_div";

			// Set the next step and target classes.
			if(direction == 'next') {
				var nextStep = "#"+this.getNextStep()+"_div";
				var toggleClass = "processed";
				var removeClass = "preprocessed";
			}
			else{
				var nextStep = "#"+this.getPrevStep()+"_div";
				var toggleClass = "preprocessed";
				var removeClass = "processed";
			}

			// Transition out of current step.
			$(currentStep).toggleClass(toggleClass).delay(0)
			.queue(function(){

				// Toggle step shown.
				$(currentStep).addClass('hiddenstep');
				$(nextStep).removeClass('hiddenstep');
				$(this).dequeue();
			}).delay(5)
			.queue(function() {

				// Transition in next step.
				$(nextStep).removeClass(removeClass).trigger("stepShown");
				$(currentStep).trigger("stepHidden");
				$(this).dequeue();
			});
		};

		/**
		 * slide the form with animation
		 */
		this.slideFormOld = function(direction){
			if(direction == 'next'){
				$("#"+this.getPreFormDivId()).html($("#nextstep").html());
				$("#"+this.getCurFormDivId()).slideUp();
				$("#"+this.getPreFormDivId()).slideDown();
			}else{
				$("#"+this.getPreFormDivId()).html($("#prevstep").html());
				$("#"+this.getCurFormDivId()).slideUp();
				$("#"+this.getPreFormDivId()).slideDown();
			}

		};

		/**
		 * set navigation bar to highlight current step, previous steps and left steps
		 *
		 */
		this.setNavBar = function(){
			var curNum = this.options.navBar[self.options.curStep];
			for (var i = 1; i <= this.options.totalBarItem; i++) {
				if (i < curNum){
					$('#navBar-'+i.toString()).addClass('before-current-group').removeClass('current-group').removeClass('after-current-group');
				} else if(i == curNum){
					$('#navBar-'+i.toString()).removeClass('before-current-group').addClass('current-group').removeClass('after-current-group');
				}else{
					$('#navBar-'+i.toString()).removeClass('before-current-group').removeClass('current-group').addClass('after-current-group');
				}
			}
		};

		/*
		this.flipContent = function(direction){

		};
		*/




		/**
		 * trigger google analytics tracking
		 */
		this.gatrack = function(){

			//alert("currentstep:"+self.options.curStep);

			if(self.options.curStep == undefined){
				return false;
			}

			var arrSplit = self.options.curStep.split('_');
			var strPrefix = arrSplit[0] == 'a' ? 'Adult' : 'Juv';
			var strPostfix = '';

			if(arrSplit[2] == 'beneficiary') {
				strPostfix = '_Beneficiary';
			} else if(arrSplit[2] == 'childbeneficiary'){
				strPostfix = '_Beneficiary';
			} else if(arrSplit[2] == 'appname'){
				strPostfix = '_Get_Quote';
			} else if(arrSplit[2] == 'appbirth'){
				strPostfix = '_Get_Quote_DOB';
			} else if(arrSplit[2] == 'namebirth'){
				strPostfix = '_Get_Quote';
			} else if(arrSplit[2] == 'billingaddress'){
				strPostfix = '_Billing_Address';
			} else if(arrSplit[2] == 'childhealthquestions'){
				strPostfix = '_Health_Questions';
			} else if(arrSplit[2] == 'healthquestions'){
				strPostfix = '_Health_Questions';
			} else if(arrSplit[2] == 'chooseadb'){
				strPostfix = '_Accidental_Death_Benefit_Option';
			} else if(arrSplit[2] == 'childchooseadb'){
				strPostfix = '_Accidental_Death_Benefit_Option';
			} else if(arrSplit[2] == 'choosequote'){
				strPostfix = '_Life_Insurance_Quote';
			} else if(arrSplit[2] == 'paymentmodel'){
				strPostfix = '_Payment';
			} else if(arrSplit[2] == 'mailingaddress'){
				strPostfix = '_Mailing';
			} else if(arrSplit[2] == 'relationship'){
				strPostfix = '_Relationship';
			} else if(arrSplit[2] == 'childrelationship'){
				strPostfix = '_Relationship';
			}



			//console.log(strPrefix + strPostfix);
			ga('send', 'pageview', strPrefix + strPostfix);

		};



		/**
		 *
		 */
		this.createStepDiv = function(strStep){
			// need to check if the element exist
			if($("#"+strStep+"_div").length){
				return false;
			}

			var stepBefore = '<div style="position:relative;" id="' + strStep + '_div" class="step hiddenstep processed"></div>';
			var stepDiv = '<div style="position:relative;" id="' + strStep + '_div" class="step hiddenstep preprocessed"></div>';

			// create dom element for buffer div
			if(this.determinePosition(strStep)){
				$("#"+this.options.curStep+"_div").before(stepBefore);
			}else{
				$("#"+this.options.curStep+"_div").after(stepDiv);
			}

		};

		/**
		 * this is the function load buffer forms when page loaded.
		 *
		 * strStepId: nextStep|prevStep
		 */
		this.bufferStep = function(strStep, strStepId){

			this.createStepDiv(strStep);
			jQuery.post(
					'/ajaxbuffer',
					'bufferstep='+strStep,
					function(data){
						setTimeout(function () {
							if(data.success){
								//content = data.content;
								$("#"+strStep+'_div').html(data.content);
								//left = data.left;
								$("#"+strStepId+'_left').html(data.left);
							}else{
								content = 'error occur when pull buffer page';
							}
						}, 1000);
					},'json'
				);
		};

		/**
		 * check the parameter step compare with current step from 'before' or 'after'
		 * return 'TRUE', the step is before,
		 * return 'FALSE', the step is after,
		 *
		 */
		this.determinePosition = function(strStep){
			var m, n;
			var arrTemp = this.options.allStep;
			for(var i = 0; i < arrTemp.length; i++){
				// current step position
				if(arrTemp[i] == this.options.curStep){
					m = i;
				}
				// parameter step position
				if(arrTemp[i] == strStep){
					n = i;
				}
			}
			return m>n;
		};

		/**
		 * check if appname step
		 */
		this.isAppname = function(){
			var patt = new RegExp("appname");
			return patt.test(this.options.curStep)
		};

		/**
		 * get javascript form validation method name
		 */
		this.ValidateForm = function(){
			strStep = this.options.curStep;
			//console.log('validateForm:'+strStep);
			if(strStep!='choosenum'){
				var arrTemp = strStep.split('_');
				var name = arrTemp[2];
				var method = 'validate_'+name+'(strStep)';
				eval(method);
			}else{
				return false;
			}

		};

		this.initFirstStep();

		return this;
	};



	// enable the submit button, and disalbe the button within the form


})(jQuery);




