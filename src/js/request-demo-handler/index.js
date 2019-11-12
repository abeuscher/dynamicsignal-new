var parseHTML = require("../utils/parse-html.js");
var Emitter = require("../ga-event-emitter/");

var templates = {
  "demoRequestModal": require("./demo-request-modal.pug"), // Modal Demo Request form
}

function RequestDemoHandler (buttons, siteSettings) {
    for (i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", openDemoRequest);
    }
    function openDemoRequest(e) {
      e.preventDefault();
      if (document.body.classList.contains("nav-open")) {
        document.body.classList.remove("nav-open");
      }
      document.body.classList.add("modal-open");
      if (!document.getElementById("demo-request-modal")) {
        document.body.appendChild(parseHTML(templates.demoRequestModal()));
        if (typeof MktoForms2 == "object") {
          initForm();
        }
        else {
          var s = document.createElement('script');
          s.type = 'text/javascript';
          s.src = "//app-ab04.marketo.com/js/forms2/js/forms2.min.js";
          document.body.appendChild(s);
          s.addEventListener("load", initForm);
        }

        function initForm() {
          siteSettings.formHandler.RegisterCallback(afterDemoSubmit);
          siteSettings.formHandler.fixForm();
        }
      }
      var m = document.getElementById("demo-request-modal");
      if (!m.classList.contains("active")) {
        m.classList.add("active");
      }
      var closeButtons = m.querySelectorAll(".btn-close");
      for (i = 0; i < closeButtons.length; i++) {
        closeButtons[i].addEventListener("click", closeDemoRequest);
      }
      var bg = m.querySelectorAll(".bg")[0];
      bg.addEventListener("click", closeDemoRequest);
    }
    function afterDemoSubmit() {
      var theForm = document.getElementById("request-demo-form");
      var theMessage = document.getElementById("thank-you-message");
      theForm.classList.add("hide");
      theMessage.classList.remove("hide");
      var eventEmitter = new Emitter([]);
      eventEmitter.LogSingleEvent({
        "event":"DemoRequestModalSubmit"
      });
    }
    function closeDemoRequest(e) {
      if (e) {
        e.preventDefault();
      }

      var m = document.getElementById("demo-request-modal");
      if (m.classList.contains("active")) {
        m.classList.remove("active");
      }
      document.body.classList.remove("modal-open");
    }
  }
  module.exports = RequestDemoHandler;