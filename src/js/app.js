require("dom4");

var Flickity = require("flickity");
var TweenMax = require("gsap/TweenMax");
var JobList = require("./job-handler/index.js");

var siteSettings = {
  "imagePath":"/wp-content/themes/ds-new/images/",
  "videoPath":"/wp-content/themes/ds-new/video/"
}
var templates = {
  "homePageLogo":require("./inc/home-logo-slide.pug"),
  "testimonialSlide":require("./inc/testimonial-slide.pug"),
  "productDisplay":require("./inc/product-display.pug"),
  "jobListing":require("./inc/job-listing.pug")
}

window.addEventListener("load", function() {
  if (document.getElementById("parallax")) {
    scrollSite();
  }
  if (document.getElementById("map-container")) {
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

  //Write home page logo slider
  if (document.getElementById("logo-strip")) {
    var logoGall = new Flickity("#logo-strip",{"prevNextButtons": false,"lazyLoad":6});
    for (i in pageData.logos) {
      if (i == 0 || (parseInt(i)) % 6 == 0) {
        if (i!=0) {
          logoGall.append(thisRow);
        }
        var thisRow = document.createElement("div");
        thisRow.classList.add("row");
      }
      thisRow.appendChild(parseHTML(templates.homePageLogo(pageData.logos[i])));
    }
  }
  if (document.getElementById("home-hero-video")) {
    var videoBucket = document.getElementById("home-hero-video");
    var video = document.createElement("video");
    video.src = siteSettings.videoPath + videoBucket.getAttribute("data-video");
    video.setAttribute("autoplay",true);
    video.setAttribute("loop",true);
    videoBucket.appendChild(video);
  }

  //Write Home page logo grid
  if (document.getElementById("logo-grid")) {
    var gridGall = new Flickity("#logo-grid",{"prevNextButtons":false, lazyLoad:24});
    for (i in pageData.gridLogos) {
      if (i == 0 || (parseInt(i)) % 24 == 0) {
        if (i!=0) {
          thisSlide.appendChild(thisRow);
          gridGall.append(thisSlide);
        }
        var thisSlide = document.createElement("div");
        thisSlide.classList.add("container");
      }
      if (i == 0 || (parseInt(i)) % 6 == 0) {
        if (i!=0 && (parseInt(i)) % 24 != 0) {
          thisSlide.appendChild(thisRow);
        }
        var thisRow = document.createElement("div");
        thisRow.classList.add("row");
      }
      thisRow.appendChild(parseHTML(templates.homePageLogo(pageData.gridLogos[i])));
    }
    thisSlide.appendChild(thisRow);
    gridGall.append(thisSlide);
    gridGall.resize();
  }
  //Write Home Page testimonial slider
  if (document.getElementById("testimonial-strip")) {
    var testimonialGall = new Flickity("#testimonial-strip",{"prevNextButtons":false,"pageDots":false,"autoPlay":5000});
    for (i in pageData.testimonials) {
      testimonialGall.append(parseHTML(templates.testimonialSlide(pageData.testimonials[i])));
    }
  }

  //Write Jobs
  if (document.getElementById("job-list")) {
    var opts = {
      "jobs":pageData.jobs,
      "template":templates.jobListing,
      "container":document.getElementById("job-list")
    }

    var theJobs = new JobList(opts);

  }


  //Write Product carousels
  if (document.getElementById("product-display")) {
    var bucket = document.getElementById("product-display");
    bucket.appendChild(parseHTML(templates.productDisplay(pageData)));
    var buttons = document.querySelectorAll(".mobile-product-tile");
    for (i in buttons) {
      if (isElement(buttons[i])) {
        var thisButton = buttons[i];
        thisButton.addEventListener("click", function(e) {
          e.preventDefault();
          displayTile(this.getAttribute("data-target"),"mobile-image");
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
          displayTile(this.getAttribute("data-target"),"desktop-image");
          return false;
        });
      }
    }
    function displayTile(id,setClass) {
      var tiles = document.getElementsByClassName(setClass);
      for (i in tiles) {
        if (tiles[i].classList) {
          tiles[i].classList.remove("active");
        }
      }
      document.getElementById(id).classList.add("active");
    }
  }
  activateImages();
  activateMenu();
  function activateMenu() {
      // Navbar and dropdowns
      var toggle = document.getElementsByClassName('navbar-toggle')[0],
          collapse = document.getElementsByClassName('navbar-collapse')[0],
          dropdowns = document.getElementsByClassName('dropdown');;
      // Toggle if navbar menu is open or closed
      function toggleMenu(e) {
          e.stopPropagation();
          var collapse = document.getElementsByClassName('navbar-collapse')[0]
          collapse.classList.toggle('collapse');
          collapse.classList.toggle('in');
      }

      // Close all dropdown menus
      function closeMenus() {
          for (var j = 0; j < dropdowns.length; j++) {
              dropdowns[j].getElementsByClassName('dropdown-toggle')[0].classList.remove('dropdown-open');
              dropdowns[j].classList.remove('open');
          }
      }

      // Add click handling to dropdowns
      for (var i = 0; i < dropdowns.length; i++) {
          dropdowns[i].addEventListener('click', function() {
                  var open = this.classList.contains('open');
                  closeMenus();
                  if (!open) {
                      this.getElementsByClassName('dropdown-toggle')[0].classList.toggle('dropdown-open');
                      this.classList.toggle('open');
                  }
          });
      }

      // Close dropdowns when screen becomes big enough to switch to open by hover
      function closeMenusOnResize() {
          if (document.body.clientWidth >= 768) {
              closeMenus();
              collapse.classList.add('collapse');
              collapse.classList.remove('in');
          }
      }

      // Event listeners
      //window.addEventListener('resize', closeMenusOnResize, false);
      // toggle.addEventListener('click', toggleMenu, false);

    }
  function parseHTML(data) {
    var div = document.createElement("div");
    div.innerHTML = data;
    return div.firstElementChild;
  }
  function isElement(o){
    return (
      typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
      o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
    );
  }

  function scrollSite() {
    //console.log("fire");
    var win = window;
    var doc = document;
    var body = document.body;
    var h = window.innerHeight;
    var parallax = document.getElementById("parallax");
    parallax.style.height = h + "px";
    var slides = document.getElementsByClassName("slide");
    var bgHeight = h*slides.length;       //height of the background image;
    var docHeight, winHeight, maxScroll;
    for (i in slides) {
      if (isElement(slides[i])) {
        var thisSlide = slides[i];
        thisSlide.style.height = h+"px";
      }
    }
    function onResize(){
      docHeight = doc.innerHeight;
      winHeight = win.innerHeight;
      maxScroll = docHeight - winHeight;
      moveParallax();
    }

    function moveParallax(){
      console.log(window.scrollY);
      if (window.scrollY>=parallax.offsetTop) {
        parallax.classList.add("locked");
      }
      //var bgYPos = -(bgHeight-winHeight)* (win.pageYOffset / maxScroll);
      //TweenLite.to(body, 0.1, {backgroundPosition: "50% " + bgYPos + "px"});
    }

    win.addEventListener("scroll", moveParallax);
    win.addEventListener("resize", onResize);
  }
  function activateImages() {
    var backgroundImages = document.querySelectorAll("[data-bg]");
    for (i in backgroundImages) {
      if (isElement(backgroundImages[i])) {
        thisElement = backgroundImages[i];
        if (thisElement.getAttribute("data-bg").indexOf("http")>-1) {
          thisElement.style.backgroundImage = "url('" + thisElement.getAttribute("data-bg") + "')";
        }
        else {
          thisElement.style.backgroundImage = "url('" + siteSettings.imagePath + thisElement.getAttribute("data-bg") + "')";
        }
      }
    }
    var lzImages = document.querySelectorAll("[data-src]");
    for (i in lzImages) {
      if (isElement(lzImages[i])) {
        thisElement = lzImages[i];
        var img = document.createElement("img");
        if (thisElement.getAttribute("data-src").indexOf("http")>-1) {
          img.src = thisElement.getAttribute("data-src");
        }
        else {
          img.src = siteSettings.imagePath + thisElement.getAttribute("data-src");
        }

        img.alt = "";
        thisElement.appendChild(img);
      }
    }
  }

});
