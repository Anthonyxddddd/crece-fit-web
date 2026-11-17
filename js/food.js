/* ===== Crece Fit · Comida: alimentos, recetas, menús y cálculos ===== */
/* Valores aproximados por ración. No sustituyen el consejo de un nutricionista. */
var FOOD_TYPES = { des: '🌅 Desayuno', alm: '🍛 Almuerzo', cen: '🌙 Cena', snk: '🍎 Snack', bat: '🥤 Batido' };

/* id: [emoji, nombre, tipo, kcal, proteína g, minutos, etiquetas, ingredientes, pasos]
   etiquetas: E económico · V vegetariano · R rápido · S sin cocina */
var RECIPES = {
  /* ---------- DESAYUNOS ---------- */
  avenaplat: ['🥣', 'Avena cremosa con plátano y maní', 'des', 450, 16, 10, 'EVR', ['60 g de avena en hojuelas (6 cdas)', '300 ml de leche entera', '1 plátano o banano', '1 cda de mantequilla de maní', 'Canela al gusto'], ['Calienta la leche con la avena a fuego medio 5 minutos moviendo.', 'Cuando espese, apaga y agrega la mantequilla de maní.', 'Sirve con el plátano en rodajas y canela.']],
  huevoaguacate: ['🍳', 'Huevos revueltos con pan y aguacate', 'des', 520, 26, 10, 'VR', ['3 huevos', '2 rebanadas de pan integral', '½ aguacate', '1 cdita de aceite o mantequilla', 'Sal y pimienta'], ['Bate los huevos con sal y revuélvelos en la sartén con el aceite.', 'Tuesta el pan y unta el aguacate aplastado.', 'Sirve los huevos encima o al lado.']],
  arepahuevo: ['🫓', 'Arepa con huevo y queso', 'des', 480, 24, 15, 'VR', ['1 arepa (o tortilla de maíz grande)', '2 huevos', '40 g de queso', '1 cdita de mantequilla'], ['Calienta la arepa y ábrela por la mitad.', 'Haz los huevos fritos o revueltos.', 'Rellena con huevos y queso fundido.']],
  pancakes: ['🥞', 'Pancakes de avena y banano', 'des', 480, 20, 15, 'VE', ['1 banano maduro', '2 huevos', '50 g de avena', '1 cdita de polvo de hornear', 'Miel o mantequilla de maní para servir'], ['Licúa banano, huevos, avena y polvo de hornear.', 'Cocina porciones en sartén antiadherente 2 minutos por lado.', 'Sirve con miel o mantequilla de maní.']],
  yogurgranola: ['🥛', 'Yogur con granola, fruta y miel', 'des', 430, 20, 5, 'VRS', ['250 g de yogur natural o griego', '50 g de granola', '1 fruta picada (banano, fresas, mango)', '1 cda de miel'], ['Pon el yogur en un bol.', 'Agrega la fruta y la granola.', 'Termina con miel.']],
  tostadamani: ['🍞', 'Tostadas con mantequilla de maní y banano', 'des', 440, 15, 5, 'VERS', ['2 rebanadas de pan integral', '2 cdas de mantequilla de maní', '1 banano', 'Un vaso de leche (opcional)'], ['Tuesta el pan.', 'Unta la mantequilla de maní.', 'Pon rodajas de banano encima.']],
  omelet: ['🧀', 'Omelette de queso y jamón con papa', 'des', 560, 34, 15, 'R', ['3 huevos', '40 g de queso', '2 lonjas de jamón', '1 papa cocida en cubos', 'Aceite, sal'], ['Dora la papa en cubos con un poco de aceite.', 'Bate los huevos, viértelos y agrega jamón y queso.', 'Dobla el omelette y cocina 1 minuto más.']],
  cerealnueces: ['🥣', 'Cereal con leche entera y frutos secos', 'des', 480, 17, 3, 'VERS', ['60 g de cereal integral o hojuelas de maíz', '300 ml de leche entera', '1 puñado (25 g) de nueces o almendras', '1 banano'], ['Sirve el cereal con la leche.', 'Agrega los frutos secos y el banano en rodajas.']],
  huevofrijol: ['🫘', 'Huevos con frijoles y tortilla', 'des', 540, 28, 12, 'ER', ['2 huevos', '½ taza de frijoles cocidos', '2 tortillas de maíz', '¼ de aguacate', 'Sal y limón'], ['Calienta los frijoles.', 'Fríe los huevos.', 'Arma tacos o plato con tortillas, frijoles, huevos y aguacate.']],
  overnight: ['🫙', 'Avena de la noche anterior', 'des', 520, 22, 5, 'VS', ['60 g de avena', '200 ml de leche', '100 g de yogur', '1 cda de chía o semillas (opcional)', '1 cda de miel y fruta'], ['Mezcla avena, leche, yogur y chía en un frasco.', 'Déjalo en la nevera toda la noche.', 'Por la mañana agrega fruta y miel.']],
  requeson: ['🍓', 'Bol de requesón con fruta y nueces', 'des', 420, 28, 5, 'VRS', ['200 g de requesón o queso fresco', '1 fruta picada', '20 g de nueces', '1 cda de miel'], ['Pon el requesón en el bol.', 'Agrega fruta, nueces y miel.']],
  sandatun: ['🥪', 'Sándwich de atún y huevo', 'des', 500, 36, 10, 'ER', ['2 rebanadas de pan', '1 lata de atún escurrido', '1 huevo cocido', '1 cda de mayonesa o yogur', 'Tomate y lechuga'], ['Mezcla el atún con el huevo picado y la mayonesa.', 'Arma el sándwich con tomate y lechuga.']],

  /* ---------- ALMUERZOS ---------- */
  arrozpollo: ['🍗', 'Arroz con pollo y aguacate', 'alm', 720, 45, 30, '', ['150 g de pechuga de pollo', '1 taza de arroz cocido (180 g)', '½ aguacate', 'Verduras al gusto', '1 cda de aceite, sal, ajo'], ['Sazona y dora el pollo en tiras con el aceite.', 'Agrega verduras y mezcla con el arroz.', 'Sirve con aguacate al lado.']],
  lentejas: ['🥘', 'Lentejas con arroz y huevo', 'alm', 650, 34, 35, 'EV', ['1 taza de lentejas cocidas', '1 taza de arroz cocido', '1 huevo frito', 'Sofrito de cebolla y tomate', 'Sal, comino'], ['Haz un sofrito de cebolla y tomate.', 'Agrega las lentejas con un poco de su caldo y sazona.', 'Sirve con arroz y el huevo frito encima.']],
  pastacarne: ['🍝', 'Pasta con carne molida y queso', 'alm', 780, 42, 25, '', ['100 g de pasta cruda', '120 g de carne molida', '½ taza de salsa de tomate', '30 g de queso rallado', 'Ajo, sal, aceite'], ['Cuece la pasta en agua con sal.', 'Dora la carne con ajo, agrega la salsa y cocina 5 minutos.', 'Mezcla con la pasta y cubre con queso.']],
  frijolcarne: ['🍛', 'Frijoles con arroz, plátano maduro y carne', 'alm', 760, 36, 30, 'E', ['1 taza de frijoles cocidos', '1 taza de arroz cocido', '1 plátano maduro frito (con poco aceite)', '120 g de carne asada o desmechada', 'Ensalada pequeña'], ['Calienta los frijoles y la carne.', 'Fríe el plátano maduro en rodajas.', 'Sirve todo junto con la ensalada.']],
  bowlatun: ['🐟', 'Bowl de atún, arroz y maíz', 'alm', 650, 42, 10, 'ERS', ['1 lata de atún', '1 taza de arroz cocido', '½ taza de maíz', '½ aguacate', 'Limón, sal, tomate'], ['Pon el arroz en un bol.', 'Agrega atún, maíz, tomate y aguacate.', 'Aliña con limón y sal.']],
  pollopapas: ['🍗', 'Pollo al horno con papas', 'alm', 700, 50, 45, 'E', ['1 muslo y contramuslo o 200 g de pechuga', '2 papas medianas', '1 cda de aceite', 'Ajo, sal, pimienta, orégano'], ['Sazona el pollo y corta las papas en gajos.', 'Hornea a 200 °C unos 35–40 minutos.', 'Sirve con ensalada.']],
  salteadores: ['🥩', 'Salteado de res con verduras y arroz', 'alm', 700, 44, 25, '', ['150 g de carne de res en tiras', '1 taza de arroz cocido', '1 taza de verduras (pimentón, zanahoria, brócoli)', '1 cda de aceite', 'Salsa de soya y ajo'], ['Saltea la carne en sartén caliente 3 minutos.', 'Agrega ajo y verduras 4 minutos más.', 'Sazona con soya y sirve sobre el arroz.']],
  garbanzos: ['🥘', 'Guiso de garbanzos con huevo', 'alm', 620, 28, 25, 'EV', ['1 taza de garbanzos cocidos', '1 papa en cubos', '2 huevos', 'Sofrito de tomate, cebolla y ajo', 'Pimentón, sal'], ['Haz el sofrito y agrega la papa con un poco de agua.', 'Añade los garbanzos y cocina 10 minutos.', 'Rompe los huevos encima y tapa 3 minutos.']],
  tacos: ['🌮', 'Tacos de pollo con frijoles', 'alm', 700, 40, 25, 'R', ['3 tortillas de maíz o harina', '150 g de pollo desmechado', '½ taza de frijoles', '¼ de aguacate', 'Queso, limón, salsa'], ['Calienta las tortillas.', 'Rellena con pollo, frijoles y aguacate.', 'Termina con queso y limón.']],
  pescado: ['🐠', 'Pescado frito con yuca y ensalada', 'alm', 680, 40, 30, '', ['180 g de filete de pescado', '150 g de yuca cocida', 'Ensalada de tomate y cebolla', '1 cda de aceite', 'Limón, sal'], ['Cuece la yuca en agua con sal 20 minutos.', 'Sazona el pescado y dóralo 3 minutos por lado.', 'Sirve con yuca y ensalada.']],
  sopapollo: ['🍲', 'Sopa de pollo con verduras, papa y arroz', 'alm', 600, 40, 40, 'E', ['150 g de pollo', '1 papa', '½ taza de arroz cocido', 'Zanahoria, cebolla, cilantro', 'Sal'], ['Hierve el pollo con cebolla y zanahoria 20 minutos.', 'Agrega la papa en cubos y cocina 12 minutos más.', 'Añade el arroz y el cilantro.']],
  hamburguesa: ['🍔', 'Hamburguesa casera con papas', 'alm', 820, 45, 30, '', ['150 g de carne molida', '1 pan de hamburguesa', '1 lonja de queso', 'Tomate y lechuga', '1 papa mediana en bastones'], ['Forma la carne y cocínala 4 minutos por lado.', 'Hornea las papas con un poco de aceite 25 minutos a 200 °C.', 'Arma la hamburguesa con queso y vegetales.']],
  cerdoarroz: ['🍖', 'Cerdo con arroz y habichuelas', 'alm', 750, 42, 30, '', ['150 g de lomo de cerdo', '1 taza de arroz', '½ taza de habichuelas o frijoles', 'Ensalada verde', 'Ajo, sal, limón'], ['Marina el cerdo con ajo y limón.', 'Dóralo en la sartén hasta que esté cocido.', 'Sirve con arroz, habichuelas y ensalada.']],
  estofado: ['🍛', 'Estofado de pollo con papa y arroz', 'alm', 740, 46, 40, 'E', ['180 g de pollo en trozos', '2 papas pequeñas', '1 taza de arroz cocido', 'Zanahoria y arvejas', 'Sofrito, sal'], ['Dora el pollo y agrégale el sofrito.', 'Añade agua, papa y zanahoria; cocina 25 minutos.', 'Sirve con arroz.']],

  /* ---------- CENAS ---------- */
  sandpollo: ['🥪', 'Sándwich de pollo desmechado', 'cen', 560, 38, 10, 'R', ['2 rebanadas de pan', '120 g de pollo desmechado', '1 cda de mayonesa o yogur', 'Lechuga y tomate', '1 lonja de queso'], ['Mezcla el pollo con la mayonesa.', 'Arma el sándwich con queso y vegetales.']],
  quesadilla: ['🧀', 'Quesadillas de pollo y frijoles', 'cen', 620, 36, 15, 'R', ['2 tortillas grandes', '100 g de pollo desmechado', '¼ de taza de frijoles', '50 g de queso', 'Salsa al gusto'], ['Pon pollo, frijoles y queso entre las tortillas.', 'Dora 2–3 minutos por lado hasta que el queso derrita.']],
  omeletpapa: ['🍳', 'Tortilla grande de huevo y papa', 'cen', 580, 30, 20, 'EV', ['3 huevos', '1 papa cocida en cubos', '½ cebolla', '1 cda de aceite', 'Sal'], ['Sofríe la cebolla y la papa.', 'Agrega los huevos batidos y cuaja por ambos lados.']],
  pastaatun: ['🍝', 'Pasta con atún y tomate', 'cen', 620, 38, 20, 'ER', ['100 g de pasta cruda', '1 lata de atún', '½ taza de salsa de tomate', 'Ajo y aceite', 'Queso rallado'], ['Cuece la pasta.', 'Calienta la salsa con ajo y el atún.', 'Mezcla y sirve con queso.']],
  arrozfrito: ['🍚', 'Arroz frito con huevo y pollo', 'cen', 640, 38, 20, 'R', ['1½ tazas de arroz cocido (de ayer)', '100 g de pollo en cubos', '2 huevos', 'Zanahoria y arvejas', 'Salsa de soya y aceite'], ['Saltea el pollo hasta dorar.', 'Agrega verduras y el arroz.', 'Haz un hueco, revuelve los huevos y mezcla con soya.']],
  cremaverd: ['🥣', 'Crema de verduras con pollo y pan', 'cen', 480, 34, 30, 'E', ['2 tazas de crema de verduras (zanahoria, papa, calabaza)', '100 g de pollo en cubos', '1 rebanada de pan', '1 cda de crema o leche'], ['Cuece y licúa las verduras con caldo.', 'Agrega el pollo cocido y la crema.', 'Sirve con pan tostado.']],
  wrapatun: ['🌯', 'Wrap de atún con aguacate', 'cen', 560, 34, 8, 'RS', ['1 tortilla grande', '1 lata de atún', '½ aguacate', 'Lechuga y tomate', 'Limón'], ['Mezcla atún con aguacate aplastado y limón.', 'Rellena la tortilla con lechuga y tomate; enrolla.']],
  tortillaesp: ['🥔', 'Tortilla de papas y huevo', 'cen', 540, 24, 25, 'EV', ['3 huevos', '2 papas medianas', '½ cebolla', '2 cdas de aceite', 'Sal'], ['Fríe las papas y la cebolla a fuego bajo hasta que estén suaves.', 'Mézclalas con los huevos batidos.', 'Cuaja en la sartén dándole la vuelta.']],
  pizzapita: ['🍕', 'Pizza casera en pan pita', 'cen', 600, 32, 15, 'R', ['2 panes pita o tortillas gruesas', '4 cdas de salsa de tomate', '80 g de queso mozzarella', '80 g de pollo o jamón', 'Orégano'], ['Unta salsa en el pan.', 'Agrega queso y pollo o jamón.', 'Hornea 8–10 minutos a 200 °C.']],
  sopalentejas: ['🥣', 'Sopa de lentejas con pan', 'cen', 520, 26, 30, 'EV', ['1 taza de lentejas cocidas', '1 papa pequeña', 'Zanahoria y cebolla', '2 rebanadas de pan', '1 cda de aceite'], ['Hierve la papa y la zanahoria con las lentejas 15 minutos.', 'Sazona con cebolla sofrita y sal.', 'Sirve con pan.']],

  /* ---------- SNACKS ---------- */
  panmani: ['🥜', 'Pan con mantequilla de maní', 'snk', 300, 10, 2, 'VERS', ['2 rebanadas de pan', '1 cda de mantequilla de maní'], ['Unta la mantequilla de maní sobre el pan.']],
  frutossecos: ['🥜', 'Mezcla de frutos secos y pasas', 'snk', 300, 9, 1, 'VS', ['40 g de almendras o maní', '20 g de pasas o dátiles'], ['Mezcla y come un puñado grande.']],
  bananonuez: ['🍌', 'Banano con nueces', 'snk', 280, 6, 1, 'VRS', ['1 banano', '20 g de nueces'], ['Come el banano acompañado de las nueces.']],
  yogurmiel: ['🍯', 'Yogur griego con miel', 'snk', 220, 18, 2, 'VRS', ['170 g de yogur griego', '1 cda de miel'], ['Mezcla y disfruta.']],
  huevoscocidos: ['🥚', 'Huevos cocidos con pan', 'snk', 330, 24, 12, 'ER', ['3 huevos cocidos', '1 rebanada de pan', 'Sal'], ['Cuece los huevos 10 minutos y pélalos.', 'Come con el pan.']],
  sandqueso: ['🧀', 'Sándwich de queso', 'snk', 330, 15, 5, 'VER', ['2 rebanadas de pan', '2 lonjas de queso', '1 cdita de mantequilla'], ['Arma el sándwich y dóralo en la sartén con la mantequilla.']],
  barras: ['🍫', 'Barras de avena y banano', 'snk', 280, 8, 25, 'VE', ['2 bananos maduros', '150 g de avena', '2 cdas de mantequilla de maní', 'Chispas de chocolate (opcional)'], ['Aplasta los bananos y mezcla con el resto.', 'Hornea 15 minutos a 180 °C y corta en barras (rinde 4).']],
  hummus: ['🫓', 'Hummus con pan pita', 'snk', 260, 9, 10, 'VR', ['¼ de taza de hummus (garbanzos + tahini + limón)', '1 pan pita', 'Palitos de zanahoria'], ['Corta el pan pita en triángulos.', 'Sumerge en el hummus junto a la zanahoria.']],
  quesobocadillo: ['🍎', 'Manzana con queso y nueces', 'snk', 270, 9, 2, 'VRS', ['1 manzana', '30 g de queso', '15 g de nueces'], ['Corta la manzana en gajos y acompáñala con el queso y las nueces.']],
  lechegalleta: ['🥛', 'Vaso de leche con galletas integrales', 'snk', 310, 11, 2, 'VERS', ['300 ml de leche entera', '4 galletas integrales'], ['Sirve la leche y come las galletas.']],

  /* ---------- BATIDOS ---------- */
  batganador: ['💪', 'Batido ganador de peso', 'bat', 800, 38, 5, 'VR', ['400 ml de leche entera', '1 banano', '60 g de avena', '2 cdas de mantequilla de maní', '1 cda de miel', '1 scoop de proteína (opcional)'], ['Licúa todo 1 minuto hasta que quede cremoso.', 'Tómalo entre comidas, no en lugar de ellas.']],
  bataveba: ['🥤', 'Batido de avena y banano', 'bat', 520, 20, 5, 'VER', ['300 ml de leche entera', '1 banano', '40 g de avena', '1 cda de miel'], ['Licúa hasta que quede liso.']],
  batchoco: ['🍫', 'Batido de chocolate y maní', 'bat', 600, 28, 5, 'VR', ['300 ml de leche', '2 cdas de cacao en polvo', '2 cdas de mantequilla de maní', '1 banano', '100 g de yogur'], ['Licúa todo con hielo si quieres frío.']],
  batmango: ['🥭', 'Batido de mango y yogur', 'bat', 420, 16, 5, 'VR', ['1 taza de mango en trozos', '200 g de yogur', '150 ml de leche', '1 cda de miel'], ['Licúa hasta que quede cremoso.']],
  bataguacate: ['🥑', 'Batido de aguacate y leche', 'bat', 520, 14, 5, 'VR', ['½ aguacate', '300 ml de leche entera', '1 cda de miel o azúcar', 'Hielo'], ['Licúa hasta que quede espeso y suave.']],
  batfresa: ['🍓', 'Batido de fresa y avena', 'bat', 450, 18, 5, 'VR', ['1 taza de fresas', '300 ml de leche', '40 g de avena', '100 g de yogur'], ['Licúa todo y sirve frío.']],
  batcacao: ['🌰', 'Batido de dátiles y cacao', 'bat', 540, 22, 5, 'VR', ['4 dátiles sin semilla', '300 ml de leche entera', '1 cda de cacao', '1 cda de mantequilla de maní', '1 banano'], ['Hidrata los dátiles 5 minutos y licúa con lo demás.']],
  batcafe: ['☕', 'Batido de café y avena', 'bat', 400, 18, 5, 'VR', ['1 taza de café frío', '200 ml de leche entera', '40 g de avena', '1 banano', '1 cda de miel'], ['Licúa hasta que quede espumoso.']]
};

/* semana de menús: [desayuno, snack, almuerzo, batido, snack, cena] */
var MENUS = [
  ['avenaplat', 'bananonuez', 'arrozpollo', 'batganador', 'panmani', 'omeletpapa'],
  ['huevoaguacate', 'yogurmiel', 'lentejas', 'bataveba', 'frutossecos', 'sandpollo'],
  ['pancakes', 'quesobocadillo', 'pastacarne', 'batchoco', 'huevoscocidos', 'pastaatun'],
  ['arepahuevo', 'lechegalleta', 'frijolcarne', 'batganador', 'barras', 'quesadilla'],
  ['yogurgranola', 'frutossecos', 'bowlatun', 'batmango', 'sandqueso', 'cremaverd'],
  ['omelet', 'panmani', 'pollopapas', 'batcacao', 'hummus', 'arrozfrito'],
  ['overnight', 'bananonuez', 'salteadores', 'bataguacate', 'yogurmiel', 'tortillaesp']
];
var MENU_SLOTS = ['Desayuno', 'Media mañana', 'Almuerzo', 'Merienda (batido)', 'Snack', 'Cena'];

/* alimentos: [emoji, nombre, kcal/100 g, proteína/100 g, nota] */
var FOODS = {
  'Proteínas': [
    ['🥚', 'Huevo', 155, 13, 'Barato y completo. Come 2–4 al día.'],
    ['🍗', 'Pechuga de pollo', 165, 31, 'Magra y versátil. Con piel suma calorías.'],
    ['🥩', 'Carne de res', 250, 26, 'Hierro y zinc. Elige cortes con algo de grasa para subir calorías.'],
    ['🐟', 'Atún en lata', 130, 29, 'Rápido y económico. En agua o aceite (aceite suma calorías).'],
    ['🐠', 'Salmón', 208, 20, 'Omega 3 para el corazón y el cerebro.'],
    ['🥓', 'Carne de cerdo (lomo)', 242, 27, 'Alternativa a la res.'],
    ['🫘', 'Lentejas (cocidas)', 116, 9, 'Proteína vegetal y hierro. Muy económicas.'],
    ['🫘', 'Frijoles (cocidos)', 127, 8.7, 'Combínalos con arroz para una proteína más completa.'],
    ['🧆', 'Garbanzos (cocidos)', 164, 8.9, 'Fibra y energía duradera.'],
    ['🧀', 'Tofu', 144, 17, 'Opción vegetal.']
  ],
  'Carbohidratos': [
    ['🍚', 'Arroz cocido', 130, 2.7, 'Base de energía. Aumenta la ración para subir calorías.'],
    ['🍝', 'Pasta cocida', 158, 5.8, 'Fácil de combinar con proteína.'],
    ['🥔', 'Papa cocida', 87, 1.9, 'Saciante y barata.'],
    ['🍠', 'Camote / batata', 86, 1.6, 'Más fibra y vitaminas.'],
    ['🥣', 'Avena (seca)', 389, 17, 'Muy calórica y saludable. Ideal en el desayuno.'],
    ['🍞', 'Pan integral', 247, 13, 'Práctico para snacks.'],
    ['🫓', 'Tortilla / arepa', 218, 5, 'Calorías fáciles.'],
    ['🍌', 'Plátano maduro', 122, 1.3, 'Energía natural; frito en poco aceite sube calorías.'],
    ['🌽', 'Maíz', 96, 3.4, 'Suma color y energía.'],
    ['🥖', 'Yuca cocida', 160, 1.4, 'Muy energética.']
  ],
  'Grasas saludables': [
    ['🥑', 'Aguacate', 160, 2, 'Calorías limpias: ½ aguacate ≈ 120 kcal extra.'],
    ['🥜', 'Mantequilla de maní', 588, 25, 'Lo más fácil para subir calorías: 1 cda ≈ 95 kcal.'],
    ['🌰', 'Nueces', 654, 15, 'Un puñado (30 g) ≈ 200 kcal.'],
    ['🥜', 'Almendras', 579, 21, 'Snack excelente.'],
    ['🫒', 'Aceite de oliva', 884, 0, '1 cda en las comidas ≈ 120 kcal extra.'],
    ['🌻', 'Semillas de chía', 486, 17, 'Fibra y omega 3 para avenas y batidos.']
  ],
  'Lácteos': [
    ['🥛', 'Leche entera', 61, 3.2, 'Un vaso grande ≈ 150 kcal. Mejor entera que light.'],
    ['🥣', 'Yogur griego natural', 97, 9, 'Proteína alta.'],
    ['🧀', 'Queso fresco', 264, 18, 'Fácil de añadir a todo.'],
    ['🧀', 'Queso madurado', 402, 25, 'Muy calórico.'],
    ['🥛', 'Requesón', 98, 11, 'Alto en proteína y bajo en grasa.']
  ],
  'Frutas y verduras': [
    ['🍌', 'Banano', 89, 1.1, 'Ideal antes de entrenar.'],
    ['🥭', 'Mango', 60, 0.8, 'Dulce y calórico para ser fruta.'],
    ['🍎', 'Manzana', 52, 0.3, 'Fibra y saciedad.'],
    ['🍇', 'Uvas y pasas', 69, 0.7, 'Las pasas (299 kcal) suben calorías en snacks.'],
    ['🥦', 'Brócoli', 34, 2.8, 'Vitaminas y fibra.'],
    ['🥕', 'Zanahoria', 41, 0.9, 'Vitamina A.'],
    ['🍅', 'Tomate', 18, 0.9, 'Hidratación y sabor.'],
    ['🥬', 'Espinaca', 23, 2.9, 'Hierro y vitaminas.']
  ],
  'Extras calóricos': [
    ['🍯', 'Miel', 304, 0.3, '1 cda ≈ 60 kcal para batidos y avenas.'],
    ['🍫', 'Chocolate negro', 546, 5, 'Con moderación.'],
    ['🥤', 'Jugo natural', 45, 0.5, 'Calorías líquidas fáciles; mejor con la comida.'],
    ['🧈', 'Mantequilla', 717, 0.9, 'Una cdita (5 g) ≈ 36 kcal.'],
    ['🍪', 'Galletas integrales', 430, 8, 'Snack práctico.']
  ]
};

var FOOD_TIPS = [
  ['🍽', 'Come más veces al día', 'Haz 5 o 6 comidas: 3 principales y 2–3 snacks. Cuando cuesta comer mucho, repartir la comida ayuda.'],
  ['🥤', 'Toma calorías líquidas', 'Un batido con leche, avena, banano y mantequilla de maní aporta 500–800 kcal y se bebe fácil. Tómalo entre comidas.'],
  ['🥑', 'Suma grasas saludables', 'Aguacate, frutos secos, aceite de oliva y mantequilla de maní aumentan las calorías sin llenarte tanto.'],
  ['📈', 'Sube de a poco', 'Apunta a ganar 0.25–0.5 kg por semana. Si subes más rápido, parte será grasa.'],
  ['🍗', 'Proteína en cada comida', 'Reparte 1.6–2 g por kg de peso corporal durante el día; ayuda a crecer músculo y no solo peso.'],
  ['💧', 'Bebe agua, pero no antes de comer', 'Tomar mucha agua justo antes de la comida te llena. Bébela entre comidas.'],
  ['😴', 'Duerme 8–9 horas', 'El músculo se construye al descansar y la hormona de crecimiento se libera mientras duermes.'],
  ['🏋️', 'Entrena fuerza', 'Sin ejercicio de fuerza, el peso que subes es mayormente grasa. Sigue tus rutinas de la app.'],
  ['⏰', 'Come por horario', 'Si no tienes hambre, programa alarmas. Con el tiempo el apetito aumenta.'],
  ['⚖️', 'Pésate bien', 'Una vez por semana, en ayunas y a la misma hora. Mira el promedio, no el día.'],
  ['🌱', 'Altura y alimentación', 'La estatura depende sobre todo de la genética, pero comer suficiente proteína, calcio, vitamina D y dormir bien te ayuda a llegar a tu máximo.'],
  ['⚠️', 'Cuándo consultar', 'Si tienes enfermedades, alergias, bajo peso muy marcado, o eres menor de edad, consulta con un médico o nutricionista antes de cambiar tu dieta.']
];

/* ---------- cálculos ---------- */
var ACTIVITY = [[1.2, 'Sedentario', 'Poco movimiento'], [1.375, 'Ligero', 'Entreno 1–3 días'], [1.55, 'Moderado', 'Entreno 3–5 días'], [1.725, 'Alto', 'Entreno casi a diario']];
var FGOALS = { gain: { n: 'Ganar peso', e: '📈', d: 400 }, soft: { n: 'Ganar músculo (suave)', e: '💪', d: 250 }, keep: { n: 'Mantener mi peso', e: '⚖️', d: 0 }, lose: { n: 'Bajar un poco', e: '📉', d: -400 } };

function foodCalc(f) {
  var w = +f.w, h = +f.h, a = +f.age; if (!(w > 20 && h > 100 && a > 5)) return null;
  var bmr = 10 * w + 6.25 * h - 5 * a + (f.sex === 'f' ? -161 : 5);
  var tdee = bmr * (ACTIVITY[f.act] || ACTIVITY[2])[0];
  var kcal = Math.round((tdee + (FGOALS[f.goal] || FGOALS.gain).d) / 50) * 50;
  var prot = Math.round(w * (f.goal === 'lose' ? 2 : 1.8));
  var fat = Math.round(kcal * 0.27 / 9);
  var carb = Math.round((kcal - prot * 4 - fat * 9) / 4);
  var bmi = w / Math.pow(h / 100, 2);
  return { bmr: Math.round(bmr), tdee: Math.round(tdee), kcal: kcal, prot: prot, fat: fat, carb: carb, water: Math.round(w * 0.035 * 10) / 10, bmi: Math.round(bmi * 10) / 10 };
}
function menuDay(i, mode) {
  var m = MENUS[i % MENUS.length].slice(), out = [];
  m.forEach(function (id, k) { if (mode === 'keep' && (k === 3 || k === 4)) return; out.push([MENU_SLOTS[k], id]); });
  return out;
}
function menuTotals(day) {
  var k = 0, p = 0; day.forEach(function (s) { var r = RECIPES[s[1]]; k += r[3]; p += r[4]; });
  return { kcal: k, prot: p };
}
