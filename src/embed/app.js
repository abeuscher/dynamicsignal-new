var parseHTML = require("../js/utils/parse-html.js");

var templates = {
  "header":require("../templates/inc/header.pug"),
  "footer":require("../templates/inc/footer.pug")
}

window.addEventListener("load", function() {
  (function(d) {
    var config = {
      kitId: 'rqa1vic',
      scriptTimeout: 3000,
      async: true
    },
    h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
  })(document);
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
