import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { getTpById, getExerciseById } from '../config/navigation';

interface TopbarProps {
    activeTP: string | null;
    activeExo: string | null;
    onBackToDashboard: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
                                                  activeTP,
                                                  activeExo,
                                                  onBackToDashboard,
                                              }) => {
    const tp = activeTP ? getTpById(activeTP) : null;
    const exo = activeTP && activeExo ? getExerciseById(activeTP, activeExo) : null;

    if (!tp || !exo) {
        return (
            <div className="bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 px-8 py-5 flex items-center gap-3 shadow-sm">
                <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-2 rounded-lg">
                    <Home size={20} className="text-white" />
                </div>
                <span className="font-semibold text-gray-800 text-lg">Tableau de Bord</span>
            </div>
        );
    }

    return (
        <div className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 text-sm">
                    <button
                        onClick={onBackToDashboard}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all duration-300 hover:shadow-md"
                    >
                        <Home size={18} />
                        <span className="font-medium">Accueil</span>
                    </button>
                    <ChevronRight size={18} className="text-gray-400" />
                    <span className="px-3 py-1.5 bg-gray-100 rounded-lg font-medium text-gray-700">
                        TP {tp.number}
                    </span>
                    <ChevronRight size={18} className="text-gray-400" />
                    <span className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold shadow-md">
                        Exo {exo.number}
                    </span>
                </div>
            </div>

            <div className="animate-slide-up">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                    {exo.title}
                </h2>
                <p className="text-gray-600 text-lg">{exo.description}</p>
            </div>
        </div>
    );
};
