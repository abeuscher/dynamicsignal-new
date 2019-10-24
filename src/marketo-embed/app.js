var ScrollMagic = require("scrollmagic");
var parseHTML = require("../js/utils/parse-html.js");
var isElement = require("../js/utils/is-element.js");
var FormHandler = require("../js/form-handler/index.js");
var ActivateVideos = require("../js/video-handler/index.js");

var RequestDemoHandler = require("../js/request-demo-handler/index.js");

var Cookies = require("js-cookie");
var siteSettings = {
  "gdprCookie": "ds-gdpr",
  "templates": {
    "gdprPopup": require("../js/gdpr-popup/gdpr-popup.pug"),
    "header": require("../templates/inc/header-embed.pug"),
    "footer": require("../templates/inc/footer.pug"),
    "sideNav": require("../templates/inc/side-nav.pug")
  },
  "formHandler": new FormHandler()
}
var siteopts = {
  "siteurl": "https://www.dynamicsignal.com"
};

window.addEventListener("load", function () {
  setNav();
  if (document.getElementById("marketo-form-wrapper")) {
    siteSettings.formHandler.catchUTM();
    siteSettings.formHandler.fixForm();
  }
  triggerGDPR();
  // Add the header shrinker
  var headController = new ScrollMagic.Controller({
    "loglevel": 0
  });
  var headerLock = new ScrollMagic.Scene({
    offset: 10,
    duration: 0
  })
    .on("enter", function (e) {
      if (!document.body.classList.contains("nav-short")) {
        document.body.classList.add("nav-short");
      }
    })
    .on("leave", function (e) {
      if (document.body.classList.contains("nav-short")) {
        document.body.classList.remove("nav-short");
      }
    })
    .addTo(headController);
  new ScrollMagic.Scene({
    offset: 0,
    duration: 0
  });
  headerLock.addTo(headController);
  // Add menu button listener
  var theWrapper = document.getElementById("wrapper");
  var theToggle = document.getElementById("toggle-side-nav");
  var closeButton = document.getElementById("btn-close-sidenav");
  theToggle.addEventListener("click", function (e) {
    e.preventDefault();
    if (document.body.classList.contains("nav-open")) {
      document.body.classList.remove("nav-open");
      theWrapper.removeEventListener("click", closeBody);
      closeButton.removeEventListener("click", closeBody);
    } else {
      document.body.classList.add("nav-open");
      theWrapper.addEventListener("click", closeBody);
      closeButton.addEventListener("click", closeBody);
    }
  });

  function closeBody(e) {
    e.preventDefault();
    document.body.classList.remove("nav-open");
    theWrapper.removeEventListener("click", closeBody);
    closeButton.removeEventListener("click", closeBody);
  }
  var videoHandler = new ActivateVideos();
  if (document.getElementById("multivideo")) {
    videoHandler.buildMultiplayer(document.getElementById("multivideo"));
    activateImages();
  }
  if (document.getElementById("video-demo-button")) {
    var btn = document.getElementById("video-demo-button");
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      if (history.pushState) {
        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?val=demorequest';
        window.history.pushState({ path: newurl }, '', newurl);
      }
      btn.innerHTML = "Request Sent!";
    });
  }

  for (i in siteActions) {
    var thisAction = siteActions[i];
    if (document.querySelectorAll(thisAction.element).length > 0) {
      thisAction.action(document.querySelectorAll(thisAction.element));
    }
  }
});
var siteActions = [{
  "element": ".request-demo",
  "action": function (buttons) {
    RequestDemoHandler(buttons, siteSettings);
  }
}];
function setNav() {
  var theOverlay = document.createElement("div");
  theOverlay.id = "overlay";

  var theWrapper = document.getElementById("wrapper");
  var theHeader = parseHTML(siteSettings.templates.header(siteopts));
  theWrapper.parentNode.insertBefore(theHeader, theWrapper);
  document.body.appendChild(parseHTML(siteSettings.templates.sideNav(siteopts)));
  document.body.appendChild(theOverlay);
  theWrapper.appendChild(parseHTML(siteSettings.templates.footer(siteopts)));
  theWrapper.classList.add("marketo-wrapper");
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
  setTimeout(checkVisitor, 3000);
}
function activateImages() {
  var backgroundImages = document.querySelectorAll("[data-bg]");
  for (i in backgroundImages) {
    if (isElement(backgroundImages[i])) {
      thisElement = backgroundImages[i];
      if (thisElement.getAttribute("data-bg").indexOf("http") > -1) {
        thisElement.style.backgroundImage = "url('" + thisElement.getAttribute("data-bg") + "')";
      } else {
        thisElement.style.backgroundImage = "url('" + siteSettings.imagePath + thisElement.getAttribute("data-bg") + "')";
      }
    }
  }
  var lzImages = document.querySelectorAll("[data-src]");
  for (i in lzImages) {
    if (isElement(lzImages[i])) {
      thisElement = lzImages[i];
      if (typeof (JSON.parse(thisElement.getAttribute("data-src"))) == 'object') {
        var img = JSON.parse(thisElement.getAttribute("data-src")).url;
        thisElement.src = img;
      }
      else {
        var img = document.createElement("img");
        if (thisElement.getAttribute("data-src").indexOf("http") > -1) {
          img.src = thisElement.getAttribute("data-src");
        } else {
          img.src = siteSettings.imagePath + thisElement.getAttribute("data-src");
        }

        img.alt = "";
        thisElement.appendChild(img);
      }
    }
  }
  var bgArrays = document.querySelectorAll("[data-bg-array]");
  for (i = 0; i < bgArrays.length; i++) {
    var el = bgArrays[i];
    var imageArray = JSON.parse(el.getAttribute("data-bg-array"));
    el.style.backgroundImage = "url('" + imageArray.url + "')";
  }
}
function checkVisitor() {
  if (typeof (knownVisitor) == 'undefined' && typeof (thisPageIsAGate) != 'undefined') {
    if (typeof (gateUrl) != 'undefined') {
      if (gateUrl != "") {
        //location.href = gateUrl;
        console.log("unknown visitor");
      }
    }
  }
}