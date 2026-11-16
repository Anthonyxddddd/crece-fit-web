/* Crece Fit — lógica de la app */
(function () {
  'use strict';
  var KEY = 'crece.v1';
  var S = null, tab = 'home', calOff = 0, exCat = 'Todos', P = null, figs = [], AC = null;
  var DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  var MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  var ORDER = ['A', 'B', 'C'];
  var $ = function (s) { return document.querySelector(s); };
  var AND = function () { return window.Android || null; };

  /* ---------- utilidades ---------- */
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function dstr(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function today() { return dstr(new Date()); }
  function dnum(s) { var p = s.split('-'); return Math.round(Date.UTC(+p[0], +p[1] - 1, +p[2]) / 86400000); }
  function nstr(n) { var d = new Date(n * 86400000); return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()); }
  function mmss(s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + pad(s % 60); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function toast(m) { var t = $('#toast'); t.textContent = m; t.className = 'on'; clearTimeout(toast.h); toast.h = setTimeout(function () { t.className = ''; }, 2200); }

  /* ---------- estado ---------- */
  function fresh() {
    return { setup: false, name: '', settings: { rest: 40, sound: true, vib: true, voice: true, theme: 'blue', mode: 'dark', rem: false, rh: 19, rm: 0 }, recs: {},
      days: {}, chains: {}, total: 0, rot: 0, meas: [], log: [], last: null };
  }
  function initChains(exp) {
    Object.keys(CHAINS).forEach(function (k) {
      var i = (exp && k === 'push') ? 1 : 0;
      S.chains[k] = { i: i, v: CHAINS[k][i].s };
    });
  }
  function load() {
    try { var r = localStorage.getItem(KEY); if (r) S = JSON.parse(r); } catch (e) { }
    if (!S) { S = fresh(); initChains(false); }
    Object.keys(CHAINS).forEach(function (k) { if (!S.chains[k]) S.chains[k] = { i: 0, v: CHAINS[k][0].s }; });
    if (!S.recs) S.recs = {};
    var f = fresh(); Object.keys(f.settings).forEach(function (k) { if (S.settings[k] == null) S.settings[k] = f.settings[k]; });
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }

  function stats() {
    var keys = Object.keys(S.days).sort(), best = 0, run = 0, prev = null;
    keys.forEach(function (k) { var n = dnum(k); run = (prev !== null && n - prev === 1) ? run + 1 : 1; if (run > best) best = run; prev = n; });
    var t = dnum(today()), done = !!S.days[today()], n = done ? t : t - 1, cur = 0;
    while (S.days[nstr(n)]) { cur++; n--; }
    var mins = 0; keys.forEach(function (k) { mins += (S.days[k].sec || 0) / 60; });
    return { cur: cur, best: best, doneToday: done, total: S.total, mins: Math.round(mins), chains: S.chains };
  }

  /* ---------- sonido / vibración / android ---------- */
  function unlockAudio() { try { if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); } catch (e) { } }
  function beep(f, ms, vol) {
    if (!S.settings.sound || !AC) return;
    try {
      var o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime;
      o.type = 'sine'; o.frequency.value = f; g.gain.setValueAtTime(vol || 0.3, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + ms / 1000);
      o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + ms / 1000 + 0.03);
    } catch (e) { }
  }
  function vib(ms) {
    if (!S.settings.vib) return;
    try { if (AND() && AND().vibrate) AND().vibrate(ms); else if (navigator.vibrate) navigator.vibrate(ms); } catch (e) { }
  }
  function keepAwake(on) { try { if (AND() && AND().keepAwake) AND().keepAwake(on); } catch (e) { } }
  function syncReminder() {
    try {
      if (!AND() || !AND().setReminder) return;
      var st = stats(), msg = st.cur > 0 ? '¡Mantén tu racha de ' + st.cur + ' día' + (st.cur > 1 ? 's' : '') + '! 🔥 Hoy toca entrenar.' : '¡Es hora de entrenar! Empieza tu racha hoy 💪';
      var last = Object.keys(S.days).sort().pop() || '';
      AND().setReminder(!!S.settings.rem, S.settings.rh, S.settings.rm, msg, last);
    } catch (e) { }
  }

  /* ---------- tema y voz ---------- */
  function applyTheme() {
    var st = S.settings, root = document.documentElement, mode = st.mode;
    if (mode === 'auto') mode = (window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
    root.setAttribute('data-mode', mode); root.setAttribute('data-theme', st.theme);
    var cs = getComputedStyle(root), a = cs.getPropertyValue('--acc').trim(), b = cs.getPropertyValue('--acc2').trim();
    var light = mode === 'light';
    window.FigColors = { near: a, dark: b, far: light ? '#9aa4d0' : '#6f7bb5', ground: light ? '#b8c1e6' : '#39406b',
      wall: light ? '#c9d1f0' : '#2a3158', wallLine: light ? '#98a3d4' : '#5d68a8', shadow: light ? 'rgba(0,0,0,.12)' : 'rgba(0,0,0,.28)' };
    try { if (AND() && AND().bars) AND().bars(light ? '#f1f4ff' : '#0e1120', light); } catch (e) { }
  }
  function accent() { return window.FigColors.near; }
  function say(t) { if (!S.settings.voice) return; try { if (AND() && AND().speak) AND().speak(t); } catch (e) { } }

  /* ---------- figuras ---------- */
  function destroyFigs() { figs.forEach(function (f) { f.destroy(); }); figs = []; }
  function mountFig(el, exId, opt) {
    var a = ANIMS[EX[exId].anim];
    if (opt && opt.pose != null) { a = Object.assign({}, a, { poses: [a.poses[opt.pose]] }); }
    var f = new Fig(el, a, opt || {});
    if (!(opt && opt.still)) figs.push(f);
    return f;
  }

  /* ---------- rutinas ---------- */
  function curVar(chain) { var c = S.chains[chain], v = CHAINS[chain][c.i]; return { ex: v.ex, val: c.v, type: EX[v.ex].type }; }
  function targetTxt(ex, val, type) {
    type = type || EX[ex].type;
    return type === 'time' ? val + ' s' : val + ' rep' + (val > 1 ? 's' : '');
  }
  function build(id) {
    var steps = [], rest = S.settings.rest;
    if (id === 'S') {
      STRETCH_ROUTINE.items.forEach(function (it) { steps.push({ k: 'ex', ex: it.ex, val: it.val, type: it.type || EX[it.ex].type, kind: 'cool' }); });
      return steps;
    }
    var w = WORKOUTS[id];
    WARMUP.forEach(function (it) { steps.push({ k: 'ex', ex: it.ex, val: it.val, type: EX[it.ex].type, kind: 'warm' }); });
    steps.push({ k: 'rest', secs: 15, title: 'Prepárate' });
    w.slots.forEach(function (sl, si) {
      var cv = curVar(sl[0]);
      for (var s = 1; s <= sl[1]; s++) {
        steps.push({ k: 'ex', ex: cv.ex, val: cv.val, type: cv.type, chain: sl[0], set: s, sets: sl[1], kind: 'main' });
        if (!(si === w.slots.length - 1 && s === sl[1])) steps.push({ k: 'rest', secs: rest });
      }
    });
    steps.push({ k: 'rest', secs: 20, title: 'Ahora, a estirar 🌱' });
    COOLDOWN.forEach(function (it) { steps.push({ k: 'ex', ex: it.ex, val: it.val, type: EX[it.ex].type, kind: 'cool' }); });
    return steps;
  }
  function estMin(steps) {
    var s = 0;
    steps.forEach(function (st) { if (st.k === 'rest') s += st.secs; else s += st.type === 'time' ? st.val + 4 : st.val * 3.5 + 6; });
    return Math.max(1, Math.round(s / 60));
  }
  function nextId() { return ORDER[S.rot % 3]; }
  function wInfo(id) { return id === 'S' ? STRETCH_ROUTINE : WORKOUTS[id]; }
  function mainList(id) {
    if (id === 'S') return STRETCH_ROUTINE.items.map(function (it) { return { n: EX[it.ex].n, t: targetTxt(it.ex, it.val, it.type) }; });
    return WORKOUTS[id].slots.map(function (sl) { var cv = curVar(sl[0]); return { n: EX[cv.ex].n, t: sl[1] + ' × ' + targetTxt(cv.ex, cv.val, cv.type) }; });
  }

  function applyProg(prev, done, mult) {
    var c = clone(prev);
    done.forEach(function (k) {
      var ch = CHAINS[k], st = c[k], v = ch[st.i];
      st.v += v.st * mult;
      if (st.v > v.max) {
        if (st.i < ch.length - 1) { st.i++; st.v = ch[st.i].s; } else st.v = v.max;
      }
    });
    return c;
  }

  /* ---------- pantallas principales ---------- */
  function tabsHTML() {
    var T = [['home', '🏠', 'Inicio'], ['ex', '🏋️', 'Ejercicios'], ['prog', '📈', 'Progreso'], ['set', '⚙️', 'Ajustes']];
    return '<div class="tabs">' + T.map(function (t) {
      return '<button class="tab' + (tab === t[0] ? ' on' : '') + '" data-a="tab" data-v="' + t[0] + '"><span class="i">' + t[1] + '</span>' + t[2] + '</button>';
    }).join('') + '</div>';
  }

  function weekStrip() {
    var d = new Date(), wd = (d.getDay() + 6) % 7, out = '', i;
    d.setDate(d.getDate() - wd);
    for (i = 0; i < 7; i++) {
      var k = dstr(d), done = !!S.days[k], isT = k === today();
      out += '<div class="wd' + (done ? ' done' : '') + (isT ? ' today' : '') + '">' + DAYS[i] + '<div class="dot">' + (done ? '✓' : '') + '</div></div>';
      d.setDate(d.getDate() + 1);
    }
    return '<div class="week">' + out + '</div>';
  }

  function homeV() {
    var st = stats(), id = nextId(), w = WORKOUTS[id], steps = build(id), name = S.name ? ', ' + esc(S.name) : '';
    var msg = st.doneToday ? '¡Hoy ya cumpliste! 🎉' : (st.cur > 0 ? 'Entrena hoy para mantener tu racha' : 'Empieza tu racha hoy');
    var tip = TIPS[dnum(today()) % TIPS.length];
    var h = '<div class="row"><div><div class="title">¡Hola' + name + '!</div><div class="mut small">' + (st.doneToday ? 'Gran trabajo hoy' : 'Vamos a crecer fuertes') + '</div></div></div>';
    h += '<div class="card streak' + (st.cur ? '' : ' off') + '" style="margin-top:16px"><div class="row"><div class="flame">🔥</div><div><div class="num">' + st.cur + '</div>' +
      '<div style="font-weight:800">' + (st.cur === 1 ? 'día seguido' : 'días seguidos') + '</div></div><div class="sp"></div>' +
      '<div style="text-align:right"><div class="mut small">Mejor racha</div><div style="font-size:22px;font-weight:900">' + st.best + '</div></div></div>' +
      '<div class="small" style="margin-top:10px;color:var(--st-t);font-weight:700">' + msg + '</div>' + weekStrip() + '</div>';
    if (!st.doneToday) {
      h += '<div class="card wcard"><div class="row"><div class="big">' + w.emoji + '</div><div><div class="mut small" style="font-weight:800">RUTINA DE HOY</div><div style="font-size:21px;font-weight:900">' + w.name + '</div></div></div>' +
        '<div class="row" style="margin:12px 0 4px"><span class="chip">⏱ ~' + estMin(steps) + ' min</span><span class="chip">📋 ' + w.slots.length + ' ejercicios</span><span class="chip">🌱 Estiramientos</span></div>' +
        '<div class="exl">' + mainList(id).map(function (x) { return '<div class="li"><b>' + x.n + '</b><span>' + x.t + '</span></div>'; }).join('') + '</div>' +
        '<div style="margin-top:14px" class="row"><button class="btn" data-a="start" data-v="' + id + '">▶ Empezar</button></div></div>';
    } else {
      h += '<div class="card wcard"><div style="font-size:19px;font-weight:900">Hoy ya entrenaste ✅</div><p class="mut small" style="margin:6px 0 12px">Descansa: los músculos crecen mientras duermes. Si quieres, haz estiramientos suaves para tu postura.</p>' +
        '<button class="btn sec" data-a="start" data-v="S">🌱 Estiramientos (6 min)</button><div class="mut small" style="margin-top:12px">Siguiente rutina: <b style="color:var(--txt)">' + WORKOUTS[nextId()].name + '</b></div></div>';
    }
    h += '<div class="h2">Otras rutinas</div><div class="grid2">';
    ORDER.forEach(function (k) { if (k === id && !st.doneToday) return; h += '<button class="mini" data-a="prev" data-v="' + k + '"><div class="e">' + WORKOUTS[k].emoji + '</div><b>' + WORKOUTS[k].name + '</b><span>Rutina ' + k + '</span></button>'; });
    h += '<button class="mini" data-a="prev" data-v="S"><div class="e">🌱</div><b>Crecer · estiramientos</b><span>Cuenta para tu racha</span></button></div>';
    h += '<div class="card tip" style="margin-top:14px"><div class="mut small" style="font-weight:800;color:var(--acc)">💡 CONSEJO DEL DÍA</div><p style="margin-top:6px;line-height:1.45">' + tip + '</p></div>';
    return h;
  }

  function exV() {
    var cats = ['Todos', 'Piernas', 'Pecho y brazos', 'Core', 'Espalda', 'Cardio', 'Crecer'];
    var h = '<div class="title">Ejercicios</div><p class="mut small" style="margin:4px 0 12px">Toca uno para ver el tutorial animado.</p>' +
      '<div class="chips">' + cats.map(function (c) { return '<button class="chip' + (exCat === c ? ' on' : '') + '" data-a="cat" data-v="' + c + '">' + c + '</button>'; }).join('') + '</div>';
    Object.keys(EX).forEach(function (k) {
      var e = EX[k]; if (exCat !== 'Todos' && e.cat !== exCat) return;
      h += '<button class="exitem" data-a="ex" data-v="' + k + '"><div class="fig"><svg data-fig="' + k + '"></svg></div><div><b>' + e.n + (e.grow ? '<span class="tag">CRECER</span>' : '') + '</b><small>' + e.cat + ' · ' + (e.type === 'time' ? 'Por tiempo' : 'Repeticiones') + '</small></div></button>';
    });
    return h;
  }

  function calHTML() {
    var base = new Date(); base.setDate(1); base.setMonth(base.getMonth() + calOff);
    var y = base.getFullYear(), m = base.getMonth(), first = (new Date(y, m, 1).getDay() + 6) % 7, n = new Date(y, m + 1, 0).getDate(), i, c = '';
    DAYS.forEach(function (d) { c += '<div class="h">' + d + '</div>'; });
    for (i = 0; i < first; i++) c += '<div></div>';
    for (i = 1; i <= n; i++) { var k = y + '-' + pad(m + 1) + '-' + pad(i); c += '<div class="d' + (S.days[k] ? ' done' : '') + (k === today() ? ' today' : '') + '">' + i + '</div>'; }
    return '<div class="row" style="margin-bottom:10px"><button class="btn sec sm" data-a="calp">‹</button><div class="sp" style="text-align:center;font-weight:800">' + MONTHS[m] + ' ' + y + '</div><button class="btn sec sm" data-a="caln">›</button></div><div class="cal">' + c + '</div>';
  }

  function chartHTML() {
    var pts = S.meas.filter(function (x) { return x.h; }).slice(-12);
    if (pts.length < 2) return '<p class="mut small" style="margin-top:10px">Guarda al menos dos medidas para ver tu gráfica de estatura.</p>';
    var W = 300, H = 120, mn = Math.min.apply(0, pts.map(function (p) { return p.h; })) - 1, mx = Math.max.apply(0, pts.map(function (p) { return p.h; })) + 1;
    var xy = pts.map(function (p, i) { return [14 + i * (W - 28) / (pts.length - 1), H - 22 - (p.h - mn) / (mx - mn) * (H - 44)]; });
    return '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '"><polyline fill="none" style="stroke:var(--acc)" stroke-width="3" stroke-linejoin="round" points="' + xy.map(function (a) { return a[0].toFixed(1) + ',' + a[1].toFixed(1); }).join(' ') + '"/>' +
      xy.map(function (a, i) { return '<circle cx="' + a[0].toFixed(1) + '" cy="' + a[1].toFixed(1) + '" r="4" style="fill:var(--acc)"/><text x="' + a[0].toFixed(1) + '" y="' + (a[1] - 8).toFixed(1) + '" style="fill:var(--mut)" font-size="9" text-anchor="middle">' + pts[i].h + '</text>'; }).join('') + '</svg>';
  }

  function weeklyHTML() {
    var now = new Date(), wd = (now.getDay() + 6) % 7, mon = new Date(now.getFullYear(), now.getMonth(), now.getDate() - wd), out = [], i, mx = 1;
    for (i = 7; i >= 0; i--) {
      var a = new Date(mon.getFullYear(), mon.getMonth(), mon.getDate() - i * 7), n = 0, k;
      for (k = 0; k < 7; k++) { var d = new Date(a.getFullYear(), a.getMonth(), a.getDate() + k); var r = S.days[dstr(d)]; if (r) n += r.w; }
      out.push({ n: n, l: pad(a.getDate()) + '/' + pad(a.getMonth() + 1), cur: i === 0 }); if (n > mx) mx = n;
    }
    return '<div class="rbar">' + out.map(function (o) { return '<div' + (o.cur ? ' class="cur"' : '') + '>' + (o.n || '') + '<i style="height:' + Math.round(o.n / mx * 78) + 'px"></i>' + o.l + '</div>'; }).join('') + '</div>';
  }
  function recsHTML() {
    var ks = Object.keys(S.recs).filter(function (k) { return EX[k]; }).sort(function (a, b) { return a < b ? -1 : 1; });
    if (!ks.length) return '<p class="mut small">Aún no hay récords. ¡Completa tu primer entrenamiento!</p>';
    return ks.map(function (k) { return '<div class="li" style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--bd)"><b style="font-size:14px">' + EX[k].n + '</b><span class="mut small">🏅 ' + targetTxt(k, S.recs[k]) + '</span></div>'; }).join('');
  }
  function notesHTML() {
    var ks = Object.keys(S.days).filter(function (k) { return S.days[k].note; }).sort().reverse().slice(0, 5);
    if (!ks.length) return '';
    return '<div class="h2">Mis notas</div><div class="card">' + ks.map(function (k) { return '<div style="padding:8px 0;border-bottom:1px solid var(--bd)"><div class="mut small" style="font-weight:800">' + k + '</div><div style="font-size:14px;margin-top:2px">' + esc(S.days[k].note) + '</div></div>'; }).join('') + '</div>';
  }
  function progV() {
    var st = stats();
    var h = '<div class="title">Tu progreso</div><div class="stats" style="margin-top:14px">' +
      '<div class="stat"><b>🔥 ' + st.cur + '</b><span>Racha actual</span></div><div class="stat"><b>🏆 ' + st.best + '</b><span>Mejor racha</span></div>' +
      '<div class="stat"><b>' + st.total + '</b><span>Entrenamientos</span></div><div class="stat"><b>' + st.mins + '</b><span>Minutos activos</span></div></div>';
    h += '<div class="h2">Entrenamientos por semana</div><div class="card">' + weeklyHTML() + '</div>';
    h += '<div class="h2">Calendario</div><div class="card">' + calHTML() + '</div>';
    h += '<div class="h2">Mi estatura y peso</div><div class="card"><div class="row"><div class="sp"><label style="margin-top:0">Estatura (cm)</label><input type="number" id="mh" inputmode="decimal" placeholder="170"></div><div class="sp"><label style="margin-top:0">Peso (kg)</label><input type="number" id="mw" inputmode="decimal" placeholder="60"></div></div>' +
      '<button class="btn sec" style="margin-top:12px" data-a="meas">Guardar medida</button>' + chartHTML();
    var last = S.meas.slice(-3).reverse();
    if (last.length) h += '<div class="exl" style="margin-top:10px">' + last.map(function (m) { return '<div class="li"><b>' + m.d + '</b><span>' + (m.h ? m.h + ' cm ' : '') + (m.w ? m.w + ' kg' : '') + '</span></div>'; }).join('') + '</div>';
    h += '<div class="note">💡 Mide siempre a la misma hora (mejor por la mañana). La estatura depende mucho de la genética: entrenar, dormir bien, comer proteína y mantener buena postura te ayudan a alcanzar tu máximo.</div></div>';
    h += '<div class="h2">Nivel de tus ejercicios</div><div class="card">' + Object.keys(CHAINS).map(function (k) {
      var c = S.chains[k], v = CHAINS[k][c.i], e = EX[v.ex];
      return '<div class="li" style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.05)"><b style="font-size:14px">' + e.n + '</b><span class="mut small">' + targetTxt(v.ex, c.v) + (CHAINS[k].length > 1 ? ' · nivel ' + (c.i + 1) + '/' + CHAINS[k].length : '') + '</span></div>';
    }).join('') + '<p class="mut small" style="margin-top:10px">Sube sola cuando terminas tus rutinas.</p></div>';
    h += '<div class="h2">Mis récords</div><div class="card">' + recsHTML() + '</div>' + notesHTML();
    h += '<div class="h2">Logros</div><div class="badges">' + BADGES.map(function (b) { var ok = b.f(st); return '<div class="badge' + (ok ? '' : ' lock') + '"><span class="e">' + b.e + '</span>' + b.n + '</div>'; }).join('') + '</div>';
    return h;
  }

  function sw(name) { return '<div class="sw' + (S.settings[name] ? ' on' : '') + '" data-a="tog" data-v="' + name + '"></div>'; }
  function setV() {
    var s = S.settings;
    return '<div class="title">Ajustes</div>' +
      '<div class="card" style="margin-top:14px"><label style="margin-top:0">Tu nombre</label><input type="text" id="nm" data-set="name" value="' + esc(S.name) + '" placeholder="Opcional" maxlength="20">' +
      '<label>Descanso entre series: <b id="rv" style="color:var(--acc)">' + s.rest + ' s</b></label><input type="range" min="15" max="90" step="5" value="' + s.rest + '" data-set="rest"></div>' +
      '<div class="card"><b>🎨 Apariencia</b><label style="margin-top:10px">Color de la app</label><div class="swrow">' +
      [['blue', '#4aa8ff'], ['green', '#2fcf8a'], ['purple', '#a78bfa'], ['orange', '#ffa23d'], ['pink', '#ff6fa8']].map(function (c) { return '<button class="swt' + (s.theme === c[0] ? ' on' : '') + '" style="background:' + c[1] + '" data-a="theme" data-v="' + c[0] + '"></button>'; }).join('') +
      '</div><label>Modo</label><div class="seg">' + [['dark', '🌙 Oscuro'], ['light', '☀️ Claro'], ['auto', '📱 Auto']].map(function (m) { return '<button class="' + (s.mode === m[0] ? 'on' : '') + '" data-a="mode" data-v="' + m[0] + '">' + m[1] + '</button>'; }).join('') + '</div></div>' +
      '<div class="card"><div class="set"><div class="sp"><b>🔊 Sonidos</b><div class="mut small">Pitidos al terminar</div></div>' + sw('sound') + '</div>' +
      '<div class="set"><div class="sp"><b>🗣 Voz</b><div class="mut small">Dice el ejercicio y cuenta contigo</div></div>' + sw('voice') + '</div>' +
      '<div class="set"><div class="sp"><b>📳 Vibración</b><div class="mut small">Avisos con vibración</div></div>' + sw('vib') + '</div>' +
      '<div class="set"><div class="sp"><b>⏰ Recordatorio diario</b><div class="mut small">Aviso para no perder tu racha</div></div>' + sw('rem') + '</div>' +
      (s.rem ? '<div style="padding:4px 0 12px"><input type="time" id="rt" data-set="rtime" value="' + pad(s.rh) + ':' + pad(s.rm) + '"></div>' : '') + '</div>' +
      '<div class="card"><b>💾 Copia de seguridad</b><p class="mut small" style="margin:4px 0 12px">Guarda tu progreso por si cambias de teléfono.</p><div class="row"><button class="btn sec sm sp" data-a="backup">Exportar</button><button class="btn sec sm sp" data-a="restore">Importar</button></div></div>' +
      '<div class="card"><b>🌱 Sobre crecer</b><p class="mut small" style="margin-top:6px;line-height:1.5">Tu altura final depende sobre todo de la genética. Esta app te ayuda a dar lo mejor de ti: fortalece músculos y huesos, mejora tu postura y movilidad de columna, y te recuerda lo básico: dormir 8–10 h, comer bien y moverte a diario. Ningún ejercicio “estira” los huesos por arte de magia, ¡pero sí puedes verte y sentirte más alto y fuerte!</p></div>' +
      '<button class="btn warn" data-a="reset">Borrar todos mis datos</button><p class="mut small" style="text-align:center;margin-top:14px">Crece Fit</p>';
  }

  function render(anim) {
    var old = $('#view'), top = old ? old.scrollTop : 0;
    destroyFigs();
    var v = tab === 'home' ? homeV() : tab === 'ex' ? exV() : tab === 'prog' ? progV() : setV();
    $('#app').innerHTML = '<div class="view' + (anim ? ' anim' : '') + '" id="view">' + v + '</div>' + tabsHTML();
    $('#view').scrollTop = anim ? 0 : top;
    Array.prototype.forEach.call(document.querySelectorAll('svg[data-fig]'), function (el) {
      var a = ANIMS[EX[el.getAttribute('data-fig')].anim];
      new Fig(el, Object.assign({}, a, { poses: [a.poses[a.poses.length > 1 ? 1 : 0]] }), { still: true });
    });
  }

  /* ---------- hojas y diálogos ---------- */
  function sheet(html) { var s = $('#sheet'); s.innerHTML = '<div class="sheet"><div class="grab"></div>' + html + '</div>'; s.className = 'on'; s.scrollTop = 0; }
  function sheetClose() { destroySheetFig(); $('#sheet').className = ''; $('#sheet').innerHTML = ''; }
  var sheetFig = null;
  function destroySheetFig() { if (sheetFig) { sheetFig.destroy(); sheetFig = null; } }
  function dialog(title, text, okLabel, fn, danger) {
    var m = $('#modal');
    m.innerHTML = '<div class="dlg"><h3>' + title + '</h3><p class="mut" style="line-height:1.4">' + text + '</p><div class="row" style="margin-top:18px"><button class="btn ghost sm sp" data-a="mno">Cancelar</button><button class="btn' + (danger ? ' warn' : '') + ' sm sp" data-a="myes">' + okLabel + '</button></div></div>';
    m.className = 'on'; dialog.fn = fn;
  }
  function dialogClose() { $('#modal').className = ''; $('#modal').innerHTML = ''; dialog.fn = null; }

  function openEx(id) {
    var e = EX[id];
    sheet('<div class="figbox"><svg id="sfig"></svg></div><div class="title" style="font-size:24px;margin-top:14px">' + e.n + '</div>' +
      '<div class="row" style="margin:8px 0 2px;flex-wrap:wrap"><span class="chip">' + e.cat + '</span><span class="chip">' + (e.type === 'time' ? '⏱ Por tiempo' : '🔁 Repeticiones') + '</span><span class="chip">💪 ' + e.m + '</span></div>' +
      e.steps.map(function (s, i) { return '<div class="step"><i>' + (i + 1) + '</i><div>' + s + '</div></div>'; }).join('') +
      '<div class="note">⚠️ ' + e.tip + '</div><button class="btn sec" style="margin-top:16px" data-a="closeSheet">Cerrar</button>');
    destroySheetFig();
    sheetFig = new Fig($('#sfig'), ANIMS[e.anim]);
  }

  function openPrev(id) {
    var steps = build(id), w = wInfo(id);
    sheet('<div class="row"><div style="font-size:40px">' + w.emoji + '</div><div><div class="title" style="font-size:22px">' + w.name + '</div><div class="mut small">~' + estMin(steps) + ' min</div></div></div>' +
      '<p class="mut small" style="margin:10px 0">' + w.desc + '</p><div class="exl">' + mainList(id).map(function (x) { return '<div class="li"><b>' + x.n + '</b><span>' + x.t + '</span></div>'; }).join('') + '</div>' +
      (id !== 'S' ? '<p class="mut small" style="margin-top:10px">Incluye calentamiento y 5 estiramientos “Crecer” al final.</p>' : '') +
      '<button class="btn" style="margin-top:16px" data-a="start" data-v="' + id + '">▶ Empezar</button>');
  }

  /* ---------- reproductor ---------- */
  function clearTimer() { if (P && P.timer) { clearInterval(P.timer); P.timer = null; } }
  function startTimer(secs, onTick, onEnd) {
    P.total = secs; P.end = Date.now() + secs * 1000; P.onTick = onTick; P.onEnd = onEnd; P.lastSec = null;
    clearTimer(); P.timer = setInterval(tick, 100); tick();
  }
  function tick() {
    if (!P) return;
    var rem = Math.max(0, P.end - Date.now()), s = Math.ceil(rem / 1000);
    P.rem = rem;
    if (P.onTick) P.onTick(rem, s);
    if (s !== P.lastSec) { P.lastSec = s; if (s > 0 && s <= 3 && P.beepTick) { beep(700, 90); vib(25); if (P.sayTick) say(String(s)); } }
    if (rem <= 0) { var f = P.onEnd; clearTimer(); if (f) f(); }
  }
  function pauseToggle() {
    if (!P) return;
    var b = $('#pp');
    if (P.timer) { P.remPaused = P.rem; clearTimer(); P.paused = true; if (b) b.innerHTML = '▶ Seguir'; }
    else if (P.paused) { P.paused = false; P.end = Date.now() + P.remPaused; P.timer = setInterval(tick, 100); if (b) b.innerHTML = '⏸ Pausa'; }
  }
  var RING = 2 * Math.PI * 76;
  function ring(frac) { return '<svg viewBox="0 0 170 170"><circle cx="85" cy="85" r="76" fill="none" style="stroke:var(--card2)" stroke-width="12"/><circle id="rc" cx="85" cy="85" r="76" fill="none" stroke="'+accent()+'" stroke-width="12" stroke-linecap="round" stroke-dasharray="' + RING.toFixed(1) + '" stroke-dashoffset="' + (RING * (1 - frac)).toFixed(1) + '"/></svg>'; }
  function setRing(frac, color) { var c = $('#rc'); if (c) { c.setAttribute('stroke-dashoffset', (RING * (1 - Math.max(0, Math.min(1, frac)))).toFixed(1)); if (color) c.setAttribute('stroke', color); } }

  function header() {
    var pct = Math.round(P.i / P.steps.length * 100);
    return '<div class="ph"><button class="x" data-a="quit">✕</button><div class="bar"><i style="width:' + pct + '%"></i></div><span class="mut small" style="font-weight:800">' + pct + '%</span></div>';
  }
  function ov(html) { var o = $('#overlay'); o.innerHTML = html; o.className = 'on'; }

  function startWorkout(id) {
    unlockAudio(); sheetClose();
    P = { id: id, steps: build(id), i: 0, t0: Date.now(), sets: 0, exs: 0, chains: {}, done: [], timer: null };
    keepAwake(true); showStep();
  }

  function showStep() {
    clearTimer(); destroyFigs();
    var st = P.steps[P.i];
    if (!st) return finish();
    P.paused = false; P.count = 0; P.beepTick = false; P.sayTick = false;
    if (st.k === 'rest') return showRest(st);
    var e = EX[st.ex], isTime = st.type === 'time';
    var kind = st.kind === 'warm' ? 'Calentamiento' : st.kind === 'cool' ? (P.id === 'S' ? 'Estiramiento' : 'Enfriamiento · Crecer') : 'Serie ' + st.set + ' de ' + st.sets;
    var html = header() + '<div class="pbody"><div class="kind">' + kind + '</div><div class="pname">' + e.n + '</div>' +
      '<div class="figbox"><svg id="pfig"></svg></div>';
    if (isTime) {
      html += '<div class="ringwrap">' + ring(1) + '<div class="tx"><b id="rn">3</b><span id="rl">¡Prepárate!</span></div></div>';
    } else {
      html += '<div class="target">Haz <b>' + st.val + '</b> repeticiones</div><button class="counter" id="cnt" data-a="cnt"><b id="cn">0</b><span>toca para contar</span></button>';
    }
    html += '<div class="cue">' + e.steps.map(function (s, i) { return (i + 1) + '. ' + s; }).join('<br>') + '</div></div>';
    html += '<div class="pfoot"><button class="rb" data-a="pprev">‹</button>' +
      (isTime ? '<button class="btn sec" id="pp" data-a="pp">⏸ Pausa</button>' : '<button class="btn" data-a="done">¡Listo! ✓</button>') +
      '<button class="rb" data-a="pnext">›</button></div>';
    ov(html);
    mountFig($('#pfig'), st.ex);
    say(e.n + (isTime ? '. ' + st.val + ' segundos' : '. ' + st.val + ' repeticiones'));
    if (isTime) {
      P.beepTick = true;
      startTimer(3, function (rem, s) { var n = $('#rn'); if (n) n.textContent = Math.max(1, s); setRing(rem / 3000, '#c084fc'); }, function () {
        beep(880, 160); vib(60);
        var l = $('#rl'); if (l) l.textContent = 'segundos';
        P.beepTick = true; P.sayTick = true; P.half = false;
        startTimer(st.val, function (rem, s) {
          if (!P.half && st.val >= 20 && rem <= st.val * 500) { P.half = true; say('Mitad'); } var n = $('#rn'); if (n) n.textContent = s; setRing(rem / (st.val * 1000), accent()); }, function () {
          beep(1200, 450, 0.4); vib(250); completeStep();
        });
      });
    }
  }

  function showRest(st) {
    var nx = null, j;
    for (j = P.i + 1; j < P.steps.length; j++) if (P.steps[j].k === 'ex') { nx = P.steps[j]; break; }
    var html = header() + '<div class="pbody rest"><div class="kind" style="color:var(--blue)">' + (st.title || 'Descanso') + '</div>' +
      '<div class="ringwrap" style="margin-top:14px">' + ring(1) + '<div class="tx"><b id="rn">' + st.secs + '</b><span>segundos</span></div></div>';
    if (nx) {
      var e = EX[nx.ex];
      html += '<div class="mut small" style="margin-top:14px;font-weight:800">A CONTINUACIÓN</div><div class="up"><div class="figbox"><svg id="pfig"></svg></div><div><b style="font-size:18px">' + e.n + '</b><div class="mut small" style="margin-top:4px">' +
        (nx.kind === 'main' ? 'Serie ' + nx.set + '/' + nx.sets + ' · ' : '') + targetTxt(nx.ex, nx.val, nx.type) + '</div></div></div>';
    }
    html += '</div><div class="pfoot"><button class="btn sec sm" style="width:auto" data-a="plus">+15 s</button><button class="btn" data-a="pnext">Saltar descanso ›</button></div>';
    ov(html);
    if (nx) mountFig($('#pfig'), nx.ex);
    P.beepTick = true; P.sayTick = true;
    say((st.title ? st.title.replace(/[^\wáéíóúñ ]/gi, '') : 'Descanso') + (nx ? '. Siguiente: ' + EX[nx.ex].n : ''));
    startTimer(st.secs, function (rem, s) { var n = $('#rn'); if (n) n.textContent = s; setRing(rem / (P.total * 1000), '#c084fc'); }, function () { beep(1000, 300, 0.35); vib(150); next(); });
  }

  function completeStep() {
    var st = P.steps[P.i];
    if (st && st.kind === 'main') { P.sets++; if (st.chain) P.chains[st.chain] = 1; P.done.push({ ex: st.ex, val: st.val }); }
    if (st && st.k === 'ex') P.exs++;
    next();
  }
  function next() { clearTimer(); P.i++; showStep(); }
  function prev() {
    var j = P.i - 1;
    while (j >= 0 && P.steps[j].k !== 'ex') j--;
    if (j >= 0) { P.i = j; showStep(); }
  }

  function finish() {
    clearTimer(); destroyFigs(); keepAwake(false);
    var secs = Math.round((Date.now() - P.t0) / 1000), d = today(), isS = P.id === 'S';
    var day = S.days[d] || (S.days[d] = { w: 0, sec: 0, sets: 0 });
    day.w++; day.sec += secs; day.sets += P.sets;
    P.done.forEach(function (x) { if (!S.recs[x.ex] || x.val > S.recs[x.ex]) S.recs[x.ex] = x.val; });
    S.total++; S.log.push({ d: d, id: P.id, sec: secs }); if (S.log.length > 300) S.log.shift();
    var done = Object.keys(P.chains);
    if (!isS) {
      S.rot = (ORDER.indexOf(P.id) + 1) % 3;
      S.last = { prev: clone(S.chains), done: done, mult: 1 };
      S.chains = applyProg(S.last.prev, done, 1);
    } else S.last = null;
    save(); syncReminder();
    beep(1000, 200); setTimeout(function () { beep(1400, 400); }, 220); vib(400); say('Entrenamiento completado. ¡Buen trabajo!');
    summary(secs, isS);
  }

  function changesHTML() {
    if (!S.last || !S.last.done.length) return '';
    var out = S.last.done.map(function (k) {
      var a = S.last.prev[k], b = S.chains[k], ea = CHAINS[k][a.i], eb = CHAINS[k][b.i];
      if (a.i !== b.i) return '🎉 <b>¡Subes de nivel!</b> ' + EX[eb.ex].n + ' · ' + targetTxt(eb.ex, b.v);
      return EX[eb.ex].n + ': ' + targetTxt(eb.ex, a.v) + ' → <b>' + targetTxt(eb.ex, b.v) + '</b>';
    });
    return '<div class="card" style="margin-top:14px"><div class="mut small" style="font-weight:800;margin-bottom:6px">PRÓXIMA VEZ</div>' + out.map(function (x) { return '<div style="padding:4px 0;font-size:14px">' + x + '</div>'; }).join('') + '</div>';
  }
  function summary(secs, isS) {
    var st = stats();
    var html = '<div class="pbody" style="padding-top:calc(var(--safe-t) + 20px)"><div class="trophy">🏆</div><div class="title" style="text-align:center;margin-top:6px">¡Entrenamiento completado!</div>' +
      '<div class="card streak" style="margin-top:16px;text-align:center"><div class="flame" style="font-size:44px">🔥</div><div class="num">' + st.cur + '</div><div style="font-weight:800">' + (st.cur === 1 ? 'día de racha' : 'días de racha') + '</div></div>' +
      '<div class="sumgrid"><div><b>' + mmss(secs) + '</b><span>Tiempo</span></div><div><b>' + P.sets + '</b><span>Series</span></div><div><b>' + P.exs + '</b><span>Ejercicios</span></div></div>';
    if (!isS && S.last && S.last.done.length) {
      html += '<div class="mut small" style="font-weight:800;margin-bottom:8px">¿CÓMO TE SENTISTE?</div><div class="fb"><button data-a="fb" data-v="2">😄 Fácil</button><button class="on" data-a="fb" data-v="1">👍 Justo</button><button data-a="fb" data-v="0">😓 Difícil</button></div><div id="chg">' + changesHTML() + '</div>';
    }
    html += '<textarea class="note2" id="note" maxlength="200" placeholder="📝 Nota del día (opcional): ¿cómo te sentiste?"></textarea>';
    html += '</div><div class="pfoot"><button class="btn" data-a="close">Terminar</button></div>';
    ov(html);
  }
  function closeOverlay() {
    var nt = $('#note'); if (nt && nt.value.trim()) { var dd = S.days[today()]; if (dd) { dd.note = nt.value.trim(); save(); } }
    $('#overlay').className = ''; $('#overlay').innerHTML = ''; P = null; tab = 'home'; render();
    if (upd.wait) { upd.wait = false; showUpd(); } }

  function quit() {
    dialog('¿Salir del entrenamiento?', 'Se perderá el avance de esta sesión.', 'Salir', function () { clearTimer(); destroyFigs(); keepAwake(false); closeOverlay(); }, true);
  }

  /* ---------- onboarding ---------- */
  var obLvl = 0;
  function onboarding() {
    var o = document.createElement('div'); o.className = 'ob'; o.id = 'ob';
    o.innerHTML = '<div style="text-align:center;font-size:64px">💪</div><div class="title" style="text-align:center;margin:6px 0 4px">Crece Fit</div>' +
      '<p class="mut" style="text-align:center;line-height:1.45;margin-bottom:18px">Rutinas sin equipo, con tutoriales animados, temporizadores y tu racha diaria.</p>' +
      '<label>¿Cómo te llamas? (opcional)</label><input type="text" id="obn" maxlength="20" placeholder="Tu nombre">' +
      '<label>Tu estatura actual en cm (opcional)</label><input type="number" id="obh" inputmode="decimal" placeholder="Ej. 168">' +
      '<label>Tu nivel</label><button class="opt on" data-a="oblvl" data-v="0"><b>🌱 Principiante</b><span>Empiezo desde cero con ejercicios suaves.</span></button>' +
      '<button class="opt" data-a="oblvl" data-v="1"><b>💪 Ya entreno un poco</b><span>Empiezo con flexiones de rodillas.</span></button>' +
      '<div class="note">🌱 Sobre la altura: depende mucho de la genética, pero dormir, comer bien, buena postura y ejercicio te ayudan a llegar a tu máximo.</div>' +
      '<button class="btn" style="margin-top:20px" data-a="obstart">¡Empezar!</button>';
    document.body.appendChild(o);
  }

  /* ---------- acciones ---------- */
  function setBool(k) { S.settings[k] = !S.settings[k]; save(); }
  document.addEventListener('click', function (ev) {
    if (ev.target.id === 'sheet') { sheetClose(); return; }
    var t = ev.target.closest('[data-a]'); if (!t) return;
    var a = t.getAttribute('data-a'), v = t.getAttribute('data-v');
    switch (a) {
      case 'tab': tab = v; render(true); break;
      case 'start': startWorkout(v); break;
      case 'prev': openPrev(v); break;
      case 'ex': openEx(v); break;
      case 'cat': exCat = v; render(); break;
      case 'closeSheet': sheetClose(); break;
      case 'calp': calOff--; render(); break;
      case 'caln': calOff++; render(); break;
      case 'meas':
        var h = parseFloat($('#mh').value), w = parseFloat($('#mw').value);
        if (!h && !w) { toast('Escribe tu estatura o peso'); break; }
        if (h && (h < 80 || h > 250)) { toast('Revisa la estatura (cm)'); break; }
        S.meas.push({ d: today(), h: h || 0, w: w || 0 }); save(); toast('Medida guardada ✅'); render(); break;
      case 'theme': S.settings.theme = v; save(); applyTheme(); render(); break;
      case 'mode': S.settings.mode = v; save(); applyTheme(); render(); break;
      case 'tog':
        setBool(v);
        if (v === 'voice' && S.settings.voice) say('Voz activada');
        if (v === 'rem') { if (S.settings.rem && AND() && AND().requestNotif) { try { AND().requestNotif(); } catch (e) { } } syncReminder(); }
        render(); break;
      case 'backup': var js = JSON.stringify(S);
        sheet('<div class="title" style="font-size:22px">Copia de seguridad</div><p class="mut small" style="margin:8px 0">Copia este texto y guárdalo (notas, mensaje a ti mismo…). Para restaurar, pégalo en “Importar”.</p><textarea id="bk" rows="7" readonly>' + esc(js) + '</textarea><div class="row" style="margin-top:12px"><button class="btn sm sp" data-a="copybk">Copiar</button><button class="btn sec sm sp" data-a="sharebk">Compartir</button></div>'); break;
      case 'copybk':
        var ta = $('#bk'); ta.select();
        try { if (AND() && AND().copy) AND().copy(ta.value); else document.execCommand('copy'); toast('Copiado ✅'); } catch (e) { toast('Selecciona y copia el texto'); } break;
      case 'sharebk': try { if (AND() && AND().share) AND().share($('#bk').value); else toast('Usa Copiar'); } catch (e) { } break;
      case 'restore':
        sheet('<div class="title" style="font-size:22px">Importar copia</div><p class="mut small" style="margin:8px 0">Pega aquí tu copia de seguridad. Esto reemplaza tus datos actuales.</p><textarea id="rs" rows="7" placeholder="Pega aquí…" style="-webkit-user-select:text"></textarea><button class="btn" style="margin-top:12px" data-a="dorestore">Restaurar</button>'); break;
      case 'dorestore':
        try { var o = JSON.parse($('#rs').value); if (!o || !o.settings || !o.days) throw 0; S = o; save(); load(); save(); sheetClose(); toast('Datos restaurados ✅'); render(); syncReminder(); }
        catch (e) { toast('Texto no válido'); } break;
      case 'reset':
        dialog('¿Borrar todo?', 'Se eliminarán tu racha, historial y progreso. No se puede deshacer.', 'Borrar', function () { try { localStorage.removeItem(KEY); } catch (e) { } S = null; load(); save(); applyTheme(); onboarding(); render(true); syncReminder(); }, true); break;
      case 'updno': dialogClose(); break;
      case 'updgo':
        upd.busy = true;
        $('#upd').innerHTML = '<h3 id="uph">Actualizando…</h3><div class="pbar"><i id="upi"></i></div><div class="upct" id="upt">0%</div><p class="mut small" id="upn" style="text-align:center;margin-top:6px">No cierres la app</p>';
        try { if (AND() && AND().startUpdate) AND().startUpdate(); else { upd.busy = false; dialogClose(); location.reload(); } } catch (e) { window.__updateError(); }
        break;
      case 'mno': dialogClose(); break;
      case 'myes': var f = dialog.fn; dialogClose(); if (f) f(); break;
      case 'oblvl': obLvl = +v; Array.prototype.forEach.call(document.querySelectorAll('.opt'), function (b) { b.classList.toggle('on', b.getAttribute('data-v') === v); }); break;
      case 'obstart':
        S = fresh(); S.setup = true; S.name = ($('#obn').value || '').trim(); initChains(obLvl === 1);
        var hh = parseFloat($('#obh').value); if (hh >= 80 && hh <= 250) S.meas.push({ d: today(), h: hh, w: 0 });
        save(); document.body.removeChild($('#ob')); render(); if (upd.wait) { upd.wait = false; showUpd(); } break;
      // reproductor
      case 'quit': quit(); break;
      case 'pp': pauseToggle(); break;
      case 'cnt':
        P.count++; var st = P.steps[P.i], c = $('#cnt');
        $('#cn').textContent = P.count; vib(15); beep(900, 50, 0.15); say(String(P.count));
        if (P.count >= st.val) { c.classList.add('full'); if (P.count === st.val) { beep(1200, 250, 0.3); vib(120); } }
        break;
      case 'done': completeStep(); break;
      case 'pnext': next(); break;
      case 'pprev': prev(); break;
      case 'plus': P.end += 15000; P.total += 15; break;
      case 'fb':
        var m = +v; S.last.mult = m; S.chains = applyProg(S.last.prev, S.last.done, m); save();
        Array.prototype.forEach.call(document.querySelectorAll('.fb button'), function (b) { b.classList.toggle('on', b.getAttribute('data-v') === v); });
        $('#chg').innerHTML = changesHTML(); break;
      case 'close': closeOverlay(); break;
    }
  });
  document.addEventListener('input', function (ev) {
    var t = ev.target, k = t.getAttribute && t.getAttribute('data-set'); if (!k) return;
    if (k === 'name') { S.name = t.value.trim(); save(); }
    else if (k === 'rest') { S.settings.rest = +t.value; var r = $('#rv'); if (r) r.textContent = t.value + ' s'; save(); }
    else if (k === 'rtime') { var p = t.value.split(':'); if (p.length === 2) { S.settings.rh = +p[0]; S.settings.rm = +p[1]; save(); syncReminder(); } }
  });

  // botón atrás de Android
  window.__back = function () {
    if (upd.busy) return true;
    if ($('#modal').className === 'on') { dialogClose(); return true; }
    if ($('#sheet').className === 'on') { sheetClose(); return true; }
    if ($('#overlay').className === 'on') { if (P && P.steps[P.i]) quit(); else closeOverlay(); return true; }
    if ($('#ob')) return false;
    if (tab !== 'home') { tab = 'home'; render(); return true; }
    return false;
  };

  /* ---------- actualizaciones ---------- */
  var upd = { v: 0, busy: false, wait: false };
  function showUpd() {
    var m = $('#modal');
    m.innerHTML = '<div class="dlg" id="upd"><h3>🚀 Actualización disponible</h3><p class="mut" style="line-height:1.45">Hay una versión nueva de la app. Al actualizar, la app se cerrará sola y la próxima vez que entres ya estará lista.</p>' +
      '<div class="row" style="margin-top:18px"><button class="btn ghost sm sp" data-a="updno">Más tarde</button><button class="btn sm sp" data-a="updgo">Actualizar</button></div></div>';
    m.className = 'on';
  }
  window.__updateAvailable = function (v) {
    if (upd.busy) return;
    upd.v = v;
    if (P || $('#ob')) { upd.wait = true; return; }
    showUpd();
  };
  window.__updateProgress = function (p) {
    var i = $('#upi'), t = $('#upt'), h = $('#uph');
    if (i) i.style.width = p + '%';
    if (t) t.textContent = p + '%';
    if (p >= 100 && h) { h.textContent = '¡Listo! ✅ Cerrando la app…'; var n = $('#upn'); if (n) n.textContent = 'La próxima vez que entres ya estará actualizada'; }
  };
  window.__updateError = function () {
    upd.busy = false; dialogClose(); toast('No se pudo actualizar. Revisa tu internet e inténtalo de nuevo.');
  };
  // compatibilidad con versiones anteriores de la app (descargaban en silencio)
  window.__updateReady = function () {
    if (!P && !$('#ob')) dialog('Actualización lista ✨', 'Hay una versión nueva de la app.', 'Actualizar', function () { location.reload(); });
    else toast('Actualización lista: se aplicará al reabrir la app');
  };

  document.addEventListener('visibilitychange', function () { if (!document.hidden && !P) render(); });
  load(); applyTheme(); render(true); syncReminder();
  if (!S.setup) onboarding();
  setTimeout(function () { var sp = $('#splash'); if (sp) { sp.classList.add('out'); setTimeout(function () { sp.remove(); }, 500); } }, 900);
})();
