var Vimeo = require('@vimeo/player');

function ActivateVideos() {
  this.init();
}
ActivateVideos.prototype.init = function() {
  var self = this;
  this.videos = document.querySelectorAll(".video-activator");
  this.players = [];
  for (i=0;i<this.videos.length;i++) {
    var thisBucket = this.videos[i];
    var thisPlayer = this.makeVideo(thisBucket.getAttribute("data-video-id"));
    thisBucket.appendChild(thisPlayer);
    if (window.innerWidth<1024) {
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
ActivateVideos.prototype.makeVideo = function(id) {
  var video = document.createElement("iframe");
  video.src = "https://player.vimeo.com/video/"+id+"?title=0&byline=0&portrait=0";
  video.setAttribute("webkitallowfullscreen","true");
  video.setAttribute("mozallowfullscreen","true");
  video.setAttribute("allowfullscreen","");
  video.classList.add("vimeo-video");
  video.classList.add("hide");
  return video;
}
module.exports = ActivateVideos;