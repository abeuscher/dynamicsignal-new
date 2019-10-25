var ScrollMagic = require("scrollmagic");
var smoothscroll = require("smoothscroll-polyfill");
require('../../node_modules/scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap');

var FormHandler = require("./form-handler/");
var VideoHandler = require("./video-handler/");
var DigitCounter = require("./digit-counter/");
var RequestDemoHandler = require("./request-demo-handler/");
var MakeTabs = require("./make-tabs/");

var CheckCookies = require("./utils/check-cookies");
var GetMobileOS = require("./utils/get-mobile-os");
var TriggerGDPR = require("./gdpr-popup/index");

var siteSettings = require("./settings.json");
siteSettings.formHandler = new FormHandler();
siteSettings.scrollController = new ScrollMagic.Controller({
  "loglevel": 0
});

window.addEventListener("load", function () {

  // Check to make sure browser accepts cookies, then provide GDPR warning if yes.
  if (CheckCookies()) {
    TriggerGDPR(siteSettings);
  }

  // Iterate through site action array. Look for elements and if present trigger their respective actions.
  // This is probably a weird way to do this, but it makes iteration and additions and removals very easy.
  for (i in siteActions) {
    var thisAction = siteActions[i];
    if (document.querySelectorAll(thisAction.element).length > 0) {
      thisAction.action(document.querySelectorAll(thisAction.element), siteSettings.scrollController);
    }
  }
  
  //Initiate video handler separately because it has a lot of things to do.
  var videoHandler = new VideoHandler();
  videoHandler.init();

  // Check for Mobile OS and force style changes if present (overrides some weird thing on some device I forget which one)
  if (GetMobileOS()) {
    var mobilePanels = document.querySelectorAll(".mobile-cta");
    for (i = 0; i < mobilePanels.length; i++) {
      mobilePanels[i].style.display = "block";
    }
    var mobilePanels = document.querySelectorAll(".desktop-cta");
    for (i = 0; i < mobilePanels.length; i++) {
      mobilePanels[i].style.display = "none";
    }
  }

  // This seems to make things prettier when combined with scrollIntoView and the ScrollMagic effects on site.
  smoothscroll.polyfill();

  // Activate UTM Catcher for Marketo
  siteSettings.formHandler.catchUTM();

});




var siteActions = [{
  "element": "#demo-hover-box",
  "action": require("./widgets/el-demo-hover-box/")
}, {
  "element": "#anchor-menu",
  "action": require("./widgets/el-anchor-menu/")
}, {
  "element": "#services-mapbox",
  "action": require("./widgets/el-services-map/")
}, {
  "element": "#platform-graph",
  "action": require("./widgets/el-platform-graph/")
}, {
  "element": "#platform-0",
  "action": require("./widgets/el-platform-sections/")
}, {
  "element": "#services-integrations-logos",
  "action": require("./widgets/el-services-logos/")
}, {
  "element": "#services-cs-tabs",
  "action": function () {
    MakeTabs(document.querySelectorAll("#services-cs-tabs .tab"), document.querySelectorAll("#services-cs-tabs .services-cs-slide"), "data-tab-index", "active");
  }
}, {
  "element": "#services-services-tabs",
  "action": function () {
    MakeTabs(document.querySelectorAll("#services-services-tabs .tab a"), document.querySelectorAll("#services-services-tabs .services-slide"), "data-tab-index", "active");
  }
},
{
  "element": "#side-nav",
  "action": require("./widgets/el-side-nav/")
},
{
  "element": "#hero-words",
  "action": require("./widgets/el-hero-words/")
},
{
  "element": ".solutions-carousel",
  "action": require("./widgets/el-carousel-solutions/")
},
{
  "element": "#solutions-tab-nav",
  "action": require("./widgets/el-solutions-tabs/")
},
{
  "element": "#map-container",
  "action": require("./widgets/el-contact-map/")
},
{
  "element": "#connectors",
  "action": require("./widgets/el-connectors/")
},
{
  "element": ".case-study-list svg",
  "action": require("./widgets/el-checkmark-bullets/")
},
{
  "element": "#customer-video-carousel",
  "action": require("./widgets/el-carousel-customers/")
},
{
  "element": "#customers-grid",
  "action": require("./widgets/el-grid-customers/")
},
{
  "element": "#marketo-form-wrapper",
  "action": function () {
    siteSettings.formHandler.fixForm();
  }
},
{
  "element": "#careers-video-carousel",
  "action": require("./widgets/el-carousel-careers")
},
{
  "element": "#page-header",
  "action": require("./widgets/el-page-header/")
},
{
  "element": "#sticky-header",
  "action": require("./widgets/el-sticky-header/")
},
{
  "element": "#events-list",
  "action": require("./events-handlers/events-list")
},
{
  "element": "#webinars-upcoming",
  "action": require("./events-handlers/webinars-upcoming")
},
{
  "element": "#past-events-full",
  "action": require("./events-handlers/past-events-full")
},
{
  "element": "#partners-testimonials",
  "action": require("./widgets/el-partners-testimonials/")
},
{
  "element": "#logo-partners-grid",
  "action": require("./widgets/el-grid-partners")
},
{
  "element": "#adwords-logo-grid",
  "action": require("./widgets/el-grid-adwords/")
},
{
  "element": "#adwords-logos",
  "action": require("./widgets/el-adwords-logos/")
},
{
  "element": "#job-list",
  "action": require("./job-handler/job-list-init")
},
{
  "element": "[data-bg]",
  "action": require("./image-handlers/data-bg")
}, {
  "element": "[data-src]",
  "action": require("./image-handlers/data-src")
}, {
  "element": "[data-bg-array]",
  "action": require("./image-handlers/data-bg-array")
}, {
  "element": ".vertical-carousel",
  "action": require("./widgets/el-vertical-carousel/")
}, {
  "element": "[data-event]",
  "action": require("./ga-event-emitter/")
}, {
  "element": ".flicker-in",
  "action": require("./flicker-load/")
}, {
  "element": ".search-form",
  "action": require("./search-form-init/")
}, {
  "element": "[data-counter-min]",
  "action": function () {
    new DigitCounter(siteSettings.scrollController);
  }
}, {
  "element": ".request-demo",
  "action": function (buttons) {
    RequestDemoHandler(buttons, siteSettings);
  }
}
];