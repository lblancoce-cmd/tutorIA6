
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { PhotoIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import Celebration from '../Celebration';

const GRID_SIZE = 3; // 3x3 Puzzle

const CanaryPuzzle = () => {
    const [tiles, setTiles] = useState<number[]>([]);
    const [isSolved, setIsSolved] = useState(false);
    const [bgImage, setBgImage] = useState<string>("https://images.unsplash.com/photo-1596466548772-788618164365?q=80&w=600&auto=format&fit=crop");
    const [isGenerating, setIsGenerating] = useState(false);

    const initPuzzle = () => {
        const solved = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i);
        let shuffled = [...solved];
        let emptyIdx = shuffled.length - 1;
        
        // Valid shuffling by simulating moves
        for(let i=0; i<100; i++) {
            const moves = [];
            const row = Math.floor(emptyIdx / GRID_SIZE);
            const col = emptyIdx % GRID_SIZE;
            if(row > 0) moves.push(emptyIdx - GRID_SIZE); 
            if(row < GRID_SIZE-1) moves.push(emptyIdx + GRID_SIZE); 
            if(col > 0) moves.push(emptyIdx - 1); 
            if(col < GRID_SIZE-1) moves.push(emptyIdx + 1); 
            
            const move = moves[Math.floor(Math.random() * moves.length)];
            [shuffled[emptyIdx], shuffled[move]] = [shuffled[move], shuffled[emptyIdx]];
            emptyIdx = move;
        }

        setTiles(shuffled);
        setIsSolved(false);
    };

    useEffect(() => {
        initPuzzle();
    }, []);

    const generateAiImage = async () => {
        setIsGenerating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompts = [
                "A vibrant oil painting of Mount Teide in Tenerife with a blue sky",
                "A futuristic artistic view of the Maspalomas Dunes in Gran Canaria",
                "A magical forest of Laurisilva in La Gomera with fairies",
                "A colorful illustration of a Dragon Tree (Drago Milenario) in Icod"
            ];
            const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: randomPrompt,
                config: {
                    numberOfImages: 1,
                    aspectRatio: '1:1',
                    outputMimeType: 'image/jpeg'
                },
            });

            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
            setBgImage(imageUrl);
            // Re-init puzzle with new image
            setTimeout(initPuzzle, 100);

        } catch (error) {
            console.error("Error generating image:", error);
            alert("No se pudo generar la imagen. Intenta de nuevo.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleTileClick = (index: number) => {
        if (isSolved) return;

        const emptyIndex = tiles.indexOf(GRID_SIZE * GRID_SIZE - 1);
        const row = Math.floor(index / GRID_SIZE);
        const col = index % GRID_SIZE;
        const emptyRow = Math.floor(emptyIndex / GRID_SIZE);
        const emptyCol = emptyIndex % GRID_SIZE;

        const isAdjacent = (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
                           (Math.abs(col - emptyCol) === 1 && row === emptyRow);

        if (isAdjacent) {
            const newTiles = [...tiles];
            [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
            setTiles(newTiles);
            checkWin(newTiles);
        }
    };

    const checkWin = (currentTiles: number[]) => {
        const win = currentTiles.every((val, index) => val === index);
        if (win) setIsSolved(true);
    };

    return (
        <div className="mt-4 flex flex-col items-center bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-md mx-auto relative">
            {isSolved && <Celebration />}
            
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">🧩 Puzzle Mágico Canario</h3>
            <p className="text-sm text-gray-500 mb-4 text-center">
                Reconstruye el paisaje. ¡Usa la IA para crear nuevos destinos!
            </p>

            <div className="mb-4 relative">
                {isGenerating && (
                    <div className="absolute inset-0 z-10 bg-black/50 flex flex-col items-center justify-center rounded-lg text-white">
                        <ArrowPathIcon className="w-10 h-10 animate-spin mb-2"/>
                        <span className="text-xs font-bold">La IA está pintando...</span>
                    </div>
                )}
                
                <div 
                    className="grid gap-0.5 bg-gray-800 p-1 rounded shadow-2xl"
                    style={{ 
                        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                        width: '300px',
                        height: '300px'
                    }}
                >
                    {tiles.map((tileNum, index) => {
                        const isEmpty = tileNum === GRID_SIZE * GRID_SIZE - 1;
                        const bgX = (tileNum % GRID_SIZE) * 100 / (GRID_SIZE - 1);
                        const bgY = Math.floor(tileNum / GRID_SIZE) * 100 / (GRID_SIZE - 1);

                        return (
                            <div
                                key={index}
                                onClick={() => handleTileClick(index)}
                                className={`relative w-full h-full overflow-hidden transition-transform duration-200 ${isEmpty ? 'bg-gray-900 opacity-50' : 'cursor-pointer hover:scale-[0.98]'}`}
                            >
                                {!isEmpty && (
                                    <div 
                                        className="w-full h-full"
                                        style={{
                                            backgroundImage: `url(${bgImage})`,
                                            backgroundSize: '300%',
                                            backgroundPosition: `${bgX}% ${bgY}%`
                                        }}
                                    />
                                )}
                                {!isEmpty && !isSolved && (
                                    <span className="absolute top-1 left-1 text-white text-[10px] font-bold bg-black/40 rounded px-1 shadow-sm pointer-events-none">{tileNum + 1}</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex gap-3">
                <button 
                    onClick={initPuzzle} 
                    disabled={isGenerating}
                    className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-700 font-bold transition-colors text-sm"
                >
                    Mezclar
                </button>
                <button 
                    onClick={generateAiImage}
                    disabled={isGenerating}
                    className="flex items-center px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-full text-white font-bold transition-colors shadow-lg hover:shadow-purple-500/30 text-sm"
                >
                    <PhotoIcon className="w-4 h-4 mr-2" />
                    Nuevo Paisaje IA
                </button>
            </div>
        </div>
    );
};

export default CanaryPuzzle;
