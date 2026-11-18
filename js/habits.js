/* ===== Hábitos, disciplina y recomendaciones ===== */
/* id: [emoji, nombre, categoría, por qué, cómo empezar, tipo]  (tipo 's' = horas de sueño) */
var HCATS = ['Cuerpo', 'Nutrición', 'Mente', 'Disciplina', 'Sueño'];
var HABITS = {
  water: ['💧', 'Beber 8 vasos de agua', 'Cuerpo', 'Te mantiene con energía, ayuda al rendimiento y a que la cara no se vea hinchada.', 'Deja una botella a la vista y bebe un vaso al despertar.'],
  steps: ['🚶', 'Caminar 8.000 pasos', 'Cuerpo', 'Caminar mejora el ánimo, el corazón y quema calorías sin cansarte.', 'Da una vuelta de 10 minutos después de cada comida.'],
  stretch: ['🧘', 'Estirar 5 minutos', 'Cuerpo', 'Mejora la flexibilidad y la postura y reduce dolores.', 'Estira siempre justo después de cepillarte los dientes.'],
  sun: ['☀️', 'Sol 10 minutos', 'Cuerpo', 'La luz del sol ayuda a la vitamina D, al ánimo y a regular el sueño.', 'Toma tu desayuno o café junto a una ventana o afuera.'],
  posture: ['🧍', 'Chequeo de postura', 'Cuerpo', 'Una espalda recta se ve mejor y evita dolores de cuello y espalda.', 'Pon una alarma 3 veces al día para enderezarte.'],
  cold: ['❄️', 'Ducha fría 30 segundos', 'Cuerpo', 'Entrena la disciplina: hacer algo incómodo a propósito.', 'Termina tu ducha normal con 30 segundos de agua fría.'],
  stairs: ['🦵', 'Usar escaleras', 'Cuerpo', 'Pequeños esfuerzos diarios suman mucho en el año.', 'Elige siempre las escaleras cuando sean 3 pisos o menos.'],
  nosit: ['⏰', 'Levantarte cada hora', 'Cuerpo', 'Estar horas sentado cansa y encorva. Moverse reactiva el cuerpo.', 'Cada hora, levántate 1 minuto y estírate.'],
  protein: ['🥩', 'Proteína en cada comida', 'Nutrición', 'Es la base para construir músculo y recuperarte.', 'Incluye huevo, pollo, atún, lentejas o lácteos en cada comida principal.'],
  fruit: ['🍎', '3 frutas o verduras', 'Nutrición', 'Dan vitaminas, fibra y saciedad.', 'Pon una fruta a la vista y suma verdura al almuerzo y cena.'],
  nosugar: ['🥤', 'Sin bebidas azucaradas', 'Nutrición', 'Ahorra muchas calorías y evita picos de energía.', 'Cambia la gaseosa por agua con limón o agua con gas.'],
  breakfast: ['🍳', 'Desayunar bien', 'Nutrición', 'Empezar con proteína y energía mejora el rendimiento del día.', 'Prepara algo fácil: huevos, avena o yogur con fruta.'],
  nojunk: ['🍪', 'Sin ultraprocesados', 'Nutrición', 'Menos sal, azúcar y grasas malas; menos retención de líquidos.', 'No los compres: si no están en casa, no los comes.'],
  cook: ['🍲', 'Cocinar en casa', 'Nutrición', 'Sabes qué comes y te sale más barato y saludable.', 'Cocina doble en la cena y guarda para el almuerzo siguiente.'],
  lowsalt: ['🧂', 'Poca sal y sin embutidos', 'Nutrición', 'La sal retiene líquidos y hincha la cara y el cuerpo.', 'Prueba la comida antes de echarle sal y evita embutidos.'],
  meditate: ['🌬', 'Respirar o meditar 5 min', 'Mente', 'Baja el estrés y mejora la concentración.', 'Siéntate, respira 4 segundos inhalando y 6 exhalando, 5 minutos.'],
  read: ['📖', 'Leer 10 páginas', 'Mente', 'Lees ~12 libros al año con solo 10 páginas diarias.', 'Deja el libro sobre tu almohada y lee al acostarte.'],
  journal: ['✏️', 'Escribir en tu diario', 'Mente', 'Aclara la mente y te ayuda a ver tu progreso.', 'Escribe 3 líneas: cómo estuve, qué aprendí, qué mejoro mañana.'],
  gratitude: ['🌱', '3 cosas buenas del día', 'Mente', 'Entrenar la gratitud mejora el ánimo y la motivación.', 'Antes de dormir, piensa en 3 cosas buenas de hoy.'],
  learn: ['🧠', 'Aprender 15 minutos', 'Mente', 'Aprender algo nuevo cada día te hace crecer con el tiempo.', 'Elige un curso, idioma o habilidad y dedícale 15 minutos fijos.'],
  noscroll: ['📵', 'Sin redes la 1ª hora', 'Mente', 'Evita empezar el día reaccionando a lo que otros hacen.', 'Carga el celular lejos de tu cama.'],
  wake: ['⏰', 'Levantarte a tu hora', 'Disciplina', 'Cumplir tu palabra contigo mismo es la base de la disciplina.', 'Pon la alarma lejos de la cama y levántate al primer sonido.'],
  bed: ['🧹', 'Hacer la cama', 'Disciplina', 'Es tu primera victoria del día y te da impulso.', 'Hazlo apenas te levantes, antes de mirar el celular.'],
  plan: ['🎯', 'Planear 3 prioridades', 'Disciplina', 'Saber qué es lo importante evita perder el día.', 'Cada noche anota las 3 cosas más importantes de mañana.'],
  deep: ['⚡', '25 minutos de enfoque', 'Disciplina', 'Trabajar sin distracciones rinde más que horas dispersas.', 'Temporizador de 25 min, celular fuera de la vista, un solo tema.'],
  hardfirst: ['🔥', 'Hacer primero lo difícil', 'Disciplina', 'Lo que más evitas es lo que más te hace avanzar.', 'Empieza el día con la tarea que menos te apetece, aunque sea 10 minutos.'],
  tidy: ['🧹', 'Ordenar 5 minutos', 'Disciplina', 'Un espacio ordenado ordena la mente.', 'Antes de dormir, deja tu escritorio y mochila listos.'],
  review: ['📋', 'Revisar cómo te fue', 'Disciplina', 'Lo que se mide mejora.', 'Cada noche pregúntate: ¿cumplí lo importante? ¿qué mejoro?'],
  sleep: ['😴', 'Dormir 8 horas', 'Sueño', 'El músculo se construye y la hormona de crecimiento se libera durmiendo.', 'Acuéstate y levántate a la misma hora, también el fin de semana.', 's'],
  screens: ['📱', 'Sin pantallas 30 min antes', 'Sueño', 'La luz de las pantallas retrasa el sueño.', 'Pon el celular a cargar fuera de tu cama a una hora fija.'],
  early: ['🌙', 'Acostarte antes de las 11', 'Sueño', 'Cada hora antes de medianoche rinde más que después.', 'Pon una alarma de "hora de dormir" 30 minutos antes.'],
  nocaf: ['☕', 'Sin cafeína después de las 4', 'Sueño', 'La cafeína tarda horas en irse y arruina el sueño profundo.', 'Cambia el café de la tarde por agua o té sin cafeína.']
};
var HPACKS = [
  { id: 'base', n: 'Empezar fácil', e: '🌱', d: '3 hábitos muy simples para empezar sin abrumarte.', ids: ['water', 'bed', 'steps'], goals: ['forma', 'salud'] },
  { id: 'grow', n: 'Crecer y postura', e: '🧍', d: 'Sueño, proteína, sol y postura: lo mejor para dar lo máximo.', ids: ['sleep', 'protein', 'sun', 'stretch', 'posture', 'water'], goals: ['crecer'] },
  { id: 'muscle', n: 'Ganar músculo', e: '💪', d: 'Come proteína, duerme y muévete.', ids: ['protein', 'sleep', 'water', 'breakfast', 'steps'], goals: ['musculo'] },
  { id: 'disc', n: 'Disciplina diaria', e: '🔥', d: 'Levántate a tu hora y haz lo importante primero.', ids: ['wake', 'bed', 'plan', 'hardfirst', 'review'], goals: ['musculo', 'forma'] },
  { id: 'mind', n: 'Mente clara', e: '🧠', d: 'Menos ruido, más enfoque y calma.', ids: ['meditate', 'read', 'journal', 'noscroll'], goals: ['salud'] },
  { id: 'sleep', n: 'Sueño reparador', e: '😴', d: 'Duerme mejor para recuperarte y rendir.', ids: ['early', 'screens', 'nocaf', 'sleep'], goals: ['salud', 'crecer'] },
  { id: 'health', n: 'Salud y energía', e: '❤️', d: 'Agua, fruta, caminar y menos azúcar.', ids: ['water', 'fruit', 'steps', 'nosugar'], goals: ['salud', 'forma'] },
  { id: 'face', n: 'Cara más despejada', e: '🧖', d: 'Menos sal y alcohol, más agua y sueño.', ids: ['water', 'lowsalt', 'sleep', 'nosugar', 'stretch'], goals: [] }
];
var DISC = [
  ['🎯', 'La disciplina es una decisión repetida', 'No esperas a "tener ganas". Decides qué vas a hacer y lo haces, aunque no tengas ganas. Las ganas llegan después de empezar, no antes.', 'Hoy: haz algo pequeño que te dé pereza, solo 5 minutos.'],
  ['⏱', 'La regla de los 2 minutos', 'Si no quieres hacer algo, hazlo solo 2 minutos. Ponte las zapatillas, abre el libro, haz 1 flexión. Empezar es lo difícil; casi siempre sigues.', 'Reduce tu hábito a una versión de 2 minutos.'],
  ['🔗', 'Apila tus hábitos', 'Pega un hábito nuevo a uno que ya haces: "Después de lavarme los dientes, hago 10 sentadillas". Así no dependes de la memoria ni de la motivación.', 'Escribe: "Después de ___, haré ___".'],
  ['🌱', 'Empieza ridículamente pequeño', 'Es mejor 1 flexión todos los días que 100 una vez al mes. Lo pequeño se vuelve automático y luego puedes subir.', 'Baja tu meta a algo que puedas hacer incluso en tu peor día.'],
  ['⚖️', 'Nunca falles dos días seguidos', 'Fallar un día es normal. Fallar dos empieza un nuevo hábito: el de abandonar. Si hoy no puedes completo, haz la versión mínima.', 'Si fallas hoy, mañana es tu "día sí o sí".'],
  ['🏠', 'Diseña tu entorno', 'Haz lo bueno fácil y lo malo difícil: fruta a la vista, celular lejos de la cama, ropa de ejercicio lista la noche anterior.', 'Prepara hoy lo que usarás mañana.'],
  ['🏆', 'Premia el progreso', 'Celebra cada vez que cumples, aunque sea con una sonrisa. Tu cerebro repite lo que se siente bien.', 'Marca tu hábito y di "¡bien hecho!".'],
  ['🧱', 'No rompas la cadena', 'Mira tus rachas y no las rompas. Ver una cadena larga es una gran motivación para no fallar hoy.', 'Revisa en Estadísticas tu racha más larga.'],
  ['🪞', 'Cambia tu identidad', 'No solo "quiero correr": "soy alguien que entrena". Cada vez que cumples, votas por la persona que quieres ser.', 'Completa: "Soy una persona que ___".'],
  ['🧘', 'Disciplina sin castigarte', 'Si te regañas, cansas. Si te hablas como a un amigo, sigues. Aprende del fallo, ajusta y continúa.', 'Cuando falles, escribe qué te frenó y cómo lo evitas.'],
  ['⚡', 'Motivación vs. sistema', 'La motivación sube y baja. Un sistema (hora, lugar, señal y recompensa) te sostiene incluso en días malos.', 'Define hora y lugar fijos para tu hábito principal.'],
  ['📅', '21 días no es magia', 'Formar un hábito toma entre 2 y 8 meses según la persona (promedio ~66 días). Lo importante es la constancia, no la perfección.', 'Elige UN hábito y cúmplelo 66 días.']
];
var DISC_WEEK = [
  'Esta semana: levántate a la misma hora todos los días.',
  'Esta semana: deja el celular fuera de la cama.',
  'Esta semana: haz primero lo más difícil de tu día.',
  'Esta semana: prepara tu ropa y tu comida la noche anterior.',
  'Esta semana: bebe un vaso de agua apenas te despiertes.',
  'Esta semana: planea 3 prioridades cada noche.',
  'Esta semana: camina 10 minutos después de cada comida.',
  'Esta semana: no te saltes ningún día de tu hábito principal, ni con la versión mínima.'
];
