var parseHTML = require("../js/utils/parse-html.js");
var ScrollMagic = require("scrollmagic");

var RequestDemoHandler = require("../js/request-demo-handler/index.js");
var FormHandler = require("../js/form-handler/index.js");
var CheckCookies = require("../js/utils/check-cookies.js");

var TriggerGDPR = require("../js/gdpr-popup/index.js");
var PageResizeHandler = require("../js/page-resize-handler/");

var siteSettings = require("../js/settings.json");

siteSettings.formHandler = new FormHandler();
siteSettings.scrollController = new ScrollMagic.Controller({
  "loglevel": 0
});
siteSettings.templates = {
  "header": require("../templates/inc/header-embed.pug"),
  "footer": require("../templates/inc/footer.pug"),
  "sideNav": require("../templates/inc/side-nav.pug"),
};

window.addEventListener("load", function () {
  setUberPage();

  // Make sure everything that goes to Marketo opens in a new page for some reason
  var links = document.querySelectorAll("a.item-link");
  for (i = 0; i < links.length; i++) {
    var thisLink = links[i];
    if (thisLink.href.indexOf("amp.dynamicsignal.com") != -1) {
      thisLink.target = "_blank";
    }
  }

  // Launch GDPR warning if cookies are enabled
  if (CheckCookies()) {
    TriggerGDPR(siteSettings);
  }

  //Iterate through site actions
  for (i in siteActions) {
    var thisAction = siteActions[i];
    if (document.querySelectorAll(thisAction.element).length > 0) {
      thisAction.action(document.querySelectorAll(thisAction.element), siteSettings.scrollController);
    }
  }
});
var siteActions = [{
  "element": ".request-demo",
  "action": function (buttons) {
    RequestDemoHandler(buttons, siteSettings);
  }
}, {
  "element": "#page-header",
  "action": require("../js/widgets/el-page-header/")
},{
  "element": "#page-header",
  "action": function(els) {
    PageResizeHandler(siteSettings.breakpoints);
  }
},
{
  "element": "#side-nav",
  "action": require("../js/widgets/el-side-nav/")
}];

function setUberPage() {
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
  //var helloBar = document.createElement("div");
  //helloBar.id = "cta-bar";

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
  //document.body.append(helloBar);
  var descBlock = document.querySelectorAll(".description-block")[0];
  var uberNav = document.getElementById("top-header");
  if (descBlock) {
    descBlock.parentNode.insertBefore( uberNav, descBlock.nextSibling );
  }
  var shareWidget = document.querySelectorAll(".share-container .share-item")[0];
  if (document.body.classList.contains("hub-page")) {
    shareWidget = document.getElementById("share-main-hub");
  }
  
  var shareToggle = uberNav.querySelectorAll(".share-toggle")[0];
  if (shareToggle) {
    shareToggle.parentNode.insertBefore(shareWidget, shareToggle.nextSibling);
  }
  
  if (uberNav.classList.contains("uf-stream-banner-marketing") && descBlock) {
    theSubhead = descBlock.querySelectorAll("p")[0];
    theBannerContent = document.querySelectorAll(".stream-banner-content")[0];
    if (theSubhead && theBannerContent) {
      theBannerContent.append(theSubhead);
    }
    
  }

}