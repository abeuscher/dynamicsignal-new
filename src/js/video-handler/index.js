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
  var thisPlayer = this.querySelectorAll("iframe.vimeo-video")[0];
  var vimeoPlayer = new Vimeo(thisPlayer);
  thisContent.classList.toggle("hide");
  thisPlayer.classList.toggle("hide");

  var carouselButtons = document.getElementsByClassName("flickity-prev-next-button");
  if (carouselButtons.length) {
    for (i=0;i<carouselButtons.length;i++) {
      carouselButtons[i].removeEventListener("click", carouselListener);
      carouselButtons[i].addEventListener("click", carouselListener);
    }
  }
  function carouselListener(e) {
    console.log(document.querySelectorAll("iframe.vimeo-video:not('hide')"));
  }



  var isPlaying = vimeoPlayer.currentTime > 0 && !vimeoPlayer.paused && !vimeoPlayer.ended && vimeoPlayer.readyState > 2;
  if (!isPlaying) {
    vimeoPlayer.off('pause');

    vimeoPlayer.on('pause', vimeoListener);
    vimeoPlayer.play();

    function vimeoListener(e) {
      vimeoPlayer.unload();
      thisContent.classList.toggle("hide");
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
