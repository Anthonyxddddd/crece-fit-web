/* Datos: animaciones, ejercicios, cadenas de progresión y rutinas */
var ANIMS = {};
var SQ_DOWN = { t: -55, hd: -70, a1: [0, 0], a2: [5, 5], l1: [10, 100], l2: [14, 98] };
var PLANK_HI = { t: -18.4, hd: -26, a1: [90, 90], a2: [90, 90], l1: [161.6, 161.6], l2: [161.6, 161.6], ft1: 75, ft2: 75 };
var PUSH_DN = { t: -8.3, hd: -16, a1: [140.5, 31.3], a2: [140.5, 31.3], l1: [171.7, 171.7], l2: [171.7, 171.7], ft1: 75, ft2: 75 };
function X(o, d, h) { var r = {}, k; for (k in o) r[k] = o[k]; if (d != null) r.d = d; if (h != null) r.h = h; return r; }

ANIMS.squat = { view: 'side', fix: 'f1', fixX: 125, poses: [{ d: 1100, h: 500 }, X(SQ_DOWN, 1100, 500)] };
ANIMS.jumpsquat = { view: 'side', fix: 'f1', fixX: 125, poses: [X(SQ_DOWN, 650, 80),
  { t: -90, hd: -90, a1: [-85, -85], a2: [-80, -80], l1: [92, 92], l2: [88, 88], ft1: 60, ft2: 60, lift: 15, d: 280, h: 60 }] };
ANIMS.jump = { view: 'side', fix: 'f1', fixX: 125, poses: [
  { t: -70, hd: -80, a1: [120, 110], a2: [115, 110], l1: [35, 105], l2: [38, 105], d: 600, h: 150 },
  { t: -92, hd: -92, a1: [-80, -80], a2: [-85, -85], l1: [91, 91], l2: [89, 89], ft1: 60, ft2: 60, lift: 16, d: 300, h: 80 }] };
ANIMS.lunge = { view: 'side', fix: 'p', fixX: 120, poses: [{ d: 700, h: 200 },
  { t: -88, hd: -88, l1: [8, 92], l2: [115, 190], ft2: 50, d: 900, h: 350 }, { d: 700, h: 200 },
  { t: -88, hd: -88, l2: [8, 92], l1: [115, 190], ft1: 50, d: 900, h: 350 }] };
ANIMS.wallsit = { view: 'side', fix: 'p', fixX: 108, wall: 92, wallSide: 'l', poses: [
  { a1: [85, 85], a2: [95, 95], d: 900, h: 300 },
  { a1: [20, 20], a2: [10, 10], l1: [0, 90], l2: [3, 90], d: 1400, h: 1200 },
  { a1: [25, 22], a2: [14, 12], l1: [0, 90], l2: [3, 90], tb: 1.5, d: 1300, h: 800 }] };
ANIMS.calf = { view: 'side', fix: 't1', fixX: 125, poses: [{ d: 700, h: 400 }, { ft1: 62, ft2: 62, a1: [80, 80], a2: [85, 85], d: 700, h: 500 }] };
ANIMS.bridge = { view: 'side', fix: 'f1', fixX: 140, poses: [
  { t: 180, hd: 204, a1: [0, 0], a2: [0, 0], l1: [-55, 58], l2: [-50, 62], d: 1000, h: 400 },
  { t: 141, hd: 204, a1: [0, 0], a2: [0, 0], l1: [0, 74], l2: [3, 77], d: 1000, h: 700 }] };
ANIMS.highknees = { view: 'side', fix: 'p', fixX: 120, poses: [
  { t: -92, hd: -92, a1: [140, 100], a2: [40, -60], l1: [5, 95], l2: [90, 90], d: 260, h: 0 },
  { t: -92, hd: -92, a1: [40, -60], a2: [140, 100], l2: [5, 95], l1: [90, 90], d: 260, h: 0 }] };
ANIMS.jacks = { view: 'front', fix: 'p', fixX: 120, poses: [
  { a1: [100, 100], a2: [80, 80], l1: [93, 93], l2: [87, 87], d: 380, h: 80 },
  { a1: [-150, -130], a2: [-30, -50], l1: [118, 112], l2: [62, 68], lift: 9, d: 380, h: 80 }] };
ANIMS.wallpush = { view: 'side', fix: 'f1', fixX: 72, wall: 146, wallSide: 'r', poses: [
  { t: -70, hd: -78, a1: [0, 0], a2: [3, 3], l1: [110, 110], l2: [110, 110], d: 1000, h: 400 },
  { t: -48, hd: -56, a1: [110, -20], a2: [112, -18], l1: [132, 132], l2: [132, 132], d: 1000, h: 400 }] };
ANIMS.kneepush = { view: 'side', fix: 'w1', fixX: 160, poses: [
  { t: -34.55, hd: -42, a1: [90, 90], a2: [90, 90], l1: [145.45, 192], l2: [145.45, 192], ft1: 20, ft2: 20, d: 1000, h: 400 },
  { t: -19.24, hd: -27, a1: [140.5, 31.3], a2: [140.5, 31.3], l1: [160.76, 192], l2: [160.76, 192], ft1: 20, ft2: 20, d: 1000, h: 400 }] };
ANIMS.pushup = { view: 'side', fix: 'w1', fixX: 152, poses: [X(PLANK_HI, 1000, 400), X(PUSH_DN, 1000, 400)] };
ANIMS.pushpause = { view: 'side', fix: 'w1', fixX: 152, poses: [X(PLANK_HI, 900, 300), X(PUSH_DN, 900, 1800)] };
ANIMS.plank = { view: 'side', fix: 'w1', fixX: 165, poses: [
  { t: -7, hd: -15, a1: [90, 0], a2: [90, 0], l1: [173, 173], l2: [173, 173], ft1: 75, ft2: 75, d: 1500, h: 500 },
  { t: -7, hd: -11, tb: 2, a1: [90, 0], a2: [90, 0], l1: [173, 173], l2: [173, 173], ft1: 75, ft2: 75, d: 1500, h: 500 }] };
ANIMS.climbers = { view: 'side', fix: 'w1', fixX: 160, poses: [
  { t: -18.4, hd: -26, a1: [90, 90], a2: [90, 90], l1: [161.6, 161.6], ft1: 75, l2: [40, 125], ft2: 60, d: 300, h: 0 },
  { t: -18.4, hd: -26, a1: [90, 90], a2: [90, 90], l2: [161.6, 161.6], ft2: 75, l1: [40, 125], ft1: 60, d: 300, h: 0 }] };
ANIMS.crunch = { view: 'side', fix: 'p', fixX: 116, poses: [
  { t: 180, hd: 204, a1: [0, 0], a2: [0, 0], l1: [-55, 58], l2: [-50, 62], d: 900, h: 300 },
  { t: 210, hd: 218, a1: [-5, -12], a2: [-3, -10], l1: [-55, 58], l2: [-50, 62], tb: 3, d: 900, h: 500 }] };
ANIMS.deadbug = { view: 'side', fix: 'p', fixX: 116, poses: [
  { t: 180, hd: 204, a1: [-90, -90], a2: [-90, -90], l1: [-90, 0], l2: [-90, 0], d: 700, h: 200 },
  { t: 180, hd: 204, a1: [180, 180], a2: [-90, -90], l1: [-90, 0], l2: [-8, -6], d: 1000, h: 300 },
  { t: 180, hd: 204, a1: [-90, -90], a2: [-90, -90], l1: [-90, 0], l2: [-90, 0], d: 800, h: 200 },
  { t: 180, hd: 204, a1: [-90, -90], a2: [180, 180], l1: [-8, -6], l2: [-90, 0], d: 1000, h: 300 }] };
ANIMS.superman = { view: 'side', fix: 'p', fixX: 118, poses: [
  { t: 0, hd: -24, a1: [0, 0], a2: [0, 0], l1: [180, 180], l2: [180, 180], d: 900, h: 300 },
  { t: -10, hd: -35, tb: -3, a1: [-16, -16], a2: [-14, -14], l1: [190, 196], l2: [192, 198], d: 900, h: 900 }] };
ANIMS.reach = { view: 'side', fix: 'p', fixX: 120, poses: [{ d: 1200, h: 400 },
  { a1: [-92, -92], a2: [-88, -88], ft1: 62, ft2: 62, tb: -2, d: 1500, h: 1500 }] };
ANIMS.cobra = { view: 'side', fix: 'p', fixX: 100, poses: [
  { t: -8, hd: -24, a1: [165, 0], a2: [168, 2], l1: [180, 180], l2: [180, 180], ft1: 180, ft2: 180, d: 1200, h: 500 },
  { t: -62, hd: -76, tb: 5, a1: [90, 90], a2: [95, 92], l1: [180, 180], l2: [180, 180], ft1: 180, ft2: 180, d: 1500, h: 1800 }] };
ANIMS.child = { view: 'side', fix: 'p', fixX: 108, poses: [
  { t: -17, hd: -30, a1: [90, 90], a2: [90, 90], l1: [90, 180], l2: [90, 180], ft1: 180, ft2: 180, d: 1000, h: 400 },
  { t: -8, hd: -20, a1: [24, 22], a2: [26, 22], l1: [18, 180], l2: [20, 180], ft1: 180, ft2: 180, d: 1800, h: 1800 }] };
ANIMS.catcow = { view: 'side', fix: 'p', fixX: 108, poses: [
  { t: -17, hd: 62, tb: -9, a1: [90, 90], a2: [90, 90], l1: [90, 180], l2: [90, 180], ft1: 180, ft2: 180, d: 1500, h: 400 },
  { t: -17, hd: -50, tb: 9, a1: [90, 90], a2: [90, 90], l1: [90, 180], l2: [90, 180], ft1: 180, ft2: 180, d: 1500, h: 400 }] };
ANIMS.seatedfold = { view: 'side', fix: 'p', fixX: 80, poses: [
  { t: -90, hd: -90, a1: [20, 20], a2: [20, 20], l1: [0, 0], l2: [3, 0], ft1: -80, ft2: -80, d: 1000, h: 300 },
  { t: -28, hd: -20, tb: -4, a1: [35, 20], a2: [38, 22], l1: [0, 0], l2: [3, 0], ft1: -80, ft2: -80, d: 1800, h: 1800 }] };
ANIMS.sidebend = { view: 'front', fix: 'p', fixX: 120, poses: [
  { a1: [-100, -100], a2: [-80, -80], l1: [96, 92], l2: [84, 88], d: 800, h: 200 },
  { t: -105, hd: -105, a1: [-117, -117], a2: [-97, -97], l1: [96, 92], l2: [84, 88], d: 1400, h: 1000 },
  { a1: [-100, -100], a2: [-80, -80], l1: [96, 92], l2: [84, 88], d: 1200, h: 200 },
  { t: -75, hd: -75, a1: [-85, -85], a2: [-65, -65], l1: [96, 92], l2: [84, 88], d: 1400, h: 1000 }] };
ANIMS.wallangel = { view: 'front', fix: 'p', fixX: 120, poses: [
  { a1: [168, -100], a2: [12, -80], l1: [93, 90], l2: [87, 90], d: 1000, h: 500 },
  { a1: [-130, -125], a2: [-50, -55], l1: [93, 90], l2: [87, 90], d: 1400, h: 500 }] };

/* ---- ejercicios nuevos ---- */
var ALL4 = { t: -17, hd: -30, a1: [90, 90], a2: [90, 90], l1: [90, 180], l2: [90, 180], ft1: 180, ft2: 180 };
ANIMS.donkeykick = { view: 'side', fix: 'p', fixX: 108, poses: [
  X(ALL4, 800, 200),
  { t: -17, hd: -30, a1: [90, 90], a2: [90, 90], l1: [195, -95], l2: [90, 180], ft1: 200, ft2: 180, d: 700, h: 500 },
  X(ALL4, 700, 200),
  { t: -17, hd: -30, a1: [90, 90], a2: [90, 90], l2: [195, -95], l1: [90, 180], ft2: 200, ft1: 180, d: 700, h: 500 }] };
ANIMS.birddog = { view: 'side', fix: 'p', fixX: 100, poses: [
  X(ALL4, 800, 300),
  { t: -17, hd: -22, a1: [-8, -8], a2: [90, 90], l1: [90, 180], l2: [186, 186], ft1: 180, ft2: 90, d: 1100, h: 900 },
  X(ALL4, 900, 300),
  { t: -17, hd: -22, a2: [-8, -8], a1: [90, 90], l2: [90, 180], l1: [186, 186], ft2: 180, ft1: 90, d: 1100, h: 900 }] };
ANIMS.hollow = { view: 'side', fix: 'p', fixX: 116, poses: [
  { t: 180, hd: 204, a1: [180, 180], a2: [180, 180], l1: [0, 0], l2: [3, 3], d: 1000, h: 400 },
  { t: 196, hd: 214, tb: 5, a1: [192, 192], a2: [190, 190], l1: [-22, -22], l2: [-20, -20], d: 1200, h: 1800 }] };
var BR_DN = { t: 180, hd: 204, a1: [0, 0], a2: [0, 0], l1: [-55, 58], l2: [-50, 62] };
var BR_UP = { t: 141, hd: 204, a1: [0, 0], a2: [0, 0], l1: [0, 74], l2: [3, 77] };
ANIMS.singlebridge = { view: 'side', fix: 'p', fixX: 105, poses: [
  X(BR_DN, 900, 300),
  { t: 141, hd: 204, a1: [0, 0], a2: [0, 0], l1: [0, 74], l2: [-38, -38], d: 1000, h: 800 },
  X(BR_DN, 900, 300),
  { t: 141, hd: 204, a1: [0, 0], a2: [0, 0], l2: [3, 77], l1: [-38, -38], d: 1000, h: 800 }] };
ANIMS.burpee = { view: 'side', fix: 'p', fixX: 100, poses: [
  { d: 500, h: 150 },
  { t: 0, hd: -20, a1: [90, 90], a2: [90, 90], l1: [30, 110], l2: [32, 108], d: 450, h: 100 },
  X(PLANK_HI, 400, 150),
  { t: 0, hd: -20, a1: [90, 90], a2: [90, 90], l1: [30, 110], l2: [32, 108], d: 400, h: 100 },
  { t: -90, hd: -90, a1: [-85, -85], a2: [-80, -80], l1: [92, 92], l2: [88, 88], ft1: 60, ft2: 60, lift: 15, d: 400, h: 150 }] };
ANIMS.dips = { view: 'side', fix: 'w1', fixX: 92, poses: [
  { t: 197.5, hd: -100, a1: [90, 90], a2: [90, 90], l1: [0, 90], l2: [0, 90], d: 1000, h: 400 },
  { t: 197.5, hd: -100, a1: [140.5, 31.3], a2: [140.5, 31.3], l1: [-30, 64], l2: [-30, 64], d: 1000, h: 400 }] };

/* ---- ejercicios nuevos (2) ---- */
ANIMS.legraise = { view: 'side', fix: 'p', fixX: 110, poses: [
  { t: 180, hd: 204, a1: [0, 0], a2: [0, 0], l1: [-10, -10], l2: [-8, -8], d: 1100, h: 300 },
  { t: 180, hd: 204, a1: [0, 0], a2: [0, 0], l1: [-90, -90], l2: [-88, -88], d: 1100, h: 500 }] };
ANIMS.bicycle = { view: 'side', fix: 'p', fixX: 112, poses: [
  { t: 205, hd: 216, a1: [-150, -110], a2: [-140, -120], l1: [-70, 10], l2: [-15, -15], d: 650, h: 80 },
  { t: 205, hd: 216, a1: [-150, -110], a2: [-140, -120], l2: [-70, 10], l1: [-15, -15], d: 650, h: 80 }] };
ANIMS.revlunge = { view: 'side', fix: 'f1', fixX: 128, poses: [{ d: 800, h: 200 },
  { t: -88, hd: -88, l1: [8, 92], l2: [115, 190], ft2: 50, d: 1000, h: 400 }] };
ANIMS.sideplank = { view: 'front', fix: 'p', fixX: 120, poses: [
  { t: 204, hd: 196, a1: [90, 90], a2: [-100, -100], l1: [24, 24], l2: [22, 22], d: 1400, h: 600 },
  { t: 204, hd: 192, tb: 2, a1: [90, 90], a2: [-80, -80], l1: [24, 24], l2: [22, 22], d: 1400, h: 600 }] };
ANIMS.sumo = { view: 'front', fix: 'p', fixX: 120, poses: [
  { a1: [100, -10], a2: [80, 190], l1: [112, 98], l2: [68, 82], d: 1000, h: 300 },
  { a1: [100, -10], a2: [80, 190], l1: [165, 95], l2: [15, 85], d: 1100, h: 500 }] };
ANIMS.swimmers = { view: 'side', fix: 'p', fixX: 118, poses: [
  { t: -6, hd: -28, a1: [-18, -18], a2: [0, 0], l1: [180, 180], l2: [194, 194], d: 600, h: 80 },
  { t: -6, hd: -28, a2: [-18, -18], a1: [0, 0], l2: [180, 180], l1: [194, 194], d: 600, h: 80 }] };

/* ======================= 72 EJERCICIOS NUEVOS ======================= */
var PLANK_FA = { t: -7, hd: -15, a1: [90, 0], a2: [90, 0], l1: [173, 173], l2: [173, 173], ft1: 75, ft2: 75 };
var BSQ = { t: 0, hd: -20, a1: [90, 90], a2: [90, 90], l1: [30, 110], l2: [32, 108] };
var CRUNCH_DN = { t: 180, hd: 204, a1: [0, 0], a2: [0, 0], l1: [-55, 58], l2: [-50, 62] };
var HOLLOW = { t: 196, hd: 214, tb: 5, a1: [192, 192], a2: [190, 190], l1: [-22, -22], l2: [-20, -20] };

/* ---- Piernas ---- */
ANIMS.pulsesquat = { view: 'side', fix: 'f1', fixX: 125, poses: [X(SQ_DOWN, 500, 0),
  { t: -66, hd: -78, a1: [10, 10], a2: [12, 12], l1: [42, 100], l2: [44, 98], d: 380, h: 0 }, X(SQ_DOWN, 380, 0)] };
ANIMS.isosquat = { view: 'side', fix: 'f1', fixX: 125, poses: [{ d: 700, h: 200 }, X(SQ_DOWN, 1300, 1800)] };
ANIMS.splitsquat = { view: 'side', fix: 'p', fixX: 120, poses: [
  { t: -90, hd: -90, l1: [78, 90], l2: [108, 108], ft2: 50, d: 1000, h: 300 },
  { t: -88, hd: -88, l1: [8, 92], l2: [115, 190], ft2: 50, d: 1000, h: 400 }] };
ANIMS.lateral = { view: 'front', fix: 'p', fixX: 120, poses: [
  { a1: [100, -10], a2: [80, 190], l1: [96, 92], l2: [84, 88], d: 600, h: 100 },
  { t: -84, hd: -84, a1: [100, -10], a2: [80, 190], l1: [150, 78], l2: [48, 48], d: 900, h: 400 },
  { a1: [100, -10], a2: [80, 190], l1: [96, 92], l2: [84, 88], d: 700, h: 100 },
  { t: -96, hd: -96, a1: [100, -10], a2: [80, 190], l2: [30, 102], l1: [132, 132], d: 900, h: 400 }] };
ANIMS.curtsy = { view: 'front', fix: 'p', fixX: 120, poses: [
  { a1: [100, -10], a2: [80, 190], l1: [96, 92], l2: [84, 88], d: 600, h: 100 },
  { t: -90, hd: -90, a1: [100, -10], a2: [80, 190], l2: [58, 98], l1: [74, 86], d: 900, h: 400 },
  { a1: [100, -10], a2: [80, 190], l1: [96, 92], l2: [84, 88], d: 700, h: 100 },
  { t: -90, hd: -90, a1: [100, -10], a2: [80, 190], l1: [122, 82], l2: [106, 94], d: 900, h: 400 }] };
ANIMS.skater = { view: 'front', fix: 'p', fixX: 120, poses: [
  { t: -98, hd: -98, a1: [140, 120], a2: [50, 80], l1: [112, 96], l2: [72, 92], lift: 8, d: 450, h: 60 },
  { t: -82, hd: -82, a2: [40, 60], a1: [130, 100], l2: [68, 84], l1: [108, 92], lift: 8, d: 450, h: 60 }] };
ANIMS.standkick = { view: 'side', fix: 'p', fixX: 120, poses: [{ d: 800, h: 200 },
  { t: -84, hd: -86, a1: [60, 120], a2: [70, 110], l1: [125, 128], l2: [90, 95], d: 800, h: 500 }] };
ANIMS.bridgemarch = { view: 'side', fix: 'p', fixX: 105, poses: [
  { t: 141, hd: 204, a1: [0, 0], a2: [0, 0], l1: [-50, 30], l2: [3, 77], d: 700, h: 300 },
  { t: 141, hd: 204, a1: [0, 0], a2: [0, 0], l2: [-50, 30], l1: [0, 74], d: 700, h: 300 }] };
ANIMS.singlecalf = { view: 'side', fix: 'p', fixX: 120, poses: [{ l1: [95, 165], d: 700, h: 300 },
  { l1: [95, 165], ft2: 62, a1: [80, 80], d: 700, h: 500 }] };
ANIMS.jumplunge = { view: 'side', fix: 'p', fixX: 120, poses: [
  { t: -88, hd: -88, l1: [8, 92], l2: [115, 190], ft2: 50, d: 500, h: 50 },
  { t: -90, hd: -90, a1: [-60, -60], a2: [-50, -50], l1: [60, 100], l2: [110, 130], ft1: 40, ft2: 40, lift: 18, d: 330, h: 0 },
  { t: -88, hd: -88, l2: [8, 92], l1: [115, 190], ft1: 50, d: 330, h: 50 },
  { t: -90, hd: -90, a1: [-60, -60], a2: [-50, -50], l2: [60, 100], l1: [110, 130], ft1: 40, ft2: 40, lift: 18, d: 330, h: 0 }] };
ANIMS.tuckjump = { view: 'side', fix: 'f1', fixX: 125, poses: [
  { t: -70, hd: -80, a1: [120, 110], a2: [115, 110], l1: [35, 105], l2: [38, 105], d: 600, h: 100 },
  { t: -85, hd: -88, a1: [-60, -60], a2: [-55, -55], l1: [15, 115], l2: [18, 112], lift: 20, d: 320, h: 80 }] };
ANIMS.goodmorning = { view: 'side', fix: 'f1', fixX: 125, poses: [
  { a1: [-160, -120], a2: [-150, -110], d: 900, h: 300 },
  { t: -8, hd: -20, a1: [-160, -120], a2: [-150, -110], l1: [96, 92], l2: [96, 92], d: 1300, h: 500 }] };
ANIMS.slrdl = { view: 'side', fix: 'f1', fixX: 125, poses: [{ l2: [90, 90], d: 800, h: 300 },
  { t: -8, hd: -22, a1: [95, 95], a2: [100, 100], l1: [92, 92], l2: [188, 188], d: 1400, h: 600 }] };
ANIMS.bridgehold = { view: 'side', fix: 'f1', fixX: 140, poses: [X(BR_DN, 800, 300), X(BR_UP, 900, 2200)] };

/* ---- Pecho y brazos ---- */
ANIMS.slowpush = { view: 'side', fix: 'w1', fixX: 152, poses: [X(PLANK_HI, 2500, 500), X(PUSH_DN, 2500, 900)] };
ANIMS.plankshoulder = { view: 'side', fix: 'p', fixX: 110, poses: [
  X(PLANK_HI, 500, 100),
  { t: -18.4, hd: -26, a1: [20, -150], a2: [90, 90], l1: [161.6, 161.6], l2: [161.6, 161.6], ft1: 75, ft2: 75, d: 450, h: 150 },
  X(PLANK_HI, 450, 100),
  { t: -18.4, hd: -26, a2: [20, -150], a1: [90, 90], l1: [161.6, 161.6], l2: [161.6, 161.6], ft1: 75, ft2: 75, d: 450, h: 150 }] };
ANIMS.plankupdown = { view: 'side', fix: 'p', fixX: 110, poses: [X(PLANK_FA, 700, 250), X(PLANK_HI, 700, 250)] };
ANIMS.bearhold = { view: 'side', fix: 'p', fixX: 108, poses: [X(ALL4, 800, 300),
  { t: -22, hd: -34, a1: [90, 90], a2: [90, 90], l1: [72, 158], l2: [72, 158], ft1: 88, ft2: 88, d: 800, h: 2000 }] };
ANIMS.inchworm = { view: 'side', fix: 'p', fixX: 100, poses: [{ d: 1100, h: 200 }, X(BSQ, 1000, 150), X(PLANK_HI, 1100, 400), X(BSQ, 1000, 150)] };
ANIMS.pressup = { view: 'front', fix: 'p', fixX: 120, poses: [
  { a1: [165, -100], a2: [15, -80], l1: [93, 90], l2: [87, 90], d: 900, h: 300 },
  { a1: [-98, -92], a2: [-82, -88], l1: [93, 90], l2: [87, 90], d: 1000, h: 400 }] };
ANIMS.tricepkick = { view: 'side', fix: 'f1', fixX: 125, poses: [
  { t: -32, hd: -42, a1: [172, 100], a2: [170, 100], l1: [60, 100], l2: [62, 98], d: 700, h: 200 },
  { t: -32, hd: -42, a1: [172, 172], a2: [170, 170], l1: [60, 100], l2: [62, 98], d: 700, h: 500 }] };
ANIMS.kneeplank = { view: 'side', fix: 'w1', fixX: 165, poses: [
  { t: -17.4, hd: -24, a1: [90, 0], a2: [90, 0], l1: [162.6, 192], l2: [162.6, 192], ft1: 20, ft2: 20, d: 1500, h: 500 },
  { t: -17.4, hd: -20, tb: 2, a1: [90, 0], a2: [90, 0], l1: [162.6, 192], l2: [162.6, 192], ft1: 20, ft2: 20, d: 1500, h: 500 }] };

/* ---- Core ---- */
ANIMS.russian = { view: 'side', fix: 'p', fixX: 112, poses: [
  { t: -115, hd: -122, a1: [25, 25], a2: [22, 22], l1: [-40, 40], l2: [-42, 38], d: 650, h: 80 },
  { t: -115, hd: -122, a1: [-20, -20], a2: [-22, -22], l1: [-40, 40], l2: [-42, 38], d: 650, h: 80 }] };
ANIMS.vup = { view: 'side', fix: 'p', fixX: 108, poses: [
  { t: 180, hd: 204, a1: [180, 180], a2: [180, 180], l1: [0, 0], l2: [3, 3], d: 900, h: 300 },
  { t: 216, hd: 226, a1: [-12, -12], a2: [-10, -10], l1: [-45, -45], l2: [-43, -43], d: 900, h: 500 }] };
ANIMS.flutter = { view: 'side', fix: 'p', fixX: 112, poses: [
  { t: 180, hd: 204, a1: [0, 0], a2: [0, 0], l1: [-24, -24], l2: [-8, -8], d: 280, h: 0 },
  { t: 180, hd: 204, a1: [0, 0], a2: [0, 0], l2: [-24, -24], l1: [-8, -8], d: 280, h: 0 }] };
ANIMS.scissors = { view: 'side', fix: 'p', fixX: 112, poses: [
  { t: 190, hd: 210, a1: [-150, -110], a2: [-140, -120], l1: [-52, -52], l2: [-12, -12], d: 650, h: 80 },
  { t: 190, hd: 210, a1: [-150, -110], a2: [-140, -120], l2: [-52, -52], l1: [-12, -12], d: 650, h: 80 }] };
ANIMS.reversecrunch = { view: 'side', fix: 'p', fixX: 112, poses: [
  { t: 180, hd: 204, a1: [0, 0], a2: [0, 0], l1: [-78, 40], l2: [-76, 42], d: 900, h: 200 },
  { t: 168, hd: 196, a1: [0, 0], a2: [0, 0], l1: [-118, -20], l2: [-116, -18], d: 900, h: 500 }] };
ANIMS.plankreach = { view: 'side', fix: 'p', fixX: 108, poses: [
  X(PLANK_HI, 500, 100),
  { t: -18.4, hd: -26, a1: [-8, -8], a2: [90, 90], l1: [161.6, 161.6], l2: [161.6, 161.6], ft1: 75, ft2: 75, d: 700, h: 500 },
  X(PLANK_HI, 600, 100),
  { t: -18.4, hd: -26, a2: [-8, -8], a1: [90, 90], l1: [161.6, 161.6], l2: [161.6, 161.6], ft1: 75, ft2: 75, d: 700, h: 500 }] };
ANIMS.plankknee = { view: 'side', fix: 'p', fixX: 108, poses: [
  { t: -7, hd: -15, a1: [90, 0], a2: [90, 0], l1: [60, 125], l2: [173, 173], ft1: 60, ft2: 75, d: 600, h: 150 },
  X(PLANK_FA, 500, 100),
  { t: -7, hd: -15, a1: [90, 0], a2: [90, 0], l2: [60, 125], l1: [173, 173], ft1: 75, ft2: 60, d: 600, h: 150 },
  X(PLANK_FA, 500, 100)] };
ANIMS.boat = { view: 'side', fix: 'p', fixX: 100, poses: [
  { t: -90, hd: -90, a1: [20, 20], a2: [20, 20], l1: [0, 0], l2: [3, 0], ft1: -80, ft2: -80, d: 900, h: 300 },
  { t: -118, hd: -124, a1: [0, 0], a2: [3, 3], l1: [-42, -42], l2: [-40, -40], ft1: -40, ft2: -40, d: 1100, h: 2200 }] };
ANIMS.situp = { view: 'side', fix: 'p', fixX: 112, poses: [
  { t: 180, hd: 204, a1: [0, 0], a2: [0, 0], l1: [-55, 58], l2: [-50, 62], d: 900, h: 300 },
  { t: 270, hd: 268, a1: [-5, -5], a2: [-3, -3], l1: [-55, 58], l2: [-50, 62], d: 1100, h: 400 }] };
ANIMS.sidecrunch = { view: 'front', fix: 'p', fixX: 120, poses: [
  { a1: [-150, -110], a2: [-30, -70], l1: [96, 92], l2: [84, 88], d: 700, h: 100 },
  { t: -102, hd: -102, a1: [-155, -100], a2: [-35, -80], l1: [118, 60], l2: [84, 88], d: 800, h: 300 },
  { a1: [-150, -110], a2: [-30, -70], l1: [96, 92], l2: [84, 88], d: 700, h: 100 },
  { t: -78, hd: -78, a1: [-145, -100], a2: [-25, -80], l2: [62, 120], l1: [96, 92], d: 800, h: 300 }] };
ANIMS.legholds = { view: 'side', fix: 'p', fixX: 112, poses: [
  { t: 180, hd: 204, a1: [0, 0], a2: [0, 0], l1: [-10, -10], l2: [-8, -8], d: 900, h: 300 },
  { t: 180, hd: 204, a1: [0, 0], a2: [0, 0], l1: [-45, -45], l2: [-43, -43], d: 900, h: 2200 }] };
ANIMS.hollowrock = { view: 'side', fix: 'p', fixX: 116, poses: [X(HOLLOW, 800, 100),
  { t: 190, hd: 208, tb: 4, a1: [186, 186], a2: [184, 184], l1: [-30, -30], l2: [-28, -28], d: 800, h: 100 }] };

/* ---- Espalda ---- */
ANIMS.yraise = { view: 'side', fix: 'p', fixX: 118, poses: [
  { t: 0, hd: -24, a1: [0, 0], a2: [0, 0], l1: [180, 180], l2: [180, 180], d: 900, h: 300 },
  { t: -9, hd: -32, a1: [-26, -26], a2: [-24, -24], l1: [180, 180], l2: [180, 180], d: 900, h: 1000 }] };
ANIMS.reversesnow = { view: 'side', fix: 'p', fixX: 118, poses: [
  { t: -9, hd: -32, a1: [-24, -24], a2: [-22, -22], l1: [180, 180], l2: [180, 180], d: 900, h: 200 },
  { t: -9, hd: -32, a1: [192, 192], a2: [190, 190], l1: [180, 180], l2: [180, 180], d: 1300, h: 400 }] };
ANIMS.backext = { view: 'side', fix: 'p', fixX: 108, poses: [
  { t: 0, hd: -24, a1: [205, -30], a2: [208, -28], l1: [180, 180], l2: [180, 180], d: 900, h: 300 },
  { t: -22, hd: -40, tb: 4, a1: [205, -30], a2: [208, -28], l1: [180, 180], l2: [180, 180], d: 1100, h: 800 }] };
ANIMS.scapsqueeze = { view: 'front', fix: 'p', fixX: 120, poses: [
  { a1: [150, -70], a2: [30, -110], l1: [93, 90], l2: [87, 90], d: 900, h: 300 },
  { a1: [188, -96], a2: [-8, -84], l1: [93, 90], l2: [87, 90], d: 900, h: 1000 }] };
ANIMS.supermanrow = { view: 'side', fix: 'p', fixX: 118, poses: [
  { t: -9, hd: -32, a1: [-22, -22], a2: [-20, -20], l1: [190, 194], l2: [192, 196], d: 900, h: 300 },
  { t: -9, hd: -32, a1: [150, 20], a2: [152, 22], l1: [190, 194], l2: [192, 196], d: 900, h: 800 }] };
ANIMS.birddoghold = { view: 'side', fix: 'p', fixX: 100, poses: [X(ALL4, 800, 300),
  { t: -17, hd: -22, a1: [-8, -8], a2: [90, 90], l1: [90, 180], l2: [186, 186], ft1: 180, ft2: 90, d: 1000, h: 3000 }] };
ANIMS.reverseplank = { view: 'side', fix: 'w1', fixX: 92, poses: [
  { t: 204, hd: -112, a1: [90, 90], a2: [90, 90], l1: [24, 24], l2: [22, 22], ft1: -70, ft2: -70, d: 1300, h: 800 },
  { t: 204, hd: -108, tb: 3, a1: [90, 90], a2: [90, 90], l1: [24, 24], l2: [22, 22], ft1: -70, ft2: -70, d: 1300, h: 800 }] };
ANIMS.supermanhold = { view: 'side', fix: 'p', fixX: 118, poses: [
  { t: 0, hd: -24, a1: [0, 0], a2: [0, 0], l1: [180, 180], l2: [180, 180], d: 900, h: 300 },
  { t: -10, hd: -35, tb: -3, a1: [-16, -16], a2: [-14, -14], l1: [190, 196], l2: [192, 198], d: 1000, h: 2600 }] };

/* ---- Cardio ---- */
ANIMS.jumprope = { view: 'side', fix: 'p', fixX: 120, poses: [
  { a1: [55, 20], a2: [60, 25], d: 260, h: 0 },
  { a1: [65, 35], a2: [50, 15], ft1: 60, ft2: 60, lift: 8, d: 260, h: 0 }] };
ANIMS.buttkicks = { view: 'side', fix: 'p', fixX: 120, poses: [
  { t: -92, hd: -92, a1: [140, 100], a2: [40, -60], l1: [90, 192], l2: [90, 90], d: 260, h: 0 },
  { t: -92, hd: -92, a1: [40, -60], a2: [140, 100], l2: [90, 192], l1: [90, 90], d: 260, h: 0 }] };
ANIMS.march = { view: 'side', fix: 'p', fixX: 120, poses: [
  { t: -90, hd: -90, a1: [140, 100], a2: [50, -50], l1: [32, 96], l2: [90, 90], d: 420, h: 60 },
  { t: -90, hd: -90, a1: [50, -50], a2: [140, 100], l2: [32, 96], l1: [90, 90], d: 420, h: 60 }] };
ANIMS.sidehop = { view: 'front', fix: 'p', fixX: 120, poses: [
  { t: -98, hd: -98, a1: [140, 120], a2: [45, 70], l1: [104, 98], l2: [94, 92], lift: 6, d: 380, h: 40 },
  { t: -82, hd: -82, a2: [40, 60], a1: [135, 110], l2: [76, 82], l1: [86, 88], lift: 6, d: 380, h: 40 }] };
ANIMS.shadowbox = { view: 'side', fix: 'p', fixX: 112, poses: [
  { t: -88, hd: -88, a1: [0, 0], a2: [-70, -150], l1: [14, 92], l2: [100, 120], ft2: 60, d: 280, h: 40 },
  { t: -88, hd: -88, a2: [0, 0], a1: [-70, -150], l1: [14, 92], l2: [100, 120], ft2: 60, d: 280, h: 40 }] };
ANIMS.halfburpee = { view: 'side', fix: 'p', fixX: 100, poses: [{ d: 500, h: 150 }, X(BSQ, 450, 120)] };
ANIMS.starjump = { view: 'front', fix: 'p', fixX: 120, poses: [
  { a1: [100, 100], a2: [80, 80], l1: [118, 100], l2: [62, 80], d: 450, h: 60 },
  { t: -90, a1: [-140, -130], a2: [-40, -50], l1: [128, 122], l2: [52, 58], lift: 16, d: 360, h: 80 }] };
ANIMS.bearcrawl = { view: 'side', fix: 'p', fixX: 105, poses: [
  { t: -22, hd: -34, a1: [60, 90], a2: [90, 90], l1: [90, 160], l2: [62, 125], ft1: 88, ft2: 70, d: 500, h: 40 },
  { t: -22, hd: -34, a2: [60, 90], a1: [90, 90], l2: [90, 160], l1: [62, 125], ft2: 88, ft1: 70, d: 500, h: 40 }] };
ANIMS.crab = { view: 'side', fix: 'w1', fixX: 92, poses: [
  { t: 197.5, hd: -100, a1: [90, 90], a2: [90, 90], l1: [-30, -30], l2: [0, 90], d: 650, h: 100 },
  { t: 197.5, hd: -100, a1: [90, 90], a2: [90, 90], l2: [-30, -30], l1: [0, 90], d: 650, h: 100 }] };
ANIMS.fastfeet = { view: 'side', fix: 'p', fixX: 120, poses: [
  { t: -88, hd: -88, a1: [70, 50], a2: [110, 70], l1: [60, 100], l2: [90, 90], d: 170, h: 0 },
  { t: -88, hd: -88, a2: [70, 50], a1: [110, 70], l2: [60, 100], l1: [90, 90], d: 170, h: 0 }] };

/* ---- Estiramientos y movilidad ---- */
ANIMS.hamstringstand = { view: 'side', fix: 'p', fixX: 100, poses: [
  { a1: [-100, -100], a2: [-95, -95], d: 900, h: 200 },
  { t: 55, hd: 70, a1: [100, 100], a2: [104, 104], l1: [92, 92], l2: [92, 92], d: 1800, h: 2200 }] };
ANIMS.quadstretch = { view: 'side', fix: 'p', fixX: 120, poses: [{ d: 800, h: 200 },
  { t: -90, hd: -90, a1: [120, 168], a2: [88, 88], l1: [90, 192], l2: [90, 90], d: 1000, h: 2400 }] };
ANIMS.calfstretch = { view: 'side', fix: 'p', fixX: 90, wall: 150, wallSide: 'r', poses: [
  { t: -68, hd: -76, a1: [-5, -5], a2: [0, 0], l1: [30, 92], l2: [160, 160], ft2: 40, d: 900, h: 400 },
  { t: -62, hd: -72, a1: [-8, -8], a2: [-3, -3], l1: [24, 92], l2: [160, 160], ft2: 40, d: 1200, h: 2200 }] };
ANIMS.butterfly = { view: 'side', fix: 'p', fixX: 100, poses: [
  { t: -90, hd: -90, a1: [60, 100], a2: [58, 100], l1: [-35, 150], l2: [-38, 148], d: 900, h: 300 },
  { t: -62, hd: -70, a1: [60, 100], a2: [58, 100], l1: [-35, 150], l2: [-38, 148], d: 1600, h: 2200 }] };
ANIMS.hipflexor = { view: 'side', fix: 'p', fixX: 110, poses: [
  { t: -90, hd: -90, a1: [85, 85], a2: [95, 95], l1: [8, 92], l2: [100, 180], ft2: 150, d: 900, h: 300 },
  { t: -92, hd: -94, tb: -2, a1: [-90, -90], a2: [-88, -88], l1: [8, 92], l2: [100, 180], ft2: 150, d: 1400, h: 2200 }] };
ANIMS.kneehug = { view: 'side', fix: 'p', fixX: 112, poses: [
  { t: 180, hd: 204, a1: [0, 0], a2: [0, 0], l1: [-55, 58], l2: [0, 0], d: 900, h: 300 },
  { t: 180, hd: 204, a1: [-30, 150], a2: [-28, 152], l1: [-122, 50], l2: [0, 0], d: 1300, h: 2300 }] };
ANIMS.backrock = { view: 'side', fix: 'p', fixX: 112, poses: [
  { t: 172, hd: 198, a1: [-35, 150], a2: [-33, 152], l1: [-125, 55], l2: [-123, 57], d: 1100, h: 100 },
  { t: 190, hd: 212, a1: [-35, 150], a2: [-33, 152], l1: [-125, 55], l2: [-123, 57], d: 1100, h: 100 }] };
ANIMS.neckroll = { view: 'front', fix: 'p', fixX: 120, poses: [
  { hd: -90, d: 700, h: 300 }, { hd: -112, d: 1000, h: 600 }, { hd: -90, d: 800, h: 100 }, { hd: -68, d: 1000, h: 600 }] };
ANIMS.armcircles = { view: 'front', fix: 'p', fixX: 120, poses: [
  { a1: [-160, -160], a2: [-20, -20], l1: [93, 90], l2: [87, 90], d: 450, h: 0 },
  { a1: [180, 180], a2: [0, 0], l1: [93, 90], l2: [87, 90], d: 450, h: 0 },
  { a1: [160, 160], a2: [20, 20], l1: [93, 90], l2: [87, 90], d: 450, h: 0 },
  { a1: [180, 180], a2: [0, 0], l1: [93, 90], l2: [87, 90], d: 450, h: 0 }] };
ANIMS.armhug = { view: 'front', fix: 'p', fixX: 120, poses: [
  { a1: [180, 180], a2: [0, 0], l1: [93, 90], l2: [87, 90], d: 800, h: 150 },
  { a1: [14, 14], a2: [166, 166], l1: [93, 90], l2: [87, 90], d: 800, h: 300 }] };
ANIMS.torsostand = { view: 'front', fix: 'p', fixX: 120, poses: [
  { t: -92, hd: -92, tb: 2, a1: [170, 160], a2: [200, 220], l1: [100, 95], l2: [80, 85], d: 900, h: 100 },
  { t: -88, hd: -88, tb: -2, a1: [-20, -40], a2: [10, 20], l1: [100, 95], l2: [80, 85], d: 900, h: 100 }] };
ANIMS.hipcircle = { view: 'front', fix: 'p', fixX: 120, poses: [
  { t: -96, hd: -92, a1: [140, 110], a2: [40, 70], l1: [100, 92], l2: [84, 88], d: 700, h: 0 },
  { t: -90, hd: -90, tb: 3, a1: [140, 110], a2: [40, 70], l1: [92, 90], l2: [88, 90], d: 700, h: 0 },
  { t: -84, hd: -88, a1: [140, 110], a2: [40, 70], l1: [96, 88], l2: [80, 92], d: 700, h: 0 },
  { t: -90, hd: -90, tb: -3, a1: [140, 110], a2: [40, 70], l1: [92, 90], l2: [88, 90], d: 700, h: 0 }] };
ANIMS.ankle = { view: 'side', fix: 'f2', fixX: 125, poses: [
  { l1: [60, 120], ft1: -60, d: 450, h: 0 }, { l1: [60, 120], ft1: 0, d: 450, h: 0 },
  { l1: [60, 120], ft1: 60, d: 450, h: 0 }, { l1: [60, 120], ft1: 0, d: 450, h: 0 }] };
ANIMS.breathe = { view: 'side', fix: 'p', fixX: 120, poses: [{ d: 1500, h: 600 },
  { t: -92, hd: -96, tb: -2, a1: [-70, -70], a2: [-65, -65], ft1: 30, ft2: 30, d: 3000, h: 1500 }] };
ANIMS.shouldercross = { view: 'front', fix: 'p', fixX: 120, poses: [
  { a1: [100, 100], a2: [80, 80], l1: [93, 90], l2: [87, 90], d: 900, h: 300 },
  { a1: [8, 14], a2: [-175, -25], l1: [93, 90], l2: [87, 90], d: 1000, h: 2300 }] };
ANIMS.tricepstretch = { view: 'front', fix: 'p', fixX: 120, poses: [
  { a1: [100, 100], a2: [80, 80], l1: [93, 90], l2: [87, 90], d: 900, h: 300 },
  { a1: [-92, 150], a2: [-125, -170], l1: [93, 90], l2: [87, 90], d: 1000, h: 2300 }] };
ANIMS.chestopen = { view: 'side', fix: 'p', fixX: 120, poses: [{ d: 900, h: 300 },
  { t: -95, hd: -104, tb: -3, a1: [122, 122], a2: [126, 126], d: 1100, h: 2300 }] };

/* ---------- Ejercicios ---------- */
var EX = {
  squat: { n: 'Sentadilla', cat: 'Piernas', type: 'reps', anim: 'squat', m: 'Cuádriceps, glúteos',
    steps: ['Pies al ancho de los hombros, puntas un poco hacia afuera.', 'Baja llevando la cadera hacia atrás, como si te sentaras en una silla.', 'Rodillas en línea con los pies y espalda recta. Sube empujando el suelo.'],
    tip: 'No dejes que las rodillas se vayan hacia adentro. Los talones siempre pegados al suelo.' },
  jumpsquat: { n: 'Sentadilla con salto', cat: 'Piernas', type: 'reps', anim: 'jumpsquat', m: 'Piernas, glúteos, cardio', grow: 1,
    steps: ['Baja a una sentadilla controlada.', 'Sube explosivo y salta lo más alto que puedas.', 'Aterriza suave, con las rodillas flexionadas, y baja de nuevo.'],
    tip: 'Los saltos estimulan los huesos y las piernas. Aterriza siempre despacio y sin ruido.' },
  jump: { n: 'Salto vertical', cat: 'Piernas', type: 'reps', anim: 'jump', m: 'Piernas, potencia', grow: 1,
    steps: ['Flexiona un poco las rodillas y lleva los brazos atrás.', 'Salta hacia arriba estirando todo el cuerpo y los brazos al cielo.', 'Aterriza suave y repite sin pausa larga.'],
    tip: 'Estírate al máximo en el aire: es un gran ejercicio para activar todo el cuerpo.' },
  lunge: { n: 'Zancada alterna', cat: 'Piernas', type: 'reps', anim: 'lunge', m: 'Cuádriceps, glúteos', unit: 'reps (en total)',
    steps: ['De pie, da un paso largo hacia adelante.', 'Baja hasta que ambas rodillas formen unos 90°.', 'Empuja con el pie de adelante para volver y cambia de pierna.'],
    tip: 'Tronco recto. La rodilla de adelante no pasa mucho la punta del pie.' },
  wallsit: { n: 'Sentadilla en pared', cat: 'Piernas', type: 'time', anim: 'wallsit', m: 'Cuádriceps (isométrico)',
    steps: ['Apoya la espalda completa contra una pared.', 'Desliza hacia abajo hasta tener las rodillas a 90°.', 'Mantén la posición respirando normal.'],
    tip: 'Si tiemblan las piernas es buena señal. Sube un poco si el dolor es muy fuerte.' },
  calf: { n: 'Elevación de talones', cat: 'Piernas', type: 'reps', anim: 'calf', m: 'Gemelos',
    steps: ['De pie, pies al ancho de la cadera.', 'Sube lo más alto que puedas sobre las puntas de los pies.', 'Baja despacio, en 2 segundos.'],
    tip: 'Haz una pausa arriba. Puedes apoyar una mano en la pared para equilibrarte.' },
  bridge: { n: 'Puente de glúteos', cat: 'Piernas', type: 'reps', anim: 'bridge', m: 'Glúteos, isquios, zona lumbar',
    steps: ['Acuéstate boca arriba, rodillas dobladas, pies en el suelo.', 'Aprieta glúteos y sube la cadera hasta formar una línea recta hombros–rodillas.', 'Pausa 1 segundo arriba y baja controlado.'],
    tip: 'No arquees la espalda baja: la fuerza viene de los glúteos.' },
  singlebridge: { n: 'Puente a una pierna', cat: 'Piernas', type: 'reps', anim: 'singlebridge', m: 'Glúteos, isquios, core', unit: 'reps (en total)',
    steps: ['Boca arriba, rodillas dobladas y pies en el suelo.', 'Estira una pierna hacia arriba y sube la cadera con la otra.', 'Baja controlado y cambia de pierna.'],
    tip: 'Mantén la cadera nivelada: que no se caiga hacia el lado de la pierna levantada.' },
  donkeykick: { n: 'Patada de glúteo', cat: 'Piernas', type: 'reps', anim: 'donkeykick', m: 'Glúteos, isquios', unit: 'reps (en total)',
    steps: ['En cuatro apoyos, manos bajo hombros y rodillas bajo caderas.', 'Sube una pierna doblada hacia el techo, empujando con el talón.', 'Aprieta el glúteo arriba, baja sin tocar el suelo y cambia.'],
    tip: 'No arquees la espalda baja: sube solo hasta donde puedas con la espalda plana.' },
  birddog: { n: 'Perro–pájaro', cat: 'Espalda', type: 'reps', anim: 'birddog', m: 'Espalda baja, glúteos, core', unit: 'reps (en total)',
    steps: ['En cuatro apoyos con la espalda plana.', 'Estira a la vez un brazo al frente y la pierna contraria hacia atrás.', 'Aguanta 1–2 segundos sin mover la cadera y cambia de lado.'],
    tip: 'Imagina que llevas un vaso de agua en la espalda: no debe caerse.' },
  hollow: { n: 'Hueco abdominal', cat: 'Core', type: 'time', anim: 'hollow', m: 'Abdomen profundo',
    steps: ['Boca arriba, brazos estirados sobre la cabeza.', 'Levanta hombros y piernas del suelo, con la espalda baja pegada.', 'Mantén la forma de “banana” respirando normal.'],
    tip: 'Si la espalda baja se despega, sube más las piernas o dóblalas un poco.' },
  burpee: { n: 'Burpee', cat: 'Cardio', type: 'reps', anim: 'burpee', m: 'Cuerpo completo, cardio',
    steps: ['De pie, agáchate y apoya las manos en el suelo.', 'Lleva los pies atrás hasta la posición de plancha.', 'Vuelve los pies adelante y salta estirándote hacia arriba.'],
    tip: 'Ve a tu ritmo: la técnica primero, la velocidad después.' },
  dips: { n: 'Fondos en el suelo', cat: 'Pecho y brazos', type: 'reps', anim: 'dips', m: 'Tríceps, hombros',
    steps: ['Sentado, manos en el suelo detrás de ti, rodillas dobladas.', 'Sube la cadera y baja doblando los codos hacia atrás.', 'Empuja con los brazos para subir. Codos cerca del cuerpo.'],
    tip: 'No dejes que los hombros suban hacia las orejas. Baja solo hasta donde sea cómodo.' },
  legraise: { n: 'Elevación de piernas', cat: 'Core', type: 'reps', anim: 'legraise', m: 'Abdomen bajo',
    steps: ['Boca arriba, piernas estiradas y manos bajo la cadera.', 'Sube las piernas juntas hasta ponerlas verticales.', 'Baja despacio sin tocar el suelo y con la espalda baja pegada.'],
    tip: 'Si la espalda baja se despega, dobla un poco las rodillas.' },
  bicycle: { n: 'Bicicleta abdominal', cat: 'Core', type: 'reps', anim: 'bicycle', m: 'Abdomen y oblicuos', unit: 'reps (en total)',
    steps: ['Boca arriba, manos detrás de la cabeza y hombros despegados.', 'Lleva un codo hacia la rodilla contraria mientras estiras la otra pierna.', 'Cambia de lado de forma controlada, como pedaleando.'],
    tip: 'Gira desde el torso, no tires del cuello con las manos.' },
  revlunge: { n: 'Zancada hacia atrás', cat: 'Piernas', type: 'reps', anim: 'revlunge', m: 'Glúteos y cuádriceps', unit: 'reps (en total)',
    steps: ['De pie, da un paso largo hacia atrás.', 'Baja hasta que ambas rodillas formen unos 90°.', 'Empuja con el pie de adelante para volver y cambia de pierna.'],
    tip: 'Es más amable con las rodillas que la zancada hacia adelante.' },
  sideplank: { n: 'Plancha lateral', cat: 'Core', type: 'time', anim: 'sideplank', m: 'Oblicuos y hombros',
    steps: ['De lado, apoya la mano (o el antebrazo) bajo el hombro.', 'Sube la cadera hasta formar una línea recta de pies a cabeza.', 'Aguanta respirando normal. Después cambia de lado.'],
    tip: 'Si es muy difícil, apoya la rodilla de abajo en el suelo.' },
  sumo: { n: 'Sentadilla sumo', cat: 'Piernas', type: 'reps', anim: 'sumo', m: 'Glúteos y aductores',
    steps: ['Pies bien separados, puntas hacia afuera.', 'Baja con la espalda recta empujando las rodillas hacia afuera.', 'Sube apretando glúteos y aductores.'],
    tip: 'Las rodillas siguen la dirección de las puntas de los pies.' },
  swimmers: { n: 'Nadador', cat: 'Espalda', type: 'reps', anim: 'swimmers', m: 'Espalda baja y glúteos', unit: 'reps (en total)',
    steps: ['Boca abajo, brazos estirados al frente.', 'Levanta un brazo y la pierna contraria a la vez.', 'Cambia de lado rápido, como nadando.'],
    tip: 'Mira al suelo y mueve brazos y piernas desde la espalda.' },
  diamond: { n: 'Flexión diamante', cat: 'Pecho y brazos', type: 'reps', anim: 'pushup', m: 'Tríceps y pecho',
    steps: ['Posición de flexión con las manos juntas bajo el pecho, formando un rombo.', 'Baja el pecho hacia las manos manteniendo los codos pegados.', 'Empuja fuerte para subir.'],
    tip: 'Trabaja mucho el tríceps. Si no puedes, haz la flexión de rodillas con las manos juntas.' },
  highknees: { n: 'Rodillas altas', cat: 'Cardio', type: 'time', anim: 'highknees', m: 'Cardio, piernas, core',
    steps: ['De pie, corre en el sitio.', 'Sube las rodillas hasta la altura de la cadera.', 'Mueve los brazos al ritmo, tronco erguido.'],
    tip: 'Aterriza sobre la parte delantera del pie, ligero y rápido.' },
  jacks: { n: 'Saltos de tijera', cat: 'Cardio', type: 'time', anim: 'jacks', m: 'Cuerpo completo, cardio',
    steps: ['Empieza con pies juntos y brazos pegados.', 'Salta abriendo piernas y subiendo los brazos sobre la cabeza.', 'Vuelve de un salto a la posición inicial.'],
    tip: 'Ritmo constante y aterrizaje suave. Respira sin aguantar el aire.' },
  wallpush: { n: 'Flexión en pared', cat: 'Pecho y brazos', type: 'reps', anim: 'wallpush', m: 'Pecho, hombros, tríceps',
    steps: ['Frente a una pared, apoya las manos a la altura de los hombros.', 'Dobla los codos y acerca el pecho a la pared.', 'Empuja para volver. Cuerpo recto como una tabla.'],
    tip: 'Cuanto más lejos pongas los pies, más difícil. Es el primer escalón hacia la flexión normal.' },
  kneepush: { n: 'Flexión de rodillas', cat: 'Pecho y brazos', type: 'reps', anim: 'kneepush', m: 'Pecho, hombros, tríceps',
    steps: ['Manos bajo los hombros y rodillas en el suelo.', 'Cuerpo recto desde las rodillas hasta la cabeza.', 'Baja el pecho casi al suelo y empuja para subir.'],
    tip: 'No dejes caer la cadera. Codos a unos 45° del cuerpo, no abiertos.' },
  pushup: { n: 'Flexión', cat: 'Pecho y brazos', type: 'reps', anim: 'pushup', m: 'Pecho, hombros, tríceps, core',
    steps: ['Manos bajo los hombros, cuerpo recto sobre las puntas de los pies.', 'Baja el pecho hasta casi tocar el suelo.', 'Empuja fuerte hacia arriba sin bloquear los codos de golpe.'],
    tip: 'Aprieta abdomen y glúteos para que el cuerpo no se doble.' },
  pushpause: { n: 'Flexión con pausa', cat: 'Pecho y brazos', type: 'reps', anim: 'pushpause', m: 'Pecho, hombros, tríceps',
    steps: ['Posición de flexión normal.', 'Baja y mantén 2 segundos abajo, cerca del suelo.', 'Sube explosivo. Más lento = más fuerza.'],
    tip: 'La pausa elimina el rebote y trabaja más músculo con menos repeticiones.' },
  plank: { n: 'Plancha', cat: 'Core', type: 'time', anim: 'plank', m: 'Abdomen, hombros, espalda',
    steps: ['Apoya antebrazos y puntas de los pies en el suelo.', 'Cuerpo en línea recta de la cabeza a los talones.', 'Aprieta abdomen y glúteos, respira normal.'],
    tip: 'Si la cadera sube o baja, descansa y vuelve. La calidad importa más que el tiempo.' },
  climbers: { n: 'Escaladores', cat: 'Core', type: 'time', anim: 'climbers', m: 'Core, hombros, cardio',
    steps: ['Posición de flexión con brazos estirados.', 'Lleva una rodilla al pecho y cambia rápido de pierna.', 'Mantén la cadera baja y el abdomen firme.'],
    tip: 'Empieza lento y acelera cuando domines la técnica.' },
  crunch: { n: 'Abdominal', cat: 'Core', type: 'reps', anim: 'crunch', m: 'Abdomen',
    steps: ['Boca arriba, rodillas dobladas, pies en el suelo.', 'Despega hombros del suelo contrayendo el abdomen.', 'Baja despacio sin dejar caer la cabeza.'],
    tip: 'No tires del cuello. Mira al techo y sube con el abdomen.' },
  deadbug: { n: 'Bicho muerto', cat: 'Core', type: 'reps', anim: 'deadbug', m: 'Core profundo', unit: 'reps (en total)',
    steps: ['Boca arriba, brazos al techo y rodillas a 90°.', 'Baja un brazo hacia atrás y estira la pierna contraria.', 'Vuelve y cambia de lado. Espalda baja pegada al suelo.'],
    tip: 'Movimiento lento. Si la espalda se despega, reduce el rango.' },
  superman: { n: 'Superman', cat: 'Espalda', type: 'reps', anim: 'superman', m: 'Espalda baja, glúteos, hombros',
    steps: ['Boca abajo, brazos estirados al frente.', 'Levanta a la vez brazos, pecho y piernas.', 'Mantén 2 segundos y baja despacio.'],
    tip: 'Mira al suelo para no forzar el cuello. Una espalda fuerte mejora tu postura.' },
  wallangel: { n: 'Ángel en la pared', cat: 'Espalda', type: 'reps', anim: 'wallangel', m: 'Postura, hombros, espalda alta', grow: 1,
    steps: ['Espalda, cabeza y glúteos pegados a la pared, codos a 90°.', 'Sube los brazos deslizándolos por la pared hasta estirarlos.', 'Baja despacio. Intenta que codos y manos no se despeguen.'],
    tip: 'Excelente para corregir la postura encorvada y verte más alto.' },
  reach: { n: 'Estírate al cielo', cat: 'Crecer', type: 'time', anim: 'reach', m: 'Columna, hombros', grow: 1,
    steps: ['De pie, entrelaza los dedos y lleva los brazos arriba.', 'Sube sobre las puntas de los pies y estírate lo más largo posible.', 'Imagina que alguien te jala la coronilla hacia el techo.'],
    tip: 'Estirar la columna cada día ayuda a que tu postura sea más alta y recta.' },
  cobra: { n: 'Cobra', cat: 'Crecer', type: 'time', anim: 'cobra', m: 'Columna, abdomen', grow: 1,
    steps: ['Boca abajo, manos bajo los hombros.', 'Empuja con los brazos y sube el pecho, mirando al frente.', 'Hombros lejos de las orejas, pubis pegado al suelo.'],
    tip: 'Sube solo hasta donde no duela la espalda baja.' },
  child: { n: 'Postura del niño', cat: 'Crecer', type: 'time', anim: 'child', m: 'Espalda, caderas', grow: 1,
    steps: ['Arrodíllate y lleva la cadera hacia los talones.', 'Estira los brazos al frente y apoya la frente en el suelo.', 'Respira profundo y suelta la espalda.'],
    tip: 'Descomprime la columna después del entrenamiento.' },
  catcow: { n: 'Gato–vaca', cat: 'Crecer', type: 'time', anim: 'catcow', m: 'Columna, movilidad', grow: 1,
    steps: ['En cuatro apoyos, manos bajo hombros y rodillas bajo caderas.', 'Redondea la espalda mirando al ombligo (gato).', 'Arquea la espalda y mira al frente (vaca). Alterna lento.'],
    tip: 'Sincroniza el movimiento con la respiración.' },
  seatedfold: { n: 'Flexión sentado', cat: 'Crecer', type: 'time', anim: 'seatedfold', m: 'Isquiotibiales, espalda', grow: 1,
    steps: ['Sentado con las piernas estiradas al frente.', 'Inclínate desde la cadera con la espalda larga.', 'Lleva las manos hacia los pies sin forzar.'],
    tip: 'No rebotes. Estira suave y respira. Si no llegas, no pasa nada.' },
  sidebend: { n: 'Inclinación lateral', cat: 'Crecer', type: 'time', anim: 'sidebend', m: 'Costados, columna', grow: 1,
    steps: ['De pie, brazos arriba juntos.', 'Inclínate hacia un lado alargando el costado.', 'Vuelve al centro y cambia de lado.'],
    tip: 'Piensa en estirarte hacia arriba y luego hacia el lado, sin girar el cuerpo.' }
};

/* Cadenas de progresión: la rutina usa la variante y el valor actuales de cada cadena */
var CHAINS = {
  push: [{ ex: 'wallpush', s: 8, max: 20, st: 2 }, { ex: 'kneepush', s: 6, max: 16, st: 1 }, { ex: 'pushup', s: 5, max: 15, st: 1 }, { ex: 'pushpause', s: 4, max: 12, st: 1 }, { ex: 'diamond', s: 4, max: 12, st: 1 }],
  squat: [{ ex: 'squat', s: 10, max: 25, st: 2 }, { ex: 'jumpsquat', s: 8, max: 20, st: 2 }],
  lunge: [{ ex: 'lunge', s: 8, max: 24, st: 2 }, { ex: 'revlunge', s: 8, max: 24, st: 2 }],
  sumo: [{ ex: 'sumo', s: 10, max: 25, st: 2 }],
  wsit: [{ ex: 'wallsit', s: 20, max: 60, st: 5 }],
  calf: [{ ex: 'calf', s: 12, max: 30, st: 2 }],
  glute: [{ ex: 'bridge', s: 10, max: 25, st: 2 }, { ex: 'singlebridge', s: 6, max: 16, st: 2 }],
  kick: [{ ex: 'donkeykick', s: 8, max: 24, st: 2 }],
  bird: [{ ex: 'birddog', s: 8, max: 20, st: 2 }],
  arms: [{ ex: 'dips', s: 6, max: 16, st: 1 }],
  burp: [{ ex: 'burpee', s: 5, max: 15, st: 1 }],
  plank: [{ ex: 'plank', s: 15, max: 60, st: 5 }, { ex: 'climbers', s: 20, max: 45, st: 5 }, { ex: 'sideplank', s: 15, max: 45, st: 5 }],
  cardio: [{ ex: 'highknees', s: 20, max: 45, st: 5 }],
  core: [{ ex: 'crunch', s: 10, max: 30, st: 2 }, { ex: 'deadbug', s: 8, max: 20, st: 2 }, { ex: 'hollow', s: 15, max: 40, st: 5 }, { ex: 'bicycle', s: 12, max: 30, st: 2 }, { ex: 'legraise', s: 8, max: 20, st: 2 }],
  back: [{ ex: 'superman', s: 8, max: 20, st: 2 }, { ex: 'swimmers', s: 10, max: 30, st: 2 }],
  vjump: [{ ex: 'jump', s: 8, max: 20, st: 2 }],
  angel: [{ ex: 'wallangel', s: 8, max: 15, st: 1 }]
};

/* Rutinas (slots = [cadena, series]) */
var WORKOUTS = {
  A: { name: 'Piernas y glúteos', emoji: '🦵', desc: 'Piernas fuertes y glúteos firmes.',
    slots: [['squat', 3], ['sumo', 2], ['lunge', 2], ['glute', 3], ['kick', 2], ['calf', 2], ['wsit', 2]] },
  B: { name: 'Pecho, espalda y core', emoji: '💪', desc: 'Empuje, brazos, espalda y abdomen.',
    slots: [['push', 3], ['arms', 2], ['back', 2], ['core', 3], ['bird', 2], ['plank', 2]] },
  D: { name: 'Core y estabilidad', emoji: '🎯', desc: 'Abdomen, espalda y equilibrio para una postura fuerte.',
    slots: [['core', 3], ['bird', 3], ['plank', 3], ['back', 2], ['glute', 2]] },
  C: { name: 'Cuerpo completo', emoji: '⚡', desc: 'Todo el cuerpo con cardio, saltos y burpees.',
    slots: [['cardio', 2], ['squat', 2], ['push', 2], ['burp', 2], ['vjump', 2], ['plank', 2]] }
};
var QUICK = {
  Q5: { name: 'Rápida · 5 min', emoji: '⏱', desc: 'Para días con poco tiempo: 4 ejercicios, una serie de cada uno.',
    slots: [['squat', 1], ['push', 1], ['core', 1], ['plank', 1]], rest: 15, warm: false,
    cool: [{ ex: 'child', val: 20 }, { ex: 'reach', val: 15 }] },
  Q10: { name: 'Rápida · 10 min', emoji: '⏲', desc: 'Cardio, piernas, empuje y core en solo 10 minutos.',
    slots: [['cardio', 1], ['squat', 2], ['push', 2], ['core', 2], ['plank', 1]], rest: 20, warm: false,
    cool: [{ ex: 'child', val: 25 }, { ex: 'cobra', val: 25 }, { ex: 'reach', val: 20 }] }
};
var POSTURE_ROUTINE = { name: 'Chequeo de postura', emoji: '🧍', label: 'Postura',
  desc: '2 minutos para enderezar la espalda y estirarte. También cuenta para tu racha.',
  items: [{ ex: 'reach', val: 20 }, { ex: 'wallangel', val: 8, type: 'reps' }, { ex: 'catcow', val: 30 }, { ex: 'child', val: 25 }] };

/* Plan de 4 semanas: el día 1 es el día en que empiezas (A, S=estiramientos, R=descanso activo) */
var PLAN_WEEK = ['A', 'S', 'B', 'R', 'C', 'D', 'R'];
var PLAN_ICON = { A: '🦵', B: '💪', C: '⚡', D: '🎯', S: '🌱', R: '🛌' };

var WARM_SETS = {
  cardio: [{ ex: 'jacks', val: 30 }],
  suave: [{ ex: 'catcow', val: 30 }, { ex: 'reach', val: 20 }],
  none: []
};
var COOL_SETS = {
  all: [{ ex: 'child', val: 30 }, { ex: 'cobra', val: 30 }, { ex: 'reach', val: 20 }, { ex: 'sidebend', val: 30 }, { ex: 'seatedfold', val: 30 }],
  legs: [{ ex: 'seatedfold', val: 40 }, { ex: 'child', val: 30 }, { ex: 'catcow', val: 30 }],
  back: [{ ex: 'catcow', val: 30 }, { ex: 'cobra', val: 30 }, { ex: 'child', val: 30 }],
  upper: [{ ex: 'reach', val: 25 }, { ex: 'sidebend', val: 30 }, { ex: 'wallangel', val: 8, type: 'reps' }, { ex: 'child', val: 25 }],
  none: []
};
/* Modo sin saltos: ejercicio silencioso equivalente y factor de repeticiones */
var NOISY = { jumpsquat: ['squat', 1], jump: ['calf', 2], burpee: ['squat', 2], highknees: ['wallsit', 1], jacks: ['catcow', 1] };

var LEVEL_NAMES = ['Novato', 'Aprendiz', 'Atleta', 'Guerrero', 'Experto', 'Máquina', 'Campeón', 'Titán', 'Leyenda', 'Mito'];


/* ---- textos de los 72 ejercicios nuevos ---- */
var NEWEX = {
  pulsesquat: { n: "Sentadilla con pulsos", cat: "Piernas", type: "reps", anim: "pulsesquat", m: "Cuádriceps y glúteos", steps: ["Baja a una sentadilla con la espalda recta.", "Sin subir del todo, haz pequeños rebotes arriba y abajo.", "Pecho alto y rodillas alineadas con los pies."], tip: "Sentirás ardor en los muslos: es normal. Para si te duelen las rodillas.", lv: 2, g: "MF" },
  isosquat: { n: "Sentadilla isométrica", cat: "Piernas", type: "time", anim: "isosquat", m: "Cuádriceps y glúteos", steps: ["Baja hasta que los muslos queden casi paralelos al suelo.", "Mantén la posición sin moverte.", "Respira normal y aprieta los glúteos."], tip: "Si tiemblan las piernas es normal. Sube un poco si lo necesitas.", lv: 2, g: "MF" },
  splitsquat: { n: "Sentadilla dividida", cat: "Piernas", type: "reps", anim: "splitsquat", m: "Cuádriceps y glúteos", steps: ["Da un paso largo con una pierna y deja los pies fijos.", "Baja recto hasta que ambas rodillas estén cerca de 90°.", "Sube sin mover los pies. Haz todas las repeticiones y cambia de pierna."], tip: "Es más estable que la zancada caminando: ideal para empezar.", lv: 1, g: "MFS" },
  lateral: { n: "Zancada lateral", cat: "Piernas", type: "reps", anim: "lateral", m: "Aductores, glúteos y cuádriceps", steps: ["Pies juntos; da un paso largo hacia un lado.", "Dobla esa rodilla llevando la cadera atrás; la otra pierna queda estirada.", "Empuja con el pie para volver y cambia de lado."], tip: "Pecho alto y los dos pies apuntando al frente.", lv: 2, g: "MFS" },
  curtsy: { n: "Zancada cruzada", cat: "Piernas", type: "reps", anim: "curtsy", m: "Glúteos y muslos", steps: ["De pie, lleva una pierna hacia atrás cruzándola detrás de la otra.", "Dobla ambas rodillas como en una reverencia.", "Sube y repite; luego cambia de pierna."], tip: "La rodilla de adelante no debe irse hacia adentro.", lv: 2, g: "MF" },
  skater: { n: "Patinador", cat: "Piernas", type: "reps", anim: "skater", m: "Piernas y equilibrio", steps: ["Desplázate de lado a lado apoyando una sola pierna.", "La otra pierna pasa por detrás, como un patinador.", "Mueve los brazos al contrario para equilibrarte."], tip: "Empieza sin salto (pasos largos) si tu equilibrio aún es flojo.", lv: 2, g: "MF" },
  standkick: { n: "Patada de glúteo de pie", cat: "Piernas", type: "reps", anim: "standkick", m: "Glúteos", steps: ["De pie, apóyate en una pierna con la rodilla un poco flexionada.", "Lleva la otra pierna hacia atrás y arriba apretando el glúteo.", "Vuelve sin tocar el suelo y repite; luego cambia."], tip: "Mantén el torso firme, sin arquear la espalda baja.", lv: 1, g: "MFS" },
  bridgemarch: { n: "Puente con marcha", cat: "Piernas", type: "reps", anim: "bridgemarch", m: "Glúteos y core", steps: ["Haz un puente de glúteos y mantén la cadera arriba.", "Levanta una rodilla hacia el pecho sin mover la cadera.", "Baja el pie y levanta la otra rodilla, alternando."], tip: "Si la cadera cae o se balancea, hazlo más lento.", lv: 2, g: "MF" },
  singlecalf: { n: "Talones a una pierna", cat: "Piernas", type: "reps", anim: "singlecalf", m: "Gemelos y equilibrio", steps: ["Apóyate en una pierna (puedes tocar la pared).", "Sube sobre la punta del pie lo más alto posible.", "Baja despacio y repite; luego cambia de pierna."], tip: "Pausa un segundo arriba. Es mucho más difícil que con dos piernas.", lv: 2, g: "MF" },
  jumplunge: { n: "Zancada con salto", cat: "Piernas", type: "reps", anim: "jumplunge", m: "Piernas y cardio", steps: ["Empieza en posición de zancada.", "Salta y cambia de pierna en el aire.", "Aterriza suave en otra zancada con control."], tip: "Aterriza sin ruido. Si te duelen las rodillas, usa la zancada normal.", lv: 3, g: "MF" },
  tuckjump: { n: "Salto con rodillas al pecho", cat: "Piernas", type: "reps", anim: "tuckjump", m: "Potencia de piernas", steps: ["Flexiona un poco las rodillas y balancea los brazos.", "Salta y lleva las rodillas hacia el pecho.", "Aterriza suave con las rodillas flexionadas."], tip: "Salta con fuerza pero aterriza con control.", lv: 3, g: "MF" },
  goodmorning: { n: "Buenos días", cat: "Piernas", type: "reps", anim: "goodmorning", m: "Isquios y espalda baja", steps: ["De pie, manos detrás de la cabeza y rodillas un poco flexionadas.", "Inclina el torso llevando la cadera hacia atrás.", "Sube apretando los glúteos, con la espalda siempre recta."], tip: "Es una bisagra de cadera: la espalda no se redondea.", lv: 1, g: "MFS" },
  slrdl: { n: "Peso muerto a una pierna", cat: "Piernas", type: "reps", anim: "slrdl", m: "Isquios, glúteos y equilibrio", steps: ["Apóyate en una pierna con la rodilla ligeramente flexionada.", "Inclina el torso mientras la otra pierna sube hacia atrás.", "Vuelve a la posición de pie y repite; luego cambia."], tip: "Mira un punto fijo en el suelo para no perder el equilibrio.", lv: 3, g: "M" },
  bridgehold: { n: "Puente isométrico", cat: "Piernas", type: "time", anim: "bridgehold", m: "Glúteos y espalda baja", steps: ["Boca arriba, rodillas dobladas y pies en el suelo.", "Sube la cadera hasta formar una línea recta.", "Mantén apretando los glúteos y respirando normal."], tip: "No arquees la espalda baja.", lv: 1, g: "MFS" },
  widepush: { n: "Flexión abierta", cat: "Pecho y brazos", type: "reps", anim: "pushup", m: "Pecho y hombros", steps: ["Posición de flexión con las manos más abiertas que los hombros.", "Baja el pecho hasta casi tocar el suelo.", "Empuja para subir con el cuerpo recto."], tip: "Trabaja más el pecho. Si es muy difícil, hazla de rodillas.", lv: 2, g: "MF" },
  slowpush: { n: "Flexión lenta", cat: "Pecho y brazos", type: "reps", anim: "slowpush", m: "Pecho, hombros y tríceps", steps: ["Posición de flexión normal.", "Baja contando 3 segundos.", "Sube en 1 segundo, controlando todo el recorrido."], tip: "Lento = más músculo trabajando con menos repeticiones.", lv: 2, g: "M" },
  plankshoulder: { n: "Plancha con toque de hombro", cat: "Pecho y brazos", type: "time", anim: "plankshoulder", m: "Core y hombros", steps: ["Posición de plancha alta con los pies un poco abiertos.", "Lleva una mano al hombro contrario sin girar la cadera.", "Cambia de mano con ritmo constante."], tip: "Abre más los pies para estabilizar la cadera.", lv: 2, g: "MF" },
  plankupdown: { n: "Plancha arriba y abajo", cat: "Pecho y brazos", type: "time", anim: "plankupdown", m: "Core, hombros y tríceps", steps: ["Empieza en plancha de antebrazos.", "Sube una mano y luego la otra hasta la plancha alta.", "Baja de nuevo de a una mano y alterna cuál empieza."], tip: "Mantén la cadera quieta, sin balancearla.", lv: 3, g: "M" },
  bearhold: { n: "Posición de oso", cat: "Pecho y brazos", type: "time", anim: "bearhold", m: "Core, hombros y piernas", steps: ["En cuatro apoyos, manos bajo los hombros y rodillas bajo la cadera.", "Levanta las rodillas unos 3 cm del suelo.", "Mantén la espalda plana y respira normal."], tip: "No subas la cadera: la espalda debe quedar como una mesa.", lv: 2, g: "MF" },
  inchworm: { n: "Gusano", cat: "Pecho y brazos", type: "reps", anim: "inchworm", m: "Cuerpo completo y movilidad", steps: ["De pie, inclínate y apoya las manos en el suelo (rodillas flexionadas si hace falta).", "Camina con las manos hacia adelante hasta la plancha.", "Camina hacia los pies y ponte de pie."], tip: "Es un excelente calentamiento y estira los isquios.", lv: 2, g: "MFS" },
  pressup: { n: "Press de hombros sin peso", cat: "Pecho y brazos", type: "reps", anim: "pressup", m: "Hombros y tríceps", steps: ["De pie, codos a los lados a 90° con las manos arriba.", "Estira los brazos sobre la cabeza.", "Baja controlado a la posición inicial."], tip: "Aprieta el abdomen para que la espalda no se arquee.", lv: 1, g: "MFS" },
  tricepkick: { n: "Patada de tríceps", cat: "Pecho y brazos", type: "reps", anim: "tricepkick", m: "Tríceps", steps: ["Inclina el torso con la espalda recta y los codos pegados hacia atrás.", "Estira los antebrazos hacia atrás hasta enderezar los brazos.", "Dobla de nuevo despacio."], tip: "Solo se mueve el antebrazo; el codo queda quieto.", lv: 1, g: "MF" },
  kneeplank: { n: "Plancha de rodillas", cat: "Pecho y brazos", type: "time", anim: "kneeplank", m: "Core y hombros", steps: ["Apoya antebrazos y rodillas en el suelo.", "Forma una línea recta de rodillas a cabeza.", "Aprieta abdomen y glúteos y respira normal."], tip: "Es el primer paso antes de la plancha completa.", lv: 1, g: "MFS" },
  tricepknee: { n: "Flexión de tríceps de rodillas", cat: "Pecho y brazos", type: "reps", anim: "kneepush", m: "Tríceps y pecho", steps: ["Apoya las rodillas y pon las manos bajo los hombros.", "Baja el pecho con los codos pegados al cuerpo hacia atrás.", "Empuja para subir sin abrir los codos."], tip: "Con los codos pegados trabajas más el tríceps.", lv: 1, g: "MF" },
  russian: { n: "Giro ruso", cat: "Core", type: "reps", anim: "russian", m: "Oblicuos y abdomen", steps: ["Sentado, inclínate hacia atrás con los pies levantados o apoyados.", "Gira el torso llevando las manos de un lado al otro.", "Mantén la espalda recta y el abdomen firme."], tip: "Si te cuesta, apoya los talones en el suelo.", lv: 2, g: "MF" },
  vup: { n: "Abdominal en V", cat: "Core", type: "reps", anim: "vup", m: "Abdomen completo", steps: ["Boca arriba con brazos y piernas estirados.", "Sube a la vez torso y piernas formando una V.", "Baja con control sin tocar el suelo."], tip: "Si es muy difícil, dobla las rodillas.", lv: 3, g: "M" },
  flutter: { n: "Patadas de aleteo", cat: "Core", type: "time", anim: "flutter", m: "Abdomen bajo", steps: ["Boca arriba con las manos bajo la cadera y las piernas estiradas.", "Levanta los pies unos 20 cm del suelo.", "Sube y baja las piernas alternando en movimientos cortos."], tip: "Pega la espalda baja al suelo.", lv: 2, g: "MF" },
  scissors: { n: "Tijeras", cat: "Core", type: "time", anim: "scissors", m: "Abdomen bajo", steps: ["Boca arriba, manos detrás de la cabeza y piernas estiradas arriba.", "Abre y cruza las piernas como unas tijeras.", "Hombros despegados y espalda baja pegada al suelo."], tip: "Cuanto más bajas las piernas, más difícil.", lv: 2, g: "MF" },
  reversecrunch: { n: "Abdominal inverso", cat: "Core", type: "reps", anim: "reversecrunch", m: "Abdomen bajo", steps: ["Boca arriba con las rodillas dobladas sobre la cadera.", "Lleva las rodillas al pecho subiendo ligeramente la cadera.", "Baja despacio sin dejar caer las piernas."], tip: "No te des impulso: sube con el abdomen.", lv: 2, g: "MF" },
  plankreach: { n: "Plancha con alcance", cat: "Core", type: "time", anim: "plankreach", m: "Core y hombros", steps: ["Posición de plancha alta con los pies abiertos.", "Estira un brazo hacia adelante sin mover la cadera.", "Vuelve y alterna."], tip: "Cuanto más abiertos los pies, más fácil.", lv: 3, g: "M" },
  plankknee: { n: "Plancha con rodilla al codo", cat: "Core", type: "time", anim: "plankknee", m: "Core y oblicuos", steps: ["Empieza en plancha de antebrazos.", "Lleva una rodilla hacia el codo del mismo lado.", "Vuelve a la plancha y alterna."], tip: "Mantén los hombros sobre los codos.", lv: 3, g: "MF" },
  mountainslow: { n: "Escalador lento", cat: "Core", type: "time", anim: "mountainslow", m: "Core y hombros", steps: ["Posición de plancha alta.", "Lleva una rodilla al pecho despacio y controlada.", "Regresa y cambia; la cadera se mantiene baja."], tip: "Más lento = más control y más trabajo de abdomen.", lv: 2, g: "MF" },
  boat: { n: "Postura del bote", cat: "Core", type: "time", anim: "boat", m: "Abdomen y flexores de cadera", steps: ["Sentado con las rodillas dobladas, inclínate un poco hacia atrás.", "Levanta los pies y estira los brazos al frente.", "Mantén la espalda larga y respira."], tip: "Si es muy duro, deja los pies en el suelo.", lv: 2, g: "MFS" },
  situp: { n: "Abdominal completo", cat: "Core", type: "reps", anim: "situp", m: "Abdomen", steps: ["Boca arriba con las rodillas dobladas y los brazos al frente.", "Sube el torso hasta quedar sentado, sin tirar del cuello.", "Baja despacio."], tip: "Sube y baja sin impulso.", lv: 1, g: "MF" },
  sidecrunch: { n: "Abdominal lateral de pie", cat: "Core", type: "reps", anim: "sidecrunch", m: "Oblicuos", steps: ["De pie, manos detrás de la cabeza.", "Lleva una rodilla hacia el codo del mismo lado inclinando el torso.", "Vuelve y cambia de lado."], tip: "Muy cómodo para las rodillas y la espalda.", lv: 1, g: "MFS" },
  legholds: { n: "Piernas elevadas isométrico", cat: "Core", type: "time", anim: "legholds", m: "Abdomen bajo", steps: ["Boca arriba, piernas estiradas y manos bajo la cadera.", "Sube las piernas a unos 45° y mantén.", "No dejes que la espalda baja se despegue."], tip: "Si la espalda se despega, sube más las piernas.", lv: 2, g: "MF" },
  hollowrock: { n: "Balanceo hueco", cat: "Core", type: "reps", anim: "hollowrock", m: "Abdomen profundo", steps: ["Adopta la postura de hueco abdominal.", "Balancéate hacia adelante y atrás como una mecedora.", "Mantén la forma de banana todo el tiempo."], tip: "Es avanzado: domina antes el hueco isométrico.", lv: 3, g: "M" },
  yraise: { n: "Elevación en Y", cat: "Espalda", type: "reps", anim: "yraise", m: "Espalda alta y hombros", steps: ["Boca abajo con los brazos estirados formando una Y.", "Levanta brazos y pecho del suelo.", "Baja despacio."], tip: "Mira al suelo, con los pulgares hacia el techo.", lv: 1, g: "MFSC" },
  reversesnow: { n: "Ángel de nieve invertido", cat: "Espalda", type: "reps", anim: "reversesnow", m: "Espalda alta y hombros", steps: ["Boca abajo con los brazos al frente y el pecho levantado.", "Lleva los brazos hacia atrás hasta las caderas.", "Regresa sin bajar el pecho."], tip: "Mueve los brazos despacio y con control.", lv: 2, g: "MFSC" },
  backext: { n: "Extensión de espalda", cat: "Espalda", type: "reps", anim: "backext", m: "Espalda baja", steps: ["Boca abajo con las manos detrás de la cabeza.", "Sube el pecho del suelo apretando la espalda.", "Baja despacio."], tip: "No eleves demasiado el cuello: mira al suelo.", lv: 1, g: "MFSC" },
  scapsqueeze: { n: "Retracción de omóplatos", cat: "Espalda", type: "reps", anim: "scapsqueeze", m: "Espalda alta y postura", steps: ["De pie con los codos doblados a 90° al frente.", "Junta los omóplatos llevando los codos hacia atrás.", "Aguanta 2 segundos y suelta."], tip: "Ideal si pasas mucho tiempo sentado.", lv: 1, g: "FSC" },
  supermanrow: { n: "Superman con remo", cat: "Espalda", type: "reps", anim: "supermanrow", m: "Espalda y glúteos", steps: ["Boca abajo con los brazos al frente, levanta pecho y piernas.", "Lleva los codos hacia atrás como remando.", "Vuelve a estirar los brazos."], tip: "Aprieta los omóplatos al remar.", lv: 2, g: "MF" },
  birddoghold: { n: "Perro–pájaro isométrico", cat: "Espalda", type: "time", anim: "birddoghold", m: "Espalda baja y core", steps: ["En cuatro apoyos con la espalda plana.", "Estira un brazo y la pierna contraria y mantén.", "Cambia de lado a mitad del tiempo."], tip: "Imagina un vaso de agua sobre tu espalda.", lv: 2, g: "MFS" },
  reverseplank: { n: "Plancha invertida", cat: "Espalda", type: "time", anim: "reverseplank", m: "Glúteos, espalda y hombros", steps: ["Sentado con las manos atrás y las piernas estiradas.", "Sube la cadera formando una línea recta.", "Mantén mirando al frente."], tip: "Si te cuesta, dobla las rodillas.", lv: 2, g: "MF" },
  supermanhold: { n: "Superman isométrico", cat: "Espalda", type: "time", anim: "supermanhold", m: "Espalda baja y glúteos", steps: ["Boca abajo con los brazos al frente.", "Levanta brazos, pecho y piernas del suelo.", "Mantén respirando con calma."], tip: "Mira al suelo para cuidar el cuello.", lv: 1, g: "MFSC" },
  jumprope: { n: "Cuerda imaginaria", cat: "Cardio", type: "time", anim: "jumprope", m: "Cardio y gemelos", steps: ["De pie, manos a los lados como sosteniendo una cuerda.", "Salta suavemente sobre las puntas de los pies.", "Gira las muñecas al ritmo."], tip: "Saltos pequeños y ligeros.", lv: 1, g: "MFS" },
  buttkicks: { n: "Talones al glúteo", cat: "Cardio", type: "time", anim: "buttkicks", m: "Cardio y piernas", steps: ["Trota en el sitio.", "Lleva los talones hacia los glúteos.", "Mueve los brazos al ritmo."], tip: "Mantén el torso erguido.", lv: 1, g: "MF" },
  march: { n: "Marcha en el sitio", cat: "Cardio", type: "time", anim: "march", m: "Cardio suave", steps: ["De pie, camina sin avanzar.", "Sube las rodillas hasta la cadera con un ritmo cómodo.", "Mueve los brazos opuestos."], tip: "Perfecta si empiezas o necesitas bajo impacto.", lv: 1, g: "FS" },
  sidehop: { n: "Saltos laterales", cat: "Cardio", type: "time", anim: "sidehop", m: "Cardio y piernas", steps: ["Salta de lado a lado con los pies juntos.", "Aterriza suave.", "Mueve los brazos para impulsarte."], tip: "Empieza con saltos pequeños.", lv: 2, g: "MF" },
  shadowbox: { n: "Boxeo al aire", cat: "Cardio", type: "time", anim: "shadowbox", m: "Cardio, hombros y core", steps: ["Posición de guardia con las rodillas flexionadas.", "Lanza golpes rectos alternando brazos.", "Gira un poco la cadera con cada golpe."], tip: "Mantén siempre una mano protegiendo la cara.", lv: 1, g: "MFS" },
  halfburpee: { n: "Medio burpee", cat: "Cardio", type: "reps", anim: "halfburpee", m: "Cuerpo completo", steps: ["De pie, agáchate y apoya las manos.", "Lleva los pies atrás a plancha y regresa.", "Ponte de pie sin saltar."], tip: "La versión amable del burpee.", lv: 1, g: "MF" },
  starjump: { n: "Salto estrella", cat: "Cardio", type: "reps", anim: "starjump", m: "Cardio y piernas", steps: ["Agáchate un poco con los brazos abajo.", "Salta abriendo brazos y piernas como una estrella.", "Aterriza suave y repite."], tip: "Aterriza con las rodillas flexionadas.", lv: 2, g: "MF" },
  bearcrawl: { n: "Caminata de oso", cat: "Cardio", type: "time", anim: "bearcrawl", m: "Cuerpo completo", steps: ["En cuatro apoyos con las rodillas despegadas.", "Mueve mano y pie contrarios dando pasos cortos.", "Mantén la espalda plana."], tip: "Hazlo despacio y controlado.", lv: 2, g: "MF" },
  crab: { n: "Cangrejo", cat: "Cardio", type: "time", anim: "crab", m: "Hombros, tríceps y core", steps: ["Sentado con las manos atrás y la cadera arriba.", "Levanta una pierna estirada y cambia.", "Mantén la cadera alta."], tip: "Mira al frente y no dejes caer la cadera.", lv: 2, g: "MF" },
  fastfeet: { n: "Pies rápidos", cat: "Cardio", type: "time", anim: "fastfeet", m: "Cardio y coordinación", steps: ["Pies a la anchura de la cadera, rodillas flexionadas.", "Mueve los pies muy rápido y ligero.", "Brazos relajados."], tip: "Pasos muy cortos y rápidos.", lv: 1, g: "MF" },
  hamstringstand: { n: "Estiramiento de isquios de pie", cat: "Crecer", type: "time", anim: "hamstringstand", m: "Isquiotibiales y espalda", steps: ["De pie, estira los brazos hacia arriba.", "Inclínate hacia adelante desde la cadera con la espalda larga.", "Deja colgar brazos y cabeza."], tip: "Dobla un poco las rodillas si tiras demasiado.", lv: 1, g: "SC", grow: 1 },
  quadstretch: { n: "Estiramiento de cuádriceps", cat: "Crecer", type: "time", anim: "quadstretch", m: "Cuádriceps", steps: ["De pie, dobla una rodilla llevando el talón al glúteo.", "Sujeta el pie con la mano del mismo lado.", "Mantén las rodillas juntas y cambia de pierna."], tip: "Apóyate en la pared si pierdes el equilibrio.", lv: 1, g: "SC", grow: 1 },
  calfstretch: { n: "Estiramiento de gemelos en pared", cat: "Crecer", type: "time", anim: "calfstretch", m: "Gemelos", steps: ["Frente a una pared, apoya las manos.", "Da un paso atrás con una pierna estirada y el talón en el suelo.", "Inclina el cuerpo hacia la pared y cambia de pierna."], tip: "El talón de atrás no debe despegarse.", lv: 1, g: "SC", grow: 1 },
  butterfly: { n: "Mariposa", cat: "Crecer", type: "time", anim: "butterfly", m: "Cadera y aductores", steps: ["Sentado, junta las plantas de los pies.", "Deja caer las rodillas hacia los lados.", "Inclínate suavemente con la espalda recta."], tip: "No empujes las rodillas con fuerza.", lv: 1, g: "SC", grow: 1 },
  hipflexor: { n: "Estiramiento de cadera", cat: "Crecer", type: "time", anim: "hipflexor", m: "Flexores de cadera", steps: ["En zancada con la rodilla de atrás en el suelo.", "Lleva la cadera hacia adelante y sube los brazos.", "Mantén y cambia de pierna."], tip: "Aprieta el glúteo de la pierna de atrás.", lv: 1, g: "SC", grow: 1 },
  kneehug: { n: "Abrazo de rodilla", cat: "Crecer", type: "time", anim: "kneehug", m: "Cadera y espalda baja", steps: ["Boca arriba, lleva una rodilla al pecho.", "Abrázala con ambas manos.", "Mantén y cambia de pierna."], tip: "La otra pierna se queda estirada en el suelo.", lv: 1, g: "SC", grow: 1 },
  backrock: { n: "Balanceo de espalda", cat: "Crecer", type: "time", anim: "backrock", m: "Columna y espalda", steps: ["Boca arriba, abraza ambas rodillas.", "Balancéate suavemente hacia atrás y adelante.", "Respira profundo."], tip: "Un masaje suave para la columna.", lv: 1, g: "SC", grow: 1 },
  neckroll: { n: "Rotación de cuello", cat: "Movilidad", type: "time", anim: "neckroll", m: "Cuello y trapecios", steps: ["De pie, hombros relajados.", "Inclina suavemente la cabeza de un lado a otro.", "Movimientos lentos, sin forzar."], tip: "Nunca fuerces el cuello ni gires con prisa.", lv: 1, g: "SC", grow: 1 },
  armcircles: { n: "Círculos de brazos", cat: "Movilidad", type: "time", anim: "armcircles", m: "Hombros", steps: ["Brazos abiertos a los lados.", "Haz círculos pequeños hacia adelante.", "Luego hacia atrás, aumentando el tamaño."], tip: "Excelente calentamiento para los hombros.", lv: 1, g: "FSC", grow: 1 },
  armhug: { n: "Aperturas de brazos", cat: "Movilidad", type: "time", anim: "armhug", m: "Pecho y espalda alta", steps: ["Brazos abiertos a los lados.", "Abrázate cruzando los brazos.", "Ábrelos con fuerza hacia atrás."], tip: "Mantén el torso erguido.", lv: 1, g: "FSC", grow: 1 },
  torsostand: { n: "Giro de torso de pie", cat: "Movilidad", type: "time", anim: "torsostand", m: "Columna y oblicuos", steps: ["Pies al ancho de los hombros.", "Gira el torso a un lado con los brazos sueltos.", "Cambia de lado de forma fluida."], tip: "Gira desde el torso, no desde las rodillas.", lv: 1, g: "FSC", grow: 1 },
  hipcircle: { n: "Círculos de cadera", cat: "Movilidad", type: "time", anim: "hipcircle", m: "Cadera", steps: ["Manos en la cintura.", "Dibuja círculos grandes con la cadera.", "Cambia de sentido."], tip: "Movimientos amplios y suaves.", lv: 1, g: "FSC", grow: 1 },
  ankle: { n: "Círculos de tobillo", cat: "Movilidad", type: "time", anim: "ankle", m: "Tobillos", steps: ["Apoya una pierna y levanta el otro pie.", "Dibuja círculos con la punta del pie.", "Cambia de sentido y de pie."], tip: "Excelente para prevenir esguinces.", lv: 1, g: "FSC", grow: 1 },
  breathe: { n: "Respiración profunda", cat: "Movilidad", type: "time", anim: "breathe", m: "Pulmones y columna", steps: ["De pie, brazos abajo.", "Inhala subiendo los brazos hacia arriba.", "Exhala bajándolos despacio."], tip: "Respira por la nariz y suelta el aire lento.", lv: 1, g: "FSC", grow: 1 },
  shouldercross: { n: "Hombro cruzado", cat: "Movilidad", type: "time", anim: "shouldercross", m: "Hombros", steps: ["Lleva un brazo estirado a través del pecho.", "Con el otro brazo presiónalo suavemente.", "Mantén y cambia."], tip: "No gires el torso.", lv: 1, g: "SC", grow: 1 },
  tricepstretch: { n: "Estiramiento de tríceps", cat: "Movilidad", type: "time", anim: "tricepstretch", m: "Tríceps y hombros", steps: ["Sube un brazo y dobla el codo llevando la mano a la espalda.", "Con la otra mano empuja el codo hacia atrás.", "Mantén y cambia."], tip: "Mantén el cuello relajado.", lv: 1, g: "SC", grow: 1 },
  chestopen: { n: "Apertura de pecho", cat: "Movilidad", type: "time", anim: "chestopen", m: "Pecho y hombros", steps: ["De pie, junta las manos detrás de la espalda.", "Estira los brazos hacia atrás y abajo.", "Saca el pecho y mira al frente."], tip: "Excelente contra la postura encorvada.", lv: 1, g: "FSC", grow: 1 },
};
Object.keys(NEWEX).forEach(function (k) { EX[k] = NEWEX[k]; });
var OLDLV = {"squat": [1, "MF"], "jumpsquat": [3, "MFC"], "jump": [2, "MFC"], "lunge": [1, "MF"], "wallsit": [1, "MF"], "calf": [1, "MFS"], "bridge": [1, "MFS"], "highknees": [1, "MF"], "jacks": [1, "MFS"], "wallpush": [1, "MFS"], "kneepush": [1, "MF"], "pushup": [2, "MF"], "pushpause": [3, "M"], "plank": [1, "MFS"], "climbers": [2, "MF"], "crunch": [1, "MF"], "deadbug": [1, "MFS"], "superman": [1, "MFSC"], "wallangel": [1, "FSC"], "reach": [1, "SC"], "cobra": [1, "SC"], "child": [1, "SC"], "catcow": [1, "SC"], "seatedfold": [1, "SC"], "sidebend": [1, "SC"], "singlebridge": [2, "MF"], "donkeykick": [1, "MFS"], "birddog": [1, "MFS"], "hollow": [3, "M"], "burpee": [3, "MF"], "dips": [2, "MF"], "legraise": [2, "MF"], "bicycle": [2, "MF"], "revlunge": [2, "MF"], "sideplank": [2, "MF"], "sumo": [1, "MF"], "swimmers": [2, "MFC"], "diamond": [3, "M"]};
Object.keys(OLDLV).forEach(function (k) { if (EX[k]) { EX[k].lv = OLDLV[k][0]; EX[k].g = OLDLV[k][1]; } });
ANIMS.mountainslow = { view: 'side', fix: 'w1', fixX: 160, poses: [
  { t: -18.4, hd: -26, a1: [90, 90], a2: [90, 90], l1: [161.6, 161.6], ft1: 75, l2: [40, 125], ft2: 60, d: 900, h: 150 },
  { t: -18.4, hd: -26, a1: [90, 90], a2: [90, 90], l2: [161.6, 161.6], ft2: 75, l1: [40, 125], ft1: 60, d: 900, h: 150 }] };

/* progresiones: variantes nuevas al final de cada cadena (no cambian el índice de quien ya avanzó) */
CHAINS.glute.push({ ex: 'bridgemarch', s: 8, max: 20, st: 2 });
CHAINS.vjump.push({ ex: 'tuckjump', s: 6, max: 16, st: 2 });



/* ======================= OBJETIVOS, NIVELES Y PROGRAMAS ======================= */
var GOALS = {
  musculo: { n: 'Ganar masa muscular', e: '💪', d: 'Más fuerza y músculo con ejercicios que van subiendo de dificultad.', tag: 'M', rest: 60, days: 4 },
  forma: { n: 'Mantenerme en forma', e: '⚖️', d: 'Un poco de todo: fuerza, cardio y movilidad para sentirte bien.', tag: 'F', rest: 40, days: 3 },
  salud: { n: 'Salud y bienestar', e: '❤️', d: 'Bajo impacto, movilidad, postura y energía para el día a día.', tag: 'S', rest: 30, days: 3 },
  crecer: { n: 'Crecer y postura', e: '🌱', d: 'Estiramientos, postura y fuerza suave para dar lo mejor de ti.', tag: 'C', rest: 40, days: 4 }
};
var LEVELS = [
  { n: 'Principiante', e: '🌱', d: 'Empiezo ahora o hace mucho que no entreno.' },
  { n: 'Intermedio', e: '💪', d: 'Entreno de vez en cuando y domino lo básico.' },
  { n: 'Experto', e: '🔥', d: 'Entreno con constancia y busco retos.' }
];
/* cada día = lista de [categoría, cuántos ejercicios] */
var PROG_T = {
  musculo: [
    { name: 'Piernas y glúteos', emoji: '🦵', desc: 'Fuerza de piernas y glúteos.', picks: [['Piernas', 4], ['Core', 1]] },
    { name: 'Pecho, brazos y hombros', emoji: '💪', desc: 'Empuje y brazos.', picks: [['Pecho y brazos', 5], ['Core', 1]] },
    { name: 'Espalda y core', emoji: '🛡', desc: 'Espalda fuerte y abdomen firme.', picks: [['Espalda', 3], ['Core', 3]] },
    { name: 'Cuerpo completo', emoji: '⚡', desc: 'Todo el cuerpo con un final de cardio.', picks: [['Piernas', 2], ['Pecho y brazos', 2], ['Core', 1], ['Cardio', 1]] }],
  forma: [
    { name: 'Cardio y piernas', emoji: '🏃', desc: 'Corazón y piernas en marcha.', picks: [['Cardio', 3], ['Piernas', 3]] },
    { name: 'Tren superior y core', emoji: '💪', desc: 'Brazos, espalda y abdomen.', picks: [['Pecho y brazos', 3], ['Core', 2], ['Espalda', 1]] },
    { name: 'Circuito completo', emoji: '⚡', desc: 'Un poco de todo.', picks: [['Piernas', 2], ['Pecho y brazos', 1], ['Core', 1], ['Cardio', 1], ['Espalda', 1]] },
    { name: 'Movilidad y core', emoji: '🧘', desc: 'Flexibilidad y abdomen.', picks: [['Movilidad', 2], ['Core', 3], ['Crecer', 1]] }],
  salud: [
    { name: 'Cardio suave y movilidad', emoji: '🚶', desc: 'Activa el cuerpo sin impacto.', picks: [['Cardio', 2], ['Movilidad', 3], ['Crecer', 1]] },
    { name: 'Fuerza suave', emoji: '🦵', desc: 'Piernas, espalda y core con cuidado.', picks: [['Piernas', 2], ['Espalda', 2], ['Core', 2]] },
    { name: 'Postura y espalda', emoji: '🧍', desc: 'Espalda fuerte y buena postura.', picks: [['Espalda', 3], ['Movilidad', 2], ['Crecer', 1]] },
    { name: 'Estirar y respirar', emoji: '🌬', desc: 'Relajación y flexibilidad.', picks: [['Crecer', 3], ['Movilidad', 3]] }],
  crecer: [
    { name: 'Piernas y saltos', emoji: '🦘', desc: 'Piernas fuertes y ejercicios de impacto controlado.', picks: [['Piernas', 4], ['Cardio', 1], ['Crecer', 1]] },
    { name: 'Postura y espalda', emoji: '🧍', desc: 'Espalda erguida y hombros abiertos.', picks: [['Espalda', 3], ['Movilidad', 2], ['Crecer', 1]] },
    { name: 'Estiramientos de columna', emoji: '🌱', desc: 'Alarga y descomprime la columna.', picks: [['Crecer', 4], ['Movilidad', 2]] },
    { name: 'Core y cardio', emoji: '🔥', desc: 'Abdomen firme y energía.', picks: [['Core', 3], ['Cardio', 2], ['Crecer', 1]] }]
};

var WARMUP = [{ ex: 'jacks', val: 30 }];
var COOLDOWN = [{ ex: 'child', val: 30 }, { ex: 'cobra', val: 30 }, { ex: 'reach', val: 20 }, { ex: 'sidebend', val: 30 }, { ex: 'seatedfold', val: 30 }];
var STRETCH_ROUTINE = { name: 'Crecer · estiramientos', emoji: '🌱', desc: 'Rutina suave de 6 minutos para postura y columna. También mantiene tu racha en días de descanso.',
  items: [{ ex: 'catcow', val: 40 }, { ex: 'child', val: 40 }, { ex: 'cobra', val: 40 }, { ex: 'reach', val: 30 }, { ex: 'sidebend', val: 40 }, { ex: 'seatedfold', val: 40 }, { ex: 'wallangel', val: 10, type: 'reps' }] };

var TIPS = [
  'Dormir 8–10 horas es cuando tu cuerpo libera hormona de crecimiento. Es tan importante como entrenar.',
  'Come proteína en cada comida (huevos, pollo, legumbres, lácteos): es el material para tus músculos.',
  'Tu estatura depende sobre todo de la genética, pero dormir, comer bien y ejercitarte te ayudan a alcanzar tu máximo.',
  'Una postura recta puede hacerte ver 1–2 cm más alto. ¡Practica estar erguido!',
  'Tomar sol unos minutos al día ayuda a producir vitamina D, clave para huesos fuertes.',
  'Bebe agua durante el día; los músculos hidratados rinden más.',
  'Los músculos crecen mientras descansas, no mientras entrenas. Respeta los días libres.',
  'Constancia > intensidad. Es mejor entrenar 15 minutos todos los días que 2 horas una vez al mes.',
  'Calienta antes y estira después: evita lesiones y mejora tu movilidad.',
  'Mide tu estatura cada 2–4 semanas, a la misma hora (por la mañana eres un poco más alto).'
];

var BADGES = [
  { id: 'first', e: '🌟', n: 'Primer entrenamiento', f: function (s) { return s.total >= 1; } },
  { id: 'w5', e: '💪', n: '5 entrenamientos', f: function (s) { return s.total >= 5; } },
  { id: 'w15', e: '🏅', n: '15 entrenamientos', f: function (s) { return s.total >= 15; } },
  { id: 'w40', e: '🏆', n: '40 entrenamientos', f: function (s) { return s.total >= 40; } },
  { id: 's3', e: '🔥', n: 'Racha de 3 días', f: function (s) { return s.best >= 3; } },
  { id: 's7', e: '🚀', n: 'Racha de 7 días', f: function (s) { return s.best >= 7; } },
  { id: 's14', e: '⚡', n: 'Racha de 14 días', f: function (s) { return s.best >= 14; } },
  { id: 's30', e: '👑', n: 'Racha de 30 días', f: function (s) { return s.best >= 30; } },
  { id: 'lvl3', e: '⭐', n: 'Nivel 3', f: function (s) { return s.lvl >= 3; } },
  { id: 'lvl6', e: '🌠', n: 'Nivel 6', f: function (s) { return s.lvl >= 6; } },
  { id: 'goal1', e: '🎯', n: 'Meta semanal cumplida', f: function (s) { return s.goalsHit >= 1; } },
  { id: 'goal4', e: '🎖', n: '4 metas semanales', f: function (s) { return s.goalsHit >= 4; } },
  { id: 'reps100', e: '💯', n: '100 reps en un día', f: function (s) { return s.maxReps >= 100; } },
  { id: 'early', e: '🌅', n: 'Madrugador (antes de las 8)', f: function (s) { return s.early; } },
  { id: 'habits7', e: '💧', n: '7 días de hábitos completos', f: function (s) { return s.habitDays >= 7; } },
  { id: 'plan', e: '📅', n: 'Plan de 4 semanas', f: function (s) { return s.planDone; } },
  { id: 'push', e: '🦾', n: 'Llegaste a flexión normal', f: function (s) { return s.chains.push && s.chains.push.i >= 2; } }
];
