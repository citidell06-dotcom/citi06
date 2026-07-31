(() => {
  const STORAGE_KEY = "study-with-games-v2";
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
      id: "starwars",
      name: "Death Star",
      rarity: "rare",
      cost: RARITY_COST.rare,
      desc: "Cinematic Death Star firing its green superlaser into the cosmos.",
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
      id: "solitaire",
      name: "Solitaire",
      rarity: "common",
      cost: 1,
      desc: "Spider, FreeCell, and Pyramid — three classic card games.",
      help: "Tap a variant to play · click cards to select & move · stock to deal",
    },
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
      help: "← → move · ↑/Space jump · Z/X fire · hit ? blocks for abilities · 5 lives · flag → World 2",
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
    resetProgress: document.getElementById("reset-progress"),
    settingsOpen: document.getElementById("settings-open"),
    settingsModal: document.getElementById("settings-modal"),
    settingsClose: document.getElementById("settings-close"),
    settingBrightness: document.getElementById("setting-brightness"),
    settingBrightnessVal: document.getElementById("setting-brightness-val"),
    settingSound: document.getElementById("setting-sound"),
    settingSoundVal: document.getElementById("setting-sound-val"),
    settingMusic: document.getElementById("setting-music"),
    settingMusicVal: document.getElementById("setting-music-val"),
    settingMute: document.getElementById("setting-mute"),
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
    settings: {
      brightness: clampNum(loaded?.settings?.brightness, 50, 150, 100),
      soundVolume: clampNum(loaded?.settings?.soundVolume, 0, 100, 80),
      musicVolume: clampNum(loaded?.settings?.musicVolume, 0, 100, 70),
      muted: Boolean(loaded?.settings?.muted),
    },
  };

  function clampNum(v, min, max, fallback) {
    const n = Number(v);
    if (!Number.isFinite(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  }

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
  let soundBus = null;
  let musicBus = null;

  function getAudioCtx() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!audioCtx) {
      audioCtx = new AC();
      soundBus = audioCtx.createGain();
      musicBus = audioCtx.createGain();
      soundBus.connect(audioCtx.destination);
      musicBus.connect(audioCtx.destination);
      applyAudioSettings();
    }
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }

  function soundOut() {
    getAudioCtx();
    return soundBus || audioCtx?.destination;
  }

  function musicOut() {
    getAudioCtx();
    return musicBus || audioCtx?.destination;
  }

  function applyAudioSettings() {
    if (!soundBus || !musicBus || !audioCtx) return;
    const muted = state.settings.muted;
    const s = muted ? 0 : state.settings.soundVolume / 100;
    const m = muted ? 0 : state.settings.musicVolume / 100;
    const t = audioCtx.currentTime;
    soundBus.gain.cancelScheduledValues(t);
    musicBus.gain.cancelScheduledValues(t);
    soundBus.gain.setValueAtTime(s, t);
    musicBus.gain.setValueAtTime(m, t);
  }

  function applyBrightnessSetting() {
    const b = state.settings.brightness / 100;
    document.documentElement.style.setProperty("--game-brightness", String(b));
  }

  function syncSettingsUI() {
    const s = state.settings;
    if (els.settingBrightness) {
      els.settingBrightness.value = String(s.brightness);
      els.settingBrightnessVal.textContent = `${s.brightness}%`;
    }
    if (els.settingSound) {
      els.settingSound.value = String(s.soundVolume);
      els.settingSoundVal.textContent = `${s.soundVolume}%`;
    }
    if (els.settingMusic) {
      els.settingMusic.value = String(s.musicVolume);
      els.settingMusicVal.textContent = `${s.musicVolume}%`;
    }
    if (els.settingMute) els.settingMute.checked = s.muted;
  }

  function openSettingsModal() {
    syncSettingsUI();
    els.settingsModal.hidden = false;
  }

  function closeSettingsModal() {
    els.settingsModal.hidden = true;
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
    g.connect(soundOut());
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
        settings: state.settings,
      })
    );
  }

  function resetAllProgress() {
    const ok = window.confirm(
      "Reset ALL progress?\n\nThis clears levels, XP, tokens, quests, study time, streak, themes, and games."
    );
    if (!ok) return;

    stopTimer();
    stopRestCountdown();
    closeRewardModal();
    closeGameModal();

    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("study-with-games-v1");

    state.xp = 0;
    state.level = 1;
    state.quests = [];
    state.tokens = 0;
    state.ownedThemes = [];
    state.ownedGames = [];
    state.activeTheme = null;
    state.studySeconds = 0;
    state.questsCompleted = 0;
    state.completedLog = [];
    state.streakDays = 1;
    state.lastActiveDate = todayKey();
    state.settings = {
      brightness: 100,
      soundVolume: 80,
      musicVolume: 70,
      muted: false,
    };
    applyBrightnessSetting();
    applyAudioSettings();
    syncSettingsUI();

    remaining = 25 * 60;
    totalForMode = 25 * 60;
    currentMode = "focus";
    running = false;
    lastEnemyKey = "";

    applyTheme(null);
    setQuestTab("active");
    els.modeButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.mode === "focus");
    });

    renderXp();
    renderQuests();
    renderTimer();
    renderTokens();
    renderShop();
    renderStreak();
    renderStudyStats();
    saveState();
    showToast("Progress reset");
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
    document.body.classList.remove(
      "theme-sunset",
      "theme-starwars",
      "theme-blackhole",
      "theme-mario"
    );
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
    els.gameModal.querySelector(".modal-card-game")?.classList.remove("wide-game");
  }

  function startMiniGame(id) {
    const meta = GAMES.find((g) => g.id === id);
    if (!meta || !state.ownedGames.includes(id)) return;
    stopMiniGame();
    els.gameTitle.textContent = meta.name;
    els.gameHelp.textContent = meta.help;
    setScore(0);
    els.gameModal.hidden = false;
    els.gameModal.querySelector(".modal-card-game")?.classList.toggle("wide-game", id === "solitaire");

    if (id === "solitaire") activeGame = createSolitaire();
    else if (id === "tetris") activeGame = createTetris();
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

  let solitairePrefs = { variant: null, spiderSuits: 1 };

  function createSolitaire() {
    const W = 640;
    const H = 720;
    els.gameCanvas.width = W;
    els.gameCanvas.height = H;

    const SUITS_ALL = ["S", "H", "D", "C"];
    const SUIT_SYM = { S: "♠", H: "♥", D: "♦", C: "♣" };
    const RANK_LABEL = { 1: "A", 11: "J", 12: "Q", 13: "K" };
    const RED = new Set(["H", "D"]);

    let screen = "menu"; // menu | spider-diff | play
    let variant = null;
    let spiderSuits = 1;
    let score = 0;
    let won = false;
    let message = "";
    let selected = null;

    // shared piles filled per variant
    let tableau = [];
    let stock = [];
    let waste = [];
    let foundations = [];
    let freecells = [];
    let completed = 0;
    let pyramid = [];
    let stockPasses = 0;
    let hitBoxes = [];

    function rankLabel(r) {
      return RANK_LABEL[r] || String(r);
    }

    function isRed(suit) {
      return RED.has(suit);
    }

    function shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    function makeCard(suit, rank, faceUp = false) {
      return { suit, rank, faceUp, id: `${suit}${rank}-${Math.random().toString(36).slice(2, 7)}` };
    }

    function canvasPos(e) {
      const rect = els.gameCanvas.getBoundingClientRect();
      return {
        x: ((e.clientX - rect.left) / rect.width) * W,
        y: ((e.clientY - rect.top) / rect.height) * H,
      };
    }

    function bumpScore(n) {
      score = Math.max(0, score + n);
      setScore(score);
    }

    function setHelp(text) {
      els.gameHelp.textContent = text;
    }

    function drawFelt() {
      const g = gctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#0d4a32");
      g.addColorStop(1, "#083222");
      gctx.fillStyle = g;
      gctx.fillRect(0, 0, W, H);
      gctx.strokeStyle = "rgba(255,255,255,0.06)";
      for (let y = 0; y < H; y += 28) {
        gctx.beginPath();
        gctx.moveTo(0, y);
        gctx.lineTo(W, y);
        gctx.stroke();
      }
    }

    function drawCardFace(x, y, cw, ch, card, highlight) {
      gctx.fillStyle = "#f7f3e8";
      gctx.strokeStyle = highlight ? "#ffe066" : "#2a2a2a";
      gctx.lineWidth = highlight ? 3 : 1.5;
      roundRect(x, y, cw, ch, 6);
      gctx.fill();
      gctx.stroke();
      gctx.fillStyle = isRed(card.suit) ? "#d62828" : "#1d1d1d";
      gctx.font = `bold ${Math.max(11, cw * 0.28)}px Georgia, serif`;
      gctx.textAlign = "left";
      gctx.fillText(rankLabel(card.rank), x + 5, y + cw * 0.32);
      gctx.font = `${Math.max(12, cw * 0.34)}px Georgia, serif`;
      gctx.fillText(SUIT_SYM[card.suit], x + 5, y + cw * 0.62);
      gctx.font = `${Math.max(16, cw * 0.42)}px Georgia, serif`;
      gctx.textAlign = "center";
      gctx.fillText(SUIT_SYM[card.suit], x + cw / 2, y + ch * 0.62);
    }

    function drawCardBack(x, y, cw, ch) {
      gctx.fillStyle = "#1b3f8a";
      gctx.strokeStyle = "#0d224e";
      gctx.lineWidth = 1.5;
      roundRect(x, y, cw, ch, 6);
      gctx.fill();
      gctx.stroke();
      gctx.strokeStyle = "rgba(255,209,102,0.55)";
      gctx.strokeRect(x + 5, y + 5, cw - 10, ch - 10);
      gctx.fillStyle = "rgba(255,209,102,0.35)";
      gctx.font = `bold ${Math.max(10, cw * 0.22)}px Orbitron, sans-serif`;
      gctx.textAlign = "center";
      gctx.fillText("◈", x + cw / 2, y + ch / 2 + 4);
    }

    function drawEmptySlot(x, y, cw, ch, label) {
      gctx.strokeStyle = "rgba(255,255,255,0.22)";
      gctx.lineWidth = 1.5;
      gctx.setLineDash([4, 4]);
      roundRect(x, y, cw, ch, 6);
      gctx.stroke();
      gctx.setLineDash([]);
      if (label) {
        gctx.fillStyle = "rgba(255,255,255,0.28)";
        gctx.font = "11px Rajdhani, sans-serif";
        gctx.textAlign = "center";
        gctx.fillText(label, x + cw / 2, y + ch / 2 + 4);
      }
    }

    function roundRect(x, y, w, h, r) {
      gctx.beginPath();
      gctx.moveTo(x + r, y);
      gctx.arcTo(x + w, y, x + w, y + h, r);
      gctx.arcTo(x + w, y + h, x, y + h, r);
      gctx.arcTo(x, y + h, x, y, r);
      gctx.arcTo(x, y, x + w, y, r);
      gctx.closePath();
    }

    function drawButton(box, label, active) {
      gctx.fillStyle = active ? "rgba(0,229,255,0.22)" : "rgba(0,0,0,0.35)";
      gctx.strokeStyle = active ? "#00e5ff" : "rgba(255,255,255,0.25)";
      gctx.lineWidth = 2;
      roundRect(box.x, box.y, box.w, box.h, 10);
      gctx.fill();
      gctx.stroke();
      gctx.fillStyle = "#e8f4ff";
      gctx.font = "bold 16px Rajdhani, sans-serif";
      gctx.textAlign = "center";
      gctx.fillText(label, box.x + box.w / 2, box.y + box.h / 2 + 5);
    }

    function hit(box, p) {
      return p.x >= box.x && p.x <= box.x + box.w && p.y >= box.y && p.y <= box.y + box.h;
    }

    function drawHudBar(title) {
      gctx.fillStyle = "rgba(0,0,0,0.35)";
      gctx.fillRect(0, 0, W, 44);
      gctx.fillStyle = "#fff";
      gctx.font = "14px Orbitron, sans-serif";
      gctx.textAlign = "left";
      gctx.fillText(title, 12, 28);
      if (message) {
        gctx.fillStyle = "#ffd166";
        gctx.font = "13px Rajdhani, sans-serif";
        gctx.textAlign = "center";
        gctx.fillText(message, W / 2, 28);
      }
      if (won) {
        gctx.fillStyle = "rgba(0,0,0,0.55)";
        gctx.fillRect(0, H / 2 - 40, W, 80);
        gctx.fillStyle = "#39ffb6";
        gctx.font = "28px Orbitron, sans-serif";
        gctx.textAlign = "center";
        gctx.fillText("YOU WIN!", W / 2, H / 2 + 10);
      }
    }

    /* ---------- MENU ---------- */
    function drawMenu() {
      hitBoxes = [];
      drawFelt();
      gctx.fillStyle = "#fff";
      gctx.font = "26px Orbitron, sans-serif";
      gctx.textAlign = "center";
      gctx.fillText("SOLITAIRE", W / 2, 90);
      gctx.fillStyle = "rgba(255,255,255,0.7)";
      gctx.font = "16px Rajdhani, sans-serif";
      gctx.fillText("Pick a classic variant", W / 2, 122);

      const options = [
        { id: "spider", label: "Spider Solitaire", sub: "2 decks · build same-suit runs" },
        { id: "freecell", label: "FreeCell", sub: "1 deck · open info · free cells" },
        { id: "pyramid", label: "Pyramid", sub: "Pair cards that add to 13" },
      ];
      options.forEach((opt, i) => {
        const box = { x: W / 2 - 180, y: 170 + i * 110, w: 360, h: 88, action: "pick", variant: opt.id };
        hitBoxes.push(box);
        drawButton(box, "", false);
        gctx.fillStyle = "#00e5ff";
        gctx.font = "bold 20px Orbitron, sans-serif";
        gctx.textAlign = "center";
        gctx.fillText(opt.label, box.x + box.w / 2, box.y + 38);
        gctx.fillStyle = "rgba(255,255,255,0.65)";
        gctx.font = "15px Rajdhani, sans-serif";
        gctx.fillText(opt.sub, box.x + box.w / 2, box.y + 62);
      });
    }

    function drawSpiderDiff() {
      hitBoxes = [];
      drawFelt();
      gctx.fillStyle = "#fff";
      gctx.font = "22px Orbitron, sans-serif";
      gctx.textAlign = "center";
      gctx.fillText("SPIDER — SUITS", W / 2, 90);
      gctx.fillStyle = "rgba(255,255,255,0.65)";
      gctx.font = "15px Rajdhani, sans-serif";
      gctx.fillText("More suits = harder", W / 2, 118);

      const diffs = [
        { suits: 1, label: "1 Suit — Easy", sub: "Spades only" },
        { suits: 2, label: "2 Suits — Medium", sub: "Spades & Hearts" },
        { suits: 4, label: "4 Suits — Hard", sub: "All suits" },
      ];
      diffs.forEach((d, i) => {
        const box = { x: W / 2 - 170, y: 160 + i * 100, w: 340, h: 80, action: "spider-start", suits: d.suits };
        hitBoxes.push(box);
        drawButton(box, "", spiderSuits === d.suits);
        gctx.fillStyle = "#ffd166";
        gctx.font = "bold 18px Orbitron, sans-serif";
        gctx.textAlign = "center";
        gctx.fillText(d.label, box.x + box.w / 2, box.y + 35);
        gctx.fillStyle = "rgba(255,255,255,0.65)";
        gctx.font = "14px Rajdhani, sans-serif";
        gctx.fillText(d.sub, box.x + box.w / 2, box.y + 58);
      });
      const back = { x: 24, y: H - 60, w: 110, h: 40, action: "menu" };
      hitBoxes.push(back);
      drawButton(back, "← Menu", false);
    }

    /* ---------- SPIDER ---------- */
    function buildSpiderDeck(suits) {
      const suitPool = suits === 1 ? ["S"] : suits === 2 ? ["S", "H"] : SUITS_ALL;
      const deck = [];
      // 104 cards: for 1 suit use 8 copies of spades; 2 suits 4 each; 4 suits 2 decks
      const copies = 104 / (suitPool.length * 13);
      for (let c = 0; c < copies; c++) {
        suitPool.forEach((s) => {
          for (let r = 1; r <= 13; r++) deck.push(makeCard(s, r, false));
        });
      }
      return shuffle(deck);
    }

    function startSpider(suits) {
      spiderSuits = suits;
      solitairePrefs = { variant: "spider", spiderSuits: suits };
      variant = "spider";
      screen = "play";
      score = 0;
      won = false;
      message = "";
      selected = null;
      completed = 0;
      setScore(0);
      setHelp("Spider: build same-suit K→A · move on any next-higher rank · stock deals to all columns");

      const deck = buildSpiderDeck(suits);
      tableau = Array.from({ length: 10 }, () => []);
      const counts = [6, 6, 6, 6, 5, 5, 5, 5, 5, 5];
      counts.forEach((n, col) => {
        for (let i = 0; i < n; i++) {
          const card = deck.pop();
          card.faceUp = i === n - 1;
          tableau[col].push(card);
        }
      });
      stock = deck; // 50 left
      waste = [];
      foundations = [];
      draw();
    }

    function spiderSequenceFrom(col, idx) {
      const pile = tableau[col];
      if (idx < 0 || idx >= pile.length || !pile[idx].faceUp) return null;
      for (let i = idx; i < pile.length - 1; i++) {
        const a = pile[i];
        const b = pile[i + 1];
        if (a.suit !== b.suit || a.rank !== b.rank + 1) return null;
      }
      return pile.slice(idx);
    }

    function spiderCanDrop(seq, destCol) {
      const dest = tableau[destCol];
      if (!dest.length) return true;
      const top = dest[dest.length - 1];
      return top.faceUp && top.rank === seq[0].rank + 1;
    }

    function spiderRemoveComplete(col) {
      const pile = tableau[col];
      if (pile.length < 13) return;
      const start = pile.length - 13;
      const run = pile.slice(start);
      if (!run.every((c) => c.faceUp)) return;
      for (let i = 0; i < 12; i++) {
        if (run[i].suit !== run[i + 1].suit || run[i].rank !== run[i + 1].rank + 1) return;
      }
      if (run[0].rank !== 13 || run[12].rank !== 1) return;
      tableau[col] = pile.slice(0, start);
      completed += 1;
      bumpScore(100);
      message = `Cleared ${completed}/8`;
      revealTop(col);
      if (completed >= 8) {
        won = true;
        bumpScore(500);
        message = "All sequences cleared!";
        showToast("Spider clear!");
      }
    }

    function revealTop(col) {
      const pile = tableau[col];
      if (pile.length && !pile[pile.length - 1].faceUp) {
        pile[pile.length - 1].faceUp = true;
        bumpScore(5);
      }
    }

    function spiderDealStock() {
      if (won) return;
      if (!stock.length) {
        message = "No stock left";
        return;
      }
      if (tableau.some((p) => !p.length)) {
        message = "Fill empty columns before dealing";
        return;
      }
      for (let c = 0; c < 10; c++) {
        const card = stock.pop();
        if (!card) break;
        card.faceUp = true;
        tableau[c].push(card);
        spiderRemoveComplete(c);
      }
      bumpScore(-10);
      selected = null;
      message = "";
    }

    function drawSpider() {
      hitBoxes = [];
      drawFelt();
      const cw = 54;
      const ch = 74;
      const gap = 8;
      const left = (W - (10 * cw + 9 * gap)) / 2;
      const topY = 58;

      // stock
      const stockBox = { x: left, y: topY, w: cw, h: ch, action: "spider-stock" };
      hitBoxes.push(stockBox);
      if (stock.length) drawCardBack(stockBox.x, stockBox.y, cw, ch);
      else drawEmptySlot(stockBox.x, stockBox.y, cw, ch, "Stock");
      gctx.fillStyle = "#fff";
      gctx.font = "12px Rajdhani, sans-serif";
      gctx.textAlign = "left";
      gctx.fillText(`${stock.length} in stock · cleared ${completed}/8`, left + cw + 12, topY + 24);

      const menuBtn = { x: W - 120, y: 10, w: 100, h: 28, action: "menu" };
      hitBoxes.push(menuBtn);
      drawButton(menuBtn, "Menu", false);

      const baseY = topY + ch + 18;
      const peek = 22;
      for (let c = 0; c < 10; c++) {
        const x = left + c * (cw + gap);
        const pile = tableau[c];
        if (!pile.length) {
          const box = { x, y: baseY, w: cw, h: ch, action: "spider-col", col: c, idx: -1 };
          hitBoxes.push(box);
          drawEmptySlot(x, baseY, cw, ch);
          continue;
        }
        pile.forEach((card, idx) => {
          const y = baseY + idx * peek;
          const box = { x, y, w: cw, h: idx === pile.length - 1 ? ch : peek, action: "spider-col", col: c, idx };
          hitBoxes.push(box);
          const hl = selected && selected.col === c && idx >= selected.idx;
          if (card.faceUp) drawCardFace(x, y, cw, ch, card, hl);
          else drawCardBack(x, y, cw, ch);
        });
      }
      drawHudBar(`Spider · ${spiderSuits} suit${spiderSuits > 1 ? "s" : ""}`);
    }

    function onSpiderClick(p) {
      for (let i = hitBoxes.length - 1; i >= 0; i--) {
        const box = hitBoxes[i];
        if (!hit(box, p)) continue;
        if (box.action === "menu") {
          goMenu();
          return;
        }
        if (box.action === "spider-stock") {
          spiderDealStock();
          draw();
          return;
        }
        if (box.action === "spider-col") {
          const col = box.col;
          const idx = box.idx;
          if (selected) {
            if (selected.col === col) {
              selected = null;
              draw();
              return;
            }
            const seq = spiderSequenceFrom(selected.col, selected.idx);
            if (seq && spiderCanDrop(seq, col)) {
              tableau[selected.col].splice(selected.idx, seq.length);
              tableau[col].push(...seq);
              revealTop(selected.col);
              spiderRemoveComplete(col);
              bumpScore(2);
              selected = null;
              message = "";
            } else {
              message = "Invalid move";
              selected = null;
            }
            draw();
            return;
          }
          if (idx < 0) return;
          const seq = spiderSequenceFrom(col, idx);
          if (!seq) {
            message = "Need a same-suit run";
            draw();
            return;
          }
          selected = { col, idx };
          message = "";
          draw();
          return;
        }
      }
      selected = null;
      draw();
    }

    /* ---------- FREECELL ---------- */
    function startFreeCell() {
      solitairePrefs = { variant: "freecell", spiderSuits };
      variant = "freecell";
      screen = "play";
      score = 0;
      won = false;
      message = "";
      selected = null;
      setScore(0);
      setHelp("FreeCell: build ↓ alternating colors · A→K by suit on foundations · use free cells");

      const deck = shuffle(
        SUITS_ALL.flatMap((s) => Array.from({ length: 13 }, (_, i) => makeCard(s, i + 1, true)))
      );
      tableau = Array.from({ length: 8 }, () => []);
      deck.forEach((card, i) => tableau[i % 8].push(card));
      freecells = [null, null, null, null];
      foundations = [[], [], [], []]; // by suit index
      draw();
    }

    function freeCellEmptyCount() {
      return freecells.filter((c) => !c).length;
    }

    function freeTableauCount(excludeCol) {
      return tableau.filter((p, i) => i !== excludeCol && !p.length).length;
    }

    function maxFreeMove(destEmpty) {
      const cells = freeCellEmptyCount();
      let emptyCols = freeTableauCount(-1);
      if (destEmpty) emptyCols = Math.max(0, emptyCols - 1);
      return (1 + cells) * 2 ** emptyCols;
    }

    function isAltDesc(a, b) {
      return a.rank === b.rank + 1 && isRed(a.suit) !== isRed(b.suit);
    }

    function freeSeqFrom(col, idx) {
      const pile = tableau[col];
      if (idx < 0 || idx >= pile.length) return null;
      for (let i = idx; i < pile.length - 1; i++) {
        if (!isAltDesc(pile[i], pile[i + 1])) return null;
      }
      return pile.slice(idx);
    }

    function foundationIndex(suit) {
      return SUITS_ALL.indexOf(suit);
    }

    function canToFoundation(card) {
      const fi = foundationIndex(card.suit);
      const pile = foundations[fi];
      if (!pile.length) return card.rank === 1;
      return pile[pile.length - 1].rank === card.rank - 1;
    }

    function checkFreeWin() {
      if (foundations.every((p) => p.length === 13)) {
        won = true;
        bumpScore(500);
        message = "FreeCell cleared!";
        showToast("FreeCell win!");
      }
    }

    function tryAutoFoundation() {
      let moved = true;
      while (moved) {
        moved = false;
        for (let i = 0; i < 4; i++) {
          if (freecells[i] && canToFoundation(freecells[i])) {
            foundations[foundationIndex(freecells[i].suit)].push(freecells[i]);
            freecells[i] = null;
            bumpScore(15);
            moved = true;
          }
        }
        for (let c = 0; c < 8; c++) {
          const pile = tableau[c];
          if (!pile.length) continue;
          const top = pile[pile.length - 1];
          if (canToFoundation(top)) {
            foundations[foundationIndex(top.suit)].push(pile.pop());
            bumpScore(15);
            moved = true;
          }
        }
      }
      checkFreeWin();
    }

    function drawFreeCell() {
      hitBoxes = [];
      drawFelt();
      const cw = 58;
      const ch = 80;
      const topY = 54;
      const gap = 10;

      const menuBtn = { x: W - 120, y: 10, w: 100, h: 28, action: "menu" };
      hitBoxes.push(menuBtn);
      drawButton(menuBtn, "Menu", false);

      // freecells
      for (let i = 0; i < 4; i++) {
        const x = 20 + i * (cw + gap);
        const box = { x, y: topY, w: cw, h: ch, action: "fc-cell", idx: i };
        hitBoxes.push(box);
        if (freecells[i]) {
          const hl = selected && selected.type === "cell" && selected.idx === i;
          drawCardFace(x, topY, cw, ch, freecells[i], hl);
        } else drawEmptySlot(x, topY, cw, ch, "Free");
      }

      // foundations
      for (let i = 0; i < 4; i++) {
        const x = W - 20 - (4 - i) * (cw + gap);
        const box = { x, y: topY, w: cw, h: ch, action: "fc-found", idx: i };
        hitBoxes.push(box);
        const pile = foundations[i];
        if (pile.length) drawCardFace(x, topY, cw, ch, pile[pile.length - 1], false);
        else drawEmptySlot(x, topY, cw, ch, SUIT_SYM[SUITS_ALL[i]]);
      }

      const baseY = topY + ch + 24;
      const peek = 24;
      const colGap = (W - 40 - 8 * cw) / 7;
      for (let c = 0; c < 8; c++) {
        const x = 20 + c * (cw + colGap);
        const pile = tableau[c];
        if (!pile.length) {
          const box = { x, y: baseY, w: cw, h: ch, action: "fc-col", col: c, idx: -1 };
          hitBoxes.push(box);
          drawEmptySlot(x, baseY, cw, ch);
          continue;
        }
        pile.forEach((card, idx) => {
          const y = baseY + idx * peek;
          const box = {
            x, y, w: cw,
            h: idx === pile.length - 1 ? ch : peek,
            action: "fc-col", col: c, idx,
          };
          hitBoxes.push(box);
          const hl = selected && selected.type === "col" && selected.col === c && idx >= selected.idx;
          drawCardFace(x, y, cw, ch, card, hl);
        });
      }
      drawHudBar("FreeCell");
    }

    function getSelectedFreeCards() {
      if (!selected) return null;
      if (selected.type === "cell") {
        const card = freecells[selected.idx];
        return card ? [card] : null;
      }
      if (selected.type === "col") return freeSeqFrom(selected.col, selected.idx);
      return null;
    }

    function clearSelectedFree() {
      if (!selected) return;
      if (selected.type === "cell") freecells[selected.idx] = null;
      else if (selected.type === "col") tableau[selected.col].splice(selected.idx);
    }

    function onFreeCellClick(p) {
      for (let i = hitBoxes.length - 1; i >= 0; i--) {
        const box = hitBoxes[i];
        if (!hit(box, p)) continue;
        if (box.action === "menu") {
          goMenu();
          return;
        }

        if (box.action === "fc-found") {
          const cards = getSelectedFreeCards();
          if (cards && cards.length === 1 && canToFoundation(cards[0])) {
            foundations[foundationIndex(cards[0].suit)].push(cards[0]);
            clearSelectedFree();
            selected = null;
            bumpScore(15);
            tryAutoFoundation();
            message = "";
          } else if (selected) {
            message = "Can't place on foundation";
            selected = null;
          }
          draw();
          return;
        }

        if (box.action === "fc-cell") {
          if (selected) {
            if (selected.type === "cell" && selected.idx === box.idx) {
              selected = null;
              draw();
              return;
            }
            const cards = getSelectedFreeCards();
            if (cards && cards.length === 1 && !freecells[box.idx]) {
              freecells[box.idx] = cards[0];
              clearSelectedFree();
              selected = null;
              message = "";
              tryAutoFoundation();
            } else {
              message = "Free cell holds one card";
              selected = null;
            }
            draw();
            return;
          }
          if (freecells[box.idx]) {
            selected = { type: "cell", idx: box.idx };
            message = "";
            draw();
          }
          return;
        }

        if (box.action === "fc-col") {
          const col = box.col;
          if (selected) {
            if (selected.type === "col" && selected.col === col) {
              selected = null;
              draw();
              return;
            }
            const cards = getSelectedFreeCards();
            if (!cards || !cards.length) {
              selected = null;
              draw();
              return;
            }
            const dest = tableau[col];
            const destEmpty = !dest.length;
            const max = maxFreeMove(destEmpty);
            if (cards.length > max) {
              message = `Can move ${max} card${max === 1 ? "" : "s"} max`;
              selected = null;
              draw();
              return;
            }
            const ok = destEmpty || isAltDesc(dest[dest.length - 1], cards[0]);
            if (ok) {
              clearSelectedFree();
              dest.push(...cards);
              selected = null;
              bumpScore(2);
              message = "";
              tryAutoFoundation();
            } else {
              message = "Build down, alternate colors";
              selected = null;
            }
            draw();
            return;
          }
          if (box.idx < 0) return;
          const seq = freeSeqFrom(col, box.idx);
          if (!seq) {
            message = "Not a valid stack";
            draw();
            return;
          }
          selected = { type: "col", col, idx: box.idx };
          message = "";
          draw();
          return;
        }
      }
      selected = null;
      draw();
    }

    /* ---------- PYRAMID ---------- */
    function startPyramid() {
      solitairePrefs = { variant: "pyramid", spiderSuits };
      variant = "pyramid";
      screen = "play";
      score = 0;
      won = false;
      message = "";
      selected = null;
      stockPasses = 0;
      setScore(0);
      setHelp("Pyramid: pair uncovered cards that add to 13 · Kings remove alone · stock flips to waste");

      const deck = shuffle(
        SUITS_ALL.flatMap((s) => Array.from({ length: 13 }, (_, i) => makeCard(s, i + 1, true)))
      );
      pyramid = [];
      let n = 0;
      for (let row = 0; row < 7; row++) {
        pyramid[row] = [];
        for (let col = 0; col <= row; col++) {
          pyramid[row][col] = deck[n++];
        }
      }
      stock = deck.slice(n).map((c) => ({ ...c, faceUp: false }));
      waste = [];
      draw();
    }

    function pyramidCovered(row, col) {
      if (row >= 6) return false;
      const a = pyramid[row + 1][col];
      const b = pyramid[row + 1][col + 1];
      return Boolean(a || b);
    }

    function pyramidValue(card) {
      return card.rank;
    }

    function removePyramidCard(row, col) {
      pyramid[row][col] = null;
    }

    function pyramidCleared() {
      return pyramid.every((row) => row.every((c) => !c));
    }

    function drawPyramid() {
      hitBoxes = [];
      drawFelt();
      const cw = 52;
      const ch = 72;
      const menuBtn = { x: W - 120, y: 10, w: 100, h: 28, action: "menu" };
      hitBoxes.push(menuBtn);
      drawButton(menuBtn, "Menu", false);

      const startY = 58;
      for (let row = 0; row < 7; row++) {
        const count = row + 1;
        const rowW = count * cw + (count - 1) * 6;
        const startX = (W - rowW) / 2;
        for (let col = 0; col < count; col++) {
          const card = pyramid[row][col];
          const x = startX + col * (cw + 6);
          const y = startY + row * (ch * 0.48);
          if (!card) continue;
          const covered = pyramidCovered(row, col);
          const box = { x, y, w: cw, h: ch, action: "pyr-card", row, col };
          hitBoxes.push(box);
          const hl =
            selected &&
            selected.type === "pyr" &&
            selected.row === row &&
            selected.col === col;
          drawCardFace(x, y, cw, ch, card, hl);
          if (covered) {
            gctx.fillStyle = "rgba(0,0,0,0.28)";
            roundRect(x, y, cw, ch, 6);
            gctx.fill();
          }
        }
      }

      const stockX = W / 2 - cw - 20;
      const wasteX = W / 2 + 20;
      const pileY = H - 130;
      const stockBox = { x: stockX, y: pileY, w: cw, h: ch, action: "pyr-stock" };
      const wasteBox = { x: wasteX, y: pileY, w: cw, h: ch, action: "pyr-waste" };
      hitBoxes.push(stockBox, wasteBox);
      if (stock.length) drawCardBack(stockX, pileY, cw, ch);
      else drawEmptySlot(stockX, pileY, cw, ch, stockPasses < 1 ? "Flip" : "Empty");
      if (waste.length) {
        const hl = selected && selected.type === "waste";
        drawCardFace(wasteX, pileY, cw, ch, waste[waste.length - 1], hl);
      } else drawEmptySlot(wasteX, pileY, cw, ch, "Waste");

      gctx.fillStyle = "rgba(255,255,255,0.7)";
      gctx.font = "13px Rajdhani, sans-serif";
      gctx.textAlign = "center";
      gctx.fillText(`Stock ${stock.length} · Waste ${waste.length}`, W / 2, pileY + ch + 22);

      drawHudBar("Pyramid · pair to 13");
    }

    function pyramidTryPair(a, b) {
      return pyramidValue(a) + pyramidValue(b) === 13;
    }

    function removeSelectionCard(sel) {
      if (sel.type === "pyr") removePyramidCard(sel.row, sel.col);
      else if (sel.type === "waste") waste.pop();
    }

    function getSelCard(sel) {
      if (sel.type === "pyr") return pyramid[sel.row][sel.col];
      if (sel.type === "waste") return waste[waste.length - 1] || null;
      return null;
    }

    function afterPyramidRemove() {
      bumpScore(20);
      selected = null;
      message = "";
      if (pyramidCleared()) {
        won = true;
        bumpScore(300);
        message = "Pyramid cleared!";
        showToast("Pyramid win!");
      }
    }

    function onPyramidClick(p) {
      for (let i = hitBoxes.length - 1; i >= 0; i--) {
        const box = hitBoxes[i];
        if (!hit(box, p)) continue;

        if (box.action === "menu") {
          goMenu();
          return;
        }

        if (box.action === "pyr-stock") {
          if (stock.length) {
            const card = stock.pop();
            card.faceUp = true;
            waste.push(card);
            selected = null;
            message = "";
          } else if (waste.length && stockPasses < 1) {
            stockPasses += 1;
            while (waste.length) {
              const c = waste.pop();
              c.faceUp = false;
              stock.push(c);
            }
            message = "Stock recycled";
            selected = null;
          } else {
            message = "No more stock";
          }
          draw();
          return;
        }

        if (box.action === "pyr-waste") {
          if (!waste.length) return;
          const card = waste[waste.length - 1];
          if (card.rank === 13) {
            waste.pop();
            afterPyramidRemove();
            draw();
            return;
          }
          if (selected) {
            if (selected.type === "waste") {
              selected = null;
              draw();
              return;
            }
            const other = getSelCard(selected);
            if (other && pyramidTryPair(card, other)) {
              waste.pop();
              removeSelectionCard(selected);
              afterPyramidRemove();
            } else {
              message = "Need sum of 13";
              selected = null;
            }
            draw();
            return;
          }
          selected = { type: "waste" };
          message = "";
          draw();
          return;
        }

        if (box.action === "pyr-card") {
          const { row, col } = box;
          const card = pyramid[row][col];
          if (!card || pyramidCovered(row, col)) {
            message = "Card is covered";
            draw();
            return;
          }
          if (card.rank === 13) {
            removePyramidCard(row, col);
            afterPyramidRemove();
            draw();
            return;
          }
          if (selected) {
            if (selected.type === "pyr" && selected.row === row && selected.col === col) {
              selected = null;
              draw();
              return;
            }
            const other = getSelCard(selected);
            if (other && pyramidTryPair(card, other)) {
              removePyramidCard(row, col);
              removeSelectionCard(selected);
              afterPyramidRemove();
            } else {
              message = "Need sum of 13";
              selected = { type: "pyr", row, col };
            }
            draw();
            return;
          }
          selected = { type: "pyr", row, col };
          message = "";
          draw();
          return;
        }
      }
      selected = null;
      draw();
    }

    /* ---------- SHELL ---------- */
    function goMenu() {
      screen = "menu";
      variant = null;
      solitairePrefs.variant = null;
      won = false;
      selected = null;
      message = "";
      setHelp("Tap a variant to play · click cards to select & move · stock to deal");
      setScore(0);
      draw();
    }

    function draw() {
      if (screen === "menu") drawMenu();
      else if (screen === "spider-diff") drawSpiderDiff();
      else if (variant === "spider") drawSpider();
      else if (variant === "freecell") drawFreeCell();
      else if (variant === "pyramid") drawPyramid();
    }

    function onClick(e) {
      if (won && screen === "play") {
        // allow menu after win
      }
      const p = canvasPos(e);
      if (screen === "menu") {
        for (const box of hitBoxes) {
          if (!hit(box, p)) continue;
          if (box.variant === "spider") {
            screen = "spider-diff";
            draw();
            return;
          }
          if (box.variant === "freecell") {
            startFreeCell();
            return;
          }
          if (box.variant === "pyramid") {
            startPyramid();
            return;
          }
        }
        return;
      }
      if (screen === "spider-diff") {
        for (const box of hitBoxes) {
          if (!hit(box, p)) continue;
          if (box.action === "menu") {
            goMenu();
            return;
          }
          if (box.action === "spider-start") {
            startSpider(box.suits);
            return;
          }
        }
        return;
      }
      if (variant === "spider") onSpiderClick(p);
      else if (variant === "freecell") onFreeCellClick(p);
      else if (variant === "pyramid") onPyramidClick(p);
    }

    return {
      id: "solitaire",
      start() {
        if (solitairePrefs.variant === "spider") startSpider(solitairePrefs.spiderSuits || 1);
        else if (solitairePrefs.variant === "freecell") startFreeCell();
        else if (solitairePrefs.variant === "pyramid") startPyramid();
        else goMenu();
      },
      onPointer(e) {
        onClick(e);
      },
      destroy() {},
    };
  }

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
    const TILE = 28;

    let level = 1;
    let levelEnd = 4200;
    let flagX = levelEnd - 180;
    let lives = 5;
    let player, goombas, pipes, pits, platforms, coins, blocks, movers, powerups, particles, fireballs;
    let scroll, score, over, won, clearPending, last, jumpBuf, invuln, starTimer, fireCooldown;
    let flag;
    let music = { nodes: [], stopAt: 0, timer: 0 };

    // Original-style chiptune overworld loop (not Nintendo's theme — synthesized homage)
    const MELODY = [
      [523.25, 0.18], [659.25, 0.18], [783.99, 0.18], [659.25, 0.18],
      [587.33, 0.18], [698.46, 0.18], [880.0, 0.18], [698.46, 0.18],
      [523.25, 0.18], [659.25, 0.18], [783.99, 0.36], [0, 0.12],
      [392.0, 0.18], [523.25, 0.18], [659.25, 0.18], [523.25, 0.18],
      [440.0, 0.18], [554.37, 0.18], [659.25, 0.36], [0, 0.18],
    ];

    function stopMarioMusic() {
      clearTimeout(music.timer);
      music.timer = 0;
      music.nodes.forEach((n) => {
        try { n.stop(); } catch (_) {}
      });
      music.nodes = [];
    }

    function scheduleMelodyLoop() {
      const ctx = getAudioCtx();
      if (!ctx) return;
      let t = ctx.currentTime + 0.05;
      MELODY.forEach(([freq, dur]) => {
        if (freq > 0) {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = "square";
          osc.frequency.setValueAtTime(freq, t);
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(0.035, t + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0001, t + dur - 0.02);
          osc.connect(g);
          g.connect(musicOut());
          osc.start(t);
          osc.stop(t + dur + 0.02);
          music.nodes.push(osc);
          // soft bass under melody
          const bass = ctx.createOscillator();
          const bg = ctx.createGain();
          bass.type = "triangle";
          bass.frequency.setValueAtTime(freq / 2, t);
          bg.gain.setValueAtTime(0.0001, t);
          bg.gain.exponentialRampToValueAtTime(0.02, t + 0.02);
          bg.gain.exponentialRampToValueAtTime(0.0001, t + dur - 0.02);
          bass.connect(bg);
          bg.connect(musicOut());
          bass.start(t);
          bass.stop(t + dur + 0.02);
          music.nodes.push(bass);
        }
        t += dur;
      });
      const loopMs = Math.max(200, (t - ctx.currentTime) * 1000 - 40);
      music.timer = setTimeout(() => {
        if (!over && !won) scheduleMelodyLoop();
      }, loopMs);
    }

    function startMarioMusic() {
      stopMarioMusic();
      scheduleMelodyLoop();
    }

    function setPlayerSize(big) {
      const wasBig = player.big;
      player.big = big;
      player.h = big ? 36 : 28;
      player.w = big ? 22 : 20;
      if (big && !wasBig) player.y -= 8;
      if (!big) player.fire = false;
    }

    function grantAbility(type) {
      if (type === "mushroom") {
        setPlayerSize(true);
        score += 1000;
        showToast("Super Mushroom!");
      } else if (type === "fireflower") {
        setPlayerSize(true);
        player.fire = true;
        score += 1000;
        showToast("Fire Flower!");
      } else if (type === "star") {
        starTimer = 420;
        score += 1000;
        showToast("Star power!");
      }
      setScore(score);
    }

    function shootFire() {
      if (!player.fire || over || won || flag.claimed || fireCooldown > 0) return;
      const live = fireballs.filter((f) => !f.dead).length;
      if (live >= 2) return;
      fireballs.push({
        x: scroll + player.x + (player.facing > 0 ? player.w : 0),
        y: player.y + player.h * 0.45,
        vx: player.facing * 5.2,
        vy: -2.2,
        r: 6,
        life: 90,
        dead: false,
      });
      fireCooldown = 12;
      const ctx = getAudioCtx();
      if (ctx) {
        tone(ctx, {
          freq: 620,
          type: "square",
          start: ctx.currentTime,
          dur: 0.08,
          gain: 0.04,
          attack: 0.005,
          release: 0.05,
        });
      }
    }

    function resetRun() {
      lives = 5;
      score = 0;
      level = 1;
      over = false;
      won = false;
      clearPending = false;
      setScore(0);
      loadLevel(1);
      startMarioMusic();
    }

    function respawn() {
      player.x = 80;
      player.y = GROUND - player.h;
      player.vy = 0;
      player.vx = 0;
      player.onGround = true;
      setPlayerSize(false);
      player.fire = false;
      scroll = 0;
      invuln = 90;
      starTimer = 0;
      fireCooldown = 0;
      powerups = [];
      fireballs = [];
      flag.sliding = false;
      flag.claimed = false;
      flag.playerFlag = false;
      flag.flagY = flag.topY;
    }

    function loseLife() {
      if (invuln > 0 || starTimer > 0 || flag.claimed) return;
      if (player.fire) {
        player.fire = false;
        invuln = 90;
        showToast("Lost fire power");
        return;
      }
      if (player.big) {
        setPlayerSize(false);
        invuln = 90;
        return;
      }
      lives -= 1;
      if (lives <= 0) {
        over = true;
        stopMarioMusic();
        return;
      }
      respawn();
      showToast(`${lives} ${lives === 1 ? "life" : "lives"} left`);
    }

    function loadLevel(n) {
      level = n;
      levelEnd = n === 1 ? 4200 : 4800;
      flagX = levelEnd - 180;
      goombas = [];
      pipes = [];
      pits = [];
      platforms = [];
      coins = [];
      blocks = [];
      movers = [];
      powerups = [];
      fireballs = [];
      particles = [];
      scroll = 0;
      jumpBuf = 0;
      invuln = 0;
      starTimer = 0;
      fireCooldown = 0;
      clearPending = false;
      won = false;
      player = {
        x: 80,
        y: GROUND - 28,
        vx: 0,
        vy: 0,
        w: 20,
        h: 28,
        onGround: true,
        big: false,
        fire: false,
        facing: 1,
      };
      flag = {
        x: flagX,
        flagY: GROUND - 200,
        topY: GROUND - 200,
        bottomY: GROUND - 40,
        sliding: false,
        claimed: false,
        playerFlag: false,
      };
      last = performance.now();
      if (n === 1) buildLevel1();
      else buildLevel2();
    }

    function addQ(x, y, contains) {
      platforms.push({
        x, y, w: TILE, h: TILE,
        kind: "q",
        contains: contains || "coin",
        used: false,
        bump: 0,
      });
    }

    function addBrick(x, y, breakable) {
      platforms.push({
        x, y, w: TILE, h: TILE,
        kind: "brick",
        breakable: breakable !== false,
        used: false,
        bump: 0,
      });
    }

    function buildLevel1() {
      [[480, 70], [920, 100], [1480, 80], [1960, 110], [2520, 90], [3040, 120], [3480, 85], [3820, 95]]
        .forEach(([x, h]) => pipes.push({ x, y: GROUND - h, w: 44, h }));
      [[680, 70], [1180, 90], [1680, 80], [2220, 100], [2780, 85], [3300, 95], [3680, 75]]
        .forEach(([x, w]) => pits.push({ x, w }));

      // floating ? / brick patterns (classic side-scroll spacing)
      addQ(360, GROUND - 112, "power");
      addBrick(520, GROUND - 112, true);
      addQ(548, GROUND - 112, "coin");
      addBrick(576, GROUND - 112, true);
      addQ(604, GROUND - 112, "power");
      addBrick(632, GROUND - 112, true);

      addQ(760, GROUND - 168, "star");

      addBrick(1020, GROUND - 96, true);
      addBrick(1048, GROUND - 96, true);
      addQ(1076, GROUND - 96, "power");
      addBrick(1104, GROUND - 96, true);
      addBrick(1132, GROUND - 96, true);
      addQ(1076, GROUND - 176, "coin");

      addQ(1360, GROUND - 120, "power");
      addQ(1440, GROUND - 120, "coin");
      addQ(1520, GROUND - 120, "power");

      for (let i = 0; i < 3; i++) addBrick(1780 + i * TILE, GROUND - 88, true);
      addQ(1864, GROUND - 152, "power");
      addBrick(1892, GROUND - 152, true);
      addQ(1920, GROUND - 152, "star");

      addBrick(2140, GROUND - 104, true);
      addQ(2168, GROUND - 104, "coin");
      addBrick(2196, GROUND - 104, true);
      addQ(2224, GROUND - 104, "power");
      addBrick(2252, GROUND - 104, true);

      addQ(2460, GROUND - 180, "power");
      for (let i = 0; i < 2; i++) addBrick(2680 + i * TILE, GROUND - 96, true);
      addQ(2736, GROUND - 96, "coin");
      addQ(2736, GROUND - 168, "power");

      addBrick(2980, GROUND - 112, true);
      addQ(3008, GROUND - 112, "power");
      addBrick(3036, GROUND - 112, true);
      addQ(3200, GROUND - 140, "star");
      addQ(3380, GROUND - 100, "coin");
      addBrick(3408, GROUND - 100, true);
      addQ(3436, GROUND - 100, "power");
      addBrick(3620, GROUND - 128, true);
      addQ(3648, GROUND - 128, "power");

      [420, 580, 840, 1000, 1240, 1500, 1700, 1900, 2280, 2440, 2700, 2920, 3160, 3420, 3600, 3880]
        .forEach((x, i) => goombas.push({ x, y: GROUND - 20, w: 22, h: 20, vx: i % 2 === 0 ? -0.9 : 0.9, alive: true }));
      [1076, 1864, 2224, 2736, 3436].forEach((x) => {
        goombas.push({ x, y: GROUND - 140, w: 22, h: 20, vx: -0.7, alive: true });
      });

      for (let i = 0; i < 36; i++) {
        coins.push({ x: 340 + i * 100, y: GROUND - 55 - (i % 3) * 24, r: 7, taken: false });
      }

      for (let step = 0; step < 6; step++) {
        for (let h = 0; h <= step; h++) {
          blocks.push({ x: flagX - 220 + step * TILE, y: GROUND - TILE * (h + 1), w: TILE, h: TILE, kind: "stair" });
        }
      }
    }

    function buildLevel2() {
      [[460, 90], [880, 120], [1320, 100], [1780, 130], [2280, 110], [2760, 140], [3280, 100], [3860, 120]]
        .forEach(([x, h]) => pipes.push({ x, y: GROUND - h, w: 48, h }));
      [[640, 90], [1080, 100], [1540, 110], [2040, 120], [2540, 95], [3100, 110], [3640, 100]]
        .forEach(([x, w]) => pits.push({ x, w }));

      addQ(380, GROUND - 120, "power");
      addBrick(520, GROUND - 100, true);
      addQ(548, GROUND - 100, "power");
      addBrick(576, GROUND - 100, true);
      addQ(604, GROUND - 100, "star");
      addBrick(632, GROUND - 100, true);
      addQ(548, GROUND - 180, "coin");

      addQ(980, GROUND - 140, "power");
      addQ(1120, GROUND - 100, "coin");
      addBrick(1148, GROUND - 100, true);
      addQ(1176, GROUND - 100, "power");

      for (let i = 0; i < 4; i++) addBrick(1480 + i * TILE, GROUND - 88, true);
      addQ(1564, GROUND - 160, "power");
      addQ(1700, GROUND - 120, "star");

      addBrick(2020, GROUND - 112, true);
      addQ(2048, GROUND - 112, "power");
      addBrick(2076, GROUND - 112, true);
      addQ(2240, GROUND - 168, "coin");
      addQ(2480, GROUND - 120, "power");
      addBrick(2508, GROUND - 120, true);
      addQ(2536, GROUND - 120, "power");

      addQ(2880, GROUND - 140, "star");
      for (let i = 0; i < 3; i++) addBrick(3080 + i * TILE, GROUND - 96, true);
      addQ(3164, GROUND - 168, "power");
      addQ(3400, GROUND - 120, "coin");
      addQ(3560, GROUND - 150, "power");
      addBrick(3720, GROUND - 108, true);
      addQ(3748, GROUND - 108, "power");

      movers.push({ x: 740, y: GROUND - 90, w: TILE * 3, h: 16, ox: 740, oy: GROUND - 90, axis: "x", min: 740, max: 960, speed: 1.2, dir: 1 });
      movers.push({ x: 1260, y: GROUND - 70, w: TILE * 2, h: 16, ox: 1260, oy: GROUND - 70, axis: "y", min: GROUND - 160, max: GROUND - 60, speed: 1.0, dir: -1 });
      movers.push({ x: 1880, y: GROUND - 100, w: TILE * 3, h: 16, ox: 1880, oy: GROUND - 100, axis: "x", min: 1820, max: 2140, speed: 1.5, dir: 1 });
      movers.push({ x: 2420, y: GROUND - 80, w: TILE * 2, h: 16, ox: 2420, oy: GROUND - 80, axis: "y", min: GROUND - 170, max: GROUND - 55, speed: 1.3, dir: 1 });
      movers.push({ x: 2920, y: GROUND - 110, w: TILE * 3, h: 16, ox: 2920, oy: GROUND - 110, axis: "x", min: 2860, max: 3180, speed: 1.6, dir: -1 });
      movers.push({ x: 3680, y: GROUND - 90, w: TILE * 2, h: 16, ox: 3680, oy: GROUND - 90, axis: "y", min: GROUND - 150, max: GROUND - 50, speed: 1.4, dir: -1 });

      [500, 700, 950, 1150, 1400, 1650, 1950, 2200, 2550, 2750, 3000, 3250, 3550, 3850, 4100]
        .forEach((x, i) => goombas.push({ x, y: GROUND - 20, w: 22, h: 20, vx: (i % 2 ? 1.1 : -1.1), alive: true }));

      for (let i = 0; i < 40; i++) {
        coins.push({ x: 360 + i * 100, y: GROUND - 60 - (i % 4) * 22, r: 7, taken: false });
      }

      for (let step = 0; step < 7; step++) {
        for (let h = 0; h <= step; h++) {
          blocks.push({ x: flagX - 240 + step * TILE, y: GROUND - TILE * (h + 1), w: TILE, h: TILE, kind: "stair" });
        }
      }
    }

    function inPit(worldX) {
      return pits.some((p) => worldX > p.x && worldX < p.x + p.w);
    }

    function bumpBlock(block) {
      if (block.used && block.kind === "q") return;
      block.bump = 8;
      if (block.kind === "q" && !block.used) {
        block.used = true;
        block.kind = "used";
        let type = block.contains || "coin";
        // Mario-style: power block → mushroom when small, fire flower when big
        if (type === "power" || type === "mushroom") {
          type = player.big || player.fire ? "fireflower" : "mushroom";
        }
        if (type === "coin") {
          score += 200;
          setScore(score);
          particles.push({ x: block.x + 14, y: block.y, vy: -3, life: 20, kind: "coin" });
          const ctx = getAudioCtx();
          if (ctx) {
            tone(ctx, {
              freq: 988,
              type: "square",
              start: ctx.currentTime,
              dur: 0.12,
              gain: 0.045,
              attack: 0.005,
              release: 0.08,
            });
          }
        } else {
          powerups.push({
            x: block.x + 2,
            y: block.y - 24,
            w: 24,
            h: 24,
            vx: type === "mushroom" || type === "fireflower" ? 1.15 : 0,
            vy: -2,
            type,
            rising: 14,
          });
          const ctx = getAudioCtx();
          if (ctx) {
            tone(ctx, {
              freq: 330,
              type: "triangle",
              start: ctx.currentTime,
              dur: 0.1,
              gain: 0.05,
              attack: 0.005,
              release: 0.07,
            });
            tone(ctx, {
              freq: 520,
              type: "square",
              start: ctx.currentTime + 0.08,
              dur: 0.14,
              gain: 0.04,
              attack: 0.005,
              release: 0.08,
            });
          }
        }
      } else if (block.kind === "brick" && block.breakable) {
        if (player.big) {
          const idx = platforms.indexOf(block);
          if (idx >= 0) platforms.splice(idx, 1);
          score += 50;
          setScore(score);
          for (let i = 0; i < 4; i++) {
            particles.push({
              x: block.x + 8 + (i % 2) * 10,
              y: block.y + 8,
              vx: (i % 2 ? 1 : -1) * 2,
              vy: -3 - (i > 1 ? 1 : 0),
              life: 24,
              kind: "brick",
            });
          }
        }
      }
    }

    function solidList() {
      return [
        ...pipes.map((p) => ({ ...p, solid: true, source: null })),
        ...platforms.filter((p) => p.kind !== "gone").map((p) => ({ x: p.x, y: p.y + (p.bump ? -p.bump : 0), w: p.w, h: p.h, solid: true, source: p })),
        ...blocks.map((b) => ({ x: b.x, y: b.y, w: b.w, h: b.h, solid: true, source: null })),
        ...movers.map((m) => ({ x: m.x, y: m.y, w: m.w, h: m.h, solid: true, source: null, mover: m })),
      ];
    }

    function jump() {
      if (over || won || flag.claimed) return;
      if (player.onGround || jumpBuf > 0) {
        player.vy = player.big ? -10 : -9.4;
        player.onGround = false;
        jumpBuf = 0;
      }
    }

    function drawClouds() {
      gctx.fillStyle = "#fff";
      for (let i = 0; i < 5; i++) {
        const cx = ((i * 160 - scroll * 0.15) % (W + 120)) - 40;
        const cy = 40 + (i % 3) * 28;
        gctx.beginPath();
        gctx.ellipse(cx, cy, 22, 12, 0, 0, Math.PI * 2);
        gctx.ellipse(cx + 18, cy - 4, 16, 14, 0, 0, Math.PI * 2);
        gctx.ellipse(cx + 34, cy, 20, 11, 0, 0, Math.PI * 2);
        gctx.fill();
      }
    }

    function drawMario() {
      const x = player.x;
      const y = player.y;
      const flash = invuln > 0 && Math.floor(invuln / 4) % 2 === 0;
      if (flash) return;
      const hat = starTimer > 0
        ? `hsl(${(performance.now() / 8) % 360},90%,55%)`
        : player.fire ? "#f0f0f0" : "#e52521";
      const body = starTimer > 0
        ? `hsl(${(performance.now() / 8 + 40) % 360},90%,60%)`
        : player.fire ? "#f4f4f4" : "#e52521";
      const overalls = player.fire ? "#e52521" : "#3b5fd9";
      gctx.fillStyle = hat;
      gctx.fillRect(x + 2, y + 2, player.w - 2, 8);
      gctx.fillRect(x + (player.facing < 0 ? 0 : 8), y + 6, player.w - 6, 4);
      gctx.fillStyle = "#ffe0bd";
      gctx.fillRect(x + 4, y + 10, player.w - 6, 8);
      gctx.fillStyle = body;
      gctx.fillRect(x + 3, y + 18, player.w - 6, player.big ? 8 : 6);
      gctx.fillStyle = overalls;
      gctx.fillRect(x + 3, y + (player.big ? 26 : 22), player.w - 6, player.big ? 10 : 6);
      gctx.fillStyle = "#6b3a12";
      gctx.fillRect(x + 2, y + player.h - 4, 7, 4);
      gctx.fillRect(x + player.w - 9, y + player.h - 4, 7, 4);
    }

    function drawBlock(sx, b) {
      const y = b.y - (b.bump || 0);
      if (b.kind === "q") {
        gctx.fillStyle = "#fcbc18";
        gctx.fillRect(sx, y, b.w, b.h);
        gctx.strokeStyle = "#a06000";
        gctx.lineWidth = 2;
        gctx.strokeRect(sx + 1, y + 1, b.w - 2, b.h - 2);
        gctx.fillStyle = "#fff";
        gctx.font = "bold 16px sans-serif";
        gctx.textAlign = "center";
        gctx.fillText("?", sx + b.w / 2, y + 20);
      } else if (b.kind === "used") {
        gctx.fillStyle = "#8b5a2b";
        gctx.fillRect(sx, y, b.w, b.h);
        gctx.strokeStyle = "#5a3a18";
        gctx.strokeRect(sx, y, b.w, b.h);
      } else {
        gctx.fillStyle = "#c84c0c";
        gctx.fillRect(sx, y, b.w, b.h);
        gctx.strokeStyle = "#8b3a12";
        gctx.strokeRect(sx, y, b.w, b.h);
        gctx.beginPath();
        gctx.moveTo(sx, y + b.h / 2);
        gctx.lineTo(sx + b.w, y + b.h / 2);
        gctx.moveTo(sx + b.w / 2, y);
        gctx.lineTo(sx + b.w / 2, y + b.h);
        gctx.stroke();
      }
    }

    function drawPipe(sx, p) {
      gctx.fillStyle = "#00a800";
      gctx.fillRect(sx, p.y, p.w, p.h);
      gctx.fillStyle = "#00d800";
      gctx.fillRect(sx + 10, p.y, 12, p.h);
      gctx.fillStyle = "#006b00";
      gctx.fillRect(sx, p.y, 7, p.h);
      gctx.fillRect(sx + p.w - 7, p.y, 7, p.h);
      gctx.fillStyle = "#00b000";
      gctx.fillRect(sx - 7, p.y - 14, p.w + 14, 18);
      gctx.strokeStyle = "#004d00";
      gctx.strokeRect(sx - 7, p.y - 14, p.w + 14, 18);
    }

    function drawFlag() {
      const sx = flag.x - scroll;
      const poleTop = GROUND - 210;
      gctx.fillStyle = "#d0d0d0";
      gctx.fillRect(sx + 10, poleTop, 4, GROUND - poleTop);
      gctx.fillStyle = "#00a800";
      gctx.beginPath();
      gctx.arc(sx + 12, poleTop, 7, 0, Math.PI * 2);
      gctx.fill();
      const fy = flag.flagY;
      if (flag.playerFlag) {
        gctx.fillStyle = "#e52521";
        gctx.beginPath();
        gctx.moveTo(sx + 14, fy);
        gctx.lineTo(sx + 54, fy + 14);
        gctx.lineTo(sx + 14, fy + 28);
        gctx.closePath();
        gctx.fill();
        gctx.fillStyle = "#fff";
        gctx.font = "bold 12px sans-serif";
        gctx.textAlign = "left";
        gctx.fillText("M", sx + 18, fy + 19);
      } else {
        gctx.fillStyle = "#111";
        gctx.beginPath();
        gctx.moveTo(sx + 14, fy);
        gctx.lineTo(sx + 50, fy + 12);
        gctx.lineTo(sx + 14, fy + 24);
        gctx.closePath();
        gctx.fill();
        gctx.fillStyle = "#fff";
        gctx.beginPath();
        gctx.arc(sx + 28, fy + 12, 5, 0, Math.PI * 2);
        gctx.fill();
      }
      const cx = sx + 70;
      gctx.fillStyle = "#7a7a7a";
      gctx.fillRect(cx, GROUND - 74, 74, 74);
      gctx.fillStyle = "#999";
      for (let i = 0; i < 4; i++) gctx.fillRect(cx + i * 19, GROUND - 86, 15, 14);
      gctx.fillStyle = "#222";
      gctx.fillRect(cx + 26, GROUND - 38, 22, 38);
    }

    function drawHud() {
      gctx.fillStyle = "#fff";
      gctx.font = "12px Orbitron, sans-serif";
      gctx.textAlign = "left";
      gctx.fillText(`SCORE ${score}`, 8, 16);
      gctx.fillText(`WORLD ${level}-1`, 140, 16);
      gctx.fillText(`×${Math.max(0, lives)}`, 280, 16);
      // mini mario icon for lives
      gctx.fillStyle = "#e52521";
      gctx.fillRect(262, 6, 10, 10);
      gctx.fillStyle = "#ffe0bd";
      gctx.fillRect(264, 9, 6, 4);
      if (player.fire) {
        gctx.fillStyle = "#ff7a3c";
        gctx.fillText("FIRE", 8, 32);
      }
      if (level === 2) {
        gctx.fillStyle = "#ffd166";
        gctx.fillText("MOVING STAGE", player.fire ? 70 : 8, 32);
      }
    }

    function draw() {
      gctx.fillStyle = level === 1 ? "#5c94fc" : "#3d6fd1";
      gctx.fillRect(0, 0, W, H);
      drawClouds();
      gctx.fillStyle = "#5cbf2a";
      gctx.beginPath();
      gctx.ellipse(70 - ((scroll * 0.2) % 240), GROUND + 10, 100, 44, 0, 0, Math.PI * 2);
      gctx.ellipse(260 - ((scroll * 0.2) % 240), GROUND + 10, 120, 50, 0, 0, Math.PI * 2);
      gctx.fill();

      gctx.fillStyle = "#c84c0c";
      gctx.fillRect(0, GROUND, W, H - GROUND);
      gctx.fillStyle = "#e85d2a";
      for (let x = -((scroll % 28)); x < W; x += 28) {
        gctx.strokeStyle = "#8b3a12";
        gctx.strokeRect(x, GROUND, 28, 28);
      }
      pits.forEach((p) => {
        gctx.fillStyle = "#081018";
        gctx.fillRect(p.x - scroll, GROUND, p.w, H - GROUND);
      });

      platforms.forEach((b) => drawBlock(b.x - scroll, b));
      blocks.forEach((b) => drawBlock(b.x - scroll, { ...b, kind: "brick" }));
      pipes.forEach((p) => drawPipe(p.x - scroll, p));
      movers.forEach((m) => {
        gctx.fillStyle = "#a0a0a0";
        gctx.fillRect(m.x - scroll, m.y, m.w, m.h);
        gctx.fillStyle = "#ccc";
        gctx.fillRect(m.x - scroll + 2, m.y + 2, m.w - 4, 4);
        gctx.strokeStyle = "#555";
        gctx.strokeRect(m.x - scroll, m.y, m.w, m.h);
      });

      coins.forEach((c) => {
        if (c.taken) return;
        gctx.fillStyle = "#fcbc18";
        gctx.beginPath();
        gctx.ellipse(c.x - scroll, c.y, 5, 8, 0, 0, Math.PI * 2);
        gctx.fill();
      });

      powerups.forEach((p) => {
        const sx = p.x - scroll;
        if (p.type === "mushroom") {
          gctx.fillStyle = "#e52521";
          gctx.fillRect(sx, p.y, p.w, 14);
          gctx.fillStyle = "#fff";
          gctx.fillRect(sx + 4, p.y + 3, 6, 5);
          gctx.fillRect(sx + 14, p.y + 3, 6, 5);
          gctx.fillStyle = "#ffe0bd";
          gctx.fillRect(sx + 4, p.y + 14, p.w - 8, 10);
        } else if (p.type === "fireflower") {
          gctx.fillStyle = "#2ecc71";
          gctx.fillRect(sx + 10, p.y + 12, 4, 12);
          gctx.fillStyle = "#ff5c2e";
          gctx.beginPath();
          gctx.ellipse(sx + 12, p.y + 10, 10, 8, 0, 0, Math.PI * 2);
          gctx.fill();
          gctx.fillStyle = "#ffd166";
          gctx.beginPath();
          gctx.ellipse(sx + 12, p.y + 10, 5, 4, 0, 0, Math.PI * 2);
          gctx.fill();
        } else {
          gctx.fillStyle = `hsl(${(performance.now() / 6) % 360},90%,60%)`;
          gctx.beginPath();
          gctx.moveTo(sx + 12, p.y);
          gctx.lineTo(sx + 24, p.y + 12);
          gctx.lineTo(sx + 12, p.y + 24);
          gctx.lineTo(sx, p.y + 12);
          gctx.closePath();
          gctx.fill();
        }
      });

      fireballs.forEach((f) => {
        if (f.dead) return;
        const sx = f.x - scroll;
        gctx.fillStyle = "#ff7a18";
        gctx.beginPath();
        gctx.arc(sx, f.y, f.r, 0, Math.PI * 2);
        gctx.fill();
        gctx.fillStyle = "#ffe066";
        gctx.beginPath();
        gctx.arc(sx - 1, f.y - 1, f.r * 0.45, 0, Math.PI * 2);
        gctx.fill();
      });

      goombas.forEach((g) => {
        if (!g.alive) return;
        const sx = g.x - scroll;
        gctx.fillStyle = "#8b4513";
        gctx.beginPath();
        gctx.ellipse(sx + 11, g.y + 10, 11, 10, 0, 0, Math.PI * 2);
        gctx.fill();
        gctx.fillStyle = "#fff";
        gctx.fillRect(sx + 5, g.y + 6, 4, 4);
        gctx.fillRect(sx + 13, g.y + 6, 4, 4);
        gctx.fillStyle = "#000";
        gctx.fillRect(sx + 6, g.y + 7, 2, 2);
        gctx.fillRect(sx + 14, g.y + 7, 2, 2);
      });

      particles.forEach((p) => {
        gctx.fillStyle = p.kind === "coin" ? "#fcbc18" : "#c84c0c";
        gctx.fillRect(p.x - scroll, p.y, 6, 6);
      });

      drawFlag();
      drawMario();
      drawHud();

      if (over || won) {
        gctx.fillStyle = "rgba(0,0,0,0.55)";
        gctx.fillRect(0, 0, W, H);
        gctx.fillStyle = "#fff";
        gctx.font = "20px Orbitron, sans-serif";
        gctx.textAlign = "center";
        gctx.fillText(won ? "WORLD CLEAR!" : "GAME OVER", W / 2, H / 2);
        if (!won) {
          gctx.font = "14px Rajdhani, sans-serif";
          gctx.fillText("Out of lives", W / 2, H / 2 + 26);
        }
      } else if (clearPending) {
        gctx.fillStyle = "rgba(0,0,0,0.4)";
        gctx.fillRect(0, 0, W, H);
        gctx.fillStyle = "#fff";
        gctx.font = "18px Orbitron, sans-serif";
        gctx.textAlign = "center";
        gctx.fillText("COURSE CLEAR!", W / 2, H / 2);
        gctx.font = "14px Rajdhani, sans-serif";
        gctx.fillText("World 2 — moving stage!", W / 2, H / 2 + 26);
      }
    }

    function resolveSolids() {
      player.onGround = false;
      const solids = solidList();
      const feetX = scroll + player.x + player.w / 2;
      if (!inPit(feetX) && player.y + player.h >= GROUND) {
        player.y = GROUND - player.h;
        player.vy = 0;
        player.onGround = true;
      } else if (inPit(feetX) && player.y > GROUND + 36) {
        loseLife();
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
          if (player.vy >= 0 && prevBottom <= s.y + 8) {
            player.y = s.y - player.h;
            player.vy = 0;
            player.onGround = true;
            if (s.mover && s.mover.axis === "x") {
              player.x += s.mover.dir * s.mover.speed * 0.9;
            }
          } else if (player.vy < 0 && player.y + player.h > s.y + s.h * 0.4) {
            // hit from below
            player.y = s.y + s.h;
            player.vy = 0.5;
            if (s.source) bumpBlock(s.source);
          } else {
            const overlapLeft = player.x + player.w - sx;
            const overlapRight = sx + s.w - player.x;
            if (overlapLeft < overlapRight) player.x = sx - player.w;
            else player.x = sx + s.w;
          }
        }
      });
    }

    function advanceAfterFlag() {
      if (level === 1) {
        clearPending = true;
        setTimeout(() => {
          if (over) return;
          clearPending = false;
          loadLevel(2);
          showToast("World 2 — watch the platforms!");
        }, 1400);
      } else {
        won = true;
        stopMarioMusic();
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

      jumpBuf = Math.max(0, jumpBuf - dt);
      if (invuln > 0) invuln -= dt;
      if (starTimer > 0) starTimer -= dt;
      if (fireCooldown > 0) fireCooldown -= dt;

      platforms.forEach((b) => {
        if (b.bump) b.bump = Math.max(0, b.bump - dt);
      });

      movers.forEach((m) => {
        if (m.axis === "x") {
          m.x += m.dir * m.speed * dt;
          if (m.x > m.max || m.x < m.min) m.dir *= -1;
        } else {
          m.y += m.dir * m.speed * dt;
          if (m.y > m.max || m.y < m.min) m.dir *= -1;
        }
      });

      particles.forEach((p) => {
        p.x += (p.vx || 0) * dt;
        p.y += p.vy * dt;
        p.vy += 0.25 * dt;
        p.life -= dt;
      });
      particles = particles.filter((p) => p.life > 0);

      if (!flag.claimed && !clearPending) {
        if (keys.has("ArrowLeft") || keys.has("a") || keys.has("A")) {
          player.x -= 3.5 * dt;
          player.facing = -1;
        }
        if (keys.has("ArrowRight") || keys.has("d") || keys.has("D")) {
          player.x += 3.5 * dt;
          player.facing = 1;
        }
        if (keys.has("ArrowUp") || keys.has(" ") || keys.has("w") || keys.has("W")) jump();
        if (keys.has("z") || keys.has("Z") || keys.has("x") || keys.has("X")) shootFire();

        player.x = Math.max(16, Math.min(W - 36, player.x));
        if (player.x > W * 0.45) {
          const push = player.x - W * 0.45;
          scroll += push;
          player.x -= push;
        }
        scroll = Math.max(0, Math.min(scroll, levelEnd - W));

        player.vy += 0.48 * dt;
        player.y += player.vy * dt;
        resolveSolids();

        goombas.forEach((g) => {
          if (!g.alive) return;
          g.x += g.vx * dt * 1.5;
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
            player.y + player.h < g.y + g.h * 0.65;
          if (stomping) {
            g.alive = false;
            player.vy = -6.5;
            score += 100;
            setScore(score);
          } else if (
            invuln <= 0 &&
            player.x < sx + g.w &&
            player.x + player.w > sx &&
            player.y < g.y + g.h &&
            player.y + player.h > g.y
          ) {
            if (starTimer > 0) {
              g.alive = false;
              score += 100;
              setScore(score);
            } else loseLife();
          }
        });

        coins.forEach((c) => {
          if (c.taken) return;
          const sx = c.x - scroll;
          const dx = player.x + player.w / 2 - sx;
          const dy = player.y + player.h / 2 - c.y;
          if (dx * dx + dy * dy < 16 * 16) {
            c.taken = true;
            score += 100;
            setScore(score);
          }
        });

        powerups.forEach((p) => {
          if (p.rising > 0) {
            p.y -= 1.2 * dt;
            p.rising -= dt;
            return;
          }
          p.vy += 0.35 * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          if (p.y + p.h >= GROUND) {
            p.y = GROUND - p.h;
            p.vy = 0;
          }
          pipes.forEach((pipe) => {
            if (
              p.x + p.w > pipe.x &&
              p.x < pipe.x + pipe.w &&
              p.y + p.h > pipe.y &&
              p.y < pipe.y + pipe.h
            ) {
              p.vx *= -1;
            }
          });
          const sx = p.x - scroll;
          if (
            player.x < sx + p.w &&
            player.x + player.w > sx &&
            player.y < p.y + p.h &&
            player.y + player.h > p.y
          ) {
            p.dead = true;
            grantAbility(p.type);
          }
        });
        powerups = powerups.filter((p) => !p.dead && p.x - scroll > -40);

        fireballs.forEach((f) => {
          if (f.dead) return;
          f.vy += 0.35 * dt;
          f.x += f.vx * dt;
          f.y += f.vy * dt;
          f.life -= dt;
          if (f.y + f.r >= GROUND) {
            f.y = GROUND - f.r;
            f.vy = -3.2;
          }
          if (f.life <= 0 || f.x - scroll < -20 || f.x - scroll > W + 20) f.dead = true;
          goombas.forEach((g) => {
            if (!g.alive || f.dead) return;
            if (
              f.x + f.r > g.x &&
              f.x - f.r < g.x + g.w &&
              f.y + f.r > g.y &&
              f.y - f.r < g.y + g.h
            ) {
              g.alive = false;
              f.dead = true;
              score += 100;
              setScore(score);
            }
          });
        });
        fireballs = fireballs.filter((f) => !f.dead);

        const poleScreen = flag.x - scroll;
        if (
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
          player.vy = 0;
        }
      }

      if (flag.sliding) {
        flag.flagY += 2.6 * dt;
        player.x = flag.x - scroll + 16;
        player.y = Math.min(player.y + 2.4 * dt, GROUND - player.h);
        if (flag.flagY >= flag.bottomY) {
          flag.flagY = flag.bottomY;
          flag.sliding = false;
          player.y = GROUND - player.h;
          advanceAfterFlag();
        }
      }

      draw();
    }

    return {
      id: "mario2d",
      start() {
        resetRun();
        gameRaf = requestAnimationFrame(loop);
      },
      onKey(e) {
        if (e.key === "ArrowUp" || e.key === " ") jump();
        if (e.key === "z" || e.key === "Z" || e.key === "x" || e.key === "X") shootFire();
      },
      onPointer() {
        jumpBuf = 8;
        jump();
      },
      destroy() {
        stopMarioMusic();
      },
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

  els.resetProgress.addEventListener("click", resetAllProgress);

  els.settingsOpen.addEventListener("click", openSettingsModal);
  els.settingsClose.addEventListener("click", closeSettingsModal);
  els.settingsModal.addEventListener("click", (e) => {
    if (e.target === els.settingsModal) closeSettingsModal();
  });
  els.settingBrightness.addEventListener("input", () => {
    state.settings.brightness = Number(els.settingBrightness.value);
    els.settingBrightnessVal.textContent = `${state.settings.brightness}%`;
    applyBrightnessSetting();
    saveState();
  });
  els.settingSound.addEventListener("input", () => {
    state.settings.soundVolume = Number(els.settingSound.value);
    els.settingSoundVal.textContent = `${state.settings.soundVolume}%`;
    applyAudioSettings();
    saveState();
  });
  els.settingMusic.addEventListener("input", () => {
    state.settings.musicVolume = Number(els.settingMusic.value);
    els.settingMusicVal.textContent = `${state.settings.musicVolume}%`;
    applyAudioSettings();
    saveState();
  });
  els.settingMute.addEventListener("change", () => {
    state.settings.muted = els.settingMute.checked;
    applyAudioSettings();
    saveState();
  });

  // Drop legacy save so prior progress/time starts fresh
  localStorage.removeItem("study-with-games-v1");

  renderXp();
  renderQuests();
  renderTimer();
  renderTokens();
  renderShop();
  renderStreak();
  renderStudyStats();
  applyTheme(state.activeTheme);
  applyBrightnessSetting();
  syncSettingsUI();
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
