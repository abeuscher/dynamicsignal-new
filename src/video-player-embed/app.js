const VideoHandler = require("../js/video-handler/");
const videoHandler = new VideoHandler();
window.addEventListener("load", function () {
    videoHandler.modals = document.querySelectorAll("[data-video-modal-id]");
    videoHandler.buildModals();
});