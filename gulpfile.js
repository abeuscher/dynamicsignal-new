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
    debug: true,
    paths: ['./bower_components', './node_modules']
});
var b = watchify(browserify(opts));
b.on('update', bundle);
b.on('log', gutil.log);
b.transform(require("pugify"));
b.transform(stringify({
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

function bundle() {
    return b.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(fs.createWriteStream(jsBuildDir + 'bundle.js'));
}

var copts = assign({}, watchify.args, {
    entries: [embedSrcDir+'app.js'],
    debug: true,
    paths: ['./bower_components', './node_modules']
});
var c = watchify(browserify(copts));
c.on('update', bundle);
c.transform(require("pugify"));
function cbundle() {
    return c.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(fs.createWriteStream(embedBuildDir + 'app.js'));
}

var dopts = assign({}, watchify.args, {
    entries: [uberembedSrcDir+'app.js'],
    debug: true,
    paths: ['./bower_components', './node_modules']
});
var d = watchify(browserify(dopts));
d.on('update', bundle);
d.transform(require("pugify"));
function dbundle() {
    return d.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(fs.createWriteStream(uberembedBuildDir + 'app.js'));
}

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
    gulp.watch([jsSrcDir + '**/*.js',jsSrcDir + '*.js'], ['build-js'])
    gulp.watch([viewsSrcDir+ '*.pug',viewsSrcDir+ '/*/*.pug'], ['build-views']);
    gulp.watch([embedSrcDir+ '*.js',embedSrcDir+ '/*/*.js'], ['build-js']);
    gulp.watch([miscSrcDir + "*/**",miscSrcDir + ".*"], ['move-files']);
});

gulp.task('bundle-js', bundle);
gulp.task('bundle-embed', cbundle);
gulp.task('bundle-uber', dbundle);

gulp.task('uglify-js', function() {
    return gulp.src(jsBuildDir + '*.js')
        .pipe(uglify({"compress":true}).on("error", function(e) {
            console.log(e, "uglify fail");
        }))
        .pipe(gulp.dest(jsBuildDir));
});

gulp.task('build-js', function() {
    if (!fs.existsSync(buildDir)){
        fs.mkdirSync(buildDir);
    }
    if (!fs.existsSync(jsBuildDir)){
        fs.mkdirSync(jsBuildDir);
    }
    if (!fs.existsSync(embedBuildDir)){
        fs.mkdirSync(embedBuildDir);
    }
    if (!fs.existsSync(uberembedBuildDir)){
        fs.mkdirSync(uberembedBuildDir);
    }
    runSequence('bundle-js', 'uglify-js','bundle-embed','bundle-uber');
});

gulp.task('build-views', function() {
    gulp.src(viewsSrcDir + '*.pug')
        .pipe(pug({
            "pretty": true,
            "filters": {
              "php":pugPhpFilter
            },
            "extension":"php",
            "locals":{siteurl:""}
        }))
        .pipe(extReplace(".php"))
        .pipe(gulp.dest(viewsBuildDir));
});
gulp.task('clean-dir', function () {
    return gulp.src(buildDir+"*", {read: true})
        .pipe(clean());
});
gulp.task('move-files', function() {
  gulp.src([miscSrcDir + "*/**",miscSrcDir + ".*"])
    .pipe(gulp.dest(buildDir));
});
gulp.task('move-thumb', function() {
  gulp.src([srcDir+"*.png"])
    .pipe(gulp.dest(buildDir));
});

// Default Task
gulp.task('default', ['compile-sass-autoprefixed-minified', 'build-js', 'build-views', 'watch-files','move-files','move-thumb']);
