// ── Aptitude Test ─────────────────────────────────────────────
var APTITUDE_QUESTIONS = [
    { q: "What is 15% of 200?",                                       opts: ["25","30","35","40"],           ans: 1 },
    { q: "A train travels 60 km in 45 min. Speed in km/h?",           opts: ["70","75","80","85"],           ans: 2 },
    { q: "If 3x + 7 = 22, then x = ?",                                opts: ["3","4","5","6"],               ans: 2 },
    { q: "Next in series: 2, 6, 12, 20, __",                          opts: ["28","30","32","36"],           ans: 1 },
    { q: "P is taller than Q. Q is taller than R. Who is shortest?",  opts: ["P","Q","R","Cannot determine"],ans: 2 },
    { q: "Simple interest on ₹1000 at 10% for 2 years?",              opts: ["₹100","₹150","₹200","₹250"],  ans: 2 },
    { q: "Odd one out: 8, 27, 64, 100, 125",                          opts: ["27","64","100","125"],         ans: 2 },
    { q: "A can do work in 10 days, B in 15 days. Together?",          opts: ["5","6","7","8"],               ans: 1 },
    { q: "If APPLE = 50, MANGO = ?  (A=1,B=2…Z=26)",                  opts: ["39","40","41","42"],           ans: 0 },
    { q: "Log₂(64) = ?",                                              opts: ["5","6","7","8"],               ans: 1 },
    { q: "Ratio of 25 paise to ₹1 is?",                               opts: ["1:2","1:4","1:5","2:5"],      ans: 1 },
    { q: "Average of 10, 20, 30, 40, 50?",                            opts: ["25","30","35","40"],           ans: 1 },
    { q: "LCM of 12 and 18?",                                         opts: ["24","36","48","72"],           ans: 1 },
    { q: "If 5 pencils cost ₹15, cost of 8 pencils?",                 opts: ["₹20","₹24","₹28","₹32"],     ans: 1 },
    { q: "2^10 = ?",                                                   opts: ["512","1024","2048","4096"],    ans: 1 },
    { q: "A clock shows 3:15. Angle between hands?",                   opts: ["0°","7.5°","15°","22.5°"],    ans: 1 },
    { q: "Compound interest on ₹1000 at 10% for 2 years?",            opts: ["₹200","₹210","₹220","₹230"],  ans: 1 },
    { q: "Find missing: 1, 1, 2, 3, 5, 8, __",                        opts: ["11","12","13","14"],           ans: 2 },
    { q: "If all roses are flowers and all flowers are plants, then?",  opts: ["All plants are roses","All roses are plants","Some plants are roses","None"], ans: 1 },
    { q: "Distance = Speed × Time. If S=60 km/h, T=2.5 h, D=?",      opts: ["120 km","130 km","140 km","150 km"], ans: 3 }
];

const APT_DURATION = 20 * 60; // 20 minutes
let aptAnswers = new Array(20).fill(null);
let aptCurrent = 0;
let aptTimer   = null;
let aptWarnings = 0;
let aptSubmitted = false;
let aptStart    = null;

// ── Anti-cheat ─────────────────────────────────────────────────
function applyAntiCheat() {
    document.addEventListener("contextmenu", e => e.preventDefault());
    document.addEventListener("copy",        e => e.preventDefault());
    document.addEventListener("paste",       e => e.preventDefault());
    document.addEventListener("cut",         e => e.preventDefault());

    document.addEventListener("visibilitychange", () => {
        if (aptSubmitted || !aptStart) return;
        if (document.hidden) {
            aptWarnings++;
            document.getElementById("apt-warn-count").textContent = aptWarnings;
            if (aptWarnings >= 3) {
                autoSubmitApt("Auto Submitted Due To Tab Switching");
            } else {
                alert(`⚠️ Tab Switching Detected! Warning ${aptWarnings}/3`);
            }
        }
    });
}

// ── Instructions screen ────────────────────────────────────────
function showAptInstructions() {
    document.getElementById("apt-instructions").style.display = "flex";
    document.getElementById("apt-test-area").style.display    = "none";
    document.getElementById("apt-result-area").style.display  = "none";
}

function startAptTest() {
    aptStart = new Date().toISOString();
    document.getElementById("apt-instructions").style.display = "none";
    document.getElementById("apt-test-area").style.display    = "block";

    renderAptQuestion();
    renderAptNav();

    aptTimer = createTimer(APT_DURATION,
        (rem, fmt) => {
            const el = document.getElementById("apt-timer");
            el.textContent = fmt;
            el.className = "timer-display" + (rem <= 300 ? " timer-danger" : "");
        },
        () => autoSubmitApt("Time Expired")
    );
    aptTimer.start();
}

// ── Render ─────────────────────────────────────────────────────
function renderAptQuestion() {
    const q  = APTITUDE_QUESTIONS[aptCurrent];
    const el = document.getElementById("apt-question-box");
    el.innerHTML = `
        <div class="q-progress">Question ${aptCurrent + 1} of ${APTITUDE_QUESTIONS.length}</div>
        <div class="q-text">${q.q}</div>
        <div class="q-options">
            ${q.opts.map((o, i) => `
            <label class="opt-label ${aptAnswers[aptCurrent] === i ? 'selected' : ''}">
                <input type="radio" name="apt-opt" value="${i}"
                    ${aptAnswers[aptCurrent] === i ? 'checked' : ''}
                    onchange="selectAptAnswer(${i})">
                <span>${o}</span>
            </label>`).join("")}
        </div>
        <div class="q-nav-btns">
            <button class="btn-nav" onclick="aptGo(aptCurrent - 1)" ${aptCurrent === 0 ? 'disabled' : ''}>◀ Previous</button>
            ${aptCurrent < APTITUDE_QUESTIONS.length - 1
                ? `<button class="btn-nav btn-next" onclick="aptGo(aptCurrent + 1)">Next ▶</button>`
                : `<button class="btn-submit" onclick="confirmSubmitApt()">✅ Submit Test</button>`}
        </div>`;
}

function renderAptNav() {
    const nav = document.getElementById("apt-nav-grid");
    nav.innerHTML = APTITUDE_QUESTIONS.map((_, i) => `
        <button class="nav-btn ${i === aptCurrent ? 'nav-current' : ''} ${aptAnswers[i] !== null ? 'nav-answered' : ''}"
            onclick="aptGo(${i})">${i + 1}</button>`).join("");
}

function selectAptAnswer(idx) {
    aptAnswers[aptCurrent] = idx;
    renderAptQuestion();
    renderAptNav();
}

function aptGo(idx) {
    if (idx < 0 || idx >= APTITUDE_QUESTIONS.length) return;
    aptCurrent = idx;
    renderAptQuestion();
    renderAptNav();
}

// ── Submit ─────────────────────────────────────────────────────
function confirmSubmitApt() {
    const unanswered = aptAnswers.filter(a => a === null).length;
    const msg = unanswered > 0
        ? `You have ${unanswered} unanswered question(s). Submit anyway?`
        : "Submit the test now?";
    if (confirm(msg)) submitAptTest("Completed");
}

function autoSubmitApt(reason) {
    if (aptSubmitted) return;
    alert(`⏱ ${reason}. Test is being submitted.`);
    submitAptTest(reason);
}

function submitAptTest(status) {
    if (aptSubmitted) return;
    aptSubmitted = true;
    aptTimer && aptTimer.stop();

    let score = 0;
    APTITUDE_QUESTIONS.forEach((q, i) => { if (aptAnswers[i] === q.ans) score++; });

    const result = {
        testType:         "Aptitude",
        score,
        totalQuestions:   APTITUDE_QUESTIONS.length,
        startTime:        aptStart,
        endTime:          new Date().toISOString(),
        warningsCount:    aptWarnings,
        submissionStatus: status
    };
    localStorage.setItem("aptResult", JSON.stringify(result));

    showAptResult(score, status);
}

function showAptResult(score, status) {
    document.getElementById("apt-test-area").style.display   = "none";
    document.getElementById("apt-result-area").style.display = "block";
    const pct = Math.round((score / APTITUDE_QUESTIONS.length) * 100);
    document.getElementById("apt-result-box").innerHTML = `
        <div class="result-circle" style="background:${pct >= 60 ? '#22c55e' : pct >= 40 ? '#f59e0b' : '#ef4444'}">
            <div class="result-score">${score}/${APTITUDE_QUESTIONS.length}</div>
            <div class="result-pct">${pct}%</div>
        </div>
        <h2 style="margin-top:20px">${pct >= 60 ? '🎉 Well Done!' : pct >= 40 ? '👍 Good Effort!' : '📚 Keep Practicing!'}</h2>
        <p class="result-status">Status: <strong>${status}</strong></p>
        <p class="result-warn">Tab Switches: <strong>${aptWarnings}</strong></p>
        <button class="btn-go-dash" onclick="location.href='studentdashboard.html'">🏠 Back to Dashboard</button>`;
}

// ── Init ───────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    applyAntiCheat();
    showAptInstructions();
});
