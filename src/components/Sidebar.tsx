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
          w-64 bg-gradient-to-b from-slate-900 to-slate-800
          text-white border-r border-slate-700
          transition-transform duration-300 z-50
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          overflow-y-auto
        `}
            >
                <div className="sticky top-0 bg-slate-900/95 backdrop-blur p-6 border-b border-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                        <BookOpen size={28} className="text-blue-400" />
                        <h1 className="text-xl font-bold">Signal Lab</h1>
                    </div>
                    <p className="text-xs text-slate-400">Analyse de Signaux</p>
                </div>

                <nav className="p-4 space-y-2">
                    {TP_SECTIONS.map((tp) => (
                        <div key={tp.id}>
                            <button
                                onClick={() => toggleTP(tp.id)}
                                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-lg
                  transition-colors font-medium text-left
                  ${
                                    activeTP === tp.id
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-300 hover:bg-slate-700/50'
                                }
                `}
                            >
                <span>
                  <span className="font-bold text-blue-400">TP {tp.number}</span>
                  <br />
                  <span className="text-sm">{tp.title}</span>
                </span>
                                <ChevronDown
                                    size={18}
                                    className={`transition-transform ${
                                        expandedTP === tp.id ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>

                            {expandedTP === tp.id && (
                                <div className="mt-2 ml-4 space-y-1 border-l border-slate-600 pl-4">
                                    {tp.exercises.map((exo) => (
                                        <button
                                            key={exo.id}
                                            onClick={() => {
                                                onExoChange(tp.id, exo.id);
                                                setIsOpen(false);
                                            }}
                                            className={`
                        w-full text-left px-4 py-2 rounded transition-colors text-sm
                        ${
                                                activeExo === exo.id
                                                    ? 'bg-blue-500/20 text-blue-300 font-semibold border-l-2 border-blue-400'
                                                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
                                            }
                      `}
                                        >
                      <span className="font-semibold text-blue-400">
                        Exo {exo.number}.
                      </span>{' '}
                                            {exo.title}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700 bg-slate-900/50 text-xs text-slate-400">
                    <p>Exercice Traitement du Signal</p>
                    <p className="mt-1">2024-2025</p>
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
