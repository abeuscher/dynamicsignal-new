var ScrollMagic = require("scrollmagic");
var parseHTML = require("../js/utils/parse-html.js");

var templates = {
  "header": require("../templates/inc/header-embed.pug"),
  "footer": require("../templates/inc/footer.pug"),
  "toggle": require("../templates/inc/navbar-toggle.pug"),
  "sideNav": require("../templates/inc/side-nav.pug")
};
var siteopts = {
  "siteroot" : "https://www.dynamicsignal.com"
};
window.addEventListener("load", function() {
  setNav();
  // Add the header shrinker
  var headController = new ScrollMagic.Controller({
    "loglevel": 0
  });
  new ScrollMagic.Scene({
      offset: 10,
      duration: 0
    })
    .on("enter", function(e) {
      document.getElementById("page-header").classList.add("active");
      document.getElementById("toggle-side-nav").classList.add("short");
    })
    .on("leave", function(e) {
      document.getElementById("page-header").classList.remove("active");
      document.getElementById("toggle-side-nav").classList.remove("short");
    })
    .addTo(headController);

  // Add menu button listener
  var theWrapper = document.getElementById("wrapper");
  var theToggle = document.getElementById("toggle-side-nav");
  theToggle.addEventListener("click", function(e) {
    e.preventDefault();
    if (document.body.classList.contains("nav-open")) {
      document.body.classList.remove("nav-open");
      theWrapper.removeEventListener("click", closeBody);
    } else {
      document.body.classList.add("nav-open");
      theWrapper.addEventListener("click", closeBody);
    }
  });

  function closeBody(e) {
    e.preventDefault();
    document.body.classList.remove("nav-open");
    theWrapper.removeEventListener("click", closeBody);
  }

  MktoForms2.loadForm("//app-ab04.marketo.com", "362-RJN-040", 1588);
  MktoForms2.whenReady(function(form) {
    var els = document.querySelectorAll(".mktoRequired ");

    for (i = 0; i < els.length; i++) {
      var thisEl = els[i];
      if (thisEl.type == "select-one") {
        var label = document.querySelectorAll("label[for=" + thisEl.name + "]")[0];
        label.style.display = "none";
      }
      thisEl.addEventListener("focus", setLabel);
      thisEl.addEventListener("blur", unsetLabel);

      function setLabel(e) {
        var label = document.querySelectorAll("label[for=" + this.name + "]")[0];
        label.classList.add("focus");
        removeErrors();
      }

      function unsetLabel(e) {
        var label = document.querySelectorAll("label[for=" + this.name + "]")[0];
        if (this.value == "") {
          label.classList.remove("focus");
        }
        removeErrors();
      }

      function removeErrors() {
        var error = document.querySelectorAll(".mktoError");
        if (error.length > 0) {
          for (i = 0; i < error.length; i++) {
            error[i].parentNode.removeChild(error[i]);
          }
        }
      }
    }
    // Validation
    form.onValidate(function() {
      var email = form.vals().Email;
      if (email) {
        if (!isEmailGood(email)) {
          form.submittable(false);
          var emailElem = form.getFormElem().find("#Email");
          form.showErrorMessage("A valid business email address is required.", emailElem);
        } else {
          form.submittable(true);
        }
      }
    });

    // Override redirect URL set in Marketo
    form.onSuccess(function(values, followUpUrl) {
      // Build success page redirect
      var redirectURL = "${confirmationURL}";
      location.href = redirectURL;
      // Return false to prevent the submission handler continuing with its own processing
      return false;
    });
  });
});
var invalidDomains = [

  /* Default domains included */
  "aol.com", "att.net", "comcast.net", "facebook.com", "gmail.com", "gmx.com", "googlemail.com",
  "google.com", "hotmail.com", "hotmail.co.uk", "mac.com", "me.com", "mail.com", "msn.com",
  "live.com", "sbcglobal.net", "verizon.net", "yahoo.com", "yahoo.co.uk",

  /* Other global domains */
  "email.com", "games.com" /* AOL */ , "gmx.net", "hush.com", "hushmail.com", "icloud.com", "inbox.com",
  "lavabit.com", "love.com" /* AOL */ , "outlook.com", "pobox.com", "rocketmail.com" /* Yahoo */ ,
  "safe-mail.net", "wow.com" /* AOL */ , "ygm.com" /* AOL */ , "ymail.com" /* Yahoo */ , "zoho.com", "fastmail.fm",
  "yandex.com",

  /* United States ISP domains */
  "bellsouth.net", "charter.net", "comcast.net", "cox.net", "earthlink.net", "juno.com",

  /* British ISP domains */
  "btinternet.com", "virginmedia.com", "blueyonder.co.uk", "freeserve.co.uk", "live.co.uk",
  "ntlworld.com", "o2.co.uk", "orange.net", "sky.com", "talktalk.co.uk", "tiscali.co.uk",
  "virgin.net", "wanadoo.co.uk", "bt.com",

  /* Domains used in Asia */
  "sina.com", "qq.com", "naver.com", "hanmail.net", "daum.net", "nate.com", "yahoo.co.jp", "yahoo.co.kr", "yahoo.co.id", "yahoo.co.in", "yahoo.com.sg", "yahoo.com.ph",

  /* French ISP domains */
  "hotmail.fr", "live.fr", "laposte.net", "yahoo.fr", "wanadoo.fr", "orange.fr", "gmx.fr", "sfr.fr", "neuf.fr", "free.fr",

  /* German ISP domains */
  "gmx.de", "hotmail.de", "live.de", "online.de", "t-online.de" /* T-Mobile */ , "web.de", "yahoo.de",

  /* Russian ISP domains */
  "mail.ru", "rambler.ru", "yandex.ru", "ya.ru", "list.ru",

  /* Belgian ISP domains */
  "hotmail.be", "live.be", "skynet.be", "voo.be", "tvcablenet.be", "telenet.be",

  /* Argentinian ISP domains */
  "hotmail.com.ar", "live.com.ar", "yahoo.com.ar", "fibertel.com.ar", "speedy.com.ar", "arnet.com.ar",

  /* Domains used in Mexico */
  "hotmail.com", "gmail.com", "yahoo.com.mx", "live.com.mx", "yahoo.com", "hotmail.es", "live.com", "hotmail.com.mx", "prodigy.net.mx", "msn.com",

  /* Domains used in Brazil */
  "yahoo.com.br", "hotmail.com.br", "outlook.com.br", "uol.com.br", "bol.com.br", "terra.com.br", "ig.com.br", "itelefonica.com.br", "r7.com", "zipmail.com.br", "globo.com", "globomail.com", "oi.com.br"
];

function isEmailGood(email) {
  for (var i = 0; i < invalidDomains.length; i++) {
    var domain = invalidDomains[i];
    if (email.indexOf(domain) != -1) {
      return false;
    }
  }
  return true;
}
function setNav() {
  document.body.appendChild(parseHTML(templates.header(siteopts)));
  document.body.appendChild(parseHTML(templates.toggle()));
  document.body.appendChild(parseHTML(templates.sideNav(siteopts)));
  document.getElementById("wrapper").appendChild(parseHTML(templates.footer(siteopts)));
}
