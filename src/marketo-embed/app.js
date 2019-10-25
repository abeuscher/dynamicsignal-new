var ScrollMagic = require("scrollmagic");

var CheckCookies = require("../js/utils/check-cookies");
var parseHTML = require("../js/utils/parse-html");
var FormHandler = require("../js/form-handler/");
var VideoHandler = require("../js/video-handler/");
var RequestDemoHandler = require("../js/request-demo-handler/");
var TriggerGDPR = require("../js/gdpr-popup/index");

var siteSettings = require("../js/settings.json");
siteSettings.templates = {
  "header": require("../templates/inc/header-embed.pug"),
  "footer": require("../templates/inc/footer.pug"),
  "sideNav": require("../templates/inc/side-nav.pug")
};
siteSettings.formHandler = new FormHandler();
siteSettings.scrollController = new ScrollMagic.Controller({
  "loglevel": 0
});

window.addEventListener("load", function () {
  setMarketoPage();

  if (CheckCookies()) {
    TriggerGDPR(siteSettings);
  }
  var videoHandler = new VideoHandler();
  if (document.getElementById("multivideo")) {
    videoHandler.buildMultiplayer(document.getElementById("multivideo"));
  }
  if (document.getElementById("video-demo-button")) {
    var btn = document.getElementById("video-demo-button");
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      if (history.pushState) {
        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?val=demorequest';
        window.history.pushState({ path: newurl }, '', newurl);
      }
      btn.innerHTML = "Request Sent!";
    });
  }
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
  "element": "#marketo-form-wrapper",
  "action": function () {
    siteSettings.formHandler.fixForm();
  }
},
{
  "element": "#page-header",
  "action": require("../js/el-page-header/")
},
{
  "element": "#side-nav",
  "action": require("../js/el-side-nav/")
}, {
  "element": "[data-bg]",
  "action": require("../js/image-handlers/data-bg")
}, {
  "element": "[data-src]",
  "action": require("../js/image-handlers/data-src")
}, {
  "element": "[data-bg-array]",
  "action": require("../js/image-handlers/data-bg-array")
}];

function setMarketoPage() {
  var theOverlay = document.createElement("div");
  theOverlay.id = "overlay";

  var theWrapper = document.getElementById("wrapper");
  var theHeader = parseHTML(siteSettings.templates.header(siteSettings));
  theWrapper.parentNode.insertBefore(theHeader, theWrapper);
  document.body.appendChild(parseHTML(siteSettings.templates.sideNav(siteSettings)));
  document.body.appendChild(theOverlay);
  theWrapper.appendChild(parseHTML(siteSettings.templates.footer(siteSettings)));
  theWrapper.classList.add("marketo-wrapper");
}