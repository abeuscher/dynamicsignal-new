var parseHTML = require("../../utils/parse-html");
var Flickity = require("flickity");

require("flickity-as-nav-for");

var templates = {
    "customerStorySlide": require("./services-testimonial-slide.pug"), // Video slide on careers page     
    "logoSlide" : require("./services-testimonial-logo.pug")
};

function CustomerStoryCarousel(els, c) {
    var customerBucket = els[0];
    var cg = new Flickity(customerBucket, {
        "wrapAround": true,
        "pageDots": true,
        "lazyLoad": 2,
        "autoPlay": 8000,
        "adaptiveHeight": false
    });
    for (i in pageData.testimonials) {
        cg.append(parseHTML(templates.customerStorySlide(pageData.testimonials[i])));
    }
    cg.resize();
}

module.exports = CustomerStoryCarousel;