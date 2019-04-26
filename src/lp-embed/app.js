var FormHandler = require("../js/form-handler/index.js");

window.addEventListener("load", function() { 
    if (document.getElementById("marketo-form-wrapper")) {
        var formHandler = new FormHandler();
        formHandler.catchUTM();
    }
    if (typeof(eventData)!="undefined") {
        buildGoogleURL();
        function buildGoogleURL() {
            var url = "http://www.google.com/calendar/event?action=TEMPLATE&amp;"
            url += "text=" + eventData.title + "&amp;";
        }
    }

});            