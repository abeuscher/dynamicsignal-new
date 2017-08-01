var parseHTML = require("../js/utils/parse-html.js");

var templates = {
  "header":require("../templates/inc/header.pug"),
  "footer":require("../templates/inc/footer.pug")
}

window.addEventListener("load", function() {
  var theTop = document.getElementById("top");
  theTop.parentNode.insertBefore(parseHTML(templates.header()),theTop);
  var theFooter = document.getElementsByTagName("footer")[0];
  document.body.replaceChild(parseHTML(templates.footer()),theFooter);
});
