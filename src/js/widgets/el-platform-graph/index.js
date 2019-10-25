var ScrollMagic = require("scrollmagic");

function PlatformGraph(els, c) {
    new ScrollMagic.Scene({
        triggerElement: els[0],
        duration: 0,
        offset: 0,
        reverse: false
    })
        .on("enter", function (e) {
            els[0].classList.remove("inactive");
        })
        .addTo(c);
}

module.exports = PlatformGraph;