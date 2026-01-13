
import React, { useState } from 'react';
import { HandThumbUpIcon, HandThumbDownIcon, MinusCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

const FeedbackWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [feedbackType, setFeedbackType] = useState<'orange' | 'red' | null>(null);
    const [comment, setComment] = useState('');
    const [showThankYou, setShowThankYou] = useState(false);

    const handleInteraction = (type: 'green' | 'orange' | 'red') => {
        if (type === 'green') {
            setShowThankYou(true);
            setTimeout(() => setShowThankYou(false), 3000);
        } else {
            setFeedbackType(type);
            setIsOpen(true);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Logic to send feedback would go here
        console.log(`Feedback (${feedbackType}): ${comment}`);
        setIsOpen(false);
        setComment('');
        setShowThankYou(true);
        setTimeout(() => setShowThankYou(false), 3000);
    };

    return (
        <>
            {/* Floating Buttons */}
            <div className="fixed bottom-4 right-4 z-40 flex gap-3 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-xl border border-gray-200 dark:border-gray-700 transition-all hover:scale-105">
                <button 
                    onClick={() => handleInteraction('green')}
                    className="p-2 bg-green-100 hover:bg-green-500 text-green-600 hover:text-white rounded-full transition-colors shadow-sm"
                    title="Me gusta"
                >
                    <HandThumbUpIcon className="w-6 h-6" />
                </button>
                <button 
                    onClick={() => handleInteraction('orange')}
                    className="p-2 bg-orange-100 hover:bg-orange-500 text-orange-600 hover:text-white rounded-full transition-colors shadow-sm"
                    title="No está mal"
                >
                    <MinusCircleIcon className="w-6 h-6" />
                </button>
                <button 
                    onClick={() => handleInteraction('red')}
                    className="p-2 bg-red-100 hover:bg-red-500 text-red-600 hover:text-white rounded-full transition-colors shadow-sm"
                    title="No me gusta"
                >
                    <HandThumbDownIcon className="w-6 h-6" />
                </button>
            </div>

            {/* Thank You Toast */}
            {showThankYou && (
                <div className="fixed bottom-20 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl animate-bounce flex items-center">
                    <HandThumbUpIcon className="w-5 h-5 mr-2" />
                    <span className="font-bold">¡Gracias por tu opinión!</span>
                </div>
            )}

            {/* Feedback Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl max-w-md w-full border-2 border-blue-500 relative transform transition-all scale-100">
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>

                        <h3 className={`text-2xl font-bold mb-2 ${feedbackType === 'orange' ? 'text-orange-500' : 'text-red-500'}`}>
                            {feedbackType === 'orange' ? '¿Cómo podemos mejorar?' : '¡Vaya! Lo sentimos.'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 font-medium">
                            ¿Qué cambiarías? ¿Alguna idea nueva para mejorar?
                        </p>

                        <form onSubmit={handleSubmit}>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none h-32 mb-4 shadow-inner"
                                placeholder="Escribe aquí tus ideas..."
                                required
                            />
                            <div className="flex justify-end gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 font-bold"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg hover:scale-105 transition-all"
                                >
                                    Enviar Sugerencia
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default FeedbackWidget;
