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
      desc: "Epic Death Star superlaser — dense stars, flares, and cinematic green beam.",
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
      help: "Tap a variant · click cards · stock to deal · classic card SFX (no BGM)",
    },
    {
      id: "arkanoid",
      name: "Arkanoid",
      rarity: "rare",
      cost: RARITY_COST.rare,
      desc: "Break bricks with the paddle.",
      help: "← → or A/D · click/tap · start jingle + bounce SFX · boss theme late-game",
    },
    {
      id: "galaga",
      name: "Galaga",
      rarity: "epic",
      cost: RARITY_COST.epic,
      desc: "Blast waves of invaders.",
      help: "← → move · Space / tap shoot · start fanfare + capture/rescue cues",
    },
    {
      id: "tetris",
      name: "Tetris",
      rarity: "legendary",
      cost: RARITY_COST.legendary,
      desc: "Classic stack-and-clear blocks.",
      help: "← → move · ↑ rotate · ↓ soft · Space hard · Music A/B/C (Korobeiniki+)",
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
    settingAiKey: document.getElementById("setting-ai-key"),
    settingAiBase: document.getElementById("setting-ai-base"),
    settingAiModel: document.getElementById("setting-ai-model"),
    aiChat: document.getElementById("ai-chat"),
    aiForm: document.getElementById("ai-form"),
    aiInput: document.getElementById("ai-input"),
    aiSend: document.getElementById("ai-send"),
    aiClear: document.getElementById("ai-clear"),
    aiStatus: document.getElementById("ai-status"),
    aiSuggestions: document.getElementById("ai-suggestions"),
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
      aiKey: typeof loaded?.settings?.aiKey === "string" ? loaded.settings.aiKey : "",
      aiBase:
        typeof loaded?.settings?.aiBase === "string" && loaded.settings.aiBase
          ? loaded.settings.aiBase
          : "https://openrouter.ai/api/v1",
      aiModel:
        typeof loaded?.settings?.aiModel === "string" && loaded.settings.aiModel
          ? loaded.settings.aiModel
          : "openai/gpt-oss-20b:free",
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
  /** Games stay locked until a focus (study) session finishes */
  let gamesUnlocked = false;
  let toastTimer = null;
  let audioCtx = null;
  let soundBus = null;
  let musicBus = null;
  const aiHistory = [];

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
    if (els.settingAiKey) els.settingAiKey.value = s.aiKey || "";
    if (els.settingAiBase) els.settingAiBase.value = s.aiBase || "https://openrouter.ai/api/v1";
    if (els.settingAiModel) els.settingAiModel.value = s.aiModel || "openai/gpt-oss-20b:free";
    updateAiStatus();
  }

  function updateAiStatus() {
    if (!els.aiStatus) return;
    els.aiStatus.textContent = state.settings.aiKey ? "PulseSearch+LLM" : "PulseSearch";
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

  /* ---------- Chiptune engine (classic arcade / Game Boy style) ---------- */
  const NOTE_FQ = {
    R: 0,
    C3: 130.81, Cs3: 138.59, D3: 146.83, Ds3: 155.56, E3: 164.81, F3: 174.61, Fs3: 185.0, G3: 196.0, Gs3: 207.65, A3: 220.0, As3: 233.08, B3: 246.94,
    C4: 261.63, Cs4: 277.18, D4: 293.66, Ds4: 311.13, E4: 329.63, F4: 349.23, Fs4: 369.99, G4: 392.0, Gs4: 415.3, A4: 440.0, As4: 466.16, B4: 493.88,
    C5: 523.25, Cs5: 554.37, D5: 587.33, Ds5: 622.25, E5: 659.25, F5: 698.46, Fs5: 739.99, G5: 783.99, Gs5: 830.61, A5: 880.0, As5: 932.33, B5: 987.77,
    C6: 1046.5, D6: 1174.66, E6: 1318.51, F6: 1396.91, G6: 1567.98, A6: 1760.0,
  };
  const chipLoops = new Map();

  function nfreq(n) {
    if (typeof n === "number") return n;
    if (!n || n === "R" || n === "r" || n === "-") return 0;
    return NOTE_FQ[n] || 0;
  }

  function stopChipLoop(id) {
    const loop = chipLoops.get(id);
    if (!loop) return;
    clearTimeout(loop.timer);
    (loop.nodes || []).forEach((node) => {
      try {
        node.stop();
      } catch (_) {}
    });
    chipLoops.delete(id);
  }

  function stopAllChipMusic() {
    [...chipLoops.keys()].forEach(stopChipLoop);
  }

  /**
   * Play a chiptune sequence.
   * notes: [[noteName|freq|"R", beats], ...]
   */
  function playChipSequence(notes, opts = {}) {
    const {
      id = null,
      loop = false,
      gain = 0.038,
      type = "square",
      beat = 0.16,
      bus = "music",
      bass = false,
    } = opts;
    const ctx = getAudioCtx();
    if (!ctx || !notes?.length) return 0;
    if (id) stopChipLoop(id);

    const out = bus === "music" ? musicOut() : soundOut();
    const nodes = [];
    let t = ctx.currentTime + 0.02;
    const startT = t;

    notes.forEach((row) => {
      const note = Array.isArray(row) ? row[0] : row;
      const beats = Array.isArray(row) ? row[1] ?? 1 : 1;
      const dur = Math.max(0.04, beats * beat);
      const freq = nfreq(note);
      if (freq > 0) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(gain, t + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.92);
        osc.connect(g);
        g.connect(out);
        osc.start(t);
        osc.stop(t + dur + 0.02);
        nodes.push(osc);
        if (bass) {
          const bOsc = ctx.createOscillator();
          const bg = ctx.createGain();
          bOsc.type = "triangle";
          bOsc.frequency.setValueAtTime(freq / 2, t);
          bg.gain.setValueAtTime(0.0001, t);
          bg.gain.exponentialRampToValueAtTime(gain * 0.55, t + 0.015);
          bg.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.9);
          bOsc.connect(bg);
          bg.connect(out);
          bOsc.start(t);
          bOsc.stop(t + dur + 0.02);
          nodes.push(bOsc);
        }
      }
      t += dur;
    });

    const totalMs = Math.max(80, (t - startT) * 1000);
    if (id) {
      const entry = { nodes, timer: 0 };
      if (loop) {
        entry.timer = setTimeout(() => {
          if (chipLoops.get(id) === entry) playChipSequence(notes, opts);
        }, totalMs - 30);
      }
      chipLoops.set(id, entry);
    }
    return totalMs;
  }

  function playNoiseBurst({ dur = 0.08, gain = 0.05, startFreq = 1200, endFreq = 200 } = {}) {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const t0 = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(startFreq, t0);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, endFreq), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(soundOut());
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  // Public-domain folk/classical arranged as 8-bit; arcade cues are synthesized homages
  const SONGS = {
    // Tetris Type A — Korobeiniki (19th-c. Russian folk, public domain)
    tetrisA: [
      ["E5", 1], ["B4", 0.5], ["C5", 0.5], ["D5", 1], ["C5", 0.5], ["B4", 0.5],
      ["A4", 1], ["A4", 0.5], ["C5", 0.5], ["E5", 1], ["D5", 0.5], ["C5", 0.5],
      ["B4", 1.5], ["C5", 0.5], ["D5", 1], ["E5", 1], ["C5", 1], ["A4", 1], ["A4", 2],
      ["D5", 1.5], ["F5", 0.5], ["A5", 1], ["G5", 0.5], ["F5", 0.5],
      ["E5", 1.5], ["C5", 0.5], ["E5", 1], ["D5", 0.5], ["C5", 0.5],
      ["B4", 1.5], ["C5", 0.5], ["D5", 1], ["E5", 1], ["C5", 1], ["A4", 1], ["A4", 2],
    ],
    // Tetris Type B — upbeat original-style electronic loop (Game Boy vibe homage)
    tetrisB: [
      ["A4", 0.5], ["C5", 0.5], ["E5", 0.5], ["A5", 0.5], ["G5", 0.5], ["E5", 0.5], ["C5", 0.5], ["E5", 0.5],
      ["F5", 0.5], ["A5", 0.5], ["C6", 0.5], ["A5", 0.5], ["G5", 0.5], ["E5", 0.5], ["D5", 0.5], ["E5", 0.5],
      ["A4", 0.5], ["C5", 0.5], ["E5", 0.5], ["A5", 0.5], ["B5", 0.5], ["A5", 0.5], ["G5", 0.5], ["E5", 0.5],
      ["F5", 1], ["E5", 1], ["D5", 1], ["C5", 1],
    ],
    // Tetris Type C — Bach French Suite No. 3 (public domain) 8-bit sketch
    tetrisC: [
      ["B4", 1], ["D5", 1], ["F5", 1], ["B5", 1], ["A5", 1], ["F5", 1], ["D5", 1], ["F5", 1],
      ["G5", 1], ["F5", 0.5], ["E5", 0.5], ["D5", 1], ["C5", 1], ["B4", 1], ["A4", 1], ["B4", 2],
      ["D5", 1], ["F5", 1], ["A5", 1], ["G5", 1], ["F5", 1], ["E5", 1], ["D5", 1], ["Cs5", 1],
      ["D5", 2], ["A4", 1], ["D5", 1], ["F5", 2], ["E5", 1], ["D5", 1], ["Cs5", 2],
    ],
    // Galaga start fanfare (arcade-cue homage)
    galagaStart: [
      ["C5", 0.4], ["E5", 0.4], ["G5", 0.4], ["C6", 0.7], ["G5", 0.35], ["E5", 0.35], ["G5", 0.5], ["C6", 1.1],
    ],
    galagaChallenge: [
      ["G5", 0.25], ["A5", 0.25], ["B5", 0.25], ["C6", 0.45], ["R", 0.15], ["E6", 0.55],
    ],
    galagaCapture: [
      ["A5", 0.35], ["F5", 0.35], ["D5", 0.35], ["B4", 0.7],
    ],
    galagaRescue: [
      ["B4", 0.25], ["D5", 0.25], ["Fs5", 0.25], ["A5", 0.45], ["Cs6", 0.7],
    ],
    // Arkanoid cues (Taito-style homage)
    arkanoidStart: [
      ["E4", 0.3], ["G4", 0.3], ["B4", 0.3], ["E5", 0.55], ["B4", 0.25], ["E5", 0.85],
    ],
    arkanoidBoss: [
      ["E3", 0.5], ["E3", 0.5], ["G3", 0.5], ["E3", 0.5], ["A3", 0.5], ["G3", 0.5], ["E3", 0.5], ["D3", 0.5],
      ["E3", 0.5], ["E3", 0.5], ["G3", 0.5], ["B3", 0.5], ["A3", 0.5], ["G3", 0.5], ["Fs3", 0.5], ["E3", 1],
    ],
  };

  const GameSFX = {
    tetrisMove() {
      const ctx = getAudioCtx();
      if (!ctx) return;
      tone(ctx, { freq: 180, type: "square", start: ctx.currentTime, dur: 0.04, gain: 0.03, attack: 0.002, release: 0.03 });
    },
    tetrisRotate() {
      const ctx = getAudioCtx();
      if (!ctx) return;
      tone(ctx, { freq: 420, type: "square", start: ctx.currentTime, dur: 0.05, gain: 0.035, attack: 0.002, release: 0.03 });
      tone(ctx, { freq: 620, type: "square", start: ctx.currentTime + 0.03, dur: 0.05, gain: 0.03, attack: 0.002, release: 0.03 });
    },
    tetrisLock() {
      playNoiseBurst({ dur: 0.07, gain: 0.04, startFreq: 220, endFreq: 70 });
    },
    tetrisLine(n = 1) {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const base = [523.25, 659.25, 783.99, 1046.5];
      for (let i = 0; i < Math.min(4, n + 1); i++) {
        tone(ctx, {
          freq: base[i],
          type: "square",
          start: ctx.currentTime + i * 0.05,
          dur: 0.14,
          gain: 0.045,
          attack: 0.005,
          release: 0.08,
        });
      }
    },
    tetrisGameOver() {
      playChipSequence(
        [["E5", 1], ["Cs5", 1], ["B4", 1], ["A4", 1.5], ["G4", 2]],
        { beat: 0.14, gain: 0.045, type: "square", bus: "sound" }
      );
    },
    galagaShoot() {
      playNoiseBurst({ dur: 0.06, gain: 0.035, startFreq: 1400, endFreq: 480 });
    },
    galagaHit(elite) {
      const ctx = getAudioCtx();
      if (!ctx) return;
      tone(ctx, {
        freq: elite ? 880 : 660,
        type: "square",
        start: ctx.currentTime,
        dur: 0.07,
        gain: 0.04,
        attack: 0.002,
        release: 0.04,
      });
      if (elite) {
        tone(ctx, {
          freq: 1175,
          type: "triangle",
          start: ctx.currentTime + 0.04,
          dur: 0.1,
          gain: 0.035,
          attack: 0.002,
          release: 0.06,
        });
      }
    },
    arkanoidBounce() {
      const ctx = getAudioCtx();
      if (!ctx) return;
      tone(ctx, { freq: 520, type: "triangle", start: ctx.currentTime, dur: 0.05, gain: 0.04, attack: 0.002, release: 0.03 });
    },
    arkanoidBrick() {
      playNoiseBurst({ dur: 0.08, gain: 0.045, startFreq: 900, endFreq: 160 });
    },
    arkanoidLose() {
      playChipSequence(
        [["E4", 1], ["C4", 1], ["A3", 1.5]],
        { beat: 0.14, gain: 0.045, type: "square", bus: "sound" }
      );
    },
    solitaireClick() {
      const ctx = getAudioCtx();
      if (!ctx) return;
      tone(ctx, { freq: 980, type: "triangle", start: ctx.currentTime, dur: 0.035, gain: 0.04, attack: 0.001, release: 0.025 });
    },
    solitaireDeal() {
      const ctx = getAudioCtx();
      if (!ctx) return;
      for (let i = 0; i < 5; i++) {
        tone(ctx, {
          freq: 700 + i * 40,
          type: "triangle",
          start: ctx.currentTime + i * 0.03,
          dur: 0.04,
          gain: 0.03,
          attack: 0.001,
          release: 0.02,
        });
      }
    },
    solitairePlace() {
      const ctx = getAudioCtx();
      if (!ctx) return;
      tone(ctx, { freq: 620, type: "triangle", start: ctx.currentTime, dur: 0.05, gain: 0.035, attack: 0.002, release: 0.03 });
      tone(ctx, { freq: 820, type: "sine", start: ctx.currentTime + 0.03, dur: 0.06, gain: 0.025, attack: 0.002, release: 0.04 });
    },
    solitaireShuffle() {
      const ctx = getAudioCtx();
      if (!ctx) return;
      for (let i = 0; i < 8; i++) {
        playNoiseBurst({
          dur: 0.035,
          gain: 0.028,
          startFreq: 600 + Math.random() * 500,
          endFreq: 120 + Math.random() * 80,
        });
        // stagger via tiny delaying tones
        tone(ctx, {
          freq: 200 + i * 30,
          type: "square",
          start: ctx.currentTime + i * 0.028,
          dur: 0.02,
          gain: 0.012,
          attack: 0.001,
          release: 0.015,
        });
      }
    },
    solitaireWin() {
      // Cascading card celebration (no victory song — classic Solitaire style)
      const ctx = getAudioCtx();
      if (!ctx) return;
      for (let i = 0; i < 12; i++) {
        tone(ctx, {
          freq: 400 + (i % 6) * 90,
          type: "triangle",
          start: ctx.currentTime + i * 0.055,
          dur: 0.08,
          gain: 0.035,
          attack: 0.002,
          release: 0.05,
        });
      }
    },
  };

  function startTetrisMusic(track = "A") {
    const map = { A: SONGS.tetrisA, B: SONGS.tetrisB, C: SONGS.tetrisC };
    const song = map[track] || SONGS.tetrisA;
    playChipSequence(song, {
      id: "tetris-bgm",
      loop: true,
      beat: track === "B" ? 0.13 : track === "C" ? 0.18 : 0.15,
      gain: 0.034,
      type: "square",
      bass: true,
      bus: "music",
    });
  }

  function startArkanoidBossMusic() {
    playChipSequence(SONGS.arkanoidBoss, {
      id: "arkanoid-boss",
      loop: true,
      beat: 0.14,
      gain: 0.036,
      type: "square",
      bass: true,
      bus: "music",
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
      aiKey: "",
      aiBase: "https://openrouter.ai/api/v1",
      aiModel: "openai/gpt-oss-20b:free",
    };
    aiHistory.length = 0;
    aiUserName = "";
    renderAiChat();
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

  function lockGames() {
    gamesUnlocked = false;
    if (els.gameModal && !els.gameModal.hidden) closeGameModal();
    if (els.gameShop) renderShop();
  }

  function unlockGames() {
    gamesUnlocked = true;
    renderShop();
  }

  function canPlayGames() {
    return gamesUnlocked === true;
  }

  function renderTimer() {
    const { minutes, seconds } = formatTime(remaining);
    els.timerMinutes.textContent = minutes;
    els.timerSeconds.textContent = seconds;
    els.timerToggle.textContent = running ? "Pause" : remaining < totalForMode ? "Resume" : "Start";
    els.timerDisplay.classList.toggle("running", running);

    const labels = { focus: "Focus", short: "Short Break", long: "Long Break" };
    els.timerMode.textContent = labels[currentMode] || "Focus";
    if (currentMode === "focus") {
      els.timerHint.textContent = gamesUnlocked
        ? "Start focus to lock games again · finish for +25 XP."
        : "Games stay locked until this study session finishes · +25 XP when done.";
    } else {
      els.timerHint.textContent = gamesUnlocked
        ? "Games unlocked — play a break game, then jump back in."
        : "Take a break — finish a focus session next time to unlock games.";
    }
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
        unlockGames();
        showToast("Study time's up — games unlocked!");
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
    // Starting (or resuming) study locks games until the session completes
    if (currentMode === "focus") {
      lockGames();
    }
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

    // Switching back to Focus locks games for the next study block
    if (mode === "focus") {
      lockGames();
    }

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
      if (canPlayGames()) {
        actionLabel = "Play";
        actionAttr = `data-play-game="${item.id}"`;
        btnClass = "btn-primary";
      } else {
        actionLabel = "Locked · study first";
        actionAttr = `data-locked-game="${item.id}"`;
        btnClass = "btn-ghost";
        disabled = "disabled";
      }
    } else if (!canAfford) {
      disabled = "disabled";
    }

    const swatch =
      type === "theme" ? `<div class="preview-swatch ${item.id}" aria-hidden="true"></div>` : "";
    const lockedGame = type === "game" && owned && !canPlayGames();

    return `
      <article class="shop-card${owned ? " owned" : ""}${active ? " active-theme" : ""}${lockedGame ? " game-locked" : ""}">
        <div class="shop-card-top">
          <p class="shop-card-name">${item.name}</p>
          <span class="rarity ${item.rarity}">${item.rarity}</span>
        </div>
        ${swatch}
        <p class="shop-card-desc">${item.desc}</p>
        ${lockedGame ? `<p class="shop-lock-hint">Finish a Focus session to play</p>` : ""}
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
    const locked = e.target.closest("[data-locked-game]");
    const buy = e.target.closest("[data-buy-game]");
    if (locked) {
      showToast("Games unlock when your study time is up");
      return;
    }
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
        "Rest up from your quests. Buy games in the shop — they unlock after Focus.";
      els.rewardGames.innerHTML = "";
    } else if (!canPlayGames()) {
      els.rewardCopy.textContent =
        "Take a breather. Finish a Focus session next to unlock your games.";
      els.rewardGames.innerHTML = "";
    } else {
      els.rewardCopy.textContent =
        "Study time's up — games unlocked. Play while the rest countdown runs.";
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
    stopAllChipMusic();
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
    if (!canPlayGames()) {
      showToast("Games unlock when your study time is up");
      return;
    }
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
      GameSFX.solitaireShuffle();

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
        GameSFX.solitaireWin();
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
      GameSFX.solitaireDeal();
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
              GameSFX.solitairePlace();
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
      GameSFX.solitaireShuffle();

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
        GameSFX.solitaireWin();
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
      GameSFX.solitaireShuffle();

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
      GameSFX.solitairePlace();
      if (pyramidCleared()) {
        won = true;
        bumpScore(300);
        message = "Pyramid cleared!";
        showToast("Pyramid win!");
        GameSFX.solitaireWin();
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
      GameSFX.solitaireClick();
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
        GameSFX.tetrisLine(cleared);
      }
    }

    function hardDrop() {
      while (!collide(piece.x, piece.y + 1, piece.matrix)) piece.y += 1;
      lock();
    }

    function lock() {
      merge();
      GameSFX.tetrisLock();
      clearLines();
      spawn();
      if (over) {
        stopChipLoop("tetris-bgm");
        GameSFX.tetrisGameOver();
      }
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

    let musicTrack = "A";

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
        // Cycle Type A (Korobeiniki) → B → C like Game Boy Tetris
        const order = ["A", "B", "C"];
        musicTrack = order[Math.floor(Math.random() * order.length)];
        if (els.gameHelp) els.gameHelp.textContent = `← → move · ↑ rotate · ↓ soft · Space hard · Music ${musicTrack}`;
        startTetrisMusic(musicTrack);
        spawn();
        last = performance.now();
        gameRaf = requestAnimationFrame(loop);
      },
      onKey(e) {
        if (over) return;
        if (e.key === "ArrowLeft" && !collide(piece.x - 1, piece.y, piece.matrix)) {
          piece.x -= 1;
          GameSFX.tetrisMove();
        }
        if (e.key === "ArrowRight" && !collide(piece.x + 1, piece.y, piece.matrix)) {
          piece.x += 1;
          GameSFX.tetrisMove();
        }
        if (e.key === "ArrowDown" && !collide(piece.x, piece.y + 1, piece.matrix)) {
          piece.y += 1;
          score += 1;
          setScore(score);
        }
        if (e.key === "ArrowUp") {
          const next = rotate(piece.matrix);
          if (!collide(piece.x, piece.y, next)) {
            piece.matrix = next;
            GameSFX.tetrisRotate();
          }
        }
        if (e.key === " ") hardDrop();
      },
      destroy() {
        stopChipLoop("tetris-bgm");
      },
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
      GameSFX.galagaShoot();
    }

    function addScore(amount) {
      const before = currentFireLevel();
      score += amount;
      setScore(score);
      fireLevel = currentFireLevel();
      if (fireLevel > before) {
        showToast(`Fire power ×${shotCount()}!`);
        // Challenging-stage style jingle on power ramp
        playChipSequence(SONGS.galagaChallenge, {
          beat: 0.12,
          gain: 0.045,
          type: "square",
          bus: "sound",
        });
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
        const elite = Math.random() < 0.2;
        enemies.push({
          x: 30 + Math.random() * (W - 60),
          y: -20,
          vy: 0.08 + Math.random() * 0.08 + score * 0.0002,
          elite,
        });
        if (elite) {
          // Capture-beam cue when a tractor / elite ship appears
          playChipSequence(SONGS.galagaCapture, {
            beat: 0.12,
            gain: 0.04,
            type: "square",
            bus: "sound",
          });
        }
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
            GameSFX.galagaHit(en.elite);
            if (en.elite) {
              playChipSequence(SONGS.galagaRescue, {
                beat: 0.11,
                gain: 0.042,
                type: "square",
                bus: "sound",
              });
            }
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
        playChipSequence(SONGS.galagaStart, {
          beat: 0.14,
          gain: 0.048,
          type: "square",
          bass: true,
          bus: "music",
        });
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
    let bossMusic = false;

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
      bossMusic = false;
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

      if (ball.x < ball.r || ball.x > W - ball.r) {
        ball.vx *= -1;
        GameSFX.arkanoidBounce();
      }
      if (ball.y < ball.r) {
        ball.vy *= -1;
        GameSFX.arkanoidBounce();
      }
      if (ball.y > H) {
        over = true;
        stopChipLoop("arkanoid-boss");
        GameSFX.arkanoidLose();
      }

      if (
        ball.y + ball.r >= paddle.y &&
        ball.y + ball.r <= paddle.y + paddle.h &&
        ball.x > paddle.x - paddle.w / 2 &&
        ball.x < paddle.x + paddle.w / 2 &&
        ball.vy > 0
      ) {
        ball.vy *= -1;
        ball.vx = ((ball.x - paddle.x) / (paddle.w / 2)) * 4;
        GameSFX.arkanoidBounce();
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
          GameSFX.arkanoidBrick();
        }
      });

      const alive = bricks.filter((b) => b.alive).length;
      // Final-boss vibe when only a few bricks remain (Doh-style tension loop)
      if (!bossMusic && alive > 0 && alive <= 6) {
        bossMusic = true;
        startArkanoidBossMusic();
      }

      if (bricks.every((b) => !b.alive)) {
        won = true;
        stopChipLoop("arkanoid-boss");
        playChipSequence(SONGS.arkanoidStart, {
          beat: 0.12,
          gain: 0.045,
          type: "square",
          bus: "music",
        });
      }
      draw();
    }

    return {
      id: "arkanoid",
      start() {
        reset();
        playChipSequence(SONGS.arkanoidStart, {
          beat: 0.13,
          gain: 0.048,
          type: "square",
          bass: true,
          bus: "music",
        });
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
      destroy() {
        stopChipLoop("arkanoid-boss");
      },
    };
  }

  /* ---------- AI Mode (human chat + research + math) ---------- */
  const AI_SYSTEM = `You are a sharp multilingual study buddy inside "study with games".
Your job: answer the EXACT question the user asked — not a nearby topic, not a generic encyclopedia dump.
ALWAYS reply in the same language the user used (unless they ask for another language).
Hard rules for every answer:
1) First 1–2 sentences must directly answer THAT question (who/what/why/how/when/where/yes-no as asked).
2) Only use internet results that help answer this question; ignore off-topic pages.
3) Then briefly explain, staying on the asked question.
4) Optional 1–3 extra facts ONLY if they still relate to the question.
5) Cite source links as markdown.
6) If results don't fully cover the question, say what you can answer and what is still unclear — do not switch topics.
Talk naturally. Don't dodge. Don't paste random blurbs.
For math: show steps. End with 2-3 follow-up questions about the same topic.
Be accurate. Don't take invigilated exams for them — teach instead.`;

  let aiUserName = "";
  let aiLastLang = { code: "en", name: "English", wiki: "en" };

  /** Lightweight language detection (no heavy libs) — script + keyword cues */
  function detectLanguage(text) {
    const t = String(text || "").trim();
    if (!t) return { code: "en", name: "English", wiki: "en" };

    const counts = {
      cjk: (t.match(/[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/g) || []).length,
      hangul: (t.match(/[\uac00-\ud7af]/g) || []).length,
      arabic: (t.match(/[\u0600-\u06ff\u0750-\u077f]/g) || []).length,
      hebrew: (t.match(/[\u0590-\u05ff]/g) || []).length,
      cyrillic: (t.match(/[\u0400-\u04ff]/g) || []).length,
      greek: (t.match(/[\u0370-\u03ff]/g) || []).length,
      thai: (t.match(/[\u0e00-\u0e7f]/g) || []).length,
      devanagari: (t.match(/[\u0900-\u097f]/g) || []).length,
      bengali: (t.match(/[\u0980-\u09ff]/g) || []).length,
      tamil: (t.match(/[\u0b80-\u0bff]/g) || []).length,
      latin: (t.match(/[A-Za-zÀ-ÿ]/g) || []).length,
    };
    const letters = Object.values(counts).reduce((a, b) => a + b, 0) || 1;

    if (counts.hangul / letters > 0.2) return { code: "ko", name: "Korean", wiki: "ko" };
    if (counts.cjk / letters > 0.2) {
      // Prefer Japanese if kana present, else Chinese
      if (/[\u3040-\u30ff]/.test(t)) return { code: "ja", name: "Japanese", wiki: "ja" };
      return { code: "zh", name: "Chinese", wiki: "zh" };
    }
    if (counts.arabic / letters > 0.2) return { code: "ar", name: "Arabic", wiki: "ar" };
    if (counts.hebrew / letters > 0.2) return { code: "he", name: "Hebrew", wiki: "he" };
    if (counts.thai / letters > 0.2) return { code: "th", name: "Thai", wiki: "th" };
    if (counts.devanagari / letters > 0.2) return { code: "hi", name: "Hindi", wiki: "hi" };
    if (counts.bengali / letters > 0.2) return { code: "bn", name: "Bengali", wiki: "bn" };
    if (counts.tamil / letters > 0.2) return { code: "ta", name: "Tamil", wiki: "ta" };
    if (counts.greek / letters > 0.2) return { code: "el", name: "Greek", wiki: "el" };
    if (counts.cyrillic / letters > 0.2) {
      const low = t.toLowerCase();
      if (/\b(і|ї|є|що|як|це)\b/i.test(low)) return { code: "uk", name: "Ukrainian", wiki: "uk" };
      if (/\b(що|какво|това)\b/i.test(low)) return { code: "bg", name: "Bulgarian", wiki: "bg" };
      return { code: "ru", name: "Russian", wiki: "ru" };
    }

    const low = t.toLowerCase();
    const tests = [
      // More specific Romance / Germanic cues first (avoid bare "que/was/is" false positives)
      { code: "pt", name: "Portuguese", wiki: "pt", re: /\b(o que|o quê|você|voce|obrigado|obrigada|não|nao|por que|porque|onde|olá|ola|explique|gravidade)\b/ },
      { code: "es", name: "Spanish", wiki: "es", re: /\b(qué|quién|quien|cómo|como|por qué|porque|dónde|donde|hola|gracias|explique|qué es|que es|el cielo|la tierra)\b/ },
      { code: "fr", name: "French", wiki: "fr", re: /\b(quoi|qui|comment|pourquoi|où|bonjour|salut|merci|qu'est-ce|est-ce|explique|c'est|le ciel)\b/ },
      { code: "de", name: "German", wiki: "de", re: /\b(was ist|wer ist|warum|wieso|woher|wohin|hallo|danke|erklär|erklaer|nicht|für mich|wie funktioniert|der himmel)\b/ },
      { code: "it", name: "Italian", wiki: "it", re: /\b(che cos|chi è|come si|perché|perche|dove|ciao|grazie|spiega|cos'è|cosè|il cielo)\b/ },
      { code: "nl", name: "Dutch", wiki: "nl", re: /\b(wat is|wie is|hoe|waarom|waar is|hallo|dankjewel|dank je|uitleg|alsjeblieft)\b/ },
      { code: "pl", name: "Polish", wiki: "pl", re: /\b(co to|kto|jak|dlaczego|gdzie|cześć|czesc|dziękuję|dziekuje|wyjaśnij)\b/ },
      { code: "tr", name: "Turkish", wiki: "tr", re: /\b(nedir|kim|nasıl|nasil|neden|nerede|merhaba|teşekkür|tesekkur)\b/ },
      { code: "vi", name: "Vietnamese", wiki: "vi", re: /\b(là gì|như thế nào|tại sao|tai sao|ở đâu|xin chào|cảm ơn|cảm ơn)\b/ },
      { code: "id", name: "Indonesian", wiki: "id", re: /\b(apa itu|siapa|bagaimana|mengapa|dimana|terima kasih)\b/ },
      { code: "sv", name: "Swedish", wiki: "sv", re: /\b(vad är|vem|hur|varför|varfor|hej|tack|förklara)\b/ },
      { code: "ro", name: "Romanian", wiki: "ro", re: /\b(ce este|cine|cum|de ce|unde|salut|mulțumesc|multumesc|explica)\b/ },
      { code: "cs", name: "Czech", wiki: "cs", re: /\b(co je|kdo|jak|proč|proc|kde|ahoj|děkuji|dekuji|vysvětli)\b/ },
      { code: "hu", name: "Hungarian", wiki: "hu", re: /\b(mi az|ki az|hogyan|miért|miert|hol van|szia|köszönöm|koszonom)\b/ },
      { code: "fi", name: "Finnish", wiki: "fi", re: /\b(mikä on|mika on|kuka|miten|miksi|missä|missa|hei|kiitos)\b/ },
      { code: "en", name: "English", wiki: "en", re: /\b(what|who|why|how|where|when|please|explain|the|is|are)\b/ },
    ];
    for (const row of tests) {
      if (row.re.test(low)) return { code: row.code, name: row.name, wiki: row.wiki };
    }
    // Accent hints (Portuguese ã/õ before Spanish/French overlap)
    if (/[ãõ]/i.test(t)) return { code: "pt", name: "Portuguese", wiki: "pt" };
    if (/[ñ¿¡]/i.test(t)) return { code: "es", name: "Spanish", wiki: "es" };
    if (/[àâçéèêëîïôùûüœ]/i.test(t) && /[àâçêëîïôùûüœ]/i.test(t)) return { code: "fr", name: "French", wiki: "fr" };
    if (/[áéíóúü]/i.test(t) && /\b(el|la|los|las|qué|por)\b/i.test(low)) return { code: "es", name: "Spanish", wiki: "es" };
    if (/[äöüß]/i.test(t)) return { code: "de", name: "German", wiki: "de" };
    if (/[áéíóúç]/i.test(t) && /\b(o|a|os|as|não|nao|uma)\b/i.test(low)) return { code: "pt", name: "Portuguese", wiki: "pt" };

    return { code: "en", name: "English", wiki: "en" };
  }

  const INTENT_PATTERNS = {
    who: /\b(who|who's|who is|who was|quién|quien|qui|quem|wer|chi|kto|kim|siapa|ai|кто|кто такой|誰|谁|누가)\b/i,
    when: /\b(when|what year|cuándo|cuando|quand|quando|wann|kiedy|언제|いつ|什么时候|когда)\b/i,
    where: /\b(where|dónde|donde|où|onde|wo|dove|gdzie|nerede|어디|どこ|哪里|где)\b/i,
    why: /\b(why|how come|por qué|porque|pourquoi|por que|warum|perché|perche|dlaczego|neden|왜|なぜ|为什么|почему|tại sao|tai sao|mengapa)\b/i,
    how: /\b(how|cómo|como|comment|wie|come|jak|nasıl|nasil|어떻게|どう|如何|как|bagaimana|như thế nào)\b/i,
    compare: /\b(vs\.?|versus|difference between|compare|diferencia|différence|unterschied|różnica|차이|違い|区别|разница)\b/i,
    define: /\b(what is|what's|whats|qué es|que es|qu'est-ce|o que é|was ist|che cos|co to|nedir|무엇|とは|什么是|что такое|apa itu|là gì)\b/i,
    causes: /\b(cause|causes|caused|causing|causas|causes de|ursachen|przyczyny|원인|原因|причины)\b/i,
    examples: /\b(example|examples|ejemplo|exemple|beispiel|przykład|예시|例|例子|пример)\b/i,
    yesno: /^\s*(is|are|was|were|do|does|did|can|could|should|will|would|has|have|had|es|está|son|est-ce|ist|sind|это|是否|인가)\b/i,
    list: /\b(list|name (some|the|a few)|types of|kinds of|examples of|cuáles|quels|welche|какие|どんな|어떤|哪些)\b/i,
  };

  const QUERY_STOP = new Set([
    "the","a","an","and","or","of","to","in","on","for","with","that","this","from","into","about","please","just","really","very","some","any","my","your","me","you","i","we","they","it","is","are","was","were","be","been","do","does","did","can","could","would","should","will","what","who","why","how","when","where","which","tell","explain","define","describe","help","look","search","google","find","out","like","simple","simply","step","by",
  ]);

  function buildStarfield(el, count, sizeMin, sizeMax, colorChance) {
    if (!el) return;
    const parts = [];
    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * 1600);
      const y = Math.floor(Math.random() * 1000);
      const s = (sizeMin + Math.random() * (sizeMax - sizeMin)).toFixed(1);
      const tint = Math.random() < colorChance
        ? (Math.random() < 0.5 ? "rgba(200,255,230,0.95)" : "rgba(210,230,255,0.95)")
        : "rgba(255,255,255,0.95)";
      parts.push(`${x}px ${y}px 0 ${s}px ${tint}`);
    }
    el.style.boxShadow = parts.join(",");
  }

  function initStarfields() {
    buildStarfield(document.getElementById("sw-starfield-far"), 220, 0, 0.4, 0.25);
    buildStarfield(document.getElementById("sw-starfield-mid"), 140, 0.2, 0.7, 0.35);
    buildStarfield(document.getElementById("sw-starfield-near"), 70, 0.5, 1.2, 0.4);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatAiHtml(str) {
    let html = escapeHtml(str);
    html = html.replace(/^####\s+(.+)$/gm, "<h4>$1</h4>");
    html = html.replace(/^###\s+(.+)$/gm, "<h4>$1</h4>");
    html = html.replace(/^##\s+(.+)$/gm, "<h4>$1</h4>");
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
    html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    html = html.replace(/(^|[\s(])(https?:\/\/[^\s<]+)/g, '$1<a href="$2" target="_blank" rel="noopener">$2</a>');
    html = html.replace(/(?:^|\n)[\-\*]\s+(.+)/g, "\n<li>$1</li>");
    html = html.replace(/(?:^|\n)\d+\.\s+(.+)/g, "\n<li>$1</li>");
    if (html.includes("<li>")) {
      html = html.replace(/(?:<li>[\s\S]*?<\/li>\s*)+/g, (block) => `<ul>${block}</ul>`);
    }
    return html;
  }

  function renderAiChat() {
    if (!els.aiChat) return;
    if (!aiHistory.length) {
      els.aiChat.innerHTML = `<div class="ai-msg assistant">Hey${
        aiUserName ? ` ${escapeHtml(aiUserName)}` : ""
      } — ask me in <strong>any language</strong>. I run <strong>PulseSearch</strong>: it detects your language, scans Wikipedia/web in that language (plus English backup), then digs deeper only if it needs more precision.<br><br>Try: “¿Por qué el cielo es azul?”, “Pourquoi le ciel est bleu ?”, or “Why is the sky blue?”${
        state.settings.aiKey ? "" : "<br><br><span style=\"opacity:.75\">Optional: add a free OpenRouter key in Settings for even richer wording in your language.</span>"
      }</div>`;
      return;
    }
    els.aiChat.innerHTML = aiHistory
      .map((m) => {
        if (m.role === "user") {
          return `<div class="ai-msg user">${escapeHtml(m.content)}</div>`;
        }
        const sources = (m.sources || [])
          .map(
            (s, i) =>
              `<a class="ai-source-link" href="${escapeHtml(s.url)}" target="_blank" rel="noopener">${i + 1}. ${escapeHtml(s.title)}</a>`
          )
          .join("");
        const sourceBlock = sources
          ? `<div class="ai-sources"><span class="ai-follow-label">From the web:</span>${sources}</div>`
          : "";
        const follows = (m.followups || [])
          .map((f) => `<button type="button" class="ai-chip" data-prompt="${escapeHtml(f)}">${escapeHtml(f)}</button>`)
          .join("");
        const followBlock = follows
          ? `<div class="ai-followups"><span class="ai-follow-label">Keep talking:</span>${follows}</div>`
          : "";
        return `<div class="ai-msg assistant">${formatAiHtml(m.content)}${sourceBlock}${followBlock}</div>`;
      })
      .join("");
    els.aiChat.scrollTop = els.aiChat.scrollHeight;
  }

  function setAiBusy(busy, label) {
    if (els.aiSend) {
      els.aiSend.disabled = busy;
      els.aiSend.textContent = busy ? label || "One sec…" : "Send";
    }
    if (els.aiInput) els.aiInput.disabled = busy;
  }

  function rememberNameFrom(text) {
    const m = text.match(
      /(?:i(?:'| a)?m|my name is|call me|me llamo|je m'appelle|ich heiße|ich heisse|mi chiamo|meu nome é|меня зовут|저는|私は|我叫)\s+([A-Za-zÀ-ÿА-яЁё\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af][\wÀ-ÿА-яЁё'\-]{1,20})/i
    );
    if (m && !/^(stuck|lost|confused|good|fine|ok|okay|done|here|trying|stress|tired)/i.test(m[1])) {
      aiUserName = m[1];
    }
  }

  function isChitchat(q) {
    const t = q.trim().toLowerCase().replace(/[!?.؟¡¿。！？]+$/gu, "");
    if (t.length <= 2) return true;

    // If they're asking for info / homework, always search — even if it starts with "hey"
    if (
      INTENT_PATTERNS.who.test(t) ||
      INTENT_PATTERNS.when.test(t) ||
      INTENT_PATTERNS.where.test(t) ||
      INTENT_PATTERNS.why.test(t) ||
      INTENT_PATTERNS.how.test(t) ||
      INTENT_PATTERNS.define.test(t) ||
      INTENT_PATTERNS.compare.test(t) ||
      INTENT_PATTERNS.causes.test(t) ||
      INTENT_PATTERNS.examples.test(t) ||
      INTENT_PATTERNS.list.test(t) ||
      INTENT_PATTERNS.yesno.test(t) ||
      /\b(explain|define|tell me about|search|look up|google|find out|homework|solve|equation|calculate|what|why|how|who|when|where|explique|explica|erklär|объясни|説明|解释)\b/i.test(
        t
      ) ||
      // Any longer content question with a noun-ish topic → research, don't small-talk
      (t.length > 18 && extractKeywords(t).length >= 2)
    ) {
      return false;
    }

    const chatOnly = [
      /^(hi|hey|hello|yo|sup|hiya|howdy|hola|bonjour|salut|ciao|hallo|olá|ola|merhaba|привет|안녕|こんにちは|你好|السلام عليكم|shalom)$/u,
      /^(hi|hey|hello|yo|sup|hiya|howdy|hola|bonjour|salut)\s+(there|friend|man|dude|bro)?$/,
      /^(good )?(morning|afternoon|evening|night|días|dias|matin|soir|morgen|abend)$/,
      /^(how are you|how's it going|how r u|whats up|what's up|wyd|cómo estás|como estas|ça va|ca va|wie geht|как дела|잘 지내|元気|你好吗)$/u,
      /^(thanks|thank you|thx|ty|appreciate it|thanks a lot|thank you so much|gracias|merci|danke|obrigado|obrigada|grazie|спасибо|ありがとう|谢谢|고마워)$/u,
      /^(lol|lmao|haha|hehe|omg|wow|nice|cool|okay|ok|k|alright|bet|fr|true|jaja|mdr)$/,
      /^(bye|goodbye|see ya|later|gtg|adiós|adios|au revoir|tschüss|ciao|пока|再见|안녕)$/u,
      /^(i'?m )?(tired|stressed|sad|anxious|overwhelmed|bored|hungry|cansado|fatigué|müde|устал)$/u,
      /^(who are you|what are you|what can you do|quién eres|qui es-tu|wer bist du|кто ты|你是谁)$/u,
      /^(love you|ily|te quiero|je t'aime)$/u,
    ];
    if (chatOnly.some((re) => re.test(t))) return true;

    if (
      t.length < 28 &&
      /^(hey|hi|yo|ok|okay|yeah|yep|nah|idk|hmm|wow|hola|salut|ciao|oui|sí|si)\b/i.test(t) &&
      !/\b(is|are|was|were|did|does|can|could|should|would|qué|que|cómo|como|pourquoi|warum|почему)\b/i.test(t)
    ) {
      return true;
    }
    return false;
  }

  const CHITCHAT_I18N = {
    en: {
      hi: (n) => `Hey${n}! Good to see you. What's going on — homework, a weird question, or you just wanna talk?`,
      hiF: ["I'm stuck on homework", "Can you help me with math?", "I just need to vent for a sec"],
      how: (n) => `I'm doing great${n} — ready to help. How are *you* doing? School treating you okay?`,
      howF: ["I'm stressed about a test", "Yeah I'm good, help me study", "Can you explain something simply?"],
      thanks: (n) => `Anytime${n}! Seriously. Want to keep going, or take a break?`,
      thanksF: ["Quiz me on what we just did", "Help with something else", "I'm good for now"],
      bye: (n) => `Later${n}! You got this. Come back anytime — even if it's just “ugh I don't get this.”`,
      byeF: ["One more quick question", "Give me a confidence boost"],
      mood: (n) => `Ugh, that's real${n}. School can pile up fast. Want to talk it out, or should we knock out one tiny homework thing together so it feels lighter?`,
      moodF: ["Let's do one small problem", "Just talk with me a bit", "Help me make a simple plan"],
      who: () => `I'm your study buddy in this app — talk to me like a normal person. I can chat, walk through math, explain topics, and look things up in your language.`,
      whoF: ["Help me with my homework", "Let's just chat", "Solve a math problem with me"],
      lol: (n) => `Haha fair${n}. What do you wanna dig into next?`,
      lolF: ["Explain that again simpler", "Give me an example", "New topic"],
      def: (n) => `Okay${n}, I'm with you. Tell me what's on your mind — school stuff or just whatever.`,
      defF: ["I'm confused about something", "Help me solve a problem", "Can we talk through my homework?"],
    },
    es: {
      hi: (n) => `¡Hola${n}! ¿Qué tal — tarea, una duda rara, o solo quieres hablar?`,
      hiF: ["Estoy atascado con la tarea", "¿Me ayudas con mates?", "Solo quiero desahogarme"],
      how: (n) => `Voy genial${n} — listo para ayudar. ¿Y tú? ¿Cómo va el cole?`,
      howF: ["Estoy estresado por un examen", "Bien, ayúdame a estudiar", "Explícame algo simple"],
      thanks: (n) => `¡Cuando quieras${n}! ¿Seguimos o hacemos una pausa?`,
      thanksF: ["Hazme un mini quiz", "Ayuda con otra cosa", "Por ahora estoy bien"],
      bye: (n) => `¡Hasta luego${n}! Tú puedes. Vuelve cuando quieras.`,
      byeF: ["Una pregunta más", "Dame ánimos"],
      mood: (n) => `Uf, te entiendo${n}. El cole se acumula. ¿Hablamos o resolvemos una cosita pequeña juntos?`,
      moodF: ["Hagamos un problema corto", "Solo habla conmigo", "Ayúdame a hacer un plan"],
      who: () => `Soy tu compañero de estudio — háblame normal. Puedo charlar, explicar mates y buscar datos en tu idioma.`,
      whoF: ["Ayúdame con la tarea", "Solo charlemos", "Resolvamos un problema"],
      lol: (n) => `Jaja justo${n}. ¿En qué metemos mano ahora?`,
      lolF: ["Explícalo más simple", "Dame un ejemplo", "Otro tema"],
      def: (n) => `Vale${n}, estoy contigo. Dime qué tienes en la cabeza.`,
      defF: ["Estoy confuso", "Ayúdame a resolver algo", "Repasemos la tarea"],
    },
    fr: {
      hi: (n) => `Salut${n}! Quoi de neuf — devoirs, une question bizarre, ou juste envie de parler ?`,
      hiF: ["Je suis bloqué sur un devoir", "Tu peux m'aider en maths ?", "J'ai juste besoin de parler"],
      how: (n) => `Ça va super${n} — prêt à aider. Et toi, l'école se passe bien ?`,
      howF: ["Je stresse pour un contrôle", "Ça va, aide-moi à réviser", "Explique-moi simplement"],
      thanks: (n) => `Avec plaisir${n}! On continue ou on fait une pause ?`,
      thanksF: ["Interroge-moi", "Aide sur autre chose", "C'est bon pour l'instant"],
      bye: (n) => `À plus${n}! Tu gères. Reviens quand tu veux.`,
      byeF: ["Encore une question", "Donne-moi du courage"],
      mood: (n) => `Oof, je te crois${n}. L'école s'accumule vite. On en parle, ou on règle un tout petit truc ensemble ?`,
      moodF: ["Un petit exercice", "Juste discuter", "Aide-moi à planifier"],
      who: () => `Je suis ton buddy d'étude — parle-moi normalement. Je peux discuter, expliquer les maths et chercher des infos dans ta langue.`,
      whoF: ["Aide-moi pour les devoirs", "On discute", "Résolvons un problème"],
      lol: (n) => `Haha ok${n}. On creuse quoi ensuite ?`,
      lolF: ["Plus simple s'il te plaît", "Donne un exemple", "Nouveau sujet"],
      def: (n) => `Ok${n}, je suis là. Dis-moi ce que tu as en tête.`,
      defF: ["Je suis perdu", "Aide-moi à résoudre", "On regarde mes devoirs ?"],
    },
    de: {
      hi: (n) => `Hey${n}! Was geht — Hausaufgaben, eine komische Frage, oder einfach quatschen?`,
      hiF: ["Ich hänge bei Hausaufgaben", "Hilfst du mir mit Mathe?", "Ich muss kurz Dampf ablassen"],
      how: (n) => `Mir geht's gut${n} — bereit zu helfen. Und dir? Schule okay?`,
      howF: ["Ich stress wegen einer Klausur", "Mir geht's gut, lass uns lernen", "Erklär mir was einfach"],
      thanks: (n) => `Gern${n}! Weitermachen oder Pause?`,
      thanksF: ["Quiz mich", "Hilfe bei etwas anderem", "Fürs Erste gut"],
      bye: (n) => `Bis später${n}! Du schaffst das. Komm jederzeit wieder.`,
      byeF: ["Noch eine kurze Frage", "Mut-Boost bitte"],
      mood: (n) => `Uff, verständlich${n}. Schule stapelt sich. Reden wir, oder lösen wir zusammen was Kleines?`,
      moodF: ["Ein kleines Problem", "Nur reden", "Hilf mir beim Plan"],
      who: () => `Ich bin dein Lernbuddy — sprich normal mit mir. Ich chatte, erkläre Mathe und suche Fakten in deiner Sprache.`,
      whoF: ["Hilf bei Hausaufgaben", "Lass uns chatten", "Matheaufgabe lösen"],
      lol: (n) => `Haha fair${n}. Was als Nächstes?`,
      lolF: ["Einfacher erklären", "Gib ein Beispiel", "Neues Thema"],
      def: (n) => `Okay${n}, ich bin dabei. Was beschäftigt dich?`,
      defF: ["Ich bin verwirrt", "Hilf mir etwas zu lösen", "Hausaufgaben durchgehen"],
    },
    pt: {
      hi: (n) => `Oi${n}! E aí — dever de casa, uma dúvida estranha, ou só quer conversar?`,
      hiF: ["Estou travado na tarefa", "Me ajuda com matemática?", "Só preciso desabafar"],
      how: (n) => `Estou ótimo${n} — pronto pra ajudar. E você? Escola ok?`,
      howF: ["Estou estressado com prova", "Tô bem, me ajuda a estudar", "Explica algo simples"],
      thanks: (n) => `Sempre${n}! Continuamos ou fazemos uma pausa?`,
      thanksF: ["Me faça um quiz", "Ajuda com outra coisa", "Por agora tá bom"],
      bye: (n) => `Até logo${n}! Você consegue. Volta quando quiser.`,
      byeF: ["Mais uma pergunta", "Me anima um pouco"],
      mood: (n) => `Poxa, eu entendo${n}. A escola acumula rápido. Quer conversar ou resolver uma coisazinha juntos?`,
      moodF: ["Um problema pequeno", "Só conversar", "Me ajuda a planejar"],
      who: () => `Sou seu parceiro de estudos — fala normal comigo. Posso conversar, explicar matemática e pesquisar no seu idioma.`,
      whoF: ["Ajuda na tarefa", "Só conversar", "Resolver um problema"],
      lol: (n) => `Haha justo${n}. O que a gente mexe agora?`,
      lolF: ["Explica mais simples", "Me dá um exemplo", "Outro assunto"],
      def: (n) => `Beleza${n}, tô contigo. Conta o que tá na sua cabeça.`,
      defF: ["Estou confuso", "Me ajuda a resolver", "Vamos ver a tarefa"],
    },
    ru: {
      hi: (n) => `Привет${n}! Как дела — домашка, странный вопрос или просто поболтать?`,
      hiF: ["Застрял с домашкой", "Помоги с математикой", "Просто выговориться"],
      how: (n) => `Отлично${n} — готов помочь. А у тебя школа как?`,
      howF: ["Стресс из‑за теста", "Норм, давай учиться", "Объясни просто"],
      thanks: (n) => `Всегда пожалуйста${n}! Продолжаем или перерыв?`,
      thanksF: ["Проверь меня", "Помоги с другим", "Пока хватит"],
      bye: (n) => `Пока${n}! Ты справишься. Заходи когда угодно.`,
      byeF: ["Ещё один вопрос", "Подбодри меня"],
      mood: (n) => `Эх, понимаю${n}. Школа наваливается. Поговорим или сделаем одну крошечную задачу?`,
      moodF: ["Маленькая задачка", "Просто поговорить", "Помоги составить план"],
      who: () => `Я твой учебный напарник — говори как с человеком. Могу болтать, объяснять математику и искать факты на твоём языке.`,
      whoF: ["Помоги с домашкой", "Просто поболтать", "Решим задачу"],
      lol: (n) => `Ха, ладно${n}. Что дальше копнём?`,
      lolF: ["Объясни проще", "Дай пример", "Новая тема"],
      def: (n) => `Окей${n}, я с тобой. Что у тебя на уме?`,
      defF: ["Я запутался", "Помоги решить", "Разберём домашку"],
    },
    ja: {
      hi: (n) => `やあ${n}！どうしたの — 宿題、変な質問、それとも雑談？`,
      hiF: ["宿題で詰まってる", "数学を手伝って", "ちょっと話したい"],
      how: (n) => `元気だよ${n} — いつでも助けるよ。学校は大丈夫？`,
      howF: ["テストがストレス", "大丈夫、勉強手伝って", "簡単に説明して"],
      thanks: (n) => `いつでも${n}！続ける？それとも休憩？`,
      thanksF: ["クイズして", "別のことを手伝って", "今は大丈夫"],
      bye: (n) => `またね${n}！大丈夫、いつでも戻ってきて。`,
      byeF: ["もう一つ質問", "励まして"],
      mood: (n) => `うん、わかるよ${n}。学校は溜まりやすい。話す？それとも小さな宿題を一緒に？`,
      moodF: ["小さい問題をやろう", "ちょっと話そう", "計画を立てよう"],
      who: () => `このアプリの勉強バディだよ。普通に話して。雑談も、数学も、あなたの言語で調べものもできるよ。`,
      whoF: ["宿題を手伝って", "雑談しよう", "問題を解こう"],
      lol: (n) => `はは、なるほど${n}。次は何する？`,
      lolF: ["もっと簡単に", "例をちょうだい", "別の話題"],
      def: (n) => `オーケー${n}、聞くよ。何が気になってる？`,
      defF: ["よくわからない", "問題を解いて", "宿題を見よう"],
    },
    ko: {
      hi: (n) => `안녕${n}! 뭐 해 — 숙제, 이상한 질문, 아니면 그냥 얘기?`,
      hiF: ["숙제에서 막혔어", "수학 도와줄래?", "그냥 좀 말하고 싶어"],
      how: (n) => `난 좋아${n} — 도와줄 준비됐어. 너는? 학교 괜찮아?`,
      howF: ["시험 때문에 스트레스", "괜찮아, 공부 도와줘", "쉽게 설명해줘"],
      thanks: (n) => `언제든${n}! 계속할까, 쉴까?`,
      thanksF: ["퀴즈 내줘", "다른 거 도와줘", "지금은 괜찮아"],
      bye: (n) => `나중에 봐${n}! 잘할 수 있어. 언제든 와.`,
      byeF: ["질문 하나만 더", "응원해 줘"],
      mood: (n) => `에휴, 진짜지${n}. 학교는 금방 쌓여. 얘기할까, 아니면 작은 숙제 하나 같이 할까?`,
      moodF: ["작은 문제 하자", "그냥 얘기하자", "계획 세워줘"],
      who: () => `난 이 앱의 공부 친구야 — 편하게 말해. 수다, 수학, 네 언어로 찾아보기도 가능해.`,
      whoF: ["숙제 도와줘", "수다만 하자", "문제 풀자"],
      lol: (n) => `하하 맞지${n}. 다음에 뭘 볼까?`,
      lolF: ["더 쉽게 설명해", "예시 줘", "새 주제"],
      def: (n) => `오케이${n}, 듣고 있어. 뭐가 마음에 걸려?`,
      defF: ["헷갈려", "문제 풀어줘", "숙제 같이 보자"],
    },
    zh: {
      hi: (n) => `嗨${n}！怎么了——作业、奇怪的问题，还是只是想聊聊？`,
      hiF: ["作业卡住了", "能帮我数学吗？", "只是想吐槽一下"],
      how: (n) => `我很好${n}——随时帮忙。你呢？学校还好吗？`,
      howF: ["考试压力好大", "还行，帮我学习", "简单解释一下"],
      thanks: (n) => `随时${n}！继续还是休息一下？`,
      thanksF: ["考考我", "帮别的事", "先这样吧"],
      bye: (n) => `回见${n}！你行的。随时回来。`,
      byeF: ["再问一个", "给我打打气"],
      mood: (n) => `唉，懂${n}。学校容易堆起来。想聊聊，还是一起搞定一件小事？`,
      moodF: ["做个小题目", "随便聊聊", "帮我订个计划"],
      who: () => `我是这个应用里的学习搭子——正常跟我说话就行。我能聊天、讲数学，也能用你的语言查资料。`,
      whoF: ["帮我做作业", "随便聊聊", "一起解题"],
      lol: (n) => `哈哈行${n}。接下来想搞什么？`,
      lolF: ["再说简单点", "给我个例子", "换个话题"],
      def: (n) => `好${n}，我在听。你在想什么？`,
      defF: ["我有点懵", "帮我解题", "一起看看作业"],
    },
  };

  function chitchatPack(langCode) {
    return CHITCHAT_I18N[langCode] || CHITCHAT_I18N.en;
  }

  function chitchatReply(q) {
    const lang = detectLanguage(q);
    aiLastLang = lang;
    const pack = chitchatPack(lang.code);
    const t = q.trim().toLowerCase();
    const name = aiUserName ? ` ${aiUserName}` : "";
    if (/^(hi|hey|hello|yo|sup|hiya|howdy|hola|bonjour|salut|ciao|hallo|olá|ola|merhaba|привет|안녕|こんにちは|你好|السلام)/u.test(t)) {
      return { content: pack.hi(name), followups: pack.hiF };
    }
    if (/how are you|how's it going|how r u|what's up|whats up|cómo estás|como estas|ça va|ca va|wie geht|как дела|잘 지내|元気|你好吗/u.test(t)) {
      return { content: pack.how(name), followups: pack.howF };
    }
    if (/thanks|thank you|thx|ty|appreciate|gracias|merci|danke|obrigad|grazie|спасибо|ありがとう|谢谢|고마워/u.test(t)) {
      return { content: pack.thanks(name), followups: pack.thanksF };
    }
    if (/bye|goodbye|see ya|later|gtg|adiós|adios|au revoir|tschüss|ciao|пока|再见|안녕/u.test(t)) {
      return { content: pack.bye(name), followups: pack.byeF };
    }
    if (/tired|stressed|sad|anxious|overwhelmed|bored|cansado|fatigué|müde|устал|累|피곤/u.test(t)) {
      return { content: pack.mood(name), followups: pack.moodF };
    }
    if (/who are you|what are you|what can you do|quién eres|qui es-tu|wer bist du|кто ты|你是谁|너는 누구/u.test(t)) {
      return { content: pack.who(name), followups: pack.whoF };
    }
    if (/lol|lmao|haha|hehe|omg|wow|nice|cool|bet|fr|true|jaja|mdr/u.test(t)) {
      return { content: pack.lol(name), followups: pack.lolF };
    }
    return { content: pack.def(name), followups: pack.defF };
  }

  function niceNum(n) {
    if (!Number.isFinite(n)) return String(n);
    if (Number.isInteger(n)) return String(n);
    const r = Math.round(n * 1e6) / 1e6;
    return String(r);
  }

  function extractKeywords(text) {
    return [
      ...new Set(
        String(text || "")
          .toLowerCase()
          .replace(/[^\p{L}\p{N}\s\-']/gu, " ")
          .split(/\s+/)
          .filter((w) => w.length > 2 && !QUERY_STOP.has(w))
      ),
    ].slice(0, 8);
  }

  function understandQuestion(question, prior) {
    const raw = question.trim();
    const lower = raw.toLowerCase();
    const lang = detectLanguage(raw);
    aiLastLang = lang;

    let intent = "explain";
    if (INTENT_PATTERNS.who.test(raw) || /^\s*(who invented|who discovered)/i.test(raw)) intent = "who";
    else if (INTENT_PATTERNS.when.test(raw)) intent = "when";
    else if (INTENT_PATTERNS.where.test(raw)) intent = "where";
    else if (INTENT_PATTERNS.why.test(raw)) intent = "why";
    else if (INTENT_PATTERNS.compare.test(raw)) intent = "compare";
    else if (INTENT_PATTERNS.causes.test(raw) || /\bwhat caused\b/i.test(raw)) intent = "causes";
    else if (INTENT_PATTERNS.define.test(raw)) intent = "define";
    else if (INTENT_PATTERNS.examples.test(raw) || INTENT_PATTERNS.list.test(raw)) intent = "examples";
    else if (INTENT_PATTERNS.how.test(raw)) intent = "how";
    else if (INTENT_PATTERNS.yesno.test(raw)) intent = "yesno";
    else if (trySolveMath(raw)) intent = "math";

    let topic = raw
      .replace(/^(hey|hi|yo|hola|bonjour|salut|ciao|hallo|olá|ola|merhaba|안녕|こんにちは|你好|привет|السلام|please|can you|could you|would you|okay|ok|um+|uh+|por favor|s'il te plaît|bitte)\s+/i, "")
      .replace(/^(explain|define|describe|summarize|tell me about|help me (with|understand)|look up|search for|google|find out|explique|explica|erklär|spiega|説明|解释|объясни)\s+/i, "")
      .replace(/^(what caused|what causes|what is|what's|whats|what are|quién es|quien es|qué es|que es|qu'est-ce que|o que é|was ist|che cos'|co to jest|nedir|무엇|とは|什么是|что такое|apa itu|là gì|who is|who's|who was|who invented|who discovered|where is|where are|when did|when was|why is|why are|why does|why do|why did|cómo|como|comment|how does|how do|how did|how to|how come|por qué|porque|pourquoi|warum|perché|왜|なぜ|为什么|почему)\s+/i, "")
      .replace(/^(is|are|was|were|do|does|did|can|could|should|will|would|has|have|had)\s+/i, "")
      .replace(/\b(like i'?m (tired|dumb|5|in \w+ grade)|in plain english|simply|simple|please|for me|step by step|en simple|simplemente|simplement)\b/gi, "")
      .replace(/[?!؟¡¿]+$/g, "")
      .replace(/\b(work|works|working|mean|means|happening)\s*$/i, "")
      .replace(/^(the|a|an)\s+/i, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!topic || topic.length < 2) topic = raw.replace(/[?!؟]+$/g, "").trim();

    // Short follow-ups reuse prior topic (multilingual cues)
    if (
      prior &&
      (/^(yes|yeah|yep|sure|ok|okay|oui|sí|si|mais|more|más|plus|mehr|もっと|더|еще|more|go deeper|why|cómo|comment|warum|왜|なぜ|为什么|почему|and|also|what about|tell me more|continue|elaborate|wait why|why though)\b/i.test(lower) ||
        topic.length < 12)
    ) {
      const hint =
        String(prior).match(/\*\*([^*]{3,60})\*\*/)?.[1] ||
        String(prior).match(/about\s+\*\*([^*]+)\*\*/i)?.[1];
      if (hint) topic = hint.trim();
    }

    const keywords = extractKeywords(topic);
    const keywordQuery = keywords.slice(0, 5).join(" ");

    const queries = new Set();
    queries.add(topic);
    queries.add(raw.replace(/[?!؟]+$/g, "").slice(0, 120));
    if (keywordQuery && keywordQuery !== topic.toLowerCase()) queries.add(keywordQuery);

    // Intent-specific angles so more question types hit solid sources
    if (intent === "who") {
      queries.add(`${topic} inventor`);
      queries.add(`invention of ${topic}`);
      queries.add(`${topic} biography`);
    } else if (intent === "why" || intent === "causes") {
      queries.add(`${topic} explanation`);
      queries.add(`Causes of ${topic}`);
      queries.add(`${topic} causes`);
      queries.add(`why ${topic}`);
      if (/sky|ciel|cielo|himmel|하늘|空|небо/i.test(topic) && /blue|bleu|azul|blau|파란|青|син/i.test(raw + topic)) {
        queries.add("Rayleigh scattering");
      }
    } else if (intent === "how") {
      queries.add(`how ${topic} works`);
      queries.add(`${topic}`);
      queries.add(`${topic} process`);
      queries.add(`${topic} steps`);
    } else if (intent === "compare") {
      const vs = raw.match(/difference between\s+(.+?)\s+and\s+(.+?)(?:\?|$)/i) ||
        raw.match(/diferencia entre\s+(.+?)\s+y\s+(.+?)(?:\?|$)/i) ||
        raw.match(/différence entre\s+(.+?)\s+et\s+(.+?)(?:\?|$)/i) ||
        raw.match(/(.+?)\s+(?:vs\.?|versus|compared to)\s+(.+?)(?:\?|$)/i);
      if (vs) {
        const left = vs[1].trim();
        const right = vs[2].replace(/[?!؟]+$/, "").trim();
        topic = `${left} vs ${right}`;
        queries.add(left);
        queries.add(right);
        queries.add(`${left} vs ${right}`);
      }
    } else if (intent === "when") {
      queries.add(`${topic} date`);
      queries.add(`${topic} year`);
      queries.add(`${topic} history`);
    } else if (intent === "where") {
      queries.add(`${topic} location`);
      queries.add(`${topic} country`);
    } else if (intent === "examples" || intent === "list") {
      queries.add(`${topic} examples`);
      queries.add(`types of ${topic}`);
    } else if (intent === "yesno") {
      queries.add(topic);
      queries.add(`what is ${topic.split(/\s+/).slice(0, 4).join(" ")}`);
    } else if (intent === "define") {
      queries.add(`what is ${topic}`);
      queries.add(`${topic} definition`);
      queries.add(topic);
    } else {
      queries.add(`what is ${topic}`);
      queries.add(`${topic} overview`);
      queries.add(topic);
    }

    // Keep core noun chunks as extra search keys (helps messy homework wording)
    if (keywords.length >= 2) {
      queries.add(keywords.slice(0, 3).join(" "));
      queries.add(keywords[keywords.length - 1]);
    }

    // High-value school-topic redirects so common questions always land on solid pages
    const blob = `${raw} ${topic}`.toLowerCase();
    if (/world war (i|1|one)\b/.test(blob) && /cause|start|begin|why|led/.test(blob)) {
      queries.add("Causes of World War I");
      queries.add("World War I");
    }
    if (/world war (ii|2|two)\b/.test(blob) && /cause|start|begin|why|led/.test(blob)) {
      queries.add("Causes of World War II");
      queries.add("World War II");
    }
    if (/sky/.test(blob) && /blue/.test(blob)) {
      queries.add("Diffuse sky radiation");
      queries.add("Rayleigh scattering");
    }
    if (/\b(mito|meiosis|photosynthesis|gravity|atom|cell|democracy|inflation|photosynth)\b/i.test(blob)) {
      const hit = blob.match(/\b(mitosis|meiosis|photosynthesis|gravity|atom|cell \(biology\)|democracy|inflation)\b/i);
      if (hit) queries.add(hit[1]);
    }

    return {
      intent,
      topic,
      lang,
      keywords,
      queries: [...queries].filter((t) => t && t.length > 1).slice(0, 10),
    };
  }

  function buildSubtopics(question, prior) {
    return understandQuestion(question, prior).queries;
  }

  function scoreHit(hit, question, topic) {
    const qWords = `${question} ${topic}`
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter(
        (w) =>
          w.length > 1 &&
          !/^(the|and|for|with|that|this|what|who|why|how|when|where|does|did|are|was|can|you|please|about|from|into|qué|que|como|cómo|por|una|los|las|des|les|une|der|die|das|und|ist|что|как|это|это|の|は|を|が|에|는|이|가|的|是|什么)$/iu.test(
            w
          )
      );
    const hay = `${hit.title || ""} ${hit.extract || hit.text || ""}`.toLowerCase();
    let score = 0;
    qWords.forEach((w) => {
      if (hay.includes(w)) score += 2;
      if ((hit.title || "").toLowerCase().includes(w)) score += 3;
    });
    // Prefer Wikipedia encyclopedia pages over tangential matches
    if (hit.source === "Wikipedia") score += 1;
    // Prefer pages from the user's Wikipedia language
    if (hit.wikiLang && aiLastLang?.wiki && hit.wikiLang === aiLastLang.wiki) score += 2;
    // Penalize very short / empty extracts
    const len = (hit.extract || hit.text || "").length;
    if (len > 120) score += 2;
    if (len > 300) score += 1;
    // Soft penalty for obvious off-topic entertainment/studio pages when asking science
    if (/\b(studio|television|film|song|album|video game|disambiguation)\b/i.test(hit.title || "") && /\b(why|how|science|sky|gravity|atom|cell|war|cause)\b/i.test(question)) {
      score -= 5;
    }
    // Boost pages whose title clearly matches the academic topic
    if (/\bcauses of\b/i.test(hit.title || "") && /\bcause|why|led\b/i.test(question)) score += 5;
    if (/\b(rayleigh|diffuse sky)\b/i.test(hit.title || "") && /sky|blue/i.test(question)) score += 6;
    if (/\bworld war i\b/i.test(hit.title || "") && /world war (i|1|one)\b/i.test(question) && !/world war ii/i.test(hit.title || "")) score += 4;
    return score;
  }

  function rankHits(hits, question, topic) {
    return [...hits]
      .map((h) => ({ ...h, score: scoreHit(h, question, topic) }))
      .sort((a, b) => b.score - a.score);
  }

  function wikiLangCode(lang) {
    if (!lang) return "en";
    if (typeof lang === "string") return lang || "en";
    return lang.wiki || lang.code || "en";
  }

  async function wikiMultiSearch(query, lang = "en") {
    const code = wikiLangCode(lang);
    try {
      const url =
        `https://${code}.wikipedia.org/w/api.php?action=query&generator=search&gsrlimit=8&prop=extracts|info&exintro=1&explaintext=1&exchars=1200&inprop=url&format=json&origin=*&gsrsearch=` +
        encodeURIComponent(query);
      const res = await fetch(url);
      if (!res.ok) return [];
      const data = await res.json();
      const pages = Object.values(data.query?.pages || {}).sort(
        (a, b) => (a.index || 0) - (b.index || 0)
      );
      return pages
        .filter((p) => p.title && p.extract)
        .map((p) => ({
          title: p.title,
          extract: p.extract,
          url: p.fullurl || `https://${code}.wikipedia.org/wiki/${encodeURIComponent(p.title)}`,
          source: "Wikipedia",
          wikiLang: code,
          query,
        }));
    } catch {
      return [];
    }
  }

  /** Exact / near-exact title lookup — strong first hit for solid answers */
  async function wikiExactLookup(title, lang = "en") {
    const code = wikiLangCode(lang);
    const cleaned = String(title || "").trim();
    if (!cleaned) return null;
    const deep = await wikiDeepSummary(cleaned, code);
    if (deep?.extract && deep.extract.length > 40) return deep;
    // Try capitalized / title-case variants
    const variants = [
      cleaned.replace(/\b\w/g, (c) => c.toUpperCase()),
      cleaned.charAt(0).toUpperCase() + cleaned.slice(1),
    ];
    for (const v of variants) {
      if (v === cleaned) continue;
      const hit = await wikiDeepSummary(v, code);
      if (hit?.extract && hit.extract.length > 40) return hit;
    }
    return null;
  }

  /** Broader full-text Wikipedia search when title search is weak */
  async function wikiFullTextSearch(query, lang = "en") {
    const code = wikiLangCode(lang);
    try {
      const searchUrl =
        `https://${code}.wikipedia.org/w/api.php?action=query&list=search&srlimit=5&srprop=snippet&format=json&origin=*&srsearch=` +
        encodeURIComponent(query);
      const res = await fetch(searchUrl);
      if (!res.ok) return [];
      const data = await res.json();
      const titles = (data.query?.search || []).map((s) => s.title).filter(Boolean);
      if (!titles.length) return [];
      const pages = await Promise.all(titles.slice(0, 4).map((t) => wikiDeepSummary(t, code)));
      return pages.filter(Boolean).map((p) => ({ ...p, query }));
    } catch {
      return [];
    }
  }

  async function wikiDeepSummary(title, lang = "en") {
    const code = wikiLangCode(lang);
    try {
      const res = await fetch(
        `https://${code}.wikipedia.org/api/rest_v1/page/summary/` + encodeURIComponent(title.replace(/ /g, "_"))
      );
      if (!res.ok) return null;
      const sum = await res.json();
      return {
        title: sum.title || title,
        extract: sum.extract || "",
        url: sum.content_urls?.desktop?.page || `https://${code}.wikipedia.org/wiki/${encodeURIComponent(title)}`,
        source: "Wikipedia",
        wikiLang: code,
        description: sum.description || "",
      };
    } catch {
      return null;
    }
  }

  async function wikiSearch(query, lang = "en") {
    const pages = await wikiMultiSearch(query, lang);
    if (!pages.length) return null;
    return {
      query,
      title: pages[0].title,
      extract: pages[0].extract,
      url: pages[0].url,
      wikiLang: pages[0].wikiLang || wikiLangCode(lang),
      related: pages.slice(1).map((p) => ({
        title: p.title,
        url: p.url,
        text: p.extract,
        wikiLang: p.wikiLang,
      })),
      pages,
    };
  }

  async function ddgSearch(query) {
    try {
      const res = await fetch(
        "https://api.duckduckgo.com/?format=json&no_html=1&skip_disambig=1&q=" +
          encodeURIComponent(query)
      );
      if (!res.ok) return null;
      const data = await res.json();
      const related = (data.RelatedTopics || [])
        .flatMap((t) => (t.Topics ? t.Topics : [t]))
        .filter((t) => t.Text && t.FirstURL)
        .slice(0, 5)
        .map((t) => ({
          title: t.Text.split(" - ")[0],
          text: t.Text,
          url: t.FirstURL,
          source: "Web",
        }));
      return {
        query,
        abstract: data.AbstractText || "",
        abstractSource: data.AbstractSource || "",
        abstractUrl: data.AbstractURL || "",
        heading: data.Heading || "",
        related,
        answer: data.Answer || data.Definition || "",
        definition: data.Definition || "",
        definitionUrl: data.DefinitionURL || "",
      };
    } catch {
      return null;
    }
  }

  /** Flatten all internet hits into one ranked list of sources */
  function collectWebHits(research) {
    const hits = [];
    const seen = new Set();
    const push = (hit) => {
      if (!hit?.url || seen.has(hit.url)) return;
      if (!hit.extract && !hit.text && !hit.abstract) return;
      seen.add(hit.url);
      hits.push(hit);
    };

    for (const item of research) {
      if (item.wiki?.pages) {
        item.wiki.pages.forEach((p) =>
          push({
            title: p.title,
            extract: p.extract,
            url: p.url,
            source: "Wikipedia",
            wikiLang: p.wikiLang || item.wiki.wikiLang,
            topic: item.topic,
          })
        );
      } else if (item.wiki?.extract) {
        push({
          title: item.wiki.title,
          extract: item.wiki.extract,
          url: item.wiki.url,
          source: "Wikipedia",
          wikiLang: item.wiki.wikiLang,
          topic: item.topic,
        });
      }
      if (item.ddg?.abstract) {
        push({
          title: item.ddg.heading || item.ddg.abstractSource || item.topic,
          extract: item.ddg.abstract,
          url: item.ddg.abstractUrl,
          source: item.ddg.abstractSource || "Web",
          topic: item.topic,
        });
      }
      if (item.ddg?.answer) {
        push({
          title: `Answer: ${item.topic}`,
          extract: item.ddg.answer,
          url: item.ddg.abstractUrl || item.ddg.definitionUrl || `https://duckduckgo.com/?q=${encodeURIComponent(item.topic)}`,
          source: "Web",
          topic: item.topic,
        });
      }
      (item.ddg?.related || []).forEach((r) =>
        push({
          title: r.title,
          extract: r.text,
          url: r.url,
          source: "Web",
          topic: item.topic,
        })
      );
      (item.wiki?.related || []).forEach((r) =>
        push({
          title: r.title,
          extract: r.text || "",
          url: r.url,
          source: "Wikipedia",
          wikiLang: r.wikiLang || item.wiki.wikiLang,
          topic: item.topic,
        })
      );
    }
    return hits;
  }

  function mergeWikiBags(primary, secondary) {
    if (!primary) return secondary || null;
    if (!secondary?.pages?.length) return primary;
    const urls = new Set((primary.pages || []).map((p) => p.url));
    const extra = secondary.pages.filter((p) => p.url && !urls.has(p.url));
    return {
      ...primary,
      pages: [...(primary.pages || []), ...extra],
      related: [...(primary.related || []), ...(secondary.related || [])].slice(0, 10),
    };
  }

  async function researchSubtopics(subtopics, lang = "en") {
    const code = wikiLangCode(lang);
    const jobs = subtopics.map(async (topic) => {
      const [wikiPrimary, wikiEn, ddg] = await Promise.all([
        wikiSearch(topic, code),
        code !== "en" ? wikiSearch(topic, "en") : Promise.resolve(null),
        ddgSearch(topic),
      ]);
      return { topic, wiki: mergeWikiBags(wikiPrimary, wikiEn), ddg };
    });
    return Promise.all(jobs);
  }

  async function wikidataSearch(query, lang = "en") {
    const code = wikiLangCode(lang);
    try {
      const url =
        "https://www.wikidata.org/w/api.php?action=wbsearchentities&language=" +
        encodeURIComponent(code) +
        "&uselang=" +
        encodeURIComponent(code) +
        "&type=item&limit=4&format=json&origin=*&search=" +
        encodeURIComponent(query);
      const res = await fetch(url);
      if (!res.ok) return [];
      const data = await res.json();
      return (data.search || [])
        .filter((s) => s.label && (s.description || s.concepturi))
        .map((s) => ({
          title: s.label,
          extract: s.description || s.label,
          url: s.concepturi || `https://www.wikidata.org/wiki/${s.id}`,
          source: "Wikidata",
          wikiLang: code,
          query,
        }));
    } catch {
      return [];
    }
  }

  async function wikiRelatedTitles(title, limit = 6, lang = "en") {
    const code = wikiLangCode(lang);
    try {
      const url =
        `https://${code}.wikipedia.org/w/api.php?action=query&prop=links&plnamespace=0&pllimit=` +
        limit +
        "&format=json&origin=*&titles=" +
        encodeURIComponent(title);
      const res = await fetch(url);
      if (!res.ok) return [];
      const data = await res.json();
      const page = Object.values(data.query?.pages || {})[0];
      return (page?.links || [])
        .map((l) => l.title)
        .filter((t) => t && !/\(identifier\)$/i.test(t) && !/^List of /i.test(t))
        .slice(0, limit);
    } catch {
      return [];
    }
  }

  /**
   * PulseSearch — lightweight adaptive research algorithm.
   *
   * Design goals:
   * - Low system cost: few parallel requests, small payloads, early exit when confident
   * - Online databases: Wikipedia, DuckDuckGo Instant Answer, Wikidata
   * - Adaptive depth: if confidence is low, take longer and gather more data
   *
   * Phases:
   *  1) FAST   — 1–2 queries, wiki + web abstracts
   *  2) DEEP   — more queries + deepen best pages + Wikidata (only if needed)
   *  3) PRECISE — related-page follow-ups for precision (only if still weak)
   */
  async function pulseSearch(question, priorContent, onProgress) {
    const understood = understandQuestion(question, priorContent || "");
    const lang = understood.lang || detectLanguage(question);
    const wikiCode = wikiLangCode(lang);
    const allQueries = understood.queries;
    const report = (msg) => {
      if (typeof onProgress === "function") onProgress(msg);
    };

    // Accumulate flat hits, dedupe by URL, re-rank (keeps memory/CPU light)
    const seenUrls = new Set();
    let hits = [];
    const researchBags = [];
    const usedQueries = [];

    const absorb = (bagList, flatExtra = []) => {
      for (const bag of bagList) researchBags.push(bag);
      const fresh = [...collectWebHits(bagList), ...flatExtra];
      for (const h of fresh) {
        if (!h?.url || seenUrls.has(h.url)) continue;
        if (!h.extract && !h.text) continue;
        seenUrls.add(h.url);
        hits.push(h);
      }
      hits = rankHits(hits, question, understood.topic);
    };

    const confidenceOf = (list) => {
      if (!list.length) return 0;
      const top = list[0];
      const score = top.score || 0;
      const len = (top.extract || top.text || "").length;
      let c = Math.min(1, score / 12);
      if (len >= 180) c += 0.12;
      if (len >= 350) c += 0.12;
      if (len >= 600) c += 0.08;
      if (list.filter((h) => (h.score || 0) >= 4).length >= 2) c += 0.1;
      if (top.source === "Wikipedia") c += 0.06;
      if (top.wikiLang && top.wikiLang === wikiCode) c += 0.08;
      // Title strongly matches topic → high confidence
      const topicLow = understood.topic.toLowerCase();
      const titleLow = (top.title || "").toLowerCase();
      if (titleLow && (titleLow.includes(topicLow.slice(0, 24)) || topicLow.includes(titleLow.slice(0, 24)))) {
        c += 0.12;
      }
      // Intent-sensitive boosts (multilingual cues)
      if (
        understood.intent === "who" &&
        /\b(invent|scientist|physicist|author|born|died|inventor|científico|wissenschaftler|учёный|科学者)\b/i.test(
          top.extract || ""
        )
      ) {
        c += 0.08;
      }
      if (
        (understood.intent === "why" || understood.intent === "causes") &&
        /\b(because|cause|due to|scattering|result|porque|parce que|weil|потому|때문에|ため)\b/i.test(
          top.extract || ""
        )
      ) {
        c += 0.1;
      }
      return Math.max(0, Math.min(1, c));
    };

    const hitWikiLang = (h) =>
      h?.wikiLang || (String(h?.url || "").match(/https?:\/\/([a-z]{2,3})\.wikipedia\.org/i)?.[1]) || wikiCode;

    // ----- Phase 0: exact topic resolve (often the best solid answer) -----
    report(`PulseSearch · resolving “${understood.topic.slice(0, 40)}”…`);
    const exactJobs = [wikiExactLookup(understood.topic, wikiCode)];
    if (wikiCode !== "en") exactJobs.push(wikiExactLookup(understood.topic, "en"));
    if (understood.keywords?.length) {
      exactJobs.push(wikiExactLookup(understood.keywords.slice(0, 3).join(" "), wikiCode));
    }
    const exactHits = (await Promise.all(exactJobs)).filter(Boolean);
    absorb(
      [],
      exactHits.map((p) => ({ ...p, query: understood.topic }))
    );

    // ----- Phase 1: FAST pulse -----
    report(`PulseSearch · ${lang.name || wikiCode} scan…`);
    const fastQueries = allQueries.slice(0, 3);
    usedQueries.push(...fastQueries);
    const fastBags = await researchSubtopics(fastQueries, wikiCode);
    absorb(fastBags);

    const wdFast = await wikidataSearch(understood.topic, wikiCode);
    absorb([], wdFast);

    let confidence = confidenceOf(hits);
    let phase = 1;

    // Always deepen the best Wikipedia page so answers aren't thin blurbs
    if (hits[0]?.source === "Wikipedia" && (hits[0].extract || "").length < 500) {
      const deep = await wikiDeepSummary(hits[0].title, hitWikiLang(hits[0]));
      if (deep) absorb([], [{ ...deep, query: understood.topic }]);
      confidence = confidenceOf(hits);
    }

    // ----- Phase 2: DEEP pulse (if not yet solid) -----
    if (confidence < 0.72) {
      phase = 2;
      report("Need more data — digging deeper…");
      const deepQueries = allQueries.slice(3, 8).filter((q) => !usedQueries.includes(q));
      const alt = [
        `what is ${understood.topic}`,
        understood.intent === "why" || understood.intent === "causes" ? `why ${understood.topic}` : null,
        understood.intent === "who" ? `${understood.topic} inventor` : null,
        understood.intent === "how" ? `how ${understood.topic} works` : null,
        (understood.keywords || []).slice(0, 4).join(" "),
      ].filter(Boolean);
      for (const q of alt) {
        if (!usedQueries.includes(q)) deepQueries.push(q);
      }
      const next = [...new Set(deepQueries)].slice(0, 4);
      usedQueries.push(...next);
      if (next.length) {
        const deepBags = await researchSubtopics(next, wikiCode);
        absorb(deepBags);
      }

      // Full-text Wikipedia pass for messy homework wording
      const ftQueries = [understood.topic, (understood.keywords || []).slice(0, 4).join(" ")].filter(Boolean);
      const ftHits = (
        await Promise.all(ftQueries.map((q) => wikiFullTextSearch(q, wikiCode)))
      ).flat();
      absorb(
        [],
        ftHits.map((p) => ({ ...p, query: understood.topic }))
      );

      const topWiki = hits.filter((h) => h.source === "Wikipedia").slice(0, 3);
      const deepPages = await Promise.all(
        topWiki.map((h) => wikiDeepSummary(h.title, hitWikiLang(h)))
      );
      absorb(
        [],
        deepPages.filter(Boolean).map((p) => ({ ...p, query: understood.topic }))
      );
      confidence = confidenceOf(hits);
    }

    // ----- Phase 3: PRECISE pulse (still weak OR no strong wiki) -----
    const topWeak = !hits.length || (hits[0].score || 0) < 6 || confidence < 0.55;
    if (topWeak) {
      phase = 3;
      report("Gathering extra sources for a more precise answer…");
      const seed = hits.find((h) => h.source === "Wikipedia") || hits[0];
      if (seed?.title) {
        const seedLang = hitWikiLang(seed);
        const related = await wikiRelatedTitles(seed.title, 8, seedLang);
        const rankedRelated = related
          .map((title) => ({
            title,
            score: scoreHit(
              { title, extract: title, source: "Wikipedia", wikiLang: seedLang },
              question,
              understood.topic
            ),
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);

        const relatedPages = await Promise.all(
          rankedRelated.map(async (r) => {
            const pages = await wikiMultiSearch(r.title, seedLang);
            return pages[0] || (await wikiDeepSummary(r.title, seedLang));
          })
        );
        absorb(
          [],
          relatedPages.filter(Boolean).map((p) => ({
            title: p.title,
            extract: p.extract,
            url: p.url,
            source: p.source || "Wikipedia",
            wikiLang: p.wikiLang || seedLang,
            query: understood.topic,
          }))
        );
      }

      // Keyword last resort — search each strong keyword
      const kw = (understood.keywords || []).slice(0, 3);
      if (kw.length) {
        const kwBags = await researchSubtopics(kw, wikiCode);
        absorb(kwBags);
        usedQueries.push(...kw.filter((k) => !usedQueries.includes(k)));
      }

      // English full-text rescue when non-English scan is thin
      if (wikiCode !== "en" && confidenceOf(hits) < 0.55) {
        const enFt = await wikiFullTextSearch(understood.topic, "en");
        absorb(
          [],
          enFt.map((p) => ({ ...p, query: understood.topic }))
        );
      }

      const wdDeep = await wikidataSearch(allQueries[0] || understood.topic, wikiCode);
      absorb([], wdDeep);
      confidence = confidenceOf(hits);
    }

    report(
      confidence >= 0.65
        ? "Sources look solid — writing your answer…"
        : "Writing the strongest answer from everything I found…"
    );

    return {
      queries: usedQueries,
      research: researchBags,
      hits,
      understood,
      confidence,
      phase,
      algorithm: "PulseSearch",
      lang,
    };
  }

  // Back-compat wrapper
  async function searchInternet(question, priorContent, onProgress) {
    return pulseSearch(question, priorContent, onProgress);
  }

  function trySolveMath(q) {
    const text = q.replace(/,/g, "").replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");

    // Quadratic: ax^2 + bx + c = 0 (flexible)
    const quad = text.match(
      /(-?\d*(?:\.\d+)?)\s*x\s*\^\s*2\s*([+-])\s*(-?\d+(?:\.\d+)?)\s*x\s*([+-])\s*(-?\d+(?:\.\d+)?)\s*=\s*(-?\d+(?:\.\d+)?)/i
    ) || text.match(
      /(-?\d*(?:\.\d+)?)x\^2\s*([+-])\s*(-?\d+(?:\.\d+)?)x\s*([+-])\s*(-?\d+(?:\.\d+)?)\s*=\s*(-?\d+(?:\.\d+)?)/i
    );
    if (quad) {
      let a = quad[1] === "" || quad[1] === "-" ? Number(`${quad[1]}1`) : Number(quad[1]);
      if (!Number.isFinite(a) || a === 0) a = quad[1] === "-" ? -1 : 1;
      const b = (quad[2] === "-" ? -1 : 1) * Number(quad[3]);
      let c = (quad[4] === "-" ? -1 : 1) * Number(quad[5]);
      const rhs = Number(quad[6]);
      c -= rhs;
      const disc = b * b - 4 * a * c;
      let body =
        `Okay, let's do this together.\n\n` +
        `We've got \`${niceNum(a)}x² ${b >= 0 ? "+" : "−"} ${niceNum(Math.abs(b))}x ${c >= 0 ? "+" : "−"} ${niceNum(Math.abs(c))} = 0\`.\n\n` +
        `So a=${niceNum(a)}, b=${niceNum(b)}, c=${niceNum(c)}.\n` +
        `Discriminant Δ = b² − 4ac = ${niceNum(disc)}.\n`;
      if (disc < 0) {
        body += `Δ is negative, so no real solutions (only complex ones).\n`;
      } else {
        const r1 = (-b + Math.sqrt(disc)) / (2 * a);
        const r2 = (-b - Math.sqrt(disc)) / (2 * a);
        body +=
          `Using x = (−b ± √Δ) / (2a), you get **x = ${niceNum(r1)}**` +
          (Math.abs(r1 - r2) > 1e-9 ? ` and **x = ${niceNum(r2)}**` : " (it's a double root)") +
          `.\n\nWant me to check one of those by plugging it back in?`;
      }
      return body;
    }

    // Linear: ax + b = c  or  ax - b = c
    const linear = text.match(/(-?\d+(?:\.\d+)?)\s*x\s*([+-])\s*(-?\d+(?:\.\d+)?)\s*=\s*(-?\d+(?:\.\d+)?)/i);
    if (linear) {
      const a = Number(linear[1]);
      const b = (linear[2] === "-" ? -1 : 1) * Number(linear[3]);
      const c = Number(linear[4]);
      if (a !== 0) {
        const x = (c - b) / a;
        return (
          `Alright, for \`${niceNum(a)}x ${b >= 0 ? "+" : "−"} ${niceNum(Math.abs(b))} = ${niceNum(c)}\`:\n\n` +
          `First move the ${niceNum(b)} → \`${niceNum(a)}x = ${niceNum(c - b)}\`\n` +
          `Then divide by ${niceNum(a)} → **x = ${niceNum(x)}**\n\n` +
          `Quick check: ${niceNum(a)}(${niceNum(x)}) ${b >= 0 ? "+" : "−"} ${niceNum(Math.abs(b))} = ${niceNum(c)}. Nice.`
        );
      }
    }

    // Proportion: a/b = c/x or a/b = x/c
    const prop = text.match(/(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)\s*=\s*(-?\d+(?:\.\d+)?)\s*\/\s*x/i);
    if (prop) {
      const a = Number(prop[1]);
      const b = Number(prop[2]);
      const c = Number(prop[3]);
      const x = (b * c) / a;
      return (
        `Proportion time: \`${niceNum(a)}/${niceNum(b)} = ${niceNum(c)}/x\`\n\n` +
        `Cross-multiply → ${niceNum(a)}x = ${niceNum(b * c)}\n` +
        `So **x = ${niceNum(x)}**.`
      );
    }

    // Percentage: what is p% of n
    const pct = text.match(/(?:what(?:'| i)?s|calculate)?\s*(-?\d+(?:\.\d+)?)\s*%\s*(?:of)\s*(-?\d+(?:\.\d+)?)/i);
    if (pct) {
      const p = Number(pct[1]);
      const n = Number(pct[2]);
      const val = (p / 100) * n;
      return `Easy one — ${niceNum(p)}% of ${niceNum(n)} is (${niceNum(p)}/100) × ${niceNum(n)} = **${niceNum(val)}**.`;
    }

    // Fraction of: a/b of n
    const fracOf = text.match(/(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)\s*(?:of)\s*(-?\d+(?:\.\d+)?)/i);
    if (fracOf) {
      const a = Number(fracOf[1]);
      const b = Number(fracOf[2]);
      const n = Number(fracOf[3]);
      const val = (a / b) * n;
      return `${niceNum(a)}/${niceNum(b)} of ${niceNum(n)} comes out to **${niceNum(val)}**.`;
    }

    // Bare expression
    const exprMatch = text.match(
      /(?:what(?:'| i)?s|calculate|compute|evaluate|solve)?\s*([0-9+\-*/().%\s^]+)\??$/i
    );
    if (exprMatch) {
      let expr = exprMatch[1].replace(/\^/g, "**").replace(/[^0-9+\-*/().%\s*]/g, "");
      expr = expr.replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");
      if (/^[0-9+\-*/().\s*]+$/.test(expr) && /\d/.test(expr)) {
        try {
          // eslint-disable-next-line no-new-func
          const val = Function(`"use strict"; return (${expr});`)();
          if (typeof val === "number" && Number.isFinite(val)) {
            return `That works out to **${niceNum(val)}** (from \`${exprMatch[1].trim()}\`).`;
          }
        } catch (_) {}
      }
    }
    return null;
  }

  const FOLLOWUP_I18N = {
    en: {
      math: ["Wait, can you slow down on that one step?", "Give me a similar problem to try", "Why do we do it that way?"],
      base: (topic) => ["Okay but explain it like I'm tired", `Can you give a real-life example of ${topic}?`, "Quiz me so I know if I get it"],
      compare: "Can you make a tiny cheat-sheet table?",
      history: "What happened after that?",
      stress: "Just encourage me for a sec",
    },
    es: {
      math: ["¿Puedes ir más despacio en ese paso?", "Dame un problema parecido", "¿Por qué se hace así?"],
      base: (topic) => ["Explícamelo más simple", `¿Un ejemplo de la vida real de ${topic}?`, "Hazme un mini quiz"],
      compare: "¿Me haces una tablita resumen?",
      history: "¿Qué pasó después?",
      stress: "Anímame un momento",
    },
    fr: {
      math: ["Tu peux ralentir sur cette étape ?", "Donne-moi un exercice similaire", "Pourquoi on fait comme ça ?"],
      base: (topic) => ["Explique plus simplement", `Un exemple concret de ${topic} ?`, "Interroge-moi"],
      compare: "Tu peux faire un mini tableau ?",
      history: "Et après, que s'est-il passé ?",
      stress: "Encourage-moi une seconde",
    },
    de: {
      math: ["Kannst du diesen Schritt langsamer erklären?", "Gib mir eine ähnliche Aufgabe", "Warum machen wir das so?"],
      base: (topic) => ["Erklär's einfacher", `Ein Alltagsbeispiel zu ${topic}?`, "Quiz mich"],
      compare: "Machst du eine kleine Übersichtstabelle?",
      history: "Was passierte danach?",
      stress: "Mutmach mich kurz",
    },
    pt: {
      math: ["Pode ir mais devagar nesse passo?", "Me dá um problema parecido", "Por que fazemos assim?"],
      base: (topic) => ["Explica mais simples", `Um exemplo da vida real de ${topic}?`, "Me faça um quiz"],
      compare: "Faz uma tabelinha resumo?",
      history: "O que aconteceu depois?",
      stress: "Me anima um segundo",
    },
    ru: {
      math: ["Можешь помедленнее на этом шаге?", "Дай похожую задачу", "Почему так делают?"],
      base: (topic) => ["Объясни проще", `Пример из жизни про ${topic}?`, "Проверь меня"],
      compare: "Сделаешь маленькую таблицу?",
      history: "А что было дальше?",
      stress: "Подбодри меня",
    },
    ja: {
      math: ["そのステップをもっとゆっくり", "似た問題を出して", "なぜそのやり方なの？"],
      base: (topic) => ["もっと簡単に説明して", `${topic}の具体例は？`, "クイズして"],
      compare: "小さな表にまとめて",
      history: "そのあとどうなった？",
      stress: "ちょっと励まして",
    },
    ko: {
      math: ["그 단계 천천히 해줘", "비슷한 문제 줘", "왜 그렇게 해?"],
      base: (topic) => ["더 쉽게 설명해줘", `${topic} 실생활 예시는?`, "퀴즈 내줘"],
      compare: "작은 표로 정리해줘",
      history: "그다음엔 뭐가 됐어?",
      stress: "잠깐 응원해줘",
    },
    zh: {
      math: ["这一步慢一点讲？", "再给我一道类似的", "为什么要这样？"],
      base: (topic) => ["讲简单点", `${topic} 的生活例子？`, "考考我"],
      compare: "做个小对照表？",
      history: "后来发生了什么？",
      stress: "给我打打气",
    },
  };

  function extractFollowups(answer, question, research) {
    const follows = [];
    const lines = String(answer).split("\n");
    for (const line of lines) {
      const m = line.match(/^(?:[-*•]|\d+\.)\s+(?:Follow[- ]?up:\s*)?(.+\?)\s*$/i);
      if (m) follows.push(m[1].replace(/^["']|["']$/g, "").trim());
    }
    const qLow = question.toLowerCase();
    const pack = FOLLOWUP_I18N[aiLastLang?.code] || FOLLOWUP_I18N.en;
    const topicLabel = research?.[0]?.wiki?.title || (aiLastLang?.code === "en" ? "this" : "…");
    if (!follows.length) {
      if (/math|solve|equation|x\s*=|résous|resuelve|löse|реши|解け|풀어|解/i.test(question) || trySolveMath(question)) {
        follows.push(...pack.math);
      } else {
        follows.push(...pack.base(topicLabel));
      }
      if (INTENT_PATTERNS.compare.test(qLow)) follows.push(pack.compare);
      if (/war|history|cause|guerra|histoire|geschichte|война|戦争|전쟁|战争/i.test(qLow)) follows.push(pack.history);
      if (/stress|tired|hard|confused|lost|estres|fatig|müde|устал|疲|힘들|累/i.test(qLow)) follows.push(pack.stress);
    }
    return [...new Set(follows)].slice(0, 4);
  }

  function humanizeFact(text) {
    if (!text) return "";
    const t = text.trim();
    if (/^[A-Z]/.test(t) && t.length > 80) {
      return t;
    }
    return t;
  }

  function firstSentences(text, max = 2) {
    if (!text) return "";
    const parts = text
      .replace(/\s+/g, " ")
      .match(/[^.!?]+[.!?]+|[^.!?]+$/g);
    if (!parts) return text.trim();
    return parts.slice(0, max).join(" ").trim();
  }

  const ANSWER_I18N = {
    en: {
      short: "Answer",
      more: "Why / more detail",
      sourceTopic: "From",
      how: "How",
      causes: "Causes",
      diff: "Difference",
      answer: "Answer",
      lead: (n) => `Okay${n} — answering your question:\n\n`,
      noMatch: (topic, n) =>
        `I couldn't find sources that clearly answer that${n}. Try asking again with the main words from your question (topic: **${topic}**).\n`,
      related: "Related to your question",
      also: "Still on your question",
      planTitle: "Quick study plan",
      plan: "20 min read + write 5 facts from memory, 15 min explain out loud, 15 min practice, 10 min review mistakes.",
      sources: "Sources for this answer",
      fuzzy: `\nWant it simpler, or an example tied to this same question?\n`,
    },
    es: {
      short: "Respuesta",
      more: "Por qué / más detalle",
      sourceTopic: "De",
      how: "Cómo",
      causes: "Causas",
      diff: "Diferencia",
      answer: "Respuesta",
      lead: (n) => `Vale${n} — respondiendo a tu pregunta:\n\n`,
      noMatch: (topic, n) =>
        `No encontré fuentes que respondan claro a eso${n}. Prueba con las palabras clave de tu pregunta (tema: **${topic}**).\n`,
      related: "Relacionado con tu pregunta",
      also: "Siguiendo tu pregunta",
      planTitle: "Plan de estudio rápido",
      plan: "20 min leer + escribir 5 datos de memoria, 15 min explicar en voz alta, 15 min practicar, 10 min revisar errores.",
      sources: "Fuentes de esta respuesta",
      fuzzy: `\n¿Lo quieres más simple, o un ejemplo de esta misma pregunta?\n`,
    },
    fr: {
      short: "Réponse",
      more: "Pourquoi / détails",
      sourceTopic: "Source",
      how: "Comment",
      causes: "Causes",
      diff: "Différence",
      answer: "Réponse",
      lead: (n) => `Ok${n} — réponse à ta question :\n\n`,
      noMatch: (topic, n) =>
        `Je n'ai pas trouvé de sources qui répondent clairement${n}. Reformule avec les mots clés (sujet : **${topic}**).\n`,
      related: "Lié à ta question",
      also: "Toujours sur ta question",
      planTitle: "Plan d'étude rapide",
      plan: "20 min lire + 5 faits de mémoire, 15 min expliquer à voix haute, 15 min pratiquer, 10 min revoir les erreurs.",
      sources: "Sources pour cette réponse",
      fuzzy: `\nTu veux plus simple, ou un exemple sur cette même question ?\n`,
    },
    de: {
      short: "Antwort",
      more: "Warum / mehr Detail",
      sourceTopic: "Aus",
      how: "Wie",
      causes: "Ursachen",
      diff: "Unterschied",
      answer: "Antwort",
      lead: (n) => `Okay${n} — Antwort auf deine Frage:\n\n`,
      noMatch: (topic, n) =>
        `Keine klar passenden Quellen für genau diese Frage${n}. Frag nochmal mit den Kernwörtern (Thema: **${topic}**).\n`,
      related: "Zur Frage passend",
      also: "Noch zur Frage",
      planTitle: "Schneller Lernplan",
      plan: "20 Min lesen + 5 Fakten aus dem Gedächtnis, 15 Min laut erklären, 15 Min üben, 10 Min Fehler checken.",
      sources: "Quellen für diese Antwort",
      fuzzy: `\nEinfacher erklären, oder ein Beispiel zu genau dieser Frage?\n`,
    },
    pt: {
      short: "Resposta",
      more: "Por quê / mais detalhe",
      sourceTopic: "De",
      how: "Como",
      causes: "Causas",
      diff: "Diferença",
      answer: "Resposta",
      lead: (n) => `Beleza${n} — respondendo à sua pergunta:\n\n`,
      noMatch: (topic, n) =>
        `Não achei fontes que respondam isso com clareza${n}. Tente de novo com as palavras-chave (tema: **${topic}**).\n`,
      related: "Relacionado à sua pergunta",
      also: "Ainda na sua pergunta",
      planTitle: "Plano de estudo rápido",
      plan: "20 min ler + 5 fatos de memória, 15 min explicar em voz alta, 15 min praticar, 10 min revisar erros.",
      sources: "Fontes desta resposta",
      fuzzy: `\nQuer mais simples, ou um exemplo desta mesma pergunta?\n`,
    },
    ru: {
      short: "Ответ",
      more: "Почему / подробнее",
      sourceTopic: "Из",
      how: "Как",
      causes: "Причины",
      diff: "Разница",
      answer: "Ответ",
      lead: (n) => `Окей${n} — отвечаю на твой вопрос:\n\n`,
      noMatch: (topic, n) =>
        `Не нашёл источников, которые ясно отвечают именно на это${n}. Переформулируй ключевыми словами (тема: **${topic}**).\n`,
      related: "По твоему вопросу",
      also: "Всё ещё по вопросу",
      planTitle: "Быстрый план учёбы",
      plan: "20 мин читать + 5 фактов по памяти, 15 мин объяснить вслух, 15 мин практика, 10 мин ошибки.",
      sources: "Источники для этого ответа",
      fuzzy: `\nПроще объяснить или пример по этому же вопросу?\n`,
    },
    ja: {
      short: "答え",
      more: "理由 / もう少し",
      sourceTopic: "出典",
      how: "仕組み",
      causes: "原因",
      diff: "違い",
      answer: "答え",
      lead: (n) => `オーケー${n} — 質問への答え：\n\n`,
      noMatch: (topic, n) =>
        `その質問にまっすぐ答える情報が見つからなかった${n}。キーワードで聞き直して（話題: **${topic}**）。\n`,
      related: "質問に関係ある情報",
      also: "同じ質問について",
      planTitle: "すぐ使える勉強プラン",
      plan: "20分読む＋記憶から5事実、15分口頭説明、15分練習、10分見直し。",
      sources: "この答えの出典",
      fuzzy: `\nもっと簡単に？それとも同じ質問の例？\n`,
    },
    ko: {
      short: "답",
      more: "이유 / 더 자세히",
      sourceTopic: "출처",
      how: "어떻게",
      causes: "원인",
      diff: "차이",
      answer: "답",
      lead: (n) => `오케이${n} — 질문에 답하면:\n\n`,
      noMatch: (topic, n) =>
        `그 질문에 바로 답할 자료를 못 찾았어${n}. 핵심 단어로 다시 물어봐 (주제: **${topic}**).\n`,
      related: "질문과 관련된 내용",
      also: "같은 질문 이어서",
      planTitle: "빠른 공부 계획",
      plan: "20분 읽기 + 기억으로 사실 5개, 15분 말해보기, 15분 연습, 10분 오답 정리.",
      sources: "이 답의 출처",
      fuzzy: `\n더 쉽게? 아니면 같은 질문의 예시?\n`,
    },
    zh: {
      short: "回答",
      more: "原因 / 更多",
      sourceTopic: "来自",
      how: "怎么",
      causes: "原因",
      diff: "区别",
      answer: "回答",
      lead: (n) => `好${n}——直接回答你的问题：\n\n`,
      noMatch: (topic, n) =>
        `没找到能直接回答这个问题的资料${n}。用问题里的关键词再问一次（主题：**${topic}**）。\n`,
      related: "和你的问题有关",
      also: "仍围绕你的问题",
      planTitle: "快速学习计划",
      plan: "20 分钟阅读 + 默写 5 个要点，15 分钟口述，15 分钟练习，10 分钟复盘错题。",
      sources: "这个回答的来源",
      fuzzy: `\n要更简单，还是要同一个问题的例子？\n`,
    },
  };

  function answerPack(langCode) {
    return ANSWER_I18N[langCode] || ANSWER_I18N.en;
  }

  function splitSentences(text) {
    return String(text || "")
      .replace(/\s+/g, " ")
      .match(/[^.!?]+[.!?]+|[^.!?]+$/g)
      ?.map((s) => s.trim())
      .filter((s) => s.length > 25) || [];
  }

  /** Penalize common near-miss topics (WWII for WWI, etc.) */
  function offTopicPenalty(text, question) {
    const q = String(question || "").toLowerCase();
    const t = String(text || "").toLowerCase();
    let pen = 0;
    if (/world war (i|1|one)\b/.test(q) && /world war (ii|2|two)\b/.test(t) && !/world war (i|1|one)\b/.test(t)) pen += 0.7;
    if (/world war (ii|2|two)\b/.test(q) && /world war (i|1|one)\b/.test(t) && !/world war (ii|2|two)\b/.test(t)) pen += 0.7;
    if (/\bmoon\b/.test(q) && /\bmars\b/.test(t) && !/\bmoon\b/.test(t)) pen += 0.4;
    if (/\bmitosis\b/.test(q) && /\bmeiosis\b/.test(t) && !/\bmitosis\b/.test(t) && !/\bvs|difference|compare\b/.test(q)) pen += 0.35;
    if (/\bmeiosis\b/.test(q) && /\bmitosis\b/.test(t) && !/\bmeiosis\b/.test(t) && !/\bvs|difference|compare\b/.test(q)) pen += 0.35;
    return pen;
  }

  /** How much a text chunk actually matches the asked question (0–1) */
  function relevanceToQuestion(text, question, topic = "") {
    const qWords = extractKeywords(`${question} ${topic}`);
    if (!qWords.length) return 0.5;
    const low = String(text || "").toLowerCase();
    const topicLow = String(topic || "").toLowerCase();
    let hits = 0;
    qWords.forEach((w) => {
      if (low.includes(w)) hits += 1;
    });
    let score = hits / qWords.length;
    // Strong boost if the full topic phrase appears
    if (topicLow.length > 3 && low.includes(topicLow)) score += 0.35;
    // Soft boost for multi-word topic pieces together
    const topicBits = topicLow.split(/\s+/).filter((w) => w.length > 2);
    if (topicBits.length >= 2 && topicBits.every((w) => low.includes(w))) score += 0.15;
    score -= offTopicPenalty(low, question);
    return Math.max(0, Math.min(1, score));
  }

  function pickAnswerSentences(intent, question, hits, max = 4) {
    const qWords = extractKeywords(question);
    const scored = [];
    const seen = new Set();
    for (const hit of hits.slice(0, 8)) {
      // Skip whole pages that are clear near-misses for this question
      if (offTopicPenalty(`${hit.title} ${hit.extract || ""}`, question) >= 0.5) continue;
      const sents = splitSentences(hit.extract || hit.text || "");
      for (const s of sents) {
        const key = s.slice(0, 80).toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        let score = 0;
        const low = s.toLowerCase();
        if (offTopicPenalty(low, question) >= 0.5) continue;
        let wordHits = 0;
        qWords.forEach((w) => {
          if (low.includes(w)) {
            score += 3;
            wordHits += 1;
          }
        });
        // Must touch the question — drop generic encyclopedia fluff
        if (qWords.length && wordHits === 0) continue;
        // Need enough overlap for multi-word questions (avoid "war" alone matching WWII)
        if (qWords.length >= 3 && wordHits < 2) continue;

        if (intent === "why" || intent === "causes") {
          if (/\b(because|cause|due to|result|leads? to|scattering|porqu|weil|потому|때문에|ため)\b/i.test(s)) score += 5;
        }
        if (intent === "who") {
          if (/\b(invent|discover|born|scientist|author|founder|is a|was a|created|designed)\b/i.test(s)) score += 4;
        }
        if (intent === "when") {
          if (/\b(1[0-9]{3}|20[0-9]{2}|January|February|March|April|May|June|July|August|September|October|November|December)\b/i.test(s)) score += 4;
        }
        if (intent === "how") {
          if (/\b(by|through|process|steps?|works?|using|via|converts?|produces?)\b/i.test(s)) score += 3;
        }
        if (intent === "yesno") {
          if (/\b(is|are|was|were|not|no |yes )\b/i.test(s)) score += 2;
        }
        if (intent === "compare") {
          if (/\b(whereas|while|unlike|different|both|however|vs)\b/i.test(s)) score += 3;
        }
        score += relevanceToQuestion(s, question) * 6;
        score += Math.max(0, (hit.score || 0) * 0.15);
        score += Math.max(0, 2 - hits.indexOf(hit));
        scored.push({ s, score, title: hit.title, wordHits });
      }
    }
    const ranked = scored.sort((a, b) => b.score - a.score);
    const onTopic = ranked.filter((x) => x.wordHits > 0);
    return (onTopic.length ? onTopic : ranked).slice(0, max).map((x) => x.s);
  }

  function craftDirectAnswer(intent, topic, bestHit, langCode = "en", supportHits = [], question = "") {
    const pack = answerPack(langCode);
    const extract = humanizeFact(bestHit?.extract || bestHit?.text || "");
    const title = bestHit?.title || topic;
    if (!extract) return "";

    const q = question || topic;
    const allHits = [bestHit, ...supportHits].filter(Boolean);
    // Only use support hits that still relate to the asked question
    const relatedHits = allHits.filter(
      (h) => relevanceToQuestion(`${h.title} ${h.extract || h.text || ""}`, q, topic) >= 0.2
    );
    const pool = relatedHits.length ? relatedHits : [bestHit];
    const picked = pickAnswerSentences(intent, q, pool, intent === "compare" ? 5 : 4);
    const lead = picked[0] || firstSentences(extract, 2);
    const more = picked.slice(1).filter((s) => relevanceToQuestion(s, q, topic) >= 0.15).join(" ");
    const rest = more || "";

    if (intent === "who") {
      return `**${pack.short}:** ${lead}\n\n${rest ? `**${pack.more}:** ${rest}\n\n` : ""}${pack.sourceTopic}: **${title}**.`;
    }
    if (intent === "when") {
      const year = `${lead} ${rest} ${extract}`.match(
        /\b((?:January|February|March|April|May|June|July|August|September|October|November|December|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septembre|octobre|novembre|décembre)\s+\d{1,2},?\s*\d{3,4}|\b(?:1[0-9]{3}|20[0-2][0-9])\b)/i
      );
      return year
        ? `**${pack.short}:** **${year[1].trim()}**.\n\n${lead}${rest ? `\n\n**${pack.more}:** ${rest}` : ""}`
        : `**${pack.short}:** ${lead}${rest ? `\n\n**${pack.more}:** ${rest}` : ""}`;
    }
    if (intent === "where") {
      return `**${pack.short}:** ${lead}${rest ? `\n\n**${pack.more}:** ${rest}` : ""}`;
    }
    if (intent === "why" || intent === "how" || intent === "causes") {
      const label = intent === "how" ? pack.how : intent === "causes" ? pack.causes : pack.short;
      return `**${label}:** ${lead}${rest ? `\n\n**${pack.more}:** ${rest}` : ""}`;
    }
    if (intent === "compare") {
      return `**${pack.diff}:**\n\n${lead}${rest ? `\n\n${rest}` : ""}`;
    }
    if (intent === "examples") {
      return `**${pack.answer}:** ${lead}${rest ? `\n\n**${pack.more}:** ${rest}` : ""}`;
    }
    if (intent === "yesno") {
      const blob = `${lead} ${rest}`.toLowerCase();
      const neg = /\b(not a|isn't|is not|are not|aren't|no longer|never)\b/i.test(blob);
      const verdict = neg ? "No" : /yes\b|is a |are a |was a /i.test(blob) ? "Yes — with nuance" : "Short take";
      return `**${pack.short} (${verdict}):** ${lead}${rest ? `\n\n**${pack.more}:** ${rest}` : ""}`;
    }
    if (intent === "define") {
      return `**${pack.answer}:** ${lead}${rest ? `\n\n${rest}` : ""}`;
    }
    return `**${pack.answer}:** ${lead}${rest ? `\n\n**${pack.more}:** ${rest}` : ""}`;
  }

  function synthesizeFromResearch(question, research, mathBlock, priorTurns, webHits = [], understood = null) {
    const info = understood || understandQuestion(question, "");
    const langCode = info.lang?.code || aiLastLang?.code || "en";
    if (info.lang) aiLastLang = info.lang;
    const pack = answerPack(langCode);
    const ranked = rankHits(webHits.length ? webHits : collectWebHits(research), question, info.topic)
      .filter((h) => (h.extract || h.text || "").length > 20);

    // Keep only sources that relate to the asked question (not just any strong page)
    const related = ranked.filter(
      (h) =>
        relevanceToQuestion(`${h.title} ${h.extract || h.text || ""}`, question, info.topic) >= 0.25 ||
        (h.score || 0) >= 8
    );
    const usable = related.length ? related : ranked.slice(0, 3);
    const best = usable[0];
    const overview = best?.extract || best?.text || "";
    const nameBit = aiUserName ? `, ${aiUserName}` : "";
    const support = usable.slice(1, 4);

    let out = "";
    if (mathBlock) {
      out += `${mathBlock}\n`;
      if (overview && relevanceToQuestion(overview, question, info.topic) >= 0.2) {
        out += `\n${pack.related}: ${firstSentences(overview, 2)}\n`;
      }
    } else if (overview) {
      out += pack.lead(nameBit);
      out += `> ${question.trim()}\n\n`;
      out += `${craftDirectAnswer(info.intent, info.topic, best, langCode, support, question)}\n`;
    } else {
      out += pack.noMatch(info.topic, nameBit);
    }

    // Extra bullets must still answer / support THIS question
    if (overview && support.length) {
      const keyFacts = pickAnswerSentences(info.intent, question, usable, 6)
        .slice(1)
        .filter((f) => relevanceToQuestion(f, question, info.topic) >= 0.25)
        .slice(0, 3);
      if (keyFacts.length) {
        out += `\n**${pack.also}:**\n`;
        keyFacts.forEach((f) => {
          out += `- ${f}\n`;
        });
      }
    }

    if (/study plan|how should i study|revise|review for|stressed about a .*test|plan de estudio|plan d'étude|lernplan|план учёбы|勉強計画|공부 계획|学习计划/i.test(question)) {
      out += `\n**${pack.planTitle}:** ${pack.plan}\n`;
    }

    if (usable.length) {
      out += `\n**${pack.sources}:**\n`;
      usable.slice(0, 5).forEach((h, i) => {
        out += `${i + 1}. [${h.title}](${h.url})\n`;
      });
    }

    if (overview || mathBlock) {
      out += pack.fuzzy;
    }

    return {
      content: out.trim(),
      followups: extractFollowups(out, question, research),
      sources: usable.slice(0, 5),
    };
  }

  function researchBriefText(question, subtopics, research, mathBlock, hits = []) {
    let brief = `USER QUESTION: ${question}\nSEARCH QUERIES: ${subtopics.join(" | ")}\n\n`;
    if (mathBlock) brief += `MATH ENGINE RESULT:\n${mathBlock}\n\n`;
    brief += "INTERNET RESULTS (use these to answer; cite links):\n";
    (hits.length ? hits : collectWebHits(research)).slice(0, 8).forEach((h, i) => {
      brief += `${i + 1}. ${h.title} [${h.source || "Web"}]\n${h.extract || h.text || ""}\nURL: ${h.url}\n\n`;
    });
    return brief;
  }

  async function askLlmChat(question, brief) {
    const base = (state.settings.aiBase || "https://openrouter.ai/api/v1").replace(/\/$/, "");
    const model = state.settings.aiModel || "openai/gpt-oss-20b:free";
    const lang = aiLastLang?.code ? aiLastLang : detectLanguage(question);
    aiLastLang = lang;
    const history = aiHistory
      .filter((m) => m.role === "user" || m.role === "assistant")
      .slice(-20)
      .map((m) => ({
        role: m.role,
        content: m.role === "assistant" ? String(m.content).slice(0, 2200) : m.content,
      }));
    const nameLine = aiUserName ? `Their name is ${aiUserName}. ` : "";
    const langLine = `User language detected: ${lang.name} (${lang.code}). ALWAYS reply in ${lang.name} unless they explicitly ask for another language.`;
    const userPayload = brief
      ? `USER'S EXACT QUESTION (${lang.name}): ${question}\n\nINTERNET RESULTS (may include off-topic pages — IGNORE anything that does not help answer THIS question):\n${brief}\n\nReply in ${lang.name}. Requirements:\n1) First sentence must answer the exact question above (not a related topic).\n2) Stay on that question in the explanation.\n3) Only use relevant sources; skip off-topic results.\n4) Optional extras only if they still relate to the asked question.\n5) Source links at the end.\nDo NOT give a generic encyclopedia summary of a nearby subject.`
      : `QUESTION (${lang.name}): ${question}\n\nReply in ${lang.name} like a real person. Keep the vibe natural.`;
    const messages = [
      { role: "system", content: `${AI_SYSTEM}\n${nameLine}${langLine}` },
      ...history.slice(0, -1),
      { role: "user", content: userPayload },
    ];
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.settings.aiKey}`,
        "HTTP-Referer": location.origin || "https://study-with-games.local",
        "X-Title": "study with games AI Mode",
      },
      body: JSON.stringify({ model, messages, temperature: 0.55 }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API ${res.status}: ${text.slice(0, 180)}`);
    }
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty response from model");
    return String(content).trim();
  }

  async function askStudyAi(question) {
    const q = question.trim();
    if (!q) return;
    rememberNameFrom(q);
    aiHistory.push({ role: "user", content: q });
    renderAiChat();

    const typing = document.createElement("div");
    typing.className = "ai-msg assistant typing";
    typing.textContent = "One sec…";
    els.aiChat.appendChild(typing);
    els.aiChat.scrollTop = els.aiChat.scrollHeight;
    setAiBusy(true, "One sec…");

    try {
      // Pure human chat — no research dump
      if (isChitchat(q) && !trySolveMath(q)) {
        if (state.settings.aiKey) {
          typing.textContent = "Thinking…";
          try {
            const content = await askLlmChat(q, null);
            aiHistory.push({
              role: "assistant",
              content,
              followups: extractFollowups(content, q, []),
            });
            return;
          } catch (_) {
            // fall through to local chitchat
          }
        }
        const local = chitchatReply(q);
        aiHistory.push({ role: "assistant", content: local.content, followups: local.followups });
        return;
      }

      const lastAssistant = [...aiHistory].reverse().find((m) => m.role === "assistant");
      const understoodPreview = understandQuestion(q, lastAssistant?.content || "");
      const langLabel = understoodPreview.lang?.name || "English";
      typing.textContent = `PulseSearch · ${langLabel} · “${understoodPreview.topic.slice(0, 36)}”…`;

      const mathBlock = trySolveMath(q);
      const {
        queries,
        research,
        hits,
        understood,
        confidence,
        phase,
      } = await pulseSearch(q, lastAssistant?.content || "", (msg) => {
        typing.textContent = msg;
      });

      const brief = researchBriefText(q, queries, research, mathBlock, hits);
      const confPct = Math.round((confidence || 0) * 100);

      let content;
      let followups = [];
      let sources = hits.slice(0, 5);
      if (state.settings.aiKey) {
        try {
          content = await askLlmChat(
            q,
            `${brief}\nUnderstood topic: ${understood.topic}\nIntent: ${understood.intent}\nDetected language: ${understood.lang?.name || aiLastLang.name} (${understood.lang?.code || aiLastLang.code})\nPulseSearch confidence: ${confPct}% (phase ${phase})\nAnswer the user's EXACT question (${q}). Do not substitute a generic topic overview.`
          );
          followups = extractFollowups(content, q, research);
        } catch (err) {
          const local = synthesizeFromResearch(
            q,
            research,
            mathBlock,
            aiHistory.length,
            hits,
            understood
          );
          content = local.content;
          followups = local.followups;
          sources = local.sources || sources;
        }
      } else {
        const local = synthesizeFromResearch(
          q,
          research,
          mathBlock,
          aiHistory.length,
          hits,
          understood
        );
        content = local.content;
        followups = local.followups;
        sources = local.sources || sources;
      }

      const cleaned = content
        .replace(/\n#### Go deeper\n[\s\S]*$/i, "")
        .replace(/\n#### Overview\n/gi, "\n")
        .trim();

      const metaNote =
        phase > 1
          ? `\n\nPulseSearch went deeper (phase ${phase}, ${confPct}% confidence) to gather more data for a more precise answer.`
          : "";

      aiHistory.push({
        role: "assistant",
        content: cleaned + metaNote,
        subtopics: queries,
        followups,
        sources,
        algorithm: "PulseSearch",
        confidence,
        phase,
      });
    } catch (err) {
      const msg = err?.message || "Something went wrong.";
      const mathBlock = trySolveMath(q);
      aiHistory.push({
        role: "assistant",
        content:
          (mathBlock ? `${mathBlock}\n\n` : "") +
          `Ugh, the internet search glitched: ${msg}\n\nTry asking again — I'll search the web for an answer.`,
        followups: ["Search for photosynthesis", "Who invented the telephone?", "What is gravity?"],
      });
    } finally {
      setAiBusy(false);
      renderAiChat();
    }
  }

  els.aiForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = els.aiInput.value;
    els.aiInput.value = "";
    askStudyAi(q);
  });

  els.aiClear?.addEventListener("click", () => {
    aiHistory.length = 0;
    aiUserName = "";
    renderAiChat();
  });

  els.aiSuggestions?.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-prompt]");
    if (!chip) return;
    askStudyAi(chip.dataset.prompt);
  });

  els.aiChat?.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-prompt]");
    if (!chip || !els.aiChat.contains(chip)) return;
    askStudyAi(chip.dataset.prompt);
  });

  els.aiInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      els.aiForm.requestSubmit();
    }
  });

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
  const persistAiSettings = () => {
    state.settings.aiKey = (els.settingAiKey?.value || "").trim();
    state.settings.aiBase = (els.settingAiBase?.value || "https://openrouter.ai/api/v1").trim();
    state.settings.aiModel = (els.settingAiModel?.value || "openai/gpt-oss-20b:free").trim();
    updateAiStatus();
    saveState();
  };
  els.settingAiKey?.addEventListener("change", persistAiSettings);
  els.settingAiBase?.addEventListener("change", persistAiSettings);
  els.settingAiModel?.addEventListener("change", persistAiSettings);

  // Drop legacy save so prior progress/time starts fresh
  localStorage.removeItem("study-with-games-v1");

  initStarfields();
  renderAiChat();
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
