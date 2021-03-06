var orderBy = require("lodash/orderBy");
var groupBy = require("lodash/groupBy");
var parseHTML = require("../utils/parse-html.js");

function JobList(opts) {
  this.opts = opts;
  this.writeFeatured();
  this.sortList(0, false, false);
  this.writeList();
}
JobList.prototype.writeList = function () {
  this.opts.container.innerHTML = "";
  let heading = document.createElement("p");
  heading.classList.add("search-description");
  heading.innerHTML = this.heading;
  this.opts.container.appendChild(heading);
  console.log(this.currentJobs)
  let groupedJobs = groupBy(this.currentJobs,job=>{ let splitJobs = job.categories.filter(category=>{return category.category_parent===419}); return splitJobs.length ? splitJobs[0].name : null});
  Object.keys(groupedJobs).map(key=>{
    let thisHeader = document.createElement("h3");
    thisHeader.innerHTML = key == "null" ? "No Department Assigned" : key;
    this.opts.container.appendChild(thisHeader);
    for (i in groupedJobs[key]) {
      let thisJob = parseHTML(this.opts.template(groupedJobs[key][i]));
      this.opts.container.appendChild(thisJob);
      thisJob.classList.add("fade-in");      
    }
  })


};
JobList.prototype.writeFeatured = function () {
  var featured = null;
  for (i in this.opts.jobs) {
    var thisJob = this.opts.jobs[i];
    if (thisJob.featured.length) {
      featured = thisJob;
    }
  }
  if (document.getElementById("featured-job") && featured != null) {
    document.getElementById("featured-job").appendChild(parseHTML(this.opts.featuredTemplate(featured)));
  }
};
JobList.prototype.sortList = function (startIndex, limit, category) {
  if (!category[0] && !category[1]) {
    this.heading = "Displaying all jobs in all locations";
  }
  else {
    this.heading = "Displaying all jobs" + (category[0] ? " in " + category[0].cat_name : "") + (category[1] ? " in the " + category[1].cat_name + " department" : "");
  }
  const checkCategory = (job, categories) => {
    let output = false;
    if (category[0]) {
      output = job.categories.filter(thisCategory => { return thisCategory.cat_ID == category[0].cat_ID }).length > 0
    }
    if (category[0] && category[1]) {
      output = (job.categories.filter(thisCategory => { return thisCategory.cat_ID == category[0].cat_ID }).length > 0) && (job.categories.filter(thisCategory => { return thisCategory.cat_ID == category[1].cat_ID }).length > 0)
    }
    if (!category[0] && category[1]) {
      output = job.categories.filter(thisCategory => { return thisCategory.cat_ID == category[1].cat_ID }).length > 0
    }
    return output
  }
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
  this.currentJobs = orderBy(this.currentJobs, ['featured'], ['desc']);

  this.heading  += " (" + this.currentJobs.length + ")";

}

module.exports = JobList;