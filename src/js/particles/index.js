function Particles() {
    var width, height, largeHeader, canvas, ctx, points, target, animateHeader = true;
    var lineColor = function(opacity) {
      return "rgba(255,255,255," + opacity + ")";
    }
    var opts = {
      "speed":3,
      "numberOfLines":10,
      "linesPerPoint":3,
      "circleRadius":5
    }
    if (document.getElementById("sticky-header") && document.getElementById("particle-board")) {

    initHeader();
    initAnimation();
    //addListeners();
        
    }
    function initHeader() {
        largeHeader = document.getElementById('sticky-header');
        canvas = document.getElementById('particle-board');

        width = largeHeader.offsetWidth;
        height = largeHeader.offsetHeight;
        target = {x: width/2, y: height/2};
        
        canvas.width = width/2;
        canvas.height = height;
        
        ctx = canvas.getContext('2d');

        // create points
        points = [];
        for(var x = 0; x < width; x = x + width/opts.numberOfLines) {
            for(var y = 0; y < height; y = y + height/opts.numberOfLines) {
                var px = x + Math.random()*width/opts.numberOfLines;
                var py = y + Math.random()*height/opts.numberOfLines;
                var p = {x: px, originX: px, y: py, originY: py };
                points.push(p);
            }
        }

        // for each point find the 5 closest points
        for(var i = 0; i < points.length; i++) {
            var closest = [];
            var p1 = points[i];
            for(var j = 0; j < points.length; j++) {
                var p2 = points[j]
                if(!(p1 == p2)) {
                    var placed = false;
                    for(var k = 0; k < opts.linesPerPoint; k++) {
                        if(!placed) {
                            if(closest[k] == undefined) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }

                    for(var k = 0; k < opts.linesPerPoint; k++) {
                        if(!placed) {
                            if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }
                }
            }
            p1.closest = closest;
        }

        // assign a circle to each point
        for(var i in points) {
            var c = new Circle(points[i], opts.circleRadius, lineColor(".3"));
            points[i].circle = c;
        }
    }

    // Event handling
    function addListeners() {
        window.addEventListener('scroll', scrollCheck);
        window.addEventListener('resize', resize);
    }

    function scrollCheck() {
        if(document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
    }

    function resize() {

        //canvas.width = width;
        //canvas.height = height;
    }

    // animation
    function initAnimation() {
        animate();
        for(var i in points) {
            shiftPoint(points[i]);
        }
    }

    function animate() {
        if(animateHeader) {
            ctx.clearRect(0,0,width,height);
            for(var i in points) {
                // detect points in range
                if(Math.abs(getDistance(target, points[i])) < width) {
                    points[i].active = 0.3;
                    points[i].circle.active = "0.3";
                } else {
                    points[i].active = .6;
                    points[i].circle.active = "0.35";
                }

                drawLines(points[i]);
                points[i].circle.draw();
            }
        }
        requestAnimationFrame(animate);
    }

    function shiftPoint(p) {
        TweenLite.to(p, 1+1*Math.random(), {x:p.originX-5+Math.random()*opts.speed,
            y: p.originY-5+Math.random()*opts.speed, ease:Circ.Back,
            onComplete: function() {
                shiftPoint(p);
            }});
    }

    // Canvas manipulation
    function drawLines(p) {
        if(!p.active) return;
        for(var i in p.closest) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.closest[i].x, p.closest[i].y);
            ctx.strokeStyle = lineColor(p.active);
            ctx.stroke();
        }
    }

    function Circle(pos,rad,color) {
        var _this = this;

        // constructor
        (function() {
            _this.pos = pos || null;
            _this.radius = rad || null;
            _this.color = color || null;
        })();

        this.draw = function() {
            if(!_this.active) return;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = lineColor(_this.active);
            ctx.fill();
        };
    }

    // Util
    function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }
    
}


/* SECTION: requestAnimationFrame polyfill 
* Authors: Erik Möller, fixes from Paul Irish & Tino Zijdel.
* Original File Name: paulirish/rAF.js
* Link: http://paulirish.com/2011/requestanimationframe-for-smart-animating/
* MIT license
*/

(function() {
var lastTime = 0;
var vendors = ['ms', 'moz', 'webkit', 'o'];
for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
        || window[vendors[x]+'CancelRequestAnimationFrame'];
}

if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { callback(currTime + timeToCall); },
            timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };

if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };
}());
module.exports = Particles;
