var ScrollMagic = require("scrollmagic");

function PageHeader(els, c) {
    if (window.innerWidth > 641) {
      new ScrollMagic.Scene({
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
        .addTo(c);
    }
  }
  module.exports = PageHeader;