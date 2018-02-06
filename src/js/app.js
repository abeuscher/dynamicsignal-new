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

var ScrollMagic = require("scrollmagic");
require('../../node_modules/scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap');

var parseHTML = require("./utils/parse-html.js");
var isElement = require("./utils/is-element.js");
var removeClassFromClass = require("./utils/remove-class-from-class.js");

var siteSettings = {
  "imagePath": "/wp-content/themes/ds-new/images/",
  "videoPath": "https://dyrbj6mjld-flywheel.netdna-ssl.com/wp-content/themes/ds-new/video/",
  "ctaBar": {
    "toggle": true,
    "cta": "We're Hiring!",
    "url": "/careers/",
    "buttonText": "View Jobs"
  },
  "templates": {
    "homePageLogo": require("./inc/home-logo-slide.pug"),
    "partnersPageLogo": require("./inc/partners-logo-slide.pug"),
    "customerTile": require("./inc/customer-tile.pug"),
    "productQuote": require("./inc/product-quote.pug"),
    "customerQuote": require("./inc/customer-quote.pug"),
    "partnersTestimonial": require("./inc/partner-testimonial.pug"),
    "careerVideoSlide": require("./inc/career-video-slide.pug"),
    "testimonialSlide": require("./inc/testimonial-slide.pug"),
    "productDisplay": require("./inc/product-display.pug"),
    "pagerThumb": require("./inc/pager-thumb.pug"),
    "connectorPanel": require("./inc/connector-panel.pug"),
    "connectorInfo": require("./inc/connector-info.pug"),
    "useCaseQuote": require("./inc/use-case-quote.pug"),
    "jobListing": require("./inc/job-listing.pug"),
    "ctaBar": require("./inc/cta-bar.pug"),
    "noEvents": require("./inc/no-events.pug"),
    "eventListing": require("./inc/event-listing.pug"),
    "pastEventListing": require("./inc/past-event-listing.pug"),
    "buttonPastEvents": require("./inc/button-past-events.pug"),
    "jobFilter": require("./inc/job-filter.pug"),
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

window.addEventListener("load", function() {

  function inIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  for (i in siteActions) {
    var thisAction = siteActions[i];
    if (document.getElementById(thisAction.element)) {
      thisAction.action();
    }
  }
  activateImages();
  new ActivateVideos();

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
    "action": function() {
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
  },
  {
    "element": "side-nav",
    "action": function() {
      var theWrapper = document.getElementById("wrapper");
      var theToggle = document.getElementById("toggle-side-nav");
      theToggle.addEventListener("click", function(e) {
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
    "element": "map-container",
    "action": function() {
      var box = document.getElementById("map-container");
      var map = document.getElementById("the-contact-map");
      box.addEventListener("click", function(e) {
        map.classList.add("clicked");
        this.addEventListener("mouseleave", function() {
          map.classList.remove("clicked");
        });
      });
    }
  },
  {
    "element": "cta-bar",
    "action": function() {
      if (siteSettings.ctaBar.toggle) {
        var bar = document.getElementById("cta-bar");
        bar.append(parseHTML(siteSettings.templates.ctaBar(siteSettings.ctaBar)));
      }
    }
  },
  {
    "element": "paging-thumbs",
    "action": function() {
      if (typeof seriesNav != "undefined") {
        console.log(seriesNav);
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
    "action": function() {
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
    "element": "toggle-main-drop",
    "action": function() {
      var menuToggle = document.getElementById("toggle-main-drop");
      var drop = document.getElementById("mobile-drop");
      menuToggle.addEventListener("click", function() {
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
    "action": function() {
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
    "action": function() {
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
          .on("enter leave", function(e) {
            document.getElementById("bullet-" + this.id).classList.add("active");
          })
          .addTo(controller)
          .id = i;
      }
    }
  },
  {
    "element": "product-video-carousel",
    "action": function() {
      var videoGall = new Flickity(document.getElementById("product-video-carousel"), {
        "wrapAround": true,
        "pageDots": false,
        "lazyLoad": 6,
        "autoPlay": 8000,
        "adaptiveHeight": false
      });
      var c = [];
      for (i in customerData) {
        if (customerData[i].vimeo_id != "") {
          videoGall.append(parseHTML(siteSettings.templates.productQuote(customerData[i])));
        }
      }
      console.log(c);
      videoGall.resize();
    }
  },
  {
    "element": "customer-video-carousel",
    "action": function() {
      var videoGall = new Flickity(document.getElementById("customer-video-carousel"), {
        "wrapAround": true,
        "pageDots": false,
        "lazyLoad": 6,
        "autoPlay": 8000,
        "adaptiveHeight": false
      });
      for (i in customerData) {
        if (customerData[i].vimeo_id != "") {
          videoGall.append(parseHTML(siteSettings.templates.customerQuote(customerData[i])));
        }
      }
      videoGall.resize();
    }
  },
  {
    "element": "customers-grid",
    "action": function() {
      //console.log(customerData);
      var customerGrid = document.getElementById("customers-grid");
      var sortedData = sortBy(customerData, function(i) {
        return parseInt(i.logo_sort_order);
      });
      console.log(customerData,sortedData);
      for (i in sortedData) {
        if (sortedData[i].customer_page) {
          customerGrid.append(parseHTML(siteSettings.templates.customerTile(sortedData[i])));
        }
      }
    }
  },
  {
    "element": "mktoForm_1064",
    "action": function() {
      MktoForms2.whenReady(function(form) {
        fixMarketoForm();
      });
    }
  },
  {
    "element": "mktoForm_1163",
    "action": function() {

      MktoForms2.whenReady(function(form) {
        fixMarketoForm();
        var formEl = form.getFormElem()[0],
          emailEl = formEl.querySelector('#Email'),
          submitEl = formEl.querySelector('BUTTON[type="submit"]'),
          recaptchaEl = document.querySelector('.g-recaptcha');

        form.submittable(false);

        // force resize reCAPTCHA frame
        recaptchaEl.querySelector('IFRAME').setAttribute('height', '140');

        // move reCAPTCHA inside form container
        formEl.appendChild(recaptchaEl);

        form.onValidate(function(builtInValidation) {
          if (!builtInValidation) return;

          var recaptchaResponse = grecaptcha.getResponse();
          if (!recaptchaResponse) {
            recaptchaEl.classList.add('mktoInvalid');
          } else {
            recaptchaEl.classList.remove('mktoInvalid');
            form.addHiddenFields({
              lastRecaptchaUserInput: recaptchaResponse,
              captchaStatus: true
            });
            form.submittable(true);
          }
        });
        var theButton = theForm.querySelectorAll("iframe")[0];
        theButton.addEventListener("click", function() {
          for (i = 0; i < textFields.length; i++) {
            var el = textFields[i];
            if (el.value != "") {
              el.classList.add("filled-out");
            } else {
              if (el.classList.item("filled-out")) {
                el.classList.remove("filled-out");
              }
            }
          }
        });
        var theForm = document.getElementById("mktoForm_1163");
        var textFields = theForm.querySelectorAll(".mktoTextField,.mktoEmailField,.mktoTelField");
        for (i = 0; i < textFields.length; i++) {
          //textFields[i].addEventListener("blur", updateClasses);
        }

        function updateClasses() {
          if (this.value != "") {
            this.classList.add("filled-out");
          } else {
            if (this.classList.item("filled-out")) {
              this.classList.remove("filled-out");
            }
          }
        }
      });
    }
  },
  {
    "element": "careers-video-carousel",
    "action": function() {
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
    "action": function() {
      var headController = new ScrollMagic.Controller({
        "loglevel": 0
      });
      new ScrollMagic.Scene({
          offset: 10,
          duration: 0
        })
        .on("enter", function(e) {
          document.getElementById("page-header").classList.add("active");
          document.getElementById("toggle-side-nav").classList.add("short");
        })
        .on("leave", function(e) {
          document.getElementById("page-header").classList.remove("active");
          document.getElementById("toggle-side-nav").classList.remove("short");
        })
        .addTo(headController);
    }
  },
  {
    "element": "events-list",
    "action": function() {
      var pastCount = 0;
      var bucket = document.getElementById("events-list");
      var pastBucket = document.getElementById("past-events") ? document.getElementById("past-events") : false;
      var currentEvents = new Array();
      var allEvents = sortBy(pageData.events, function(i) {
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
    "action": function() {
      //console.log(pageData.events);
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
    "action": function() {
      //function setHomeGall() {
      console.log("fire home gall");
        //document.getElementById("logo-strip").innerHTML = "";
        cellsperSlide = window.innerWidth < siteSettings.breakpoints.m ? 3 : 5;
        var logoGall = new Flickity("#logo-strip", {
          "prevNextButtons": false,
          "lazyLoad": cellsperSlide*2,
          "autoPlay": 5000,
          "groupCells": cellsperSlide
        });
        for (i in pageData.logos) {
          logoGall.append(parseHTML(siteSettings.templates.homePageLogo(pageData.logos[i])));
        }
        logoGall.resize();
      //}
      //window.addEventListener("resize", setHomeGall);
      //setHomeGall();
    }
  },
  {
    "element": "partners-logo-marquee",
    "action": function() {
      var bucket = document.getElementById("partners-logo-marquee");
      for (i in pageData.logos) {
        fetch(pageData.logos[i].logo.url)
          .then(function(data) {
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
    "action": function() {
      var bucket = document.getElementById("partners-testimonials");
      for (i in pageData.testimonials) {
        bucket.appendChild(parseHTML(siteSettings.templates.partnersTestimonial(pageData.testimonials[i])));
      }
    }
  },
  {
    "element": "home-hero-video",
    "action": function() {
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
    "action": function() {
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
    "element": "testimonial-strip",
    "action": function() {
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
    "action": function() {
      theCarousel = document.getElementById("whatis-carousel");
      thePicture = document.getElementById("whatis-carousel-image");
      var buttons = theCarousel.querySelectorAll(".carousel-button");
      for (i = 0; i < buttons.length; i++) {
        var theButton = buttons[i];
        theButton.addEventListener("click", function(e) {
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
    "action": function() {
      var jobs = sortBy(pageData.jobs, function(i) {
        return i.post_date
      });
      var categories = sortBy(pageData.categories, function(i) {
        return i.cat_name
      });
      //console.log(pageData.categories);
      var opts = {
        "jobs": jobs,
        "template": siteSettings.templates.jobListing,
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
    "element": "product-display",
    "action": function() {
      var bucket = document.getElementById("product-display");
      bucket.appendChild(parseHTML(siteSettings.templates.productDisplay(pageData)));
      var buttons = document.querySelectorAll(".mobile-product-tile");
      for (i in buttons) {
        if (isElement(buttons[i])) {
          var thisButton = buttons[i];
          thisButton.addEventListener("click", function(e) {
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
          thisButton.addEventListener("click", function(e) {
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

function fixMarketoForm() {
  var submitButton = document.querySelectorAll("button[type=submit]")[0];
  submitButton.classList.remove("mktoButton");
  submitButton.classList.add("button");
  var els = document.querySelectorAll(".mktoField");
  console.log(els);
  for (i = 0; i < els.length; i++) {
    var thisEl = els[i];
    thisEl.removeAttribute("placeholder");
    if (thisEl.type == "select-one") {
      var label = document.querySelectorAll("label[for=" + thisEl.name + "]")[0];
      label.style.display = "none";
    }
    thisEl.addEventListener("focus", setLabel);
    thisEl.addEventListener("blur", unsetLabel);

    function setLabel(e) {
      var label = document.querySelectorAll("label[for=" + this.name + "]")[0];
      label.classList.add("focus");
      removeErrors();
    }

    function unsetLabel(e) {
      var label = document.querySelectorAll("label[for=" + this.name + "]")[0];
      if (this.value == "") {
        label.classList.remove("focus");
      }
      removeErrors();
    }

    function removeErrors() {
      var error = document.querySelectorAll(".mktoError");
      if (error.length > 0) {
        for (i = 0; i < error.length; i++) {
          error[i].parentNode.removeChild(error[i]);
        }
      }
    }
  }
}
