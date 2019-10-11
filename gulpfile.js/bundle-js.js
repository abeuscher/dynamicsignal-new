var settings = require("../settings.js")();

var fs = require("file-system");
var browserify = require("browserify");

const { src, dest, watch } = require("gulp");

var findDirMatch = require("./find-dir-match.js");

function bundleJS(cb) {
  // This instantiates the watch function, assuming there is at least one js file in the project. If not this probably should be disabled in default.
  var watcher = watch([
    settings.jsFiles[0].srcDir + "*", settings.jsFiles[0].srcDir + "**/*"
  ]);
  bundleFile(settings.jsFiles[0]);
  // Loops through the js files, bundles them, and adds their source folders to the watcher
  for (i = 1; i < settings.jsFiles.length; i++) {
    bundleFile(settings.jsFiles[i]);
    watcher.add([
      settings.jsFiles[i].srcDir + "*", settings.jsFiles[i].srcDir + "**/*"
    ], { ignoreInitial: false });
  }

  // Add the listener event to the watcher
  watcher.on("change", triggerJS);
  cb();
}

// This is the listener event, which finds the changed file then passes it to the bundler
function triggerJS(path, stats) {
  var p = path.indexOf("\\")>-1 ? path.split("\\") : path.split("/");
  var file = findDirMatch(settings.jsFiles,p);
  for (i=0;i<file.length;i++) {
    bundleFile(file[i]);
  }
}

// Bundler function. 
function bundleFile(f) {
  console.log("Begin processing JS file " + f.name);
  browserify({
    entries: f.srcDir + f.srcFileName,
    debug: false
  })
    .transform(require("pugify"))
    .transform("uglifyify", { global: true })
    .bundle()
    .pipe(
      fs
        .createWriteStream(f.buildDir + f.buildFileName)
        .on("close", function() {
          console.log("Finished Processing JS File " + f.name);
        })
    );
}
module.exports = bundleJS;
