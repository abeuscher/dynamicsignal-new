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
      panelVideo: require("./panel-video.pug"),
      multiVideo: require("./multi-video.pug")
    },
    modalEvents: {}
  };
}
videoHandler.prototype.init = function() {
  var self = this;

  self.videos = document.querySelectorAll("[data-video-id]");
  self.buildVideos();
  self.modals = document.querySelectorAll("[data-video-modal-id]");
  self.buildModals();
  var panels = document.querySelectorAll("[data-video-panel-id]");
  self.buildPanels(panels,"data-video-panel-id");
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
videoHandler.prototype.buildMultiplayer = function(bucket) {
  var self = this;
  var data = pageData.videos[bucket.getAttribute("data-multiplayer-id")];
  bucket.appendChild(parseHTML(self.settings.templates.multiVideo(data)));
  
  var screen = bucket.querySelectorAll(".player")[0];
  var buttons = bucket.querySelectorAll(".buttons a");
  
  var player = new YouTubePlayer(screen, {playerVars:{rel:0}});

  player.cueVideoById(buttons[0].getAttribute("data-launch-id"));
  buttons[0].classList.add("active");

  for (i=0;i<buttons.length;i++) {
    buttons[i].addEventListener("click", function(e) {
      e.preventDefault();
      var self = this;
      if (history.pushState) {
        //console.log(window.location.pathname + '?videoidx=' + self.getAttribute("data-video-idx"));
        //var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?videoidx=' + self.getAttribute("data-video-idx");
        /*
        Munchkin.munchkinFunction('clickLink', {
          href: window.location.pathname + '?videoidx=' + self.getAttribute("data-video-idx")
         });
         */
        //window.history.pushState({path:newurl},'',newurl);
      }
      player.getPlayerState()
        .then(function(data) {
          if (!self.classList.contains("active") || data !=1) {
            player.loadVideoById(self.getAttribute("data-launch-id"));
            for (i=0;i<buttons.length;i++) {
              buttons[i].classList.contains("active") ? buttons[i].classList.remove("active") : "";
            }
            self.classList.add("active");
          }
        });

    });
  }
}
videoHandler.prototype.buildPanels = function(panels, attrName, gallery) {
  var self = this, pauseAction = false;
  if (self.panels) {
    var bottom = self.panels.length;
    Array.prototype.push(self.panels,panels);
  }
  else {
    self.panels = panels;
    var bottom = 0;
  }
  for (var i=bottom;i<self.panels.length;i++) {
    self.panels[i].videoid = self.panels[i].getAttribute(attrName);
    self.panels[i].video = parseHTML(self.settings.templates.panelVideo({videoid:self.panels[i].videoid}));
    self.panels[i].theHtml = self.panels[i].querySelectorAll(".wrapper-panel-html")[0];
    self.panels[i].theHtml.setAttribute("data-panel-idx",i);
    self.panels[i].appendChild(self.panels[i].video);
    self.panels[i].playerBucket = self.panels[i].video.querySelectorAll(".panel-video")[0];
    if (!self.panels[i].player) {
      self.panels[i].player = new YouTubePlayer(self.panels[i].playerBucket, {videoId:self.panels[i].videoid,playerVars:{rel:0}}); 
    }   
    if (gallery) {
      gallery.on("select", function(e) {
        pauseAction = true;
      });
      gallery.on("settle", function(e) {
        pauseAction = false;
      });

    }
    self.panels[i].theHtml.addEventListener("click", function(e) {
      e.preventDefault();
      if (pauseAction) {
        return;
      }
      var thisPanel = self.panels[this.getAttribute("data-panel-idx")];
      if (thisPanel.getAttribute("data-panel-event")!="") {
        logEvent(thisPanel.getAttribute("data-panel-event"));
      }
      thisPanel.theHtml.classList.remove("active");
      thisPanel.video.classList.add("active");
      thisPanel.player.playVideo();
      thisPanel.player.on("stateChange", function(e) {
        if (e.data==0) {
          stopVideo();
        }   
      });
      if (gallery) {
        gallery.on("change", stopVideo);
      }
      function stopVideo(e) {
        thisPanel.player.stopVideo();
        thisPanel.theHtml.classList.add("active");
        thisPanel.video.classList.remove("active");
      }
    });
  }
}
videoHandler.prototype.activateCarousel = function(el,gallery) {
  var self = this;
  var slides = el.querySelectorAll("[data-video-carousel-id]");
  self.buildPanels(slides,"data-video-carousel-id",gallery);
  return true;
}
videoHandler.prototype.openModal = function(e) {
  var self = this;
  e.preventDefault();
  document.body.classList.add("modal-open");
  self.modal.classList.add("active");
  self.playerBucket = self.modal.querySelectorAll(".modal-video")[0];
  self.playerToggle = self.modal.querySelectorAll(".wrapper-video")[0];
  if (!self.modal.player) {
    self.modal.player = new YouTubePlayer(self.playerBucket, {playerVars:{rel:0}});
    self.modal.player.on("stateChange", function(e) {
      if (e.data == 0) {
        self.playerToggle.classList.remove("active");
        self.postMsg.classList.add("active");
        var playButtons = self.postMsg.querySelectorAll(".btn-replay");
        for (var i=0;i<playButtons.length;i++) {
          playButtons[i].addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            self.playerToggle.classList.add("active");
            self.postMsg.classList.remove("active");
            self.modal.player.playVideo();
          });
        }
      }
    });
    self.modal.player.loadVideoById(self.playerBucket.getAttribute("data-video-id"));
  } else {
    self.modal.player.playVideo();
  }
  this.bg = this.modal.querySelectorAll(".bg")[0];
  this.bg.addEventListener("click", function(e) {
    self.modal.player.stopVideo();
    document.body.classList.remove("modal-open");
    self.modal.classList.remove("active");
    self.playerToggle.classList.add("active");
    self.postMsg.classList.remove("active");
  });
};
videoHandler.prototype.buildVideos = function() {
  var self = this;
  for (var i = 0; i < self.videos.length; i++) {
    self.videos[i].player = new YouTubePlayer(self.videos[i],{playerVars:{rel:0}});
  }
};
videoHandler.prototype.playVideo = function(player, id, cb) {
  player.loadVideoById(id);
};
function logEvent(eventName) {
  window['GoogleAnalyticsObject'] = 'ga';
  window['ga'] = window['ga'] || function() {
    (window['ga'].q = window['ga'].q || []).push(arguments)
  };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({"event" : eventName });
}
module.exports = videoHandler;
