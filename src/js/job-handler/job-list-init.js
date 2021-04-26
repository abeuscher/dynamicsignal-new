var sortBy = require("lodash/sortBy");
var JobList = require("./index");
var JobFilter = require("./job-filter");

var templates = {
    "jobFilter": require("./job-filter.pug"), // Job Filter for Careers Page     
    "jobListing": require("./job-listing.pug"), // Job listing for careers page
    "featuredJob": require("./featured-job.pug"), // Featured job popout on careers page   
}


function InitJobList(els) {
    var jobs = sortBy(pageData.jobs, function (i) {
        return i.post_date
    });
    var categories = sortBy(pageData.categories, function (i) {
        return i.cat_name
    });
    var opts = {
        "jobs": jobs,
        "template": templates.jobListing,
        "featuredTemplate": templates.featuredJob,
        "container": els[0]
    }
    var theJobs = new JobList(opts);
    var opts = {
        "categories": categories,
        "template": templates.jobFilter,
        "container": document.getElementById("job-filter"),
        "jobList": theJobs
    }
    new JobFilter(opts);
}
module.exports = InitJobList;