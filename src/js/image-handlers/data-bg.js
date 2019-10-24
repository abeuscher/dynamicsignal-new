var isElement = require("../utils/is-element.js");
var siteSettings = require("../settings.json");

function DataBg(backgroundImages) {
    for (i in backgroundImages) {
        if (isElement(backgroundImages[i])) {
            thisElement = backgroundImages[i];
            if (thisElement.getAttribute("data-bg").indexOf("http") > -1) {
                thisElement.style.backgroundImage = "url('" + thisElement.getAttribute("data-bg") + "')";
            } else {
                thisElement.style.backgroundImage = "url('" + siteSettings.imagePath + thisElement.getAttribute("data-bg") + "')";
            }
        }
    }
}
module.exports = DataBg;