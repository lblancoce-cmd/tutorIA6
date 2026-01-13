
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BoltIcon, StarIcon, TrophyIcon, XCircleIcon, MapIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import Celebration from '../Celebration';

// --- EDUCATIONAL DATA ---
const QUESTIONS = [
    { type: 'math', q: 'MCD de 12 y 8', a: ['4', '2', '8'], correct: 0 },
    { type: 'math', q: 'Divisor de 20', a: ['7', '5', '3'], correct: 1 },
    { type: 'math', q: '3 x 4 + 2', a: ['14', '18', '20'], correct: 0 },
    { type: 'lang', q: 'Pájaro es...', a: ['Aguda', 'Llana', 'Esdrújula'], correct: 2 },
    { type: 'lang', q: 'Raíz de "Marino"', a: ['Mar', 'Mari', 'Ino'], correct: 0 },
    { type: 'lang', q: 'Sílaba tónica en "Reloj"', a: ['Re', 'Loj', 'Ninguna'], correct: 1 },
    { type: 'geo', q: 'El Teide está en...', a: ['La Palma', 'Tenerife', 'Gran Canaria'], correct: 1 },
    { type: 'geo', q: 'Capital de Lanzarote', a: ['Arrecife', 'Teguise', 'Haría'], correct: 0 },
    { type: 'geo', q: 'Parque Nacional de La Gomera', a: ['Taburiente', 'Garajonay', 'Timanfaya'], correct: 1 },
];

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const CAR_WIDTH = 40;
const CAR_HEIGHT = 70;
const LANE_WIDTH = CANVAS_WIDTH / 3;

const IslandRacingGame = () => {
    // Game State
    const [gameState, setGameState] = useState<'menu' | 'racing' | 'quiz' | 'win' | 'lose'>('menu');
    const [island, setIsland] = useState<'TF1' | 'GC1'>('TF1');
    const [score, setScore] = useState(0);
    const [elixir, setElixir] = useState(0); // 0 to 10
    const [quizQuestion, setQuizQuestion] = useState<any>(null);
    const [turboActive, setTurboActive] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    
    // Refs for Loop
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>();
    const playerY = useRef(CANVAS_HEIGHT - 100);
    const playerX = useRef(CANVAS_WIDTH / 2 - CAR_WIDTH / 2);
    const obstacles = useRef<{x: number, y: number, type: 'rock' | 'chest'}[]>([]);
    const roadOffset = useRef(0);
    const speed = useRef(5);
    const distance = useRef(0);
    const cpuDistance = useRef(0);
    
    // Controls
    const keysPressed = useRef<Set<string>>(new Set());

    // --- GAME LOOP ---
    const updateGame = useCallback(() => {
        if (gameState !== 'racing') return;

        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        // 1. Physics & Input
        if (keysPressed.current.has('ArrowLeft') && playerX.current > 20) {
            playerX.current -= 7;
        }
        if (keysPressed.current.has('ArrowRight') && playerX.current < CANVAS_WIDTH - CAR_WIDTH - 20) {
            playerX.current += 7;
        }
        
        // Speed Handling
        let currentSpeed = speed.current;
        if (turboActive) currentSpeed = 15; // SUPER TURBO
        
        roadOffset.current += currentSpeed;
        distance.current += currentSpeed;
        cpuDistance.current += (turboActive ? 4 : 5.5); // CPU is slightly faster than base speed

        // 2. Spawning Objects
        if (Math.random() < 0.02) {
            const lane = Math.floor(Math.random() * 3);
            const type = Math.random() < 0.3 ? 'chest' : 'rock'; // 30% chest chance
            obstacles.current.push({
                x: lane * LANE_WIDTH + LANE_WIDTH / 2 - 20,
                y: -100,
                type: type
            });
        }

        // 3. Update Objects & Collision
        obstacles.current.forEach(obs => {
            obs.y += currentSpeed;
        });

        // Remove off-screen
        obstacles.current = obstacles.current.filter(obs => obs.y < CANVAS_HEIGHT + 100);

        // Collision Detection
        for (let i = 0; i < obstacles.current.length; i++) {
            const obs = obstacles.current[i];
            if (
                playerX.current < obs.x + 40 &&
                playerX.current + CAR_WIDTH > obs.x &&
                playerY.current < obs.y + 40 &&
                playerY.current + CAR_HEIGHT > obs.y
            ) {
                // Collision!
                if (obs.type === 'rock') {
                    if (!turboActive) {
                        setMessage("¡CUIDADO!");
                        setTimeout(() => setMessage(null), 1000);
                        distance.current -= 200; // Penalty
                        speed.current = 2; // Slow down temporarily
                        setTimeout(() => speed.current = 5, 1000);
                    }
                    // Remove obstacle
                    obstacles.current.splice(i, 1);
                    i--;
                } else if (obs.type === 'chest') {
                    setGameState('quiz');
                    const q = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
                    setQuizQuestion(q);
                    obstacles.current.splice(i, 1);
                    i--;
                    return; // Stop loop for quiz
                }
            }
        }

        // Win/Lose Condition (Race length 10000)
        if (distance.current >= 10000) {
            setGameState(distance.current > cpuDistance.current ? 'win' : 'lose');
            return;
        }

        // --- RENDERING ---
        
        // Clear
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw Road
        ctx.fillStyle = '#555';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        // Draw Lanes (Scrolling)
        ctx.setLineDash([20, 20]);
        ctx.lineDashOffset = -roadOffset.current;
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#FFF';
        
        ctx.beginPath();
        ctx.moveTo(LANE_WIDTH, 0);
        ctx.lineTo(LANE_WIDTH, CANVAS_HEIGHT);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(LANE_WIDTH * 2, 0);
        ctx.lineTo(LANE_WIDTH * 2, CANVAS_HEIGHT);
        ctx.stroke();

        // Draw Grass/Island Sides
        ctx.fillStyle = island === 'TF1' ? '#3f3' : '#eec'; // Green for Tenerife, Sand/Dry for GC
        ctx.fillRect(0, 0, 10, CANVAS_HEIGHT);
        ctx.fillRect(CANVAS_WIDTH - 10, 0, 10, CANVAS_HEIGHT);

        // Draw Obstacles
        obstacles.current.forEach(obs => {
            ctx.font = '30px Arial';
            ctx.fillText(obs.type === 'chest' ? '🎁' : '🪨', obs.x, obs.y + 30);
            // Glow for chest
            if (obs.type === 'chest') {
                ctx.shadowBlur = 10;
                ctx.shadowColor = "gold";
            } else {
                ctx.shadowBlur = 0;
            }
        });
        ctx.shadowBlur = 0; // Reset

        // Draw Player Car
        ctx.fillStyle = turboActive ? '#f0f' : '#3b82f6'; // Blue usually, Purple when Elixir/Turbo
        // Car body
        ctx.fillRect(playerX.current, playerY.current, CAR_WIDTH, CAR_HEIGHT);
        // Car roof
        ctx.fillStyle = turboActive ? '#fff' : '#1d4ed8';
        ctx.fillRect(playerX.current + 5, playerY.current + 15, CAR_WIDTH - 10, CAR_HEIGHT - 30);
        
        if (turboActive) {
            // Flame particles visual hack
            ctx.font = '20px Arial';
            ctx.fillText('🔥', playerX.current + 10, playerY.current + CAR_HEIGHT + 20);
        }

        // Draw Message Overlay
        if (message) {
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.font = 'bold 30px sans-serif';
            ctx.fillText(message, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
            ctx.textAlign = 'start'; // Reset alignment
        }

        requestRef.current = requestAnimationFrame(updateGame);
    }, [gameState, turboActive, island, message]);

    // Key Listeners
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => keysPressed.current.add(e.code);
        const handleKeyUp = (e: KeyboardEvent) => keysPressed.current.delete(e.code);
        
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // Loop Trigger
    useEffect(() => {
        if (gameState === 'racing') {
            requestRef.current = requestAnimationFrame(updateGame);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [gameState, updateGame]);

    const handleQuizAnswer = (index: number) => {
        if (index === quizQuestion.correct) {
            // Correct!
            setElixir(10);
            setTurboActive(true);
            setMessage("¡GOFIO POWER ⚡⚡");
            setTimeout(() => {
                setTurboActive(false);
                setMessage(null);
            }, 3000); // 3 seconds of turbo
        } else {
            // Wrong
            setMessage("JI JI JI JA!");
            distance.current -= 300; // Big penalty
            setTimeout(() => setMessage(null), 1500);
        }
        setGameState('racing');
        setQuizQuestion(null);
    };

    const startGame = (selectedIsland: 'TF1' | 'GC1') => {
        setIsland(selectedIsland);
        setGameState('racing');
        distance.current = 0;
        cpuDistance.current = 0;
        obstacles.current = [];
        setElixir(0);
    };

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
            
            {gameState === 'menu' && (
                <div className="bg-blue-900 p-8 rounded-3xl border-8 border-yellow-500 shadow-2xl text-center text-white w-full max-w-md animate-pop-in">
                    <h2 className="text-4xl font-extrabold text-yellow-400 mb-2 drop-shadow-md uppercase" style={{ fontFamily: 'sans-serif' }}>Carrera Insular</h2>
                    <div className="text-6xl mb-6">🏎️🏝️</div>
                    <p className="mb-6 text-blue-200 font-bold">Elige tu circuito:</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => startGame('TF1')} className="bg-blue-600 hover:bg-blue-500 p-4 rounded-xl border-b-8 border-blue-800 transition-transform active:scale-95 group">
                            <div className="text-4xl group-hover:scale-110 transition-transform">🌋</div>
                            <span className="font-bold block mt-2">TF-1 (Tenerife)</span>
                        </button>
                        <button onClick={() => startGame('GC1')} className="bg-orange-600 hover:bg-orange-500 p-4 rounded-xl border-b-8 border-orange-800 transition-transform active:scale-95 group">
                            <div className="text-4xl group-hover:scale-110 transition-transform">🏖️</div>
                            <span className="font-bold block mt-2">GC-1 (Gran Canaria)</span>
                        </button>
                    </div>
                    <p className="mt-6 text-xs text-yellow-200/80">
                        *Usa las flechas para moverte. <br/>*Coge cofres y responde preguntas para activar el GOFIO POWER.
                    </p>
                </div>
            )}

            {(gameState === 'racing' || gameState === 'quiz') && (
                <div className="relative bg-gray-900 p-2 rounded-xl border-4 border-gray-700 shadow-2xl">
                    {/* Progress Bar / Clash HUD */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between text-white font-bold z-10 text-shadow">
                        <div className="flex flex-col items-center">
                            <div className="text-xs text-blue-300">TÚ (AZUL)</div>
                            <div className="w-32 bg-gray-800 h-4 rounded-full border border-gray-500 overflow-hidden">
                                <div className="bg-blue-500 h-full transition-all" style={{ width: `${(distance.current / 10000) * 100}%` }}></div>
                            </div>
                        </div>
                        
                        {/* Elixir/Gofio Meter */}
                        <div className="flex flex-col items-center">
                            <div className="text-xs text-purple-300 uppercase">Turbo</div>
                            <div className="bg-black/50 px-3 py-1 rounded-full border border-purple-500 flex items-center space-x-1">
                                <span className="text-yellow-400 drop-shadow-[0_0_5px_rgba(234,179,8,1)]">⚡</span>
                                <span className={`${turboActive ? 'text-purple-200 animate-pulse' : 'text-gray-400'}`}>
                                    {turboActive ? 'GOFIO' : '---'}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="text-xs text-red-300">REY ROJO (CPU)</div>
                            <div className="w-32 bg-gray-800 h-4 rounded-full border border-gray-500 overflow-hidden">
                                <div className="bg-red-500 h-full transition-all" style={{ width: `${(cpuDistance.current / 10000) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>

                    <canvas 
                        ref={canvasRef} 
                        width={CANVAS_WIDTH} 
                        height={CANVAS_HEIGHT} 
                        className="rounded-lg bg-gray-800 cursor-none"
                    />

                    {/* Quiz Overlay */}
                    {gameState === 'quiz' && quizQuestion && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 z-50 animate-bounce-in">
                            <div className="bg-yellow-50 p-6 rounded-2xl border-4 border-orange-500 shadow-2xl max-w-xs text-center">
                                <div className="text-4xl mb-2">👑</div>
                                <h3 className="text-orange-800 font-black text-xl mb-4 uppercase tracking-wide">¡Desafío Real!</h3>
                                <p className="text-gray-800 font-bold text-lg mb-6">{quizQuestion.q}</p>
                                <div className="grid grid-cols-1 gap-3">
                                    {quizQuestion.a.map((ans: string, idx: number) => (
                                        <button 
                                            key={idx}
                                            onClick={() => handleQuizAnswer(idx)}
                                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl border-b-4 border-blue-800 active:border-b-0 active:mt-1"
                                        >
                                            {ans}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-4 font-mono">Responde rápido para activar el Gofio Power.</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {gameState === 'win' && (
                <div className="text-center animate-bounce-in relative">
                    <Celebration />
                    <div className="text-6xl mb-4">👑👑👑</div>
                    <h2 className="text-5xl font-black text-yellow-400 stroke-black drop-shadow-lg mb-2">¡VICTORIA!</h2>
                    <p className="text-white text-xl mb-8">Has derrotado al Rey Rojo en la {island === 'TF1' ? 'TF-1' : 'GC-1'}.</p>
                    <button onClick={() => setGameState('menu')} className="bg-yellow-500 text-white px-8 py-3 rounded-full font-bold text-xl shadow-lg hover:scale-105 transition">
                        Volver a Jugar
                    </button>
                </div>
            )}

            {gameState === 'lose' && (
                <div className="text-center animate-fade-in bg-white/10 p-8 rounded-xl backdrop-blur-md">
                    <div className="text-6xl mb-4 animate-pulse">😡</div>
                    <h2 className="text-4xl font-black text-red-500 mb-2">¡DERROTA!</h2>
                    <p className="text-gray-200 text-lg mb-6">El Rey Rojo llegó antes. ¡Necesitas más Gofio Power!</p>
                    <div className="text-2xl font-bold text-white mb-8">JI JI JI JA!</div>
                    <button onClick={() => setGameState('menu')} className="bg-gray-600 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-500 transition">
                        Reintentar
                    </button>
                </div>
            )}
        </div>
    );
};

export default IslandRacingGame;
    