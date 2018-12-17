var tokenization = (function () {
    var me = {};
    var AppGUID = ''; // '116BF779-5836-4EE3-A16C-F0574B1AD4E9';
    
    var Key_URL = '';
    var Tokenization_URL = '';

    me.setCredentials = function(setAppGUID, setKey_URL, setTokenization_URL) {
      AppGUID = setAppGUID;
      Key_URL = setKey_URL;
      Tokenization_URL = setTokenization_URL;
    }

    $.postify = function (value) {
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

    function encrypt(key, plaintext, IV, SALT) {
        var KEY_SIZE = 256 / 8;
        var KEY_GEN_ITERATION = 100;
        //var IV = CryptoJS.enc.Utf8.parse('0000000000000000');
        //var SALT = CryptoJS.enc.Utf8.parse('1111111111111111')

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

    me.getKey = function (data) {
console.log(Key_URL);
        $.ajax({
            type: "GET",
            url: Key_URL,
            data: null,
            contentType: "application/json; charset=utf-8",
            dataType: "jsonp",
            jsonp: "callback",
            timeout: 15000,
            success: function (result) {
console.log("SUCCESS");
                me.OnSuccessGetKey(result);
            },
            error: function (jqXHR, textStatus, errorThrown) {
console.log("getKey-error");
                me.OnErrorGetKey(jqXHR, textStatus, errorThrown);
            }
        });
    };

    me.OnSuccessGetKey = function (result) {
        me.key = result.Key;
        me.sessionID = result.SessionID;
        me.IV = CryptoJS.enc.Base64.parse(result.IV);
        me.SALT = CryptoJS.enc.Base64.parse(result.SALT);

        //alert("The IV received from server is:" + result.IV);
        //alert("The SALT received from server is:" + result.SALT);

        me.getData();
    };

    me.OnErrorGetKey = function (jqXHR, textStatus, errorThrown) {
        //$(".myError").append("<ul><li>" + textStatus + " : " + errorThrown + "</ul></li>");
        //$('#wait').hide();
console.log(textStatus);
        $(".myError").html('Processed T.O. 1');
        $("#gotSuccessToken").val('timeout');
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

        data.BillingAddress = {};
        data.BillingAddress.Address1 = ''; // $("input[id*=txtAdd1]").val();
        data.BillingAddress.Address2 = ''; // $("input[id*=txtAdd2]").val();
        data.BillingAddress.City = ''; // $("input[id*=txtCity]").val();
        data.BillingAddress.State = ''; // $("select[id*=ddlState]").val();
        data.BillingAddress.PostalCode = ''; // $("input[id*=txtZip]").val();
        data.BillingAddress.Country = "US";

        data.CardNumber = encrypt(me.key, data.CardNumber, me.IV, me.SALT);

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
        $(".myError").empty();

        var postdata = $.postify(data);

        $.ajax({
            type: "GET",
            url: Tokenization_URL,
            data: postdata,
            contentType: "application/json; charset=utf-8",
            dataType: "jsonp",
            jsonp: "callback",
            timeout: 15000,
            success: function (result) {
console.log("getToken-success");
                me.OnSuccessGetToken(result);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                me.OnErrorGetToken(jqXHR, textStatus, errorThrown);
console.log("getToken-error: "+errorThrown);
            }
        });
    };

    me.OnSuccessGetToken = function (result) {
        if (result.Status == false) {
            if (result.ErrorType == "V") {
              $(".myError").html("<ul><li>" + result.Message + "</ul></li>");
              $("#gotSuccessToken").val('error'); 
console.log("onSuccessGetToken_Error: "+result.Message);
            }
            else {
              var ShowErrorOptions = 'There was a network error during the credit card validation.<ul><li>You can click <strong>Continue</strong> to try again.</li>'
                                 + '<li>You can choose to pay by <strong>Bank Draft</strong></li><li>You can choose to the <strong>"Bill Me Later"</strong> option</li></ul>';
              $(".myError").html("<ul><li>" + ShowErrorOptions + "</ul></li>");
              $('.pay_type_container').find('input[value=billmelater]').parent().show(); 
              $("#gotSuccessToken").val('error');
console.log('Reference message: ' + result.Message);
            };
        }
        else {
            var lastFour = result.TMKtoken.substr(result.TMKtoken.length - 4);
            $("#Payment_ccOriginalNumber").val('************' + lastFour);
            $("#Payment_lastFourCreditCard").val(lastFour);
            $("#Payment_ccNumber").val(result.TMKtoken);
            $("#gotSuccessToken").val('success');        
console.log(result.TMKtoken);
        }

    };

    me.OnErrorGetToken = function (jqXHR, textStatus, errorThrown) {
        $(".myError").html('Processed T.O. 2');
        $("#gotSuccessToken").val('timeout');        
console.log(errorThrown);
    };

    return me;
}());