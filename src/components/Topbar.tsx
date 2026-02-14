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
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-2 text-gray-700">
                <Home size={20} />
                <span className="font-medium">Tableau de Bord</span>
            </div>
        );
    }

    return (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <button
                        onClick={onBackToDashboard}
                        className="flex items-center gap-2 hover:text-blue-600 transition"
                    >
                        <Home size={18} />
                        <span>Accueil</span>
                    </button>
                    <ChevronRight size={18} />
                    <span className="font-medium">TP {tp.number}</span>
                    <ChevronRight size={18} />
                    <span className="font-medium text-blue-600">Exo {exo.number}</span>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-gray-900">{exo.title}</h2>
                <p className="text-gray-600 mt-1">{exo.description}</p>
            </div>
        </div>
    );
};
