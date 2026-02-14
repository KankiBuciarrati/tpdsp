import React from 'react';
import { TP_SECTIONS } from '../config/navigation';
import { BookOpen, ChevronRight } from 'lucide-react';

interface DashboardProps {
    onSelectExercise: (tpId: string, exoId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectExercise }) => {
    return (
        <div className="space-y-8">
            <div className="text-center mb-12">
                <div className="flex justify-center mb-4">
                    <div className="bg-blue-100 p-4 rounded-full">
                        <BookOpen size={48} className="text-blue-600" />
                    </div>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                    Signal Lab
                </h1>
                <p className="text-lg text-gray-600">
                    Plateforme d'analyse et de traitement des signaux
                </p>
            </div>

            <div className="space-y-6">
                {TP_SECTIONS.map((tp) => (
                    <div
                        key={tp.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
                    >
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                            <h2 className="text-2xl font-bold mb-2">
                                TP {tp.number} - {tp.title}
                            </h2>
                            <p className="text-blue-100">{tp.description}</p>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {tp.exercises.map((exo) => (
                                <button
                                    key={exo.id}
                                    onClick={() => onSelectExercise(tp.id, exo.id)}
                                    className="group bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg p-5 text-left transition-all"
                                >
                                    <div className="flex items-start justify-between mb-2">
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                      Exo {exo.number}
                    </span>
                                        <ChevronRight
                                            size={20}
                                            className="text-gray-400 group-hover:text-blue-600 transition"
                                        />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition">
                                        {exo.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {exo.description}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
