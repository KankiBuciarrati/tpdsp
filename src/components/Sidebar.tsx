import React, { useState } from 'react';
import { TP_SECTIONS } from '../config/navigation';
import { ChevronDown, Menu, X, BookOpen } from 'lucide-react';

interface SidebarProps {
    activeTP: string;
    activeExo: string;
    onTPChange: (tpId: string) => void;
    onExoChange: (tpId: string, exoId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
                                                    activeTP,
                                                    activeExo,
                                                    onTPChange,
                                                    onExoChange,
                                                }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [expandedTP, setExpandedTP] = useState<string | null>(activeTP);

    const toggleTP = (tpId: string) => {
        setExpandedTP(expandedTP === tpId ? null : tpId);
        onTPChange(tpId);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed md:hidden bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg z-40 hover:bg-blue-700"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <aside
                className={`
          fixed md:static
          left-0 top-0 h-screen
          w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
          text-white border-r border-slate-700/50 shadow-2xl
          transition-transform duration-300 z-50
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          overflow-y-auto
        `}
            >
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 backdrop-blur p-6 border-b border-white/10 shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <BookOpen size={28} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Signal Lab</h1>
                            <p className="text-xs text-blue-100">Analyse de Signaux</p>
                        </div>
                    </div>
                </div>

                <nav className="p-5 space-y-3">
                    {TP_SECTIONS.map((tp) => (
                        <div key={tp.id}>
                            <button
                                onClick={() => toggleTP(tp.id)}
                                className={`
                  w-full flex items-center justify-between px-5 py-4 rounded-xl
                  transition-all duration-300 font-medium text-left group
                  ${
                                    activeTP === tp.id
                                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                                        : 'text-slate-300 hover:bg-slate-700/70 hover:translate-x-1'
                                }
                `}
                            >
                <span>
                  <span className={`font-bold text-sm ${activeTP === tp.id ? 'text-white' : 'text-cyan-400'}`}>
                    TP {tp.number}
                  </span>
                  <br />
                  <span className="text-sm mt-1 block">{tp.title}</span>
                </span>
                                <ChevronDown
                                    size={20}
                                    className={`transition-transform duration-300 ${
                                        expandedTP === tp.id ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>

                            {expandedTP === tp.id && (
                                <div className="mt-3 ml-4 space-y-2 border-l-2 border-slate-600/50 pl-4 animate-slide-up">
                                    {tp.exercises.map((exo) => (
                                        <button
                                            key={exo.id}
                                            onClick={() => {
                                                onExoChange(tp.id, exo.id);
                                                setIsOpen(false);
                                            }}
                                            className={`
                        w-full text-left px-4 py-3 rounded-lg transition-all duration-300 text-sm group
                        ${
                                                activeExo === exo.id
                                                    ? 'bg-blue-500/30 text-blue-200 font-semibold border-l-4 border-cyan-400 shadow-lg'
                                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 hover:translate-x-1'
                                            }
                      `}
                                        >
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-xs ${activeExo === exo.id ? 'text-cyan-300' : 'text-cyan-500'}`}>
                          Exo {exo.number}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="flex-1">{exo.title}</span>
                      </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-slate-700/50 bg-gradient-to-t from-slate-900 to-transparent backdrop-blur-sm">
                    <div className="text-xs text-slate-400 space-y-1">
                        <p className="font-medium text-slate-300">Exercice Traitement du Signal</p>
                        <p className="text-slate-500">2024-2025</p>
                    </div>
                </div>
            </aside>

            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black/50 md:hidden z-40"
                />
            )}
        </>
    );
};
