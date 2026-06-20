// Shared countdown timer utility
function createTimer(totalSeconds, onTick, onExpire) {
    let remaining = totalSeconds;
    let interval = null;

    function fmt(s) {
        const m = String(Math.floor(s / 60)).padStart(2, "0");
        const sec = String(s % 60).padStart(2, "0");
        return `${m}:${sec}`;
    }

    function start() {
        interval = setInterval(() => {
            remaining--;
            onTick(remaining, fmt(remaining));
            if (remaining <= 0) { clearInterval(interval); onExpire(); }
        }, 1000);
        onTick(remaining, fmt(remaining)); // immediate render
    }

    function stop() { clearInterval(interval); }
    function get()  { return remaining; }

    return { start, stop, get, fmt };
}
