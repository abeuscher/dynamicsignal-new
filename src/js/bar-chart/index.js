var parseHTML = require("../utils/parse-html.js");
var ScrollMagic = require("scrollmagic");
require('../../../node_modules/scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap');

var Bars = function(options) {
  this.options = options;
  this.template = require("./bar-template.pug");
  this.activateElements();
};
Bars.prototype.activateElements = function() {
  var self = this;
  var bars = document.querySelectorAll("." + this.options.className);

  self.charts = [];

  this.controller = new ScrollMagic.Controller({"loglevel":0});

  for (i=0;i<bars.length;i++) {
    var thisBar = this.makeBar(bars[i]);
    thisBar.setter = this.set(thisBar);
    self.charts[i] = thisBar;
    new ScrollMagic.Scene({
      triggerElement:"#" + thisBar.el.id,
      duration:500,
      offset:-300
    })
    .on("enter leave", function(e) { self.charts[this.id].setter(); })
    .addTo(self.controller)
    .id = i;
  }
}
Bars.prototype.makeBar = function(el) {
    el.append(parseHTML(this.template()));
    return {
      "el" : el,
      "bar" : el.querySelector('.bar-graph'),
      "remainder" : el.querySelector('.remainder'),
      "label" : el.querySelector('.label')
    }
}
Bars.prototype.set = function(theBar) {
  var res = false;
  var value = parseInt(theBar.el.getAttribute("data-value"));
  var range = parseInt(theBar.el.getAttribute("data-range"));
  res = function() {
    theBar.bar.style.width = parseInt(value/range * 100)+"%";
    theBar.label.innerHTML = range + "%";
    setTimeout(function() { theBar.el.classList.add("blue-myself"); },450);
  }
  return res;
};

module.exports = Bars;
