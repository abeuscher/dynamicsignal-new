var Flickity = require("flickity");
var parseHTML = require("../../utils/parse-html");
var VideoHandler = require("../../video-handler");

var templates = {
    "customerQuote": require("./new-hp-carousel-slide.pug"), // Quote carousel for customers page     
};

function CustomerCarousel() {
    var quoteGall = new Flickity(document.getElementById("new-home-customer-carousel"), {
        "wrapAround": true,
        "pageDots": true,
        "prevNextButtons":false,
        "lazyLoad": 6,
        "autoPlay": 8000,
        "adaptiveHeight": false
    });
    for (i in pageData.customerSlides) {
        quoteGall.append(parseHTML(templates.customerQuote(pageData.customerSlides[i])));
    }
}
module.exports = CustomerCarousel;