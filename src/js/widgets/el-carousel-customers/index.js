var Flickity = require("flickity");
var parseHTML = require("../../utils/parse-html");
var VideoHandler = require("../../video-handler/");

var templates = {
    "customerQuote": require("./customer-quote.pug"), // Quote carousel for customers page     
};

function CustomerCarousel() {
    var videoGall = new Flickity(document.getElementById("customer-video-carousel"), {
        "wrapAround": true,
        "pageDots": false,
        "lazyLoad": 6,
        "autoPlay": 8000,
        "adaptiveHeight": false
    });
    for (i in customerData) {
        if (customerData[i].vimeo_id != "" && customerData[i].vimeo_id != null) {
            videoGall.append(parseHTML(templates.customerQuote(customerData[i])));
        }
    }
    var videoHandler = new VideoHandler();
    videoHandler.activateCarousel(document.getElementById("customer-video-carousel"), videoGall);
    videoGall.resize();
}
module.exports = CustomerCarousel;