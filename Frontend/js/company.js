var API = "http://localhost:5000/api";

// ── Load company profile into dashboard form ───────────────────────────────────
async function loadCompanyProfile() {
    const id = sessionStorage.getItem("userId");
    if (!id) return;

    const res = await fetch(`${API}/company/${id}`);
    if (!res.ok) return;
    const c = await res.json();

    // Profile form fields (unique IDs: cp-*)
    setValue("cp-name", c.companyName);
    setValue("cp-email", c.email);
    setValue("cp-package", c.package);
    setValue("cp-criteria", c.eligibilityCriteria);
    setValue("cp-jobdesc", c.jobDescription);

    // Stat display elements
    setT("statCompanyName", c.companyName);
    setT("statEmail", c.email);
    setT("statPackage", `₹${c.package} LPA`);
    setT("statCriteria", c.eligibilityCriteria || "—");

    // Overview header
    setT("overviewName", c.companyName);
    setT("overviewPackage", `₹${c.package} LPA`);
    setT("overviewCriteria", c.eligibilityCriteria || "Not set");
    setT("overviewJob", c.jobDescription
        ? c.jobDescription.substring(0, 120) + (c.jobDescription.length > 120 ? "…" : "")
        : "No job description set.");
}

// ── Save company profile ───────────────────────────────────────────────────────
async function updateCompanyProfile() {
    const id = sessionStorage.getItem("userId");
    const payload = {
        companyName: getVal("cp-name"),
        package: parseFloat(getVal("cp-package")) || 0,
        eligibilityCriteria: getVal("cp-criteria"),
        jobDescription: getVal("cp-jobdesc")
    };

    const res = await fetch(`${API}/company/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const msg = await res.text();
    showToast(res.ok ? "✅ " + msg : "❌ " + msg, res.ok);
    if (res.ok) loadCompanyProfile();
}

// ── Load eligible students ─────────────────────────────────────────────────────
async function loadEligibleStudents() {
    const id = sessionStorage.getItem("userId");
    const res = await fetch(`${API}/company/${id}/eligible-students`);
    if (!res.ok) return;

    const students = await res.json();
    const container = document.getElementById("eligibleList");
    const countEl = document.getElementById("eligibleCount");
    if (!container) return;

    if (countEl) countEl.textContent = students.length;

    if (students.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:48px 0;color:#94a3b8;">
                <div style="font-size:48px;margin-bottom:12px;">🔍</div>
                <p style="font-size:15px;font-weight:500;">No eligible students found.</p>
                <small>Set your Eligibility Criteria in the Profile section.<br>
                Format: <code>CGPA>=7.0,Skills:Java</code></small>
            </div>`;
        return;
    }

    container.innerHTML = students.map(s => `
        <div class="student-card">
            <div class="student-avatar">${s.fullName.charAt(0).toUpperCase()}</div>
            <div class="student-info">
                <div class="student-name">${s.fullName}</div>
                <div class="student-meta">${s.college} &bull; ${s.branch}</div>
                <div class="student-meta">${s.email}</div>
            </div>
            <div class="student-right">
                <span class="cgpa-badge ${cgpaClass(s.cgpa)}">${s.cgpa} CGPA</span>
                <div class="skill-wrap">
                    ${(s.skills || "").split(",").filter(x => x.trim())
            .map(sk => `<span class="skill-tag">${sk.trim()}</span>`).join("")}
                </div>
                ${s.resumePath
    ? `<a class="resume-link"
          href="http://localhost:5000${s.resumePath}"
          target="_blank">
          📄 View Resume
       </a>`
    : `<span class="no-resume">No Resume</span>`}
            </div>
        </div>`).join("");
}

// ── Admin: load all companies into table ───────────────────────────────────────
async function loadAllCompanies() {
    const res = await fetch(`${API}/company`);
    if (!res.ok) return;
    const companies = await res.json();
    const tbody = document.getElementById("companyTableBody");
    if (!tbody) return;

    tbody.innerHTML = companies.length === 0
        ? `<tr><td colspan="6" style="text-align:center;color:#94a3b8;padding:40px;">No companies registered yet.</td></tr>`
        : companies.map(c => `
            <tr>
                <td>${c.companyId}</td>
                <td><strong>${c.companyName}</strong></td>
                <td>${c.email}</td>
                <td><span class="pkg-badge">₹${c.package} LPA</span></td>
                <td>${c.eligibilityCriteria || "—"}</td>
                <td class="action-cell">
                    <button class="btn-view"   onclick="viewCompany(${c.companyId})">👁 View</button>
                    <button class="btn-edit"   onclick="openEditModal(${c.companyId})">✏️ Edit</button>
                    <button class="btn-delete" onclick="deleteCompany(${c.companyId})">🗑 Delete</button>
                </td>
            </tr>`).join("");

    setT("totalCount", companies.length);
    setT("withCriteria", companies.filter(c => c.eligibilityCriteria).length);
    setT("highPackage", companies.length ? Math.max(...companies.map(c => c.package)) + " LPA" : "—");
    setT("avgPackage", companies.length
        ? (companies.reduce((a, c) => a + c.package, 0) / companies.length).toFixed(1) + " LPA" : "—");
}

// ── Admin: view company details modal ─────────────────────────────────────────
async function viewCompany(id) {
    const res = await fetch(`${API}/company/${id}`);
    if (!res.ok) return;
    const c = await res.json();
    setT("detailName", c.companyName);
    setT("detailEmail", c.email);
    setT("detailPackage", `₹${c.package} LPA`);
    setT("detailCriteria", c.eligibilityCriteria || "—");
    setT("detailJob", c.jobDescription || "—");
    openModal("viewModal");
}

// ── Admin: open edit modal ─────────────────────────────────────────────────────
async function openEditModal(id) {
    const res = await fetch(`${API}/company/${id}`);
    if (!res.ok) return;
    const c = await res.json();
    setValue("editId", c.companyId);
    setValue("editName", c.companyName);
    setValue("editPackage", c.package);
    setValue("editCriteria", c.eligibilityCriteria);
    setValue("editJob", c.jobDescription);
    openModal("editModal");
}

// ── Admin: save edit ───────────────────────────────────────────────────────────
async function saveEdit() {
    const id = getVal("editId");
    const payload = {
        companyName: getVal("editName"),
        package: parseFloat(getVal("editPackage")) || 0,
        eligibilityCriteria: getVal("editCriteria"),
        jobDescription: getVal("editJob")
    };
    const res = await fetch(`${API}/company/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    const msg = await res.text();
    showToast(res.ok ? "✅ " + msg : "❌ " + msg, res.ok);
    if (res.ok) { closeModal("editModal"); loadAllCompanies(); }
}

// ── Admin: delete ──────────────────────────────────────────────────────────────
async function deleteCompany(id) {
    if (!confirm("Delete this company? This cannot be undone.")) return;
    const res = await fetch(`${API}/company/${id}`, { method: "DELETE" });
    const msg = await res.text();
    showToast(res.ok ? "✅ " + msg : "❌ " + msg, res.ok);
    if (res.ok) loadAllCompanies();
}

// ── Admin: search ──────────────────────────────────────────────────────────────
function filterCompanies() {
    const q = getVal("searchInput").toLowerCase();
    document.querySelectorAll("#companyTableBody tr").forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(q) ? "" : "none";
    });
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function cgpaClass(v) { return v >= 8 ? "cgpa-high" : v >= 6 ? "cgpa-mid" : "cgpa-low"; }
function openModal(id) { document.getElementById(id).style.display = "flex"; }
function closeModal(id) { document.getElementById(id).style.display = "none"; }
function setT(id, val) { const e = document.getElementById(id); if (e) e.textContent = val ?? ""; }
function getVal(id) { return document.getElementById(id)?.value ?? ""; }
function setValue(id, val) { const e = document.getElementById(id); if (e) e.value = val ?? ""; }

function showToast(msg, success = true) {
    let t = document.getElementById("toast");
    if (!t) {
        t = document.createElement("div"); t.id = "toast";
        Object.assign(t.style, {
            position: "fixed", bottom: "28px", right: "28px", padding: "13px 22px",
            borderRadius: "10px", color: "white", fontWeight: "600",
            fontSize: "14px", zIndex: "9999", transition: "opacity 0.4s",
            fontFamily: "'Poppins',sans-serif"
        });
        document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.background = success ? "#22c55e" : "#ef4444";
    t.style.opacity = "1";
    setTimeout(() => { t.style.opacity = "0"; }, 3000);
}

function viewResume(resumePath)
{
    if(!resumePath)
    {
        alert("Resume Not Uploaded");
        return;
    }

    window.open(
        "http://localhost:5000" + resumePath,
        "_blank"
    );
}