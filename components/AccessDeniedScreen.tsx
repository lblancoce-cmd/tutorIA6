
import React from 'react';
import { HandRaisedIcon } from '@heroicons/react/24/solid';

interface Props {
    onBack: () => void;
}

const AccessDeniedScreen: React.FC<Props> = ({ onBack }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/20 p-4 text-center">
            <HandRaisedIcon className="w-24 h-24 text-red-500 mb-6" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Acceso Fuera de Horario</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-md mb-8">
                El servicio de tutoría virtual solo está disponible en horario escolar:
                <br/><span className="font-bold">Lunes a Viernes de 8:00 a 14:00</span>.
            </p>
            <button 
                onClick={onBack}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-colors"
            >
                Volver al Inicio
            </button>
        </div>
    );
};

export default AccessDeniedScreen;
