const photoInput = document.getElementById("photoInput");
const cvPhoto = document.getElementById("cv-photo");

photoInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      cvPhoto.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

function downloadJPG() {
  const cvElement = document.getElementById("cv-preview");
  html2canvas(cvElement).then(canvas => {
    const link = document.createElement("a");
    link.download = "Kabiraj_CV.jpg";
    link.href = canvas.toDataURL("image/jpeg");
    link.click();
  });
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "pt", "a4");
  const cv = document.getElementById("cv-preview");

  html2canvas(cv).then(canvas => {
    const imgData = canvas.toDataURL("image/jpeg");
    const imgProps = doc.getImageProperties(imgData);
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    doc.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
    doc.save("Kabiraj_CV.pdf");
  });
}

function downloadDOC() {
  const content = document.getElementById("cv-preview").innerHTML;
  const converted = htmlDocx.asBlob(`<html><body>${content}</body></html>`);
  const link = document.createElement("a");
  link.href = URL.createObjectURL(converted);
  link.download = "Kabiraj_CV.docx";
  link.click();
}
