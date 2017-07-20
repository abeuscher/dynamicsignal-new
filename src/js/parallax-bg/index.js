var ScrollMagic = require("scrollmagic");
require('../../../node_modules/scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap');

var isElement = require("../utils/is-element.js");

function ScrollSite(siteSettings) {
  this.ss = siteSettings
  this.makeBackgroundSlides();
  this.init();
}

ScrollSite.prototype.init = function() {
  var self = this;
  var controller = new ScrollMagic.Controller();
  var h = window.innerHeight;
  var parallax = document.getElementById("parallax");
  var slides = document.getElementsByClassName("content-slide");
  parallax.style.height = h * slides.length + "px";
  var parallaxTop = getPosition(parallax).y;
  var parallaxHeight = h*slides.length;
  var docHeight, winHeight, maxScroll;

  //Lock Background layer
  new ScrollMagic.Scene({
    offset:h/2,
          triggerElement:"#bg-slides",
          duration:h*(slides.length-1)
      })
      .setPin("#bg-slides")
      .addTo(controller);

  for (i=0;i<slides.length;i++) {
    var thisSlide = slides[i];
    thisSlide.style.height = h+"px";
    //Swap Background Image
    new ScrollMagic.Scene({
      offset:h/3,
      triggerElement:"#slide-"+i,
      duration:h
    })
    .on("enter leave", function(e) { self.swapBg(e); })
    .addTo(controller)
    .id = i;
  }

}
ScrollSite.prototype.swapBg = function(e) {
  for (i=0;i<this.divs.length;i++) {
    var thisDiv = this.divs[i];
    thisDiv.className = "";
    if (i==e.currentTarget.id) {
      thisDiv.classList.add("bg-slide","p-show")
    }
    else {
      thisDiv.classList.add("bg-slide","p-hide")
    }

  }
}
ScrollSite.prototype.makeBackgroundSlides = function() {
  var bgBucket = document.getElementById("bg-slides");
  var bgArray = typeof useCaseBackgrounds !== "undefined" ? useCaseBackgrounds : JSON.parse(bgBucket.getAttribute("data-backgrounds"));
  this.divs = [];
  bgBucket.style.height = window.innerHeight + "px";
  for (i in bgArray) {
    var div = document.createElement("div");
    div.id = "bg-slide-"+i;
    if (i>0) {
      div.classList.add("bg-slide","p-hide");
    }
    else {
      div.classList.add("bg-slide");
    }
    if (typeof useCaseBackgrounds !== "undefined") {
      div.style.background = "url('"+bgArray[i].sizes.medium_large+"') center left / cover no-repeat";
    }
    else {
      div.style.background = "url('"+this.ss.imagePath+bgArray[i]+"') center left / cover no-repeat";
    }

    div.style.height = window.innerHeight + "px";
    bgBucket.appendChild(div);
    this.divs.push(div);
  }
}
function getPosition(element) {
    var xPosition = 0;
    var yPosition = 0;

    while(element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }

    return { x: xPosition, y: yPosition };
}
module.exports = ScrollSite;
