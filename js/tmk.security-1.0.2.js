'use strict';

var tmk = tmk || {};
tmk.security = tmk.security || {};

tmk.security.tls = function () {

	var tls = {};

	tls.enableTimeOut = true;
	tls.timeOutExpires = 5000;
	
	tls.isSupported = function (tokenApiUrl, cb) {

        var isTlsSupported = null;
		var isTimeOut = false;
		
	    $.ajax({
	        url: tokenApiUrl,
	        method: 'GET',
	        error: function (XMLHttpRequest, textStatus, errorThrown) {

	            if (XMLHttpRequest.status === 0)
	                isTlsSupported = false;
	            else
	                isTlsSupported = true;
				
				if(!isTimeOut)
					cb(isTlsSupported);
	        },
	        success: function (data) { }
	    });
		
		if(tls.enableTimeOut)
			setTimeout(function(){ isTimeOut = true; if(isTlsSupported==null){cb(true)};}, tls.timeOutExpires);

	}

	return tls;
}();

