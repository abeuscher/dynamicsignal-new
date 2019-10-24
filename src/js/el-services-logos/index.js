var parseHTML = require("../utils/parse-html");

var templates = {
    "servicesLogos": require("./services-logos.pug") // Logos for integrations section of services page
}

function ServicesLogos(els) {
    var theBucket = els[0];
    if (pageData.logos) {
        theBucket.appendChild(parseHTML(templates.servicesLogos(pageData)));
    }
}
module.exports = ServicesLogos;