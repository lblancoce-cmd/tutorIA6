
import React, { useState, useEffect, useCallback } from 'react';
import { TrophyIcon, UserIcon, CpuChipIcon } from '@heroicons/react/24/solid';
import Celebration from '../Celebration.tsx';

type GameType = 'menu' | 'oca' | 'damas' | 'trivial';

// --- TRIVIAL DATA ---
const TRIVIAL_QUESTIONS = [
    { q: "¿Cuál es la capital de la isla de Tenerife?", a: ["Santa Cruz", "La Laguna", "Puerto de la Cruz"], c: 0 },
    { q: "¿Qué volcán es el pico más alto de España?", a: ["Teneguía", "Teide", "Roque Nublo"], c: 1 },
    { q: "¿En qué juego de mesa se usan fichas blancas y negras?", a: ["Parchís", "Damas", "Oca"], c: 1 },
    { q: "¿Cuántas islas principales forman Canarias?", a: ["7", "8", "6"], c: 1 },
    { q: "¿Qué instrumento es típico del folklore canario?", a: ["Gaita", "Timple", "Piano"], c: 1 },
    { q: "¿Quién pintó la Mona Lisa?", a: ["Picasso", "Da Vinci", "Van Gogh"], c: 1 },
    { q: "¿Cuál es el resultado de 8 x 7?", a: ["54", "56", "64"], c: 1 },
    // New Canarian Questions
    { q: "¿Cómo se llama al autobús en Canarias?", a: ["Bus", "Guagua", "Coche"], c: 1 },
    { q: "¿En qué isla está el Parque Nacional de Garajonay?", a: ["La Gomera", "El Hierro", "La Palma"], c: 0 },
    { q: "¿Qué artista famoso diseñó los Jameos del Agua?", a: ["Picasso", "César Manrique", "Dalí"], c: 1 },
    { q: "¿Cuál es conocida como la 'Isla Bonita'?", a: ["Tenerife", "La Palma", "Fuerteventura"], c: 1 },
    { q: "¿De qué está hecho principalmente el Gofio?", a: ["Pan rallado", "Cereales tostados", "Almendras"], c: 1 },
    { q: "¿Dónde se encuentran las Dunas de Maspalomas?", a: ["Tenerife", "Gran Canaria", "Fuerteventura"], c: 1 },
    { q: "¿Cuál es el deporte canario donde se intenta derribar al oponente?", a: ["Judo", "Lucha Canaria", "Karate"], c: 1 },
    { q: "¿Qué salsa típica acompaña a las papas arrugadas?", a: ["Mayonesa", "Mojo Picón", "Ketchup"], c: 1 },
    { q: "¿En qué municipio está el Drago Milenario?", a: ["Icod de los Vinos", "La Orotava", "Adeje"], c: 0 },
    { q: "¿Quién es la patrona general de Canarias?", a: ["Virgen del Pino", "Virgen de Candelaria", "Virgen de las Nieves"], c: 1 },
];

// --- COMPONENTES ---

const TrivialGame = ({ onBack }: { onBack: () => void }) => {
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

    const handleAnswer = (index: number) => {
        if (feedback !== 'none') return;

        if (index === TRIVIAL_QUESTIONS[currentQ].c) {
            setScore(score + 1);
            setFeedback('correct');
        } else {
            setFeedback('wrong');
        }

        setTimeout(() => {
            setFeedback('none');
            if (currentQ < TRIVIAL_QUESTIONS.length - 1) {
                setCurrentQ(currentQ + 1);
            } else {
                setFinished(true);
            }
        }, 1500);
    };

    if (finished) {
        return (
            <div className="text-center p-8 animate-fade-in relative">
                {score > TRIVIAL_QUESTIONS.length / 2 && <Celebration />}
                <TrophyIcon className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">¡Juego Terminado!</h3>
                <p className="text-xl mb-6">Puntuación: {score} / {TRIVIAL_QUESTIONS.length}</p>
                <button onClick={onBack} className="bg-blue-600 text-white px-6 py-2 rounded-full">Volver al menú</button>
            </div>
        );
    }

    const q = TRIVIAL_QUESTIONS[currentQ];

    return (
        <div className="w-full max-w-lg mx-auto p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <div className="flex justify-between mb-4 text-sm font-bold text-gray-500">
                <span>Pregunta {currentQ + 1}/{TRIVIAL_QUESTIONS.length}</span>
                <span>Puntos: {score}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 min-h-[60px]">{q.q}</h3>
            <div className="space-y-3">
                {q.a.map((ans, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        className={`w-full p-4 rounded-lg text-left transition-all border-2 ${
                            feedback === 'correct' && idx === q.c ? 'bg-green-100 border-green-500 text-green-800 animate-bounce' :
                            feedback === 'wrong' && idx !== q.c ? 'opacity-50' :
                            feedback === 'wrong' && idx === q.c ? 'bg-green-100 border-green-500' : 
                            'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-blue-400'
                        }`}
                    >
                        {ans}
                    </button>
                ))}
            </div>
        </div>
    );
};

const OcaGame = () => {
    const BOARD_SIZE = 30;
    const [playerPos, setPlayerPos] = useState(1);
    const [cpuPos, setCpuPos] = useState(1);
    const [turn, setTurn] = useState<'player' | 'cpu'>('player');
    const [dice, setDice] = useState<number | null>(null);
    const [message, setMessage] = useState("¡Tú empiezas! Tira el dado.");
    const [winner, setWinner] = useState<'player' | 'cpu' | null>(null);
    
    const SPECIAL_CELLS: Record<number, { type: string, jump?: number, msg: string }> = {
        5: { type: 'OCA', jump: 9, msg: "¡De Oca a Oca!" },
        9: { type: 'OCA', jump: 14, msg: "¡De Oca a Oca!" },
        14: { type: 'OCA', jump: 18, msg: "¡De Oca a Oca!" },
        18: { type: 'OCA', jump: 23, msg: "¡De Oca a Oca!" },
        6: { type: 'PUENTE', jump: 12, msg: "¡De puente a puente!" },
        19: { type: 'POSADA', jump: 19, msg: "¡Posada! Pierdes turno." },
        26: { type: 'MUERTE', jump: 1, msg: "¡A la casilla de salida!" }
    };

    const moveToken = (currentPos: number): { newPos: number, msg: string, extraTurn: boolean } => {
        const roll = Math.floor(Math.random() * 6) + 1;
        setDice(roll);
        
        let nextPos = currentPos + roll;
        let msg = `Dado: ${roll}. Avanza a ${Math.min(nextPos, BOARD_SIZE)}.`;
        let extraTurn = false;

        if (nextPos >= BOARD_SIZE) {
            nextPos = BOARD_SIZE;
            msg = "¡META ALCANZADA!";
        } else if (SPECIAL_CELLS[nextPos]) {
            const special = SPECIAL_CELLS[nextPos];
            msg += ` ${special.msg}`;
            if (special.jump) nextPos = special.jump;
            if (special.type === 'OCA') extraTurn = true;
        }

        return { newPos: nextPos, msg, extraTurn };
    };

    const handlePlayerRoll = () => {
        if (turn !== 'player' || winner) return;

        const { newPos, msg, extraTurn } = moveToken(playerPos);
        setPlayerPos(newPos);
        setMessage(`TÚ: ${msg}`);

        if (newPos === BOARD_SIZE) {
            setWinner('player');
            return;
        }

        if (!extraTurn) {
            setTurn('cpu');
        } else {
            setMessage(prev => prev + " ¡Tiras otra vez!");
        }
    };

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;

        if (turn === 'cpu' && !winner) {
            timeoutId = setTimeout(() => {
                const roll = Math.floor(Math.random() * 6) + 1;
                setDice(roll);
                let nextPos = cpuPos + roll;
                let msg = `CPU saca ${roll}. Va a ${Math.min(nextPos, BOARD_SIZE)}.`;
                let extra = false;

                if (nextPos >= BOARD_SIZE) {
                    nextPos = BOARD_SIZE;
                    setWinner('cpu');
                    setCpuPos(nextPos);
                    setMessage("¡La CPU ha ganado! 🤖");
                    return;
                } else if (SPECIAL_CELLS[nextPos]) {
                    const special = SPECIAL_CELLS[nextPos];
                    msg += ` ${special.msg}`;
                    if (special.jump) nextPos = special.jump;
                    if (special.type === 'OCA') extra = true;
                }

                setCpuPos(nextPos);
                setMessage(msg);

                if (extra) {
                     setMessage(prev => prev + " ¡La CPU repite!");
                     setTimeout(() => setTurn('cpu'), 100); 
                } else {
                    setTurn('player');
                }
            }, 1500);
        }
        return () => clearTimeout(timeoutId);
    }, [turn, winner, cpuPos]); 

    const reset = () => {
        setPlayerPos(1);
        setCpuPos(1);
        setTurn('player');
        setWinner(null);
        setDice(null);
        setMessage("¡Nueva carrera! Tira el dado.");
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-green-50 dark:bg-gray-800 p-6 rounded-xl shadow-inner border-4 border-green-200 dark:border-green-900 relative">
            {winner === 'player' && <Celebration />}
            
            <h3 className="text-center font-bold text-green-800 dark:text-green-400 text-2xl mb-4">🦆 La Oca vs CPU</h3>
            
            <div className="grid grid-cols-6 gap-2 mb-6">
                {Array.from({ length: BOARD_SIZE }).map((_, i) => {
                    const cellNum = i + 1;
                    const isP1 = playerPos === cellNum;
                    const isCpu = cpuPos === cellNum;
                    const special = SPECIAL_CELLS[cellNum];
                    
                    return (
                        <div key={cellNum} className={`
                            relative aspect-square rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold border-2
                            ${isP1 || isCpu ? 'z-10 scale-105 shadow-lg' : ''}
                            ${special?.type === 'OCA' ? 'bg-blue-100 border-blue-300' : 'bg-white dark:bg-gray-700 border-gray-300'}
                            ${special?.type === 'MUERTE' ? '!bg-gray-900 text-white' : ''}
                        `}>
                            <span className="absolute top-1 left-1 opacity-40 text-[10px]">{cellNum}</span>
                            <div className="flex space-x-1">
                                {isP1 && <span className="text-xl animate-bounce">🚗</span>}
                                {isCpu && <span className="text-xl animate-pulse">🤖</span>}
                            </div>
                            {!isP1 && !isCpu && special?.type === 'OCA' && '🦆'}
                            {!isP1 && !isCpu && special?.type === 'PUENTE' && '🌉'}
                            {!isP1 && !isCpu && special?.type === 'MUERTE' && '💀'}
                        </div>
                    );
                })}
            </div>

            <div className="text-center bg-white dark:bg-gray-900 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700">
                <div className="flex justify-center items-center gap-8 mb-4 text-sm">
                    <div className={`flex items-center ${turn === 'player' ? 'font-bold text-green-600 scale-110' : 'opacity-50'}`}>
                        <UserIcon className="w-5 h-5 mr-1"/> Tú (🚗)
                    </div>
                    <div className="font-mono text-2xl bg-gray-100 px-3 py-1 rounded">
                        {dice ?? '-'} 🎲
                    </div>
                    <div className={`flex items-center ${turn === 'cpu' ? 'font-bold text-purple-600 scale-110' : 'opacity-50'}`}>
                        <CpuChipIcon className="w-5 h-5 mr-1"/> CPU (🤖)
                    </div>
                </div>

                <div className="text-lg font-bold mb-4 h-12 flex items-center justify-center text-gray-800 dark:text-white animate-pulse">
                    {message}
                </div>
                
                {!winner ? (
                    <button 
                        onClick={handlePlayerRoll}
                        disabled={turn !== 'player'}
                        className={`
                            px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all
                            ${turn === 'player' 
                                ? 'bg-green-600 hover:bg-green-700 text-white transform hover:scale-105' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                        `}
                    >
                        {turn === 'player' ? '¡Tirar Dado!' : 'Esperando a la CPU...'}
                    </button>
                ) : (
                    <button 
                        onClick={reset}
                        className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 animate-bounce"
                    >
                        Jugar de nuevo
                    </button>
                )}
            </div>
        </div>
    );
};

// --- DAMAS GAME (Classic Logic with Forced Captures) ---

interface Position {
    r: number;
    c: number;
}

interface Move {
    from: Position;
    to: Position;
    isCapture: boolean;
    captured?: Position;
}

const DamasGame = () => {
    const BOARD_SIZE = 8;
    // 0: empty, 1: Player (Red), 2: CPU (Black), 3: King Red, 4: King Black
    const [board, setBoard] = useState<number[][]>([]);
    const [turn, setTurn] = useState<1 | 2>(1);
    const [selected, setSelected] = useState<Position | null>(null);
    const [winner, setWinner] = useState<1 | 2 | null>(null);
    const [validMoves, setValidMoves] = useState<Move[]>([]);
    const [mandatoryCapture, setMandatoryCapture] = useState(false);

    useEffect(() => {
        resetBoard();
    }, []);

    // When turn changes or board updates, recalculate legal moves
    useEffect(() => {
        if (board.length === 0) return;
        
        // Check win condition
        const playerPieces = countPieces(1);
        const cpuPieces = countPieces(2);
        if (playerPieces === 0) setWinner(2);
        else if (cpuPieces === 0) setWinner(1);
        else {
            calculateMovesForTurn();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [turn, board]);

    // CPU AI Move
    useEffect(() => {
        if (turn === 2 && !winner && validMoves.length > 0) {
            const timer = setTimeout(() => {
                makeCpuMove();
            }, 1000);
            return () => clearTimeout(timer);
        } else if (turn === 2 && !winner && validMoves.length === 0) {
            // No moves available for CPU -> Player wins
            setWinner(1);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [turn, validMoves, winner]);

    const countPieces = (player: 1 | 2) => {
        let count = 0;
        board.forEach(row => row.forEach(cell => {
            if (cell === player || cell === player + 2) count++;
        }));
        return count;
    };

    const resetBoard = () => {
        const newBoard = Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(0));
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                if ((r + c) % 2 === 1) {
                    if (r < 3) newBoard[r][c] = 2; // CPU
                    if (r > 4) newBoard[r][c] = 1; // Player
                }
            }
        }
        setBoard(newBoard);
        setTurn(1);
        setSelected(null);
        setWinner(null);
    };

    const isValidPos = (r: number, c: number) => r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE;

    const calculateMovesForTurn = useCallback(() => {
        const moves: Move[] = [];
        const isPlayer = turn === 1;
        
        // Scan board for current player's pieces
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                const piece = board[r][c];
                const isKing = piece === 3 || piece === 4;
                
                if ((isPlayer && (piece === 1 || piece === 3)) || (!isPlayer && (piece === 2 || piece === 4))) {
                    // Determine directions
                    // Player moves UP (-1), CPU moves DOWN (+1). Kings move both.
                    const dirs = [];
                    if (isPlayer || isKing) dirs.push(-1);
                    if (!isPlayer || isKing) dirs.push(1);

                    dirs.forEach(dr => {
                        [-1, 1].forEach(dc => {
                            // Check Simple Move
                            const nr = r + dr;
                            const nc = c + dc;
                            if (isValidPos(nr, nc) && board[nr][nc] === 0) {
                                moves.push({ from: {r, c}, to: {r: nr, c: nc}, isCapture: false });
                            }

                            // Check Capture Move (Jump)
                            const jr = r + (dr * 2);
                            const jc = c + (dc * 2);
                            const mr = r + dr; // Midpoint
                            const mc = c + dc;

                            if (isValidPos(jr, jc) && isValidPos(mr, mc)) {
                                const midPiece = board[mr][mc];
                                const targetCell = board[jr][jc];
                                
                                const isOpponent = isPlayer 
                                    ? (midPiece === 2 || midPiece === 4) 
                                    : (midPiece === 1 || midPiece === 3);

                                if (isOpponent && targetCell === 0) {
                                    moves.push({ 
                                        from: {r, c}, 
                                        to: {r: jr, c: jc}, 
                                        isCapture: true, 
                                        captured: {r: mr, c: mc} 
                                    });
                                }
                            }
                        });
                    });
                }
            }
        }

        // FORCED CAPTURE RULE:
        // If any capture move exists, filter out all non-capture moves.
        const captureMoves = moves.filter(m => m.isCapture);
        
        if (captureMoves.length > 0) {
            setValidMoves(captureMoves);
            setMandatoryCapture(true);
        } else {
            setValidMoves(moves);
            setMandatoryCapture(false);
        }
    }, [board, turn]);

    const executeMove = (move: Move) => {
        const newBoard = board.map(row => [...row]);
        const piece = newBoard[move.from.r][move.from.c];
        
        // Move piece
        newBoard[move.from.r][move.from.c] = 0;
        newBoard[move.to.r][move.to.c] = piece;

        // Remove captured
        if (move.isCapture && move.captured) {
            newBoard[move.captured.r][move.captured.c] = 0;
        }

        // King Promotion
        if (piece === 1 && move.to.r === 0) newBoard[move.to.r][move.to.c] = 3;
        if (piece === 2 && move.to.r === BOARD_SIZE - 1) newBoard[move.to.r][move.to.c] = 4;

        setBoard(newBoard);
        setTurn(turn === 1 ? 2 : 1);
        setSelected(null);
    };

    const makeCpuMove = useCallback(() => {
        if (validMoves.length === 0) {
            setWinner(1);
            return;
        }
        // Randomly pick a valid move (validMoves already adheres to forced capture)
        const move = validMoves[Math.floor(Math.random() * validMoves.length)];
        executeMove(move);
    }, [executeMove, validMoves]);

    const handleClick = (r: number, c: number) => {
        if (turn !== 1 || winner) return;

        const piece = board[r][c];
        const isMyPiece = piece === 1 || piece === 3;

        // Select Piece
        if (isMyPiece) {
            // Check if this piece has valid moves available in the strict list
            const movesForPiece = validMoves.filter(m => m.from.r === r && m.from.c === c);
            if (movesForPiece.length > 0) {
                setSelected({ r, c });
            } else {
                // Feedback if user tries to select a piece that CANNOT move due to forced capture elsewhere
                if (mandatoryCapture) {
                    // Maybe shake animation or visual feedback?
                    // For now, we just don't select it.
                    setSelected(null); 
                }
            }
            return;
        }

        // Move to Empty Square
        if (selected && piece === 0) {
            const move = validMoves.find(m => 
                m.from.r === selected.r && m.from.c === selected.c && 
                m.to.r === r && m.to.c === c
            );

            if (move) {
                executeMove(move);
            }
        }
    };

    return (
        <div className="flex flex-col items-center relative">
            {winner === 1 && <Celebration />}
            
            <div className="mb-4 flex justify-between w-full max-w-md items-center px-4">
                <div className={`flex items-center px-3 py-1 rounded font-bold ${turn === 1 ? 'bg-red-500 text-white scale-110' : 'text-gray-400'}`}>
                    <UserIcon className="w-4 h-4 mr-2"/> Tú
                </div>
                
                {winner ? (
                    <div className="font-bold text-xl animate-bounce text-purple-600">
                        {winner === 1 ? "¡HAS GANADO!" : "¡GANA LA CPU!"}
                    </div>
                ) : (
                     <button onClick={resetBoard} className="text-xs underline text-gray-500">Reiniciar</button>
                )}

                <div className={`flex items-center px-3 py-1 rounded font-bold ${turn === 2 ? 'bg-black text-white scale-110' : 'text-gray-400'}`}>
                    <CpuChipIcon className="w-4 h-4 mr-2"/> CPU
                </div>
            </div>

            {mandatoryCapture && turn === 1 && !winner && (
                <div className="mb-2 text-red-600 font-bold animate-pulse bg-red-100 px-4 py-1 rounded-full text-sm border border-red-300">
                    ¡OBLIGATORIO COMER!
                </div>
            )}
            
            <div className="bg-amber-800 p-2 rounded shadow-xl border-4 border-amber-900">
                {board.map((row, r) => (
                    <div key={r} className="flex">
                        {row.map((cell, c) => {
                            const isBlackTile = (r + c) % 2 === 1;
                            const isSelected = selected?.r === r && selected?.c === c;
                            
                            // Check if this cell is a valid move target for the selected piece
                            const isTarget = selected && validMoves.some(m => 
                                m.from.r === selected.r && m.from.c === selected.c && 
                                m.to.r === r && m.to.c === c
                            );

                            // Check if this piece MUST move (highlight hint)
                            const canMove = validMoves.some(m => m.from.r === r && m.from.c === c);

                            return (
                                <div 
                                    key={`${r}-${c}`}
                                    onClick={() => handleClick(r, c)}
                                    className={`
                                        w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center relative
                                        ${isBlackTile ? 'bg-amber-900' : 'bg-amber-200'}
                                        ${isSelected ? 'ring-4 ring-yellow-400 z-10' : ''}
                                        ${isTarget ? 'cursor-pointer' : ''}
                                    `}
                                >
                                    {/* Target Marker */}
                                    {isTarget && (
                                        <div className="absolute inset-0 bg-green-500/40 animate-pulse rounded-sm"></div>
                                    )}

                                    {/* Piece */}
                                    {cell !== 0 && (
                                        <div className={`
                                            w-[80%] h-[80%] rounded-full shadow-lg border-2 border-white/20 transition-transform duration-300 flex items-center justify-center
                                            ${cell === 1 || cell === 3 ? 'bg-red-600' : 'bg-gray-900'}
                                            ${turn === 1 && canMove && (cell === 1 || cell === 3) ? 'hover:scale-110 cursor-pointer ring-2 ring-white/50' : ''}
                                        `}>
                                            {/* King Crown */}
                                            {(cell === 3 || cell === 4) && (
                                                <span className="text-yellow-400 text-xs">👑</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
            
            {winner && (
                <button onClick={resetBoard} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full font-bold animate-fade-in">
                    Jugar Otra Vez
                </button>
            )}
        </div>
    );
};

const ClassicBoardGames = () => {
    const [game, setGame] = useState<GameType>('menu');

    if (game === 'menu') {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in">
                <button onClick={() => setGame('oca')} className="p-6 bg-green-100 dark:bg-green-900 rounded-xl hover:scale-105 transition text-center border-2 border-green-200 dark:border-green-700 group">
                    <div className="text-4xl mb-2 group-hover:animate-bounce">🎲</div>
                    <h3 className="font-bold text-green-800 dark:text-green-200">La Oca</h3>
                    <p className="text-xs mt-1 text-green-600 dark:text-green-300">vs CPU</p>
                </button>
                <button onClick={() => setGame('damas')} className="p-6 bg-amber-100 dark:bg-amber-900 rounded-xl hover:scale-105 transition text-center border-2 border-amber-200 dark:border-amber-700 group">
                    <div className="text-4xl mb-2 group-hover:animate-spin">♟️</div>
                    <h3 className="font-bold text-amber-800 dark:text-amber-200">Damas</h3>
                    <p className="text-xs mt-1 text-amber-600 dark:text-amber-300">vs CPU (Experto)</p>
                </button>
                <button onClick={() => setGame('trivial')} className="p-6 bg-blue-100 dark:bg-blue-900 rounded-xl hover:scale-105 transition text-center border-2 border-blue-200 dark:border-blue-700 group">
                    <div className="text-4xl mb-2 group-hover:animate-pulse">🧠</div>
                    <h3 className="font-bold text-blue-800 dark:text-blue-200">Trivial</h3>
                    <p className="text-xs mt-1 text-blue-600 dark:text-blue-300">1 Jugador</p>
                </button>
            </div>
        );
    }

    return (
        <div className="animate-fade-in w-full">
            <button onClick={() => setGame('menu')} className="mb-4 text-sm text-gray-500 hover:text-blue-500 flex items-center">
                <span className="mr-1">←</span> Volver a selección
            </button>
            {game === 'oca' && <OcaGame />}
            {game === 'damas' && <DamasGame />}
            {game === 'trivial' && <TrivialGame onBack={() => setGame('menu')} />}
        </div>
    );
};

export default ClassicBoardGames;
