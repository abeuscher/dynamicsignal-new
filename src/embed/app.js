var parseHTML = require("../js/utils/parse-html.js");

var templates = {
  "header":require("../templates/inc/header.pug"),
  "footer":require("../templates/inc/footer.pug")
}

window.addEventListener("load", function() {
  function inIframe () {
      try {
          return window.self !== window.top;
      } catch (e) {
          return true;
      }
  }
  if (!inIframe()) {
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
      "siteurl":"http://www.dynamicsignal.com"
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
    if (location.hash.indexOf("ufh")!=-1) {
      location.href = "https://resources.dynamicsignal.com/h/"+location.hash.substr(5,1)+"/" + location.hash.substr(7,location.hash.length-1);
    }
    else if (window.location.pathname.indexOf("ufh")!=-1) {
      var path = window.location.pathname;
      location.href = "https://resources.dynamicsignal.com/h/"+path.substr(7,1)+"/" + path.substr(9,path.length-1);
    }
    var links = document.querySelectorAll("a.item-link");
    for (i=0;i<links.length;i++) {
      var thisLink = links[i];
      if (thisLink.href.indexOf("amp.dynamicsignal.com")!=-1) {
        thisLink.target="_blank";
      }
    }
  }
  else {
    document.querySelectorAll(".top-nav")[0].style.display = "none";
    document.body.style.backgroundColor = "#ffffff";
  }

});
