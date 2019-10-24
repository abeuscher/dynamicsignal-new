var parseHTML = require("../utils/parse-html/");

var templates = {
    "connectorPanel": require("./connector-panel.pug"), // On connectors page - may still be in use   
};

function Connectors(els) {
    var bucket = els[0];
    var thisRow = document.createElement("div");
    thisRow.classList.add("row");
    for (i = 0; i < connectorData.length; i++) {
        var thisConnector = connectorData[i];
        thisConnector.id = i;
        thisRow.append(parseHTML(templates.connectorPanel(thisConnector)));
        if ((i + 1) % 4 == 0 && i != 0) {
            bucket.append(thisRow);
            var thisRow = document.createElement("div");
            thisRow.classList.add("row");
        }
    }
    bucket.append(thisRow);
}
module.exports = Connectors;