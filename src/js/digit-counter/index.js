

function DigitCounter() {
    var counters = document.querySelectorAll("[data-counter-min]");
    for (i=0;i<counters.length;i++) {
        var thisCounter = counters[i];
        thisCounter.innerHTML = thisCounter.getAttribute("data-counter-max");
    }
};

module.exports = DigitCounter;