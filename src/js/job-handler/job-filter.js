var parseHTML = require("../utils/parse-html.js");

function JobFilter(opts) {
  var self = this;
  this.opts = opts;
  this.opts.container.appendChild(parseHTML(this.opts.template(this.opts.categories)));
  var filterButtons = document.getElementsByClassName("filter-button");
  for (i=0;i<filterButtons.length;i++) {
    var thisButton = filterButtons[i];
    thisButton.addEventListener("click", function(e) {
      e.preventDefault();
      markActive(this);
      self.opts.jobList.sortList(0,false,JSON.parse(this.getAttribute("data-value")));
      self.opts.jobList.writeList();
    });
  }
  function markActive(el) {
    for (i=0;i<filterButtons.length;i++) {
      var thisButton = filterButtons[i];
      if(thisButton==el) {
        thisButton.classList.add("active");
      }
      else {
        if (thisButton.classList.item("active")) {
          thisButton.classList.remove("active");
        }
      }
    }
  }
}

module.exports = JobFilter;
