function AnchorMenu(els) {
    var el = els[0];
    var links = el.querySelectorAll("a");
    var anchor = el.getAttribute("data-anchor-target") ? el.getAttribute("data-anchor-target") : "start";
    for (i = 0; i < links.length; i++) {
        var button = links[i];
        button.addEventListener("click", function (e) {
            var section = document.getElementById(this.getAttribute("href").substr(1));
            if (section) {
                e.preventDefault();
                section.scrollIntoView({
                    behavior: 'smooth',
                    "block": anchor
                });
                if (window.history && window.history.pushState) {
                    history.pushState("", document.title, "#" + section.id);
                }
            }
        });
    }
}
module.exports = AnchorMenu;