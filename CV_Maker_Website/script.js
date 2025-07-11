let photoDataURL = "";

document.getElementById("photo").addEventListener("change", function (e) {
  const reader = new FileReader();
  reader.onload = function (event) {
    photoDataURL = event.target.result;
  };
  reader.readAsDataURL(e.target.files[0]);
});

function removeRow(button) {
  button.parentElement.remove();
}

function addEducationRow(data = {}) {
  const container = document.getElementById("education-rows");
  const row = document.createElement("div");
  row.className = "row";
  row.innerHTML = `
    <input name="sno" placeholder="S.No" value="${data.sno || ''}" />
    <input name="qualification" placeholder="Qualification" value="${data.qualification || ''}" />
    <input name="college" placeholder="College" value="${data.college || ''}" />
    <input name="major" placeholder="Major" value="${data.major || ''}" />
    <input name="year" placeholder="Year" value="${data.year || ''}" />
    <input name="division" placeholder="Division" value="${data.division || ''}" />
    <button type="button" class="remove-btn" onclick="removeRow(this)">✖</button>
  `;
  container.appendChild(row);
}

function addExperienceRow(text = "") {
  const container = document.getElementById("experience-rows");
  const row = document.createElement("div");
  row.className = "row";
  row.innerHTML = `
    <input value="${text}" placeholder="Experience Detail" />
    <button type="button" class="remove-btn" onclick="removeRow(this)">✖</button>
  `;
  container.appendChild(row);
}

function addSkillRow(text = "") {
  const container = document.getElementById("skills-rows");
  const row = document.createElement("div");
  row.className = "row";
  row.innerHTML = `
    <input value="${text}" placeholder="Skill" />
    <button type="button" class="remove-btn" onclick="removeRow(this)">✖</button>
  `;
  container.appendChild(row);
}

function addCertificationRow(text = "") {
  const container = document.getElementById("certifications-rows");
  const row = document.createElement("div");
  row.className = "row";
  row.innerHTML = `
    <input value="${text}" placeholder="Certification" />
    <button type="button" class="remove-btn" onclick="removeRow(this)">✖</button>
  `;
  container.appendChild(row);
}

// Add button event
document.getElementById("add-edu-btn").onclick = () => addEducationRow();
document.getElementById("add-exp-btn").onclick = () => addExperienceRow();
document.getElementById("add-skill-btn").onclick = () => addSkillRow();
document.getElementById("add-cert-btn").onclick = () => addCertificationRow();

function buildListFromInputs(containerId) {
  const rows = document.querySelectorAll(`#${containerId} .row input`);
  const items = [];
  rows.forEach(input => {
    const val = input.value.trim();
    if (val) items.push(val);
  });
  return items.length > 0 ? `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>` : "<p>None provided.</p>";
}

function buildEducationTable() {
  const rows = document.querySelectorAll("#education-rows .row");
  if (rows.length === 0) return "<p>No education added.</p>";
  let html = "<table><thead><tr><th>S.No</th><th>Qualification</th><th>College</th><th>Major</th><th>Year</th><th>Division</th></tr></thead><tbody>";
  rows.forEach(row => {
    const values = [...row.querySelectorAll("input")].map(input => input.value || "-");
    html += `<tr>${values.map(val => `<td>${val}</td>`).join("")}</tr>`;
  });
  html += "</tbody></table>";
  return html;
}

function generateCV() {
  const name = document.getElementById("name").value || "Your Name";
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const summary = document.getElementById("summary").value;

  const img = photoDataURL ? `<img src="${photoDataURL}" alt="Photo" />` : `<img src="kabi.jpg" alt="Demo Photo" />`;

  const html = `
    <div id="cv">
      ${img}
      <h1>${name}</h1>
      <h2>Curriculum Vitae</h2>
      <p><strong>Email:</strong> ${email} | <strong>Phone:</strong> ${phone} | <strong>Address:</strong> ${address}</p>
      <h3>Professional Summary</h3><p>${summary}</p>
      <h3>Education</h3>${buildEducationTable()}
      <h3>Experience</h3>${buildListFromInputs("experience-rows")}
      <h3>Skills</h3>${buildListFromInputs("skills-rows")}
      <h3>Certifications & Training</h3>${buildListFromInputs("certifications-rows")}
    </div>
  `;

  document.getElementById("cvPreview").innerHTML = html;
  document.getElementById("downloadBtn").style.display = "inline-block";
}

function downloadPDF() {
  const element = document.getElementById("cv");
  if (!element) return alert("Generate the CV first!");
  const opt = {
    margin: 0.5,
    filename: "My_CV.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
  };
  html2pdf().set(opt).from(element).save();
}
