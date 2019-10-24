function ContactMap(els) {
    var box = els[0];
    var map = document.getElementById("the-contact-map");
    box.addEventListener("click", function (e) {
        map.classList.add("clicked");
        this.addEventListener("mouseleave", function () {
            map.classList.remove("clicked");
        });
    });
}
module.exports = ContactMap;