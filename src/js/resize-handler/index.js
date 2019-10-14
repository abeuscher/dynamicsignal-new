var keys = require("lodash/keys");

function ResizeListener(breakpoints) {
    this.breakpoints = breakpoints;
    this.callBacks = [];
}
ResizeListener.prototype.RegisterCallback = function(bp, cb) {
    this.callBacks.push({"bp":bp,"action":cb});
}
ResizeListener.prototype.Init = function() {
    var self = this;
    var resize = debounce(function() { console.log("resize");self.fireCallBacks(self.breakpoints,self.callBacks); }, 200);
    window.addEventListener("resize", resize);
}
ResizeListener.prototype.fireCallBacks = function(breakpoints,cbs) {
    var validWidths = [];
    var thisWidth = "";
    var w = window.innerWidth;
    var k = keys(breakpoints);
    for (i=0;i<k.length;i++) {
        if (breakpoints[k[i]]<=w) {
            validWidths.push(k[i]);
            thisWidth = k[i];
        }
    }
    console.log(validWidths,thisWidth);
    if (!cbs.length) {
        return;
    }
    
    for (i=0;i<cbs.length;i++) {
        
    }
}
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};
module.exports = ResizeListener;