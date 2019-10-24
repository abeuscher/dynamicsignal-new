var ScrollMagic = require("scrollmagic");

function CheckMarkBullets(bullets, c) {
    var midPoint = window.innerHeight / 4 * -1;
    for (i = 0; i < bullets.length; i++) {
        var thisBullet = bullets[i];
        thisBullet.id = "bullet-" + i;
        new ScrollMagic.Scene({
            offset: midPoint,
            triggerElement: thisBullet,
            duration: 0
        })
            .on("enter leave", function (e) {
                document.getElementById("bullet-" + this.id).classList.add("active");
            })
            .addTo(c)
            .id = i;
    }
}
module.exports = CheckMarkBullets;