// JavaScript Document - 3rd Party Event Wrapper

function CallThirdPartyEvent (eventType, eventName, omnEvent, GMADevent, UniqueID, addVarArray)
{
  var success = true;
  try
  {
    if (eventType == "exec_bus_event") exec_bus_event(omnEvent, eventName, GMADevent, UniqueID);
    else if (eventType == "exec_bus_event_and_pagename") exec_bus_event_and_pagename(omnEvent, GMADevent, UniqueID, addVarArray);
  }
  catch(err)
  {
    return success = false;
  }
  return success;
}

function exec_bus_event(omnEvent, eventName, GMADevent, UniqueID)
{ 
  var success = true;
  try
  {
    /* Omniture Code */
    if ((typeof(s_gi) == "object" || typeof(s_gi) == "function") && omnEvent)
    {
      var collectEvents = '';
      var trackTheseEvents = '';
      
      if (typeof(s_account) == "undefined") s_account = 'gmadglobereportingtest';
      var s = s_gi(s_account);
      s.linkTrackVars = 'events';
      
      for (var x=0; x<omnEvent.length; x++) 
      {
        trackTheseEvents = trackTheseEvents + omnEvent;
        collectEvents = collectEvents + omnEvent + ((UniqueID) ? ":" + UniqueID : '');
        if (x<(omnEvent.length-1)) {
          collectEvents = collectEvents + ",";
          trackTheseEvents = trackTheseEvents + ",";
        }
      }
      if (trackTheseEvents != '')
      {
        s.linkTrackEvents = trackTheseEvents;
        s.events = collectEvents; 
        s.tl(this,'o',eventName);
        
        sendAjaxForDebugging(s_account + " - sending the following Omniture events: " + collectEvents);
      }
      else if (typeof(s_gi) == "object" || typeof(s_gi) == "function") sendAjaxForDebugging(s_account + " - Called the exec_bus_event function, but had no Events to send");
      // void(s.t());  
    } 
    
    /* GMAD analytics Code */
    if (typeof(gmadaAdd) == "function" && typeof(gmadaSubmit) == "function" && GMADevent)
    {
      for (var x=0; x<GMADevent.length; x++) 
      {
        gmadaAdd(GMADevent[x]);
      }
     // gmadaSubmit();
    }
  }
  catch(err)
  {
    return success = false;
  }
  return success;
}

function exec_bus_event_and_pagename(omnEvent, GMADevent, UniqueID, addVarArray)
{
  var success = true;
  try
  {
    /* Omniture Code */
    if (typeof(s) == "object" && omnEvent) 
    { /* Omniture code to track Showing of Health popup */
      if (typeof(s_account) == "undefined") s_account = 'gmadglobereportingtest'; 
      
      if (addVarArray['PageName']) s.pageName=addVarArray['PageName'];
      var collectEvents = '';
      for (var x=0; x<omnEvent.length; x++) 
      {
        collectEvents = collectEvents + omnEvent + ((UniqueID) ? ":" + UniqueID : '')
        if (x<(omnEvent.length-1)) collectEvents = collectEvents + ",";
      }
      s.events = collectEvents;     
      void(s.t());
   
      sendAjaxForDebugging(s_account + " - sending the following Omniture events: " + collectEvents);    
    }
    else if (typeof(s) == "object") sendAjaxForDebugging(s_account + " - Called the exec_bus_event function, but had no Events to send");

    /* GMAD analytics Code */    
    if (typeof(gmadaAdd) == "function" && typeof(gmadaSubmit) == "function" && GMADevent)
    {
      for (var x=0; x<GMADevent.length; x++) 
      {
        gmadaAdd(GMADevent[x]);
      }
    //  gmadaSubmit();
    }
  }
  catch(err)
  {
    return success = false;
  }
  return success;
}

function sendAjaxForDebugging(theseEvents)
{
  try
  {
    if (typeof(debugMode)!="undefined" && debugMode==1)
    {
      $.ajax({
        type: "GET",
        url: "/debug_events",
        dataType: "xml",
        data: ("logevents=" + theseEvents),
        cache: false});
    }
  }
  catch(err)
  {
  
  }
}
