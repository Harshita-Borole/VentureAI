import { useState, useEffect, useRef } from "react";

const API = "http://127.0.0.1:5000";

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

    :root {
      --cream:    #FAF6EF;
      --cream2:   #F0E7D8;
      --warm:     #E2D3BC;
      --espresso: #1C140E;
      --walnut:   #6E4423;
      --latte:    #4A3728;
      --sand:     #93805F;
      --muted:    #3D2E20;
      --white:    #FFFFFF;
      --green:    #2D5C45;
      --green-soft: #E7F2EC;
      --red:      #7A2A2A;
      --red-soft: #FBEFEE;
      --gold:     #B0793A;
      --border:   rgba(40,28,16,0.12);
      --border-soft: rgba(40,28,16,0.07);
      --shadow:   0 4px 28px rgba(40,28,16,0.07);
      --shadow-lg:0 18px 56px rgba(40,28,16,0.13);
      --shadow-sm:0 1px 3px rgba(40,28,16,0.06);
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { font-size: 16px; scroll-behavior: smooth; }
    body {
      font-family: 'DM Sans', sans-serif;
      background: var(--cream);
      color: var(--espresso);
      line-height: 1.7;
      -webkit-font-smoothing: antialiased;
    }

    *:focus-visible {
      outline: 2px solid var(--walnut);
      outline-offset: 2px;
      border-radius: 4px;
    }

    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: var(--cream); }
    ::-webkit-scrollbar-thumb { background: var(--warm); border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--sand); }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(22px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes breathe {
      0%,100% { transform: scale(1); opacity: 1; }
      50%      { transform: scale(0.55); opacity: 0.35; }
    }
    @keyframes barFill { from { width: 0; } to { width: var(--w); } }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(16px); }
      to   { opacity: 1; transform: translateX(0); }
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }

    .fade-up { animation: fadeUp 0.6s cubic-bezier(.22,.9,.3,1) both; }
    .fade-in  { animation: fadeIn 0.5s ease both; }
    .d1 { animation-delay: 0.08s; }
    .d2 { animation-delay: 0.16s; }
    .d3 { animation-delay: 0.26s; }
    .d4 { animation-delay: 0.36s; }

    /* NAV — three-column grid so the brand sits dead-center */
    .nav {
      position: sticky; top: 0; z-index: 999;
      height: 76px;
      background: rgba(250,246,239,0.9);
      backdrop-filter: blur(18px) saturate(140%);
      border-bottom: 1px solid var(--border-soft);
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      padding: 0 40px;
      gap: 16px;
    }
    .nav-side { display: flex; align-items: center; }
    .nav-side.left { justify-content: flex-start; }
    .nav-side.right { justify-content: flex-end; }
    .nav-brand {
      font-family: 'Cormorant Garamond', serif;
      font-size: 30px; font-weight: 700;
      color: var(--espresso); letter-spacing: -0.01em;
      display: flex; align-items: center; gap: 12px;
      justify-content: center;
      white-space: nowrap;
    }
    .nav-dot {
      width: 10px; height: 10px; border-radius: 50%;
      background: var(--walnut);
      animation: breathe 2.6s ease-in-out infinite;
    }
    .nav-tag {
      font-family: 'DM Mono', monospace;
      font-size: 11px; font-weight: 500;
      letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--sand); padding: 8px 18px;
      border: 1px solid var(--warm); border-radius: 999px;
      background: var(--white);
      white-space: nowrap;
    }
    .nav-back-btn {
      display: flex; align-items: center; gap: 8px;
      font-size: 14px; font-weight: 700;
      color: var(--walnut); background: var(--white);
      border: 1.5px solid var(--warm);
      border-radius: 10px; padding: 10px 20px;
      cursor: pointer; transition: all 0.2s ease;
      font-family: 'DM Sans', sans-serif;
      white-space: nowrap;
    }
    .nav-back-btn:hover {
      background: var(--espresso); color: var(--cream);
      border-color: var(--espresso);
      transform: translateY(-1px);
    }

    /* HERO */
    .hero {
      padding: 96px 40px 84px;
      text-align: center;
      background:
        radial-gradient(900px 420px at 50% -10%, rgba(176,121,58,0.10), transparent 60%),
        var(--white);
      border-bottom: 1px solid var(--border-soft);
    }
    .hero-chip {
      display: inline-flex; align-items: center; gap: 10px;
      background: var(--cream); border: 1px solid var(--warm);
      border-radius: 999px; padding: 9px 20px;
      font-family: 'DM Mono', monospace;
      font-size: 11.5px; font-weight: 500;
      letter-spacing: 0.12em; text-transform: uppercase;
      color: var(--walnut); margin-bottom: 38px;
    }
    .chip-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--walnut);
      animation: breathe 2.6s ease-in-out infinite;
    }
    .hero-h1 {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(48px, 6.6vw, 92px);
      font-weight: 700; line-height: 1.08;
      letter-spacing: -0.03em; color: var(--espresso);
      margin-bottom: 28px;
    }
    .hero-h1 em {
      font-style: italic; font-weight: 500;
      color: var(--walnut);
      background: linear-gradient(180deg, transparent 62%, var(--cream2) 62%);
    }
    .hero-p {
      font-size: 19px; font-weight: 400;
      color: var(--muted); line-height: 1.9;
      max-width: 620px;
      margin: 0 auto;
      opacity: 0.92;
    }

    /* FEATURE GRID */
    .feat-grid {
      display: grid; grid-template-columns: repeat(5, 1fr);
      border-bottom: 1px solid var(--border-soft);
      background: var(--border-soft); gap: 1px;
    }
    .feat-cell {
      background: var(--cream); padding: 34px 26px;
      transition: background 0.25s ease, transform 0.25s ease;
      text-align: center;
    }
    .feat-cell:hover { background: var(--white); transform: translateY(-3px); }
    .feat-icon  { font-size: 26px; margin-bottom: 14px; display: block; opacity: 0.92; }
    .feat-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 19px; font-weight: 700; color: var(--espresso); margin-bottom: 8px;
      letter-spacing: -0.01em;
    }
    .feat-desc  { font-size: 14px; color: var(--sand); line-height: 1.7; }

    /* INPUT */
    .input-section { padding: 80px 40px 80px; background: var(--white); }
    .input-inner { max-width: 880px; margin: 0 auto; }
    .input-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 44px; font-weight: 700;
      color: var(--espresso); letter-spacing: -0.02em; margin-bottom: 12px;
      text-align: center;
    }
    .input-sub {
      font-size: 17px; color: var(--sand);
      margin-bottom: 28px; font-weight: 400; line-height: 1.8;
      text-align: center;
    }
    .idea-textarea {
      width: 100%; min-height: 200px;
      background: var(--cream); border: 1.5px solid var(--warm);
      border-radius: 16px; padding: 26px 30px;
      font-family: 'DM Sans', sans-serif;
      font-size: 17px; font-weight: 400;
      color: var(--espresso); line-height: 1.85;
      resize: vertical; transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
      outline: none;
    }
    .idea-textarea::placeholder { color: #B7A58C; }
    .idea-textarea:focus {
      border-color: var(--walnut);
      box-shadow: 0 0 0 4px rgba(110,68,35,0.08);
      background: var(--white);
    }

    /* BUTTONS */
    .btn-primary {
      height: 58px; padding: 0 44px;
      background: var(--espresso); color: var(--cream);
      font-family: 'DM Sans', sans-serif;
      font-size: 17px; font-weight: 700;
      border: none; border-radius: 13px;
      cursor: pointer; transition: all 0.22s ease;
      box-shadow: 0 6px 24px rgba(28,20,14,0.22);
      display: inline-flex; align-items: center; gap: 10px;
      white-space: nowrap;
      letter-spacing: 0.01em;
    }
    .btn-primary:hover {
      background: var(--walnut);
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(110,68,35,0.30);
    }
    .btn-primary:active { transform: translateY(0); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

    .btn-outline {
      height: 44px; padding: 0 24px;
      background: var(--white); color: var(--espresso);
      font-family: 'DM Sans', sans-serif;
      font-size: 14px; font-weight: 700;
      border: 1.5px solid var(--warm); border-radius: 11px;
      cursor: pointer; transition: all 0.2s ease;
      display: inline-flex; align-items: center; gap: 8px;
    }
    .btn-outline:hover {
      background: var(--espresso); color: var(--cream);
      border-color: var(--espresso);
    }

    /* SPINNER */
    .spinner {
      width: 19px; height: 19px;
      border: 2.5px solid rgba(250,246,239,0.3);
      border-top-color: var(--cream); border-radius: 50%;
      animation: spin 0.75s linear infinite; display: inline-block;
    }

    /* KPI STRIP */
    .kpi-strip {
      display: grid; grid-template-columns: repeat(4, 1fr);
      border-bottom: 1px solid var(--border-soft);
      background: var(--border-soft); gap: 1px;
    }
    .kpi-cell {
      background: var(--white); padding: 36px 40px;
      transition: background 0.2s ease;
      position: relative;
    }
    .kpi-cell:hover { background: var(--cream); }
    .kpi-cell::before {
      content: '';
      position: absolute; left: 0; top: 36px; bottom: 36px;
      width: 3px; border-radius: 2px;
      background: var(--warm);
      transition: background 0.2s ease;
    }
    .kpi-cell:hover::before { background: var(--walnut); }
    .kpi-label {
      font-family: 'DM Mono', monospace;
      font-size: 10.5px; font-weight: 500;
      letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--sand); margin-bottom: 14px; display: block;
      padding-left: 14px;
    }
    .kpi-value {
      font-family: 'Cormorant Garamond', serif;
      font-size: 38px; font-weight: 700;
      color: var(--espresso); line-height: 1;
      display: block; margin-bottom: 8px;
      padding-left: 14px;
    }
    .kpi-sub { font-size: 13.5px; color: var(--sand); padding-left: 14px; line-height: 1.6; }

    /* TAB BAR */
    .tab-bar {
      display: flex; gap: 4px;
      border-bottom: 1px solid var(--border-soft);
      background: rgba(250,246,239,0.92);
      backdrop-filter: blur(14px);
      padding: 10px 40px;
      position: sticky; top: 76px; z-index: 99;
      overflow-x: auto;
      justify-content: center;
    }
    .tab-bar::-webkit-scrollbar { display: none; }
    .tab-btn {
      padding: 11px 22px;
      font-size: 14.5px; font-weight: 600;
      color: var(--sand); background: transparent;
      border: none; border-radius: 999px;
      cursor: pointer;
      transition: color 0.2s ease, background 0.2s ease;
      white-space: nowrap;
      font-family: 'DM Sans', sans-serif;
    }
    .tab-btn:hover { color: var(--espresso); background: var(--cream2); }
    .tab-btn.active {
      color: var(--cream);
      background: var(--espresso);
      font-weight: 700;
    }

    /* TAB CONTENT */
    .tab-content { padding: 52px 40px 72px; background: var(--cream); min-height: 60vh; }
    .tab-content-inner { max-width: 1200px; margin: 0 auto; }

    /* CARDS */
    .card {
      background: var(--white); border: 1px solid var(--border-soft);
      border-radius: 16px; padding: 28px 30px;
      transition: box-shadow 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
      height: 100%;
      box-shadow: var(--shadow-sm);
    }
    .card:hover {
      box-shadow: var(--shadow-lg); border-color: var(--warm);
      transform: translateY(-3px);
    }
    .card-eye {
      font-family: 'DM Mono', monospace;
      font-size: 10.5px; font-weight: 500;
      letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--gold); margin-bottom: 18px; display: block;
    }

    /* SCORE CARDS — radial gauge */
    .score-card {
      background: var(--white); border: 1px solid var(--border-soft);
      border-radius: 16px; padding: 26px 26px; transition: all 0.25s ease;
      box-shadow: var(--shadow-sm);
      display: flex; align-items: center; gap: 20px;
    }
    .score-card:hover { box-shadow: var(--shadow-lg); border-color: var(--warm); transform: translateY(-3px); }
    .sc-ring {
      --pct: 0%;
      width: 76px; height: 76px; flex-shrink: 0;
      border-radius: 50%;
      background: conic-gradient(var(--walnut) var(--pct), var(--cream2) var(--pct));
      display: flex; align-items: center; justify-content: center;
    }
    .sc-ring-inner {
      width: 58px; height: 58px; border-radius: 50%;
      background: var(--white);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Cormorant Garamond', serif;
      font-size: 22px; font-weight: 700; color: var(--espresso);
    }
    .sc-body { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
    .sc-label {
      font-family: 'DM Mono', monospace;
      font-size: 10.5px; font-weight: 500;
      letter-spacing: 0.12em; text-transform: uppercase;
      color: var(--sand);
    }
    .sc-out-of { font-size: 13px; color: var(--sand); }

    /* LIST */
    .li-item {
      display: flex; gap: 13px; align-items: flex-start;
      padding: 13px 0; border-bottom: 1px solid var(--cream2);
      font-size: 16px; color: var(--muted); line-height: 1.8;
    }
    .li-item:last-child { border-bottom: none; }
    .li-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--gold); margin-top: 10px; flex-shrink: 0;
    }

    /* VISION */
    .vision {
      background: var(--white);
      border: 1px solid var(--border-soft);
      border-left: 4px solid var(--gold);
      border-radius: 16px; padding: 36px 40px;
      font-family: 'Cormorant Garamond', serif;
      font-size: 23px; font-style: italic; font-weight: 500;
      color: var(--espresso); line-height: 1.9; margin-bottom: 32px;
      box-shadow: var(--shadow-sm);
    }

    /* REASONING */
    .reasoning {
      background: var(--white); border: 1px solid var(--border-soft);
      border-left: 4px solid var(--walnut);
      border-radius: 14px; padding: 24px 28px;
      font-size: 16px; color: var(--muted); line-height: 1.85; margin-top: 18px;
      box-shadow: var(--shadow-sm);
    }

    .divider { height: 1px; background: var(--border); margin: 44px 0; }

    .sec-eye {
      font-family: 'DM Mono', monospace;
      font-size: 11px; font-weight: 500;
      letter-spacing: 0.16em; text-transform: uppercase;
      color: var(--sand); display: block; margin-bottom: 24px;
      padding-bottom: 16px; border-bottom: 1px solid var(--border-soft);
      text-align: center;
    }

    /* GRIDS */
    .grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
    .grid-2 { display: grid; grid-template-columns: repeat(2,1fr); gap: 18px; }
    .grid-1-2 { display: grid; grid-template-columns: 3fr 2fr; gap: 18px; align-items: start; }

    /* COMPETITOR */
    .comp-card {
      background: var(--white); border: 1px solid var(--border-soft);
      border-radius: 16px; padding: 24px 26px; transition: all 0.25s ease;
      box-shadow: var(--shadow-sm);
    }
    .comp-card:hover { box-shadow: var(--shadow-lg); border-color: var(--warm); transform: translateY(-2px); }
    .comp-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; gap: 12px; }
    .comp-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 21px; font-weight: 700; color: var(--espresso);
    }

    /* FEATURE COMPARISON TABLE */
    .ftable-wrap {
      overflow-x: auto;
      border: 1px solid var(--border-soft);
      border-radius: 16px;
      background: var(--white);
      box-shadow: var(--shadow-sm);
    }
    .ftable {
      width: 100%;
      border-collapse: collapse;
      font-size: 15px;
      min-width: 600px;
    }
    .ftable th, .ftable td {
      padding: 16px 20px;
      text-align: left;
      border-bottom: 1px solid var(--cream2);
      white-space: nowrap;
    }
    .ftable th {
      font-family: 'DM Mono', monospace;
      font-size: 10.5px; font-weight: 500;
      letter-spacing: 0.1em; text-transform: uppercase;
      color: var(--sand);
      background: var(--cream);
      position: sticky; top: 0;
    }
    .ftable tr:last-child td { border-bottom: none; }
    .ftable tr:hover td { background: var(--cream); }
    .ftable td:first-child, .ftable th:first-child {
      font-weight: 700; color: var(--espresso);
      position: sticky; left: 0; background: var(--white);
      white-space: normal; min-width: 180px;
    }
    .ftable tr:hover td:first-child { background: var(--cream); }
    .ftable th:first-child { background: var(--cream); }
    .ftable .ftable-you {
      background: var(--green-soft);
    }
    .ftable tr:hover .ftable-you { background: #DCEFE5; }
    .ftable-you-cell {
      font-weight: 700; color: var(--green);
    }
    .ftable-val-yes { color: var(--green); font-weight: 600; }
    .ftable-val-no  { color: var(--sand); }
    @media (max-width: 900px) {
      .ftable { font-size: 13px; }
      .ftable th, .ftable td { padding: 12px 14px; }
    }

    /* SWOT */
    .swot-grid {
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px;
    }
    .swot-card {
      border-radius: 16px; padding: 28px 30px;
      border: 1px solid var(--border-soft); transition: all 0.25s ease;
      box-shadow: var(--shadow-sm);
    }
    .swot-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-3px); }
    .swot-strengths     { background: var(--green-soft); border-color: #BEE0CE; }
    .swot-weaknesses    { background: var(--red-soft);   border-color: #F0CCC8; }
    .swot-opportunities { background: #EDF2FB;           border-color: #C7D7F2; }
    .swot-threats       { background: #FBF3E4;           border-color: #EFD9AE; }
    .swot-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 22px; font-weight: 700; margin-bottom: 16px;
      letter-spacing: -0.01em;
    }
    @media (max-width: 900px) {
      .swot-grid { grid-template-columns: 1fr; }
    }
    .comp-badge {
      font-family: 'DM Mono', monospace;
      font-size: 9.5px; font-weight: 600;
      letter-spacing: 0.1em; text-transform: uppercase;
      padding: 6px 14px; border-radius: 999px;
      background: var(--cream); border: 1px solid var(--warm); color: var(--walnut);
      flex-shrink: 0;
    }
    .comp-desc { font-size: 15px; color: var(--sand); line-height: 1.8; }

    /* FINANCE */
    .fin-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 17px 0; border-bottom: 1px solid var(--cream2);
    }
    .fin-row:last-child { border-bottom: none; }
    .fin-label { font-size: 16px; color: var(--muted); font-weight: 500; }
    .fin-val {
      font-family: 'Cormorant Garamond', serif;
      font-size: 22px; color: var(--espresso); font-weight: 700;
    }

    /* ROI */
    .roi-card {
      background: var(--white); border: 1px solid var(--border-soft);
      border-radius: 16px; padding: 44px 24px;
      text-align: center; display: flex; flex-direction: column;
      align-items: center; justify-content: center; gap: 8px;
      box-shadow: var(--shadow-sm);
      background-image: radial-gradient(420px 220px at 50% 0%, var(--cream2), transparent 70%);
    }
    .roi-label {
      font-family: 'DM Mono', monospace;
      font-size: 10.5px; font-weight: 500;
      letter-spacing: 0.14em; text-transform: uppercase; color: var(--sand);
    }
    .roi-number {
      font-family: 'Cormorant Garamond', serif;
      font-size: 76px; font-weight: 700; line-height: 1; letter-spacing: -0.02em;
    }
    .roi-sub { font-size: 14px; color: var(--sand); }

    /* DEV BOX */
    .dev-box {
      background: var(--white); border: 1px solid var(--border-soft);
      border-radius: 12px; padding: 18px 22px; margin-bottom: 10px;
      transition: border-color 0.2s ease;
      box-shadow: var(--shadow-sm);
    }
    .dev-box:hover { border-color: var(--walnut); }
    .dev-label {
      font-family: 'DM Mono', monospace;
      font-size: 10px; font-weight: 500;
      letter-spacing: 0.12em; text-transform: uppercase;
      color: var(--sand); display: block; margin-bottom: 6px;
    }
    .dev-val { font-size: 16px; font-weight: 700; color: var(--espresso); line-height: 1.6; }

    /* PITCH */
    .pitch-slide {
      background: var(--white); border: 1px solid var(--border-soft);
      border-radius: 16px; padding: 32px 36px; margin-bottom: 14px;
      position: relative; overflow: hidden; transition: all 0.25s ease;
      box-shadow: var(--shadow-sm);
    }
    .pitch-slide::before {
      content: ''; position: absolute;
      top: 0; left: 0; bottom: 0; width: 4px;
      background: var(--gold);
      opacity: 0; transition: opacity 0.25s ease;
    }
    .pitch-slide:hover::before { opacity: 1; }
    .pitch-slide:hover { box-shadow: var(--shadow-lg); }
    .slide-num {
      font-family: 'DM Mono', monospace;
      font-size: 11px; font-weight: 500;
      letter-spacing: 0.16em; text-transform: uppercase;
      color: var(--sand); display: block; margin-bottom: 10px;
      text-align: center;
    }
    .slide-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 26px; font-weight: 700; color: var(--espresso); margin-bottom: 20px;
      letter-spacing: -0.01em;
      text-align: center;
    }

    /* SOURCE */
    .source-card {
      background: var(--white); border: 1px solid var(--border-soft);
      border-radius: 13px; padding: 18px 22px;
      display: flex; align-items: center; justify-content: space-between;
      gap: 18px; transition: all 0.2s ease; margin-bottom: 9px;
      box-shadow: var(--shadow-sm);
    }
    .source-card:hover { box-shadow: var(--shadow); border-color: var(--warm); }
    .source-domain { font-size: 16px; font-weight: 700; color: var(--espresso); }
    .source-url {
      font-family: 'DM Mono', monospace;
      font-size: 11.5px; color: var(--sand);
      margin-top: 4px; overflow: hidden;
      text-overflow: ellipsis; white-space: nowrap;
    }
    .source-link {
      flex-shrink: 0; padding: 9px 18px;
      background: var(--cream); border: 1px solid var(--warm);
      border-radius: 9px; font-size: 13px; font-weight: 700;
      color: var(--walnut); text-decoration: none;
      transition: all 0.2s ease; white-space: nowrap;
      font-family: 'DM Sans', sans-serif;
    }
    .source-link:hover {
      background: var(--espresso); color: var(--cream);
      border-color: var(--espresso);
    }

    /* TAM SAM SOM */
    .tss-wrap {
      display: flex; align-items: center; justify-content: center;
      padding: 36px 0 56px;
      position: relative;
    }
    .tss-circle {
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      flex-direction: column; text-align: center;
      border: 1.5px dashed var(--warm);
      transition: all 0.3s ease;
    }
    .tss-circle:hover { border-color: var(--walnut); }
    .tss-tam {
      width: 400px; height: 400px;
      background: var(--cream);
    }
    .tss-sam {
      width: 264px; height: 264px;
      background: var(--white);
      border-style: dashed;
    }
    .tss-som {
      width: 142px; height: 142px;
      background: var(--espresso);
      border: none;
      box-shadow: var(--shadow-lg);
    }
    .tss-som .tss-label { color: rgba(250,246,239,0.6); }
    .tss-som .tss-value { color: var(--cream); }
    .tss-label {
      font-family: 'DM Mono', monospace;
      font-size: 10.5px; font-weight: 500;
      letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--sand); margin-bottom: 6px;
    }
    .tss-value {
      font-family: 'Cormorant Garamond', serif;
      font-size: 30px; font-weight: 700; color: var(--espresso);
    }
    .tss-tam .tss-value { font-size: 38px; }
    .tss-som .tss-value { font-size: 24px; }
    @media (max-width: 900px) {
      .tss-tam { width: 270px; height: 270px; }
      .tss-sam { width: 180px; height: 180px; }
      .tss-som { width: 104px; height: 104px; }
      .tss-tam .tss-value { font-size: 24px; }
      .tss-value { font-size: 18px; }
      .tss-som .tss-value { font-size: 15px; }
    }

    /* BRAND */
    .brand-block {
      background: var(--white); border: 1px solid var(--border-soft);
      border-left: 4px solid var(--gold);
      border-radius: 14px; padding: 28px 32px;
      font-size: 16px; color: var(--muted); line-height: 1.9; margin-top: 18px;
      box-shadow: var(--shadow-sm);
    }

    /* CHAT */
    .chat-msg {
      display: flex; gap: 13px; margin-bottom: 18px;
      animation: slideInRight 0.3s ease both;
    }
    .chat-msg.user { flex-direction: row-reverse; }
    .chat-avatar {
      width: 38px; height: 38px; border-radius: 11px;
      background: var(--white); border: 1px solid var(--border-soft);
      display: flex; align-items: center; justify-content: center;
      font-size: 17px; flex-shrink: 0;
      box-shadow: var(--shadow-sm);
    }
    .chat-msg.user .chat-avatar { background: var(--espresso); border-color: var(--espresso); }
    .chat-bubble {
      max-width: 78%; padding: 16px 20px;
      background: var(--white); border: 1px solid var(--border-soft);
      border-radius: 15px; font-size: 16px;
      color: var(--muted); line-height: 1.8;
    }
    .chat-msg.user .chat-bubble {
      background: var(--espresso); color: var(--cream); border-color: var(--espresso);
    }
    .chat-input-row { display: flex; gap: 12px; margin-top: 22px; }
    .chat-input {
      flex: 1; padding: 17px 20px;
      background: var(--white); border: 1.5px solid var(--warm);
      border-radius: 13px; font-family: 'DM Sans', sans-serif;
      font-size: 16px; color: var(--espresso); outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .chat-input:focus {
      border-color: var(--walnut);
      box-shadow: 0 0 0 4px rgba(110,68,35,0.08);
    }
    .chat-input::placeholder { color: #B7A58C; }

    /* ALERTS */
    .alert { padding: 17px 22px; border-radius: 13px; font-size: 16px; font-weight: 500; border: 1px solid; margin: 16px 0; text-align: center; }
    .alert-error   { background: var(--red-soft); border-color: #F0CCC8; color: var(--red); }
    .alert-success { background: var(--green-soft); border-color: #BEE0CE; color: var(--green); }
    .alert-warn    { background: #FBF3E4; border-color: #EFD9AE; color: #7A551E; }

    .footer {
      text-align: center; padding: 44px;
      font-size: 13.5px; color: var(--sand);
      border-top: 1px solid var(--border-soft);
      background: var(--cream);
      font-family: 'DM Mono', monospace;
      letter-spacing: 0.04em;
    }

    /* RESULTS HEADER */
    .results-header {
      background: var(--white);
      padding: 48px 40px 40px;
      border-bottom: 1px solid var(--border-soft);
      text-align: center;
    }
    .results-eyebrow {
      font-family: 'DM Mono', monospace;
      font-size: 10.5px; font-weight: 500;
      letter-spacing: 0.16em; text-transform: uppercase;
      color: var(--sand); display: block; margin-bottom: 12px;
    }
    .results-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 48px; font-weight: 700;
      color: var(--espresso); letter-spacing: -0.02em;
      line-height: 1.1; margin-bottom: 10px;
    }
    .results-sub {
      font-size: 17px; color: var(--sand);
      font-weight: 400; line-height: 1.8;
      max-width: 560px; margin: 0 auto;
    }

    @media (max-width: 900px) {
      .nav { padding-left: 16px; padding-right: 16px; grid-template-columns: auto 1fr auto; }
      .nav-brand { font-size: 22px; }
      .nav-tag { display: none; }
      .hero, .input-section, .tab-content, .tab-bar { padding-left: 20px; padding-right: 20px; }
      .hero-h1 { font-size: 42px; }
      .feat-grid { grid-template-columns: repeat(2,1fr); }
      .kpi-strip, .grid-4, .grid-3, .grid-2, .grid-1-2 { grid-template-columns: 1fr; }
      .score-card { flex-direction: column; align-items: flex-start; }
    }
  `}</style>
);

const fmt = (v) => { try { return `$${parseInt(v).toLocaleString()}`; } catch { return String(v); } };
const esc = (x) => (x == null ? "" : String(x));
const fmtBig = (v) => {
  const n = Number(v) || 0;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n}`;
};

const ftableValClass = (val) => {
  const v = String(val || "").toLowerCase();
  if (v.startsWith("yes")) return "ftable-val-yes";
  if (v.startsWith("no")) return "ftable-val-no";
  return "";
};

const formatValue = (x) => {
  if (x == null) return "";

  if (typeof x === "string") {
    const trimmed = x.trim();
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      try {
        return formatValue(JSON.parse(trimmed));
      } catch {}
    }
    return x;
  }

  if (typeof x === "object") {
    return Object.entries(x)
      .map(([k, v]) => `${String(k).replace(/_/g, " ")}: ${v}`)
      .join("  •  ");
  }

  return String(x);
};

const normalizeList = (items) => {
  if (!Array.isArray(items)) return [];

  return items.map((item) => {
    if (item === null || item === undefined) return "";

    if (typeof item === "string" || typeof item === "number") {
      return String(item);
    }

    // Convert objects safely instead of [object Object]
    if (typeof item === "object") {
      return (
        item.name ||
        item.title ||
        item.value ||
        item.text ||
        JSON.stringify(item)
      );
    }

    return String(item);
  });
};

const ListItems = ({ items }) => {
  if (!items || items.length === 0)
    return <p style={{ fontSize: 15, color: "#B7A58C", padding: "8px 0" }}>No data available.</p>;
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} className="li-item">
          <div className="li-dot" />
          <div>{formatValue(item)}</div>
        </div>
      ))}
    </div>
  );
};

const ListCard = ({ label, items }) => (
  <div className="card">
    <span className="card-eye">{label}</span>
    <ListItems items={items} />
  </div>
);

const ScoreCard = ({ label, value }) => {
  const pct = isNaN(parseFloat(value)) ? 0 : Math.max(0, Math.min(100, parseFloat(value) * 10));
  const display = isNaN(parseFloat(value)) ? "—" : value;
  return (
    <div className="score-card">
      <div className="sc-ring" style={{ "--pct": `${pct}%` }}>
        <div className="sc-ring-inner">{display}</div>
      </div>
      <div className="sc-body">
        <span className="sc-label">{label}</span>
        <span className="sc-out-of">out of 10</span>
      </div>
    </div>
  );
};

const TABS = ["Overview","Research","Finance","Development","Marketing","SWOT","Market Size","Pitch Deck","Sources","AI Chat"];

/* ── HOME PAGE ─────────────────────────────── */
const HomePage = ({ onAnalyze }) => {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!idea.trim()) { setError("Please describe your startup idea first."); return; }
    setError(""); setLoading(true);
    try {
      const resp = await fetch(`${API}/generate-startup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea })
      });
      const data = await resp.json();
      console.log("FULL RESPONSE:", data);
      if (data.success) { onAnalyze(data); }
      else { setError(data.error || "Unknown error from backend."); }
    } catch (e) { setError(`Backend connection error: ${e.message}`); }
    finally { setLoading(false); }
  };

  return (
    <>
      <nav className="nav">
        <div className="nav-side left"></div>
        <div className="nav-brand"><div className="nav-dot" />VentureAI</div>
        <div className="nav-side right">
          <div className="nav-tag">Startup Intelligence Platform</div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-chip fade-up"><div className="chip-dot" />AI-Powered Startup Analysis</div>
        <h1 className="hero-h1 fade-up d1">
          From idea to a<br />
          <em>full startup blueprint</em><br />
          in 60 seconds.
        </h1>
        <p className="hero-p fade-up d2">
          Describe any idea. VentureAI delivers deep market research, financial projections,
          a technical roadmap, and an investor-ready pitch deck — automatically.
        </p>
      </section>

      <div className="feat-grid fade-in d3">
        {[
          ["🔍","Market Research","Competitors, gaps, trends & live opportunities."],
          ["💰","Financial Model","MVP cost, burn rate, revenue & ROI projections."],
          ["💻","Tech Architecture","Full stack, AI integrations & MVP roadmap."],
          ["📢","GTM Strategy","Audience targeting, channels & brand positioning."],
          ["🎤","Pitch Deck","Investor-ready slides generated automatically."],
        ].map(([icon,title,desc]) => (
          <div key={title} className="feat-cell">
            <span className="feat-icon">{icon}</span>
            <div className="feat-title">{title}</div>
            <div className="feat-desc">{desc}</div>
          </div>
        ))}
      </div>

      <section className="input-section fade-up d3">
        <div className="input-inner">
          <div className="input-title">Describe your startup idea</div>
          <div className="input-sub">Be specific — the more detail you provide, the sharper the analysis.</div>
          <textarea
            className="idea-textarea"
            placeholder="e.g. An AI-powered nutrition assistant that creates personalized meal plans using wearable data and blood biomarkers, targeting athletes and fitness enthusiasts..."
            value={idea}
            onChange={e => setIdea(e.target.value)}
            onKeyDown={e => { if (e.key==="Enter" && (e.metaKey||e.ctrlKey)) handleAnalyze(); }}
            rows={8}
          />
          {error && <div className="alert alert-error" style={{ marginTop:16 }}>{error}</div>}
          <div style={{ display:"flex", alignItems:"center", justifyContent: "center", gap:24, marginTop:26, flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={handleAnalyze} disabled={loading}>
              {loading ? <><span className="spinner" />Analyzing...</> : "🚀  Analyze My Idea"}
            </button>
            <span style={{ fontSize:15, color:"var(--sand)", fontWeight:400 }}>
              Takes <strong style={{ color:"var(--espresso)", fontWeight:700 }}>~60 seconds</strong>
              &nbsp;·&nbsp; Press ⌘+Enter
            </span>
          </div>
        </div>
      </section>

      <footer className="footer">
        VentureAI &nbsp;·&nbsp; Powered by LangGraph + Gemini AI &nbsp;·&nbsp; Multi-Agent Startup Intelligence
      </footer>
    </>
  );
};

/* ── RESULTS PAGE ──────────────────────────── */
const ResultsPage = ({ data, onBack }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput]   = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  const report = data.report || {};
  const finance    = data.finance    || {};
  const research   = data.research   || {};
  const developer  = data.developer  || {};
  const marketing  = data.marketing  || {};
  const pitch_deck = data.pitch_deck || report.pitch_deck || {};
  const swot = data.swot || {};
  const tamSamSom = data.tam_sam_som || {};
  const viability  = report.viability_score || {};

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [chatMessages]);

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const q = chatInput.trim();

    setChatInput("");
    setChatMessages((prev) => [
      ...prev,
      { role: "user", text: q }
    ]);

    setChatLoading(true);

    try {
      const resp = await fetch(`${API}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: q,
        }),
      });

      const cd = await resp.json();

      const ans = String(cd.answer || cd.error || "No response");

      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: ans,
        },
      ]);
    } catch (e) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `Connection error: ${e.message}`,
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };
        

  const sources = (research.sources||[]).reduce((acc,s) => {
    const url = typeof s==="object" ? s.url||"" : String(s);
    if (url.startsWith("http") && !acc.includes(url)) acc.push(url);
    return acc;
  },[]);

  const renderTab = () => {
    switch(activeTab) {
      case 0: return (
        <div className="fade-up">
          <span className="sec-eye">Viability Assessment</span>
          <div className="grid-4" style={{ marginBottom:24 }}>
            <ScoreCard label="Overall Score"    value={viability.overall_score      ?? "N/A"} />
            <ScoreCard label="Market Potential" value={viability.market_potential   ?? "N/A"} />
            <ScoreCard label="Scalability"      value={viability.scalability_score  ?? "N/A"} />
            <ScoreCard label="AI Innovation"    value={viability.ai_innovation_score ?? "N/A"} />
          </div>
          {viability.reasoning && <div className="reasoning">{viability.reasoning}</div>}
          <div className="divider" />
          {report.startup_vision && <div className="vision">{report.startup_vision}</div>}
          <div className="grid-3">
            <ListCard label="Product Strategy"  items={normalizeList(report.product_strategy)} />
            <ListCard label="Technical Roadmap" items={normalizeList(report.technical_roadmap)} />
            <ListCard label="Financial Plan"    items={normalizeList(report.financial_plan)} />
          </div>
        </div>
      );

      case 1: return (
        <div className="fade-up">
          {(research.competitors||[]).length>0 && <>
            <span className="sec-eye">Competitors</span>
            <div className="grid-2" style={{ marginBottom:32 }}>
              {(research.competitors||[]).map((c,i) => (
                <div key={i} className="comp-card">
                  <div className="comp-header">
                    <div className="comp-name">{esc(c.name||"Unknown")}</div>
                    <div className="comp-badge">{esc((c.type||"startup")[0].toUpperCase()+(c.type||"startup").slice(1))}</div>
                  </div>
                  <div className="comp-desc">{esc(c.description||"")}</div>
                </div>
              ))}
            </div>
            <div className="divider" />
          </>}
          <div className="grid-3">
            <ListCard label="Market Trends" items={normalizeList(research.market_trends)} />
            <ListCard label="Market Gaps"   items={normalizeList(research.market_gaps)} />
            <ListCard label="Opportunities" items={normalizeList(research.opportunities)} />
          </div>

          {(() => {
            const fc = research.feature_comparison || {};
            const features = fc.features || [];
            const you = fc.your_startup || {};
            const comps = fc.competitors || [];

            if (!features.length) return null;

            return (
              <>
                <div className="divider" />
                <span className="sec-eye">Feature Comparison</span>
                <div className="ftable-wrap">
                  <table className="ftable">
                    <thead>
                      <tr>
                        <th>Feature</th>
                        <th className="ftable-you">{esc(you.name || "Your Startup")}</th>
                        {comps.map((c, i) => (
                          <th key={i}>{esc(c.name || `Competitor ${i+1}`)}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {features.map((feature, i) => {
                        const youVal = (you.features || {})[feature] || "—";
                        return (
                          <tr key={i}>
                            <td>{esc(feature)}</td>
                            <td className={`ftable-you ftable-you-cell ${ftableValClass(youVal)}`}>
                              {esc(youVal)}
                            </td>
                            {comps.map((c, j) => {
                              const val = (c.features || {})[feature] || "—";
                              return (
                                <td key={j} className={ftableValClass(val)}>
                                  {esc(val)}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            );
          })()}
        </div>
      );
      case 2: {
        const fins = [
          ["MVP Cost",               finance.mvp_cost           || 0],
          ["Monthly Team Cost",      finance.monthly_team_cost  || 0],
          ["Cloud & Infrastructure", finance.cloud_cost         || 0],
          ["Marketing Budget",       finance.marketing_budget   || 0],
          ["Revenue Projection",     finance.revenue_projection || 0],
        ];
        let roi=0, roiColor="var(--green)", sign="+";
        try {
          const safeNum = (v) => Number(v || 0) || 0;
          const total = fins.slice(0, -1).reduce((s, [, v]) => s + safeNum(v), 0);
          const rev = safeNum(finance.revenue_projection);
          roi = total>0 ? Math.round((rev-total)/total*1000)/10 : 0;
          roiColor = roi>=0 ? "var(--green)" : "var(--red)"; sign = roi>=0?"+":"";
        } catch {}
        return (
          <div className="fade-up grid-1-2">
            <div className="card">
              <span className="card-eye">Cost Breakdown</span>
              {fins.map(([l,v]) => (
                <div key={l} className="fin-row">
                  <span className="fin-label">{l}</span>
                  <span className="fin-val">{fmt(v)}</span>
                </div>
              ))}
            </div>
            <div className="roi-card">
              <div className="roi-label">Estimated ROI</div>
              <div className="roi-number" style={{ color:roiColor }}>{sign}{roi}%</div>
              <div className="roi-sub">Projected return vs. total investment</div>
            </div>
          </div>
        );
      }

      case 3: {
        const featureAnalysis = developer.feature_analysis || [];
        return (
          <div className="fade-up">
            <div className="grid-2" style={{ marginBottom:20 }}>
              <div>
                {[["Frontend","frontend"],["Backend","backend"],["Database","database"]].map(([l,k]) => (
                  <div key={k} className="dev-box">
                    <span className="dev-label">{l}</span>
                    <div className="dev-val">{esc(developer[k]||"")}</div>
                  </div>
                ))}
              </div>
              <ListCard label="AI Stack" items={developer.ai_stack||[]} />
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
              <span className="card-eye">MVP Features</span>
              <div style={{ columns:2, gap:24 }}>
                <ListItems items={developer.mvp_features||[]} />
              </div>
            </div>

            {featureAnalysis.length > 0 && (
              <>
                <span className="sec-eye">Feature-by-Feature Analysis</span>
                <div className="grid-2">
                  {featureAnalysis.map((f, i) => (
                    <div key={i} className="card">
                      <span className="card-eye">{esc(f.feature || `Feature ${i+1}`)}</span>
                      <div className="li-item"><div className="li-dot" /><div><strong>Complexity:</strong> {esc(f.technical_complexity)}</div></div>
                      <div className="li-item"><div className="li-dot" /><div><strong>Architecture:</strong> {esc(f.architecture_requirements)}</div></div>
                      <div className="li-item"><div className="li-dot" /><div><strong>Scalability:</strong> {esc(f.scalability_considerations)}</div></div>
                      <div className="li-item"><div className="li-dot" /><div><strong>Strategy:</strong> {esc(f.implementation_strategy)}</div></div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        );
      }
      case 4: return (
        <div className="fade-up">
          <div className="grid-2">
            <ListCard label="Target Audience" items={normalizeList(marketing.target_audience)} />
            <ListCard label="Go-to-Market Strategy" items={normalizeList(marketing.go_to_market_strategy)} />
          </div>
          {marketing.branding_strategy && (
            <div className="brand-block">
              <strong style={{ fontFamily:"'DM Mono',monospace", fontSize:10.5, letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--sand)", display:"block", marginBottom:12 }}>
                Branding Strategy
              </strong>
              {marketing.branding_strategy}
            </div>
          )}
        </div>
      );

      case 5: return (
        <div className="fade-up">
          <span className="sec-eye">SWOT Analysis</span>
          {swot.summary && (
            <div className="reasoning" style={{ marginBottom: 24 }}>
              {swot.summary}
            </div>
          )}
          <div className="swot-grid">
            <div className="swot-card swot-strengths">
              <div className="swot-title">💪 Strengths</div>
              <ListItems items={normalizeList(swot.strengths)} />
            </div>
            <div className="swot-card swot-weaknesses">
              <div className="swot-title">⚠️ Weaknesses</div>
              <ListItems items={normalizeList(swot.weaknesses)} />
            </div>
            <div className="swot-card swot-opportunities">
              <div className="swot-title">🚀 Opportunities</div>
              <ListItems items={normalizeList(swot.opportunities)} />
            </div>
            <div className="swot-card swot-threats">
              <div className="swot-title">🔥 Threats</div>
              <ListItems items={normalizeList(swot.threats)} />
            </div>
          </div>
        </div>
      );

      case 6: {
        const tam = tamSamSom.tam || {};
        const sam = tamSamSom.sam || {};
        const som = tamSamSom.som || {};
        const hasData = (tam.value || sam.value || som.value);

        if (!hasData) {
          return <div className="alert alert-warn">Market sizing data not available.</div>;
        }

        return (
          <div className="fade-up">
            <span className="sec-eye">Market Sizing — TAM / SAM / SOM</span>

            <div className="tss-wrap">
              <div className="tss-circle tss-tam">
                <div className="tss-circle tss-sam">
                  <div className="tss-circle tss-som">
                    <span className="tss-label">SOM</span>
                    <span className="tss-value">{fmtBig(som.value)}</span>
                  </div>
                </div>
              </div>
              <div style={{ position: "absolute", top: 30 }}>
                <span className="tss-label">TAM</span>
              </div>
            </div>

            <div className="grid-3" style={{ marginBottom: 24 }}>
              <div className="card">
                <span className="card-eye">TAM — {esc(tam.label || "Total Addressable Market")}</span>
                <div className="fin-val" style={{ fontSize: 28, marginBottom: 12 }}>{fmtBig(tam.value)}</div>
                <p style={{ fontSize: 15, color: "var(--sand)", lineHeight: 1.8 }}>{esc(tam.description)}</p>
              </div>
              <div className="card">
                <span className="card-eye">SAM — {esc(sam.label || "Serviceable Addressable Market")}</span>
                <div className="fin-val" style={{ fontSize: 28, marginBottom: 12 }}>{fmtBig(sam.value)}</div>
                <p style={{ fontSize: 15, color: "var(--sand)", lineHeight: 1.8 }}>{esc(sam.description)}</p>
              </div>
              <div className="card">
                <span className="card-eye">SOM — {esc(som.label || "Serviceable Obtainable Market")}</span>
                <div className="fin-val" style={{ fontSize: 28, marginBottom: 12 }}>{fmtBig(som.value)}</div>
                <p style={{ fontSize: 15, color: "var(--sand)", lineHeight: 1.8 }}>{esc(som.description)}</p>
              </div>
            </div>

            {tamSamSom.methodology && (
              <div className="reasoning" style={{ marginBottom: 20 }}>
                <strong>Methodology: </strong>{esc(tamSamSom.methodology)}
                {tamSamSom.growth_rate && <div style={{ marginTop: 8 }}><strong>Growth Rate: </strong>{esc(tamSamSom.growth_rate)}</div>}
              </div>
            )}

            {tamSamSom.key_assumptions && tamSamSom.key_assumptions.length > 0 && (
              <ListCard label="Key Assumptions" items={normalizeList(tamSamSom.key_assumptions)} />
            )}
          </div>
        );
      }

      case 7: {
        const slides = pitch_deck.slides||[];
        if (!slides.length) return <div className="alert alert-warn">No pitch deck slides were generated.</div>;
        return (
          <div className="fade-up" style={{ maxWidth:860, margin:"0 auto" }}>
            {slides.map((slide,i) => {
              const content = slide.slide_content||[];
              return (
                <div key={i} className="pitch-slide">
                  <span className="slide-num">Slide {String(i+1).padStart(2,"0")}</span>
                  <div className="slide-title">{esc(slide.slide_title||`Slide ${i+1}`)}</div>
                  {Array.isArray(content)
                    ? <ListItems items={content} />
                    : <p style={{ fontSize:16, color:"var(--muted)", lineHeight:1.85, textAlign: "center" }}>{esc(content)}</p>}
                </div>
              );
            })}
          </div>
        );
      }

      case 8: return (
        <div className="fade-up">
          <span className="sec-eye">{sources.length} Research Sources</span>
          {sources.length===0
            ? <div className="alert alert-warn">No verified sources available.</div>
            : sources.map((url,i) => {
                let domain = url;
                try { domain = new URL(url).hostname.replace("www.",""); } catch {}
                return (
                  <div key={i} className="source-card">
                    <div style={{ overflow:"hidden" }}>
                      <div className="source-domain">{domain}</div>
                      <div className="source-url">{url}</div>
                    </div>
                    <a href={url} target="_blank" rel="noreferrer" className="source-link">Open →</a>
                  </div>
                );
              })}
        </div>
      );

      case 9: return (
        <div className="fade-up" style={{ maxWidth:800, margin:"0 auto" }}>
          <div style={{ marginBottom:32, textAlign: "center" }}>
            <span className="sec-eye">AI Advisor</span>
            <p style={{ fontSize:17, color:"var(--sand)", fontWeight:400, lineHeight:1.8 }}>
              Ask follow-up questions about your startup, market, competition, or strategy.
            </p>
          </div>
          {chatMessages.length===0 && (
            <div style={{ textAlign:"center", padding:"48px 0", color:"var(--sand)", fontSize:15 }}>
              Ask anything about your startup…
            </div>
          )}
          {chatMessages.map((msg,i) => (
            <div key={i} className={`chat-msg ${msg.role}`}>
              <div className="chat-avatar">{msg.role==="user"?"👤":"🤖"}</div>
              <div className="chat-bubble">{msg.text}</div>
            </div>
          ))}
          {chatLoading && (
            <div className="chat-msg">
              <div className="chat-avatar">🤖</div>
              <div className="chat-bubble" style={{ color:"var(--sand)", fontStyle:"italic" }}>Thinking…</div>
            </div>
          )}
          <div ref={chatEndRef} />
          <div className="chat-input-row">
            <input
              className="chat-input"
              placeholder="Ask anything about your startup…"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat();} }}
            />
            <button className="btn-primary" onClick={sendChat} disabled={chatLoading} style={{ height:54, padding:"0 30px", fontSize:16 }}>
              {chatLoading ? <span className="spinner" /> : "Send"}
            </button>
          </div>
          {chatMessages.length>0 && (
            <button className="btn-outline" style={{ marginTop:16 }} onClick={()=>setChatMessages([])}>
              Clear conversation
            </button>
          )}
        </div>
      );

      default: return null;
    }
  };

  return (
    <>
      <nav className="nav">
        <div className="nav-side left"></div>
        <div className="nav-brand"><div className="nav-dot" style={{ background:"var(--green)" }} />VentureAI</div>
        <div className="nav-side right">
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10.5, color:"var(--green)", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", padding:"8px 18px", border:"1px solid #BEE0CE", borderRadius:999, background:"var(--green-soft)", marginRight: 12 }}>
            Analysis Complete
          </span>
          <button className="nav-back-btn" onClick={onBack}>← New Analysis</button>
        </div>
      </nav>

      <div className="results-header fade-up">
        <span className="results-eyebrow">Startup Intelligence Report</span>
        <h2 className="results-title">Your results are ready.</h2>
        <p className="results-sub">AI-generated analysis across market, finance, tech, and strategy.</p>
      </div>

      <div className="kpi-strip fade-in d1">
        {[
          ["MVP Cost",           finance.mvp_cost           || 0, "Initial build estimate"],
          ["Monthly Burn",       finance.monthly_team_cost  || 0, "Team operating cost"],
          ["Cloud & Infra",      finance.cloud_cost         || 0, "Infrastructure estimate"],
          ["Revenue Projection", finance.revenue_projection || 0, "Projected first-year revenue"],
        ].map(([l,v,sub]) => (
          <div key={l} className="kpi-cell">
            <span className="kpi-label">{l}</span>
            <span className="kpi-value">{fmt(v)}</span>
            <div className="kpi-sub">{sub}</div>
          </div>
        ))}
      </div>

      <div className="tab-bar">
        {TABS.map((t,i) => (
          <button key={t} className={`tab-btn ${activeTab===i?"active":""}`} onClick={()=>setActiveTab(i)}>
            {t}
          </button>
        ))}
      </div>

      <div className="tab-content" key={activeTab}>
        <div className="tab-content-inner">{renderTab()}</div>
      </div>

      <footer className="footer">
        VentureAI &nbsp;·&nbsp; Powered by LangGraph + Gemini AI &nbsp;·&nbsp; Multi-Agent Startup Intelligence
      </footer>
    </>
  );
};

export default function App() {
  const [results, setResults] = useState(null);
  return (
    <>
      <GlobalStyle />
      {results
        ? <ResultsPage data={results} onBack={() => setResults(null)} />
        : <HomePage onAnalyze={setResults} />
      }
    </>
  );
}