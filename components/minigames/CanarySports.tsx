
import React, { useState, useEffect, useRef } from 'react';
import { TrophyIcon, StarIcon, UserGroupIcon, BoltIcon, PencilSquareIcon, UserPlusIcon, ShieldCheckIcon, ExclamationTriangleIcon, VideoCameraIcon, XCircleIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';
import Celebration from '../Celebration.tsx';

// --- DATA ---

const ATHLETES = [
    { name: 'Pedri González', sport: 'Fútbol', desc: 'De Tegueste al mundo. Ganador del Golden Boy y estrella del FC Barcelona y la Selección.', icon: '⚽' },
    { name: 'Sergio Rodríguez', sport: 'Baloncesto', desc: 'El "Chacho". Magia pura en la cancha. Campeón del mundo y leyenda de la NBA y Euroliga.', icon: '🏀' },
    { name: 'Michelle Alonso', sport: 'Natación', desc: 'La "Sirenita de Tenerife". Múltiple campeona paralímpica y récord mundial.', icon: '🏊‍♀️' },
    { name: 'Carla Suárez', sport: 'Tenis', desc: 'Una de las mejores tenistas españolas de la historia. Ejemplo de lucha y superación.', icon: '🎾' },
    { name: 'Pedro Rodríguez', sport: 'Fútbol', desc: 'El único jugador que lo ha ganado TODO: Mundial, Eurocopa, Champions, Europa League...', icon: '🏆' },
    { name: 'Kira Miró', sport: 'Surf/TV', desc: 'Aunque famosa por la TV, viene de familia de deportistas y el mar canario corre por sus venas.', icon: '🏄‍♀️' }
];

const HISTORY_TETE = [
    { year: 1912, title: 'Fundación', desc: 'Nace el Club Deportivo Tenerife. ¡Más de 100 años de historia!' },
    { year: 1989, title: 'El Ascenso', desc: 'Ascenso a Primera División tras una promoción agónica contra el Betis.' },
    { year: 1993, title: 'EuroTete', desc: 'La época dorada. Eliminando a la Juventus y llegando a semifinales de la UEFA en 1997.' },
    { year: 2009, title: 'Nino Leyenda', desc: 'Nino se convierte en el máximo goleador histórico. ¡El cañonero de Vera!' },
    { year: 2022, title: 'Centenario', desc: 'Celebración de los 100 años de pasión blanquiazul en el Heliodoro.' }
];

const PLAYERS_LEGENDS = [
    { name: 'Rommel F.', pos: 'Delantero', legend: true },
    { name: 'Nino', pos: 'Delantero', legend: true },
    { name: 'Felipe M.', pos: 'Medio', legend: true },
    { name: 'Juanele', pos: 'Extremo', legend: true },
    { name: 'Pizzi', pos: 'Delantero', legend: true }
];

const PLAYERS_CURRENT = [
    { name: 'Enric Gallego', pos: 'Delantero', legend: false },
    { name: 'Luismi Cruz', pos: 'Extremo', legend: false },
    { name: 'Soriano', pos: 'Portero', legend: false },
    { name: 'Waldo', pos: 'Extremo', legend: false },
    { name: 'Aitor Sanz', pos: 'Capitán', legend: false }
];

// --- RIVAL TEAMS DATA ---
interface RivalTeam {
    name: string;
    players: string[];
    cursed?: boolean; // If true, user cannot win against them (max draw)
    colors: [string, string]; // Primary, Secondary/Text
    pattern: 'solid' | 'stripes';
}

const RIVAL_TEAMS: RivalTeam[] = [
    { name: 'Celtic Glasgow', players: ['Larsson', 'Dalglish', 'Nakamura', 'McNeill'], cursed: true, colors: ['#018749', '#FFFFFF'], pattern: 'stripes' },
    { name: 'U.D. Salamanca', players: ['Pauleta', 'Giovanella', 'Michel Salgado', 'Stelea'], cursed: true, colors: ['#FFFFFF', '#000000'], pattern: 'stripes' },
    { name: 'Liverpool FC', players: ['Salah', 'Gerrard', 'Dalglish', 'Rush', 'Van Dijk'], colors: ['#C8102E', '#FFFFFF'], pattern: 'solid' },
    { name: 'Manchester United', players: ['C. Ronaldo', 'Rooney', 'Best', 'Cantona', 'Scholes'], colors: ['#DA291C', '#FFFFFF'], pattern: 'solid' },
    { name: 'Chelsea', players: ['Drogba', 'Lampard', 'Hazard', 'Terry', 'Zola'], colors: ['#034694', '#FFFFFF'], pattern: 'solid' },
    { name: 'Newcastle', players: ['Shearer', 'Asprilla', 'Gascoigne', 'Owen'], colors: ['#000000', '#FFFFFF'], pattern: 'stripes' },
    { name: 'Manchester City', players: ['Haaland', 'De Bruyne', 'Aguero', 'Yaya Toure'], colors: ['#6CABDD', '#FFFFFF'], pattern: 'solid' },
    { name: 'Swansea FC', players: ['Michu', 'Laudrup', 'Sigurdsson'], colors: ['#FFFFFF', '#000000'], pattern: 'solid' },
    { name: 'FC Barcelona', players: ['Messi', 'Cruyff', 'Ronaldinho', 'Xavi', 'Iniesta'], colors: ['#A50044', '#004D98'], pattern: 'stripes' },
    { name: 'Real Madrid', players: ['Di Stefano', 'Zidane', 'C. Ronaldo', 'Raúl', 'Modric'], colors: ['#FFFFFF', '#000000'], pattern: 'solid' },
    { name: 'Atlético Madrid', players: ['Torres', 'Falcao', 'Griezmann', 'Aragonés'], colors: ['#CB3524', '#FFFFFF'], pattern: 'stripes' },
    { name: 'Real Sociedad', players: ['Arconada', 'Xabi Prieto', 'Griezmann', 'Karpin'], colors: ['#0067B1', '#FFFFFF'], pattern: 'stripes' },
    { name: 'Dynamo de Kiev', players: ['Shevchenko', 'Rebrov', 'Blokhin'], colors: ['#FFFFFF', '#004493'], pattern: 'solid' },
    { name: 'CSKA Moscú', players: ['Akinfeev', 'Carvalho', 'Zhirkov'], colors: ['#D2232A', '#0039A6'], pattern: 'solid' },
    { name: 'Napoli', players: ['Maradona', 'Mertens', 'Hamsik', 'Careca'], colors: ['#00AFE8', '#FFFFFF'], pattern: 'solid' },
    { name: 'Juventus', players: ['Del Piero', 'Platini', 'Buffon', 'Zidane'], colors: ['#000000', '#FFFFFF'], pattern: 'stripes' },
    { name: 'Inter Milán', players: ['Ronaldo', 'Zanetti', 'Matthaus', 'Eto\'o'], colors: ['#0066B2', '#000000'], pattern: 'stripes' },
    { name: 'AC Milán', players: ['Van Basten', 'Maldini', 'Kaka', 'Gullit'], colors: ['#FB090B', '#000000'], pattern: 'stripes' },
    { name: 'Bayern Munich', players: ['Beckenbauer', 'Muller', 'Lewandowski', 'Robben'], colors: ['#DC052D', '#FFFFFF'], pattern: 'solid' },
    { name: 'PSG', players: ['Mbappé', 'Ibrahimovic', 'Neymar', 'Weah'], colors: ['#004170', '#DA291C'], pattern: 'solid' },
    { name: 'Lille', players: ['Hazard', 'Gervinho', 'Maignan'], colors: ['#E01E37', '#FFFFFF'], pattern: 'solid' },
    { name: 'FC Basel', players: ['Shaqiri', 'Xhaka', 'Salah'], colors: ['#E4002B', '#004791'], pattern: 'stripes' }, // Red/Blue
    { name: 'Steaua Bucarest', players: ['Hagi', 'Duckadam', 'Lacatus'], colors: ['#003059', '#DA291C'], pattern: 'stripes' },
    { name: 'Gremio', players: ['Ronaldinho', 'Renato Gaucho', 'Suarez'], colors: ['#0094D6', '#000000'], pattern: 'stripes' },
    { name: 'Sao Paulo', players: ['Kaka', 'Cafu', 'Rogerio Ceni'], colors: ['#FFFFFF', '#000000'], pattern: 'stripes' },
    { name: 'River Plate', players: ['Di Stefano', 'Francescoli', 'Ortega', 'Julian Alvarez'], colors: ['#FFFFFF', '#DA291C'], pattern: 'stripes' },
    { name: 'Boca Juniors', players: ['Maradona', 'Riquelme', 'Tevez', 'Palermo'], colors: ['#00458A', '#FCCB0B'], pattern: 'solid' }, // Blue/Yellow
    { name: 'Fluminense', players: ['Fred', 'Marcelo', 'Romario'], colors: ['#8B0E2D', '#006E4E'], pattern: 'stripes' }
];

// --- MISERABLES FC ROSTER ---
interface TeacherPlayer {
    name: string;
    trait: string;
    role: 'Goalkeeper' | 'Defense' | 'Midfield' | 'Forward';
    isCaptain?: boolean;
    captainOrder?: number; // 1: Carol, 2: Guaci, 3: Fidel
}

const MISERABLES_FC_DETAILED: TeacherPlayer[] = [
    { name: 'Cristina', trait: 'es mejor que Iker Casillas y Buffon juntos', role: 'Goalkeeper' },
    { name: 'Carol', trait: 'tiene un pase y toque de calidad', role: 'Midfield', isCaptain: true, captainOrder: 1 },
    { name: 'Guaci', trait: 'juega con muchas ganas y puro fair play', role: 'Defense', isCaptain: true, captainOrder: 2 },
    { name: 'Fidel', trait: 'derrocha clase y control de balón', role: 'Midfield', isCaptain: true, captainOrder: 3 },
    { name: 'Natalia', trait: 'impone con su altura y presencia física (Fair Play)', role: 'Defense' },
    { name: 'Celia', trait: 'es una lateral de lucha constante', role: 'Defense' },
    { name: 'Lucía', trait: 'controla en carrera y da ánimos al equipo', role: 'Midfield' },
    { name: 'Marta', trait: 'es una atleta total', role: 'Defense' },
    { name: 'Bea', trait: 'tiene potencia y visión de pase', role: 'Midfield' },
    { name: 'Alba', trait: 'lucha cada balón y defiende fuerte', role: 'Defense' },
    { name: 'Javi', trait: 'usa su altura y fuerza física al choque', role: 'Defense' },
    { name: 'Alejandro', trait: 'combina control y fuerza física', role: 'Midfield' },
    { name: 'Manu', trait: 'tiene toque, control y desbordamiento', role: 'Forward' },
    { name: 'Desi', trait: 'anima al equipo y corre la banda', role: 'Forward' },
    { name: 'Lore', trait: 'es una extremo explosiva con mucho gol', role: 'Forward' },
    { name: 'Luis', trait: 'derroche físico y lucha (ojo al control)', role: 'Midfield' }
];

const MISERABLES_COACH = "Mari Nieves";

// --- SHARED COMPONENTS ---

const MatchActionOverlay = ({ type, rivalName }: { type: 'passing' | 'shooting' | 'blocked' | 'saving' | 'var_check' | 'var_cancel' | 'coin_toss' | 'steal' | 'super_save', rivalName?: string }) => (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-xl overflow-hidden animate-fade-in-fast">
        {type === 'passing' && (
            <div className="flex flex-col items-center w-full">
                <div className="animate-pass-across text-7xl mb-4">⚽</div>
                <span className="text-white font-bold text-2xl animate-pulse">¡Tocando el balón!</span>
            </div>
        )}
        {type === 'shooting' && (
            <div className="flex flex-col items-center">
                <div className="animate-shoot-zoom text-9xl mb-4">🥅</div>
                <span className="text-yellow-300 font-extrabold text-3xl animate-bounce">¡DISPAROOO!</span>
            </div>
        )}
        {type === 'blocked' && (
            <div className="flex flex-col items-center animate-shake-hard">
                <div className="flex items-center justify-center space-x-4 text-6xl mb-6 relative">
                    <span className="animate-bounce">⚽</span>
                    <span className="text-red-500 text-8xl absolute">💥</span>
                    <span className="animate-pulse delay-100">🛡️</span>
                </div>
                <span className="text-red-400 font-bold text-2xl uppercase tracking-widest mb-2">¡BLOQUEADO!</span>
                {rivalName && <span className="text-gray-300 text-lg italic">por {rivalName}</span>}
            </div>
        )}
        {type === 'steal' && (
            <div className="flex flex-col items-center animate-shake-hard">
                <div className="text-8xl mb-4">⚡</div>
                <span className="text-red-500 font-extrabold text-4xl uppercase">¡ROBO DE BALÓN!</span>
                <span className="text-white mt-2 text-xl">{rivalName} es impasable.</span>
            </div>
        )}
        {type === 'saving' && (
            <div className="flex flex-col items-center animate-bounce-in">
                 <div className="text-9xl mb-4 text-green-500 drop-shadow-lg">🛡️</div>
                 <span className="text-green-400 font-extrabold text-4xl uppercase">¡PARADÓN!</span>
                 <span className="text-white mt-2">Has bloqueado la contra</span>
            </div>
        )}
        {type === 'super_save' && (
            <div className="flex flex-col items-center animate-bounce-in">
                 <div className="text-9xl mb-4 text-red-500 drop-shadow-lg">🧤</div>
                 <span className="text-red-400 font-extrabold text-4xl uppercase text-center">¡CRISTINA VUELA!</span>
                 <span className="text-white mt-2">¡Parada milagrosa!</span>
            </div>
        )}
        {type === 'var_check' && (
            <div className="flex flex-col items-center animate-pulse">
                 <div className="bg-gray-200 p-4 rounded-lg border-4 border-black mb-4">
                    <VideoCameraIcon className="w-20 h-20 text-black animate-pulse" />
                 </div>
                 <span className="text-white font-mono text-3xl uppercase tracking-[0.5em] border-b-2 border-white pb-2">VAR REVISANDO</span>
                 <span className="text-yellow-400 mt-2 text-sm animate-bounce">Posible fuera de juego...</span>
            </div>
        )}
        {type === 'var_cancel' && (
            <div className="flex flex-col items-center animate-shake">
                 <XCircleIcon className="w-32 h-32 text-red-600 mb-4 drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]" />
                 <span className="text-red-500 font-extrabold text-5xl uppercase text-center drop-shadow-md">¡ANULADO!</span>
                 <span className="text-white mt-4 px-4 text-center text-lg">El VAR dice que NO es gol.</span>
                 <span className="text-gray-400 text-xs italic mt-2">(Siempre barre para casa...)</span>
            </div>
        )}
        {type === 'coin_toss' && (
            <div className="flex flex-col items-center">
                 <div className="animate-spin text-9xl mb-6 text-yellow-400">🪙</div>
                 <span className="text-yellow-300 font-bold text-2xl uppercase animate-pulse">MANU LANZA LA MONEDA...</span>
                 <span className="text-white text-sm mt-2">¿Cara o Cruz?</span>
            </div>
        )}
    </div>
);

// --- MATH GAME (TETE VERSION) ---

const MathSoccer = ({ onBack }: { onBack: () => void }) => {
    const [gameState, setGameState] = useState<'start' | 'playing' | 'goal' | 'miss' | 'var_cancel_end'>('start');
    const [score, setScore] = useState({ user: 0, rival: 0 });
    const [ballPos, setBallPos] = useState(0); // 0: Keeper, 1: Def, 2: Mid, 3: Fwd, 4: Goal
    const [currentProblem, setCurrentProblem] = useState<{q: string, a: number} | null>(null);
    const [options, setOptions] = useState<number[]>([]);
    const [currentPlayer, setCurrentPlayer] = useState(PLAYERS_CURRENT[2]); // Start with Keeper
    const [rivalTeam, setRivalTeam] = useState<RivalTeam | null>(null);
    const [currentRivalPlayer, setCurrentRivalPlayer] = useState('');
    const [animationState, setAnimationState] = useState<'idle' | 'passing' | 'shooting' | 'blocked' | 'saving' | 'var_check' | 'var_cancel'>('idle');

    const generateProblem = () => {
        const types = ['+', '-', 'x'];
        const type = types[Math.floor(Math.random() * 3)];
        let a = 0, b = 0, res = 0;

        if (type === '+') {
            a = Math.floor(Math.random() * 50);
            b = Math.floor(Math.random() * 50);
            res = a + b;
        } else if (type === '-') {
            a = Math.floor(Math.random() * 50) + 20;
            b = Math.floor(Math.random() * 20);
            res = a - b;
        } else {
            a = Math.floor(Math.random() * 10) + 2;
            b = Math.floor(Math.random() * 9) + 2;
            res = a * b;
        }

        const opts = new Set<number>();
        opts.add(res);
        while (opts.size < 3) {
            const diff = Math.floor(Math.random() * 10) - 5;
            if (diff !== 0) opts.add(res + diff);
        }

        setCurrentProblem({ q: `${a} ${type} ${b}`, a: res });
        setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
        
        // Pick random rival player to simulate opposition
        if (rivalTeam) {
            setCurrentRivalPlayer(rivalTeam.players[Math.floor(Math.random() * rivalTeam.players.length)]);
        }
    };

    useEffect(() => {
        if (gameState === 'playing' && !currentProblem && animationState === 'idle') {
            generateProblem();
        }
    }, [gameState, currentProblem, animationState]);

    const handleAnswer = (ans: number) => {
        if (!currentProblem || animationState !== 'idle') return;

        const isCorrect = ans === currentProblem.a;
        const nextPos = ballPos + 1;
        const isGoalShot = ballPos === 3;

        // Trigger Animation
        if (isCorrect) {
            setAnimationState(isGoalShot ? 'shooting' : 'passing');
        } else {
            setAnimationState('blocked');
        }

        // Wait for Animation
        setTimeout(() => {
            if (isCorrect) {
                // Logic for "Cursed" teams with CORRUPT VAR
                // If goal shot AND team is cursed AND (user is leading OR user is about to lead)
                // Essentially prevent winning.
                if (isGoalShot && rivalTeam?.cursed && (score.user >= score.rival)) {
                     // Trigger VAR Sequence
                     setAnimationState('var_check');
                     setTimeout(() => {
                         setAnimationState('var_cancel');
                         setTimeout(() => {
                             setAnimationState('idle');
                             setGameState('var_cancel_end');
                             // Reset ball but DO NOT add score
                             setBallPos(0);
                             setCurrentProblem(null);
                         }, 3500); // Show cancellation for 3.5s
                     }, 3000); // Show checking for 3s
                     return;
                }

                setAnimationState('idle');
                // Correct Normal Flow
                setBallPos(nextPos);
                setCurrentProblem(null);

                // Pick random player
                const pool = Math.random() > 0.5 ? PLAYERS_LEGENDS : PLAYERS_CURRENT;
                setCurrentPlayer(pool[Math.floor(Math.random() * pool.length)]);

                if (nextPos === 4) {
                    setGameState('goal');
                    setScore(s => ({ ...s, user: s.user + 1 }));
                }
            } else {
                setAnimationState('idle');
                // Miss
                setGameState('miss');
                setScore(s => ({ ...s, rival: s.rival + 1 }));
            }
        }, 2000);
    };

    const resetPlay = () => {
        if (gameState === 'start') {
            setRivalTeam(RIVAL_TEAMS[Math.floor(Math.random() * RIVAL_TEAMS.length)]);
            setScore({ user: 0, rival: 0 });
        }
        setBallPos(0);
        setGameState('playing');
        setCurrentProblem(null);
        setAnimationState('idle');
        setCurrentPlayer(PLAYERS_CURRENT[2]); // Reset to Soriano/Keeper
    };

    const continueMatch = () => {
        setBallPos(0);
        setGameState('playing');
        setCurrentProblem(null);
        setAnimationState('idle');
    };

    // Rival Style Generator
    const getRivalHeaderStyle = () => {
        if (!rivalTeam) return {};
        const { colors, pattern } = rivalTeam;
        const [c1, c2] = colors;
        
        if (pattern === 'stripes') {
            return {
                background: `repeating-linear-gradient(90deg, ${c1}, ${c1} 15px, ${c2} 15px, ${c2} 30px)`,
                color: c2 === '#FFFFFF' ? (c1 === '#000000' ? '#FFFFFF' : '#000000') : '#FFFFFF',
                textShadow: '0px 0px 4px black',
                border: '1px solid white'
            };
        }
        return {
            backgroundColor: c1,
            color: c2,
            border: `1px solid ${c2}`
        };
    };

    return (
        <div className="w-full max-w-3xl mx-auto bg-green-600 p-4 rounded-xl border-4 border-white shadow-2xl relative overflow-hidden">
            {/* Field Lines */}
            <div className="absolute inset-0 border-2 border-white/30 m-4 rounded pointer-events-none flex justify-between">
                <div className="w-1/12 border-r-2 border-white/30 h-full bg-white/5"></div>
                <div className="w-px h-full bg-white/30"></div>
                <div className="w-1/12 border-l-2 border-white/30 h-full bg-white/5"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/30 rounded-full"></div>
            </div>

            {/* Scoreboard */}
            <div className="relative z-10 bg-black/80 text-white p-3 rounded-lg flex justify-between items-center mb-8 shadow-lg border border-white/20">
                <div className="flex items-center space-x-2 w-1/3">
                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/8/80/CD_Tenerife_logo.svg/1200px-CD_Tenerife_logo.svg.png" alt="Tete" className="h-8 w-8 object-contain"/>
                    <span className="font-bold text-xl">{score.user}</span>
                    <span className="hidden sm:inline text-xs font-bold text-blue-300">CD TENERIFE</span>
                </div>
                <div className="font-mono text-yellow-400 font-bold text-sm">MARCADOR</div>
                <div 
                    className="flex items-center justify-end space-x-2 w-1/3 px-2 py-1 rounded"
                    style={getRivalHeaderStyle()}
                >
                    <span className="hidden sm:inline text-xs font-bold text-right uppercase truncate">{rivalTeam ? rivalTeam.name : 'RIVAL'}</span>
                    <span className="font-bold text-xl">{score.rival}</span>
                    {rivalTeam?.cursed && <span title="VAR en contra" className="text-lg">👁️</span>}
                </div>
            </div>

            {/* Game Area */}
            <div className="relative z-10 min-h-[300px] flex flex-col items-center justify-center text-center">
                
                {animationState !== 'idle' && <MatchActionOverlay type={animationState as any} rivalName={rivalTeam?.name} />}

                {gameState === 'start' && (
                    <div className="bg-white/90 p-8 rounded-xl shadow-xl animate-fade-in">
                        <h2 className="text-3xl font-bold text-blue-800 mb-4">⚽ El Partido Matemático</h2>
                        <p className="mb-6 text-gray-700">
                            Juega con las leyendas y actuales jugadores del Tete contra los mejores equipos del mundo. 
                            <br/><span className="text-xs italic text-gray-500">(¡Ojo con el VAR contra el Celtic y el Salamanca!)</span>
                        </p>
                        <button onClick={resetPlay} className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 animate-bounce shadow-lg">
                            ¡Sorteo de Rival y Saque!
                        </button>
                        <button onClick={onBack} className="block mt-4 text-sm text-blue-600 hover:underline mx-auto">Volver</button>
                    </div>
                )}

                {gameState === 'playing' && currentProblem && (
                    <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md animate-slide-up border-2 border-blue-500">
                        <div className="mb-4 flex justify-between items-center text-sm">
                            <span className="text-gray-500 uppercase tracking-widest font-bold">
                                {ballPos === 0 ? 'Saque de puerta' : ballPos === 1 ? 'Defensa' : ballPos === 2 ? 'Mediocampo' : 'Ataque'}
                            </span>
                            <span className="text-red-500 text-xs font-bold">
                                VS: {currentRivalPlayer}
                            </span>
                        </div>
                        
                        <div className="flex items-center justify-center mb-6">
                            <div className="text-4xl mr-4">⚽</div>
                            <div>
                                <p className="text-sm text-gray-500">Balón para:</p>
                                <h3 className="text-xl font-bold text-blue-800 flex items-center">
                                    {currentPlayer.name} 
                                    {currentPlayer.legend && <StarIcon className="w-4 h-4 text-yellow-500 ml-1" />}
                                </h3>
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-lg font-bold mb-2 text-gray-700">Calcula la jugada:</p>
                            <div className="text-4xl font-mono font-bold text-blue-600 bg-blue-50 p-4 rounded-lg">
                                {currentProblem.q} = ?
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {options.map((opt, i) => (
                                <button 
                                    key={i}
                                    onClick={() => handleAnswer(opt)}
                                    disabled={animationState !== 'idle'}
                                    className="bg-gray-100 hover:bg-blue-500 hover:text-white text-gray-800 font-bold py-4 rounded-lg text-xl transition-all shadow-md border border-gray-200"
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {gameState === 'goal' && (
                    <div className="text-center animate-bounce-in">
                        <Celebration />
                        <h1 className="text-6xl font-extrabold text-yellow-300 drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] mb-4 italic">¡GOOOOOL!</h1>
                        <p className="text-white text-xl font-bold mb-8">¡{currentPlayer.name} bate al portero del {rivalTeam?.name}!</p>
                        <button onClick={continueMatch} className="bg-white text-green-600 px-8 py-3 rounded-full font-bold shadow-xl hover:scale-105 transition">
                            Siguiente Jugada
                        </button>
                    </div>
                )}

                {gameState === 'var_cancel_end' && (
                    <div className="bg-white/90 p-8 rounded-xl text-center animate-shake border-4 border-red-500">
                        <div className="text-6xl mb-4 flex justify-center">
                            <VideoCameraIcon className="w-16 h-16 text-black" />
                            <span className="text-red-600 text-6xl font-bold absolute animate-ping">❌</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">¡ROBO ARBITRAL!</h3>
                        <p className="text-gray-600 mb-6 text-lg">
                            Era gol legal, pero el árbitro dice que {currentPlayer.name} respiró en fuera de juego.
                            <br/><b>¡El VAR siempre ayuda al {rivalTeam?.name}!</b>
                        </p>
                        <button onClick={continueMatch} className="bg-gray-800 text-white px-6 py-2 rounded-full font-bold hover:bg-black">
                            Seguir jugando (con rabia)
                        </button>
                    </div>
                )}

                {gameState === 'miss' && (
                    <div className="bg-white/90 p-8 rounded-xl text-center animate-shake">
                        <div className="text-5xl mb-4">❌</div>
                        <h3 className="text-2xl font-bold text-red-600 mb-2">¡Fallo defensivo!</h3>
                        <p className="text-gray-600 mb-6">
                            {currentRivalPlayer} recuperó el balón y marcó para el {rivalTeam?.name}.
                        </p>
                        <button onClick={continueMatch} className="bg-red-600 text-white px-6 py-2 rounded-full font-bold hover:bg-red-700">
                            Intentar remontar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- CLASSROOM VS MISERABLES FC GAME ---

const ClassroomMatch = ({ onBack }: { onBack: () => void }) => {
    const [phase, setPhase] = useState<'lineup' | 'match'>('lineup');
    const [lineup, setLineup] = useState<string[]>(Array(7).fill(''));
    const [gameState, setGameState] = useState<'start' | 'playing' | 'goal' | 'miss'>('start');
    const [score, setScore] = useState({ user: 0, rival: 0 });
    const [ballPos, setBallPos] = useState(0); 
    const [currentProblem, setCurrentProblem] = useState<{q: string, a: number} | null>(null);
    const [options, setOptions] = useState<number[]>([]);
    const [currentPlayer, setCurrentPlayer] = useState('');
    const [currentTeacher, setCurrentTeacher] = useState<TeacherPlayer | null>(null);
    const [animationState, setAnimationState] = useState<'idle' | 'passing' | 'shooting' | 'blocked' | 'saving' | 'coin_toss' | 'steal' | 'super_save'>('idle');

    // Counter Attack & 3 Strike Logic
    const [mistakes, setMistakes] = useState(0);
    const [isCounterAttack, setIsCounterAttack] = useState(false);
    const [counterTimer, setCounterTimer] = useState(5);
    const [shotsOnGoalTotal, setShotsOnGoalTotal] = useState(0); // Cristina's counter
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const POSITIONS = ['Portero', 'Defensa 1', 'Defensa 2', 'Medio 1', 'Medio 2', 'Delantero 1', 'Delantero 2'];

    const handleLineupChange = (index: number, val: string) => {
        const newLineup = [...lineup];
        newLineup[index] = val;
        setLineup(newLineup);
    };

    const startMatch = () => {
        if (lineup.some(name => name.trim() === '')) {
            alert('¡Faltan jugadores! Rellena toda la alineación.');
            return;
        }
        setPhase('match');
        setMistakes(0);
        setShotsOnGoalTotal(0);
    };

    // Counter Timer Logic
    useEffect(() => {
        if (isCounterAttack) {
            setCounterTimer(5);
            if (timerRef.current) clearInterval(timerRef.current);
            
            timerRef.current = setInterval(() => {
                setCounterTimer((prev) => {
                    if (prev <= 1) {
                        if (timerRef.current) clearInterval(timerRef.current);
                        // Time run out
                        handleTimeoutFailure();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isCounterAttack]);

    const handleTimeoutFailure = () => {
        setIsCounterAttack(false);
        setGameState('miss');
        setScore(s => ({ ...s, rival: s.rival + 1 }));
    };

    // Match Logic
    const generateProblem = () => {
        let a, b, res;
        const isDefense = isCounterAttack;
        
        if (isDefense) {
            // Simpler problems for defense (5s limit)
            a = Math.floor(Math.random() * 20) + 1;
            b = Math.floor(Math.random() * 20) + 1;
            const type = Math.random() > 0.5 ? '+' : '-';
            if (type === '+') {
                res = a + b;
                setCurrentProblem({ q: `${a} + ${b}`, a: res });
            } else {
                // Ensure positive result
                if (a < b) [a, b] = [b, a];
                res = a - b;
                setCurrentProblem({ q: `${a} - ${b}`, a: res });
            }
        } else {
            // Standard harder problems (Multiplication)
            a = Math.floor(Math.random() * 12) + 2;
            b = Math.floor(Math.random() * 12) + 2;
            res = a * b;
            setCurrentProblem({ q: `${a} x ${b}`, a: res });
        }
        
        const opts = new Set<number>();
        opts.add(res);
        while (opts.size < 3) {
            opts.add(res + Math.floor(Math.random() * 10) - 5);
        }
        setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
        
        // Logic to pick opponent
        if (!isDefense) {
            if (ballPos === 3) {
                 const keeper = MISERABLES_FC_DETAILED.find(p => p.role === 'Goalkeeper');
                 setCurrentTeacher(keeper || MISERABLES_FC_DETAILED[0]);
            } else {
                const fieldPlayers = MISERABLES_FC_DETAILED.filter(p => p.role !== 'Goalkeeper');
                const randomTeacher = fieldPlayers[Math.floor(Math.random() * fieldPlayers.length)];
                setCurrentTeacher(randomTeacher);
            }
        }
    };

    useEffect(() => {
        if (phase === 'match' && gameState === 'playing' && !currentProblem && animationState === 'idle') {
            generateProblem();
        }
    }, [phase, gameState, currentProblem, animationState, isCounterAttack]);

    const handleAnswer = (ans: number) => {
        if (!currentProblem || animationState !== 'idle') return;
        
        const teacherName = currentTeacher?.name;

        // --- MANU SPECIAL RULE (COIN TOSS) ---
        if (!isCounterAttack && teacherName === 'Manu') {
            setAnimationState('coin_toss');
            setTimeout(() => {
                // 50% chance
                if (Math.random() < 0.5) {
                     // Heads: Manu scores
                     setAnimationState('idle');
                     setGameState('miss');
                     setScore(s => ({ ...s, rival: s.rival + 1 }));
                } else {
                     // Tails: Proceed to verify math
                     verifyMath(ans);
                }
            }, 3000);
            return;
        }

        // Normal verification
        verifyMath(ans);
    };

    const verifyMath = (ans: number) => {
        const isCorrect = ans === currentProblem!.a;
        const teacherName = currentTeacher?.name;

        // --- DEFENSE MODE LOGIC ---
        if (isCounterAttack) {
            if (isCorrect) {
                if (timerRef.current) clearInterval(timerRef.current);
                setAnimationState('saving'); // "PARADÓN"
                setTimeout(() => {
                    setAnimationState('idle');
                    setIsCounterAttack(false);
                    setCurrentProblem(null);
                    setBallPos(0); // Reset to keeper
                    setCurrentPlayer(lineup[0]);
                }, 2000);
            } else {
                if (timerRef.current) clearInterval(timerRef.current);
                setIsCounterAttack(false);
                setGameState('miss');
                setScore(s => ({ ...s, rival: s.rival + 1 }));
            }
            return;
        }

        // --- ATTACK MODE LOGIC ---
        const nextPos = ballPos + 1;
        const isGoalShot = ballPos === 3;

        // --- LUIS & CAROL SPECIAL RULE (ALWAYS STEAL) ---
        if ((teacherName === 'Luis' || teacherName === 'Carol') && isCorrect) {
             setAnimationState('steal');
             setTimeout(() => {
                 setAnimationState('idle');
                 // Fail logic despite correct answer
                 const newMistakes = mistakes + 1;
                 setMistakes(newMistakes);
                 if (newMistakes % 3 === 0) {
                    setGameState('miss');
                    setScore(s => ({ ...s, rival: s.rival + 1 }));
                 } else {
                    setIsCounterAttack(true);
                    setCurrentProblem(null);
                 }
             }, 2000);
             return;
        }

        // Trigger Standard Animation
        if (isCorrect) {
            setAnimationState(isGoalShot ? 'shooting' : 'passing');
        } else {
            setAnimationState('blocked');
        }

        // Wait for animation
        setTimeout(() => {
            if (isCorrect) {
                // --- CRISTINA SPECIAL RULE (SUPER SAVE EVERY 4th SHOT) ---
                if (isGoalShot) {
                    const newShotCount = shotsOnGoalTotal + 1;
                    setShotsOnGoalTotal(newShotCount);
                    
                    if (newShotCount % 4 === 0) {
                        // Cristina saves it!
                        setAnimationState('super_save');
                        setTimeout(() => {
                             setAnimationState('idle');
                             // Treat as a miss/turnover but maybe not a goal against? 
                             // Let's just count as missed chance, ball resets? Or counter?
                             // Simple: Just a miss, ball resets.
                             setIsCounterAttack(true); 
                             setCurrentProblem(null);
                        }, 2000);
                        return;
                    }
                }

                // Successful Move
                setAnimationState('idle');
                setBallPos(nextPos);
                setCurrentProblem(null);

                // Pass ball to next player
                const nextPlayerIndex = Math.min(nextPos + 2, 6); 
                setCurrentPlayer(lineup[nextPlayerIndex]);

                if (nextPos === 4) {
                    setGameState('goal');
                    setScore(s => ({ ...s, user: s.user + 1 }));
                }
            } else {
                // MISTAKE LOGIC
                setAnimationState('idle');
                const newMistakes = mistakes + 1;
                setMistakes(newMistakes);

                if (newMistakes % 3 === 0) {
                    // 3rd non-consecutive failure (accumulation) -> Automatic Goal
                    setGameState('miss');
                    setScore(s => ({ ...s, rival: s.rival + 1 }));
                } else {
                    // Trigger Counter Attack
                    setIsCounterAttack(true);
                    setCurrentProblem(null); // Force new problem generation
                }
            }
        }, 2000);
    };

    const resetPlay = () => {
        setBallPos(0);
        setGameState('playing');
        setCurrentProblem(null);
        setAnimationState('idle');
        setCurrentPlayer(lineup[0]); // Start with Keeper
        setIsCounterAttack(false);
    };

    if (phase === 'lineup') {
        const captains = MISERABLES_FC_DETAILED
            .filter(p => p.isCaptain)
            .sort((a, b) => (a.captainOrder || 0) - (b.captainOrder || 0));

        return (
            <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-blue-800 dark:text-white flex items-center">
                        <PencilSquareIcon className="w-8 h-8 mr-2" /> Crea tu Alineación
                    </h2>
                    <button onClick={onBack} className="text-gray-500 hover:text-red-500">Cancelar</button>
                </div>
                
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                    Elige a tus 7 compañeros de clase para enfrentarte al temible 
                    <span className="font-bold text-purple-600"> Miserables FC </span> 
                    de los profes.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Student Lineup Form */}
                    <div className="space-y-3">
                        {POSITIONS.map((pos, i) => (
                            <div key={i} className="flex items-center">
                                <span className="w-24 text-xs font-bold uppercase text-gray-500">{pos}</span>
                                <input 
                                    type="text" 
                                    placeholder={`Nombre del ${pos}`}
                                    value={lineup[i]}
                                    onChange={(e) => handleLineupChange(i, e.target.value)}
                                    className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Rival Preview */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border-2 border-purple-200 dark:border-purple-800 text-center">
                        <h3 className="font-bold text-purple-800 dark:text-purple-300 text-xl mb-2">Rival: Miserables FC</h3>
                        <div className="text-6xl mb-2">🧛📚</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Entrenadora: <span className="font-bold">{MISERABLES_COACH}</span></p>
                        
                        <div className="text-left bg-white dark:bg-gray-800 p-3 rounded-lg mb-3 shadow-sm">
                            <p className="text-xs font-bold text-purple-600 uppercase mb-1">Capitanes:</p>
                            <ul className="text-sm space-y-1">
                                {captains.map((c, idx) => (
                                    <li key={idx} className="flex items-center">
                                        <span className="mr-2 text-yellow-500">©</span> 
                                        <span className="font-bold">{c.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="flex flex-wrap justify-center gap-2">
                            <span className="text-xs text-gray-500">Portera: Cristina</span>
                            <span className="text-xs text-gray-500">...y todo el claustro</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <button 
                        onClick={startMatch}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold px-10 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all"
                    >
                        ¡Saltar al Campo!
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`w-full max-w-3xl mx-auto p-4 rounded-xl border-4 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col transition-colors duration-500 ${isCounterAttack ? 'bg-red-600 border-red-400' : 'bg-green-600 border-white'}`}>
            {/* Scoreboard */}
            <div className="relative z-10 bg-black/90 text-white p-4 rounded-lg flex justify-between items-center mb-4 shadow-lg border border-white/20">
                <div className="flex items-center space-x-3">
                    <div className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl">TÚ</div>
                    <span className="font-bold text-3xl">{score.user}</span>
                </div>
                <div className="text-center">
                    {isCounterAttack ? (
                        <div className="text-red-500 font-black animate-pulse">⚠️ CONTRA ⚠️</div>
                    ) : (
                        <div className="font-mono text-yellow-400 font-bold text-sm">VS</div>
                    )}
                </div>
                <div className="flex items-center space-x-3">
                    <span className="font-bold text-3xl">{score.rival}</span>
                    <div className="bg-purple-600 w-10 h-10 rounded-full flex items-center justify-center font-bold text-2xl">🧛</div>
                </div>
            </div>

            {/* Field Area */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center p-4">
                
                {animationState !== 'idle' && <MatchActionOverlay type={animationState as any} rivalName={currentTeacher?.name} />}

                {gameState === 'start' && (
                    <div className="bg-white/95 p-8 rounded-xl shadow-xl animate-fade-in max-w-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">¡El Partido del Año!</h2>
                        <p className="text-gray-600 mb-6">
                            Tu clase se enfrenta a los profesores. Mari Nieves está dando instrucciones muy serias desde la banda.
                            <br/><br/>
                            ¡Demuestra que sabes más mates que ellos para ganar!
                        </p>
                        <button onClick={resetPlay} className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 animate-pulse shadow-lg">
                            ¡Empezar Partido!
                        </button>
                    </div>
                )}

                {gameState === 'playing' && currentProblem && (
                    <div className={`bg-white p-6 rounded-xl shadow-2xl w-full max-w-md animate-slide-up border-b-4 ${isCounterAttack ? 'border-red-600 ring-4 ring-red-400' : 'border-blue-600'}`}>
                        
                        {isCounterAttack ? (
                            // Counter Attack UI
                            <div className="mb-4">
                                <div className="flex items-center justify-center text-red-600 font-black text-xl mb-2">
                                    <ExclamationTriangleIcon className="w-8 h-8 mr-2 animate-bounce" />
                                    ¡CONTRAATAQUE RIVAL!
                                </div>
                                <p className="text-sm text-gray-600 mb-3">¡Resuelve en menos de 5 segundos o será GOL!</p>
                                {/* Timer Bar */}
                                <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
                                    <div 
                                        className="bg-red-600 h-4 rounded-full transition-all duration-1000 ease-linear"
                                        style={{ width: `${(counterTimer / 5) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="text-3xl font-mono font-bold text-red-600">{counterTimer}s</div>
                            </div>
                        ) : (
                            // Normal Play UI
                            <div className="flex justify-between items-start mb-4">
                                <div className="text-left">
                                    <p className="text-xs text-gray-500 uppercase font-bold">Balón para</p>
                                    <h3 className="text-xl font-bold text-blue-700">{currentPlayer}</h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 uppercase font-bold">Marcado por</p>
                                    <h3 className="text-xl font-bold text-purple-700 flex items-center justify-end">
                                        {currentTeacher?.name}
                                        {currentTeacher?.isCaptain && <span className="ml-1 text-yellow-500" title="Capitán">©</span>}
                                    </h3>
                                    <p className="text-[10px] text-gray-400 italic max-w-[150px] leading-tight text-right ml-auto">
                                        {currentTeacher?.trait}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className={`${isCounterAttack ? 'bg-red-50 border border-red-200' : 'bg-gray-100'} p-4 rounded-lg mb-6`}>
                            <p className={`${isCounterAttack ? 'text-red-800' : 'text-gray-600'} mb-2 text-sm font-bold`}>
                                {isCounterAttack ? '¡BLOQUEA EL TIRO!' : 'Para regatear, calcula:'}
                            </p>
                            <div className="text-3xl font-mono font-bold text-gray-800">
                                {currentProblem.q} = ?
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            {options.map((opt, i) => (
                                <button 
                                    key={i}
                                    onClick={() => handleAnswer(opt)}
                                    disabled={animationState !== 'idle'}
                                    className={`
                                        font-bold py-3 rounded-lg transition-colors border 
                                        ${isCounterAttack 
                                            ? 'bg-red-100 hover:bg-red-600 hover:text-white text-red-900 border-red-300' 
                                            : 'bg-blue-50 hover:bg-blue-500 hover:text-white text-blue-800 border-blue-200'}
                                    `}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                        
                        {!isCounterAttack && (
                            <div className="mt-2 text-xs text-gray-400 text-center">
                                Fallos acumulados: {mistakes}/3 (¡Cuidado con el 3º!)
                            </div>
                        )}
                    </div>
                )}

                {gameState === 'goal' && (
                    <div className="text-center animate-bounce-in bg-black/50 p-6 rounded-xl backdrop-blur-sm">
                        <Celebration />
                        <h1 className="text-5xl font-extrabold text-yellow-300 drop-shadow-lg mb-2">¡GOOOOOL!</h1>
                        <p className="text-white text-xl font-bold mb-2">{currentPlayer} marca un golazo.</p>
                        <p className="text-gray-300 text-sm mb-6">
                            ¡Ni Cristina ha podido pararlo! Mari Nieves pide tiempo muerto.
                        </p>
                        <button onClick={resetPlay} className="bg-white text-green-700 px-8 py-2 rounded-full font-bold shadow-xl hover:scale-105 transition">
                            Siguiente Jugada
                        </button>
                    </div>
                )}

                {gameState === 'miss' && (
                    <div className="bg-white/90 p-8 rounded-xl text-center animate-shake max-w-md border-4 border-red-500">
                        <div className="text-5xl mb-2">🥅⚽</div>
                        <h3 className="text-2xl font-bold text-red-600 mb-2">¡GOL DEL RIVAL!</h3>
                        
                        {mistakes > 0 && mistakes % 3 === 0 ? (
                             <p className="text-red-800 font-bold mb-4 bg-red-100 p-2 rounded">
                                 ¡ERROR GARRAFAL! (3º Fallo acumulado)
                                 <br/><span className="text-sm font-normal">El equipo se vino abajo y encajó gol directo.</span>
                             </p>
                        ) : (
                            <p className="text-gray-600 mb-4">
                                {currentTeacher?.name === 'Manu' 
                                    ? 'Manu ganó el cara o cruz y sentenció la jugada.' 
                                    : 'No pudiste detener el contraataque del Miserables FC.'}
                            </p>
                        )}

                        <button onClick={resetPlay} className="bg-red-600 text-white px-6 py-2 rounded-full font-bold hover:bg-red-700">
                            Sacar de centro
                        </button>
                    </div>
                )}
            </div>
            
            <button onClick={onBack} className="absolute bottom-2 right-2 text-white/50 hover:text-white text-xs">
                Salir del partido
            </button>
            
            <style>{`
                @keyframes passAcross {
                    0% { transform: translateX(-200px) rotate(0deg); opacity: 0; }
                    20% { opacity: 1; }
                    100% { transform: translateX(200px) rotate(720deg); opacity: 0; }
                }
                @keyframes shootZoom {
                    0% { transform: scale(0.5); opacity: 0; }
                    50% { transform: scale(1.2); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes shakeHard {
                    0% { transform: translate(1px, 1px) rotate(0deg); }
                    10% { transform: translate(-1px, -2px) rotate(-1deg); }
                    20% { transform: translate(-3px, 0px) rotate(1deg); }
                    30% { transform: translate(3px, 2px) rotate(0deg); }
                    40% { transform: translate(1px, -1px) rotate(1deg); }
                    50% { transform: translate(-1px, 2px) rotate(-1deg); }
                    60% { transform: translate(-3px, 1px) rotate(0deg); }
                    70% { transform: translate(3px, 1px) rotate(-1deg); }
                    80% { transform: translate(-1px, -1px) rotate(1deg); }
                    90% { transform: translate(1px, 2px) rotate(0deg); }
                    100% { transform: translate(1px, -2px) rotate(-1deg); }
                }
                .animate-pass-across { animation: passAcross 1.5s linear infinite; }
                .animate-shoot-zoom { animation: shootZoom 0.5s ease-out forwards; }
                .animate-shake-hard { animation: shakeHard 0.5s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

// --- MAIN COMPONENT ---

const CanarySports = () => {
    const [view, setView] = useState<'menu' | 'hall' | 'history' | 'game' | 'class_game'>('menu');

    if (view === 'menu') {
        return (
            <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md animate-fade-in">
                <h2 className="text-3xl font-bold text-center text-blue-800 dark:text-blue-300 mb-2">🇮🇨 Deportes Canarios</h2>
                <p className="text-center text-gray-500 mb-8">Descubre a nuestras leyendas y juega con el Tete.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button 
                        onClick={() => setView('hall')}
                        className="group p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border-2 border-yellow-200 dark:border-yellow-700 hover:shadow-xl transition-all hover:-translate-y-1"
                    >
                        <TrophyIcon className="w-12 h-12 text-yellow-500 mx-auto mb-3 group-hover:scale-110 transition-transform"/>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Hall de la Fama</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Grandes deportistas canarios.</p>
                    </button>

                    <button 
                        onClick={() => setView('history')}
                        className="group p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-700 hover:shadow-xl transition-all hover:-translate-y-1"
                    >
                        <div className="w-12 h-12 mx-auto mb-3 text-4xl flex items-center justify-center group-hover:scale-110 transition-transform">🏰</div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Historia Tete</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Momentos históricos del CD Tenerife.</p>
                    </button>

                    <button 
                        onClick={() => setView('game')}
                        className="group p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border-2 border-green-200 dark:border-green-700 hover:shadow-xl transition-all hover:-translate-y-1"
                    >
                        <BoltIcon className="w-12 h-12 text-green-500 mx-auto mb-3 group-hover:animate-pulse"/>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Jugar con el Tete</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Leyendas y actuales vs Matemáticas.</p>
                    </button>

                    <button 
                        onClick={() => setView('class_game')}
                        className="group p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-700 hover:shadow-xl transition-all hover:-translate-y-1"
                    >
                        <UserPlusIcon className="w-12 h-12 text-purple-500 mx-auto mb-3 group-hover:animate-bounce"/>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Tu Clase vs Profes</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">¡Crea tu alineación y gana al Miserables FC!</p>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full animate-fade-in">
            <button 
                onClick={() => setView('menu')}
                className="mb-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-bold hover:bg-gray-300 transition-colors"
            >
                ← Volver al menú deportivo
            </button>

            {view === 'hall' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ATHLETES.map((a, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border-l-4 border-yellow-400 flex items-start">
                            <div className="text-4xl mr-4 bg-gray-100 dark:bg-gray-700 p-2 rounded-full w-16 h-16 flex items-center justify-center">
                                {a.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-800 dark:text-white">{a.name}</h3>
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">{a.sport}</span>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{a.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {view === 'history' && (
                <div className="max-w-2xl mx-auto">
                    <div className="relative border-l-4 border-blue-300 ml-6 space-y-8">
                        {HISTORY_TETE.map((h, i) => (
                            <div key={i} className="relative pl-8">
                                <div className="absolute -left-3.5 top-1 w-6 h-6 bg-blue-500 rounded-full border-4 border-white dark:border-gray-900"></div>
                                <span className="text-blue-600 dark:text-blue-400 font-bold text-xl">{h.year}</span>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white">{h.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300">{h.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {view === 'game' && <MathSoccer onBack={() => setView('menu')} />}
            
            {view === 'class_game' && <ClassroomMatch onBack={() => setView('menu')} />}
        </div>
    );
};

export default CanarySports;
