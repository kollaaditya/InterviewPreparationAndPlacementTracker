var API = "http://localhost:5000/api";

// ── Stats ─────────────────────────────────────────────────────────────────────
async function loadStats() {
    const res = await fetch(`${API}/admin/stats`);
    if (!res.ok) return;
    const s = await res.json();
    setT("statStudents",  s.totalStudents);
    setT("statCompanies", s.totalCompanies);
    setT("statAvgCGPA",   s.avgCGPA);
    setT("statMaxPkg",    s.maxPackage + " LPA");
    setT("statHighCGPA",  s.highCGPA);
    setT("statResume",    s.withResume);
    setT("statAvgPkg",    s.avgPackage + " LPA");
}

function cgpaClass(cgpa)
{
    if(cgpa >= 8)
        return "cgpa-high";

    if(cgpa >= 6)
        return "cgpa-mid";

    return "cgpa-low";
}

// ── Students table ────────────────────────────────────────────────────────────
async function loadStudents() {
    const res = await fetch(`${API}/student`);
    if (!res.ok) return;
    const students = await res.json();

    setT("studentCount", students.length);
    setT("highCGPACount", students.filter(s => s.cgpa >= 8).length);
    setT("resumeCount",   students.filter(s => s.resumePath).length);
    const avg = students.length
        ? (students.reduce((a, s) => a + s.cgpa, 0) / students.length).toFixed(1) : "—";
    setT("avgCGPAVal", avg);

    const tbody = document.getElementById("studentTableBody");
    if (!tbody) return;
    tbody.innerHTML = students.length === 0
        ? `<tr><td colspan="7" class="empty-row">No students registered yet.</td></tr>`
        : students.map(s => `
            <tr>
                <td>${s.studentId}</td>
                <td><strong>${s.fullName}</strong></td>
                <td>${s.email}</td>
                <td>${s.college}</td>
                <td>${s.branch}</td>
                <td><span class="badge ${cgpaCls(s.cgpa)}">${s.cgpa}</span></td>
                <td class="act">
                    <button class="bv" onclick="viewStudent(${s.studentId})">👁</button>
                    <button class="be" onclick="editStudent(${s.studentId})">✏️</button>
                    <button class="bd" onclick="deleteStudent(${s.studentId})">🗑</button>
                </td>
            </tr>`).join("");
}

async function viewStudent(id) {
    const res = await fetch(`${API}/student/${id}`);
    if (!res.ok) return;
    const s = await res.json();
    setT("dvName",    s.fullName);   setT("dvEmail",   s.email);
    setT("dvPhone",   s.phone);      setT("dvCollege", s.college);
    setT("dvBranch",  s.branch);     setT("dvCGPA",    s.cgpa);
    setT("dvSkills",  s.skills || "—");
    const dr = document.getElementById("dvResume");
    if (dr) dr.innerHTML = s.resumePath
        ? `<a href="${s.resumePath}" target="_blank">📄 View Resume</a>` : "No resume";
    openModal("modalViewStudent");
}

async function editStudent(id) {
    const res = await fetch(`${API}/student/${id}`);
    if (!res.ok) return;
    const s = await res.json();
    setV("esId",      s.studentId); setV("esName",   s.fullName);
    setV("esPhone",   s.phone);     setV("esCollege", s.college);
    setV("esBranch",  s.branch);    setV("esCGPA",    s.cgpa);
    setV("esSkills",  s.skills);
    openModal("modalEditStudent");
}

async function saveStudent() {
    const id = getV("esId");
    const payload = {
        fullName: getV("esName"),   phone:   getV("esPhone"),
        college:  getV("esCollege"), branch: getV("esBranch"),
        cgpa:     parseFloat(getV("esCGPA")) || 0,
        skills:   getV("esSkills")
    };
    const res = await fetch(`${API}/student/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    const msg = await res.text();
    toast(res.ok ? "✅ " + msg : "❌ " + msg, res.ok);
    if (res.ok) { closeModal("modalEditStudent"); loadStudents(); }
}

async function deleteStudent(id) {
    if (!confirm("Delete this student permanently?")) return;
    const res = await fetch(`${API}/student/${id}`, { method: "DELETE" });
    const msg = await res.text();
    toast(res.ok ? "✅ " + msg : "❌ " + msg, res.ok);
    if (res.ok) loadStudents();
}

function filterStudents() {
    const q = getEl("studentSearch").value.toLowerCase();
    getEls("#studentTableBody tr").forEach(r =>
        r.style.display = r.textContent.toLowerCase().includes(q) ? "" : "none");
}

// ── Companies table ───────────────────────────────────────────────────────────
async function loadCompanies() {
    const res = await fetch(`${API}/company`);
    if (!res.ok) return;
    const companies = await res.json();

    setT("companyCount",   companies.length);
    setT("withCriteriaCount", companies.filter(c => c.eligibilityCriteria).length);
    setT("maxPkgVal", companies.length ? Math.max(...companies.map(c => c.package)) + " LPA" : "—");
    setT("avgPkgVal",  companies.length
        ? (companies.reduce((a, c) => a + c.package, 0) / companies.length).toFixed(1) + " LPA" : "—");

    const tbody = document.getElementById("companyTableBody");
    if (!tbody) return;
    tbody.innerHTML = companies.length === 0
        ? `<tr><td colspan="6" class="empty-row">No companies registered yet.</td></tr>`
        : companies.map(c => `
            <tr>
                <td>${c.companyId}</td>
                <td><strong>${c.companyName}</strong></td>
                <td>${c.email}</td>
                <td><span class="pkg-badge">₹${c.package} LPA</span></td>
                <td class="trunc">${c.eligibilityCriteria || "—"}</td>
                <td class="act">
                    <button class="bv" onclick="viewCompany(${c.companyId})">👁</button>
                    <button class="be" onclick="editCompany(${c.companyId})">✏️</button>
                    <button class="bd" onclick="deleteCompany(${c.companyId})">🗑</button>
                </td>
            </tr>`).join("");
}

async function viewCompany(id) {
    const res = await fetch(`${API}/company/${id}`);
    if (!res.ok) return;
    const c = await res.json();
    setT("dcName",     c.companyName); setT("dcEmail",    c.email);
    setT("dcPackage",  `₹${c.package} LPA`);
    setT("dcCriteria", c.eligibilityCriteria || "—");
    setT("dcJob",      c.jobDescription      || "—");
    openModal("modalViewCompany");
}

async function editCompany(id) {
    const res = await fetch(`${API}/company/${id}`);
    if (!res.ok) return;
    const c = await res.json();
    setV("ecId",       c.companyId);  setV("ecName",     c.companyName);
    setV("ecPackage",  c.package);    setV("ecCriteria", c.eligibilityCriteria);
    setV("ecJob",      c.jobDescription);
    openModal("modalEditCompany");
}

async function saveCompany() {
    const id = getV("ecId");
    const payload = {
        companyName:         getV("ecName"),
        package:             parseFloat(getV("ecPackage")) || 0,
        eligibilityCriteria: getV("ecCriteria"),
        jobDescription:      getV("ecJob")
    };
    const res = await fetch(`${API}/company/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    const msg = await res.text();
    toast(res.ok ? "✅ " + msg : "❌ " + msg, res.ok);
    if (res.ok) { closeModal("modalEditCompany"); loadCompanies(); }
}

async function deleteCompany(id) {
    if (!confirm("Delete this company permanently?")) return;
    const res = await fetch(`${API}/company/${id}`, { method: "DELETE" });
    const msg = await res.text();
    toast(res.ok ? "✅ " + msg : "❌ " + msg, res.ok);
    if (res.ok) loadCompanies();
}

function filterCompanies() {
    const q = getEl("companySearch").value.toLowerCase();
    getEls("#companyTableBody tr").forEach(r =>
        r.style.display = r.textContent.toLowerCase().includes(q) ? "" : "none");
}

// ── Reports ───────────────────────────────────────────────────────────────────
async function loadReports() {
    const res = await fetch(`${API}/admin/reports`);
    if (!res.ok) return;
    const r = await res.json();

    // Summary numbers
    setT("rTotalStudents",   r.totalStudents);
    setT("rTotalCompanies",  r.totalCompanies);
    setT("rAvgCGPA",         r.avgCGPA);
    setT("rWithResume",      r.studentsWithResume);

    // CGPA distribution bars
    const total = r.totalStudents || 1;
    renderBar("barBelow6",   r.cgpaDistribution.below6,   total, "#ef4444");
    renderBar("bar6to7",     r.cgpaDistribution.from6to7, total, "#f59e0b");
    renderBar("bar7to8",     r.cgpaDistribution.from7to8, total, "#3b82f6");
    renderBar("barAbove8",   r.cgpaDistribution.above8,   total, "#22c55e");
    setT("numBelow6",  r.cgpaDistribution.below6);
    setT("num6to7",    r.cgpaDistribution.from6to7);
    setT("num7to8",    r.cgpaDistribution.from7to8);
    setT("numAbove8",  r.cgpaDistribution.above8);

    // Top skills
    const skillsEl = document.getElementById("topSkillsList");
    if (skillsEl) {
        const max = r.topSkills[0]?.count || 1;
        skillsEl.innerHTML = r.topSkills.map(sk => `
            <div class="skill-row">
                <span class="skill-name">${sk.skill}</span>
                <div class="skill-bar-track">
                    <div class="skill-bar-fill" style="width:${(sk.count/max)*100}%"></div>
                </div>
                <span class="skill-count">${sk.count}</span>
            </div>`).join("") || "<p style='color:#94a3b8'>No skill data yet.</p>";
    }

    // Branch distribution
    const branchEl = document.getElementById("branchList");
    if (branchEl) {
        const bmax = r.branchDistribution[0]?.count || 1;
        branchEl.innerHTML = r.branchDistribution.map(b => `
            <div class="skill-row">
                <span class="skill-name">${b.branch || "Unknown"}</span>
                <div class="skill-bar-track">
                    <div class="skill-bar-fill" style="width:${(b.count/bmax)*100}%;background:#7c3aed"></div>
                </div>
                <span class="skill-count">${b.count}</span>
            </div>`).join("") || "<p style='color:#94a3b8'>No branch data yet.</p>";
    }

    // Package distribution
    renderBar("pkgBelow5",  r.packageDistribution.below5,    r.totalCompanies || 1, "#ef4444");
    renderBar("pkg5to10",   r.packageDistribution.from5to10,  r.totalCompanies || 1, "#f59e0b");
    renderBar("pkg10to15",  r.packageDistribution.from10to15, r.totalCompanies || 1, "#3b82f6");
    renderBar("pkgAbove15", r.packageDistribution.above15,    r.totalCompanies || 1, "#22c55e");
    setT("numPkgBelow5",  r.packageDistribution.below5);
    setT("numPkg5to10",   r.packageDistribution.from5to10);
    setT("numPkg10to15",  r.packageDistribution.from10to15);
    setT("numPkgAbove15", r.packageDistribution.above15);
}

function renderBar(id, value, total, color) {
    const el = document.getElementById(id);
    if (!el) return;
    const pct = total > 0 ? Math.round((value / total) * 100) : 0;
    el.style.width      = pct + "%";
    el.style.background = color;
    el.title            = `${value} (${pct}%)`;
}

// ── Section navigation ────────────────────────────────────────────────────────
function showSection(name, el) {
    document.querySelectorAll(".main > div[id^='sec-']").forEach(d => d.style.display = "none");
    document.getElementById("sec-" + name).style.display = "block";
    document.querySelectorAll(".sidebar-item").forEach(i => i.classList.remove("active"));
    if (el) el.classList.add("active");

    if (name === "students")  loadStudents();
    if (name === "companies") loadCompanies();
    if (name === "reports")   loadReports();
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function openModal(id)  { document.getElementById(id).style.display = "flex"; }
function closeModal(id) { document.getElementById(id).style.display = "none"; }
function cgpaCls(v)     { return v >= 8 ? "cgpa-high" : v >= 6 ? "cgpa-mid" : "cgpa-low"; }

function toast(msg, ok = true) {
    let t = document.getElementById("toast");
    if (!t) {
        t = document.createElement("div"); t.id = "toast";
        Object.assign(t.style, {
            position:"fixed", bottom:"28px", right:"28px", padding:"13px 22px",
            borderRadius:"10px", color:"white", fontWeight:"600",
            fontSize:"14px", zIndex:"9999", transition:"opacity 0.4s",
            fontFamily:"'Poppins',sans-serif"
        });
        document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.background = ok ? "#22c55e" : "#ef4444";
    t.style.opacity = "1";
    setTimeout(() => t.style.opacity = "0", 3000);
}

function setT(id, v)  { const e = document.getElementById(id); if (e) e.textContent = v ?? ""; }
function setV(id, v)  { const e = document.getElementById(id); if (e) e.value = v ?? ""; }
function getV(id)     { return document.getElementById(id)?.value || ""; }
function getEl(id)    { return document.getElementById(id); }
function getEls(sel)  { return document.querySelectorAll(sel); }
