var parseHTML = require("../utils/parse-html.js");

var templates = {
    "pastEventWide": require("./templates/past-event-wide.pug"), // Past events full page layout
}

function PastEventsFull(els) {
    var bucket = els[0];
    for (i = 0; i < pageData.events.length; i++) {
        var thisEvent = pageData.events[i];
        var rightNow = new Date();
        var startDate = new Date(thisEvent.start_date + "T00:00:00.000-08:00");
        if (startDate < rightNow) {
            bucket.append(parseHTML(templates.pastEventWide(pageData.events[i])));
        }
    }
}
module.exports = PastEventsFull;