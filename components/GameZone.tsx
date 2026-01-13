
import React, { useState, useEffect } from 'react';
import { ClockIcon, ArrowLeftIcon, PuzzlePieceIcon, CpuChipIcon, LanguageIcon, TableCellsIcon, MusicalNoteIcon, TrophyIcon, MapIcon, GlobeEuropeAfricaIcon } from '@heroicons/react/24/solid';
import BattleshipGame from './minigames/BattleshipGame.tsx';
import BlueBotGame from './minigames/BlueBotGame.tsx';
import HangmanGame from './minigames/HangmanGame.tsx';
import WordSearchGame from './minigames/WordSearchGame.tsx';
import ClassicBoardGames from './minigames/ClassicBoardGames.tsx';
import CanaryPuzzle from './minigames/CanaryPuzzle.tsx';
import CreativeStudio from './minigames/CreativeStudio.tsx';
import CanarySports from './minigames/CanarySports.tsx';
import IslandRacingGame from './minigames/IslandRacingGame.tsx';
import CanaryExplorer from './minigames/CanaryExplorer.tsx';
import CollectiveBattleGame from './minigames/CollectiveBattleGame.tsx';
import { User } from '../types.ts';
import { checkUnlockCondition } from '../utils/classGameLogic.ts';

interface Props {
    onBack: () => void;
    user: User;
}

const GAME_TIME_SECONDS = 300; // 5 minutes

const GameZone: React.FC<Props> = ({ onBack, user }) => {
    const [timeLeft, setTimeLeft] = useState(GAME_TIME_SECONDS);
    const [activeGame, setActiveGame] = useState<'menu' | 'battleship' | 'bluebot' | 'hangman' | 'wordsearch' | 'classics' | 'puzzle' | 'creative' | 'sports' | 'racing' | 'explorer'>('menu');
    
    // Collective Game State
    const [showCollectiveGame, setShowCollectiveGame] = useState(false);
    const [collectiveClass, setCollectiveClass] = useState<'A' | 'B'>('A');

    useEffect(() => {
        // Check Collective Game Unlock
        if (checkUnlockCondition('A')) {
            setCollectiveClass('A');
            setShowCollectiveGame(true);
        } else if (checkUnlockCondition('B')) {
            setCollectiveClass('B');
            setShowCollectiveGame(true);
        }
    }, [user.email, user.isAdmin]);

    useEffect(() => {
        if (showCollectiveGame) return; // Don't run timer if in special game

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [showCollectiveGame]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    if (showCollectiveGame) {
        return <CollectiveBattleGame classId={collectiveClass} onClose={() => setShowCollectiveGame(false)} />;
    }

    // --- TIME'S UP SCREEN ---
    if (timeLeft === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-8">
                <ClockIcon className="w-24 h-24 text-red-500 mb-4 animate-pulse" />
                <h2 className="text-4xl font-bold mb-4">¡Tiempo Agotado!</h2>
                <p className="text-xl mb-8 text-gray-300 text-center">La sesión de juego libre ha terminado por hoy. ¡Sigue estudiando para ganar más tiempo mañana!</p>
                <button 
                    onClick={onBack}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105"
                >
                    Volver a Clase
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
            {/* Header */}
            <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 shadow-lg flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center">
                    <button onClick={onBack} className="mr-4 p-2 hover:bg-white/20 rounded-full transition-colors">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl font-bold flex items-center">
                        <span className="mr-2">🕹️</span> Game Zone
                    </h1>
                </div>

                <div className="flex items-center bg-black/30 px-4 py-2 rounded-full border border-white/20">
                    <ClockIcon className={`w-5 h-5 mr-2 ${timeLeft < 60 ? 'text-red-400 animate-pulse' : 'text-green-400'}`} />
                    <span className="font-mono text-xl font-bold">{formatTime(timeLeft)}</span>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 p-6 overflow-y-auto">
                {activeGame === 'menu' && (
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">¡Bienvenido a la Arena!</h2>
                            <p className="text-gray-600 dark:text-gray-300">¡Disfruta de tu tiempo de juego!</p>
                        </div>

                        <div className="space-y-8">
                            {/* Featured Game: Racing */}
                            <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-1 rounded-2xl shadow-xl transform hover:scale-[1.01] transition-transform cursor-pointer border-4 border-yellow-500" onClick={() => setActiveGame('racing')}>
                                <div className="bg-gray-800 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
                                    <div className="absolute top-0 right-0 bg-yellow-500 text-black font-black px-3 py-1 rounded-bl-lg text-xs uppercase">Nuevo</div>
                                    <div className="flex items-center mb-4 md:mb-0 z-10">
                                        <div className="text-6xl mr-6 animate-bounce">🏎️</div>
                                        <div className="text-left">
                                            <h3 className="text-2xl font-black text-white uppercase tracking-wide italic">Carrera Insular</h3>
                                            <p className="text-blue-200 text-sm">¡Corre por la TF-1 y usa el Gofio Power ⚡⚡ para ganar al Rey!</p>
                                        </div>
                                    </div>
                                    <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-3 rounded-xl shadow-lg transition-colors z-10">
                                        ¡JUGAR AHORA!
                                    </button>
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/checkered-pattern.png')]"></div>
                                </div>
                            </div>

                            {/* Section 1: Logic & STEM */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Lógica y STEM</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <GameCard 
                                        title="Hundir la Flota" 
                                        desc="Mates y coordenadas" 
                                        icon={<PuzzlePieceIcon className="w-10 h-10 text-blue-500"/>}
                                        color="blue"
                                        onClick={() => setActiveGame('battleship')}
                                    />
                                    <GameCard 
                                        title="BlueBot STEM" 
                                        desc="Programación robótica" 
                                        icon={<CpuChipIcon className="w-10 h-10 text-purple-500"/>}
                                        color="purple"
                                        onClick={() => setActiveGame('bluebot')}
                                    />
                                    <GameCard 
                                        title="Ahorcado" 
                                        desc="Adivina palabras" 
                                        icon={<span className="text-4xl">🕵️</span>}
                                        color="orange"
                                        onClick={() => setActiveGame('hangman')}
                                    />
                                    <GameCard 
                                        title="Sopa de Letras" 
                                        desc="Busca vocabulario" 
                                        icon={<LanguageIcon className="w-10 h-10 text-pink-500"/>}
                                        color="pink"
                                        onClick={() => setActiveGame('wordsearch')}
                                    />
                                </div>
                            </div>

                            {/* Section 2: Classics & Creative */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Clásicos, Cultura y Creatividad</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <GameCard 
                                        title="Juegos de Mesa" 
                                        desc="Oca, Damas, Trivial..." 
                                        icon={<TableCellsIcon className="w-10 h-10 text-green-500"/>}
                                        color="green"
                                        onClick={() => setActiveGame('classics')}
                                    />
                                    <GameCard 
                                        title="Puzzle Canario" 
                                        desc="Reconstruye el paisaje" 
                                        icon={<span className="text-4xl">🧩</span>}
                                        color="teal"
                                        onClick={() => setActiveGame('puzzle')}
                                    />
                                    <GameCard 
                                        title="Estudio de Arte" 
                                        desc="Música y Pintura" 
                                        icon={<MusicalNoteIcon className="w-10 h-10 text-indigo-500"/>}
                                        color="indigo"
                                        onClick={() => setActiveGame('creative')}
                                    />
                                    <GameCard 
                                        title="Deporte Canario" 
                                        desc="Historia y Fútbol" 
                                        icon={<TrophyIcon className="w-10 h-10 text-yellow-500"/>}
                                        color="yellow"
                                        onClick={() => setActiveGame('sports')}
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                                     <GameCard 
                                        title="Explorador" 
                                        desc="Flora y Fauna" 
                                        icon={<GlobeEuropeAfricaIcon className="w-10 h-10 text-emerald-600"/>}
                                        color="emerald"
                                        onClick={() => setActiveGame('explorer')}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Render Active Game */}
                {activeGame !== 'menu' && (
                    <div className="flex flex-col items-center animate-fade-in w-full">
                        <button 
                            onClick={() => setActiveGame('menu')}
                            className="mb-4 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow text-sm text-gray-600 dark:text-gray-300 hover:text-blue-500 flex items-center transition-colors self-start"
                        >
                            <ArrowLeftIcon className="w-4 h-4 mr-2" /> Volver al menú de juegos
                        </button>
                        
                        <div className="w-full flex justify-center">
                            {activeGame === 'battleship' && <BattleshipGame />}
                            {activeGame === 'bluebot' && <BlueBotGame />}
                            {activeGame === 'hangman' && <HangmanGame />}
                            {activeGame === 'wordsearch' && <WordSearchGame />}
                            {activeGame === 'classics' && <ClassicBoardGames />}
                            {activeGame === 'puzzle' && <CanaryPuzzle />}
                            {activeGame === 'creative' && <CreativeStudio />}
                            {activeGame === 'sports' && <CanarySports />}
                            {activeGame === 'racing' && <IslandRacingGame />}
                            {activeGame === 'explorer' && <CanaryExplorer />}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

// Helper Component for Menu Cards
const GameCard = ({ title, desc, icon, color, onClick }: any) => (
    <button 
        onClick={onClick}
        className={`
            group relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-md border-b-4 transition-all transform hover:scale-105 hover:shadow-xl p-4 flex flex-col items-center text-center h-40 justify-center
            border-${color}-500
        `}
    >
        <div className={`absolute inset-0 bg-${color}-500/5 group-hover:bg-${color}-500/10 transition-colors`}></div>
        <div className="mb-2 group-hover:scale-110 transition-transform">{icon}</div>
        <h3 className="font-bold text-gray-800 dark:text-white leading-tight">{title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{desc}</p>
    </button>
);

export default GameZone;