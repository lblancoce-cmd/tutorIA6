
import React, { useState, useEffect } from 'react';
import { UserIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import Celebration from '../Celebration';

const CATEGORIES = {
    'K-POP': ['BTS', 'BLACKPINK', 'JUNGKOOK', 'LISA', 'DYNAMITE', 'NEWJEANS', 'STRAYKIDS'],
    'FIFA/FUTBOL': ['MESSI', 'RONALDO', 'MBAPPE', 'HAALAND', 'VINICIUS', 'PENALTI', 'OFFSIDE', 'BALON'],
    'ROBLOX/GAMES': ['ROBUX', 'MINECRAFT', 'OBBY', 'NOOB', 'ADOPTME', 'FORTNITE', 'SKIN', 'AVATAR'],
    'CANARIAS': ['MOJO', 'TEIDE', 'GUANCHE', 'DRAGO', 'PLÁTANO', 'GOFIO', 'ROMERIA', 'CARNAVAL']
};

const MAX_MISTAKES = 6;

const HangmanGame = () => {
    const [gameStatus, setGameStatus] = useState<'setup' | 'playing' | 'won' | 'lost'>('setup');
    const [word, setWord] = useState('');
    const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
    const [mistakes, setMistakes] = useState(0);
    const [customWordInput, setCustomWordInput] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const startGame = (selectedWord: string) => {
        setWord(selectedWord.toUpperCase());
        setGuessedLetters(new Set());
        setMistakes(0);
        setGameStatus('playing');
    };

    const handleCategorySelect = (cat: string) => {
        setSelectedCategory(cat);
        const words = CATEGORIES[cat as keyof typeof CATEGORIES];
        const randomWord = words[Math.floor(Math.random() * words.length)];
        startGame(randomWord);
    };

    const handleCustomStart = (e: React.FormEvent) => {
        e.preventDefault();
        if (customWordInput.trim().length > 2) {
            setSelectedCategory('Personalizado');
            startGame(customWordInput);
            setCustomWordInput('');
        }
    };

    const guessLetter = (letter: string) => {
        if (gameStatus !== 'playing' || guessedLetters.has(letter)) return;

        const newGuessed = new Set(guessedLetters);
        newGuessed.add(letter);
        setGuessedLetters(newGuessed);

        if (!word.includes(letter)) {
            const newMistakes = mistakes + 1;
            setMistakes(newMistakes);
            if (newMistakes >= MAX_MISTAKES) setGameStatus('lost');
        } else {
            const isWon = word.split('').every(char => newGuessed.has(char) || char === ' ');
            if (isWon) setGameStatus('won');
        }
    };

    const renderHangman = () => {
        // Simple SVG Hangman
        return (
            <svg height="150" width="120" className="stroke-gray-800 dark:stroke-white stroke-[4px] fill-none">
                {/* Base */}
                <line x1="10" y1="140" x2="110" y2="140" />
                <line x1="60" y1="140" x2="60" y2="10" />
                <line x1="60" y1="10" x2="100" y2="10" />
                <line x1="100" y1="10" x2="100" y2="30" />
                
                {mistakes >= 1 && <circle cx="100" cy="45" r="15" />} {/* Head */}
                {mistakes >= 2 && <line x1="100" y1="60" x2="100" y2="100" />} {/* Body */}
                {mistakes >= 3 && <line x1="100" y1="70" x2="80" y2="90" />} {/* Left Arm */}
                {mistakes >= 4 && <line x1="100" y1="70" x2="120" y2="90" />} {/* Right Arm */}
                {mistakes >= 5 && <line x1="100" y1="100" x2="80" y2="130" />} {/* Left Leg */}
                {mistakes >= 6 && <line x1="100" y1="100" x2="120" y2="130" />} {/* Right Leg */}
            </svg>
        );
    };

    return (
        <div className="mt-4 p-6 bg-orange-50 dark:bg-gray-800 rounded-xl border-2 border-orange-200 dark:border-orange-900 max-w-2xl mx-auto w-full relative">
            {gameStatus === 'won' && <Celebration />}

            <h3 className="text-2xl font-bold text-center text-orange-800 dark:text-orange-400 mb-6">
                🕵️ El Ahorcado {selectedCategory && `- ${selectedCategory}`}
            </h3>

            {gameStatus === 'setup' && (
                <div className="space-y-8 animate-fade-in">
                    <div>
                        <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                            <UserIcon className="w-5 h-5 mr-2" /> Elige un tema:
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                            {Object.keys(CATEGORIES).map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => handleCategorySelect(cat)}
                                    className="p-3 bg-white dark:bg-gray-700 shadow-sm rounded-lg border hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-gray-600 transition-all font-medium text-sm"
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                            <UserGroupIcon className="w-5 h-5 mr-2" /> O escribe tu propia palabra (para un amigo):
                        </h4>
                        <form onSubmit={handleCustomStart} className="flex gap-2">
                            <input 
                                type="password" 
                                value={customWordInput}
                                onChange={(e) => setCustomWordInput(e.target.value)}
                                placeholder="Palabra secreta..."
                                className="flex-1 px-4 py-2 rounded-lg border dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                            />
                            <button 
                                type="submit"
                                disabled={customWordInput.trim().length < 3}
                                className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold disabled:opacity-50"
                            >
                                Jugar
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {(gameStatus === 'playing' || gameStatus === 'won' || gameStatus === 'lost') && (
                <div className="flex flex-col items-center">
                    <div className="mb-6">
                        {renderHangman()}
                    </div>

                    {/* Word Display */}
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {word.split('').map((char, i) => (
                            <div key={i} className="w-10 h-12 flex items-end justify-center border-b-4 border-gray-800 dark:border-gray-300 text-3xl font-bold font-mono">
                                {guessedLetters.has(char) || gameStatus !== 'playing' ? char : ''}
                            </div>
                        ))}
                    </div>

                    {/* Keyboard */}
                    {gameStatus === 'playing' && (
                        <div className="flex flex-wrap justify-center gap-1 max-w-lg">
                            {'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('').map(letter => (
                                <button
                                    key={letter}
                                    onClick={() => guessLetter(letter)}
                                    disabled={guessedLetters.has(letter)}
                                    className={`
                                        w-8 h-10 rounded font-bold text-sm transition-all
                                        ${guessedLetters.has(letter) 
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50' 
                                            : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow hover:bg-orange-100 hover:scale-110'}
                                    `}
                                >
                                    {letter}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* End Game Messages */}
                    {gameStatus !== 'playing' && (
                        <div className="text-center animate-slide-up">
                            <h3 className={`text-4xl font-bold mb-4 ${gameStatus === 'won' ? 'text-green-500 animate-bounce' : 'text-red-500'}`}>
                                {gameStatus === 'won' ? '¡GANASTE! 🎉' : '¡Juego Terminado! 💀'}
                            </h3>
                            {gameStatus === 'lost' && <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">La palabra era: <span className="font-bold">{word}</span></p>}
                            <button 
                                onClick={() => setGameStatus('setup')}
                                className={`bg-orange-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform ${gameStatus === 'won' ? 'animate-bounce' : ''}`}
                            >
                                Elegir nuevo tema
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HangmanGame;
