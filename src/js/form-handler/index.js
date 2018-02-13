var getQV = require('../utils/get-querystring.js');
var Cookies = require("js-cookie");
var defaults = require("lodash/defaults");
var forEach = require("lodash/forEach");
var Map = require("lodash/map");
var Rearg = require("lodash/rearg");
var Pick = require("lodash/pick");
var Values = require("lodash/values");

function FormHandler() {
  this.settings = {
    "utm_codes": [{
      "ga": "utm_source",
      "mkto": "utmsource"
    }, {
      "ga": "utm_medium",
      "mkto": "utmmedium"
    }, {
      "ga": "utm_campaign",
      "mkto": "utmcampaign"
    }, {
      "ga": "utm_content",
      "mkto": "utmcontent"
    }],
    "cookieName": "utm_data"
  };
  if (Cookies.get(this.settings.cookieName)) {
    this.settings.cookieData = JSON.parse(Cookies.get(this.settings.cookieName))
  }
  else {
    this.settings.cookieData = [{
     "key": "utmcampaign",
     "value": ""
   }, {
     "key": "utmsource",
     "value": ""
   }, {
     "key": "utmmedium",
     "value": ""
   }, {
     "key": "utmcontent",
     "value": ""
   }];
  }
}
FormHandler.prototype.catchUTM = function() {
  var assignVals = [];
  var cookieData = new Array();
  for (i in this.settings.utm_codes) {
    if (getQV(this.settings.utm_codes[i].ga)) {
      cookieData.push({
        "key": this.settings.utm_codes[i].mkto,
        "value": getQV(this.settings.utm_codes[i].ga)
      });
    }
  }
  if (cookieData.length>0) {
    var writeData = Values(defaults(this.settings.CookieData, cookieData));
    Cookies.set(this.settings.cookieName, JSON.stringify(writeData), {
      expires: 365
    });
  }
}
FormHandler.prototype.writeUTM = function() {
  if (Cookies.get(this.settings.cookieName)) {
    var writeData = JSON.parse(Cookies.get(this.settings.cookieName));
    for(i=0;i<writeData.length;i++) {
      var data = writeData[i];
      if (document.querySelectorAll("[name=" + data.key + "]").length>0) {
        document.querySelectorAll("[name=" + data.key + "]")[0].value = data.value;
      }
    }
  }

}
FormHandler.prototype.fixForm = function() {
  var self = this;
  var theForm = document.querySelectorAll(".marketo-form")[0];
  var theID = theForm.id.split("_")[1];
  if (!theID) {
    document.getElementById("marketo-form-wrapper").style.display = "none";
  } else {
    MktoForms2.loadForm("//app-ab04.marketo.com", "362-RJN-040", theID);
    MktoForms2.whenReady(function(form) {
      var submitButton = document.querySelectorAll("button[type=submit]")[0];
      submitButton.classList.remove("mktoButton");
      submitButton.classList.add("button");
      var els = document.querySelectorAll(".mktoField");
      for (i = 0; i < els.length; i++) {
        var thisEl = els[i];
        thisEl.removeAttribute("placeholder");
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
      if (theID == "1163") {
        self.recaptcha(form, theForm);
      }
      self.writeUTM();
    });

  }
}
FormHandler.prototype.recaptcha = function(form, theForm) {
  var formEl = form.getFormElem()[0],
    emailEl = formEl.querySelector('#Email'),
    submitEl = formEl.querySelector('BUTTON[type="submit"]'),
    recaptchaEl = document.querySelector('.g-recaptcha');

  form.submittable(false);

  // force resize reCAPTCHA frame
  recaptchaEl.querySelector('IFRAME').setAttribute('height', '140');

  // move reCAPTCHA inside form container
  formEl.appendChild(recaptchaEl);

  form.onValidate(function(builtInValidation) {
    if (!builtInValidation) return;

    var recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
      recaptchaEl.classList.add('mktoInvalid');
    } else {
      recaptchaEl.classList.remove('mktoInvalid');
      form.addHiddenFields({
        lastRecaptchaUserInput: recaptchaResponse,
        captchaStatus: true
      });
      form.submittable(true);
    }
  });
  var theButton = theForm.querySelectorAll("iframe")[0];
  theButton.addEventListener("click", function() {
    for (i = 0; i < textFields.length; i++) {
      var el = textFields[i];
      if (el.value != "") {
        el.classList.add("filled-out");
      } else {
        if (el.classList.item("filled-out")) {
          el.classList.remove("filled-out");
        }
      }
    }
  });
  var theForm = document.getElementById("mktoForm_1163");
  var textFields = theForm.querySelectorAll(".mktoTextField,.mktoEmailField,.mktoTelField");
  for (i = 0; i < textFields.length; i++) {
    //textFields[i].addEventListener("blur", updateClasses);
  }

  function updateClasses() {
    if (this.value != "") {
      this.classList.add("filled-out");
    } else {
      if (this.classList.item("filled-out")) {
        this.classList.remove("filled-out");
      }
    }
  }
}

module.exports = FormHandler;
