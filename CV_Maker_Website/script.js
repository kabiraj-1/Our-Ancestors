let photoDataURL = '';

document.getElementById('add-edu-btn').onclick = () => addEducationRow();
document.getElementById('add-exp-btn').onclick = () => addTextRow('experience-rows', 'Experience');
document.getElementById('add-skill-btn').onclick = () => addTextRow('skills-rows', 'Skill');
document.getElementById('add-cert-btn').onclick = () => addTextRow('certifications-rows', 'Certification');

document.getElementById('photo').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      photoDataURL = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

function addEducationRow() {
  const row = document.createElement('div');
  row.classList.add('row');
  row.innerHTML = `
    <input placeholder="S. No.">
    <input placeholder="Degree">
    <input placeholder="School/College">
    <input placeholder="Major">
    <input placeholder="Year">
    <input placeholder="Division">
    <button class="remove-btn" onclick="this.parentElement.remove()">✖</button>
  `;
  document.getElementById('education-rows').appendChild(row);
}

function addTextRow(sectionId, placeholder) {
  const row = document.createElement('div');
  row.classList.add('row');
  row.innerHTML = `
    <input placeholder="${placeholder}">
    <button class="remove-btn" onclick="this.parentElement.remove()">✖</button>
  `;
  document.getElementById(sectionId).appendChild(row);
}

function generateCV() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address').value;
  const summary = document.getElementById('summary').value;

  let educationHTML = '<table><tr><th>S.No.</th><th>Qualification</th><th>College</th><th>Major</th><th>Year</th><th>Division</th></tr>';
  document.querySelectorAll('#education-rows .row').forEach(row => {
    const inputs = row.querySelectorAll('input');
    if ([...inputs].some(input => input.value.trim() !== '')) {
      educationHTML += `<tr>${[...inputs].map(i => `<td>${i.value}</td>`).join('')}</tr>`;
    }
  });
  educationHTML += '</table>';

  const buildList = (id) => {
    const rows = document.querySelectorAll(`#${id} .row input`);
    return `<ul>${[...rows].map(i => `<li>${i.value}</li>`).join('')}</ul>`;
  };

  const photoHTML = photoDataURL
    ? `<img src="${photoDataURL}" alt="Profile Photo">`
    : `<img src="kabi.jpg" alt="Demo Photo">`;

  const html = `
    <div id="cv">
      ${photoHTML}
      <h2>${name}</h2>
      <p><strong>Email:</strong> ${email} | <strong>Phone:</strong> ${phone} | <strong>Address:</strong> ${address}</p>
      <h3>Summary</h3><p>${summary}</p>
      <h3>Education</h3>${educationHTML}
      <h3>Experience</h3>${buildList('experience-rows')}
      <h3>Skills</h3>${buildList('skills-rows')}
      <h3>Certifications</h3>${buildList('certifications-rows')}
    </div>
  `;

  const preview = document.getElementById('cvPreview');
  preview.innerHTML = html;
  document.getElementById('downloadBtn').style.display = 'block';
}

function downloadPDF() {
  const cvElement = document.querySelector('#cv');
  if (!cvElement) {
    alert('Please generate your CV first!');
    return;
  }
  // Delay is important to allow DOM to render properly
  setTimeout(() => {
    html2pdf().from(cvElement).set({
      margin: 0.5,
      filename: 'My_CV.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }).save();
  }, 500);
}
