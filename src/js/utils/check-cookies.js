var Cookies = require("js-cookie");
function CheckCookies() {
    var cookieEnabled = navigator.cookieEnabled;
    if (!cookieEnabled) {
        document.cookie = "testcookie";
        cookieEnabled = document.cookie.indexOf("testcookie") != -1;
    }
    if (cookieEnabled) {
        Cookies.remove("testcookie");
    }
    return cookieEnabled;
}
module.exports = CheckCookies