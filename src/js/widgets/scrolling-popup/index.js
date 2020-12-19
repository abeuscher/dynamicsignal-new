const ScrollMagic = require("scrollmagic");
const cookieName = "scrollingPopupToggle";

function ScrollingPopup(popups, c) {
    if (!sessionStorage.getItem(cookieName)) { 
        let popup = popups[0];
        let closebutton = popup.querySelectorAll(".close-button")[0];
        var body = document.querySelectorAll(".blog-content")[0];

        var height = Math.max(body.scrollHeight, body.offsetHeight);
        console.log(height * (parseInt(popup.getAttribute("data-scroll-percentage")) / 100));
        new ScrollMagic.Scene({
            offset: height * (parseInt(popup.getAttribute("data-scroll-percentage")) / 100),
            duration: 0,
            reverse:false
        })
            .setClassToggle(popup, "active")
            .addTo(c)
        closebutton.addEventListener("click", e => {
            e.preventDefault();
            popup.classList.add("closed");
            sessionStorage.setItem(cookieName, true);
        })
    }
}
module.exports = ScrollingPopup;