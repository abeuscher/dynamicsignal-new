var filter = require("lodash/filter");

function JobList(opts) {
  this.opts = opts;
  this.sortList(0,10,false);
  this.writeList();
}
JobList.prototype.writeList = function() {
  this.opts.container.innerHTML = "";
  for (i in this.currentJobs) {
    var thisJob = this.currentJobs[i];
    this.opts.container.appendChild(parseHTML(this.opts.template(thisJob)));
  }
};
JobList.prototype.sortList = function(startIndex,limit,category) {
  var allJobs = category ? filter(this.opts.jobs,{"category":category}) : this.opts.jobs;
  this.currentJobs = allJobs.splice(startIndex,limit);
}
function parseHTML(data) {
  var div = document.createElement("div");
  div.innerHTML = data;
  return div.firstElementChild;
}
module.exports = JobList;
