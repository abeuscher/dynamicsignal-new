var ScrollMagic = require("scrollmagic");

function PageHeader() {
    if (window.innerWidth > 641) {
      var headController = new ScrollMagic.Controller({
        "loglevel": 0
      });
      var headerLock = new ScrollMagic.Scene({
        offset: 10,
        duration: 0
      })
        .on("enter", function (e) {
          if (!document.body.classList.contains("nav-short")) {
            document.body.classList.add("nav-short");
          }
        })
        .on("leave", function (e) {
          if (document.body.classList.contains("nav-short")) {
            document.body.classList.remove("nav-short");
          }
        })
        .addTo(headController);
      new ScrollMagic.Scene({
        offset: 0,
        duration: 0
      });
      headerLock.addTo(headController);
    }
  }
  module.exports = PageHeader;