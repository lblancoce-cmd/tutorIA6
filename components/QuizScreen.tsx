import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse, Content } from "@google/genai";
import { Topic, User, Message } from '../types';
import { ArrowLeftIcon, PaperAirplaneIcon, DocumentArrowDownIcon } from '@heroicons/react/24/solid';

const VAMPY_AVATAR = 'https://cdn-icons-png.flaticon.com/512/3503/3503207.png';

const QuizScreen: React.FC<{ topic: Topic; user: User; onBack: () => void; }> = ({ topic, user, onBack }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);

    // Scroll to bottom of chat
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    // Initialize Chat
    useEffect(() => {
        const initChat = async () => {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                
                const systemInstruction: Content = {
                    role: 'system',
                    parts: [{
                        text: `Eres "Vampy", un tutor de IA divertido, atractivo y servicial para un estudiante de 6º de primaria en las Islas Canarias, España. Eres un experto en el tema de "${topic.title}".
                        Tu personalidad es la de un vampiro simpático y un poco travieso al que le encanta aprender y enseñar.
                        Mantén tus respuestas concisas, alentadoras y usa emojis.
                        Adapta el lenguaje para un niño de 11-12 años.
                        Empieza siempre la conversación saludando y presentándote. No esperes al usuario para saludar.
                        Tu objetivo es ayudar al alumno a entender "${topic.description}".
                        Puedes hacer preguntas tipo test para comprobar su comprensión.
                        Si el usuario se desvía del tema, guíale suavemente de vuelta a "${topic.title}".`
                    }]
                };

                const history: Content[] = [
                    {
                        role: 'user',
                        parts: [{ text: "Hola" }]
                    },
                    {
                        role: 'model',
                        parts: [{ text: topic.initialMessage }]
                    }
                ];

                chatRef.current = ai.chats.create({
                    model: 'gemini-3-flash-preview',
                    config: {
                        systemInstruction,
                    },
                    history
                });

                setMessages([
                    {
                        id: '0',
                        role: 'model',
                        text: topic.initialMessage
                    }
                ]);
            } catch (e) {
                console.error("Error initializing chat:", e);
                setError("No se pudo iniciar el chat. Por favor, inténtalo de nuevo más tarde.");
            }
        };

        initChat();
    }, [topic]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !chatRef.current) return;

        const userInput = input;
        setInput('');

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: userInput
        };

        // Add user message and a placeholder for model response
        setMessages(prev => [
            ...prev,
            userMessage,
            { id: (Date.now() + 1).toString(), role: 'model', text: '' }
        ]);

        setIsLoading(true);
        setError(null);

        try {
            const stream = await chatRef.current.sendMessageStream({ message: userInput });

            for await (const chunk of stream) {
                const response = chunk as GenerateContentResponse;
                const chunkText = response.text;

                if (chunkText) {
                    setMessages(prev => {
                        const newMessages = [...prev];
                        newMessages[newMessages.length - 1].text += chunkText;
                        return newMessages;
                    });
                }
            }
        } catch (e) {
            console.error("Error sending message:", e);
            setError("¡Uy! Algo salió mal. No pude enviar tu mensaje.");
            setMessages(prev => prev.slice(0, -1)); // Remove placeholder
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDownloadChat = () => {
        const chatContent = messages.map(msg => {
            const prefix = msg.role === 'model' ? 'Vampy' : 'Tú';
            return `${prefix}: ${msg.text}`;
        }).join('\n\n');

        const header = `Historial de chat sobre "${topic.title}"\nFecha: ${new Date().toLocaleString()}\n\n---\n\n`;
        const fullContent = header + chatContent;

        const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const fileName = `chat_${topic.title.replace(/\s+/g, '_').toLowerCase()}.txt`;
        link.download = fileName;

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 shadow-md p-4 z-10 flex items-center justify-between">
                <div className="flex items-center">
                    <button onClick={onBack} className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <div className="flex items-center">
                        <span className="text-3xl mr-3">{topic.icon}</span>
                        <div>
                            <h1 className="font-bold text-xl text-gray-800 dark:text-white">{topic.title}</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Hablando con Vampy</p>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={handleDownloadChat}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                    title="Descargar chat"
                >
                    <DocumentArrowDownIcon className="w-6 h-6" />
                </button>
            </header>

            <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4">
                {messages.map((msg, index) => (
                    <div key={msg.id} className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && <img src={VAMPY_AVATAR} alt="Vampy" className="w-8 h-8 rounded-full self-start" />}
                        <div className={`max-w-xs md:max-w-md lg:max-w-2xl p-3 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white dark:bg-gray-700 dark:text-white rounded-bl-none shadow-sm'}`}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            {isLoading && msg.role === 'model' && index === messages.length - 1 && (
                                <div className="flex items-center space-x-1 mt-2">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
                                </div>
                            )}
                        </div>
                        {msg.role === 'user' && <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />}
                    </div>
                ))}
                 {error && (
                    <div className="text-center p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
                )}
                <div ref={messagesEndRef} />
            </main>

            <footer className="bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isLoading ? "Vampy está escribiendo..." : "Escribe tu pregunta..."}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="p-3 bg-blue-600 text-white rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors shadow-lg"
                    >
                        <PaperAirplaneIcon className="w-6 h-6" />
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default QuizScreen;