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
var lpSrcDir = srcDir + 'lp-embed/';
var lpBuildDir = buildDir + 'lp-embed/';

var ukTemplatesSrc = srcDir + "uk_templates/";
var ukStylesSrc = srcDir + "uk_scss/";
var ukJSSrc = srcDir + "uk_js/";
var ukBuildDir = "app/public/wp-content/themes/ds-uk/";
var ukJsBuild = ukBuildDir + "js/";


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
    "id": "lpjs",
    "buildDir": lpBuildDir,
    "opts": {
      entries: [lpSrcDir + 'app.js'],
      debug: false,
      paths: ['./bower_components', './node_modules'],
      output: "bundle.js"
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
    "id": "marketojs",
    "buildDir": marketoembedBuildDir,
    "opts": {
      entries: [marketoembedSrcDir + 'app.js'],
      debug: false,
      paths: ['./bower_components', './node_modules'],
      output: "bundle.js"
    },
  },
    {
      "id": "ukjs",
      "buildDir": ukJsBuild,
      "opts": {
        entries: [ukJSSrc + 'app.js'],
        debug: false,
        paths: ['./bower_components', './node_modules'],
        output: "bundle.js"
      }
  }
];
function bundleMain() {
  for (i=0;i<jsFiles.length;i++) {
    if (jsFiles[i].id=="js") {
      crunchFile(jsFiles[i]);
    }
  }
}
function bundleUK() {
  for (i=0;i<jsFiles.length;i++) {
    if (jsFiles[i].id=="ukjs") {
      crunchFile(jsFiles[i]);
    }
  }
}

function bundleJS() {
  for (i in jsFiles) {
    var theObj = jsFiles[i];
    crunchFile(theObj);
  }
}
function crunchFile(theObj) {
  if (!fs.existsSync(theObj.buildDir)) {
    fs.mkdirSync(theObj.buildDir);
  }
  var options = assign({}, watchify.args, theObj.opts);
  theFile = browserify(options);
  theFile.setter = function() {
    var writeStream = fs.createWriteStream(theObj.buildDir + theObj.opts.output);
    return theFile.bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(writeStream)
      .on("finish", ugly); 
  }
  theFile.on('log', gutil.log);
  theFile.transform(require("pugify"));
  theFile.setter();
}
var ugly = function() {
  var self = this;
  var dir = this.path.substring(0,this.path.lastIndexOf('/') + 1);
  return gulp.src(self.path)
      .pipe(uglify({
        "compress": true
      }).on("error", function(e) {
        console.log(e, "uglify fail");
      }))
      .pipe(gulp.dest(dir))
      .on("finish", function() {console.log(self.path + "uglify js complete for " + dir + '*.js');});
}


gulp.task('bundle-js', bundleJS);

gulp.task('bundle-main', bundleMain);

gulp.task('bundle-uk', bundleUK);

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
gulp.task('compile-sass-uk', function() {
  return gulp.src(ukStylesSrc + '*.scss')
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
    .pipe(gulp.dest(ukBuildDir));
});

gulp.task('watch-files', function() {
  gulp.watch(sassDir + '**/*.scss', ['compile-sass-autoprefixed-minified'])
  gulp.watch([jsSrcDir + '**/*.js', jsSrcDir + '*.js',jsSrcDir + '**/*.pug', jsSrcDir + '*.pug'], ['bundle-main'])
  gulp.watch([uberembedSrcDir + '**/*.js', uberembedSrcDir + '*.js', lpSrcDir + '**/*.js', lpSrcDir + '*.js',embedSrcDir + '*.js', embedSrcDir + '/*/*.js'], ['bundle-js'])
  gulp.watch([viewsSrcDir + '*.pug', viewsSrcDir + '/*/*.pug'], ['build-views']);
  gulp.watch([miscSrcDir + "*/**", miscSrcDir + ".*"], ['move-files']);
});
gulp.task('watch-files-uk', function() {
  gulp.watch(sassDir + '**/*.scss', ['compile-sass-uk'])
  gulp.watch([ukJSSrc + '**/*.js', ukJSSrc + '*.js',ukJSSrc + '**/*.pug', ukJSSrc + '*.pug'], ['bundle-uk'])
  gulp.watch([ukTemplatesSrc + '*.pug', ukTemplatesSrc + '/*/*.pug'], ['build-views-uk']);
  gulp.watch([miscSrcDir + "*/**", miscSrcDir + ".*"], ['move-files-uk']);
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
gulp.task('build-views-uk', function() {
  gulp.src(ukTemplatesSrc + '*.pug')
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
    .pipe(gulp.dest(ukBuildDir));
});
gulp.task('clean-dir', function() {
  return gulp.src(buildDir + "*", {
      read: true
    })
    .pipe(clean());
});
gulp.task('clean-uk-dir', function() {
  return gulp.src(ukBuildDir + "*", {
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

gulp.task('move-uk-files', function() {
  gulp.src([miscSrcDir + "*/**", miscSrcDir + ".*"])
    .pipe(gulp.dest(ukBuildDir));
  gulp.src([srcDir + "*.png"])
    .pipe(gulp.dest(ukBuildDir));   
});

// Default Task
gulp.task('default', ['compile-sass-autoprefixed-minified', 'bundle-js', 'build-views', 'watch-files', 'move-files', 'move-thumb']);
gulp.task('uk', ['compile-sass-uk', 'bundle-uk', 'build-views-uk', 'watch-files-uk', 'move-uk-files']);