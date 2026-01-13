
import React, { useState, useEffect } from 'react';
import Celebration from '../Celebration.tsx';

const GRID_SIZE = 5; // 0 to 4
const TREASURE_COUNT = 3;

type CellStatus = 'hidden' | 'miss' | 'hit' | 'enemy-hit';

interface MathClue {
    treasureIndex: number;
    rowOp: string;
    colOp: string;
    rowRes: number;
    colRes: number;
    found: boolean;
}

const BattleshipGame = () => {
    const [grid, setGrid] = useState<CellStatus[]>(Array(GRID_SIZE * GRID_SIZE).fill('hidden'));
    const [treasures, setTreasures] = useState<number[]>([]); 
    const [clues, setClues] = useState<MathClue[]>([]);
    const [playerScore, setPlayerScore] = useState(0);
    const [enemyScore, setEnemyScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState<'player' | 'pirate' | null>(null);

    const generateMathOperation = (targetResult: number): string => {
        const type = Math.random() > 0.5 ? 'sum' : 'sub';
        if (type === 'sum') {
            const a = Math.floor(Math.random() * targetResult);
            const b = targetResult - a;
            return `${a} + ${b}`;
        } else {
            const a = targetResult + Math.floor(Math.random() * 5) + 1;
            const b = a - targetResult;
            return `${a} - ${b}`;
        }
    };

    const initGame = () => {
        const newGrid = Array(GRID_SIZE * GRID_SIZE).fill('hidden');
        const newTreasures = new Set<number>();
        
        while (newTreasures.size < TREASURE_COUNT) {
            newTreasures.add(Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE)));
        }
        
        const treasuresArray = Array.from(newTreasures);
        
        // Generate clues
        const newClues = treasuresArray.map((tIndex, i) => {
            const row = Math.floor(tIndex / GRID_SIZE);
            const col = tIndex % GRID_SIZE;
            const displayRow = row + 1;
            const displayCol = col + 1;

            return {
                treasureIndex: tIndex,
                rowOp: generateMathOperation(displayRow),
                colOp: generateMathOperation(displayCol),
                rowRes: displayRow,
                colRes: displayCol,
                found: false
            };
        });

        setGrid(newGrid);
        setTreasures(treasuresArray);
        setClues(newClues);
        setPlayerScore(0);
        setEnemyScore(0);
        setGameOver(false);
        setWinner(null);
    };

    useEffect(() => {
        initGame();
    }, []);

    const enemyTurn = (currentGrid: CellStatus[], currentClues: MathClue[]) => {
        // Enemy picks a random hidden cell
        const available = currentGrid
            .map((status, idx) => status === 'hidden' ? idx : -1)
            .filter(idx => idx !== -1);

        if (available.length === 0) return;

        const choice = available[Math.floor(Math.random() * available.length)];
        const newGrid = [...currentGrid];
        let hit = false;

        if (treasures.includes(choice)) {
            newGrid[choice] = 'enemy-hit';
            hit = true;
            
            // Update clues logic for shared state if needed, though enemy just steals points
            const clueIndex = currentClues.findIndex(c => c.treasureIndex === choice);
            if (clueIndex !== -1) {
                currentClues[clueIndex].found = true;
            }
        } else {
            // Enemy miss doesn't mark grid to avoid confusing player, or maybe we mark it grey?
            // Let's not mark enemy misses to keep grid clean for player clues
        }

        return { newGrid, hit };
    };

    const handleCellClick = (index: number) => {
        if (gameOver || grid[index] !== 'hidden') return;

        let newGrid = [...grid];
        let newClues = [...clues];
        let newPlayerScore = playerScore;
        let newEnemyScore = enemyScore;

        // Player Turn
        if (treasures.includes(index)) {
            newGrid[index] = 'hit';
            newPlayerScore++;
            const clueIndex = newClues.findIndex(c => c.treasureIndex === index);
            if (clueIndex !== -1) newClues[clueIndex].found = true;
        } else {
            newGrid[index] = 'miss';
        }

        // Check Win immediately
        if (newPlayerScore + newEnemyScore >= TREASURE_COUNT) {
             finishGame(newPlayerScore, newEnemyScore, newGrid, newClues);
             return;
        }

        // Enemy Turn (Simulated instantly for better UX flow)
        const enemyResult = enemyTurn(newGrid, newClues);
        if (enemyResult) {
            newGrid = enemyResult.newGrid;
            if (enemyResult.hit) {
                newEnemyScore++;
            }
        }

        setGrid(newGrid);
        setClues(newClues);
        setPlayerScore(newPlayerScore);
        setEnemyScore(newEnemyScore);

        if (newPlayerScore + newEnemyScore >= TREASURE_COUNT) {
            setGameOver(true);
            setWinner(newPlayerScore > newEnemyScore ? 'player' : 'pirate');
        }
    };

    const finishGame = (pScore: number, eScore: number, g: CellStatus[], c: MathClue[]) => {
        setGrid(g);
        setClues(c);
        setPlayerScore(pScore);
        setEnemyScore(eScore);
        setGameOver(true);
        setWinner(pScore > eScore ? 'player' : 'pirate');
    }

    return (
        <div className="w-full mt-4 p-4 bg-blue-50 dark:bg-gray-900 rounded-xl border-2 border-blue-200 dark:border-blue-800 max-w-2xl mx-auto flex flex-col md:flex-row gap-8 relative">
            {winner === 'player' && <Celebration />}
            
            {/* Left: Grid */}
            <div className="flex-1 flex flex-col items-center">
                <div className="text-center mb-4 w-full">
                    <h3 className="font-bold text-blue-900 dark:text-blue-300 text-lg">⚔️ Duelo de Piratas ⚔️</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        ¡Encuentra el tesoro antes que el pirata rival!
                    </p>
                    <div className="flex justify-center gap-6 text-sm font-bold bg-white dark:bg-gray-800 p-2 rounded-full shadow">
                        <span className="text-green-600 flex items-center">😎 Tú: {playerScore}</span>
                        <span className="text-red-600 flex items-center">🏴‍☠️ Rival: {enemyScore}</span>
                    </div>
                    {winner && (
                        <div className={`mt-2 font-extrabold text-lg animate-bounce ${winner === 'player' ? 'text-green-600' : 'text-red-500'}`}>
                            {winner === 'player' ? '¡GANASTE EL TESORO!' : '¡EL PIRATA TE GANÓ!'}
                        </div>
                    )}
                </div>

                <div className="relative">
                    {/* Column Labels */}
                    <div className="flex ml-8 mb-1">
                        {[1, 2, 3, 4, 5].map(n => (
                            <div key={n} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-bold text-blue-800 text-xs sm:text-sm">
                                C{n}
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex">
                         {/* Row Labels */}
                        <div className="flex flex-col mr-1">
                            {[1, 2, 3, 4, 5].map(n => (
                                <div key={n} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-bold text-blue-800 text-xs sm:text-sm">
                                    F{n}
                                </div>
                            ))}
                        </div>

                        {/* The Grid */}
                        <div 
                            className="grid gap-1 bg-blue-200 p-1 rounded-lg"
                            style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
                        >
                            {grid.map((status, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleCellClick(index)}
                                    disabled={gameOver || status !== 'hidden'}
                                    className={`
                                        w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-lg rounded transition-all duration-300
                                        ${status === 'hidden' ? 'bg-blue-500 hover:bg-blue-400 text-transparent' : ''}
                                        ${status === 'miss' ? 'bg-blue-900 text-white opacity-50' : ''}
                                        ${status === 'hit' ? 'bg-yellow-400 text-white animate-bounce z-10' : ''}
                                        ${status === 'enemy-hit' ? 'bg-red-600 text-white animate-pulse' : ''}
                                    `}
                                >
                                    {status === 'hidden' && '?'}
                                    {status === 'miss' && 'X'}
                                    {status === 'hit' && '🍌'}
                                    {status === 'enemy-hit' && '🏴‍☠️'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Math Clues */}
            <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-inner">
                <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-3 border-b pb-2">📋 Mapa del Tesoro</h4>
                <div className="space-y-3">
                    {clues.map((clue, i) => (
                        <div 
                            key={i} 
                            className={`p-3 rounded-lg border transition-all ${
                                clue.found 
                                    ? 'bg-gray-100 border-gray-300 opacity-50 grayscale' 
                                    : 'bg-yellow-50 border-yellow-200'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-sm text-gray-600">Pista #{i + 1}</span>
                                {clue.found && <span className="text-xs font-bold text-gray-500">DESCUBIERTO</span>}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="bg-white/50 p-1 rounded text-center">
                                    <span className="block text-xs text-gray-500">Fila</span>
                                    <span className="font-mono font-bold text-blue-600">{clue.rowOp}</span>
                                </div>
                                <div className="bg-white/50 p-1 rounded text-center">
                                    <span className="block text-xs text-gray-500">Columna</span>
                                    <span className="font-mono font-bold text-purple-600">{clue.colOp}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {gameOver && (
                    <div className={`mt-4 ${winner === 'player' ? 'animate-bounce' : ''}`}>
                         <button 
                            onClick={initGame}
                            className={`w-full text-white py-3 rounded-lg font-bold shadow-lg transform hover:scale-105 transition-transform ${winner === 'player' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            ¡Jugar otra vez!
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BattleshipGame;