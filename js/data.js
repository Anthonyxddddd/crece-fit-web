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
  push: [{ ex: 'wallpush', s: 8, max: 20, st: 2 }, { ex: 'kneepush', s: 6, max: 16, st: 1 }, { ex: 'pushup', s: 5, max: 15, st: 1 }, { ex: 'pushpause', s: 4, max: 12, st: 1 }],
  squat: [{ ex: 'squat', s: 10, max: 25, st: 2 }, { ex: 'jumpsquat', s: 8, max: 20, st: 2 }],
  lunge: [{ ex: 'lunge', s: 8, max: 24, st: 2 }],
  wsit: [{ ex: 'wallsit', s: 20, max: 60, st: 5 }],
  calf: [{ ex: 'calf', s: 12, max: 30, st: 2 }],
  glute: [{ ex: 'bridge', s: 10, max: 25, st: 2 }, { ex: 'singlebridge', s: 6, max: 16, st: 2 }],
  kick: [{ ex: 'donkeykick', s: 8, max: 24, st: 2 }],
  bird: [{ ex: 'birddog', s: 8, max: 20, st: 2 }],
  arms: [{ ex: 'dips', s: 6, max: 16, st: 1 }],
  burp: [{ ex: 'burpee', s: 5, max: 15, st: 1 }],
  plank: [{ ex: 'plank', s: 15, max: 60, st: 5 }, { ex: 'climbers', s: 20, max: 45, st: 5 }],
  cardio: [{ ex: 'highknees', s: 20, max: 45, st: 5 }],
  core: [{ ex: 'crunch', s: 10, max: 30, st: 2 }, { ex: 'deadbug', s: 8, max: 20, st: 2 }, { ex: 'hollow', s: 15, max: 40, st: 5 }],
  back: [{ ex: 'superman', s: 8, max: 20, st: 2 }],
  vjump: [{ ex: 'jump', s: 8, max: 20, st: 2 }],
  angel: [{ ex: 'wallangel', s: 8, max: 15, st: 1 }]
};

/* Rutinas (slots = [cadena, series]) */
var WORKOUTS = {
  A: { name: 'Piernas y glúteos', emoji: '🦵', desc: 'Piernas fuertes y glúteos firmes.',
    slots: [['squat', 3], ['lunge', 2], ['glute', 3], ['kick', 2], ['calf', 2], ['wsit', 2]] },
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
