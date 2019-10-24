var Flickity = require("flickity");

var parseHTML = require("../utils/parse-html.js");

var templates = {
    "sdrQuote": require("./sdr-quote.pug"), // Quote carousel for SDR specific career page
};

function SDRQuote() {
    var videoGall = new Flickity(document.getElementById("sdr-quote-carousel"), {
        "wrapAround": true,
        "pageDots": true,
        "lazyLoad": 6,
        "autoPlay": 8000,
        "adaptiveHeight": false
    });
    var c = [];
    for (i in pageData.quotes) {
        videoGall.append(parseHTML(templates.sdrQuote(pageData.quotes[i])));
    }
    videoGall.resize();
}
module.exports = SDRQuote;