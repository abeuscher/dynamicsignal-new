var Vimeo = require('@vimeo/player');

function ActivateVideos() {
  this.init();
}
ActivateVideos.prototype.init = function() {
  var self = this;
  this.videos = document.querySelectorAll(".video-thumb");
  this.players = [];
  for (i=0;i<this.videos.length;i++) {
    var thisBucket = this.videos[i];
    var thisContent = thisBucket.querySelectorAll(".content")[0];
    var thisPlayer = this.makeVideo(thisBucket.getAttribute("data-video-id"));
    thisBucket.appendChild(thisPlayer);
    console.log(thisBucket.getAttribute("data-video-only"));
    if (window.innerWidth<1025 || !thisContent) {
      if (thisContent) {
        thisContent.classList.toggle("hide");
      }
      thisPlayer.classList.toggle("hide");
    }
    else {
      thisBucket.addEventListener("click", self.onStart);
    }

  }
}
ActivateVideos.prototype.onStart = function(e) {
  e.preventDefault();
  var self = this;
  var thisContent = this.querySelectorAll(".content")[0];
  var thisPlayer = this.querySelectorAll("iframe")[0];
  var vimeoPlayer = new Vimeo(thisPlayer);
    thisContent.classList.toggle("hide");
    thisPlayer.classList.toggle("hide");
    var isPlaying = vimeoPlayer.currentTime > 0 && !vimeoPlayer.paused && !vimeoPlayer.ended && vimeoPlayer.readyState > 2;
    if (!isPlaying) {
      vimeoPlayer.play();
      vimeoPlayer.on('pause', function() {
        vimeoPlayer.unload();
        thisContent.classList.toggle("hide");
        thisPlayer.classList.toggle("hide");
      });
    }
}
ActivateVideos.prototype.makeVideo = function(id) {
  var video = document.createElement("iframe");
  video.src = "https://player.vimeo.com/video/"+id+"?title=0&byline=0&portrait=0";
  video.setAttribute("webkitallowfullscreen","true");
  video.setAttribute("mozallowfullscreen","true");
  video.setAttribute("allowfullscreen","true");
  video.classList.add("vimeo-video");
  video.classList.add("hide");
  return video;
}
module.exports = ActivateVideos;
