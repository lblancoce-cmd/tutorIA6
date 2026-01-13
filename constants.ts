import { Topic } from './types.ts';

export const ADMIN_USERS: Record<string, { name: string; password: string }> = {
    'lblacel@canariaseducacion.es': { name: 'Admin 1', password: '003' },
    'jbriperc@canariaseducacion.es': { name: 'Admin 2', password: '001' },
    'gcabperp@canariaseducacion.es': { name: 'Admin 3', password: '002' },
};

export const DEFAULT_TOPICS: Topic[] = [
    {
        id: '1',
        title: 'Lengua Castellana',
        description: 'Gramática, ortografía y leyendas canarias.',
        initialMessage: '¡Demuestra lo que sabes de Lengua! Responde a las preguntas para ganar puntos.',
        icon: '📚',
        rewardIcon: '✏️',
        questions: [
            {
                id: 'L1',
                question: '¿Qué tipo de palabra es "rápidamente"?',
                options: ['Adjetivo', 'Sustantivo', 'Adverbio', 'Verbo'],
                correctAnswerIndex: 2,
                explanation: '"Rápidamente" es un adverbio de modo, porque nos dice CÓMO se hace algo.'
            },
            {
                id: 'L2',
                question: 'La palabra "guagua" en Canarias es un...',
                options: ['Canarismo', 'Préstamo', 'Neologismo'],
                correctAnswerIndex: 0,
                explanation: '¡Exacto! "Guagua" es un canarismo, una palabra propia del español hablado en Canarias.'
            },
            {
                id: 'L3',
                question: 'En la frase "El Teide es majestuoso", ¿cuál es el sujeto?',
                options: ['es majestuoso', 'majestuoso', 'El Teide'],
                correctAnswerIndex: 2,
                explanation: 'El sujeto es "El Teide", que es de quien se dice algo en la oración.'
            },
            {
                id: 'L4',
                question: 'La leyenda de Gara y Jonay es originaria de la isla de...',
                options: ['Tenerife', 'La Gomera', 'Gran Canaria'],
                correctAnswerIndex: 1,
                explanation: 'La famosa leyenda de los amantes Gara y Jonay pertenece a la isla de La Gomera.'
            }
        ]
    },
    {
        id: '2',
        title: 'Matemáticas',
        description: 'Cálculo, problemas y geometría.',
        initialMessage: '¡A calcular! Resuelve estos problemas matemáticos y consigue recompensas.',
        icon: '📐',
        rewardIcon: '🪙',
        questions: [
            {
                id: 'M1',
                question: 'Si una caja de plátanos pesa 25 kg, ¿cuánto pesarán 4 cajas?',
                options: ['80 kg', '100 kg', '125 kg'],
                correctAnswerIndex: 1,
                explanation: 'Para resolverlo, multiplicamos 25 kg por 4, lo que nos da un total de 100 kg.'
            },
            {
                id: 'M2',
                question: '¿Cuál es el perímetro de un cuadrado cuyo lado mide 5 cm?',
                options: ['20 cm', '25 cm', '15 cm'],
                correctAnswerIndex: 0,
                explanation: 'El perímetro es la suma de todos sus lados. Un cuadrado tiene 4 lados iguales, así que 5 cm x 4 = 20 cm.'
            },
            {
                id: 'M3',
                question: '¿Qué número resulta de la operación 50 - (10 x 2)?',
                options: ['80', '40', '30'],
                correctAnswerIndex: 2,
                explanation: 'Primero se resuelve el paréntesis (10 x 2 = 20), y luego la resta: 50 - 20 = 30.'
            }
        ]
    },
    {
        id: '3',
        title: 'Conocimiento del Medio',
        description: 'Naturaleza, volcanes e historia de las islas.',
        initialMessage: 'Explora Canarias. Responde correctamente y conviértete en un experto.',
        icon: '🌍',
        rewardIcon: '🌋',
        questions: [
            {
                id: 'C1',
                question: '¿Cuál es el pico más alto de España?',
                options: ['Mulhacén', 'Aneto', 'Teide'],
                correctAnswerIndex: 2,
                explanation: 'El Teide, situado en Tenerife, no solo es el pico más alto de España, sino también el tercer volcán más grande del mundo.'
            },
            {
                id: 'C2',
                question: 'Los aborígenes de la isla de Tenerife se llamaban...',
                options: ['Majoreros', 'Bimbaches', 'Guanches'],
                correctAnswerIndex: 2,
                explanation: 'Los Guanches eran los antiguos pobladores de la isla de Tenerife antes de la conquista.'
            },
            {
                id: 'C3',
                question: '¿Qué tipo de bosque húmedo es característico de La Gomera y Anaga?',
                options: ['Pinar', 'Sabinar', 'Laurisilva'],
                correctAnswerIndex: 2,
                explanation: 'La Laurisilva es un tipo de selva subtropical húmeda que se conserva en algunas islas como un tesoro natural.'
            }
        ]
    },
    {
        id: '4',
        title: 'English',
        description: 'Vocabulary, grammar and questions.',
        initialMessage: 'Let\'s practice English! Answer the questions to earn points.',
        icon: '🇬🇧',
        rewardIcon: '🚌',
        questions: [
            {
                id: 'E1',
                question: 'How do you say "plátano" in English?',
                options: ['Apple', 'Orange', 'Banana'],
                correctAnswerIndex: 2,
                explanation: '"Banana" is the correct translation for "plátano".'
            },
            {
                id: 'E2',
                question: 'What is the past tense of the verb "go"?',
                options: ['Goed', 'Went', 'Gone'],
                correctAnswerIndex: 1,
                explanation: '"Went" is the simple past tense of "go". For example: "Yesterday I went to the beach".'
            },
            {
                id: 'E3',
                question: 'Which sentence is correct?',
                options: ['She have a dog', 'She has a dog', 'She are a dog'],
                correctAnswerIndex: 1,
                explanation: 'For the third person singular (he, she, it), we use "has" instead of "have".'
            }
        ]
    },
    {
        id: '5',
        title: 'Français',
        description: 'Apprends le français.',
        initialMessage: 'Salut ! Pratiquons un peu le français. Répondez aux questions.',
        icon: '🇫🇷',
        rewardIcon: '🥐',
        questions: [
            {
                id: 'F1',
                question: 'Comment dit-on "Hola" en français ?',
                options: ['Au revoir', 'Bonjour', 'Merci'],
                correctAnswerIndex: 1,
                explanation: '"Bonjour" est la façon la plus courante de dire "Hola" en français.'
            },
            {
                id: 'F2',
                question: 'Que signifie "le chien" ?',
                options: ['El gato', 'El perro', 'El pájaro'],
                correctAnswerIndex: 1,
                explanation: 'Oui, "le chien" signifie "el perro".'
            }
        ]
    },
    {
        id: '6',
        title: 'Soporte TIC y Classroom',
        description: 'Ayuda informática con el profe Fidel.',
        initialMessage: '¡Hola! Vamos a repasar algunos conceptos de informática y seguridad.',
        icon: '💻',
        rewardIcon: '🖱️',
        questions: [
            {
                id: 'T1',
                question: '¿Qué es lo primero que debes hacer si una aplicación no funciona?',
                options: ['Golpear el ordenador', 'Reiniciar la aplicación o el dispositivo', 'Borrar todo'],
                correctAnswerIndex: 1,
                explanation: '¡Reiniciar es la solución mágica para muchos problemas informáticos!'
            },
            {
                id: 'T2',
                question: '¿Cuál de estas contraseñas es más segura?',
                options: ['123456', 'CanariasBonita2024!', 'miperro'],
                correctAnswerIndex: 1,
                explanation: 'Una contraseña segura mezcla mayúsculas, minúsculas, números y símbolos. ¡Nunca uses datos personales!'
            }
        ]
    },
    {
        id: '7',
        title: 'Historia y Geografía',
        description: 'Viaja por la historia de España y explora su geografía.',
        initialMessage: '¡Hola! Soy Vampy. ¿Listo para un viaje en el tiempo y el espacio por España? Pregúntame lo que quieras saber.',
        icon: '🗺️',
        rewardIcon: '🏛️',
        questions: []
    },
    {
        id: '8',
        title: 'Cultura Canaria',
        description: 'Descubre las fiestas, comidas y tradiciones de nuestras islas.',
        initialMessage: '¡Epale! Soy Vampy, tu guía de cultura canaria. ¿Quieres saber sobre el gofio, las romerías o el silbo gomero? ¡Dispara!',
        icon: '🇮🇨',
        rewardIcon: '🎉',
        questions: []
    },
    {
        id: '9',
        title: 'Ciencias Naturales',
        description: 'Seres vivos, ecosistemas de España y el cuerpo humano.',
        initialMessage: '¡Hola! Soy Vampy, tu explorador de la naturaleza. ¿Quieres aprender sobre los volcanes, los animales de Canarias o cómo funciona tu corazón? ¡Pregúntame!',
        icon: '🔬',
        rewardIcon: '🌿',
        questions: []
    },
    {
        id: '10',
        title: 'Arte y Música',
        description: 'Pintores famosos, instrumentos musicales y el arte en Canarias.',
        initialMessage: '¡Soy Vampy, tu artista nocturno! ¿Hablamos de Goya, del timple canario o de cómo César Manrique transformó Lanzarote? ¡Estoy listo para crear!',
        icon: '🎨',
        rewardIcon: '🎶',
        questions: []
    },
    {
        id: '11',
        title: 'Deportes',
        description: 'Fútbol, baloncesto y deportistas legendarios de España y Canarias.',
        initialMessage: '¡Vampy se pone la equipación! ¿Quieres saber quiénes son los mejores deportistas canarios, las reglas del fútbol o curiosidades de los Juegos Olímpicos? ¡A jugar!',
        icon: '⚽',
        rewardIcon: '🏆',
        questions: []
    },
    {
        id: 'interactive_map',
        title: 'Mapa Interactivo de Canarias',
        description: 'Explora las islas, sus capitales, monumentos y secretos.',
        icon: '🗺️',
        initialMessage: '',
        questions: []
    },
    {
        id: 'special_image_editor',
        title: 'Editor de Imágenes',
        description: 'Crea tus propios diseños como en Canva.',
        initialMessage: '',
        questions: []
    },
    {
        id: 'special_game_zone',
        title: 'Game Zone',
        description: 'Pide acceso al profe para jugar cuando termines la tarea.',
        initialMessage: '',
        questions: []
    }
];