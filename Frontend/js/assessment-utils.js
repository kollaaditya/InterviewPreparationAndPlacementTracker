// Shared helpers for assessment pages
var API = "http://localhost:5000/api";

function showToast(msg, ok = true) {
    let t = document.getElementById("toast");
    if (!t) {
        t = document.createElement("div");
        t.id = "toast";
        Object.assign(t.style, {
            position: "fixed", bottom: "28px", right: "28px",
            padding: "13px 22px", borderRadius: "10px", color: "white",
            fontWeight: "600", fontSize: "14px", zIndex: "9999",
            transition: "opacity 0.4s", fontFamily: "'Poppins',sans-serif",
            maxWidth: "360px", boxShadow: "0 4px 16px rgba(0,0,0,0.2)"
        });
        document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.background = ok ? "#22c55e" : "#ef4444";
    t.style.opacity = "1";
    setTimeout(() => t.style.opacity = "0", 3500);
}

function fmtDate(d) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function fmtDateTime(d) {
    if (!d) return "—";
    return new Date(d).toLocaleString("en-IN");
}

function getStudentId() {
    return sessionStorage.getItem("userId");
}

function requireStudentLogin() {
    const id   = sessionStorage.getItem("userId");
    const role = sessionStorage.getItem("userRole");
    if (!id || role !== "Student") {
        alert("Please login first.");
        window.location.href = "studentlogin.html";
    }
    return id;
}

function requireAdminLogin() {
    const name = sessionStorage.getItem("userName");
    const role = sessionStorage.getItem("userRole");
    if (!name || role !== "Admin") {
        alert("Admin Access Required");
        window.location.href = "adminlogin.html";
    }
    return name;
}

function difficultyBadge(d) {
    const map = { Easy: "#22c55e", Medium: "#f59e0b", Hard: "#ef4444" };
    const c   = map[d] || "#64748b";
    return `<span style="background:${c};color:white;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600">${d}</span>`;
}

function statusBadgeCode(s) {
    const map = {
        "Accepted":      "#22c55e",
        "Wrong Answer":  "#ef4444",
        "Runtime Error": "#f59e0b",
        "Pending":       "#64748b",
        "Time Limit Exceeded": "#f97316"
    };
    const c = map[s] || "#64748b";
    return `<span style="background:${c};color:white;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600">${s}</span>`;
}
