
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeftIcon, TrashIcon, ChatBubbleBottomCenterTextIcon, PhotoIcon, SparklesIcon, DocumentArrowDownIcon, CloudArrowUpIcon, CheckIcon } from '@heroicons/react/24/solid';

// Types for canvas elements
interface CanvasElement {
    id: number;
    type: 'text' | 'sticker' | 'image';
    x: number;
    y: number;
    text?: string;
    fontSize?: number;
    color?: string;
    src?: string;
    width: number;
    height: number;
}

const STICKERS = [
    { url: 'https://cdn-icons-png.flaticon.com/512/4251/4251950.png' }, // Teide
    { url: 'https://cdn-icons-png.flaticon.com/512/3204/3204990.png' }, // Drago
    { url: 'https://cdn-icons-png.flaticon.com/512/2909/2909761.png' }, // Plátano
    { url: 'https://cdn-icons-png.flaticon.com/512/3089/3089636.png' }, // Guagua
    { url: 'https://cdn-icons-png.flaticon.com/512/1047/1047484.png' }, // Papas
    { url: 'https://cdn-icons-png.flaticon.com/512/3069/3069357.png' }, // Loro
    { url: 'https://cdn-icons-png.flaticon.com/512/1000/1000020.png' }, // Sun
    { url: 'https://cdn-icons-png.flaticon.com/512/5455/5455820.png' }, // Wave
    { url: 'https://cdn-icons-png.flaticon.com/512/1458/1458427.png' }, // Canary Bird
    { url: 'https://cdn-icons-png.flaticon.com/512/1791/1791336.png' }, // Carnival Mask
];

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const ImageEditor: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [elements, setElements] = useState<CanvasElement[]>([]);
    const [activeTool, setActiveTool] = useState<'stickers' | 'text' | 'upload'>('stickers');
    const [showSaved, setShowSaved] = useState(false);
    
    // Dragging state
    const [dragging, setDragging] = useState<number | null>(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const savedElements = localStorage.getItem('imageEditorCanvas');
        if (savedElements) {
            setElements(JSON.parse(savedElements));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('imageEditorCanvas', JSON.stringify(elements));
        if (elements.length > 0) {
            setShowSaved(true);
            const timer = setTimeout(() => setShowSaved(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [elements]);

    const redrawCanvas = async () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (const el of elements) {
            if (el.type === 'text') {
                ctx.fillStyle = el.color || 'black';
                ctx.font = `${el.fontSize || 48}px Arial`;
                ctx.fillText(el.text || '', el.x, el.y);
            } else if (el.type === 'sticker' || el.type === 'image') {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.src = el.src!;
                
                await new Promise<void>(resolve => {
                    if (img.complete) {
                        ctx.drawImage(img, el.x, el.y, el.width, el.height);
                        resolve();
                    } else {
                        img.onload = () => {
                            ctx.drawImage(img, el.x, el.y, el.width, el.height);
                            resolve();
                        };
                        img.onerror = () => resolve();
                    }
                });
            }
        }
    };

    useEffect(() => {
        redrawCanvas();
    }, [elements]);

    const addText = () => {
        const text = prompt("Escribe tu texto:", "Hola Canarias");
        if (text) {
            setElements(prev => [
                ...prev,
                {
                    id: Date.now(),
                    type: 'text',
                    text,
                    x: 100,
                    y: 100,
                    fontSize: 48,
                    color: 'black',
                    width: 0,
                    height: 48,
                }
            ]);
        }
    };

    const addSticker = (url: string) => {
        setElements(prev => [
            ...prev,
            {
                id: Date.now(),
                type: 'sticker',
                src: url,
                x: 150,
                y: 150,
                width: 100,
                height: 100
            }
        ]);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                     setElements(prev => [
                        ...prev,
                        {
                            id: Date.now(),
                            type: 'image',
                            src: event.target?.result as string,
                            x: 50,
                            y: 50,
                            width: img.width > 200 ? 200 : img.width,
                            height: img.height > 200 ? (img.height * (200 / img.width)) : img.height,
                        }
                    ]);
                };
                img.src = event.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    const clearCanvas = () => {
        if (window.confirm("¿Seguro que quieres borrar todo el diseño?")) {
            setElements([]);
            localStorage.removeItem('imageEditorCanvas');
        }
    };

    const downloadImage = async () => {
        const canvas = canvasRef.current;
        if (canvas) {
            await redrawCanvas(); 
            const link = document.createElement('a');
            link.download = 'mi-diseno-canario.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    };

    const getElementAtPos = (x: number, y: number) => {
        for (let i = elements.length - 1; i >= 0; i--) {
            const el = elements[i];
            const ctx = canvasRef.current?.getContext('2d');
            let elWidth = el.width, elHeight = el.height, elY = el.y;
            if (el.type === 'text' && ctx) {
                 ctx.font = `${el.fontSize || 48}px Arial`;
                 elWidth = ctx.measureText(el.text || '').width;
                 elHeight = el.fontSize || 48;
                 elY = el.y - elHeight;
            }
            if (x >= el.x && x <= el.x + elWidth && y >= elY && y <= elY + elHeight) {
                return el.id;
            }
        }
        return null;
    };

    const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        const id = getElementAtPos(x, y);
        if (id) {
            const el = elements.find(elem => elem.id === id)!;
            setDragging(id);
            const elY = el.type === 'text' ? el.y - (el.height || 48) : el.y;
            setOffset({ x: x - el.x, y: y - elY });
        }
    };

    const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (dragging !== null) {
            const canvas = canvasRef.current!;
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;

            setElements(prev =>
                prev.map(el => {
                    if (el.id === dragging) {
                        return { ...el, x: x - offset.x, y: (y - offset.y) + (el.type === 'text' ? (el.height || 48) : 0) };
                    }
                    return el;
                })
            );
        }
    };

    const handleCanvasMouseUp = () => setDragging(null);

    return (
        <div className="min-h-screen bg-gray-200 dark:bg-gray-900 flex flex-col md:flex-row">
            <style>{`.bat-cursor { cursor: url('https://ani.cursors-4u.net/symbols/sym-1/sym65.png'), auto; } .bat-cursor:active { cursor: url('https://ani.cursors-4u.net/symbols/sym-1/sym65.png'), grabbing; }`}</style>

            <aside className="w-full md:w-80 bg-white dark:bg-gray-800 p-4 border-r border-gray-300 dark:border-gray-700 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={onBack} className="flex items-center text-sm font-bold text-gray-500 hover:text-blue-600"><ArrowLeftIcon className="w-5 h-5 mr-1" />Volver</button>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Editor Creativo</h2>
                </div>
                
                <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1 mb-4">
                    <button onClick={() => setActiveTool('stickers')} className={`flex-1 p-2 rounded text-xs font-bold flex items-center justify-center ${activeTool === 'stickers' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}><PhotoIcon className="w-4 h-4 mr-1"/> Stickers</button>
                    <button onClick={() => setActiveTool('text')} className={`flex-1 p-2 rounded text-xs font-bold flex items-center justify-center ${activeTool === 'text' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}><ChatBubbleBottomCenterTextIcon className="w-4 h-4 mr-1"/> Texto</button>
                    <button onClick={() => setActiveTool('upload')} className={`flex-1 p-2 rounded text-xs font-bold flex items-center justify-center ${activeTool === 'upload' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}><CloudArrowUpIcon className="w-4 h-4 mr-1"/> Subir</button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2">
                    {activeTool === 'text' && (<div className="animate-fade-in"><button onClick={addText} className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors">Añadir Texto</button><p className="text-xs text-gray-500 mt-2 text-center">Puedes arrastrar el texto.</p></div>)}
                    {activeTool === 'upload' && (<div className="animate-fade-in text-center"><label htmlFor="file-upload" className="w-full cursor-pointer bg-indigo-500 text-white font-bold py-4 px-4 rounded-lg hover:bg-indigo-600 transition-colors flex flex-col items-center"><CloudArrowUpIcon className="w-8 h-8 mb-2" /><span>Subir Imagen</span></label><input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileUpload} /><p className="text-xs text-gray-500 mt-2">Sube una foto tuya.</p></div>)}
                    {activeTool === 'stickers' && (<div className="grid grid-cols-3 gap-2 animate-fade-in">{STICKERS.map(sticker => (<button key={sticker.url} onClick={() => addSticker(sticker.url)} className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg hover:ring-2 ring-blue-500 flex flex-col items-center aspect-square justify-center"><img src={sticker.url} alt="Sticker" className="w-12 h-12 object-contain" /></button>))}</div>)}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                     <button onClick={clearCanvas} className="w-full flex items-center justify-center gap-2 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-bold text-sm"><TrashIcon className="w-4 h-4"/> Limpiar</button>
                    <button onClick={downloadImage} className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold"><DocumentArrowDownIcon className="w-5 h-5"/> Descargar PNG</button>
                </div>
            </aside>

            <main className="flex-1 flex items-center justify-center p-4 bg-gray-300 dark:bg-gray-900/50 relative">
                {showSaved && (<div className="absolute top-6 right-6 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-lg animate-bounce-in"><CheckIcon className="w-4 h-4 mr-1"/> Guardado</div>)}
                <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="bg-white shadow-2xl rounded-lg max-w-full max-h-full bat-cursor" onMouseDown={handleCanvasMouseDown} onMouseMove={handleCanvasMouseMove} onMouseUp={handleCanvasMouseUp} onMouseLeave={handleCanvasMouseUp} />
            </main>
        </div>
    );
};

export default ImageEditor;
