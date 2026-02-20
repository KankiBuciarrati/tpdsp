import React from 'react';
import { TP_SECTIONS } from '../config/navigation';
import { BookOpen, ChevronRight, Zap, TrendingUp } from 'lucide-react';

interface DashboardProps {
    onSelectExercise: (tpId: string, exoId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectExercise }) => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500 rounded-2xl shadow-2xl p-12 text-white">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }}></div>
                </div>

                <div className="relative z-10 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-white/20 backdrop-blur-sm p-5 rounded-2xl shadow-lg transform hover:scale-110 transition-transform duration-300">
                            <BookOpen size={56} className="text-white" />
                        </div>
                    </div>
                    <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
                        Signal Lab
                    </h1>
                    <p className="text-xl text-blue-50 max-w-2xl mx-auto leading-relaxed">
                        Plateforme interactive d'analyse et de traitement des signaux
                    </p>
                    <div className="flex justify-center gap-6 mt-8">
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                            <Zap size={18} />
                            <span className="text-sm font-medium">Analyse en temps réel</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                            <TrendingUp size={18} />
                            <span className="text-sm font-medium">Visualisation avancée</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {TP_SECTIONS.map((tp, idx) => (
                    <div
                        key={tp.id}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 animate-slide-up"
                        style={{ animationDelay: `${idx * 100}ms` }}
                    >
                        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold">
                                        TP {tp.number}
                                    </span>
                                </div>
                                <h2 className="text-3xl font-bold mb-2">
                                    {tp.title}
                                </h2>
                                <p className="text-blue-50 text-lg">{tp.description}</p>
                            </div>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {tp.exercises.map((exo, exoIdx) => (
                                <button
                                    key={exo.id}
                                    onClick={() => onSelectExercise(tp.id, exo.id)}
                                    className="group relative bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-cyan-50 border-2 border-gray-200 hover:border-blue-400 rounded-xl p-6 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-scale-in"
                                    style={{ animationDelay: `${(idx * 100) + (exoIdx * 50)}ms` }}
                                >
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-bl-full"></div>

                                    <div className="flex items-start justify-between mb-3">
                                        <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
                                            Exo {exo.number}
                                        </span>
                                        <ChevronRight
                                            size={22}
                                            className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300"
                                        />
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-blue-700 transition">
                                        {exo.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                        {exo.description}
                                    </p>

                                    <div className="mt-4 flex items-center text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span>Commencer</span>
                                        <ChevronRight size={14} className="ml-1" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
