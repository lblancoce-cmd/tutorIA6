
import React, { useState } from 'react';
import { CheckCircleIcon, XCircleIcon, TrophyIcon, SparklesIcon } from '@heroicons/react/24/solid';
import Celebration from '../Celebration.tsx';

const NATURE_QUESTIONS = [
    {
        id: 1,
        question: "¿Qué árbol milenario es el símbolo vegetal de la isla de Tenerife?",
        icon: "🌳",
        options: ["Pino Canario", "Drago", "Palmera"],
        correct: 1,
        info: "¡Correcto! El Drago Milenario de Icod es famoso en todo el mundo."
    },
    {
        id: 2,
        question: "¿Qué pequeño pájaro de color azul vive en los pinares del Teide?",
        icon: "🐦",
        options: ["Canario Silvestre", "Cernícalo", "Pinzón Azul"],
        correct: 2,
        info: "¡Exacto! El Pinzón Azul es una especie endémica preciosa."
    },
    {
        id: 3,
        question: "¿Qué reptil gigante, que se creía extinto, vive en El Hierro?",
        icon: "🦎",
        options: ["Lagarto Gigante", "Perenquén", "Iguana"],
        correct: 0,
        info: "¡Muy bien! El Lagarto Gigante de El Hierro es un tesoro de nuestra fauna."
    },
    {
        id: 4,
        question: "¿Qué flor violeta crece a más altura que ninguna otra en España (en el Teide)?",
        icon: "🌸",
        options: ["Tajinaste Rojo", "Violeta del Teide", "Retama"],
        correct: 1,
        info: "¡Sí! La Violeta del Teide es una superviviente del volcán."
    },
    {
        id: 5,
        question: "¿Cómo se llama el bosque húmedo y verde que parece de cuento de hadas?",
        icon: "🌿",
        options: ["Laurisilva", "Pinar", "Cardonal"],
        correct: 0,
        info: "¡Correcto! La Laurisilva es un fósil viviente de hace millones de años."
    },
    {
        id: 6,
        question: "¿Qué animal marino se puede avistar con frecuencia en el sur de Tenerife?",
        icon: "🐬",
        options: ["Tiburón Blanco", "Calderón Tropical", "Pingüino"],
        correct: 1,
        info: "¡Eso es! Los Calderones (y delfines) viven en nuestras aguas."
    }
];

const CanaryExplorer = () => {
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

    const handleAnswer = (index: number) => {
        if (feedback !== 'none') return;

        if (index === NATURE_QUESTIONS[currentQ].correct) {
            setScore(score + 1);
            setFeedback('correct');
        } else {
            setFeedback('wrong');
        }

        setTimeout(() => {
            setFeedback('none');
            if (currentQ < NATURE_QUESTIONS.length - 1) {
                setCurrentQ(currentQ + 1);
            } else {
                setShowResult(true);
            }
        }, 2000);
    };

    const resetGame = () => {
        setCurrentQ(0);
        setScore(0);
        setShowResult(false);
        setFeedback('none');
    };

    if (showResult) {
        const isPerfect = score === NATURE_QUESTIONS.length;
        return (
            <div className="mt-4 flex flex-col items-center justify-center bg-green-50 dark:bg-gray-800 p-8 rounded-xl shadow-xl max-w-lg mx-auto relative overflow-hidden border-4 border-green-200 dark:border-green-900">
                {isPerfect && <Celebration />}
                <TrophyIcon className={`w-24 h-24 mb-4 ${isPerfect ? 'text-yellow-500 animate-bounce' : 'text-gray-400'}`} />
                <h2 className="text-3xl font-bold text-green-800 dark:text-green-400 mb-2">¡Exploración Finalizada!</h2>
                <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
                    Has acertado <span className="font-bold text-2xl">{score}</span> de {NATURE_QUESTIONS.length}
                </p>
                
                {isPerfect ? (
                    <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6 text-center">
                        <SparklesIcon className="w-6 h-6 mx-auto mb-1"/>
                        <p className="font-bold">¡Eres un experto en Naturaleza Canaria!</p>
                    </div>
                ) : (
                    <p className="mb-6 text-gray-500 text-sm">Sigue explorando para conocer mejor nuestras islas.</p>
                )}

                <button 
                    onClick={resetGame}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105"
                >
                    Volver a jugar
                </button>
            </div>
        );
    }

    const q = NATURE_QUESTIONS[currentQ];

    return (
        <div className="w-full max-w-2xl mx-auto mt-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                {/* Header Image Area */}
                <div className="bg-gradient-to-r from-green-400 to-teal-500 p-6 text-center relative">
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur rounded-full px-3 py-1 text-white text-xs font-bold">
                        {currentQ + 1} / {NATURE_QUESTIONS.length}
                    </div>
                    <div className="text-6xl mb-2 drop-shadow-md animate-bounce-slow">{q.icon}</div>
                    <h2 className="text-white text-2xl font-bold drop-shadow-md">Explorador Canario</h2>
                </div>

                {/* Question Area */}
                <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white text-center mb-8 min-h-[60px] flex items-center justify-center">
                        {q.question}
                    </h3>

                    <div className="grid grid-cols-1 gap-3 mb-4">
                        {q.options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(idx)}
                                disabled={feedback !== 'none'}
                                className={`
                                    relative p-4 rounded-xl text-left font-bold transition-all transform border-2
                                    ${feedback === 'none' 
                                        ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-green-400 hover:shadow-md text-gray-700 dark:text-gray-200' 
                                        : ''
                                    }
                                    ${feedback === 'correct' && idx === q.correct 
                                        ? 'bg-green-100 border-green-500 text-green-800 scale-105' 
                                        : ''
                                    }
                                    ${feedback === 'wrong' && idx !== q.correct 
                                        ? 'opacity-50' 
                                        : ''
                                    }
                                    ${feedback === 'wrong' && idx === 100 // Dummy condition, handled logic elsewhere visually
                                        ? 'bg-red-100 border-red-500 text-red-800' 
                                        : ''
                                    }
                                `}
                            >
                                <div className="flex justify-between items-center">
                                    <span>{opt}</span>
                                    {feedback === 'correct' && idx === q.correct && <CheckCircleIcon className="w-6 h-6 text-green-600"/>}
                                    {feedback === 'wrong' && idx !== q.correct && feedback === 'wrong' && idx === 100 && <XCircleIcon className="w-6 h-6 text-red-600"/>}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Feedback Message */}
                    <div className={`text-center transition-opacity duration-300 ${feedback === 'correct' ? 'opacity-100' : 'opacity-0'}`}>
                        <p className="text-green-600 font-bold bg-green-50 inline-block px-4 py-2 rounded-full">
                            {q.info}
                        </p>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes bounceSlow {
                    0%, 100% { transform: translateY(-5%); }
                    50% { transform: translateY(5%); }
                }
                .animate-bounce-slow {
                    animation: bounceSlow 3s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default CanaryExplorer;
