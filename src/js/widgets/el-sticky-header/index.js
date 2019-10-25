var ScrollMagic = require("scrollmagic");

function StickyHeader(els, c) {
    var el = els[0];
    if (window.innerWidth > 641) {
        new ScrollMagic.Scene({
            offset: 0,
            duration: 0
        })
            .setPin(el, { pushFollowers: false })
            .setClassToggle(el, "pos-fixed")
            .addTo(c);
    }
}
module.exports = StickyHeader;