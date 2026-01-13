
import React, { useState, useEffect } from 'react';
import { ArrowUturnLeftIcon, PlayIcon, TrashIcon } from '@heroicons/react/24/solid';
import Celebration from '../Celebration';

const GRID_SIZE = 5;
// Directions: 0: N, 1: E, 2: S, 3: W
type Direction = 0 | 1 | 2 | 3;
type Command = 'F' | 'L' | 'R'; // Forward, Left, Right

interface Position {
    x: number;
    y: number;
}

const BlueBotGame = () => {
    const [botPos, setBotPos] = useState<Position>({ x: 0, y: GRID_SIZE - 1 });
    const [botDir, setBotDir] = useState<Direction>(1); // Start facing East
    const [targetPos, setTargetPos] = useState<Position>({ x: 4, y: 0 });
    const [obstacles, setObstacles] = useState<Position[]>([]);
    const [program, setProgram] = useState<Command[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');

    // Initialize Level
    useEffect(() => {
        resetLevel();
    }, []);

    const resetLevel = () => {
        setBotPos({ x: 0, y: GRID_SIZE - 1 });
        setBotDir(1);
        setProgram([]);
        setGameStatus('playing');
        setIsRunning(false);
        
        // Simple random level generation
        const newTarget = { 
            x: Math.floor(Math.random() * 2) + 3, // x: 3 or 4
            y: Math.floor(Math.random() * 2)      // y: 0 or 1
        };
        setTargetPos(newTarget);

        // Generate random obstacles (avoid start and target)
        const obs: Position[] = [];
        while(obs.length < 4) {
            const rx = Math.floor(Math.random() * GRID_SIZE);
            const ry = Math.floor(Math.random() * GRID_SIZE);
            const isStart = rx === 0 && ry === GRID_SIZE - 1;
            const isTarget = rx === newTarget.x && ry === newTarget.y;
            const exists = obs.some(o => o.x === rx && o.y === ry);
            
            if (!isStart && !isTarget && !exists) {
                obs.push({ x: rx, y: ry });
            }
        }
        setObstacles(obs);
    };

    const addCommand = (cmd: Command) => {
        if (gameStatus !== 'playing' || isRunning || program.length >= 10) return;
        setProgram([...program, cmd]);
    };

    const clearProgram = () => {
        if (isRunning) return;
        setProgram([]);
    };

    const runProgram = async () => {
        if (isRunning || program.length === 0) return;
        setIsRunning(true);

        let currentX = botPos.x;
        let currentY = botPos.y;
        let currentDir = botDir;

        for (const cmd of program) {
            await new Promise(r => setTimeout(r, 500)); // Delay for animation

            if (cmd === 'L') {
                currentDir = (currentDir - 1 + 4) % 4 as Direction;
            } else if (cmd === 'R') {
                currentDir = (currentDir + 1) % 4 as Direction;
            } else if (cmd === 'F') {
                let nextX = currentX;
                let nextY = currentY;

                if (currentDir === 0) nextY--;
                if (currentDir === 1) nextX++;
                if (currentDir === 2) nextY++;
                if (currentDir === 3) nextX--;

                // Check bounds and obstacles
                if (nextX < 0 || nextX >= GRID_SIZE || nextY < 0 || nextY >= GRID_SIZE || 
                    obstacles.some(o => o.x === nextX && o.y === nextY)) {
                    setGameStatus('lost');
                    setIsRunning(false);
                    return;
                }
                currentX = nextX;
                currentY = nextY;
            }

            setBotPos({ x: currentX, y: currentY });
            setBotDir(currentDir);

            // Check Win
            if (currentX === targetPos.x && currentY === targetPos.y) {
                setGameStatus('won');
                setIsRunning(false);
                return;
            }
        }
        
        // If program finishes and not at target
        if (currentX !== targetPos.x || currentY !== targetPos.y) {
            setGameStatus('lost');
        }
        setIsRunning(false);
    };

    const getCellContent = (x: number, y: number) => {
        if (botPos.x === x && botPos.y === y) {
            const rotation = botDir * 90;
            return <div style={{ transform: `rotate(${rotation}deg)` }} className="text-2xl transition-transform duration-300">🤖</div>;
        }
        if (targetPos.x === x && targetPos.y === y) return <div className="text-2xl animate-bounce">🚩</div>;
        if (obstacles.some(o => o.x === x && o.y === y)) return <div className="text-2xl">🪨</div>;
        return null;
    };

    return (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-xl border-2 border-purple-200 dark:border-purple-800 max-w-sm mx-auto relative">
            {gameStatus === 'won' && <Celebration />}
            
            <div className="text-center mb-4">
                <h3 className="font-bold text-purple-900 dark:text-purple-300 text-lg">🤖 Robo-Reto STEM</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Programar al robot para llegar a la bandera.</p>
            </div>

            {/* Grid */}
            <div 
                className="grid gap-1 mx-auto bg-gray-300 p-1 rounded-lg mb-4"
                style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
            >
                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                    const x = i % GRID_SIZE;
                    const y = Math.floor(i / GRID_SIZE);
                    return (
                        <div key={i} className="w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-gray-800 rounded flex items-center justify-center border border-gray-200 dark:border-gray-700">
                            {getCellContent(x, y)}
                        </div>
                    );
                })}
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-3">
                <div className="flex gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-inner overflow-x-auto max-w-full w-full h-12 items-center">
                    {program.length === 0 && <span className="text-gray-400 text-xs mx-auto">Tu programa aparecerá aquí...</span>}
                    {program.map((cmd, i) => (
                        <span key={i} className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-purple-100 text-purple-800 rounded text-xs font-bold border border-purple-200">
                            {cmd === 'F' ? '⬆' : cmd === 'L' ? '↺' : '↻'}
                        </span>
                    ))}
                </div>

                {gameStatus === 'playing' ? (
                    <div className="grid grid-cols-4 gap-2 w-full">
                        <button onClick={() => addCommand('L')} className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-bold flex justify-center"><ArrowUturnLeftIcon className="w-5 h-5"/></button>
                        <button onClick={() => addCommand('F')} className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-bold col-span-2">AVANZAR</button>
                        <button onClick={() => addCommand('R')} className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-bold flex justify-center transform scale-x-[-1]"><ArrowUturnLeftIcon className="w-5 h-5"/></button>
                        
                        <button onClick={clearProgram} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg font-bold flex justify-center items-center"><TrashIcon className="w-5 h-5"/></button>
                        <button onClick={runProgram} className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg font-bold col-span-3 flex justify-center items-center">
                            <PlayIcon className="w-5 h-5 mr-2" /> EJECUTAR PROGRAMA
                        </button>
                    </div>
                ) : (
                    <div className="text-center w-full animate-fade-in">
                        {gameStatus === 'won' ? (
                            <div className="text-green-600 font-bold text-xl mb-2 animate-bounce">¡Misión Cumplida! 🚀</div>
                        ) : (
                            <div className="text-red-500 font-bold text-lg mb-2">¡Oh no! El robot se atascó. 💥</div>
                        )}
                        <button onClick={resetLevel} className={`bg-purple-600 text-white px-6 py-2 rounded-lg shadow hover:bg-purple-700 transition-colors transform hover:scale-105 ${gameStatus === 'won' ? 'animate-bounce' : ''}`}>
                            Intentar de nuevo
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlueBotGame;
