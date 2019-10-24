var Cookies = require("js-cookie");

var parseHTML = require("../utils/parse-html.js");

var popup = require("./gdpr-popup.pug");

function TriggerGDPR(siteSettings) {
  var h = window.location.hostname;
  var domains = ["dynamicsignal.com", "staging.dynamicsignal.flywheelsites.com", "ds.local"];
  var domain = "dynamicsignal.com";
  for (i = 0; i < domains.length; i++) {
    if (h.indexOf(domains[i]) > -1) {
      domain = domains[i];
    }
  }
  if (!Cookies.get(siteSettings.gdprCookie)) {
    var warning = parseHTML(popup());
    document.body.appendChild(warning);
    document.body.classList.add("gdpr-popup");
    var yesButton = document.getElementById("btn-yes");
    window.addEventListener("click", startTheTracking);
    function startTheTracking(e) {
      Cookies.set(siteSettings.gdprCookie, "true", {
        expires: 365,
        domain: domain
      });
      triggerGA();
      window.removeEventListener("click", startTheTracking);
      if (e.target == yesButton) {
        e.preventDefault();
        warning.remove();
        document.body.classList.remove("gdpr-popup");
        return false;
      }
      else {
        yesButton.addEventListener("click", startTheTracking);
        return true;
      }
    }
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
    var f = d.body.firstChild,
      j = d.createElement(s),
      dl = l != 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src =
      '//www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', 'GTM-MQKZ8M');
}
module.exports = TriggerGDPR;