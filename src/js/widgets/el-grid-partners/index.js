var parseHTML = require("../../utils/parse-html");

var templates = {
    "logoPartnersGrid": require("./logo-partners-grid.pug"), // Flipping logo slides for partners page
};

function PartnersLogoGrid(els) {
    var gridTerminal = els[0];
    var logos = [];
    var slots = parseInt(pageData.logos.length / 2);
    for (i = 0; i < slots; i++) {
        logos.push(pageData.logos[i]);
        if (pageData.logos[i + slots]) {
            logos.push(pageData.logos[i + slots]);
        }
    }
    gridTerminal.append(parseHTML(templates.logoPartnersGrid(logos)));
}

module.exports = PartnersLogoGrid;