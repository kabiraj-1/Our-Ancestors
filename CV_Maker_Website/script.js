let photoDataURL = '';

// Helpers to add dynamic input rows
function addEducationRow(data = {}) {
  const row = document.createElement('div');
  row.classList.add('row');
  row.innerHTML = `
    <input type="text" name="sno" placeholder="S. No." value="${data.sno || ''}">
    <input type="text" name="qualification" placeholder="Academic Qualification" value="${data.qualification || ''}">
    <input type="text" name="college" placeholder="College/School Name" value="${data.college || ''}">
    <input type="text" name="major" placeholder="Major Subject" value="${data.major || ''}">
    <input type="text" name="year" placeholder="Passed Year" value="${data.year || ''}">
    <input type="text" name="division" placeholder="Division" value="${data.division || ''}">
    <button type="button" class="remove-btn" onclick="removeRow(this)">✖</button>
  `;
  document.getElementById('education-rows').appendChild(row);
}

function addExperienceRow(data = '') {
  const row = document.createElement('div');
  row.classList.add('row');
  row.innerHTML = `
    <input type="text" placeholder="Experience details" value="${data}">
    <button type="button" class="remove-btn" onclick="removeRow(this)">✖</button>
  `;
  document.getElementById('experience-rows').appendChild(row);
}

function addSkillRow(data = '') {
  const row = document.createElement('div');
  row.classList.add('row');
  row.innerHTML = `
    <input type="text" placeholder="Skill" value="${data}">
    <button type="button" class="remove-btn" onclick="removeRow(this)">✖</button>
  `;
  document.getElementById('skills-rows').appendChild(row);
}

function addCertificationRow(data = '') {
  const row = document.createElement('div');
  row.classList.add('row');
  row.innerHTML = `
    <input type="text" placeholder="Certification or Training" value="${data}">
    <button type="button" class="remove-btn" onclick="removeRow(this)">✖</button>
  `;
  document.getElementById('certifications-rows').appendChild(row);
}

function removeRow(button) {
  button.parentElement.remove();
}

// Image upload
document.getElementById('photo').addEventListener('change', function (e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function (event) {
    photoDataURL = event.target.result;
  };
  if (file) reader.readAsDataURL(file);
});

// Download uploaded photo
document.getElementById('downloadPhotoBtn').addEventListener('click', () => {
  if (!photoDataURL) {
    alert("Please upload a photo first.");
    return;
  }
  const a = document.createElement("a");
  a.href = photoDataURL;
  a.download = "My_Photo.png";
  a.click();
});

// Generate CV
function generateCV() {
  const name = document.getElementById('name').value || 'Your Name';
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address').value;
  const summary = document.getElementById('summary').value;

  const education = buildEducationTable();
  const experience = buildListFromInputs('experience-rows');
  const skills = buildListFromInputs('skills-rows');
  const certifications = buildListFromInputs('certifications-rows');

  const photo = photoDataURL
    ? `<img src="${photoDataURL}" alt="Profile Photo">`
    : `<img src="kabi.jpg" alt="Profile Photo">`;

  const previewHTML = `
    <div id="cv">
      ${photo}
      <h1>${name}</h1>
      <h2>Curriculum Vitae</h2>
      <section>
        <h3>Contact Information</h3>
        <p><strong>Email:</strong> ${email} | <strong>Phone:</strong> ${phone} | <strong>Address:</strong> ${address}</p>
      </section>
      <section>
        <h3>Professional Summary</h3>
        <p>${summary.replace(/\n/g, "<br>")}</p>
      </section>
      <section>
        <h3>Education</h3>
        ${education}
      </section>
      <section>
        <h3>Experience</h3>
        ${experience}
      </section>
      <section>
        <h3>Skills</h3>
        ${skills}
      </section>
      <section>
        <h3>Certifications & Training</h3>
        ${certifications}
      </section>
    </div>
  `;

  const preview = document.getElementById('cvPreview');
  preview.innerHTML = previewHTML;
  document.getElementById('downloadBtn').style.display = 'inline-block';
  document.getElementById('downloadWordBtn').style.display = 'inline-block';
}

// Table builder
function buildEducationTable() {
  const rows = document.querySelectorAll('#education-rows .row');
  if (!rows.length) return '<p>No education details provided.</p>';

  let table = `<table><thead><tr>
    <th>S. No.</th><th>Qualification</th><th>College</th>
    <th>Major</th><th>Year</th><th>Division</th>
  </tr></thead><tbody>`;

  rows.forEach(row => {
    const values = [...row.querySelectorAll('input')].map(i => i.value || '-');
    table += `<tr>${values.map(v => `<td>${v}</td>`).join('')}</tr>`;
  });

  table += '</tbody></table>';
  return table;
}

// List builder
function buildListFromInputs(containerId) {
  const inputs = document.querySelectorAll(`#${containerId} .row input`);
  const list = Array.from(inputs)
    .map(input => input.value.trim())
    .filter(val => val)
    .map(val => `<li>${val}</li>`)
    .join('');
  return list ? `<ul>${list}</ul>` : '<p>None provided.</p>';
}

// PDF download
function downloadPDF() {
  const cvElement = document.getElementById('cv');
  if (!cvElement) return alert("Please generate the CV first.");
  html2pdf().from(cvElement).set({
    margin: 0.5,
    filename: 'My_CV.pdf',
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  }).save();
}

// Word Download
function downloadWord() {
  const cv = document.getElementById('cv');
  if (!cv) return alert("Generate the CV first.");
  const blob = new Blob(['\ufeff', cv.innerHTML], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "My_CV.doc";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// DEMO CV auto populate
window.onload = () => {
  document.getElementById('name').value = 'Kabiraj Bhatt';
  document.getElementById('email').value = 'bhattkabiraj255@gmail.com';
  document.getElementById('phone').value = '9847546823, 9812753490';
  document.getElementById('address').value = 'Shuklaphanta 01, Kanchanpur';
  document.getElementById('summary').value = `To augment my career in a Government sector where dynamism is the key concern and have enough scope to utilize my qualification along with the proper use of my vision, positive attitude, interpersonal relationship, and communication skills in order to be a part of the best practices and ideas.`;

  addEducationRow({ sno: '1', qualification: 'SLC', college: 'Baijnath H S School', major: 'Account & Economics', year: '2069', division: 'First' });
  addEducationRow({ sno: '2', qualification: '+2 (Management)', college: 'Chandra Surya Bal H S School', major: 'Account & Marketing', year: '2073', division: 'Second' });
  addEducationRow({ sno: '3', qualification: 'BBS (TU)', college: 'Krishna Baijnath Multiple Campus', major: 'Finance', year: '2080', division: 'Second' });
  addEducationRow({ sno: '4', qualification: 'MBS (TU)', college: 'Janjyoti Multiple Campus', major: 'Finance', year: 'Running', division: '-' });
  addEducationRow({ sno: '5', qualification: 'Diploma in Civil Engineering', college: 'Shuklaphanta Polytechnic Institute', major: '-', year: 'Running', division: '-' });

  addExperienceRow('10 Months as a computer operator at Shuklaphanta 01 office...');
  addExperienceRow('45 Days as a data collector at Shuklaphanta 01 office.');
  addExperienceRow('2 Months at Shuklaphanta 04 office.');
  addExperienceRow('1 Month for Rastriya Janganana Bibag (2078).');
  addExperienceRow('3 Years at Bipin Books & Stationers, Dhangadhi, Kailali.');

  addSkillRow('Computer Operator');
  addSkillRow('Data Entry');
  addSkillRow('MS Office');
  addSkillRow('Communication');
  addSkillRow('Basic Mobile Repairing');

  addCertificationRow('Operator in Computer Training from CCT Computer Centre.');
  addCertificationRow('Basic Mobile Repairing from Raj Technical Institute, Delhi.');

  generateCV();
};

// Add row events
document.getElementById('add-edu-btn').onclick = () => addEducationRow();
document.getElementById('add-exp-btn').onclick = () => addExperienceRow();
document.getElementById('add-skill-btn').onclick = () => addSkillRow();
document.getElementById('add-cert-btn').onclick = () => addCertificationRow();
