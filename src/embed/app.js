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
  var menuToggle = document.getElementById("toggle-main-drop");
  var drop = document.getElementById("mobile-drop");
  menuToggle.addEventListener("click", function() {
    drop.classList.toggle("expanded");
    menuToggle.classList.toggle("active");
  });
});
