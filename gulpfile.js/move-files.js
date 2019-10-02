var settings = require("../settings.js")();

const { src, dest, watch } = require('gulp');

function moveFiles(cb) {
    function mf() {
        for (i=0;i<settings.assets.length;i++) {
            var f = settings.assets[i];
            console.log("Moving file set " + f.name);
            src(f.srcDir)
            .pipe(dest(f.buildDir).on("end", function() { console.log("Finished Moving File set " + f.name)}));
        }
    }
    mf();
    for (i=0;i<settings.assets.length;i++) {
        watch([settings.assets[i].srcDir + "*", settings.assets[i].srcDir + "**/*"], mf);
    }
    cb();
}

module.exports = moveFiles;