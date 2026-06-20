console.log("Student JS Loaded");

var API = "http://localhost:5000/api";

// ── Load profile from API into all form fields ─────────────────────────────────
async function loadProfile() {
    const id = sessionStorage.getItem("userId");
    if (!id) return;

    const res = await fetch(`${API}/student/${id}`);
    if (!res.ok) return;
    const s = await res.json();

    // Profile section fields
    setValue("prof-fullName", s.fullName);
    setValue("prof-email",    s.email);
    setValue("prof-phone",    s.phone);
    setValue("prof-college",  s.college);
    setValue("prof-branch",   s.branch);
    setValue("prof-cgpa",     s.cgpa);
    setValue("prof-skills",   s.skills);

    // Skills section field
    setValue("skills-input",  s.skills);

    // CGPA section field
    setValue("cgpa-input",    s.cgpa);

    // CGPA visual
    const bar     = document.getElementById("cgpaBar");
    const cgpaVal = document.getElementById("cgpaValue");
    if (bar)     bar.style.width      = `${(s.cgpa / 10) * 100}%`;
    if (cgpaVal) cgpaVal.textContent  = s.cgpa || "—";

    // Stat cards
    setT("statCGPA",   s.cgpa   || "—");
    const skCount = s.skills ? s.skills.split(",").filter(x => x.trim()).length : 0;
    setT("statSkills", skCount);
    setT("statResume", s.resumePath ? "✅" : "❌");

    // Skill badges
    renderSkillBadges(s.skills);

    // Readiness
    renderPlacementReadiness(s.cgpa, s.skills);

    // Resume link
    const rl = document.getElementById("resumeLink");
    if (rl && s.resumePath) {
    rl.href = "http://localhost:5000" + s.resumePath;
    rl.style.display = "inline";
}
}

// ── Build update payload from whichever section is active ─────────────────────
function buildStudentPayload() {
    // Always use profile section as the master values, then overlay the
    // dedicated section inputs so single-field saves still work correctly.
    return {
        fullName: getVal("prof-fullName"),
        phone:    getVal("prof-phone"),
        college:  getVal("prof-college"),
        branch:   getVal("prof-branch"),
        cgpa:     parseFloat(getVal("cgpa-input")   || getVal("prof-cgpa"))  || 0,
        skills:   getVal("skills-input") || getVal("prof-skills")
    };
}

// ── Update full profile ────────────────────────────────────────────────────────
async function updateProfile() {
    const id      = sessionStorage.getItem("userId");
    const payload = buildStudentPayload();

    const res = await fetch(`${API}/student/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload)
    });

    const msg = await res.text();
    showToast(res.ok ? "✅ " + msg : "❌ " + msg, res.ok);
    if (res.ok) loadProfile();
}

// ── Update only CGPA ──────────────────────────────────────────────────────────
async function updateCGPA() {
    const id  = sessionStorage.getItem("userId");
    const val = parseFloat(getVal("cgpa-input"));
    if (isNaN(val) || val < 0 || val > 10) {
        showToast("❌ Enter a valid CGPA between 0 and 10", false);
        return;
    }
    const payload = buildStudentPayload();
    payload.cgpa  = val;

    const res = await fetch(`${API}/student/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload)
    });
    const msg = await res.text();
    showToast(res.ok ? "✅ " + msg : "❌ " + msg, res.ok);
    if (res.ok) loadProfile();
}

// ── Update only Skills ────────────────────────────────────────────────────────
async function updateSkills() {
    const id      = sessionStorage.getItem("userId");
    const payload = buildStudentPayload();
    payload.skills = getVal("skills-input");

    const res = await fetch(`${API}/student/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload)
    });
    const msg = await res.text();
    showToast(res.ok ? "✅ " + msg : "❌ " + msg, res.ok);
    if (res.ok) loadProfile();
}

// ── Upload resume ──────────────────────────────────────────────────────────────
async function uploadResume() {
    const id   = sessionStorage.getItem("userId");
    const file = document.getElementById("resumeFile")?.files[0];
    if (!file) { showToast("❌ Select a file first", false); return; }

    const form = new FormData();
    form.append("file", file);

    const res = await fetch(`${API}/student/${id}/resume`, {
        method: "POST",
        body:   form
    });

    const data = await res.json().catch(() => ({}));
    showToast(res.ok ? "✅ " + (data.message || "Resume uploaded") : "❌ Upload failed", res.ok);
    if (res.ok) loadProfile();
}

// ── Render skill badges ────────────────────────────────────────────────────────
function renderSkillBadges(skills) {
    const container = document.getElementById("skillBadges");
    if (!container) return;
    const list = (skills || "").split(",").map(s => s.trim()).filter(Boolean);
    container.innerHTML = list.length
        ? list.map(s => `<span class="skill-badge">${s}</span>`).join("")
        : `<p style="color:#94a3b8;font-size:14px;">No skills added yet.</p>`;
}

// ── Render placement readiness ────────────────────────────────────────────────
function renderPlacementReadiness(cgpa, skills) {
    const skillCount = (skills || "").split(",").filter(s => s.trim()).length;
    const cgpaScore  = Math.min((cgpa / 10) * 60, 60);
    const skillScore = Math.min(skillCount * 5, 40);
    const total      = Math.round(cgpaScore + skillScore);
    const color      = total >= 75 ? "#22c55e" : total >= 50 ? "#f59e0b" : "#ef4444";
    const label      = total >= 75 ? "Ready 🎉" : total >= 50 ? "Improving 📈" : "Needs Work 💪";

    const circle = document.getElementById("readinessScore");
    if (circle) {
        circle.style.background = color;
        circle.innerHTML = `<div style="font-size:28px;font-weight:800">${total}%</div>
                            <div class="readiness-lbl">${label}</div>`;
    }

    setT("statReadiness", total + "%");
    setT("r-cgpa",        cgpa);
    setT("r-skills",      skillCount);
    setT("r-resume",      document.getElementById("resumeLink")?.style.display !== "none" ? "✅" : "❌");
    setT("r-tip",         total < 50 ? "Add Skills" : total < 75 ? "Raise CGPA" : "Apply Now!");

    const remark = document.getElementById("cgpaRemark");
    if (remark) remark.textContent =
        cgpa >= 8 ? "🌟 Excellent — You're highly competitive!"
        : cgpa >= 6 ? "👍 Good — Keep improving!"
        : "⚠️ Below average — Focus on studies.";
}

function cgpaClass(cgpa) {
    return cgpa >= 8 ? "cgpa-high" : cgpa >= 6 ? "cgpa-mid" : "cgpa-low";
}

// ── Shared helpers ─────────────────────────────────────────────────────────────
function setT(id, val)     { const e = document.getElementById(id); if (e) e.textContent = val ?? ""; }
function getVal(id)        { return document.getElementById(id)?.value ?? ""; }
function setValue(id, val) { const e = document.getElementById(id); if (e) e.value = val ?? ""; }
function openModal(id)     { document.getElementById(id).style.display = "flex"; }
function closeModal(id)    { document.getElementById(id).style.display = "none"; }

function showToast(msg, success = true) {
    let t = document.getElementById("toast");
    if (!t) {
        t = document.createElement("div");
        t.id = "toast";
        Object.assign(t.style, {
            position:"fixed", bottom:"28px", right:"28px",
            padding:"13px 22px", borderRadius:"10px", color:"white",
            fontWeight:"600", fontSize:"14px", zIndex:"9999",
            transition:"opacity 0.4s", fontFamily:"'Poppins',sans-serif"
        });
        document.body.appendChild(t);
    }
    t.textContent      = msg;
    t.style.background = success ? "#22c55e" : "#ef4444";
    t.style.opacity    = "1";
    setTimeout(() => { t.style.opacity = "0"; }, 3000);
}

// ── Admin student table helpers (used by studentmanage.html) ──────────────────
async function loadAllStudents() {
    const res = await fetch(`${API}/student`);
    if (!res.ok) return;
    const students = await res.json();
    const tbody = document.getElementById("studentTableBody");
    if (!tbody) return;

    tbody.innerHTML = students.length === 0
        ? `<tr><td colspan="7" style="text-align:center;color:#94a3b8;padding:40px;">No students registered yet.</td></tr>`
        : students.map(s => `
            <tr>
                <td>${s.studentId}</td>
                <td><strong>${s.fullName}</strong></td>
                <td>${s.email}</td>
                <td>${s.college}</td>
                <td>${s.branch}</td>
                <td><span class="cgpa-badge ${cgpaClass(s.cgpa)}">${s.cgpa}</span></td>
                <td class="action-cell">
                    <button class="btn-view"   onclick="viewStudent(${s.studentId})">👁 View</button>
                    <button class="btn-edit"   onclick="openEditModal(${s.studentId})">✏️ Edit</button>
                    <button class="btn-delete" onclick="deleteStudent(${s.studentId})">🗑 Delete</button>
                </td>
            </tr>`).join("");

    setT("totalCount",  students.length);
    setT("highCGPA",    students.filter(s => s.cgpa >= 8).length);
    setT("withResume",  students.filter(s => s.resumePath).length);
    const avg = students.length
        ? (students.reduce((a, s) => a + s.cgpa, 0) / students.length).toFixed(1) : "—";
    setT("avgCGPA", avg);
}

async function viewStudent(id) {
    const res = await fetch(`${API}/student/${id}`);
    if (!res.ok) return;
    const s = await res.json();
    setT("detailName",    s.fullName);
    setT("detailEmail",   s.email);
    setT("detailPhone",   s.phone);
    setT("detailCollege", s.college);
    setT("detailBranch",  s.branch);
    setT("detailCGPA",    s.cgpa);
    setT("detailSkills",  s.skills || "—");
    const dl = document.getElementById("detailResume");
    if (dl) dl.innerHTML = s.resumePath
    ? `<a href="http://localhost:5000${s.resumePath}" target="_blank">
         📄 View Resume
       </a>`
    : "No resume uploaded";
}

async function openEditModal(id) {
    const res = await fetch(`${API}/student/${id}`);
    if (!res.ok) return;
    const s = await res.json();
    setValue("editId",      s.studentId);
    setValue("editName",    s.fullName);
    setValue("editPhone",   s.phone);
    setValue("editCollege", s.college);
    setValue("editBranch",  s.branch);
    setValue("editCGPA",    s.cgpa);
    setValue("editSkills",  s.skills);
    openModal("editModal");
}

async function saveEdit() {
    const id = getVal("editId");
    const payload = {
        fullName: getVal("editName"),
        phone:    getVal("editPhone"),
        college:  getVal("editCollege"),
        branch:   getVal("editBranch"),
        cgpa:     parseFloat(getVal("editCGPA")) || 0,
        skills:   getVal("editSkills")
    };
    const res = await fetch(`${API}/student/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    const msg = await res.text();
    showToast(res.ok ? "✅ " + msg : "❌ " + msg, res.ok);
    if (res.ok) { closeModal("editModal"); loadAllStudents(); }
}

async function deleteStudent(id) {
    if (!confirm("Delete this student? This cannot be undone.")) return;
    const res = await fetch(`${API}/student/${id}`, { method: "DELETE" });
    const msg = await res.text();
    showToast(res.ok ? "✅ " + msg : "❌ " + msg, res.ok);
    if (res.ok) loadAllStudents();
}

function filterStudents() {
    const q = getVal("searchInput").toLowerCase();
    document.querySelectorAll("#studentTableBody tr").forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(q) ? "" : "none";
    });
}
