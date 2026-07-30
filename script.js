(() => {
  const STORAGE_KEY = "study-with-games-v1";
  const XP_PER_FOCUS = 25;
  const BASE_XP = 100;
  const MAX_LEVEL = 100;

  const DIFFICULTY = {
    easy: { xp: 15, label: "Easy" },
    medium: { xp: 30, label: "Medium" },
    hard: { xp: 45, label: "Hard" },
  };

  const RARITY_COST = {
    common: 2,
    rare: 3,
    epic: 6,
    legendary: 9,
  };

  const THEMES = [
    {
      id: "sunset",
      name: "Sunset",
      rarity: "common",
      cost: RARITY_COST.common,
      desc: "Golden sun over sea, clouds, and silhouettes.",
    },
    {
      id: "blackhole",
      name: "TON 618",
      rarity: "epic",
      cost: RARITY_COST.epic,
      desc: "The ultramassive black hole — blazing accretion disk.",
    },
    {
      id: "mario",
      name: "Mario World",
      rarity: "legendary",
      cost: RARITY_COST.legendary,
      desc: "Pipes, blocks, bushes, and classic side-scroll vibes.",
    },
  ];

  const GAMES = [
    {
      id: "arkanoid",
      name: "Arkanoid",
      rarity: "rare",
      cost: RARITY_COST.rare,
      desc: "Break bricks with the paddle.",
      help: "← → or A/D move · click/tap also works",
    },
    {
      id: "galaga",
      name: "Galaga",
      rarity: "epic",
      cost: RARITY_COST.epic,
      desc: "Blast waves of invaders.",
      help: "← → move · Space / tap to shoot · +guns every 100 pts",
    },
    {
      id: "tetris",
      name: "Tetris",
      rarity: "legendary",
      cost: RARITY_COST.legendary,
      desc: "Classic stack-and-clear blocks.",
      help: "← → move · ↑ rotate · ↓ soft drop · Space hard drop",
    },
    {
      id: "mario2d",
      name: "Mario 2D",
      rarity: "legendary",
      cost: RARITY_COST.legendary,
      desc: "Old-school run and jump side-scroller.",
      help: "← → move · ↑ / Space jump · stomp foes · reach the flag!",
    },
  ];

  const STUDY_RANKS = [
    { id: "noob", label: "Noob", minMinutes: 0 },
    { id: "beginner", label: "Beginner", minMinutes: 30 },
    { id: "pro", label: "Pro", minMinutes: 60 },
    { id: "master", label: "Master", minMinutes: 90 },
    { id: "grandmaster", label: "Grandmaster", minMinutes: 120 },
  ];
  const REST_SECONDS = 5 * 60;
  const STREAK_STAGES = [
    { id: "child", label: "Spark", minDays: 0 },
    { id: "teen", label: "Ember Kid", minDays: 10 },
    { id: "adult", label: "Flame", minDays: 20 },
    { id: "elder", label: "Blaze", minDays: 30 },
    { id: "legend", label: "Inferno", minDays: 40 },
  ];

  const THEME_IDS = new Set(THEMES.map((t) => t.id));
  const GAME_IDS = new Set(GAMES.map((g) => g.id));

  const ENEMY_FORMS = [
    {
      name: "Sloth Imp",
      svg: `
        <ellipse class="enemy-shadow" cx="32" cy="56" rx="14" ry="3.5"/>
        <path class="enemy-body" d="M20 40c0-11 5-20 12-20s12 9 12 20c0 7-4 12-12 12s-12-5-12-12z"/>
        <circle class="enemy-eye" cx="27" cy="35" r="4.5"/><circle class="enemy-eye" cx="37" cy="35" r="4.5"/>
        <circle class="enemy-pupil" cx="28" cy="36" r="1.8"/><circle class="enemy-pupil" cx="38" cy="36" r="1.8"/>
        <path class="enemy-horn" d="M22 24l-4-8 8 3z"/><path class="enemy-horn" d="M42 24l4-8-8 3z"/>
        <path class="enemy-mouth" d="M27 44h10l-1.5 2.5h-7z"/>
        <path class="enemy-phase-extra enemy-spike" d="M32 14l2.5 6h-5z"/>
        <path class="enemy-phase-extra enemy-claw" d="M18 46l-5 4 6-1z"/>
        <path class="enemy-phase-extra enemy-claw" d="M46 46l5 4-6-1z"/>
      `,
    },
    {
      name: "Distraction Sprite",
      svg: `
        <ellipse class="enemy-shadow" cx="32" cy="56" rx="15" ry="3.5"/>
        <path class="enemy-body" d="M16 38c2-14 10-22 16-22s14 8 16 22c1 8-5 14-16 14s-17-6-16-14z"/>
        <path class="enemy-accent" d="M18 28c-6-2-8-10-4-14 4 3 7 8 4 14z"/>
        <path class="enemy-accent" d="M46 28c6-2 8-10 4-14-4 3-7 8-4 14z"/>
        <circle class="enemy-eye" cx="26" cy="34" r="5"/><circle class="enemy-eye" cx="38" cy="34" r="5"/>
        <circle class="enemy-pupil" cx="27" cy="35" r="2"/><circle class="enemy-pupil" cx="39" cy="35" r="2"/>
        <path class="enemy-mouth" d="M28 44h8v2h-8z"/>
        <circle class="enemy-phase-extra enemy-aura" cx="32" cy="34" r="18"/>
        <path class="enemy-phase-extra enemy-spike" d="M32 10l3 7h-6z"/>
      `,
    },
    {
      name: "Scroll Wraith",
      svg: `
        <ellipse class="enemy-shadow" cx="32" cy="56" rx="13" ry="3"/>
        <path class="enemy-body" d="M24 18h16c3 0 5 3 5 6v20c0 8-5 14-13 14s-13-6-13-14V24c0-3 2-6 5-6z"/>
        <path class="enemy-accent" d="M22 22h20v3H22z"/><path class="enemy-accent" d="M22 30h20v2H22z"/>
        <circle class="enemy-eye" cx="27" cy="40" r="3.5"/><circle class="enemy-eye" cx="37" cy="40" r="3.5"/>
        <circle class="enemy-pupil" cx="27" cy="40" r="1.4"/><circle class="enemy-pupil" cx="37" cy="40" r="1.4"/>
        <path class="enemy-phase-extra enemy-horn" d="M20 16l-6-8 9 4z"/>
        <path class="enemy-phase-extra enemy-horn" d="M44 16l6-8-9 4z"/>
        <path class="enemy-phase-extra enemy-armor" d="M26 48h12l-2 4H28z"/>
      `,
    },
    {
      name: "Deadline Drake",
      svg: `
        <ellipse class="enemy-shadow" cx="32" cy="56" rx="16" ry="3.5"/>
        <path class="enemy-body" d="M14 42c2-16 10-26 18-26s16 10 18 26c1 8-6 14-18 14S13 50 14 42z"/>
        <path class="enemy-accent" d="M12 34l-8-2 8-4z"/><path class="enemy-accent" d="M52 34l8-2-8-4z"/>
        <path class="enemy-horn" d="M22 18l-5-12 10 5z"/><path class="enemy-horn" d="M42 18l5-12-10 5z"/>
        <circle class="enemy-eye" cx="26" cy="34" r="5"/><circle class="enemy-eye" cx="38" cy="34" r="5"/>
        <circle class="enemy-pupil" cx="27" cy="35" r="2"/><circle class="enemy-pupil" cx="39" cy="35" r="2"/>
        <path class="enemy-mouth" d="M26 45h12l-3 4h-6z"/>
        <path class="enemy-phase-extra enemy-spike" d="M32 8l3.5 8h-7z"/>
        <path class="enemy-phase-extra enemy-claw" d="M18 50l-6 5 8-2z"/><path class="enemy-phase-extra enemy-claw" d="M46 50l6 5-8-2z"/>
      `,
    },
    {
      name: "Procrastibat",
      svg: `
        <ellipse class="enemy-shadow" cx="32" cy="56" rx="15" ry="3"/>
        <path class="enemy-accent" d="M8 30c8-2 14 2 18 10L20 44C12 40 6 36 8 30z"/>
        <path class="enemy-accent" d="M56 30c-8-2-14 2-18 10l6 4c8-4 14-8 12-14z"/>
        <path class="enemy-body" d="M22 28c0-10 4-16 10-16s10 6 10 16c0 10-3 18-10 18s-10-8-10-18z"/>
        <path class="enemy-horn" d="M24 16l-3-8 7 3z"/><path class="enemy-horn" d="M40 16l3-8-7 3z"/>
        <circle class="enemy-eye" cx="28" cy="30" r="4"/><circle class="enemy-eye" cx="36" cy="30" r="4"/>
        <circle class="enemy-pupil" cx="29" cy="31" r="1.6"/><circle class="enemy-pupil" cx="37" cy="31" r="1.6"/>
        <path class="enemy-mouth" d="M29 40h6l-1 2h-4z"/>
        <circle class="enemy-phase-extra enemy-aura" cx="32" cy="32" r="20"/>
        <path class="enemy-phase-extra enemy-spike" d="M32 6l2.5 6h-5z"/>
      `,
    },
    {
      name: "Focus Phantom",
      svg: `
        <ellipse class="enemy-shadow" cx="32" cy="56" rx="12" ry="3"/>
        <path class="enemy-body" d="M20 20c0-6 5-12 12-12s12 6 12 12c0 4-1 8-1 12 2 6 4 12-11 18-15-6-13-12-11-18 0-4-1-8-1-12z"/>
        <circle class="enemy-eye" cx="27" cy="24" r="4"/><circle class="enemy-eye" cx="37" cy="24" r="4"/>
        <circle class="enemy-pupil" cx="27" cy="24" r="1.6"/><circle class="enemy-pupil" cx="37" cy="24" r="1.6"/>
        <path class="enemy-mouth" d="M28 34h8v2h-8z"/>
        <path class="enemy-phase-extra enemy-armor" d="M24 16h16v3H24z"/>
        <path class="enemy-phase-extra enemy-horn" d="M18 18l-7-6 9 2z"/><path class="enemy-phase-extra enemy-horn" d="M46 18l7-6-9 2z"/>
        <circle class="enemy-phase-extra enemy-aura" cx="32" cy="28" r="17"/>
      `,
    },
    {
      name: "Cram Goblin",
      svg: `
        <ellipse class="enemy-shadow" cx="32" cy="56" rx="15" ry="3.5"/>
        <path class="enemy-body" d="M18 36c0-12 6-20 14-20s14 8 14 20c0 10-5 16-14 16s-14-6-14-16z"/>
        <path class="enemy-accent" d="M16 40h32v6c0 4-7 8-16 8s-16-4-16-8z"/>
        <circle class="enemy-eye" cx="26" cy="32" r="5"/><circle class="enemy-eye" cx="38" cy="32" r="5"/>
        <circle class="enemy-pupil" cx="27" cy="33" r="2"/><circle class="enemy-pupil" cx="39" cy="33" r="2"/>
        <path class="enemy-horn" d="M22 18l-6-10 10 4z"/><path class="enemy-horn" d="M42 18l6-10-10 4z"/>
        <path class="enemy-mouth" d="M26 42h12l-2 3h-8z"/>
        <path class="enemy-phase-extra enemy-spike" d="M28 10l2 5h-4z"/><path class="enemy-phase-extra enemy-spike" d="M36 10l2 5h-4z"/>
        <path class="enemy-phase-extra enemy-claw" d="M17 48l-5 5 7-1z"/><path class="enemy-phase-extra enemy-claw" d="M47 48l5 5-7-1z"/>
      `,
    },
    {
      name: "Burnout Beast",
      svg: `
        <ellipse class="enemy-shadow" cx="32" cy="56" rx="17" ry="3.5"/>
        <path class="enemy-body" d="M12 40c1-14 9-24 20-24s19 10 20 24c1 9-7 15-20 15S11 49 12 40z"/>
        <path class="enemy-armor" d="M18 28h28l-2 8H20z"/>
        <circle class="enemy-eye" cx="24" cy="36" r="5.5"/><circle class="enemy-eye" cx="40" cy="36" r="5.5"/>
        <circle class="enemy-pupil" cx="25" cy="37" r="2.2"/><circle class="enemy-pupil" cx="41" cy="37" r="2.2"/>
        <path class="enemy-horn" d="M18 16l-8-12 14 5z"/><path class="enemy-horn" d="M46 16l8-12-14 5z"/>
        <path class="enemy-mouth" d="M24 46h16l-3 4H27z"/>
        <path class="enemy-phase-extra enemy-spike" d="M32 6l4 9h-8z"/>
        <path class="enemy-phase-extra enemy-claw" d="M14 48l-7 6 10-2z"/><path class="enemy-phase-extra enemy-claw" d="M50 48l7 6-10-2z"/>
        <circle class="enemy-phase-extra enemy-aura" cx="32" cy="36" r="22"/>
      `,
    },
    {
      name: "Void Tutor",
      svg: `
        <ellipse class="enemy-shadow" cx="32" cy="56" rx="14" ry="3"/>
        <circle class="enemy-body" cx="32" cy="32" r="16"/>
        <path class="enemy-accent" d="M32 12l3 8h-6z"/><path class="enemy-accent" d="M16 32l8 3v-6z"/><path class="enemy-accent" d="M48 32l-8 3v-6z"/>
        <circle class="enemy-eye" cx="26" cy="30" r="4.5"/><circle class="enemy-eye" cx="38" cy="30" r="4.5"/>
        <circle class="enemy-pupil" cx="26" cy="30" r="1.8"/><circle class="enemy-pupil" cx="38" cy="30" r="1.8"/>
        <path class="enemy-mouth" d="M27 40h10l-2 3h-6z"/>
        <circle class="enemy-phase-extra enemy-aura" cx="32" cy="32" r="21"/>
        <path class="enemy-phase-extra enemy-horn" d="M20 14l-8-8 12 3z"/><path class="enemy-phase-extra enemy-horn" d="M44 14l8-8-12 3z"/>
      `,
    },
    {
      name: "Final Boss",
      svg: `
        <ellipse class="enemy-shadow" cx="32" cy="56" rx="18" ry="4"/>
        <path class="enemy-body" d="M10 40c2-18 12-28 22-28s20 10 22 28c1 10-8 16-22 16S9 50 10 40z"/>
        <path class="enemy-armor" d="M16 26h32l-3 10H19z"/>
        <path class="enemy-horn" d="M16 14l-10-12 16 5z"/><path class="enemy-horn" d="M48 14l10-12-16 5z"/>
        <path class="enemy-spike" d="M32 4l5 11h-10z"/>
        <circle class="enemy-eye" cx="24" cy="34" r="6"/><circle class="enemy-eye" cx="40" cy="34" r="6"/>
        <circle class="enemy-pupil" cx="25" cy="35" r="2.4"/><circle class="enemy-pupil" cx="41" cy="35" r="2.4"/>
        <path class="enemy-mouth" d="M22 46h20l-4 5H26z"/>
        <circle class="enemy-phase-extra enemy-aura" cx="32" cy="34" r="24"/>
        <path class="enemy-phase-extra enemy-claw" d="M12 50l-8 7 12-2z"/><path class="enemy-phase-extra enemy-claw" d="M52 50l8 7-12-2z"/>
        <path class="enemy-phase-extra enemy-spike" d="M26 8l2.5 6h-5z"/><path class="enemy-phase-extra enemy-spike" d="M38 8l2.5 6h-5z"/>
      `,
    },
  ];

  function enemyFormIndex(level) {
    return Math.min(ENEMY_FORMS.length, Math.max(1, Math.ceil(level / 10)));
  }

  /** 0 = base look, 1 = mid-form upgrade every 5 levels within a decade */
  function enemyPhase(level) {
    return (level - 1) % 10 >= 5 ? 1 : 0;
  }

  function enemyNameForLevel(level) {
    if (level >= MAX_LEVEL) return "Final Boss";
    const form = enemyFormIndex(level);
    const base = ENEMY_FORMS[form - 1].name;
    const phase = enemyPhase(level);
    if (phase === 1) return `${base}+`;
    return base;
  }

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
    enemy: document.getElementById("enemy"),
    enemySvg: document.getElementById("enemy-svg"),
    enemyName: document.getElementById("enemy-name"),
    enemyPower: document.getElementById("enemy-power"),
    enemyAtkFill: document.getElementById("enemy-atk-fill"),
    enemyHpFill: document.getElementById("enemy-hp-fill"),
    timerDisplay: document.getElementById("timer-display"),
    timerMinutes: document.getElementById("timer-minutes"),
    timerSeconds: document.getElementById("timer-seconds"),
    timerMode: document.getElementById("timer-mode"),
    timerHint: document.getElementById("timer-hint"),
    timerToggle: document.getElementById("timer-toggle"),
    timerReset: document.getElementById("timer-reset"),
    modeButtons: [...document.querySelectorAll(".mode-btn")],
    toast: document.getElementById("toast"),
    tokenCount: document.getElementById("token-count"),
    themeShop: document.getElementById("theme-shop"),
    gameShop: document.getElementById("game-shop"),
    rewardModal: document.getElementById("reward-modal"),
    rewardGames: document.getElementById("reward-games"),
    rewardClose: document.getElementById("reward-close"),
    rewardSkip: document.getElementById("reward-skip"),
    rewardCopy: document.getElementById("reward-copy"),
    gameModal: document.getElementById("game-modal"),
    gameTitle: document.getElementById("game-title"),
    gameScore: document.getElementById("game-score"),
    gameHelp: document.getElementById("game-help"),
    gameCanvas: document.getElementById("game-canvas"),
    gameClose: document.getElementById("game-close"),
    gameRestart: document.getElementById("game-restart"),
    gameQuit: document.getElementById("game-quit"),
    streakDays: document.getElementById("streak-days"),
    streakStage: document.getElementById("streak-stage"),
    streakFire: document.getElementById("streak-fire"),
    studyRank: document.getElementById("study-rank"),
    studyHours: document.getElementById("study-hours"),
    studyFill: document.getElementById("study-fill"),
    studyBarWrap: document.getElementById("study-bar-wrap"),
    studyHint: document.getElementById("study-hint"),
    questsCompleted: document.getElementById("quests-completed"),
    restMinutes: document.getElementById("rest-minutes"),
    restSeconds: document.getElementById("rest-seconds"),
    completedList: document.getElementById("completed-list"),
    completedEmpty: document.getElementById("completed-empty"),
    questPanelActive: document.getElementById("quest-panel-active"),
    questPanelCompleted: document.getElementById("quest-panel-completed"),
    questTabs: [...document.querySelectorAll(".quest-tab")],
  };

  function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function daysBetween(a, b) {
    const ms = Date.parse(`${b}T00:00:00`) - Date.parse(`${a}T00:00:00`);
    return Math.round(ms / 86400000);
  }

  function computeStreak(loadedStreak) {
    const today = todayKey();
    let streak = Math.max(0, loadedStreak?.streakDays ?? 0);
    const last = loadedStreak?.lastActiveDate || null;

    if (!last) {
      streak = 1;
    } else {
      const gap = daysBetween(last, today);
      if (gap === 0) {
        // same day — keep streak
      } else if (gap === 1) {
        streak += 1;
      } else if (gap > 1) {
        streak = 1;
      }
    }

    return { streakDays: streak, lastActiveDate: today };
  }

  const loaded = loadState();
  const startLevel = Math.min(MAX_LEVEL, Math.max(1, loaded?.level ?? 1));
  const streakInit = computeStreak(loaded);
  const state = {
    xp: loaded?.xp ?? 0,
    level: startLevel,
    quests: normalizeQuests(loaded?.quests),
    tokens:
      loaded?.tokens != null
        ? Math.max(0, loaded.tokens)
        : Math.max(0, startLevel - 1),
    ownedThemes: Array.isArray(loaded?.ownedThemes)
      ? loaded.ownedThemes.filter((id) => THEME_IDS.has(id))
      : [],
    ownedGames: Array.isArray(loaded?.ownedGames)
      ? loaded.ownedGames.filter((id) => GAME_IDS.has(id))
      : [],
    activeTheme: THEME_IDS.has(loaded?.activeTheme) ? loaded.activeTheme : null,
    studySeconds: Math.max(0, loaded?.studySeconds ?? 0),
    questsCompleted: Math.max(0, loaded?.questsCompleted ?? 0),
    completedLog: Array.isArray(loaded?.completedLog) ? loaded.completedLog : [],
    streakDays: streakInit.streakDays,
    lastActiveDate: streakInit.lastActiveDate,
  };

  function normalizeQuests(quests) {
    if (!Array.isArray(quests)) return [];
    return quests.map((q) => ({
      ...q,
      difficulty: DIFFICULTY[q.difficulty] ? q.difficulty : "medium",
    }));
  }

  function questXp(difficulty) {
    return (DIFFICULTY[difficulty] || DIFFICULTY.medium).xp;
  }

  let remaining = 25 * 60;
  let totalForMode = 25 * 60;
  let currentMode = "focus";
  let timerId = null;
  let running = false;
  let toastTimer = null;
  let audioCtx = null;

  function getAudioCtx() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!audioCtx) audioCtx = new AC();
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }

  function tone(ctx, { freq, type = "sine", start, dur, gain = 0.08, attack = 0.01, release = 0.08 }) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(gain, start + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, start + Math.max(attack + 0.01, dur - release));
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + dur + 0.02);
  }

  /** Soft UI “item added” pop */
  function playAddSound() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    tone(ctx, { freq: 520, type: "triangle", start: t, dur: 0.09, gain: 0.07, attack: 0.005, release: 0.06 });
    tone(ctx, { freq: 780, type: "sine", start: t + 0.04, dur: 0.1, gain: 0.05, attack: 0.005, release: 0.07 });
  }

  /** Easy complete — soft two-note ding */
  function playEasyCompleteSound() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    tone(ctx, { freq: 440, type: "sine", start: t, dur: 0.16, gain: 0.06, attack: 0.01, release: 0.1 });
    tone(ctx, { freq: 554.37, type: "triangle", start: t + 0.08, dur: 0.18, gain: 0.05, attack: 0.01, release: 0.1 });
  }

  /** Medium complete — brighter three-note chime */
  function playMediumCompleteSound() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      tone(ctx, {
        freq,
        type: "triangle",
        start: t + i * 0.07,
        dur: 0.22,
        gain: 0.07 - i * 0.01,
        attack: 0.01,
        release: 0.12,
      });
    });
  }

  /** Hard complete — punchy fanfare */
  function playHardCompleteSound() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const notes = [392, 523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      tone(ctx, {
        freq,
        type: i % 2 === 0 ? "square" : "triangle",
        start: t + i * 0.065,
        dur: 0.26,
        gain: 0.045,
        attack: 0.008,
        release: 0.12,
      });
      tone(ctx, {
        freq: freq * 2,
        type: "sine",
        start: t + i * 0.065,
        dur: 0.26,
        gain: 0.02,
        attack: 0.008,
        release: 0.12,
      });
    });
  }

  function playCompleteSound(difficulty) {
    if (difficulty === "hard") playHardCompleteSound();
    else if (difficulty === "medium") playMediumCompleteSound();
    else playEasyCompleteSound();
  }

  /** Classic “time’s up / stop” alarm bell */
  function playStopAlarmSound() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const t = ctx.currentTime;

    for (let i = 0; i < 3; i++) {
      const start = t + i * 0.38;
      tone(ctx, {
        freq: 880,
        type: "square",
        start,
        dur: 0.22,
        gain: 0.07,
        attack: 0.005,
        release: 0.12,
      });
      tone(ctx, {
        freq: 1174.66,
        type: "square",
        start,
        dur: 0.22,
        gain: 0.045,
        attack: 0.005,
        release: 0.12,
      });
      tone(ctx, {
        freq: 440,
        type: "triangle",
        start: start + 0.05,
        dur: 0.18,
        gain: 0.04,
        attack: 0.005,
        release: 0.1,
      });
    }
  }

  /** Minecraft-style XP / level-up sparkle when the bar fills */
  function playMinecraftXpSound() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const t = ctx.currentTime;

    // Short orb-like sparkles (classic XP pickup vibe)
    const orbPitches = [1200, 1400, 1600, 1800, 2000];
    orbPitches.forEach((freq, i) => {
      tone(ctx, {
        freq,
        type: "sine",
        start: t + i * 0.045,
        dur: 0.12,
        gain: 0.045,
        attack: 0.005,
        release: 0.08,
      });
    });

    // Ascending level-up flourish
    const levelNotes = [523.25, 659.25, 783.99, 1046.5];
    levelNotes.forEach((freq, i) => {
      tone(ctx, {
        freq,
        type: "square",
        start: t + 0.18 + i * 0.09,
        dur: 0.28,
        gain: 0.035,
        attack: 0.01,
        release: 0.14,
      });
      tone(ctx, {
        freq: freq * 2,
        type: "sine",
        start: t + 0.18 + i * 0.09,
        dur: 0.28,
        gain: 0.02,
        attack: 0.01,
        release: 0.14,
      });
    });
  }

  function xpForLevel(level) {
    return BASE_XP + (level - 1) * 50;
  }

  function enemyStats(level) {
    const lvl = Math.min(MAX_LEVEL, Math.max(1, level));
    const form = enemyFormIndex(lvl);
    const phase = enemyPhase(lvl);
    return {
      name: enemyNameForLevel(lvl),
      power: 10 + lvl * 3 + phase * 8 + (form - 1) * 5,
      atk: 8 + lvl * 2 + phase * 6,
      hp: 20 + lvl * 4 + phase * 10,
      scale: 0.88 + form * 0.055 + phase * 0.06,
      form,
      phase,
    };
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
        tokens: state.tokens,
        ownedThemes: state.ownedThemes,
        ownedGames: state.ownedGames,
        activeTheme: state.activeTheme,
        studySeconds: state.studySeconds,
        questsCompleted: state.questsCompleted,
        completedLog: state.completedLog,
        streakDays: state.streakDays,
        lastActiveDate: state.lastActiveDate,
      })
    );
  }

  function streakStageFor(days) {
    let stage = STREAK_STAGES[0];
    for (const s of STREAK_STAGES) {
      if (days >= s.minDays) stage = s;
    }
    return stage;
  }

  function studyRankFor(minutes) {
    let rank = STUDY_RANKS[0];
    for (const r of STUDY_RANKS) {
      if (minutes >= r.minMinutes) rank = r;
    }
    return rank;
  }

  function renderStreak() {
    const stage = streakStageFor(state.streakDays);
    els.streakDays.textContent = String(state.streakDays);
    els.streakStage.textContent = stage.label;
    els.streakFire.dataset.stage = stage.id;
  }

  function renderStudyStats() {
    const minutes = state.studySeconds / 60;
    const hours = state.studySeconds / 3600;
    const rank = studyRankFor(minutes);
    const rankIndex = STUDY_RANKS.findIndex((r) => r.id === rank.id);
    const next = STUDY_RANKS[rankIndex + 1];
    const floor = rank.minMinutes;
    const ceiling = next ? next.minMinutes : floor + 30;
    const pct = next
      ? Math.min(100, Math.round(((minutes - floor) / (ceiling - floor)) * 100))
      : 100;

    els.studyHours.textContent = `${hours.toFixed(1)} hours studied`;
    els.studyRank.textContent = rank.label;
    els.studyFill.style.width = `${pct}%`;
    els.studyBarWrap.setAttribute("aria-valuenow", String(pct));
    els.questsCompleted.textContent = String(state.questsCompleted);

    if (next) {
      const remain = Math.max(0, ceiling - minutes);
      els.studyHint.textContent = `${remain.toFixed(0)} min to ${next.label} · ranks every 30 min`;
    } else {
      els.studyHint.textContent = "Grandmaster reached — keep stacking hours.";
    }
  }

  function addStudySeconds(seconds) {
    if (seconds <= 0) return;
    const before = studyRankFor(state.studySeconds / 60);
    state.studySeconds += seconds;
    const after = studyRankFor(state.studySeconds / 60);
    renderStudyStats();
    saveState();
    if (before.id !== after.id) {
      showToast(`Rank up! ${after.label}`);
    }
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
    if (state.level >= MAX_LEVEL) {
      state.xp = xpForLevel(MAX_LEVEL);
      renderXp();
      saveState();
      showToast("Max level — foe is at full power");
      return;
    }

    state.xp += amount;
    let leveled = false;
    let levelsGained = 0;

    while (state.level < MAX_LEVEL && state.xp >= xpForLevel(state.level)) {
      state.xp -= xpForLevel(state.level);
      state.level += 1;
      leveled = true;
      levelsGained += 1;
    }

    if (state.level >= MAX_LEVEL) {
      state.level = MAX_LEVEL;
      state.xp = Math.min(state.xp, xpForLevel(MAX_LEVEL));
    }

    if (levelsGained > 0) {
      state.tokens += levelsGained;
    }

    renderXp();
    renderTokens();
    renderShop();
    saveState();

    if (leveled) {
      playMinecraftXpSound();
      const foe = enemyStats(state.level);
      const tokenNote = levelsGained === 1 ? "+1 token" : `+${levelsGained} tokens`;
      if (state.level >= MAX_LEVEL) {
        showToast(`LVL ${MAX_LEVEL}! Final Boss · ${tokenNote}`);
      } else if (state.level % 10 === 1 && state.level > 1) {
        showToast(`New foe! ${foe.name} · ${tokenNote}`);
      } else if (enemyPhase(state.level) === 1 && (state.level - 1) % 10 === 5) {
        showToast(`${foe.name} evolved! · ${tokenNote}`);
      } else {
        showToast(
          levelsGained > 1
            ? `Leveled ×${levelsGained}! ${tokenNote}`
            : `Level up! ${tokenNote}`
        );
      }
    } else {
      showToast(`+${amount} XP · ${reason}`);
    }
  }

  let lastEnemyKey = "";

  function renderEnemy() {
    const stats = enemyStats(state.level);
    const maxAtk = 8 + MAX_LEVEL * 2 + 6;
    const maxHp = 20 + MAX_LEVEL * 4 + 10;
    const atkPct = Math.round((stats.atk / maxAtk) * 100);
    const hpPct = Math.round((stats.hp / maxHp) * 100);
    const enemyKey = `${stats.form}-${stats.phase}`;
    const changed = lastEnemyKey && lastEnemyKey !== enemyKey;

    els.enemy.dataset.form = String(stats.form);
    els.enemy.dataset.phase = String(stats.phase);
    els.enemy.classList.toggle("maxed", state.level >= MAX_LEVEL);
    els.enemy.style.setProperty("--enemy-scale", String(stats.scale));
    els.enemySvg.innerHTML = ENEMY_FORMS[stats.form - 1].svg;
    els.enemy.setAttribute(
      "aria-label",
      `${stats.name}, power ${stats.power}, attack ${stats.atk}, hp ${stats.hp}`
    );
    els.enemyName.textContent = stats.name;
    els.enemyPower.textContent = `PWR ${stats.power}`;
    els.enemyAtkFill.style.width = `${atkPct}%`;
    els.enemyHpFill.style.width = `${hpPct}%`;

    if (changed) {
      els.enemy.classList.remove("evolve-flash");
      // retrigger animation
      void els.enemy.offsetWidth;
      els.enemy.classList.add("evolve-flash");
      window.clearTimeout(renderEnemy._flashTimer);
      renderEnemy._flashTimer = window.setTimeout(() => {
        els.enemy.classList.remove("evolve-flash");
      }, 560);
    }
    lastEnemyKey = enemyKey;
  }

  function renderXp() {
    const atMax = state.level >= MAX_LEVEL;
    const needed = xpForLevel(state.level);
    const pct = atMax
      ? 100
      : Math.min(100, Math.round((state.xp / needed) * 100));

    els.levelBadge.textContent = `LVL ${state.level} / ${MAX_LEVEL}`;
    els.xpCurrent.textContent = String(atMax ? needed : state.xp);
    els.xpNeeded.textContent = String(needed);
    els.xpFill.style.width = `${pct}%`;
    els.xpBarWrap.setAttribute("aria-valuenow", String(pct));
    els.xpBarWrap.setAttribute("aria-valuemax", "100");

    if (atMax) {
      els.xpHint.textContent = "Max level reached. The Final Boss is at full power.";
    } else if (state.level === 1 && state.xp === 0) {
      els.xpHint.textContent = "Complete quests and focus sessions to earn XP.";
    } else {
      els.xpHint.textContent = `${needed - state.xp} XP to reach LVL ${state.level + 1}.`;
    }

    renderEnemy();
  }

  function renderQuests() {
    els.questList.innerHTML = "";
    const activeQuests = state.quests.filter((q) => !q.done);
    els.questCount.textContent = `${activeQuests.length} active`;
    els.questEmpty.hidden = activeQuests.length > 0;

    activeQuests.forEach((quest) => {
      const difficulty = DIFFICULTY[quest.difficulty] ? quest.difficulty : "medium";
      const xp = questXp(difficulty);
      const li = document.createElement("li");
      li.className = `quest-item ${difficulty}`;
      li.dataset.id = quest.id;

      const check = document.createElement("input");
      check.type = "checkbox";
      check.className = "quest-check";
      check.checked = false;
      check.setAttribute("aria-label", `Complete ${quest.text}`);

      const text = document.createElement("span");
      text.className = "quest-text";
      text.textContent = quest.text;

      const diffTag = document.createElement("span");
      diffTag.className = `quest-diff ${difficulty}`;
      diffTag.textContent = DIFFICULTY[difficulty].label;

      const xpTag = document.createElement("span");
      xpTag.className = "quest-xp";
      xpTag.textContent = `+${xp}`;

      const del = document.createElement("button");
      del.type = "button";
      del.className = "quest-delete";
      del.setAttribute("aria-label", `Delete ${quest.text}`);
      del.textContent = "×";

      check.addEventListener("change", () => toggleQuest(quest.id));
      del.addEventListener("click", () => deleteQuest(quest.id));

      li.append(check, text, diffTag, xpTag, del);
      els.questList.appendChild(li);
    });

    renderCompletedLog();
  }

  function renderCompletedLog() {
    els.completedList.innerHTML = "";
    els.completedEmpty.hidden = state.completedLog.length > 0;

    state.completedLog.forEach((entry) => {
      const difficulty = DIFFICULTY[entry.difficulty] ? entry.difficulty : "medium";
      const li = document.createElement("li");
      li.className = `quest-item ${difficulty} done`;

      const text = document.createElement("span");
      text.className = "quest-text";
      text.textContent = entry.text;

      const diffTag = document.createElement("span");
      diffTag.className = `quest-diff ${difficulty}`;
      diffTag.textContent = DIFFICULTY[difficulty].label;

      const when = document.createElement("span");
      when.className = "completed-when";
      when.textContent = entry.at || "";

      li.append(text, diffTag, when);
      els.completedList.appendChild(li);
    });
  }

  function setQuestTab(tab) {
    els.questTabs.forEach((btn) => {
      const on = btn.dataset.tab === tab;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });
    els.questPanelActive.hidden = tab !== "active";
    els.questPanelCompleted.hidden = tab !== "completed";
  }

  function addQuest(text, difficulty) {
    const diff = DIFFICULTY[difficulty] ? difficulty : "medium";
    state.quests.unshift({
      id: crypto.randomUUID(),
      text,
      done: false,
      difficulty: diff,
    });
    playAddSound();
    setQuestTab("active");
    renderQuests();
    saveState();
  }

  function toggleQuest(id) {
    const quest = state.quests.find((q) => q.id === id);
    if (!quest || quest.done) return;

    const difficulty = DIFFICULTY[quest.difficulty] ? quest.difficulty : "medium";
    const xp = questXp(difficulty);
    quest.done = true;
    state.questsCompleted += 1;
    state.completedLog.unshift({
      id: crypto.randomUUID(),
      text: quest.text,
      difficulty,
      at: new Date().toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
    // keep log reasonable
    if (state.completedLog.length > 100) state.completedLog.length = 100;

    playCompleteSound(difficulty);
    renderQuests();
    renderStudyStats();
    saveState();
    setTimeout(() => addXp(xp, `${DIFFICULTY[difficulty].label} quest`), 180);
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
      const sessionLength = totalForMode;
      const finishedMode = currentMode;
      stopTimer();
      remaining = 0;
      renderTimer();

      if (finishedMode === "focus") {
        addStudySeconds(sessionLength);
        addXp(XP_PER_FOCUS, "Focus complete");
      } else {
        showToast("Break over — rest time!");
      }
      openRewardModal();
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
    const selected = els.questForm.querySelector('input[name="difficulty"]:checked');
    const difficulty = selected?.value || "medium";
    addQuest(text, difficulty);
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

  function renderTokens() {
    els.tokenCount.textContent = String(state.tokens);
  }

  function applyTheme(themeId) {
    document.body.classList.remove("theme-sunset", "theme-blackhole", "theme-mario");
    if (themeId && THEME_IDS.has(themeId)) {
      document.body.classList.add(`theme-${themeId}`);
    }
  }

  function buyTheme(id) {
    const item = THEMES.find((t) => t.id === id);
    if (!item || state.ownedThemes.includes(id)) return;
    if (state.tokens < item.cost) {
      showToast("Not enough tokens");
      return;
    }
    state.tokens -= item.cost;
    state.ownedThemes.push(id);
    state.activeTheme = id;
    applyTheme(id);
    renderTokens();
    renderShop();
    saveState();
    showToast(`Unlocked ${item.name}`);
  }

  function equipTheme(id) {
    if (!state.ownedThemes.includes(id)) return;
    if (state.activeTheme === id) {
      state.activeTheme = null;
      applyTheme(null);
      showToast("Default theme");
    } else {
      state.activeTheme = id;
      applyTheme(id);
      showToast(`Theme: ${THEMES.find((t) => t.id === id).name}`);
    }
    renderShop();
    saveState();
  }

  function buyGame(id) {
    const item = GAMES.find((g) => g.id === id);
    if (!item || state.ownedGames.includes(id)) return false;
    if (state.tokens < item.cost) {
      showToast("Not enough tokens");
      return false;
    }
    state.tokens -= item.cost;
    state.ownedGames.push(id);
    renderTokens();
    renderShop();
    saveState();
    showToast(`Unlocked ${item.name}`);
    return true;
  }

  function shopCardHtml(item, type) {
    const owned =
      type === "theme"
        ? state.ownedThemes.includes(item.id)
        : state.ownedGames.includes(item.id);
    const active = type === "theme" && state.activeTheme === item.id;
    const canAfford = state.tokens >= item.cost;
    let actionLabel = `${item.cost} ◈`;
    let actionAttr = `data-buy-${type}="${item.id}"`;
    let btnClass = "btn-primary";
    let disabled = "";

    if (owned && type === "theme") {
      actionLabel = active ? "Equipped" : "Equip";
      actionAttr = `data-equip-theme="${item.id}"`;
      btnClass = "btn-ghost";
    } else if (owned && type === "game") {
      actionLabel = "Play";
      actionAttr = `data-play-game="${item.id}"`;
      btnClass = "btn-primary";
    } else if (!canAfford) {
      disabled = "disabled";
    }

    const swatch =
      type === "theme" ? `<div class="preview-swatch ${item.id}" aria-hidden="true"></div>` : "";

    return `
      <article class="shop-card${owned ? " owned" : ""}${active ? " active-theme" : ""}">
        <div class="shop-card-top">
          <p class="shop-card-name">${item.name}</p>
          <span class="rarity ${item.rarity}">${item.rarity}</span>
        </div>
        ${swatch}
        <p class="shop-card-desc">${item.desc}</p>
        <button type="button" class="btn ${btnClass}" ${actionAttr} ${disabled}>${actionLabel}</button>
      </article>
    `;
  }

  function renderShop() {
    els.themeShop.innerHTML = THEMES.map((t) => shopCardHtml(t, "theme")).join("");
    els.gameShop.innerHTML = GAMES.map((g) => shopCardHtml(g, "game")).join("");
  }

  els.themeShop.addEventListener("click", (e) => {
    const buy = e.target.closest("[data-buy-theme]");
    const equip = e.target.closest("[data-equip-theme]");
    if (buy) buyTheme(buy.dataset.buyTheme);
    if (equip) equipTheme(equip.dataset.equipTheme);
  });

  els.gameShop.addEventListener("click", (e) => {
    const play = e.target.closest("[data-play-game]");
    const buy = e.target.closest("[data-buy-game]");
    if (play) {
      startMiniGame(play.dataset.playGame);
    } else if (buy) {
      buyGame(buy.dataset.buyGame);
    }
  });

  let restRemaining = REST_SECONDS;
  let restTimerId = null;

  function renderRestCountdown() {
    const m = Math.floor(restRemaining / 60);
    const s = restRemaining % 60;
    els.restMinutes.textContent = String(m).padStart(2, "0");
    els.restSeconds.textContent = String(s).padStart(2, "0");
  }

  function stopRestCountdown() {
    clearInterval(restTimerId);
    restTimerId = null;
  }

  function openRewardModal() {
    playStopAlarmSound();
    const owned = GAMES.filter((g) => state.ownedGames.includes(g.id));
    if (!owned.length) {
      els.rewardCopy.textContent =
        "Rest up from your quests. Buy games in the shop to play during breaks.";
      els.rewardGames.innerHTML = "";
    } else {
      els.rewardCopy.textContent =
        "Rest from your quests — play a game while the countdown runs.";
      els.rewardGames.innerHTML = owned
        .map(
          (g) =>
            `<button type="button" class="btn btn-primary" data-play-game="${g.id}">Play ${g.name}</button>`
        )
        .join("");
    }

    restRemaining = REST_SECONDS;
    renderRestCountdown();
    stopRestCountdown();
    restTimerId = setInterval(() => {
      restRemaining -= 1;
      if (restRemaining <= 0) {
        restRemaining = 0;
        renderRestCountdown();
        stopRestCountdown();
        closeRewardModal();
        showToast("Rest over — back to your quests!");
        return;
      }
      renderRestCountdown();
    }, 1000);

    els.rewardModal.hidden = false;
  }

  function closeRewardModal() {
    stopRestCountdown();
    els.rewardModal.hidden = true;
  }

  els.rewardClose.addEventListener("click", closeRewardModal);
  els.rewardSkip.addEventListener("click", closeRewardModal);
  els.rewardGames.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-play-game]");
    if (!btn) return;
    closeRewardModal();
    startMiniGame(btn.dataset.playGame);
  });

  /* ---------- Mini-games ---------- */
  let activeGame = null;
  let gameRaf = 0;
  const gctx = els.gameCanvas.getContext("2d");
  const keys = new Set();

  function setScore(n) {
    els.gameScore.textContent = `Score ${n}`;
  }

  function stopMiniGame() {
    cancelAnimationFrame(gameRaf);
    gameRaf = 0;
    if (activeGame?.destroy) activeGame.destroy();
    activeGame = null;
  }

  function closeGameModal() {
    stopMiniGame();
    els.gameModal.hidden = true;
  }

  function startMiniGame(id) {
    const meta = GAMES.find((g) => g.id === id);
    if (!meta || !state.ownedGames.includes(id)) return;
    stopMiniGame();
    els.gameTitle.textContent = meta.name;
    els.gameHelp.textContent = meta.help;
    setScore(0);
    els.gameModal.hidden = false;

    if (id === "tetris") activeGame = createTetris();
    else if (id === "galaga") activeGame = createGalaga();
    else if (id === "arkanoid") activeGame = createArkanoid();
    else if (id === "mario2d") activeGame = createMario2d();

    activeGame?.start();
  }

  els.gameClose.addEventListener("click", closeGameModal);
  els.gameQuit.addEventListener("click", closeGameModal);
  els.gameRestart.addEventListener("click", () => {
    if (!activeGame) return;
    const id = activeGame.id;
    startMiniGame(id);
  });

  window.addEventListener("keydown", (e) => {
    keys.add(e.key);
    if (!els.gameModal.hidden && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(e.key)) {
      e.preventDefault();
    }
    activeGame?.onKey?.(e);
  });
  window.addEventListener("keyup", (e) => keys.delete(e.key));

  els.gameCanvas.addEventListener("pointerdown", (e) => activeGame?.onPointer?.(e));
  els.gameCanvas.addEventListener("pointermove", (e) => activeGame?.onPointerMove?.(e));

  function createTetris() {
    const COLS = 10;
    const ROWS = 20;
    const SIZE = 24;
    const W = COLS * SIZE;
    const H = ROWS * SIZE;
    els.gameCanvas.width = W;
    els.gameCanvas.height = H;

    const SHAPES = {
      I: [[1, 1, 1, 1]],
      O: [[1, 1], [1, 1]],
      T: [[0, 1, 0], [1, 1, 1]],
      S: [[0, 1, 1], [1, 1, 0]],
      Z: [[1, 1, 0], [0, 1, 1]],
      J: [[1, 0, 0], [1, 1, 1]],
      L: [[0, 0, 1], [1, 1, 1]],
    };
    const COLORS = {
      I: "#00e5ff", O: "#ffd166", T: "#c084fc", S: "#39ffb6",
      Z: "#ff5c7a", J: "#4da3ff", L: "#ff9f43",
    };
    const bagTypes = () => ["I", "O", "T", "S", "Z", "J", "L"].sort(() => Math.random() - 0.5);

    let board, piece, score, dropAcc, dropMs, over, bag;

    function rotate(m) {
      const r = m[0].length;
      const c = m.length;
      const out = Array.from({ length: r }, () => Array(c).fill(0));
      for (let y = 0; y < c; y++) for (let x = 0; x < r; x++) out[x][c - 1 - y] = m[y][x];
      return out;
    }

    function spawn() {
      if (!bag.length) bag = bagTypes();
      const type = bag.pop();
      piece = {
        type,
        matrix: SHAPES[type].map((row) => row.slice()),
        x: 3,
        y: 0,
      };
      if (collide(piece.x, piece.y, piece.matrix)) over = true;
    }

    function collide(x, y, matrix) {
      for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
          if (!matrix[r][c]) continue;
          const nx = x + c;
          const ny = y + r;
          if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
          if (ny >= 0 && board[ny][nx]) return true;
        }
      }
      return false;
    }

    function merge() {
      piece.matrix.forEach((row, r) => {
        row.forEach((v, c) => {
          if (!v) return;
          const ny = piece.y + r;
          const nx = piece.x + c;
          if (ny >= 0) board[ny][nx] = piece.type;
        });
      });
    }

    function clearLines() {
      let cleared = 0;
      for (let y = ROWS - 1; y >= 0; y--) {
        if (board[y].every(Boolean)) {
          board.splice(y, 1);
          board.unshift(Array(COLS).fill(null));
          cleared += 1;
          y += 1;
        }
      }
      if (cleared) {
        score += [0, 100, 300, 500, 800][cleared] || cleared * 200;
        setScore(score);
        dropMs = Math.max(120, 650 - score / 20);
      }
    }

    function hardDrop() {
      while (!collide(piece.x, piece.y + 1, piece.matrix)) piece.y += 1;
      lock();
    }

    function lock() {
      merge();
      clearLines();
      spawn();
    }

    function draw() {
      gctx.fillStyle = "#050b14";
      gctx.fillRect(0, 0, W, H);
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          if (!board[y][x]) continue;
          gctx.fillStyle = COLORS[board[y][x]];
          gctx.fillRect(x * SIZE + 1, y * SIZE + 1, SIZE - 2, SIZE - 2);
        }
      }
      piece.matrix.forEach((row, r) => {
        row.forEach((v, c) => {
          if (!v) return;
          gctx.fillStyle = COLORS[piece.type];
          gctx.fillRect((piece.x + c) * SIZE + 1, (piece.y + r) * SIZE + 1, SIZE - 2, SIZE - 2);
        });
      });
      if (over) {
        gctx.fillStyle = "rgba(0,0,0,0.55)";
        gctx.fillRect(0, 0, W, H);
        gctx.fillStyle = "#fff";
        gctx.font = "20px Orbitron, sans-serif";
        gctx.textAlign = "center";
        gctx.fillText("GAME OVER", W / 2, H / 2);
      }
    }

    let last = 0;
    function loop(ts) {
      gameRaf = requestAnimationFrame(loop);
      if (over) {
        draw();
        return;
      }
      const dt = ts - last;
      last = ts;
      dropAcc += dt;
      if (dropAcc >= dropMs) {
        dropAcc = 0;
        if (!collide(piece.x, piece.y + 1, piece.matrix)) piece.y += 1;
        else lock();
      }
      draw();
    }

    return {
      id: "tetris",
      start() {
        board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
        score = 0;
        dropAcc = 0;
        dropMs = 650;
        over = false;
        bag = bagTypes();
        setScore(0);
        spawn();
        last = performance.now();
        gameRaf = requestAnimationFrame(loop);
      },
      onKey(e) {
        if (over) return;
        if (e.key === "ArrowLeft" && !collide(piece.x - 1, piece.y, piece.matrix)) piece.x -= 1;
        if (e.key === "ArrowRight" && !collide(piece.x + 1, piece.y, piece.matrix)) piece.x += 1;
        if (e.key === "ArrowDown" && !collide(piece.x, piece.y + 1, piece.matrix)) {
          piece.y += 1;
          score += 1;
          setScore(score);
        }
        if (e.key === "ArrowUp") {
          const next = rotate(piece.matrix);
          if (!collide(piece.x, piece.y, next)) piece.matrix = next;
        }
        if (e.key === " ") hardDrop();
      },
      destroy() {},
    };
  }

  function createGalaga() {
    const W = 360;
    const H = 480;
    els.gameCanvas.width = W;
    els.gameCanvas.height = H;
    let player, bullets, enemies, score, over, spawnTimer, last, fireLevel;

    function reset() {
      player = { x: W / 2, y: H - 40, w: 28, h: 16 };
      bullets = [];
      enemies = [];
      score = 0;
      fireLevel = 0;
      over = false;
      spawnTimer = 0;
      setScore(0);
      last = performance.now();
    }

    function currentFireLevel() {
      return Math.floor(score / 100);
    }

    function maxBullets() {
      // Start with 4; +2 max on screen every 100 points
      return 4 + currentFireLevel() * 2;
    }

    function shotCount() {
      // 1 stream, then +1 every 100 points (cap at 5)
      return Math.min(5, 1 + currentFireLevel());
    }

    function shoot() {
      const max = maxBullets();
      const count = shotCount();
      if (bullets.length + count > max) return;

      const spread = count === 1 ? [0] : Array.from({ length: count }, (_, i) => {
        const t = count === 1 ? 0 : (i / (count - 1)) * 2 - 1;
        return t * Math.min(14, 4 + currentFireLevel() * 2);
      });

      spread.forEach((dx) => {
        bullets.push({
          x: player.x + dx,
          y: player.y - 10,
          vy: -8 - Math.min(4, currentFireLevel() * 0.4),
          vx: dx * 0.08,
        });
      });
    }

    function addScore(amount) {
      const before = currentFireLevel();
      score += amount;
      setScore(score);
      fireLevel = currentFireLevel();
      if (fireLevel > before) {
        showToast(`Fire power ×${shotCount()}!`);
      }
    }

    function draw() {
      gctx.fillStyle = "#050814";
      gctx.fillRect(0, 0, W, H);
      gctx.fillStyle = "#39ffb6";
      gctx.fillRect(player.x - player.w / 2, player.y, player.w, player.h);
      // little gun tips based on fire level
      if (shotCount() > 1) {
        gctx.fillStyle = "#00e5ff";
        gctx.fillRect(player.x - player.w / 2 - 2, player.y + 4, 4, 8);
        gctx.fillRect(player.x + player.w / 2 - 2, player.y + 4, 4, 8);
      }
      gctx.fillStyle = "#00e5ff";
      bullets.forEach((b) => gctx.fillRect(b.x - 2, b.y, 4, 10));
      enemies.forEach((en) => {
        gctx.fillStyle = en.elite ? "#ff5c7a" : "#c084fc";
        gctx.beginPath();
        gctx.moveTo(en.x, en.y - 10);
        gctx.lineTo(en.x + 12, en.y + 8);
        gctx.lineTo(en.x - 12, en.y + 8);
        gctx.closePath();
        gctx.fill();
      });
      gctx.fillStyle = "rgba(232, 244, 255, 0.7)";
      gctx.font = "12px Orbitron, sans-serif";
      gctx.textAlign = "left";
      gctx.fillText(`GUN ×${shotCount()}`, 10, 18);
      if (over) {
        gctx.fillStyle = "rgba(0,0,0,0.55)";
        gctx.fillRect(0, 0, W, H);
        gctx.fillStyle = "#fff";
        gctx.font = "20px Orbitron, sans-serif";
        gctx.textAlign = "center";
        gctx.fillText("GAME OVER", W / 2, H / 2);
      }
    }

    function loop(ts) {
      gameRaf = requestAnimationFrame(loop);
      const dt = Math.min(32, ts - last);
      last = ts;
      if (over) {
        draw();
        return;
      }

      if (keys.has("ArrowLeft") || keys.has("a") || keys.has("A")) player.x -= 0.35 * dt;
      if (keys.has("ArrowRight") || keys.has("d") || keys.has("D")) player.x += 0.35 * dt;
      player.x = Math.max(20, Math.min(W - 20, player.x));

      spawnTimer += dt;
      if (spawnTimer > Math.max(320, 700 - currentFireLevel() * 40)) {
        spawnTimer = 0;
        enemies.push({
          x: 30 + Math.random() * (W - 60),
          y: -20,
          vy: 0.08 + Math.random() * 0.08 + score * 0.0002,
          elite: Math.random() < 0.2,
        });
      }

      bullets.forEach((b) => {
        b.y += b.vy;
        b.x += b.vx || 0;
      });
      bullets = bullets.filter((b) => b.y > -20 && b.x > -10 && b.x < W + 10);

      enemies.forEach((en) => {
        en.y += en.vy * dt;
      });

      for (let i = enemies.length - 1; i >= 0; i--) {
        const en = enemies[i];
        if (en.y > H + 20) {
          enemies.splice(i, 1);
          continue;
        }
        if (Math.abs(en.x - player.x) < 18 && Math.abs(en.y - player.y) < 16) {
          over = true;
        }
        for (let j = bullets.length - 1; j >= 0; j--) {
          const b = bullets[j];
          if (Math.abs(b.x - en.x) < 14 && Math.abs(b.y - en.y) < 12) {
            bullets.splice(j, 1);
            enemies.splice(i, 1);
            addScore(en.elite ? 50 : 20);
            break;
          }
        }
      }
      draw();
    }

    return {
      id: "galaga",
      start() {
        reset();
        gameRaf = requestAnimationFrame(loop);
      },
      onKey(e) {
        if (e.key === " " || e.key === "Spacebar") shoot();
      },
      onPointer(e) {
        const rect = els.gameCanvas.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * W;
        player.x = x;
        shoot();
      },
      onPointerMove(e) {
        if (e.buttons !== 1) return;
        const rect = els.gameCanvas.getBoundingClientRect();
        player.x = ((e.clientX - rect.left) / rect.width) * W;
      },
      destroy() {},
    };
  }

  function createMario2d() {
    const W = 360;
    const H = 480;
    els.gameCanvas.width = W;
    els.gameCanvas.height = H;
    const GROUND = H - 60;
    const LEVEL_END = 4200;
    const FLAG_X = LEVEL_END - 180;

    let player, goombas, pipes, pits, platforms, coins, blocks;
    let scroll, score, over, won, last, jumpBuf;
    let flag; // { x, flagY, raised, sliding, done }

    function reset() {
      player = { x: 80, y: GROUND - 28, vx: 0, vy: 0, w: 20, h: 28, onGround: true };
      goombas = [];
      pipes = [];
      pits = [];
      platforms = [];
      coins = [];
      blocks = [];
      scroll = 0;
      score = 0;
      over = false;
      won = false;
      jumpBuf = 0;
      flag = {
        x: FLAG_X,
        flagY: GROUND - 200,
        topY: GROUND - 200,
        bottomY: GROUND - 40,
        sliding: false,
        claimed: false,
        playerFlag: false,
      };
      setScore(0);
      last = performance.now();
      buildLevel();
    }

    function buildLevel() {
      // Pipes
      [
        [520, 70], [980, 100], [1400, 80], [1880, 110], [2400, 90],
        [2900, 120], [3350, 85], [3700, 95],
      ].forEach(([x, h]) => {
        pipes.push({ x, y: GROUND - h, w: 44, h });
      });

      // Pits (gaps in ground)
      [
        [700, 70], [1100, 90], [1600, 80], [2100, 100],
        [2650, 85], [3100, 95], [3550, 75],
      ].forEach(([x, w]) => pits.push({ x, w }));

      // Floating platforms / brick rows
      [
        [780, GROUND - 90, 3], [1200, GROUND - 110, 4], [1500, GROUND - 80, 2],
        [1750, GROUND - 130, 5], [2200, GROUND - 100, 3], [2550, GROUND - 120, 4],
        [3000, GROUND - 90, 3], [3450, GROUND - 110, 4], [3850, GROUND - 85, 3],
      ].forEach(([x, y, count]) => {
        for (let i = 0; i < count; i++) {
          platforms.push({ x: x + i * 28, y, w: 26, h: 26, kind: i === 1 ? "q" : "brick" });
        }
      });

      // Goombas
      [
        450, 600, 860, 1050, 1280, 1550, 1720, 1950, 2300, 2480,
        2750, 2950, 3200, 3400, 3600, 3900,
      ].forEach((x, i) => {
        goombas.push({
          x,
          y: GROUND - 20,
          w: 22,
          h: 20,
          vx: i % 2 === 0 ? -0.9 : 0.9,
          alive: true,
        });
      });

      // High goombas on platforms
      [800, 1220, 1780, 2580, 3480].forEach((x) => {
        goombas.push({ x, y: GROUND - 130, w: 22, h: 20, vx: -0.7, alive: true, airborne: true });
      });

      // Coins
      for (let i = 0; i < 40; i++) {
        coins.push({
          x: 380 + i * 95 + (i % 3) * 20,
          y: GROUND - 55 - (i % 4) * 28,
          r: 7,
          taken: false,
        });
      }

      // Stairs before flag (classic)
      for (let step = 0; step < 6; step++) {
        for (let h = 0; h <= step; h++) {
          blocks.push({
            x: FLAG_X - 220 + step * 28,
            y: GROUND - 28 * (h + 1),
            w: 28,
            h: 28,
          });
        }
      }
    }

    function inPit(worldX) {
      return pits.some((p) => worldX > p.x && worldX < p.x + p.w);
    }

    function solidRects() {
      const solids = [
        ...pipes.map((p) => ({ x: p.x, y: p.y, w: p.w, h: p.h })),
        ...platforms.map((p) => ({ x: p.x, y: p.y, w: p.w, h: p.h })),
        ...blocks.map((b) => ({ x: b.x, y: b.y, w: b.w, h: b.h })),
      ];
      return solids;
    }

    function jump() {
      if (won || over) return;
      if (player.onGround || jumpBuf > 0) {
        player.vy = -9.4;
        player.onGround = false;
        jumpBuf = 0;
      }
    }

    function drawPipe(sx, p) {
      gctx.fillStyle = "#00a800";
      gctx.fillRect(sx, p.y, p.w, p.h);
      gctx.fillStyle = "#00d000";
      gctx.fillRect(sx + 8, p.y, 10, p.h);
      gctx.fillStyle = "#007b00";
      gctx.fillRect(sx, p.y, 6, p.h);
      gctx.fillRect(sx + p.w - 6, p.y, 6, p.h);
      // lip
      gctx.fillStyle = "#00a800";
      gctx.fillRect(sx - 6, p.y - 12, p.w + 12, 16);
      gctx.fillStyle = "#00d000";
      gctx.fillRect(sx + 4, p.y - 10, 12, 12);
      gctx.strokeStyle = "#004d00";
      gctx.strokeRect(sx - 6, p.y - 12, p.w + 12, 16);
    }

    function drawBrick(sx, y, w, h, kind) {
      if (kind === "q") {
        gctx.fillStyle = "#fcbc18";
        gctx.fillRect(sx, y, w, h);
        gctx.strokeStyle = "#c47a00";
        gctx.strokeRect(sx, y, w, h);
        gctx.fillStyle = "#fff";
        gctx.font = "bold 14px sans-serif";
        gctx.textAlign = "center";
        gctx.fillText("?", sx + w / 2, y + 18);
      } else {
        gctx.fillStyle = "#c84c0c";
        gctx.fillRect(sx, y, w, h);
        gctx.strokeStyle = "#8b3a12";
        gctx.strokeRect(sx, y, w, h);
        gctx.beginPath();
        gctx.moveTo(sx, y + h / 2);
        gctx.lineTo(sx + w, y + h / 2);
        gctx.moveTo(sx + w / 2, y);
        gctx.lineTo(sx + w / 2, y + h);
        gctx.stroke();
      }
    }

    function drawGoomba(sx, g) {
      gctx.fillStyle = "#8b4513";
      gctx.beginPath();
      gctx.ellipse(sx + g.w / 2, g.y + g.h / 2, g.w / 2, g.h / 2, 0, 0, Math.PI * 2);
      gctx.fill();
      gctx.fillStyle = "#5a2d0c";
      gctx.fillRect(sx + 2, g.y + g.h - 6, 6, 6);
      gctx.fillRect(sx + g.w - 8, g.y + g.h - 6, 6, 6);
      gctx.fillStyle = "#fff";
      gctx.fillRect(sx + 5, g.y + 6, 4, 4);
      gctx.fillRect(sx + g.w - 9, g.y + 6, 4, 4);
      gctx.fillStyle = "#000";
      gctx.fillRect(sx + 6, g.y + 7, 2, 2);
      gctx.fillRect(sx + g.w - 8, g.y + 7, 2, 2);
    }

    function drawFlag() {
      const sx = flag.x - scroll;
      const poleTop = GROUND - 210;
      const poleBottom = GROUND;

      // pole
      gctx.fillStyle = "#c0c0c0";
      gctx.fillRect(sx + 10, poleTop, 4, poleBottom - poleTop);
      // ball
      gctx.fillStyle = "#00a800";
      gctx.beginPath();
      gctx.arc(sx + 12, poleTop, 7, 0, Math.PI * 2);
      gctx.fill();

      // flag cloth
      const fy = flag.flagY;
      if (flag.playerFlag) {
        // Mario-style player flag (red with emblem)
        gctx.fillStyle = "#e52521";
        gctx.beginPath();
        gctx.moveTo(sx + 14, fy);
        gctx.lineTo(sx + 52, fy + 14);
        gctx.lineTo(sx + 14, fy + 28);
        gctx.closePath();
        gctx.fill();
        gctx.fillStyle = "#fff";
        gctx.font = "bold 12px sans-serif";
        gctx.textAlign = "left";
        gctx.fillText("M", sx + 18, fy + 19);
      } else {
        // empty castle flag (white circle on dark)
        gctx.fillStyle = "#1a1a1a";
        gctx.beginPath();
        gctx.moveTo(sx + 14, fy);
        gctx.lineTo(sx + 48, fy + 12);
        gctx.lineTo(sx + 14, fy + 24);
        gctx.closePath();
        gctx.fill();
        gctx.fillStyle = "#fff";
        gctx.beginPath();
        gctx.arc(sx + 26, fy + 12, 5, 0, Math.PI * 2);
        gctx.fill();
      }

      // small castle after flag
      const cx = sx + 70;
      gctx.fillStyle = "#6b6b6b";
      gctx.fillRect(cx, GROUND - 70, 70, 70);
      gctx.fillStyle = "#888";
      for (let i = 0; i < 4; i++) {
        gctx.fillRect(cx + i * 18, GROUND - 82, 14, 14);
      }
      gctx.fillStyle = "#222";
      gctx.fillRect(cx + 24, GROUND - 36, 22, 36);
      gctx.fillStyle = "#fcbc18";
      gctx.fillRect(cx + 28, GROUND - 100, 6, 20);
      gctx.beginPath();
      gctx.moveTo(cx + 31, GROUND - 110);
      gctx.lineTo(cx + 48, GROUND - 100);
      gctx.lineTo(cx + 31, GROUND - 92);
      gctx.closePath();
      gctx.fillStyle = flag.playerFlag ? "#e52521" : "#fff";
      gctx.fill();
    }

    function draw() {
      gctx.fillStyle = "#5c94fc";
      gctx.fillRect(0, 0, W, H);

      gctx.fillStyle = "#5cbf2a";
      gctx.beginPath();
      gctx.ellipse(60 - ((scroll * 0.2) % 220), GROUND, 90, 40, 0, 0, Math.PI * 2);
      gctx.ellipse(240 - ((scroll * 0.2) % 220), GROUND, 110, 50, 0, 0, Math.PI * 2);
      gctx.fill();

      // ground with pits
      gctx.fillStyle = "#c84c0c";
      let gx = 0;
      while (gx < W) {
        const worldX = scroll + gx;
        const pit = pits.find((p) => worldX >= p.x && worldX < p.x + p.w);
        if (pit) {
          const pitEnd = Math.min(W, pit.x + pit.w - scroll);
          gx = Math.max(gx + 1, pitEnd);
          // dark pit
          gctx.fillStyle = "#1a0a08";
          gctx.fillRect(pit.x - scroll, GROUND, pit.w, H - GROUND);
          gctx.fillStyle = "#c84c0c";
          continue;
        }
        gctx.fillRect(gx, GROUND, 4, H - GROUND);
        gx += 4;
      }
      gctx.fillStyle = "#8b3a12";
      gctx.fillRect(0, GROUND + 18, W, H - GROUND);

      // clear pit tops again visually
      pits.forEach((p) => {
        const sx = p.x - scroll;
        gctx.fillStyle = "#081018";
        gctx.fillRect(sx, GROUND, p.w, H - GROUND);
      });

      platforms.forEach((p) => drawBrick(p.x - scroll, p.y, p.w, p.h, p.kind));
      blocks.forEach((b) => drawBrick(b.x - scroll, b.y, b.w, b.h, "brick"));
      pipes.forEach((p) => drawPipe(p.x - scroll, p));

      coins.forEach((c) => {
        if (c.taken) return;
        const sx = c.x - scroll;
        gctx.fillStyle = "#ffd166";
        gctx.beginPath();
        gctx.arc(sx, c.y, c.r, 0, Math.PI * 2);
        gctx.fill();
        gctx.fillStyle = "#ffe9a8";
        gctx.fillRect(sx - 2, c.y - 3, 4, 6);
      });

      goombas.forEach((g) => {
        if (!g.alive) return;
        drawGoomba(g.x - scroll, g);
      });

      drawFlag();

      // player
      gctx.fillStyle = "#e52521";
      gctx.fillRect(player.x, player.y, player.w, player.h);
      gctx.fillStyle = "#ffe0bd";
      gctx.fillRect(player.x + 3, player.y + 4, 14, 10);
      gctx.fillStyle = "#3b5fd9";
      gctx.fillRect(player.x + 2, player.y + 16, player.w - 4, 8);

      if (over || won) {
        gctx.fillStyle = "rgba(0,0,0,0.55)";
        gctx.fillRect(0, 0, W, H);
        gctx.fillStyle = "#fff";
        gctx.font = "20px Orbitron, sans-serif";
        gctx.textAlign = "center";
        gctx.fillText(won ? "COURSE CLEAR!" : "GAME OVER", W / 2, H / 2);
        if (won) {
          gctx.font = "14px Rajdhani, sans-serif";
          gctx.fillText("Flag claimed!", W / 2, H / 2 + 28);
        }
      }
    }

    function resolveSolids() {
      player.onGround = false;
      const solids = solidRects();

      // ground unless in pit
      const feetX = scroll + player.x + player.w / 2;
      if (!inPit(feetX) && player.y + player.h >= GROUND) {
        player.y = GROUND - player.h;
        player.vy = 0;
        player.onGround = true;
      } else if (inPit(feetX) && player.y > GROUND + 40) {
        over = true;
      }

      solids.forEach((s) => {
        const sx = s.x - scroll;
        const prevBottom = player.y + player.h - player.vy;
        if (
          player.x < sx + s.w &&
          player.x + player.w > sx &&
          player.y < s.y + s.h &&
          player.y + player.h > s.y
        ) {
          // land on top
          if (player.vy >= 0 && prevBottom <= s.y + 6) {
            player.y = s.y - player.h;
            player.vy = 0;
            player.onGround = true;
          } else if (player.vy < 0 && player.y < s.y + s.h && player.y > s.y) {
            player.y = s.y + s.h;
            player.vy = 0;
          } else {
            // side bump — push out
            const overlapLeft = player.x + player.w - sx;
            const overlapRight = sx + s.w - player.x;
            if (overlapLeft < overlapRight) player.x = sx - player.w;
            else player.x = sx + s.w;
          }
        }
      });
    }

    function loop(ts) {
      gameRaf = requestAnimationFrame(loop);
      const dt = Math.min(32, ts - last) / 16;
      last = ts;

      if (over || (won && !flag.sliding)) {
        draw();
        return;
      }

      jumpBuf = Math.max(0, jumpBuf - dt);

      if (!flag.claimed) {
        if (keys.has("ArrowLeft") || keys.has("a") || keys.has("A")) player.x -= 3.4 * dt;
        if (keys.has("ArrowRight") || keys.has("d") || keys.has("D")) player.x += 3.4 * dt;
        if (keys.has("ArrowUp") || keys.has(" ") || keys.has("w") || keys.has("W")) jump();

        player.x = Math.max(20, Math.min(W - 40, player.x));
        // camera follow when near right
        if (player.x > W * 0.45) {
          const push = player.x - W * 0.45;
          scroll += push;
          player.x -= push;
        }
        scroll = Math.max(0, Math.min(scroll, LEVEL_END - W));

        player.vy += 0.48 * dt;
        player.y += player.vy * dt;
        resolveSolids();

        // goombas
        goombas.forEach((g) => {
          if (!g.alive) return;
          g.x += g.vx * dt * 1.6;
          // bounce near pipes
          pipes.forEach((p) => {
            if (g.x + g.w > p.x && g.x < p.x + p.w && g.y + g.h > p.y) g.vx *= -1;
          });
          if (inPit(g.x + g.w / 2)) g.vx *= -1;

          const sx = g.x - scroll;
          const stomping =
            player.vy > 0 &&
            player.x < sx + g.w &&
            player.x + player.w > sx &&
            player.y + player.h > g.y &&
            player.y + player.h < g.y + g.h * 0.6;

          if (stomping) {
            g.alive = false;
            player.vy = -6;
            score += 100;
            setScore(score);
          } else if (
            player.x < sx + g.w &&
            player.x + player.w > sx &&
            player.y < g.y + g.h &&
            player.y + player.h > g.y
          ) {
            over = true;
          }
        });

        coins.forEach((c) => {
          if (c.taken) return;
          const sx = c.x - scroll;
          const dx = player.x + player.w / 2 - sx;
          const dy = player.y + player.h / 2 - c.y;
          if (dx * dx + dy * dy < (c.r + 12) * (c.r + 12)) {
            c.taken = true;
            score += 25;
            setScore(score);
          }
        });

        // touch flagpole
        const poleScreen = flag.x - scroll;
        if (
          !flag.claimed &&
          player.x + player.w > poleScreen + 4 &&
          player.x < poleScreen + 24 &&
          player.y < GROUND
        ) {
          flag.claimed = true;
          flag.sliding = true;
          flag.playerFlag = true;
          flag.flagY = Math.min(Math.max(player.y, flag.topY), flag.bottomY);
          score += 400 + Math.floor((GROUND - player.y) * 2);
          setScore(score);
          player.vx = 0;
          player.vy = 0;
        }
      }

      if (flag.sliding) {
        // slide flag down like classic Mario, now showing player flag
        flag.flagY += 2.4 * dt;
        player.x = flag.x - scroll + 16;
        player.y = Math.min(player.y + 2.2 * dt, GROUND - player.h);
        if (flag.flagY >= flag.bottomY) {
          flag.flagY = flag.bottomY;
          flag.sliding = false;
          won = true;
          // walk toward castle a bit
          player.x = Math.min(player.x + 40, flag.x - scroll + 90);
          player.y = GROUND - player.h;
        }
      }

      draw();
    }

    return {
      id: "mario2d",
      start() {
        reset();
        gameRaf = requestAnimationFrame(loop);
      },
      onKey(e) {
        if (e.key === "ArrowUp" || e.key === " ") jump();
      },
      onPointer() {
        jumpBuf = 8;
        jump();
      },
      destroy() {},
    };
  }

  function createArkanoid() {
    const W = 360;
    const H = 480;
    els.gameCanvas.width = W;
    els.gameCanvas.height = H;
    let paddle, ball, bricks, score, over, won, last;

    function reset() {
      paddle = { x: W / 2, y: H - 28, w: 70, h: 12 };
      ball = { x: W / 2, y: H - 50, vx: 3.2, vy: -3.4, r: 6 };
      bricks = [];
      const cols = 8;
      const rows = 5;
      const bw = 40;
      const bh = 14;
      const colors = ["#ff5c7a", "#ffb43c", "#39ffb6", "#00e5ff", "#c084fc"];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          bricks.push({
            x: 12 + c * (bw + 4),
            y: 40 + r * (bh + 6),
            w: bw,
            h: bh,
            color: colors[r],
            alive: true,
          });
        }
      }
      score = 0;
      over = false;
      won = false;
      setScore(0);
      last = performance.now();
    }

    function draw() {
      gctx.fillStyle = "#050b14";
      gctx.fillRect(0, 0, W, H);
      bricks.forEach((b) => {
        if (!b.alive) return;
        gctx.fillStyle = b.color;
        gctx.fillRect(b.x, b.y, b.w, b.h);
      });
      gctx.fillStyle = "#e8f4ff";
      gctx.fillRect(paddle.x - paddle.w / 2, paddle.y, paddle.w, paddle.h);
      gctx.beginPath();
      gctx.fillStyle = "#ffd166";
      gctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      gctx.fill();
      if (over || won) {
        gctx.fillStyle = "rgba(0,0,0,0.55)";
        gctx.fillRect(0, 0, W, H);
        gctx.fillStyle = "#fff";
        gctx.font = "20px Orbitron, sans-serif";
        gctx.textAlign = "center";
        gctx.fillText(won ? "YOU WIN" : "GAME OVER", W / 2, H / 2);
      }
    }

    function loop(ts) {
      gameRaf = requestAnimationFrame(loop);
      const dt = Math.min(32, ts - last) / 16;
      last = ts;
      if (over || won) {
        draw();
        return;
      }

      if (keys.has("ArrowLeft") || keys.has("a") || keys.has("A")) paddle.x -= 6 * dt;
      if (keys.has("ArrowRight") || keys.has("d") || keys.has("D")) paddle.x += 6 * dt;
      paddle.x = Math.max(paddle.w / 2, Math.min(W - paddle.w / 2, paddle.x));

      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;

      if (ball.x < ball.r || ball.x > W - ball.r) ball.vx *= -1;
      if (ball.y < ball.r) ball.vy *= -1;
      if (ball.y > H) over = true;

      if (
        ball.y + ball.r >= paddle.y &&
        ball.y + ball.r <= paddle.y + paddle.h &&
        ball.x > paddle.x - paddle.w / 2 &&
        ball.x < paddle.x + paddle.w / 2 &&
        ball.vy > 0
      ) {
        ball.vy *= -1;
        ball.vx = ((ball.x - paddle.x) / (paddle.w / 2)) * 4;
      }

      bricks.forEach((b) => {
        if (!b.alive) return;
        if (
          ball.x > b.x &&
          ball.x < b.x + b.w &&
          ball.y > b.y &&
          ball.y < b.y + b.h
        ) {
          b.alive = false;
          ball.vy *= -1;
          score += 10;
          setScore(score);
        }
      });

      if (bricks.every((b) => !b.alive)) won = true;
      draw();
    }

    return {
      id: "arkanoid",
      start() {
        reset();
        gameRaf = requestAnimationFrame(loop);
      },
      onPointer(e) {
        const rect = els.gameCanvas.getBoundingClientRect();
        paddle.x = ((e.clientX - rect.left) / rect.width) * W;
      },
      onPointerMove(e) {
        const rect = els.gameCanvas.getBoundingClientRect();
        paddle.x = ((e.clientX - rect.left) / rect.width) * W;
      },
      destroy() {},
    };
  }

  els.questTabs.forEach((btn) => {
    btn.addEventListener("click", () => setQuestTab(btn.dataset.tab));
  });

  renderXp();
  renderQuests();
  renderTimer();
  renderTokens();
  renderShop();
  renderStreak();
  renderStudyStats();
  applyTheme(state.activeTheme);
  saveState();

  // Unlock Web Audio on first user gesture (browser autoplay policy)
  const unlockAudio = () => {
    getAudioCtx();
    window.removeEventListener("pointerdown", unlockAudio);
    window.removeEventListener("keydown", unlockAudio);
  };
  window.addEventListener("pointerdown", unlockAudio);
  window.addEventListener("keydown", unlockAudio);
})();
