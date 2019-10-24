var siteSettings = require("../settings.json");

function DataSrc(lzImages) {
    for (i in lzImages) {
        if (isElement(lzImages[i])) {
            thisElement = lzImages[i];
            if (typeof (JSON.parse(thisElement.getAttribute("data-src"))) === 'object') {
                var img = JSON.parse(thisElement.getAttribute("data-src")).url;
                thisElement.src = img;
            }
            else {
                var img = document.createElement("img");
                if (thisElement.getAttribute("data-src").indexOf("http") > -1) {
                    img.src = thisElement.getAttribute("data-src");
                } else {
                    img.src = siteSettings.imagePath + thisElement.getAttribute("data-src");
                }
                img.alt = "";
                thisElement.appendChild(img);
            }
        }
    }
}
module.exports = DataSrc;