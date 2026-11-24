/* Crece Fit — lógica de la app */
(function () {
  var BRAND_SVG = "<svg class=\"bsvg\" viewBox=\"-30 -22 332 172\" aria-label=\"daij studio\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"9\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g transform=\"translate(0,0)\"><circle cx=\"34\" cy=\"70\" r=\"30\"/><path d=\"M64,0 V100\"/></g><g transform=\"translate(96,0)\"><circle cx=\"34\" cy=\"70\" r=\"30\"/><path d=\"M64,40 V100\"/></g><g transform=\"translate(197,0)\"><path d=\"M0,40 V100\"/></g><g transform=\"translate(252,0)\"><path d=\"M0,40 V108 A18,18 0 0 1 -18,126\"/></g></g><circle cx=\"197\" cy=\"14\" r=\"7.5\" fill=\"currentColor\"/><circle cx=\"252\" cy=\"14\" r=\"7.5\" fill=\"currentColor\"/></svg>";
  var SPLASH_HTML = "<div id=\"splash\"><div class=\"sgl\"></div><div class=\"slogo\"><svg class=\"lgo\" viewBox=\"0 0 512 512\" aria-hidden=\"true\"><defs><linearGradient id=\"lbg\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" class=\"s0\"/><stop offset=\"1\" class=\"s1\"/></linearGradient><radialGradient id=\"lgl\" cx=\".28\" cy=\".18\" r=\".8\"><stop offset=\"0\" stop-color=\"#fff\" stop-opacity=\".22\"/><stop offset=\".6\" stop-color=\"#fff\" stop-opacity=\"0\"/></radialGradient><linearGradient id=\"lar\" gradientUnits=\"userSpaceOnUse\" x1=\"256\" y1=\"340\" x2=\"256\" y2=\"198\"><stop offset=\"0\" class=\"a0\"/><stop offset=\"1\" class=\"a1\"/></linearGradient></defs><rect width=\"512\" height=\"512\" rx=\"116\" fill=\"#0c1030\"/><rect width=\"512\" height=\"512\" rx=\"116\" fill=\"url(#lbg)\"/><rect width=\"512\" height=\"512\" rx=\"116\" fill=\"url(#lgl)\"/><rect class=\"rim\" x=\"3\" y=\"3\" width=\"506\" height=\"506\" rx=\"113\" fill=\"none\" stroke-width=\"6\"/><path class=\"rg\" pathLength=\"1\" d=\"M366.3,181.8 A140,140 0 1 0 366.3,354.2\" fill=\"none\" stroke-width=\"58\" stroke-linecap=\"round\"/><g class=\"ar\" fill=\"none\" stroke=\"url(#lar)\" stroke-width=\"44\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M256,336V206\"/><path d=\"M204,254L256,202L308,254\"/></g></svg></div><b class=\"sname\"><span>C</span><span>r</span><span>e</span><span>c</span><span>e</span><span class=\"sp\">&nbsp;</span><span>F</span><span>i</span><span>t</span></b><div class=\"stag\">Entrena · Crece · Sé constante</div><div class=\"sbrand\"><svg class=\"bsvg\" viewBox=\"-30 -22 332 172\" aria-label=\"daij studio\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"9\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g transform=\"translate(0,0)\"><circle cx=\"34\" cy=\"70\" r=\"30\"/><path d=\"M64,0 V100\"/></g><g transform=\"translate(96,0)\"><circle cx=\"34\" cy=\"70\" r=\"30\"/><path d=\"M64,40 V100\"/></g><g transform=\"translate(197,0)\"><path d=\"M0,40 V100\"/></g><g transform=\"translate(252,0)\"><path d=\"M0,40 V108 A18,18 0 0 1 -18,126\"/></g></g><circle cx=\"197\" cy=\"14\" r=\"7.5\" fill=\"currentColor\"/><circle cx=\"252\" cy=\"14\" r=\"7.5\" fill=\"currentColor\"/></svg><small>studio</small></div></div>";
  'use strict';
  var KEY = 'crece.v1';
  var S = null, tab = 'home', calOff = 0, exCat = 'Todos', P = null, figs = [], AC = null;
  var DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  var MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  var ORDER = ['A', 'B', 'C', 'D'];
  var $ = function (s) { return document.querySelector(s); };
  var AND = function () { return window.Android || null; };

  /* ---------- utilidades ---------- */
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function dstr(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function today() { return dstr(new Date()); }
  /* días de entrenamiento elegidos (L=0 ... D=6). Sin elegir = todos los días */
  var DAYS3 = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'], DAYS_FULL = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  function tdArr() { var t = S && S.settings && S.settings.tdays; return (t && t.length && t.length < 7) ? t : null; }
  function wdOf(n) { return (new Date(n * 86400000).getUTCDay() + 6) % 7; }
  function isRestN(n) { var t = tdArr(); return !!t && t.indexOf(wdOf(n)) < 0; }
  function tdaysText() { var t = tdArr(); return t ? t.slice().sort().map(function (i) { return DAYS_FULL[i]; }).join(', ') : 'todos los días'; }
  function tdMask() { var t = tdArr(), m = 0; if (t) t.forEach(function (i) { m |= (1 << i); }); return m; }
  function gapOk(a, b) { var i; for (i = a + 1; i < b; i++) if (!isRestN(i)) return false; return true; }
  function dnum(s) { var p = s.split('-'); return Math.round(Date.UTC(+p[0], +p[1] - 1, +p[2]) / 86400000); }
  function nstr(n) { var d = new Date(n * 86400000); return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()); }
  function mmss(s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + pad(s % 60); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function toast(m) { var t = $('#toast'); t.textContent = m; t.className = 'on'; clearTimeout(toast.h); toast.h = setTimeout(function () { t.className = ''; }, 2200); }

  /* ---------- estado ---------- */
  function fresh() {
    return { setup: false, name: '', settings: { rest: 40, sound: true, vib: true, voice: true, theme: 'blue', mode: 'dark', style: 'classic', fx: true, rem: false, rh: 19, rm: 0,
      goal: 3, warm: 'cardio', cool: 'all', nojump: false, risk: false, hands: false, pace: 2.5 }, recs: {}, exv: {}, profile: null,
      days: {}, chains: {}, total: 0, rot: 0, meas: [], log: [], last: null,
      xp: 0, freeze: { m: '', used: 0 }, habits: {}, custom: [], plan: null, planDone: false, exh: {}, goalsHit: {} };
  }
  function initChains(level) {
    level = level | 0;
    Object.keys(CHAINS).forEach(function (k) {
      var n = CHAINS[k].length, i = level === 0 ? 0 : Math.min(level, n - 1);
      if (level === 1 && k !== 'push' && n > 2) i = Math.min(1, n - 1);
      S.chains[k] = { i: i, v: CHAINS[k][i].s + (level > 0 ? CHAINS[k][i].st * 2 * level : 0) };
      if (S.chains[k].v > CHAINS[k][i].max) S.chains[k].v = CHAINS[k][i].max;
    });
    S.exv = {};
  }
  function load() {
    try { var r = localStorage.getItem(KEY); if (r) S = JSON.parse(r); } catch (e) { }
    if (!S) { S = fresh(); initChains(0); }
    Object.keys(CHAINS).forEach(function (k) { if (!S.chains[k]) S.chains[k] = { i: 0, v: CHAINS[k][0].s }; });
    var f0 = fresh(); ['recs', 'habits', 'exh', 'goalsHit'].forEach(function (k) { if (!S[k]) S[k] = {}; });
    if (!S.cloud) S.cloud = { code: '', auto: true, last: 0 };
    if (!S.chalDone) S.chalDone = []; hbInit(); if (!S.food) S.food = { sex: 'm', age: '', w: '', h: '', act: 2, goal: 'gain', log: {}, fav: {}, done: false }; if (!S.custom) S.custom = []; if (!S.exv) S.exv = {}; if (!S.freeze) S.freeze = f0.freeze; if (!S.xp) S.xp = 0;
    var f = fresh(); Object.keys(f.settings).forEach(function (k) { if (S.settings[k] == null) S.settings[k] = f.settings[k]; });
    S.settings.style = 'classic'; S.settings.fx = true;
  }
  var saveT = 0;
  function saveNow() { saveT = 0; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } try { syncWidget(); } catch (e) { } }
  function save() { if (!saveT) saveT = setTimeout(saveNow, 160); }
  window.addEventListener('pagehide', function () { if (saveT) { clearTimeout(saveT); saveNow(); } });
  document.addEventListener('visibilitychange', function () { if (document.hidden && saveT) { clearTimeout(saveT); saveNow(); } });

  function levelOf(xp) { return Math.floor(Math.sqrt(xp / 60)) + 1; }
  function xpAt(l) { return 60 * (l - 1) * (l - 1); }
  function lvlName(l) { return LEVEL_NAMES[Math.min(l - 1, LEVEL_NAMES.length - 1)]; }

  function stats() {
    var keys = Object.keys(S.days).sort(), best = 0, run = 0, prev = null, maxReps = 0, early = false;
    keys.forEach(function (k) {
      var n = dnum(k); run = (prev !== null && gapOk(prev, n)) ? run + 1 : 1; if (run > best) best = run; prev = n;
      if ((S.days[k].reps || 0) > maxReps) maxReps = S.days[k].reps; if (S.days[k].early) early = true;
    });
    var td = S.days[today()], t = dnum(today()), done = !!(td && td.w > 0), n = done ? t : t - 1, cur = 0;
    var guard = 0; for (;;) { if (S.days[nstr(n)]) { cur++; n--; } else if (isRestN(n) && guard++ < 400) { n--; } else break; }
    var mins = 0; keys.forEach(function (k) { mins += (S.days[k].sec || 0) / 60; });
    var hd = 0; Object.keys(S.habits).forEach(function (k) { if (S.habits[k].xp) hd++; });
    return { cur: cur, best: best, doneToday: done, total: S.total, mins: Math.round(mins), chains: S.chains, lvl: levelOf(S.xp),
      maxReps: maxReps, early: early, goalsHit: Object.keys(S.goalsHit).length, planDone: !!S.planDone, habitDays: hd };
  }
  /* insignias de racha: próxima meta y avisos al desbloquear */
  function nextStreak(st) {
    var cur = Math.max(st.cur, 0), i, nx = 0, prev = 0;
    for (i = 0; i < STREAK_STEPS.length; i++) { if (STREAK_STEPS[i] > cur) { nx = STREAK_STEPS[i]; break; } prev = STREAK_STEPS[i]; }
    return nx ? { n: nx, left: nx - cur, pct: Math.round((cur - prev) / (nx - prev) * 100), prev: prev } : null;
  }
  function streakBadgeCard(st) {
    var nx = nextStreak(st);
    if (!nx) return '<div class="card" style="text-align:center"><b>🏆 ¡Tienes todas las insignias de racha!</b></div>';
    return '<div class="card"><div class="row"><div class="sp"><b>Próxima insignia: ' + nx.n + ' días</b><div class="mut small">' + (nx.left === 1 ? 'Te falta 1 día' : 'Te faltan ' + nx.left + ' días') + ' · racha actual ' + st.cur + '</div></div><div style="font-size:30px">🔥</div></div><div class="pbar" style="margin:12px 0 0"><i style="width:' + nx.pct + '%"></i></div></div>';
  }
  function checkBadges(silent) {
    var st = stats(), seen = S.bseen || (S.bseen = {}), fresh = [], first = !S.bseenInit;
    BADGES.forEach(function (b) { if (b.f(st) && !seen[b.id]) { seen[b.id] = 1; if (!first) fresh.push(b); } });
    S.bseenInit = 1; if (!silent || fresh.length || first) save();
    return fresh;
  }
  /* semana actual (lunes a domingo): entrenamientos hechos */
  function weekKey() { var d = new Date(), wd = (d.getDay() + 6) % 7; d.setDate(d.getDate() - wd); return dstr(d); }
  function weekCount() {
    var d = new Date(), wd = (d.getDay() + 6) % 7, n = 0, i; d.setDate(d.getDate() - wd);
    for (i = 0; i < 7; i++) { var r = S.days[dstr(d)]; if (r && r.w > 0) n++; d.setDate(d.getDate() + 1); }
    return n;
  }
  /* congelamiento automático: si ayer faltaste y anteayer entrenaste, un congelamiento mantiene la racha (2 por mes) */
  function autoFreeze() {
    var t = dnum(today()), y = nstr(t - 1), pn = t - 2, mk = today().slice(0, 7); while (isRestN(pn) && t - pn < 8) pn--; var yy = nstr(pn);
    if (S.freeze.m !== mk) S.freeze = { m: mk, used: 0 };
    if (!S.days[y] && !isRestN(t - 1) && S.days[yy] && !S.days[yy].freeze && S.freeze.used < 2) {
      S.days[y] = { w: 0, sec: 0, sets: 0, freeze: true }; S.freeze.used++; save(); return true;
    }
    return false;
  }
  function cheer(cur) {
    var M = { 1: '¡Primer paso dado! Lo difícil es empezar 💙', 3: '¡3 días seguidos! Se está formando el hábito 🌱', 7: '¡Una semana completa! Eres imparable 🚀', 14: '¡Dos semanas! Tu cuerpo ya lo nota 💪', 21: '¡21 días! Esto ya es un hábito 🏅', 30: '¡UN MES! Eres una leyenda 👑' };
    if (M[cur]) return M[cur];
    var G = ['¡Buen trabajo! Cada día cuenta 💪', 'Constancia sobre intensidad. ¡Así se hace! 🔥', 'Tu yo de dentro de un mes te lo agradece 🙌', '¡Otro día más sumando! 🌟', 'Descansa, come bien y duerme: ahí crecen los músculos 😴'];
    return G[(S.total + cur) % G.length];
  }
  function addXP(n) { var a = levelOf(S.xp); S.xp += n; var b = levelOf(S.xp); return b > a ? b : 0; }
  function hab() { var d = today(); return S.habits[d] || (S.habits[d] = { w: 0, p: 0, s: 0, sl: 0 }); }
  function habCount(h) { return (h.w ? 1 : 0) + (h.p ? 1 : 0) + (h.s ? 1 : 0) + (h.sl >= 8 ? 1 : 0); }

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
  /* recordatorio inteligente: aprende a qué hora entrenas y avisa un poco antes */
  function smartMin() {
    var h = (S.hrs || []).slice(-14);
    if (h.length < 3) return null;
    h = h.slice().sort(function (x, y) { return x - y; });
    var med = h[Math.floor(h.length / 2)];
    return Math.max(360, Math.min(1290, med - 20));
  }
  function remTime() {
    var sm = S.settings.smart ? smartMin() : null;
    return sm == null ? { h: S.settings.rh, m: S.settings.rm, smart: false } : { h: Math.floor(sm / 60), m: sm % 60, smart: true };
  }
  function syncReminder() {
    try {
      if (!AND() || !AND().setReminder) return;
      try { if (AND().setTrainDays) AND().setTrainDays(tdMask()); } catch (e) { }
      var st = stats(), msg = st.cur > 0 ? '¡Mantén tu racha de ' + st.cur + ' día' + (st.cur > 1 ? 's' : '') + '! 🔥 Hoy toca entrenar.' : '¡Es hora de entrenar! Empieza tu racha hoy 💪';
      var nb = nextStreak(st); if (nb && nb.left <= 3 && st.cur > 0) msg = '🔥 Racha de ' + st.cur + ' días: ' + (nb.left === 1 ? 'mañana' : 'en ' + nb.left + ' días') + ' ganas la insignia de ' + nb.n + '.';
      var last = Object.keys(S.days).sort().pop() || '', rt = remTime();
      AND().setReminder(!!S.settings.rem, rt.h, rt.m, msg, last);
    } catch (e) { }
    syncWidget();
  }
  var NOTIF_MSGS = ['¡Es hora de entrenar! 💪', 'Tu racha de {n} días te espera 🔥', 'Hoy bastan 15 minutos. ¡Tú puedes! 🙌', '¡Hoy toca crecer! 🌱',
    'Un día más suma. ¡Vamos! ⚡', 'Tu cuerpo te lo agradecerá 😎', 'No rompas tu racha de {n} días 🔥', 'Haz tu chequeo de postura de 2 minutos 🧍'];
  function lastKeys() {
    var ks = Object.keys(S.days).sort(), i, lw = '';
    for (i = ks.length - 1; i >= 0; i--) if (S.days[ks[i]].w > 0) { lw = ks[i]; break; }
    return { any: ks.length ? ks[ks.length - 1] : '', w: lw };
  }
  function todayRoutineId() { var tp = todayPlan(); return tp ? (tp.t === 'R' ? 'P' : tp.t) : nextId(); }
  function syncWidget() {
    try {
      var a = AND(); if (!a) return;
      var st = stats(), k = lastKeys();
      if (a.updateWidget) a.updateWidget(st.cur, k.any, k.w, rdef(todayRoutineId()).name);
      if (a.updateWidget2) {
        var ks = Object.keys(S.days).sort().slice(-62), dates = [], fz = [], lv = levelOf(S.xp || 0), x0 = xpAt(lv), x1 = xpAt(lv + 1), acc = '#4aa8ff';
        ks.forEach(function (d) { if (S.days[d].w > 0) dates.push(d); else if (S.days[d].freeze) fz.push(d); });
        try { var cs = getComputedStyle(document.documentElement).getPropertyValue('--acc').trim(); if (/^#[0-9a-f]{6}$/i.test(cs)) acc = cs; } catch (e) { }
        a.updateWidget2(JSON.stringify({ dates: dates, fz: fz, goal: S.settings.goal, wc: weekCount(), lvl: lv, xp: Math.round((S.xp - x0) / (x1 - x0) * 100), best: st.best, hbd: S.hb ? hbTodayDone() : 0, hbt: S.hb ? hbActive().length : 0, acc: acc, ln: lvlName(lv),
          ch: S.chal ? { n: CHALLENGES[S.chal.id].n.replace('Reto de ', '').replace('Reto ', ''), day: chalNext(), d: Object.keys(S.chal.done).filter(function (k) { return S.chal.done[k]; }).map(Number) } : null,
          hb: S.hb ? hbActive().slice(0, 4).map(function (id) { return { n: hbInfo(id).n, ok: hbDone(today(), id) ? 1 : 0 }; }) : [] }));
      }
      if (a.setReminderPlus) a.setReminderPlus(!!S.settings.risk, JSON.stringify(NOTIF_MSGS));
    } catch (e) { }
  }
  // botón "Empezar" de la notificación
  window.__startToday = function () {
    if (P || $('#ob')) return;
    sheetClose(); dialogClose(); startWorkout(todayRoutineId());
  };

  /* ---------- estadísticas anónimas (solo si el usuario acepta) ----------
     Se envía: un código aleatorio, versión de la app, tema, nivel, racha, nº de entrenamientos
     y cuántas veces hace cada rutina. NUNCA nombre, medidas, notas, fotos ni el código de la copia. */
  var stat = { last: 0, errs: 0, opened: 0 };
  function statsOn() { return !!(CLOUD_URL && S && S.settings.stats === true); }
  function rnd(n) { var al = 'abcdefghijklmnopqrstuvwxyz0123456789', a = new Uint8Array(n), o = '', i; (window.crypto || window.msCrypto).getRandomValues(a); for (i = 0; i < n; i++) o += al[a[i] % al.length]; return o; }
  function sid() { if (!S.sid) { S.sid = rnd(24); S.sfirst = Date.now(); save(); } return S.sid; }
  function androidVer() { var m = /Android (\d+)/.exec(navigator.userAgent || ''); return m ? +m[1] : 0; }
  function statsDoc() {
    var st = stats(), cnt = {};
    S.log.forEach(function (l) { var k = 'r_' + (/^U\d+/.test(l.id) ? 'U' : l.id); cnt[k] = (cnt[k] || 0) + 1; });
    var doc = { first: S.sfirst || Date.now(), last: Date.now(), apk: apkName(), apkc: apkCode(), web: window.APP_VERSION || 0, src: window.__src || '', and: androidVer(),
      theme: S.settings.theme, mode: S.settings.mode, lvl: st.lvl, tot: S.total, str: st.cur, best: st.best, cloud: !!(S.cloud && S.cloud.code), plan: !!S.plan, nj: !!S.settings.nojump, rem: !!S.settings.rem };
    Object.keys(cnt).forEach(function (k) { doc[k] = cnt[k]; });
    return doc;
  }
  function statsPing(force) {
    if (!statsOn()) return;
    if (!force && Date.now() - stat.last < 30 * 60 * 1000) return;
    stat.last = Date.now();
    try { fetch(CLOUD_URL + '/stats/installs/' + sid() + '.json', { method: 'PUT', body: JSON.stringify(statsDoc()), keepalive: true }); } catch (e) { }
  }
  function statEvent(k, x) {
    if (!statsOn()) return;
    var o = { t: Date.now(), k: k, i: sid().slice(0, 8), a: apkName(), w: window.APP_VERSION || 0 }, n;
    if (x) for (n in x) o[n] = (typeof x[n] === 'string') ? x[n].slice(0, 150) : x[n];
    try { fetch(CLOUD_URL + '/stats/events.json', { method: 'POST', body: JSON.stringify(o), keepalive: true }); } catch (e) { }
  }
  function statsDelete() { try { if (S.sid && CLOUD_URL) fetch(CLOUD_URL + '/stats/installs/' + S.sid + '.json', { method: 'DELETE' }); } catch (e) { } }
  function statsStart() {
    if (!statsOn()) return;
    statsPing(true);
    if (Date.now() - (S.sopen || 0) > 6 * 3600 * 1000) { S.sopen = Date.now(); save(); statEvent('open'); }
    if (S.updTry) {   // ¿se aplicó la actualización que se pidió?
      var u = S.updTry; S.updTry = null; save();
      if ((window.APP_VERSION || 0) > u.from) statEvent('upd_applied', { f: u.from, to: window.APP_VERSION });
      else if (Date.now() - u.t < 3 * 86400000) statEvent('upd_noapply', { f: u.from, src: window.__src || '' });
    }
  }
  window.addEventListener('error', function (e) {
    if (stat.errs++ < 5) statEvent('err', { m: String(e.message || e).slice(0, 140), l: (e.lineno || 0) });
  });
  function askStats(tries) {
    if (!CLOUD_URL || !S.setup || S.settings.stats !== undefined) return;
    if (P || $('#ob') || $('#modal').className === 'on' || $('#splash')) { if ((tries || 0) < 6) setTimeout(function () { askStats((tries || 0) + 1); }, 7000); return; }
    var m = $('#modal');
    m.innerHTML = '<div class="dlg"><h3>📊 Ayúdanos a mejorar</h3><p class="mut" style="line-height:1.5">¿Quieres enviar <b>estadísticas anónimas</b>? Solo se manda un código aleatorio, la versión de la app, tu nivel, racha y cuántos entrenamientos haces. <b>Nunca</b> tu nombre, medidas, notas ni datos personales. Puedes cambiarlo cuando quieras en Ajustes.</p>' +
      '<div class="row" style="margin-top:18px"><button class="btn ghost sm sp" data-a="statsno">No, gracias</button><button class="btn sm sp" data-a="statsyes">Permitir</button></div></div>';
    m.className = 'on';
  }

  /* ---------- efectos ---------- */
  var fx = { hab: null, tab: false };
  function countUp(el, to) {
    if (!el || to <= 0) return;
    var t0 = performance.now(), dur = 700;
    el.textContent = '0';
    (function step(now) {
      var k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(to * e);
      if (k < 1 && document.body.contains(el)) requestAnimationFrame(step); else el.textContent = to;
    })(t0);
  }
  function confetti() {
    var o = $('#overlay'); if (!o || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    var box = document.createElement('div'); box.className = 'confetti';
    var cols = [accent(), window.FigColors.dark, '#ff8a3d', '#ffd166', '#c084fc', '#ff6fa8'], i;
    for (i = 0; i < 46; i++) {
      var p = document.createElement('i');
      p.style.left = Math.random() * 100 + '%';
      p.style.background = cols[i % cols.length];
      p.style.animationDelay = (Math.random() * 0.6) + 's';
      p.style.animationDuration = (1.8 + Math.random() * 1.6) + 's';
      p.style.transform = 'rotate(' + Math.round(Math.random() * 360) + 'deg)';
      p.style.width = (6 + Math.random() * 6) + 'px'; p.style.height = (9 + Math.random() * 8) + 'px';
      box.appendChild(p);
    }
    o.appendChild(box); setTimeout(function () { if (box.parentNode) box.parentNode.removeChild(box); }, 4200);
  }

  /* ---------- copia en la nube (Firebase Realtime Database) ----------
     Los datos se guardan cifrados con tu código; sin el código no se pueden leer. */
  function cloudCfg() { if (!S.cloud) S.cloud = { code: '', auto: true, last: 0 }; return S.cloud; }
  function cyrb(str, seed) {
    var h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed, i, ch;
    for (i = 0; i < str.length; i++) { ch = str.charCodeAt(i); h1 = Math.imul(h1 ^ ch, 2654435761); h2 = Math.imul(h2 ^ ch, 1597334677); }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return ('00000000' + (h2 >>> 0).toString(16)).slice(-8) + ('00000000' + (h1 >>> 0).toString(16)).slice(-8);
  }
  function cloudId(code) { var c = 'id:' + code; return cyrb(c, 1) + cyrb(c, 2) + cyrb(c, 3); }
  function genCode() {
    var al = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', a = new Uint8Array(16), o = '', i;
    (window.crypto || window.msCrypto).getRandomValues(a);
    for (i = 0; i < 16; i++) { o += al[a[i] % al.length]; if (i % 4 === 3 && i < 15) o += '-'; }
    return o;
  }
  function b64(buf) { var a = new Uint8Array(buf), s2 = '', i; for (i = 0; i < a.length; i++) s2 += String.fromCharCode(a[i]); return btoa(s2); }
  function unb64(str) { var s2 = atob(str), a = new Uint8Array(s2.length), i; for (i = 0; i < s2.length; i++) a[i] = s2.charCodeAt(i); return a; }
  function hasCrypto() { return !!(window.crypto && crypto.subtle && window.TextEncoder); }
  function cloudKey(code) {
    var te = new TextEncoder();
    return crypto.subtle.importKey('raw', te.encode(code), 'PBKDF2', false, ['deriveKey']).then(function (k) {
      return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: te.encode('crece-fit-v1'), iterations: 100000, hash: 'SHA-256' }, k, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
    });
  }
  function pack(json, code) {
    if (!hasCrypto()) return Promise.resolve({ v: 0, d: btoa(unescape(encodeURIComponent(json))), t: Date.now() });
    var iv = crypto.getRandomValues(new Uint8Array(12));
    return cloudKey(code).then(function (k) { return crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, k, new TextEncoder().encode(json)); })
      .then(function (ct) { return { v: 1, iv: b64(iv), d: b64(ct), t: Date.now() }; });
  }
  function unpack(o, code) {
    if (o.v === 0) return Promise.resolve(decodeURIComponent(escape(atob(o.d))));
    if (!hasCrypto()) return Promise.reject(new Error('Este teléfono no puede descifrar la copia'));
    return cloudKey(code).then(function (k) { return crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(o.iv) }, k, unb64(o.d)); })
      .then(function (pt) { return new TextDecoder().decode(pt); }, function () { throw new Error('Código incorrecto'); });
  }
  function cloudSave(silent) {
    var c = cloudCfg();
    if (!CLOUD_URL || !c.code) return Promise.resolve(false);
    var snap = JSON.parse(JSON.stringify(S)); delete snap.cloud;
    return pack(JSON.stringify(snap), c.code).then(function (obj) {
      return fetch(CLOUD_URL + '/b/' + cloudId(c.code) + '.json', { method: 'PUT', body: JSON.stringify(obj) });
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      c.last = Date.now(); save(); if (!silent) toast('☁️ Copia guardada'); return true;
    }).catch(function (e) { if (!silent) toast('No se pudo guardar: ' + (e && e.message || e)); return false; });
  }
  function cloudOn() {
    if (!CLOUD_URL) return;
    var c = cloudCfg(); c.code = genCode(); c.auto = true; save();
    cloudSave(false).then(function (ok) { if (!ok) { c.code = ''; save(); } else statEvent('cloud_on'); render(); });
  }
  function cloudOff() {
    var c = cloudCfg(), id = cloudId(c.code);
    try { fetch(CLOUD_URL + '/b/' + id + '.json', { method: 'DELETE' }); } catch (e) { }
    c.code = ''; c.last = 0; save(); toast('Copia en la nube desactivada'); render();
  }
  function cloudFind(raw) {
    var code = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (code.length !== 16) { toast('El código tiene 16 letras y números'); return; }
    code = code.replace(/(.{4})(?=.)/g, '$1-');
    toast('Buscando…');
    fetch(CLOUD_URL + '/b/' + cloudId(code) + '.json').then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (o) { if (!o) throw new Error('No hay ninguna copia con ese código'); return unpack(o, code); })
      .then(function (txt) {
        var data = JSON.parse(txt);
        if (!data || !data.settings || !data.days) throw new Error('La copia no es válida');
        var n = data.total || 0;
        sheetClose();
        dialog('Copia encontrada ☁️', 'Tiene ' + n + ' entrenamiento' + (n === 1 ? '' : 's') + ' y nivel ' + levelOf(data.xp || 0) + '. Al restaurar se <b>reemplazan los datos de este teléfono</b>. ¿Continuar?', 'Restaurar', function () {
          data.cloud = { code: code, auto: true, last: Date.now() }; data.sid = S.sid; data.sfirst = S.sfirst;
          S = data; save(); load(); save(); applyTheme(); toast('Datos restaurados ✅'); render(true); syncReminder();
        });
      }).catch(function (e) { toast(e && e.message || 'No se pudo restaurar'); });
  }
  function cloudAuto() {
    var c = cloudCfg();
    if (CLOUD_URL && c.code && c.auto && Date.now() - c.last > 20 * 3600 * 1000) cloudSave(true);
  }
  function cloudCard() {
    var c = cloudCfg(), h = '<div class="card"><b>☁️ Copia en la nube</b>';
    if (!CLOUD_URL) return h + '<p class="mut small" style="margin:6px 0 0;line-height:1.5">Aún no está configurada. Mientras tanto, usa la copia manual de abajo.</p></div>';
    if (!c.code) {
      return h + '<p class="mut small" style="margin:6px 0 12px;line-height:1.5">Guarda tu progreso en internet (cifrado) para recuperarlo si cambias de teléfono. Sin cuenta: solo necesitas un código.</p>' +
        '<div class="col"><button class="btn sm" data-a="cloudon">Activar</button><button class="btn sec sm" data-a="cloudrestore">Ya tengo un código</button></div></div>';
    }
    var d = c.last ? new Date(c.last) : null;
    return h + '<p class="mut small" style="margin:6px 0 8px">Tu código (guárdalo, lo necesitas en otro teléfono):</p>' +
      '<button class="codebox" data-a="cloudcopy">' + c.code + ' <span>📋</span></button>' +
      '<p class="mut small" style="margin:8px 0 12px">' + (d ? 'Última copia: ' + pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) : 'Aún sin copia') + '</p>' +
      '<div class="set" style="padding:6px 0"><div class="sp"><b>Guardar automáticamente</b><div class="mut small">Después de entrenar y una vez al día</div></div><div class="sw' + (c.auto ? ' on' : '') + '" data-a="cloudauto"></div></div>' +
      '<div class="col" style="margin-top:6px"><button class="btn sm" data-a="cloudsave">Guardar ahora</button><button class="btn sec sm" data-a="cloudrestore">Restaurar otro código</button><button class="btn ghost sm" data-a="cloudoff">Desactivar</button></div></div>';
  }

  /* ---------- tema y voz ---------- */
  function ensureBg() {
    var b = document.getElementById('bgfx');
    if (!b) { b = document.createElement('div'); b.id = 'bgfx'; b.innerHTML = '<i></i><i></i><i></i>'; document.body.insertBefore(b, document.body.firstChild); }
  }
  function applyTheme() {
    var st = S.settings, root = document.documentElement, mode = st.mode;
    if (mode === 'auto') mode = (window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
    root.setAttribute('data-mode', mode); root.setAttribute('data-theme', st.theme); root.setAttribute('data-style', st.style || 'classic'); root.setAttribute('data-fx', st.fx === false ? 'off' : 'on'); root.setAttribute('data-black', st.black ? 'on' : 'off');
    var weak = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || (navigator.deviceMemory && navigator.deviceMemory <= 3); root.setAttribute('data-perf', st.perf === 'low' || (st.perf !== 'high' && weak) ? 'low' : 'high');
    ensureBg();
    var cs = getComputedStyle(root), a = cs.getPropertyValue('--acc').trim(), b = cs.getPropertyValue('--acc2').trim();
    var light = mode === 'light';
    window.FigColors = { near: a, dark: b, far: light ? '#9aa4d0' : '#6f7bb5', ground: light ? '#b8c1e6' : '#39406b',
      wall: light ? '#c9d1f0' : '#2a3158', wallLine: light ? '#98a3d4' : '#5d68a8', shadow: light ? 'rgba(0,0,0,.12)' : 'rgba(0,0,0,.28)' };
    try { if (AND() && AND().bars) AND().bars(light ? '#f1f4ff' : (st.black ? '#000000' : '#0e1120'), light); } catch (e) { }
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

  /* ---------- objetivo, nivel y programa ---------- */
  var LEGACY = null;
  function defv(k) {
    var e = EX[k], lv = S.profile ? S.profile.level : 0, g = S.profile ? S.profile.goal : 'forma';
    if (e.type === 'time') {
      if (e.cat === 'Crecer' || e.cat === 'Movilidad') return [25, 35, 45][lv];
      return ({ musculo: [25, 35, 45], forma: [20, 30, 40], salud: [20, 25, 30], crecer: [25, 30, 40] }[g] || [20, 30, 40])[lv];
    }
    return ({ musculo: [8, 12, 15], forma: [10, 12, 15], salud: [8, 10, 12], crecer: [8, 10, 12] }[g] || [10, 12, 15])[lv];
  }
  function pickEx(cat, n, tag, lv, used, di) {
    var target = lv + 1, all = Object.keys(EX).filter(function (k) { return EX[k].cat === cat && !used[k]; });
    var pool = all.filter(function (k) { return EX[k].lv <= target; });
    if (pool.length < n) pool = all;
    function score(k) { var e = EX[k]; return Math.abs(e.lv - target) + (e.g.indexOf(tag) >= 0 ? 0 : 2) + (parseInt(cyrb(k + cat + di, 5).slice(0, 4), 16) / 65536) * 0.9; }
    pool.sort(function (a, b) { return score(a) - score(b); });
    return pool.slice(0, n);
  }
  function setsFor(goal, lv, cat) {
    if (cat === 'Crecer' || cat === 'Movilidad') return 1;
    return ({ musculo: [3, 3, 4], forma: [2, 3, 3], salud: [2, 2, 3], crecer: [2, 3, 3] }[goal] || [2, 3, 3])[lv];
  }
  function globalUsed(i) { return ''; }
  function applyProgram() {
    if (!LEGACY) LEGACY = clone(WORKOUTS);
    var p = S.profile;
    if (!p || !PROG_T[p.goal]) { ['A', 'B', 'C', 'D'].forEach(function (k) { WORKOUTS[k] = clone(LEGACY[k]); }); return; }
    var g = GOALS[p.goal], used;
    PROG_T[p.goal].forEach(function (day, i) {
      used = {}; var slots = [];
      day.picks.forEach(function (pk) {
        pickEx(pk[0], pk[1], g.tag, p.level, used, i + globalUsed(i)).forEach(function (k) { used[k] = 1; slots.push([k, setsFor(p.goal, p.level, pk[0])]); });
      });
      WORKOUTS['ABCD'[i]] = { name: day.name, emoji: day.emoji, desc: day.desc, slots: slots };
    });
  }
  function applyProfile(goal, level, resetLevels) {
    S.profile = { goal: goal, level: level };
    S.settings.rest = GOALS[goal].rest; S.settings.goal = GOALS[goal].days;
    if (resetLevels) initChains(level);
    S.rot = 0; applyProgram(); save();
  }

  /* ---------- rutinas ---------- */
  var CHAIN_KEYS = Object.keys(CHAINS);
  function curVar(key) {
    if (!CHAINS[key]) return { ex: key, val: (S.exv && S.exv[key]) || defv(key), type: EX[key].type };
    var c = S.chains[key], v = CHAINS[key][c.i]; return { ex: v.ex, val: c.v, type: EX[v.ex].type };
  }
  function targetTxt(ex, val, type) {
    type = type || EX[ex].type;
    return type === 'time' ? val + ' s' : val + ' rep' + (val > 1 ? 's' : '');
  }
  function quietSub(ex, val) {
    if (!S.settings.nojump || !NOISY[ex]) return { ex: ex, val: val };
    var m = NOISY[ex]; return { ex: m[0], val: Math.round(val * m[1]) };
  }
  function warmSet() { var w = S.settings.warm; if (S.settings.nojump && w === 'cardio') w = 'suave'; return WARM_SETS[w] || []; }
  function coolSet() { return COOL_SETS[S.settings.cool] || COOL_SETS.all; }
  function rdef(id) {
    var cd = chalDef(id); if (cd) return cd;
    if (WORKOUTS[id]) return WORKOUTS[id];
    if (QUICK[id]) return QUICK[id];
    if (id === 'S') return STRETCH_ROUTINE;
    if (id === 'P') return POSTURE_ROUTINE;
    for (var i = 0; i < S.custom.length; i++) {
      if (S.custom[i].id === id) return { name: S.custom[i].name, emoji: '🛠', desc: 'Rutina creada por ti.', slots: S.custom[i].slots, custom: true };
    }
    return WORKOUTS.A;
  }
  function isLight(id) { return id === 'S' || id === 'P'; }
  function stepOf(it, kind, label) {
    var q = quietSub(it.ex, it.val);
    return { k: 'ex', ex: q.ex, val: q.val, type: (q.ex === it.ex && it.type) ? it.type : EX[q.ex].type, kind: kind, label: label };
  }
  function build(id) {
    var steps = [], d = rdef(id), rest = d.rest || S.settings.rest;
    if (d.items) { d.items.forEach(function (it) { steps.push(stepOf(it, 'cool', d.label || 'Estiramiento')); }); return steps; }
    var warm = d.warm === false ? [] : (d.warm || warmSet()), cool = d.cool || coolSet();
    warm.forEach(function (it) { steps.push(stepOf(it, 'warm')); });
    if (warm.length) steps.push({ k: 'rest', secs: 15, title: 'Prepárate' });
    if (d.rounds) {
      d.rounds.forEach(function (r, i) {
        steps.push({ k: 'ex', ex: r.ex, val: r.val, type: EX[r.ex].type, kind: 'main', set: i + 1, sets: d.rounds.length, label: (d.rl || 'Round') + ' ' + (i + 1) + ' de ' + d.rounds.length });
        if (i < d.rounds.length - 1) steps.push({ k: 'rest', secs: d.rest || 20 });
      });
    }
    (d.slots || []).forEach(function (sl, si) {
      var cv = curVar(sl[0]), q = quietSub(cv.ex, cv.val), type = EX[q.ex].type;
      for (var n = 1; n <= sl[1]; n++) {
        steps.push({ k: 'ex', ex: q.ex, val: q.val, type: type, chain: CHAINS[sl[0]] ? sl[0] : null, key: sl[0], set: n, sets: sl[1], kind: 'main' });
        if (!(si === d.slots.length - 1 && n === sl[1])) steps.push({ k: 'rest', secs: rest });
      }
    });
    if (cool.length) {
      steps.push({ k: 'rest', secs: 20, title: 'Ahora, a estirar 🌱' });
      cool.forEach(function (it) { steps.push(stepOf(it, 'cool', 'Enfriamiento · Crecer')); });
    }
    return steps;
  }
  function estMin(steps) {
    var s = 0;
    steps.forEach(function (st) { if (st.k === 'rest') s += st.secs; else s += st.type === 'time' ? st.val + 4 : st.val * 3.5 + 6; });
    return Math.max(1, Math.round(s / 60));
  }
  function nextId() { return ORDER[S.rot % ORDER.length]; }
  function wInfo(id) { return rdef(id); }
  function mainList(id) {
    var d = rdef(id);
    if (d.items) return d.items.map(function (it) { var q = quietSub(it.ex, it.val); return { n: EX[q.ex].n, t: targetTxt(q.ex, q.val, (q.ex === it.ex && it.type) || null) }; });
    if (d.rounds) return d.rounds.map(function (r, i) { return { n: EX[r.ex].n, t: targetTxt(r.ex, r.val, EX[r.ex].type) }; });
    return d.slots.map(function (sl) { var cv = curVar(sl[0]), q = quietSub(cv.ex, cv.val); return { n: EX[q.ex].n, t: sl[1] + ' × ' + targetTxt(q.ex, q.val, EX[q.ex].type) }; });
  }
  /* plan de 4 semanas */
  function planIdx() { return S.plan ? dnum(today()) - dnum(S.plan.start) : -1; }
  function todayPlan() { var i = planIdx(); if (i < 0 || i >= 28) return null; return { i: i, t: PLAN_WEEK[i % 7] }; }

  function stepX(k) { return EX[k].type === 'time' ? 5 : 1; }
  function maxX(k) { return EX[k].type === 'time' ? 60 : 20; }
  function applyProgX(prev, done, mult) {
    var c = clone(prev);
    done.forEach(function (k) { var v = c[k] != null ? c[k] : defv(k); c[k] = Math.max(3, Math.min(maxX(k), v + Math.round(stepX(k) * mult))); });
    return c;
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
  var TICON = {
    home: '<svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M10 20v-5h4v5"/></svg>',
    ex: '<svg viewBox="0 0 24 24"><path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/></svg>',
    food: '<svg viewBox="0 0 24 24"><path d="M7 3v8a2 2 0 0 0 2 2v8M11 3v8a2 2 0 0 1-2 2M9 3v6"/><path d="M17 21V3c-2.5 1.5-3.5 4.5-3.5 8H17"/></svg>',
    prog: '<svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/></svg>',
    set: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1"/></svg>'
  };
  function tabsHTML() {
    var T = [['home', '🏠', 'Inicio'], ['ex', '🏋️', 'Ejercicios'], ['food', '🍽', 'Comida'], ['prog', '📈', 'Progreso'], ['set', '⚙️', 'Ajustes']];
    return '<div class="tabs">' + T.map(function (t) {
      return '<button class="tab' + (tab === t[0] ? ' on' + (fx.tab ? ' pop' : '') : '') + '" data-a="tab" data-v="' + t[0] + '"><span class="i">' + (TICON[t[0]] || t[1]) + '</span>' + t[2] + '</button>';
    }).join('') + '</div>';
  }

  function weekStrip() {
    var d = new Date(), wd = (d.getDay() + 6) % 7, out = '', i;
    d.setDate(d.getDate() - wd);
    for (i = 0; i < 7; i++) {
      var k = dstr(d), r = S.days[k], done = !!(r && r.w > 0), fr = !!(r && r.freeze), isT = k === today(), rs = !done && isRestN(dnum(k));
      out += '<div class="wd' + (done ? ' done' : '') + (fr ? ' fz' : '') + (isT ? ' today' : '') + (rs ? ' rest' : '') + '">' + DAYS[i] + '<div class="dot">' + (done ? '✓' : fr ? '❄️' : '') + '</div></div>';
      d.setDate(d.getDate() + 1);
    }
    return '<div class="week">' + out + '</div>';
  }
  function miniRow(attrs, e, name, sub) { return '<button class="mini" ' + attrs + '><span class="e">' + e + '</span><span class="mt"><b>' + name + '</b><span>' + sub + '</span></span><i class="chev">›</i></button>'; }
  function mini(id, e, name, sub) { return miniRow('data-a="prev" data-v="' + id + '"', e, name, sub); }

  /* ---------- secciones con pestañas (se cambian tocando o deslizando) ---------- */
  var pst = { home: 'hoy', prog: 'resumen', ex: 'Piernas', food: 'plan' }, setSec = null;
  var PKEYS = { home: ['hoy', 'retos', 'avance', 'habitos', 'rutinas'], prog: ['resumen', 'calendario', 'medidas', 'nivel', 'logros'], ex: ['Piernas', 'Pecho y brazos', 'Core', 'Espalda', 'Cardio', 'Boxeo', 'Cara', 'Crecer', 'Movilidad'], food: ['plan', 'menu', 'rec', 'ali', 'tip'] };
  function segTabs(g, items) {
    return '<div class="seg2" data-g="' + g + '">' + items.map(function (it) {
      return '<button class="' + (pst[g] === it[0] ? 'on' : '') + '" data-a="pn" data-v="' + g + ':' + it[0] + '">' + it[1] + '</button>';
    }).join('') + '</div>';
  }
  function panelHTML(g) { return g === 'food' ? foodPanel(pst.food) : g === 'home' ? homePanel(pst.home) : g === 'prog' ? progPanel(pst.prog) : exPanel(pst.ex); }
  function mountThumbs() {
    var list = Array.prototype.slice.call(document.querySelectorAll('svg[data-fig]')), i = 0;
    function one(el) {
      if (!el.isConnected || el.firstChild) return;
      var a = ANIMS[EX[el.getAttribute('data-fig')].anim];
      new Fig(el, Object.assign({}, a, { poses: [a.poses[a.poses.length > 1 ? 1 : 0]] }), { still: true });
    }
    list.slice(0, 8).forEach(one); i = 8;
    (function chunk() { var n = 0; while (i < list.length && n < 4) { one(list[i++]); n++; } if (i < list.length) requestAnimationFrame(chunk); })();
  }
  function switchPanel(g, key) {
    var ks = PKEYS[g], from = ks.indexOf(pst[g]), to = ks.indexOf(key), el = $('#pnl');
    if (to < 0 || to === from) return;
    pst[g] = key;
    if (!el) { render(true); return; }
    var seg = document.querySelector('.seg2[data-g="' + g + '"]');
    if (seg) Array.prototype.forEach.call(seg.children, function (b) {
      var on = b.getAttribute('data-v') === g + ':' + key; b.classList.toggle('on', on);
      if (on) { try { seg.scrollTo({ left: b.offsetLeft - 20, behavior: 'smooth' }); } catch (e) { } }
    });
    destroyFigs();
    el.classList.remove('sl', 'sr'); el.innerHTML = panelHTML(g); void el.offsetWidth; el.classList.add(to >= from ? 'sl' : 'sr');
    $('#view').scrollTop = 0;
    mountThumbs();
    Array.prototype.forEach.call(document.querySelectorAll('.sumgrid b'), function (b) { if (/^\d+$/.test(b.textContent)) countUp(b, +b.textContent); });
  }

  /* ---------- INICIO ---------- */
  function homeCtx() {
    var tp = todayPlan();
    return { st: stats(), tp: tp, id: tp ? (tp.t === 'R' ? null : tp.t) : nextId(), left: S.freeze.m === today().slice(0, 7) ? 2 - S.freeze.used : 2 };
  }
  function homeV() {
    var c = homeCtx(), st = c.st, name = S.name ? ', ' + esc(S.name) : '';
    var msg = st.doneToday ? '¡Hoy ya cumpliste! 🎉' : (st.cur > 0 ? 'Entrena hoy para mantener tu racha' : 'Empieza tu racha hoy');
    var h = '';
    if (!S.profile) h += '<div class="card" style="border:1px solid var(--acc)"><b>🎯 Elige tu objetivo y nivel</b><p class="mut small" style="margin:4px 0 10px">Armamos tus rutinas según lo que quieras lograr: músculo, forma, salud o crecer.</p><button class="btn sm" data-a="profopen">Elegir ahora</button></div>';
    if (apkInfo && (apkReq || S.apkDismiss !== apkInfo.code)) {
      h += '<div class="card apkb"><div class="row"><div style="font-size:32px">📲</div><div class="sp"><b>' + (apkReq ? 'Necesitas instalar la nueva versión' : 'Nueva versión del APK: v' + esc(apkInfo.version)) + '</b><div class="mut small">' + esc(apkInfo.notes && apkInfo.notes[0] ? apkInfo.notes[0] : 'Descárgala desde la página y instálala encima. No pierdes tu progreso.') + '</div></div></div>' +
        '<div class="row" style="margin-top:12px">' + (apkReq ? '' : '<button class="btn ghost sm sp" data-a="apkno">Después</button>') + '<button class="btn sm sp" data-a="gosite">🌐 Ir a descargar</button></div></div>';
    }
    var hr = new Date().getHours(), gr = hr < 6 ? ['Buenas noches', '🌙'] : hr < 12 ? ['Buenos días', '☀️'] : hr < 19 ? ['Buenas tardes', '🌤'] : ['Buenas noches', '🌙'];
    var wc = weekCount(), wg = S.settings.goal, wp = Math.min(1, wc / wg), C = 2 * Math.PI * 26, lv = levelOf(S.xp || 0);
    h += '<div class="hero"><div class="hg"><div class="hs">' + gr[1] + ' ' + gr[0] + '</div><div class="title" style="margin-top:2px">¡Hola' + name + '!</div>' +
      '<div class="chips" style="margin-top:8px"><span class="chip on">⭐ Nivel ' + lv + '</span>' + (S.profile ? '<span class="chip">' + GOALS[S.profile.goal].e + ' ' + GOALS[S.profile.goal].n + '</span>' : '') + '</div></div>' +
      '<div class="hring"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" class="t"/><circle cx="32" cy="32" r="26" class="p" style="stroke-dasharray:' + C.toFixed(1) + ';stroke-dashoffset:' + (C * (1 - wp)).toFixed(1) + '"/></svg><div class="tx"><b>' + wc + '/' + wg + '</b><span>semana</span></div></div></div>';
    h += '<div class="card streak sm' + (st.cur ? '' : ' off') + '" style="margin-top:12px"><div class="row"><div class="flame">🔥</div><div class="num">' + st.cur + '</div>' +
      '<div class="sp"><b>' + (st.cur === 1 ? 'día seguido' : 'días seguidos') + '</b><div class="small" style="color:var(--st-t);font-weight:700">' + msg + '</div></div>' +
      '<div style="text-align:right"><div class="mut small">Mejor</div><b style="font-size:20px">' + st.best + '</b></div></div>' + weekStrip() + '</div>';
    h += segTabs('home', [['hoy', '⚡ Hoy'], ['retos', '🏆 Retos'], ['avance', '⭐ Avance'], ['habitos', '✅ Hábitos'], ['rutinas', '🏋️ Rutinas']]);
    return h + '<div class="pnl" id="pnl" data-g="home">' + homePanel(pst.home) + '</div>';
  }
  function homePanel(k) {
    var c = homeCtx(), st = c.st, tp = c.tp, id = c.id, h = '';
    if (k === 'hoy') {
      var planTag = tp ? '<span class="chip">📅 Plan · día ' + (tp.i + 1) + '/28</span>' : '';
      if (!st.doneToday && isRestN(dnum(today()))) h += '<div class="card" style="border:1px solid var(--acc)"><b>😴 Hoy es tu día de descanso</b><div class="mut small" style="margin-top:4px;line-height:1.45">Tus días de entrenamiento: <b style="color:var(--txt)">' + tdaysText() + '</b>. Si quieres, puedes entrenar igual: tu racha no se rompe ni por entrenar ni por descansar.</div></div>';
      if (st.doneToday) {
        h += '<div class="card wcard"><div style="font-size:19px;font-weight:900">Hoy ya entrenaste ✅</div><p class="mut small" style="margin:6px 0 12px">Descansa: los músculos crecen mientras duermes. Si quieres, haz algo suave para tu postura.</p>' +
          '<div class="col"><button class="btn sec" data-a="start" data-v="P">🧍 Postura (2 min)</button><button class="btn sec" data-a="start" data-v="S">🌱 Estirar (6 min)</button></div>' +
          '<div class="mut small" style="margin-top:12px">Siguiente rutina: <b style="color:var(--txt)">' + WORKOUTS[nextId()].name + '</b></div></div>';
      } else if (!id) {
        h += '<div class="card wcard"><div class="row"><div class="big">🛌</div><div><div class="mut small" style="font-weight:800">PLAN · DÍA ' + (tp.i + 1) + '/28</div><div style="font-size:21px;font-weight:900">Descanso activo</div></div></div>' +
          '<p class="mut small" style="margin:10px 0 12px">Hoy toca descansar los músculos. Haz un chequeo de postura de 2 minutos y mantienes tu racha.</p>' +
          '<div class="col"><button class="btn" data-a="start" data-v="P">🧍 Postura (2 min)</button><button class="btn sec" data-a="start" data-v="S">🌱 Estirar</button></div></div>';
      } else {
        var w = rdef(id), steps = build(id), cnt = w.items ? w.items.length : w.rounds ? w.rounds.length : w.slots.length;
        h += '<div class="card wcard"><div class="row"><div class="big">' + w.emoji + '</div><div><div class="mut small" style="font-weight:800">RUTINA DE HOY</div><div style="font-size:21px;font-weight:900">' + w.name + '</div></div></div>' +
          '<div class="row" style="margin:12px 0 4px;flex-wrap:wrap"><span class="chip">⏱ ~' + estMin(steps) + ' min</span><span class="chip">📋 ' + cnt + ' ejercicios</span>' + planTag + (S.settings.nojump ? '<span class="chip">🤫 Sin saltos</span>' : '') + '</div>' +
          '<div class="exl">' + mainList(id).map(function (x) { return '<div class="li"><b>' + x.n + '</b><span>' + x.t + '</span></div>'; }).join('') + '</div>' +
          '<div style="margin-top:14px"><button class="btn" data-a="start" data-v="' + id + '">▶ Empezar</button></div>' +
          '<div class="set" style="border:0;padding:12px 0 0"><div class="sp"><b>🙌 Modo manos libres</b><div class="mut small">La voz cuenta y avanza sola</div></div>' + sw('hands') + '</div></div>';
      }
    } else if (k === 'retos') {
      h += chalPanel();
    } else if (k === 'avance') {
      var lv = st.lvl, a = xpAt(lv), b = xpAt(lv + 1), wc = weekCount(), g = S.settings.goal;
      h += '<div class="card"><div class="row"><div class="lvl">⭐ ' + lv + '</div><div class="sp"><b>' + lvlName(lv) + '</b><div class="mut small">' + S.xp + ' / ' + b + ' XP</div></div></div>' +
        '<div class="xpbar"><i style="width:' + Math.round((S.xp - a) / (b - a) * 100) + '%"></i></div>' +
        '<div class="row" style="margin-top:16px"><b>🎯 Meta semanal</b><div class="sp"></div><b>' + Math.min(wc, g) + '/' + g + ' días</b></div>' +
        '<div class="xpbar"><i style="width:' + Math.min(100, Math.round(wc / g * 100)) + '%"></i></div>' +
        (wc >= g ? '<div class="small" style="margin-top:6px;color:var(--acc);font-weight:800">¡Meta cumplida esta semana! 🎉</div>' : '') + '</div>';
      h += '<div class="card"><div class="row"><div style="font-size:26px">❄️</div><div class="sp"><b>' + c.left + ' congelamiento' + (c.left === 1 ? '' : 's') + ' este mes</b><div class="mut small">Salvan tu racha si faltas un día.</div></div></div></div>';
      h += '<button class="mini" data-a="planopen" style="width:100%;margin-bottom:12px"><span class="e">📅</span><span class="mt"><b>Plan de 4 semanas</b><span>' + (tp ? 'Día ' + (tp.i + 1) + ' de 28' : 'Calendario listo para empezar') + '</span></span><i class="chev">›</i></button>';
      h += '<div class="card tip"><div class="mut small" style="font-weight:800;color:var(--acc)">💡 CONSEJO DEL DÍA</div><p style="margin-top:6px;line-height:1.45">' + TIPS[dnum(today()) % TIPS.length] + '</p></div>';
    } else if (k === 'habitos') {
      h += hbPanel();
    } else {
      h += '<div class="grid2">';
      ORDER.forEach(function (r) { h += mini(r, WORKOUTS[r].emoji, WORKOUTS[r].name, 'Rutina ' + r); });
      h += mini('Q5', '⏱', 'Rápida · 5 min', 'Poco tiempo') + mini('Q10', '⏲', 'Rápida · 10 min', 'Cardio + fuerza') +
        mini('P', '🧍', 'Postura', '2 min · racha') + mini('S', '🌱', 'Estiramientos', '6 min · racha') + '</div>';
      h += '<div class="h2">Clases de boxeo</div><div class="vlist">' + ['CL1', 'CL2', 'CL3', 'CL4', 'CL5'].map(qrow).join('') + '</div>';
      h += '<div class="h2">Cara y cuello</div><div class="vlist">' + ['F1', 'F2', 'F3'].map(qrow).join('') + '</div><button class="btn ghost" style="margin-top:10px" data-a="faceguide">Guía: qué sí funciona y qué no</button>';
      h += '<div class="h2">Mis rutinas</div><div class="grid2">' +
        S.custom.map(function (r) { return mini(r.id, '🛠', esc(r.name), r.slots.length + ' ejercicios'); }).join('') +
        miniRow('data-a="crnew"', '➕', 'Crear rutina', 'Elige ejercicios') + '</div>';
    }
    return h;
  }

  /* ---------- EJERCICIOS ---------- */
  var exQ = '';
  function norm(t) { return String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  var LVL_T = { 1: '🟢 Fácil', 2: '🟡 Medio', 3: '🔴 Difícil' };

  /* ---------- HÁBITOS ---------- */
  var hbView = 'hoy', hbCat = 'Cuerpo';
  function hbInit() {
    if (S.hb) return;
    var hb = { act: ['water', 'protein', 'sun', 'sleep'], custom: [], log: {} };
    Object.keys(S.habits || {}).forEach(function (d) {
      var o = S.habits[d], l = {}; if (o.w) l.water = 1; if (o.p) l.protein = 1; if (o.s) l.sun = 1; hb.log[d] = l;
    });
    S.hb = hb;
  }
  function hbInfo(id) {
    if (HABITS[id]) { var h = HABITS[id]; return { id: id, e: h[0], n: h[1], cat: h[2], why: h[3], how: h[4], sleep: h[5] === 's' }; }
    for (var i = 0; i < S.hb.custom.length; i++) if (S.hb.custom[i].id === id) { var c = S.hb.custom[i]; return { id: id, e: c.e, n: c.n, cat: c.cat || 'Disciplina', why: 'Un hábito creado por ti.', how: 'Hazlo siempre a la misma hora y en el mismo lugar.', custom: true }; }
    return null;
  }
  function hbDone(d, id) {
    if (id === 'sleep') return !!(S.habits[d] && S.habits[d].sl >= 8);
    return !!(S.hb.log[d] && S.hb.log[d][id]);
  }
  function hbActive() { return S.hb.act.filter(function (id) { return hbInfo(id); }); }
  function hbStreak(id) {
    var n = 0, k = dnum(today()); if (!hbDone(today(), id)) k--;
    while (hbDone(nstr(k), id) && n < 1000) { n++; k--; }
    return n;
  }
  function hbBest(id) {
    var best = 0, cur = 0, now = dnum(today()), i;
    for (i = 120; i >= 0; i--) { if (hbDone(nstr(now - i), id)) { cur++; if (cur > best) best = cur; } else cur = 0; }
    return best;
  }
  function hbRate(id, days) { var n = 0, i, now = dnum(today()); for (i = 0; i < days; i++) if (hbDone(nstr(now - i), id)) n++; return Math.round(n / days * 100); }
  function hbDayPct(d) { var a = hbActive(); if (!a.length) return 0; var n = 0; a.forEach(function (id) { if (hbDone(d, id)) n++; }); return n / a.length; }
  function hbTodayDone() { var a = hbActive(), n = 0; a.forEach(function (id) { if (hbDone(today(), id)) n++; }); return n; }
  function hbXP() {
    var a = hbActive(), h = hab();
    if (a.length >= 3 && hbTodayDone() === a.length && !h.xp) { h.xp = 1; var up = addXP(15); toast('✅ ¡Hábitos del día completos! +15 XP' + (up ? ' · ⭐ nivel ' + up : '')); }
  }
  function hbPerfect() { var n = 0, i, now = dnum(today()); for (i = 0; i < 28; i++) { var k = nstr(now - i), a = hbActive(); if (a.length && hbDayPct(k) === 1) n++; } return n; }
  function hbRecommended() {
    var g = S.profile ? S.profile.goal : 'forma', out = HPACKS.filter(function (p) { return p.goals.indexOf(g) >= 0; });
    return out.length ? out : [HPACKS[0]];
  }
  function hbRow(id) {
    var i = hbInfo(id), d = today(), done = hbDone(d, id), st = hbStreak(id);
    if (i.sleep) {
      var hs = (S.habits[d] && S.habits[d].sl) || 0;
      return '<div class="hbr' + (done ? ' on' : '') + '"><button class="hbi" data-a="hbi" data-v="' + id + '"><span class="e">' + i.e + '</span><span class="hbt"><b>' + i.n + '</b><span>' + (st ? '<i class="ic ic-flame"><svg viewBox="0 0 24 24"><path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.2 2-4.2.2 1.200.9 2 1.700 2.200C10.200 8.500 10.500 5.500 12 3z"/></svg></i> ' + st + ' días · ' : '') + 'Mínimo 8 h</span></span></button>' +
        '<button class="stp" data-a="slp" data-v="-1">−</button><b class="hbh">' + (hs ? hs + ' h' : '— h') + '</b><button class="stp" data-a="slp" data-v="1">+</button></div>';
    }
    return '<div class="hbr' + (done ? ' on' : '') + (fx.hab === id ? ' bn' : '') + '"><button class="hbi" data-a="hbi" data-v="' + id + '"><span class="e">' + i.e + '</span><span class="hbt"><b>' + i.n + '</b><span>' + (st ? '🔥 ' + st + (st === 1 ? ' día' : ' días') : i.cat) + '</span></span></button>' +
      '<button class="hbc" data-a="hbt" data-v="' + id + '" aria-label="Marcar"><i class="ck">✓</i></button></div>';
  }
  function hbPanel() {
    var h = '', V = [['hoy', 'Hoy'], ['exp', 'Explorar'], ['disc', 'Disciplina'], ['stat', 'Estadísticas']];
    h += '<div class="chips" style="margin-bottom:12px">' + V.map(function (v) { return '<button class="chip' + (hbView === v[0] ? ' on' : '') + '" data-a="hbv" data-v="' + v[0] + '">' + v[1] + '</button>'; }).join('') + '</div>';
    if (hbView === 'hoy') {
      var a = hbActive(), n = hbTodayDone(), pc = a.length ? n / a.length : 0, C = 2 * Math.PI * 26;
      if (!a.length) {
        h += '<div class="card"><b>Aún no tienes hábitos</b><p class="mut small" style="margin:4px 0 12px;line-height:1.5">Elige una de estas colecciones o explora la lista completa. Empieza con 2 o 3: menos es más.</p>' + hbPackCards(hbRecommended()) + '<button class="btn ghost sm" style="margin-top:8px" data-a="hbv" data-v="exp">Ver todos los hábitos</button></div>';
        return h;
      }
      h += '<div class="card wcard"><div class="row"><div class="hring"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" class="t"/><circle cx="32" cy="32" r="26" class="p" style="stroke-dasharray:' + C.toFixed(1) + ';stroke-dashoffset:' + (C * (1 - pc)).toFixed(1) + '"/></svg><div class="tx"><b>' + n + '/' + a.length + '</b><span>hoy</span></div></div>' +
        '<div class="sp"><b style="font-size:18px">' + (pc === 1 ? '¡Día perfecto!' : pc >= 0.5 ? 'Vas muy bien' : n ? 'Buen comienzo' : 'Empieza con uno pequeño') + '</b><div class="mut small" style="margin-top:3px;line-height:1.4">' + (pc === 1 ? 'Cumpliste todos tus hábitos de hoy. +15 XP' : 'Completa tus hábitos para ganar +15 XP.') + '</div></div></div></div>';
      h += '<div class="hblist">' + a.map(hbRow).join('') + '</div>';
      h += '<div class="row" style="margin-top:12px"><button class="btn sec sm sp" data-a="hbv" data-v="exp">Añadir hábitos</button><button class="btn ghost sm sp" data-a="hbnew">Crear el mío</button></div>';
      var hid = a[dnum(today()) % a.length], inf = hbInfo(hid);
      h += '<div class="card tip" style="margin-top:14px"><div class="mut small" style="font-weight:800;color:var(--acc)">💡 CÓMO LOGRARLO · ' + inf.n.toUpperCase() + '</div><p style="margin-top:6px;line-height:1.45">' + inf.how + '</p></div>';
      h += '<div class="card tip"><div class="mut small" style="font-weight:800;color:var(--acc)">🎯 RETO DE DISCIPLINA DE LA SEMANA</div><p style="margin-top:6px;line-height:1.45">' + DISC_WEEK[Math.floor(dnum(today()) / 7) % DISC_WEEK.length] + '</p></div>';
    } else if (hbView === 'exp') {
      var rec = hbRecommended();
      h += '<div class="h2">Recomendado para ti</div>' + hbPackCards(rec);
      h += '<div class="h2">Todas las colecciones</div>' + hbPackCards(HPACKS.filter(function (p) { return rec.indexOf(p) < 0; }));
      h += '<div class="h2">Biblioteca de hábitos</div><div class="chips" style="margin-bottom:10px">' + HCATS.map(function (c) { return '<button class="chip' + (hbCat === c ? ' on' : '') + '" data-a="hbcat" data-v="' + c + '">' + c + '</button>'; }).join('') + '</div>';
      h += Object.keys(HABITS).filter(function (id) { return HABITS[id][2] === hbCat; }).map(function (id) {
        var i = hbInfo(id), on = S.hb.act.indexOf(id) >= 0;
        return '<div class="hbx"><button class="hbi" data-a="hbi" data-v="' + id + '"><span class="e">' + i.e + '</span><span class="hbt"><b>' + i.n + '</b><span>' + i.why + '</span></span></button><button class="hba' + (on ? ' on' : '') + '" data-a="' + (on ? 'hbrm' : 'hbadd') + '" data-v="' + id + '" aria-label="' + (on ? 'Quitar' : 'Añadir') + '">' + (on ? '✓' : '+') + '</button></div>';
      }).join('');
      h += '<button class="btn ghost" style="margin-top:12px" data-a="hbnew">Crear un hábito propio</button>';
    } else if (hbView === 'disc') {
      h += '<div class="card wcard"><div class="mut small" style="font-weight:800">RETO DE LA SEMANA</div><div style="font-size:18px;font-weight:900;line-height:1.3;margin-top:6px">' + DISC_WEEK[Math.floor(dnum(today()) / 7) % DISC_WEEK.length] + '</div></div>';
      h += '<p class="mut small" style="margin:0 2px 10px;line-height:1.5">La disciplina se entrena como un músculo. Estas ideas funcionan de verdad:</p>';
      h += DISC.map(function (d) { return '<div class="card tipc" style="margin-bottom:10px"><div class="tipe">' + d[0] + '</div><div><b>' + d[1] + '</b><p class="mut small" style="margin:4px 0 8px;line-height:1.45">' + d[2] + '</p><div class="chip">Hazlo hoy: ' + d[3] + '</div></div></div>'; }).join('');
    } else {
      var a2 = hbActive(), now = dnum(today()), cells = '', i;
      if (!a2.length) return h + '<p class="mut">Añade hábitos para ver tus estadísticas.</p>';
      for (i = 27; i >= 0; i--) { var k = nstr(now - i), p = hbDayPct(k); cells += '<div class="hmc l' + (p === 0 ? 0 : p < 0.5 ? 1 : p < 1 ? 2 : 3) + (i === 0 ? ' td' : '') + '" title="' + k + '"></div>'; }
      var r7 = 0, r28 = 0; for (i = 0; i < 7; i++) r7 += hbDayPct(nstr(now - i)); for (i = 0; i < 28; i++) r28 += hbDayPct(nstr(now - i));
      h += '<div class="sumgrid"><div><b>' + hbPerfect() + '</b><span>Días perfectos (28 d)</span></div><div><b>' + Math.round(r7 / 7 * 100) + '%</b><span>Últimos 7 días</span></div><div><b>' + Math.round(r28 / 28 * 100) + '%</b><span>Últimos 28 días</span></div></div>';
      h += '<div class="h2">Últimos 28 días</div><div class="card"><div class="hmap">' + cells + '</div><div class="mut small" style="margin-top:10px">Más intenso = más hábitos cumplidos ese día.</div></div>';
      h += '<div class="h2">Por hábito</div><div class="card">' + a2.map(function (id) { var inf = hbInfo(id); return '<div class="li"><b>' + inf.e + ' ' + inf.n + '</b><span>racha ' + hbStreak(id) + ' · mejor ' + hbBest(id) + ' · ' + hbRate(id, 28) + '%</span></div>'; }).join('') + '</div>';
      var worst = a2.slice().sort(function (x, y) { return hbRate(x, 14) - hbRate(y, 14); })[0], wi = hbInfo(worst);
      h += '<div class="card tip"><div class="mut small" style="font-weight:800;color:var(--acc)">💡 RECOMENDACIÓN</div><p style="margin-top:6px;line-height:1.45">Tu hábito más difícil últimamente es <b>' + wi.n + '</b>. Hazlo más pequeño y ligado a algo que ya haces: ' + wi.how + '</p></div>';
    }
    return h;
  }
  function hbPackCards(list) {
    return list.map(function (p) {
      var have = p.ids.filter(function (id) { return S.hb.act.indexOf(id) >= 0; }).length, all = have === p.ids.length;
      return '<div class="card chc" style="--cc:74,168,255"><div class="row"><div class="chi">' + p.e + '</div><div class="sp"><b>' + p.n + '</b><div class="mut small" style="margin-top:2px">' + p.d + '</div></div></div><div class="chips" style="margin-top:10px">' + p.ids.map(function (id) { var i = HABITS[id]; return '<span class="chip">' + i[0] + ' ' + i[1] + '</span>'; }).join('') + '</div>' +
        '<button class="btn sm' + (all ? ' sec' : '') + '" style="margin-top:12px" data-a="hbpack" data-v="' + p.id + '">' + (all ? '✓ Ya los tienes' : 'Añadir colección') + '</button></div>';
    }).join('');
  }
  function hbSheet(id) {
    var i = hbInfo(id); if (!i) return;
    var on = S.hb.act.indexOf(id) >= 0, now = dnum(today()), dots = '', k;
    for (k = 13; k >= 0; k--) dots += '<span class="hbd' + (hbDone(nstr(now - k), id) ? ' on' : '') + '"></span>';
    sheet('<div class="rhead"><div class="rbig">' + i.e + '</div><div><div class="title" style="font-size:21px">' + i.n + '</div><div class="mut small">' + i.cat + '</div></div></div>' +
      '<div class="sumgrid" style="margin:12px 0"><div><b>' + hbStreak(id) + '</b><span>Racha</span></div><div><b>' + hbBest(id) + '</b><span>Mejor</span></div><div><b>' + hbRate(id, 28) + '%</b><span>Últimos 28 d</span></div></div>' +
      '<div class="hbdots">' + dots + '</div><div class="mut small" style="margin:4px 0 10px">Últimos 14 días</div>' +
      '<div class="h2">Por qué importa</div><p style="line-height:1.5;margin:0 0 10px">' + i.why + '</p><div class="h2">Cómo empezar</div><p style="line-height:1.5;margin:0 0 14px">' + i.how + '</p>' +
      '<div class="note">Truco: ' + (i.cat === 'Disciplina' ? 'cúmplelo aunque sea en versión mínima.' : 'ponle una hora y un lugar fijos.') + '</div>' +
      (on ? '<button class="btn ghost" style="margin-top:12px" data-a="hbrm" data-v="' + id + '">Quitar de mis hábitos</button>' : '<button class="btn" style="margin-top:12px" data-a="hbadd" data-v="' + id + '">Añadir a mis hábitos</button>'));
  }
  var HB_ICONS = ['🎯', '💪', '📖', '🧠', '💧', '🥩', '🧘', '🌱', '⚡', '🔥'];
  function hbNewSheet() {
    sheet('<div class="title">Crear hábito</div><label>Nombre</label><input type="text" id="hbn" maxlength="34" placeholder="Ej. Practicar guitarra 15 min"><label>Ícono</label><div class="chips" id="hbico" style="flex-wrap:wrap">' +
      HB_ICONS.map(function (e, i) { return '<button class="chip hic' + (i === 0 ? ' on' : '') + '" data-a="hbico" data-v="' + i + '">' + e + '</button>'; }).join('') + '</div><label>Categoría</label><div class="chips" style="flex-wrap:wrap">' +
      HCATS.map(function (c, i) { return '<button class="chip hcc' + (i === 3 ? ' on' : '') + '" data-a="hbcc" data-v="' + c + '">' + c + '</button>'; }).join('') + '</div><button class="btn" style="margin-top:16px" data-a="hbsave">Guardar</button>');
    hbNewSheet.ico = 0; hbNewSheet.cat = 'Disciplina';
  }

  /* ---------- retos de 30 días ---------- */
  var CHAL_ORDER = ['plank', 'push', 'squat', 'abs', 'box', 'face', 'grow'];
  window.CHAL_N = function () { return S && S.chalDone ? S.chalDone.length : 0; };
  function chalNext() { var c = S.chal; for (var d = 1; d <= 30; d++) if (!c.done[d]) return d; return 31; }
  function chalCount() { var n = 0; for (var d = 1; d <= 30; d++) if (S.chal.done[d]) n++; return n; }
  function chalFinish(id) {
    var m = /^CH:([a-z]+):(\d+)$/.exec(id), c = S.chal; if (!m || !c || c.id !== m[1]) return { xp: 0, msg: '' };
    var d = +m[2], first = !c.done[d], xp = 0, msg = '';
    if (first) { c.done[d] = today(); c.last = today(); xp = 25; msg = 'Reto · Día ' + d + ' de 30 completado (' + chalCount() + '/30)'; }
    else msg = 'Día ' + d + ' repetido';
    if (chalCount() >= 30 || (d === 30 && chalCount() >= 28)) {
      S.chalDone.push({ id: c.id, date: today() }); xp += 150; msg = '¡Reto de 30 días completado! ' + CHALLENGES[c.id].n + ' · +150 XP'; S.chal = null;
    }
    return { xp: xp, msg: msg };
  }
  function chalPanel() {
    var h = '', c = S.chal;
    if (!c) {
      h += '<p class="mut small" style="margin:0 2px 12px;line-height:1.5">Un reto, un objetivo: 30 días con una rutina corta cada día. Cada séptimo día es de descanso activo y el último día es la prueba final.</p>';
      h += CHAL_ORDER.map(function (k) {
        var C = CHALLENGES[k], won = S.chalDone.filter(function (x) { return x.id === k; }).length;
        return '<div class="card chc" style="--cc:' + C.c + '"><div class="row"><div class="chi">' + C.e + '</div><div class="sp"><b>' + C.n + '</b>' + (won ? ' <span class="tag">×' + won + ' ✓</span>' : '') + '<div class="mut small" style="margin-top:2px">' + C.d + '</div></div></div>' +
          '<div class="row" style="margin-top:10px"><span class="chip">🎯 ' + C.meta + '</span></div><button class="btn sm" style="margin-top:12px" data-a="chalstart" data-v="' + k + '">Empezar reto</button></div>';
      }).join('');
      return h;
    }
    var C = CHALLENGES[c.id], n = chalCount(), nx = chalNext(), id = 'CH:' + c.id + ':' + Math.min(nx, 30), def = chalDef(id), today1 = c.last === today();
    h += '<div class="card wcard chc" style="--cc:' + C.c + '"><div class="row"><div class="chi">' + C.e + '</div><div class="sp"><div class="mut small" style="font-weight:800">RETO DE 30 DÍAS</div><div style="font-size:20px;font-weight:900">' + C.n + '</div></div><div style="text-align:right"><b style="font-size:24px">' + n + '</b><span class="mut small">/30</span></div></div>' +
      '<div class="xpbar" style="margin-top:12px"><i style="width:' + Math.round(n / 30 * 100) + '%"></i></div></div>';
    h += '<div class="card"><div class="mut small" style="font-weight:800">' + (today1 ? 'HOY YA HICISTE TU DÍA · MAÑANA TOCA' : 'TOCA HOY') + '</div><div style="font-size:19px;font-weight:900;margin:2px 0 4px">' + def.name + '</div><div class="mut small" style="margin-bottom:12px">' + def.desc + '</div>' +
      '<div class="exl">' + mainList(id).slice(0, 6).map(function (x) { return '<div class="li"><b>' + x.n + '</b><span>' + x.t + '</span></div>'; }).join('') + (def.rounds.length > 6 ? '<div class="li"><b class="mut">+' + (def.rounds.length - 6) + ' más</b><span></span></div>' : '') + '</div>' +
      '<button class="btn" style="margin-top:14px" data-a="start" data-v="' + id + '">' + (today1 ? 'Adelantar el día ' + nx : 'Empezar día ' + nx) + '</button>' + (today1 ? '<p class="mut small" style="margin:8px 0 0;text-align:center">Mañana te toca el día ' + nx + '</p>' : '') + '</div>';
    var cells = '';
    for (var d = 1; d <= 30; d++) {
      var dn = !!c.done[d], rest = d % 7 === 0 && d < 30, cur = d === nx;
      cells += '<button class="chd' + (dn ? ' done' : '') + (cur ? ' cur' : '') + (rest ? ' rest' : '') + '" ' + (dn || cur ? 'data-a="prev" data-v="CH:' + c.id + ':' + d + '"' : 'disabled') + '>' + (dn ? '<i class="ic ic-check"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></i>' : d === 30 ? '<i class="ic ic-trophy"><svg viewBox="0 0 24 24"><path d="M8 4h8v5a4 4 0 0 1-8 0zM12 13v4M8.5 20.5h7"/></svg></i>' : d) + '</button>';
    }
    h += '<div class="h2">Tu calendario</div><div class="chgrid">' + cells + '</div><p class="mut small" style="margin:8px 2px 0">Los días rayados son de descanso activo. Si fallas un día, no pasa nada: sigues donde quedaste.</p>';
    h += '<button class="btn ghost" style="margin-top:16px" data-a="chalquit">Abandonar este reto</button>';
    return h;
  }
  function faceBanner() {
    return '<div class="card tipc"><div class="tipe">🧖</div><div><b>Ejercicios de cara y cuello</b><p class="mut small" style="margin:4px 0 8px;line-height:1.45">Dan tono a mejillas, mandíbula y cuello. Ojo: no se puede quemar grasa solo de la cara.</p><div class="row"><button class="btn sm sp" data-a="facerout">Rutinas de cara</button><button class="btn sec sm sp" data-a="faceguide">Guía y mitos</button></div></div></div>';
  }
  function qrow(id) {
    var d = QUICK[id], st = build(id);
    return miniRow('data-a="prev" data-v="' + id + '"', d.emoji, d.name, (d.level ? d.level + ' · ' : '') + '≈' + estMin(st) + ' min · ' + d.rounds.length + ' rounds');
  }
  function sheetClasses() { sheet('<div class="title">🥊 Clases de boxeo</div><p class="mut small" style="margin:4px 0 12px">Rounds guiados con calentamiento y estiramiento. No necesitas costal ni guantes.</p><div class="vlist">' + ['CL1', 'CL2', 'CL3', 'CL4', 'CL5'].map(qrow).join('') + '</div><div class="note">Calienta siempre y mantén la guardia alta. Si tienes lesión de muñeca, hombro o cuello, consulta antes a un médico.</div>'); }
  function sheetFaceRoutines() { sheet('<div class="title">🧖 Rutinas de cara</div><p class="mut small" style="margin:4px 0 12px">Hazlas frente al espejo, con la cara limpia y sin forzar. Con constancia: 5–6 días por semana.</p><div class="vlist">' + ['F1', 'F2', 'F3'].map(qrow).join('') + '</div><button class="btn ghost" style="margin-top:12px" data-a="faceguide">Guía: qué sí funciona y qué no</button>'); }
  function sheetFaceGuide() {
    sheet('<div class="title">🧖 Guía de la cara</div><p class="mut small" style="margin:4px 0 12px">Lo que sí funciona para verte con la cara más definida, sin mitos.</p>' +
      FACE_FACTS.map(function (f) { return '<div class="card tipc" style="margin-bottom:10px"><div class="tipe">' + (window.icon ? window.icon(f[0]) : '') + '</div><div><b>' + f[1] + '</b><p class="mut small" style="margin:4px 0 0;line-height:1.45">' + f[2] + '</p></div></div>'; }).join('') +
      '<button class="btn" data-a="facerout">Ver rutinas de cara</button>');
  }
  function exV() {
    return '<div class="title">Ejercicios</div><p class="mut small" style="margin:4px 0 10px">' + Object.keys(EX).length + ' ejercicios con tutorial animado. Desliza para cambiar de categoría.</p>' +
      '<input type="search" id="exq" data-set="exq" placeholder="🔍 Buscar ejercicio…" value="' + esc(exQ) + '" autocomplete="off">' +
      segTabs('ex', PKEYS.ex.map(function (c) { return [c, c]; })) + '<div class="pnl" id="pnl" data-g="ex">' + exPanel(pst.ex) + '</div>';
  }
  var CATC = { 'Piernas': '74,168,255', 'Pecho y brazos': '255,111,168', 'Core': '255,162,61', 'Espalda': '47,207,138', 'Cardio': '255,93,108', 'Crecer': '163,230,53', 'Movilidad': '167,139,250', 'Boxeo': '255,93,108', 'Cara': '255,190,120' };
  var FTC = { des: '255,190,80', alm: '255,120,90', cen: '140,120,255', snk: '120,220,150', bat: '90,200,255' };
  function exCard(k) {
    var e = EX[k];
    return '<button class="exc" style="--cc:' + (CATC[e.cat] || '74,168,255') + '" data-a="ex" data-v="' + k + '"><div class="fig"><svg data-fig="' + k + '"></svg></div><b>' + e.n + '</b><small>' + (e.type === 'time' ? '⏱ Tiempo' : '🔁 Reps') + ' · ' + (LVL_T[e.lv] || '') + (e.grow ? ' · 🌱' : '') + '</small></button>';
  }
  function exPanel(cat) {
    var h = '', n = 0, q = norm(exQ.trim());
    if (q) {
      h = '<div class="exg">';
      Object.keys(EX).forEach(function (k) { var e = EX[k]; if (norm(e.n).indexOf(q) >= 0 || norm(e.m).indexOf(q) >= 0 || norm(e.cat).indexOf(q) >= 0) { h += exCard(k); n++; } });
      return n ? h + '</div>' : '<p class="mut" style="text-align:center;margin-top:30px">No encontré ejercicios con “' + esc(exQ) + '”.</p>';
    }
    var intro = '';
    if (cat === 'Cara') intro = faceBanner();
    if (cat === 'Boxeo') intro = '<div class="card tipc"><div class="tipe">🥊</div><div><b>Clases de boxeo</b><p class="mut small" style="margin:4px 0 8px;line-height:1.45">Aprende cada golpe aquí y practica en clases guiadas por rounds.</p><button class="btn sm" data-a="boxclasses">Ver las clases</button></div></div>';
    h = '<div class="exg">';
    Object.keys(EX).forEach(function (k) { if (EX[k].cat === cat) { h += exCard(k); n++; } });
    return intro + '<div class="mut small" style="margin:0 2px 10px">' + n + ' ejercicios en esta categoría</div>' + h + '</div>';
  }

  var cal_sum = '';
  function calHTML() {
    var base = new Date(); base.setDate(1); base.setMonth(base.getMonth() + calOff);
    var y = base.getFullYear(), m = base.getMonth(), first = (new Date(y, m, 1).getDay() + 6) % 7, n = new Date(y, m + 1, 0).getDate(), i, c = '';
    DAYS.forEach(function (d) { c += '<div class="h">' + d + '</div>'; });
    for (i = 0; i < first; i++) c += '<div></div>';
    var mdone = 0, mbest = 0, mrun = 0;
    function isDone(dd) { var q = S.days[dd]; return !!(q && (q.w > 0 || q.freeze)); }
    for (i = 1; i <= n; i++) {
      var k = y + '-' + pad(m + 1) + '-' + pad(i), rr = S.days[k], dn = !!(rr && rr.w > 0), on = isDone(k), col = (first + i - 1) % 7, ky = new Date(y, m, i - 1), kn = new Date(y, m, i + 1);
      var pv = on && col > 0 && i > 1 && isDone(y + '-' + pad(m + 1) + '-' + pad(i - 1)), nx = on && col < 6 && i < n && isDone(y + '-' + pad(m + 1) + '-' + pad(i + 1));
      if (dn) { mdone++; mrun++; if (mrun > mbest) mbest = mrun; } else if (!on) mrun = 0;
      c += '<div class="d' + (dn ? ' done' : rr && rr.freeze ? ' freeze' : '') + (pv ? ' rl' : '') + (nx ? ' rr' : '') + (k === today() ? ' today' : '') + '">' + i + '</div>';
    }
    cal_sum = mdone + ' día' + (mdone === 1 ? '' : 's') + ' entrenado' + (mdone === 1 ? '' : 's') + ' este mes' + (mbest > 1 ? ' · mejor racha del mes: ' + mbest : '');
    return '<div class="row" style="margin-bottom:10px"><button class="btn sec sm" data-a="calp">‹</button><div class="sp" style="text-align:center;font-weight:800">' + MONTHS[m] + ' ' + y + '</div><button class="btn sec sm" data-a="caln">›</button></div><div class="cal">' + c + '</div><p class="mut small" style="text-align:center;margin:10px 0 0;font-weight:700">' + cal_sum + '</p>';
  }

  function lineChart(pts) {
    var W = 300, H = 120, vs = pts.map(function (p) { return p.v; }), mn = Math.min.apply(0, vs), mx = Math.max.apply(0, vs), pd = Math.max(1, (mx - mn) * 0.1);
    mn -= pd; mx += pd;
    var xy = pts.map(function (p, i) { return [14 + i * (W - 28) / (pts.length - 1), H - 22 - (p.v - mn) / (mx - mn) * (H - 44)]; });
    return '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '"><polyline fill="none" style="stroke:var(--acc)" stroke-width="3" stroke-linejoin="round" points="' + xy.map(function (a) { return a[0].toFixed(1) + ',' + a[1].toFixed(1); }).join(' ') + '"/>' +
      xy.map(function (a, i) { return '<circle cx="' + a[0].toFixed(1) + '" cy="' + a[1].toFixed(1) + '" r="4" style="fill:var(--acc)"/><text x="' + a[0].toFixed(1) + '" y="' + (a[1] - 8).toFixed(1) + '" style="fill:var(--mut)" font-size="9" text-anchor="middle">' + pts[i].v + '</text>'; }).join('') + '</svg>';
  }
  function chartHTML() {
    var pts = S.meas.filter(function (x) { return x.h; }).slice(-12).map(function (x) { return { v: x.h }; });
    if (pts.length < 2) return '<p class="mut small" style="margin-top:10px">Guarda al menos dos medidas para ver tu gráfica de estatura.</p>';
    return lineChart(pts);
  }
  var progEx = null;
  function evoHTML() {
    var ks = Object.keys(S.exh).filter(function (k) { return EX[k] && S.exh[k].length; });
    if (!ks.length) return '<p class="mut small">Cuando completes entrenamientos verás aquí cómo suben tus repeticiones.</p>';
    if (!progEx || ks.indexOf(progEx) < 0) progEx = ks[0];
    var arr = S.exh[progEx].slice(-12);
    return '<div class="chips" style="margin-top:0">' + ks.map(function (k) { return '<button class="chip' + (k === progEx ? ' on' : '') + '" data-a="evx" data-v="' + k + '">' + EX[k].n + '</button>'; }).join('') + '</div>' +
      (arr.length > 1 ? lineChart(arr.map(function (x) { return { v: x.v }; })) + '<div class="mut small" style="text-align:center">' + (EX[progEx].type === 'time' ? 'segundos' : 'repeticiones') + ' por sesión</div>' : '<p class="mut small">Haz este ejercicio otra vez para ver la gráfica. Último: ' + targetTxt(progEx, arr[0].v) + '</p>');
  }
  function sleepHTML() {
    var out = [], i, any = false, now = dnum(today());
    for (i = 13; i >= 0; i--) { var k = nstr(now - i), v = (S.habits[k] && S.habits[k].sl) || 0; if (v) any = true; out.push({ v: v, l: k.slice(8) }); }
    if (!any) return '<p class="mut small">Apunta cuántas horas duermes en Inicio → Hábitos. Dormir 8–10 horas ayuda a crecer.</p>';
    return '<div class="rbar">' + out.map(function (o) { return '<div' + (o.v >= 8 ? ' class="cur"' : '') + '>' + (o.v || '') + '<i style="height:' + Math.round(o.v / 12 * 78) + 'px;' + (o.v && o.v < 8 ? 'opacity:.5' : '') + '"></i>' + o.l + '</div>'; }).join('') + '</div><div class="mut small" style="text-align:center;margin-top:4px">Horas de sueño (borde = 8 h o más)</div>';
  }

  function weeklyHTML() {
    var now = new Date(), wd = (now.getDay() + 6) % 7, mon = new Date(now.getFullYear(), now.getMonth(), now.getDate() - wd), out = [], i, mx = 1;
    for (i = 7; i >= 0; i--) {
      var a = new Date(mon.getFullYear(), mon.getMonth(), mon.getDate() - i * 7), n = 0, k;
      for (k = 0; k < 7; k++) { var d = new Date(a.getFullYear(), a.getMonth(), a.getDate() + k); var r = S.days[dstr(d)]; if (r && r.w > 0) n += r.w; }
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
  /* ---------- PROGRESO ---------- */
  function progV() {
    return '<div class="title">Tu progreso</div>' + segTabs('prog', [['resumen', '📊 Resumen'], ['calendario', '📅 Calendario'], ['medidas', '📏 Medidas'], ['nivel', '💪 Nivel'], ['logros', '🏆 Logros']]) +
      '<div class="pnl" id="pnl" data-g="prog">' + progPanel(pst.prog) + '</div>';
  }
  function progPanel(k) {
    var st = stats(), h = '';
    if (k === 'resumen') {
      h += '<div class="stats">' +
        '<div class="stat"><b>🔥 ' + st.cur + '</b><span>Racha actual</span></div><div class="stat"><b>🏆 ' + st.best + '</b><span>Mejor racha</span></div>' +
        '<div class="stat"><b>' + st.total + '</b><span>Entrenamientos</span></div><div class="stat"><b>' + st.mins + '</b><span>Minutos activos</span></div></div>';
      h += '<div class="h2">Entrenamientos por semana</div><div class="card">' + weeklyHTML() + '</div>';
      h += '<div class="h2">Mi evolución</div><div class="card">' + evoHTML() + '</div>';
    } else if (k === 'calendario') {
      h += '<div class="card">' + calHTML() + '</div>';
      h += '<div class="h2">Mi sueño</div><div class="card">' + sleepHTML() + '</div>';
      h += notesHTML();
    } else if (k === 'medidas') {
      h += '<div class="card"><div class="row"><div class="sp"><label style="margin-top:0">Estatura (cm)</label><input type="number" id="mh" inputmode="decimal" placeholder="170"></div><div class="sp"><label style="margin-top:0">Peso (kg)</label><input type="number" id="mw" inputmode="decimal" placeholder="60"></div></div>' +
        '<button class="btn sec" style="margin-top:12px" data-a="meas">Guardar medida</button>' + chartHTML();
      var last = S.meas.slice(-3).reverse();
      if (last.length) h += '<div class="exl" style="margin-top:10px">' + last.map(function (m) { return '<div class="li"><b>' + m.d + '</b><span>' + (m.h ? m.h + ' cm ' : '') + (m.w ? m.w + ' kg' : '') + '</span></div>'; }).join('') + '</div>';
      h += '<div class="note">💡 Mide siempre a la misma hora (mejor por la mañana). La estatura depende mucho de la genética: entrenar, dormir bien, comer proteína y mantener buena postura te ayudan a alcanzar tu máximo.</div></div>';
    } else if (k === 'logros') {
      h += streakBadgeCard(st) + '<div class="badges" style="margin-top:12px">' + BADGES.map(function (b) { var ok = b.f(st); return '<div class="badge' + (ok ? '' : ' lock') + '"><span class="e">' + b.e + '</span>' + b.n + '</div>'; }).join('') + '</div>';
    } else {
      h += '<div class="card"><b>🏅 Mis récords</b><div style="margin-top:8px">' + recsHTML() + '</div></div>';
      h += '<div class="h2">Nivel de tus ejercicios</div><div class="card">' + Object.keys(CHAINS).map(function (c) {
        var cc = S.chains[c], v = CHAINS[c][cc.i], e = EX[v.ex];
        return '<div class="li" style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--bd)"><b style="font-size:14px">' + e.n + '</b><span class="mut small">' + targetTxt(v.ex, cc.v) + (CHAINS[c].length > 1 ? ' · nivel ' + (cc.i + 1) + '/' + CHAINS[c].length : '') + '</span></div>';
      }).join('') + '<p class="mut small" style="margin-top:10px">Sube sola cuando terminas tus rutinas.</p></div>';
    }
    return h;
  }

  function seg(key, opts, cur) {
    return '<div class="seg">' + opts.map(function (o) { return '<button class="' + (String(cur) === String(o[0]) ? 'on' : '') + '" data-a="opt" data-v="' + key + ':' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</div>';
  }
  function setTDays() { var t = tdArr(); if (t) S.settings.goal = t.length; save(); syncReminder(); }
  function nativeOk(fn) { try { return !!(AND() && AND()[fn]); } catch (e) { return false; } }
  function statsCard() {
    if (!CLOUD_URL) return '';
    return '<div class="card"><div class="set" style="border:0;padding:0"><div class="sp"><b>📊 Estadísticas anónimas</b><div class="mut small" style="line-height:1.45;margin-top:4px">Ayudan a mejorar la app. Se envía un código aleatorio, la versión, tu nivel, racha y nº de entrenamientos. Nunca tu nombre, medidas ni notas. Al apagarlo se borra lo enviado.</div></div>' + sw('stats') + '</div></div>';
  }
  function widgetCard() {
    var ok = nativeOk('pinWidget2');
    var W = [['streak', '🔥', 'Racha', 'Fondo negro, llama y tu racha en grande'], ['week', '📅', 'Mi semana', 'Los 7 días y tu meta semanal'], ['today', '🏋️', 'Entrenar hoy', 'Tu rutina y un botón para empezar'],
      ['goal', '🎯', 'Meta semanal', 'Anillo con tus entrenos de la semana'], ['level', '⭐', 'Nivel y XP', 'Tu nivel y lo que falta para el siguiente'], ['habits', '✅', 'Hábitos de hoy', 'Anillo y lista de tus hábitos'],
      ['month', '🗓', 'Calendario', 'Los días que entrenaste este mes'], ['challenge', '🏆', 'Reto de 30 días', 'Tu avance en el reto activo']];
    return '<div class="card"><b>🧩 Widgets</b><p class="mut small" style="margin:6px 0 4px;line-height:1.5">Ponlos en la pantalla de inicio o búscalos en el apartado de widgets de tu teléfono: mantén pulsado un espacio vacío → Widgets → Crece Fit.</p>' +
      (ok ? W.map(function (w) { return '<div class="set"><div class="sp"><b>' + w[1] + ' ' + w[2] + '</b><div class="mut small">' + w[3] + '</div></div><button class="btn sec sm" style="width:auto;padding:10px 14px" data-a="pinw" data-v="' + w[0] + '">Añadir</button></div>'; }).join('') : '<p class="mut small" style="margin:8px 0 0">Necesitan la última versión del APK.</p>') + '</div>';
  }
  function sw(name) { return '<div class="sw' + (S.settings[name] ? ' on' : '') + '" data-a="tog" data-v="' + name + '"></div>'; }
  /* ---------- AJUSTES: menú con secciones ---------- */
  function setV() { return setSec ? setSection(setSec) : setMenu(); }
  var THEMES = [['black', '#2a2d36', 'Negro'], ['blue', '#4aa8ff', 'Azul'], ['cyan', '#22d3ee', 'Cian'], ['teal', '#2dd4bf', 'Turquesa'], ['green', '#2fcf8a', 'Verde'], ['lime', '#a3e635', 'Lima'], ['yellow', '#facc15', 'Amarillo'], ['gold', '#f5b942', 'Dorado'], ['orange', '#ffa23d', 'Naranja'], ['red', '#ff5d6c', 'Rojo'], ['pink', '#ff6fa8', 'Rosa'], ['magenta', '#e879f9', 'Magenta'], ['purple', '#a78bfa', 'Morado'], ['indigo', '#818cf8', 'Índigo'], ['mint', '#6ee7b7', 'Menta']],
    THEME_N = (function () { var o = {}; THEMES.forEach(function (t) { o[t[0]] = t[2]; }); return o; })(), MODE_N = { dark: 'Oscuro', light: 'Claro', auto: 'Automático' };
  function setMenu() {
    var s = S.settings, c = cloudCfg();
    var rows = [
      ['prof', '🎯', 'Mi objetivo y nivel', S.profile ? GOALS[S.profile.goal].n + ' · ' + LEVELS[S.profile.level].n : 'Elige tu objetivo'],
      ['train', '🏋️', 'Entrenamiento', 'Meta ' + s.goal + ' días · descanso ' + s.rest + ' s'],
      ['look', '🎨', 'Apariencia', (THEME_N[s.theme] || '') + ' · ' + (MODE_N[s.mode] || '')],
      ['sound', '🔔', 'Sonido y avisos', (s.sound ? 'Sonido' : 'Sin sonido') + (s.voice ? ' · voz' : '') + (s.rem ? ' · recordatorio ' + pad(remTime().h) + ':' + pad(remTime().m) : '')],
      ['cloud', '☁️', 'Nube y copia de seguridad', !CLOUD_URL ? 'Copia manual' : (c.code ? 'Copia en la nube activa' : 'Sin activar')],
      ['upd', '🔄', 'Actualizaciones', 'Contenido v' + (window.APP_VERSION || '?') + ' · APK v' + apkName()]
    ];
    if (CLOUD_URL) rows.push(['priv', '📊', 'Privacidad y estadísticas', s.stats === true ? 'Estadísticas anónimas activadas' : 'Estadísticas apagadas']);
    rows.push(['about', '🌱', 'Acerca de crecer', 'Cómo te ayuda la app']);
    return '<div class="title">Ajustes</div><div class="vlist" style="margin-top:14px">' + rows.map(function (r) { return miniRow('data-a="sec" data-v="' + r[0] + '"', r[1], r[2], r[3]); }).join('') + '</div>' +
      '<button class="btn warn" style="margin-top:22px" data-a="reset">Borrar todos mis datos</button><p class="mut small" style="text-align:center;margin-top:14px">Crece Fit</p>';
  }
  function setSection(k) {
    var s = S.settings, T = { prof: 'Mi objetivo', train: 'Entrenamiento', look: 'Apariencia', sound: 'Sonido y avisos', cloud: 'Nube y copia', upd: 'Actualizaciones', priv: 'Privacidad', about: 'Acerca de crecer' };
    var h = '<button class="back" data-a="secback">‹ Ajustes</button><div class="title">' + T[k] + '</div><div style="margin-top:14px"></div>';
    if (k === 'prof') {
      var pp = S.profile;
      h += '<div class="card"><div style="font-size:20px;font-weight:900">' + (pp ? GOALS[pp.goal].e + ' ' + GOALS[pp.goal].n : 'Sin objetivo') + '</div><div class="mut" style="margin-top:4px">' + (pp ? LEVELS[pp.level].e + ' ' + LEVELS[pp.level].n : '') + '</div></div><button class="btn" data-a="profopen">Cambiar objetivo o nivel</button>' + (pp ? '<div class="mut small" style="margin:14px 0 6px;font-weight:800">TUS 4 RUTINAS</div>' + ORDER.map(function (r) { return '<div class="card"><b>' + WORKOUTS[r].emoji + ' ' + WORKOUTS[r].name + '</b><div class="mut small" style="margin-top:4px">' + WORKOUTS[r].slots.map(function (sl) { return EX[curVar(sl[0]).ex].n; }).join(' · ') + '</div></div>'; }).join('') : '');
    } else if (k === 'train') {
      h += '<div class="card"><label style="margin-top:0">Tu nombre</label><input type="text" id="nm" data-set="name" value="' + esc(S.name) + '" placeholder="Opcional" maxlength="20">' +
        '<label>Descanso entre series: <b id="rv" style="color:var(--acc)">' + s.rest + ' s</b></label><input type="range" min="15" max="90" step="5" value="' + s.rest + '" data-set="rest"></div>' +
        '<div class="card"><label style="margin-top:0">Días de entrenamiento</label><div class="mut small" style="margin:4px 0 10px;line-height:1.45">Elige qué días entrenas: puede ser uno solo o los que quieras. Los demás son descanso y no rompen tu racha.</div><div class="seg" style="gap:5px">' + DAYS3.map(function (d, i) { var on = !tdArr() || tdArr().indexOf(i) >= 0; return '<button class="' + (on ? 'on' : '') + '" style="padding:11px 0;font-size:12px" data-a="tday" data-v="' + i + '">' + d + '</button>'; }).join('') + '</div><div class="row" style="margin-top:10px"><div class="mut small sp">Entrenas: <b style="color:var(--txt)">' + tdaysText() + '</b></div><button class="btn ghost sm" data-a="tdall" style="width:auto;padding:8px 14px">Todos</button></div></div>' +
        (tdArr() ? '<div class="card"><b>🎯 Meta semanal: ' + tdArr().length + (tdArr().length === 1 ? ' día' : ' días') + '</b><div class="mut small" style="margin-top:4px">Sigue los días que elegiste arriba.</div>' : '<div class="card"><label style="margin-top:0">Meta semanal (días por semana)</label>' + seg('goal', [[1, '1'], [2, '2'], [3, '3'], [4, '4'], [5, '5'], [6, '6']], s.goal)) +
        '<label>Calentamiento</label>' + seg('warm', [['cardio', '🏃 Cardio'], ['suave', '🧘 Suave'], ['none', 'Ninguno']], s.warm) +
        '<label>Estiramiento final</label>' + seg('cool', [['all', 'Todo'], ['legs', 'Piernas'], ['back', 'Espalda'], ['upper', 'Brazos'], ['none', 'Ninguno']], s.cool) + '</div>' +
        '<div class="card"><div class="set"><div class="sp"><b>🙌 Modo manos libres</b><div class="mut small">Cuenta las repeticiones con voz y avanza solo. Ideal con el teléfono apoyado.</div></div>' + sw('hands') + '</div>' +
        '<label>Velocidad al contar</label>' + seg('pace', [[2, '⚡ Rápido (2 s)'], [2.5, '👍 Normal (2,5 s)'], [3.5, '🐢 Lento (3,5 s)']], s.pace) +
        '<div class="set" style="border:0;margin-top:8px"><div class="sp"><b>🤫 Modo sin saltos</b><div class="mut small">Cambia saltos por ejercicios silenciosos</div></div>' + sw('nojump') + '</div></div>';
    } else if (k === 'look') {
      h += '<div class="card"><b>Color de la app</b><div class="swg">' + THEMES.map(function (c) { return '<button class="sw2' + (s.theme === c[0] ? ' on' : '') + '" data-a="theme" data-v="' + c[0] + '"><i style="background:' + c[1] + '"></i><span>' + c[2] + '</span></button>'; }).join('') +
        '</div></div><div class="card"><b>Modo</b><div class="seg" style="margin-top:10px">' + [['dark', '🌙 Oscuro'], ['light', '☀️ Claro'], ['auto', '📱 Auto']].map(function (m) { return '<button class="' + (s.mode === m[0] ? 'on' : '') + '" data-a="mode" data-v="' + m[0] + '">' + m[1] + '</button>'; }).join('') + '</div></div>' +
        '<div class="card">' +
        '<div class="set" style="border:0;margin-top:0"><div class="sp"><b>⚫ Negro puro (OLED)</b><div class="mut small">Fondo negro total en modo oscuro: ahorra batería</div></div>' + sw('black') + '</div>' +
        '<label>Rendimiento</label>' + seg('perf', [['auto', '🤖 Auto'], ['high', '🚀 Máximo'], ['low', '🔋 Ahorro']], s.perf || 'auto') + '</div>';
    } else if (k === 'sound') {
      h += '<div class="card"><div class="set"><div class="sp"><b>🔊 Sonidos</b><div class="mut small">Pitidos al terminar</div></div>' + sw('sound') + '</div>' +
        '<div class="set"><div class="sp"><b>🗣 Voz</b><div class="mut small">Dice el ejercicio y cuenta contigo</div></div>' + sw('voice') + '</div>' +
        '<div class="set" style="border:0"><div class="sp"><b>📳 Vibración</b><div class="mut small">Avisos con vibración</div></div>' + sw('vib') + '</div></div>' +
        '<div class="card"><div class="set"><div class="sp"><b>⏰ Recordatorio diario</b><div class="mut small">Con botones “Empezar” y “En 1 hora”</div></div>' + sw('rem') + '</div>' +
        (s.rem ? (function () { var rt = remTime(), sm = smartMin(); return '<div style="padding:4px 0 6px"><input type="time" id="rt" data-set="rtime" value="' + pad(rt.h) + ':' + pad(rt.m) + '"' + (rt.smart ? ' disabled style="opacity:.55"' : '') + '></div>' +
          '<div class="set"><div class="sp"><b>Hora inteligente</b><div class="mut small">' + (s.smart ? (sm == null ? 'Aprende tu horario tras 3 entrenamientos' : 'Avisa 20 min antes de tu hora habitual') : 'Aprende a qué hora entrenas') + '</div></div>' + sw('smart') + '</div>'; })() : '') +
        '<div class="set" style="border-bottom:0"><div class="sp"><b>🔥 Aviso de racha en peligro</b><div class="mut small">A las 9 pm, solo si aún no entrenaste</div></div>' + sw('risk') + '</div>' +
        (nativeOk('setReminderPlus') ? '' : '<p class="mut small" style="margin:0">Los botones y este aviso necesitan la última versión del APK.</p>') + '</div>' + widgetCard();
    } else if (k === 'cloud') {
      h += cloudCard() + '<div class="card"><b>💾 Copia manual</b><p class="mut small" style="margin:4px 0 12px">Guarda tu progreso como texto por si cambias de teléfono.</p><div class="col"><button class="btn sec sm" data-a="backup">Exportar</button><button class="btn sec sm" data-a="restore">Importar</button></div></div>';
    } else if (k === 'upd') {
      h += '<div class="card"><p class="mut small" style="margin:0 0 12px;line-height:1.6">Contenido: <b style="color:var(--txt)">v' + (window.APP_VERSION || '?') + '</b>' + (window.__src === 'ota' ? ' (descargado)' : window.__src === 'apk' ? ' (del APK)' : '') + '<br>APK: <b style="color:var(--txt)">v' + esc(apkName()) + '</b><br>' + esc(updStatusText()) + '</p>' +
        '<div class="col"><button class="btn sec sm" data-a="updcheck">🔄 Buscar actualizaciones</button><button class="btn sec sm" data-a="gosite">🌐 Página de descargas</button></div></div>';
    } else if (k === 'priv') {
      h += statsCard();
    } else {
      h += '<div class="card"><p class="mut small" style="margin:0;line-height:1.6">Tu altura final depende sobre todo de la genética. Esta app te ayuda a dar lo mejor de ti: fortalece músculos y huesos, mejora tu postura y movilidad de columna, y te recuerda lo básico: dormir 8–10 h, comer bien y moverte a diario. Ningún ejercicio “estira” los huesos por arte de magia, ¡pero sí puedes verte y sentirte más alto y fuerte!</p></div>' +
        '<button class="btn sec" style="margin-top:12px" data-a="tutopen">▶ Ver el tutorial</button>' +
        '<div class="brandline"><img class="dlogo" alt="daij studio" src="data:image/png;base64,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" style="height:78px;width:auto"></div><button class="btn ghost sm" style="margin-top:10px" data-a="studio">Conocer daij studio</button>';
    }
    return h;
  }

  function vt(fn) {
    try { if (document.startViewTransition && !(S && S.settings.fx === false) && document.documentElement.getAttribute('data-perf') !== 'low' && !document.hidden) { document.startViewTransition(fn); return; } } catch (e) { }
    fn();
  }
  function render(anim) {
    var old = $('#view'), top = old ? old.scrollTop : 0;
    destroyFigs();
    var v = tab === 'home' ? homeV() : tab === 'ex' ? exV() : tab === 'food' ? foodV() : tab === 'prog' ? progV() : setV();
    var bar = document.querySelector('.tabs');
    if (bar) {
      var vw = old; if (!vw) { vw = document.createElement('div'); vw.id = 'view'; $('#app').insertBefore(vw, bar); }
      vw.className = 'view' + (anim ? ' anim' : ''); vw.innerHTML = v;
      Array.prototype.forEach.call(bar.querySelectorAll('.tab'), function (b) { var on = b.getAttribute('data-v') === tab; if (on !== b.classList.contains('on')) { b.classList.toggle('on', on); if (on && fx.tab) { var ic = b.querySelector('.i'); if (ic) { ic.style.animation = 'none'; void ic.offsetWidth; ic.style.animation = ''; } } } });
    } else $('#app').innerHTML = '<div class="view' + (anim ? ' anim' : '') + '" id="view">' + v + '</div>' + tabsHTML();
    $('#view').scrollTop = anim ? 0 : top;
    if (anim && tab === 'home') { var sn = document.querySelector('.streak .num'); if (sn) countUp(sn, +sn.textContent); }
    mountThumbs();
  }


  /* ---------- COMIDA ---------- */
  var fQ = '', fType = 'all', fDay = (new Date().getDay() + 6) % 7, fOnly = '';
  var DAYN = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  function foodRead() {
    var a = $('#fa'), w = $('#fw'), h = $('#fh');
    if (a) S.food.age = parseFloat(a.value) || ''; if (w) S.food.w = parseFloat(w.value) || ''; if (h) S.food.h = parseFloat(h.value) || '';
  }
  function switchPanelRefresh2() { var pn = $('#pnl'); if (pn) { destroyFigs(); pn.innerHTML = homePanel(pst.home); } }
  function switchPanelRefresh() { var pn = $('#pnl'); if (pn) { destroyFigs(); pn.innerHTML = foodPanel(pst.food); } }
  function foodV() {
    return '<div class="title">Comida</div><p class="mut small" style="margin:2px 0 10px">Come bien para crecer, ganar peso o mantenerte.</p>' +
      segTabs('food', [['plan', '🎯 Mi plan'], ['menu', '📅 Menú'], ['rec', '🍳 Recetas'], ['ali', '🥑 Alimentos'], ['tip', '💡 Consejos']]) +
      '<div class="pnl" id="pnl" data-g="food">' + foodPanel(pst.food) + '</div>';
  }
  function fLog() { var d = today(); return S.food.log[d] || (S.food.log[d] = []); }
  function fTot() { var k = 0, p = 0; (S.food.log[today()] || []).forEach(function (x) { k += x.k; p += x.p; }); return { k: k, p: p }; }
  function fTarget() { return foodCalc(S.food); }
  function bar(v, max, lbl, col) {
    var pc = Math.max(0, Math.min(100, max ? v / max * 100 : 0));
    return '<div class="fbar"><div class="fbl"><b>' + lbl + '</b><span>' + Math.round(v) + ' / ' + Math.round(max) + '</span></div><div class="fbt"><i style="width:' + pc + '%;' + (col ? 'background:' + col : '') + '"></i></div></div>';
  }
  function fTags(t) { return (t.indexOf('E') >= 0 ? '<span class="chip">💰 Económica</span>' : '') + (t.indexOf('R') >= 0 ? '<span class="chip">⚡ Rápida</span>' : '') + (t.indexOf('V') >= 0 ? '<span class="chip">🌿 Vegetariana</span>' : '') + (t.indexOf('S') >= 0 ? '<span class="chip">🧊 Sin cocinar</span>' : ''); }
  function rCard(id) {
    var r = RECIPES[id];
    return '<button class="rcard" style="--cc:' + (FTC[r[2]] || '74,168,255') + '" data-a="fview" data-v="' + id + '"><span class="re">' + r[0] + '</span><span class="rt"><b>' + r[1] + '</b><span>' + r[3] + ' kcal · ' + r[4] + ' g prot · ' + r[5] + ' min' + (S.food.fav[id] ? ' · ❤️' : '') + '</span></span><i class="chev">›</i></button>';
  }
  function foodPanel(k) {
    var f = S.food, h = '';
    if (k === 'plan') {
      var c = f.done ? foodCalc(f) : null;
      if (!c) {
        var lm = S.meas.length ? S.meas[S.meas.length - 1] : {}, lw = 0, lh = 0; S.meas.forEach(function (m) { if (m.w) lw = m.w; if (m.h) lh = m.h; });
        h += '<div class="card"><b style="font-size:17px">Calcula lo que necesitas comer</b><p class="mut small" style="margin:4px 0 0">Con tus datos calculamos tus calorías, proteína y agua. Es una estimación.</p>' +
          '<label>Sexo</label><div class="seg">' + [['m', 'Hombre'], ['f', 'Mujer']].map(function (o) { return '<button class="' + (f.sex === o[0] ? 'on' : '') + '" data-a="fset" data-v="sex:' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</div>' +
          '<div class="row"><div class="sp"><label>Edad</label><input type="number" id="fa" inputmode="numeric" placeholder="17" value="' + (f.age || '') + '"></div><div class="sp"><label>Peso (kg)</label><input type="number" id="fw" inputmode="decimal" placeholder="55" value="' + (f.w || lw || '') + '"></div><div class="sp"><label>Estatura (cm)</label><input type="number" id="fh" inputmode="decimal" placeholder="168" value="' + (f.h || lh || '') + '"></div></div>' +
          '<label>Actividad física</label>' + ACTIVITY.map(function (a, i) { return '<button class="opt' + (f.act === i ? ' on' : '') + '" data-a="fset" data-v="act:' + i + '"><b>' + a[1] + '</b><span>' + a[2] + '</span></button>'; }).join('') +
          '<label>Mi meta</label>' + Object.keys(FGOALS).map(function (g) { return '<button class="opt' + (f.goal === g ? ' on' : '') + '" data-a="fset" data-v="goal:' + g + '"><b>' + FGOALS[g].e + ' ' + FGOALS[g].n + '</b></button>'; }).join('') +
          '<button class="btn" style="margin-top:14px" data-a="fcalc">Calcular mi plan</button></div>';
        return h;
      }
      var t = fTot(), g = FGOALS[f.goal];
      h += '<div class="card wcard"><div class="mut small" style="font-weight:800">' + g.e + ' ' + g.n.toUpperCase() + '</div><div style="font-size:40px;font-weight:900;line-height:1.1;margin-top:4px">' + c.kcal + ' <span style="font-size:16px;font-weight:700">kcal al día</span></div>' +
        '<div class="chips" style="margin-top:10px"><span class="chip on">🍗 ' + c.prot + ' g proteína</span><span class="chip">🍚 ' + c.carb + ' g carbos</span><span class="chip">🥑 ' + c.fat + ' g grasa</span><span class="chip">💧 ' + c.water + ' L agua</span></div>' +
        '<p class="mut small" style="margin:10px 0 0">Tu cuerpo gasta ~' + c.tdee + ' kcal al día. ' + (f.goal === 'gain' ? 'Comes +400 para subir ~0.3 kg por semana.' : f.goal === 'soft' ? 'Comes +250 para ganar músculo con poca grasa.' : f.goal === 'lose' ? 'Comes 400 menos para bajar poco a poco.' : 'Comes lo que gastas para mantenerte.') + ' IMC: ' + c.bmi + (c.bmi < 18.5 ? ' (bajo peso)' : c.bmi < 25 ? ' (normal)' : c.bmi < 30 ? ' (sobrepeso)' : ' (alto)') + '.</p></div>';
      h += '<div class="h2">Hoy</div><div class="card">' + bar(t.k, c.kcal, '🔥 Calorías') + bar(t.p, c.prot, '🍗 Proteína (g)', 'var(--ok,#34d399)');
      var lg = S.food.log[today()] || [];
      h += (lg.length ? '<div class="exl" style="margin-top:10px">' + lg.map(function (x, i) { return '<div class="li"><b>' + x.n + '</b><span>' + x.k + ' kcal · ' + x.p + ' g <button class="xbtn" data-a="fdel" data-v="' + i + '" aria-label="Quitar">✕</button></span></div>'; }).join('') + '</div>' : '<p class="mut small" style="margin:10px 0 0">Aún no registras comidas hoy.</p>') +
        '<div class="row" style="margin-top:12px"><button class="btn sec sm sp" data-a="fpick">➕ Añadir comida</button><button class="btn ghost sm sp" data-a="fcust">✍️ Manual</button></div>' +
        (t.k >= c.kcal ? '<div class="note shine" style="margin-top:10px">🎉 ¡Meta de calorías del día cumplida!</div>' : (c.kcal - t.k < 500 && lg.length ? '<div class="note" style="margin-top:10px">Te faltan ' + (c.kcal - t.k) + ' kcal: un batido o un sándwich con mantequilla de maní lo resuelve.</div>' : '')) + '</div>';
      h += '<div class="h2">Mi peso</div><div class="card"><div class="row"><div class="sp"><input type="number" id="fwt" inputmode="decimal" placeholder="Peso de hoy (kg)"></div><button class="btn sec sm" data-a="fwt">Guardar</button></div>' + wtHTML() + '</div>';
      h += '<button class="btn ghost" style="margin-top:14px" data-a="fedit">✏️ Cambiar mis datos o meta</button>';
      h += '<div class="note">⚠️ Es una estimación general. Si tienes una condición médica, estás en crecimiento o tomas medicación, consulta a un médico o nutricionista.</div>';
    } else if (k === 'menu') {
      var c2 = f.done ? foodCalc(f) : null, mode = (f.goal === 'gain' || f.goal === 'soft') ? 'gain' : 'keep', day = menuDay(fDay, mode), tt = menuTotals(day);
      h += '<div class="chips" style="margin-bottom:12px">' + DAYN.map(function (d, i) { return '<button class="chip' + (fDay === i ? ' on' : '') + '" data-a="fdayset" data-v="' + i + '">' + d + '</button>'; }).join('') + '</div>';
      h += '<div class="card"><div class="row"><div class="sp"><b>' + tt.kcal + ' kcal · ' + tt.prot + ' g proteína</b><div class="mut small">' + (c2 ? 'Tu meta: ' + c2.kcal + ' kcal' + (tt.kcal < c2.kcal - 150 ? ' · añade ' + (c2.kcal - tt.kcal) + ' kcal (más porción, aguacate, aceite o mantequilla de maní)' : tt.kcal > c2.kcal + 250 ? ' · puedes reducir un poco las porciones' : ' ✓ bien ajustado') : 'Calcula tu plan para comparar con tu meta') + '</div></div></div></div>';
      day.forEach(function (s2) { var r = RECIPES[s2[1]]; h += '<div class="mslot"><div class="mut small" style="font-weight:800;margin:10px 0 4px">' + s2[0].toUpperCase() + '</div>' + rCard(s2[1]) + '</div>'; });
      h += '<div class="row" style="margin-top:14px"><button class="btn sec sm sp" data-a="fall">✓ Registrar todo el día</button><button class="btn ghost sm sp" data-a="fshop">🛒 Lista de compras</button></div>';
      h += '<div class="note">' + (mode === 'gain' ? 'Este menú incluye batido y snacks extra para subir de peso. ' : 'Menú equilibrado sin extras. ') + 'Ajusta porciones según tu hambre y tu meta.</div>';
    } else if (k === 'rec') {
      var ids = Object.keys(RECIPES).filter(function (id) {
        var r = RECIPES[id]; if (fType !== 'all' && r[2] !== fType) return false;
        if (fOnly && r[6].indexOf(fOnly) < 0) return false;
        if (fQ) { var q = norm(fQ); if (norm(r[1]).indexOf(q) < 0 && !r[7].some(function (x) { return norm(x).indexOf(q) >= 0; })) return false; }
        return true;
      });
      h += '<input type="search" id="fq" data-set="fq" placeholder="Buscar receta o ingrediente…" value="' + esc(fQ) + '" autocomplete="off">' +
        '<div class="chips" style="margin:10px 0">' + [['all', 'Todas']].concat(Object.keys(FOOD_TYPES).map(function (t2) { return [t2, FOOD_TYPES[t2]]; })).map(function (o) { return '<button class="chip' + (fType === o[0] ? ' on' : '') + '" data-a="ftype" data-v="' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</div>' +
        '<div class="chips" style="margin-bottom:10px">' + [['', 'Todas'], ['E', '💰 Económicas'], ['R', '⚡ Rápidas'], ['V', '🌿 Vegetarianas'], ['S', '🧊 Sin cocinar']].map(function (o) { return '<button class="chip' + (fOnly === o[0] ? ' on' : '') + '" data-a="fonly" data-v="' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</div>';
      h += '<div class="mut small" style="margin-bottom:6px">' + ids.length + ' receta' + (ids.length === 1 ? '' : 's') + '</div>' + (ids.length ? ids.map(rCard).join('') : '<div class="card mut" style="text-align:center">No hay recetas con ese filtro.</div>');
    } else if (k === 'ali') {
      h += '<p class="mut small" style="margin:0 0 8px">Valores por 100 g. Para ganar peso prioriza alimentos con más calorías por porción.</p>';
      Object.keys(FOODS).forEach(function (cat) {
        h += '<div class="h2">' + cat + '</div><div class="card" style="padding:4px 14px">' + FOODS[cat].map(function (x) { return '<div class="frow"><span class="fe">' + x[0] + '</span><div class="ft"><b>' + x[1] + '</b><span>' + x[4] + '</span></div><div class="fn"><b>' + x[2] + '</b><span>kcal · ' + x[3] + ' g P</span></div></div>'; }).join('') + '</div>';
      });
    } else {
      h += FOOD_TIPS.map(function (t3) { return '<div class="card tipc"><div class="tipe">' + t3[0] + '</div><div><b>' + t3[1] + '</b><p class="mut small" style="margin:4px 0 0;line-height:1.45">' + t3[2] + '</p></div></div>'; }).join('');
      h += '<div class="h2">Súbele calorías a lo que ya comes</div><div class="card">' + [['1 cda de mantequilla de maní', '+95'], ['½ aguacate', '+120'], ['1 cda de aceite de oliva', '+120'], ['1 vaso de leche entera', '+150'], ['30 g de nueces o almendras', '+190'], ['1 cda de miel', '+60'], ['1 banano', '+105'], ['1 huevo extra', '+70'], ['30 g de queso', '+110'], ['½ taza de arroz extra', '+100']].map(function (x) { return '<div class="li"><b>' + x[0] + '</b><span style="color:var(--acc);font-weight:800">' + x[1] + ' kcal</span></div>'; }).join('') + '</div>';
    }
    return h;
  }
  function wtHTML() {
    var pts = S.meas.filter(function (x) { return x.w; }).slice(-8);
    if (pts.length < 1) return '<p class="mut small" style="margin:8px 0 0">Anota tu peso una vez por semana para ver tu avance.</p>';
    var first = pts[0].w, last = pts[pts.length - 1].w, d = Math.round((last - first) * 10) / 10;
    return '<div class="exl" style="margin-top:10px">' + pts.slice(-4).reverse().map(function (m) { return '<div class="li"><b>' + m.d + '</b><span>' + m.w + ' kg</span></div>'; }).join('') + '</div>' +
      (pts.length > 1 ? '<p class="mut small" style="margin:8px 0 0">Cambio desde el primer registro: <b style="color:var(--txt)">' + (d > 0 ? '+' : '') + d + ' kg</b></p>' : '');
  }
  function recipeSheet(id) {
    var r = RECIPES[id];
    sheet('<div class="rhead"><div class="rbig">' + r[0] + '</div><div><div class="title" style="font-size:22px">' + r[1] + '</div><div class="mut small">' + FOOD_TYPES[r[2]] + ' · ' + r[5] + ' min</div></div></div>' +
      '<div class="sumgrid" style="margin:12px 0"><div><b>' + r[3] + '</b><span>kcal</span></div><div><b>' + r[4] + ' g</b><span>Proteína</span></div><div><b>' + r[5] + '</b><span>Minutos</span></div></div>' +
      '<div class="chips" style="margin-bottom:8px">' + fTags(r[6]) + '</div>' +
      '<div class="h2" style="margin-top:6px">Ingredientes</div><ul class="ing">' + r[7].map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' +
      '<div class="h2">Preparación</div><ol class="ing">' + r[8].map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol>' +
      '<p class="mut small">Valores aproximados por ración.</p>' +
      '<div class="row" style="margin-top:12px"><button class="btn sec sm sp" data-a="fadd" data-v="' + id + '">✓ Comí esto</button><button class="btn ghost sm" data-a="ffav" data-v="' + id + '">' + (S.food.fav[id] ? '❤️' : '🤍') + '</button></div>');
  }
  function foodPick() {
    var h = '<div class="title">Añadir comida</div><div class="chips" style="margin:10px 0">' + Object.keys(FOOD_TYPES).map(function (t) { return '<button class="chip' + (fType === t ? ' on' : '') + '" data-a="fpickt" data-v="' + t + '">' + FOOD_TYPES[t] + '</button>'; }).join('') + '</div>';
    var t0 = fType === 'all' ? 'des' : fType;
    h += Object.keys(RECIPES).filter(function (id) { return RECIPES[id][2] === t0; }).map(function (id) { var r = RECIPES[id]; return '<button class="rcard" data-a="fadd" data-v="' + id + '"><span class="re">' + r[0] + '</span><span class="rt"><b>' + r[1] + '</b><span>' + r[3] + ' kcal · ' + r[4] + ' g</span></span><i class="chev">＋</i></button>'; }).join('');
    sheet(h);
  }
  function foodAdd(id) {
    var r = RECIPES[id]; fLog().push({ id: id, n: r[1], k: r[3], p: r[4] }); save();
    toast('✅ Añadido: ' + r[3] + ' kcal');
  }
  function shopSheet() {
    var day = menuDay(fDay, (S.food.goal === 'gain' || S.food.goal === 'soft') ? 'gain' : 'keep'), seen = {}, rows = '';
    day.forEach(function (s2) { RECIPES[s2[1]][7].forEach(function (x) { if (!seen[x]) { seen[x] = 1; rows += '<label class="chk"><input type="checkbox"><span>' + x + '</span></label>'; } }); });
    sheet('<div class="title">🛒 Compras · ' + DAYN[fDay] + '</div><p class="mut small" style="margin:4px 0 10px">Ingredientes del menú de este día (por persona).</p>' + rows);
  }

  /* ---------- hojas y diálogos ---------- */
  function sheet(html) { var s = $('#sheet'); clearTimeout(shT); s.innerHTML = '<div class="sheet"><div class="grab"></div>' + html + '</div>'; s.className = 'on'; s.scrollTop = 0; }
  var shT = 0;
  function sheetClose() {
    destroySheetFig(); var el = $('#sheet'); if (el.className !== 'on') return;
    if (S && S.settings.fx === false) { el.className = ''; el.innerHTML = ''; return; }
    el.className = 'on out'; clearTimeout(shT); shT = setTimeout(function () { if (el.className === 'on out') { el.className = ''; el.innerHTML = ''; } }, 200);
  }
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
      '<div class="row" style="margin:8px 0 2px;flex-wrap:wrap"><span class="chip">' + e.cat + '</span><span class="chip">' + (e.type === 'time' ? '⏱ Por tiempo' : '🔁 Repeticiones') + '</span><span class="chip">' + (LVL_T[e.lv] || '') + '</span><span class="chip">💪 ' + e.m + '</span></div>' +
      e.steps.map(function (s, i) { return '<div class="step"><i>' + (i + 1) + '</i><div>' + s + '</div></div>'; }).join('') +
      '<div class="note">⚠️ ' + e.tip + '</div><button class="btn sec" style="margin-top:16px" data-a="closeSheet">Cerrar</button>');
    destroySheetFig();
    sheetFig = new Fig($('#sfig'), ANIMS[e.anim]);
  }

  function openPrev(id) {
    var steps = build(id), w = wInfo(id);
    sheet('<div class="row"><div style="font-size:40px">' + w.emoji + '</div><div><div class="title" style="font-size:22px">' + esc(w.name) + '</div><div class="mut small">~' + estMin(steps) + ' min</div></div></div>' +
      '<p class="mut small" style="margin:10px 0">' + w.desc + '</p><div class="exl">' + mainList(id).map(function (x) { return '<div class="li"><b>' + x.n + '</b><span>' + x.t + '</span></div>'; }).join('') + '</div>' +
      (!w.items ? '<p class="mut small" style="margin-top:10px">Calentamiento y estiramiento según tus ajustes.</p>' : '') +
      '<button class="btn" style="margin-top:16px" data-a="start" data-v="' + id + '">▶ Empezar</button>' +
      (w.custom ? '<div class="row" style="margin-top:10px"><button class="btn sec sm sp" data-a="cred" data-v="' + id + '">✏️ Editar</button><button class="btn ghost sm sp" data-a="crdel" data-v="' + id + '">🗑 Eliminar</button></div>' : ''));
  }

  /* ---------- plan de 4 semanas ---------- */
  function openPlan() {
    var i = planIdx(), h = '<div class="title" style="font-size:22px">📅 Plan de 4 semanas</div>';
    if (!S.plan || i < 0 || i >= 28) {
      h += '<p class="mut" style="margin:10px 0;line-height:1.5">' + (S.plan && i >= 28 ? '🎉 ¡Terminaste tu plan! Puedes empezar otro cuando quieras.' : 'Un calendario listo: cada semana tiene 4 días de entrenamiento, 1 de estiramientos y 2 de descanso activo. La dificultad sube sola.') + '</p>' +
        '<div class="row" style="flex-wrap:wrap">' + ['A', 'B', 'C', 'D', 'S', 'R'].map(function (k) { return '<span class="chip">' + PLAN_ICON[k] + ' ' + ({ A: 'Piernas', B: 'Pecho/espalda', C: 'Cuerpo completo', D: 'Core', S: 'Estirar', R: 'Descanso activo' })[k] + '</span>'; }).join('') + '</div>' +
        '<button class="btn" style="margin-top:16px" data-a="planstart">▶ Empezar hoy</button>';
    } else {
      var base = dnum(S.plan.start), w, k;
      for (w = 0; w < 4; w++) {
        h += '<div class="mut small" style="font-weight:800;margin:14px 0 6px">SEMANA ' + (w + 1) + '</div><div class="planrow">';
        for (k = 0; k < 7; k++) {
          var idx = w * 7 + k, ds = nstr(base + idx), r = S.days[ds], dn = r && r.w > 0, t = PLAN_WEEK[k], dd = ds.split('-'), wd = (new Date(+dd[0], +dd[1] - 1, +dd[2]).getDay() + 6) % 7;
          h += '<div class="pc' + (dn ? ' done' : '') + (idx === i ? ' today' : '') + (idx < i && !dn && t !== 'R' ? ' miss' : '') + '"><small>' + DAYS[wd] + '</small><span>' + PLAN_ICON[t] + '</span><i>' + (dn ? '✓' : '') + '</i></div>';
        }
        h += '</div>';
      }
      h += '<p class="mut small" style="margin-top:12px">Hoy: día ' + (i + 1) + ' de 28. 🦵 piernas · 💪 pecho/espalda · ⚡ cuerpo completo · 🎯 core · 🌱 estirar · 🛌 descanso activo (haz el chequeo de postura para mantener la racha).</p>' +
        '<button class="btn ghost" style="margin-top:12px" data-a="planstop">Dejar el plan</button>';
    }
    sheet(h + '<button class="btn sec" style="margin-top:10px" data-a="closeSheet">Cerrar</button>');
  }

  /* ---------- crear rutina propia ---------- */
  var cr = null;
  function openBuilder(id) {
    var c = null, i;
    for (i = 0; i < S.custom.length; i++) if (S.custom[i].id === id) c = S.custom[i];
    cr = { id: c ? c.id : null, name: c ? c.name : '', sets: {} };
    CHAIN_KEYS.forEach(function (k) { cr.sets[k] = 0; });
    if (c) c.slots.forEach(function (sl) { cr.sets[sl[0]] = sl[1]; });
    renderBuilder(0);
  }
  function renderBuilder(scr) {
    var rows = CHAIN_KEYS.map(function (k) {
      var cv = curVar(k), e = EX[cv.ex], n = cr.sets[k];
      return '<div class="crrow"><div class="sp"><b style="font-size:14px">' + e.n + '</b><div class="mut small">' + e.cat + ' · ' + targetTxt(cv.ex, cv.val, cv.type) + '</div></div>' +
        '<button class="stp" data-a="crd" data-v="' + k + '">−</button><b style="min-width:22px;text-align:center">' + n + '</b><button class="stp" data-a="cru" data-v="' + k + '">+</button></div>';
    }).join('');
    sheet('<div class="title" style="font-size:22px">' + (cr.id ? 'Editar' : 'Crear') + ' rutina</div><label>Nombre</label><input type="text" id="crname" data-set="crname" maxlength="24" value="' + esc(cr.name) + '" placeholder="Ej. Mi rutina de piernas">' +
      '<div class="mut small" style="margin:12px 0 2px">Elige cuántas series de cada ejercicio (0 = no incluir). La dificultad sube sola.</div>' + rows +
      '<button class="btn" style="margin-top:16px" data-a="crsave">Guardar rutina</button>');
    var sh = $('#sheet .sheet'); if (sh) sh.scrollTop = scr || 0;
  }

  /* ---------- reproductor ---------- */
  function clearTimer() { if (P && P.timer) { clearInterval(P.timer); P.timer = null; } if (P && P.autoT) { clearTimeout(P.autoT); P.autoT = null; } }
  function startTimer(secs, onTick, onEnd) {
    P.total = secs; P.end = Date.now() + secs * 1000; P.onTick = onTick; P.onEnd = onEnd; P.lastSec = null;
    clearTimer(); P.timer = setInterval(tick, 100); tick();
  }
  function tick() {
    if (!P) return;
    var rem = Math.max(0, P.end - Date.now()), s = Math.ceil(rem / 1000);
    P.rem = rem;
    if (P.onTick) P.onTick(rem, s);
    if (s !== P.lastSec) { P.lastSec = s; var rw = document.querySelector('.ringwrap'); if (rw) { rw.classList.remove('pulse'); void rw.offsetWidth; rw.classList.add('pulse'); } if (s > 0 && s <= 3 && P.beepTick) { beep(700, 90); vib(25); if (P.sayTick) say(String(s)); } }
    if (rem <= 0) { var f = P.onEnd; clearTimer(); if (f) f(); }
  }
  function pauseToggle() {
    if (!P) return;
    var b = $('#pp');
    if (P.auto) { P.autoPaused = !P.autoPaused; if (b) b.innerHTML = P.autoPaused ? '▶ Seguir' : '⏸ Pausa'; return; }
    if (P.timer) { P.remPaused = P.rem; clearTimer(); P.paused = true; if (b) b.innerHTML = '▶ Seguir'; }
    else if (P.paused) { P.paused = false; P.end = Date.now() + P.remPaused; P.timer = setInterval(tick, 100); if (b) b.innerHTML = '⏸ Pausa'; }
  }
  var RING = 2 * Math.PI * 76;
  function ring(frac) { return '<svg viewBox="0 0 170 170"><circle cx="85" cy="85" r="76" fill="none" style="stroke:var(--card2)" stroke-width="12"/><circle id="rc" cx="85" cy="85" r="76" fill="none" stroke="'+accent()+'" stroke-width="12" stroke-linecap="round" stroke-dasharray="' + RING.toFixed(1) + '" stroke-dashoffset="' + (RING * (1 - frac)).toFixed(1) + '"/></svg>'; }
  function setRing(frac, color) { var c = $('#rc'); if (c) { c.setAttribute('stroke-dashoffset', (RING * (1 - Math.max(0, Math.min(1, frac)))).toFixed(1)); if (color) c.setAttribute('stroke', color); } }

  function header() {
    var pct = Math.round(P.i / P.steps.length * 100);
    return '<div class="ph"><button class="x" data-a="quit">✕</button><div class="bar"><i style="width:' + pct + '%"></i></div><span class="mut small" style="font-weight:800">' + (S.settings.hands ? '🙌 ' : '') + pct + '%</span></div>';
  }
  function ov(html) { var o = $('#overlay'); o.innerHTML = html; o.className = 'on'; }

  function startWorkout(id) {
    unlockAudio(); sheetClose();
    P = { id: id, steps: build(id), i: 0, t0: Date.now(), sets: 0, exs: 0, chains: {}, exk: {}, done: [], adj: {}, timer: null };
    keepAwake(true); showStep();
  }

  var ADJ = '<div class="adj"><button data-a="adj" data-v="-1">😅 Muy difícil</button><button data-a="adj" data-v="1">💪 Muy fácil</button></div>';
  /* manos libres: cuenta las repeticiones solo, con voz y pitidos, y avanza al terminar */
  function autoReps(st) {
    var n = 0, pace = (S.settings.pace || 2.5) * 1000;
    function tickRep() {
      if (!P || P.steps[P.i] !== st) return;
      if (P.autoPaused) { P.autoT = setTimeout(tickRep, 300); return; }
      n++; P.count = n;
      var cn = $('#cn'); if (cn) cn.textContent = n;
      var c = $('#cnt'); if (c) { c.classList.remove('hit'); void c.offsetWidth; c.classList.add('hit'); }
      beep(900, 50, 0.15); vib(15);
      say(n === st.val ? 'Última' : String(n));
      if (n >= st.val) {
        if (c) c.classList.add('full'); beep(1200, 250, 0.3); vib(120);
        P.autoT = setTimeout(function () { if (P && P.steps[P.i] === st) completeStep(); }, 1500);
      } else P.autoT = setTimeout(tickRep, pace);
    }
    P.autoT = setTimeout(tickRep, 3800);   // tiempo para que la voz anuncie el ejercicio
  }
  function showStep() {
    clearTimer(); destroyFigs();
    var st = P.steps[P.i];
    if (!st) return finish();
    P.paused = false; P.count = 0; P.beepTick = false; P.sayTick = false;
    if (st.k === 'rest') return showRest(st);
    try { $('#overlay').style.setProperty('--cc', CATC[EX[st.ex].cat] || '74,168,255'); } catch (e) { }
    var e = EX[st.ex], isTime = st.type === 'time';
    var kind = st.kind === 'main' && st.label ? st.label : st.kind === 'warm' ? 'Calentamiento' : st.kind === 'cool' ? (st.label || 'Estiramiento') : 'Serie ' + st.set + ' de ' + st.sets;
    var html = header() + '<div class="pbody"><div class="kind">' + kind + '</div><div class="pname">' + e.n + '</div>' +
      '<div class="figbox"><svg id="pfig"></svg></div>';
    if (isTime) {
      html += '<div class="ringwrap">' + ring(1) + '<div class="tx"><b id="rn">3</b><span id="rl">¡Prepárate!</span></div></div>';
    } else {
      html += '<div class="target">Haz <b id="tv">' + st.val + '</b> repeticiones</div><button class="counter" id="cnt" data-a="cnt"><b id="cn">0</b><span>' + (S.settings.hands ? '🙌 contando solo' : 'toca para contar') + '</span></button>';
      if (st.kind === 'main' && st.chain) html += ADJ;
    }
    html += '<div class="cue">' + e.steps.map(function (s, i) { return (i + 1) + '. ' + s; }).join('<br>') + '</div></div>';
    html += '<div class="pfoot"><button class="rb" data-a="pprev">‹</button>' +
      ((isTime || S.settings.hands) ? '<button class="btn sec" id="pp" data-a="pp">⏸ Pausa</button>' : '<button class="btn" data-a="done">¡Listo! ✓</button>') +
      '<button class="rb" data-a="pnext">›</button></div>';
    ov(html);
    mountFig($('#pfig'), st.ex);
    say(e.n + (isTime ? '. ' + st.val + ' segundos' : '. ' + st.val + ' repeticiones'));
    P.auto = !!(S.settings.hands && !isTime); P.autoPaused = false;
    if (P.auto) autoReps(st);
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
        (nx.kind === 'main' ? 'Serie ' + nx.set + '/' + nx.sets + ' · ' : '') + '<span id="upv">' + targetTxt(nx.ex, nx.val, nx.type) + '</span></div>' + (nx.kind === 'main' && nx.chain ? ADJ : '') + '</div></div>';
    }
    html += '</div><div class="pfoot"><button class="btn sec sm" style="width:auto" data-a="plus">+15 s</button><button class="btn" data-a="pnext">Saltar descanso ›</button></div>';
    ov(html);
    if (nx) mountFig($('#pfig'), nx.ex);
    P.beepTick = true; P.sayTick = true;
    say((st.title ? st.title.replace(/[^\wáéíóúñ ]/gi, '') : 'Descanso') + (nx ? '. Siguiente: ' + EX[nx.ex].n : ''));
    startTimer(st.secs, function (rem, s) { var n = $('#rn'); if (n) n.textContent = s; setRing(rem / (P.total * 1000), '#c084fc'); }, function () { beep(1000, 300, 0.35); vib(150); next(); });
  }

  /* ajuste rápido de dificultad en pleno entrenamiento */
  function adjust(dir) {
    var idx = P.i, st = P.steps[idx], j;
    if (st.k === 'rest') { idx = -1; for (j = P.i + 1; j < P.steps.length; j++) if (P.steps[j].k === 'ex') { idx = j; break; } if (idx < 0) return; st = P.steps[idx]; }
    if (st.kind !== 'main' || !(st.chain || st.key)) { toast('Solo en las series de la rutina'); return; }
    var v = st.chain ? CHAINS[st.chain][S.chains[st.chain].i] : { st: stepX(st.key), max: maxX(st.key) }, delta = v.st * 2, lo = st.type === 'time' ? 5 : 3, hi = v.max + v.st * 2, gk = st.chain || st.key;
    var nv = Math.max(lo, Math.min(hi, st.val + dir * delta));
    if (nv === st.val) { toast(dir > 0 ? 'Ya estás en el máximo' : 'Ya está en el mínimo'); return; }
    for (j = idx; j < P.steps.length; j++) { var q = P.steps[j]; if (q.k === 'ex' && q.kind === 'main' && (q.chain || q.key) === gk) q.val = nv; }
    if (!S.settings.nojump) P.adj[gk] = nv;
    toast((dir > 0 ? '💪 ' : '😅 ') + 'Ahora: ' + targetTxt(st.ex, nv, st.type));
    var tv = $('#tv'); if (tv) tv.textContent = nv;
    var uv = $('#upv'); if (uv) uv.textContent = targetTxt(st.ex, nv, st.type);
    say('Ahora ' + nv);
  }

  function completeStep() {
    var st = P.steps[P.i];
    if (st && st.kind === 'main') { P.sets++; if (st.chain) P.chains[st.chain] = 1; else if (st.key) P.exk[st.key] = st.val; P.done.push({ ex: st.ex, val: st.val }); }
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
    var secs = Math.round((Date.now() - P.t0) / 1000), d = today(), id = P.id, light = isLight(id), isQuick = !!QUICK[id] || /^CH:/.test(id);
    var day = S.days[d] || (S.days[d] = { w: 0, sec: 0, sets: 0 });
    day.w++; day.sec += secs; day.sets += P.sets; delete day.freeze;
    var reps = 0, best = {};
    P.done.forEach(function (x) {
      if (!S.recs[x.ex] || x.val > S.recs[x.ex]) S.recs[x.ex] = x.val;
      if (EX[x.ex].type === 'reps') reps += x.val;
      if (!best[x.ex] || x.val > best[x.ex]) best[x.ex] = x.val;
    });
    Object.keys(best).forEach(function (k) {
      var a = S.exh[k] || (S.exh[k] = []), last = a[a.length - 1];
      if (last && last.d === d) last.v = Math.max(last.v, best[k]); else a.push({ d: d, v: best[k] });
      if (a.length > 40) a.shift();
    });
    day.reps = (day.reps || 0) + reps;
    if (new Date().getHours() < 8) day.early = 1;
    // ajustes rápidos hechos durante la sesión
    Object.keys(P.adj).forEach(function (k) { if (CHAINS[k]) S.chains[k].v = Math.min(CHAINS[k][S.chains[k].i].max, P.adj[k]); else P.exk[k] = P.adj[k]; });
    var nw = new Date(); (S.hrs || (S.hrs = [])).push(nw.getHours() * 60 + nw.getMinutes()); if (S.hrs.length > 30) S.hrs.shift();
    S.total++; S.log.push({ d: d, id: id, sec: secs }); if (S.log.length > 300) S.log.shift();
    var done = Object.keys(P.chains);
    if (!light) {
      if (ORDER.indexOf(id) >= 0) S.rot = (ORDER.indexOf(id) + 1) % ORDER.length;
      var donex = Object.keys(P.exk);
      S.last = { prev: clone(S.chains), done: done, mult: 1, prevx: clone(S.exv), donex: donex };
      S.chains = applyProg(S.last.prev, done, 1);
      donex.forEach(function (k) { S.exv[k] = P.exk[k]; });
      S.exv = applyProgX(S.exv, donex, 1);
    } else S.last = null;
    // XP, meta semanal y plan
    var gain = light ? 15 : 20 + P.sets * 6 + (isQuick ? 0 : 20), wk = weekKey(), tp = todayPlan();
    P.goalHit = false; P.planDay = false; P.chalMsg = '';
    if (/^CH:/.test(id)) { var cm = chalFinish(id); gain += cm.xp; P.chalMsg = cm.msg; }
    if (weekCount() >= S.settings.goal && !S.goalsHit[wk]) { S.goalsHit[wk] = 1; gain += 50; P.goalHit = true; }
    if (tp && tp.t !== 'R') { gain += 10; P.planDay = true; }
    if (tp && tp.i >= 27) S.planDone = true;
    var up = addXP(gain); P.xp = { gain: gain, up: up };
    save(); P.newBadges = checkBadges(false);
    save(); syncReminder(); cloudAuto();
    statEvent('workout', { r: /^U\d+/.test(id) ? 'U' : /^CH:/.test(id) ? 'CH' : id, s: secs, n: P.sets }); statsPing(true);
    beep(1000, 200); setTimeout(function () { beep(1400, 400); }, 220); vib(400); say('Entrenamiento completado. ¡Buen trabajo!');
    summary(secs, light);
  }

  function changesHTML() {
    if (!S.last || (!S.last.done.length && !(S.last.donex || []).length)) return '';
    var outx = (S.last.donex || []).map(function (k) { var a = (S.last.prevx || {})[k]; if (a == null) a = defv(k); return EX[k].n + ': ' + targetTxt(k, a) + ' → <b>' + targetTxt(k, S.exv[k]) + '</b>'; });
    var out = S.last.done.map(function (k) {
      var a = S.last.prev[k], b = S.chains[k], eb = CHAINS[k][b.i];
      if (a.i !== b.i) return '🎉 <b>¡Subes de nivel!</b> ' + EX[eb.ex].n + ' · ' + targetTxt(eb.ex, b.v);
      return EX[eb.ex].n + ': ' + targetTxt(eb.ex, a.v) + ' → <b>' + targetTxt(eb.ex, b.v) + '</b>';
    }).concat(outx);
    return '<div class="card" style="margin-top:14px"><div class="mut small" style="font-weight:800;margin-bottom:6px">PRÓXIMA VEZ</div>' + out.map(function (x) { return '<div style="padding:4px 0;font-size:14px">' + x + '</div>'; }).join('') + '</div>';
  }
  function summary(secs, light) {
    var st = stats(), x = P.xp;
    var html = '<div class="pbody" style="padding-top:calc(var(--safe-t) + 20px)"><div class="trophy">🏆</div><div class="title" style="text-align:center;margin-top:6px">¡Entrenamiento completado!</div>' +
      '<p style="text-align:center;margin:8px 0 0;color:var(--mut);line-height:1.4">' + cheer(st.cur) + '</p>' +
      '<div class="card streak" style="margin-top:16px;text-align:center"><div class="flame" style="font-size:44px">🔥</div><div class="num">' + st.cur + '</div><div style="font-weight:800">' + (st.cur === 1 ? 'día de racha' : 'días de racha') + '</div></div>' +
      '<div class="row" style="justify-content:center;flex-wrap:wrap;margin-bottom:6px"><span class="chip on">+' + x.gain + ' XP</span>' + (P.goalHit ? '<span class="chip">🎯 ¡Meta semanal cumplida! +50</span>' : '') + (P.planDay ? '<span class="chip">📅 Día del plan ✓</span>' : '') + '</div>' +
      (P.chalMsg ? '<div class="note shine" style="text-align:center;font-weight:800">' + P.chalMsg + '</div>' : '') +
      (P.newBadges && P.newBadges.length ? '<div class="note shine" style="text-align:center;font-weight:800">' + P.newBadges.map(function (b) { return b.e + ' ¡Nueva insignia: ' + b.n + '!'; }).join('<br>') + '</div>' : '') +
      (x.up ? '<div class="note shine" style="text-align:center;font-weight:800">⭐ ¡Subiste al nivel ' + x.up + ': ' + lvlName(x.up) + '!</div>' : '') +
      '<div class="sumgrid"><div><b>' + mmss(secs) + '</b><span>Tiempo</span></div><div><b>' + P.sets + '</b><span>Series</span></div><div><b>' + P.exs + '</b><span>Ejercicios</span></div></div>';
    if (!light && S.last && (S.last.done.length || (S.last.donex || []).length)) {
      html += '<div class="mut small" style="font-weight:800;margin-bottom:8px">¿CÓMO TE SENTISTE?</div><div class="fb"><button data-a="fb" data-v="2">😄 Fácil</button><button class="on" data-a="fb" data-v="1">👍 Justo</button><button data-a="fb" data-v="0">😓 Difícil</button></div><div id="chg">' + changesHTML() + '</div>';
    }
    html += '<textarea class="note2" id="note" maxlength="200" placeholder="📝 Nota del día (opcional): ¿cómo te sentiste?"></textarea>';
    html += '</div><div class="pfoot"><button class="btn" data-a="close">Terminar</button></div>';
    ov(html);
    confetti();
  }
  function closeOverlay() {
    var nt = $('#note'); if (nt && nt.value.trim()) { var dd = S.days[today()]; if (dd) { dd.note = nt.value.trim(); save(); } }
    $('#overlay').className = ''; $('#overlay').innerHTML = ''; P = null; tab = 'home'; render();
    runWaiting(); }

  function quit() {
    dialog('¿Salir del entrenamiento?', 'Se perderá el avance de esta sesión.', 'Salir', function () { clearTimer(); destroyFigs(); keepAwake(false); closeOverlay(); }, true);
  }

  /* ---------- tutorial inicial (también en Ajustes → Acerca de) ---------- */
  var tutI = 0, tutFig = null;
  var TUT = [
    { fig: 'squat', t: '¡Bienvenido a Crece Fit!', d: 'Rutinas sin equipo para principiantes. Entrenas en casa, a tu ritmo y sin complicarte.' },
    { fig: 'jacks', t: 'Un muñequito te enseña', d: 'Cada ejercicio tiene su animación y sus pasos. Mira todos en la pestaña Ejercicios antes de empezar.' },
    { emoji: '🔥', t: 'Mantén tu racha', d: 'Entrena un poco cada día. Suma XP, sube de nivel, cumple tu meta semanal y desbloquea logros. Si faltas un día, un congelamiento salva tu racha.' },
    { emoji: '👆', t: 'Todo por secciones', d: 'Cambia de sección tocando o deslizando hacia los lados. En Ajustes activas el modo manos libres, la voz, el widget y la copia en la nube.' }
  ];
  function tutDraw() {
    var el = $('#tut'); if (!el) return;
    var t = TUT[tutI], last = tutI === TUT.length - 1;
    if (tutFig) { tutFig.destroy(); tutFig = null; }
    el.innerHTML = '<button class="tskip" data-a="tutskip">' + (last ? '' : 'Saltar') + '</button><div class="tbody"><div class="tvis">' + (t.fig ? '<div class="figbox"><svg id="tfig"></svg></div>' : '<div class="temo">' + t.emoji + '</div>') + '</div><h2 class="tt">' + t.t + '</h2><p class="td">' + t.d + '</p></div>' +
      '<div class="tdots">' + TUT.map(function (_, k) { return '<i class="' + (k === tutI ? 'on' : '') + '"></i>'; }).join('') + '</div>' +
      '<div class="tfoot"><button class="btn" data-a="tutnext">' + (last ? '¡Empezar! 💪' : 'Siguiente') + '</button></div>';
    if (t.fig) tutFig = new Fig($('#tfig'), ANIMS[t.fig]);
  }
  function showTutorial() {
    if ($('#tut')) return;
    var el = document.createElement('div'); el.className = 'tut'; el.id = 'tut'; document.body.appendChild(el);
    var x0 = 0;
    el.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    el.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 60) { if (dx < 0 && tutI < TUT.length - 1) { tutI++; tutDraw(); } else if (dx > 0 && tutI > 0) { tutI--; tutDraw(); } }
    }, { passive: true });
    tutI = 0; tutDraw();
  }
  function tutClose() {
    var el = $('#tut'); if (tutFig) { tutFig.destroy(); tutFig = null; }
    if (el && el.parentNode) el.parentNode.removeChild(el);
    S.tutDone = true; save();
  }

  /* ---------- onboarding ---------- */
  var obLvl = 0, obGoal = 'forma';
  function goalOpts() { return Object.keys(GOALS).map(function (k) { return '<button class="opt gopt' + (obGoal === k ? ' on' : '') + '" data-a="obgoal" data-v="' + k + '"><b>' + GOALS[k].e + ' ' + GOALS[k].n + '</b><span>' + GOALS[k].d + '</span></button>'; }).join(''); }
  function lvlOpts() { return LEVELS.map(function (l, i) { return '<button class="opt lopt' + (obLvl === i ? ' on' : '') + '" data-a="oblvl" data-v="' + i + '"><b>' + l.e + ' ' + l.n + '</b><span>' + l.d + '</span></button>'; }).join(''); }
  function profileSheet() {
    var p = S.profile || { goal: 'forma', level: 0 }; obGoal = p.goal; obLvl = p.level;
    sheet('<div class="title">Tu objetivo</div><p class="mut small" style="margin:6px 0 12px">Con esto armamos tus rutinas y los ejercicios.</p><label>¿Qué quieres lograr?</label>' + goalOpts() + '<label>Tu nivel</label>' + lvlOpts() +
      '<div class="note">Se reemplazan tus 4 rutinas por las de tu objetivo. Tu racha y tus récords no se pierden.</div><button class="btn" style="margin-top:14px" data-a="profsave">Guardar y armar mi programa</button>');
  }
  function onboarding() {
    var o = document.createElement('div'); o.className = 'ob'; o.id = 'ob';
    o.innerHTML = '<div class="oblogo">' + (SPLASH_HTML.match(/<svg[\s\S]*?<\/svg>/) || [''])[0].replace('class="lgo"', 'class="lgo" width="84" height="84"') + '</div><div class="title" style="text-align:center;margin:6px 0 4px">Crece Fit</div>' +
      '<p class="mut" style="text-align:center;line-height:1.45;margin-bottom:18px">Rutinas sin equipo, con tutoriales animados, temporizadores y tu racha diaria.</p>' +
      '<label>¿Cómo te llamas? (opcional)</label><input type="text" id="obn" maxlength="20" placeholder="Tu nombre">' +
      '<label>Tu estatura actual en cm (opcional)</label><input type="number" id="obh" inputmode="decimal" placeholder="Ej. 168">' +
      '<label>¿Qué quieres lograr?</label>' + goalOpts() + '<label>Tu nivel</label>' + lvlOpts() +
      '<div class="note">🌱 Sobre la altura: depende mucho de la genética, pero dormir, comer bien, buena postura y ejercicio te ayudan a llegar a tu máximo.</div>' +
      '<button class="btn" style="margin-top:20px" data-a="obstart">¡Empezar!</button>';
    document.body.appendChild(o);
  }

  /* hábitos completos = +15 XP (una vez por día) */


  /* ---------- acciones ---------- */
  function setBool(k) { S.settings[k] = !S.settings[k]; save(); }
  document.addEventListener('pointerdown', function (ev) {
    if (S && S.settings.fx === false) return;
    var t = ev.target.closest && ev.target.closest('.btn,.tab,.mini,.rcard,.exc,.chip,.opt,.seg button,.seg2 button,.sw2'); if (!t) return;
    var r = t.getBoundingClientRect(), d = Math.max(r.width, r.height) * 1.6, e = document.createElement('span');
    e.className = 'rip'; e.style.cssText = 'width:' + d + 'px;height:' + d + 'px;left:' + (ev.clientX - r.left - d / 2) + 'px;top:' + (ev.clientY - r.top - d / 2) + 'px';
    t.classList.add('rp'); t.appendChild(e); setTimeout(function () { if (e.parentNode) e.parentNode.removeChild(e); }, 650);
  }, { passive: true });
  document.addEventListener('click', function (ev) {
    if (ev.target.id === 'sheet') { sheetClose(); return; }
    var t = ev.target.closest('[data-a]'); if (!t) return;
    var a = t.getAttribute('data-a'), v = t.getAttribute('data-v');
    switch (a) {
      case 'tab': if (v === tab) break; if (v === 'set' && tab !== 'set') setSec = null; tab = v; fx.tab = true; vib(6);
        vt(function () { render(true); }); fx.tab = false; break;
      case 'tutnext': if (tutI < TUT.length - 1) { tutI++; tutDraw(); } else tutClose(); break;
      case 'tutskip': tutClose(); break;
      case 'tutopen': showTutorial(); break;
      case 'pn': var pq = v.split(':'); switchPanel(pq[0], pq.slice(1).join(':')); break;
      case 'sec': setSec = v; render(true); break;
      case 'secback': setSec = null; render(true); break;
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
      case 'tday': var ix = +v, cur = (tdArr() || [0, 1, 2, 3, 4, 5, 6]).slice(), pos = cur.indexOf(ix);
        if (pos >= 0) { if (cur.length === 1) { toast('Deja al menos un día'); break; } cur.splice(pos, 1); } else cur.push(ix);
        cur.sort(function (a, b) { return a - b; }); S.settings.tdays = cur.length === 7 ? null : cur; setTDays(); render(); break;
      case 'tdall': S.settings.tdays = null; setTDays(); render(); break;
      case 'theme': S.settings.theme = v; save(); applyTheme(); render(); break;
      case 'style': S.settings.style = v; save(); applyTheme(); render(); break;
      case 'mode': S.settings.mode = v; save(); applyTheme(); render(); break;
      case 'tog':
        setBool(v); if (v === 'fx' || v === 'black') applyTheme();
        if (v === 'voice' && S.settings.voice) say('Voz activada');
        if (v === 'stats') { if (S.settings.stats) { statsPing(true); } else statsDelete(); }
        if (v === 'smart') syncReminder();
        if (v === 'rem' || v === 'risk') { if ((S.settings.rem || S.settings.risk) && AND() && AND().requestNotif) { try { AND().requestNotif(); } catch (e) { } } syncReminder(); }
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
        dialog('¿Borrar todo?', 'Se eliminarán tu racha, historial y progreso. No se puede deshacer.', 'Borrar', function () { statsDelete(); try { localStorage.removeItem(KEY); } catch (e) { } S = null; load(); save(); applyTheme(); onboarding(); render(true); syncReminder(); }, true); break;
      case 'opt': var kv = v.split(':'); S.settings[kv[0]] = isNaN(kv[1]) ? kv[1] : +kv[1]; save(); if (kv[0] === 'perf') applyTheme(); render(); break;
      case 'hbv': hbView = v; switchPanelRefresh2(); break;
      case 'hbcat': hbCat = v; switchPanelRefresh2(); break;
      case 'hbt': var dd0 = today(); S.hb.log[dd0] = S.hb.log[dd0] || {}; S.hb.log[dd0][v] = S.hb.log[dd0][v] ? 0 : 1; fx.hab = v; save(); hbXP(); switchPanelRefresh2(); fx.hab = null; break;
      case 'hbi': hbSheet(v); break;
      case 'hbadd': if (S.hb.act.indexOf(v) < 0) S.hb.act.push(v); save(); toast('Hábito añadido'); sheetClose(); switchPanelRefresh2(); break;
      case 'hbrm': S.hb.act = S.hb.act.filter(function (x) { return x !== v; }); save(); sheetClose(); switchPanelRefresh2(); break;
      case 'hbpack': HPACKS.forEach(function (p) { if (p.id === v) p.ids.forEach(function (id) { if (S.hb.act.indexOf(id) < 0) S.hb.act.push(id); }); }); save(); toast('Colección añadida'); hbView = 'hoy'; switchPanelRefresh2(); break;
      case 'hbnew': hbNewSheet(); break;
      case 'hbico': hbNewSheet.ico = +v; Array.prototype.forEach.call(document.querySelectorAll('.hic'), function (b) { b.classList.toggle('on', b.getAttribute('data-v') === v); }); break;
      case 'hbcc': hbNewSheet.cat = v; Array.prototype.forEach.call(document.querySelectorAll('.hcc'), function (b) { b.classList.toggle('on', b.getAttribute('data-v') === v); }); break;
      case 'hbsave':
        var hn = ($('#hbn').value || '').trim(); if (!hn) { toast('Escribe un nombre'); break; }
        var hid2 = 'c_' + Date.now(); S.hb.custom.push({ id: hid2, n: hn, e: HB_ICONS[hbNewSheet.ico || 0], cat: hbNewSheet.cat || 'Disciplina' }); S.hb.act.push(hid2); save(); sheetClose(); hbView = 'hoy'; switchPanelRefresh2(); toast('Hábito creado'); break;
      case 'slp':
        var hs = hab(); hs.sl = Math.max(3, Math.min(12, (hs.sl || 7.5) + 0.5 * (+v))); save(); hbXP(); if (tab === 'home') switchPanelRefresh2(); else render(); break;
      case 'evx': progEx = v; render(); break;
      case 'planopen': openPlan(); break;
      case 'planstart': S.plan = { start: today() }; S.planDone = false; save(); sheetClose(); toast('📅 ¡Plan iniciado! Hoy es el día 1'); render(); break;
      case 'planstop': dialog('¿Dejar el plan?', 'Tu progreso y tu racha no se pierden. Volverás a las rutinas en rotación.', 'Dejar plan', function () { S.plan = null; save(); sheetClose(); render(); }, true); break;
      case 'crnew': openBuilder(null); break;
      case 'cred': openBuilder(v); break;
      case 'crdel': dialog('¿Eliminar rutina?', 'Esta rutina se borrará. No se puede deshacer.', 'Eliminar', function () { S.custom = S.custom.filter(function (c) { return c.id !== v; }); save(); sheetClose(); render(); }, true); break;
      case 'cru': case 'crd':
        var sh = $('#sheet .sheet'), sc = sh ? sh.scrollTop : 0;
        cr.sets[v] = Math.max(0, Math.min(5, cr.sets[v] + (a === 'cru' ? 1 : -1))); renderBuilder(sc); break;
      case 'crsave':
        var slots = []; CHAIN_KEYS.forEach(function (k) { if (cr.sets[k] > 0) slots.push([k, cr.sets[k]]); });
        if (!slots.length) { toast('Elige al menos un ejercicio'); break; }
        var nm = (cr.name || '').trim() || 'Mi rutina';
        if (cr.id) { S.custom.forEach(function (c) { if (c.id === cr.id) { c.name = nm; c.slots = slots; } }); }
        else S.custom.push({ id: 'U' + Date.now(), name: nm, slots: slots });
        save(); sheetClose(); toast('Rutina guardada ✅'); render(); break;
      case 'adj': adjust(+v); break;
      case 'statsyes': S.settings.stats = true; save(); dialogClose(); statsPing(true); statEvent('consent', { v: 1 }); toast('¡Gracias! 💙'); break;
      case 'statsno': S.settings.stats = false; save(); dialogClose(); break;
      case 'pinw':
        try { if ((AND().pinWidget2 ? AND().pinWidget2(v || 'streak') : AND().pinWidget())) toast('Elige dónde poner el widget 👆'); else toast('Mantén pulsado un espacio vacío de tu pantalla → Widgets → Crece Fit'); } catch (e) { }
        break;
      case 'cloudon': cloudOn(); break;
      case 'cloudsave': cloudSave(false).then(function () { render(); }); break;
      case 'cloudauto': cloudCfg().auto = !cloudCfg().auto; save(); render(); break;
      case 'cloudcopy': try { if (AND() && AND().copy) AND().copy(cloudCfg().code); toast('Código copiado 📋'); } catch (e) { } break;
      case 'cloudrestore':
        sheet('<div class="title" style="font-size:22px">☁️ Restaurar desde la nube</div><p class="mut small" style="margin:8px 0">Escribe el código de tu copia (lo ves en Ajustes del otro teléfono).</p><input type="text" id="ccode" maxlength="19" placeholder="XXXX-XXXX-XXXX-XXXX" style="text-transform:uppercase;letter-spacing:1px"><button class="btn" style="margin-top:12px" data-a="cloudfind">Buscar copia</button>'); break;
      case 'cloudfind': cloudFind(($('#ccode').value || '')); break;
      case 'cloudoff':
        dialog('¿Desactivar la copia?', 'Se borrará la copia guardada en la nube y este teléfono dejará de subirla. Tus datos locales no se tocan.', 'Desactivar', function () { cloudOff(); }, true); break;
      case 'gosite': dialogClose(); openSite(); break;
      case 'apkno': if (apkInfo) { S.apkDismiss = apkInfo.code; save(); } render(); break;
      case 'updcheck':
        upd.shown = false; upd.apkShown = false; toast('Buscando…');
        try { if (AND() && AND().checkNow) AND().checkNow(); } catch (e) { }
        jsCheck(true); break;
      case 'updno': dialogClose(); break;
      case 'updgo':
        upd.busy = true; S.updTry = { from: window.APP_VERSION || 0, t: Date.now() }; save();
        $('#upd').innerHTML = '<h3 id="uph">Actualizando…</h3><svg id="uprk" width="190" height="190" style="display:block;margin:6px auto 0"></svg><div class="upct" id="upt" style="font-size:30px">0%</div><p class="mut small" id="upn" style="text-align:center;margin-top:6px">No cierres la app</p>'; startRocket($('#uprk'));
        try { if (AND() && AND().startUpdate) AND().startUpdate(); else { upd.busy = false; dialogClose(); location.reload(); } } catch (e) { window.__updateError(); }
        break;
      case 'mno': dialogClose(); break;
      case 'myes': var f = dialog.fn; dialogClose(); if (f) f(); break;
      case 'oblvl': obLvl = +v; Array.prototype.forEach.call(document.querySelectorAll('.lopt'), function (b) { b.classList.toggle('on', b.getAttribute('data-v') === v); }); break;
      case 'obgoal': obGoal = v; Array.prototype.forEach.call(document.querySelectorAll('.gopt'), function (b) { b.classList.toggle('on', b.getAttribute('data-v') === v); }); break;
      case 'profopen': profileSheet(); break;
      case 'studio': try { var su = 'https://daijstudio.daijstudio.workers.dev/studio/'; if (AND() && AND().openUrl) AND().openUrl(su); else if (AND() && AND().copy) { AND().copy(su); toast('Enlace copiado'); } else window.open(su, '_blank'); } catch (e) { } break;
      case 'boxclasses': sheetClasses(); break;
      case 'chalstart': S.chal = { id: v, start: today(), done: {}, last: '' }; save(); toast('Reto iniciado: ' + CHALLENGES[v].n); switchPanelRefresh2(); break;
      case 'chalquit': dialog('¿Abandonar el reto?', 'Perderás el progreso de este reto. Tu racha y demás datos no se tocan.', 'Abandonar', function () { S.chal = null; save(); switchPanelRefresh2(); }, true); break;
      case 'facerout': sheetFaceRoutines(); break;
      case 'faceguide': sheetFaceGuide(); break;
      case 'fset': foodRead(); var kv = v.split(':'); S.food[kv[0]] = kv[0] === 'act' ? +kv[1] : kv[1]; save(); S.food.done = false; var pn1 = $('#pnl'); if (pn1) pn1.innerHTML = foodPanel('plan'); break;
      case 'fcalc':
        foodRead(); if (!foodCalc(S.food)) { toast('Completa edad, peso y estatura'); break; }
        S.food.done = true; save(); render(); break;
      case 'fedit': S.food.done = false; save(); render(); break;
      case 'fdayset': fDay = +v; switchPanelRefresh(); break;
      case 'fview': recipeSheet(v); break;
      case 'fadd': foodAdd(v); sheetClose(); if (pst.food === 'plan') switchPanelRefresh(); break;
      case 'fdel': fLog().splice(+v, 1); save(); switchPanelRefresh(); break;
      case 'fpick': foodPick(); break;
      case 'fpickt': fType = v; foodPick(); break;
      case 'fcust':
        sheet('<div class="title">Comida manual</div><label>¿Qué comiste?</label><input type="text" id="cfn" maxlength="30" placeholder="Ej. Arroz con pollo"><div class="row"><div class="sp"><label>Calorías</label><input type="number" id="cfk" inputmode="numeric" placeholder="500"></div><div class="sp"><label>Proteína (g)</label><input type="number" id="cfp" inputmode="numeric" placeholder="25"></div></div><button class="btn" style="margin-top:14px" data-a="fcsave">Guardar</button>'); break;
      case 'fcsave':
        var ck = parseInt($('#cfk').value, 10); if (!(ck > 0)) { toast('Escribe las calorías'); break; }
        fLog().push({ n: ($('#cfn').value || 'Comida').trim() || 'Comida', k: ck, p: parseInt($('#cfp').value, 10) || 0 }); save(); sheetClose(); switchPanelRefresh(); break;
      case 'fall':
        var dd = menuDay(fDay, (S.food.goal === 'gain' || S.food.goal === 'soft') ? 'gain' : 'keep'); dd.forEach(function (s2) { var r = RECIPES[s2[1]]; fLog().push({ id: s2[1], n: r[1], k: r[3], p: r[4] }); }); save(); toast('✅ Día registrado'); break;
      case 'fshop': shopSheet(); break;
      case 'ftype': fType = v; switchPanelRefresh(); break;
      case 'fonly': fOnly = v; switchPanelRefresh(); break;
      case 'ffav': if (S.food.fav[v]) delete S.food.fav[v]; else S.food.fav[v] = 1; save(); recipeSheet(v); break;
      case 'fwt':
        var wv = parseFloat($('#fwt').value); if (!(wv >= 20 && wv <= 300)) { toast('Escribe un peso válido'); break; }
        var lh2 = 0; S.meas.forEach(function (m) { if (m.h) lh2 = m.h; });
        S.meas.push({ d: today(), h: 0, w: wv }); S.food.w = wv; save(); toast('Peso guardado ✅'); render(); break;
      case 'profsave': sheetClose(); applyProfile(obGoal, obLvl, true); toast('✅ Programa listo: ' + GOALS[obGoal].n + ' · ' + LEVELS[obLvl].n); render(true); break;
      case 'obstart':
        S = fresh(); S.setup = true; S.name = ($('#obn').value || '').trim(); applyProfile(obGoal, obLvl, true);
        var hh = parseFloat($('#obh').value); if (hh >= 80 && hh <= 250) S.meas.push({ d: today(), h: hh, w: 0 });
        save(); document.body.removeChild($('#ob')); render(); showTutorial(); break;
      // reproductor
      case 'quit': quit(); break;
      case 'pp': pauseToggle(); break;
      case 'cnt':
        if (S.settings.hands) break;
        P.count++; var st = P.steps[P.i], c = $('#cnt');
        $('#cn').textContent = P.count; vib(15); beep(900, 50, 0.15); say(String(P.count));
        c.classList.remove('hit'); void c.offsetWidth; c.classList.add('hit');
        if (P.count >= st.val) { c.classList.add('full'); var db = document.querySelector('[data-a=done]'); if (db) db.classList.add('glow'); if (P.count === st.val) { beep(1200, 250, 0.3); vib(120); } }
        break;
      case 'done': completeStep(); break;
      case 'pnext': next(); break;
      case 'pprev': prev(); break;
      case 'plus': P.end += 15000; P.total += 15; break;
      case 'fb':
        var m = +v; S.last.mult = m; S.chains = applyProg(S.last.prev, S.last.done, m);
        if (S.last.donex) { var bx = clone(S.last.prevx || {}); S.last.donex.forEach(function (k) { if (bx[k] == null) bx[k] = defv(k); }); S.exv = applyProgX(bx, S.last.donex, m); }
        save();
        Array.prototype.forEach.call(document.querySelectorAll('.fb button'), function (b) { b.classList.toggle('on', b.getAttribute('data-v') === v); });
        $('#chg').innerHTML = changesHTML(); break;
      case 'close': closeOverlay(); break;
    }
  });
  var tx = 0, ty = 0, tOK = false;
  document.addEventListener('touchstart', function (e) {
    var t = e.touches[0]; tx = t.clientX; ty = t.clientY;
    tOK = !!(e.target.closest && e.target.closest('.pnl') && !e.target.closest('input,textarea,.noswipe'));
  }, { passive: true });
  document.addEventListener('touchend', function (e) {
    if (!tOK) return; tOK = false;
    var t = e.changedTouches[0], dx = t.clientX - tx, dy = t.clientY - ty;
    if (Math.abs(dx) < 60 || Math.abs(dy) > 50 || Math.abs(dx) < Math.abs(dy) * 1.8) return;
    var pnl = $('#pnl'); if (!pnl) return;
    var g = pnl.getAttribute('data-g'), ks = PKEYS[g], i = ks.indexOf(pst[g]), j = dx < 0 ? i + 1 : i - 1;
    if (j >= 0 && j < ks.length) switchPanel(g, ks[j]);
  }, { passive: true });
  document.addEventListener('input', function (ev) {
    var t = ev.target, k = t.getAttribute && t.getAttribute('data-set'); if (!k) return;
    if (k === 'fq') { fQ = t.value; var pf = $('#pnl'); if (pf) pf.innerHTML = foodPanel('rec'); var qi = $('#fq'); if (qi) { qi.focus(); try { qi.setSelectionRange(fQ.length, fQ.length); } catch (e) { } } return; }
    if (k === 'exq') { exQ = t.value; var pn = $('#pnl'); if (pn) { destroyFigs(); pn.innerHTML = exPanel(pst.ex); mountThumbs(); } return; }
    if (k === 'name') { S.name = t.value.trim(); save(); }
    else if (k === 'rest') { S.settings.rest = +t.value; var r = $('#rv'); if (r) r.textContent = t.value + ' s'; save(); }
    else if (k === 'crname') { if (cr) cr.name = t.value; }
    else if (k === 'rtime') { var p = t.value.split(':'); if (p.length === 2) { S.settings.rh = +p[0]; S.settings.rm = +p[1]; save(); syncReminder(); } }
  });

  // botón atrás de Android
  window.__back = function () {
    if (upd.busy) return true;
    if ($('#tut')) { tutClose(); return true; }
    if ($('#modal').className === 'on') { dialogClose(); return true; }
    if ($('#sheet').className === 'on') { sheetClose(); return true; }
    if ($('#overlay').className === 'on') { if (P && P.steps[P.i]) quit(); else closeOverlay(); return true; }
    if ($('#ob')) return false;
    if (tab === 'set' && setSec) { setSec = null; render(true); return true; }
    if (tab !== 'home') { tab = 'home'; render(); return true; }
    return false;
  };

  /* ---------- actualizaciones: dos tipos ----------
     1) De contenido (sin instalar): botón Actualizar con porcentaje y la app se cierra.
     2) De APK (hay que instalar): aviso con botón que lleva a la página de descargas. */
  var SITE = 'https://daijstudio.daijstudio.workers.dev/descargar/';
  var REMOTE = 'https://raw.githubusercontent.com/Anthonyxddddd/crece-fit-web/main/';
  var upd = { v: 0, busy: false, shown: false, apkShown: false, waitFn: null };
  var jsStat = '', natStat = '', apkInfo = null, apkReq = false;
  var APK_NAMES = { 1: '1.0', 2: '1.1', 3: '1.2', 4: '1.3', 5: '1.4', 6: '1.5' };

  function apkCode() {
    var a = AND(); if (!a) return 0;
    try { if (a.apkCode) return a.apkCode(); } catch (e) { }
    if (a.checkNow) return 5; if (a.startUpdate) return 4; if (a.speak) return 3; if (a.setReminder) return 2; return 1;
  }
  function apkName() {
    try { if (AND() && AND().apkName) return AND().apkName(); } catch (e) { }
    return APK_NAMES[apkCode()] || '?';
  }
  function openSite() {
    try {
      if (AND() && AND().openUrl) AND().openUrl(SITE);
      else if (AND() && AND().copy) { AND().copy(SITE); toast('Enlace copiado: pégalo en tu navegador 🌐'); }
      else window.open(SITE, '_blank');
    } catch (e) { }
  }
  function deferOrShow(fn) { if (P || $('#ob')) { upd.waitFn = fn; return; } fn(); }
  function runWaiting() { if (upd.waitFn) { var f = upd.waitFn; upd.waitFn = null; f(); } }


  /* ---------- Animación de actualización: cohete de líneas -> check ---------- */
  var RK = { N: 220, SRC: null, TGT: null };
  function rkSamp(d, n) { var p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', d); var L = p.getTotalLength(), r = [], i, q; for (i = 0; i < n; i++) { q = p.getPointAtLength(L * i / (n - 1)); r.push([q.x, q.y]); } return r; }
  function rkEase(t) { t = Math.max(0, Math.min(1, t)); return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function rkRnd(i) { var x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
  function startRocket(svg) {
    var A = getComputedStyle(document.documentElement).getPropertyValue('--acc').trim() || '#4aa8ff', MUT = (window.FigColors && window.FigColors.ground) || '#39406b';
    var RKD = 'M85 82 L85 72 L74 56 L75.5 56 C76 44 72 28 60 14 C48 28 44 44 44.5 56 L46 56 L35 72 L35 82 L46 74 L74 74 Z';
    if (!RK.SRC) {
      RK.SRC = rkSamp('M24 108 L96 108 L85 82 L85 72 L74 56 L75.5 56 C76 44 72 28 60 14 C48 28 44 44 44.5 56 L46 56 L35 72 L35 82 L46 74 L74 74 L85 82', RK.N);
      RK.TGT = rkSamp('M38 62 L54 77 L84 44', RK.N);
    }
    svg.setAttribute('viewBox', '0 0 120 120');
    var st = { shown: 0, target: 0, t0: performance.now(), tf: -1, raf: 0 };
    upd.rk = st;
    function flame(t) { var k = .7 + .3 * Math.sin(t * 38), k2 = .7 + .3 * Math.sin(t * 31 + 1.7); return '<g fill="none" stroke="' + A + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M55 80 Q60 ' + (88 + 18 * k) + ' 65 80"/><path d="M60 86 L60 ' + (92 + 12 * k2) + '" opacity=".7"/></g>'; }
    function speed(t, fade) { var o = '', i; for (i = 0; i < 9; i++) { var x = 14 + rkRnd(i) * 92, sp = 1.1 + rkRnd(i + 9) * .9, y = ((t * sp * 140 + rkRnd(i + 20) * 160) % 160) - 20, len = 10 + rkRnd(i + 5) * 14; if (Math.abs(x - 60) < 22) continue; o += '<line x1="' + x.toFixed(1) + '" y1="' + y.toFixed(1) + '" x2="' + x.toFixed(1) + '" y2="' + (y - len).toFixed(1) + '" stroke="' + A + '" stroke-width="2" stroke-linecap="round" opacity="' + ((.18 + .3 * rkRnd(i + 3)) * fade).toFixed(2) + '"/>'; } return o; }
    function frame(now) {
      if (!svg.isConnected) return;
      var dt = (now - (st.last || now)) / 1000; st.last = now;
      var t = (now - st.t0) / 1000, o = '';
      // la barra alcanza al avance real (rápido) para que la animación se vea aunque la descarga sea corta
      if (st.shown < st.target) st.shown = Math.min(st.target, st.shown + Math.max(dt * 260, (st.target - st.shown) * dt * 6));
      var p = st.shown / 100, BX0 = 24, BX1 = 96, BY = 108;
      if (st.tf < 0 && st.shown >= 100) st.tf = t;
      if (st.tf < 0) {
        var shake = Math.sin(t * 60) * .7 + Math.sin(t * 47) * .5, bob = Math.sin(t * 3) * 2.5;
        o += speed(t, 1) + '<g transform="translate(' + shake.toFixed(2) + ',' + (bob - 6).toFixed(2) + ')">' + flame(t) + '<g fill="none" stroke="' + A + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="' + RKD + '"/><circle cx="60" cy="42" r="7"/></g></g>';
        o += '<line x1="' + BX0 + '" y1="' + BY + '" x2="' + BX1 + '" y2="' + BY + '" stroke="' + MUT + '" stroke-width="3" stroke-linecap="round"/><line x1="' + BX0 + '" y1="' + BY + '" x2="' + (BX0 + (BX1 - BX0) * p).toFixed(1) + '" y2="' + BY + '" stroke="' + A + '" stroke-width="3.4" stroke-linecap="round"/>';
      } else {
        var u = t - st.tf, PA = .26, PM = .6;
        o += speed(t, Math.max(0, 1 - u / .2));
        if (u < PA) {
          var q = rkEase(u / PA);
          if (u < .12) o += '<g transform="translate(0,-6)" opacity="' + (1 - u / .12).toFixed(2) + '">' + flame(t) + '</g>';
          o += '<g transform="translate(0,' + (-6 * (1 - q)).toFixed(2) + ')" fill="none" stroke="' + A + '" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="' + RKD + '"/><circle cx="60" cy="42" r="' + (7 * (1 - q)).toFixed(2) + '" opacity="' + (1 - q).toFixed(2) + '"/></g>';
          o += '<line x1="' + BX0 + '" y1="' + BY + '" x2="' + BX1 + '" y2="' + BY + '" stroke="' + A + '" stroke-width="3.2" stroke-linecap="round"/>';
          o += '<path d="M96 108 L85 82" fill="none" stroke="' + A + '" stroke-width="3.2" stroke-linecap="round" stroke-dasharray="28" stroke-dashoffset="' + (28 * (1 - q)).toFixed(1) + '"/>';
        } else {
          var m = rkEase(Math.min(1, (u - PA) / PM)), d = '', i;
          for (i = 0; i < RK.N; i++) { d += (i ? ' L' : 'M') + (RK.SRC[i][0] + (RK.TGT[i][0] - RK.SRC[i][0]) * m).toFixed(2) + ' ' + (RK.SRC[i][1] + (RK.TGT[i][1] - RK.SRC[i][1]) * m).toFixed(2); }
          var cu = rkEase(Math.max(0, Math.min(1, (u - PA - PM * .25) / (PM * .8)))), CC = 2 * Math.PI * 44, pul = 1 + Math.sin(Math.max(0, Math.min(1, (u - PA - PM * .85) / .4)) * Math.PI) * .06;
          o += '<g transform="translate(60,60) scale(' + pul.toFixed(3) + ') translate(-60,-60)"><circle cx="60" cy="60" r="44" fill="none" stroke="' + A + '" stroke-width="3.6" stroke-linecap="round" stroke-dasharray="' + CC.toFixed(1) + '" stroke-dashoffset="' + (CC * (1 - cu)).toFixed(1) + '" transform="rotate(-90 60 60)"/>';
          o += '<path d="' + d + '" fill="none" stroke="' + A + '" stroke-width="' + (3.2 + m * 2.2).toFixed(2) + '" stroke-linecap="round" stroke-linejoin="round"/></g>';
          var wv = (u - PA - PM * .9) / .6; if (wv > 0 && wv < 1) o += '<circle cx="60" cy="60" r="' + (46 + wv * 20).toFixed(1) + '" fill="none" stroke="' + A + '" stroke-width="2" opacity="' + (.5 * (1 - wv)).toFixed(2) + '"/>';
        }
      }
      svg.innerHTML = o;
      st.raf = requestAnimationFrame(frame);
    }
    st.raf = requestAnimationFrame(frame);
  }
  function showUpd() {
    var m = $('#modal');
    m.innerHTML = '<div class="dlg" id="upd"><h3>🚀 Actualización disponible</h3><p class="mut" style="line-height:1.45">Hay mejoras nuevas y <b>no necesitas instalar nada</b>. Se descargan ahora: la app se cerrará sola y, al abrirla de nuevo, ya estará actualizada.</p>' +
      '<div class="row" style="margin-top:18px"><button class="btn ghost sm sp" data-a="updno">Más tarde</button><button class="btn sm sp" data-a="updgo">Actualizar</button></div></div>';
    m.className = 'on';
  }
  function notesList(info) {
    return (info && info.notes && info.notes.length) ? '<ul class="mut small" style="margin:10px 0 0;padding-left:18px;line-height:1.5">' + info.notes.slice(0, 3).map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul>' : '';
  }
  function showApkDlg(info, required) {
    var m = $('#modal'), v = info && info.version ? info.version : '?';
    m.innerHTML = '<div class="dlg"><h3>📲 ' + (required ? 'Necesitas la nueva versión' : 'Nueva versión disponible') + '</h3><p class="mut" style="line-height:1.45">' +
      (required ? 'Esta actualización necesita instalar un APK nuevo (v' + esc(v) + '). ' : 'Hay un APK nuevo (v' + esc(v) + ') con mejoras. ') +
      'Descárgalo desde la página, ábrelo e instálalo encima: <b>no pierdes tu progreso ni tu racha</b>.</p>' + notesList(info) +
      '<div class="row" style="margin-top:18px"><button class="btn ghost sm sp" data-a="updno">Más tarde</button><button class="btn sm sp" data-a="gosite">🌐 Ir a descargar</button></div></div>';
    m.className = 'on';
  }
  function updStatusText() {
    try { if (AND() && AND().updateStatus) natStat = AND().updateStatus(); } catch (e) { }
    return (natStat || 'La app busca actualizaciones al abrirse.') + (jsStat ? ' · ' + jsStat : '');
  }

  /* trae version.json (contenido) y descargar/apk.json (APK) */
  function loadMeta(cb) {
    var out = { web: null, apk: null }, n = 0;
    function fin() { if (++n === 2) cb(out); }
    function get(path, key) {
      try { fetch(REMOTE + path + '?t=' + Date.now()).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (o) { out[key] = o; fin(); }, function () { fin(); }); }
      catch (e) { fin(); }
    }
    get('version.json', 'web'); get('descargar/apk.json', 'apk');
  }
  /* decide qué avisar: APK obligatorio > actualización de contenido > APK opcional */
  function decide(out, nativeV, manual) {
    if (!AND()) return;   // en un navegador (sin la app) no hay nada que actualizar
    var code = apkCode(), web = out.web, apk = out.apk, canOta = !!(AND() && AND().startUpdate);
    apkInfo = (apk && apk.code > code) ? apk : null;
    apkReq = !!(web && (web.minApk || 0) > code);
    var webNew = canOta && !!(nativeV || (web && web.version > (window.APP_VERSION || 0)));
    if (!web && !apk) { if (nativeV) deferOrShow(showUpd); else if (manual) toast('No se pudo consultar. Revisa tu internet.'); return; }
    if (apkReq) {
      if (manual || !upd.apkShown) { upd.apkShown = true; deferOrShow(function () { showApkDlg(apk, true); }); }
    } else if (webNew) {
      if (manual) upd.shown = false;
      if (!upd.shown) { upd.shown = true; upd.v = nativeV || (web && web.version); deferOrShow(showUpd); }
    } else if (manual) {
      toast(apkInfo ? 'Hay una versión nueva del APK 📲' : 'Ya tienes lo último ✅');
      if (apkInfo) deferOrShow(function () { showApkDlg(apk, false); });
    }
    if (tab === 'home' && !P && !upd.busy) render();
    if (tab === 'set' && !P && !upd.busy) render();
  }
  function jsCheck(manual) {
    loadMeta(function (out) {
      jsStat = out.web ? 'Web: v' + out.web.version : 'Sin conexión con la web';
      decide(out, 0, manual);
    });
  }
  // avisos que manda la app nativa
  window.__updateAvailable = function (v) {
    if (upd.busy) return;
    loadMeta(function (out) { decide(out, v, false); });
  };
  window.__updateStatus = function (m, manual) {
    natStat = m;
    if (manual) toast(m);
    if (tab === 'set' && !upd.busy && !P) render();
  };
  window.__updateProgress = function (p) {
    var i = $('#upi'), t = $('#upt'), h = $('#uph');
    if (i) i.style.width = p + '%';
    if (upd.rk) upd.rk.target = p;
    if (t) t.textContent = p + '%';
    if (p >= 100 && h) { h.textContent = '¡Listo! Cerrando la app…'; var n = $('#upn'); if (n) n.textContent = 'La próxima vez que entres ya estará actualizada'; }
  };
  window.__updateError = function (m) {
    statEvent('upd_err', { m: String(m || '').slice(0, 120) });
    upd.busy = false; dialogClose(); natStat = m || natStat;
    dialog('No se pudo actualizar', esc(m || 'Revisa tu internet e inténtalo de nuevo.'), 'Entendido', function () { }, false);
    if (tab === 'set') render();
  };
  // compatibilidad con versiones anteriores de la app (descargaban en silencio)
  window.__updateReady = function () {
    if (!P && !$('#ob')) dialog('Actualización lista ✨', 'Hay una versión nueva de la app.', 'Actualizar', function () { location.reload(); });
    else toast('Actualización lista: se aplicará al reabrir la app');
  };

  document.addEventListener('visibilitychange', function () { if (!document.hidden && !P) { autoFreezeMsg(); render(); } });
  function autoFreezeMsg() { if (S.setup && autoFreeze()) toast('❄️ Usamos un congelamiento: ¡tu racha sigue viva!'); }
  load(); checkBadges(true); applyProgram(); autoFreezeMsg(); applyTheme(); render(true); syncReminder();
  setTimeout(function () { jsCheck(false); }, 2500);
  setTimeout(cloudAuto, 6000);
  setTimeout(statsStart, 4500);
  setTimeout(askStats, 9000);
  if (!S.setup) onboarding();
  (function () {
    var sp = $('#splash'), swapped = false;
    if (sp && !sp.querySelector('.sbrand')) sp.insertAdjacentHTML('beforeend', '<div class="sbrand"><img class="dlogo" alt="daij studio" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbgAAAEdCAYAAAB+G3LuAABfO0lEQVR42u2dd3ycV5W/n3PvOzOS3JJAQgk9odlJ7OB0AnKWsBtKKMuO6IFlKcsCSwmhpDCeVFog1B8EWOqyrGbpLeyyYEFIITFxEuylJIGwwEKANNuSZua99/z+eN+RRtJIlh0XaeY8n48SWW3mvfe+53vOee89BwzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMIxdRFUGK5pUKupAhYq6wYomqIoNjmEYhrE4qaib69vlsnobJMMwuhHz4LtZ2yrqqlWJays6ULoXzxf4mxi4r3PcKcIPmlv59NVnyR/LZfW1mgQbMcMwTOCMxRG5VSUe/y492vXxL77AYapABByIh1DnDzHwz1e+TmotMbSBMwzDBM5Y8OL22PfoKvX80CXsH+s0FRyCAAqoT0hwEJqceuXr5BsVVVcVEznDMLoDZ0PQrahE+IAvsn8Yp4lQEMELOAEvQhJSQu7lfOSEj+uyKqhtPDEMwwTOWNDR2/Hv5pEIj0vHiQhJx/Bd8LFB8CUO1q08AREt12xNGIZhAmcsQMqrsrSzCo/2RRIUZHoqWqZ8rs6jIqwGuG2zpa0NwzCBMxYw4tkv/1R1+jd12qeCCCy3UTMMwwTOWPgCp8z+ME1mfmo7SwzDMIEzFg1qQ2AYhgmc0Z1hXKZyMofyqS0EwzBM4IxFp2+aiZx2Er5pn1qK0jAMEzhj0aDziOAMwzBM4IzuFEFbCMaiWKgqFVVXHlZfUXWVHRQRtzGyMQI6HwA2uoP2FOWUKM5SlMYioaLqttSQmkiodsg9DH5fkw3rCCLSs3mJ8rD6lWW0KhJnjJGqDG7Aj6wj0INjZALXzQ5dK0UpHcI2O85tLOhgRGU9SKs2avk32t93Ow/0nhXBkaL85bOHyW9GTpJUgLKqr0lvdcSoVNRV16Ot6375z/TejTr3S5UBPOMu5c+fEfndCKT06BiZwHV9GDf31yxFaSxEwy2ZsOlp1+vjXYkXhzs5SRz3kwIlH0Dh7hf9VH+B55s6zsc+I/I7VKVXopSJwuhVOG2zPsl7/qEeOFGFg4p9SGgARe548RbdLMJXbh/nEzWRO8vD6mtDvSNyJnDdrG2644DNUpTGQjTcz79W71dcyntQnpP0Z1kIbUJsoAgijuW+yFG+xFEN4Z9O+6le/BmRd0wUC+9ioSsPq6+KhOdeqQ/vO4D3O8cpLoF0HGKEtEEUcCLs74uc6IuceIDy2hder+d9drV8rJdEzhz3LsZ2URqLLXKrisRn36gPLCzhv4tLeU5sEht3k4YGUWMmbgAa0OYYcfxOUiIH9u/P2194o36k2wuGV1RdbUjC867Vw0v7s6HQxynpGKGxlRCbWRssye26pmhzNB8jxwP79uPS027QSm1IQlnVm8AZiz+C28E5OEtRGgvDG1NhPZR/qkv7hC8W+nn0+O00EByQyGQvw9YaFhGcCElM0bHbaQ7szyteeL2urw1JKA93nwHPn7nx/C16v2I/X00K3H/8LpoIPv+QKXd32xiFBrGxlbS0nPUvuk5fXpPuHCMTOKOj1lmK0tiXlGu4qkjsC1zQtx9H1++miVCc1xrOnrwl9btICwNUTrteH9+VIrceqEp0DT5cXMZDG9tIRSjMc4ycRnxzlCh9fOCFW/QRtSFiRbv7KIEJXDc7xZaiNBZDZJKn3f7+p7rSF3hF/S6C7Oz+AEE0IM4BykWV72uycnP3rPT8uVs87UY9qTDAM+p3EcTt3BiJINpEC/0UJaU6+ZTeBM5YjNGZpSiNRcCGDdnyi5HTikspxTD5rG0nRc43Rom+jxN+tR+PqVYldmEa7h98CXRX3VTBNbej4nj6i2/UB1ZFYjcfCDe71uMRnKUojX3NyDpCRdUhnBzq6D2xSwKx0A+S8GSA2w7shhOfKrUhCf/0R10qMJiOgezqGGWRbiwsoR/liQAb1mECZxiGsfttd3Z27TfXcS/gITGdtlFiV/4koMojAQ5at/jTlBXNxmPsTzxIlftqCuiuj5EK6jxEYSXAunXdu7xM4LqY+aQobSEY+9R456sxLGW5Qr/Ge1xkRzQ7CH4AQK0LkhNbatmQpJEVvkDSflxiF6NcNMvs7A+wpYufyptd62bneCc2mViK0tgXrM9XY7KVMaAh99QiKYgDEUbbBXQxs7Kc37Ge8RiICILuuijpZPm+UYCVG7q3cJ8JnGEY+y7LkJvW3/+RvwC3i8tSaLv+B1FxKPAbmNzA0g1OQDHwe43cLfdw24yAaLZL5VYA1nXv+jKB62bjYSlKYxGs0vKw+sueLHUi1/gSKvcgoaCKiymCsgG64xmciCiq8okj5I8IN/oSityDMQKXjkKIXA6wpWYpSmMRYilKYzHQ2umoji+jyC5voFDUFaCxjdt9X2a8h7tkaVc24PNb9+u+gOgupihViUk/Gpr8PLmdTahKrdy9t78JnEVwhrFPGTlJUlWVP/0vX2nczQ3JEjzKThcDVkhLy3DieN8nHyF/Kg+r75Y+cdV1BFAJysfrd/F/voRX3SVhikkfDnjHp0+S8TK4bi5MbQJn2EIw9jnrQS57stQl4dUx0HRJFm3sRGSSFpdSGL+D67znvRVV11WRiYiWh3GfP0LuUOV1voCII+5MJKdKs7SCZPx2vjN2OJ+pqLpalydvzK51MZaiNBZNhCISy6r+U6vkh+ko/+z78c7jVEnn2jGoiqrSLC4lCXX+oFD+l0fLVtbTdS1zWl0APnOEDDfu5oLSChJx6I6iXVWiQrO0gkJjO1sKnufVhFjtwjGajvWD62LaU5RTRM5SlMZCNOCSGfDPinzkBZv0zqTEx0pLWdrcChoJTNtdqYrzBVxhGYXmVn7cHOX5n1srN080A+3iMfqMyNmn3aB/8H28xxcoNLcBOjlGrXteFZeUcMkArnE3/1kPnPbpI+R2VRXp0jGyCK6XIrh56pktBGOhGPCKqvvcGvnC+DjHNbfxb3hGC8vwpRUkxeUkpeXZ/wsDOI38rrmNt/3pl5z0ubVyU6socdePUUXdZ46QD9Lkcek433CeUFyRj9Eykr58rAr9uBi5qbGV13xqJad84Qj5Y0XVSY90PrcIrutVroPCdfiapSiNhUJVsiLJXzhSNgPP+/uf68Oa4zxeGxyJ414SaeD4Q4QrgvKjz6+SO2CiG3hPdKquVrOU7idFrgZOffH/6OHNUf6GlEdEZT+Bu/D8LgYu18iVn1sj22GyqWyvrCUTuC7GUpTGoo1ShrJILhe8W4BbgE91+tmyqq9B7CXD3R7tsh6qj5YbgRtn+9myqq8JsVrtrTEygevm4K21yWQeEZylKI2FGMm1IrMtICtBtoDetgFZB2xZh9Yg1nokatvRGLWqthz0J7R1tvCgP6G1cu+OkQmcAViK0lj4RrydERuWTmNktzHmuPcMO9Pw1DAMwwTOWDTsTMNTWwiGYZjAGV0VwbWw3IZhGCZwRndFeTYEhmGYwBmLTrwsRWkYhgmc0Y1YitIwDBM4ozsjOHYcwVmK0jAMEzhjEYZw8/8RWwiGYZjAGYtH3yxFaRiGCZzRjcxnk4naQjAMwwTOWJxh3NxfE4vgDMMwgTMWnbbpjIDNMAzDBM5Y/FiK0jCMXsa6Cey0aqiwHhnMNeGgVZNyUduMsj77d3kIR3ny127bjBy0Cq1tRqmik/HVHo7gdtAPzlKUOz/35VXIbZvzdiSt+a9BbTgbxjnnfj3KXu6mXB5WD1ArE1trdwQii6g3WDdcw552Z8vDmU2yMTKBmz8VdS2DNlKVNDdOOjKbJlRp2btAbe6/OwhuUvTsRl3Qcw+RrCWJzjqtMo+5r2ZCObgev8fnXlUQ0drQlF5gE2u3UlG34BtgqgqSNUDtdA1U1PX8vZOPQW2IzmNUVk/N+sEZ08RnpCopVYntturoC/VeMfJghAeJ8nDg4SosdzAA9Cv0AdEJYwrjwJgIdypsUeEmidxc/wu/u6Eq26eIZG70RtYTdpeHP5+Gp5ainGXus3mYMvfHVHR53fPAxPEQHA8l8igRDiCfe4R+FBFhDGUMYVSFO53w86jcnAi/Hhvjf68XuXME0hlzvzu97VzcAE54nz5dhLJGHoDQdJ6N2uCz1TfI5vafW4hRSeu9HXGOnipQRnkQQlMc14VxPntjVW5c2Newd8RtZUWLxZRnqfB04H5A3TmubIzymc3vlpsXhTNjArfnQ/xaOfPUW+Kz5lx9eOI4IiqPFeHYGHi0wH6+hIiboRdoS1Ak/1r+DRGIAUKDet+9ueOYd+j1KNcoXF5Ywo1XiPx+BFKqeTqmBrV76HVZinInU2A1qFUlZEIDx52vBzfgMAcnIhwdImsS4V6+SOL8VAdBWnPf5i1MOBYCLkKoE0p93HH0O/QGUa6Jyo8KCTdcKXLrhODlUWNtiLjLaeyKOkTiCe/Q+9PHp3yRJ7YvVPGcHOB1J1yi514hcmF5WP20CGmBRG6iK9+o9y308wlX4MkioDG/BsfJKK9dc6ZeuEmkml3DPRizRSxuh71VH5Uon3d9HIlO2iBxPLEgvHb1WfrmalU+Wi6rr/VYJCf0Oi3vuSoTHvWaiq5MEp6h8ExglS/RLw405B8RFAKgE0ZMkemjmRs7bRMYJw4nDlwC4jLR08AdAteK8AWUb1x5htzWem/lGm5nbtyWsTrhvfpiX+KT6ThBwE95b1PfZ1pYQtLYznuufJ2cPljRpH0sesKpaTPuq8/XgwvwFIUhgcdIwv4uyTyAmGbGQ5Wse3LLiekw97nAqUqbjyN4ceAK2dxrhNBkqwibEL6oytd+fIb8aspcZg6X7sx6Zj1yzAEsTSIbkgGObG4nnZj17L/qBJ8sRZp3c9YVb5ALK6quU+fsfSZu65GVMFBI+X4ywFET1zB5v6lz+GQJ0txG9foLZH1PGfCKOoDDGhzoPVf6Eg9Nx2miuClj5El8CZpjvPSGC+QTvSZyvZuZUpXysHpEdKQq6WBF+446V1+w9nz978SzyfVxgStwlAj9YZyQjpGGBkEDmmf/vECCkgAJghfwIpMfODxK4iCRLFp2RFRTNB0nNMdIY4OIsr8UeKIU+USEnx77bv30se/WEyefn4i2HrLv1CW2hxgzvtHbKcpsPCefTx11np689gIdTuCnrshHfYEnIOwfm8TmGGlaJ8SAoqiAEyERzee1w9yL4Jmc90TAq6IaJuc+1AkCy1zC43yRS0S58dh369eOeY8+nYpmwiutudd5OaPlGo6qRJ/y5mQJRza30xBIJt5X9j4TBU23E6RA9cT36cqqSGwZzX0+N/k1FJucngxwVLqdhkh+DbRdg6LNUYI4zll9pq6p1SQslGvY42O0CqEq0QsX+H4emo7RECi0j5FzJBqIoUF0wnsOr+gDajUJmdtlKcquNm41kVCDcNhb9T7FEqdt87zEFXmUKMQmpOOkAi5/puKVDs+yOgVFU/KVHVKEMpG5nBAsjWgYz7KEznOgL3JaaHLase/W7zr40F9v5WvVoXxhrs8WtqUo71lapzYk4dDXaGnFgTwLeDWe430CoQHpGCGPzhyCE3Adj1q0l0Gb40C9TEZ0kj8TnTr3mZODOJb4AqeinHrsUjbpO/UjIfKF2pDc1R6dzxWR1oYkHHex9gOnhToxd74m14BMvHenkbTQT9LczguBt07sutvHUXVtSMJgRfvubHJabObX0Pmmc0RSP4BPR3kx8LqFcQ173jmviYTD3qr3UeHvwjgqUJj5Y4DDaUqaLGG5jlEG3ps/7+2JLE1vOe4VdWh2A62u6H5rz9NziwNsSvp5p3geFcYJoUFAUdE84pK23KDOI8k7HxHslM3KPWyNmVeqKeoLnCwJX/7Ocq4+9l36HESUqsT5evTzOQfXcxF77hysXa8v2u8+XOOK/KsUOF5TYjpG0Ii2RToy3wncUaQ8x3qRPIXs0Sy6S+tEl7Cm0MdHCgWuO/ZdevpgRftqQxIqFXWzRimVXMOUBwP30RTH1EfB09+TaEQRVgMctGUBrIz8GralHAzcP6bZPTjrmAuiAUVYBTCynq5Pv5WHMrtdSHiY86wgTEnednTE8szD4Qtmnk3g9kBKqioRET1yvb7QJ2x0Rc4RuG86ThqbxFZoz+56NjmbwMxt9EQcHkHScULaIDrPUUmJfzv+Pfrto9+hR7XSlrsjHdMTKcpyloquDUlYe74es/Zc/a7r41M4Ds+dmkiWdvQyqxbs4tzO07GQqY6Oy1OjQYSHJv28u76cK49+hz61WpU46eRM14b8ZRwDQKI6v/WmsBRg5cqFY/hCpAQU53xH0nbPQP8OnZAuI0Kf+DlWlkyMh2j2nHgJQG2lCVx3ee7lLLVzVEUPW3u+ficp8RknPCwdJ82fqbWitY4pJ5nLg9c5/j0tjaXzMXwy+W+XGVyXNojpOFEKnOIL/Oi4i/XilRVdSlXiYEVnTTPPp5tAt6coByuaUJNw+Ft0/yPP1feiXC4FnpCOE2KTmD8/2/F9IHPP7Y5qfnb8GzLnvDgRvAZiOkbqPGsKJb5+/CU6fPy79MG1IQk7iuTbU+o623tY1Pf2lE9tw1yn+3/qmu25MepugWt57jUJj1mvL4sJV4jnr9NxQkyJ+QYBmbKdv/PNs8OUk84jjSVze1lTUwptf1MEJ4ILYwQCxaSfN6xYweXHv0uPHqlK2kq9zrj/ezlFqSpU1I1UJV17lp5YHOCKpMTrNFDIN3f4Tuu/fR6FzvMy7+isUy1QmdVAz7bmnEASmtlmAV+gjOfqY9+pz5ozkp8mZNKNc2+StmP97/Ex6lqBa3nuKyt6wGOq+hlX4lIiy8I4AcEjk9c+YVx0N9w8Ou0v6dQ9Jx1Xoe7Ay9cJofOANreTSsJqTfjBce/W17RSr9MN3XwiuK5MUWbnwJSqxMe8Tc+gxPdwPCrNtppr+yaPWYdGOwhTh3mR6XOvcwy37iCSnnujihPBNUdJEe7j+/iP4y/W9xz6Gi3NlrLU+ThUXRLBGbNE8D0+Rl25i7J1luvIM/UoSficK/DIMEogi4T8rB65zC87BURtSVNm5CTfcSdTTurkHxFUNP+eTvmZHWfFZr5PESEJdYI4+pJ+3n/8e/Sxxbt46UhVtm19n5Zg/g/auy1F2dppePhbdP9CH5/0JZ4e6qApUVy+3nflpm9FY5mAxVbCR7NdtplsdJh7bQ/Es/l303fZzvflJTNaiTbRGNDCAK8/6GE8dsV5+rzakNxcHtYi0Oi0bpVZdvoaXR7CmcB1p7idpadQ4t9FWJ6OkubnaGYXkrnLWWlL1ETxroCThAll0zh5ABzNNyx4RBwiyaQnFScPioeWVz5D7jqkKDvZJRE8EW2OEYpLeHZDOHjtu/WZl71W/jwRyc2jVFc30RK3tRV9kHq+5IusTbOIx4vgph3XmFNIWilKbTk0QhTFuwRxCR6Xz72CphPzqwJMmXs/KXcxBU1RhZA/95uIp7Qt4u70hmRq3kUEpLmdtNDPMaWlbDjuHfr02pD8ZLaNR3OlKBdt9G4ivWN96/EorqsEriVuh79NnysJn0IpxgZBZOp1Tj/T1v78Q6eW2IooisP7YlaFIjYgBn5FkxsQbkb4jcD/xcidAttw3I2joCnLRVhGg+UI9xY4FscRRB6Z9FNAMsMYU6Lmh4cnpG6Kks1i5MjPVUHS3E6a9HNiKeX7x75D//bqN8svuVgLOo9zcN2SomyJ2xFn65FR+IrzPCjdTorrsMZldpFvEwLVrFqJdwWcS3CxCRr5QxjneuCXCL8R5fcq3O6Ebc5xdzOirsly51mqTfYTz/2JPAjHoSirXcIDkiJJDNl5S9VM7KYfSRCmPkPRdiVkohxc0hwjJCUe4Ep899i367Ovfov8Fxdr0jE1PYsoxMVswU3k5kxRqqUouyxye5u+Qgp8RANKIOJmPm+ROTxCaXnsiroC3hcgjFMPDS4n8k1RLm8MsOWGM2T7zr7HSkXdNxIeqk2OdXCKRv7KFThYEoh1UCXNz0TJHCnKGeIkQpKOkfo+DvP9fO/Y9+rjQuR272aJ4LosRTlY0aQ2JOmRZ+njpciXRTggjBOkXdxkdpGfNqYRiM6RuBI+NiA2uS42+RoJG5xw4zXnyF925X2ufq/ulzRZpWM8XpSn4Tmm0J+/RkrINzy5ToHW9Mizbe59aBBdwv7JAN847p36dHX8zLX0UHecorQIrotDOIvgukfc1rxNX+SKfCSmZElAN8e923aTT6QoFVVBfQEnHkKDX6SRTyJ8ZeNZ8rMpEUNZPeWs1xfkfcFqk2dMyluQ6d+vZlUobs4/Pr/27brCBY6PTcoIQ8kAS2M9M3bicDrPjXx5cdUkjJMm/TxAm3xT4YuxmdmvGb/XRZ5vHrmlq8/UYyjyNWBFaBIkd2ykPUKf69lXHrG5BO+KuDjOn8I4/0rkCxsrcvVUT2Wyjc58554a1F4vdwI/yj8uOvqduiaMUwZOSwZ4gKYQmnn6slM0P7un7mJKdAWKklCTyPkqbBfHkomIb44UpdHFKcoeZ9ELXJuBe6ZL+JfYIKpmz0BmMw6dUpQaCa6Adx6JDX5CyoebfXxhIlJrtVHJKs1rrSZz9nurTfxnyisLlaxhJjWovUXuAi4DLjvqIr1AxnmJCn+fDHD/ME72PM/hZk1RMuO5XJKOor7IypjyyNjMtrTIPDbTLEovPq/XuPpsXeUSviHCipjmRwA67CDtUK6q5SAE8fikhA91bknH+YSmfOq6qvy+3Yk6aAtaG866TczV6q/z3JOdyRzC3bYSGakSrnmTbAI2ra3oe1GeL8Irkn4eHRugYWK376wpyvbjK/nhcHWepQpvVyXNf2CH1VgsRWkpShO4Balu2XOX1WfqGlfksxoRVVTclMrpnTMbkzdHBCgM4EOD38SUyk8Cn2mVdBqsaNLq03XPa9yJUm1rmJl3CwCoDcktwNnHv0vfH5u8WTyvcZ5Cmu2WdMx1nK19u7lDYsieHc1qCDoYhkVn5LJzf3p4n+7v6vyHSzgw1AkTu2Q7iLrMTN2oQkz68DFlWxjnndtKXPLzN8vWlvO0cjNarUqc6LAg98jiaK1th2ulom5D1nfwz8D7TnmNfuT2B/JKEc5J+jkgHSfkuy6FWVKU7V+TybJVIkIyZ/kwS1F2fwRnKcpFLHCZgYvHrdcDxuE/xLEkNjMDpzt47tS6OTQSfCHbERfG+X8E3vaTzNjQ6i+1R1vHtBu8VoSYtco5/dh36XBQLiks4bh0FFUhTlTcmCZQM65XyZ6+SbeagFYbIQn+bP2sH+BR6SipuNnX85QxyjzbKIIr9ONDnW+HlDduqsqWCadmPaEme7atSN6AMrZaNl1WlTpwybEX6VeCcJHv4zmxCRqy99o+97ParVbmwjTAEFsHi9R5yyMfER1XPp6UOCQ0su3gUyZTZ89saCQkfXhVfqspz9z4NvmnjVX5c6v01USViL1FK0pQlcGKJlefIVdv3cpgOsaFzoPzONWsyn2HKvUzF3YHr79bVvtgBV8bkrDmLD3TD/CU5tjkbsnZqs60p/Ryx8aJZyyMcfrGc+TJm6qyJZt7lZGqpHu1Q3TesgnyuX+r/PqqN8pz0wb/gHCHL+Vzz6RHrh1D+ZnXrfOotLOoU5TGXPmiztV0TOAWNq0mlWvO1tN9H89s5t67zD+FkSYD+NDkv2LKsRvfJl8pD6tHc+O2T1dlbuzK6rdUpXH1GXJWCJyiym2+hG+doWtftKo7uPG1ewxDuax+pCrpkefoE6TIeSFra+Rl+pR3KL0mmbilST9elV/GJo/fWJH3kFfoz+Z+X3aEzue+oq5cVv/jN8q/hHGOiykbkwG8Kum8HBaZZuSwc3C9iJXqWoRru5JvLFhztq6WhAunPHdpn1jtbNgVQtJPEsb5jNyHp1xXld/n28zDXvXad0RNQsuj//Gb5D91O+tiys+T/qkiN681PIcBXFTn4FSlthJd+2ZdofBxyRrITm1pNO3CpgQ3kTRZQhIaXBmbrLuuKtcOVjQhr9C/YK6zKrFWkzBY0eSaM+UX2//EE2ODywpLSDQS6LS9dpZ/d6wbttifv1oEN09f2cZokQmcSnULQlk98EHxFDXMNOGz1fVTCL6ET8e56CcVedHGV5BOeu4LM8mQdxtPrn6b/E8IrAsNfphHIKnMQ8Dmq32LwciVh7JOz2nCub6Ph+RpaTcfm6cQkgGSOM5XJHDydVX5fXk4iwYX6vWOVCUtl9Xf+Ha5o3gXp6ZjfLIwgFch3Vm7pSYMPRrCmcAtGsrDOGoSVj+Cl/p+TpwSve2ouaRkacm0zvnXVeTMXCRZUJ77XIZuWP01b5I/jEaeFBpcmfSTxPy5zFwpStmBh79o5r6svlaTcMQ5eqwr8OrpB7llunMjU64/Tfrwsc7wxsizNlZltHXEYKFfd60mgYq6kfWEq94oLwnjfKIwQEJ7R+a52+5M/ZKlKHtL3yxFuVhmS6VWJh7+Ft0fRyU2J6tqdZzY9gesSkj6SJqjfHTTejkn6zRA3LfPW3bS0A1JKJfV33CGbJfIM2KdX/gSHiXKzi7yRZiinGjGGblIEtx0UZ8RobTNve8jSev8aCzyQtaTdV1YBI7NBPl7LQ+rv/JBvCId5atJP8nExpO5UpSdNyBNwVKU3YmlKBeRwLV2TbqE1yV93C+mxCnpqU6tRyQXt358OsY3N1V5ZZaWIiwmcWv35stl9VeeIbcpPEUDf5bCRHmpXfJsF0OKsjysvlqVuPYcfUpS4qQwPvO56wybl93c0RXwscnvvee5W6rSIE9zLkJrpbUykTIR4bnpONckfXiyepmzRzY6iwNgEVxvhHAWwS0CKupqQ8TDK/oAhNeGel6ceEfeXMwNXINbkzovQqG2GV2M4tYucoMVTa46XW6KgX9w2SFwVZ3ag26KDVjkKcpambj2o1pII+fNZeumVSrRvAZMI0bK154j/1seVp9t3lm0LrmWh3BXnS5jmvL82ORuSTo4OB00wEp19aa+9TqLQuAGwYGopLw66WNFXsZI5pzYSQOXhsiLr3m7/KW8WL33aUxsPHmjfC3UeU8ykHvys43FIi7VVR7OurKnv+Wpvo8jQ53YKXrrUKwl+j58aLJ+U1WumNgpu8hpOThXv1l+qSmvdB43o8mqpSgNLEW5OAQuP5u2uqL7ifDi0EDplJ6SGd58VoKpwTuur8qGwYomtdriN3ATIreeUB5Wf/c23pqOsskX8aq5rZIdGALtFOwuUIO+OX+3gdfN6JY+i83TSPQlfDrK5Q8/jHdmxbjpnrnPHZyr3iSfT8f5TL6rNnR0YKanKDuMoKUouzSCsxTlwl/bg+vz6iQpz036uI+mRGFqOaIZXqsSfQHXHOfmuJyLKKsfWd89Bi53zxRgS1Uaqrw+v+F1+lgs5vVdHlZPVeIR5+ixkvC4UM8bvc5i61r1lcWDpjRik1fWhiQctGVxp6U7ihxEKuqKnreEce5wCYLM9FPEtMAwgVvYkQoVdRFekheS7ZhmmXZXa16T7603nCHby+VJQegmakMSysPqrz5DNoQ6/56XHgszdH+RdxNwgX/wRQTyUmXaOXKTlnNTwsWUj91wkfy02yL3CaoSB8H98A3yfygX+iJO40wHx1KUvYulKBe6wFXUIaJrxjlcHGtC1t/Mz3XmTSH4Ij6M8aNN50qt1XGgWycwS+Gp4Dg7NBhtbTqZ0xAsihSlSm1IwhHv0iVReHJsn3uZNSWj4nGhzu0Fx/moysji7uU6t/NXzZy/4r34YHOMX/oibsZUWoqyZ7EU5QJf24Ot7sYJz/QlkokzX3N48a0a+ipcDDC4ssunuCqxPIy76nS5KaZ82fchE8/imKWqyyIYkcFKnoq8i5N8kYNbHa/nbIGUVaoRDXzimqr8oVs2Fc1h4XUQ3Mjfy7gIH3KFrF3UnAe9rdhy70RwNkYLW+BGqoRyWb3CMzVlemWSmYtdia6IC3U2Nx3fzDaoEHpjKlXE8f7QaGutshPre6EthINW5dlVpSx5rZq5trorqDiSMM52dXy4Vbey22c9i1BVVPlsOsofXYJv31WpYpFPbyucCdzCpKIORH/xcA53wuGa9Sd2O7Da6jwIfHRLVRrZBhXpeiNXG5JQqSBXnS4/jk1GfB9C+7O4xZai1Cw9ubKiSxWeqM22tTpb2kUJvgQa+dL1Vfl1udbt0duMCP52hc/6Upamn3PuLUXZGy6vpSgX7tpupScRjnUlRJUwUZqrc4pSxeFDne0+8JVJ77Y32JCPl3P8W3vvs0WZohzKriWps8o57hdTdKJqTWdxA3AaAeULs8QtXezh5Ms/5d9Dgyh03mk62/hZirJLAzjbZLJwBa6VokJ47Dxv1OiKgPKDay+Q/1109QbvIS0xj/CtdIxtzmWpqsWYopx4buo5xk2PSDpHJdEluFDnf+MKRkC0NtQ7zk2tRkShMMombXKjKyLMdiayw9csguvWEM7GaIGu7SxFtfblWkA5SlNA297rHFZbI1+aEgH2ClWJVNRddbr8DvihK7Y554ssRZmdWwPgxAk3Z66bVoiuAAjfvuEM2Z515pYe8l1FB9eTtf5xfNW1l++aR4rS6F5963UWpghUMhPWOIAHKhwaA0zZPzcz9FYEH+oEgR+1RzS9xMSuU2GDOEDyXN2iSlGq1GoS1n5UCwJHaIApXSNkFgufNQH9Xq/eyK2Mh6b8MKYwa5rSUpS94/ZYinJhClx5y8Sztoc6TyHfFTa7F6+oS0CVW7bexS1ZRNN7UzuR1lWuzs+NOZ1nBLdgFkLu3MTfc6DC/WY0tNVZnJtxGkG4rledm1o5u+akxPWhzp3O525gp93GlqLsjQjOUpQLc23flj+DcY4HucLkM5hZuzVLVp5JhE03fUDq5WH1vZWimmrkgBtjg9ul06HvWVgwipA7NyFwH+dYkVfnkDkMm7osVvnVI7dwc686N4goqnL5a+VP4vipFLJp7XgXWORjmMAtCAftkHZ7NuWw6tR6iyoCovwM4LbNPeq35Fd91elyO8JvW+fH5tPwdMFE7+WJTx8qSRad78BrV/GAcFOr+3UvOjfQVrcVbhE36cTvKOqxFGW3+jw2RgtS4FqbDFQ5FAVlWgWLaT69TnZvvqnHl7RWKuryIbrF+Vwg5khRygJbCC3nRCKHiAOVaQ09p6Uo8/JcoPwaenBzUSe7H9vuA0tR9u46sBTlwlzbtQnXnAPa50hnWdgi+NAAhFvbBbIX2TB5IPo3rY0m89lksuC8eGX/jh7otGLBAqIRlF53btrwbWPRafy0SyI4w/R/MQocKyfKNPVP3Iw6bcLa+1cLoikR5U6AXijRNI/0xLb5DMJCHSgVBubzJjU32E75M7RttOlhYki3q9IpOd1lIYoZ8B0qnKUoFyD5JgEV+jq6I51D7zTAuK3qCZpoW6piFsOw0Cxgm0ANTKRY5khRyuR6GOv1CW+NndMkEJm96oulKHsCS1EuyLWt0nqWJNBHyxPVaSlKnRKtgNAslRi1ZT0xio0p47Mjw7BAvP1abeLTgY5vdabgiQIBtmV/wOZePE3VWWa6m1KUFsHtWP8tgluYVDvcezKHF6qKhHHbYDAvQ6AzP10oA1ee9tZmnOPTzjeys80lk0MUZ/o0Jgq9qnAmcAttVhRVoSpRYTz32OeML/JQvED7cxtb26X52LTWsEZZGKavdQZSNI/IOt2oOuUCFAFVlk1XyB6mkI+ZdlwDlqLsDUfHUpQLdG2vn7g9x9u3UM6Wosy/lATantn1OnHCyM0vRbnwjNf2+eyibPt2zzs3E0csHF6mHfGXOe4dS1F2cQBnKcoFSF7NQoTt7TfmLClKQYmugHjhAIDyKvPtVFg+a4NQXQQ2QhjtGH7MdGxUshzlge1Gvqd9G2VF3tVe5yMKFsF1rQ2wCG4hvqny5M345/lMkEJ0CajwkF43cuuYaJPy4Lw/mixGGxEjf5nYCThHirKVhhHNqt7YMQEQaasAJBbs9K7C2RAs6FqUCjfnKRWdcxelZoZOcyPXyz5btdUDT3nIRBeGRZSibB3SF+VmjSCKm/bMbepBb8kOeqOZc1Pb3Lu3dZu4H9p+b0yZcivV1TuOjo3RAs9OCLfk6UiZI0WJSn5SQHhUT3vx+VWf+D49UOABE5X4F9EuytYhfU24Vds7ec9m1BTRACocuvblWsia3GpPRvBZk1cV4GGtuddOa8Q2mfSIu2tjtCDX9kjuxbvIb2J2msvP8OKn/lNi1hT1yONer/21IQm9aOTKtWw+08BqV2Q/bR33nSOCkwXqxWvgNlVubxUNZpboHUFiABEenB7EI4CJlju9Zc2y86OPew/31chhrXZJM1KUtsmkdyI4a267sEt1+civNFLPdwFOLcgxdeJcDCCOB48t55G9auQmnj0qJ+TPJBef7cqr2NyryF8U/jDREWF2z11QQlIiAY6G3iy4POHcwGOSPpaqZs7NjBSlYZjALQwjt/EWfgf8XJLJiHvC3M3ceBB8CRF4fK8auVajT1FOyp9fScc8/AJOUYJouax+pCopcJ34bBPRDrx2RUCEk6E3U9QTRwTgJPGQCxyWouxdLEW5YNe26GBFE2oSgB/nDS3jjha2RiDyzHZj3zNU1FGVuPadegjC8SFL7WYdvRdZirLtsPcPZ7zjzgVkfchSck9cXdH9akMSspRd75iykSrhlPdpKSqnxiZI69mlpSh7FktRLgLnTZQfatt8zbG4XWyACMetPUsPoSqRvDdaL9CKWIuepyQDlDQQOjx9W1SRqFOuCnVUyBp5zuHgiDaJvsRBPnISqLSaf/YC5eFs7u9ocrRLeETMymy79pumK9XeIjgbo8UqcC0jlziuTus0RfATsqazGDkl+D76Us/fthv9XmAdRFRFI8/WMFm9ZPGlKJlIUW/dxs9V+ZXLOnvHWb32LBUTyRqkPhdEe68noKjAc30RFMKsfmA3pSiNHcT1NgYLd23n272vPZ9fCGyUQls2RWb1VCSmIMrLj7tY+0fW0xO7KcvD6qtV9PhLeJwvckKoo2QOAYsxRdlKUd/0AamL8J0Zc99Z5HysozhOXXO2PrxWozci+Iq62hDx2Ev0PuJ4TqjDlIjXUpS9G7xZinJhO2+DFXxWfJkvSx6/TVSX146eqYtNgu/n0LG7+FtENPsb3c3KzSiIEnidFCY3GMxqCBbBom9tFImBL2qarVWdPXpvdfYOvkQfjn8E0V4o2ZZlKUQl8JKknwNiOjU1PSNFaaW6eieCszFa2Gu7laaMwlfDOI0ph347RCUTpYkCODi9PKw++xvdG8WVy+qrVYnHXayHi+epYQwVmf+86gJdCNmhZbi7yI9ig1+5BIfuINjIozgR/v64M/XgWrnLozhVGYF4wjt0mcA/hgYqMvVgv5ow9HAIZ0OwsG/+fKPIjefzC41c64sAhLkmTrIddcH3ceQvf8qLqUpsPYTvToWbsGTvcEUKqsQZm0sW4UFvEC0Pq7+1KuM4viHF/G3OkqJslaSMgej72H/ccw7S3VHc4Ho8VYnRcUbSz4NikzjjnrYUZe/qm6UoF77hzwyUKI6P0vJOZ0tRts1tTFHnOPfwi3T/2ma0G7eND1Y0qQ1JOPbd+rSkxJPScYLItKovsChTlDBZV1LgE3GcNL82nSVF2frEhTpREl6y5lxdXRuSUC5r96WpK+pGqoQT3qmHiOf0tE6cfjRgwshhKcpexFKUi2Btt+rrDWynFsb4lSvg8ihlrnXvYkp0Je7vxziXqsSu2zaep6cGP6hLRXi36mymf+4IThfyQqhKrFTUbTpfrtfIt30JUSXOFsHllyYaUZdQkJSPDFY0yc7VdZeD03r2Fh0X+xIDGtqeTs6Vouxw+NciuC6N4MTGaBE4b9lGkaveK2MifNglsySpZtan9GGc4Au8+siKPm2kKml5uHs8+VZ6anyUS5J+Hh4anT34+TrBC9XIbZlMMb4nhqltAWezeQI+1AnJAMfdrbx5pCrp2peTdFPkPlKV9Nh36T8l/Tw9Hcsj9zkmWE0YejSEM4Fb8LS2+xcCn0zHud35DhsOOnV+VkQVFc/HVp+pB9eGJHTDpoMJA/dOfUEywD+kY6RTtoZP7+Ssi3fht+bs+oQfxCZXuRKu/ZzXdKFubTQScOk4wSVU1pyjgxsvlSaDuuhFrjyclTE75iJd7RIuDvXZn7tl7uG0L1mKsrf0zVKUiyLW1vIw7pq3y19Q3utKWQu4OSe2dWwgJbqEg5Iin137ci1UgMUsci1xO+YiXe0KfDg2iUT8rOXLOi3yxZKibBn1VQhVia51BFx24Ky2WixlieyCS6itOVsfzoikLObncRV1tSEJJ16k+/si/+o8fRqznnizDYZ2mntLUfYElqJcRM5ba8u3jvPedIybJp7FdfJaJyM4RPDpOMH1cVK8L5+qViWWVyGLcdNJS9yOP08f7Et8XRzLNAVxO9g1OQ8neCEbudZGkesukMtCg68mJbzqzChuis3LHZyQElzCga7Alw5/i+5PTcKiFLmKOl2PDla0Ly3wRVdiVVonwLSGsLMMiKUoezWEM4FbLO6IllchN1ws2zXyltyo65yTKROejE9HSZMlPO8xFX1/bUgC65HFFMm1UlNr36331iV8wyU8MDYICE7nSEEu9hTlhMitREFFE94UGozlUcuM3e8yLUpxkj2Pc0UOK/bxxeNer/2LTuTyQtoiUF/OZ5N+TkrH8l2lO4jQZfqXLEXZW/pmKcpFZOSGMsN0w4XyxVDnu0lfZ0++Y7UTIUnHSH0/rzlyvX6IqkSq6GIwdK3jAMefpw8uOP7TFzgsrU8aONnZRb7IUpQAVCWWy7gbqvILTXlf0o/TOLXm4hQjrlOu34exLIpvHMDXV1d0P2oSBisL/5lceVg9VYnHvV77j3s3taTE3zVHSUXaNs3MVWvUUpQ9i6UoF6HzVsk9+QK8OqTc7VqRXKcU5fSdlUqSjpMm/fzT2nP1C4e+huLCNnQq7c/cGGCDTzgy3zWX6GyerOzAEOjMH10MRq5VX7JZ4IJ0jJ/6PpLpm41mGxNxWRTvCzwh8fz32oo+aKQq6UIWuZZjs7ai95aD+XbSz7OaY9PEbUfzPz1F2eEMqUVwXRrBqY3Rolvb1apEyrhrz5efx8irXREHBHQevkq2uy5Jx0hdiWevOJDvrjlbHz5xhGABPZfLjjSIjlQlPf4iLfsS38PzkHScIG7alvB5CFiX+KRaAbZUZVsIvEgD4/nRb52Ropx+/QriMgdHCjyGhJHVFV03UpUU1YWVrq6oazV9Pfbdura4gu+5EoPN7R3EbZ4aYFpgmMAtFvKo64Zz5bOhzqeSfhJVgrbb97nL1CTpKMEVONGXuHLNen1ubUhCVpxZk316KLiirjysvjYk4cEV7TvmXXqJ9DOsygExO+vmd0a8dpSiXGwLoVqVOFjR5MYL5SexwRm+iIds7mdNUbZ9WSAJdQKOhyRF/usx5+mZiCj5392nTo5mETtVibWahGPeqa9ynh+K4/BW1N66Npmng2Mpyt7FUpQs3sOv+dk4F5fy6nQrRyd9rAp1AoKXHVh/ySy6T+sE57lXocTn156n62JKdaQqv2+lh0bWExDZK0ukUlG3ZRVSG5JQA457hw6q551JH8ekY0RRZHoR5TlTlFldE2m37NMt/WI1cq2IuzYkH1xzlj4uWcpQc5SmCIVOUVxb9N668b02iQhJ0scFa8/Tx7uUt4xUZRPVfO4hZi2b9o5TMwhuRCQdgfTod+sjvHCBL/B3oQ5R2xybTge3paPpnzL3E1/Qmb9jKcruZCJF2cMit3gPvoooFZUbzpDta8/Sp8eUEVfg4NggipvHPZsfIdCAhogm/bwc4Rlrz9N3bLubj41UZWvL2B20Ba3ViNObiu8Oj71cw9U2o9XcmB77Dn24OM5EeJFPkOb2vEqFzNQlYcqZv/Zri+Ky3ZXSpYahdWwkbuMlacL9kj4eF8Ynx6rTGKm0GXnBoWg6RvR9/E2Ek9aepx+ORd418ubMySmX1VNulYvb3Y6OSqsIeG1IwgjEoy/Ue/kir1N4vSuwpJlFbU4kaxU0r2lTFDfpvM9IUXZTsWVjh/rf60Hu4q7sUJVYLquvXSA3H3mmPkOLfM8lLI0hL1s1x6FgmbzzBZDmKMEnHORKXLx0Ga9ee75+tC58auQs+WPr9wYrmhy0Cq1tRnfJu1eV8hDutpXIQVvQmkio5VU5jnuHPgbHP6rwHFdkWRhDQyCKmyyePM+UZPQJLqbcDSxDslbPO/rdRefFtxyci2X7Eafr37GUDb7Eo0OdMFHVReZoF6MTc5+dk3QUfR+vkwYvWHue/iuOj9TOkp9Ry36lVeYtm/u8/94uRGrlVchtm5GRqqS1oWzuj3mXPlSUlyK82BW5f6hDyMtvySwbhkRmnPlDIboCTpuMqeDEUero5HRL5GObKEzhulrggFr+PG6kKtcecZYOJSW+4cBpIDJLJCcdbg5xWTSXjhFdgYe6Am/va/Dao87Xz4vji9fUuXqkKmm7B04FGcy1odWgs2UQKcNtm7NXOGgVWisTEdFaW5mptW/XFQk8AccLFZ7mS7hYh1ZtQQGZayeUTr4TBIhKWlxCko7yI1G+JCUujk2iKK6bUpTtDg5l9TdcLLetOktPFWHElzg41DtsxJFpz+ja5z7vUpCOEcVz76SP14Y6L1t7vn4J+MJYk5HakGybTawm5r9t7mFy/ifSnVWJrR859H1aOqDBY0V5NvDspI8VoZHPPTim1ZaUaZ9MT1GqEnwJr01uU+VMEd7f8WotRWkpShO4xUXbM5nL1rxNnysJ/ypCIaZzpCulo6MjIviYEmOKOs/9fInTY5PT1xb4Kefpd0QYCcoN150jt1JFR2bThtrML625QA8sCIeScJQLPF7hsa7E/UQgZMKWCvjW8xadGm3M6rDmdcvSQj9JaPA/PuGZaeCkQgKxkW2bkG41DDUJ+dzfvPpMfao4vu5LPKAlch1TlEKnfK8ImZPTHCOIY8CXeAGRF/TDrWvP1f/0Cd8PynUbz+TnyKRYzWfuAY68UA8tFFgjgXU6xl+7Ig93HmIDmtPmnpnR2awCnXcy9xq4W5Snp57bio6Bjiuz2/rBmcjNkeTIRc4iuC6wc0MTkVztiDP17qSPL/gi+4XmzK3VnfZcTDMkDgENaHOcIIp3RQ5zCYdp5HRtsHXt+XoT8Ctx3ITyG43c7pSt4rkLRyFEDvCwQh37AQ9BOQrHIc5zoCvkhqUJoU5UUCc4ac1H+xucY8t/m61qJgMUwjiXN0YZ2ni2/OmE9+hyjfM3AG6Rz30ucpvWnK1/JQW+lvTzqLROEyjspFEQICHmEZ0gkvBg38fLUF4mdZpHXcBNXKC3iHCTRn4typ/UsxXlLnGowgqJLEO4twgPVjgUeBhwiE/ol2I297GBBogO3PQ1KsyyA1anfl+VNOkn0ZT/bdb522veLNced7EeowEVN7W7t0U+vRbC2RAk3XQxrYO7I1X5zpFn6hMp8ZWkj4PT8akiJ3N4f9O8ZBFIRCA2ia2Oyc6zTBKOFMeR4vLoIOb/b+1FL4A4EJ9/PeQfKZqmmdOcC6mTWbbxz2rkJlMQihCTJRTSMb6mynM2ni1jqAqXkLbV49yh57vYNxq0idwvD3urrkP5YqGfxzZH804LblqabsdGXiYi6ZSYBiKKiKPgEh4tjkeLn4igJtcA4Fw+9y5/nZitC00hHScgqGQ+hZutzY3Oti4nU5SqEApLSEKdzdLk6de8WW6mog4hndXAWYqyt/Stx1OUrtsuqCVy110o10qDwZhyZWEgq3ih7YfBZynO3On7+ZddLnZOAxobxHSc0BwlbY6ThgYhNImaotrMvh/GCc3tpOlY9v0Ysq37+eYBjyAdX1c7L1CdKm5BPOJL+HScDzzgAfztVafL2MqKFltHG6QtKu0Fw9Aq5fbTi+SPdeWUtM6/Jn0k4hFVgszDu20/etGuAaIkQvasLjaJaT2b+3SMNNQJoZHPfdr2/THS5hhpOp5/P6L5s9UEpj4XndWR6Tz3EaAwQBLrfHNslJOueJPcXK5ocYebnzq8hp2D694UpZXq6kJGqpKWy+o3XiA3jwfWpQ0u8SWceEQh7XgudroYzJXayWTJ5c9MEiEzfrlX3pItR/a19u/PdWJpjvzpFO1TVdKkD4/wl1jneVe+Xv65ViaiKqtWtdVnbEVw8zAMXbMQaln/uC1V2XZdRV4Q6rwS2O5LeI2kMGvf8xkR/CyOweTcZ0KV0Jp7mZx7aZ97aVsbzD63HdPRMvXfqqS+gHMejaOcfcXr5ambzpI/VSrqVkK6wyi1w9ctguvSCM6eUXanwEG2uzI3dI3r3iavT1OGRLgt6SMBompnx1V2YPR2+qaTXXeiZqSllCCCFJaQhCY/aDZ47JVvlH8rD2t29mv6ofSdeOGuOgtVldgqv3VdVT4Smzw2NrgmWUKCZNHcPjGwO+FR60xjFQAtDJCocoumPPGKN8oFreusTo/c5notOwdnmMB1iaHLCxZvqkitkXJ8bFDzBZwvTlSjj/NMUc5pLDpGftP+ps7H6HVISWrMam0mA3hx3NXczjnNn3HytW+Wn7cK8nY6lyVCT6Uop138RPmtTefL9cuUx6fjnIPj7jz6jXRwcmZJUc46TzKPMdXZoqd5pCg1S60H34cXB6HJx/wox115hnxvsKJJ6zrviSgvWiNgKcod3AI2RkkPTLOOVGkdI7gFGFpT0Sf7hGoywFGaQmgS8vXgppQ0mkcNx+kppE7pxTkL3s6eolSUiOAL/fgYIDT4nDY59+o3yy8BqKibejavQ4qCWVKUMuNm6MpbYaQqaT5O48D5R52rNW1yvi/wdwiERvZsdkbrIZ1Wx3GW1LHOMaYz1sYc8zBjzSlBBUmKOPGgKd/TwNuuOl1+BNnB89rQ7HMPeak23fHc62I1g7JbEiVdi52D6/YIro3aUJayrFTUbarKt/hfTggNXq2RnyV9eF/EaebVz+hMMGeKckfNRNvuPJ2PJypEVVIE8f148RBSvpMGTr7qDfLCq98sv8yqaqjM5bnHyF0duzl3fn0V5a5eiOSvfZv8/NpzpJzWeboGLncJLunLqsXkz2fjvCMG2eG4zh2td7JJ+frzffikhIuRjWmDF17xennCVW+SH7W6XmRR+7TLbP2RJltR0nm+LxW4E2DLqoUT22uRUYXxHTY7zIy4qnJ35vTZk7kpy9MiuB6iKrFKVmOwdqk0gQ+tregnY6CM5xWuwPGtg7cxSwsi4FR2fNN0fJ4rzGdLen6ciYjiXYJLirgwRjPW+ZIKH7z6dLm8FbFNiPVsQr45W9Iu4YbYpCFCku8eFTpHmS4GxHl+DG0VWbo0km+N4XVV+RrwtTVVfZKLvFocT0pKJLEJMRCZPBc+e6EAbSuZJfNYG53XQmt3r7gEl5TwsQGhzvcQPtS3ja9lUbpKuYyba+6zEmKwdZRbV6zgN5LwMG1Om/GpIquSJWuvhcnKK/v2Hs1i5/3gt3fAr13Co2ID6HQP5kXFxSEibAQYBDdijxXn61BZBNeV0VxNQlbsVv3GqoxuXC+f3niOnEDgybHBsCp/SfrwSR9ePJJHdKlmbVkicz3WmiNFmd2OKBA12/EWEMQVcEk/iS8gqvw8NLk4FR5z1RnynKvfKJe3+oO1yj3tSMQrFXVXvFZu1sg3kn7cDG9eJ1IYqe/DhTH+Z0lkQxYZdLlxyMewVVtyU0W+/ZNz5CmacHRo8mFVbvXFLKpzSXZ/5K2YQh7h65QxnCu6lw7znwlayOdfnccl/fikDxeV34cGnwopj7/6TfKEq8+QL030KkQ0W7dzi3h5WP2WqjRQPu5LOOgw95nhi+Jx6RhjLuFzkJcUWwCOSHkYN1KVVJVLXaHDNUxeSxSHC+M0YspnF841LLAUZa9HsT2+DKQ8PNUzPvYCvU+AJ6I8C+FYcdzPFbKDvBomDvZGzZ5zTHfgpz75yPuNi2Q1D1uHv12S/Z1QJxXHLxC+H4UvD2zlR/nzIip5tFHd2cLOFXWsR4+9hAcnwo9cifunYxMHvyU/aKy+SEGVRmxw8hVvkB9SVs8OjWh3US6rr62cLJ69sqJLl5RYp8qzVHm8wMNcKT+v3Zr7kEXcedWSmf1Vp82/ZGMuzuHEgRSyyC80QJVbBa5A+I/xhO9d/3q5M7dOWaeJne1koCqsR45bTkngO4VlPK65LduB2b42nSPx/dAc5VVXvk4+XFF1VZG4UO5JKsiht1NYsoxvJUv4q+b2adegk9eQbuf1118ol5TL6ms9sH5b17n6HD3JJXwv1onIzGClLYALvg8f69Q2nS9DVNTttVZQJnALa+FMRngZR1+o9yKwKkROFMeJCIeh3NsX6Rc/uVNxuofcqXpIWieK8GeN/E4cl6vjKhzXPuRB3NwusLujH5mqiojoMe/SlUmRzyRF1uZFebMKG0Bs8But89IfvVH+q5cW/WxOwSBM2bSztqIDFHgUcCLCCaIcpcpBLmGZK8wyz7StibYoT1PQlG0q/FmEnyhc4QKXe8+WK94sWyfW4LB6alPX4C5MviCiJ35Y99cmH5OEZzk/9a4PDbbFJm+58g3yoVaD3QUWfggi+rA364rlJT4mnnKralDrfotNRjVy9vXny3t7Rdx2SuBk4oyvCZwx9eYaXI9fB3F69HTcxdpfr3Owb3IwnkNUOdQJyyMMOOhHGACawN0Id6LcHYU/i+NmH/hdFH53zZnylxmLttWOZXf2HssX8sqKFles4GkinKJwb4HtzjEydjtf2liVPy9IA7ePI/psLqaOyWBFk2393N9FDo7wEAKPFOEAHANAP8oSEVBhVJQxlFEV7nSeX7iUW9Txu63j/H5LVRod5z7vOLE7BQLgsR/QdRp5BvAggYZ6NroGX7z8DXJLpdMZugUmcgBHVvTxGnlGVB4iQgPHT5p1vrTl7XJT+8+ZwHUM40zgjNlvslYPt93Z5Xlqb7ld7C+2EyI367cXsoFbIKmyQXCdnJ17Gi2ug1hdj+4x46z5QYdZ/v7imHuVvIGj7sr67ukIDktRmsDtotEr51uq23eetQSrvU/Y9O+xJw3aDqKS2zZnjVZvW5n3KVtP6CXPd7fN/Rakvd/fxBxvQVeuRDdM27zV2pm6x52Z2QzisPrbNiOt93Hb5t3rrO0to95qFNwa+8V2DXs9gms7U2kCZxiGYXSPwE2GcT0rcM6Wi2EYRpdGL3YOzjAMw1h0AhbzXoKzlNnT9h3eMlGwG7b0TubOBM4wDGMxUc7+F5QlcwVpolO1DmE7QLlsEZxhGIaxkCM45d4y33qo2c9thwVSks0EzjAMw5hOm0A9vFWPs6O2TS9CAbf12liZwBmGYSwiJuptCkdqpHMhavIUZV7cTAMI/Aq6uaC6CZxhGMYiJtvif/hbdH8R1mqadTyZ9cezCM9pgBC5BaBWswjOMAzDWGAMVjKb7T0n+xL3iiFr1txRClvthDwSU24vFrgJgOHe6bhgAmcYhrFIGNmSpRej8rKJCG224C1LREaXgAg3bKzKn3utbqcJnGEYxiKgnLezOvxMPc4lnBzqRAE/28/nnQRUHKjwQ4DB9bP/vAmcYRiGsQ9QaZ1/c/BO8YjOp06J4EODKPB1yOqlmsAZhmEYC4bBCr42JOHwt+prfR+PC+NzR295CBddEdHAlhWO60ClVuutjucmcIZhGAta3DQZqUq65k16gi/wztAgiOz4sLZCFA8CtZGqpIMV/N7uZLGvsW4ChmEYC5S1L9fCxkul+eg36apSif9GuI+mc3QPaNO3vAP69tDg0Te+U37baxtMLIIzDMNYiKjKYEWTjZdK88gz9KhSH98Rz31ic17ihirRlRANfO7Gd8pvy8Pqe7H3Y2IryTAMYwEJ23r8iEg6AukRZ+mzo+ejTlgR6kRx8wpK1HkkjrPNOd4OKrXNvdk4xwTOMAxj7yvZ5OOhCjII7qBVaE0kjEC6tqL3DpF3SsLfawoxnbe4oUrwJZIwyts3XSi3lsvqa1UJvTjK9gzOMAxjL1Auqweo1WYXm1Vn6QMLjheq8o++xAPDGK1qk/Oy1apEX8TFJj/bL+HIkS00GSb2YnrSBM4wDGOPB2t5tNYuMhV1D4ZiAYp9DR7iHccjnAT8tS+xf2xCTAkiO3EwW1EcQRxOm5x8/UXy/fKw+tpQb0ZvJnCGYRh7WtxyYVt9tj4DGBJ4oCrLUJYrLBM4wPfjUIhNiIEg4OYbtU28VCQtLCFpbOesGy+SCxlWTw+LmwmcYRjGHha3NW/VA0n4F5fwVAQ0b2OjcfL/qqSA7IqwZS9FszBAoTnKf9xwoZSzs3OEXjv3ZgJnGIaxN8RtPXLENvrp478KAxzf3EbaepomOmF7W3K2y7ZYI2myhCSM873+/XnqVXdTp4r2uriBnYMzDMPY7ZRrOKoSKfGGwgDHp9tpiCMRwQt4BJd/yD0SN50Qt/9u3s7TrzpdxnLdVJsFi+AMwzB2d/gmIHroa7Q0sIwbXZFDtAHzOaA9/5dAEWIygA/jDG+7k9Nu+oDUqWQNUW0OMuwcnGEYxu6kglBFlyzj3goP1BSH7L6D1qqkLiERj2+O8t4bLpA3ZK9r4mYCZxiGsRdIBZfo7ovaVIkCJP0ksckfQ51X3XChfLHtGIKJ2zTsGZxhGMbupJpFa36c24E/ikPRXY/gFIJC8CWcK+Biky9I4NgbLpQvZjUmoVcPcpvAGYZh7FVEy8Pqb7hYtiN8xxURhZ05j6YoUZUURX0R74t4DVwZmpyy6Vx57nUXyK2Th7hN3GadCRsCwzCM3UxFHevRI87mISJc5xJWhAbNiR2Uk0IG2aGCic9FSFwCUoDYAJTvKXzwesdXqUqkotnv2/M2EzjDMIx9onEVddWqxNVn6Trx/LsrclBsgIZJ6ysC4gCX/x8IdSLwMxW+Dnz5hvPk6ok/WlZPrberk5jAGYZhLCCRe/Tp+uDSAGcAp6ryIAAiQWEr8Cdx/J9GfqVwuStwbfJ/bN54qTTzQE/Kw7jakAmbCZxhGMaCUrnJ7fvHVHR53fNAaZBok7uCY2xrkbturcr49F8brGgysgW1iM0wDMNY0CJXHla/o+8PVjTJnrGpBR8WwRmGYSwi8hqVE/9eT16V0nZCGoZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZh7AtUsg/DMAzDgEUsCCrlYRxAbTNKVWL712/bjIysJyCie+0tVdQNkr2ne8pBq9DakIQ9+XbLw+pv25ytgV15vfbfBxipSrrHh7iibsM8x/igVejUtbFvuKfjvHtvG5XBDfiD/oQC1IYkoCrl2uSY1oaIsBfvG8MwphqMTjcuFXWdf9Yiu94O7lU6rhkbg527xwzDIrg9HyVRlbiyrMXCStYJPJXIkQrLBRDHGMLNAt/yRS675kz5y4QA7qloLn9PR1+gT5Aij40NUmmPMmaJNxwwPbRwguJwEe6MK/jIxldIc484CRUt/m4FrxDHfjhQ5c4rbudDOxPtPO4D+lLnuV+MqCrNsSIf2PgKGd2TY/y4j+pfF/o4LtazMY5u5vAKbI3Kner4S0m4/j9fIv87sQbWI3s7ovubz+urcDxQAxEY3zbGe694qWzNHK89HylVVF1Vsmt+4hf1oILjmcDjiNxXHPuhpAh3iedmJ1xWGuObWZSpgsJezYIYxm4kWUQuaOtmi6vP1he4hLPE8ShxoIHsW7l1E8+xwPNCkz+uWa8faijv2CLS2FMiV16F1LJPn1FYwqtTAXH5G1IQmbS8Iu1ONfgOLoZLoLGd28d+zyeB5m593/nfuhX6vOPc4jL2Q6CxlTsH4f+NQJzb8La+p6LwlmQZh8QUQh36E/4FGN0T4zwIbgSiwN+VVvCy5lYQn42hTHfZBDygKTQbjP7Vp/TKKHxgg8hXAS2X1ddqey9NqMo/9y3nEaEJze0wAB8Htk4u2j2b7aiKhFM+oQf6e3E68OJCP/dRBY3Zh5CNpXjQyCvH4canfEU/8M1nyMeQSefCzKVhArenxK2CIBLXnK0f9H28KqYQGjTFUfDFTDhEMoMXm6CRpnPcpzDAuTLKiWsr+syN6xnPLOIe8kiFZmxmry9uUnBbLxYDCoSWUXOeRFqSMdUgAownS9ljnnMygKpye3OUpdmLcvvOTwt3NEdJYxZjbvfCnvf0hW3NbaRhnBRIcCSuQzItBhBIUfp9gSd4eMLJn9ZvNkZ5fe2V8svysPq99SxMlTub20hD9oTyrqZnr4hF6xqf/Hk9Vpbyb4U+HtrcDo2t1MVRcsXMmQKIKYRxgijRlzi82M+lp35Dnzo2ymnfHZK79mgGxDB6WuDKOKoSVp+lFyZLeFVzGyngkn4Koc5vQ53vC/w6QnSOh6jyWF/k0NhE0600k2X8dbqVSzlPXlBBXZXdbIjz8E0jvwkNbtRInYhvPfnLg7iIcKg4lqPZ68fAzwRGUZy6/D0pKooHfjfg9qwhlCyATHIR9rvwB7xAkjsWe2Ut5anfRBXEk2jglhC5M/+6qqACBYT7uwL3cgVIt2eORbKUpxQdR637mD6rNiQ/2luRiQgeyZ2ZvTROLXF76pf0RBK+JY5l9btouIRiYRmldJRtscH1scEtCgWBleI4rLCEQnM7aWigpeU8TSOXnTysp3x3PVtVFTGRM0zgdiOZEQpHvFUPE8db0lFScYg4JK1zDo4PXl+VO6eksyrad2eT07znfTiK6SgN38/zj6zo56pVuWx3e++tdNe1Z8slwCUzPXgVEdGjL9Jv+iJPTseJIog0eM6P3ybXz8NC7nGjco8yZXvb5GVvNroCaJPXfe8f5eutMW79yCmf0APHmqx2Kc9yCS+WhL7mdupJH/fxRb588qf1qO++iP/dKyInE3mIvTNWFXUrN6OnflXvEwP/7oRl6TiNpJ+iptzRHOVCCtS+9VS5tf3XnvxlXRPGeJUv8dLYROt30+jbj+O0yf+jKs8bWqUeCGY2DRO43cTEsxfHkO9D0lFC0k8pjHPJ9efL+S1vdco27GfLOMqla87RvqSP94U6iENFeD5w2d6+hqFsC3aYriPq8n8vgGcc98ju7i3D3UGMVbJ/to0xAJf9g/wJ+C7w3cGP6ycS4XNJH49Mx2gUl3JgYxuXgpyyV3bY5mMjupf0bT1UReKTavr24nLu37ibRtJHUQM3a+AZ33qW/LQ1ehNHbYYkfOuZsgl42VO/oldIgY8R8PW7aBaW8tynf10/VztVvrU3U7uG0fUCNzK50XCtZrdVEhpoGvgkZfWsRGpD085fVdSVtyC3OS69u86bxHH//LncSirqsnM+e2cHW0+wl0dRdR5RZ36265Y7cCMvlWuP/6D+zcBSLvdFDm6O0iws4W9O+hd98vdfsveM9t6I4MrlfFNJTY90BV6YbiN1BbxGtusYz/rmc+Sn5WEt1jaTUpVYG5p0CsrD6ve/A3fpM+STT/6S3r+0jPMb24gohJRzy8P6nVrZ7h3DBG5PUJhw4CNa8DTLQG1LB5NRlZg/FgtHVfTx6ljSqIN46qxHqdrNOVdUtFje7JyTKKK1LKILKytavPLVcutJn9A3FUp8PqYo2bO6fwK+tbK8h2VnLw7ubSuzV/Pw90kfvrmVemEJpcZWPvDt58j1a6/VQu0oaXT63fzQdyzvr56Ud41u4wVJiUel46S+xNrtcCwiV2QOgaUqjYWPW+hvsLwlNw/KHxAUoen7cKo8s1aTUC7DYEWT7JD39HSTyrVVuWXj2+TGG8+XG2+oyi9sJ9geCML2sjru7MttqdKkou7ulP9ojvELV6AYxgHh8YOf1PtWRWKnIgG7e3D3/MpTGalKWh7WYoQnhTrgKDZH2aaOD6EqG7++A2ES0dsORGpD0sDxIVcEIHUlcJ6nA9x2IFY4wTCB250eKY7/FEFQXKgTJeFtq8/RV9eGJIxUJc2eYYmWh9UPVjRB8zRKRd2UD2OBqeMuvNx8UpRTrbYOrsNtfIU0Bb7ji9kxEl9kmVMeA9lZxj0vP3v271c0u4atwqMQHhaaxKQP0cBVlz1LfluZ5yH3dRvyNKTjO81tNIGipoByPKiMrLPozVgcLPxncFUCqpKs50vpOG9N+liZjtMASkmRD6yp6PNE+bfQ5PtpkV/UhvL0SzWrW1gF7JDqggvCdsub3Sld3ZD/P/ITjYCgLkGlwaOBb+3RqGQvDe6GDVlxHO84xPfj0lHq4ik5YSOobOhcPGcG1SoKogNjeutokd/4AoeE7KzjQ5/4HQb+S2S7nYszTOB2j3VQhtRvrMnomrP1eSHlO8kA90nHCaFOcEWOF8/xqmgRfvaYil6lyncQflityu8BKKunZgVk91gQtg93Uc6Xg1Zl71A8v44BUEQEEeF+UwRwDw7uHt9FmV9DVA5OZPKVA/wSRFmnUJ3nPacqNZHGU76iv5WEQ+I4qHKA28ZyYLvdMcZiYHGk7GoSqKjbdL5cH1OODw2+7Dze91PUAOk4Tc0OeT/aFfl7V+ILKvzPkVX93JFVPZ6ahFZ5KZvyhaaOu/ByO52ihJWbs3fZVP6i2Z5bpwqq3LtdAPfo+95Lq0+gX6f+e9vO/o1WdwGBv7jMSgSBvmLCAQCV9fYczjCB231Us40AN1wgv9pUlb+lyWBo8DFVfuU8hUI/HpfVRAzjNERZ7gs83wlXrFmvHxisaGIit3ujot3zy7v+erukSIFUY/5XFNgblUVkMoLbSw5HOu3lizv7JybaIAmNtnJzzsV8N/N6u2cME7g9InKoynUXyA82VeXlXjgsBk5Mx6hoygjC1qSfoksgjNGIKbE4wKvvguHBiiaVCtYYdd8HYftMjH2BAZeQHTbJCmLf1XURLmxrH6MY2Q/YqTTsuvxZnSor8oLMAqSxmUeDJnCGCdweEjkRpay+PKx+Y1VGrz9PfrTpPDn3uqqsi3BEOs5LY5Of+P7Mc21uo1FcwjO3wqurVYmt6g3GIhXjXUhRbsl3SWrkUJcAmm+2UH4He2fr+552q1ppVhX+ECNofn87z0N29p1WqxIrqk7ggZqCCA642xX4M0B1PfY82zCB2y1U1A1WNGl9UFFHTcJEz6pyfjQAleur8utN58onlgvHxibvdUWcggtNIsKrBivaN1mNwWi5/AJs+7+dMPKV/FTi5N+QML6XkpW7kKJsCZiDtZKVlRZNAWELQKvD9Z58v3s6Rdl6zlhQbgljWbcFzTbUrIEpVYHmntpK9o43fYWDgUNCA3VZYvJXa57B3fc4jDaMvcTiqGRSlTj7zSlKjTDSLobgRqqSAm9Y8zY9wRc5NtaJOB66DR6CyM+y+o896IXmhikmpB5SJO8LBkv2O5zlwF/m06fs0AMoICxvRVMIjbrbO21ghJ2N4FTWbSAeNKz+z1t5amgAQiEdZzuOawBqm/fgWtC2CG4Prrhqvp7vdzu/+O0B3OqLHJKOowjHPOXrevA3n8rvK6ir7uDYzIZ1OKrEJjyhtIT+5nbqrkAxbXBNVSQOfl+TkZOmlcczDIvgdj5yAzisokesPU9fufpMffnaC/SVR1b0CFSl48HtqsSRqqRrP6qFclm9CD9wBcCROo9XuD+0VUjpPYVTULnqdMYVbhcHGkldwgH1yEOoqGvtoJvFWAsVdQfBA0R4QExR8YDy53vFnd+tt0t6sZMi8fKPklSrEv98J0OFAR4dmzSTPgB+9L0Xy+8qXdPQMyt0cOkrpBmF7/kSEGkUlrA0NngZIvqN+++gLZKqsCE7Q+rg1TE70u00IBG+mSmgGU7DBO4eM9h6hhA4yvXzYd/HR5N+PhybnImIrpwrAt2YtbFR5VANoJFWx7VRmGjh1pMMVvAgKo6N4lEg9QVcjLycqsTNm/FZJZiZxq9cI8nF4KX5M86GK6AI1132WqmXh9Xv8QPAHVKU2a4/nfxQlYqqG/y+Jpe+QponfUoP8X28K6a09lCKCJfm9trtjfe7N09hRsfH03EUh0/Hic7z+lOH9dCNr5Dmyz+qhU7zW8mcm8JIVdJrV/NPyRLWhjFSXyRJx/iFFvivrByYVTIxFgcLOkXZSks6+GHjLsZE8fU7QBKetOatunJTVbZQVl8uT25rPmgVunIzWq1Kc/WZukYSTgkNovP4mHJn0scvARgm9moMN3HoOfBFDfwjUEjHia7IS49/r377ytfLV6hm1eXbf68mEmrQeNz79a+kyOvDOJGsOasAw3stTpn1mtokRCBvbBtP/rgepcowjoPDOI3CUorpdn5wr2V8pVJRV63u4XTbXkpRQlYwuaLqqiI/flJNv15cxtMaW2kk/SxX4UtP/g899dK/k1t5xdT5rWX3TAQaT/qyPssVeVdaJyioKyGhwdsve3LmwFi7HMMEbneQHwvYVOWmI87kat/PujhOQwos1wJfW32WvvT6C2RDrUM4duQ5eioJHxShXyMNv4RiOsZXrjlT/lIuq69J796ktSEJlYq66uv57xMu4bvJACenYzQkUnAJ/37i+7Xql/Hh2tDURrInfFyXSZ2XqHA+kZIGmskAhbCdq8dKfLVSUVcd2vPP4TrtopyM4LI03e1j7Ccpj45wmnpeKJ6+ME7D91EMde5IIv/QGoe9NvB784mvqsSv8Np0lMf5Evun4zQL/RyuyuWnflXPiZ6v1p4qd7T/ypO+pI/wjpeL5w0ERAON4nKKjbv59jefwaey+TVxM0zgdhvlLUgNic7rm2KTH+EphibNpMghEb6/5hz9AcK1BG5SjxPlEOCxUuAYAG3ScAWKoc6deNaDSm2lbXGuAohovFhfGev82BfZP9Rpiqfo+7ggvZt/OvH9+hPg/1BUhfvJKKt9Pw+OdYiBZlKiEJpsdwkv3fgKaT61om6vJOIEEFxogjouWfcxrQB+3cdARPVPd+MFDnQJ901K0BxFCTQLSyjGlDto8Lf/+TK5qVxWX63uBYMtk//bGwuvKhLzSOvXT6rp832Br/gixeYYDV/gAa7IJ+M4v3/yl/THCLdKpKTCKhGOTpbQl25DVWkWl1NsjrK5OMCLIT8aUDWjaZjA7b5oo5ZHG1W55ogz9aW+yL8kBQphPNsB6Is8XhyPx+UGREEDxJQmik8GKMYm22KgvKkqt+Z/a59sKBAICil5d+/8+dc+jY6vOl1uOuE9+nRx/HthKfdLR6E5SsN5DnZFDpZMTLKdlk1Ix2iIUCwspRDq/FlTnjvyz/LTvTWuChElFSXVAOJ5qPM8dPrGzxghpoQYkKQPh1AITf5bt/PP33ulbCmX1ddqeykaUVJV0nyy98ruw9qQhPKw+lpZvn1KTU/1Bf61uIx7N7cRQ0rqPfdP+njGxPPMCOk4mm6lLgml4hIKzTE21Bs8+xunym378r4xjF1lUZyDq1Yllsvqb7hQPpPWOUkjl/sSSdKfCXRsQhjPynRpE0Qg6afgEjQ2+FpscOKmqnx3X9+kCvsXlpAk/ZSSrI5mYd8ObDauV7xBftgMHJPW+TiO8cISir4IMYXYgFgHTcEVobCEonjq6TifbtQ5+vJ/lu/mkVDcSwt2WWEZSbKEvuIykqQ/e1++mP+/lP0/KUHSjxdPIzYZiXX+7r9Pk5O/90rZUh7ei+KWzfu9SstJistIxHOvQtg7911L5C4ry3+Ob+fYdIzPSoKWllF0RQiNvLRdPXMKC0uQwjJKwJ+ao7z57mt44n89y8TNsAhur0RylNXfeJH8EHjc6or+tTT4G4Q1wIMFlmnmxt+lyq8l5XIPX7umKpsA2FvpqA60DuAifDrdzo9DnYgiHv4PgH2Y+pmIkF8rvwVedsJ79d2xztNUOSpGVomwPP/RrcAWDVzjlK//8FXyPwB7KxJaB3Eki9C/2dzG1uZ2ojiyk3dtciGComxTuMsl/CY4No2cJjdN/EBF3T7YJPH/GnfzgBCAyPhANpZ7Z35bkdyQ3AKc9pSv68XNMZ4mygkaeQRkTpZG7lblhujYEMb52reG5A+t8TJxM4y9RVlnnOMpl9WvfbuuOKaiy2ecjbNGp/Ojom76rklQGfy+JoPfz6rETBnzYfWLZlxVZea12fyWh9XPOb9W7cdY5CzSBaxSLuNuW4mMrCfMOHelKoPr8SMQF9IB3vKw+tsORFoHZbPzRAusR11eCWYdxOmee6WibgO4fTmuE2O4IzZkRwdqm9F9vQYGK5qwbvLf+7IKSEXVbdiAG1k3875pjW2n7xmGCdw+FDy0/Yrs5txt4zp1udi42vwahmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYRi/y/wGpPjDu0IF5awAAAABJRU5ErkJggg==" style="height:58px;width:auto"></div>');
    if (sp && !sp.querySelector('.s0')) { var t = document.createElement('div'); t.innerHTML = SPLASH_HTML; sp.parentNode.replaceChild(t.firstChild, sp); swapped = true; }
    // la animación dura ~1,9 s desde que se ve el logo: no se corta aunque la app cargue rápido
    var begin = swapped ? performance.now() : Math.min(performance.now(), 250), wait = Math.max(500, begin + 2000 - performance.now());
    setTimeout(function () {
      // dos frames de espera: la app ya está pintada debajo y la salida no compite con nada
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        var e = $('#splash'); document.body.classList.add('entered');
        if (e) { e.classList.add('out'); setTimeout(function () { if (e.parentNode) e.remove(); }, 460); }
        setTimeout(function () { document.body.classList.remove('entered'); }, 1100);
      }); });
    }, wait);
  })();
})();
