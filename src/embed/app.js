var parseHTML = require("../js/utils/parse-html.js");
var ScrollMagic = require("scrollmagic");

var templates = {
  "header":require("../templates/inc/header-embed.pug"),
  "footer":require("../templates/inc/footer.pug"),
  "toggle": require("../templates/inc/navbar-toggle.pug"),
  "sideNav": require("../templates/inc/side-nav.pug")
}
var siteopts = {
  "siteurl":"https://www.dynamicsignal.com"
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
    theToggle.style.margin = "0";
    theToggle.style.display = "block";
    theToggle.style.float = "none";
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
function setNav() {
  document.body.appendChild(parseHTML(templates.toggle()));
  document.body.appendChild(parseHTML(templates.sideNav(siteopts)));
  document.body.appendChild(parseHTML(templates.header(siteopts)));
  var wrapper = document.createElement("div");
  wrapper.id = "wrapper";
  document.body.appendChild(wrapper);
  var notifications = document.getElementById("notifications");
  var container = document.getElementById("hub-layout-container");
  wrapper.appendChild(notifications);
  wrapper.appendChild(container);
  wrapper.appendChild(parseHTML(templates.footer(siteopts)));
}
