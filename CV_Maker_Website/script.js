let photoDataURL = '';

// Add row functions
function addEducationRow(data = {}) {
  const container = document.getElementById('education-rows');
  const row = document.createElement('div');
  row.classList.add('row');
  row.innerHTML = `
    <input name="sno" placeholder="S. No." value="${data.sno || ''}" />
    <input name="qualification" placeholder="Qualification" value="${data.qualification || ''}" />
    <input name="college" placeholder="School/College" value="${data.college || ''}" />
    <input name="major" placeholder="Major" value="${data.major || ''}" />
    <input name="year" placeholder="Year" value="${data.year || ''}" />
    <input name="division" placeholder="Division" value="${data.division || ''}" />
    <button type="button" class="remove-btn" onclick="this.parentElement.remove()">✖</button>
  `;
  container.appendChild(row);
}
function addExperienceRow(data = '') {
  const container = document.getElementById('experience-rows');
  const row = document.createElement('div');
  row.classList.add('row');
  row.innerHTML = `
    <input type="text" value="${data}" placeholder="Experience detail" />
    <button type="button" class="remove-btn" onclick="this.parentElement.remove()">✖</button>
  `;
  container.appendChild(row);
}
function addSkillRow(data = '') {
  const container = document.getElementById('skills-rows');
  const row = document.createElement('div');
  row.classList.add('row');
  row.innerHTML = `
    <input type="text" value="${data}" placeholder="Skill" />
    <button type="button" class="remove-btn" onclick="this.parentElement.remove()">✖</button>
  `;
  container.appendChild(row);
}
function addCertificationRow(data = '') {
  const container = document.getElementById('certifications-rows');
  const row = document.createElement('div');
  row.classList.add('row');
  row.innerHTML = `
    <input type="text" value="${data}" placeholder="Certification/Training" />
    <button type="button" class="remove-btn" onclick="this.parentElement.remove()">✖</button>
  `;
  container.appendChild(row);
}

// Event listeners
document.getElementById('add-edu-btn').onclick = () => addEducationRow();
document.getElementById('add-exp-btn').onclick = () => addExperienceRow();
document.getElementById('add-skill-btn').onclick = () => addSkillRow();
document.getElementById('add-cert-btn').onclick = () => addCertificationRow();

// Upload photo
document.getElementById('photo').addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = evt => photoDataURL = evt.target.result;
    reader.readAsDataURL(file);
  }
});

// Build Education table
function buildEducationTable() {
  const rows = document.querySelectorAll('#education-rows .row');
  let table = '<table><thead><tr><th>S.No</th><th>Qualification</th><th>College</th><th>Major</th><th>Year</th><th>Division</th></tr></thead><tbody>';
  rows.forEach(row => {
    const inputs = row.querySelectorAll('input');
    table += `<tr>${[...inputs].map(i => `<td>${i.value}</td>`).join('')}</tr>`;
  });
  return table + '</tbody></table>';
}
function buildList(id) {
  const inputs = document.querySelectorAll(`#${id} .row input`);
  return `<ul>${[...inputs].map(i => `<li>${i.value}</li>`).join('')}</ul>`;
}

function generateCV() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address').value;
  const summary = document.getElementById('summary').value;

  const photo = photoDataURL ? `<img src="${photoDataURL}" alt="Photo">` : '';

  const cvHTML = `
    <div id="cv">
      ${photo}
      <h1>${name}</h1>
      <h2>Curriculum Vitae</h2>
      <p><strong>Email:</strong> ${email} | <strong>Phone:</strong> ${phone} | <strong>Address:</strong> ${address}</p>
      <h3>Professional Summary</h3><p>${summary}</p>
      <h3>Education</h3>${buildEducationTable()}
      <h3>Experience</h3>${buildList('experience-rows')}
      <h3>Skills</h3>${buildList('skills-rows')}
      <h3>Certifications & Training</h3>${buildList('certifications-rows')}
    </div>
  `;
  document.getElementById('cvPreview').innerHTML = cvHTML;
  document.getElementById('cvActions').style.display = 'block';
}

function downloadPDF() {
  const element = document.getElementById('cv');
  if (!element) return alert("Please generate your CV first.");
  html2pdf().from(element).set({
    margin: 0.5,
    filename: 'My_CV.pdf',
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  }).save();
}

function downloadPhoto() {
  if (!photoDataURL) return alert("Please upload a photo first!");
  const link = document.createElement('a');
  link.href = photoDataURL;
  link.download = 'profile_photo.png';
  link.click();
}

// Demo toggle
function toggleDemo() {
  const demoData = {
    name: 'Kabiraj Bhatt',
    email: 'bhattkabiraj255@gmail.com',
    phone: '9847546823, 9812753490',
    address: 'Shuklaphanta 01, Kanchanpur',
    summary: 'To augment my career in a Government sector where dynamism is the key concern...'
  };
  Object.entries(demoData).forEach(([id, value]) => {
    document.getElementById(id).value = value;
  });

  // Clear rows and populate with demo
  document.getElementById('education-rows').innerHTML = '';
  addEducationRow({ sno: '1', qualification: 'SLC', college: 'Baijnath H S School', major: 'Account', year: '2069', division: 'First' });
  addEducationRow({ sno: '2', qualification: '+2', college: 'Chandra Surya H S School', major: 'Marketing', year: '2073', division: 'Second' });

  document.getElementById('experience-rows').innerHTML = '';
  addExperienceRow('Computer Operator - Shuklaphanta Office (10 months)');
  addExperienceRow('Data Collector - Janganana (1 month)');

  document.getElementById('skills-rows').innerHTML = '';
  addSkillRow('Computer Operation');
  addSkillRow('Data Entry');

  document.getElementById('certifications-rows').innerHTML = '';
  addCertificationRow('Computer Training - CCT Center');
  addCertificationRow('Mobile Repair - Raj Institute');

  generateCV();
}
