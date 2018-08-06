var Vimeo = require('@vimeo/player');
var YouTubePlayer = require("youtube-player");

function ActivateVideos() {
  this.init();
}
ActivateVideos.prototype.init = function() {
  var self = this;
  this.videos = document.querySelectorAll(".video-activator");
  this.players = [];
  for (i=0;i<this.videos.length;i++) {
    var thisBucket = this.videos[i];
    if (thisBucket.getAttribute("video-type")=="youtube") {
      if (window.innerWidth<1024) {
        var yt = makeYoutube(thisBucket.getAttribute("data-video-id"),thisBucket);
      }
      else {
        thisBucket.addEventListener("click", self.onYoutubeStart);
      }
    }
    else {
      var thisPlayer = this.makeVimeo(thisBucket.getAttribute("data-video-id"));
      thisBucket.appendChild(thisPlayer);
      if (window.innerWidth<1024) {
        thisPlayer.classList.toggle("hide");
      }
      else {
        thisBucket.addEventListener("click", self.onVimeoStart);
      }
    }

  }
} 
ActivateVideos.prototype.onYoutubeStart = function(e) {
  e.preventDefault();
  var self = this;
  console.log(self);
  var yt = makeYoutube(self.getAttribute("data-video-id"),self);
  yt.on("stateChange", function (e) { if (e.data==2) { e.target.destroy();} } );

}
ActivateVideos.prototype.onVimeoStart = function(e) {
  e.preventDefault();
  var self = this;
  var thisPlayer = this.querySelectorAll("iframe.vimeo-video")[0];
  var vimeoPlayer = new Vimeo(thisPlayer);
  thisPlayer.classList.toggle("hide");

  function changeCarouselListeners(toggle) {
    var carouselButtons = document.getElementsByClassName("flickity-prev-next-button");
    if (carouselButtons.length) {
      for (i=0;i<carouselButtons.length;i++) {
        carouselButtons[i].removeEventListener("click", carouselListener);
        if (toggle) {
          carouselButtons[i].addEventListener("click", carouselListener);
        }
      }
    }
  }
  changeCarouselListeners(true);
  function carouselListener(e) {
    var thisPlayer = document.querySelectorAll("iframe.vimeo-video:not(.hide)")[0];
    var vimeoPlayer = new Vimeo(thisPlayer);
    vimeoPlayer.unload();
    changeCarouselListeners();
  }

  var isPlaying = vimeoPlayer.currentTime > 0 && !vimeoPlayer.paused && !vimeoPlayer.ended && vimeoPlayer.readyState > 2;
  if (!isPlaying) {
 
    vimeoPlayer.play()
    .then(function() {
      vimeoPlayer.on('pause', vimeoListener);
    });

  function vimeoListener(e) {
    vimeoPlayer.off('pause', vimeoListener);
    vimeoPlayer.unload();
    thisPlayer.classList.toggle("hide");

  }
  }
}
ActivateVideos.prototype.makeVimeo = function(id) {
  var video = document.createElement("iframe");
  video.src = "https://player.vimeo.com/video/"+id+"?title=0&byline=0&portrait=0";
  video.setAttribute("webkitallowfullscreen","true");
  video.setAttribute("mozallowfullscreen","true");
  video.setAttribute("allowfullscreen","");
  video.classList.add("vimeo-video");
  video.classList.add("hide");
  return video;
}
function makeYoutube (id, bucket, events) {
  var player = document.createElement("div");
  bucket.appendChild(player);
  var video = new YouTubePlayer(player);
  
  video.loadVideoById(id); 
  player.classList.add("youtube-video");
  return video;
}
module.exports = ActivateVideos;