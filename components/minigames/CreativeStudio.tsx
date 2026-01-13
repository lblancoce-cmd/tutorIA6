
import React, { useState, useRef, useEffect } from 'react';
import { MusicalNoteIcon, PaintBrushIcon, PlayIcon, StopIcon, TrashIcon, BeakerIcon } from '@heroicons/react/24/solid';

const COLORS = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF', '#FFA500', '#808080'];

const PixelArt = () => {
    const [grid, setGrid] = useState<string[]>(Array(16 * 16).fill('#FFFFFF'));
    const [selectedColor, setSelectedColor] = useState('#000000');
    const isDrawing = useRef(false);

    const paint = (index: number) => {
        const newGrid = [...grid];
        newGrid[index] = selectedColor;
        setGrid(newGrid);
    };

    return (
        <div className="flex flex-col items-center">
            <div className="flex gap-2 mb-4 bg-gray-100 p-2 rounded-full shadow-inner overflow-x-auto max-w-full">
                {COLORS.map(c => (
                    <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-8 h-8 rounded-full border-2 ${selectedColor === c ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                    />
                ))}
            </div>
            
            <div 
                className="grid bg-gray-300 border-4 border-gray-800 touch-none"
                style={{ 
                    gridTemplateColumns: 'repeat(16, 1fr)',
                    width: 'min(90vw, 300px)',
                    height: 'min(90vw, 300px)'
                }}
                onMouseDown={() => isDrawing.current = true}
                onMouseUp={() => isDrawing.current = false}
                onMouseLeave={() => isDrawing.current = false}
                onTouchStart={() => isDrawing.current = true}
                onTouchEnd={() => isDrawing.current = false}
            >
                {grid.map((color, i) => (
                    <div 
                        key={i}
                        style={{ backgroundColor: color }}
                        onMouseDown={() => paint(i)}
                        onMouseEnter={() => isDrawing.current && paint(i)}
                        // Basic touch support approximation
                        onTouchMove={(e) => {
                            if(isDrawing.current) {
                                // In a real app, we'd calculate the element under the finger
                                // simpler here just to allow tap
                                paint(i); 
                            }
                        }}
                        className="hover:opacity-90 cursor-crosshair"
                    />
                ))}
            </div>
            <button 
                onClick={() => setGrid(Array(256).fill('#FFFFFF'))}
                className="mt-4 text-sm text-red-500 hover:underline"
            >
                Borrar lienzo
            </button>
        </div>
    );
};

const MusicMaker = () => {
    const audioCtxRef = useRef<AudioContext | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [tempo, setTempo] = useState(120); // BPM
    
    // 8 Notes (Rows) x 8 Steps (Cols)
    // Rows ordered High to Low for visual logic (Top is High pitch)
    const NOTES = [
        { label: 'Do+', freq: 523.25, color: 'bg-red-400' },
        { label: 'Si', freq: 493.88, color: 'bg-purple-500' },
        { label: 'La', freq: 440.00, color: 'bg-indigo-500' },
        { label: 'Sol', freq: 392.00, color: 'bg-blue-500' },
        { label: 'Fa', freq: 349.23, color: 'bg-green-500' },
        { label: 'Mi', freq: 329.63, color: 'bg-yellow-500' },
        { label: 'Re', freq: 293.66, color: 'bg-orange-500' },
        { label: 'Do', freq: 261.63, color: 'bg-red-500' },
    ];

    // Grid state: boolean[8 rows][8 cols]
    const [grid, setGrid] = useState<boolean[][]>(
        Array(8).fill(null).map(() => Array(8).fill(false))
    );

    // Initialize Audio Context Lazily
    const getAudioCtx = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return audioCtxRef.current;
    };

    const playTone = (freq: number, type: 'sine' | 'square' | 'triangle' | 'sawtooth', duration = 0.3) => {
        const ctx = getAudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + duration);
    };

    // Toggle cell in sequencer
    const toggleCell = (row: number, col: number) => {
        const newGrid = [...grid];
        newGrid[row] = [...newGrid[row]];
        newGrid[row][col] = !newGrid[row][col];
        setGrid(newGrid);
        
        // Preview note if turning on
        if (newGrid[row][col]) {
            playTone(NOTES[row].freq, 'sine', 0.2);
        }
    };

    // Sequencer Loop
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        if (isPlaying) {
            const msPerBeat = (60000 / tempo) / 2; // Eighth notes (corcheas)
            
            timer = setInterval(() => {
                setCurrentStep(prev => {
                    const next = (prev + 1) % 8;
                    return next;
                });
            }, msPerBeat);
        }

        return () => clearInterval(timer);
    }, [isPlaying, tempo]);

    // Trigger notes when step changes
    useEffect(() => {
        if (isPlaying) {
            // Check all rows for the current step
            grid.forEach((row, rowIndex) => {
                if (row[currentStep]) {
                    playTone(NOTES[rowIndex].freq, 'sine', 0.4);
                }
            });
        }
    }, [currentStep, isPlaying]); // Dependencies ensure we read fresh grid if needed (though grid ref might be better for perf, this is fine for small app)

    const clearGrid = () => {
        setGrid(Array(8).fill(null).map(() => Array(8).fill(false)));
        setIsPlaying(false);
        setCurrentStep(0);
    };

    return (
        <div className="flex flex-col items-center w-full">
            <p className="mb-4 text-gray-600 dark:text-gray-300 text-sm">
                Crea tu propia melodía. Activa las casillas y pulsa Play.
            </p>

            {/* Controls */}
            <div className="flex items-center gap-4 mb-4 bg-gray-100 dark:bg-gray-700 p-3 rounded-xl w-full justify-center flex-wrap">
                <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`flex items-center px-4 py-2 rounded-full font-bold text-white transition-colors ${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                >
                    {isPlaying ? <StopIcon className="w-5 h-5 mr-1"/> : <PlayIcon className="w-5 h-5 mr-1"/>}
                    {isPlaying ? 'Parar' : 'Play'}
                </button>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-300">VELOCIDAD</span>
                    <input 
                        type="range" 
                        min="60" 
                        max="200" 
                        value={tempo} 
                        onChange={(e) => setTempo(Number(e.target.value))}
                        className="w-24 accent-purple-600"
                    />
                    <span className="text-xs font-mono w-8">{tempo}</span>
                </div>

                <button onClick={clearGrid} className="p-2 text-gray-500 hover:text-red-500" title="Borrar todo">
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>

            {/* Sequencer Grid */}
            <div className="relative bg-gray-800 p-2 rounded-lg shadow-2xl overflow-x-auto max-w-full">
                {/* Step Indicator Overlay */}
                <div 
                    className="absolute top-0 bottom-0 bg-white/10 pointer-events-none transition-all duration-100 border-l-2 border-r-2 border-yellow-400/50 z-10"
                    style={{ 
                        left: `${(currentStep * 100) / 8}%`, 
                        width: `${100 / 8}%` 
                    }}
                />

                <div className="flex flex-col gap-1 min-w-[300px]">
                    {NOTES.map((note, rowIndex) => (
                        <div key={rowIndex} className="flex items-center gap-1 h-8 sm:h-10">
                            {/* Note Label */}
                            <div className={`w-10 sm:w-12 flex-shrink-0 text-[10px] sm:text-xs font-bold text-white flex items-center justify-center h-full rounded ${note.color} opacity-80`}>
                                {note.label}
                            </div>
                            
                            {/* Row Steps */}
                            <div className="flex-1 grid grid-cols-8 gap-1 h-full">
                                {grid[rowIndex].map((isActive, colIndex) => (
                                    <button
                                        key={`${rowIndex}-${colIndex}`}
                                        onClick={() => toggleCell(rowIndex, colIndex)}
                                        className={`
                                            rounded h-full transition-all duration-100
                                            ${isActive ? note.color : 'bg-gray-700 hover:bg-gray-600'}
                                            ${isActive ? 'brightness-110 shadow-[0_0_10px_rgba(255,255,255,0.5)] scale-95' : ''}
                                        `}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6 flex justify-center gap-2">
                <button onClick={() => playTone(100, 'square')} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-lg text-xs font-bold hover:scale-105 transition">🥁 Bombo</button>
                <button onClick={() => playTone(800, 'triangle')} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-lg text-xs font-bold hover:scale-105 transition">🔔 Campana</button>
                <button onClick={() => playTone(150, 'sawtooth', 0.5)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-lg text-xs font-bold hover:scale-105 transition">🎹 Bajo</button>
            </div>
        </div>
    );
};

const CreativeStudio = () => {
    const [mode, setMode] = useState<'music' | 'art'>('art');

    return (
        <div className="mt-4 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
                <div className="flex space-x-4">
                    <button 
                        onClick={() => setMode('art')}
                        className={`flex items-center px-4 py-2 rounded-full transition-colors ${mode === 'art' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        <PaintBrushIcon className="w-5 h-5 mr-2" /> Arte
                    </button>
                    <button 
                        onClick={() => setMode('music')}
                        className={`flex items-center px-4 py-2 rounded-full transition-colors ${mode === 'music' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        <MusicalNoteIcon className="w-5 h-5 mr-2" /> Música
                    </button>
                </div>
                
                {/* External Link */}
                <a 
                    href="https://musiclab.chromeexperiments.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 hover:bg-yellow-200 font-bold border border-yellow-300 transition-colors shadow-sm"
                >
                    <BeakerIcon className="w-5 h-5 mr-2" />
                    Experimentos Musicales
                </a>
            </div>

            <div className="animate-fade-in">
                {mode === 'art' ? <PixelArt /> : <MusicMaker />}
            </div>
        </div>
    );
};

export default CreativeStudio;
