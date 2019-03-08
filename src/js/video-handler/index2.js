var Vimeo = require('@vimeo/player');
var YouTubePlayer = require("youtube-player");

/*
data-video-id : triggers video behavior
data-video-modal-id : triggers modal behavior
.video-activator : indicates a play button
*/


function ActivateVideos() {
  this.init();
  this.settings = {
      templates : {
          "modalVideo":require("./modal-video.pug");
      }
  }
}
ActivateVideos.prototype.init = function() {
  var self = this;
  self.modals = document.querySelectorAll("[data-video-modal-id]");
  self.buildModals();
} 
ActivateVideos.prototype.buildModals = function() {
    var self = this;
    for (var i=0;i<self.modals.length;i++) {
        self.modals[i].videoid = self.modals[i].getAttribute("data-video-modal-id");
        var data = {
            videoid : self.modals[i].videoid
        }
        self.modals[i].modal = parseHTML(self.settings.templates.modalVideo(data));
        document.body.appendChild(slef.modals[i].modal);
        
    }
}
module.exports = ActivateVideos;