# 2k BG Video Module
#

## Syntax

    var foo = new BGVideo(srcs, opts);

## Description

Assigns a background video to a container. Supports multiple version inputs for browser compatibility.

## Settings

	//Defaults are displayed

	loop: true, //Play once or looped
	preload: false, //Preload video before playing
	autoplay: true, //toggles autoplay
	repeat: true, //toggles whether video is tiled or not
	backgroundSize: "cover", //accepts 'cover' or 'contain' or percentage
	backgroundPosition: "center", //accept left, right, center
	breakpoint: 640, //assign breakpoint (video will not play beneath this width)
    fps: 60 //Frames Per Second

## Methods

###
### .applyToElement

#### parameters

 - **el** Required. Dom element to apply background video to.

###
### .load

Loads in video after it has been declared

###
### .pause

Pause video

###
### .play

Play a video that has been paused


###
### .removeFromElement

#### parameters

 - **el** Required. Element to have video removed from it



##
## Examples

    //Creates a single, untiled background video applied to a wrapper

    var el = document.getElementById("video-wrapper");
	bodyVideo = new BGVideo("http://distribution.bbb3d.renderfarming.net/video/mp4/bbb_sunflower_1080p_30fps_stereo_abl.mp4", {
	            repeat: false
	        });
	bodyVideo.applyToElement(el);
    bodyVideo.load();
    bodyVideo.play();

    //Creates a tiled background video from set applied to body

    var el = document.getElementsByTagName('body')[0];
    var srcs = [
        "http://distribution.bbb3d.renderfarming.net/video/mp4/bbb_sunflower_1080p_30fps_stereo_abl.mp4"
    ];
    bodyVideo = new BGVideo(srcs, {
                repeat: true
            });
    bodyVideo.applyToElement(el);
    bodyVideo.load();
    bodyVideo.play();
