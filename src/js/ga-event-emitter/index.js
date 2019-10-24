function GAEventEmitter(triggers) {
    for (i = 0; i < triggers.length; i++) {
        triggers[i].addEventListener("click", logEvent);
    }
    function logEvent(e) {
        var eventName = e.target.getAttribute("data-event");
        window['GoogleAnalyticsObject'] = 'ga';
        window['ga'] = window['ga'] || function () {
            (window['ga'].q = window['ga'].q || []).push(arguments)
        };
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ "event": eventName });
    }
}
module.exports = GAEventEmitter;