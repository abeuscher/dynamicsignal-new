var parseHTML = require("../../utils/parse-html");

var templates = {
    "adwordsLogoGarden": require("./ad-words-logo-garden.pug"), // Logo garden for adwords landing pages   
};

function AdWordsGrid(els) {
    var gridTerminal = els[0];
    var logos = [];
    var slots = parseInt(pageData.logos.length / 2);
    for (i = 0; i < slots; i++) {
        logos.push(pageData.logos[i]);
        if (pageData.logos[i + slots]) {
            logos.push(pageData.logos[i + slots]);
        }
    }
    gridTerminal.append(parseHTML(templates.adwordsLogoGarden(logos)));
}
module.exports = AdWordsGrid;