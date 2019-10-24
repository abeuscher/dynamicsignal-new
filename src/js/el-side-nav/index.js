function SideNav() {
    var theWrapper = document.getElementById("overlay");
    var theHeader = document.getElementById("page-header");
    var theToggle = document.getElementById("toggle-side-nav");
    var closeButton = document.getElementById("btn-close-sidenav");
    theToggle.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (document.body.classList.contains("nav-open")) {
            document.body.classList.remove("nav-open");
            theWrapper.removeEventListener("click", closeBody);
            theHeader.removeEventListener("click", closeBody);
            closeButton.removeEventListener("click", closeBody);
        } else {
            document.body.classList.add("nav-open");
            theWrapper.addEventListener("click", closeBody);
            theHeader.addEventListener("click", closeBody);
            closeButton.addEventListener("click", closeBody);
        }

    });

    function closeBody(e) {
        e.preventDefault();
        document.body.classList.remove("nav-open");
        theWrapper.removeEventListener("click", closeBody);
        theHeader.removeEventListener("click", closeBody);
        closeButton.removeEventListener("click", closeBody);
    }
}
module.exports = SideNav;