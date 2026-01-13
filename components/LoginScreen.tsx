import React, { useState, useMemo } from 'react';
import { UserCircleIcon, AcademicCapIcon, BuildingOffice2Icon } from '@heroicons/react/24/solid';

interface Props {
    onLogin: (name: string, email: string, avatar: string) => void;
    onBack: () => void;
}

const LoginScreen: React.FC<Props> = ({ onLogin, onBack }) => {
    const [loginMode, setLoginMode] = useState<'student' | 'staff'>('student');
    const [accessCode, setAccessCode] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

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
        if (code.length > 0 && loginMode === 'student') {
            setError('Formato incorrecto. Ejemplo: 6B4');
        } else {
            setError('');
        }
        return { full: code, isValid: false, studentNumber: '?' };
    }, [accessCode, loginMode]);

    const handleStudentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (parsedCode.isValid) {
            const name = `Alumno ${parsedCode.full}`;
            const studentEmail = `${parsedCode.full.toLowerCase()}@canariaseducacion.es`;
            const avatar = `https://via.placeholder.com/150/4F46E5/FFFFFF?text=${parsedCode.studentNumber}`;
            onLogin(name, studentEmail, avatar);
        } else {
            setError('Formato de código inválido. Debe ser como "6B4".');
        }
    };
    
    const handleStaffSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedEmail = email.trim().toLowerCase();
        if (trimmedEmail.endsWith('@gobiernodecanarias.org') || trimmedEmail.endsWith('@canariaseducacion.es')) {
             // Basic validation to prevent student codes from being used as staff emails
            if (/^\d[ab]\d{1,2}@canariaseducacion\.es$/.test(trimmedEmail)) {
                setError('Usa la pestaña "Soy Alumno" para códigos de clase.');
                return;
            }
            setError('');
            const name = trimmedEmail.split('@')[0];
            const avatar = `https://via.placeholder.com/150/6D28D9/FFFFFF?text=${name.charAt(0).toUpperCase()}`;
            onLogin(name, trimmedEmail, avatar);
        } else {
            setError('El email debe ser de @gobiernodecanarias.org o @canariaseducacion.es');
        }
    };

    const formSubmitHandler = loginMode === 'student' ? handleStudentSubmit : handleStaffSubmit;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 p-4">
            <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 relative">
                
                <button onClick={onBack} className="absolute top-4 left-4 text-xs font-bold text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors flex items-center uppercase tracking-wider z-10">
                    <span className="mr-1">←</span> Volver
                </button>

                <div className="mb-6 bg-gray-100 dark:bg-gray-700 p-1 rounded-full flex items-center">
                    <button 
                        onClick={() => { setLoginMode('student'); setError(''); }}
                        className={`w-1/2 py-2 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all ${loginMode === 'student' ? 'bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow' : 'text-gray-500'}`}
                    >
                        <AcademicCapIcon className="w-5 h-5" /> Soy Alumno
                    </button>
                    <button 
                        onClick={() => { setLoginMode('staff'); setError(''); }}
                        className={`w-1/2 py-2 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all ${loginMode === 'staff' ? 'bg-white dark:bg-purple-600 text-purple-700 dark:text-white shadow' : 'text-gray-500'}`}
                    >
                        <BuildingOffice2Icon className="w-5 h-5" /> Soy Docente
                    </button>
                </div>

                {loginMode === 'student' ? (
                    <div className="animate-fade-in">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white">Identificación de Alumno</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Introduce tu código de clase para acceder.</p>
                        </div>
                        <form onSubmit={formSubmitHandler} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Código de Acceso</label>
                                <input
                                    type="text"
                                    required
                                    autoCapitalize="characters"
                                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all outline-none text-2xl font-mono tracking-widest text-center"
                                    value={accessCode}
                                    onChange={(e) => setAccessCode(e.target.value)}
                                    placeholder="6B4"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!parsedCode.isValid}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center text-sm uppercase tracking-wide mt-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                <UserCircleIcon className="w-5 h-5 mr-2" />
                                Entrar como Alumno
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white">Acceso de Personal</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Usa tu email institucional para entrar.</p>
                        </div>
                        <form onSubmit={formSubmitHandler} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Email Institucional</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all outline-none text-base"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="nombre@gobiernodecanarias.org"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center text-sm uppercase tracking-wide mt-2"
                            >
                                <UserCircleIcon className="w-5 h-5 mr-2" />
                                Entrar como Docente
                            </button>
                        </form>
                    </div>
                )}
                
                {error && <p className="text-red-500 text-xs mt-4 text-center">{error}</p>}
            </div>
        </div>
    );
};

export default LoginScreen;