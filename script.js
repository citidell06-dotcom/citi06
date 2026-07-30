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

  const THEMES = [
    {
      id: "sunset",
      name: "Sunset",
      rarity: "common",
      cost: 3,
      desc: "Warm dusk glow over the study zone.",
    },
    {
      id: "blackhole",
      name: "Black Hole",
      rarity: "epic",
      cost: 15,
      desc: "Deep space swirl with star sparkles.",
    },
    {
      id: "mario",
      name: "Mario World",
      rarity: "legendary",
      cost: 20,
      desc: "Blue skies, hills, and pipe-era vibes.",
    },
  ];

  const GAMES = [
    {
      id: "arkanoid",
      name: "Arkanoid",
      rarity: "rare",
      cost: 10,
      desc: "Break bricks with the paddle.",
      help: "← → or A/D move · click/tap also works",
    },
    {
      id: "galaga",
      name: "Galaga",
      rarity: "epic",
      cost: 20,
      desc: "Blast waves of invaders.",
      help: "← → move · Space / tap to shoot",
    },
    {
      id: "tetris",
      name: "Tetris",
      rarity: "legendary",
      cost: 30,
      desc: "Classic stack-and-clear blocks.",
      help: "← → move · ↑ rotate · ↓ soft drop · Space hard drop",
    },
    {
      id: "mario2d",
      name: "Mario 2D",
      rarity: "legendary",
      cost: 30,
      desc: "Old-school run and jump side-scroller.",
      help: "← → move · ↑ / Space / tap to jump",
    },
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
  };

  const loaded = loadState();
  const startLevel = Math.min(MAX_LEVEL, Math.max(1, loaded?.level ?? 1));
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
    const active = state.quests.filter((q) => !q.done).length;
    els.questCount.textContent = `${active} active`;
    els.questEmpty.hidden = state.quests.length > 0;

    state.quests.forEach((quest) => {
      const difficulty = DIFFICULTY[quest.difficulty] ? quest.difficulty : "medium";
      const xp = questXp(difficulty);
      const li = document.createElement("li");
      li.className = `quest-item ${difficulty}${quest.done ? " done" : ""}`;
      li.dataset.id = quest.id;

      const check = document.createElement("input");
      check.type = "checkbox";
      check.className = "quest-check";
      check.checked = quest.done;
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
    renderQuests();
    saveState();
  }

  function toggleQuest(id) {
    const quest = state.quests.find((q) => q.id === id);
    if (!quest) return;

    if (!quest.done) {
      const difficulty = DIFFICULTY[quest.difficulty] ? quest.difficulty : "medium";
      const xp = questXp(difficulty);
      quest.done = true;
      playCompleteSound(difficulty);
      renderQuests();
      setTimeout(() => addXp(xp, `${DIFFICULTY[difficulty].label} quest`), 180);
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
    if (!item || state.ownedGames.includes(id)) return;
    if (state.tokens < item.cost) {
      showToast("Not enough tokens");
      return;
    }
    state.tokens -= item.cost;
    state.ownedGames.push(id);
    renderTokens();
    renderShop();
    saveState();
    showToast(`Unlocked ${item.name}`);
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
    let disabled = "";

    if (owned && type === "theme") {
      actionLabel = active ? "Equipped" : "Equip";
      actionAttr = `data-equip-theme="${item.id}"`;
    } else if (owned && type === "game") {
      actionLabel = "Owned";
      actionAttr = "";
      disabled = "disabled";
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
        <button type="button" class="btn ${owned ? "btn-ghost" : "btn-primary"}" ${actionAttr} ${disabled}>${actionLabel}</button>
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
    const buy = e.target.closest("[data-buy-game]");
    if (buy) buyGame(buy.dataset.buyGame);
  });

  function openRewardModal() {
    const owned = GAMES.filter((g) => state.ownedGames.includes(g.id));
    if (!owned.length) {
      els.rewardCopy.textContent =
        "Buy games in the Token Shop to play them when a timer finishes.";
      els.rewardGames.innerHTML = "";
    } else {
      els.rewardCopy.textContent = "Pick a game you own as a reward break.";
      els.rewardGames.innerHTML = owned
        .map(
          (g) =>
            `<button type="button" class="btn btn-primary" data-play-game="${g.id}">Play ${g.name}</button>`
        )
        .join("");
    }
    els.rewardModal.hidden = false;
  }

  function closeRewardModal() {
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
    let player, bullets, enemies, score, over, spawnTimer, last;

    function reset() {
      player = { x: W / 2, y: H - 40, w: 28, h: 16 };
      bullets = [];
      enemies = [];
      score = 0;
      over = false;
      spawnTimer = 0;
      setScore(0);
      last = performance.now();
    }

    function shoot() {
      if (bullets.length > 4) return;
      bullets.push({ x: player.x, y: player.y - 10, vy: -8 });
    }

    function draw() {
      gctx.fillStyle = "#050814";
      gctx.fillRect(0, 0, W, H);
      gctx.fillStyle = "#39ffb6";
      gctx.fillRect(player.x - player.w / 2, player.y, player.w, player.h);
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
      if (spawnTimer > 700) {
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
      });
      bullets = bullets.filter((b) => b.y > -20);

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
            score += en.elite ? 50 : 20;
            setScore(score);
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
    let player, hazards, coins, scroll, score, over, last, jumpBuf;

    function reset() {
      player = { x: 80, y: GROUND - 28, vx: 0, vy: 0, w: 22, h: 28, onGround: true };
      hazards = [];
      coins = [];
      scroll = 0;
      score = 0;
      over = false;
      jumpBuf = 0;
      setScore(0);
      last = performance.now();
      for (let i = 0; i < 8; i++) spawnAhead(400 + i * 160);
    }

    function spawnAhead(x) {
      if (Math.random() < 0.55) {
        hazards.push({ x, y: GROUND - 18, w: 22, h: 18 });
      } else {
        coins.push({ x, y: GROUND - 70 - Math.random() * 40, r: 8, taken: false });
      }
    }

    function jump() {
      if (player.onGround || jumpBuf > 0) {
        player.vy = -9.2;
        player.onGround = false;
        jumpBuf = 0;
      }
    }

    function draw() {
      // sky
      gctx.fillStyle = "#5c94fc";
      gctx.fillRect(0, 0, W, H);
      // hills
      gctx.fillStyle = "#5cbf2a";
      gctx.beginPath();
      gctx.ellipse(60 - (scroll * 0.2) % 200, GROUND, 90, 40, 0, 0, Math.PI * 2);
      gctx.ellipse(220 - (scroll * 0.2) % 200, GROUND, 110, 50, 0, 0, Math.PI * 2);
      gctx.ellipse(340 - (scroll * 0.2) % 200, GROUND, 80, 35, 0, 0, Math.PI * 2);
      gctx.fill();
      // ground
      gctx.fillStyle = "#c84c0c";
      gctx.fillRect(0, GROUND, W, H - GROUND);
      gctx.fillStyle = "#8b3a12";
      gctx.fillRect(0, GROUND + 18, W, H - GROUND);

      coins.forEach((c) => {
        if (c.taken) return;
        const sx = c.x - scroll;
        gctx.fillStyle = "#ffd166";
        gctx.beginPath();
        gctx.arc(sx, c.y, c.r, 0, Math.PI * 2);
        gctx.fill();
      });

      hazards.forEach((h) => {
        const sx = h.x - scroll;
        gctx.fillStyle = "#e52521";
        gctx.fillRect(sx, h.y, h.w, h.h);
        gctx.fillStyle = "#fff";
        gctx.fillRect(sx + 4, h.y + 4, 4, 4);
        gctx.fillRect(sx + 14, h.y + 4, 4, 4);
      });

      gctx.fillStyle = "#e52521";
      gctx.fillRect(player.x, player.y, player.w, player.h);
      gctx.fillStyle = "#ffe0bd";
      gctx.fillRect(player.x + 4, player.y + 4, 14, 10);

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
      const dt = Math.min(32, ts - last) / 16;
      last = ts;
      if (over) {
        draw();
        return;
      }

      jumpBuf = Math.max(0, jumpBuf - dt);
      const speed = 3.2 + score * 0.01;
      scroll += speed * dt;

      if (keys.has("ArrowLeft") || keys.has("a") || keys.has("A")) player.x -= 3.2 * dt;
      if (keys.has("ArrowRight") || keys.has("d") || keys.has("D")) player.x += 3.2 * dt;
      if (keys.has("ArrowUp") || keys.has(" ") || keys.has("w") || keys.has("W")) jump();

      player.x = Math.max(20, Math.min(W - 60, player.x));
      player.vy += 0.45 * dt;
      player.y += player.vy * dt;
      if (player.y >= GROUND - player.h) {
        player.y = GROUND - player.h;
        player.vy = 0;
        player.onGround = true;
      }

      while (hazards.length && hazards[0].x - scroll < -40) hazards.shift();
      while (coins.length && coins[0].x - scroll < -40) coins.shift();

      const farthest = Math.max(
        scroll + W,
        ...hazards.map((h) => h.x),
        ...coins.map((c) => c.x),
        scroll + W
      );
      if (farthest < scroll + W + 200) spawnAhead(farthest + 140 + Math.random() * 80);

      hazards.forEach((h) => {
        const sx = h.x - scroll;
        if (
          player.x < sx + h.w &&
          player.x + player.w > sx &&
          player.y < h.y + h.h &&
          player.y + player.h > h.y
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

      score = Math.max(score, Math.floor(scroll / 20));
      setScore(score);
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

  renderXp();
  renderQuests();
  renderTimer();
  renderTokens();
  renderShop();
  applyTheme(state.activeTheme);

  // Unlock Web Audio on first user gesture (browser autoplay policy)
  const unlockAudio = () => {
    getAudioCtx();
    window.removeEventListener("pointerdown", unlockAudio);
    window.removeEventListener("keydown", unlockAudio);
  };
  window.addEventListener("pointerdown", unlockAudio);
  window.addEventListener("keydown", unlockAudio);
})();
