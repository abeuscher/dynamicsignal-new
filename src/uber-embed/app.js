var parseHTML = require("../js/utils/parse-html.js");
var ScrollMagic = require("scrollmagic");

var RequestDemoHandler = require("../js/request-demo-handler/index.js");
var FormHandler = require("../js/form-handler/index.js");
var CheckCookies = require("../js/utils/check-cookies.js");

var TriggerGDPR = require("../js/gdpr-popup/index.js");
var siteSettings = {
  "gdprCookie": "ds-gdpr",
  "siteurl": "https://www.dynamicsignal.com",
  "templates": {
    "header": require("../templates/inc/header-embed.pug"),
    "footer": require("../templates/inc/footer.pug"),
    "sideNav": require("../templates/inc/side-nav.pug"),
    "demoRequestModal": require("../js/inc/demo-request-modal.pug") // Modal Demo Request form
  },
  "formHandler": new FormHandler()
};
window.addEventListener("load", function () {
  // Find the UF header
  var theHeader = document.getElementsByTagName("header")[0];

  // Tag it
  theHeader.classList.add("uber-header");

  // Make a wrapper to put everything in so the side nav can work properly.
  var theWrapper = document.createElement("div");
  theWrapper.id = "wrapper";
  theWrapper.classList.add("uber-wrapper");

  var theOverlay = document.createElement("div");
  theOverlay.id = "overlay";

  // Empty the body into the wrapper
  while (document.body.firstChild) {
    theWrapper.appendChild(document.body.firstChild);
  }
  document.body.appendChild(theWrapper);

  // Drop the header, menu, and nav toggle above the wrapper
  theWrapper.parentNode.insertBefore(parseHTML(siteSettings.templates.header(siteSettings)), theWrapper);
  theWrapper.parentNode.insertBefore(parseHTML(siteSettings.templates.sideNav(siteSettings)), theWrapper);
  var theFooter = document.getElementsByTagName("footer")[0];
  theWrapper.replaceChild(parseHTML(siteSettings.templates.footer(siteSettings)), theFooter);
  document.body.append(theOverlay);

  // Add the header shrinker
  var headController = new ScrollMagic.Controller({
    "loglevel": 0
  });
  var headerLock = new ScrollMagic.Scene({
    offset: 10,
    duration: 0
  })
    .on("enter", function (e) {
      if (!document.body.classList.contains("nav-short")) {
        document.body.classList.add("nav-short");
      }
    })
    .on("leave", function (e) {
      if (document.body.classList.contains("nav-short")) {
        document.body.classList.remove("nav-short");
      }
    })
    .addTo(headController);
  new ScrollMagic.Scene({
    offset: 0,
    duration: 0
  });
  headerLock.addTo(headController);
  // Add menu button listener
  var theToggle = document.getElementById("toggle-side-nav");
  var closeButton = document.getElementById("btn-close-sidenav");
  theToggle.addEventListener("click", function (e) {
    e.preventDefault();
    if (document.body.classList.contains("nav-open")) {
      document.body.classList.remove("nav-open");
      theWrapper.removeEventListener("click", closeBody);
      closeButton.removeEventListener("click", closeBody);
    } else {
      document.body.classList.add("nav-open");
      theWrapper.addEventListener("click", closeBody);
      closeButton.addEventListener("click", closeBody);
    }
  });

  function closeBody(e) {
    e.preventDefault();
    document.body.classList.remove("nav-open");
    theWrapper.removeEventListener("click", closeBody);
    closeButton.removeEventListener("click", closeBody);
  }

  // URL hacks - can probably remove in a few months. These were added summer of 2017
  if (location.hash.indexOf("ufh") != -1) {
    location.href = "https://resources.dynamicsignal.com/h/" + location.hash.substr(5, 1) + "/" + location.hash.substr(7, location.hash.length - 1);
  } else if (window.location.pathname.indexOf("ufh") != -1) {
    var path = window.location.pathname;
    location.href = "https://resources.dynamicsignal.com/h/" + path.substr(7, 1) + "/" + path.substr(9, path.length - 1);
  }

  // Make sure everything that goes to Marketo opens in a new page for some reason
  var links = document.querySelectorAll("a.item-link");
  for (i = 0; i < links.length; i++) {
    var thisLink = links[i];
    if (thisLink.href.indexOf("amp.dynamicsignal.com") != -1) {
      thisLink.target = "_blank";
    }
  }
  if (CheckCookies()) {
    TriggerGDPR(siteSettings);
  }
  for (i in siteActions) {
    var thisAction = siteActions[i];
    if (document.querySelectorAll(thisAction.element).length > 0) {
      thisAction.action(document.querySelectorAll(thisAction.element));
    }
  }
});
var siteActions = [{
  "element": ".request-demo",
  "action": function (buttons) {
    RequestDemoHandler(buttons, siteSettings);
  }
}];