
import React, { useState, useEffect } from 'react';
import Celebration from '../Celebration';

const GRID_SIZE = 10;
const WORD_SETS = {
    'K-POP': ['BTS', 'LISA', 'JIN', 'IDOL', 'STAY'],
    'FIFA': ['GOL', 'FUT', 'EA', 'TOTY', 'PASS'],
    'ROBLOX': ['OBBY', 'PET', 'BLOX', 'SKIN', 'DEV'],
    'ESCUELA': ['LAPIZ', 'PATIO', 'LIBRO', 'SUMA', 'RECREO']
};

interface Cell {
    letter: string;
    x: number;
    y: number;
    selected: boolean;
    found: boolean;
}

const WordSearchGame = () => {
    const [grid, setGrid] = useState<Cell[][]>([]);
    const [words, setWords] = useState<string[]>([]);
    const [foundWords, setFoundWords] = useState<string[]>([]);
    const [selection, setSelection] = useState<{x: number, y: number}[]>([]);
    const [topic, setTopic] = useState<string | null>(null);

    const generateGrid = (wordList: string[]) => {
        // Initialize empty grid
        let newGrid: Cell[][] = Array(GRID_SIZE).fill(null).map((_, y) => 
            Array(GRID_SIZE).fill(null).map((_, x) => ({ 
                letter: '', x, y, selected: false, found: false 
            }))
        );

        const placedWords: string[] = [];

        // Simple placement logic (Horizontal & Vertical only for ease of play)
        for (const word of wordList) {
            let placed = false;
            let attempts = 0;
            while (!placed && attempts < 50) {
                const dir = Math.random() > 0.5 ? 'H' : 'V';
                const startX = Math.floor(Math.random() * (dir === 'H' ? GRID_SIZE - word.length : GRID_SIZE));
                const startY = Math.floor(Math.random() * (dir === 'V' ? GRID_SIZE - word.length : GRID_SIZE));

                let fits = true;
                for (let i = 0; i < word.length; i++) {
                    const cx = dir === 'H' ? startX + i : startX;
                    const cy = dir === 'V' ? startY + i : startY;
                    if (newGrid[cy][cx].letter !== '' && newGrid[cy][cx].letter !== word[i]) {
                        fits = false;
                        break;
                    }
                }

                if (fits) {
                    for (let i = 0; i < word.length; i++) {
                        const cx = dir === 'H' ? startX + i : startX;
                        const cy = dir === 'V' ? startY + i : startY;
                        newGrid[cy][cx].letter = word[i];
                    }
                    placed = true;
                    placedWords.push(word);
                }
                attempts++;
            }
        }

        // Fill empty spaces
        const alphabet = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
        newGrid.forEach(row => row.forEach(cell => {
            if (cell.letter === '') {
                cell.letter = alphabet[Math.floor(Math.random() * alphabet.length)];
            }
        }));

        setGrid(newGrid);
        setWords(placedWords);
        setFoundWords([]);
        setSelection([]);
    };

    const handleCellClick = (x: number, y: number) => {
        // If already part of a found word, ignore
        if (grid[y][x].found) return;

        const newSelection = [...selection];
        const index = newSelection.findIndex(s => s.x === x && s.y === y);

        if (index === -1) {
            // Add to selection
            // Validation: Must be adjacent to last selected or new selection
            if (newSelection.length === 0) {
                newSelection.push({x, y});
            } else {
                const last = newSelection[newSelection.length - 1];
                const dx = Math.abs(x - last.x);
                const dy = Math.abs(y - last.y);
                // Allow only linear selection (horizontal or vertical neighbor)
                if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
                    newSelection.push({x, y});
                } else {
                    // Reset if clicking non-adjacent
                    setSelection([{x, y}]);
                    return;
                }
            }
        } else {
            // Allow deselect if clicking last item? simpler: clear selection
            setSelection([]);
            return;
        }

        setSelection(newSelection);
        checkWord(newSelection);
    };

    const checkWord = (currentSelection: {x: number, y: number}[]) => {
        const selectedWord = currentSelection.map(pos => grid[pos.y][pos.x].letter).join('');
        
        if (words.includes(selectedWord) && !foundWords.includes(selectedWord)) {
            // Word Found!
            const newFoundWords = [...foundWords, selectedWord];
            setFoundWords(newFoundWords);
            
            // Mark cells as found
            const newGrid = [...grid];
            currentSelection.forEach(pos => {
                newGrid[pos.y][pos.x].found = true;
            });
            setGrid(newGrid);
            setSelection([]);
        }
    };

    const selectTopic = (t: string) => {
        setTopic(t);
        generateGrid(WORD_SETS[t as keyof typeof WORD_SETS]);
    };

    const isWin = topic && foundWords.length === words.length;

    return (
        <div className="mt-4 p-4 bg-pink-50 dark:bg-gray-800 rounded-xl border-2 border-pink-200 dark:border-pink-900 max-w-2xl mx-auto w-full relative">
            {isWin && <Celebration />}

            <h3 className="text-2xl font-bold text-center text-pink-800 dark:text-pink-400 mb-4">
                🔤 Sopa de Letras
            </h3>

            {!topic ? (
                 <div className="grid grid-cols-2 gap-4 animate-fade-in">
                    {Object.keys(WORD_SETS).map(t => (
                        <button
                            key={t}
                            onClick={() => selectTopic(t)}
                            className="p-4 bg-white dark:bg-gray-700 rounded-xl shadow hover:bg-pink-100 hover:scale-105 transition-all font-bold text-lg"
                        >
                            {t}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col md:flex-row gap-6 animate-fade-in">
                    {/* Grid */}
                    <div className="flex-1 flex justify-center">
                        <div 
                            className="grid gap-1 bg-pink-200 dark:bg-gray-700 p-2 rounded-lg select-none"
                            style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
                        >
                            {grid.map((row, y) => row.map((cell, x) => (
                                <div
                                    key={`${x}-${y}`}
                                    onClick={() => handleCellClick(x, y)}
                                    className={`
                                        w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center font-bold text-sm sm:text-base rounded cursor-pointer transition-colors
                                        ${cell.found ? 'bg-green-400 text-white' : ''}
                                        ${!cell.found && selection.some(s => s.x === x && s.y === y) ? 'bg-pink-500 text-white' : ''}
                                        ${!cell.found && !selection.some(s => s.x === x && s.y === y) ? 'bg-white dark:bg-gray-600 dark:text-white hover:bg-pink-100' : ''}
                                    `}
                                >
                                    {cell.letter}
                                </div>
                            )))}
                        </div>
                    </div>

                    {/* Word List */}
                    <div className="w-full md:w-48 bg-white dark:bg-gray-700 p-4 rounded-xl h-fit">
                        <h4 className="font-bold mb-3 border-b pb-1">Palabras ({foundWords.length}/{words.length})</h4>
                        <ul className="space-y-2">
                            {words.map(word => (
                                <li 
                                    key={word} 
                                    className={`
                                        px-2 py-1 rounded transition-all
                                        ${foundWords.includes(word) ? 'bg-green-100 text-green-800 line-through' : 'text-gray-600 dark:text-gray-300'}
                                    `}
                                >
                                    {word}
                                </li>
                            ))}
                        </ul>
                        <button 
                            onClick={() => setTopic(null)}
                            className="mt-6 w-full text-sm text-pink-600 hover:underline"
                        >
                            Cambiar tema
                        </button>
                    </div>
                </div>
            )}
             {isWin && (
                 <div className="mt-4 text-center p-4 bg-green-100 rounded-xl animate-bounce shadow-xl border-2 border-green-400">
                     <h3 className="text-2xl font-bold text-green-700">¡SOPA COMPLETADA! 🍜</h3>
                     <p className="text-green-600">¡Eres un crack buscando palabras!</p>
                 </div>
             )}
        </div>
    );
};

export default WordSearchGame;
