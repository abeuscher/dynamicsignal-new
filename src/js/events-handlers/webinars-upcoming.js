var collFilter = require("lodash/filter");
var sortBy = require("lodash/sortBy");
var parseHTML = require("../utils/parse-html.js");

var templates = {
    "eventListing": require("./templates/event-listing.pug"), // Event Listing
    "pastEventWide": require("./templates/past-event-wide.pug"), // Past events full page layout
}

function WebinarsUpcoming() {
    var pastBucket = document.getElementById("past-events");
    var currentEvents = new Array();
    var pastEvents = new Array();
    var allEvents = collFilter(pageData.events, function (i) { return i.type == "webinar"; });
    allEvents = sortBy(allEvents, function (i) {
        return i.start_date
    });
    allEvents.reverse();
    for (i = 0; i < allEvents.length; i++) {
        var thisEvent = allEvents[i];
        var rightNow = new Date();
        rightNow.setDate(rightNow.getDate() - 1 /*days*/);
        var startDate = new Date(thisEvent.start_date + "T00:00:00.000-08:00");
        if (startDate > rightNow) {
            currentEvents.push(thisEvent);
        } else {
            pastEvents.push(thisEvent);
        }
    }
    if (currentEvents.length > 0) {
        currentEvents.reverse();
        var header = document.createElement("h2");
        header.innerHTML = "Upcoming Webinars";
        el.append(header);
        for (i = 0; i < currentEvents.length; i++) {
            el.append(parseHTML(templates.eventListing(currentEvents[i])));
        }
    }
    if (pastEvents.length > 0) {
        var pastBucket = document.getElementById("webinars-past");
        var header = document.createElement("h2");
        header.innerHTML = "Past Webinars";
        pastBucket.append(header);
        for (i = 0; i < pastEvents.length; i++) {
            var thisEvent = pastEvents[i];
            pastBucket.append(parseHTML(templates.pastEventWide(thisEvent)));
        }
    }

}
module.exports = WebinarsUpcoming;