var orderBy = require("lodash/orderBy");
var parseHTML = require("../utils/parse-html.js");

function JobList(opts) {
  this.opts = opts;
  this.writeFeatured();
  this.sortList(0, false, false);
  this.writeList();
}
JobList.prototype.writeList = function() {
  this.opts.container.innerHTML = "";
  for (i in this.currentJobs) {
    var thisJob = parseHTML(this.opts.template(this.currentJobs[i]));
    this.opts.container.appendChild(thisJob);
    thisJob.classList.add("fade-in");
  }
};
JobList.prototype.writeFeatured = function() {
  var featured = null;
  console.log(this.opts.jobs);
  for (i in this.opts.jobs) {
    var thisJob = this.opts.jobs[i];
    if (thisJob.featured.length) {
      featured = thisJob;
    }
  }
  if (document.getElementById("featured-job") && featured!=null) {
    document.getElementById("featured-job").appendChild(parseHTML(this.opts.featuredTemplate(featured)));
  }
};
JobList.prototype.sortList = function(startIndex, limit, category) {
  this.currentJobs = new Array();
  var currentJobs = new Array();
  if (category[0] || category[1]) {
    currentJobs = this.opts.jobs.filter(job => { return checkCategory(job, category) });
    location.hash = "|" + encodeURI(category[0].cat_name) + "|" + encodeURI(category[1].cat_name);
  } else {
    var currentJobs = this.opts.jobs;
  }
  limit = limit ? limit : this.opts.jobs.length;
  this.currentJobs = currentJobs.slice(startIndex, limit);
  this.currentJobs = orderBy(this.currentJobs,['featured'],['desc']);
}

module.exports = JobList; 
