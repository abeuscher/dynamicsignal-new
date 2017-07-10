require("dom4");
require("bootstrap-sass");
var TweenMax = require("gsap/TweenMax");

var siteSettings = {
  "imagePath":"/wp-content/themes/ds-new/images/"
}

window.addEventListener("load", function() {
  var parallax = document.getElementsByClassName("parallax");
  if (parallax.length>0) {
    scrollSite();


  }
  var backgroundImages = document.querySelectorAll("[data-bg]");
  for (i in backgroundImages) {
    if (isElement(backgroundImages[i])) {
      thisElement = backgroundImages[i];
      thisElement.style.backgroundImage = "url('" + siteSettings.imagePath + thisElement.getAttribute("data-bg") + "')";
    }

  }
  var lzImages = document.querySelectorAll("[data-src]");
  for (i in lzImages) {
    if (isElement(lzImages[i])) {
      thisElement = lzImages[i];
      var img = document.createElement("img");
      img.src = siteSettings.imagePath + thisElement.getAttribute("data-src");
      img.alt = "";
      thisElement.appendChild(img);
    }

  }


  function isElement(o){
    return (
      typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
      o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
  );
  }

  function scrollSite() {
    var win = window;
    var doc = document;
    var body = document.body;
    var h = window.innerHeight;
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
      var bgYPos = -(bgHeight-winHeight)* (win.pageYOffset / maxScroll);
      TweenLite.to(body, 0.1, {backgroundPosition: "50% " + bgYPos + "px"});
    }

    win.addEventListener("scroll", moveParallax);
    win.addEventListener("resize", onResize);
  }

});
