import React, { useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

// Data for each island
const islandData = {
  'el-hierro': {
    name: "El Hierro",
    capital: "Valverde",
    image: "https://images.unsplash.com/photo-1598379922869-7c08c7c90853?q=80&w=800&auto=format&fit=crop",
    description: "Conocida como la Isla del Meridiano, es la más pequeña y occidental. Es Reserva de la Biosfera y famosa por su compromiso con las energías renovables, buscando ser 100% autosuficiente."
  },
  'la-palma': {
    name: "La Palma",
    capital: "Santa Cruz de La Palma",
    image: "https://images.unsplash.com/photo-1633513398991-22839b2b512a?q=80&w=800&auto=format&fit=crop",
    description: "Apodada la 'Isla Bonita' por su increíble verdor y paisajes. Alberga el Parque Nacional de la Caldera de Taburiente y es un destino mundialmente famoso para la observación de estrellas."
  },
  'la-gomera': {
    name: "La Gomera",
    capital: "San Sebastián de La Gomera",
    image: "https://images.unsplash.com/photo-1616013098314-9a4f6a54f8d9?q=80&w=800&auto=format&fit=crop",
    description: "Famosa por sus bosques de laurisilva en el Parque Nacional de Garajonay, Patrimonio de la Humanidad. Es el hogar del Silbo Gomero, un lenguaje silbado único en el mundo."
  },
  'tenerife': {
    name: "Tenerife",
    capital: "Santa Cruz de Tenerife",
    image: "https://images.unsplash.com/photo-1596466548772-788618164365?q=80&w=800&auto=format&fit=crop",
    description: "La isla más grande y poblada. Alberga el Teide, el pico más alto de España, y su Parque Nacional es Patrimonio de la Humanidad. Famosa por su carnaval y sus diversos paisajes."
  },
  'gran-canaria': {
    name: "Gran Canaria",
    capital: "Las Palmas de Gran Canaria",
    image: "https://images.unsplash.com/photo-1588631114954-bf039019d05e?q=80&w=800&auto=format&fit=crop",
    description: "Conocida como el 'continente en miniatura' por su variedad de paisajes. Desde las Dunas de Maspalomas en el sur hasta las cumbres del Roque Nublo. Su capital es una de las ciudades más grandes de España."
  },
  'fuerteventura': {
    name: "Fuerteventura",
    capital: "Puerto del Rosario",
    image: "https://images.unsplash.com/photo-1580674285654-b6339a3f3675?q=80&w=800&auto=format&fit=crop",
    description: "La isla de las playas interminables de arena blanca y aguas turquesas. Es Reserva de la Biosfera y un paraíso para los amantes de los deportes acuáticos como el windsurf y el kitesurf."
  },
  'lanzarote': {
    name: "Lanzarote",
    capital: "Arrecife",
    image: "https://images.unsplash.com/photo-1542861296-15f5a4e32d84?q=80&w=800&auto=format&fit=crop",
    description: "Una isla de paisajes volcánicos casi lunares. La huella del artista César Manrique está por todas partes, integrando arte y naturaleza de forma única en lugares como los Jameos del Agua."
  }
};

type IslandId = keyof typeof islandData;

const CanaryMap: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [selectedIsland, setSelectedIsland] = useState<IslandId | null>(null);

    const handleIslandClick = (id: IslandId) => {
        setSelectedIsland(id);
    };

    const currentData = selectedIsland ? islandData[selectedIsland] : null;

    return (
        <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
            <header className="bg-white dark:bg-gray-800 shadow-md p-4 z-10 flex items-center">
                <button onClick={onBack} className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="font-bold text-xl text-gray-800 dark:text-white">Mapa Interactivo de Canarias</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Haz clic en una isla para descubrirla</p>
                </div>
            </header>

            <main className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 p-6 overflow-hidden">
                {/* Map Section */}
                <div className="md:col-span-2 flex items-center justify-center h-full overflow-hidden">
                    <svg viewBox="0 0 520 320" className="w-full h-full max-h-[calc(100vh-120px)] object-contain">
                        <style>{`
                            svg g {
                                cursor: pointer;
                                transition: all 0.2s ease-in-out;
                            }
                            svg g path, svg g circle {
                                fill: #9ca3af; /* gray-400 */
                                stroke: #fff;
                                stroke-width: 2;
                            }
                            .dark svg g path, .dark svg g circle {
                                fill: #4b5563; /* gray-600 */
                                stroke: #1f2937; /* gray-800 */
                            }
                            svg g:hover path, svg g:hover circle {
                                fill: #60a5fa; /* blue-400 */
                                transform: scale(1.05);
                                transform-origin: center;
                            }
                            .dark svg g:hover path, .dark svg g:hover circle {
                                fill: #3b82f6; /* blue-600 */
                            }
                            svg g[data-selected="true"] path, svg g[data-selected="true"] circle {
                                fill: #facc15 !important; /* yellow-400 */
                                stroke: #ca8a04; /* yellow-600 */
                            }
                            .dark svg g[data-selected="true"] path, .dark svg g[data-selected="true"] circle {
                                fill: #facc15 !important; /* yellow-400 */
                                stroke: #1f2937;
                            }
                        `}</style>

                        <g onClick={() => handleIslandClick('el-hierro')} data-selected={selectedIsland === 'el-hierro'}>
                            <path d="M44.1,253.9c-1.6-4.6-2.9-9.5-2.9-14.6c0-11.4,4.2-21.8,11.2-29.8c2.9-3.3,4.1-7.8,3.2-12.2 c-3.1-15.1,5.8-30.2,20.5-35.1c3.1-1,6.3-1.4,9.4-1.2c5.9,0.5,10.9,3.5,14.6,8.2c1.9,2.4,4.8,3.9,7.9,3.9c2.5,0,4.8-0.9,6.7-2.5 c5.5-4.8,13-6.2,20-3.6c2.8,1,5.4,2.7,7.5,4.9c5.1,5.3,12.5,7.7,19.9,6.4c1.6-0.3,3.3-0.6,4.9-0.9c2.3-0.5,4.6-1,6.8-1.5" transform="translate(-35, -155) scale(0.9)"/>
                        </g>
                        <g onClick={() => handleIslandClick('la-palma')} data-selected={selectedIsland === 'la-palma'}>
                            <path d="M124.6,220.6c-4-13.6-2.5-28.3,4.4-40.8c2.1-3.8,2.8-8.2,1.8-12.5c-4-17.6,5.3-35.6,22.6-41.9 c12.1-4.4,25.5-2.1,35.4,6.2c3.5,2.9,8.1,3.7,12.2,2.1c16.3-6.1,34.4,1.3,42,16.7c2.2,4.4,6.4,7.4,11.4,8.1" transform="translate(-115, -120) scale(0.7)"/>
                        </g>
                        <g onClick={() => handleIslandClick('la-gomera')} data-selected={selectedIsland === 'la-gomera'}>
                            <circle cx="160" cy="245" r="22" />
                        </g>
                        <g onClick={() => handleIslandClick('tenerife')} data-selected={selectedIsland === 'tenerife'}>
                            <path d="M260,213.3c-11.2-1.9-21.7-6.8-30.2-14.1c-9.2-8,-15.8-18.7-18.9-30.7c-1.3-5-3.8-9.5-7.3-13.1 c-11.1-11.5-13.1-28.5-4.9-42.2c11.3-19.1,35.5-27.1,56-19.3c5.6,2.1,11.6,2.2,17.3,0.3c15.2-5,31.4,1.5,40.1,15.2 c3.4,5.4,9,8.9,15.3,9.5c17.6,1.8,30.3,16.4,29.9,34.1c-0.1,4-1.1,7.9-2.8,11.4c-4.9,9.8-12.9,17.7-22.7,22.6 c-9.1,4.5-19.1,6.5-29.2,5.8" transform="translate(-180, -110) scale(1.1)"/>
                        </g>
                        <g onClick={() => handleIslandClick('gran-canaria')} data-selected={selectedIsland === 'gran-canaria'}>
                            <path d="M363.3,248c-15.1-0.2-29.1-6.1-40-16.3c-9.4-8.8-15-20.9-15.6-33.8c-0.2-3.8,0.7-7.6,2.5-10.9 c5.3-9.5,14.6-15.8,25.3-17.6c13.2-2.2,26.2,2.4,35,11.9c9,9.7,13.6,22.4,12.5,35.2c-1.3,14.9-10,28.2-22.3,35.2 C376.5,245.4,369.9,248.1,363.3,248z" transform="translate(-300, -170) scale(1.1)"/>
                        </g>
                        <g onClick={() => handleIslandClick('fuerteventura')} data-selected={selectedIsland === 'fuerteventura'}>
                            <path d="M438.4,242.7c-0.1-1.3-0.2-2.6-0.2-3.9c0-19.5,9-37,23.3-48.4c3.4-2.7,5.5-6.8,5.8-11.2 c0.9-14.6-9.1-28.1-23.4-31.1c-14-2.9-28.1,4.1-34.5,16.8c-1.8,3.5-5.1,6-9,6.7c-13.8,2.5-24.3-7.5-25.7-21.2 c-0.5-4.8-3.5-9-7.9-11.2c-15.1-7.5-32.9-4.8-45.2,7.1c-4.8,4.6-11,7.3-17.6,7.3c-2.9,0-5.8-0.5-8.7-1.4c-11.2-3.6-23.1,1.9-28.8,12 c-2.2,3.9-5.9,6.6-10.2,7.4c-11.8,2.1-20.4,12.8-19.8,24.8c0.2,3.8,1.4,7.4,3.5,10.5c8.3,12.3,21.8,20.1,36.5,21.3 c4.6,0.4,8.9,1.9,12.8,4.4c12,7.5,20.6,19.9,23.1,34c0.5,2.9,1.6,5.7,3.1,8.2" transform="translate(-320, -90) scale(0.8)"/>
                        </g>
                        <g onClick={() => handleIslandClick('lanzarote')} data-selected={selectedIsland === 'lanzarote'}>
                            <path d="M495.2,143c-6.2-7.8-16.1-12.3-26.6-11.9c-10.5,0.4-20,6-25.7,14.8c-2.2,3.4-5.6,5.8-9.6,6.7 c-12.3,2.7-21.3-7.4-21.3-19.6c0-4.8-1.8-9.4-4.9-12.9c-9.1-10.1-23.9-14.1-37.4-9.9c-5,1.5-10.2,1.6-15.3,0.3" transform="translate(-390, -75) scale(0.85)"/>
                        </g>
                    </svg>
                </div>

                {/* Info Panel */}
                <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col p-6 overflow-y-auto">
                    {currentData ? (
                        <div className="animate-fade-in">
                            <img src={currentData.image} alt={currentData.name} className="w-full h-48 object-cover rounded-lg mb-4 shadow-md" />
                            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{currentData.name}</h2>
                            <p className="font-semibold text-gray-500 dark:text-gray-400 mb-4">Capital: {currentData.capital}</p>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{currentData.description}</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                            <div className="text-6xl mb-4 animate-bounce">👆</div>
                            <h3 className="text-xl font-bold">Selecciona una isla</h3>
                            <p>Haz clic en el mapa para ver su información.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CanaryMap;