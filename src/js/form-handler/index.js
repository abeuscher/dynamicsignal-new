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
    "cookieName": "utm_data",
    "formSubmitCallbacks" : []
  };
  if (Cookies.get(this.settings.cookieName)) {
    this.settings.cookieData = JSON.parse(Cookies.get(this.settings.cookieName))
  } else {
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
  for (i=0;i<this.settings.utm_codes.length;i++) {
    if (getQV(this.settings.utm_codes[i].ga)) {
      cookieData.push({
        "key": this.settings.utm_codes[i].mkto,
        "value": getQV(this.settings.utm_codes[i].ga)
      });
    }
  }
  if (cookieData.length > 0) {
    var writeData = Values(defaults(this.settings.CookieData, cookieData));
    Cookies.set(this.settings.cookieName, JSON.stringify(writeData), {
      expires: 365
    });
  }
}
FormHandler.prototype.writeUTM = function() {
  if (Cookies.get(this.settings.cookieName)) {
    var writeData = JSON.parse(Cookies.get(this.settings.cookieName));
    for (i = 0; i < writeData.length; i++) {
      var data = writeData[i];
      if (document.querySelectorAll("[name=" + data.key + "]").length > 0) {
        document.querySelectorAll("[name=" + data.key + "]")[0].value = data.value;
      }
    }
  }
}
FormHandler.prototype.RegisterCallback = function(cb) {
  this.settings.formSubmitCallbacks.push(cb);
}
FormHandler.prototype.UnregisterCallback = function(cb) {
  this.settings.formSubmitCallbacks = this.settings.formSubmitCallbacks.filter(thiscb=>{ return thiscb!=cb; });
}
FormHandler.prototype.fixForm = function() {
  var self = this;
  if (document.querySelectorAll(".marketo-form")[0]) {
    var theForm = document.querySelectorAll(".marketo-form")[0];
  }
  else {
    var theForm = document.querySelectorAll(".marketo-blue")[0];
  }
  
  var theID = theForm.id.split("_")[1];
  this.id = theID;
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
      var linkedInButton = document.querySelectorAll(".IN-widget");

      if (linkedInButton.length>0) {
        setTimeout(checkFields,50);
        function checkFields() {
          var fieldNames = ["Title","FirstName","LastName","Company"];
          for (i=0;i<fieldNames.length;i++) {
            var theField = fieldNames[i];
            if (document.getElementById(theField) && document.getElementById(theField).value!="" && !document.getElementById(theField).classList.contains("focus")) {
              document.querySelectorAll("label[for='"+theField+"']")[0].classList.add("focus");
              document.getElementById(theField).classList.add("focus");
            }
          }
          setTimeout(checkFields,500);
        }

      }
      form.onSuccess(function(values, followUpUrl) {
        if (self.settings.formSubmitCallbacks.length) {
          for (i=0;i<self.settings.formSubmitCallbacks.length;i++) {
            self.settings.formSubmitCallbacks[i]();
          }
        }
        else {
          location.href = followUpUrl;
        } 
        return false;
      });
      if (typeof validateCorporateEmail !== 'undefined') {
        form.onValidate(function() {
          var email = form.vals().Email;
          if (email) {
            if (!self.isEmailGood(email) && this.id != 1) {
              form.submittable(false);
              var emailElem = form.getFormElem().find("#Email");
              form.showErrorMessage("A valid business email address is required.", emailElem);
            } else {
              form.submittable(true);
            }
          }
        });
      }
      self.writeUTM();





    });

  }
}
FormHandler.prototype.recaptcha = function(form, theForm) {
  var self = this;
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
    console.log("here");
    if (!builtInValidation) return;
    var recaptchaResponse = grecaptcha.getResponse();
    var flag = true;
    if (!recaptchaResponse || recaptchaResponse=="") {
      recaptchaEl.classList.add('mktoInvalid');
      flag = false;
    } else if (typeof validateCorporateEmail !== 'undefined') {
      var email = form.vals().Email;
      if (email) {

        if (!self.isEmailGood(email) && this.id != 1) {
          flag = false;
          var emailElem = form.getFormElem().find("#Email");
          form.showErrorMessage("A valid business email address is required.", emailElem);
        }else {
          recaptchaEl.classList.remove('mktoInvalid');
          form.addHiddenFields({
            lastRecaptchaUserInput: recaptchaResponse,
            captchaStatus: true
          });
        }
      }
    }
    form.submittable(flag);
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
}
FormHandler.prototype.isEmailGood = function(email) {
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


  for (var i = 0; i < invalidDomains.length; i++) {
    var domain = invalidDomains[i];
    if (email.indexOf(domain) != -1) {
      return false;
    }
  }
  return true;
}


module.exports = FormHandler;
