var Flickity = require("flickity");
var sortBy = require("lodash/sortBy");
var collFilter = require("lodash/filter");
var Cookies = require("js-cookie");
var smoothscroll = require("smoothscroll-polyfill");
var ScrollMagic = require("scrollmagic");
require('../../node_modules/scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap');

var JobList = require("./job-handler/index.js");
var JobFilter = require("./job-handler/job-filter.js");
var FormHandler = require("./form-handler/index.js");
var VideoHandler = require("./video-handler/index.js");
var DigitCounter = require("./digit-counter/index.js");

var parseHTML = require("./utils/parse-html.js");
var isElement = require("./utils/is-element.js");

var siteSettings = {
  "imagePath": "/wp-content/themes/ds-new/images/",
  "videoPath": "https://dyrbj6mjld-flywheel.netdna-ssl.com/wp-content/themes/ds-new/video/",
  "gdprCookie": "ds-gdpr",
  "sessionCookie": "ds-count",
  "ctaBar": require("./cta-bar.json"),
  "fontApiKey":"AIzaSyCqr2-oB5Ck52ZRAxrztzvJNdiaRJyKUL0",
  "templates": {  
    "adwordsGrid": require("./inc/ad-words-grid.pug"),
    "adwordsLogoGarden": require("./inc/ad-words-logo-garden.pug"),
    "homePageLogo": require("./inc/home-logo-slide.pug"),
    "logoTerminalGrid": require("./inc/logo-terminal-grid.pug"),
    "logoPartnersGrid": require("./inc/logo-partners-grid.pug"),
    "partnersPageLogo": require("./inc/partners-logo-slide.pug"),
    "customerTile": require("./inc/customer-tile.pug"),
    "customerQuote": require("./inc/customer-quote.pug"),
    "partnersTestimonial": require("./inc/partner-testimonial.pug"),
    "careerVideoSlide": require("./inc/career-video-slide.pug"),
    "featuredJob": require("./inc/featured-job.pug"),
    "testimonialSlide": require("./inc/testimonial-slide.pug"),
    "productDisplay": require("./inc/product-display.pug"),
    "pagerThumb": require("./inc/pager-thumb.pug"),
    "homeSlides": require("./inc/homepage-slides.pug"),
    "servicesLogos": require("./inc/services-logos.pug"),
    "connectorPanel": require("./inc/connector-panel.pug"),
    "connectorInfo": require("./inc/connector-info.pug"),
    "useCaseQuote": require("./inc/use-case-quote.pug"),
    "jobListing": require("./inc/job-listing.pug"),
    "ctaBar": require("./inc/cta-bar.pug"),
    "summitCtaBar": require("./inc/summit-cta.pug"),
    "noEvents": require("./inc/no-events.pug"),
    "eventListing": require("./inc/event-listing.pug"),
    "pastEventListing": require("./inc/past-event-listing.pug"),
    "pastEventWide": require("./inc/past-event-wide.pug"),
    "eventBreadcrumb": require("./inc/events-breadcrumbs.pug"),
    "pasteventBreadcrumb": require("./inc/past-events-breadcrumbs.pug"),
    "buttonPastEvents": require("./inc/button-past-events.pug"),
    "jobFilter": require("./inc/job-filter.pug"),
    "backgroundPicker": require("./inc/header-picker.pug"),
    "gdprPopup": require("./inc/gdpr-popup.pug"),
    "sdrQuote": require("./inc/sdr-quote.pug"),
    "modalVideo": require("./inc/modal-video-slide.pug"),
    "videoCarousel": require("./inc/video-carousel.pug"),
    "whatisSlide": require("./inc/whatis-carousel-slide.pug")
  },
  "breakpoints": {
    "xs": 0,
    "s": 641,
    "m": 1025,
    "l": 1321,
    "xl": 1921
  }
};

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

  for (i in siteActions) {
    var thisAction = siteActions[i];
    if (document.querySelectorAll(thisAction.element).length>0) {
      thisAction.action(document.querySelectorAll(thisAction.element));
    }
  }

  var videoHandler = new VideoHandler();
  videoHandler.init();

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

});




var siteActions = [{
    "element": ".demo-video-bucket",
    "action": function (panels) {
      for (i=0;i<panels.length;i++) {
        panels[i].thumb = panels[i].querySelectorAll(".gif-thumb")[0];
        panels[i].thumb.staticsrc = panels[i].thumb.src;
        panels[i].addEventListener("mouseover", function(e) {
          this.thumb.src = this.thumb.getAttribute("data-gif");
        });
        panels[i].addEventListener("mouseout", function(e) {
          this.thumb.src = this.thumb.staticsrc;
        });
      }
      wipeCookies();
    }
  },  {
    "element": "#anchor-menu",
    "action": function (els) {
      var el = els[0];
      var links = el.querySelectorAll("a");
      var anchor = el.getAttribute("data-anchor-target") ? el.getAttribute("data-anchor-target") : "start";
      for (i = 0; i < links.length; i++) {
        var button = links[i];
        button.addEventListener("click", function (e) {
          var section = document.getElementById(this.getAttribute("href").substr(1));

          if (section) {
            e.preventDefault();
            section.scrollIntoView({
              behavior: 'smooth',
              "block": anchor
            });
            if (window.history && window.history.pushState) {
              history.pushState("", document.title, "#" + section.id);
            }
          }
        });
      }
    }
  }, {
    "element": "#services-mapbox",
    "action": function (els) {
      var mapcontroller = new ScrollMagic.Controller({
        "loglevel": 0
      }); 
      new ScrollMagic.Scene({
          triggerElement: "#services-mapbox",
          duration: 500,
          offset: -100,
          reverse: false 
        })
        .on("enter", function(e) {
          els[0].classList.add("active");
        })
        .addTo(mapcontroller);
    }
  },{
    "element": "#platform-graph",
    "action": function (els) {
      var el = els[0];
      var graphcontroller = new ScrollMagic.Controller({
        "loglevel": 0
      }); 
      new ScrollMagic.Scene({
          triggerElement: "#platform-graph",
          duration: 0,
          offset: 0,
          reverse: false 
        })
        .on("enter", function(e) {
          el.classList.remove("inactive");
          //setTimeout(barTimer, 3000);
        })
        .addTo(graphcontroller);
        var bars = el.querySelectorAll(".bar .inner");
        function barTimer(e) {
          var flag = false, i=0;
          while (i<bars.length) {
            var b = bars[i];
            if (b.classList.contains("active")) {
              flag=true;
              var next = i==bars.length-1 ? bars[0] : bars[i+1];
              b.classList.remove("active");
              next.classList.add("active");
              break;
            }
            i++;
          }
          if (!flag) {
            bars[0].classList.add("active");
          }
          setTimeout(barTimer, 3000);
        }
        
    }
  },{
    "element": "#platform-0",
    "action": function () {
      var sectioncontroller = new ScrollMagic.Controller({
        "loglevel": 0
      }); 
      var sections = document.querySelectorAll(".platform-section");
      for (i=0;i<sections.length;i++) {
        var s = sections[i];
        var images = s.querySelectorAll(".platform-section-image");
        for (z=0;z<images.length;z++) {
          var thisImage = images[z];
          var tweenImage = TweenMax.fromTo(thisImage, 1, {css: {y: "60"}, ease: Linear.easeOut}, {css: {y: "-50"}, ease: Linear.easeOut});
          new ScrollMagic.Scene({
            triggerElement: s,
            duration: "80%",
            offset: "10%",
            reverse: true 
          })
          .setTween(tweenImage)
          .on("enter", function(e) {
            var el = document.getElementById(this.id);
            if (!el.classList.contains("active")) {
              el.classList.add("active");
            }
          })
          .on("leave", function(e) {
            var el = document.getElementById(this.id);
            if (el.classList.contains("active")) {
              el.classList.remove("active");
            }
          })
          .addTo(sectioncontroller)
          .id = s.id;
        }
      }
      var thisPhone = document.getElementById("platform-hero-phone");
      var tweenPhone = TweenMax.fromTo(thisPhone, 1, {css: {y: "80"}, ease: Power0.easeOut}, {css: {y: "-30"}, Power0: Linear.easeOut});
      new ScrollMagic.Scene({
        triggerElement: thisPhone,
        duration: "50%",
        offset: "0",
        reverse: true 
      })
      .setTween(tweenPhone)
      .addTo(sectioncontroller); 
    }
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
      makeTabs(document.querySelectorAll("#services-cs-tabs .tab"), document.querySelectorAll("#services-cs-tabs .services-cs-slide"),"data-tab-index","active");  
    }
  }, {
    "element": "#services-services-tabs",
    "action": function () {
      makeTabs(document.querySelectorAll("#services-services-tabs .tab a"), document.querySelectorAll("#services-services-tabs .services-slide"),"data-tab-index","active");  
    }
  },
  {
    "element": "#side-nav",
    "action": function () {
      var theWrapper = document.getElementById("overlay");
      var theHeader = document.getElementById("page-header");
      var theToggle = document.getElementById("toggle-side-nav");
      var closeButton = document.getElementById("btn-close-sidenav");
      theToggle.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (document.body.classList.contains("nav-open")) {
          document.body.classList.remove("nav-open");
          theWrapper.removeEventListener("click", closeBody);
          theHeader.removeEventListener("click", closeBody);
          closeButton.removeEventListener("click", closeBody);
        } else {
          document.body.classList.add("nav-open");
          theWrapper.addEventListener("click", closeBody);
          theHeader.addEventListener("click", closeBody);
          closeButton.addEventListener("click", closeBody);
        }

      });

      function closeBody(e) {
        e.preventDefault();
        document.body.classList.remove("nav-open");
        theWrapper.removeEventListener("click", closeBody);
        theHeader.removeEventListener("click", closeBody);
        closeButton.removeEventListener("click", closeBody);
      }
    }
  },
  {
    "element": "#mobile-screenshots",
    "action": function () {
      mobileScreens = [siteSettings.imagePath + "mobile-homepage-2.png",siteSettings.imagePath + "mobile-homepage-3.png"];
      var logoGall = new Flickity("#mobile-screenshots", {
        "prevNextButtons": false,
        "autoPlay": 5000,
        "wrapAround": true,
        "pageDots": false
      });
      for (i=0;i<mobileScreens.length;i++) {
        logoGall.append(parseHTML(siteSettings.templates.homeSlides(mobileScreens[i])));
      }
      logoGall.resize();
    }
  },
  {
    "element": "#hero-words",
    "action": function (els) {
      var interval = 3000;
      var wordBucket = els[0];
      pageData.hero_words.push({"word": wordBucket.innerHTML});
      wordBucket.setAttribute("data-current-index",pageData.hero_words.length);
      window.setTimeout(changeWord,interval);
      function changeWord () {
        var currIndex = parseInt(wordBucket.getAttribute("data-current-index"));
        var newIndex = pageData.hero_words[currIndex+1] ? currIndex+1 : 0;
        wordBucket.innerHTML = pageData.hero_words[newIndex].word;
        wordBucket.setAttribute("data-current-index",newIndex);
        window.setTimeout(changeWord,interval);
      }
    }
  },
  {
    "element": "#solutions-top-carousel",
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
    "element": "#solutions-bottom-carousel",
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
    "element": "#use-case-quotes",
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
    "element": "#case-study-page",
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
    "element": "#sdr-quote-carousel",
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
      videoHandler.activateCarousel(document.getElementById("customer-video-carousel"),videoGall);
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
      var formHandler = new FormHandler();
      formHandler.fixForm();
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
        videoHandler.activateCarousel(document.getElementById("careers-video-carousel"),videoGall);
      }
    }
  },
  {
    "element": "#page-header",
    "action": function () {
      if (window.innerWidth > siteSettings.breakpoints.s) {
        var pageHeader = document.getElementById("page-header");
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
      }
  }
  },
  {
    "element":"#sticky-header",
    "action":function(els) {
      var el = els[0];
      if (window.innerWidth > siteSettings.breakpoints.s) {
       var homeController = new ScrollMagic.Controller({
        "loglevel": 0
      });
      new ScrollMagic.Scene({
          offset: 0,
          duration: 0
        })
        .setPin(el, {pushFollowers:false})
        .setClassToggle(el,"pos-fixed")
        .addTo(homeController);         
      }     
    }
  },
  {
    "element": "#events-list",
    "action": function (els) {
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
    "element": "#webinars-upcoming",
    "action": function (els) {
      var pastCount = 0;
      var bucket = els[0];
      var pastBucket = document.getElementById("past-events");
      var currentEvents = new Array();
      var pastEvents = new Array();
      var allEvents = collFilter(pageData.events, function(i) {return i.type=="webinar";});
      allEvents = sortBy(allEvents, function (i) {
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
          pastEvents.push(thisEvent);
        }
      }
      if (currentEvents.length > 0) {
        currentEvents.reverse();
        var header = document.createElement("h2");
        header.innerHTML = "Upcoming Webinars";
        el.append(header);
        for (i = 0; i < currentEvents.length; i++) {
          el.append(parseHTML(siteSettings.templates.eventListing(currentEvents[i])));
        }
      }
      if (pastEvents.length > 0) {
        var pastBucket = document.getElementById("webinars-past");
        var header = document.createElement("h2");
        header.innerHTML = "Past Webinars";
        pastBucket.append(header);
        for (i=0;i<pastEvents.length;i++) {
          var thisEvent = pastEvents[i];
          pastBucket.append(parseHTML(siteSettings.templates.pastEventWide(thisEvent)));
        }
      }

    }
  },
  {
    "element": "#past-events-full",
    "action": function (els) {
      var pastCount = 0;
      var bucket = els[0];
      for (i = 0; i < pageData.events.length; i++) {
        var thisEvent = pageData.events[i];
        var rightNow = new Date();
        var startDate = new Date(thisEvent.start_date + "T00:00:00.000-08:00");
        if (startDate < rightNow) {
          bucket.append(parseHTML(siteSettings.templates.pastEventWide(pageData.events[i])));
        }
      }
    }
  },
  {
    "element": "#logo-strip",
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
    "element": "job-list",
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
        "featuredTemplate" : siteSettings.templates.featuredJob,
        "container": els[0]
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
    "element":"[data-bg]",
    "action":function(backgroundImages) {
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
    }
  },{
    "element":"[data-src]",
    "action":function(lzImages) {
      for (i in lzImages) {
        if (isElement(lzImages[i])) {
          thisElement = lzImages[i];
          if (typeof(JSON.parse(thisElement.getAttribute("data-src"))) === 'object') {
            var img = JSON.parse(thisElement.getAttribute("data-src")).url;
            thisElement.src = img;
          }
          else {
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
      }
    }
  }, {
    "element":"[data-bg-array]",
    "action":function(bgArrays) {
      for (i = 0; i < bgArrays.length; i++) {
        var el = bgArrays[i];
        var imageArray = JSON.parse(el.getAttribute("data-bg-array"));
        el.style.backgroundImage = "url('" + imageArray.url + "')";
      }
    }
  }, {
    "element":".vertical-carousel",
    "action":function(buckets) {
      for (var i=0;i<buckets.length;i++) {
        var theBucket = buckets[i];
        var s = {
          bucket:theBucket,
          images: theBucket.querySelectorAll(".vertical-slide"),
          controls:theBucket.querySelectorAll(".carousel-panel"),
          currentIndex:0,
          strip: theBucket.querySelectorAll(".inner")[0]
          
        };
        var switcher = function() {
          getCurrPos(s);
          setTimeout(switcher,6000);
        }
        setTimeout(switcher,3000);
        for (var c = 0;c<s.controls.length;c++) {   
          s.controls[c].addEventListener("click", function(e) {
            nextCarousel(this,s,parseInt(this.getAttribute("data-index")) + 1);
            s.pause=true;
            setTimeout(function() { s.pause=false; },6000);
          });
        } 
        function getCurrPos(el) {
          if (!el.pause) {
            for (var i = 0;i<el.strip.classList.length;i++) {
              if (el.strip.classList[i].indexOf("position")>-1) {
                var next = parseInt(el.strip.classList[i].replace(/[^0-9]/gi, ''))<el.controls.length?parseInt(el.strip.classList[i].replace(/[^0-9]/gi, ''))+1:1;
                nextCarousel(el.controls[next-1],el,next);  
              }
            }
          }
        }
        function nextCarousel(btn,el,idx) {
          resetCarousel(el);
          btn.classList.add("active");
          el.strip.classList.add("position-" + idx);
        }
        function resetCarousel(el) {
          for (var i = 0;i<el.strip.classList.length;i++) {
            if (el.strip.classList[i].indexOf("position")>-1) {
              el.strip.classList.remove(el.strip.classList[i]);
            }
          }
          for (var i=0;i<el.controls.length;i++) {
            el.controls[i].classList.remove("active");
          }
        }
      }
    }
  }, {
    "element":"[data-event]",
    "action":function(triggers) {
      for (i=0;i<triggers.length;i++) {
        triggers[i].addEventListener("click", logEvent);
      }
      function logEvent(e) {
        var eventName = e.target.getAttribute("data-event");
        window['GoogleAnalyticsObject'] = 'ga';
        window['ga'] = window['ga'] || function() {
          (window['ga'].q = window['ga'].q || []).push(arguments)
        };
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({"event" : eventName });
      }
    }
  }, {
    "element":".flicker-in",
    "action":function(flickContent) {
      var flickcontroller = new ScrollMagic.Controller({
        "loglevel": 0
      });
    
      for (i=0;i<flickContent.length;i++) {
        var thisBlock = flickContent[i];
        new ScrollMagic.Scene({
          triggerElement: thisBlock,
          duration: 0,
          offset: -250,
          reverse: false 
        })
        .on("enter", function(e) {
          if (!document.getElementById(e.currentTarget.id).classList.contains(".active")) {
            document.getElementById(e.currentTarget.id).classList.add("active");
          } 
        })
        .addTo(flickcontroller)
        .id = thisBlock.id;
      }
    }
  }, {
    "element":".search-form",
    "action":function(searchForms) {
      for (i = 0; i < searchForms.length; i++) {
        var thisForm = searchForms[i];
        thisForm.addEventListener("submit", function (e) {
          e.preventDefault();
          var query = this.querySelectorAll(".query")[0].value.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
          location.href = "https://dynamicsignal.com/search/#q=" + encodeURI(query);
          return false;
        });
      }
    }
  }, {
    "element":"[data-counter-min]",
    "action":function() {
      var dc = new DigitCounter();
    }
  }
];

function triggerGDPR() {
  var h = window.location.hostname;
  var domains = ["dynamicsignal.com","staging.dynamicsignal.flywheelsites.com","ds.local"];
  var domain = "dynamicsignal.com";
  for (i=0;i<domains.length;i++) {
    if (h.indexOf(domains[i])>-1) {
      domain = domains[i];
    }
  }
  if (!Cookies.get(siteSettings.gdprCookie)) {
    var warning = parseHTML(siteSettings.templates.gdprPopup());
    document.body.appendChild(warning);
    document.body.classList.add("gdpr-popup");
    var yesButton = document.getElementById("btn-yes");
    var noButton = document.getElementById("btn-no");
    yesButton.addEventListener("click", function (e) {
      e.preventDefault();
      Cookies.set(siteSettings.gdprCookie, "true", {
        expires: 365,
        domain: domain
      });
      warning.remove();
      document.body.classList.remove("gdpr-popup");
      return false;
    });
    window.addEventListener("click", startTheTracking);
    function startTheTracking(e) {
      Cookies.set(siteSettings.gdprCookie, "true", {
        expires: 365,
        domain: domain
      });
      triggerGA();
      window.removeEventListener("click", startTheTracking);
      return true;
    }
  } else {
    triggerGA();
  }
}

function triggerGA() {
  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });
    var f = d.body.firstChild,
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

function makeTabs(tabs,slides,attr,className) {
  for(i=0;i<tabs.length;i++) {
    var thisTab = tabs[i];
    thisTab.addEventListener("click", function(e) {
      e.preventDefault();
      clearSlides();
      slides[this.getAttribute(attr)].classList.add(className);
      tabs[this.getAttribute(attr)].classList.add(className);
    });
  }
  function clearSlides() {
    for (i=0;i<slides.length;i++) {
      slides[i].classList.remove(className);
      tabs[i].classList.remove(className);
    }
  }
}

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