var removeClassFromCollection = require("../../utils/remove-class-from-collection.js");

function SolutionsTabs(els) {
    var nav = els[0];
    var buttons = nav.querySelectorAll("a");
    for (i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", buttonClick);
    }
    function buttonClick(e) {
        e.preventDefault();
        var target = this.getAttribute("data-tab");
        removeClassFromCollection("active", nav.querySelectorAll("li"));
        removeClassFromCollection("active", document.querySelectorAll(".tab-panel"));
        document.getElementById(target).classList.add("active");
        this.parentNode.classList.add("active");
    }
}
module.exports = SolutionsTabs;