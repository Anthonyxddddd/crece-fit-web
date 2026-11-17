/* Crece Fit — lógica de la app */
(function () {
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
  function dnum(s) { var p = s.split('-'); return Math.round(Date.UTC(+p[0], +p[1] - 1, +p[2]) / 86400000); }
  function nstr(n) { var d = new Date(n * 86400000); return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()); }
  function mmss(s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + pad(s % 60); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function toast(m) { var t = $('#toast'); t.textContent = m; t.className = 'on'; clearTimeout(toast.h); toast.h = setTimeout(function () { t.className = ''; }, 2200); }

  /* ---------- estado ---------- */
  function fresh() {
    return { setup: false, name: '', settings: { rest: 40, sound: true, vib: true, voice: true, theme: 'blue', mode: 'dark', rem: false, rh: 19, rm: 0,
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
    if (!S.food) S.food = { sex: 'm', age: '', w: '', h: '', act: 2, goal: 'gain', log: {}, fav: {}, done: false }; if (!S.custom) S.custom = []; if (!S.exv) S.exv = {}; if (!S.freeze) S.freeze = f0.freeze; if (!S.xp) S.xp = 0;
    var f = fresh(); Object.keys(f.settings).forEach(function (k) { if (S.settings[k] == null) S.settings[k] = f.settings[k]; });
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }

  function levelOf(xp) { return Math.floor(Math.sqrt(xp / 60)) + 1; }
  function xpAt(l) { return 60 * (l - 1) * (l - 1); }
  function lvlName(l) { return LEVEL_NAMES[Math.min(l - 1, LEVEL_NAMES.length - 1)]; }

  function stats() {
    var keys = Object.keys(S.days).sort(), best = 0, run = 0, prev = null, maxReps = 0, early = false;
    keys.forEach(function (k) {
      var n = dnum(k); run = (prev !== null && n - prev === 1) ? run + 1 : 1; if (run > best) best = run; prev = n;
      if ((S.days[k].reps || 0) > maxReps) maxReps = S.days[k].reps; if (S.days[k].early) early = true;
    });
    var td = S.days[today()], t = dnum(today()), done = !!(td && td.w > 0), n = done ? t : t - 1, cur = 0;
    while (S.days[nstr(n)]) { cur++; n--; }
    var mins = 0; keys.forEach(function (k) { mins += (S.days[k].sec || 0) / 60; });
    var hd = 0; Object.keys(S.habits).forEach(function (k) { if (S.habits[k].xp) hd++; });
    return { cur: cur, best: best, doneToday: done, total: S.total, mins: Math.round(mins), chains: S.chains, lvl: levelOf(S.xp),
      maxReps: maxReps, early: early, goalsHit: Object.keys(S.goalsHit).length, planDone: !!S.planDone, habitDays: hd };
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
    var t = dnum(today()), y = nstr(t - 1), yy = nstr(t - 2), mk = today().slice(0, 7);
    if (S.freeze.m !== mk) S.freeze = { m: mk, used: 0 };
    if (!S.days[y] && S.days[yy] && !S.days[yy].freeze && S.freeze.used < 2) {
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
  function syncReminder() {
    try {
      if (!AND() || !AND().setReminder) return;
      var st = stats(), msg = st.cur > 0 ? '¡Mantén tu racha de ' + st.cur + ' día' + (st.cur > 1 ? 's' : '') + '! 🔥 Hoy toca entrenar.' : '¡Es hora de entrenar! Empieza tu racha hoy 💪';
      var last = Object.keys(S.days).sort().pop() || '';
      AND().setReminder(!!S.settings.rem, S.settings.rh, S.settings.rm, msg, last);
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
    var warm = d.warm === false ? [] : warmSet(), cool = d.cool || coolSet();
    warm.forEach(function (it) { steps.push(stepOf(it, 'warm')); });
    if (warm.length) steps.push({ k: 'rest', secs: 15, title: 'Prepárate' });
    d.slots.forEach(function (sl, si) {
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
  function tabsHTML() {
    var T = [['home', '🏠', 'Inicio'], ['ex', '🏋️', 'Ejercicios'], ['food', '🍽', 'Comida'], ['prog', '📈', 'Progreso'], ['set', '⚙️', 'Ajustes']];
    return '<div class="tabs">' + T.map(function (t) {
      return '<button class="tab' + (tab === t[0] ? ' on' + (fx.tab ? ' pop' : '') : '') + '" data-a="tab" data-v="' + t[0] + '"><span class="i">' + t[1] + '</span>' + t[2] + '</button>';
    }).join('') + '</div>';
  }

  function weekStrip() {
    var d = new Date(), wd = (d.getDay() + 6) % 7, out = '', i;
    d.setDate(d.getDate() - wd);
    for (i = 0; i < 7; i++) {
      var k = dstr(d), r = S.days[k], done = !!(r && r.w > 0), fr = !!(r && r.freeze), isT = k === today();
      out += '<div class="wd' + (done ? ' done' : '') + (fr ? ' fz' : '') + (isT ? ' today' : '') + '">' + DAYS[i] + '<div class="dot">' + (done ? '✓' : fr ? '❄️' : '') + '</div></div>';
      d.setDate(d.getDate() + 1);
    }
    return '<div class="week">' + out + '</div>';
  }
  function miniRow(attrs, e, name, sub) { return '<button class="mini" ' + attrs + '><span class="e">' + e + '</span><span class="mt"><b>' + name + '</b><span>' + sub + '</span></span><i class="chev">›</i></button>'; }
  function mini(id, e, name, sub) { return miniRow('data-a="prev" data-v="' + id + '"', e, name, sub); }

  /* ---------- secciones con pestañas (se cambian tocando o deslizando) ---------- */
  var pst = { home: 'hoy', prog: 'resumen', ex: 'Piernas', food: 'plan' }, setSec = null;
  var PKEYS = { home: ['hoy', 'avance', 'habitos', 'rutinas'], prog: ['resumen', 'calendario', 'medidas', 'nivel', 'logros'], ex: ['Piernas', 'Pecho y brazos', 'Core', 'Espalda', 'Cardio', 'Crecer', 'Movilidad'], food: ['plan', 'menu', 'rec', 'ali', 'tip'] };
  function segTabs(g, items) {
    return '<div class="seg2" data-g="' + g + '">' + items.map(function (it) {
      return '<button class="' + (pst[g] === it[0] ? 'on' : '') + '" data-a="pn" data-v="' + g + ':' + it[0] + '">' + it[1] + '</button>';
    }).join('') + '</div>';
  }
  function panelHTML(g) { return g === 'food' ? foodPanel(pst.food) : g === 'home' ? homePanel(pst.home) : g === 'prog' ? progPanel(pst.prog) : exPanel(pst.ex); }
  function mountThumbs() {
    Array.prototype.forEach.call(document.querySelectorAll('svg[data-fig]'), function (el) {
      var a = ANIMS[EX[el.getAttribute('data-fig')].anim];
      new Fig(el, Object.assign({}, a, { poses: [a.poses[a.poses.length > 1 ? 1 : 0]] }), { still: true });
    });
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
    h += '<div class="title">¡Hola' + name + '!</div>';
    h += '<div class="card streak sm' + (st.cur ? '' : ' off') + '" style="margin-top:12px"><div class="row"><div class="flame">🔥</div><div class="num">' + st.cur + '</div>' +
      '<div class="sp"><b>' + (st.cur === 1 ? 'día seguido' : 'días seguidos') + '</b><div class="small" style="color:var(--st-t);font-weight:700">' + msg + '</div></div>' +
      '<div style="text-align:right"><div class="mut small">Mejor</div><b style="font-size:20px">' + st.best + '</b></div></div>' + weekStrip() + '</div>';
    h += segTabs('home', [['hoy', '⚡ Hoy'], ['avance', '⭐ Avance'], ['habitos', '✅ Hábitos'], ['rutinas', '🏋️ Rutinas']]);
    return h + '<div class="pnl" id="pnl" data-g="home">' + homePanel(pst.home) + '</div>';
  }
  function homePanel(k) {
    var c = homeCtx(), st = c.st, tp = c.tp, id = c.id, h = '';
    if (k === 'hoy') {
      var planTag = tp ? '<span class="chip">📅 Plan · día ' + (tp.i + 1) + '/28</span>' : '';
      if (st.doneToday) {
        h += '<div class="card wcard"><div style="font-size:19px;font-weight:900">Hoy ya entrenaste ✅</div><p class="mut small" style="margin:6px 0 12px">Descansa: los músculos crecen mientras duermes. Si quieres, haz algo suave para tu postura.</p>' +
          '<div class="col"><button class="btn sec" data-a="start" data-v="P">🧍 Postura (2 min)</button><button class="btn sec" data-a="start" data-v="S">🌱 Estirar (6 min)</button></div>' +
          '<div class="mut small" style="margin-top:12px">Siguiente rutina: <b style="color:var(--txt)">' + WORKOUTS[nextId()].name + '</b></div></div>';
      } else if (!id) {
        h += '<div class="card wcard"><div class="row"><div class="big">🛌</div><div><div class="mut small" style="font-weight:800">PLAN · DÍA ' + (tp.i + 1) + '/28</div><div style="font-size:21px;font-weight:900">Descanso activo</div></div></div>' +
          '<p class="mut small" style="margin:10px 0 12px">Hoy toca descansar los músculos. Haz un chequeo de postura de 2 minutos y mantienes tu racha.</p>' +
          '<div class="col"><button class="btn" data-a="start" data-v="P">🧍 Postura (2 min)</button><button class="btn sec" data-a="start" data-v="S">🌱 Estirar</button></div></div>';
      } else {
        var w = rdef(id), steps = build(id), cnt = w.items ? w.items.length : w.slots.length;
        h += '<div class="card wcard"><div class="row"><div class="big">' + w.emoji + '</div><div><div class="mut small" style="font-weight:800">RUTINA DE HOY</div><div style="font-size:21px;font-weight:900">' + w.name + '</div></div></div>' +
          '<div class="row" style="margin:12px 0 4px;flex-wrap:wrap"><span class="chip">⏱ ~' + estMin(steps) + ' min</span><span class="chip">📋 ' + cnt + ' ejercicios</span>' + planTag + (S.settings.nojump ? '<span class="chip">🤫 Sin saltos</span>' : '') + '</div>' +
          '<div class="exl">' + mainList(id).map(function (x) { return '<div class="li"><b>' + x.n + '</b><span>' + x.t + '</span></div>'; }).join('') + '</div>' +
          '<div style="margin-top:14px"><button class="btn" data-a="start" data-v="' + id + '">▶ Empezar</button></div>' +
          '<div class="set" style="border:0;padding:12px 0 0"><div class="sp"><b>🙌 Modo manos libres</b><div class="mut small">La voz cuenta y avanza sola</div></div>' + sw('hands') + '</div></div>';
      }
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
      var hb = S.habits[today()] || { w: 0, p: 0, s: 0, sl: 0 }, hc = habCount(hb);
      h += '<div class="card"><div class="row"><b>✅ Hábitos para crecer</b><div class="sp"></div><span class="mut small">' + hc + '/4 hoy</span></div>' +
        [['w', '💧', 'Agua (8 vasos)'], ['p', '🥩', 'Proteína'], ['s', '☀️', 'Sol 10 min']].map(function (x) {
          return '<button class="hrow' + (hb[x[0]] ? ' on' : '') + (fx.hab === x[0] ? ' bn' : '') + '" data-a="hab" data-v="' + x[0] + '"><span class="e">' + x[1] + '</span><b>' + x[2] + '</b><i class="ck">✓</i></button>';
        }).join('') +
        '<div class="hrow' + (hb.sl >= 8 ? ' on' : '') + '" style="cursor:default"><span class="e">😴</span><b>Sueño</b><span class="sp"></span><button class="stp" data-a="slp" data-v="-1">−</button><b style="min-width:46px;text-align:center">' + (hb.sl ? hb.sl + ' h' : '— h') + '</b><button class="stp" data-a="slp" data-v="1">+</button></div></div>' +
        '<p class="mut small" style="padding:0 4px;line-height:1.5">Completar los 4 hábitos del día da +15 XP. Dormir 8–10 horas ayuda a crecer. 😴</p>';
    } else {
      h += '<div class="grid2">';
      ORDER.forEach(function (r) { h += mini(r, WORKOUTS[r].emoji, WORKOUTS[r].name, 'Rutina ' + r); });
      h += mini('Q5', '⏱', 'Rápida · 5 min', 'Poco tiempo') + mini('Q10', '⏲', 'Rápida · 10 min', 'Cardio + fuerza') +
        mini('P', '🧍', 'Postura', '2 min · racha') + mini('S', '🌱', 'Estiramientos', '6 min · racha') + '</div>';
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
  function exV() {
    return '<div class="title">Ejercicios</div><p class="mut small" style="margin:4px 0 10px">' + Object.keys(EX).length + ' ejercicios con tutorial animado. Desliza para cambiar de categoría.</p>' +
      '<input type="search" id="exq" data-set="exq" placeholder="🔍 Buscar ejercicio…" value="' + esc(exQ) + '" autocomplete="off">' +
      segTabs('ex', PKEYS.ex.map(function (c) { return [c, c]; })) + '<div class="pnl" id="pnl" data-g="ex">' + exPanel(pst.ex) + '</div>';
  }
  function exCard(k) {
    var e = EX[k];
    return '<button class="exc" data-a="ex" data-v="' + k + '"><div class="fig"><svg data-fig="' + k + '"></svg></div><b>' + e.n + '</b><small>' + (e.type === 'time' ? '⏱ Tiempo' : '🔁 Reps') + ' · ' + (LVL_T[e.lv] || '') + (e.grow ? ' · 🌱' : '') + '</small></button>';
  }
  function exPanel(cat) {
    var h = '', n = 0, q = norm(exQ.trim());
    if (q) {
      h = '<div class="exg">';
      Object.keys(EX).forEach(function (k) { var e = EX[k]; if (norm(e.n).indexOf(q) >= 0 || norm(e.m).indexOf(q) >= 0 || norm(e.cat).indexOf(q) >= 0) { h += exCard(k); n++; } });
      return n ? h + '</div>' : '<p class="mut" style="text-align:center;margin-top:30px">No encontré ejercicios con “' + esc(exQ) + '”.</p>';
    }
    h = '<div class="exg">';
    Object.keys(EX).forEach(function (k) { if (EX[k].cat === cat) { h += exCard(k); n++; } });
    return '<div class="mut small" style="margin:0 2px 10px">' + n + ' ejercicios en esta categoría</div>' + h + '</div>';
  }

  function calHTML() {
    var base = new Date(); base.setDate(1); base.setMonth(base.getMonth() + calOff);
    var y = base.getFullYear(), m = base.getMonth(), first = (new Date(y, m, 1).getDay() + 6) % 7, n = new Date(y, m + 1, 0).getDate(), i, c = '';
    DAYS.forEach(function (d) { c += '<div class="h">' + d + '</div>'; });
    for (i = 0; i < first; i++) c += '<div></div>';
    for (i = 1; i <= n; i++) { var k = y + '-' + pad(m + 1) + '-' + pad(i); var rr = S.days[k]; c += '<div class="d' + (rr && rr.w > 0 ? ' done' : rr && rr.freeze ? ' freeze' : '') + (k === today() ? ' today' : '') + '">' + i + '</div>'; }
    return '<div class="row" style="margin-bottom:10px"><button class="btn sec sm" data-a="calp">‹</button><div class="sp" style="text-align:center;font-weight:800">' + MONTHS[m] + ' ' + y + '</div><button class="btn sec sm" data-a="caln">›</button></div><div class="cal">' + c + '</div>';
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
      h += '<div class="badges">' + BADGES.map(function (b) { var ok = b.f(st); return '<div class="badge' + (ok ? '' : ' lock') + '"><span class="e">' + b.e + '</span>' + b.n + '</div>'; }).join('') + '</div>';
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
  function nativeOk(fn) { try { return !!(AND() && AND()[fn]); } catch (e) { return false; } }
  function statsCard() {
    if (!CLOUD_URL) return '';
    return '<div class="card"><div class="set" style="border:0;padding:0"><div class="sp"><b>📊 Estadísticas anónimas</b><div class="mut small" style="line-height:1.45;margin-top:4px">Ayudan a mejorar la app. Se envía un código aleatorio, la versión, tu nivel, racha y nº de entrenamientos. Nunca tu nombre, medidas ni notas. Al apagarlo se borra lo enviado.</div></div>' + sw('stats') + '</div></div>';
  }
  function widgetCard() {
    return '<div class="card"><b>🧩 Widget de racha</b><p class="mut small" style="margin:6px 0 12px;line-height:1.5">Mira tu racha 🔥 en la pantalla de inicio del teléfono y entra con un toque.</p>' +
      (nativeOk('pinWidget') ? '<button class="btn sec sm" data-a="pinw">➕ Añadir a la pantalla de inicio</button>' : '<p class="mut small" style="margin:0">Necesita la última versión del APK.</p>') + '</div>';
  }
  function sw(name) { return '<div class="sw' + (S.settings[name] ? ' on' : '') + '" data-a="tog" data-v="' + name + '"></div>'; }
  /* ---------- AJUSTES: menú con secciones ---------- */
  function setV() { return setSec ? setSection(setSec) : setMenu(); }
  var THEME_N = { blue: 'Azul', green: 'Verde', purple: 'Morado', orange: 'Naranja', pink: 'Rosa' }, MODE_N = { dark: 'Oscuro', light: 'Claro', auto: 'Automático' };
  function setMenu() {
    var s = S.settings, c = cloudCfg();
    var rows = [
      ['prof', '🎯', 'Mi objetivo y nivel', S.profile ? GOALS[S.profile.goal].n + ' · ' + LEVELS[S.profile.level].n : 'Elige tu objetivo'],
      ['train', '🏋️', 'Entrenamiento', 'Meta ' + s.goal + ' días · descanso ' + s.rest + ' s'],
      ['look', '🎨', 'Apariencia', (THEME_N[s.theme] || '') + ' · ' + (MODE_N[s.mode] || '')],
      ['sound', '🔔', 'Sonido y avisos', (s.sound ? 'Sonido' : 'Sin sonido') + (s.voice ? ' · voz' : '') + (s.rem ? ' · recordatorio ' + pad(s.rh) + ':' + pad(s.rm) : '')],
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
        '<div class="card"><label style="margin-top:0">Meta semanal (días por semana)</label>' + seg('goal', [[2, '2'], [3, '3'], [4, '4'], [5, '5'], [6, '6']], s.goal) +
        '<label>Calentamiento</label>' + seg('warm', [['cardio', '🏃 Cardio'], ['suave', '🧘 Suave'], ['none', 'Ninguno']], s.warm) +
        '<label>Estiramiento final</label>' + seg('cool', [['all', 'Todo'], ['legs', 'Piernas'], ['back', 'Espalda'], ['upper', 'Brazos'], ['none', 'Ninguno']], s.cool) + '</div>' +
        '<div class="card"><div class="set"><div class="sp"><b>🙌 Modo manos libres</b><div class="mut small">Cuenta las repeticiones con voz y avanza solo. Ideal con el teléfono apoyado.</div></div>' + sw('hands') + '</div>' +
        '<label>Velocidad al contar</label>' + seg('pace', [[2, '⚡ Rápido (2 s)'], [2.5, '👍 Normal (2,5 s)'], [3.5, '🐢 Lento (3,5 s)']], s.pace) +
        '<div class="set" style="border:0;margin-top:8px"><div class="sp"><b>🤫 Modo sin saltos</b><div class="mut small">Cambia saltos por ejercicios silenciosos</div></div>' + sw('nojump') + '</div></div>';
    } else if (k === 'look') {
      h += '<div class="card"><b>Color de la app</b><div class="swrow">' +
        [['blue', '#4aa8ff', 'Azul'], ['green', '#2fcf8a', 'Verde'], ['purple', '#a78bfa', 'Morado'], ['orange', '#ffa23d', 'Naranja'], ['pink', '#ff6fa8', 'Rosa']].map(function (c) { return '<button class="swt' + (s.theme === c[0] ? ' on' : '') + '" data-a="theme" data-v="' + c[0] + '"><i style="background:' + c[1] + '"></i>' + c[2] + '</button>'; }).join('') +
        '</div></div><div class="card"><b>Modo</b><div class="seg" style="margin-top:10px">' + [['dark', '🌙 Oscuro'], ['light', '☀️ Claro'], ['auto', '📱 Auto']].map(function (m) { return '<button class="' + (s.mode === m[0] ? 'on' : '') + '" data-a="mode" data-v="' + m[0] + '">' + m[1] + '</button>'; }).join('') + '</div></div>';
    } else if (k === 'sound') {
      h += '<div class="card"><div class="set"><div class="sp"><b>🔊 Sonidos</b><div class="mut small">Pitidos al terminar</div></div>' + sw('sound') + '</div>' +
        '<div class="set"><div class="sp"><b>🗣 Voz</b><div class="mut small">Dice el ejercicio y cuenta contigo</div></div>' + sw('voice') + '</div>' +
        '<div class="set" style="border:0"><div class="sp"><b>📳 Vibración</b><div class="mut small">Avisos con vibración</div></div>' + sw('vib') + '</div></div>' +
        '<div class="card"><div class="set"><div class="sp"><b>⏰ Recordatorio diario</b><div class="mut small">Con botones “Empezar” y “En 1 hora”</div></div>' + sw('rem') + '</div>' +
        (s.rem ? '<div style="padding:4px 0 12px"><input type="time" id="rt" data-set="rtime" value="' + pad(s.rh) + ':' + pad(s.rm) + '"></div>' : '') +
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
        '<button class="btn sec" style="margin-top:12px" data-a="tutopen">▶ Ver el tutorial</button>';
    }
    return h;
  }

  function render(anim) {
    var old = $('#view'), top = old ? old.scrollTop : 0;
    destroyFigs();
    var v = tab === 'home' ? homeV() : tab === 'ex' ? exV() : tab === 'food' ? foodV() : tab === 'prog' ? progV() : setV();
    $('#app').innerHTML = '<div class="view' + (anim ? ' anim' : '') + '" id="view">' + v + '</div>' + tabsHTML();
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
    return '<button class="rcard" data-a="fview" data-v="' + id + '"><span class="re">' + r[0] + '</span><span class="rt"><b>' + r[1] + '</b><span>' + r[3] + ' kcal · ' + r[4] + ' g prot · ' + r[5] + ' min' + (S.food.fav[id] ? ' · ❤️' : '') + '</span></span><i class="chev">›</i></button>';
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
    var e = EX[st.ex], isTime = st.type === 'time';
    var kind = st.kind === 'warm' ? 'Calentamiento' : st.kind === 'cool' ? (st.label || 'Estiramiento') : 'Serie ' + st.set + ' de ' + st.sets;
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
    var secs = Math.round((Date.now() - P.t0) / 1000), d = today(), id = P.id, light = isLight(id), isQuick = !!QUICK[id];
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
    P.goalHit = false; P.planDay = false;
    if (weekCount() >= S.settings.goal && !S.goalsHit[wk]) { S.goalsHit[wk] = 1; gain += 50; P.goalHit = true; }
    if (tp && tp.t !== 'R') { gain += 10; P.planDay = true; }
    if (tp && tp.i >= 27) S.planDone = true;
    var up = addXP(gain); P.xp = { gain: gain, up: up };
    save(); syncReminder(); cloudAuto();
    statEvent('workout', { r: /^U\d+/.test(id) ? 'U' : id, s: secs, n: P.sets }); statsPing(true);
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
    o.innerHTML = '<div style="text-align:center;font-size:64px">💪</div><div class="title" style="text-align:center;margin:6px 0 4px">Crece Fit</div>' +
      '<p class="mut" style="text-align:center;line-height:1.45;margin-bottom:18px">Rutinas sin equipo, con tutoriales animados, temporizadores y tu racha diaria.</p>' +
      '<label>¿Cómo te llamas? (opcional)</label><input type="text" id="obn" maxlength="20" placeholder="Tu nombre">' +
      '<label>Tu estatura actual en cm (opcional)</label><input type="number" id="obh" inputmode="decimal" placeholder="Ej. 168">' +
      '<label>¿Qué quieres lograr?</label>' + goalOpts() + '<label>Tu nivel</label>' + lvlOpts() +
      '<div class="note">🌱 Sobre la altura: depende mucho de la genética, pero dormir, comer bien, buena postura y ejercicio te ayudan a llegar a tu máximo.</div>' +
      '<button class="btn" style="margin-top:20px" data-a="obstart">¡Empezar!</button>';
    document.body.appendChild(o);
  }

  /* hábitos completos = +15 XP (una vez por día) */
  function habDone(h) {
    if (habCount(h) === 4 && !h.xp) { h.xp = 1; var up = addXP(15); toast('✅ ¡Hábitos completos! +15 XP' + (up ? ' · ⭐ nivel ' + up : '')); }
  }

  /* ---------- acciones ---------- */
  function setBool(k) { S.settings[k] = !S.settings[k]; save(); }
  document.addEventListener('click', function (ev) {
    if (ev.target.id === 'sheet') { sheetClose(); return; }
    var t = ev.target.closest('[data-a]'); if (!t) return;
    var a = t.getAttribute('data-a'), v = t.getAttribute('data-v');
    switch (a) {
      case 'tab': if (v === 'set' && tab !== 'set') setSec = null; tab = v; fx.tab = true; render(true); fx.tab = false; break;
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
      case 'theme': S.settings.theme = v; save(); applyTheme(); render(); break;
      case 'mode': S.settings.mode = v; save(); applyTheme(); render(); break;
      case 'tog':
        setBool(v);
        if (v === 'voice' && S.settings.voice) say('Voz activada');
        if (v === 'stats') { if (S.settings.stats) { statsPing(true); } else statsDelete(); }
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
      case 'opt': var kv = v.split(':'); S.settings[kv[0]] = isNaN(kv[1]) ? kv[1] : +kv[1]; save(); render(); break;
      case 'hab':
        var hh2 = hab(); hh2[v] = hh2[v] ? 0 : 1; habDone(hh2); save(); fx.hab = v; render(); fx.hab = null; break;
      case 'slp':
        var hs = hab(); hs.sl = Math.max(3, Math.min(12, (hs.sl || 7.5) + 0.5 * (+v))); habDone(hs); save(); render(); break;
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
        try { if (AND().pinWidget()) toast('Elige dónde poner el widget 👆'); else toast('Mantén pulsado un espacio vacío de tu pantalla → Widgets → Crece Fit'); } catch (e) { }
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
        $('#upd').innerHTML = '<h3 id="uph">Actualizando…</h3><div class="pbar"><i id="upi"></i></div><div class="upct" id="upt">0%</div><p class="mut small" id="upn" style="text-align:center;margin-top:6px">No cierres la app</p>';
        try { if (AND() && AND().startUpdate) AND().startUpdate(); else { upd.busy = false; dialogClose(); location.reload(); } } catch (e) { window.__updateError(); }
        break;
      case 'mno': dialogClose(); break;
      case 'myes': var f = dialog.fn; dialogClose(); if (f) f(); break;
      case 'oblvl': obLvl = +v; Array.prototype.forEach.call(document.querySelectorAll('.lopt'), function (b) { b.classList.toggle('on', b.getAttribute('data-v') === v); }); break;
      case 'obgoal': obGoal = v; Array.prototype.forEach.call(document.querySelectorAll('.gopt'), function (b) { b.classList.toggle('on', b.getAttribute('data-v') === v); }); break;
      case 'profopen': profileSheet(); break;
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
  var SITE = 'https://crecefit.crecefit.workers.dev/descargar/';
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
    if (t) t.textContent = p + '%';
    if (p >= 100 && h) { h.textContent = '¡Listo! ✅ Cerrando la app…'; var n = $('#upn'); if (n) n.textContent = 'La próxima vez que entres ya estará actualizada'; }
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
  load(); applyProgram(); autoFreezeMsg(); applyTheme(); render(true); syncReminder();
  setTimeout(function () { jsCheck(false); }, 2500);
  setTimeout(cloudAuto, 6000);
  setTimeout(statsStart, 4500);
  setTimeout(askStats, 9000);
  if (!S.setup) onboarding();
  setTimeout(function () { var sp = $('#splash'); if (sp) { sp.classList.add('out'); setTimeout(function () { sp.remove(); }, 500); } }, 900);
})();
