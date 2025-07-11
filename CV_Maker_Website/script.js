let photoDataURL = "";

function removeRow(button) {
  button.parentElement.remove();
}

function addEducationRow(data = {}) {
  const container = document.getElementById("education-rows");
  const row = document.createElement("div");
  row.className = "row";
  row.innerHTML = `
    <input name="sno" placeholder="S. No." value="${data.sno || ''}" />
    <input name="qualification" placeholder="Qualification" value="${data.qualification || ''}" />
    <input name="college" placeholder="College" value="${data.college || ''}" />
    <input name="major" placeholder="Major" value="${data.major || ''}" />
    <input name="year" placeholder="Year" value="${data.year || ''}" />
    <input name="division" placeholder="Division" value="${data.division || ''}" />
    <button type="button" class="remove-btn" onclick="removeRow(this)">✖</button>
  `;
  container.appendChild(row);
}

function addExperienceRow(text = '') {
  const container = document.getElementById("experience-rows");
  const row = document.createElement("div");
  row.className = "row";
  row.innerHTML = `
    <input value="${text}" placeholder="Experience Detail" />
    <button type="button" class="remove-btn" onclick="removeRow(this)">✖</button>
  `;
  container.appendChild(row);
}

function addSkillRow(text = '') {
  const container = document.getElementById("skills-rows");
  const row = document.createElement("div");
  row.className = "row";
  row.innerHTML = `
    <input value="${text}" placeholder="Skill" />
    <button type="button" class="remove-btn" onclick="removeRow(this)">✖</button>
  `;
  container.appendChild(row);
}

function addCertificationRow(text = '') {
  const container = document.getElementById("certifications-rows");
  const row = document.createElement("div");
  row.className = "row";
  row.innerHTML = `
    <input value="${text}" placeholder="Certification / Training" />
    <button type="button" class="remove-btn" onclick="removeRow(this)">✖</button>
  `;
  container.appendChild(row);
}

document.getElementById("add-edu-btn").onclick = () => addEducationRow();
document.getElementById("add-exp-btn").onclick = () => addExperienceRow();
document.getElementById("add-skill-btn").onclick = () => addSkillRow();
document.getElementById("add-cert-btn").onclick = () => addCertificationRow();

document.getElementById("photo").addEventListener("change", function(event) {
  const reader = new FileReader();
  reader.onload = function(e) {
    photoDataURL = e.target.result;
  };
  reader.readAsDataURL(event.target.files[0]);
});

function buildEducationTable() {
  const rows = document.querySelectorAll("#education-rows .row");
  if (rows.length === 0) return "<p>No Education Provided.</p>";

  let html = `<table><thead><tr>
    <th>S.No.</th><th>Qualification</th><th>College</th><th>Major</th><th>Year</th><th>Division</th>
  </tr></thead><tbody>`;
  rows.forEach(row => {
    const inputs = row.querySelectorAll("input");
    html += "<tr>";
    inputs.forEach(input => html += `<td>${input.value || '-'}</td>`);
    html += "</tr>";
  });
  html += "</tbody></table>";
  return html;
}

function buildList(id) {
  const inputs = document.querySelectorAll(`#${id} .row input`);
  const list = Array.from(inputs).map(input => `<li>${input.value}</li>`).join('');
  return list ? `<ul>${list}</ul>` : '<p>None provided.</p>';
}

function generateCV() {
  const name = document.getElementById("name").value || "Your Name";
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const summary = document.getElementById("summary").value;

  const photoHTML = photoDataURL ? `<img src="${photoDataURL}" alt="Profile Photo">` : `<img src="kabi.jpg" alt="Demo Photo">`;

  const html = `
    <div id="cv">
      ${photoHTML}
      <h1>${name}</h1>
      <h2>Curriculum Vitae</h2>
      <p><strong>Email:</strong> ${email} | <strong>Phone:</strong> ${phone} | <strong>Address:</strong> ${address}</p>
      <h3>Professional Summary</h3><p>${summary}</p>
      <h3>Education</h3>${buildEducationTable()}
      <h3>Experience</h3>${buildList("experience-rows")}
      <h3>Skills</h3>${buildList("skills-rows")}
      <h3>Certifications & Training</h3>${buildList("certifications-rows")}
    </div>
  `;
  document.getElementById("cvPreview").innerHTML = html;
  document.getElementById("downloadBtn").style.display = "inline-block";
}

function downloadPDF() {
  const element = document.getElementById("cv");
  if (!element) return alert("Generate CV first!");
  setTimeout(() => {
    html2pdf().from(element).save("My_CV.pdf");
  }, 500);
}
