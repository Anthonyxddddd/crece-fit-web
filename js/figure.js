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

  function draw(anim, p, J) {
    var front = anim.view === 'front';
    var C = g.FigColors, far = C.far, near = C.near, skin = '#ffd9b3', dark = C.dark;
    var s = '';
    // suelo y sombra
    s += '<ellipse cx="' + J.p[0].toFixed(1) + '" cy="' + (GROUND + 2) + '" rx="62" ry="4" fill="' + C.shadow + '"/>';
    s += '<line x1="14" y1="' + GROUND + '" x2="226" y2="' + GROUND + '" stroke="' + C.ground + '" stroke-width="2" stroke-linecap="round"/>';
    if (anim.wall != null) {
      s += '<rect x="' + anim.wall + '" y="-30" width="9" height="' + (GROUND + 30) + '" fill="' + C.wall + '"/>';
      s += '<line x1="' + (anim.wallSide === 'l' ? anim.wall + 9 : anim.wall) + '" y1="-30" x2="' + (anim.wallSide === 'l' ? anim.wall + 9 : anim.wall) + '" y2="' + GROUND + '" stroke="' + C.wallLine + '" stroke-width="2"/>';
    }
    // extremidades lejanas
    s += limb(J.s2, J.e2, J.w2, 6.4, far);
    s += limb(J.h2, J.k2, J.f2, 7.4, far);
    if (!front) s += line(J.f2, J.t2, 6, far);
    // torso (curva)
    var d = [J.n[0] - J.p[0], J.n[1] - J.p[1]], len = Math.sqrt(d[0] * d[0] + d[1] * d[1]) || 1;
    var cx = (J.p[0] + J.n[0]) / 2 + (-d[1] / len) * p.tb, cy = (J.p[1] + J.n[1]) / 2 + (d[0] / len) * p.tb;
    s += '<path d="M' + J.p[0].toFixed(1) + ',' + J.p[1].toFixed(1) + ' Q' + cx.toFixed(1) + ',' + cy.toFixed(1) + ' ' + J.n[0].toFixed(1) + ',' + J.n[1].toFixed(1) +
      '" fill="none" stroke="' + dark + '" stroke-width="' + (front ? 15 : 12) + '" stroke-linecap="round"/>';
    if (front) { s += line(J.s1, J.s2, 7, dark); s += line(J.h1, J.h2, 7, dark); }
    // extremidades cercanas
    s += limb(J.h1, J.k1, J.f1, 8, near);
    if (!front) s += line(J.f1, J.t1, 6.4, near);
    s += limb(J.s1, J.e1, J.w1, 6.8, near);
    s += '<circle cx="' + J.w1[0].toFixed(1) + '" cy="' + J.w1[1].toFixed(1) + '" r="3.6" fill="' + skin + '"/>';
    s += '<circle cx="' + J.w2[0].toFixed(1) + '" cy="' + J.w2[1].toFixed(1) + '" r="3.2" fill="#b9b2ad" opacity=".9"/>';
    // cabeza
    s += '<circle cx="' + J.h[0].toFixed(1) + '" cy="' + J.h[1].toFixed(1) + '" r="9.5" fill="' + skin + '" stroke="#e8b987" stroke-width="1.5"/>';
    // carita (mira hacia donde apunta la cara)
    var fa = (p.hd > -180 && p.hd < 0 || p.hd >= 180) ? 1 : 1;
    var ex = front ? 0 : 3.6, ey = -1;
    var hx = J.h[0], hy = J.h[1];
    var ang = (p.hd + 90) * rad; // rotación de la cabeza respecto a "arriba"
    function rot(x, y) { return [hx + x * Math.cos(ang) - y * Math.sin(ang), hy + x * Math.sin(ang) + y * Math.cos(ang)]; }
    var e1, e2;
    if (front) { e1 = rot(-3.2, -1); e2 = rot(3.2, -1); } else { e1 = rot(ex, ey); e2 = null; }
    s += '<circle cx="' + e1[0].toFixed(1) + '" cy="' + e1[1].toFixed(1) + '" r="1.5" fill="#33291f"/>';
    if (e2) s += '<circle cx="' + e2[0].toFixed(1) + '" cy="' + e2[1].toFixed(1) + '" r="1.5" fill="#33291f"/>';
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
    svg.setAttribute('viewBox', '0 -34 240 206');
    this.render(this.poses[0]);
    if (!opt.still) this.start();
  }
  Fig.prototype.render = function (p) {
    if (this.anim.face) { this.svg.innerHTML = drawFace(this.anim, p); return; }
    var J = place(this.anim, p);
    this.svg.innerHTML = draw(this.anim, p, J);
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
