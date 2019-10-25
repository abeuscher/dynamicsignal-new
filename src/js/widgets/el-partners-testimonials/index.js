var parseHTML = require("../../utils/parse-html");

var templates = {
    "partnersTestimonial": require("./partner-testimonial.pug"), // Testimonials opn agency partners page
};

function PartnersTestimonials(els) {
    var bucket = els[0];
    for (i in pageData.testimonials) {
        bucket.appendChild(parseHTML(templates.partnersTestimonial(pageData.testimonials[i])));
    }
}
module.exports = PartnersTestimonials;