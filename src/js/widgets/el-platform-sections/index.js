var ScrollMagic = require("scrollmagic");

function PlatformSections(els, c) {
    var sections = document.querySelectorAll(".platform-section");
    for (i = 0; i < sections.length; i++) {
        var s = sections[i];
        var images = s.querySelectorAll(".platform-section-image");
        for (z = 0; z < images.length; z++) {
            var thisImage = images[z];
            var tweenImage = TweenMax.fromTo(thisImage, 1, { css: { y: "60" }, ease: Linear.easeOut }, { css: { y: "-50" }, ease: Linear.easeOut });
            new ScrollMagic.Scene({
                triggerElement: s,
                duration: "80%",
                offset: "10%",
                reverse: true
            })
                .setTween(tweenImage)
                .on("enter", function (e) {
                    var el = document.getElementById(this.id);
                    if (!el.classList.contains("active")) {
                        el.classList.add("active");
                    }
                })
                .on("leave", function (e) {
                    var el = document.getElementById(this.id);
                    if (el.classList.contains("active")) {
                        el.classList.remove("active");
                    }
                })
                .addTo(c)
                .id = s.id;
        }
    }
    var thisPhone = document.getElementById("platform-hero-phone");
    var tweenPhone = TweenMax.fromTo(thisPhone, 1, { css: { y: "80" }, ease: Power0.easeOut }, { css: { y: "-30" }, Power0: Linear.easeOut });
    new ScrollMagic.Scene({
        triggerElement: thisPhone,
        duration: "50%",
        offset: "0",
        reverse: true
    })
        .setTween(tweenPhone)
        .addTo(c);
}
module.exports = PlatformSections;