var parseHTML = require("../js/utils/parse-html.js");

var templates = {
  "header":require("../templates/inc/header.pug"),
  "footer":require("../templates/inc/footer.pug")
}

window.addEventListener("load", function() {
  var theTop = document.getElementById("top");
  var siteopts = {
    "siteurl":"http://staging.dynamicsignal.flywheelsites.com"
  }
  theTop.parentNode.insertBefore(parseHTML(templates.header(siteopts)),theTop);
  var theFooter = document.getElementsByTagName("footer")[0];
  document.body.replaceChild(parseHTML(templates.footer(siteopts)),theFooter);
  var menuToggle = document.getElementById("toggle-main-drop");
  var drop = document.getElementById("mobile-drop");
  menuToggle.addEventListener("click", function() {
    drop.classList.toggle("expanded");
    menuToggle.classList.toggle("active");
  });
});
