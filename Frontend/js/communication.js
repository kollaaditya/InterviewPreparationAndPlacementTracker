// ── Communication Test ─────────────────────────────────────────
var COMM_QUESTIONS = [
    { q: "Choose the correct sentence:",
      opts: ["He go to school.", "He goes to school.", "He going to school.", "He gone to school."], ans: 1 },
    { q: "Antonym of 'Generous':",
      opts: ["Kind","Helpful","Selfish","Brave"],                                                    ans: 2 },
    { q: "Fill in the blank: She __ singing when I arrived.",
      opts: ["is","was","were","be"],                                                                ans: 1 },
    { q: "Synonym of 'Eloquent':",
      opts: ["Silent","Articulate","Rude","Confused"],                                               ans: 1 },
    { q: "Correct spelling:",
      opts: ["Accomodate","Accommodate","Acomodate","Acommodate"],                                   ans: 1 },
    { q: "Identify the error: 'One of the student are absent.'",
      opts: ["One of","the student","are absent","No error"],                                        ans: 2 },
    { q: "Passive voice of: 'She wrote the letter.'",
      opts: ["The letter is written by her.","The letter was written by her.",
             "The letter has been written by her.","The letter will be written by her."],            ans: 1 },
    { q: "Choose the correct article: __ honest man.",
      opts: ["A","An","The","No article"],                                                           ans: 1 },
    { q: "Meaning of idiom 'Bite the bullet':",
      opts: ["To eat quickly","To endure pain bravely","To shoot someone","To be angry"],            ans: 1 },
    { q: "Direct to Indirect: He said, 'I am happy.'",
      opts: ["He said that he is happy.","He said that he was happy.",
             "He told that he is happy.","He told that I was happy."],                               ans: 1 },
    { q: "Fill in: Neither the boys nor the girl __ present.",
      opts: ["were","are","is","am"],                                                                ans: 2 },
    { q: "Correct sentence:",
      opts: ["I have seen him yesterday.","I saw him yesterday.",
             "I had saw him yesterday.","I see him yesterday."],                                     ans: 1 },
    { q: "Synonym of 'Meticulous':",
      opts: ["Careless","Precise","Lazy","Reckless"],                                                ans: 1 },
    { q: "Opposite of 'Transparent':",
      opts: ["Clear","Obvious","Opaque","Bright"],                                                   ans: 2 },
    { q: "Choose: The team __ working hard.",
      opts: ["are","is","were","be"],                                                                ans: 1 },
    { q: "Meaning of 'Verbose':",
      opts: ["Brief","Using too many words","Silent","Accurate"],                                    ans: 1 },
    { q: "Correct form: If I __ a bird, I would fly.",
      opts: ["am","is","were","was"],                                                                ans: 2 },
    { q: "Choose the correctly punctuated sentence:",
      opts: ["Its a beautiful day.","It's a beautiful day.","Its' a beautiful day.","Its a beautiful day!"], ans: 1 },
    { q: "Reading: 'The apex of the mountain was covered in snow.' APEX means?",
      opts: ["Base","Side","Top","Slope"],                                                           ans: 2 },
    { q: "Identify part of speech for 'quickly' in 'He ran quickly.'",
      opts: ["Noun","Verb","Adjective","Adverb"],                                                    ans: 3 }
];

const COMM_DURATION  = 15 * 60; // 15 minutes
let commAnswers  = new Array(20).fill(null);
let commCurrent  = 0;
let commTimer    = null;
let commWarnings = 0;
let commSubmitted = false;
let commStart    = null;

// ── Anti-cheat ─────────────────────────────────────────────────
function applyCommAntiCheat() {
    document.addEventListener("contextmenu", e => e.preventDefault());
    document.addEventListener("copy",        e => e.preventDefault());
    document.addEventListener("paste",       e => e.preventDefault());
    document.addEventListener("cut",         e => e.preventDefault());

    document.addEventListener("visibilitychange", () => {
        if (commSubmitted || !commStart) return;
        if (document.hidden) {
            commWarnings++;
            document.getElementById("comm-warn-count").textContent = commWarnings;
            if (commWarnings >= 3) {
                autoSubmitComm("Auto Submitted Due To Tab Switching");
            } else {
                alert(`⚠️ Tab Switching Detected! Warning ${commWarnings}/3`);
            }
        }
    });
}

function showCommInstructions() {
    document.getElementById("comm-instructions").style.display = "flex";
    document.getElementById("comm-test-area").style.display    = "none";
    document.getElementById("comm-result-area").style.display  = "none";
}

function startCommTest() {
    commStart = new Date().toISOString();
    document.getElementById("comm-instructions").style.display = "none";
    document.getElementById("comm-test-area").style.display    = "block";

    renderCommQuestion();
    renderCommNav();

    commTimer = createTimer(COMM_DURATION,
        (rem, fmt) => {
            const el = document.getElementById("comm-timer");
            el.textContent = fmt;
            el.className = "timer-display" + (rem <= 300 ? " timer-danger" : "");
        },
        () => autoSubmitComm("Time Expired")
    );
    commTimer.start();
}

function renderCommQuestion() {
    const q  = COMM_QUESTIONS[commCurrent];
    const el = document.getElementById("comm-question-box");
    el.innerHTML = `
        <div class="q-progress">Question ${commCurrent + 1} of ${COMM_QUESTIONS.length}</div>
        <div class="q-text">${q.q}</div>
        <div class="q-options">
            ${q.opts.map((o, i) => `
            <label class="opt-label ${commAnswers[commCurrent] === i ? 'selected' : ''}">
                <input type="radio" name="comm-opt" value="${i}"
                    ${commAnswers[commCurrent] === i ? 'checked' : ''}
                    onchange="selectCommAnswer(${i})">
                <span>${o}</span>
            </label>`).join("")}
        </div>
        <div class="q-nav-btns">
            <button class="btn-nav" onclick="commGo(commCurrent - 1)" ${commCurrent === 0 ? 'disabled' : ''}>◀ Previous</button>
            ${commCurrent < COMM_QUESTIONS.length - 1
                ? `<button class="btn-nav btn-next" onclick="commGo(commCurrent + 1)">Next ▶</button>`
                : `<button class="btn-submit" onclick="confirmSubmitComm()">✅ Submit Test</button>`}
        </div>`;
}

function renderCommNav() {
    const nav = document.getElementById("comm-nav-grid");
    nav.innerHTML = COMM_QUESTIONS.map((_, i) => `
        <button class="nav-btn ${i === commCurrent ? 'nav-current' : ''} ${commAnswers[i] !== null ? 'nav-answered' : ''}"
            onclick="commGo(${i})">${i + 1}</button>`).join("");
}

function selectCommAnswer(idx) {
    commAnswers[commCurrent] = idx;
    renderCommQuestion();
    renderCommNav();
}

function commGo(idx) {
    if (idx < 0 || idx >= COMM_QUESTIONS.length) return;
    commCurrent = idx;
    renderCommQuestion();
    renderCommNav();
}

function confirmSubmitComm() {
    const unanswered = commAnswers.filter(a => a === null).length;
    const msg = unanswered > 0
        ? `You have ${unanswered} unanswered question(s). Submit anyway?`
        : "Submit the test now?";
    if (confirm(msg)) submitCommTest("Completed");
}

function autoSubmitComm(reason) {
    if (commSubmitted) return;
    alert(`⏱ ${reason}. Test is being submitted.`);
    submitCommTest(reason);
}

function submitCommTest(status) {
    if (commSubmitted) return;
    commSubmitted = true;
    commTimer && commTimer.stop();

    let score = 0;
    COMM_QUESTIONS.forEach((q, i) => { if (commAnswers[i] === q.ans) score++; });

    const result = {
        testType:         "Communication",
        score,
        totalQuestions:   COMM_QUESTIONS.length,
        startTime:        commStart,
        endTime:          new Date().toISOString(),
        warningsCount:    commWarnings,
        submissionStatus: status
    };
    localStorage.setItem("commResult", JSON.stringify(result));
    showCommResult(score, status);
}

function showCommResult(score, status) {
    document.getElementById("comm-test-area").style.display   = "none";
    document.getElementById("comm-result-area").style.display = "block";
    const pct = Math.round((score / COMM_QUESTIONS.length) * 100);
    document.getElementById("comm-result-box").innerHTML = `
        <div class="result-circle" style="background:${pct >= 60 ? '#22c55e' : pct >= 40 ? '#f59e0b' : '#ef4444'}">
            <div class="result-score">${score}/${COMM_QUESTIONS.length}</div>
            <div class="result-pct">${pct}%</div>
        </div>
        <h2 style="margin-top:20px">${pct >= 60 ? '🎉 Excellent!' : pct >= 40 ? '👍 Good Effort!' : '📚 Keep Practicing!'}</h2>
        <p class="result-status">Status: <strong>${status}</strong></p>
        <p class="result-warn">Tab Switches: <strong>${commWarnings}</strong></p>
        <button class="btn-go-dash" onclick="location.href='studentdashboard.html'">🏠 Back to Dashboard</button>`;
}

document.addEventListener("DOMContentLoaded", () => {
    applyCommAntiCheat();
    showCommInstructions();
});
