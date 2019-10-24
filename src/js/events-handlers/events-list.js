var sortBy = require("lodash/sortBy");
var parseHTML = require("../utils/parse-html.js");

var templates = {
    "noEvents": require("./templates/no-events.pug"), // No events temlate for events page
    "eventListing": require("./templates/event-listing.pug"), // Event Listing
    "pastEventListing": require("./templates/past-event-listing.pug"), // Past event listing
}

function EventsList(els) {
    var pastCount = 0;
    var bucket = els[0];
    var pastBucket = document.getElementById("past-events");
    var currentEvents = new Array();
    var allEvents = sortBy(pageData.events, function (i) {
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
        if (thisEvent.start_date && pastCount < 5 && pastBucket) {
          pastBucket.append(parseHTML(templates.pastEventListing(thisEvent)));
          pastCount++;
        } else if (pastCount == 5 && pastBucket) {
          //pastBucket.append(parseHTML(.templates.buttonPastEvents()));
          pastCount++;
        }
      }
    }
    if (currentEvents.length > 0) {
      currentEvents.reverse();
      for (i = 0; i < currentEvents.length; i++) {
        bucket.append(parseHTML(templates.eventListing(currentEvents[i])));
      }
    } else {
      bucket.append(parseHTML(templates.noEvents()))
    }
  }
  module.exports = EventsList;