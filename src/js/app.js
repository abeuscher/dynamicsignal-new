require("dom4");
require("fetch-ie8");
require("./utils/remove-class.js");

var Flickity = require("flickity");
var uniqBy = require("lodash/uniqBy");
var sortBy = require("lodash/sortBy");
var JobList = require("./job-handler/index.js");
var JobFilter = require("./job-handler/job-filter.js");
var ScrollSite = require("./parallax-bg/index.js");
var ActivateVideos = require("./video-handler/index.js");
var Pies = require("./pie-chart/index.js");
var Bars = require("./bar-chart/index.js");
var Cookies = require("js-cookie");
var tinyModal = require("tiny-modal");
var smoothscroll = require("smoothscroll-polyfill");

var ScrollMagic = require("scrollmagic");
require('../../node_modules/scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap');

var parseHTML = require("./utils/parse-html.js");
var isElement = require("./utils/is-element.js");
var removeClassFromClass = require("./utils/remove-class-from-class.js");

var FormHandler = require("./form-handler/index.js");
var PDFHandler = require("./pdf-handler/index.js");

var siteSettings = {
  "imagePath": "/wp-content/themes/ds-new/images/",
  "videoPath": "https://dyrbj6mjld-flywheel.netdna-ssl.com/wp-content/themes/ds-new/video/",
  "gdprCookie": "ds-gdpr",
  "sessionCookie": "ds-count",
  "ctaBar": {
    "toggle": true,
    "cta": "New Article : Is Your Internal Communication Tool Broken?",
    "url": "/2018/06/10/is-your-internal-communication-tool-broken/",
    "buttonText": "Read Article"
  },
  "templates": {
    "homePageLogo": require("./inc/home-logo-slide.pug"),
    "logoTerminalGrid": require("./inc/logo-terminal-grid.pug"),
    "partnersPageLogo": require("./inc/partners-logo-slide.pug"),
    "customerTile": require("./inc/customer-tile.pug"),
    "customerQuote": require("./inc/customer-quote.pug"),
    "partnersTestimonial": require("./inc/partner-testimonial.pug"),
    "careerVideoSlide": require("./inc/career-video-slide.pug"),
    "featuredJob": require("./inc/featured-job.pug"),
    "testimonialSlide": require("./inc/testimonial-slide.pug"),
    "productDisplay": require("./inc/product-display.pug"),
    "pagerThumb": require("./inc/pager-thumb.pug"),
    "connectorPanel": require("./inc/connector-panel.pug"),
    "connectorInfo": require("./inc/connector-info.pug"),
    "useCaseQuote": require("./inc/use-case-quote.pug"),
    "jobListing": require("./inc/job-listing.pug"),
    "ctaBar": require("./inc/cta-bar.pug"),
    "summitCtaBar": require("./inc/summit-cta.pug"),
    "noEvents": require("./inc/no-events.pug"),
    "eventListing": require("./inc/event-listing.pug"),
    "pastEventListing": require("./inc/past-event-listing.pug"),
    "buttonPastEvents": require("./inc/button-past-events.pug"),
    "jobFilter": require("./inc/job-filter.pug"),
    "backgroundPicker": require("./inc/header-picker.pug"),
    "gdprPopup": require("./inc/gdpr-popup.pug"),
    "sdrQuote": require("./inc/sdr-quote.pug"),
    "modalVideo": require("./inc/modal-video-slide.pug"),
    "whatisSlide": require("./inc/whatis-carousel-slide.pug")
  },
  "breakpoints": {
    "xs": 0,
    "s": 641,
    "m": 1025,
    "l": 1321,
    "xl": 1921
  }
}

window.addEventListener("load", function () {
  function inIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }
  if (checkCookies()) {
    triggerGDPR();
  }

  writeCTA();


  for (i in siteActions) {
    var thisAction = siteActions[i];
    if (document.getElementById(thisAction.element)) {
      thisAction.action();
    }
  }
  activateImages();
  new ActivateVideos();
  activateModals();
  PDFHandler(".pdf-wrapper");
  var pies = new Pies({
    "className": "pie-wrapper",
    "mask": true,
    "color": "yellow",
    "backgroundColor": "white"
  });
  var bars = new Bars({
    "className": "bar-wrapper"
  });
  var s = getMobileOperatingSystem();
  if (s) {
    var mobilePanels = document.querySelectorAll(".mobile-cta");
    for (i = 0; i < mobilePanels.length; i++) {
      mobilePanels[i].style.display = "block";
    }
    var mobilePanels = document.querySelectorAll(".desktop-cta");
    for (i = 0; i < mobilePanels.length; i++) {
      mobilePanels[i].style.display = "none";
    }
  }
  smoothscroll.polyfill();

  // Activate UTM Catcher for Marketo

  var getForm = new FormHandler();
  getForm.catchUTM();



  // Activate search forms
  var searchForms = document.querySelectorAll(".search-form");
  for (i = 0; i < searchForms.length; i++) {
    var thisForm = searchForms[i];
    thisForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var query = this.querySelectorAll(".query")[0].value.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
      location.href = "https://dynamicsignal.com/search/#q=" + encodeURI(query);
      return false;
    });
  }
});

function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/android/i.test(userAgent)) {
    return "Android";
  }
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "iOS";
  }
  return false;
}


var siteActions = [{
    "element": "parallax",
    "action": function () {
      var Gallery = false;

      function activateScroll() {

        if (window.innerWidth > siteSettings.breakpoints.m) {
          if (!Gallery) {
            Gallery = new ScrollSite(siteSettings);
          } else {
            Gallery.resize();
          }
        } else {
          if (Gallery) {
            Gallery.destroy();
          }
        }
      }
      window.addEventListener("resize", activateScroll)
      activateScroll();
    }
  }, {
    "element": "clear-cookies",
    "action": function () {
      wipeCookies();
    }
  }, {
    "element": "feature-menu",
    "action": function () {
      var links = document.querySelectorAll("#feature-menu a");
      var controller = new ScrollMagic.Controller();
      for (i = 0; i < links.length; i++) {
        var button = links[i];
        button.addEventListener("click", function (e) {
          var section = document.getElementById(this.getAttribute("href").substr(1));
          if (section) {
            e.preventDefault();
            section.scrollIntoView({
              behavior: 'smooth',
              "block": "start"
            });
            //controller.scrollTo(section); 
            if (window.history && window.history.pushState) {
              history.pushState("", document.title, "#" + section.id);
            }
          }
        });
      }
    }
  }, {
    "element": "clear-storage",
    "action": function () {
      localStorage.clear();
    }
  },
  {
    "element": "side-nav",
    "action": function () {
      var theWrapper = document.getElementById("wrapper");
      var theToggle = document.getElementById("toggle-side-nav");
      theToggle.addEventListener("click", function (e) {
        e.preventDefault();
        if (document.body.classList.contains("nav-open")) {
          document.body.classList.remove("nav-open");
          theWrapper.removeEventListener("click", closeBody);
        } else {
          document.body.classList.add("nav-open");
          theWrapper.addEventListener("click", closeBody);
        }
      });

      function closeBody(e) {
        e.preventDefault();
        document.body.classList.remove("nav-open");
        theWrapper.removeEventListener("click", closeBody);
      }
    }
  },
  {
    "element": "mobile-screenshots",
    "action": function () {
      var logoGall = new Flickity("#mobile-screenshots", {
        "prevNextButtons": false,
        "autoPlay": 5000,
        "wrapAround": true,
        "pageDots": false
      });
    }
  },
  {
    "element": "solutions-top-carousel",
    "action": function () {
      var logoGall = new Flickity("#solutions-top-carousel", {
        "prevNextButtons": false,
        "autoPlay": 5000,
        "wrapAround": true,
        "pageDots": true
      });
    }
  },
  {
    "element": "solutions-bottom-carousel",
    "action": function () {
      var logoGall = new Flickity("#solutions-bottom-carousel", {
        "prevNextButtons": false,
        "autoPlay": 5000,
        "wrapAround": true,
        "pageDots": true
      });
    }
  },
  {
    "element": "solutions-tab-nav",
    "action": function () {
      var nav = document.getElementById("solutions-tab-nav");
      var buttons = nav.querySelectorAll("a");
      for (i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", buttonClick);
      }

      function buttonClick(e) {
        e.preventDefault();
        var target = this.getAttribute("data-tab");
        clearNav();
        clearPanels();
        document.getElementById(target).classList.add("active");
        this.parentNode.classList.add("active");

        function clearNav() {
          var items = nav.querySelectorAll("li");
          for (i = 0; i < items.length; i++) {
            items[i].classList.remove("active");
          }
        }

        function clearPanels() {
          var items = document.querySelectorAll(".tab-panel");
          for (i = 0; i < items.length; i++) {
            items[i].classList.remove("active");
          }
        }
      }
    }
  },
  {
    "element": "logo-radial",
    "action": function () {
      var theLogos = document.getElementById("logo-radial");
      var controller = new ScrollMagic.Controller({
        "loglevel": 0
      });

      new ScrollMagic.Scene({
          offset: 0,
          triggerElement: theLogos,
          duration: 0
        })
        .on("enter leave", function (e) {
          theLogos.src = siteSettings.imagePath + "features-mainpic-integrations-animated.gif";
        })
        .addTo(controller);
    }
  },
  {
    "element": "map-container",
    "action": function () {
      var box = document.getElementById("map-container");
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
    "element": "btn-search-header",
    "action": function () {
      var btn = document.getElementById("btn-search-header");
      var btnClose = document.getElementById("btn-close-search");
      var searchBox = document.getElementById("search-box-header");
      btn.addEventListener("click", function () {
        searchBox.classList.toggle("active");
      });
      btnClose.addEventListener("click", function () {
        searchBox.classList.toggle("active");
      });

    }
  },
  {
    "element": "paging-thumbs",
    "action": function () {
      if (typeof seriesNav != "undefined") {
        var bucket = document.getElementById("paging-thumbs");
        if (typeof seriesNav.prevPost.post_name != "undefined") {
          bucket.append(parseHTML(siteSettings.templates.pagerThumb(seriesNav.prevPost)));
        }
        if (typeof seriesNav.nextPost.post_name != "undefined") {
          bucket.append(parseHTML(siteSettings.templates.pagerThumb(seriesNav.nextPost)));
        }

      }
    }
  },
  {
    "element": "connectors",
    "action": function () {
      var bucket = document.getElementById("connectors");
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
    "element": "legal-docs",
    "action": function () {
      var leftLinks = document.querySelectorAll(".panel-nav a");
      var viewPanels = document.querySelectorAll(".content-pane");
      for (i = 0; i < leftLinks.length; i++) {
        var thisLink = leftLinks[i];
        thisLink.addEventListener("click", function () {
          if (!this.classList.contains("active")) {
            clearSet(leftLinks);
            clearSet(viewPanels);
            newIndex = this.getAttribute("data-tab");
            document.getElementById("content-pane-" + newIndex).classList.add("active");
            document.getElementById("nav-tab-" + newIndex).classList.add("active");
          }
        });
      }

      function clearSet(items) {
        for (i = 0; i < items.length; i++) {
          items[i].classList.remove("active");
        }
      }
    }
  },
  {
    "element": "toggle-main-drop",
    "action": function () {
      var menuToggle = document.getElementById("toggle-main-drop");
      var drop = document.getElementById("mobile-drop");
      menuToggle.addEventListener("click", function () {
        drop.classList.toggle("expanded");
        menuToggle.classList.toggle("active");
      });
      var toggles = document.querySelectorAll(".dropdown-toggle");
      for (i = 0; i < toggles.length; i++) {
        toggles[i].addEventListener("click", mobileCollapse);
      }

      function mobileCollapse(e) {
        if (window.innerWidth < siteSettings.breakpoints.m) {
          e.preventDefault();
          var drop = this.parentNode.querySelectorAll(".dropdown-menu")[0];
          drop.classList.toggle("expanded");
        }
      }
    }
  },
  {
    "element": "use-case-quotes",
    "action": function () {
      var quoteGall = new Flickity("#use-case-quotes", {
        "prevNextButtons": false
      });
      for (i in useCaseQuotes) {
        quoteGall.append(parseHTML(siteSettings.templates.useCaseQuote(useCaseQuotes[i])));
      }
      quoteGall.resize();
    }
  },
  {
    "element": "case-study-page",
    "action": function () {
      var bullets = document.querySelectorAll(".case-study-list svg");
      var midPoint = window.innerHeight / 4 * -1;
      var controller = new ScrollMagic.Controller({
        "loglevel": 0
      });
      for (i = 0; i < bullets.length; i++) {
        var thisBullet = bullets[i];
        thisBullet.id = "bullet-" + i;
        new ScrollMagic.Scene({
            offset: midPoint,
            triggerElement: thisBullet,
            duration: 0
          })
          .on("enter leave", function (e) {
            document.getElementById("bullet-" + this.id).classList.add("active");
          })
          .addTo(controller)
          .id = i;
      }
    }
  },
  {
    "element": "sdr-quote-carousel",
    "action": function () {
      var videoGall = new Flickity(document.getElementById("sdr-quote-carousel"), {
        "wrapAround": true,
        "pageDots": true,
        "lazyLoad": 6,
        "autoPlay": 8000,
        "adaptiveHeight": false
      });
      var c = [];
      for (i in pageData.quotes) {
        videoGall.append(parseHTML(siteSettings.templates.sdrQuote(pageData.quotes[i])));
      }
      videoGall.resize();
    }
  },
  {
    "element": "customer-video-carousel",
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
      videoGall.resize();
    }
  },
  {
    "element": "customers-grid",
    "action": function () {
      var customerGrid = document.getElementById("customers-grid");
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
    "element": "marketo-form-wrapper",
    "action": function () {
      var formHandler = new FormHandler();
      formHandler.fixForm();
    }
  },
  {
    "element": "careers-video-carousel",
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
      }
    }
  },
  {
    "element": "page-header",
    "action": function () {
      var headController = new ScrollMagic.Controller({
        "loglevel": 0
      });
      new ScrollMagic.Scene({
          offset: 10,
          duration: 0
        })
        .on("enter", function (e) {
          if (document.getElementById("page-header")) {
            document.getElementById("page-header").classList.add("active");
          }
          if (document.getElementById("toggle-side-nav")) {
            document.getElementById("toggle-side-nav").classList.add("short");
          }
          if (document.getElementById("btn-search-header")) {
            document.getElementById("btn-search-header").classList.add("short");
          }
          if (document.getElementById("cta-bar")) {
            document.getElementById("cta-bar").style.display = "none";
          }
        })
        .on("leave", function (e) {
          if (document.getElementById("page-header")) {
            document.getElementById("page-header").classList.remove("active");
          }
          if (document.getElementById("toggle-side-nav")) {
            document.getElementById("toggle-side-nav").classList.remove("short");
          }
          if (document.getElementById("btn-search-header")) {
            document.getElementById("btn-search-header").classList.remove("short");
          }
          if (document.getElementById("cta-bar")) {
            document.getElementById("cta-bar").style.display = "block";
          }

        })
        .addTo(headController);
    }
  },
  {
    "element": "events-list",
    "action": function () {
      var pastCount = 0;
      var bucket = document.getElementById("events-list");
      var pastBucket = document.getElementById("past-events") ? document.getElementById("past-events") : false;
      var currentEvents = new Array();
      var allEvents = sortBy(pageData.events, function (i) {
        return i.start_date
      });
      allEvents.reverse();
      for (i = 0; i < allEvents.length; i++) {
        var thisEvent = allEvents[i];
        var rightNow = new Date();
        rightNow.setDate(rightNow.getDate() - 1 /*days*/ );
        var startDate = new Date(thisEvent.start_date + "T00:00:00.000-08:00");
        if (startDate > rightNow) {
          currentEvents.push(thisEvent);
        } else {
          if (thisEvent.start_date && pastCount < 5 && pastBucket) {
            pastBucket.append(parseHTML(siteSettings.templates.pastEventListing(thisEvent)));
            pastCount++;
          } else if (pastCount == 5 && pastBucket) {
            //pastBucket.append(parseHTML(siteSettings.templates.buttonPastEvents()));
            pastCount++;
          }
        }
      }
      if (currentEvents.length > 0) {
        currentEvents.reverse();
        for (i = 0; i < currentEvents.length; i++) {
          bucket.append(parseHTML(siteSettings.templates.eventListing(currentEvents[i])));
        }
      } else {
        bucket.append(parseHTML(siteSettings.templates.noEvents()))
      }
    }
  },
  {
    "element": "past-events-full",
    "action": function () {
      var pastCount = 0;
      var bucket = document.getElementById("past-events-full");
      for (i = 0; i < pageData.events.length; i++) {
        var thisEvent = pageData.events[i];
        var rightNow = new Date();
        var startDate = new Date(thisEvent.start_date + "T00:00:00.000-08:00");
        if (startDate < rightNow) {
          bucket.append(parseHTML(siteSettings.templates.eventListing(pageData.events[i])));
        }
      }
    }
  },
  {
    "element": "logo-strip",
    "action": function () {
      cellsperSlide = window.innerWidth < siteSettings.breakpoints.m ? 3 : 5;
      var logoGall = new Flickity("#logo-strip", {
        "prevNextButtons": false,
        "lazyLoad": cellsperSlide * 2,
        "autoPlay": 5000,
        "groupCells": cellsperSlide
      });
      for (i in pageData.logos) {
        logoGall.append(parseHTML(siteSettings.templates.homePageLogo(pageData.logos[i])));
      }
      logoGall.resize();
    }
  },
  {
    "element": "partners-logo-marquee",
    "action": function () {
      var bucket = document.getElementById("partners-logo-marquee");
      for (i in pageData.logos) {
        fetch(pageData.logos[i].logo.url)
          .then(function (data) {
            var img = document.createElement("img");
            img.src = data.url;
            img.alt = "";
            bucket.appendChild(img);
          })
      }
    }
  },
  {
    "element": "partners-testimonials",
    "action": function () {
      var bucket = document.getElementById("partners-testimonials");
      for (i in pageData.testimonials) {
        bucket.appendChild(parseHTML(siteSettings.templates.partnersTestimonial(pageData.testimonials[i])));
      }
    }
  },
  {
    "element": "home-hero-video",
    "action": function () {
      function resizeBanner() {
        var videoBucket = document.getElementById("home-hero-video");
        if (window.innerWidth < siteSettings.breakpoints.m) {
          videoBucket.innerHTML = "";
          videoBucket.style.background = "url('" + siteSettings.imagePath + videoBucket.getAttribute("data-mobile-bg") + "') no-repeat center top";
          videoBucket.style.backgroundSize = "cover";
        } else {
          if (videoBucket.querySelectorAll("video").length < 1) {
            var video = document.createElement("video");
            video.src = siteSettings.videoPath + videoBucket.getAttribute("data-video");
            video.setAttribute("autoplay", true);
            video.setAttribute("loop", true);
            videoBucket.appendChild(video);
          }
        }
      }
      window.addEventListener("resize", resizeBanner);
      resizeBanner();
    }
  },
  {
    "element": "logo-grid",
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
    "element": "logo-terminal-grid",
    "action": function () {
      var gridTerminal = document.getElementById("logo-terminal-grid");
      /*
      var firstPage = pageData.logos.filter(logo => pageData.logos.indexOf(logo)%2 == 0 || pageData.logos.indexOf(logo)==0);
      var secondPage = pageData.logos.filter(logo => pageData.logos.indexOf(logo)%2 != 0);
      var logos = secondPage.concat(firstPage);
      */
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
    "element": "testimonial-strip",
    "action": function () {
      var testimonialGall = new Flickity("#testimonial-strip", {
        "prevNextButtons": false,
        "pageDots": false,
        "autoPlay": 5000
      });
      for (i in pageData.testimonials) {
        testimonialGall.append(parseHTML(siteSettings.templates.testimonialSlide(pageData.testimonials[i])));
      }
      testimonialGall.resize();
    }
  },
  {
    "element": "whatis-carousel",
    "action": function () {
      theCarousel = document.getElementById("whatis-carousel");
      thePicture = document.getElementById("whatis-carousel-image");
      var buttons = theCarousel.querySelectorAll(".carousel-button");
      for (i = 0; i < buttons.length; i++) {
        var theButton = buttons[i];
        theButton.addEventListener("click", function (e) {
          e.preventDefault();
          thePicture.style.backgroundImage = "url('" + siteSettings.imagePath + this.getAttribute("data-image") + "')";
          removeClassFromClass("carousel-button", "active");
          this.classList.add("active");
          return false;
        });
      }
    }
  },
  {
    "element": "job-list",
    "action": function () {
      var jobs = sortBy(pageData.jobs, function (i) {
        return i.post_date
      });
      var categories = sortBy(pageData.categories, function (i) {
        return i.cat_name
      });
      var opts = {
        "jobs": jobs,
        "template": siteSettings.templates.jobListing,
        "featuredTemplate" : siteSettings.templates.featuredJob,
        "container": document.getElementById("job-list") 
      }
      var theJobs = new JobList(opts);
      var opts = {
        "categories": categories,
        "template": siteSettings.templates.jobFilter,
        "container": document.getElementById("job-filter"),
        "jobList": theJobs
      }
      var theFilter = new JobFilter(opts);
    }
  },
  {
    "element": "content-menu",
    "action": function () {
      var theMenu = document.getElementById("content-menu");
      var thePane = document.getElementById("features-content-panes");
      var theImage = document.getElementById("content-lower-image");
      var theLinks = theMenu.querySelectorAll("a");
      for (i = 0; i < theLinks.length; i++) {
        var thisLink = theLinks[i];
        thisLink.addEventListener("click", function (e) {
          e.preventDefault();
          var target = document.getElementById(this.getAttribute("data-target"));
          clearPanes();
          target.classList.add("active");
          this.classList.add("active");
          if (this.getAttribute("data-content-image")) {
            theImage.style.backgroundImage = "url(" + siteSettings.imagePath + this.getAttribute("data-content-image") + ")";
          }
        })
      }

      function clearPanes() {
        var panes = thePane.querySelectorAll(".features-content-pane");
        for (i = 0; i < panes.length; i++) {
          panes[i].classList.remove("active");
        }
        var links = theMenu.querySelectorAll("a");
        for (i = 0; i < links.length; i++) {
          links[i].classList.remove("active");
        }
      }
    }
  },
  {
    "element": "product-display",
    "action": function () {
      var bucket = document.getElementById("product-display");
      bucket.appendChild(parseHTML(siteSettings.templates.productDisplay(pageData)));
      var buttons = document.querySelectorAll(".mobile-product-tile");
      for (i in buttons) {
        if (isElement(buttons[i])) {
          var thisButton = buttons[i];
          thisButton.addEventListener("click", function (e) {
            e.preventDefault();
            addClass(this, "active", "mobile-product-tile");
            displayTile(this.getAttribute("data-target"), "mobile-image");
            return false;
          });
        }
      }
      var buttons = document.querySelectorAll(".desktop-product-tile");
      for (i in buttons) {
        if (isElement(buttons[i])) {
          var thisButton = buttons[i];
          thisButton.addEventListener("click", function (e) {
            e.preventDefault();
            displayTile(this.getAttribute("data-target"), "desktop-image");
            return false;
          });
        }
      }

      function displayTile(id, setClass) {
        var tiles = document.getElementsByClassName(setClass);
        for (i in tiles) {
          if (tiles[i].classList) {
            tiles[i].classList.remove("active");
          }
        }
        document.getElementById(id).classList.add("active");
      }
    }
  }
];

function addClass(el, classname, groupclass) {
  var els = document.getElementsByClassName(groupclass);
  for (i = 0; i < els.length; i++) {
    var thisEl = els[i];
    if (thisEl.classList.item(classname)) {
      thisEl.classList.remove(classname);
    }
  }
  el.classList.add(classname);
}

function activateImages() {
  var backgroundImages = document.querySelectorAll("[data-bg]");
  for (i in backgroundImages) {
    if (isElement(backgroundImages[i])) {
      thisElement = backgroundImages[i];
      if (thisElement.getAttribute("data-bg").indexOf("http") > -1) {
        thisElement.style.backgroundImage = "url('" + thisElement.getAttribute("data-bg") + "')";
      } else {
        thisElement.style.backgroundImage = "url('" + siteSettings.imagePath + thisElement.getAttribute("data-bg") + "')";
      }
    }
  }
  var lzImages = document.querySelectorAll("[data-src]");
  for (i in lzImages) {
    if (isElement(lzImages[i])) {
      thisElement = lzImages[i];
      var img = document.createElement("img");
      if (thisElement.getAttribute("data-src").indexOf("http") > -1) {
        img.src = thisElement.getAttribute("data-src");
      } else {
        img.src = siteSettings.imagePath + thisElement.getAttribute("data-src");
      }

      img.alt = "";
      thisElement.appendChild(img);
    }
  }
  var bgArrays = document.querySelectorAll("[data-bg-array]");
  for (i = 0; i < bgArrays.length; i++) {
    var el = bgArrays[i];
    var imageArray = JSON.parse(el.getAttribute("data-bg-array"));
    el.style.backgroundImage = "url('" + imageArray.url + "')";
  }
}

function triggerGDPR() {
  var domain = "dynamicsignal.com";
  if (!Cookies.get(siteSettings.gdprCookie)) {
    var warning = parseHTML(siteSettings.templates.gdprPopup());
    document.body.appendChild(warning);
    var yesButton = document.getElementById("btn-yes");
    var noButton = document.getElementById("btn-no");
    yesButton.addEventListener("click", function (e) {
      e.preventDefault();
      Cookies.set(siteSettings.gdprCookie, "true", {
        expires: 365,
        domain: domain
      });
      warning.remove();
      // writeCTA();
      return false;
    });
    window.addEventListener("click", function (e) {
      Cookies.set(siteSettings.gdprCookie, "true", {
        expires: 365,
        domain: domain
      });
      triggerGA();
      return true;
    });
  } else {
    triggerGA();
    //writeCTA();
  }
}

function triggerGA() {
  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src =
      '//www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', 'GTM-MQKZ8M');
}

function checkCookies() {
  var cookieEnabled = navigator.cookieEnabled;
  if (!cookieEnabled) {
    document.cookie = "testcookie";
    cookieEnabled = document.cookie.indexOf("testcookie") != -1;
  }
  if (cookieEnabled) {
    Cookies.remove("testcookie");
  }
  return cookieEnabled;
}

function wipeCookies() {

  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }

}
(function (arr) {
  arr.forEach(function (item) {
    if (item.hasOwnProperty('remove')) {
      return;
    }
    Object.defineProperty(item, 'remove', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function remove() {
        if (this.parentNode !== null)
          this.parentNode.removeChild(this);
      }
    });
  });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);
/* 
function writeCTA() {
  if (siteSettings.ctaBar.toggle) {
    var bar = document.getElementById("cta-bar");
    bar.append(parseHTML(siteSettings.templates.ctaBar(siteSettings.ctaBar)));
    
    bar.classList.add("active");
  }
} */
function writeCTA() {
  if (document.getElementById("cta-bar")) {
    if (siteSettings.ctaBar.toggle) {
      var bar = document.getElementById("cta-bar");
      bar.append(parseHTML(siteSettings.templates.summitCtaBar(siteSettings.ctaBar)));
      bar.classList.add("active");
      var opener = document.getElementById("summit-cta-opener");
      var popup = document.getElementById("summit-cta-popup");
      var closer = document.getElementById("summit-cta-closer");
      var summitText = document.getElementById("summit-text");
      opener.addEventListener("click", function (e) {
        e.preventDefault();
        closer.style.display = "block";
        summitText.style.display = "none";
        popup.classList.add("active");
        bar.classList.add("open");
      });

      closer.addEventListener("click", function (e) {
        e.preventDefault();
        popup.classList.remove("active");
        closer.style.display = "none";
        summitText.style.display = "block";
        bar.classList.remove("open");
      });
    }
  }
}

function activateModals() {
  var opts = {
    showSelector: '.modal-show',
    hideSelector: '.modal-hide',
    onShow: showVideo,
    onHide: hideVideo,
    scrollTop: true
  };

  function showVideo(target, modal) {
    var theVideo = modal.querySelectorAll(".video");
    if (theVideo.length > 0) {
      var theID = theVideo[0].getAttribute("data-id");
      theVideo[0].appendChild(parseHTML(siteSettings.templates.modalVideo({
        videoid: theID
      })));
    }
  }

  function hideVideo(target, modal) {
    var theVideo = modal.querySelectorAll(".video");
    if (theVideo.length > 0) {
      theVideo[0].innerHTML = "";
    }
  }
  var theModals = document.querySelector('.modal');
  if (theModals) {
    var modal = tinyModal(theModals, opts);
  }

}