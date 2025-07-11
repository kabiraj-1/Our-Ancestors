let photoDataURL = '';

// Dynamic input row functions
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

function addTextRow(containerId, placeholder, value = '') {
  const container = document.getElementById(containerId);
  const row = document.createElement('div');
  row.classList.add('row');
  row.innerHTML = `
    <input type="text" placeholder="${placeholder}" value="${value}" />
    <button type="button" class="remove-btn" onclick="removeRow(this)">✖</button>
  `;
  container.appendChild(row);
}

function removeRow(button) {
  button.parentElement.remove();
}

// Add row buttons
document.getElementById('add-edu-btn').addEventListener('click', () => addEducationRow());
document.getElementById('add-exp-btn').addEventListener('click', () => addTextRow('experience-rows', 'Experience'));
document.getElementById('add-skill-btn').addEventListener('click', () => addTextRow('skills-rows', 'Skill'));
document.getElementById('add-cert-btn').addEventListener('click', () => addTextRow('certifications-rows', 'Certification/Training'));

// Handle photo
document.getElementById('photo').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      photoDataURL = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

function buildEducationTableFromInputs() {
  const rows = document.querySelectorAll('#education-rows .row');
  if (!rows.length) return '<p>No education details provided.</p>';

  let table = `
    <table>
      <thead>
        <tr>
          <th>S. No.</th>
          <th>Academic Qualification</th>
          <th>College/School Name</th>
          <th>Major Subject</th>
          <th>Passed Year</th>
          <th>Division</th>
        </tr>
      </thead>
      <tbody>
  `;

  rows.forEach(row => {
    const cells = [
      row.querySelector('input[name="sno"]').value.trim(),
      row.querySelector('input[name="qualification"]').value.trim(),
      row.querySelector('input[name="college"]').value.trim(),
      row.querySelector('input[name="major"]').value.trim(),
      row.querySelector('input[name="year"]').value.trim(),
      row.querySelector('input[name="division"]').value.trim(),
    ];

    if (cells.some(cell => cell !== '')) {
      table += '<tr>' + cells.map(cell => `<td>${cell || '-'}</td>`).join('') + '</tr>';
    }
  });

  table += '</tbody></table>';
  return table;
}

function buildListFromInputs(containerId) {
  const rows = document.querySelectorAll(`#${containerId} .row input`);
  const items = Array.from(rows).map(input => input.value.trim()).filter(Boolean);
  return items.length ? `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>` : '<p>None provided.</p>';
}

function generateCV() {
  const name = document.getElementById('name').value || 'Your Name';
  const email = document.getElementById('email').value || 'your.email@example.com';
  const phone = document.getElementById('phone').value || '1234567890';
  const address = document.getElementById('address').value || 'Your Address';
  const summary = document.getElementById('summary').value || 'Professional summary goes here.';
  const educationHTML = buildEducationTableFromInputs();
  const experienceHTML = buildListFromInputs('experience-rows');
  const skillsHTML = buildListFromInputs('skills-rows');
  const certHTML = buildListFromInputs('certifications-rows');

  const photoHtml = photoDataURL
    ? `<div id="photo-container"><img src="${photoDataURL}" alt="Profile Photo" /></div>`
    : `<div id="photo-container"><img src="kabi.jpg" alt="Demo Photo" /></div>`;

  const cvHTML = `
    <div id="cv">
      ${photoHtml}
      <h1>${name}</h1>
      <h2>Curriculum Vitae</h2>

      <section>
        <h3>Contact Information</h3>
        <p><strong>Email:</strong> ${email}<br><strong>Phone:</strong> ${phone}<br><strong>Address:</strong> ${address}</p>
      </section>

      <section>
        <h3>Professional Summary</h3>
        <p>${summary.replace(/\\n/g, '<br>')}</p>
      </section>

      <section>
        <h3>Education</h3>
        ${educationHTML}
      </section>

      <section>
        <h3>Experience</h3>
        ${experienceHTML}
      </section>

      <section>
        <h3>Skills</h3>
        ${skillsHTML}
      </section>

      <section>
        <h3>Certifications & Training</h3>
        ${certHTML}
      </section>
    </div>
  `;

  document.getElementById('cvPreview').innerHTML = cvHTML;
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

// Load Demo Data Automatically
window.onload = () => {
  document.getElementById('name').value = 'Kabiraj Bhatt';
  document.getElementById('email').value = 'bhattkabiraj255@gmail.com';
  document.getElementById('phone').value = '9847546823, 9812753490';
  document.getElementById('address').value = 'Shuklaphanta 01, Kanchanpur';
  document.getElementById('summary').value = 'To augment my career in a Government sector where dynamism is the key concern...';

  addEducationRow({
    sno: '1',
    qualification: 'SLC',
    college: 'Baijnath H S School',
    major: 'Account & Economics',
    year: '2069',
    division: 'First'
  });
  addEducationRow({
    sno: '2',
    qualification: '+2 (Management)',
    college: 'Chandra Surya Bal H S School',
    major: 'Account & Marketing',
    year: '2073',
    division: 'Second'
  });

  addTextRow('experience-rows', 'Experience', '3 Years at Bipin Books & Stationers');
  addTextRow('skills-rows', 'Skill', 'MS Office');
  addTextRow('certifications-rows', 'Certification', 'Computer Training - CCT Institute');

  generateCV();
};
