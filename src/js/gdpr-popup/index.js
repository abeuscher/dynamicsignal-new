var Cookies = require("js-cookie");

var parseHTML = require("../utils/parse-html.js");


function triggerGDPR() {
    this.settings = {
        "cookieName":"ds-gdpr",
        "template":"./gdpr-popup.pug"
    }
    var self = this;
    if (!Cookies.get(self.settings.cookieName)) {
      var warning = parseHTML(self.settings.template());
      document.body.appendChild(warning);
      var yesButton = document.getElementById("btn-yes");
      var noButton = document.getElementById("btn-no");
      yesButton.addEventListener("click", function(e) {
        e.preventDefault();
        Cookies.set(self.settings.cookieName,"true",{
          expires: 365
        });
        warning.remove();
        writeCTA();
        return false;
      });
    }
    else {
      writeCTA();
    }
  }
  function checkCookies(){
    var cookieEnabled = navigator.cookieEnabled;
    if (!cookieEnabled){ 
        document.cookie = "testcookie";
        cookieEnabled = document.cookie.indexOf("testcookie")!=-1;
    }
    if (cookieEnabled) {
      Cookies.remove("testcookie");
    }
    return cookieEnabled;
  }