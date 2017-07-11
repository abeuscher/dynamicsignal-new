var gulp = require("gulp");
var sass = require("gulp-sass");
var pug = require("gulp-pug");
var fs = require("fs");
var autoprefixer = require("gulp-autoprefixer");
var cssmin = require("gulp-cssmin");
var watchify = require("watchify");
var jadeify = require("jadeify");
var browserify = require("browserify");
var parcelify = require('parcelify');
var gutil = require("gulp-util");
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var stringify = require('stringify');
var t_scss = require( 'sass-css-stream' );

var sassDir = "./";
var cssBuildDir = "./";
var htmlDir = "./";
var pugDir = "./";
var jadeComponentsDir = "./";
var jsSrcDir = "./";
var jsBuildDir = "./";

var argv = require('yargs')
    .argv;

var config = require("./config.json");
var parcelifyOpts = {
    bundles: {
        style: sassDir + "bundle.css"
    },
    appTransforms : [
        function(file) {
            return t_scss(file, {
                includePaths : [
                    './node_modules'
                ]
            });
        }
    ],
    appTransformDirs: [
        './node_modules/',
        './'
    ],
    bundlesByEntryPoint: null,
    watch: false
};

gulp.task('compile-sass-autoprefixed-minified', function() {
    return gulp.src(sassDir + '*.scss')
        .pipe(sass({
            includePaths: ['./node_modules',sassDir]
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
            keepSpecialComments: 0
        }))
        .pipe(gulp.dest(cssBuildDir));
});

gulp.task('compile-pug', function() {
    return gulp.src(pugDir + '*.jade')
        .pipe(pug())
        .pipe(gulp.dest(htmlDir));
});

gulp.task('compile-js', bundle);

var b = browserify({
        // entries: null, //factor-bundle
        debug: false,
        cache: {},
        packageCache: {},
        paths: ['./node_modules'],
        entries: [jsSrcDir + 'index.js'],
        standalone: config.globalName
    })
    .transform(stringify, {
      appliesTo: { includeExtensions: ['.hbs', '.handlebars', '.html'] }
    });


    p = parcelify(b, parcelifyOpts)
        .on('done', function() {
            console.log('CSS finished building.');
            gulp.start("compile-sass-autoprefixed-minified");
        })
        .on('assetUpdated', function(eventType) {
            console.log('CSS file ' + eventType + ". Rebuilding CSS.");
        })
        .on('error', function(err) {
            console.log('parcelify error', err);
            this.emit('end');
        });

b.on('log', console.log.bind(console));

b.on('update', bundle);

function bundle() {
    return b.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('dist.js'))
        .pipe(buffer())
        .pipe(gulp.dest(jsBuildDir));
}

gulp.task('default', ['compile-sass-autoprefixed-minified', 'compile-pug', 'compile-js']);
