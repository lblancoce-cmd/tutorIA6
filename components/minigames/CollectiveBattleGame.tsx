
import React, { useState, useEffect } from 'react';
import { ShieldCheckIcon, BoltIcon, TrophyIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/solid';
import Celebration from '../Celebration';

interface Player {
    id: number;
    status: 'alive' | 'eliminated';
    hasShield: boolean;
    battlesWon: number;
}

interface Props {
    classId: 'A' | 'B';
    onClose: () => void;
}

const CollectiveBattleGame: React.FC<Props> = ({ classId, onClose }) => {
    const playerCount = classId === 'A' ? 24 : 25;
    
    // Game State
    const [players, setPlayers] = useState<Player[]>([]);
    const [phase, setPhase] = useState<'lobby' | 'select_target' | 'battle' | 'victory'>('lobby');
    
    // Battle State
    const [attackerId, setAttackerId] = useState<number | null>(null);
    const [defenderId, setDefenderId] = useState<number | null>(null);
    const [battleScore, setBattleScore] = useState<{a: number, d: number}>({ a: 0, d: 0 });
    const [currentProblem, setCurrentProblem] = useState<{q: string, a: number} | null>(null);
    const [battleLog, setBattleLog] = useState<string[]>([]);

    useEffect(() => {
        // Init Players
        const initialPlayers: Player[] = Array.from({ length: playerCount }, (_, i) => ({
            id: i + 1,
            status: 'alive',
            hasShield: false,
            battlesWon: 0
        }));
        setPlayers(initialPlayers);
    }, [playerCount]);

    const activePlayers = players.filter(p => p.status === 'alive');

    // --- LOGIC ---

    const handlePlayerClick = (id: number) => {
        if (phase === 'lobby') {
            // Select Attacker
            setAttackerId(id);
            setPhase('select_target');
        } else if (phase === 'select_target') {
            // Select Defender
            if (id === attackerId) {
                // Cancel
                setAttackerId(null);
                setPhase('lobby');
                return;
            }
            setDefenderId(id);
            startBattle(attackerId!, id);
        }
    };

    const startBattle = (p1: number, p2: number) => {
        setBattleScore({ a: 0, d: 0 });
        setPhase('battle');
        generateProblem();
        setBattleLog([`¡DUELO! Jugador ${p1} vs Jugador ${p2}`]);
    };

    const generateProblem = () => {
        const ops = ['+', '-', 'x'];
        const op = ops[Math.floor(Math.random() * 3)];
        let a = 0, b = 0, res = 0;

        if (op === 'x') {
            a = Math.floor(Math.random() * 10) + 2;
            b = Math.floor(Math.random() * 10) + 2;
            res = a * b;
        } else {
            a = Math.floor(Math.random() * 50);
            b = Math.floor(Math.random() * 50);
            if (op === '-') {
                if (a < b) [a, b] = [b, a];
                res = a - b;
            } else {
                res = a + b;
            }
        }
        setCurrentProblem({ q: `${a} ${op} ${b}`, a: res });
    };

    const handlePoint = (winner: 'attacker' | 'defender') => {
        const newScore = { ...battleScore };
        if (winner === 'attacker') newScore.a++;
        else newScore.d++;

        setBattleScore(newScore);

        // Check Win (First to 3)
        if (newScore.a >= 3 || newScore.d >= 3) {
            resolveBattle(newScore.a >= 3 ? 'attacker' : 'defender', newScore);
        } else {
            generateProblem(); // Next question
        }
    };

    const resolveBattle = (winnerSide: 'attacker' | 'defender', finalScore: {a: number, d: number}) => {
        const winnerId = winnerSide === 'attacker' ? attackerId! : defenderId!;
        const loserId = winnerSide === 'attacker' ? defenderId! : attackerId!;
        
        const isFlawless = (winnerSide === 'attacker' && finalScore.d === 0) || (winnerSide === 'defender' && finalScore.a === 0);

        setPlayers(prev => prev.map(p => {
            if (p.id === winnerId) {
                return { 
                    ...p, 
                    battlesWon: p.battlesWon + 1,
                    hasShield: isFlawless ? true : p.hasShield // Grant shield if 3-0
                };
            }
            if (p.id === loserId) {
                if (p.hasShield) {
                    return { ...p, hasShield: false }; // Consume shield
                } else {
                    return { ...p, status: 'eliminated' }; // Eliminate
                }
            }
            return p;
        }));

        // Check Game Over
        const remaining = players.filter(p => p.id !== loserId || (p.id === loserId && p.hasShield)).filter(p => p.status === 'alive').length;
        
        if (remaining <= 1) {
            setPhase('victory');
        } else {
            setPhase('lobby');
            setAttackerId(null);
            setDefenderId(null);
        }
    };

    // --- RENDER ---

    return (
        <div className="fixed inset-0 z-[100] bg-gray-900 flex flex-col items-center justify-center overflow-hidden animate-fade-in">
            {/* Background Pulse */}
            <div className="absolute inset-0 bg-red-900/20 animate-pulse pointer-events-none"></div>

            {/* Header */}
            <div className="relative z-10 w-full max-w-6xl p-4 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter drop-shadow-lg">
                        <span className="text-red-600">BATTLE</span> ROYALE
                    </h1>
                    <p className="text-gray-400 text-sm font-mono">CLASE {classId} • SUPERVIVIENTES: {activePlayers.length}</p>
                </div>
                <button onClick={onClose} className="text-gray-500 hover:text-white text-sm uppercase tracking-widest border border-gray-700 px-4 py-2 rounded hover:bg-gray-800">
                    Cerrar Simulación
                </button>
            </div>

            {/* MAIN CONTENT */}
            <div className="relative z-10 flex-1 w-full max-w-6xl p-4 flex flex-col items-center justify-center">
                
                {phase === 'victory' && (
                    <div className="text-center animate-bounce-in">
                        <Celebration />
                        <TrophyIcon className="w-48 h-48 text-yellow-400 mx-auto mb-4 drop-shadow-[0_0_30px_rgba(250,204,21,0.6)]" />
                        <h2 className="text-6xl font-bold text-white mb-2">¡VICTORIA!</h2>
                        <p className="text-2xl text-yellow-200">El Alumno {activePlayers[0]?.id} es el último en pie.</p>
                    </div>
                )}

                {(phase === 'lobby' || phase === 'select_target') && (
                    <>
                        <div className="mb-8 text-center">
                            <h2 className="text-2xl text-white font-bold animate-pulse">
                                {phase === 'lobby' ? 'Selecciona tu número para atacar' : `Jugador ${attackerId}: ELIGE TU VÍCTIMA`}
                            </h2>
                        </div>
                        <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
                            {players.map(player => (
                                <button
                                    key={player.id}
                                    disabled={player.status === 'eliminated' || (phase === 'select_target' && player.id === attackerId)}
                                    onClick={() => handlePlayerClick(player.id)}
                                    className={`
                                        relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-xl font-bold border-4 transition-all duration-300
                                        ${player.status === 'eliminated' 
                                            ? 'bg-gray-800 border-gray-700 text-gray-600 scale-90 grayscale cursor-not-allowed' 
                                            : 'bg-gray-200 hover:scale-110 cursor-pointer'
                                        }
                                        ${attackerId === player.id ? 'bg-red-600 border-red-400 text-white scale-110 ring-4 ring-red-900 z-20' : ''}
                                        ${phase === 'select_target' && player.status === 'alive' && player.id !== attackerId ? 'hover:bg-red-200 border-red-200 animate-pulse' : ''}
                                        ${player.hasShield ? 'ring-4 ring-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]' : ''}
                                    `}
                                >
                                    {player.id}
                                    {player.hasShield && <ShieldCheckIcon className="absolute -top-2 -right-2 w-6 h-6 text-blue-400 bg-gray-900 rounded-full" />}
                                    {player.status === 'eliminated' && <XMarkIcon className="absolute inset-0 m-auto w-8 h-8 text-gray-500 opacity-50" />}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {phase === 'battle' && currentProblem && (
                    <div className="w-full max-w-3xl bg-gray-800 border-4 border-gray-600 rounded-2xl p-8 shadow-2xl animate-zoom-in relative">
                        {/* Battle Header */}
                        <div className="flex justify-between items-center mb-12">
                            {/* Attacker */}
                            <div className="flex flex-col items-center">
                                <div className={`w-24 h-24 rounded-full bg-red-600 flex items-center justify-center text-4xl font-bold text-white border-4 border-red-400 mb-2 ${battleScore.a > battleScore.d ? 'scale-110' : ''}`}>
                                    {attackerId}
                                </div>
                                <div className="flex gap-1">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className={`w-4 h-4 rounded-full ${i < battleScore.a ? 'bg-yellow-400' : 'bg-gray-600'}`}></div>
                                    ))}
                                </div>
                            </div>

                            <div className="text-4xl font-black text-gray-500 italic">VS</div>

                            {/* Defender */}
                            <div className="flex flex-col items-center">
                                <div className={`w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-bold text-white border-4 border-blue-400 mb-2 ${battleScore.d > battleScore.a ? 'scale-110' : ''}`}>
                                    {defenderId}
                                </div>
                                <div className="flex gap-1">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className={`w-4 h-4 rounded-full ${i < battleScore.d ? 'bg-yellow-400' : 'bg-gray-600'}`}></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Problem */}
                        <div className="bg-black p-6 rounded-xl text-center mb-8 border border-gray-500">
                            <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">Operación</p>
                            <div className="text-6xl font-mono font-bold text-white tracking-wider">
                                {currentProblem.q} = ?
                            </div>
                            <div className="mt-4 text-2xl text-green-400 font-bold animate-pulse">
                                Solución: {currentProblem.a}
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => handlePoint('attacker')}
                                className="bg-red-900 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center border border-red-500 transition-all active:scale-95"
                            >
                                <CheckIcon className="w-6 h-6 mr-2" /> Punto para {attackerId}
                            </button>
                            <button 
                                onClick={() => handlePoint('defender')}
                                className="bg-blue-900 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center border border-blue-500 transition-all active:scale-95"
                            >
                                <CheckIcon className="w-6 h-6 mr-2" /> Punto para {defenderId}
                            </button>
                        </div>

                        <div className="mt-4 text-center text-gray-500 text-xs">
                            * El profesor/árbitro debe pulsar el botón del alumno que contestó correctamente primero.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollectiveBattleGame;
