var Flickity = require("flickity");

function SoultionsCarousel(els) {
    for (i = 0; i < els.length; i++) {
        new Flickity(els[i], {
            "prevNextButtons": false,
            "autoPlay": 5000,
            "wrapAround": true,
            "pageDots": true
        });
    }
}
module.exports = SoultionsCarousel;