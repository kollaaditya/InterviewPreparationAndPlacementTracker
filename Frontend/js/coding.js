// ═══════════════════════════════════════════════════════════════
//  coding.js  —  Coding Assessment Platform
//  Architecture: coding-assessment.html → coding.js
//              → POST /api/coding/run
//              → POST /api/coding/submit
//              → GET  /api/codingquestions
//              → GET  /api/codingquestions/{id}
//              → GET  /api/coding/submissions/{studentId}
// ═══════════════════════════════════════════════════════════════

var API = "http://localhost:5000/api";

// ── Language configuration ─────────────────────────────────────
const LANGUAGES = {
    csharp: {
        label:   "C#",
        monacoId: "csharp",
        template: `using System;\n\nclass Program\n{\n    static void Main()\n    {\n        // Write your solution here\n        Console.WriteLine("Hello, World!");\n    }\n}`
    },
    java: {
        label:   "Java",
        monacoId: "java",
        template: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your solution here\n        System.out.println("Hello, World!");\n    }\n}`
    },
    python: {
        label:   "Python",
        monacoId: "python",
        template: `# Write your solution here\nprint("Hello, World!")`
    },
    cpp: {
        label:   "C++",
        monacoId: "cpp",
        template: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    cout << "Hello, World!" << endl;\n    return 0;\n}`
    }
};

// ── State ──────────────────────────────────────────────────────
let studentId      = null;
let monacoEditor   = null;
let allQuestions   = [];
let activeQuestion = null;
let codeCache      = {};   // { "qId_lang": "source code" }
let currentLang    = "csharp";
let timerInterval  = null;
let timeRemaining  = 60 * 60;  // 60 minutes
let warnings       = 0;
let isSubmitted    = false;
let submittedCount = 0;
let sessionStart   = null;

// ── Auth guard ─────────────────────────────────────────────────
function initAuth() {
    studentId      = sessionStorage.getItem("userId");
    const role     = sessionStorage.getItem("userRole");
    const userName = sessionStorage.getItem("userName");

    if (!studentId || role !== "Student") {
        alert("Please login first.");
        window.location.href = "studentlogin.html";
        return false;
    }

    document.getElementById("navUserName").textContent = userName || "Student";
    return true;
}

// ═══════════════════════════════════════════════════════════════
//  ANTI-CHEAT
// ═══════════════════════════════════════════════════════════════
function applyAntiCheat() {
    document.addEventListener("contextmenu", e => e.preventDefault());
    document.addEventListener("copy",        e => e.preventDefault());
    document.addEventListener("paste",       e => e.preventDefault());
    document.addEventListener("cut",         e => e.preventDefault());

    document.addEventListener("visibilitychange", () => {
        if (isSubmitted) return;
        if (document.hidden) {
            warnings++;
            updateWarningBadge();

            if (warnings >= 3) {
                autoSubmit("Auto Submitted Due To Tab Switching");
            } else {
                showToast(`⚠️ Tab Switch Detected — Warning ${warnings}/3`, false);
                showWarningOverlay(`Warning ${warnings}/3 — Do not switch tabs! One more violation will auto-submit your test.`);
            }
        }
    });
}

function updateWarningBadge() {
    const badge = document.getElementById("warningBadge");
    const count = document.getElementById("warningCount");
    if (!badge || !count) return;
    count.textContent = warnings;
    badge.style.display = "flex";
    if (warnings >= 2) {
        badge.style.background = "rgba(239,68,68,0.25)";
        badge.style.borderColor = "#ef4444";
        badge.style.color = "#fca5a5";
    }
}

function showWarningOverlay(message) {
    const overlay = document.getElementById("warningOverlay");
    const msg     = document.getElementById("warningMsg");
    if (!overlay || !msg) return;
    msg.textContent = message;
    overlay.style.display = "flex";
    setTimeout(() => { overlay.style.display = "none"; }, 4000);
}

// ═══════════════════════════════════════════════════════════════
//  TIMER
// ═══════════════════════════════════════════════════════════════
function startTimer() {
    sessionStart = new Date().toISOString();
    timerInterval = setInterval(() => {
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            autoSubmit("Time Expired");
            return;
        }
        timeRemaining--;
        renderTimer();
    }, 1000);
    renderTimer();
}

function renderTimer() {
    const el  = document.getElementById("timerDisplay");
    if (!el) return;

    const hrs = Math.floor(timeRemaining / 3600);
    const min = Math.floor((timeRemaining % 3600) / 60);
    const sec = timeRemaining % 60;

    const hStr = String(hrs).padStart(2, "0");
    const mStr = String(min).padStart(2, "0");
    const sStr = String(sec).padStart(2, "0");

    el.textContent = hrs > 0 ? `${hStr}:${mStr}:${sStr}` : `${mStr}:${sStr}`;

    const isDanger = timeRemaining <= 300; // last 5 minutes
    el.className   = "timer-value" + (isDanger ? " timer-danger" : "");

    // Update progress ring fill (stroke-dashoffset)
    const ring = document.getElementById("timerRing");
    if (ring) {
        const total  = 60 * 60;
        const pct    = timeRemaining / total;
        const circum = 2 * Math.PI * 26; // r=26
        ring.style.strokeDashoffset = circum * (1 - pct);
        ring.style.stroke = isDanger ? "#ef4444" : "#22c55e";
    }
}

function stopTimer() { clearInterval(timerInterval); }

// ═══════════════════════════════════════════════════════════════
//  MONACO EDITOR
// ═══════════════════════════════════════════════════════════════
function initMonaco() {
    if (typeof monaco === "undefined") {
        setTimeout(initMonaco, 200);
        return;
    }
    if (monacoEditor) return;

    monacoEditor = monaco.editor.create(
        document.getElementById("monacoContainer"), {
            value:           getCodeForCurrentState(),
            language:        LANGUAGES[currentLang].monacoId,
            theme:           "vs-dark",
            fontSize:        14,
            fontFamily:      "'Fira Code', 'Cascadia Code', 'Courier New', monospace",
            fontLigatures:   true,
            minimap:         { enabled: false },
            automaticLayout: true,
            lineNumbers:     "on",
            scrollBeyondLastLine: false,
            roundedSelection: false,
            wordWrap:        "on",
            tabSize:         4,
            insertSpaces:    true,
            autoIndent:      "full",
            formatOnType:    true,
            formatOnPaste:   true,
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            parameterHints:  { enabled: true },
            scrollbar: {
                verticalScrollbarSize:   8,
                horizontalScrollbarSize: 8
            }
        }
    );

    // Save code on every keystroke
    monacoEditor.onDidChangeModelContent(() => persistCode());
}

function getCodeCacheKey() {
    const qId = activeQuestion ? activeQuestion.questionId : "default";
    return `${qId}_${currentLang}`;
}

function getCodeForCurrentState() {
    const key = getCodeCacheKey();
    return codeCache[key] ?? LANGUAGES[currentLang].template;
}

function persistCode() {
    if (!monacoEditor) return;
    codeCache[getCodeCacheKey()] = monacoEditor.getValue();
}

function switchEditorLanguage(lang) {
    persistCode();
    currentLang = lang;
    const newCode  = getCodeForCurrentState();
    const monacoId = LANGUAGES[lang].monacoId;

    if (monacoEditor) {
        const model = monaco.editor.createModel(newCode, monacoId);
        monacoEditor.setModel(model);
        monacoEditor.onDidChangeModelContent(() => persistCode());
    }
    updateLangDropdown();
}

function updateLangDropdown() {
    const sel = document.getElementById("langSelect");
    if (sel) sel.value = currentLang;
}

function onLanguageChange() {
    const lang = document.getElementById("langSelect").value;
    switchEditorLanguage(lang);
}

// ═══════════════════════════════════════════════════════════════
//  LOAD QUESTIONS FROM BACKEND
// ═══════════════════════════════════════════════════════════════
async function loadAllQuestions() {
    const sidebar = document.getElementById("questionSidebar");
    sidebar.innerHTML = `<div class="sidebar-loading"><div class="spinner-sm"></div> Loading…</div>`;

    try {
        const res = await fetch(`${API}/codingquestions`);
        if (!res.ok) throw new Error("Failed to fetch questions");
        allQuestions = await res.json();
    } catch (e) {
        sidebar.innerHTML = `<div class="sidebar-error">⚠️ Could not load questions.<br><small>${e.message}</small></div>`;
        return;
    }

    if (allQuestions.length === 0) {
        sidebar.innerHTML = `<div class="sidebar-error">📭 No questions available yet.</div>`;
        return;
    }

    renderQuestionSidebar();
    updateProgressBadge();
    // Auto-select first question
    await loadQuestion(allQuestions[0].questionId);
}

function renderQuestionSidebar() {
    const sidebar = document.getElementById("questionSidebar");
    sidebar.innerHTML = allQuestions.map((q, i) => {
        const diffCls = (q.difficulty || "Easy").toLowerCase();
        return `
        <div class="q-sidebar-item ${activeQuestion?.questionId === q.questionId ? 'active' : ''}"
             id="qitem-${q.questionId}"
             onclick="loadQuestion(${q.questionId})">
            <div class="q-sidebar-num">${i + 1}</div>
            <div class="q-sidebar-info">
                <div class="q-sidebar-title">${q.title}</div>
                <span class="diff-pill diff-${diffCls}">${q.difficulty || "Easy"}</span>
            </div>
        </div>`;
    }).join("");
}

async function loadQuestion(questionId) {
    // Persist current code before switching
    persistCode();

    // Highlight active in sidebar
    document.querySelectorAll(".q-sidebar-item").forEach(el => el.classList.remove("active"));
    const item = document.getElementById(`qitem-${questionId}`);
    if (item) item.classList.add("active");

    // Show skeleton loader in problem panel
    const panel = document.getElementById("problemPanel");
    panel.innerHTML = `<div class="problem-skeleton"><div class="sk-line sk-title"></div><div class="sk-line"></div><div class="sk-line sk-short"></div></div>`;

    try {
        const res = await fetch(`${API}/codingquestions/${questionId}`);
        if (!res.ok) throw new Error("Question not found");
        activeQuestion = await res.json();
    } catch (e) {
        panel.innerHTML = `<div class="problem-error">⚠️ Failed to load question.</div>`;
        return;
    }

    renderProblemPanel();

    // Restore or set template code for this question + language
    if (monacoEditor) {
        const code    = getCodeForCurrentState();
        const langId  = LANGUAGES[currentLang].monacoId;
        const model   = monaco.editor.createModel(code, langId);
        monacoEditor.setModel(model);
        monacoEditor.onDidChangeModelContent(() => persistCode());
        monacoEditor.focus();
    }

    clearOutput();
}

function renderProblemPanel() {
    if (!activeQuestion) return;
    const q      = activeQuestion;
    const diffCls = (q.difficulty || "Easy").toLowerCase();

    document.getElementById("problemPanel").innerHTML = `
        <div class="problem-header">
            <div class="problem-title-row">
                <h2 class="problem-title">${q.title}</h2>
                <span class="diff-pill diff-${diffCls}">${q.difficulty || "Easy"}</span>
            </div>
        </div>

        <div class="problem-section">
            <div class="section-label">📋 Problem Statement</div>
            <div class="problem-text">${(q.description || "").replace(/\n/g, "<br>")}</div>
        </div>

        ${q.inputFormat ? `
        <div class="problem-section">
            <div class="section-label">📥 Input Format</div>
            <div class="problem-text">${q.inputFormat.replace(/\n/g, "<br>")}</div>
        </div>` : ""}

        ${q.outputFormat ? `
        <div class="problem-section">
            <div class="section-label">📤 Output Format</div>
            <div class="problem-text">${q.outputFormat.replace(/\n/g, "<br>")}</div>
        </div>` : ""}

        ${(q.sampleInput || q.sampleOutput) ? `
        <div class="problem-section">
            <div class="section-label">💡 Example</div>
            <div class="example-grid">
                ${q.sampleInput ? `
                <div class="example-box">
                    <div class="example-label">Input</div>
                    <pre class="example-code">${escHtml(q.sampleInput)}</pre>
                </div>` : ""}
                ${q.sampleOutput ? `
                <div class="example-box">
                    <div class="example-label">Output</div>
                    <pre class="example-code">${escHtml(q.sampleOutput)}</pre>
                </div>` : ""}
            </div>
        </div>` : ""}`;
}

function escHtml(s) {
    return (s || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

// ═══════════════════════════════════════════════════════════════
//  RUN CODE  →  POST /api/coding/run
// ═══════════════════════════════════════════════════════════════
async function runCode() {
    if (!monacoEditor) return;
    persistCode();

    const code = monacoEditor.getValue().trim();
    if (!code) { showToast("❌ Editor is empty", false); return; }

    setRunBusy(true);
    switchOutputTab("output");
    setOutputContent("⏳ Running code…", "running");

    try {
        const res = await fetch(`${API}/coding/run`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({
                sourceCode: code,
                language:   currentLang
            })
        });

        const text = await res.text();
        let output = text;

        // Try to parse JSON { output: "..." }
        try {
            const json = JSON.parse(text);
            output = json.output ?? json.message ?? text;
        } catch { /* raw text is fine */ }

        setOutputContent(output || "(no output)", res.ok ? "success" : "error");
        if (res.ok) showToast("✅ Code executed successfully");
        else        showToast("❌ Execution failed", false);

    } catch (e) {
        setOutputContent(`Network error: ${e.message}`, "error");
        showToast("❌ Could not reach server", false);
    }

    setRunBusy(false);
}

// ═══════════════════════════════════════════════════════════════
//  SUBMIT SOLUTION  →  POST /api/coding/submit
// ═══════════════════════════════════════════════════════════════
async function submitCode() {
    if (isSubmitted)    return;
    if (!activeQuestion) { showToast("❌ No question selected", false); return; }
    if (!monacoEditor)   return;

    persistCode();
    const code = monacoEditor.getValue().trim();
    if (!code) { showToast("❌ Editor is empty — write your solution first", false); return; }

    if (!confirm(`Submit solution for "${activeQuestion.title}"?`)) return;

    setSubmitBusy(true);
    switchOutputTab("output");
    setOutputContent("⏳ Submitting solution…", "running");

    try {
        const res = await fetch(`${API}/coding/submit`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({
                studentId:  parseInt(studentId),
                questionId: activeQuestion.questionId,
                language:   LANGUAGES[currentLang].label,
                sourceCode: code
            })
        });

        const text = await res.text();
        let output = text, status = "Submitted";
        try {
            const json = JSON.parse(text);
            output = json.output ?? json.message ?? text;
            status = json.status ?? "Submitted";
        } catch { /* raw text fine */ }

        if (res.ok) {
            submittedCount++;
            updateProgressBadge();
            setOutputContent(output || "Solution submitted successfully", "success");
            showToast(`✅ Solution submitted for "${activeQuestion.title}"!`);
            markQuestionSubmitted(activeQuestion.questionId);
            loadSubmissionHistory(); // refresh history panel
        } else {
            setOutputContent(output || "Submission failed", "error");
            showToast("❌ Submission failed", false);
        }

    } catch (e) {
        setOutputContent(`Network error: ${e.message}`, "error");
        showToast("❌ Could not reach server", false);
    }

    setSubmitBusy(false);
}

function markQuestionSubmitted(questionId) {
    const item = document.getElementById(`qitem-${questionId}`);
    if (item) item.classList.add("solved");
}

// ═══════════════════════════════════════════════════════════════
//  SUBMISSION HISTORY  →  GET /api/coding/submissions/{studentId}
// ═══════════════════════════════════════════════════════════════
async function loadSubmissionHistory() {
    const container = document.getElementById("historyList");
    if (!container) return;
    container.innerHTML = `<div class="history-loading"><div class="spinner-sm"></div> Loading…</div>`;

    try {
        const res = await fetch(`${API}/coding/submissions/${studentId}`);
        if (!res.ok) throw new Error("Failed to load history");
        const data = await res.json();
        renderSubmissionHistory(data);
    } catch (e) {
        container.innerHTML = `<div class="history-empty">⚠️ Could not load history</div>`;
    }
}

function renderSubmissionHistory(submissions) {
    const container = document.getElementById("historyList");
    if (!submissions || submissions.length === 0) {
        container.innerHTML = `
            <div class="history-empty">
                <div style="font-size:32px;margin-bottom:8px">📭</div>
                <div>No submissions yet</div>
                <div style="font-size:11px;margin-top:4px;opacity:0.7">Submit a solution to see it here</div>
            </div>`;
        return;
    }

    container.innerHTML = submissions.map(s => {
        const statusMap = {
            "Accepted":           { cls: "status-accepted",  icon: "✅" },
            "Wrong Answer":       { cls: "status-wrong",     icon: "❌" },
            "Runtime Error":      { cls: "status-error",     icon: "⚡" },
            "Time Limit Exceeded":{ cls: "status-tle",       icon: "⏱" },
            "Pending":            { cls: "status-pending",   icon: "⏳" },
            "Submitted":          { cls: "status-submitted", icon: "📤" }
        };
        const st    = statusMap[s.status] || { cls: "status-pending", icon: "📤" };
        const qName = s.questionTitle || `Q#${s.questionId}`;
        const date  = fmtDateTime(s.submittedAt);

        return `
        <div class="history-card">
            <div class="history-card-top">
                <span class="history-q-name" title="${qName}">${qName}</span>
                <span class="history-status ${st.cls}">${st.icon} ${s.status}</span>
            </div>
            <div class="history-card-meta">
                <span class="history-lang">🗣 ${s.language}</span>
                <span class="history-date">🕒 ${date}</span>
            </div>
            ${s.output ? `<div class="history-output" onclick="this.classList.toggle('expanded')">${escHtml(s.output)}</div>` : ""}
        </div>`;
    }).join("");
}

// ═══════════════════════════════════════════════════════════════
//  AUTO SUBMIT (timer / tab switch)
// ═══════════════════════════════════════════════════════════════
async function autoSubmit(reason) {
    if (isSubmitted) return;
    isSubmitted = true;
    stopTimer();
    persistCode();

    showWarningOverlay(`⏱ ${reason} — Finalising your session…`);

    // Best-effort submit of active question if unsaved
    if (activeQuestion && monacoEditor) {
        const code = monacoEditor.getValue().trim();
        if (code) {
            try {
                await fetch(`${API}/coding/submit`, {
                    method:  "POST",
                    headers: { "Content-Type": "application/json" },
                    body:    JSON.stringify({
                        studentId:  parseInt(studentId),
                        questionId: activeQuestion.questionId,
                        language:   LANGUAGES[currentLang].label,
                        sourceCode: code
                    })
                });
            } catch { /* silent */ }
        }
    }

    showSessionEnded(reason);
}

function showSessionEnded(reason) {
    const overlay = document.getElementById("sessionEndedOverlay");
    const msgEl   = document.getElementById("sessionEndedReason");
    const countEl = document.getElementById("sessionEndedCount");
    if (!overlay) return;

    if (msgEl)   msgEl.textContent   = reason;
    if (countEl) countEl.textContent = submittedCount;
    overlay.style.display = "flex";
}

// ═══════════════════════════════════════════════════════════════
//  OUTPUT PANEL HELPERS
// ═══════════════════════════════════════════════════════════════
function clearOutput() {
    setOutputContent("// Click ▶ Run Code to execute your solution\n// Click ✅ Submit Solution to save your answer", "idle");
    document.getElementById("outputStatusPill").textContent = "Ready";
    document.getElementById("outputStatusPill").className   = "output-status-pill pill-ready";
}

function setOutputContent(text, mode) {
    const el   = document.getElementById("outputContent");
    const pill = document.getElementById("outputStatusPill");
    if (!el) return;

    el.textContent = text;

    const modes = {
        idle:    { color: "#94a3b8", pillText: "Ready",    pillCls: "pill-ready"   },
        running: { color: "#f59e0b", pillText: "Running…", pillCls: "pill-running" },
        success: { color: "#22c55e", pillText: "Success",  pillCls: "pill-success" },
        error:   { color: "#ef4444", pillText: "Error",    pillCls: "pill-error"   }
    };
    const cfg = modes[mode] || modes.idle;
    el.style.color = cfg.color;
    if (pill) { pill.textContent = cfg.pillText; pill.className = `output-status-pill ${cfg.pillCls}`; }
}

function switchOutputTab(tab) {
    document.querySelectorAll(".output-tab").forEach(t =>
        t.classList.toggle("active", t.dataset.tab === tab));
    document.getElementById("outputPane").style.display   = tab === "output"  ? "flex" : "none";
    document.getElementById("historyPane").style.display  = tab === "history" ? "flex" : "none";

    if (tab === "history") loadSubmissionHistory();
}

// ═══════════════════════════════════════════════════════════════
//  PROGRESS BADGE
// ═══════════════════════════════════════════════════════════════
function updateProgressBadge() {
    const total = allQuestions.length;
    const el    = document.getElementById("progressBadge");
    if (el) el.textContent = `${submittedCount} / ${total} Solved`;
}

// ═══════════════════════════════════════════════════════════════
//  BUTTON BUSY STATE
// ═══════════════════════════════════════════════════════════════
function setRunBusy(busy) {
    const btn = document.getElementById("btnRun");
    if (!btn) return;
    btn.disabled    = busy;
    btn.innerHTML   = busy
        ? `<span class="btn-spinner"></span> Running…`
        : `▶ Run Code`;
}

function setSubmitBusy(busy) {
    const btn = document.getElementById("btnSubmit");
    if (!btn) return;
    btn.disabled    = busy;
    btn.innerHTML   = busy
        ? `<span class="btn-spinner"></span> Submitting…`
        : `✅ Submit Solution`;
}

// ═══════════════════════════════════════════════════════════════
//  TOAST
// ═══════════════════════════════════════════════════════════════
function showToast(msg, ok = true) {
    let t = document.getElementById("toast");
    if (!t) {
        t = document.createElement("div");
        t.id = "toast";
        Object.assign(t.style, {
            position: "fixed", bottom: "28px", right: "28px",
            padding: "12px 22px", borderRadius: "10px", color: "white",
            fontWeight: "600", fontSize: "14px", zIndex: "99999",
            transition: "opacity 0.4s", fontFamily: "'Poppins',sans-serif",
            maxWidth: "360px", boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
        });
        document.body.appendChild(t);
    }
    t.textContent      = msg;
    t.style.background = ok ? "#22c55e" : "#ef4444";
    t.style.opacity    = "1";
    clearTimeout(t._timeout);
    t._timeout = setTimeout(() => t.style.opacity = "0", 3500);
}

// ═══════════════════════════════════════════════════════════════
//  DATE FORMATTER
// ═══════════════════════════════════════════════════════════════
function fmtDateTime(d) {
    if (!d) return "—";
    return new Date(d).toLocaleString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit"
    });
}

// ═══════════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════════
document.addEventListener("DOMContentLoaded", async () => {
    if (!initAuth()) return;

    applyAntiCheat();

    // Prevent accidental navigation away
    window.addEventListener("beforeunload", e => {
        if (!isSubmitted) {
            e.preventDefault();
            e.returnValue = "";
        }
    });

    // Wire language dropdown
    document.getElementById("langSelect").value = currentLang;

    // Wire output tabs
    document.querySelectorAll(".output-tab").forEach(tab =>
        tab.addEventListener("click", () => switchOutputTab(tab.dataset.tab)));

    // Start timer
    startTimer();

    // Load questions from backend
    await loadAllQuestions();

    // Init Monaco (async — Monaco CDN may still be loading)
    initMonaco();
});
