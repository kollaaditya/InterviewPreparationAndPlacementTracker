var API = "http://localhost:5000/api";

// ── Shared helpers ─────────────────────────────────────────────────────────────
function setT(id, val)     { const e = document.getElementById(id); if (e) e.textContent = val ?? ""; }
function getVal(id)        { return document.getElementById(id)?.value ?? ""; }
function setValue(id, val) { const e = document.getElementById(id); if (e) e.value = val ?? ""; }
function openModal(id)     { document.getElementById(id).style.display = "flex"; }
function closeModal(id)    { document.getElementById(id).style.display = "none"; }

function showToast(msg, success = true) {
    let t = document.getElementById("toast");
    if (!t) {
        t = document.createElement("div"); t.id = "toast";
        Object.assign(t.style, {
            position:"fixed", bottom:"28px", right:"28px", padding:"13px 22px",
            borderRadius:"10px", color:"white", fontWeight:"600", fontSize:"14px",
            zIndex:"9999", transition:"opacity 0.4s", fontFamily:"'Poppins',sans-serif"
        });
        document.body.appendChild(t);
    }
    t.textContent      = msg;
    t.style.background = success ? "#22c55e" : "#ef4444";
    t.style.opacity    = "1";
    setTimeout(() => { t.style.opacity = "0"; }, 3500);
}

function fmtDate(d) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
}

function deadlineClass(deadline) {
    const days = Math.ceil((new Date(deadline) - new Date()) / 86400000);
    if (days < 0)  return "dl-expired";
    if (days <= 3) return "dl-soon";
    return "dl-ok";
}

function deadlineLabel(deadline) {
    const days = Math.ceil((new Date(deadline) - new Date()) / 86400000);
    if (days < 0)  return "Expired";
    if (days === 0) return "Today";
    if (days === 1) return "1 day left";
    return `${days} days left`;
}

function statusBadge(status) {
    const map = {
        Applied:"status-applied", Shortlisted:"status-shortlisted",
        Rejected:"status-rejected", Selected:"status-selected"
    };
    return `<span class="status-badge ${map[status] || ''}">${status}</span>`;
}

// ════════════════════════════════════════════════════════════
// STUDENT — View All Jobs
// ════════════════════════════════════════════════════════════
async function loadAllJobs() {
    const container = document.getElementById("jobList");
    const countEl   = document.getElementById("jobCount");
    if (!container) return;

    container.innerHTML = `<div class="loading-msg">Loading jobs...</div>`;

    const res = await fetch(`${API}/jobs`);
    if (!res.ok) { container.innerHTML = `<div class="empty-msg">Failed to load jobs.</div>`; return; }

    let jobs = await res.json();
    jobs = jobs.filter(j => j.isActive && new Date(j.deadline) >= new Date());
    if (countEl) countEl.textContent = jobs.length;

    if (jobs.length === 0) {
        container.innerHTML = `<div class="empty-msg">🔍 No active job openings at the moment.</div>`;
        return;
    }

    container.innerHTML = jobs.map(j => `
        <div class="job-card">
            <div class="job-card-header">
                <div>
                    <div class="job-title">${j.jobTitle}</div>
                    <div class="job-company">🏢 ${j.companyName || "—"}</div>
                </div>
                <span class="pkg-badge">₹${j.package} LPA</span>
            </div>
            <div class="job-meta-row">
                <span>📍 ${j.location || "—"}</span>
                <span>🎓 CGPA ≥ ${j.requiredCGPA}</span>
                <span>🛠 ${j.requiredSkills || "Any"}</span>
                <span class="deadline-badge ${deadlineClass(j.deadline)}">⏰ ${deadlineLabel(j.deadline)}</span>
            </div>
            <div class="job-desc">${(j.jobDescription || "").substring(0, 140)}${j.jobDescription?.length > 140 ? "…" : ""}</div>
            <div class="job-actions">
                <button class="btn-view-job" onclick="openJobModal(${JSON.stringify(j).replace(/"/g,'&quot;')})">👁 View Details</button>
                <button class="btn-apply" onclick="applyJob(${j.jobId}, this)">✅ Apply Now</button>
            </div>
        </div>`).join("");
}

async function applyJob(jobId, btn) {
    const studentId = sessionStorage.getItem("userId");
    if (!studentId) { showToast("❌ Please login first", false); return; }

    btn.disabled   = true;
    btn.textContent = "Applying…";

    const res = await fetch(`${API}/applications`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ studentId: parseInt(studentId), jobId })
    });

    const msg = await res.text();
    showToast(res.ok ? "✅ " + msg : "❌ " + msg, res.ok);

    if (res.ok) {
        btn.textContent = "✅ Applied";
        btn.style.background = "#22c55e";
    } else {
        btn.disabled    = false;
        btn.textContent = "✅ Apply Now";
    }
}

function openJobModal(j) {
    setT("modal-jobTitle",    j.jobTitle);
    setT("modal-company",     j.companyName || "—");
    setT("modal-package",     `₹${j.package} LPA`);
    setT("modal-location",    j.location || "—");
    setT("modal-cgpa",        j.requiredCGPA);
    setT("modal-skills",      j.requiredSkills || "Any");
    setT("modal-deadline",    fmtDate(j.deadline));
    setT("modal-desc",        j.jobDescription || "—");

    const applyBtn = document.getElementById("modal-applyBtn");
    if (applyBtn) {
        applyBtn.onclick   = () => { applyJob(j.jobId, applyBtn); closeModal("jobDetailModal"); };
        applyBtn.disabled  = false;
        applyBtn.textContent = "✅ Apply Now";
        applyBtn.style.background = "";
    }
    openModal("jobDetailModal");
}

// ════════════════════════════════════════════════════════════
// STUDENT — My Applications
// ════════════════════════════════════════════════════════════
async function loadMyApplications() {
    const studentId = sessionStorage.getItem("userId");
    const container = document.getElementById("myApplicationsList");
    if (!container || !studentId) return;

    container.innerHTML = `<div class="loading-msg">Loading…</div>`;

    const res = await fetch(`${API}/applications/student/${studentId}`);
    if (!res.ok) { container.innerHTML = `<div class="empty-msg">Failed to load.</div>`; return; }

    const apps = await res.json();
    setT("myAppCount", apps.length);

    if (apps.length === 0) {
        container.innerHTML = `<div class="empty-msg">📭 You haven't applied to any jobs yet.</div>`;
        return;
    }

    container.innerHTML = `
        <table class="app-table">
            <thead>
                <tr><th>Job Title</th><th>Company</th><th>Package</th><th>Applied On</th><th>Status</th></tr>
            </thead>
            <tbody>
                ${apps.map(a => `
                <tr>
                    <td><strong>${a.jobTitle || "—"}</strong></td>
                    <td>${a.companyName || "—"}</td>
                    <td>₹${a.package || "—"} LPA</td>
                    <td>${fmtDate(a.appliedDate)}</td>
                    <td>${statusBadge(a.status)}</td>
                </tr>`).join("")}
            </tbody>
        </table>`;
}

// ════════════════════════════════════════════════════════════
// COMPANY — Post Job
// ════════════════════════════════════════════════════════════
async function postJob() {
    const companyId = sessionStorage.getItem("userId");
    const payload = {
        jobTitle:       getVal("j-title"),
        jobDescription: getVal("j-desc"),
        requiredSkills: getVal("j-skills"),
        requiredCGPA:   parseFloat(getVal("j-cgpa"))  || 0,
        package:        parseFloat(getVal("j-pkg"))   || 0,
        location:       getVal("j-location"),
        deadline:       getVal("j-deadline")
    };

    if (!payload.jobTitle || !payload.package || !payload.deadline) {
        showToast("❌ Title, Package and Deadline are required", false); return;
    }

    const res = await fetch(`${API}/jobs?companyId=${companyId}`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload)
    });

    const msg = await res.text();
    showToast(res.ok ? "✅ " + msg : "❌ " + msg, res.ok);
    if (res.ok) {
        ["j-title","j-desc","j-skills","j-cgpa","j-pkg","j-location","j-deadline"]
            .forEach(id => setValue(id, ""));
        loadPostedJobs();
    }
}

// ════════════════════════════════════════════════════════════
// COMPANY — View Posted Jobs
// ════════════════════════════════════════════════════════════
async function loadPostedJobs() {
    const companyId = sessionStorage.getItem("userId");
    const container = document.getElementById("postedJobsList");
    if (!container) return;

    container.innerHTML = `<div class="loading-msg">Loading…</div>`;

    const [jobsRes, allAppsRes] = await Promise.all([
        fetch(`${API}/jobs/company/${companyId}`),
        fetch(`${API}/applications/job/0`).catch(() => null)
    ]);

    if (!jobsRes.ok) { container.innerHTML = `<div class="empty-msg">Failed to load jobs.</div>`; return; }
    const jobs = await jobsRes.json();

    setT("postedCount", jobs.length);

    if (jobs.length === 0) {
        container.innerHTML = `<div class="empty-msg">📭 No jobs posted yet. Use the Post Job tab to create one.</div>`;
        return;
    }

    // Fetch applicant counts per job
    const countMap = {};
    await Promise.all(jobs.map(async j => {
        try {
            const r = await fetch(`${API}/applications/job/${j.jobId}`);
            if (r.ok) { const d = await r.json(); countMap[j.jobId] = d.length; }
        } catch { countMap[j.jobId] = 0; }
    }));

    container.innerHTML = jobs.map(j => `
        <div class="job-card">
            <div class="job-card-header">
                <div>
                    <div class="job-title">${j.jobTitle}</div>
                    <div class="job-company">📍 ${j.location || "—"} &bull; ₹${j.package} LPA</div>
                </div>
                <span class="app-count-badge">👥 ${countMap[j.jobId] || 0} Applicants</span>
            </div>
            <div class="job-meta-row">
                <span>🎓 CGPA ≥ ${j.requiredCGPA}</span>
                <span>🛠 ${j.requiredSkills || "Any"}</span>
                <span class="deadline-badge ${deadlineClass(j.deadline)}">⏰ ${fmtDate(j.deadline)}</span>
                <span class="${j.isActive ? 'badge-active' : 'badge-inactive'}">${j.isActive ? "Active" : "Inactive"}</span>
            </div>
            <div class="job-actions">
                <button class="btn-view-job" onclick="loadApplicants(${j.jobId}, '${j.jobTitle.replace(/'/g,"\\'")}')">👥 View Applicants</button>
                <button class="btn-edit-job" onclick="openEditJobModal(${j.jobId})">✏️ Edit</button>
                <button class="btn-delete-job" onclick="deleteJob(${j.jobId})">🗑 Delete</button>
            </div>
        </div>`).join("");
}

// ════════════════════════════════════════════════════════════
// COMPANY — View Applicants
// ════════════════════════════════════════════════════════════
async function loadApplicants(jobId, jobTitle) {
    setT("applicantsJobTitle", jobTitle);
    const container = document.getElementById("applicantsList");
    if (!container) return;

    container.innerHTML = `<div class="loading-msg">Loading applicants…</div>`;
    openModal("applicantsModal");

    const res = await fetch(`${API}/jobs/${jobId}/applicants`);
    if (!res.ok) { container.innerHTML = `<div class="empty-msg">Failed to load.</div>`; return; }

    const apps = await res.json();
    if (apps.length === 0) {
        container.innerHTML = `<div class="empty-msg">No applicants yet for this job.</div>`;
        return;
    }

    container.innerHTML = apps.map(a => `
        <div class="applicant-card">
            <div class="student-avatar">${(a.studentName || "?").charAt(0).toUpperCase()}</div>
            <div class="applicant-info">
                <div class="student-name">${a.studentName || "—"}</div>
                <div class="student-meta">${a.email || ""} &bull; ${a.college || ""} &bull; ${a.branch || ""}</div>
                <div class="student-meta">CGPA: <strong>${a.cgpa || "—"}</strong> &bull; Skills: ${a.skills || "—"}</div>
            </div>
            <div class="applicant-right">
                ${statusBadge(a.status)}
                <select class="status-select" onchange="updateStatus(${a.applicationId}, this.value)">
                    <option value="1" ${a.status==='Applied'     ?'selected':''}>Applied</option>
                    <option value="2" ${a.status==='Shortlisted' ?'selected':''}>Shortlisted</option>
                    <option value="3" ${a.status==='Rejected'    ?'selected':''}>Rejected</option>
                    <option value="4" ${a.status==='Selected'    ?'selected':''}>Selected</option>
                </select>
                ${a.resumePath
    ? `<a class="resume-link"
          href="http://localhost:5000${a.resumePath}"
          target="_blank">
          📄 View Resume
       </a>`
    : `<span class="no-resume">No Resume</span>`}
            </div>
        </div>`).join("");
}

async function updateStatus(applicationId, status) {
    const res = await fetch(`${API}/applications/${applicationId}/status`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status: parseInt(status) })
    });
    const msg = await res.text();
    showToast(res.ok ? "✅ " + msg : "❌ " + msg, res.ok);
}

// ════════════════════════════════════════════════════════════
// COMPANY — Edit / Delete Job
// ════════════════════════════════════════════════════════════
async function openEditJobModal(jobId) {
    const res = await fetch(`${API}/jobs/${jobId}`);
    if (!res.ok) { showToast("❌ Failed to load job", false); return; }
    const j = await res.json();

    setValue("ej-id",       j.jobId);
    setValue("ej-title",    j.jobTitle);
    setValue("ej-desc",     j.jobDescription);
    setValue("ej-skills",   j.requiredSkills);
    setValue("ej-cgpa",     j.requiredCGPA);
    setValue("ej-pkg",      j.package);
    setValue("ej-location", j.location);
    setValue("ej-deadline", j.deadline ? j.deadline.substring(0, 10) : "");
    document.getElementById("ej-active").checked = j.isActive;
    openModal("editJobModal");
}

async function saveEditJob() {
    const companyId = sessionStorage.getItem("userId");
    const jobId     = getVal("ej-id");
    const payload   = {
        jobTitle:       getVal("ej-title"),
        jobDescription: getVal("ej-desc"),
        requiredSkills: getVal("ej-skills"),
        requiredCGPA:   parseFloat(getVal("ej-cgpa"))     || 0,
        package:        parseFloat(getVal("ej-pkg"))      || 0,
        location:       getVal("ej-location"),
        deadline:       getVal("ej-deadline"),
        isActive:       document.getElementById("ej-active").checked
    };

    const res = await fetch(`${API}/jobs/${jobId}?companyId=${companyId}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload)
    });

    const msg = await res.text();
    showToast(res.ok ? "✅ " + msg : "❌ " + msg, res.ok);
    if (res.ok) { closeModal("editJobModal"); loadPostedJobs(); }
}

async function deleteJob(jobId) {
    if (!confirm("Delete this job posting? This cannot be undone.")) return;
    const companyId = sessionStorage.getItem("userId");
    const res = await fetch(`${API}/jobs/${jobId}?companyId=${companyId}`, { method: "DELETE" });
    const msg = await res.text();
    showToast(res.ok ? "✅ " + msg : "❌ " + msg, res.ok);
    if (res.ok) loadPostedJobs();
}


