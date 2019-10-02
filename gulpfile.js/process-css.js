var settings = require("../settings.js")();

var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var autoprefixer = require('gulp-autoprefixer');

const { src, dest, watch } = require('gulp');

function processCSS(cb) {
    function doCss() {
      for (i=0;i<settings.stylesheets.length;i++) {
          var s = settings.stylesheets[i];
          console.log("Processing Style sheet group " + s.name)
          src(s.srcDir + '*.scss')
          .pipe(sass({
            outputStyle: "compressed"
          }))
          .on('error', function(error) {
            console.log(error);
            this.emit('end');
          })
          .pipe(autoprefixer())
          .pipe(cssmin({
            keepSpecialComments: true
          }))
          .pipe(dest(s.buildDir));
      }      
    }
    doCss();
    for (i=0;i<settings.stylesheets.length;i++) {
      watch([settings.stylesheets[i].srcDir + "*.scss"], doCss);
    }
    cb();
}

module.exports = processCSS;