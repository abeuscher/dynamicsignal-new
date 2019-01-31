var parseHTML = require("../utils/parse-html.js");

var defaultOpts = {
    "modalClass" : "modal",
    "activator" : document.querySelectorAll(".modal-show"),
    "html" : "<div class='dicks'>dicks</div>",
    "modalVideo" : require("./modal-video.pug"),
    "attr" : "data-video-modal-id",
    "closeClass":".modal-hide"
};
function Modal(opts) {
    this.opts = opts || defaultOpts;
    this.init();
}
Modal.prototype.init = function() {
    if (this.opts.activator.length>0) {
        for (var i=0;i<this.opts.activator.length;i++) {
            var thisButton = this.opts.activator[i];
            if (thisButton.getAttribute(this.opts.attr)) {
                this.buildVideoModal(thisButton);
            }
        }
    }
} 
Modal.prototype.buildVideoModal = function(el) {
    var self = this;
    var modal = this.buildModal(el.getAttribute(this.opts.attr));
    document.body.appendChild(modal);
    modal.setAttribute("style","display:none;position:fixed;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,.7);");
    el.addEventListener("click", function(e) {
        e.preventDefault();
        document.body.classList.add("modal-open");
        var data = {
            videoid: this.getAttribute(self.opts.attr),
            pause:false
        };
        var bucket = document.getElementById(data.videoid);
        bucket.style.setProperty("display","block");
        bucket.appendChild(parseHTML(self.opts.modalVideo(data)));
        var closebuttons = document.querySelectorAll(self.opts.closeClass);
        bucket.addEventListener("click", function(e) {
            e.preventDefault();
            document.body.classList.remove("modal-open");
            bucket.innerHTML = "";
            bucket.style.setProperty("display","none");
        });
    });
};
Modal.prototype.buildModal = function(id) {
    var m = document.createElement("div");
    m.classList.add(this.opts.modalClass);
    m.id = id;
    return m;
}
module.exports = Modal;