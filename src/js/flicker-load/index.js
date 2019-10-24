var ScrollMagic = require("scrollmagic");

function FlickerLoad(flickContent,c) {
    for (i = 0; i < flickContent.length; i++) {
      var thisBlock = flickContent[i];
      new ScrollMagic.Scene({
        triggerElement: thisBlock,
        duration: 0,
        offset: -250,
        reverse: false
      })
        .on("enter", function (e) {
          if (!document.getElementById(e.currentTarget.id).classList.contains(".active")) {
            document.getElementById(e.currentTarget.id).classList.add("active");
          }
        })
        .addTo(c)
        .id = thisBlock.id;
    }
  }
  module.exports = FlickerLoad;