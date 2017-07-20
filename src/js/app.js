require("dom4");

var Flickity = require("flickity");
var Vimeo = require('@vimeo/player');

var JobList = require("./job-handler/index.js");
var JobFilter = require("./job-handler/job-filter.js");
var ScrollSite = require("./parallax-bg/index.js");

var parseHTML = require("./utils/parse-html.js");
var isElement = require("./utils/is-element.js");

var siteSettings = {
  "imagePath": "/wp-content/themes/ds-new/images/",
  "videoPath": "/wp-content/themes/ds-new/video/",
  "templates": {
    "homePageLogo": require("./inc/home-logo-slide.pug"),
    "partnersPageLogo": require("./inc/partners-logo-slide.pug"),
    "testimonialSlide": require("./inc/testimonial-slide.pug"),
    "productDisplay": require("./inc/product-display.pug"),
    "useCaseQuote": require("./inc/use-case-quote.pug"),
    "jobListing": require("./inc/job-listing.pug"),
    "jobFilter": require("./inc/job-filter.pug")
  }
}


window.addEventListener("load", function() {
  for (i in siteActions) {
    var thisAction = siteActions[i];
    if (document.getElementById(thisAction.element)) {
      thisAction.action();
    }
  }
  activateImages();
  activateVideos();
});


var siteActions = [{
    "element": "parallax",
    "action": function() {
      return new ScrollSite(siteSettings);
    }
  },
  {
    "element": "map-container",
    "action": function() {
      var box = document.getElementById("map-container");
      var map = document.getElementById("the-contact-map");
      box.addEventListener("click", function(e) {
        console.log("click");
        map.classList.add("clicked");
        this.addEventListener("mouseleave", function() {
          map.classList.remove("clicked");
        });
      });
    }
  },
  {
    "element": "use-case-quotes",
    "action": function() {
      var quoteGall = new Flickity("#use-case-quotes", {"prevNextButtons": false});
      for (i in useCaseQuotes) {
        quoteGall.append(parseHTML(siteSettings.templates.useCaseQuote(useCaseQuotes[i])));
        console.log(useCaseQuotes[i]);
      }

    }
  },
  {
    "element": "customers-grid",
    "action": function() {
      console.log(customerData);

    }
  },
  {
    "element": "logo-strip",
    "action": function() {
      var logoGall = new Flickity("#logo-strip", {
        "prevNextButtons": false,
        "lazyLoad": 6,
        "autoPlay":5000
      });
      for (i in pageData.logos) {
        if (i == 0 || (parseInt(i)) % 6 == 0) {
          if (i != 0) {
            logoGall.append(thisRow);
          }
          var thisRow = document.createElement("div");
          thisRow.classList.add("row");
        }
        thisRow.appendChild(parseHTML(siteSettings.templates.homePageLogo(pageData.logos[i])));
      }
    }
  },
  {
    "element": "partners-logo-marquee",
    "action": function() {
      var bucket = document.getElementById("partners-logo-marquee");
      for (i in pageData.logos) {
        fetch(pageData.logos[i].logo.url)
          .then(function(data) {
            console.log(data);
            var img = document.createElement("img");
            img.src = data.url;
            img.alt = "";
            bucket.appendChild(img);
          })
      }
    }
  },
  {
    "element": "home-hero-video",
    "action": function() {
      var videoBucket = document.getElementById("home-hero-video");
      var video = document.createElement("video");
      video.src = siteSettings.videoPath + videoBucket.getAttribute("data-video");
      video.setAttribute("autoplay", true);
      video.setAttribute("loop", true);
      videoBucket.appendChild(video);
    }
  },
  {
    "element": "logo-grid",
    "action": function() {
      var gridGall = new Flickity("#logo-grid", {
        "prevNextButtons": false,
        lazyLoad: 24,
        "autoPlay":10000
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
    }
  },
  {
    "element": "job-list",
    "action": function() {
      var opts = {
        "jobs": pageData.jobs,
        "template": siteSettings.templates.jobListing,
        "container": document.getElementById("job-list")
      }
      var theJobs = new JobList(opts);
      var opts = {
        "categories":pageData.categories,
        "template":siteSettings.templates.jobFilter,
        "container":document.getElementById("job-filter"),
        "jobList":theJobs
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
            addClass(this,"active","mobile-product-tile");
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
function addClass(el,classname,groupclass) {
  var els = document.getElementsByClassName(groupclass);
  for (i=0;i<els.length;i++) {
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
}

function activateVideos() {
  var videos = document.querySelectorAll(".video-thumb");
  for (i=0;i<videos.length;i++) {
    var thisBucket = videos[i];
    var thisContent = thisBucket.querySelectorAll(".content")[0];
    var thisPlayer = makeVideo(thisBucket.getAttribute("data-video-id"));
    var vimeoPlayer = new Vimeo(thisPlayer);
    thisBucket.appendChild(thisPlayer);
    thisBucket.addEventListener("click", onStart);
    vimeoPlayer.on('pause', onFinish);
  }
  function onStart(e) {
      e.preventDefault();
      thisContent.classList.toggle("hide");
      thisPlayer.classList.toggle("hide");
      vimeoPlayer.play();
  }
  function onFinish(e) {
      vimeoPlayer.unload();
      thisContent.classList.toggle("hide");
      thisPlayer.classList.toggle("hide");
  }
}
function makeVideo(id) {
  var video = document.createElement("iframe");
  video.src = "https://player.vimeo.com/video/"+id+"?title=0&byline=0&portrait=0";
  video.setAttribute("webkitallowfullscreen","true");
  video.setAttribute("mozallowfullscreen","true");
  video.setAttribute("allowfullscreen","true");
  video.classList.add("vimeo-video");
  video.classList.add("hide");
  return video;
}
