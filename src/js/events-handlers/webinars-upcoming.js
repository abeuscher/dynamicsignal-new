var collFilter = require("lodash/filter");
var sortBy = require("lodash/sortBy");
var parseHTML = require("../utils/parse-html.js");

var templates = {
    "eventListing": require("./templates/event-listing.pug"), // Event Listing
    "pastEventWide": require("./templates/past-event-wide.pug"), // Past events full page layout
}

function WebinarsUpcoming(els) {
    var el = els[0];
    var headerEl = document.getElementById("events-header");
    var pastBucket = document.getElementById("events-past");
    var currentEvents = new Array();
    var pastEvents = new Array();
    var allEvents = pageData.events;
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
        var header = document.createElement("h1");
        header.innerHTML = "Events & Webinars";
        header.classList.add("white");
        headerEl.append(header);
        for (i = 0; i < currentEvents.length; i++) {
            el.append(parseHTML(templates.eventListing(currentEvents[i])));
        }
    }
    if (pastEvents.length > 0) {
        var pastBucket = document.getElementById("webinars-past");

        if (currentEvents.length > 0) {
            var header = document.createElement("h2");
            el.append(header);
        }
        else {
            var header = document.createElement("h1");
            header.classList.add("white");
            headerEl.append(header);
        }
        header.innerHTML = "Past Events";
        for (i = 0; i < pastEvents.length; i++) {
            var thisEvent = pastEvents[i];
            pastBucket.append(parseHTML(templates.pastEventWide(thisEvent)));
        }
    }

}
module.exports = WebinarsUpcoming;