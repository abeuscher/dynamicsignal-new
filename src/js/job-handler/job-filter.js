var parseHTML = require("../utils/parse-html.js");
const GroupBy = require("lodash/groupBy");

function JobFilter(opts) {
  var self = this;
  this.opts = opts;
  const splitCategories = GroupBy(this.opts.categories, 'category_parent');
  const departments = splitCategories['419'];
  const locations = splitCategories['588'];
  let filterBox = document.getElementById("job-filter");
  let currentLoc = false;
  let currentDept = false;
  if (location.hash !== "") {
    let initCategories = location.hash.split("|");
    if (initCategories[1] !== "undefined") {
      currentLoc = locations.filter(loc => { return loc.cat_name === initCategories[1] })[0]
    }
    if (initCategories[2] !== "undefined") {
      currentDept = departments.filter(loc => { return loc.cat_name === initCategories[2] })[0]
    }
  }
  filterBox.appendChild(parseHTML(this.opts.template({ locations: locations, departments: departments, currentLoc: currentLoc, currentDept: currentDept })));
  const locMenu = filterBox.querySelectorAll(".location-select")[0];
  const deptMenu = filterBox.querySelectorAll(".dept-select")[0];
  locMenu.addEventListener("change", sendCategories);
  deptMenu.addEventListener("change", sendCategories);
  function sendCategories(e) {
    if (e) {
      e.preventDefault();
    }
    let loc = locMenu.value;
    let dept = deptMenu.value;
    self.opts.jobList.sortList(0, false, [loc ? JSON.parse(loc) : false, dept ? JSON.parse(dept) : false]);
    self.opts.jobList.writeList();
  }
  sendCategories();
}
module.exports = JobFilter;
