function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    var decoded = null;
    try {
        decoded = decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
    catch(e) {
        decoded = null;
    }
    return results === null ? '' : decoded;
};
module.exports = getUrlParameter;
