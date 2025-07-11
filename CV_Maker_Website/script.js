let photoDataURL = '';

// Add row functions
function addEducationRow(data = {}) {
  const container = document.getElementById('education-rows');
  const row = document.createElement('div');
  row.classList.add('row');
  row.innerHTML = `
    <input type="text" name="sno" placeholder="S. No." value="${data.sno || ''}" />
    <input type="text" name="qualification" placeholder="Academic Qualification" value="${data.qualification || ''}" />
    <input type="text" name="college" placeholder="College/School Name" value="${data.college || ''}" />
    <input type="text" name="major" placeholder="Major Subject" value="${data.major || ''}" />
    <input type="text" name="year" placeholder="Passed Year" value="${data.year || ''}" />
    <input type="text" name="division" placeholder="Division" value="${data.division || ''}" />
    <button type="button" class="remove-btn" onclick="removeRow(this)">✖</button>
  `;
  container.appendChild(row);
}

function addExperienceRow(data = '') {
  const container = document.getElementById('experience-rows');
  const row = document.createElement('div');
  row.classList.add('row');
  row.innerHTML = `
    <input type="text" placeholder="Experience details" value="${data}" />
    <button type="button" class="remove-btn" onclick="removeRow(this)">✖</button>
  `;
  container.appendChild(row);
}

function addSkillRow(data = '') {
  const container = document.getElementById('skills-rows');
  const row = document.createElement('div');
  row.classList.add('row');
  row.innerHTML = `
    <input type="text" placeholder="Skill" value="${data}" />
    <button type="button" class="remove-btn" onclick="removeRow(this)">✖</button>
  `;
  container.appendChild(row);
}

function addCertificationRow(data = '') {
  const container = document.getElementById('certifications-rows');
  const row = document.createElement('div');
  row.classList.add('row');
  row.innerHTML = `
    <input type="text" placeholder="Certification or Training" value="${data}" />
    <button type="button" class="remove-btn" onclick="removeRow(this)">✖</button>
  `;
  container.appendChild(row);
}

function removeRow(button) {
  button.parentElement.remove();
}

// Add buttons event listeners
document.getElementById('add-edu-btn').addEventListener('click', () => addEducationRow());
document.getElementById('add-exp-btn').addEventListener('click', () => addExperienceRow());
document.getElementById('add-skill-btn').addEventListener('click', () => addSkillRow());
document.getElementById('add-cert-btn').addEventListener('click', () => addCertificationRow());

// Photo upload handler
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

// Build education table from inputs
function buildEducationTableFromInputs() {
  const rows = document.querySelectorAll('#education-rows .row');
  if (rows.length === 0) return '<p>No education details provided.</p>';

  const headers = ['S. No.', 'Academic Qualification', 'College/School Name', 'Major Subject', 'Passed Year', 'Division'];

  let table = '<table><thead><tr>';
  headers.forEach(h => table += `<th>${h}</th>`);
  table += '</tr></thead><tbody>';

  for (const row of rows) {
    const cells = [
      row.querySelector('input[name="sno"]').value.trim(),
      row.querySelector('input[name="qualification"]').value.trim(),
      row.querySelector('input[name="college"]').value.trim(),
      row.querySelector('input[name="major"]').value.trim(),
      row.querySelector('input[name="year"]').value.trim(),
      row.querySelector('input[name="division"]').value.trim()
    ];
    if (cells.some(cell => cell !== '')) {
      table += '<tr>';
      cells.forEach(cell => table += `<td>${cell || '-'}</td>`);
      table += '</tr>';
    }
  }
  table += '</tbody></table>';
  return table;
}

// Build list from dynamic inputs for Experience, Skills, Certifications
function buildListFromInputs(containerId) {
  const rows = document.querySelectorAll(`#${containerId} .row input`);
  const items = [];
  rows.forEach(input => {
    const val = input.value.trim();
    if (val) items.push(val);
  });
  if (items.length === 0) return '<p>None provided.</p>';
  return `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
}

function generateCV() {
  const name = document.getElementById('name').value || 'Your Name';
  const email = document.getElementById('email').value || 'your.email@example.com';
  const phone = document.getElementById('phone').value || '1234567890';
  const address = document.getElementById('address').value || 'Your Address';
  const summary = document.getElementById('summary').value || 'Professional summary goes here.';
  const educationTableHTML = buildEducationTableFromInputs();
  const experienceList = buildListFromInputs('experience-rows');
  const skillsList = buildListFromInputs('skills-rows');
  const certList = buildListFromInputs('certifications-rows');

  const photoHtml = photoDataURL
    ? `<img src="${photoDataURL}" alt="Profile Photo" />`
    : `<img src="kabi.jpg" alt="Profile Photo" />`; // Default demo photo

  const preview = `
    <div id="cv">
      ${photoHtml}
      <h1>${name}</h1>
      <h2>Curriculum Vitae</h2>

      <section>
        <h3>Contact Information</h3>
        <p><strong>Email:</strong> ${email} | <strong>Phone:</strong> ${phone} | <strong>Address:</strong> ${address}</p>
      </section>

      <section>
        <h3>Professional Summary</h3>
        <p>${summary.replace(/\n/g, '<br>')}</p>
      </section>

      <section>
        <h3>Education</h3>
        ${educationTableHTML}
      </section>

      <section>
        <h3>Experience</h3>
        ${experienceList}
      </section>

      <section>
        <h3>Skills</h3>
        ${skillsList}
      </section>

      <section>
        <h3>Certifications & Training</h3>
        ${certList}
      </section>
    </div>
  `;

  const cvPreview = document.getElementById('cvPreview');
  cvPreview.innerHTML = preview;
  document.getElementById('downloadBtn').style.display = 'inline-block';
}

function downloadPDF() {
  const cvElement = document.getElementById('cv');
  if (!cvElement) {
    alert('Please generate the CV first!');
    return;
  }
  html2pdf().from(cvElement).set({
    margin: 0.5,
    filename: 'My_CV.pdf',
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  }).save();
}

// Demo data on load
window.onload = () => {
  document.getElementById('name').value = 'Kabiraj Bhatt';
  document.getElementById('email').value = 'bhattkabiraj255@gmail.com';
  document.getElementById('phone').value = '9847546823, 9812753490';
  document.getElementById('address').value = 'Shuklaphanta 01, Kanchanpur';
  document.getElementById('summary').value = `To augment my career in a Government sector where dynamism is the key concern and have enough scope to utilize my qualification along with the proper use of my vision, positive attitude, interpersonal relationship, and communication skills in order to be a part of the best practices and ideas.`;

  // Education demo rows
  document.getElementById('education-rows').innerHTML = '';
  addEducationRow({sno:'1', qualification:'SLC', college:'Baijnath H S School', major:'Account & Economics', year:'2069', division:'First'});
  addEducationRow({sno:'2', qualification:'+2 (Management)', college:'Chandra Surya Bal H S School', major:'Account & Marketing', year:'2073', division:'Second'});
  addEducationRow({sno:'3', qualification:'BBS (TU)', college:'Krishna Baijnath Multiple Campus', major:'Finance', year:'2080', division:'Second'});
  addEducationRow({sno:'4', qualification:'MBS (TU)', college:'Janjyoti Multiple Campus', major:'Finance', year:'Running', division:'-'});
  addEducationRow({sno:'5', qualification:'Diploma in Civil Engineering', college:'Shuklaphanta Polytechnic Institute', major:'-', year:'Running', division:'-'});

  // Experience demo
  document.getElementById('experience-rows').innerHTML = '';
  addExperienceRow(`10 Months as a computer operator at Shuklaphanta 01 office (Data entry for Bhumihin Dalit, Bhumihin Sukumbasi, and Ababasthith Basobasi).`);
  addExperienceRow(`45 Days as a data collector at Shuklaphanta 01 office.`);
  addExperienceRow(`2 Months as a computer operator at Shuklaphanta 04 office (Data entry for Bhumihin Dalit, Bhumihin Sukumbasi, and Ababasthith Basobasi).`);
  addExperienceRow(`1 Month as a data collector for Rastriya Janganana Bibag (2078).`);
  addExperienceRow(`3 Years as a computer operator at Bipin Books & Stationers, Dhangadhi, Kailali, Nepal.`);

  // Skills demo
  document.getElementById('skills-rows').innerHTML = '';
  addSkillRow('Computer Operator');
  addSkillRow('Data Entry');
  addSkillRow('MS Office');
  addSkillRow('Communication');
  addSkillRow('Basic Mobile Repairing');

  // Certifications demo
  document.getElementById('certifications-rows').innerHTML = '';
  addCertificationRow('Operator in Computer Training from CCT Computer Centre.');
  addCertificationRow('Basic Hard & Software course in Mobile Repairing from Raj Technical Institute, Azadpur, Delhi, India.');

  generateCV();
};
