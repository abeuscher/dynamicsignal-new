function DataBgArray(bgArrays) {
    for (i = 0; i < bgArrays.length; i++) {
        var el = bgArrays[i];
        var imageArray = JSON.parse(el.getAttribute("data-bg-array"));
        el.style.backgroundImage = "url('" + imageArray.url + "')";
    }
}
module.exports = DataBgArray;