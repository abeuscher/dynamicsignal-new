var parseHTML = require("../utils/parse-html/");

var templates = {
    "customerTile": require("./customer-tile.pug"), // Logo grid for Customers page
};

function CustomerGrid(els) {
    var customerGrid = els[0];
    var sortedData = sortBy(customerData, function (i) {
        return parseInt(i.logo_sort_order);
    });
    for (i in sortedData) {
        if (sortedData[i].customer_page) {
            customerGrid.append(parseHTML(templates.customerTile(sortedData[i])));
        }
    }
}
module.exports = CustomerGrid;