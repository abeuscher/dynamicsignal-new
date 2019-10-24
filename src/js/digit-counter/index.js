var ScrollMagic = require("scrollmagic");

function DigitCounter() {
    var self = this;
    var counters = document.querySelectorAll("[data-counter-min]");

    this.controller = new ScrollMagic.Controller({
        "loglevel": 0
      });
      self.countUps = [];
    
      for (i = 0; i < counters.length; i++) {
        var thisNum = counters[i];
        thisNum.setter = this.set(thisNum);
        thisNum.innerHTML = "&nbsp;";
        self.countUps[i] = thisNum;
        new ScrollMagic.Scene({
            triggerElement: "#" + thisNum.id,
            duration: 500,
            offset: -100,
            reverse: false
          })
          .on("enter", function(e) {
            self.countUps[this.id].setter();
          })
          .addTo(self.controller)
          .id = i;
      }
};
DigitCounter.prototype.set = function(el) {
    return function() {
        var minCount = parseInt(el.getAttribute("data-counter-min"));
        var maxCount = parseInt(el.getAttribute("data-counter-max"));
        var interval = parseInt(maxCount / 50) > 0 ? parseInt(maxCount / 50) : 1;
        var suffix = el.getAttribute("data-counter-max").replace(/[0-9]/g, '');
        el.innerHTML = minCount + suffix;
        function runCount() {
            var currentNum = parseInt(el.innerHTML);
            var nextNum = currentNum + interval > maxCount ? maxCount : currentNum + interval;
            el.innerHTML = nextNum + suffix;
            if (currentNum<maxCount) {
                setTimeout(runCount,10);
            }
        } 
        runCount();
    } 
}

module.exports = DigitCounter;  