/* Muñequito animado: esqueleto 2D con cinemática directa (ángulos) */
(function (g) {
  var L = { T: 40, H: 13, UA: 20, FA: 18, TH: 27, SH: 26, FT: 9 };
  var GROUND = 146, R = 4.2;
  var DEF = { t: -90, hd: -90, a1: [85, 85], a2: [95, 95], l1: [90, 90], l2: [90, 90], ft1: 0, ft2: 0, tb: 0, lift: 0 };
  var rad = Math.PI / 180;

  function P(o) {
    var r = {}, k;
    for (k in DEF) r[k] = DEF[k];
    for (k in o) r[k] = o[k];
    return r;
  }
  function add(a, len, ang) { return [a[0] + len * Math.cos(ang * rad), a[1] + len * Math.sin(ang * rad)]; }

  // calcula articulaciones con pelvis en (0,0)
  function joints(p, front) {
    var sw = front ? 8 : 0, hw = front ? 5 : 0;
    var J = {};
    J.p = [0, 0];
    J.n = add(J.p, L.T, p.t);
    J.h = add(J.n, L.H, p.hd);
    var s1 = [J.n[0] - sw, J.n[1]], s2 = [J.n[0] + sw, J.n[1]];
    J.s1 = s1; J.s2 = s2;
    J.e1 = add(s1, L.UA, p.a1[0]); J.w1 = add(J.e1, L.FA, p.a1[1]);
    J.e2 = add(s2, L.UA, p.a2[0]); J.w2 = add(J.e2, L.FA, p.a2[1]);
    var h1 = [-hw, 0], h2 = [hw, 0];
    J.h1 = h1; J.h2 = h2;
    J.k1 = add(h1, L.TH, p.l1[0]); J.f1 = add(J.k1, L.SH, p.l1[1]);
    J.k2 = add(h2, L.TH, p.l2[0]); J.f2 = add(J.k2, L.SH, p.l2[1]);
    J.t1 = add(J.f1, L.FT, p.ft1); J.t2 = add(J.f2, L.FT, p.ft2);
    return J;
  }
  function maxY(J, feet) {
    var m = -1e9, k, keys = ['h', 'n', 'p', 'e1', 'w1', 'e2', 'w2', 'k1', 'f1', 'k2', 'f2'];
    if (feet) keys.push('t1', 't2');
    for (k = 0; k < keys.length; k++) {
      var y = J[keys[k]][1] + (keys[k] === 'h' ? 5.3 : 0);
      if (y > m) m = y;
    }
    return m;
  }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function mix(a, b, t) {
    var r = {}, k;
    for (k in a) {
      if (a[k] instanceof Array) r[k] = [lerp(a[k][0], b[k][0], t), lerp(a[k][1], b[k][1], t)];
      else r[k] = lerp(a[k], b[k], t);
    }
    return r;
  }
  function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  // pose interpolada + posicionada (coordenadas del SVG)
  function place(anim, p) {
    var front = anim.view === 'front', feet = !front;
    var J = joints(p, front);
    var dy = GROUND - R - maxY(J, feet) - p.lift;
    var fx = anim.fix || 'p';
    var dx = (anim.fixX == null ? 120 : anim.fixX) - J[fx][0];
    var k, O = {};
    for (k in J) O[k] = [J[k][0] + dx, J[k][1] + dy];
    return O;
  }

  function line(a, b, w, c) {
    return '<line x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) +
      '" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round"/>';
  }
  function limb(a, b, c, w, col) {
    return '<polyline points="' + a.map(function (v) { return v.toFixed(1); }).join(',') + ' ' +
      b.map(function (v) { return v.toFixed(1); }).join(',') + ' ' + c.map(function (v) { return v.toFixed(1); }).join(',') +
      '" fill="none" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>';
  }

  function draw(anim, p, J, bare) {
    var front = anim.view === 'front';
    var C = g.FigColors, far = C.far, near = C.near, skin = '#ffd9b3', dark = C.dark;
    var s = '';
    // suelo y sombra
    var vb = anim._vb || [0, -34, 240, 206];
    if (!bare) {
      s += '<ellipse cx="' + J.p[0].toFixed(1) + '" cy="' + (GROUND + 2) + '" rx="62" ry="4" fill="' + C.shadow + '"/>';
      s += '<line x1="' + (vb[0] + 6).toFixed(0) + '" y1="' + GROUND + '" x2="' + (vb[0] + vb[2] - 6).toFixed(0) + '" y2="' + GROUND + '" stroke="' + C.ground + '" stroke-width="2.6" stroke-linecap="round"/>';
    }
    if (anim.wall != null && !bare) {
      s += '<rect x="' + anim.wall + '" y="-30" width="9" height="' + (GROUND + 30) + '" fill="' + C.wall + '"/>';
      s += '<line x1="' + (anim.wallSide === 'l' ? anim.wall + 9 : anim.wall) + '" y1="-30" x2="' + (anim.wallSide === 'l' ? anim.wall + 9 : anim.wall) + '" y2="' + GROUND + '" stroke="' + C.wallLine + '" stroke-width="2"/>';
    }
    // extremidades lejanas
    s += limb(J.s2, J.e2, J.w2, 8.2, far);
    s += limb(J.h2, J.k2, J.f2, 9.4, far);
    if (!front) s += line(J.f2, J.t2, 7.6, far);
    // torso (curva)
    var d = [J.n[0] - J.p[0], J.n[1] - J.p[1]], len = Math.sqrt(d[0] * d[0] + d[1] * d[1]) || 1;
    var cx = (J.p[0] + J.n[0]) / 2 + (-d[1] / len) * p.tb, cy = (J.p[1] + J.n[1]) / 2 + (d[0] / len) * p.tb;
    s += '<path d="M' + J.p[0].toFixed(1) + ',' + J.p[1].toFixed(1) + ' Q' + cx.toFixed(1) + ',' + cy.toFixed(1) + ' ' + J.n[0].toFixed(1) + ',' + J.n[1].toFixed(1) +
      '" fill="none" stroke="' + dark + '" stroke-width="' + (front ? 17 : 14.5) + '" stroke-linecap="round"/>';
    if (front) { s += line(J.s1, J.s2, 8.4, dark); s += line(J.h1, J.h2, 8.4, dark); }
    // extremidades cercanas
    s += limb(J.h1, J.k1, J.f1, 10, near);
    if (!front) s += line(J.f1, J.t1, 8, near);
    s += limb(J.s1, J.e1, J.w1, 8.4, near);
    s += '<circle cx="' + J.w1[0].toFixed(1) + '" cy="' + J.w1[1].toFixed(1) + '" r="4.6" fill="' + skin + '"/>';
    s += '<circle cx="' + J.w2[0].toFixed(1) + '" cy="' + J.w2[1].toFixed(1) + '" r="4" fill="#b9b2ad" opacity=".9"/>';
    // cabeza
    s += '<circle cx="' + J.h[0].toFixed(1) + '" cy="' + J.h[1].toFixed(1) + '" r="11" fill="' + skin + '" stroke="#e8b987" stroke-width="1.5"/>';
    // carita (mira hacia donde apunta la cara)
    var fa = (p.hd > -180 && p.hd < 0 || p.hd >= 180) ? 1 : 1;
    var ex = front ? 0 : 3.6, ey = -1;
    var hx = J.h[0], hy = J.h[1];
    var ang = (p.hd + 90) * rad; // rotación de la cabeza respecto a "arriba"
    function rot(x, y) { return [hx + x * Math.cos(ang) - y * Math.sin(ang), hy + x * Math.sin(ang) + y * Math.cos(ang)]; }
    var e1, e2;
    if (front) { e1 = rot(-3.2, -1); e2 = rot(3.2, -1); } else { e1 = rot(ex, ey); e2 = null; }
    s += '<circle cx="' + e1[0].toFixed(1) + '" cy="' + e1[1].toFixed(1) + '" r="1.8" fill="#33291f"/>';
    if (e2) s += '<circle cx="' + e2[0].toFixed(1) + '" cy="' + e2[1].toFixed(1) + '" r="1.8" fill="#33291f"/>';
    return s;
  }


  /* ---------- Cara (ejercicios faciales) ---------- */
  var FDEF = { mo: 0, sm: 0, pk: 0, cl: 0, cr: 0, su: 0, ey: 1, br: 0, tl: 0, jx: 0, cu: 0, tg: 0, hx: 0 };
  function FP(o) { var r = {}, k; for (k in FDEF) r[k] = FDEF[k]; for (k in o) r[k] = o[k]; return r; }
  function f1(n) { return n.toFixed(1); }
  function drawFace(anim, p) {
    var C = g.FigColors, skin = '#ffd9b3', edge = '#e8b987', ink = '#4a3526', hair = '#3b2a20';
    var s = '', tl = p.tl;
    s += '<ellipse cx="120" cy="182" rx="62" ry="4" fill="' + C.shadow + '"/>';
    if (anim.view === 'side') {
      // perfil: cuello fijo, la cabeza se mueve hacia delante/atrás
      var hx = p.hx, cx = 120 + hx, cy = 62;
      s += '<path d="M100,175 C100,150 104,128 108,112 L136,112 C142,130 146,152 150,175 Z" fill="' + C.dark + '" opacity=".9"/>';
      s += '<g transform="rotate(' + f1(tl) + ' 122 112)">';
      s += '<circle cx="' + f1(cx) + '" cy="' + cy + '" r="40" fill="' + skin + '" stroke="' + edge + '" stroke-width="2.5"/>';
      s += '<path d="M' + f1(cx + 38) + ',' + (cy - 2) + ' q10,8 0,14 q4,2 2,6" fill="' + skin + '" stroke="' + edge + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>';
      s += '<path d="M' + f1(cx - 40) + ',' + (cy - 6) + ' A40,40 0 0 1 ' + f1(cx + 24) + ',' + (cy - 36) + ' L' + f1(cx - 10) + ',' + (cy - 8) + ' Z" fill="' + hair + '"/>';
      s += '<circle cx="' + f1(cx + 18) + '" cy="' + (cy - 4) + '" r="2.6" fill="' + ink + '"/>';
      s += '<path d="M' + f1(cx + 12) + ',' + (cy + 22) + ' h' + f1(14 - p.pk * 6) + '" stroke="' + ink + '" stroke-width="2.5" stroke-linecap="round"/>';
      s += '<ellipse cx="' + f1(cx - 14) + '" cy="' + (cy + 4) + '" rx="5" ry="8" fill="' + edge + '" opacity=".6"/>';
      s += '</g>';
      s += '<path d="M60,176 Q120,150 180,176" fill="none" stroke="' + C.dark + '" stroke-width="12" stroke-linecap="round"/>';
      return s;
    }
    var by = p.cu * -9, sx = p.jx;
    // cuello y hombros
    s += '<path d="M96,118 L92,168 M144,118 L148,168" stroke="' + edge + '" stroke-width="3" stroke-linecap="round" fill="none"/>';
    s += '<path d="M40,182 Q120,150 200,182" fill="none" stroke="' + C.dark + '" stroke-width="16" stroke-linecap="round"/>';
    s += '<g transform="rotate(' + f1(tl) + ' 120 150)">';
    var jaw = 100 + p.mo * 10, jw = 31 - p.su * 5;
    s += '<ellipse cx="120" cy="64" rx="47" ry="56" fill="none" stroke="' + edge + '" stroke-width="3"/>';
    s += '<ellipse cx="' + f1(120 + sx * 0.6) + '" cy="' + f1(jaw - 4) + '" rx="' + f1(jw) + '" ry="20" fill="none" stroke="' + edge + '" stroke-width="3"/>';
    s += '<ellipse cx="120" cy="64" rx="47" ry="56" fill="' + skin + '"/>';
    s += '<ellipse cx="' + f1(120 + sx * 0.6) + '" cy="' + f1(jaw - 4) + '" rx="' + f1(jw) + '" ry="20" fill="' + skin + '"/>';
    s += '<path d="M73,52 A47,50 0 0 1 167,52 Q150,28 120,30 Q90,28 73,52 Z" fill="' + hair + '"/>';
    s += '<g transform="translate(' + f1(sx * 0.8) + ',' + f1(by) + ')">';
    // mejillas
    var pl = p.cl, pr = p.cr;
    if (pl > 0.02) s += '<circle cx="' + f1(94 - pl * 3) + '" cy="82" r="' + f1(9 + pl * 14) + '" fill="' + skin + '" stroke="' + edge + '" stroke-width="2.5"/><circle cx="' + f1(94 - pl * 3) + '" cy="82" r="' + f1(8 + pl * 13) + '" fill="' + skin + '"/>';
    if (pr > 0.02) s += '<circle cx="' + f1(146 + pr * 3) + '" cy="82" r="' + f1(9 + pr * 14) + '" fill="' + skin + '" stroke="' + edge + '" stroke-width="2.5"/><circle cx="' + f1(146 + pr * 3) + '" cy="82" r="' + f1(8 + pr * 13) + '" fill="' + skin + '"/>';
    if (p.su > 0.02) s += '<ellipse cx="93" cy="84" rx="' + f1(4 + p.su * 6) + '" ry="' + f1(8 + p.su * 8) + '" fill="#000" opacity="' + f1(p.su * 0.16) + '"/><ellipse cx="147" cy="84" rx="' + f1(4 + p.su * 6) + '" ry="' + f1(8 + p.su * 8) + '" fill="#000" opacity="' + f1(p.su * 0.16) + '"/>';
    // cejas y ojos
    var bz = 44 - p.br * 7, ey = 5 * p.ey;
    s += '<path d="M91,' + f1(bz + 1) + ' Q103,' + f1(bz - 3) + ' 114,' + f1(bz + 1) + ' M126,' + f1(bz + 1) + ' Q137,' + f1(bz - 3) + ' 149,' + f1(bz + 1) + '" stroke="' + ink + '" stroke-width="3" fill="none" stroke-linecap="round"/>';
    if (ey < 0.8) s += '<path d="M97,58 q6,-3 12,0 M131,58 q6,-3 12,0" stroke="' + ink + '" stroke-width="3" fill="none" stroke-linecap="round"/>';
    else s += '<ellipse cx="103" cy="58" rx="5.5" ry="' + f1(ey) + '" fill="#fff" stroke="' + ink + '" stroke-width="1.5"/><ellipse cx="137" cy="58" rx="5.5" ry="' + f1(ey) + '" fill="#fff" stroke="' + ink + '" stroke-width="1.5"/><circle cx="103" cy="58" r="2.6" fill="' + ink + '"/><circle cx="137" cy="58" r="2.6" fill="' + ink + '"/>';
    s += '<path d="M120,62 q-5,14 0,17 q4,1 6,-1" stroke="' + edge + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
    // boca
    var my = 98 - p.sm * 2, mw = 17 + p.sm * 9 - p.pk * 11 - p.su * 5, op = p.mo * 15;
    if (p.pk > 0.4 && op < 2) {
      s += '<ellipse cx="120" cy="' + f1(my) + '" rx="' + f1(4 + p.pk * 2) + '" ry="' + f1(3 + p.pk * 3) + '" fill="#d6736f" stroke="' + ink + '" stroke-width="1.5"/>';
    } else if (op > 1.5) {
      s += '<ellipse cx="120" cy="' + f1(my + op / 2 - 2) + '" rx="' + f1(mw * 0.8) + '" ry="' + f1(op / 2 + 1) + '" fill="#6b2a2e" stroke="' + ink + '" stroke-width="2"/>';
      if (p.tg > 0.1) s += '<ellipse cx="120" cy="' + f1(my + op - 1 + p.tg * 6) + '" rx="' + f1(7 + p.tg * 3) + '" ry="' + f1(4 + p.tg * 9) + '" fill="#f08a95" stroke="' + ink + '" stroke-width="1.5"/>';
    } else {
      s += '<path d="M' + f1(120 - mw) + ',' + f1(my) + ' Q120,' + f1(my + 4 + p.sm * 9) + ' ' + f1(120 + mw) + ',' + f1(my) + '" fill="none" stroke="' + ink + '" stroke-width="3" stroke-linecap="round"/>';
      if (p.sm > 0.6) s += '<path d="M' + f1(120 - mw - 2) + ',' + f1(my - 2) + ' q-4,-3 -7,-1 M' + f1(120 + mw + 2) + ',' + f1(my - 2) + ' q4,-3 7,-1" stroke="' + edge + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
    }
    s += '</g></g>';
    return s;
  }

  function Fig(svg, anim, opt) {
    opt = opt || {};
    this.svg = svg; this.anim = anim; this.i = 0; this.stop = false; this.speed = opt.speed || 1;
    var mk = anim.face ? FP : P; this.poses = anim.poses.map(function (x) { return mk(x); });
    this.t0 = 0; this.phase = 0;
    if (!anim.face) this.analyze();
    svg.setAttribute('viewBox', anim.face ? '0 -34 240 206' : anim._vb.join(' '));
    this.render(this.poses[0]);
    if (!opt.still) this.start();
  }
  // encuadre automático (la figura llena el recuadro), pose fantasma del extremo opuesto y trayectoria del movimiento
  var KEYS = ['h', 'n', 'p', 'e1', 'w1', 'e2', 'w2', 'k1', 'f1', 'k2', 'f2', 't1', 't2'];
  Fig.prototype.analyze = function () {
    var anim = this.anim, self = this;
    if (anim._vb) return;
    var Js = this.poses.map(function (q) { return place(anim, q); });
    var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    Js.forEach(function (J) { KEYS.forEach(function (k) { var v = J[k]; if (v[0] < x0) x0 = v[0]; if (v[0] > x1) x1 = v[0]; if (v[1] < y0) y0 = v[1]; if (v[1] > y1) y1 = v[1]; }); });
    if (anim.wall != null) { x0 = Math.min(x0, anim.wall - 4); x1 = Math.max(x1, anim.wall + 13); }
    var pad = 20, w = x1 - x0 + pad * 2, h = (Math.max(y1, GROUND) - y0) + pad * 2 + 6, ar = 240 / 206;
    if (w / h < ar) w = h * ar; else h = w / ar;
    if (w < 150) { w = 150; h = w / ar; }
    var cx = (x0 + x1) / 2, bottom = Math.max(y1, GROUND) + pad * 0.7 + 4;
    anim._vb = [+(cx - w / 2).toFixed(1), +(bottom - h).toFixed(1), +w.toFixed(1), +h.toFixed(1)];
    // pose más lejana a la primera (rango del movimiento) y articulación que más viaja
    var best = 0, bd = -1, i;
    for (i = 1; i < Js.length; i++) { var dd = 0; KEYS.forEach(function (k) { dd += Math.abs(Js[i][k][0] - Js[0][k][0]) + Math.abs(Js[i][k][1] - Js[0][k][1]); }); if (dd > bd) { bd = dd; best = i; } }
    anim._ghost = best;
    var mk = null, md = 0, W = { p: 1.3, h: 1.15, f1: 1, t1: 1, k1: 1, w1: 0.8, e1: 0.6, w2: 0.7, f2: 0.7, k2: 0.7 };
    Object.keys(W).forEach(function (k) { var d = Math.hypot(Js[best][k][0] - Js[0][k][0], Js[best][k][1] - Js[0][k][1]); if (d * W[k] > md + 1e-6) { md = d * W[k]; mk = k; } });
    anim._trail = md >= 14 && best > 0 ? { k: mk, a: Js[0][mk], b: Js[best][mk] } : null;
  };
  function trailSvg(t, s) {
    if (!t) return '';
    var ax = t.a[0], ay = t.a[1], bx = t.b[0], by = t.b[1], mx = (ax + bx) / 2, my = (ay + by) / 2, dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1;
    var qx = mx - dy / L * L * 0.22, qy = my + dx / L * L * 0.22;
    var ang = Math.atan2(by - qy, bx - qx), hs = 7;
    var h1 = [bx - hs * Math.cos(ang - 0.45), by - hs * Math.sin(ang - 0.45)], h2 = [bx - hs * Math.cos(ang + 0.45), by - hs * Math.sin(ang + 0.45)];
    return '<g opacity=".95"><path d="M' + ax.toFixed(1) + ',' + ay.toFixed(1) + ' Q' + qx.toFixed(1) + ',' + qy.toFixed(1) + ' ' + bx.toFixed(1) + ',' + by.toFixed(1) + '" fill="none" stroke="#ffb04a" stroke-width="2.6" stroke-dasharray="1 5.5" stroke-linecap="round"/>' +
      '<polyline points="' + h1[0].toFixed(1) + ',' + h1[1].toFixed(1) + ' ' + bx.toFixed(1) + ',' + by.toFixed(1) + ' ' + h2[0].toFixed(1) + ',' + h2[1].toFixed(1) + '" fill="none" stroke="#ffb04a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>';
  }
  Fig.prototype.render = function (p) {
    if (this.anim.face) { this.svg.innerHTML = drawFace(this.anim, p); return; }
    var a = this.anim, J = place(a, p), s = '';
    if (a._ghost > 0) {
      var gp = this.poses[0], gq = this.poses[a._ghost];
      // fantasma = la pose del otro extremo (la que está más lejos de la actual)
      var d0 = 0, d1 = 0, k;
      for (k in p) { if (p[k] instanceof Array) { d0 += Math.abs(p[k][0] - gp[k][0]) + Math.abs(p[k][1] - gp[k][1]); d1 += Math.abs(p[k][0] - gq[k][0]) + Math.abs(p[k][1] - gq[k][1]); } else { d0 += Math.abs(p[k] - gp[k]); d1 += Math.abs(p[k] - gq[k]); } }
      var other = d0 > d1 ? gp : gq;
      s += '<g opacity=".22">' + draw(a, other, place(a, other), true) + '</g>';
    }
    s += draw(a, p, J);
    s += trailSvg(a._trail);
    this.svg.innerHTML = s;
  };
  Fig.prototype.start = function () {
    var self = this, n = this.poses.length, anim = this.anim;
    var seg = 0, t0 = performance.now(), state = 'move';
    function dur(i) { var q = anim.poses[i]; return (q.d || 900) / self.speed; }
    function hold(i) { var q = anim.poses[i]; return (q.h == null ? 150 : q.h) / self.speed; }
    function frame(now) {
      if (self.stop || !self.svg.isConnected) { return; }
      var a = self.poses[seg % n], b = self.poses[(seg + 1) % n];
      var el = now - t0, p, still = false;
      var d = dur((seg + 1) % n), h = hold((seg + 1) % n);
      if (el < d) p = mix(a, b, ease(el / d));
      else { p = b; still = true; if (el > d + h) { seg = (seg + 1) % n; t0 = now; still = false; } }
      // ahorro: ~40 fps al moverse y sin redibujar mientras la figura está quieta
      if (!(still && self.held === seg) && now - (self.last || 0) >= 24) { self.render(p); self.last = now; self.held = still ? seg : -1; }
      self.raf = requestAnimationFrame(frame);
    }
    this.raf = requestAnimationFrame(frame);
  };
  Fig.prototype.destroy = function () { this.stop = true; if (this.raf) cancelAnimationFrame(this.raf); };

  g.FigColors = g.FigColors || { near: '#4aa8ff', dark: '#2b7fe0', far: '#6f7bb5', ground: '#39406b', wall: '#2a3158', wallLine: '#5d68a8', shadow: 'rgba(0,0,0,.28)' };
  g.Fig = Fig; g.FigP = P; g.FigL = L; g.FigJoints = joints; g.FigPlace = place; g.FigGround = GROUND;
})(typeof window !== 'undefined' ? window : globalThis);
