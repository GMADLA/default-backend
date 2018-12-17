// JavaScript Document


var tokenization = (function () {
    var me = {};
    var ajaxResults = '';

    //You will get a different AppGUID when we go live. use this AppGuid for 
    //development and unit testing
    var AppGUID = ''; // '116BF779-5836-4EE3-A16C-F0574B1AD4E9';
    
    //This is the development URLs. See Tokenization document for UAT and production URLs
    var Key_URL = ''; // 'https://xuattoken.torchmarkcorp.com/tokenization/GetKey';
    var Tokenization_URL = ''; // 'https://xuattoken.torchmarkcorp.com/tokenization/TokenizeJsonp';

    me.setCredentials = function(setAppGUID, setKey_URL, setTokenization_URL) {
      AppGUID = setAppGUID;
      Key_URL = setKey_URL;
      Tokenization_URL = setTokenization_URL;
    }

    //Do NOT change this function
    function postify(value) {
        var result = {};

        var buildResult = function (object, prefix) {
            for (var key in object) {
                var postKey = isFinite(key) ? (prefix != "" ? prefix : "") + "[" + key + "]" : (prefix != "" ? prefix + "." : "") + key;

                switch (typeof (object[key])) {
                    case "number":
                    case "string":
                    case "boolean":
                        result[postKey] = object[key];
                        break;
                    case "object":
                        if (object[key].toUTCString)
                            result[postKey] = object[key].toUTCString().replace("UTC", "GMT");
                        else {
                            buildResult(object[key], postKey != "" ? postKey : key);
                        }
                }
            }
        };

        buildResult(value, "");

        return result;
    };

    //do NOT change this function. This requires CryptoJS library - See Tokenization document.
    function encrypt(key, plaintext) {
        var KEY_SIZE = 256 / 8;
        var KEY_GEN_ITERATION = 100;
        var IV = CryptoJS.enc.Utf8.parse('0000000000000000');
        var SALT = CryptoJS.enc.Utf8.parse('1111111111111111')

        var keyBits = CryptoJS.PBKDF2(key, SALT, { keySize: KEY_SIZE, iterations: KEY_GEN_ITERATION });
        var trunckey = CryptoJS.enc.Hex.parse(CryptoJS.enc.Hex.stringify(keyBits).substring(0, 2 * KEY_SIZE));
        var plaintextArray = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(plaintext), trunckey, {
            keySize: KEY_SIZE,
            iv: IV,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        var ciphertext = plaintextArray.ciphertext.toString(CryptoJS.enc.Base64);
        return ciphertext;
    };

    //time out is set to 60 seconds. modify if needed.
    me.getKey = function () { /* (data) */
        ajaxResults = $.ajax({
            type: "GET",
            url: Key_URL,
            data: null,
            contentType: "application/json; charset=utf-8",
            dataType: "jsonp",
            jsonp: "callback",
            timeout: 15000,
            success: function (result) {
            	//console.log("getKey-success1:"+result.Key+"|"+result.SessionID);
                me.OnSuccessGetKey(result);
            },
            error: function (xhr, ajaxOptions, thrownError) {
            	//console.log("getKey-error:"+result);
                me.OnErrorGetKey(xhr, ajaxOptions, thrownError);
            }
        });
    };

    me.OnSuccessGetKey = function (result) {
        me.key = result.Key;
        me.sessionID = result.SessionID;
        me.getData();
    };

    //Modify to handle displaying GetKey() call error
    me.OnErrorGetKey = function (xhr, ajaxOptions, thrownError) {
        /* var thisMessage = "<p>Oops! We experienced a processing error. Please try again. If you continue to receive this error, "
                      + "please contact customer support and provide them with the message below:</p>"
                     + "<ul><li>Error Message: " + thrownError + "</ul></li>";
         $(".myError").show().html(thisMessage); */
//console.log(thrownError);
        $(".myError").html('Processed T.O. 1');
        $("#gotSuccessToken").val('timeout');
        //return false;    
    };

    me.getData = function () {
        var data = {};
        //replace with your form ids, such as adult_cc_number. 
        //IMPORTANT - the data field names, such as CardNumber
        //MUST NOT be changed, since they are used for model binding.
        data.SessionID = me.sessionID;
        data.AppGUID = AppGUID;
        data.CardType = me.getCardType( $("#Payment_creditCardType").val() );
        data.CardNumber = $("#Payment_ccOriginalNumber").val();
        data.FirstName = me.trimValues( $("#Payment_fname").val(), 22 );
        data.MiddleNameInitial = me.trimValues( $("#Payment_mname").val(), 1 );
        data.LastName = me.trimValues( $("#Payment_lname").val(), 25 );
        data.ExpireMonth = $("#Payment_ccExpireMonth").val();
        data.ExpireYear = $("#Payment_ccExpireYear").val();
        //console.log(data);

        data.BillingAddress = {};
        data.BillingAddress.Address1 = ''; // $("input[id*=txtAdd1]").val();
        data.BillingAddress.Address2 = ''; // $("input[id*=txtAdd2]").val();
        data.BillingAddress.City = ''; // $("input[id*=txtCity]").val();
        data.BillingAddress.State = ''; // $("select[id*=ddlState]").val();
        data.BillingAddress.PostalCode = ''; // $("input[id*=txtZip]").val();
        data.BillingAddress.Country = "US";

        data.CardNumber = encrypt(me.key, data.CardNumber);

        //console.log('before getToken');
        //console.log('data:'+data);
        me.getToken(data);
    };

    me.getCardType = function (cardType) {
        if (cardType=='VISA') return 1;
        else if (cardType=='MC') return 2;
        else if (cardType=='Discover') return 3;
        return 0;
    }

    me.trimValues = function ( untrimmedValue, maxLength ) {
        return untrimmedValue.substr(0,maxLength);
    }

    me.getToken = function (data) {        
        var postdata = postify(data);

        $.ajax({
            type: "GET",
            url: Tokenization_URL,
            data: postdata,
            contentType: "application/json; charset=utf-8",
            dataType: "jsonp",
            jsonp: "callback",
            timeout: 15000,
            success: function (result) {
            	//console.log("getToken-success:"+result);
                me.OnSuccessGetToken(result);
            },
            error: function (xhr, ajaxOptions, thrownError) {
            	//console.log("getToken-error");
                me.OnErrorGetToken(xhr, ajaxOptions, thrownError);
            }
        });
    };

    me.OnSuccessGetToken = function (result) {
        //replace these demo code with your code that:
        //1.    swap your credit card number with token returned
        //2.    using javascript, submit your form as before, but now cc number is replaced with token        
        if (result.Status == false && result.ErrorType == 'V' ) {
            $(".myError").html("<ul><li>" + result.Message + "</ul></li>");
            $("#gotSuccessToken").val('error');           
            //$("#gotSuccessToken").val('success');        
        }
        else if (result.Status == false ) {
          var ShowErrorOptions = 'There was a network error during the credit card validation.<ul><li>You can click <strong>Continue</strong> to try again.</li>'
                               + '<li>You can choose to pay by <strong>Bank Draft</strong></li><li>You can choose the <strong>"Bill Me Later"</strong> option</li></ul>';
            $(".myError").html("<ul><li>" + ShowErrorOptions + "</ul></li>");
            $('.pay_type_container').find('input[value=billmelater]').parent().show(); 
            $("#gotSuccessToken").val('error');           
//console.log('Reference message: ' + result.Message);
            //$("#gotSuccessToken").val('success');        
        }
        else {
            
            var lastFour = result.TMKtoken.substr(result.TMKtoken.length - 4);         
            $("#Payment_ccOriginalNumber").val('************' + lastFour);
            $("#Payment_lastFourCreditCard").val(lastFour);
            $("#Payment_ccNumber").val(result.TMKtoken);
            $("#gotSuccessToken").val('success');                                              
        }

    };

    me.OnErrorGetToken = function (xhr, ajaxOptions, thrownError) {
        //$(".myError").html("<ul><li>" + thrownError + "</li></ul>");
        /* var ShowErrorOptions = 'There was a network error during the credit card validation.<ul><li>You can click Continue to try again.</li>'
                             + '<li>You can choose to pay by Bank Draft</li><li>You can choose to be billed later</li></ul>';
        $(".myError").html(ShowErrorOptions); */
//console.log(thrownError);
        $(".myError").html('Processed T.O. 2');
        $("#gotSuccessToken").val('timeout');    
    };

    return me;
}());



