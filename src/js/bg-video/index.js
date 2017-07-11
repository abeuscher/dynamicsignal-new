var utils = require('utils');
var ecoEvents = require('eco-events');
var EventEmitter = require("event-dispatcher");
var LoadingSpinner = require("loading-spinner");
require("requestAnimationFrame");
require("dom4");
var forEach = require("lodash/forEach");
var find = require("lodash/find");
var isEqual = require("lodash/isEqual");
var defaults = require('lodash/defaults');

var ee = new EventEmitter();

var isInit = false;
var videos = {};
var playingVideos = {};
var activeVideos = {};
var suspendedVideos = {};
var presets = {};

var defaultOpts = {
	loop: true,
	preload: false,
	autoplay: true,
	repeat: true,
	backgroundSize: "cover",
	backgroundPosition: "center",
	breakpoint: 640,
    fps: 60,
    useSpinner: true
};

function BGVideo(srcs, opts) {
    opts = defaults(opts, defaultOpts);
	this.key = utils.generateHash();
	this.canvas = document.createElement('canvas');
    utils.parseHooks(this.canvas, [opts.canvasHooks || "", ".bg-video"]);
	this.ctx = this.canvas.getContext("2d");
	this.srcs = srcs;
	this.attachedEl = null;
	this.video = null;
	this.spinner = new LoadingSpinner(utils.createEl("div", [(opts.spinnerHook || ".gray-spinner"), ".bg-video-spinner"]));
	for (var optName in opts) {
		this[optName] = opts[optName];
	}
    this.clock = 0;
    this.timeLastFrame = Date.now();

	videos[this.key] = this;

    ee.extend(this);
    this.on("renderfinish", function(){
        BGVideo.trigger("renderfinish", this.canvas, this);
    });
    this.on("renderstart", function(){
        BGVideo.trigger("renderstart", this.canvas, this);
    });
}
ee.extend(BGVideo);

//STATIC METHODS

BGVideo.savePreset = function(key, opts){
    presets[key] = opts;
};

BGVideo.mount = function(){
    forEach(document.queryAll("[data-has-bg-video]"), function(el){
        var attr = el.getAttribute("data-has-bg-video");
        var srcs = attr ? attr.split(",") : null;
        if (srcs) {
            var video = find(videos, function(currVideo){
                return isEqual(currVideo.srcs, srcs);
            });

            if (!video) {
                var presetKey = el.getAttribute("data-bg-video-preset");
                if (presetKey) {
                    var opts = presets[presetKey];
                }
                video = new BGVideo(srcs, opts);
            }
            if(video.attachedEl != el && !(video.key in activeVideos)) {
                video.applyToElement(el);
                video.load();
            }
        }
    });
};

BGVideo.unmount = function(){
    forEach(document.queryAll("[data-has-bg-video]"), function(el){
        var attr = el.getAttribute("data-has-bg-video");
        var srcs = attr ? attr.split(",") : null;
        if(srcs) {
            var video = find(videos, function(currVideo){
                return isEqual(currVideo.srcs, srcs);
            });
            if(video && video.attachedEl == el) {
                video.removeFromElement(el);
                video.reset();
                video.deactivate();
            }
        }
    });
};

BGVideo.suspend = function() {
	for (var videoKey in playingVideos) {
		suspendedVideos[videoKey] = playingVideos[videoKey];
		playingVideos[videoKey].pause();
	}
};

BGVideo.resume = function() {
	for (var videoKey in suspendedVideos) {
		suspendedVideos[videoKey].play();
		delete suspendedVideos[videoKey];
	}
};

window.addEventListener("focus", function(){
	BGVideo.resume();
});
window.addEventListener("blur", function(){
	BGVideo.suspend();
});
// var timeLastFrame;
var getDt = (function(){
    var timeLastFrame = Date.now();
    return function() {
        var newTime = Date.now();
        var dt = newTime - timeLastFrame;
        timeLastFrame = newTime;
        return dt;
    }
})();

function render() {
    var keys = Object.keys(activeVideos);
	if (keys.length) {
		requestAnimationFrame(render);
        var dt = getDt();
        var ms = dt * 0.001;
        var bgVideo, videoName;
        for (videoName in playingVideos) {
            if (playingVideos[videoName].video && playingVideos[videoName].video.paused) {
                playingVideos[videoName].play()
            }
        }
        for (videoName in activeVideos) {
            bgVideo = activeVideos[videoName];
            if (bgVideo.canvas.parentNode && bgVideo.canvas.parentNode.parentNode) {
                if (!bgVideo.hasData) {
                    if (bgVideo.video.currentTime >= ms && bgVideo.video.currentTime < bgVideo.video.duration - ms) {
                        bgVideo.hasData = true;
                    }
                } else  {
                    if (bgVideo.video.currentTime >= bgVideo.video.duration - ms) {
                        bgVideo.hasData = false;
                    }
                }
                if (bgVideo.advance(dt) &&
                    utils.inViewport(bgVideo.canvas) &&
                    bgVideo.hasData) {
                    bgVideo.render();
                }
            } else {
                bgVideo.deactivate();
                bgVideo.reset();
            }
        }
	}
}

BGVideo.prototype.advance = function(dt) {
    var frameTime = 1000 / this.fps;

    if (this.clock < frameTime) {
        this.clock += dt;
        return false;
    } else {
        this.clock -= frameTime;
        return true;
    }
};

BGVideo.prototype.reset = function(dt) {
    this.attachedEl = null;
};

function updateCanvasDimensions() {
	if (Object.keys(videos).length) {
		for (var videoName in videos) {
			var vid = videos[videoName];

			if (vid.canvas.parentNode) {
				vid.canvas.width = vid.canvas.parentNode.offsetWidth;
				vid.canvas.height = vid.canvas.parentNode.offsetHeight;
			}
		}
	}
}

function init() {
	ecoEvents.on("throttledresize", onThrottleResize);
	ecoEvents.on("resizeend", onResizeEnd);
}

function onThrottleResize() {
	updateCanvasDimensions();
}

function onResizeEnd() {
	for (var videoKey in videos) {
		var video = videos[videoKey];
		if (video.attachedEl && video.breakpoint) {
			if (shouldActivate(video)) {
				if (!activeVideos[video.key]) {
					video.activate(video.attachedEl);
				}
			} else {
				if (activeVideos[video.key]) {
					video.deactivate(video.attachedEl);
				}
			}
		}
	}
	updateCanvasDimensions();
}

BGVideo.prototype.setVideoDimensions = function() {
	this.video.removeEventListener("loadedmetadata", this.setVideoDimensions);

	this.video.width = this.video.videoWidth;
	this.video.height = this.video.videoHeight;

	this.aspectRatio = this.video.height / this.video.width;

	updateCanvasDimensions();
};



BGVideo.prototype.render = function() {
    this.trigger("renderstart", this.canvas);
    this.ctx.save();
	this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);

	var dim = this.calculateDimensions();
	var pos = this.calculatePosition(dim);
    if (dim.width && dim.height) {
        if (this.repeat) {
            var xRepetitions = Math.ceil(this.canvas.width / dim.width);
            var yRepetitions = Math.ceil(this.canvas.height / dim.height);
            var remainingX = xRepetitions;
            var remainingY = yRepetitions;
            while (remainingX >= 0) {
                while (remainingY >= 0) {
                    this.ctx.drawImage(this.video, pos.x + remainingY * dim.width, pos.y + remainingX * dim.height, dim.width, dim.height);
                    --remainingY;
                }
                remainingY = yRepetitions;
                --remainingX;
            }
        } else {
            this.ctx.drawImage(this.video, pos.x, pos.y, dim.width, dim.height);
        }
    }

	this.ctx.restore();
    this.trigger("renderfinish", this.canvas);
};

BGVideo.prototype.calculatePosition = function(dim) {
	var pos = {};
	if (this.backgroundPosition == "center") {
		pos.x = this.canvas.width / 2 - dim.width / 2;
		pos.y = this.canvas.height / 2 - dim.height / 2;
	}
	return pos;
};

BGVideo.prototype.calculateDimensions = function() {
	var dim = {};
	if (this.backgroundSize == "cover") {
		var parentWidth = this.canvas.offsetWidth;
		var parentHeight = this.canvas.offsetHeight;
		if (this.aspectRatio > parentHeight / parentWidth) {
			//width should fill
			dim.width = parentWidth;
			dim.height = parentWidth * this.aspectRatio;
		} else {
			//height should fill
			dim.width = parentHeight / this.aspectRatio;
			dim.height = parentHeight;
		}
	} else if (this.backgroundSize.indexOf("%") > -1) {
		var percent = Number(this.backgroundSize.split("%")[0]) / 100;
		dim.width = Math.round(this.canvas.offsetWidth * percent);
		dim.height = Math.round(dim.width * this.aspectRatio);
	}

	return dim;
}

//API
BGVideo.prototype.play = function() {
	if (this.video) {
		if (!playingVideos[this.key]) {
			playingVideos[this.key] = this;
		}
		this.video.play();
	}
};

BGVideo.prototype.pause = function() {
	if (this.video) {
		this.video.pause();
		if (playingVideos[this.key]) {
			delete playingVideos[this.key];
		}
	}
};

BGVideo.prototype.applyToElement = function(element) {
    if (!utils.isIOS) {
        this.attachedEl = element;
    	element.appendChild(this.canvas);
    	if (window.innerWidth >= this.breakpoint) {
            if (this.useSpinner) {
                this.spinner.hide(this.canvas);
            } else {
                this.canvas.style.display = "none";
            }
    	}
    	if (window.getComputedStyle(element).position == "static") {
    		element.style.position = "relative";
    	}

    	if (!isInit) {
    		init();
    	}
    }
};

BGVideo.prototype.load = function(element){
	if (shouldActivate(this)) {
        this.activate();
	} else {
        this.deactivate();
    }
};

function shouldActivate(video) {
    return !utils.isIOS && window.innerWidth >= video.breakpoint;
}


BGVideo.prototype.removeFromElement = function(element){
	element.removeChild(this.canvas);
};

BGVideo.prototype.activate = function() {
	activeVideos[this.key] = this;
	var video = this;

	if (!this.video) {
		this.video = createVideoElement(this.srcs, this);
		this.video.addEventListener("loadedmetadata", this.setVideoDimensions.bind(this));
		this.video.addEventListener("canplaythrough", function(){
			if (video.autoplay) {
				playingVideos[video.key] = video;
                if (video.useSpinner) {
                    video.spinner.reveal(video.canvas)
                } else {
                    video.canvas.style.display = "block";
                }
			}
		});
        this.video.addEventListener("waiting", function(){
            video.hasData = false;
        });
        this.video.addEventListener("playing", function(){
            video.hasData = true;
        });
	}
    if (this.canvas) {
        this.canvas.setAttribute('data-isactive', '');
    }
	if (playingVideos[this.key]) {
		this.video.play();
        if (this.useSpinner) {
            this.spinner.reveal(this.canvas)
        } else {
            this.canvas.style.display = "block";
        }
	}

	if (Object.keys(activeVideos).length == 1) {
		render();
	}
};

BGVideo.prototype.deactivate = function() {
	delete activeVideos[this.key];
    if (this.canvas) {
        this.canvas.removeAttribute('data-isactive');
    }
	if (this.video) {
		this.video.pause();
	}
};

//HELPERS
function createVideoElement(srcs, videoObj) {
	var video = document.createElement('video');

	if (videoObj.autoplay) {
		video.setAttribute("autoplay", videoObj.autoplay);
	}

	if (videoObj.loop) {
		video.setAttribute("loop", videoObj.loop);
	}

	if (videoObj.preload) {
		video.setAttribute("preload", videoObj.preload);
	}

	if (typeof srcs == "string") {
		video.appendChild(processSrc(srcs));
	} else {
		for (var i = 0, len = srcs.length; i < len; ++i) {
			video.appendChild(processSrc(srcs[i]));
		}
	}

	return video;
}

function processSrc(src) {
	var source = document.createElement('source');
	var ext = src.split(".")[src.split(".").length - 1];

	source.setAttribute("src", src);
	source.setAttribute("type", "video/" + ext);

	return source;
}

module.exports = BGVideo;
