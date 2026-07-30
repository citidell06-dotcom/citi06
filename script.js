(() => {
  const STORAGE_KEY = "study-with-games-v1";
  const XP_PER_QUEST = 20;
  const XP_PER_FOCUS = 25;
  const BASE_XP = 100;

  const els = {
    questForm: document.getElementById("quest-form"),
    questInput: document.getElementById("quest-input"),
    questList: document.getElementById("quest-list"),
    questEmpty: document.getElementById("quest-empty"),
    questCount: document.getElementById("quest-count"),
    levelBadge: document.getElementById("level-badge"),
    xpCurrent: document.getElementById("xp-current"),
    xpNeeded: document.getElementById("xp-needed"),
    xpFill: document.getElementById("xp-fill"),
    xpBarWrap: document.getElementById("xp-bar-wrap"),
    xpHint: document.getElementById("xp-hint"),
    timerDisplay: document.getElementById("timer-display"),
    timerMinutes: document.getElementById("timer-minutes"),
    timerSeconds: document.getElementById("timer-seconds"),
    timerMode: document.getElementById("timer-mode"),
    timerHint: document.getElementById("timer-hint"),
    timerToggle: document.getElementById("timer-toggle"),
    timerReset: document.getElementById("timer-reset"),
    modeButtons: [...document.querySelectorAll(".mode-btn")],
    toast: document.getElementById("toast"),
  };

  const state = loadState() || {
    xp: 0,
    level: 1,
    quests: [],
  };

  let remaining = 25 * 60;
  let totalForMode = 25 * 60;
  let currentMode = "focus";
  let timerId = null;
  let running = false;
  let toastTimer = null;

  function xpForLevel(level) {
    return BASE_XP + (level - 1) * 50;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function saveState() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        xp: state.xp,
        level: state.level,
        quests: state.quests,
      })
    );
  }

  function showToast(message) {
    els.toast.hidden = false;
    els.toast.textContent = message;
    requestAnimationFrame(() => els.toast.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      els.toast.classList.remove("show");
      setTimeout(() => {
        els.toast.hidden = true;
      }, 250);
    }, 2200);
  }

  function addXp(amount, reason) {
    state.xp += amount;
    let leveled = false;

    while (state.xp >= xpForLevel(state.level)) {
      state.xp -= xpForLevel(state.level);
      state.level += 1;
      leveled = true;
    }

    renderXp();
    saveState();

    if (leveled) {
      showToast(`Level up! Now LVL ${state.level}`);
    } else {
      showToast(`+${amount} XP · ${reason}`);
    }
  }

  function renderXp() {
    const needed = xpForLevel(state.level);
    const pct = Math.min(100, Math.round((state.xp / needed) * 100));

    els.levelBadge.textContent = `LVL ${state.level}`;
    els.xpCurrent.textContent = String(state.xp);
    els.xpNeeded.textContent = String(needed);
    els.xpFill.style.width = `${pct}%`;
    els.xpBarWrap.setAttribute("aria-valuenow", String(pct));
    els.xpBarWrap.setAttribute("aria-valuemax", "100");
    els.xpHint.textContent =
      state.level === 1 && state.xp === 0
        ? "Complete quests and focus sessions to earn XP."
        : `${needed - state.xp} XP to reach LVL ${state.level + 1}.`;
  }

  function renderQuests() {
    els.questList.innerHTML = "";
    const active = state.quests.filter((q) => !q.done).length;
    els.questCount.textContent = `${active} active`;
    els.questEmpty.hidden = state.quests.length > 0;

    state.quests.forEach((quest) => {
      const li = document.createElement("li");
      li.className = `quest-item${quest.done ? " done" : ""}`;
      li.dataset.id = quest.id;

      const check = document.createElement("input");
      check.type = "checkbox";
      check.className = "quest-check";
      check.checked = quest.done;
      check.setAttribute("aria-label", `Complete ${quest.text}`);

      const text = document.createElement("span");
      text.className = "quest-text";
      text.textContent = quest.text;

      const xpTag = document.createElement("span");
      xpTag.className = "quest-xp";
      xpTag.textContent = `+${XP_PER_QUEST}`;

      const del = document.createElement("button");
      del.type = "button";
      del.className = "quest-delete";
      del.setAttribute("aria-label", `Delete ${quest.text}`);
      del.textContent = "×";

      check.addEventListener("change", () => toggleQuest(quest.id));
      del.addEventListener("click", () => deleteQuest(quest.id));

      li.append(check, text, xpTag, del);
      els.questList.appendChild(li);
    });
  }

  function addQuest(text) {
    state.quests.unshift({
      id: crypto.randomUUID(),
      text,
      done: false,
    });
    renderQuests();
    saveState();
  }

  function toggleQuest(id) {
    const quest = state.quests.find((q) => q.id === id);
    if (!quest) return;

    if (!quest.done) {
      quest.done = true;
      renderQuests();
      addXp(XP_PER_QUEST, "Quest cleared");
    } else {
      quest.done = false;
      renderQuests();
      saveState();
    }
  }

  function deleteQuest(id) {
    state.quests = state.quests.filter((q) => q.id !== id);
    renderQuests();
    saveState();
  }

  function formatTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return {
      minutes: String(m).padStart(2, "0"),
      seconds: String(s).padStart(2, "0"),
    };
  }

  function renderTimer() {
    const { minutes, seconds } = formatTime(remaining);
    els.timerMinutes.textContent = minutes;
    els.timerSeconds.textContent = seconds;
    els.timerToggle.textContent = running ? "Pause" : remaining < totalForMode ? "Resume" : "Start";
    els.timerDisplay.classList.toggle("running", running);

    const labels = { focus: "Focus", short: "Short Break", long: "Long Break" };
    els.timerMode.textContent = labels[currentMode] || "Focus";
    els.timerHint.textContent =
      currentMode === "focus"
        ? "Finish a focus session for +25 XP."
        : "Take a break — then jump back in.";
  }

  function stopTimer() {
    clearInterval(timerId);
    timerId = null;
    running = false;
  }

  function tick() {
    if (remaining <= 0) {
      stopTimer();
      remaining = 0;
      renderTimer();

      if (currentMode === "focus") {
        addXp(XP_PER_FOCUS, "Focus complete");
      } else {
        showToast("Break over — back to it!");
      }
      return;
    }

    remaining -= 1;
    renderTimer();
  }

  function startTimer() {
    if (running) return;
    running = true;
    renderTimer();
    timerId = setInterval(tick, 1000);
  }

  function pauseTimer() {
    stopTimer();
    renderTimer();
  }

  function resetTimer() {
    stopTimer();
    remaining = totalForMode;
    renderTimer();
  }

  function setMode(mode, seconds) {
    stopTimer();
    currentMode = mode;
    totalForMode = seconds;
    remaining = seconds;

    els.modeButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.mode === mode);
    });

    renderTimer();
  }

  els.questForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = els.questInput.value.trim();
    if (!text) return;
    addQuest(text);
    els.questInput.value = "";
    els.questInput.focus();
  });

  els.timerToggle.addEventListener("click", () => {
    if (running) pauseTimer();
    else startTimer();
  });

  els.timerReset.addEventListener("click", resetTimer);

  els.modeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      setMode(btn.dataset.mode, Number(btn.dataset.seconds));
    });
  });

  renderXp();
  renderQuests();
  renderTimer();
})();
