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
  this.controller = new ScrollMagic.Controller({"loglevel":0});
  var h = window.innerHeight;
  this.parallax = document.getElementById("parallax");
  this.slides = document.getElementsByClassName("content-slide");
  var parallaxTop = getPosition(this.parallax).y;
  var docHeight, winHeight, maxScroll;

  this.resize();

  for (i=0;i<this.slides.length;i++) {
    new ScrollMagic.Scene({
      offset:h/4,
      triggerElement:"#slide-"+i,
      duration:h
    })
    .on("enter leave", function(e) { self.swapBg(e); })
    .addTo(self.controller)
    .id = i;
  }

  //Lock Background layer
  new ScrollMagic.Scene({
    offset:h/2,
          triggerElement:"#bg-slides",
          duration:h*(self.slides.length-1),
          loglevel:0
      })
      .setPin("#bg-slides")
      .addTo(self.controller);


}
ScrollSite.prototype.destroy = function() {
  for (i=0;i<this.slides.length;i++) {
    this.slides[i].style.height = "auto";
  }
  this.parallax.style.height = "auto";
}
ScrollSite.prototype.resize = function() {
  var h = window.innerHeight;
  for (i=0;i<this.slides.length;i++) {
    this.slides[i].style.height = h+"px";
  }
  this.parallax.style.height = h * this.slides.length + "px";
  this.controller.update();
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
