var ScrollMagic = require("scrollmagic");
var parseHTML = require("../js/utils/parse-html.js");
var FormHandler = require("../js/form-handler/index.js");
var ActivateVideos = require("../js/video-handler/index.js");
var Cookies = require("js-cookie");
var siteSettings = {
  "gdprCookie": "ds-gdpr",
  "templates": {  
    "gdprPopup": require("../js/inc/gdpr-popup.pug")
  }
}
var templates = {
  "header": require("../templates/inc/header-embed.pug"),
  "footer": require("../templates/inc/footer.pug"),
  "toggle": require("../templates/inc/navbar-toggle.pug"),
  "sideNav": require("../templates/inc/side-nav.pug")
};
var siteopts = {
  "siteurl": "https://www.dynamicsignal.com"
};
window.addEventListener("load", function() {
  setNav();
  if (document.getElementById("marketo-form-wrapper")) {
  var formHandler = new FormHandler();
  formHandler.catchUTM();
  formHandler.fixForm();
  }
  triggerGDPR();
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
    var btn = document.getElementById("btn-search-header");
    var btnClose = document.getElementById("btn-close-search");
    var searchBox = document.getElementById("search-box-header");
    btn.addEventListener("click", function() {
      searchBox.classList.toggle("active");
    });
    btnClose.addEventListener("click", function() {
      searchBox.classList.toggle("active");
    });
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
  new ActivateVideos();
  if (document.getElementById("video-demo-button")) {
    var btn = document.getElementById("video-demo-button");
    btn.addEventListener("click", function(e) {
      e.preventDefault();
      btn.innerHTML = "Request Sent!";
    });
  }
    // Activate search forms
    var searchForms = document.querySelectorAll(".search-form");
    for (i = 0; i < searchForms.length; i++) {
      var thisForm = searchForms[i];
      thisForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var query = this.querySelectorAll(".query")[0].value.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        location.href = "https://dynamicsignal.com/search/#q=" + encodeURI(query);
        return false;
      });
    }
});

function setNav() {
  document.body.appendChild(parseHTML(templates.header(siteopts)));
  document.body.appendChild(parseHTML(templates.toggle()));
  document.body.appendChild(parseHTML(templates.sideNav(siteopts)));
  document.getElementById("wrapper").appendChild(parseHTML(templates.footer(siteopts)));
}

function triggerGDPR() {
  var domain = "dynamicsignal.com";
  if (!Cookies.get(siteSettings.gdprCookie)) {
    var warning = parseHTML(siteSettings.templates.gdprPopup());
    document.body.appendChild(warning);
    var yesButton = document.getElementById("btn-yes");
    var noButton = document.getElementById("btn-no");
    yesButton.addEventListener("click", function (e) {
      e.preventDefault();
      Cookies.set(siteSettings.gdprCookie, "true", {
        expires: 365,
        domain: domain
      });
      warning.remove();
      // writeCTA();
      return false;
    });
    window.addEventListener("click", function (e) {
      Cookies.set(siteSettings.gdprCookie, "true", {
        expires: 365,
        domain: domain
      });
      triggerGA();
      return true;
    });
  } else {
    triggerGA();
  }
}
function triggerGA() {
  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src =
      '//www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', 'GTM-MQKZ8M');
}
