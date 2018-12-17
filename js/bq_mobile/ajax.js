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
