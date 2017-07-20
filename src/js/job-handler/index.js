var filter = require("lodash/filter");
var parseHTML = require("../utils/parse-html.js");

function JobList(opts) {
  this.opts = opts;
  this.sortList(0, false, false);
  this.writeList();
}
JobList.prototype.writeList = function() {
  this.opts.container.innerHTML = "";
  for (i in this.currentJobs) {
    var thisJob = this.currentJobs[i];
    this.opts.container.appendChild(parseHTML(this.opts.template(thisJob)));
  }
};
JobList.prototype.sortList = function(startIndex, limit, category) {
  this.currentJobs = [];
  var currentJobs = [];

  if (category) {
    for (i = 0; i < this.opts.jobs.length; i++) {
      for (c in this.opts.jobs[i].categories) {
        if (this.opts.jobs[i].categories[c].cat_ID == category.cat_ID) {
          currentJobs.push(this.opts.jobs[i]);
        }
      }
    }
  } else {
    var currentJobs = this.opts.jobs;
  }
  limit = limit ? limit : this.opts.jobs.length;
  this.currentJobs = currentJobs.slice(startIndex, limit);
}

module.exports = JobList;
