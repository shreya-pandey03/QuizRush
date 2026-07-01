"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ─── Tabler Icons (inline SVGs to avoid extra deps) ───────────────────────────
const IconBolt = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z" />
  </svg>
);
const IconUsers = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="7" r="4" />
    <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    <path d="M21 21v-2a4 4 0 0 0-3-3.85" />
  </svg>
);
const IconTrophy = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 21h8m-4-4v4M7 4H4a1 1 0 0 0-1 1v3a4 4 0 0 0 4 4h.5M17 4h3a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4h-.5" />
    <path d="M6 4h12v7a6 6 0 0 1-12 0V4z" />
  </svg>
);
const IconClock = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);
const IconCategory = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);
const IconMobile = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="7" y="2" width="10" height="20" rx="2" />
    <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const IconGamepad = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 12h4m-2-2v4" />
    <circle cx="17" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="19" cy="10" r="1" fill="currentColor" stroke="none" />
    <path d="M4 8h16l-1.5 9a2 2 0 0 1-2 1.5H7.5a2 2 0 0 1-2-1.5L4 8z" />
    <path d="M8 8V6a2 2 0 0 1 4 0v2" />
  </svg>
);
const IconPlay = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none" />
  </svg>
);
const IconFlame = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2c0 6-6 8-6 14a6 6 0 0 0 12 0c0-6-6-8-6-14z" />
    <path d="M12 12c0 3-2 4-2 7a2 2 0 0 0 4 0c0-3-2-4-2-7z" />
  </svg>
);
const IconStar = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

// ─── Leaderboard data ─────────────────────────────────────────────────────────
const LEADERS = [
  {
    rank: 1,
    initials: "VK",
    name: "Virat",
    score: "3,180",
    pct: 100,
    color: "#FAC775",
    bg: "rgba(250,199,117,.15)",
    tier: "gold",
  },
  {
    rank: 2,
    initials: "ST",
    name: "Sachin",
    score: "2,840",
    pct: 89,
    color: "#B4B2A9",
    bg: "rgba(180,178,169,.1)",
    tier: "silver",
  },
  {
    rank: 3,
    initials: "SI",
    name: "Shreyas",
    score: "2,390",
    pct: 75,
    color: "#EF9F27",
    bg: "rgba(186,117,23,.12)",
    tier: "bronze",
  },
  {
    rank: 4,
    initials: "AS",
    name: "Abhishek",
    score: "1,820",
    pct: 57,
    color: "rgba(234,120,30,.7)",
    bg: "rgba(234,120,30,.08)",
    tier: "",
  },
  {
    rank: 5,
    initials: "YO",
    name: "You (Host)",
    score: "980",
    pct: 95,
    color: "rgba(245,240,232,.4)",
    bg: "rgba(245,240,232,.05)",
    tier: "",
  },
];

const TICKER_ITEMS = [
  { icon: <IconTrophy />, text: "@Virat just won a Battle Royale" },
  { icon: <IconBolt />, text: "New room: Science & Tech — 8 players" },
  { icon: <IconFlame />, text: "@Sachin is on a 12-game win streak" },
  { icon: <IconUsers />, text: "IPL Special quiz — 240 players joined" },
  { icon: <IconStar />, text: "@Shreyas reached Diamond tier" },
];

const FEATURES = [
  {
    icon: <IconBolt />,
    title: "Real-time battles",
    desc: "Every answer syncs instantly. See your opponents move in live time — milliseconds matter.",
  },
  {
    icon: <IconUsers />,
    title: "Multiplayer rooms",
    desc: "Create private rooms for friends or jump into a public lobby with up to 50 players.",
  },
  {
    icon: <IconTrophy />,
    title: "Live leaderboard",
    desc: "Rankings update after every question. Climb from Bronze to Diamond across weekly seasons.",
  },
  {
    icon: <IconClock />,
    title: "Speed scoring",
    desc: "Answer faster, score higher. The first correct response gets a speed bonus multiplier.",
  },
  {
    icon: <IconCategory />,
    title: "30+ categories",
    desc: "Sports, science, Bollywood, history, IPL, tech — new question packs drop every week.",
  },
  {
    icon: <IconMobile />,
    title: "Play anywhere",
    desc: "Fully responsive — phone, tablet, desktop. Jump in from anywhere in seconds.",
  },
];

const STATS = [
  { num: "48K+", label: "Total players" },
  { num: "2,400", label: "Online now" },
  { num: "312", label: "Active rooms" },
  { num: "1.2M", label: "Questions answered" },
];

// ─── Styles as a JS object (injected via <style> tag) ─────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400;1,500&display=swap');

  :root {
    --orange: #ea781e;
    --orange-light: #f5a55a;
    --bg: #0a0a0a;
    --bg-card: #0d0d0d;
    --bg-inner: #111;
    --text: #f5f0e8;
    --text-muted: rgba(245,240,232,.5);
    --text-faint: rgba(245,240,232,.3);
    --orange-border: rgba(234,120,30,.2);
    --orange-dim: rgba(234,120,30,.08);
  }

  .qr-root * { box-sizing: border-box; }

  .qr-root {
    font-family: 'Lora', Georgia, serif;
    background: var(--bg);
    color: var(--text);
    overflow-x: hidden;
    min-height: 100vh;
    position: relative;
  }

  /* Grid BG */
  .qr-grid {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(234,120,30,.055) 1px, transparent 1px),
      linear-gradient(90deg, rgba(234,120,30,.055) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  .qr-grid::after {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 80% 55% at 50% 0%, rgba(234,120,30,.14) 0%, transparent 68%);
  }

  /* Scanline */
  .qr-scan {
    position: fixed; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, rgba(234,120,30,.28), transparent);
    animation: qrScan 5s linear infinite;
    z-index: 1; pointer-events: none;
  }

  /* Nav */
  .qr-nav {
    position: relative; z-index: 10;
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.25rem 2.5rem;
    border-bottom: 0.5px solid var(--orange-border);
  }
  .qr-logo {
    display: flex; align-items: center; gap: 8px;
    font-size: 17px; color: var(--orange); letter-spacing: .02em;
    text-decoration: none;
  }
  .qr-logo-dot {
    width: 8px; height: 8px; border-radius: 50%; background: var(--orange);
    animation: qrBlink 1.5s ease-in-out infinite;
  }
  .qr-nav-links { display: flex; gap: 2rem; }
  .qr-nav-links a {
    font-size: 13px; color: var(--text-muted); text-decoration: none; transition: color .2s;
  }
  .qr-nav-links a:hover { color: var(--orange); }
  .qr-btn-nav {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--orange); color: #fff;
    border: none; border-radius: 8px;
    padding: 9px 20px; font-size: 13px; font-family: 'Lora', serif;
    cursor: pointer; text-decoration: none;
    transition: background .2s, transform .15s;
  }
  .qr-btn-nav:hover { background: #d46a15; transform: translateY(-1px); }

  /* Hero */
  .qr-hero {
    position: relative; z-index: 5;
    display: flex; flex-direction: column; align-items: center;
    text-align: center; padding: 5.5rem 2rem 3rem;
  }
  .qr-badge {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(234,120,30,.12);
    border: 0.5px solid rgba(234,120,30,.4);
    border-radius: 100px; padding: 5px 16px;
    font-size: 10px; letter-spacing: .15em; text-transform: uppercase;
    color: var(--orange); margin-bottom: 2.25rem;
    animation: qrPop .5s ease both;
  }
  .qr-live-dot {
    width: 6px; height: 6px; border-radius: 50%; background: var(--orange);
    animation: qrBlink 1s step-end infinite;
  }
  .qr-h1 {
    font-size: clamp(2.8rem, 7vw, 4.6rem);
    font-weight: 400; line-height: 1.08; letter-spacing: -.02em;
    animation: qrPop .5s .1s ease both; max-width: 720px;
  }
  .qr-h1 .acc { color: var(--orange); font-style: italic; }
  .qr-h1 .dim { color: rgba(245,240,232,.28); }
  .qr-sub {
    margin-top: 1.5rem; font-size: 16px; color: var(--text-muted);
    max-width: 500px; line-height: 1.75;
    animation: qrPop .5s .2s ease both;
  }
  .qr-cta {
    display: flex; gap: 12px; margin-top: 2.75rem;
    animation: qrPop .5s .3s ease both;
    flex-wrap: wrap; justify-content: center;
  }
  .qr-btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--orange); color: #fff;
    border: none; border-radius: 8px;
    padding: 14px 30px; font-size: 15px; font-family: 'Lora', serif;
    cursor: pointer; text-decoration: none;
    transition: background .2s, transform .15s;
  }
  .qr-btn-primary:hover { background: #d46a15; transform: translateY(-2px); }
  .qr-btn-secondary {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent; color: var(--text-muted);
    border: 0.5px solid rgba(245,240,232,.2); border-radius: 8px;
    padding: 14px 30px; font-size: 15px; font-family: 'Lora', serif;
    cursor: pointer; text-decoration: none;
    transition: border-color .2s, color .2s, transform .15s;
  }
  .qr-btn-secondary:hover { border-color: rgba(245,240,232,.45); color: var(--text); transform: translateY(-2px); }

  /* Orb */
  .qr-orb-scene {
    position: relative; width: 220px; height: 220px;
    margin: 3rem auto 1rem;
    animation: qrPop .5s .4s ease both;
  }
  .qr-orb-ring {
    position: absolute; top: 50%; left: 50%;
    width: 200px; height: 200px; transform: translate(-50%,-50%);
    border-radius: 50%; border: 0.5px solid rgba(234,120,30,.2);
  }
  .qr-orb-ring2 {
    position: absolute; top: 50%; left: 50%;
    width: 148px; height: 148px; transform: translate(-50%,-50%);
    border-radius: 50%; border: 0.5px solid rgba(234,120,30,.13);
  }
  .qr-orb-core {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
    width: 88px; height: 88px; border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #f5a55a, #ea781e 50%, #7a3a0a);
    box-shadow: 0 0 0 2px rgba(234,120,30,.3), 0 0 40px rgba(234,120,30,.18);
    display: flex; align-items: center; justify-content: center;
    font-size: 32px;
  }
  .qr-planet {
    position: absolute; top: 50%; left: 50%;
    border-radius: 50%; margin: -8px 0 0 -8px;
    width: 16px; height: 16px;
  }
  .qr-p1 { background: var(--orange); animation: qrOrbit1 4s linear infinite; }
  .qr-p2 { background: var(--orange-light); animation: qrOrbit2 6s linear infinite; }
  .qr-p3 { background: #1a0a03; border: 1px solid rgba(234,120,30,.5); animation: qrOrbit3 3s linear infinite; }

  /* Stats */
  .qr-stats {
    position: relative; z-index: 5;
    display: flex; justify-content: center;
    padding: 0 2.5rem 3.5rem;
    animation: qrPop .5s .5s ease both;
  }
  .qr-stat {
    display: flex; flex-direction: column; align-items: center;
    padding: 1.25rem 2.75rem;
    border: 0.5px solid rgba(234,120,30,.15);
    background: rgba(234,120,30,.04);
  }
  .qr-stat:first-child { border-radius: 8px 0 0 8px; }
  .qr-stat:last-child { border-radius: 0 8px 8px 0; }
  .qr-stat + .qr-stat { border-left: none; }
  .qr-stat-num { font-size: 22px; color: var(--orange); }
  .qr-stat-label { font-size: 11px; color: var(--text-faint); margin-top: 3px; letter-spacing: .06em; }

  /* Ticker */
  .qr-ticker {
    position: relative; z-index: 5;
    border-top: 0.5px solid rgba(234,120,30,.15);
    border-bottom: 0.5px solid rgba(234,120,30,.15);
    background: rgba(234,120,30,.04);
    overflow: hidden; padding: 11px 0; margin-bottom: 4.5rem;
  }
  .qr-ticker-inner {
    display: flex; gap: 3rem; white-space: nowrap;
    animation: qrTicker 22s linear infinite;
    font-size: 12px; color: var(--text-muted); letter-spacing: .07em;
  }
  .qr-ticker-item { display: flex; align-items: center; gap: 7px; }
  .qr-ticker-item svg { color: var(--orange); flex-shrink: 0; }

  /* Section label */
  .qr-section-label {
    position: relative; z-index: 5;
    display: flex; align-items: center; gap: 8px;
    padding: 0 2.5rem; margin-bottom: 1.5rem;
    font-size: 10px; letter-spacing: .14em; text-transform: uppercase;
    color: var(--orange);
  }
  .qr-section-label::after {
    content: ''; flex: 1; height: 0.5px; background: rgba(234,120,30,.2);
  }

  /* Features */
  .qr-features {
    position: relative; z-index: 5;
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 1px; background: rgba(234,120,30,.1);
    margin: 0 2.5rem 5rem; border-radius: 12px; overflow: hidden;
  }
  .qr-feat {
    background: var(--bg-card); padding: 2rem 1.75rem; transition: background .2s;
  }
  .qr-feat:hover { background: rgba(234,120,30,.06); }
  .qr-feat-icon {
    width: 44px; height: 44px; border-radius: 10px;
    background: rgba(234,120,30,.1);
    border: 0.5px solid rgba(234,120,30,.25);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1rem; color: var(--orange);
  }
  .qr-feat-title { font-size: 15px; margin-bottom: .5rem; }
  .qr-feat-desc { font-size: 13px; color: var(--text-muted); line-height: 1.65; }

  /* Game preview */
  .qr-preview {
    position: relative; z-index: 5;
    margin: 0 2.5rem 5rem;
    border: 0.5px solid rgba(234,120,30,.2);
    border-radius: 12px; overflow: hidden;
    background: var(--bg-card);
  }
  .qr-preview-hdr {
    display: flex; align-items: center; gap: 8px;
    padding: 12px 16px;
    border-bottom: 0.5px solid rgba(234,120,30,.15);
    background: rgba(234,120,30,.05);
    font-size: 12px; color: var(--text-muted);
  }
  .qr-pdot { width: 8px; height: 8px; border-radius: 50%; }
  .qr-preview-body { padding: 1.75rem; }
  .qr-prog-row { display: flex; align-items: center; gap: 12px; margin-bottom: 1.5rem; }
  .qr-prog-track { flex: 1; height: 3px; background: rgba(245,240,232,.08); border-radius: 2px; }
  .qr-prog-fill { height: 100%; background: var(--orange); border-radius: 2px; width: 35%; }
  .qr-timer {
    display: flex; align-items: center; gap: 5px;
    font-size: 12px; color: var(--orange);
    background: rgba(234,120,30,.1); border: 0.5px solid rgba(234,120,30,.3);
    border-radius: 6px; padding: 4px 10px;
  }
  .qr-q-card {
    background: var(--bg-inner); border: 0.5px solid rgba(234,120,30,.15);
    border-radius: 10px; padding: 1.25rem 1.5rem; margin-bottom: 1rem;
  }
  .qr-q-label { font-size: 10px; text-transform: uppercase; letter-spacing: .12em; color: var(--orange); margin-bottom: .5rem; }
  .qr-q-text { font-size: 16px; line-height: 1.45; }
  .qr-opts { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .qr-opt {
    padding: 11px 15px; border-radius: 8px;
    border: 0.5px solid rgba(245,240,232,.1);
    font-size: 13px; color: var(--text-muted);
    background: var(--bg-inner); cursor: pointer;
    transition: all .15s; font-family: 'Lora', serif;
    text-align: left;
  }
  .qr-opt:hover { border-color: rgba(234,120,30,.4); background: rgba(234,120,30,.06); color: var(--text); }
  .qr-opt.correct { border-color: #3B6D11; background: rgba(59,109,17,.15); color: #97C459; }
  .qr-opt.wrong { border-color: #A32D2D; background: rgba(163,45,45,.12); color: #F09595; }

  /* Leaderboard */
  .qr-lb {
    position: relative; z-index: 5;
    margin: 0 2.5rem 5rem;
    border: 0.5px solid rgba(234,120,30,.15);
    border-radius: 12px; overflow: hidden;
  }
  .qr-lb-hdr {
    display: flex; align-items: center; gap: 8px;
    padding: 14px 1.5rem;
    border-bottom: 0.5px solid rgba(234,120,30,.1);
    background: rgba(234,120,30,.06);
    font-size: 13px; color: var(--text-muted);
  }
  .qr-lb-hdr svg { color: var(--orange); }
  .qr-lb-row {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 1.5rem;
    border-bottom: 0.5px solid rgba(245,240,232,.04);
    transition: background .15s;
  }
  .qr-lb-row:hover { background: rgba(234,120,30,.04); }
  .qr-lb-row:last-child { border-bottom: none; }
  .qr-lb-rank { font-size: 12px; color: var(--text-faint); width: 18px; }
  .qr-lb-rank.gold { color: #FAC775; }
  .qr-lb-rank.silver { color: #B4B2A9; }
  .qr-lb-rank.bronze { color: #BA7517; }
  .qr-lb-av {
    width: 30px; height: 30px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 600; flex-shrink: 0;
  }
  .qr-lb-name { flex: 1; font-size: 13px; }
  .qr-lb-score { font-size: 13px; color: var(--orange); }
  .qr-lb-bar-wrap { width: 80px; height: 3px; background: rgba(245,240,232,.06); border-radius: 2px; }
  .qr-lb-bar { height: 100%; background: var(--orange); border-radius: 2px; opacity: .6; }

  /* CTA */
  .qr-cta-section {
    position: relative; z-index: 5;
    text-align: center; padding: 4.5rem 2rem 5.5rem;
    border-top: 0.5px solid rgba(234,120,30,.1);
  }
  .qr-cta-section h2 {
    font-size: 2.2rem; font-weight: 400; line-height: 1.2;
    max-width: 520px; margin: 0 auto 1rem;
  }
  .qr-cta-section h2 em { color: var(--orange); font-style: italic; }
  .qr-cta-section p { font-size: 15px; color: var(--text-muted); margin-bottom: 2.25rem; }

  /* Footer */
  .qr-footer {
    position: relative; z-index: 5;
    border-top: 0.5px solid rgba(245,240,232,.05);
    padding: 1.5rem 2.5rem;
    display: flex; justify-content: space-between; align-items: center;
    font-size: 12px; color: rgba(245,240,232,.2);
  }
  .qr-footer a { color: rgba(245,240,232,.2); text-decoration: none; transition: color .2s; }
  .qr-footer a:hover { color: var(--orange); }
  .qr-footer-links { display: flex; gap: 1.5rem; }

  /* Keyframes */
  @keyframes qrPop { 0%{transform:scale(.85);opacity:0} 60%{transform:scale(1.04)} 100%{transform:scale(1);opacity:1} }
  @keyframes qrBlink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes qrScan { 0%{top:-5%} 100%{top:105%} }
  @keyframes qrTicker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes qrOrbit1 { 0%{transform:rotate(0deg) translateX(90px) rotate(0deg)} 100%{transform:rotate(360deg) translateX(90px) rotate(-360deg)} }
  @keyframes qrOrbit2 { 0%{transform:rotate(120deg) translateX(70px) rotate(-120deg)} 100%{transform:rotate(480deg) translateX(70px) rotate(-480deg)} }
  @keyframes qrOrbit3 { 0%{transform:rotate(240deg) translateX(55px) rotate(-240deg)} 100%{transform:rotate(600deg) translateX(55px) rotate(-600deg)} }

  @media (max-width: 768px) {
    .qr-nav-links { display: none; }
    .qr-features { grid-template-columns: 1fr; margin: 0 1rem 3rem; }
    .qr-preview, .qr-lb { margin: 0 1rem 3rem; }
    .qr-stats { flex-direction: column; align-items: stretch; padding: 0 1rem 2.5rem; }
    .qr-stat { border-radius: 8px !important; border: 0.5px solid rgba(234,120,30,.15) !important; }
    .qr-stat + .qr-stat { border-left: 0.5px solid rgba(234,120,30,.15) !important; margin-top: -1px; }
    .qr-opts { grid-template-columns: 1fr; }
    .qr-section-label { padding: 0 1rem; }
    .qr-cta-section h2 { font-size: 1.75rem; }
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [timer, setTimer] = useState(12);
  const [timerDanger, setTimerDanger] = useState(false);
  const [answered, setAnswered] = useState<"correct" | "wrong" | null>(null);

  const [lockedIndex, setLockedIndex] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer countdown
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimer((s) => {
        if (s <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }

          return 0;
        }

        if (s <= 6) {
          setTimerDanger(true);
        }

        return s - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const OPTIONS = [
    { text: "HyperText Transfer Process", correct: false },
    { text: "HyperText Transfer Protocol", correct: true },
    { text: "High Text Transfer Protocol", correct: false },
    { text: "HyperText Transmission Protocol", correct: false },
  ];

  function handleOpt(idx: number) {
    if (answered) return;
    if (timerRef.current !== null) clearInterval(timerRef.current);
    setLockedIndex(idx);
    setAnswered(OPTIONS[idx].correct ? "correct" : "wrong");
  }

  function getOptClass(idx: number) {
    if (lockedIndex === null) return "qr-opt";
    if (OPTIONS[idx].correct) return "qr-opt correct";
    if (idx === lockedIndex && !OPTIONS[idx].correct) return "qr-opt wrong";
    return "qr-opt";
  }

  // Double ticker items for seamless loop
  const tickerItems = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="qr-root">
        <div className="qr-grid" />
        <div className="qr-scan" />

        {/* ── Nav ─────────────────────────────────────────── */}
        <nav className="qr-nav">
          <Link href="/" className="qr-logo">
            <span className="qr-logo-dot" />
            QuizRush
          </Link>
          <div className="qr-nav-links">
            <a href="#features">Features</a>
            <a href="#leaderboard">Leaderboard</a>
          </div>
          <Link href="/signup" className="qr-btn-nav">
            <IconGamepad /> Get started
          </Link>
        </nav>

        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="qr-hero">
          <div className="qr-badge">
            <span className="qr-live-dot" />
            Live now — 2,400+ players online
          </div>
          <h1 className="qr-h1">
            Quiz battles.
            <br />
            <span className="acc">Real-time.</span>{" "}
            <span className="dim">No mercy.</span>
          </h1>
          <p className="qr-sub">
            Compete against real players in live knowledge battles. Climb the
            ranks, earn trophies, and prove you're the smartest in the room.
          </p>
          <div className="qr-cta">
            <Link href="/signup" className="qr-btn-primary">
              <IconGamepad /> Play now — it&apos;s free
            </Link>
            <Link href="/home" className="qr-btn-secondary">
              <IconPlay /> Watch a live match
            </Link>
          </div>

          {/* 3D Orb */}
          <div className="qr-orb-scene" aria-hidden="true">
            <div className="qr-orb-ring2" />
            <div className="qr-orb-ring" />
            <div className="qr-orb-core">⚡</div>
            <div className="qr-planet qr-p1" />
            <div className="qr-planet qr-p2" />
            <div className="qr-planet qr-p3" />
          </div>
        </section>

        {/* ── Stats ────────────────────────────────────────── */}
        <div className="qr-stats">
          {STATS.map((s) => (
            <div key={s.label} className="qr-stat">
              <span className="qr-stat-num">{s.num}</span>
              <span className="qr-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Ticker ───────────────────────────────────────── */}
        <div className="qr-ticker" aria-hidden="true">
          <div className="qr-ticker-inner">
            {tickerItems.map((item, i) => (
              <span key={i} className="qr-ticker-item">
                {item.icon} {item.text}
              </span>
            ))}
          </div>
        </div>

        {/* ── Features ─────────────────────────────────────── */}
        <div id="features" className="qr-section-label">
          <IconCategory /> Features
        </div>
        <div className="qr-features">
          {FEATURES.map((f) => (
            <div key={f.title} className="qr-feat">
              <div className="qr-feat-icon">{f.icon}</div>
              <div className="qr-feat-title">{f.title}</div>
              <div className="qr-feat-desc">{f.desc}</div>
            </div>
          ))}
        </div>

        {/* ── Game Preview ─────────────────────────────────── */}
        <div className="qr-section-label">
          <IconGamepad /> Live match preview
        </div>
        <div className="qr-preview">
          <div className="qr-preview-hdr">
            <div className="qr-pdot" style={{ background: "#ea781e" }} />
            <div
              className="qr-pdot"
              style={{ background: "rgba(245,240,232,.2)" }}
            />
            <div
              className="qr-pdot"
              style={{ background: "rgba(245,240,232,.2)" }}
            />
            <span style={{ marginLeft: 4 }}>
              Science &amp; Tech room — 24 players
            </span>
            <span
              style={{
                marginLeft: "auto",
                color: "#ea781e",
                fontSize: 10,
                letterSpacing: ".1em",
              }}
            >
              ● LIVE
            </span>
          </div>
          <div className="qr-preview-body">
            <div className="qr-prog-row">
              <span style={{ fontSize: 11, color: "rgba(245,240,232,.4)" }}>
                Q 3 / 10
              </span>
              <div className="qr-prog-track">
                <div className="qr-prog-fill" />
              </div>
              <div
                className="qr-timer"
                style={timerDanger ? { color: "#F09595" } : {}}
              >
                <IconClock /> {timer}s
              </div>
            </div>
            <div className="qr-q-card">
              <div className="qr-q-label">Science &amp; Tech</div>
              <div className="qr-q-text">
                What does HTTP stand for in web technology?
              </div>
            </div>
            <div className="qr-opts">
              {OPTIONS.map((opt, idx) => (
                <button
                  key={idx}
                  className={getOptClass(idx)}
                  onClick={() => handleOpt(idx)}
                >
                  {opt.text}
                </button>
              ))}
            </div>
            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <IconUsers />
              <span style={{ fontSize: 12, color: "rgba(245,240,232,.35)" }}>
                24 players answered · 3 got it right so far
              </span>
            </div>
          </div>
        </div>

        {/* ── Leaderboard ──────────────────────────────────── */}
        <div id="leaderboard" className="qr-section-label">
          <IconTrophy /> Live leaderboard
        </div>
        <div className="qr-lb">
          <div className="qr-lb-hdr">
            <IconTrophy /> This session — top players
          </div>
          {LEADERS.map((p) => (
            <div key={p.rank} className="qr-lb-row">
              <span className={`qr-lb-rank ${p.tier}`}>{p.rank}</span>
              <div
                className="qr-lb-av"
                style={{ background: p.bg, color: p.color }}
              >
                {p.initials}
              </div>
              <span className="qr-lb-name">{p.name}</span>
              <div className="qr-lb-bar-wrap">
                <div className="qr-lb-bar" style={{ width: `${p.pct}%` }} />
              </div>
              <span className="qr-lb-score">{p.score}</span>
            </div>
          ))}
        </div>

        {/* ── CTA ──────────────────────────────────────────── */}
        <section className="qr-cta-section">
          <h2>
            Ready to prove <em>yourself</em>?
          </h2>
          <p>
            Join thousands of players competing right now — no download needed.
          </p>
          <Link
            href="/signup"
            className="qr-btn-primary"
            style={{ fontSize: 15, padding: "15px 38px" }}
          >
            <IconGamepad /> Start playing free
          </Link>
        </section>

        {/* ── Footer ───────────────────────────────────────── */}
        <footer className="qr-footer">
          <span className="text-gray-500">© 2026 QuizRush</span>
          <p className="text-[12px] text-stone-400">
            Built with ❤️ by  {" "}
            <a
              href="https://github.com/shreya-pandey03"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-300  hover:text-orange-800 font-semibold transition-colors"
            >
              Shreya
            </a>
          </p>
          <div className="qr-footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </footer>
      </div>
    </>
  );
}
