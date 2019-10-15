var parseHTML = require("../js/utils/parse-html.js");
var ScrollMagic = require("scrollmagic");
var Cookies = require("js-cookie");

var templates = {
  "header": require("../templates/inc/header-embed.pug"),
  "footer": require("../templates/inc/footer.pug"),
  "sideNav": require("../templates/inc/side-nav.pug"),
  "gdpr" : require("../js/inc/gdpr-popup.pug")
}
var ctaInfo = require("../js/cta-bar.json");
var ctaTemplate = require("../js/inc/cta-bar.pug");
var siteSettings = {
  "gdprCookie":"ds-gdpr"
}
window.addEventListener("load", function() {
    // Name root site var to feed to nav so it doesn't try to relative link to UF pages.
    var siteopts = {
      "siteurl": "https://www.dynamicsignal.com"
    }

    // Find the UF header
    var theHeader = document.getElementsByTagName("header")[0];

    // Tag it
    theHeader.classList.add("uber-header");

    // Find the Top element, which is the first element on all pages
    var theTop = document.getElementById("top");

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
    theWrapper.parentNode.insertBefore(parseHTML(templates.header(siteopts)), theWrapper);
    theWrapper.parentNode.insertBefore(parseHTML(templates.sideNav(siteopts)), theWrapper);
    var theFooter = document.getElementsByTagName("footer")[0];
    theWrapper.replaceChild(parseHTML(templates.footer(siteopts)), theFooter);
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
    theToggle.addEventListener("click", function(e) {
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
    if (checkCookies()) {
      triggerGDPR();
    }

    writeCTA();
});

function triggerGDPR() {
  
  if (!Cookies.get(siteSettings.gdprCookie)) {
    var warning = parseHTML(templates.gdpr());
    document.body.appendChild(warning);
    var yesButton = document.getElementById("btn-yes");
    var noButton = document.getElementById("btn-no");
    yesButton.addEventListener("click", function(e) {
      e.preventDefault();
      Cookies.set(siteSettings.gdprCookie,"true",{
        expires: 365,
        domain:"dynamicsignal.com"
      });
      warning.remove();
      return false;
    });
  }
}
function checkCookies(){
  var cookieEnabled = navigator.cookieEnabled;
  if (!cookieEnabled){ 
      document.cookie = "testcookie";
      cookieEnabled = document.cookie.indexOf("testcookie")!=-1;
  }
  if (cookieEnabled) {
    Cookies.remove("testcookie");
  }
  return cookieEnabled;
}
function writeCTA() {
  if (document.getElementById("cta-bar")) {
    var bar = document.getElementById("cta-bar");
    bar.append(parseHTML(ctaTemplate(ctaInfo)));
    bar.classList.add("active");
  }
} 