import React, { useState } from 'react';
import { LockClosedIcon } from '@heroicons/react/24/solid';
import { ADMIN_USERS } from '../constants.ts';

interface Props {
    onLogin: () => void;
    onBack: () => void;
}

const AdminLoginScreen: React.FC<Props> = ({ onLogin, onBack }) => {
    const [emailPrefix, setEmailPrefix] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fullEmail = `${emailPrefix.trim()}@canariaseducacion.es`;
        const adminUser = ADMIN_USERS[fullEmail];
        
        if (adminUser && adminUser.password === password) {
            localStorage.setItem('admin_current_user', fullEmail);
            onLogin();
        } else {
            setError('Credenciales incorrectas (Email o Contraseña).');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-800 p-4">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
                <button onClick={onBack} className="mb-6 text-gray-400 hover:text-white">
                    ← Volver
                </button>
                
                <div className="flex justify-center mb-6">
                    <LockClosedIcon className="w-16 h-16 text-purple-500" />
                </div>
                
                <h2 className="text-2xl font-bold text-center mb-2 text-white">Acceso Docente</h2>
                <p className="text-center text-gray-400 mb-8">Introduce tus credenciales de administrador</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email Administrativo</label>
                        <div className="flex items-center w-full rounded-lg border border-gray-600 bg-gray-800 overflow-hidden focus-within:ring-2 focus-within:ring-purple-500">
                            <input
                                type="text"
                                required
                                className="flex-1 px-4 py-2 outline-none bg-gray-800 text-white min-w-0 placeholder-gray-500"
                                value={emailPrefix}
                                onChange={(e) => {
                                    setEmailPrefix(e.target.value);
                                    setError('');
                                }}
                                placeholder="usuario"
                            />
                            <span className="px-3 py-2 bg-gray-700 text-gray-400 text-sm border-l border-gray-600 whitespace-nowrap">
                                @canariaseducacion.es
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Contraseña</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError('');
                            }}
                            placeholder="•••"
                        />
                    </div>
                    
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors mt-4"
                    >
                        Acceder al Panel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginScreen;