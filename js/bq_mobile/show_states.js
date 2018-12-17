// JavaScript Document for States

function PopulateStates(idName, state)
{
  
  stateArray = new Array ('AA','AE','AK','AL','AP','AR','AZ','CA','CO','CT','DC','DE','FL','GA','HI','IA','ID','IL','IN','KS',
                          'KY','LA','MA','MD','ME','MI','MN','MO','MS','MT','NC','ND','NE','NH','NJ','NM','NV',
                          'NY','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VA','VT','WA','WI','WV','WY');
  
//  thisSelect.options[0] = new Option('State', '', false);
  for (x=0; x<idName.length; x++)
  {
    var thisSelect = document.forms[idName[x]].state;
    for (var i=0; i<stateArray.length; i++)
    {
      var isselected = ((stateArray[i]==state) ? true : false);
      try { // Standard compliant
        thisSelect.options[i+1] = new Option(stateArray[i], stateArray[i], isselected, isselected);
      }
      catch(e) { // IE only
        thisSelect.options[i+1] = new Option(stateArray[i], stateArray[i], isselected);
      //  thisSelect.add(stateArray[i]);   
      }
    }
  }
  do_prefill( state );
}
