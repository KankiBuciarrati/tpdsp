import { TPSection } from '../types';
import { SignalPlot } from '../components/SignalPlot';
import { EnergyClassification } from '../components/EnergyClassification';
import { PowerCalculation } from '../components/PowerCalculation';

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
                title: 'Visualisation des Signaux',
                description: 'Visualiser et explorer les 12 signaux mathématiques avec contrôle des intervalles de temps',
                component: SignalPlot,
            },
            {
                id: 'tp1-exo2',
                number: 2,
                title: 'Classification Énergétique',
                description: 'Classifier les signaux comme signaux d\'énergie ou signaux de puissance en utilisant les méthodes des trapèzes et Simpson',
                component: EnergyClassification,
            },
            {
                id: 'tp1-exo3',
                number: 3,
                title: 'Calcul de Puissance',
                description: 'Calculer la puissance moyenne du signal x11(t) sur des intervalles personnalisés',
                component: PowerCalculation,
            },
        ],
    },
];

export const getTpById = (id: string) => TP_SECTIONS.find(tp => tp.id === id);
export const getExerciseById = (tpId: string, exoId: string) => {
    const tp = getTpById(tpId);
    return tp?.exercises.find(exo => exo.id === exoId);
};
