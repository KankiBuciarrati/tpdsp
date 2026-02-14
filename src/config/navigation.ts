import { TPSection } from '../types';
import { SignalAnalysis } from '../components/SignalAnalysis';

export const TP_SECTIONS: TPSection[] = [
    {
        id: 'tp1',
        number: 1,
        title: 'Signaux et Analyse Énergétique',
        description: 'Analyse des signaux mathématiques et classification énergétique',
        exercises: [
            {
                id: 'tp1-exo1',
                number: 1,
                title: 'Analyse Complète des Signaux',
                description: 'Visualisation, classification énergétique et calcul de puissance pour les signaux mathématiques',
                component: SignalAnalysis,
            },
        ],
    },
];

export const getTpById = (id: string) => TP_SECTIONS.find(tp => tp.id === id);
export const getExerciseById = (tpId: string, exoId: string) => {
    const tp = getTpById(tpId);
    return tp?.exercises.find(exo => exo.id === exoId);
};
