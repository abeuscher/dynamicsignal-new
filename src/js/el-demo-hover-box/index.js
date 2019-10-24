function DemoHoverBox() {
    var panels = document.querySelectorAll(".demo-video-bucket");
    for (i = 0; i < panels.length; i++) {
        panels[i].thumb = panels[i].querySelectorAll(".gif-thumb")[0];
        panels[i].thumb.staticsrc = panels[i].thumb.src;
        panels[i].addEventListener("mouseover", function (e) {
            this.thumb.src = this.thumb.getAttribute("data-gif");
        });
        panels[i].addEventListener("mouseout", function (e) {
            this.thumb.src = this.thumb.staticsrc;
        });
    }
}
module.exports = DemoHoverBox;