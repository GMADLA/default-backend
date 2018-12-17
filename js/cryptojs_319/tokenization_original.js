var tokenization = (function () {
    var me = {};
    var AppGUID = '116BF779-5836-4EE3-A16C-F0574B1AD4E9';

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
        $('#wait').show();

        $.ajax({
            type: "GET",
            url: me.Key_URL,
            data: null,
            contentType: "application/json; charset=utf-8",
            dataType: "jsonp",
            jsonp: "callback",
            timeout: 60000,
            success: function (result) {
                me.OnSuccessGetKey(result);
            },
            error: function (jqXHR, textStatus, errorThrown) {
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
        $(".myError").append("<ul><li>" + textStatus + " : " + errorThrown + "</ul></li>");
        $('#wait').hide();
    };

    me.getData = function () {

        var data = {};
        //replace with your form ids, such as adult_cc_number. 
        //IMPORTANT - the data field names, such as CardNumber
        //MUST NOT be changed, since they are used for model binding.
        data.SessionID = me.sessionID;
        data.AppGUID = AppGUID;
        data.CardType = $("select[id*=ddlCardType]").val();
        data.CardNumber = $("input[id*=txtCardNumber]").val();
        data.FirstName = $("input[id*=txtFName]").val();
        data.MiddleNameInitial = $("input[id*=txtMName]").val();
        data.LastName = $("input[id*=txtLName]").val();
        data.ExpireMonth = $("select[id*=ddlMonth]").val();
        data.ExpireYear = $("select[id*=ddlCalYear]").val();

        data.BillingAddress = {};
        data.BillingAddress.Address1 = $("input[id*=txtAdd1]").val();
        data.BillingAddress.Address2 = $("input[id*=txtAdd2]").val();
        data.BillingAddress.City = $("input[id*=txtCity]").val();
        data.BillingAddress.State = $("select[id*=ddlState]").val();
        data.BillingAddress.PostalCode = $("input[id*=txtZip]").val();
        data.BillingAddress.Country = "US";

        data.CardNumber = encrypt(me.key, data.CardNumber, me.IV, me.SALT);

        me.getToken(data);
    };

    me.getToken = function (data) {
        $(".myError").empty();

        var postdata = $.postify(data);

        $.ajax({
            type: "GET",
            url: me.Tokenization_URL,
            data: postdata,
            contentType: "application/json; charset=utf-8",
            dataType: "jsonp",
            jsonp: "callback",
            timeout: 60000,
            success: function (result) {
                me.OnSuccessGetToken(result);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                me.OnErrorGetToken(jqXHR, textStatus, errorThrown);
            }
        });
    };

    me.OnSuccessGetToken = function (result) {
        $('#wait').hide();
        if (result.Status == false) {
            if (result.ErrorType == "V") {
                $(".myError").append("<ul><li>" + result.Message + "</ul></li>");
            }
            else {
                $(".myError").append("<ul><li>Error occurred when generating a token.</ul></li>");
            };
        }
        else {
            var lastFour = result.TMKtoken.substr(result.TMKtoken.length - 4);
            $("input[id*=txtCardNumber]").val(result.TMKtoken);
        }

    };

    me.OnErrorGetToken = function (jqXHR, textStatus, errorThrown) {
        $(".myError").append("<ul><li>" + textStatus + " : " + errorThrown + "</ul></li>");
        $('#wait').hide();        
    };

    return me;
}());