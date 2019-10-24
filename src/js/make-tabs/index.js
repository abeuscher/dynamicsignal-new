var removeClassFromCollection = require("../utils/remove-class-from-collection.js");

function MakeTabs(tabs, slides, attr, className) {
    for (i = 0; i < tabs.length; i++) {
      var thisTab = tabs[i];
      thisTab.addEventListener("click", function (e) {
        e.preventDefault();
        removeClassFromCollection(className, slides);
        removeClassFromCollection(className, tabs);
        slides[this.getAttribute(attr)].classList.add(className);
        tabs[this.getAttribute(attr)].classList.add(className);
      });
    }
  }
  module.exports = MakeTabs;