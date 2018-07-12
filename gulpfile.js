var buildDir = 'app/public/wp-content/themes/ds-new/';
var srcDir = 'src/';
var sassDir = srcDir + 'scss/';
var cssDir = buildDir;
var jsSrcDir = srcDir + 'js/';
var jsBuildDir = buildDir + 'js/';
var viewsSrcDir = srcDir + 'templates/';
var miscSrcDir = srcDir + 'public_transfer/';
var viewsBuildDir = buildDir;
var embedSrcDir = srcDir + 'embed/';
var embedBuildDir = buildDir + 'embed/';
var uberembedSrcDir = srcDir + 'uber-embed/';
var uberembedBuildDir = buildDir + 'uber-embed/';
var marketoembedSrcDir = srcDir + 'marketo-embed/';
var marketoembedBuildDir = buildDir + 'marketo-embed/';
var dsoembedSrcDir = srcDir + 'dysi-open-cookie/';
var dsoembedBuildDir = buildDir + 'dysi-open-cookie/';

// Include gulp
var watchify = require('watchify');
var browserify = require('browserify');
var clean = require("gulp-clean");
var gulp = require('gulp');
var extReplace = require('gulp-ext-replace');
var pug = require("gulp-pug");
var pugPhpFilter = require("pug-php-filter");
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var stringify = require('stringify');
var filter = require('gulp-filter');
var fs = require('fs');
var sassLint = require("sass-lint");

require('factor-bundle');

var runSequence = require('run-sequence');

var opts = assign({}, watchify.args, {
  entries: [jsSrcDir + 'app.js'],
  debug: false,
  paths: ['./bower_components', './node_modules']
});
var jsFiles = [{
    "id": "js",
    "buildDir": jsBuildDir,
    "opts": {
      entries: [jsSrcDir + 'app.js'],
      debug: false,
      paths: ['./bower_components', './node_modules'],
      output: "bundle.js"
    }
  },
  {
    "id": "embedjs",
    "buildDir": embedBuildDir,
    "opts": {
      entries: [embedSrcDir + 'app.js'],
      debug: false,
      paths: ['./bower_components', './node_modules'],
      output: "app.js"
    }
  },
  {
    "id": "uberjs",
    "buildDir": uberembedBuildDir,
    "opts": {
      entries: [uberembedSrcDir + 'app.js'],
      debug: false,
      paths: ['./bower_components', './node_modules'],
      output: "bundle.js"
    }
  },
  {
    "id": "dysiopen",
    "buildDir": dsoembedBuildDir,
    "opts": {
      entries: [dsoembedSrcDir + 'app.js'],
      debug: false,
      paths: ['./bower_components', './node_modules'],
      output: "bundle.js"
    }
  },
  {
    "id": "marketojs",
    "buildDir": marketoembedBuildDir,
    "opts": {
      entries: [marketoembedSrcDir + 'app.js'],
      debug: false,
      paths: ['./bower_components', './node_modules'],
      output: "bundle.js"
    }
  }
];



function bundleJS() {
  for (i in jsFiles) {
    var theObj = jsFiles[i];
    if (!fs.existsSync(theObj.buildDir)) {
      fs.mkdirSync(theObj.buildDir);
    }
    var options = assign({}, watchify.args, theObj.opts);
    theFile = watchify(browserify(options));

    theFile.setter = function() {
      return theFile.bundle()
      .pipe(source(theObj.entries))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
          // Add transformation tasks to the pipeline here.
          .pipe(uglify())
          .on('error', gutil.log)
      .pipe(sourcemaps.write(theObj.buildDir))
      .pipe(gulp.dest(theObj.buildDir  + theObj.opts.output));
        
    }


    theFile.on('update', theFile.setter);
    theFile.on('log', gutil.log);
    theFile.transform(require("pugify"));
    theFile.transform(stringify({
      extensions: ['.html'],
      minify: true,
      minifier: {
        options: {
          removeComments: true,
          removeCommentsFromCDATA: true,
          removeCDATASectionsFromCDATA: true,
          collapseWhitespace: true,
          conservativeCollapse: false,
          preserveLineBreaks: false,
          collapseBooleanAttributes: false,
          removeAttributeQuotes: false,
          removeRedundantAttributes: false,
          useShortDoctype: false,
          removeEmptyAttributes: false,
          removeScriptTypeAttributes: false,
          removeStyleLinkTypeAttributes: false,
          removeOptionalTags: false,
          removeIgnored: false,
          removeEmptyElements: false,
          lint: true,
          keepClosingSlash: false,
          caseSensitive: false,
          minifyJS: true,
          minifyCSS: false,
          minifyURLs: false
        }
      }
    }));
    theFile.setter();
  }
  return true;
}



gulp.task('bundle-js', bundleJS);

gulp.task('uglify-js', function() {
    return gulp.src(jsBuildDir + '*.js')
      .pipe(uglify({
        "compress": true
      }).on("error", function(e) {
        console.log(e, "uglify fail");
      }))
      .pipe(gulp.dest(jsBuildDir));
});

gulp.task('build-js', function() {
  runSequence('bundle-js');
});



gulp.task('compile-sass-autoprefixed-minified', function() {
  return gulp.src(sassDir + '*.scss')
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: ['node_modules/susy/sass']
    }))
    .on('error', function(error) {
      console.log(error);
      this.emit('end');
    })
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie 8', 'ie 9', '> 1%'],
      cascade: false
    }))
    .pipe(cssmin({
      keepSpecialComments: true
    }))
    .pipe(gulp.dest(cssDir));
});

gulp.task('watch-files', function() {
  gulp.watch(sassDir + '**/*.scss', ['compile-sass-autoprefixed-minified'])
  gulp.watch([jsSrcDir + '**/*.js', jsSrcDir + '*.js',jsSrcDir + '**/*.pug', jsSrcDir + '*.pug', uberembedSrcDir + '**/*.js', uberembedSrcDir + '*.js',embedSrcDir + '*.js', embedSrcDir + '/*/*.js'], ['bundle-js'])
  gulp.watch([viewsSrcDir + '*.pug', viewsSrcDir + '/*/*.pug'], ['build-views']);
  gulp.watch([miscSrcDir + "*/**", miscSrcDir + ".*"], ['move-files']);
});





gulp.task('build-views', function() {
  gulp.src(viewsSrcDir + '*.pug')
    .pipe(pug({
      "pretty": true,
      "filters": {
        "php": pugPhpFilter
      },
      "extension": "php",
      "locals": {
        siteurl: ""
      }
    }))
    .pipe(extReplace(".php"))
    .pipe(gulp.dest(viewsBuildDir));
});
gulp.task('clean-dir', function() {
  return gulp.src(buildDir + "*", {
      read: true
    })
    .pipe(clean());
});
gulp.task('move-files', function() {
  gulp.src([miscSrcDir + "*/**", miscSrcDir + ".*"])
    .pipe(gulp.dest(buildDir));
});
gulp.task('move-thumb', function() {
  gulp.src([srcDir + "*.png"])
    .pipe(gulp.dest(buildDir));
});

// Default Task
gulp.task('default', ['compile-sass-autoprefixed-minified', 'build-js', 'build-views', 'watch-files', 'move-files', 'move-thumb']);
