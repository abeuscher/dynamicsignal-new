var srcDir = "./src/";
var buildDir = "./app/public/wp-content/themes/ds-new/";

var jsSrcDir = srcDir + "js/";
var jsBuildDir = buildDir + "js/";

var templateSrcDir = srcDir + "templates/";

var sassSrcDir = srcDir + "scss/";
var sassBuildDir = buildDir;

var assetsSrcDir = srcDir + "public_transfer/";
var assetsBuildDir = buildDir;

var templateSrcDir = srcDir + "templates/";
var templateBuildDir = buildDir;

function siteSettings() {
  return {
    siteName: "dynamicsignal.com",
    directories:[buildDir, jsBuildDir, buildDir + "embed/",buildDir + "uber-embed/",buildDir + "marketo-embed/"],
    jsFiles: [
      {
        name: "Main Bundle",
        srcDir: jsSrcDir,
        srcFileName: "app.js",
        buildDir: jsBuildDir,
        buildFileName: "bundle.js"
      },
      {
        name: "Generic Embed Bundle",
        srcDir: srcDir + "embed/",
        srcFileName: "app.js",
        buildDir: buildDir + "embed/",
        buildFileName: "bundle.js"
      },
      {
        name: "Uber Embed Bundle",
        srcDir: srcDir + "uber-embed/",
        srcFileName: "app.js",
        buildDir: buildDir + "uber-embed/",
        buildFileName: "bundle.js"
      },
      {
        name: "Marketo Embed Bundle",
        srcDir: srcDir + "marketo-embed/",
        srcFileName: "app.js",
        buildDir: buildDir + "marketo-embed/",
        buildFileName: "bundle.js"
      }
    ],
    templates: [
      {
        name: "Main Template Group",
        srcDir: templateSrcDir,
        buildDir: templateBuildDir
      }
    ],
    stylesheets: [
      {
        name: "Main Stylesheet",
        srcDir: sassSrcDir,
        buildDir: sassBuildDir
      }
    ],
    assets: [
      {
        name: "Main Public Assets",
        srcDir: [assetsSrcDir + "**/*"],
        buildDir: assetsBuildDir
      }
    ]
  };
}
module.exports = siteSettings;
