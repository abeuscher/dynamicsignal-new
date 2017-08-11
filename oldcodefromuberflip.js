Hubs.onCtaFormSubmitSuccess = function(ctaId, ctaData, ctaName) {
    triggerEventGTM(ctaId, ctaName);
}

function triggerEventGTM(ctaId, ctaName) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        'event' : 'ctaSubmitted',
        'eventCategory': 'Uberflip CTA',
        'eventAction': 'CTA Form submitted',
        'eventLabel': 'Uberflip-CTA-' + ctaName
    });
}
Hubs.onLoad = function(){
  newTab();
  $("a.item-link[data-internal=false]").attr("target", "_blank");
}
Hubs.onPageChange = function(){
 newTab();
 $("a.item-link[data-internal=false]").attr("target", "_blank");
}
function newTab(){
    $('.stream-307374 .tile a.item-link').each(function(){
        $(this).attr({
    	"target": "_blank"
    	, "data-internal": "false"
    }).removeClass('hooked').off();
    })
}
