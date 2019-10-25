function VerticalCarousel(buckets) {
    for (var i = 0; i < buckets.length; i++) {
      var theBucket = buckets[i];
      var s = {
        bucket: theBucket,
        images: theBucket.querySelectorAll(".vertical-slide"),
        controls: theBucket.querySelectorAll(".carousel-panel"),
        currentIndex: 0,
        strip: theBucket.querySelectorAll(".inner")[0]
      };
      var switcher = function () {
        getCurrPos(s);
        setTimeout(switcher, 6000);
      }
      setTimeout(switcher, 3000);
      for (var c = 0; c < s.controls.length; c++) {
        s.controls[c].addEventListener("click", function (e) {
          nextCarousel(this, s, parseInt(this.getAttribute("data-index")) + 1);
          s.pause = true;
          setTimeout(function () { s.pause = false; }, 6000);
        });
      }
      function getCurrPos(el) {
        if (!el.pause) {
          for (var i = 0; i < el.strip.classList.length; i++) {
            if (el.strip.classList[i].indexOf("position") > -1) {
              var next = parseInt(el.strip.classList[i].replace(/[^0-9]/gi, '')) < el.controls.length ? parseInt(el.strip.classList[i].replace(/[^0-9]/gi, '')) + 1 : 1;
              nextCarousel(el.controls[next - 1], el, next);
            }
          }
        }
      }
      function nextCarousel(btn, el, idx) {
        resetCarousel(el);
        btn.classList.add("active");
        el.strip.classList.add("position-" + idx);
      }
      function resetCarousel(el) {
        for (var i = 0; i < el.strip.classList.length; i++) {
          if (el.strip.classList[i].indexOf("position") > -1) {
            el.strip.classList.remove(el.strip.classList[i]);
          }
        }
        for (var i = 0; i < el.controls.length; i++) {
          el.controls[i].classList.remove("active");
        }
      }
    }
  }
  module.exports = VerticalCarousel;