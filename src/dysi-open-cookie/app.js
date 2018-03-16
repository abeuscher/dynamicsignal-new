var Cookies = require("js-cookie");

var cookieName = "ds-open-gdpr-chk";

window.addEventListener("load", function() {
  var warning = document.getElementById("gdpr-warning");
  if (!Cookies.get(cookieName)) {
    warning.style.display = "block";
    var theButton = warning.getElementById("btn-close-warning");
    theButton.addEventListener("click", function() {
      Cookies.set(cookieName,"true",{
        expires: 365
      });
      warning.style.display="none";
    });
  }
});
