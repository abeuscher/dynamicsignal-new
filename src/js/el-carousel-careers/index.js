var parseHTML = require("../utils/parse-html/");
var VideoHandler = require("../video-handler/");
var Flickity = require("flickity");

var templates = {
    "careerVideoSlide": require("./career-video-slide.pug"), // Video slide on careers page     
};

function CareersCarousel() {
    if (typeof pageData.videos != "undefined") {
        var videoGall = new Flickity(document.getElementById("careers-video-carousel"), {
            "wrapAround": true,
            "pageDots": false,
            "lazyLoad": 6,
            "autoPlay": 8000,
            "adaptiveHeight": false
        });
        for (i in pageData.videos) {
            videoGall.append(parseHTML(templates.careerVideoSlide(pageData.videos[i])));
        }
        videoGall.resize();
        var videoHandler = new VideoHandler();
        videoHandler.activateCarousel(document.getElementById("careers-video-carousel"), videoGall);
    }
}
module.exports = CareersCarousel;