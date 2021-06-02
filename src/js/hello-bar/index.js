var parseHTML = require("../utils/parse-html");
var ctaTemplate = require("./cta-bar-template.pug");
var siteSettings = require("../settings.json");

function writeCTA(el) {
    if (ctaData.active!=="0") {
        document.body.classList.add("has-cta");
        el[0].classList.add("active");
        el[0].appendChild(parseHTML(ctaTemplate(ctaData)));        
    }
}

module.exports = writeCTA;