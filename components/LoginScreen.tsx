import React, { useState, useMemo } from 'react';
import { UserCircleIcon, StarIcon } from '@heroicons/react/24/solid';

interface Props {
    onLogin: (name: string, email: string, avatar: string) => void;
    onBack: () => void;
}

const LoginScreen: React.FC<Props> = ({ onLogin, onBack }) => {
    const [accessCode, setAccessCode] = useState('');
    const [error, setError] = useState('');

    // Parse and validate the code in real-time for UI feedback
    const parsedCode = useMemo(() => {
        const code = accessCode.trim().toUpperCase();
        const match = code.match(/^(\d)([AB])(\d{1,2})$/);
        if (match) {
            setError('');
            return {
                full: code,
                group: match[1],
                classLetter: match[2],
                studentNumber: match[3],
                isValid: true,
            };
        }
        if (code.length > 0) {
            setError('Formato incorrecto. Ejemplo: 6B4');
        } else {
            setError('');
        }
        return { full: code, isValid: false, studentNumber: '?' };
    }, [accessCode]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (parsedCode.isValid) {
            const name = `Alumno ${parsedCode.full}`;
            const email = `${parsedCode.full.toLowerCase()}@canariaseducacion.es`;
            const avatar = `https://via.placeholder.com/150/4F46E5/FFFFFF?text=${parsedCode.studentNumber}`;
            onLogin(name, email, avatar);
        } else {
            setError('Formato de código inválido. Debe ser como "6B4".');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 p-4">
            <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-xl w-full max-w-4xl border border-white/50 flex flex-col md:flex-row gap-6">
                
                <button onClick={onBack} className="absolute top-4 left-4 text-xs font-bold text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors flex items-center uppercase tracking-wider">
                    <span className="mr-1">←</span> Volver
                </button>

                {/* Left Column: Input Form */}
                <div className="flex-1 flex flex-col justify-center space-y-4">
                    <div className="text-center md:text-left mb-2">
                        <h2 className="text-xl md:text-2xl font-extrabold text-gray-800 dark:text-white">Identificación de Alumno</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Introduce tu código de clase para acceder.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Código de Acceso</label>
                            <input
                                type="text"
                                required
                                autoCapitalize="characters"
                                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all outline-none text-lg font-mono tracking-widest text-center"
                                value={accessCode}
                                onChange={(e) => setAccessCode(e.target.value)}
                                placeholder="6B4"
                            />
                            {error && <p className="text-red-500 text-xs mt-1 text-center">{error}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={!parsedCode.isValid}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center text-sm uppercase tracking-wide mt-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            <UserCircleIcon className="w-5 h-5 mr-2" />
                            Entrar
                        </button>
                    </form>
                </div>

                {/* Right Column: VIP Card Preview */}
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <div className="relative group w-full max-w-[300px] transform transition-transform hover:scale-[1.01]">
                        <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-lg p-4 shadow-xl text-white overflow-hidden border border-yellow-600/40 h-[170px] flex flex-col justify-between">
                            {/* Background Effects */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl -ml-8 -mb-8 pointer-events-none"></div>

                            {/* Header */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="block text-[8px] font-mono text-yellow-500 tracking-widest uppercase">STUDENT ID</span>
                                    <span className="block font-bold text-xs text-gray-200">CEIP Los Cristianos</span>
                                </div>
                                <div className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-black text-[8px] font-black px-2 py-0.5 rounded shadow border border-yellow-400">
                                    V.I.P.
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex items-center gap-4 mt-1">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-full p-[3px] bg-gradient-to-b from-white via-[#0071B6] to-[#F7C800] shadow-[0_0_15px_rgba(255,255,255,0.6),0_0_20px_rgba(0,113,182,0.4),0_0_20px_rgba(247,200,0,0.4)] animate-pulse">
                                        <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden relative">
                                            <StarIcon className="absolute w-10 h-10 text-yellow-500/20 animate-spin-slow" />
                                            <span className="relative z-10 font-black text-4xl text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                                                {parsedCode.isValid ? parsedCode.studentNumber : '?'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-sm leading-tight truncate text-white w-32">
                                        {parsedCode.isValid ? `Alumno ${parsedCode.full}` : 'TU CÓDIGO'}
                                    </h3>
                                    <p className="text-[9px] text-gray-500 font-mono truncate">
                                        {parsedCode.isValid ? `${parsedCode.full.toLowerCase()}` : 'user_id'}
                                    </p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between items-end mt-2">
                                <div className="opacity-60">
                                    <div className="flex h-4 gap-[1px] items-end">
                                        {[...Array(12)].map((_, i) => (
                                            <div key={i} className={`bg-white w-[1px] ${i % 2 === 0 ? 'h-full' : 'h-1/2'}`}></div>
                                        ))}
                                    </div>
                                    <span className="text-[6px] text-gray-400 tracking-widest">84123456</span>
                                </div>
                                <img 
                                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://www3.gobiernodecanarias.org/medusa/edublog/ceiploscristianos" 
                                    alt="QR" 
                                    className="w-10 h-10 bg-white p-0.5 rounded-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 10s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default LoginScreen;