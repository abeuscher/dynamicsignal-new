var PDFObject = require("pdfobject");

function pdfHandler(className) {
  var pdfs = document.querySelectorAll(className);
  for (i = 0; i < pdfs.length; i++) {
    var thisPDF = pdfs[i];
    if (thisPDF.getAttribute("data-pdf")) {
      PDFObject.embed(thisPDF.getAttribute("data-pdf"), thisPDF);
    }
  }
}
module.exports = pdfHandler;
