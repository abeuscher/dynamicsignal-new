var isElement = require("../utils/is-element.js");

function ScrollSite() {
  this.init();
}
ScrollSite.prototype.init = function() {
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
module.exports = ScrollSite;
