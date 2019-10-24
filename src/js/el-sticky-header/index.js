var ScrollMagic = require("scrollmagic");

function StickyHeader(els) {
    var el = els[0];
    if (window.innerWidth > 641) {
        var homeController = new ScrollMagic.Controller({
            "loglevel": 0
        });
        new ScrollMagic.Scene({
            offset: 0,
            duration: 0
        })
            .setPin(el, { pushFollowers: false })
            .setClassToggle(el, "pos-fixed")
            .addTo(homeController);
    }
}
module.exports = StickyHeader;