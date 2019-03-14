var Vimeo = require("@vimeo/player");
var YouTubePlayer = require("youtube-player");
var parseHTML = require("../utils/parse-html.js");

/*
data-video-id : triggers video behavior
data-video-modal-id : triggers modal behavior
.video-activator : indicates a play button
*/

function videoHandler() {
  var self = this;
  this.settings = {
    templates: {
      modalVideo: require("./modal-video.pug"),
      panelVideo: require("./panel-video.pug")
    },
    modalEvents: {}
  };
  self.init();
}
videoHandler.prototype.init = function() {
  var self = this;

  self.videos = document.querySelectorAll("[data-video-id]");
  self.buildVideos();
  self.modals = document.querySelectorAll("[data-video-modal-id]");
  self.buildModals();
  self.buildPanels();
};
videoHandler.prototype.buildModals = function() {
  var self = this;
  for (var i = 0; i < self.modals.length; i++) {
    self.modals[i].videoid = self.modals[i].getAttribute("data-video-modal-id");
    var data = {
      videoid: self.modals[i].videoid
    };
    self.modals[i].modal = parseHTML(self.settings.templates.modalVideo(data));
    self.modals[i].postMsg = self.modals[i].modal.querySelectorAll(".wrapper-html")[0];
    document.body.appendChild(self.modals[i].modal);
    self.modals[i].addEventListener("click", self.openModal);
  }
};
videoHandler.prototype.buildPanels = function() {
  var self = this;
  self.panels = document.querySelectorAll("[data-video-panel-id]");
  console.log(self.panels);
  for (var i=0;i<self.panels.length;i++) {
    self.panels[i].videoid = self.panels[i].getAttribute("data-video-panel-id")
    self.panels[i].video = parseHTML(self.settings.templates.panelVideo({videoid:self.panels[i].videoid}));
    self.panels[i].html = self.panels[i].querySelectorAll(".wrapper-panel-html")[0];
    self.panels[i].html.setAttribute("data-panel-idx",i);
    self.panels[i].appendChild(self.panels[i].video);
    self.panels[i].playerBucket = self.panels[i].video.querySelectorAll(".panel-video")[0];
    self.panels[i].html.addEventListener("click", function(e) {
      e.preventDefault();
      var thisPanel = self.panels[this.getAttribute("data-panel-idx")]
      thisPanel.html.style.display = "none";
      thisPanel.video.style.display = "block";
      if (!thisPanel.player) {
        thisPanel.player = new YouTubePlayer(thisPanel.playerBucket, {videoId:thisPanel.videoid}); 
      }
      thisPanel.player.playVideo();
      thisPanel.player.on("stateChange", function(e) {
        if (e.data == 0) {
          this.stopVideo();
        }
      });
    });
  }
}
videoHandler.prototype.openModal = function(e) {
  var self = this;
  document.body.classList.add("modal-open");
  self.modal.classList.add("active");
  self.playerBucket = self.modal.querySelectorAll(".modal-video")[0];
  self.playerToggle = self.modal.querySelectorAll(".wrapper-video")[0];
  if (!self.modal.player) {
    self.modal.player = new YouTubePlayer(self.playerBucket);
    self.modal.player.on("stateChange", function(e) {
      if (e.data == 0) {
        self.playerToggle.style.display = "none";
        self.postMsg.style.display = "block";
        var playButtons = self.postMsg.querySelectorAll(".btn-replay");
        for (var i=0;i<playButtons.length;i++) {
          playButtons[i].addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            self.playerToggle.style.display = "block";
            self.postMsg.style.display = "none";
            self.modal.player.playVideo();
          });
        }
      }
    });
    self.modal.player.cueVideoById(self.playerBucket.getAttribute("data-video-id"));
  } else {
    self.modal.player.playVideo();
  }
  this.bg = this.modal.querySelectorAll(".bg")[0];
  this.bg.addEventListener("click", function(e) {
    document.body.classList.remove("modal-open");
    self.modal.classList.remove("active");
    self.playerToggle.style.display = "block";
    self.postMsg.style.display = "none";
    self.modal.player.stopVideo();
  });
};
videoHandler.prototype.buildVideos = function() {
  var self = this;
  for (var i = 0; i < self.videos.length; i++) {
    self.videos[i].player = new YouTubePlayer(self.videos[i]);
  }
};
videoHandler.prototype.playVideo = function(player, id, cb) {
  player.loadVideoById(id);
};

module.exports = videoHandler;
