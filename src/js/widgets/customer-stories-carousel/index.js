var parseHTML = require("../../utils/parse-html");
var Flickity = require("flickity");

require("flickity-as-nav-for");

var templates = {
    "customerStorySlide": require("./customer-story-slide.pug"), // Video slide on careers page     
    "logoSlide" : require("./customer-stories-logo.pug")
};

function CustomerStoryCarousel(els, c) {
    var customerBucket = els[0];
    var cg = new Flickity(customerBucket, {
        "wrapAround": true,
        "pageDots": false,
        "lazyLoad": 6,
        "autoPlay": 8000,
        "adaptiveHeight": false
    });
    for (i in pageData.customer_stories) {
        cg.append(parseHTML(templates.customerStorySlide(pageData.customer_stories[i])));
    }
    cg.resize();
    var logoStrip = document.getElementById("customer-stories-logos");
    var logoCarousel = new Flickity(logoStrip, {
        "wrapAround": false,
        "pageDots": false,
        "lazyLoad": false,
        "autoPlay": false,
        "adaptiveHeight": false,
        "asNavFor":customerBucket,
        "prevNextButtons":false,
        "groupCells":6
    });    
    for (i in pageData.customer_stories) {
        logoCarousel.append(parseHTML(templates.logoSlide(pageData.customer_stories[i])));
    }
}

module.exports = CustomerStoryCarousel;