
import React, { useState, useEffect } from 'react';
import { BookOpenIcon, UserGroupIcon, LockClosedIcon } from '@heroicons/react/24/solid';

interface Props {
    onSelectMode: (mode: 'student' | 'admin') => void;
    status: 'open' | 'closed';
}

const LandingScreen: React.FC<Props> = ({ onSelectMode, status }) => {
    const [cookiesRejected, setCookiesRejected] = useState(false);
    const [vampireMessage, setVampireMessage] = useState("¡NO queremos galletas! ¡Recházalas!");
    
    // Intro State: 'init' (black), 'storm' (vampire/lightning), 'finished' (normal UI)
    const [introState, setIntroState] = useState<'init' | 'storm' | 'finished'>('init');

    useEffect(() => {
        // Sequence timeline
        const startTimer = setTimeout(() => {
            setIntroState('storm');
        }, 1000); // 1 second black screen

        const endTimer = setTimeout(() => {
            setIntroState('finished');
        }, 4500); // 3.5 seconds of storm

        return () => {
            clearTimeout(startTimer);
            clearTimeout(endTimer);
        };
    }, []);

    const handleAccept = () => {
        setVampireMessage("¡¡GRRR!! ¡Te dije que NO! El vampiro odia el rastreo. ¡Dale a RECHAZAR!");
    };

    // Intro Screen Component
    if (introState !== 'finished') {
        return (
            <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
                {/* Background Image (Darkened) */}
                {introState === 'storm' && (
                    <div 
                        className="absolute inset-0 opacity-0 animate-fade-in-fast"
                        style={{
                            backgroundImage: 'url("https://images.unsplash.com/photo-1596466548772-788618164365?q=80&w=1920&auto=format&fit=crop")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: 'brightness(0.3) contrast(1.5)',
                            opacity: 1,
                            transition: 'opacity 0.5s ease-in'
                        }}
                    ></div>
                )}

                {/* Lightning Flash Overlay */}
                {introState === 'storm' && (
                    <div className="absolute inset-0 bg-white pointer-events-none animate-lightning"></div>
                )}

                {/* Vampire Appearance */}
                {introState === 'storm' && (
                    <div className="relative z-10 flex flex-col items-center animate-zoom-in-shake">
                        <div className="text-[150px] drop-shadow-[0_0_30px_rgba(255,0,0,0.8)]">🧛</div>
                        <div className="flex space-x-4 text-6xl mt-4">
                            <span className="animate-bounce delay-100">🍪</span>
                            <span className="animate-bounce delay-200">🍪</span>
                            <span className="animate-bounce delay-300">🍪</span>
                        </div>
                        <h1 className="text-red-600 font-extrabold text-5xl mt-8 tracking-widest uppercase drop-shadow-[0_0_10px_white] animate-pulse">
                            ¡ALTO AHÍ!
                        </h1>
                    </div>
                )}

                <style>{`
                    @keyframes lightning {
                        0% { opacity: 0; }
                        2% { opacity: 1; }
                        4% { opacity: 0; }
                        6% { opacity: 1; }
                        8% { opacity: 0; }
                        100% { opacity: 0; }
                    }
                    @keyframes zoom-in-shake {
                        0% { transform: scale(0) rotate(0deg); opacity: 0; }
                        50% { transform: scale(1.2) rotate(-5deg); opacity: 1; }
                        60% { transform: scale(1) rotate(5deg); }
                        70% { transform: scale(1) rotate(-5deg); }
                        80% { transform: scale(1) rotate(5deg); }
                        100% { transform: scale(1) rotate(0deg); }
                    }
                    .animate-lightning {
                        animation: lightning 3s infinite;
                    }
                    .animate-zoom-in-shake {
                        animation: zoom-in-shake 0.8s ease-out forwards;
                    }
                    .animate-fade-in-fast {
                        animation: fadeIn 0.5s ease-in forwards;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden animate-fade-in">
            {/* Background Image */}
            <div 
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1596466548772-788618164365?q=80&w=1920&auto=format&fit=crop")', // Teide/Canary Islands landscape
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-sm transition-all duration-1000"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center w-full p-4">
                <div className="text-center mb-12 text-white">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">CEIP Los Cristianos</h1>
                    <h2 className="text-2xl md:text-3xl opacity-95 font-light mb-4">Tutoría Virtual 6º Primaria</h2>
                    
                    <div className={`mt-6 inline-flex items-center px-4 py-2 rounded-full ${status === 'open' ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-red-500 shadow-lg shadow-red-500/50'}`}>
                        <span className="font-bold uppercase tracking-wider text-sm text-white">
                            {status === 'open' ? 'Sistema Abierto' : 'Sistema Cerrado'}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                    <button 
                        onClick={() => onSelectMode('student')}
                        className="group flex flex-col items-center p-8 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border-2 border-white/20 hover:border-white/50 shadow-xl backdrop-blur-md hover:scale-105"
                    >
                        <UserGroupIcon className="w-20 h-20 mb-4 text-yellow-300 group-hover:scale-110 transition-transform drop-shadow-md" />
                        <span className="text-2xl font-bold text-white">Acceso Alumnos</span>
                        <p className="mt-2 text-center text-blue-100">Entra para repasar tus asignaturas</p>
                    </button>

                    <button 
                        onClick={() => onSelectMode('admin')}
                        className="group flex flex-col items-center p-8 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border-2 border-white/20 hover:border-white/50 shadow-xl backdrop-blur-md hover:scale-105"
                    >
                        <LockClosedIcon className="w-20 h-20 mb-4 text-purple-300 group-hover:scale-110 transition-transform drop-shadow-md" />
                        <span className="text-2xl font-bold text-white">Acceso Docentes</span>
                        <p className="mt-2 text-center text-blue-100">Panel de control y configuración</p>
                    </button>
                </div>

                <footer className="mt-16 text-white/80 text-sm font-medium text-center bg-black/30 px-6 py-2 rounded-full">
                    © {new Date().getFullYear()} CEIP Los Cristianos - Proyecto de Innovación Educativa
                </footer>
            </div>

            {/* Vampire Cookie Modal */}
            {!cookiesRejected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="bg-gray-900 border-2 border-purple-500 rounded-3xl p-8 max-w-md w-full text-center shadow-[0_0_50px_rgba(168,85,247,0.5)] transform transition-all scale-100 animate-bounce-in">
                        <div className="text-6xl mb-4 animate-bounce">🧛</div>
                        <h3 className="text-2xl font-bold text-white mb-2">¡ALTO AHÍ!</h3>
                        <p className="text-purple-300 font-bold mb-4">Gestión de Galletas (Cookies)</p>
                        
                        <div className="bg-gray-800 p-4 rounded-xl mb-6 border border-gray-700">
                            <p className="text-gray-300 text-lg italic">
                                "{vampireMessage}"
                            </p>
                            <div className="flex justify-center mt-2 space-x-2 text-2xl">
                                <span>🍪</span><span>🚫</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button 
                                onClick={handleAccept}
                                className="w-full bg-gray-700 hover:bg-gray-600 text-gray-400 py-3 rounded-xl font-medium transition-colors text-xs sm:text-sm leading-tight"
                            >
                                Aceptar todas las galletas y permitir que se adueñen de nuestros datos ¡Gratis!??!!! (Parece mala idea, ¿no?)
                            </button>
                            <button 
                                onClick={() => setCookiesRejected(true)}
                                className="w-full bg-purple-600 hover:bg-purple-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-purple-600/30 transition-all transform hover:scale-105 hover:animate-pulse"
                            >
                                ¡RECHAZAR TODAS LAS COOKIES!
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <style>{`
                @keyframes bounceIn {
                    0% { transform: scale(0.3); opacity: 0; }
                    50% { transform: scale(1.05); opacity: 1; }
                    70% { transform: scale(0.9); }
                    100% { transform: scale(1); }
                }
                .animate-bounce-in {
                    animation: bounceIn 0.6s cubic-bezier(0.215, 0.610, 0.355, 1.000) both;
                }
            `}</style>
        </div>
    );
};

export default LandingScreen;
