var ScrollMagic = require("scrollmagic");

function ServicesMap(els, c) {
    new ScrollMagic.Scene({
        triggerElement: "#services-mapbox",
        duration: 500,
        offset: -100,
        reverse: false
    })
        .on("enter", function (e) {
            els[0].classList.add("active");
        })
        .addTo(c);
}
module.exports = ServicesMap;