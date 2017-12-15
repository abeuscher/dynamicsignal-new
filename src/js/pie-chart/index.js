var parseHTML = require("../utils/parse-html.js");

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

  self.charts = [];

  for (i=0;i<pies.length;i++) {
    var thisPie = this.makePie(pies[i]);
    thisPie.blocker1.style.transform = cssTransform(0);
    thisPie.blocker2.style.transform = cssTransform(0);
    thisPie.setter = this.set(thisPie);
    self.charts[thisPie.el.id] = thisPie;
  }

  function animateCharts() {
    for(i in self.charts) {
      var thisChart = self.charts[i];
      thisChart.setter();
    }
  }
  setTimeout(animateCharts,1000);
}
Pies.prototype.makePie = function(el) {
    el.append(parseHTML(this.template()));
    return {
      "el" : el,
      "pie" : el.querySelector('.pie'),
      "inner" : el.querySelector('.pie_inner'),
      "blocker1" : el.querySelector('.pie_blocker-1'),
      "blocker2" : el.querySelector('.pie_blocker-2'),
      "pieLeft" : el.querySelector('.pie_circle-left'),
      "pieRight" : el.querySelector('.pie_circle-right')
    }
}
Pies.prototype.set = function(thePie) {
  var res = false;

  if (thePie.el.getAttribute("data-size")) {
    thePie.el.style.width = thePie.el.getAttribute("data-size");
    thePie.el.style.height = thePie.el.getAttribute("data-size");
    thePie.pie.style.fontSize = thePie.el.getAttribute("data-size");
    thePie.el.style.lineHeight = thePie.el.getAttribute("data-size");
  }
  if (thePie.el.getAttribute("data-percent")) {
    res = function() {
      var percentage = parseInt(thePie.el.getAttribute("data-percent"));
      var degs = 360 * (percentage/100);
      var degs1 = degs > 180 ? 180 : degs;
      var degs2 = degs > 180 ? degs - 180 : 0;
      thePie.blocker1.style.transform = cssTransform(degs1);
      thePie.blocker2.style.transform = cssTransform(degs2);
      thePie.label = document.createElement("h2");
      thePie.el.append(thePie.label);
      thePie.label.innerHTML = "1%";
      function countUp() {
        if (parseInt(thePie.label.innerHTML)<percentage) {
          thePie.label.innerHTML = (parseInt(thePie.label.innerHTML) + 1) + "%";
          window.setTimeout(countUp,5);
        }
      }
      window.setTimeout(countUp,1);
    }
  }
  return res;
};

Pies.prototype.addMask = function () {
  this.inner.style.webkitMask = "-webkit-radial-gradient(center, white 0%, white 70%, transparent 71%, transparent 100%) no-repeat no-repeat 50% 50%";
}

module.exports = Pies;
