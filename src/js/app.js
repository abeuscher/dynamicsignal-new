var Flickity = require("flickity");
var sortBy = require("lodash/sortBy");

var smoothscroll = require("smoothscroll-polyfill");
var ScrollMagic = require("scrollmagic");
require('../../node_modules/scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap');

var JobList = require("./job-handler/index.js");
var JobFilter = require("./job-handler/job-filter.js");
var FormHandler = require("./form-handler/index.js");
var VideoHandler = require("./video-handler/index.js");
var DigitCounter = require("./digit-counter/index.js");
var RequestDemoHandler = require("./request-demo-handler/index.js");
var parseHTML = require("./utils/parse-html.js");
var removeClassFromCollection = require("./utils/remove-class-from-collection.js");


var CheckCookies = require("./utils/check-cookies.js");
var GetMobileOS = require("./utils/get-mobile-os.js");
var TriggerGDPR = require("./gdpr-popup/index.js");

var siteSettings = require("./settings.json");

siteSettings.templates = {
  "adwordsGrid": require("./inc/ad-words-grid.pug"), // Grid for Adwords landing pages
  "adwordsLogoGarden": require("./inc/ad-words-logo-garden.pug"), // Logo garden for adwords landing pages
  "careerVideoSlide": require("./inc/career-video-slide.pug"), // Video slide on careers page  
  "connectorInfo": require("./inc/connector-info.pug"), // On connectors page - may still be in use
  "connectorPanel": require("./inc/connector-panel.pug"), // On connectors page - may still be in use          
  "customerQuote": require("./inc/customer-quote.pug"), // Quote carousel for customers page       
  "customerTile": require("./inc/customer-tile.pug"), // Logo grid for Customers page
  "demoRequestModal": require("./inc/demo-request-modal.pug"), // Modal Demo Request form
  "featuredJob": require("./inc/featured-job.pug"), // Featured job popout on careers page   
  "jobFilter": require("./inc/job-filter.pug"), // Job Filter for Careers Page     
  "jobListing": require("./inc/job-listing.pug"), // Job listing for careers page
  "logoTerminalGrid": require("./inc/logo-terminal-grid.pug"), // Flipping Logo Slides
  "logoPartnersGrid": require("./inc/logo-partners-grid.pug"), // Flipping logo slides for partners page
  "partnersTestimonial": require("./inc/partner-testimonial.pug"), // Testimonials opn agency partners page
  "servicesLogos": require("./inc/services-logos.pug") // Logos for integrations section of services page
};
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
  "action": require("./el-demo-hover-box/index.js")
}, {
  "element": "#anchor-menu",
  "action": require("./el-anchor-menu/index.js")
}, {
  "element": "#services-mapbox",
  "action": require("./el-services-map/index.js")
}, {
  "element": "#platform-graph",
  "action": require("./el-platform-graph/index.js")
}, {
  "element": "#platform-0",
  "action": require("./el-platform-sections/index.js")
}, {
  "element": "#services-integrations-logos",
  "action": function (els) {
    var theBucket = els[0];
    if (pageData.logos) {
      theBucket.appendChild(parseHTML(siteSettings.templates.servicesLogos(pageData)));
    }
  }
}, {
  "element": "#services-cs-tabs",
  "action": function () {
    makeTabs(document.querySelectorAll("#services-cs-tabs .tab"), document.querySelectorAll("#services-cs-tabs .services-cs-slide"), "data-tab-index", "active");
  }
}, {
  "element": "#services-services-tabs",
  "action": function () {
    makeTabs(document.querySelectorAll("#services-services-tabs .tab a"), document.querySelectorAll("#services-services-tabs .services-slide"), "data-tab-index", "active");
  }
},
{
  "element": "#side-nav",
  "action": require("./el-side-nav/index.js")
},
{
  "element": "#hero-words",
  "action": function (els) {
    var interval = 3000;
    var wordBucket = els[0];
    pageData.hero_words.push({ "word": wordBucket.innerHTML });
    wordBucket.setAttribute("data-current-index", pageData.hero_words.length);
    window.setTimeout(changeWord, interval);
    function changeWord() {
      var currIndex = parseInt(wordBucket.getAttribute("data-current-index"));
      var newIndex = pageData.hero_words[currIndex + 1] ? currIndex + 1 : 0;
      wordBucket.innerHTML = pageData.hero_words[newIndex].word;
      wordBucket.setAttribute("data-current-index", newIndex);
      window.setTimeout(changeWord, interval);
    }
  }
},
{
  "element": ".solutions-carousel",
  "action": function (els) {
    for (i = 0; i < els.length; i++) {
      new Flickity(els[i], {
        "prevNextButtons": false,
        "autoPlay": 5000,
        "wrapAround": true,
        "pageDots": true
      });
    }
  }
},
{
  "element": "#solutions-tab-nav",
  "action": function (els) {
    var nav = els[0];
    var buttons = nav.querySelectorAll("a");
    for (i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", buttonClick);
    }
    function buttonClick(e) {
      e.preventDefault();
      var target = this.getAttribute("data-tab");
      removeClassFromCollection("active", nav.querySelectorAll("li"));
      removeClassFromCollection("active", document.querySelectorAll(".tab-panel"));
      document.getElementById(target).classList.add("active");
      this.parentNode.classList.add("active");
    }
  }
},
{
  "element": "#map-container",
  "action": function (els) {
    var box = els[0];
    var map = document.getElementById("the-contact-map");
    box.addEventListener("click", function (e) {
      map.classList.add("clicked");
      this.addEventListener("mouseleave", function () {
        map.classList.remove("clicked");
      });
    });
  }
},
{
  "element": "#connectors",
  "action": function (els) {
    var bucket = els[0];
    var thisRow = document.createElement("div");
    thisRow.classList.add("row");
    for (i = 0; i < connectorData.length; i++) {
      var thisConnector = connectorData[i];
      thisConnector.id = i;
      thisRow.append(parseHTML(siteSettings.templates.connectorPanel(thisConnector)));
      if ((i + 1) % 4 == 0 && i != 0) {
        bucket.append(thisRow);
        var thisRow = document.createElement("div");
        thisRow.classList.add("row");
      }
    }
    bucket.append(thisRow);
  }
},
{
  "element": "#legal-docs",
  "action": function () {
    var leftLinks = document.querySelectorAll(".panel-nav a");
    var viewPanels = document.querySelectorAll(".content-pane");
    for (i = 0; i < leftLinks.length; i++) {
      var thisLink = leftLinks[i];
      thisLink.addEventListener("click", function () {
        if (!this.classList.contains("active")) {
          removeClassFromCollection("active", leftLinks);
          removeClassFromCollection("active", viewPanels);
          newIndex = this.getAttribute("data-tab");
          document.getElementById("content-pane-" + newIndex).classList.add("active");
          document.getElementById("nav-tab-" + newIndex).classList.add("active");
        }
      });
    }
  }
},
{
  "element": ".case-study-list svg",
  "action": require("./el-checkmark-bullets/")
},
{
  "element": "#sdr-quote-carousel",
  "action": require("./el-carousel-sdr-quote/")
},
{
  "element": "#customer-video-carousel",
  "action": function () {
    var videoGall = new Flickity(document.getElementById("customer-video-carousel"), {
      "wrapAround": true,
      "pageDots": false,
      "lazyLoad": 6,
      "autoPlay": 8000,
      "adaptiveHeight": false
    });
    for (i in customerData) {
      if (customerData[i].vimeo_id != "" && customerData[i].vimeo_id != null) {
        videoGall.append(parseHTML(siteSettings.templates.customerQuote(customerData[i])));
      }
    }
    var videoHandler = new VideoHandler();
    videoHandler.activateCarousel(document.getElementById("customer-video-carousel"), videoGall);
    videoGall.resize();
  }
},
{
  "element": "#customers-grid",
  "action": function (els) {
    var customerGrid = els[0];
    var sortedData = sortBy(customerData, function (i) {
      return parseInt(i.logo_sort_order);
    });
    for (i in sortedData) {
      if (sortedData[i].customer_page) {
        customerGrid.append(parseHTML(siteSettings.templates.customerTile(sortedData[i])));
      }
    }
  }
},
{
  "element": "#marketo-form-wrapper",
  "action": function () {
    siteSettings.formHandler.fixForm();
  }
},
{
  "element": "#careers-video-carousel",
  "action": function () {
    if (typeof pageData.videos != "undefined") {
      var videoGall = new Flickity(document.getElementById("careers-video-carousel"), {
        "wrapAround": true,
        "pageDots": false,
        "lazyLoad": 6,
        "autoPlay": 8000,
        "adaptiveHeight": false
      });
      for (i in pageData.videos) {
        videoGall.append(parseHTML(siteSettings.templates.careerVideoSlide(pageData.videos[i])));
      }
      videoGall.resize();
      var videoHandler = new VideoHandler();
      videoHandler.activateCarousel(document.getElementById("careers-video-carousel"), videoGall);
    }
  }
},
{
  "element": "#page-header",
  "action": require("./el-page-header/index.js")
},
{
  "element": "#sticky-header",
  "action": require("./el-sticky-header/index.js")
},
{
  "element": "#events-list",
  "action": require("./events-handlers/events-list.js")
},
{
  "element": "#webinars-upcoming",
  "action": require("./events-handlers/webinars-upcoming.js")
},
{
  "element": "#past-events-full",
  "action": require("./events-handlers/past-events-full.js")
},
{
  "element": "#partners-testimonials",
  "action": function (els) {
    var bucket = els[0];
    for (i in pageData.testimonials) {
      bucket.appendChild(parseHTML(siteSettings.templates.partnersTestimonial(pageData.testimonials[i])));
    }
  }
},
{
  "element": "#logo-grid",
  "action": function () {
    var gridGall = new Flickity("#logo-grid", {
      "prevNextButtons": false,
      lazyLoad: 24,
      "autoPlay": 10000
    });
    for (i in pageData.gridLogos) {
      if (i == 0 || (parseInt(i)) % 24 == 0) {
        if (i != 0) {
          thisSlide.appendChild(thisRow);
          gridGall.append(thisSlide);
        }
        var thisSlide = document.createElement("div");
        thisSlide.classList.add("container");
      }
      if (i == 0 || (parseInt(i)) % 6 == 0) {
        if (i != 0 && (parseInt(i)) % 24 != 0) {
          thisSlide.appendChild(thisRow);
        }
        var thisRow = document.createElement("div");
        thisRow.classList.add("row");
        thisRow.classList.add("logo-grid-row");
      }
      thisRow.appendChild(parseHTML(siteSettings.templates.homePageLogo(pageData.gridLogos[i])));
    }
    thisSlide.appendChild(thisRow);
    gridGall.append(thisSlide);
    gridGall.resize();
  }
},
{
  "element": "#logo-terminal-grid",
  "action": function (els) {
    var gridTerminal = els[0];
    var logos = [];
    var slots = parseInt(pageData.logos.length / 2);
    for (i = 0; i < slots; i++) {
      logos.push(pageData.logos[i]);
      if (pageData.logos[i + slots]) {
        logos.push(pageData.logos[i + slots]);
      }
    }
    gridTerminal.append(parseHTML(siteSettings.templates.logoTerminalGrid(logos)));
  }
},
{
  "element": "#logo-partners-grid",
  "action": function (els) {
    var gridTerminal = els[0];
    var logos = [];
    var slots = parseInt(pageData.logos.length / 2);
    for (i = 0; i < slots; i++) {
      logos.push(pageData.logos[i]);
      if (pageData.logos[i + slots]) {
        logos.push(pageData.logos[i + slots]);
      }
    }
    gridTerminal.append(parseHTML(siteSettings.templates.logoPartnersGrid(logos)));
  }
},
{
  "element": "#adwords-logo-grid",
  "action": function (els) {
    var gridTerminal = els[0];
    var logos = [];
    var slots = parseInt(pageData.logos.length / 2);
    for (i = 0; i < slots; i++) {
      logos.push(pageData.logos[i]);
      if (pageData.logos[i + slots]) {
        logos.push(pageData.logos[i + slots]);
      }
    }
    gridTerminal.append(parseHTML(siteSettings.templates.adwordsLogoGarden(logos)));
  }
},
{
  "element": "#adwords-logos",
  "action": function (els) {
    var gridTerminal = els[0];
    var logos = [];
    var slots = parseInt(pageData.logos.length / 2);
    for (i = 0; i < slots; i++) {
      logos.push(pageData.logos[i]);
      if (pageData.logos[i + slots]) {
        logos.push(pageData.logos[i + slots]);
      }
    }
    console.log(logos);
    gridTerminal.append(parseHTML(siteSettings.templates.adwordsGrid(logos)));
  }
},
{
  "element": "#job-list",
  "action": function (els) {
    var jobs = sortBy(pageData.jobs, function (i) {
      return i.post_date
    });
    var categories = sortBy(pageData.categories, function (i) {
      return i.cat_name
    });
    var opts = {
      "jobs": jobs,
      "template": siteSettings.templates.jobListing,
      "featuredTemplate": siteSettings.templates.featuredJob,
      "container": els[0]
    }
    var theJobs = new JobList(opts);
    var opts = {
      "categories": categories,
      "template": siteSettings.templates.jobFilter,
      "container": document.getElementById("job-filter"),
      "jobList": theJobs
    }
    new JobFilter(opts);
  }
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
  "action": require("./el-vertical-carousel/")
}, {
  "element": "[data-event]",
  "action": function (triggers) {
    for (i = 0; i < triggers.length; i++) {
      triggers[i].addEventListener("click", logEvent);
    }
    function logEvent(e) {
      var eventName = e.target.getAttribute("data-event");
      window['GoogleAnalyticsObject'] = 'ga';
      window['ga'] = window['ga'] || function () {
        (window['ga'].q = window['ga'].q || []).push(arguments)
      };
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ "event": eventName });
    }
  }
}, {
  "element": ".flicker-in",
  "action": function (flickContent) {
    var flickcontroller = new ScrollMagic.Controller({
      "loglevel": 0
    });

    for (i = 0; i < flickContent.length; i++) {
      var thisBlock = flickContent[i];
      new ScrollMagic.Scene({
        triggerElement: thisBlock,
        duration: 0,
        offset: -250,
        reverse: false
      })
        .on("enter", function (e) {
          if (!document.getElementById(e.currentTarget.id).classList.contains(".active")) {
            document.getElementById(e.currentTarget.id).classList.add("active");
          }
        })
        .addTo(flickcontroller)
        .id = thisBlock.id;
    }
  }
}, {
  "element": ".search-form",
  "action": function (searchForms) {
    for (i = 0; i < searchForms.length; i++) {
      searchForms[i].addEventListener("submit", function (e) {
        e.preventDefault();
        var query = this.querySelectorAll(".query")[0].value.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        location.href = "https://dynamicsignal.com/search/#q=" + encodeURI(query);
        return false;
      });
    }
  }
}, {
  "element": "[data-counter-min]",
  "action": function () {
    new DigitCounter();
  }
}, {
  "element": ".request-demo",
  "action": function (buttons) {
    RequestDemoHandler(buttons, siteSettings);
  }
}
];




function makeTabs(tabs, slides, attr, className) {
  for (i = 0; i < tabs.length; i++) {
    var thisTab = tabs[i];
    thisTab.addEventListener("click", function (e) {
      e.preventDefault();
      removeClassFromCollection(className, slides);
      removeClassFromCollection(className, tabs);
      slides[this.getAttribute(attr)].classList.add(className);
      tabs[this.getAttribute(attr)].classList.add(className);
    });
  }
}

