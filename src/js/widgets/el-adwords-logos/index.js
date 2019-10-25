var parseHTML = require("../../utils/parse-html");

var templates = {
    "adwordsGrid": require("./ad-words-grid.pug"), // Grid for Adwords landing pages
};


function AdWordsLogos(els) {
    var gridTerminal = els[0];
    var logos = [];
    var slots = parseInt(pageData.logos.length / 2);
    for (i = 0; i < slots; i++) {
        logos.push(pageData.logos[i]);
        if (pageData.logos[i + slots]) {
            logos.push(pageData.logos[i + slots]);
        }
    }
    gridTerminal.append(parseHTML(templates.adwordsGrid(logos)));
}

module.exports = AdWordsLogos;