function HeroWords(els) {
    var interval = 3000;
    var wordBucket = els[0];
    pageData.hero_words.push({ "word": wordBucket.innerHTML });
    wordBucket.setAttribute("data-current-index", pageData.hero_words.length);
    window.setTimeout(changeWord, interval);
    function changeWord() {
        var currIndex = parseInt(wordBucket.getAttribute("data-current-index"));
        var newIndex = pageData.hero_words[currIndex + 1] ? currIndex + 1 : 0;
        wordBucket.innerHTML = pageData.hero_words[newIndex].word;
        wordBucket.setAttribute("data-current-index", newIndex);
        window.setTimeout(changeWord, interval);
    }
}
module.exports = HeroWords;