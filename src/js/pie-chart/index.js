var parseHTML = require("../utils/parse-html.js");
var chartjs = require("chart.js");
var ScrollMagic = require("scrollmagic");
require('../../../node_modules/scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap');

function cssTransform(degs) {
  return "rotate(" + degs + "deg) translate(0, -25%)";
}

var Pies = function(options) {
  this.options = options;
  this.template = require("./pie-template.pug");
  this.activateElements();
};
Pies.prototype.activateElements = function() {
  var self = this;
  var pies = document.querySelectorAll("." + this.options.className);

  this.controller = new ScrollMagic.Controller({
    "loglevel": 0
  });
  this.charts = [];

  for (i = 0; i < pies.length; i++) {
    var thisPie = pies[i];
    thisPie.setter = this.set(thisPie);
    this.charts[i] = thisPie;
    new ScrollMagic.Scene({
        triggerElement: "#" + thisPie.id,
        duration: 500,
        offset: -300,
        reverse: false
      })
      .on("enter", function(e) {
        self.charts[this.id].setter();
      })
      .addTo(self.controller)
      .id = i;
  }
}
Pies.prototype.makePie = function(el) {

}
Pies.prototype.set = function(thePie) {
  var thePercentage = parseInt(thePie.getAttribute("data-percent"));
  return function() {
    var data = {
      "datasets": [{
        "data": [thePercentage, 100 - thePercentage],
        "backgroundColor": ["#056fb0", "#e9e9e9"],
        "hoverBackgroundColor": ["#056fb0", "#e9e9e9"]
      }]
    };
    var options = {
      "legend": {
        "display": false
      },
      "tooltips": {
        "mode": false
      },
      cutoutPercentage : 60
    }
    new Chart(thePie, {
      "type": 'doughnut',
      "data": data,
      "options": options
    });

  }

};

module.exports = Pies;
