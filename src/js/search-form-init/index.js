function SearchFormInit(searchForms) {
    for (i = 0; i < searchForms.length; i++) {
        searchForms[i].addEventListener("submit", function (e) {
            e.preventDefault();
            var query = this.querySelectorAll(".query")[0].value.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
            location.href = "https://dynamicsignal.com/search/#q=" + encodeURI(query);
            return false;
        });
    }
}
module.exports = SearchFormInit;