var parseHTML = require("../utils/parse-html.js");

function JobFilter(opts) {
  var self = this;
  this.opts = opts;
  this.opts.container.appendChild(parseHTML(this.opts.template(this.opts.categories)));
  let HashCategory=false
  if (location.hash!=="") {
    HashCategory=decodeURI(location.hash.replace("#",""))
  }
  const filterButtons = document.getElementsByClassName("filter-button");
  const markActive = (el) => {
    for (let z=0;z<filterButtons.length;z++) {
      const thisButton = filterButtons[z];
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
  for (let i=0;i<filterButtons.length;i++) {
    let thisButton = filterButtons[i];
    let thisInfo = JSON.parse(thisButton.getAttribute("data-value"))
    if (thisInfo) {
      if (thisInfo.cat_name===HashCategory) {
        markActive(thisButton)
      }
    }
    thisButton.addEventListener("click", function(e) {
      e.preventDefault();
      let thisInfo = JSON.parse(this.getAttribute("data-value"));
      if (!thisInfo) {
        location.hash="";
      }
      markActive(this);
      self.opts.jobList.sortList(0,false,thisInfo);
      self.opts.jobList.writeList();
      document.getElementById("jobs").scrollIntoView({behavior:"smooth"});
    });
  }

}

module.exports = JobFilter;
