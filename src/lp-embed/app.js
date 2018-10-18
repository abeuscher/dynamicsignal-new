var FormHandler = require("../js/form-handler/index.js");

window.addEventListener("load", function() { 
    if (document.getElementById("marketo-form-wrapper")) {
        var formHandler = new FormHandler();
        formHandler.catchUTM();
    }
    if (eventData) {
        buildGoogleURL();
        function buildGoogleURL() {
            var url = "http://www.google.com/calendar/event?action=TEMPLATE&amp;"
            url += "text=" + eventData.title + "&amp;";
            console.log(url);
    
        }
    }

});
/*
http://www.google.com/calendar/event?action=TEMPLATE&amp;text={{my.Event Title}}&amp;dates={{my.EventStartDate}}T{{my.EventStartTime}}/{{my.EventEndDate}}T{{my.EventEndTime}}&amp;details={{my.EventInviteDescription}}&amp;location={{my.Event Location}}&amp;trp=true&amp;sprop={{my.EventInviteWebsiteName}}&amp;sprop=name:{{my.Landing page link}}" target="_blank"><span>Add to Google Calendar</span><img class="icon" src="http://amp.dynamicsignal.com/rs/362-RJN-040/images/icon-google.png" alt=""></a></li>
  */              