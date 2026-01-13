import React, { useState, useEffect, useRef } from 'react';
import { Topic, AuditLogEntry, QuizQuestion } from '../types';
import { TrashIcon, PencilIcon, PlusIcon, ArrowLeftOnRectangleIcon, UserGroupIcon, ComputerDesktopIcon, SunIcon, UserIcon, TableCellsIcon, ArrowPathIcon, ArrowsPointingOutIcon, ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, CursorArrowRaysIcon, AcademicCapIcon, HandRaisedIcon, CheckCircleIcon, XCircleIcon, BoltIcon, ArrowsRightLeftIcon, MegaphoneIcon, BellAlertIcon, StopCircleIcon, ExclamationTriangleIcon, PlayCircleIcon } from '@heroicons/react/24/solid';
import { simulateUnlock, resetClassProgress, getAccessData, approveAccess, revokeAccess, approveAll, revokeAll, GameZoneAccessData } from '../utils/classGameLogic';
import ThemeToggle from './ThemeToggle';

interface Props {
    onBack: () => void;
    onCloseSession: () => void;
    currentTopics: Topic[];
    onUpdateTopics: (topics: Topic[]) => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

// --- GAME ZONE ACCESS MANAGER ---
const GameZoneAccessManager: React.FC<{ logAction: (action: string, details: string) => void }> = ({ logAction }) => {
    const [accessData, setAccessData] = useState<GameZoneAccessData>({ requests: [], approved: [] });

    useEffect(() => {
        const interval = setInterval(() => {
            setAccessData(getAccessData());
        }, 2000);
        setAccessData(getAccessData()); // Initial load
        return () => clearInterval(interval);
    }, []);

    const handleApprove = (email: string) => {
        approveAccess(email);
        setAccessData(getAccessData());
        logAction('GAMEZONE_APPROVE', `Approved access for ${email}`);
    };
    const handleRevoke = (email: string) => {
        revokeAccess(email);
        setAccessData(getAccessData());
        logAction('GAMEZONE_REVOKE', `Revoked access for ${email}`);
    };
    const handleApproveAll = () => {
        approveAll();
        setAccessData(getAccessData());
        logAction('GAMEZONE_APPROVE_ALL', `Approved all ${accessData.requests.length} pending requests`);
    };
    const handleRevokeAll = () => {
        revokeAll();
        setAccessData(getAccessData());
        logAction('GAMEZONE_REVOKE_ALL', `Revoked all access`);
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm h-full flex flex-col animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center mb-6">
                <PlayCircleIcon className="w-8 h-8 mr-3 text-purple-600"/> Gestión de Acceso a la Game Zone
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                {/* Pending Requests */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-lg text-gray-700 dark:text-gray-200">Solicitudes Pendientes ({accessData.requests.length})</h4>
                        <button 
                            onClick={handleApproveAll} 
                            disabled={accessData.requests.length === 0}
                            className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-bold hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            Aprobar Todos
                        </button>
                    </div>
                    <div className="flex-1 space-y-2 overflow-y-auto">
                        {accessData.requests.length === 0 && <p className="text-sm text-gray-500 text-center pt-8">No hay nuevas solicitudes.</p>}
                        {accessData.requests.map(email => (
                            <div key={email} className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{email.split('@')[0]}</span>
                                <button onClick={() => handleApprove(email)} className="p-2 bg-green-100 hover:bg-green-200 rounded-full">
                                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Approved Students */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-lg text-gray-700 dark:text-gray-200">Con Acceso ({accessData.approved.length})</h4>
                        <button 
                            onClick={handleRevokeAll} 
                            disabled={accessData.approved.length === 0}
                            className="text-xs bg-red-600 text-white px-3 py-1 rounded-full font-bold hover:bg-red-700 disabled:bg-gray-400"
                        >
                            Revocar Todos
                        </button>
                    </div>
                    <div className="flex-1 space-y-2 overflow-y-auto">
                        {accessData.approved.length === 0 && <p className="text-sm text-gray-500 text-center pt-8">Nadie tiene acceso ahora mismo.</p>}
                        {accessData.approved.map(email => (
                            <div key={email} className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{email.split('@')[0]}</span>
                                <button onClick={() => handleRevoke(email)} className="p-2 bg-red-100 hover:bg-red-200 rounded-full">
                                    <XCircleIcon className="w-5 h-5 text-red-600" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- CLASSROOM GENERATOR SUB-COMPONENT ---
interface Position {
    x: number;
    y: number;
}
type LayoutConfig = 'standard' | 'square' | 'plus_one'; 
type Orientation = 'vertical' | 'horizontal';
type MovableElement = 'teacher' | 'screen' | 'windows' | 'students_main' | 'student_extra';

const ClassroomManager = () => {
    const [selectedClass, setSelectedClass] = useState<'A' | 'B'>('A');
    const [distributionMode, setDistributionMode] = useState<'individual' | 'groups'>('individual');
    const [groupSize, setGroupSize] = useState<number>(4);
    const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>('standard');
    const [orientation, setOrientation] = useState<Orientation>('vertical');
    const [students, setStudents] = useState<number[]>([]);
    const [isManualMode, setIsManualMode] = useState(false);
    const [swapSourceIndex, setSwapSourceIndex] = useState<number | null>(null);
    const [dragSourceIndex, setDragSourceIndex] = useState<number | null>(null);
    const [pendingShuffle, setPendingShuffle] = useState(false);
    const canvasRef = useRef<HTMLDivElement>(null);
    const [dragState, setDragState] = useState<{
        isDragging: boolean;
        element: MovableElement | null;
        startX: number;
        startY: number;
        initialX: number;
        initialY: number;
    }>({ isDragging: false, element: null, startX: 0, startY: 0, initialX: 0, initialY: 0 });
    const [selectedElement, setSelectedElement] = useState<MovableElement>('students_main');
    const [positions, setPositions] = useState<Record<MovableElement, Position>>({
        teacher: { x: 42, y: 2 },
        screen: { x: 40, y: 0 },
        windows: { x: 0, y: 20 },
        students_main: { x: 15, y: 25 },
        student_extra: { x: 80, y: 80 }
    });
    const [teacherPlacement, setTeacherPlacement] = useState<string>('top-center');
    const [visibleElements, setVisibleElements] = useState({
        teacher: true,
        screen: true,
        windows: true
    });

    const generateRandomArray = (count: number) => {
        const nums = Array.from({ length: count }, (_, i) => i + 1);
        for (let i = nums.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [nums[i], nums[j]] = [nums[j], nums[i]];
        }
        return nums;
    };

    useEffect(() => {
        const count = selectedClass === 'A' ? 24 : 25;
        setStudents(Array.from({ length: count }, (_, i) => i + 1));
        if (selectedClass === 'A') {
            setLayoutConfig('standard');
            setOrientation('vertical');
        } else {
            setLayoutConfig('square');
            setOrientation('vertical');
        }
        setIsManualMode(false);
        setPendingShuffle(false);
        setSwapSourceIndex(null);
    }, [selectedClass]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                if (selectedElement === 'teacher') setTeacherPlacement('custom');
                setPositions(prev => {
                    const current = prev[selectedElement];
                    let newX = current.x, newY = current.y;
                    const step = e.shiftKey ? 5 : 1;
                    if (e.key === 'ArrowUp') newY -= step;
                    if (e.key === 'ArrowDown') newY += step;
                    if (e.key === 'ArrowLeft') newX -= step;
                    if (e.key === 'ArrowRight') newX += step;
                    return { ...prev, [selectedElement]: { x: Math.min(100, Math.max(0, newX)), y: Math.min(100, Math.max(0, newY)) } };
                });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedElement]);

    const startRandomShuffle = () => {
        const count = selectedClass === 'A' ? 24 : 25;
        setStudents(generateRandomArray(count));
        setPendingShuffle(true);
        setIsManualMode(false);
    };
    const confirmShuffle = () => { setPendingShuffle(false); setIsManualMode(true); };
    const discardAndRetryShuffle = () => { const count = selectedClass === 'A' ? 24 : 25; setStudents(generateRandomArray(count)); };
    const handleStudentClick = (index: number) => {
        if (!isManualMode) return;
        if (swapSourceIndex === null) setSwapSourceIndex(index);
        else {
            const newStudents = [...students];
            [newStudents[swapSourceIndex], newStudents[index]] = [newStudents[index], newStudents[swapSourceIndex]];
            setStudents(newStudents);
            setSwapSourceIndex(null);
        }
    };
    const handleStudentDragStart = (e: React.DragEvent, index: number) => { if (!isManualMode) { e.preventDefault(); return; } e.stopPropagation(); setDragSourceIndex(index); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", index.toString()); };
    const handleStudentDragOver = (e: React.DragEvent) => { if (!isManualMode) return; e.preventDefault(); e.dataTransfer.dropEffect = "move"; };
    const handleStudentDrop = (e: React.DragEvent, targetIndex: number) => { if (!isManualMode || dragSourceIndex === null || dragSourceIndex === targetIndex) return; e.preventDefault(); e.stopPropagation(); const newStudents = [...students]; [newStudents[dragSourceIndex], newStudents[targetIndex]] = [newStudents[targetIndex], newStudents[dragSourceIndex]]; setStudents(newStudents); setDragSourceIndex(null); setSwapSourceIndex(null); };
    const handleElementMouseDown = (e: React.MouseEvent | React.TouchEvent, element: MovableElement) => { if (isManualMode && element === 'students_main') return; e.preventDefault(); const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX; const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY; setDragState({ isDragging: true, element, startX: clientX, startY: clientY, initialX: positions[element].x, initialY: positions[element].y }); setSelectedElement(element); if (element === 'teacher') setTeacherPlacement('custom'); };
    const handleGlobalMouseMove = (e: MouseEvent | TouchEvent) => { if (!dragState.isDragging || !dragState.element || !canvasRef.current) return; e.preventDefault(); const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX; const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY; const rect = canvasRef.current.getBoundingClientRect(); const deltaXPercent = ((clientX - dragState.startX) / rect.width) * 100; const deltaYPercent = ((clientY - dragState.startY) / rect.height) * 100; let newX = dragState.initialX + deltaXPercent; let newY = dragState.initialY + deltaYPercent; newX = Math.min(100, Math.max(0, newX)); newY = Math.min(100, Math.max(0, newY)); setPositions(prev => ({ ...prev, [dragState.element!]: { x: newX, y: newY } })); };
    const handleGlobalMouseUp = () => { if (dragState.isDragging) { setDragState(prev => ({ ...prev, isDragging: false, element: null })); } };
    useEffect(() => { if (dragState.isDragging) { window.addEventListener('mousemove', handleGlobalMouseMove); window.addEventListener('mouseup', handleGlobalMouseUp); window.addEventListener('touchmove', handleGlobalMouseMove, { passive: false }); window.addEventListener('touchend', handleGlobalMouseUp); } else { window.removeEventListener('mousemove', handleGlobalMouseMove); window.removeEventListener('mouseup', handleGlobalMouseUp); window.removeEventListener('touchmove', handleGlobalMouseMove); window.removeEventListener('touchend', handleGlobalMouseUp); } return () => { window.removeEventListener('mousemove', handleGlobalMouseMove); window.removeEventListener('mouseup', handleGlobalMouseUp); window.removeEventListener('touchmove', handleGlobalMouseMove); window.removeEventListener('touchend', handleGlobalMouseUp); }; }, [dragState]);
    const moveSelected = (dx: number, dy: number) => { if (selectedElement === 'teacher') setTeacherPlacement('custom'); setPositions(prev => ({ ...prev, [selectedElement]: { x: Math.min(100, Math.max(0, prev[selectedElement].x + dx)), y: Math.min(100, Math.max(0, prev[selectedElement].y + dy)) } })); };
    const handleTeacherPlacementChange = (e: React.ChangeEvent<HTMLSelectElement>) => { const val = e.target.value; setTeacherPlacement(val); let newY = 2, newX = 42; if (val.includes('top')) newY = 2; if (val.includes('bottom')) newY = 85; if (val.includes('left')) newX = 2; if (val.includes('center')) newX = 42; if (val.includes('right')) newX = 82; setPositions(prev => ({ ...prev, teacher: { x: newX, y: newY } })); setSelectedElement('teacher'); };
    const getGridColsClass = () => { if (layoutConfig === 'square') return 'grid-cols-5'; if (orientation === 'vertical') return 'grid-cols-4'; else return 'grid-cols-6'; };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm h-full flex flex-col animate-fade-in">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center"><TableCellsIcon className="w-6 h-6 mr-2 text-purple-600"/> Distribución de Aula</h3>
                <div className="flex flex-wrap gap-2">
                    {!pendingShuffle && (<button onClick={() => { setIsManualMode(!isManualMode); setSwapSourceIndex(null); }} className={`px-4 py-2 rounded-lg font-bold shadow transition-all flex items-center ${isManualMode ? 'bg-amber-500 text-white ring-2 ring-amber-300' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200'}`}><HandRaisedIcon className="w-5 h-5 mr-2" />{isManualMode ? 'Terminar Manual' : 'Mezcla Manual'}</button>)}
                    <button onClick={startRandomShuffle} disabled={pendingShuffle} className={`bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-bold shadow transition-transform transform hover:scale-105 flex items-center ${pendingShuffle ? 'opacity-50 cursor-not-allowed' : ''}`}><ArrowPathIcon className="w-5 h-5 mr-2" />Mezcla Aleatoria</button>
                </div>
            </div>
            {pendingShuffle && ( <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/30 border-2 border-purple-500 rounded-xl flex flex-col sm:flex-row items-center justify-between animate-bounce-in"> <div className="flex items-center mb-2 sm:mb-0"> <span className="text-purple-700 dark:text-purple-300 font-bold text-lg mr-2">🎲 Nueva distribución generada.</span> <span className="text-sm text-gray-600 dark:text-gray-400">¿Qué deseas hacer?</span> </div> <div className="flex gap-3"> <button onClick={discardAndRetryShuffle} className="flex items-center px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-bold transition-colors"><XCircleIcon className="w-5 h-5 mr-1"/>Descartar (Repetir)</button> <button onClick={confirmShuffle} className="flex items-center px-6 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg font-bold shadow-lg transition-transform hover:scale-105"><CheckCircleIcon className="w-5 h-5 mr-1"/>Mantener (y Editar)</button> </div> </div> )}
            {isManualMode && ( <div className="mb-4 p-2 bg-amber-100 dark:bg-amber-900/30 border border-amber-400 rounded-lg text-center text-amber-800 dark:text-amber-200 text-sm font-bold animate-pulse">🖐️ MODO MANUAL: Arrastra y suelta las mesas para cambiar sitios.</div> )}
            {!isManualMode && ( <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-lg text-center text-blue-700 dark:text-blue-300 text-xs">💡 Usa las flechas del teclado o arrastra con el ratón para mover los elementos.</div> )}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
                <div className="lg:col-span-1 space-y-6 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 overflow-y-auto max-h-[600px]">
                    <div><label className="block text-xs font-bold uppercase text-gray-500 mb-2">Clase</label><div className="flex gap-2"><button onClick={() => setSelectedClass('A')} className={`flex-1 py-2 px-3 rounded-lg font-bold text-sm transition-colors ${selectedClass === 'A' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border'}`}>A (24)</button><button onClick={() => setSelectedClass('B')} className={`flex-1 py-2 px-3 rounded-lg font-bold text-sm transition-colors ${selectedClass === 'B' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border'}`}>B (25)</button></div></div>
                    <div><label className="block text-xs font-bold uppercase text-gray-500 mb-2">Modo Distribución</label><div className="flex gap-2 mb-2"><button onClick={() => setDistributionMode('individual')} className={`flex-1 py-2 px-3 rounded-lg font-bold text-sm transition-colors ${distributionMode === 'individual' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 border'}`}>Individual</button><button onClick={() => setDistributionMode('groups')} className={`flex-1 py-2 px-3 rounded-lg font-bold text-sm transition-colors ${distributionMode === 'groups' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 border'}`}>Grupos</button></div></div>
                    <div>{distributionMode === 'individual' ? ( <div className="animate-fade-in"><div className="mb-3 bg-gray-200 dark:bg-gray-800 p-1 rounded-lg flex"><button onClick={() => setOrientation('vertical')} className={`flex-1 py-1 px-2 rounded text-xs font-bold flex items-center justify-center ${orientation === 'vertical' ? 'bg-white dark:bg-gray-600 shadow text-purple-600 dark:text-purple-300' : 'text-gray-500'}`}><ArrowsRightLeftIcon className="w-3 h-3 mr-1 rotate-90"/> Vertical</button><button onClick={() => setOrientation('horizontal')} className={`flex-1 py-1 px-2 rounded text-xs font-bold flex items-center justify-center ${orientation === 'horizontal' ? 'bg-white dark:bg-gray-600 shadow text-purple-600 dark:text-purple-300' : 'text-gray-500'}`}><ArrowsRightLeftIcon className="w-3 h-3 mr-1"/> Horizontal</button></div><label className="block text-xs font-bold uppercase text-gray-500 mb-2">Disposición (Grid)</label><div className="space-y-2">{selectedClass === 'A' ? ( <button onClick={() => setLayoutConfig('standard')} className={`w-full text-left px-3 py-2 rounded text-sm border ${layoutConfig === 'standard' ? 'bg-green-100 border-green-500 text-green-800 font-bold' : 'bg-white dark:bg-gray-600 dark:text-white'}`}>Rectangular (24)</button> ) : ( <><button onClick={() => setLayoutConfig('square')} className={`w-full text-left px-3 py-2 rounded text-sm border ${layoutConfig === 'square' ? 'bg-green-100 border-green-500 text-green-800 font-bold' : 'bg-white dark:bg-gray-600 dark:text-white'}`}>Cuadrada (5x5)</button><button onClick={() => setLayoutConfig('plus_one')} className={`w-full text-left px-3 py-2 rounded text-sm border ${layoutConfig === 'plus_one' ? 'bg-green-100 border-green-500 text-green-800 font-bold' : 'bg-white dark:bg-gray-600 dark:text-white'}`}>Rectangular + 1</button></> )}</div></div> ) : ( <div className="animate-fade-in"><label className="block text-xs font-bold uppercase text-gray-500 mb-2">Alumnos por Grupo</label><div className="flex gap-2">{[2, 3, 4, 5, 6].map(size => (<button key={size} onClick={() => setGroupSize(size)} className={`flex-1 py-2 rounded border text-xs ${groupSize === size ? 'bg-green-100 border-green-500 text-green-800 font-bold' : 'bg-white dark:bg-gray-600 dark:text-white'}`}>{size === 6 ? '6+' : size}</button>))}</div></div> )}</div>
                    <hr className="border-gray-200 dark:border-gray-600"/>
                    <div><div className="flex justify-between items-center mb-2"><label className="text-xs font-bold uppercase text-gray-500 flex items-center"><UserIcon className="w-3 h-3 mr-1"/> Posición Profe</label><input type="checkbox" checked={visibleElements.teacher} onChange={e => setVisibleElements({...visibleElements, teacher: e.target.checked})} className="accent-purple-600"/></div>{visibleElements.teacher && (<div className="space-y-2"><select value={teacherPlacement} onChange={handleTeacherPlacementChange} className="w-full p-2 text-sm border rounded-lg bg-white dark:bg-gray-600 dark:text-white dark:border-gray-500 focus:ring-2 focus:ring-purple-500 outline-none"><option value="top-left">Arriba - Izquierda</option><option value="top-center">Arriba - Centro</option><option value="top-right">Arriba - Derecha</option><option value="bottom-left">Abajo - Izquierda</option><option value="bottom-center">Abajo - Centro</option><option value="bottom-right">Abajo - Derecha</option><option value="custom">Personalizado</option></select></div>)}</div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border-2 border-indigo-100 dark:border-gray-600"><label className="block text-xs font-bold uppercase text-indigo-600 mb-3 flex items-center"><CursorArrowRaysIcon className="w-4 h-4 mr-1"/> Mover Elementos</label><div className="grid grid-cols-2 gap-2 mb-4"><button onClick={() => setSelectedElement('students_main')} className={`text-xs p-2 rounded border ${selectedElement === 'students_main' ? 'bg-blue-500 text-white' : 'bg-gray-50 dark:bg-gray-700 dark:text-white'}`}>Alumnos</button><button onClick={() => setSelectedElement('teacher')} className={`text-xs p-2 rounded border ${selectedElement === 'teacher' ? 'bg-blue-500 text-white' : 'bg-gray-50 dark:bg-gray-700 dark:text-white'}`}>Profesor</button><button onClick={() => setSelectedElement('screen')} className={`text-xs p-2 rounded border ${selectedElement === 'screen' ? 'bg-blue-500 text-white' : 'bg-gray-50 dark:bg-gray-700 dark:text-white'}`}>Pantalla</button><button onClick={() => setSelectedElement('windows')} className={`text-xs p-2 rounded border ${selectedElement === 'windows' ? 'bg-blue-500 text-white' : 'bg-gray-50 dark:bg-gray-700 dark:text-white'}`}>Ventanas</button>{layoutConfig === 'plus_one' && distributionMode === 'individual' && ( <button onClick={() => setSelectedElement('student_extra')} className={`col-span-2 text-xs p-2 rounded border ${selectedElement === 'student_extra' ? 'bg-blue-500 text-white' : 'bg-gray-50 dark:bg-gray-700 dark:text-white'}`}>Mesa Suelta</button> )}</div><div className="flex flex-col items-center gap-2"><button onClick={() => moveSelected(0, -5)} className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg"><ChevronUpIcon className="w-6 h-6 dark:text-white"/></button><div className="flex gap-4"><button onClick={() => moveSelected(-5, 0)} className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg"><ChevronLeftIcon className="w-6 h-6 dark:text-white"/></button><button onClick={() => moveSelected(5, 0)} className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg"><ChevronRightIcon className="w-6 h-6 dark:text-white"/></button></div><button onClick={() => moveSelected(0, 5)} className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg"><ChevronDownIcon className="w-6 h-6 dark:text-white"/></button></div></div>
                    <div><label className="block text-xs font-bold uppercase text-gray-500 mb-2">Otros Elementos</label><div className="flex flex-col gap-2 text-sm"><label className="flex items-center cursor-pointer"><input type="checkbox" checked={visibleElements.screen} onChange={e => setVisibleElements({...visibleElements, screen: e.target.checked})} className="mr-2 accent-purple-600"/> Pantalla / Pizarra</label><label className="flex items-center cursor-pointer"><input type="checkbox" checked={visibleElements.windows} onChange={e => setVisibleElements({...visibleElements, windows: e.target.checked})} className="mr-2 accent-purple-600"/> Ventanas</label></div></div>
                </div>
                <div ref={canvasRef} className="lg:col-span-3 bg-gray-200 dark:bg-gray-900 rounded-xl border-4 border-gray-400 dark:border-gray-600 relative overflow-hidden min-h-[500px] shadow-inner group select-none touch-none">
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"><div className="text-[10rem] font-black text-gray-400/20 dark:text-white/10 border-8 border-gray-400/20 dark:border-white/10 rounded-full w-[400px] h-[400px] flex items-center justify-center rotate-12" style={{ fontFamily: 'cursive' }}>{selectedClass === 'A' ? '6ºA' : '6ºB'}</div></div><div className="absolute bottom-4 right-4 z-0"><div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 flex items-center shadow-sm"><AcademicCapIcon className="w-6 h-6 text-purple-600 mr-2"/><span className="font-bold text-xl text-gray-700 dark:text-gray-200">{selectedClass === 'A' ? 'Clase 6ºA' : 'Clase 6ºB'}</span></div></div>
                    <div className="w-full h-full relative z-10">
                        {visibleElements.screen && ( <div className={`absolute transition-all duration-75 ${selectedElement === 'screen' ? 'ring-4 ring-blue-500 shadow-2xl scale-105 z-50' : 'z-10'} ${dragState.isDragging && dragState.element === 'screen' ? 'cursor-grabbing' : 'cursor-grab'}`} style={{ left: `${positions.screen.x}%`, top: `${positions.screen.y}%` }} onClick={() => setSelectedElement('screen')} onMouseDown={(e) => handleElementMouseDown(e, 'screen')} onTouchStart={(e) => handleElementMouseDown(e, 'screen')}><div className="w-48 h-2 bg-black rounded-md shadow-md flex justify-center cursor-move"><span className="text-[8px] text-white bg-black px-2 -mt-4 rounded">PANTALLA</span></div></div> )}
                        {visibleElements.windows && ( <div className={`absolute transition-all duration-75 flex flex-col gap-4 ${selectedElement === 'windows' ? 'ring-2 ring-blue-500 p-2 bg-blue-500/10 z-50' : 'z-0'} ${dragState.isDragging && dragState.element === 'windows' ? 'cursor-grabbing' : 'cursor-grab'}`} style={{ left: `${positions.windows.x}%`, top: `${positions.windows.y}%` }} onClick={() => setSelectedElement('windows')} onMouseDown={(e) => handleElementMouseDown(e, 'windows')} onTouchStart={(e) => handleElementMouseDown(e, 'windows')}><div className="w-2 h-16 bg-blue-200 border border-blue-400 shadow" title="Ventana"></div><div className="w-2 h-16 bg-blue-200 border border-blue-400 shadow" title="Ventana"></div><div className="w-2 h-16 bg-blue-200 border border-blue-400 shadow" title="Ventana"></div></div> )}
                        {visibleElements.teacher && ( <div className={`absolute transition-all duration-75 ease-linear ${selectedElement === 'teacher' ? 'ring-4 ring-blue-500 shadow-2xl scale-105 z-50' : 'z-20'} ${dragState.isDragging && dragState.element === 'teacher' ? 'cursor-grabbing' : 'cursor-grab'}`} style={{ left: `${positions.teacher.x}%`, top: `${positions.teacher.y}%` }} onClick={() => setSelectedElement('teacher')} onMouseDown={(e) => handleElementMouseDown(e, 'teacher')} onTouchStart={(e) => handleElementMouseDown(e, 'teacher')}><div className="w-32 h-12 bg-amber-800 rounded-lg flex items-center justify-center text-white text-xs shadow-lg border border-amber-900">Mesa Profe</div></div> )}
                        <div className={`absolute transition-all duration-75 ${selectedElement === 'students_main' && !isManualMode ? 'ring-4 ring-blue-500 bg-blue-500/5 p-4 rounded-xl z-40' : 'z-30'} ${!isManualMode && (dragState.isDragging && dragState.element === 'students_main' ? 'cursor-grabbing' : 'cursor-grab')}`} style={{ left: `${positions.students_main.x}%`, top: `${positions.students_main.y}%` }} onClick={() => setSelectedElement('students_main')} onMouseDown={(e) => handleElementMouseDown(e, 'students_main')} onTouchStart={(e) => handleElementMouseDown(e, 'students_main')}>
                            {distributionMode === 'individual' ? ( <div className={`grid ${getGridColsClass()} gap-4`}> {students.slice(0, layoutConfig === 'plus_one' ? 24 : undefined).map((num, idx) => ( <div key={idx} draggable={isManualMode} onDragStart={(e) => handleStudentDragStart(e, idx)} onDragOver={handleStudentDragOver} onDrop={(e) => handleStudentDrop(e, idx)} onClick={(e) => { e.stopPropagation(); handleStudentClick(idx); }} className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center font-bold shadow-sm transition-all select-none ${isManualMode ? 'cursor-grab active:cursor-grabbing hover:scale-110' : ''} ${isManualMode && (swapSourceIndex === idx || dragSourceIndex === idx) ? 'bg-amber-400 text-white ring-4 ring-amber-200 scale-110 z-50' : isManualMode ? 'bg-amber-100 text-amber-900 border-2 border-amber-300 hover:bg-amber-200' : 'bg-blue-100 border-2 border-blue-400 text-blue-800'}`} title={`Alumno ${num}`}>{num}</div> ))}</div> ) : ( <div className="flex flex-wrap gap-8 justify-center w-full px-4">{(() => { const chunks = []; const studentList = students.slice(0, selectedClass === 'A' ? 24 : 25); for (let i = 0; i < studentList.length; i += groupSize) { chunks.push(studentList.slice(i, i + groupSize)); } return chunks.map((group, gIdx) => ( <div key={gIdx} className="relative bg-amber-100/90 dark:bg-amber-900/60 p-4 pt-6 rounded-2xl border-4 border-amber-300/50 dark:border-amber-700 shadow-md flex flex-wrap gap-2 justify-center items-center min-w-[140px]"><div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border border-amber-600 z-10 whitespace-nowrap">MESA {gIdx + 1}</div>{group.map((num, sIdx) => { const globalIndex = gIdx * groupSize + sIdx; return ( <div key={num} draggable={isManualMode} onDragStart={(e) => handleStudentDragStart(e, globalIndex)} onDragOver={handleStudentDragOver} onDrop={(e) => handleStudentDrop(e, globalIndex)} onClick={(e) => { e.stopPropagation(); handleStudentClick(globalIndex); }} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-transform ${isManualMode ? 'cursor-grab active:cursor-grabbing hover:scale-110' : ''} ${isManualMode && (swapSourceIndex === globalIndex || dragSourceIndex === globalIndex) ? 'bg-purple-500 text-white ring-2 ring-purple-300 z-50 scale-110' : 'bg-white border-2 border-gray-200 text-gray-800'}`}>{num}</div> ); })}</div> )); })()}</div> )}
                        </div>
                        {layoutConfig === 'plus_one' && distributionMode === 'individual' && students[24] && ( <div className={`absolute transition-all duration-75 ${selectedElement === 'student_extra' ? 'ring-4 ring-blue-500 shadow-2xl scale-110 z-50' : 'z-30'} ${dragState.isDragging && dragState.element === 'student_extra' ? 'cursor-grabbing' : 'cursor-grab'}`} style={{ left: `${positions.student_extra.x}%`, top: `${positions.student_extra.y}%` }} onClick={() => setSelectedElement('student_extra')} onMouseDown={(e) => handleElementMouseDown(e, 'student_extra')} onTouchStart={(e) => handleElementMouseDown(e, 'student_extra')}><div className="w-12 h-12 bg-purple-100 border-2 border-purple-500 rounded-lg flex items-center justify-center font-bold text-purple-800 shadow-lg relative">{students[24]}<span className="absolute -top-4 text-[9px] font-bold bg-purple-200 px-1 rounded">Suelta</span></div></div> )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

const AdminDashboard: React.FC<Props> = ({ onBack, onCloseSession, currentTopics, onUpdateTopics, theme, toggleTheme }) => {
    const [activeTab, setActiveTab] = useState<'classroom' | 'gamezone' | 'topics' | 'settings' | 'audit'>('classroom');
    const [topics, setTopics] = useState<Topic[]>(currentTopics);
    const [overrideStatus, setOverrideStatus] = useState<string>(localStorage.getItem('admin_override') || 'auto');
    const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
    const [emergencyMessage, setEmergencyMessage] = useState('');
    
    const adminEmailForDisplay = localStorage.getItem('admin_current_user') || 'Admin';

    useEffect(() => {
        const savedLog = localStorage.getItem('admin_audit_log');
        if (savedLog) {
            try {
                setAuditLog(JSON.parse(savedLog));
            } catch (e) {
                console.error("Failed to parse audit log", e);
                localStorage.removeItem('admin_audit_log');
            }
        }
    }, [activeTab]);

    const logAction = (action: string, details: string) => {
        const newEntry: AuditLogEntry = {
            timestamp: new Date().toISOString(),
            user: 'Admin Action', // Anonymized for privacy
            action,
            details
        };
        const updatedLog = [newEntry, ...auditLog];
        setAuditLog(updatedLog);
        localStorage.setItem('admin_audit_log', JSON.stringify(updatedLog));
    };

    const handleSaveGlobal = () => {
        localStorage.setItem('admin_override', overrideStatus);
        logAction('UPDATE_STATUS', `Status changed to ${overrideStatus}`);
        alert('Configuración guardada');
    };

    const handleUpdateTopicField = (id: string, field: keyof Topic, value: any) => {
        setTopics(topics.map(t => t.id === id ? { ...t, [field]: value } : t));
    };
    
    const handleSaveTopics = () => {
        onUpdateTopics(topics);
        logAction('UPDATE_TOPICS', 'Topics list updated');
        alert('Temas actualizados correctamente');
    };

    const handleDeleteTopic = (id: string) => {
        if(confirm('¿Seguro que quieres borrar este tema?')) {
            const topicTitle = topics.find(t => t.id === id)?.title;
            const newTopics = topics.filter(t => t.id !== id);
            setTopics(newTopics);
            onUpdateTopics(newTopics);
            logAction('DELETE_TOPIC', `Deleted topic: ${topicTitle}`);
        }
    };

    const handleAddTopic = () => {
        const newTopic: Topic = {
            id: Date.now().toString(),
            title: 'Nuevo Tema',
            description: 'Descripción...',
            initialMessage: '¡Hola! ¿En qué puedo ayudarte?',
            icon: '📝',
            questions: []
        };
        const newTopics = [...topics, newTopic];
        setTopics(newTopics);
        onUpdateTopics(newTopics);
        logAction('CREATE_TOPIC', 'Added new topic placeholder');
    };

    const handleSimulateUnlock = (classId: 'A' | 'B') => { simulateUnlock(classId); alert(`¡Puntos de Clase ${classId} llenados! Ve a la GameZone para ver el evento.`); };
    const handleResetClass = (classId: 'A' | 'B') => { resetClassProgress(classId); alert(`Clase ${classId} reiniciada.`); };

    const triggerAlarm = () => { if (confirm('¿ESTÁS SEGURO? Esto activará la alarma en todos los dispositivos.')) { localStorage.setItem('admin_emergency_state', 'alarm'); logAction('EMERGENCY_ALARM', 'Activated Alarm Protocol'); } };
    const triggerAttention = () => { localStorage.setItem('admin_emergency_state', 'attention'); localStorage.setItem('admin_broadcast_message', emergencyMessage || 'Prestad atención al profesor/a.'); logAction('EMERGENCY_ATTENTION', `Activated Attention: ${emergencyMessage}`); };
    const clearEmergency = () => { localStorage.setItem('admin_emergency_state', 'none'); logAction('EMERGENCY_CLEAR', 'Cleared emergency state'); };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Panel Admin</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 break-all">{adminEmailForDisplay}</p>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {[
                        { id: 'classroom', name: 'Aula' }, 
                        { id: 'gamezone', name: 'Acceso Game Zone'},
                        { id: 'topics', name: 'Temas' }, 
                        { id: 'settings', name: 'Ajustes' }, 
                        { id: 'audit', name: 'Registro' }
                    ].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === tab.id ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                            {tab.name}
                        </button>
                    ))}
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="text-xs font-bold text-red-500 uppercase mb-3 px-2 flex items-center"><BoltIcon className="w-4 h-4 mr-1" /> Zona de Emergencia</h4>
                        <div className="space-y-3">
                            <button onClick={triggerAlarm} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center animate-pulse"><BellAlertIcon className="w-5 h-5 mr-2" />ALARMA</button>
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                <input type="text" placeholder="Mensaje para alumnos..." className="w-full text-xs p-2 rounded border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 mb-2" value={emergencyMessage} onChange={(e) => setEmergencyMessage(e.target.value)} />
                                <button onClick={triggerAttention} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center text-sm"><MegaphoneIcon className="w-4 h-4 mr-2" />ATENCIÓN</button>
                            </div>
                            <button onClick={clearEmergency} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center"><StopCircleIcon className="w-5 h-5 mr-2" />Fin del Comunicado</button>
                        </div>
                    </div>
                </nav>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <button onClick={onCloseSession} className="flex items-center text-red-600 hover:text-red-700"><ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2" /><span className="text-sm">Salir</span></button>
                    <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                </div>
            </aside>

            <main className="flex-1 p-8 overflow-y-auto">
                {activeTab === 'classroom' && <ClassroomManager />}

                {activeTab === 'gamezone' && <GameZoneAccessManager logAction={logAction} />}

                {activeTab === 'topics' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center"><h3 className="text-2xl font-bold text-gray-800 dark:text-white">Gestión de Tests</h3><button onClick={handleAddTopic} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><PlusIcon className="w-5 h-5 mr-2" /> Nuevo Tema</button></div>
                        <div className="grid gap-6">
                            {topics.map((topic) => (
                                <div key={topic.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div><label className="block text-xs font-medium text-gray-500 mb-1">Título</label><input value={topic.title} onChange={(e) => handleUpdateTopicField(topic.id, 'title', e.target.value)} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"/></div>
                                        <div><label className="block text-xs font-medium text-gray-500 mb-1">Icono</label><input value={topic.icon} onChange={(e) => handleUpdateTopicField(topic.id, 'icon', e.target.value)} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"/></div>
                                    </div>
                                    <div className="mb-4"><label className="block text-xs font-medium text-gray-500 mb-1">Descripción</label><input value={topic.description} onChange={(e) => handleUpdateTopicField(topic.id, 'description', e.target.value)} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"/></div>
                                    <div className="mb-4"><label className="block text-xs font-medium text-gray-500 mb-1">Mensaje Inicial del Test</label><input value={topic.initialMessage} onChange={(e) => handleUpdateTopicField(topic.id, 'initialMessage', e.target.value)} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"/></div>
                                    <div className="mb-4"><label className="block text-xs font-medium text-gray-500 mb-1">Preguntas (Formato JSON)</label><textarea value={JSON.stringify(topic.questions, null, 2)} onChange={(e) => { try { const parsed = JSON.parse(e.target.value); handleUpdateTopicField(topic.id, 'questions', parsed); } catch (err) { console.error("Invalid JSON"); } }} className="w-full px-3 py-2 border rounded h-48 dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono text-xs"/></div>
                                    <div className="flex justify-end space-x-2"><button onClick={handleSaveTopics} className="text-green-600 hover:bg-green-50 px-3 py-1 rounded flex items-center"><PencilIcon className="w-4 h-4 mr-1" /> Guardar</button><button onClick={() => handleDeleteTopic(topic.id)} className="text-red-600 hover:bg-red-50 px-3 py-1 rounded flex items-center"><TrashIcon className="w-4 h-4 mr-1" /> Borrar</button></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm">
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Control de Acceso</h3>
                            <div className="space-y-6">
                                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estado del Sistema</label><select value={overrideStatus} onChange={(e) => setOverrideStatus(e.target.value)} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"><option value="auto">Automático (Horario Escolar)</option><option value="force_open">Forzar Abierto</option><option value="force_closed">Forzar Cerrado</option></select><p className="mt-2 text-sm text-gray-500">Automático: L-V de 8:00 a 14:00.</p></div>
                                <button onClick={handleSaveGlobal} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Guardar Cambios</button>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm">
                            <div className="flex items-center mb-6"><BoltIcon className="w-8 h-8 text-yellow-500 mr-2" /><h3 className="text-2xl font-bold text-gray-800 dark:text-white">Simular Battle Royale</h3></div>
                            <p className="text-sm text-gray-500 mb-4">Activa manualmente el evento colectivo para una clase (llena los puntos de todos).</p>
                            <div className="space-y-4"><div className="flex gap-2"><button onClick={() => handleSimulateUnlock('A')} className="flex-1 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Activar Clase A</button><button onClick={() => handleSimulateUnlock('B')} className="flex-1 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Activar Clase B</button></div><div className="flex gap-2"><button onClick={() => handleResetClass('A')} className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-xs">Reset A</button><button onClick={() => handleResetClass('B')} className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-xs">Reset B</button></div></div>
                        </div>
                    </div>
                )}

                {activeTab === 'audit' && (
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Registro de Auditoría</h3>
                        <div className="overflow-x-auto"><table className="min-w-full text-left text-sm text-gray-500 dark:text-gray-400"><thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase"><tr><th className="px-6 py-3">Fecha</th><th className="px-6 py-3">Usuario</th><th className="px-6 py-3">Acción</th><th className="px-6 py-3">Detalles</th></tr></thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {auditLog.map((entry, idx) => ( <tr key={idx}><td className="px-6 py-4 whitespace-nowrap">{new Date(entry.timestamp).toLocaleString()}</td><td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{entry.user}</td><td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs ${entry.action.includes('DELETE') ? 'bg-red-100 text-red-800' : entry.action.includes('CREATE') ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{entry.action}</span></td><td className="px-6 py-4">{entry.details}</td></tr> ))}
                                {auditLog.length === 0 && (<tr><td colSpan={4} className="px-6 py-4 text-center">No hay registros.</td></tr>)}
                            </tbody></table></div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;