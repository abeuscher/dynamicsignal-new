function TriggerGDPR() {
  let first = document.createElement('script');
  first.type = "text/javascript";
  first.src = "https://cdn.cookielaw.org/consent/941d0dfb-c6f7-43fd-a2c9-aaf96cc1ba25-test/OtAutoBlock.js";
  var s = document.createElement('script');
  s.type = "text/javascript";
  s.setAttribute("data-domain-script", "941d0dfb-c6f7-43fd-a2c9-aaf96cc1ba25-test");
  s.src = "https://cdn.cookielaw.org/scripttemplates/otSDKStub.js";
  var fs = document.getElementsByTagName('script')[0];  // Get the first script
  fs.parentNode.insertBefore(first, fs);
  fs.parentNode.insertBefore(s, fs);
  s.addEventListener("load", () => { function OptanonWrapper() { } triggerGA() })
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