/* ============================================================
   UnitX — App State, Rendering & Events
   ============================================================ */

/* ── State ─────────────────────────────────────────────────── */

const DEFAULT_STATE = {
  screen:      'home',
  prevScreen:  'home',
  category:    null,
  fromUnit:    null,
  toUnit:      null,
  inputValue:  '1',
  favorites:   [],
  history:     [],
  searchQuery: '',
  multiExpand: true,
  voiceActive: false,
};

let S = { ...DEFAULT_STATE };

function setState(patch, skipRender = false) {
  S = { ...S, ...patch };
  persist();
  if (!skipRender) render();
}

/* ── Persistence ────────────────────────────────────────────── */

function persist() {
  try {
    localStorage.setItem('unitx_state', JSON.stringify({
      favorites:  S.favorites,
      history:    S.history.slice(0, 80),
      multiExpand: S.multiExpand,
    }));
  } catch(e) {}
}

function hydrate() {
  try {
    const saved = JSON.parse(localStorage.getItem('unitx_state') || '{}');
    S = { ...S, ...saved };
  } catch(e) {}
}

/* ── Toast ──────────────────────────────────────────────────── */

let toastTimer;
function showToast(msg, emoji = '✓') {
  const el = document.getElementById('toast');
  el.textContent = `${emoji} ${msg}`;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

/* ── Clipboard ──────────────────────────────────────────────── */

function copyText(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => showToast('Copied!', '📋'));
  } else {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Copied!', '📋');
  }
}

/* ── Favorites helpers ──────────────────────────────────────── */

function isFav(catId, fromUnit, toUnit) {
  return S.favorites.some(f => f.catId === catId && f.fromUnit === fromUnit && f.toUnit === toUnit);
}

function toggleFav(catId, fromUnit, toUnit) {
  if (isFav(catId, fromUnit, toUnit)) {
    setState({ favorites: S.favorites.filter(
      f => !(f.catId === catId && f.fromUnit === fromUnit && f.toUnit === toUnit)
    )});
    showToast('Removed from favorites', '💔');
  } else {
    setState({ favorites: [{ catId, fromUnit, toUnit }, ...S.favorites] });
    showToast('Added to favorites!', '⭐');
  }
}

/* ── History helpers ────────────────────────────────────────── */

function addToHistory(catId, fromUnit, toUnit, inputValue, result) {
  const entry = { catId, fromUnit, toUnit, inputValue, result, timestamp: Date.now() };
  const filtered = S.history.filter(h =>
    !(h.catId === catId && h.fromUnit === fromUnit && h.toUnit === toUnit)
  );
  setState({ history: [entry, ...filtered].slice(0, 80) }, true);
}

/* ── Navigation ─────────────────────────────────────────────── */

function navigate(screen, extra = {}) {
  setState({ screen, prevScreen: S.screen, searchQuery: '', ...extra });
  document.getElementById('main-content').scrollTop = 0;
}

function openConverter(catId, fromUnit = null, toUnit = null) {
  const cat = CATEGORIES.find(c => c.id === catId);
  if (!cat) return;
  const from = fromUnit || cat.units[0]?.id;
  const to   = toUnit   || cat.units[1]?.id || cat.units[0]?.id;
  setState({ screen: 'converter', prevScreen: S.screen, category: catId, fromUnit: from, toUnit: to });
}

/* ── Voice Input ────────────────────────────────────────────── */

let recognition = null;
function initVoice() {
  const SRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SRec) return;
  recognition = new SRec();
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.onresult = e => {
    const txt = e.results[0][0].transcript;
    const num = txt.replace(/[^0-9.,\-]/g,'').replace(',','.');
    if (num) {
      setState({ inputValue: num, voiceActive: false });
      const inp = document.getElementById('from-input');
      if (inp) { inp.value = num; inp.dispatchEvent(new Event('input')); }
    } else {
      setState({ voiceActive: false });
    }
  };
  recognition.onerror = () => setState({ voiceActive: false });
  recognition.onend   = () => setState({ voiceActive: false });
}

function toggleVoice() {
  if (!recognition) { showToast('Voice not supported', '😢'); return; }
  if (S.voiceActive) { recognition.stop(); setState({ voiceActive: false }); }
  else               { recognition.start(); setState({ voiceActive: true }); }
}

/* ── Color helpers ──────────────────────────────────────────── */

function catGradient(cat, dir = '135deg') {
  if (!cat) return '';
  return `linear-gradient(${dir}, ${cat.gradient[0]}, ${cat.gradient[1]})`;
}

function catBg(cat) {
  return `background: ${catGradient(cat)}`;
}

/* ── Render ─────────────────────────────────────────────────── */

function render() {
  const app = document.getElementById('app');
  app.className = 'light';

  renderNav();

  const mc = document.getElementById('main-content');
  switch(S.screen) {
    case 'home':       mc.innerHTML = renderHome();       break;
    case 'categories': mc.innerHTML = renderCategories(); break;
    case 'converter':  mc.innerHTML = renderConverter();  break;
    case 'favorites':  mc.innerHTML = renderFavorites();  break;
    case 'history':    mc.innerHTML = renderHistory();    break;
    case 'settings':   mc.innerHTML = renderSettings();   break;
    default:           mc.innerHTML = renderHome();
  }
  attachEvents();
}

/* ── Bottom Nav ─────────────────────────────────────────────── */

function renderNav() {
  const tabs = [
    { id:'home',       icon:'🏠', label:'Home'       },
    { id:'categories', icon:'🔢', label:'Explore'    },
    { id:'favorites',  icon:'⭐', label:'Favorites'  },
    { id:'history',    icon:'🕐', label:'History'    },
    { id:'settings',   icon:'⚙️', label:'Settings'   },
  ];
  document.getElementById('bottom-nav').innerHTML = tabs.map(t => `
    <button class="nav-item ${S.screen === t.id ? 'active' : ''}" data-nav="${t.id}">
      <span class="nav-icon">${t.icon}</span>
      <span>${t.label}</span>
    </button>
  `).join('');
}

/* ── HOME ───────────────────────────────────────────────────── */

function renderHome() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const topCats = ['length','weight','temperature','currency','data','speed'];
  const recentItems = S.history.slice(0, 5).map(h => {
    const cat = CATEGORIES.find(c => c.id === h.catId);
    if (!cat) return '';
    const fu = cat.units.find(u => u.id === h.fromUnit);
    const tu = cat.units.find(u => u.id === h.toUnit);
    const resultF = formatForDisplay(parseFloat(h.result));
    return `
      <div class="recent-item" data-action="open-hist" data-cat="${h.catId}"
           data-from="${h.fromUnit}" data-to="${h.toUnit}" data-val="${h.inputValue}">
        <div class="recent-icon" style="${catBg(cat)}">
          ${cat.icon}
        </div>
        <div class="recent-info">
          <div class="recent-conversion">${h.inputValue} ${fu?.symbol||h.fromUnit} = ${resultF} ${tu?.symbol||h.toUnit}</div>
          <div class="recent-value">${cat.name}</div>
        </div>
        <div class="recent-time">${timeAgo(h.timestamp)}</div>
      </div>`;
  }).join('');

  const currencyPreview = ['EUR','GBP','JPY','INR','CNY'].map(code => {
    const cr = CURRENCY_RATES[code];
    return `
      <div class="currency-chip" data-action="open-currency" data-code="${code}">
        <div class="cc-flag">${cr.flag}</div>
        <div class="cc-code">${code}</div>
        <div class="cc-rate">${cr.rate.toLocaleString('en-US',{maximumFractionDigits:2})}</div>
      </div>`;
  }).join('');

  return `
    <div class="screen">
      <div class="home-greeting">
        <div class="heading-xl gradient-text">UnitX</div>
        <div class="home-subtitle">${greeting} — convert anything, instantly</div>
      </div>

      <div class="search-wrap" style="top:0; padding-top:12px">
        <div class="search-bar">
          <span class="icon">🔍</span>
          <input class="search-input" id="global-search" placeholder="Search units & categories…"
                 value="${S.searchQuery}" autocomplete="off" spellcheck="false"/>
          ${S.searchQuery ? `<button class="search-clear" data-action="clear-search">✕</button>` : ''}
        </div>
      </div>

      ${S.searchQuery ? renderSearchResults(S.searchQuery) : `
        <div class="section-label">Quick Access</div>
        <div class="quick-scroll">
          ${topCats.map(id => {
            const cat = CATEGORIES.find(c => c.id === id);
            return cat ? `
              <div class="quick-card" style="${catBg(cat)}" data-action="open-cat" data-cat="${cat.id}">
                <div class="q-icon">${cat.icon}</div>
                <div class="q-name">${cat.name}</div>
              </div>` : '';
          }).join('')}
        </div>

        ${S.history.length ? `
          <div class="section-label">Recent Conversions</div>
          ${recentItems}
        ` : `
          <div class="section-label">Get Started</div>
          <div style="padding:20px 20px 8px; color:var(--text2); font-size:14px; line-height:1.6">
            Tap any category above or browse all categories in <strong>Explore</strong> to start converting.
          </div>
        `}

        <div class="section-label">Live Currency Rates <span style="font-size:10px;color:var(--text3);text-transform:none;letter-spacing:0">(vs USD)</span></div>
        <div class="currency-strip">${currencyPreview}</div>

        <div class="section-label">All Categories</div>
        <div class="categories-grid" style="padding:0 16px 8px">
          ${CATEGORIES.map(cat => `
            <div class="category-card" style="${catBg(cat)}" data-action="open-cat" data-cat="${cat.id}">
              <div class="cat-glow"></div>
              <span class="cat-icon">${cat.icon}</span>
              <div class="cat-name">${cat.name}</div>
              <div class="cat-desc">${cat.description}</div>
              <div class="cat-count">${cat.units.length} units</div>
            </div>`).join('')}
        </div>
      `}
    </div>`;
}

/* ── SEARCH RESULTS ─────────────────────────────────────────── */

function renderSearchResults(q) {
  const ql = q.toLowerCase();
  const results = [];
  CATEGORIES.forEach(cat => {
    if (cat.name.toLowerCase().includes(ql) || cat.description.toLowerCase().includes(ql)) {
      results.push({ type: 'category', cat });
    }
    cat.units.forEach(u => {
      if (u.name.toLowerCase().includes(ql) || u.symbol.toLowerCase().includes(ql)) {
        results.push({ type: 'unit', cat, unit: u });
      }
    });
  });

  if (!results.length) return `
    <div style="text-align:center;padding:40px 20px;color:var(--text2)">
      <div style="font-size:40px;margin-bottom:12px">🔍</div>
      <div style="font-weight:600">No results for "${q}"</div>
      <div style="font-size:13px;margin-top:6px;color:var(--text3)">Try a different keyword</div>
    </div>`;

  return `
    <div style="padding:8px 16px">
      <div style="font-size:12px;color:var(--text3);margin-bottom:12px">${results.length} result${results.length===1?'':'s'}</div>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${results.slice(0, 30).map(r => {
          if (r.type === 'category') return `
            <div class="hist-item" data-action="open-cat" data-cat="${r.cat.id}">
              <div class="hist-icon" style="${catBg(r.cat)}">${r.cat.icon}</div>
              <div class="hist-info">
                <div class="hist-expr">${r.cat.name}</div>
                <div class="hist-cat">${r.cat.description} · ${r.cat.units.length} units</div>
              </div>
              <div style="color:var(--text3);font-size:13px">›</div>
            </div>`;
          return `
            <div class="hist-item" data-action="open-cat" data-cat="${r.cat.id}">
              <div class="hist-icon" style="${catBg(r.cat)}">${r.cat.icon}</div>
              <div class="hist-info">
                <div class="hist-expr">${r.unit.name} <span style="color:var(--text3)">(${r.unit.symbol})</span></div>
                <div class="hist-cat">${r.cat.name}</div>
              </div>
              <div style="color:var(--text3);font-size:13px">›</div>
            </div>`;
        }).join('')}
      </div>
    </div>`;
}

/* ── CATEGORIES ─────────────────────────────────────────────── */

function renderCategories() {
  const filtered = S.searchQuery
    ? CATEGORIES.filter(c =>
        c.name.toLowerCase().includes(S.searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(S.searchQuery.toLowerCase()) ||
        c.units.some(u => u.name.toLowerCase().includes(S.searchQuery.toLowerCase()))
      )
    : CATEGORIES;

  return `
    <div class="screen">
      <div class="page-header">
        <div class="page-header-inner">
          <div class="heading-lg">Explore</div>
          <div class="muted text-sm">${CATEGORIES.length} categories</div>
        </div>
      </div>
      <div class="search-wrap">
        <div class="search-bar">
          <span class="icon">🔍</span>
          <input class="search-input" id="cat-search" placeholder="Search categories…"
                 value="${S.searchQuery}" autocomplete="off"/>
          ${S.searchQuery ? `<button class="search-clear" data-action="clear-search">✕</button>` : ''}
        </div>
      </div>
      <div class="categories-grid">
        ${filtered.map(cat => `
          <div class="category-card" style="${catBg(cat)}" data-action="open-cat" data-cat="${cat.id}">
            <div class="cat-glow"></div>
            <span class="cat-icon">${cat.icon}</span>
            <div class="cat-name">${cat.name}</div>
            <div class="cat-desc">${cat.description}</div>
            <div class="cat-count">${cat.units.length} units</div>
          </div>`).join('')}
      </div>
    </div>`;
}

/* ── CONVERTER ──────────────────────────────────────────────── */

function renderConverter() {
  const cat = CATEGORIES.find(c => c.id === S.category);
  if (!cat) return renderHome();

  const fromUnit = cat.units.find(u => u.id === S.fromUnit) || cat.units[0];
  const toUnit   = cat.units.find(u => u.id === S.toUnit)   || cat.units[1] || cat.units[0];
  const val = parseFloat(S.inputValue) || 0;
  const result = convert(cat.id, val, fromUnit.id, toUnit.id);
  const resultStr = formatForDisplay(result);
  const favActive = isFav(cat.id, fromUnit.id, toUnit.id);

  const allConversions = convertAll(cat.id, val, fromUnit.id);

  const unitOptions = cat.units.map(u => {
    const label = cat.id === 'currency'
      ? `${u.flag || ''} ${u.symbol} — ${u.name}`
      : `${u.name} (${u.symbol})`;
    return `<option value="${u.id}" ${u.id === fromUnit.id ? 'selected' : ''}>${label}</option>`;
  }).join('');

  const unitOptionsTo = cat.units.map(u => {
    const label = cat.id === 'currency'
      ? `${u.flag || ''} ${u.symbol} — ${u.name}`
      : `${u.name} (${u.symbol})`;
    return `<option value="${u.id}" ${u.id === toUnit.id ? 'selected' : ''}>${label}</option>`;
  }).join('');

  const multiRows = S.multiExpand
    ? allConversions.filter(r => r.unit.id !== fromUnit.id).map(r => `
        <div class="multi-row ${r.unit.id === toUnit.id ? 'highlighted' : ''}"
             data-action="set-to-unit" data-unit="${r.unit.id}">
          <div class="multi-unit">${r.unit.symbol}</div>
          <div class="multi-name">${r.unit.name}</div>
          <div class="multi-value">${formatNum(r.value)}</div>
          <div class="multi-copy" data-action="copy-val" data-val="${formatNum(r.value)}">📋</div>
        </div>`).join('')
    : '';

  const voiceSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  return `
    <div class="screen converter-screen">
      <div class="converter-header">
        <button class="back-btn" data-action="back">‹</button>
        <div class="conv-header-icon" style="${catBg(cat)};width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">
          ${cat.icon}
        </div>
        <div class="conv-header-title">
          <div class="conv-header-name">${cat.name}</div>
          <div class="conv-header-sub">${cat.description}</div>
        </div>
        <button class="fav-btn ${favActive?'active':''}" data-action="toggle-fav"
                title="${favActive?'Remove from favorites':'Add to favorites'}">
          ${favActive ? '⭐' : '☆'}
        </button>
      </div>

      <div class="conv-body">
        <!-- FROM -->
        <div class="unit-panel" id="from-panel">
          <div class="unit-label">From</div>
          <div class="unit-selector-row">
            <select class="unit-select" id="from-select" data-type="from">
              ${unitOptions}
            </select>
            ${voiceSupported ? `
              <button class="voice-btn ${S.voiceActive?'listening':''}" data-action="voice"
                      title="Voice input">🎤</button>` : ''}
          </div>
          <input class="unit-input" id="from-input" type="number"
                 placeholder="0" value="${S.inputValue}"
                 inputmode="decimal" autocomplete="off"/>
        </div>

        <!-- SWAP -->
        <div class="swap-row">
          <div class="divider-line"></div>
          <button class="swap-btn" id="swap-btn" data-action="swap" title="Swap units">⇅</button>
          <div class="divider-line"></div>
        </div>

        <!-- TO -->
        <div class="unit-panel" id="to-panel">
          <div class="unit-label">To</div>
          <div class="unit-selector-row">
            <select class="unit-select" id="to-select" data-type="to">
              ${unitOptionsTo}
            </select>
            <button class="copy-btn show" data-action="copy-result"
                    data-val="${resultStr}" title="Copy result">Copy</button>
          </div>
          <div class="unit-result" id="result-display">
            ${result === null || isNaN(result) ? '<span style="color:var(--text3)">—</span>' : resultStr}
          </div>
          ${cat.id === 'currency' ? `
            <div style="font-size:11px;color:var(--text3);margin-top:8px">
              ℹ️ ${CURRENCY_LAST_UPDATED
                ? 'Rates updated ' + timeAgo(CURRENCY_LAST_UPDATED.getTime())
                : 'Loading live rates…'}
            </div>` : ''}
        </div>
      </div>

      <!-- Multi-convert -->
      <div class="multi-section">
        <div class="multi-header">
          <div class="heading-sm">All ${cat.name} Conversions</div>
          <button class="multi-toggle" data-action="toggle-multi">
            ${S.multiExpand ? 'Collapse ▲' : 'Expand ▼'}
          </button>
        </div>
        <div class="multi-grid" id="multi-grid">
          ${multiRows}
        </div>
      </div>
    </div>`;
}

/* ── FAVORITES ──────────────────────────────────────────────── */

function renderFavorites() {
  if (!S.favorites.length) return `
    <div class="screen">
      <div class="page-header"><div class="heading-lg">Favorites</div></div>
      <div class="fav-empty">
        <div class="fav-empty-icon">⭐</div>
        <div class="fav-empty-text">No favorites yet</div>
        <div class="fav-empty-sub">Tap the ☆ in any converter to pin it here for quick access.</div>
      </div>
    </div>`;

  return `
    <div class="screen">
      <div class="page-header">
        <div class="page-header-inner">
          <div class="heading-lg">Favorites</div>
          <div class="muted text-sm">${S.favorites.length} saved</div>
        </div>
      </div>
      <div class="fav-grid">
        ${S.favorites.map((f, i) => {
          const cat  = CATEGORIES.find(c => c.id === f.catId);
          if (!cat) return '';
          const fu   = cat.units.find(u => u.id === f.fromUnit);
          const tu   = cat.units.find(u => u.id === f.toUnit);
          return `
            <div class="fav-item" data-action="open-fav" data-idx="${i}">
              <div class="fav-cat-icon" style="${catBg(cat)}">${cat.icon}</div>
              <div class="fav-info">
                <div class="fav-name">${cat.name}</div>
                <div class="fav-pair">${fu?.name||f.fromUnit} → ${tu?.name||f.toUnit}</div>
              </div>
              <button class="fav-remove" data-action="remove-fav" data-idx="${i}"
                      title="Remove">✕</button>
            </div>`;
        }).join('')}
      </div>
    </div>`;
}

/* ── HISTORY ────────────────────────────────────────────────── */

function renderHistory() {
  if (!S.history.length) return `
    <div class="screen">
      <div class="page-header"><div class="heading-lg">History</div></div>
      <div class="fav-empty">
        <div class="fav-empty-icon">🕐</div>
        <div class="fav-empty-text">No history yet</div>
        <div class="fav-empty-sub">Your recent conversions will appear here automatically.</div>
      </div>
    </div>`;

  const grouped = {};
  S.history.forEach(h => {
    const d = new Date(h.timestamp);
    const key = d.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(h);
  });

  const content = Object.entries(grouped).map(([date, items]) => `
    <div class="section-label" style="margin-top:16px">${date}</div>
    <div class="history-list">
      ${items.map((h, i) => {
        const cat = CATEGORIES.find(c => c.id === h.catId);
        if (!cat) return '';
        const fu = cat.units.find(u => u.id === h.fromUnit);
        const tu = cat.units.find(u => u.id === h.toUnit);
        return `
          <div class="hist-item" data-action="open-hist"
               data-cat="${h.catId}" data-from="${h.fromUnit}"
               data-to="${h.toUnit}" data-val="${h.inputValue}">
            <div class="hist-icon" style="${catBg(cat)}">${cat.icon}</div>
            <div class="hist-info">
              <div class="hist-expr">
                ${h.inputValue} ${fu?.symbol||h.fromUnit} = ${formatForDisplay(parseFloat(h.result))} ${tu?.symbol||h.toUnit}
              </div>
              <div class="hist-cat">${cat.name}</div>
            </div>
            <div class="hist-time">${timeAgo(h.timestamp)}</div>
          </div>`;
      }).join('')}
    </div>`).join('');

  return `
    <div class="screen">
      <div class="page-header">
        <div class="page-header-inner">
          <div class="heading-lg">History</div>
          <button class="hist-clear-btn" data-action="clear-history">${S.history.length} entries — Clear</button>
        </div>
      </div>
      ${content}
      <div style="height:16px"></div>
    </div>`;
}

/* ── SETTINGS ───────────────────────────────────────────────── */

function renderSettings() {
  return `
    <div class="screen">
      <div class="page-header"><div class="heading-lg">Settings</div></div>

      <div class="settings-section" style="margin-top:8px">
        <div class="settings-title">Converter</div>
        <div class="settings-card">
          <div class="setting-row" data-action="toggle-multi-default">
            <div class="setting-icon" style="background:var(--bg3)">📊</div>
            <div class="setting-info">
              <div class="setting-label">Multi-Unit View</div>
              <div class="setting-sub">Show all conversions by default</div>
            </div>
            <div class="toggle ${S.multiExpand?'on':''}" id="multi-toggle"></div>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <div class="settings-title">Data</div>
        <div class="settings-card">
          <div class="setting-row" data-action="clear-history">
            <div class="setting-icon" style="background:rgba(239,68,68,.15)">🗑️</div>
            <div class="setting-info">
              <div class="setting-label">Clear History</div>
              <div class="setting-sub">${S.history.length} conversions stored</div>
            </div>
            <div class="setting-right">›</div>
          </div>
          <div class="setting-row" data-action="clear-favorites">
            <div class="setting-icon" style="background:rgba(239,68,68,.15)">💔</div>
            <div class="setting-info">
              <div class="setting-label">Clear Favorites</div>
              <div class="setting-sub">${S.favorites.length} saved</div>
            </div>
            <div class="setting-right">›</div>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <div class="settings-title">About</div>
        <div class="settings-card">
          <div class="setting-row">
            <div class="setting-icon" style="background:var(--accent-soft)">⚡</div>
            <div class="setting-info">
              <div class="setting-label">UnitX</div>
              <div class="setting-sub">All-in-One Unit Converter</div>
            </div>
            <div class="setting-right" style="font-size:12px;color:var(--text3)">v1.0</div>
          </div>
          <div class="setting-row">
            <div class="setting-icon" style="background:var(--bg3)">📡</div>
            <div class="setting-info">
              <div class="setting-label">Currency Rates</div>
              <div class="setting-sub">${CURRENCY_LAST_UPDATED
                ? 'Live — updated ' + CURRENCY_LAST_UPDATED.toLocaleString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})
                : 'Fetching live rates…'}</div>
            </div>
            <div class="setting-right">›</div>
          </div>
          <div class="setting-row">
            <div class="setting-icon" style="background:var(--bg3)">🎤</div>
            <div class="setting-info">
              <div class="setting-label">Voice Input</div>
              <div class="setting-sub">${(window.SpeechRecognition||window.webkitSpeechRecognition)?'Available in your browser':'Not available in this browser'}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="version-badge">
        UnitX — ${CATEGORIES.length} categories, ${CATEGORIES.reduce((a,c)=>a+c.units.length,0)}+ units<br>
        <span style="font-size:9px;opacity:.5">Made with ♥ using vanilla JS</span>
      </div>
    </div>`;
}

/* ── Event attachment ───────────────────────────────────────── */

function attachEvents() {
  /* Delegated click handler */
  const mc = document.getElementById('main-content');
  mc.onclick = null;
  mc.addEventListener('click', handleClick);
  mc.addEventListener('change', handleChange);
  mc.addEventListener('input',  handleInput);

  /* Nav clicks */
  document.getElementById('bottom-nav').onclick = e => {
    const btn = e.target.closest('[data-nav]');
    if (btn) navigate(btn.dataset.nav);
  };

  /* Converter-specific: live input */
  const fromInput = document.getElementById('from-input');
  if (fromInput) {
    fromInput.addEventListener('input', e => {
      S.inputValue = e.target.value;
      updateConverterResult();
    });
    fromInput.addEventListener('focus', () => {
      document.getElementById('from-panel')?.classList.add('focused');
      document.getElementById('to-panel')?.classList.remove('focused');
    });
    fromInput.addEventListener('blur', () => {
      document.getElementById('from-panel')?.classList.remove('focused');
    });
    /* Auto-focus on converter open */
    if (S.screen === 'converter') setTimeout(() => fromInput.focus(), 100);
  }
}

function handleClick(e) {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const action = el.dataset.action;

  switch(action) {
    case 'back':
      navigate(S.prevScreen === 'converter' ? 'home' : S.prevScreen || 'home');
      break;

    case 'open-cat':
      openConverter(el.dataset.cat);
      break;

    case 'open-hist':
      openConverter(el.dataset.cat, el.dataset.from, el.dataset.to);
      setTimeout(() => {
        const inp = document.getElementById('from-input');
        if (inp) { inp.value = el.dataset.val; inp.dispatchEvent(new Event('input')); }
      }, 50);
      break;

    case 'open-fav': {
      const f = S.favorites[parseInt(el.dataset.idx)];
      if (f) openConverter(f.catId, f.fromUnit, f.toUnit);
      break;
    }

    case 'open-currency':
      openConverter('currency');
      break;

    case 'swap':
      el.classList.add('spinning');
      setTimeout(() => el.classList.remove('spinning'), 400);
      setState({ fromUnit: S.toUnit, toUnit: S.fromUnit });
      break;

    case 'toggle-fav':
      toggleFav(S.category, S.fromUnit, S.toUnit);
      break;

    case 'toggle-multi':
      setState({ multiExpand: !S.multiExpand });
      break;

    case 'set-to-unit':
      setState({ toUnit: el.dataset.unit });
      break;

    case 'copy-result':
    case 'copy-val':
      copyText(el.dataset.val);
      break;

    case 'clear-search':
      setState({ searchQuery: '' });
      break;

    case 'remove-fav': {
      e.stopPropagation();
      const idx = parseInt(el.dataset.idx);
      const favs = [...S.favorites];
      favs.splice(idx, 1);
      setState({ favorites: favs });
      showToast('Removed', '✓');
      break;
    }

    case 'clear-history':
      if (confirm('Clear all conversion history?')) {
        setState({ history: [] });
        showToast('History cleared', '🗑️');
      }
      break;

    case 'clear-favorites':
      if (confirm('Remove all favorites?')) {
        setState({ favorites: [] });
        showToast('Favorites cleared', '🗑️');
      }
      break;

    case 'toggle-multi-default':
      setState({ multiExpand: !S.multiExpand });
      break;

    case 'voice':
      toggleVoice();
      break;
  }
}

function handleChange(e) {
  const el = e.target;
  if (el.id === 'from-select') {
    setState({ fromUnit: el.value }, true);
    updateConverterResult();
  } else if (el.id === 'to-select') {
    setState({ toUnit: el.value }, true);
    updateConverterResult();
  }
}

function handleInput(e) {
  const el = e.target;
  if (el.id === 'global-search' || el.id === 'cat-search') {
    setState({ searchQuery: el.value });
  }
}

/* ── Live converter update (no full re-render) ──────────────── */

function updateConverterResult() {
  const cat = CATEGORIES.find(c => c.id === S.category);
  if (!cat) return;

  const fromSel = document.getElementById('from-select');
  const toSel   = document.getElementById('to-select');
  const inp     = document.getElementById('from-input');

  const fromId = fromSel ? fromSel.value : S.fromUnit;
  const toId   = toSel   ? toSel.value   : S.toUnit;
  const val    = parseFloat(inp ? inp.value : S.inputValue) || 0;

  S.fromUnit    = fromId;
  S.toUnit      = toId;
  S.inputValue  = inp ? inp.value : S.inputValue;

  const result  = convert(cat.id, val, fromId, toId);
  const display = formatForDisplay(result);

  const resDom  = document.getElementById('result-display');
  if (resDom) {
    resDom.innerHTML = isNaN(result)
      ? '<span style="color:var(--text3)">—</span>'
      : display;
    resDom.style.animation = 'none';
    resDom.offsetHeight;
    resDom.style.animation = '';
  }

  const copyBtn = document.querySelector('[data-action="copy-result"]');
  if (copyBtn) copyBtn.dataset.val = display;

  const fromUnit = cat.units.find(u => u.id === fromId);
  const toUnit   = cat.units.find(u => u.id === toId);
  const fu = fromUnit?.name || fromId;
  const tu = toUnit?.name || toId;
  const fsym = fromUnit?.symbol || fromId;
  const tsym = toUnit?.symbol || toId;

  if (!isNaN(result) && val !== 0) {
    addToHistory(cat.id, fromId, toId, S.inputValue, String(result));
  }

  const favBtn = document.querySelector('.fav-btn');
  if (favBtn) {
    const active = isFav(cat.id, fromId, toId);
    favBtn.className = `fav-btn ${active?'active':''}`;
    favBtn.textContent = active ? '⭐' : '☆';
  }

  updateMultiGrid(cat, val, fromId, toId);
  persist();
}

function updateMultiGrid(cat, val, fromId, toId) {
  const grid = document.getElementById('multi-grid');
  if (!grid || !S.multiExpand) return;
  const allConversions = convertAll(cat.id, val, fromId);
  grid.innerHTML = allConversions.filter(r => r.unit.id !== fromId).map(r => `
    <div class="multi-row ${r.unit.id === toId ? 'highlighted' : ''}"
         data-action="set-to-unit" data-unit="${r.unit.id}">
      <div class="multi-unit">${r.unit.symbol}</div>
      <div class="multi-name">${r.unit.name}</div>
      <div class="multi-value">${formatNum(r.value)}</div>
      <div class="multi-copy" data-action="copy-val" data-val="${formatNum(r.value)}">📋</div>
    </div>`).join('');
}

/* ── Keyboard shortcuts ─────────────────────────────────────── */

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (S.screen === 'converter') navigate(S.prevScreen || 'home');
    if (S.searchQuery) setState({ searchQuery: '' });
  }
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    navigate('home');
    setTimeout(() => document.getElementById('global-search')?.focus(), 50);
  }
});

/* ── PWA / install ──────────────────────────────────────────── */

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  window._pwaPrompt = e;
});

/* ── Live Currency Rates ────────────────────────────────────── */

let CURRENCY_LAST_UPDATED = null;

async function fetchLiveCurrencyRates() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!res.ok) throw new Error('fetch failed');
    const data = await res.json();
    if (data.result !== 'success') throw new Error('bad response');
    Object.keys(CURRENCY_RATES).forEach(code => {
      if (data.rates[code] !== undefined) {
        CURRENCY_RATES[code].rate = data.rates[code];
      }
    });
    CURRENCY_LAST_UPDATED = new Date(data.time_last_update_utc);
    render();
  } catch(e) {
    console.warn('Live currency fetch failed, using fallback rates', e);
  }
}

/* ── Init ───────────────────────────────────────────────────── */

hydrate();
initVoice();
render();
fetchLiveCurrencyRates();
