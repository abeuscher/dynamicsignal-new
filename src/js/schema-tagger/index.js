function SchemaTagger(els) {
    els.forEach(el=>{
        el.setAttribute("itemscope","")
        el.setAttribute("itemtype","https://schema.org/FAQPage")
        let q = el.querySelectorAll("h3")[0]
        let a = el.querySelectorAll("p")[0]
        let content = el.innerHTML
        q.setAttribute("itemprop","Question") 
        a.setAttribute("itemprop","acceptedAnswer") 
    })
}

module.exports = SchemaTagger