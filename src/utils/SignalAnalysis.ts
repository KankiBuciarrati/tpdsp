import { SignalsDict, AnalysisResult } from '../types';

/**
 * Utilitaires pour l'analyse de signaux
 */

/**
 * Génère un tableau de valeurs également espacées
 * @param start - Valeur de début
 * @param end - Valeur de fin
 * @param num - Nombre de points
 * @returns Tableau de nombres
 */
export function linspace(start: number, end: number, num: number): number[] {
    const result: number[] = [];
    const step = (end - start) / (num - 1);

    for (let i = 0; i < num; i++) {
        result.push(start + step * i);
    }

    return result;
}

/**
 * Calcule l'énergie d'un signal avec la méthode des trapèzes
 * @param signal - Tableau de valeurs du signal
 * @param dt - Pas temporel
 * @returns Énergie du signal
 */
export function calculateEnergyTrapeze(signal: number[], dt: number): number {
    let energy = 0;
    for (let i = 0; i < signal.length - 1; i++) {
        const val1 = signal[i] * signal[i];
        const val2 = signal[i + 1] * signal[i + 1];
        energy += (val1 + val2) / 2 * dt;
    }
    return energy;
}

/**
 * Calcule l'énergie d'un signal avec la méthode de Simpson
 * @param signal - Tableau de valeurs du signal
 * @param dt - Pas temporel
 * @returns Énergie du signal
 */
export function calculateEnergySimpson(signal: number[], dt: number): number {
    const n = signal.length;
    if (n < 3) return calculateEnergyTrapeze(signal, dt);

    let energy = 0;
    const squared = signal.map(v => v * v);

    // Méthode de Simpson (1/3)
    for (let i = 0; i < n - 2; i += 2) {
        energy += (squared[i] + 4 * squared[i + 1] + squared[i + 2]) * dt / 3;
    }

    // Si nombre impair de points, ajouter le dernier segment avec trapèzes
    if (n % 2 === 0) {
        energy += (squared[n - 2] + squared[n - 1]) * dt / 2;
    }

    return energy;
}

/**
 * Calcule l'énergie d'un signal
 * @param signal - Tableau de valeurs du signal
 * @param dt - Pas temporel
 * @param method - Méthode d'intégration ('trapeze' ou 'simpson')
 * @returns Énergie du signal
 */
export function calculateEnergy(signal: number[], dt: number, method: 'trapeze' | 'simpson' = 'trapeze'): number {
    if (method === 'simpson') {
        return calculateEnergySimpson(signal, dt);
    }
    return calculateEnergyTrapeze(signal, dt);
}

/**
 * Calcule la puissance moyenne d'un signal
 * @param signal - Tableau de valeurs du signal
 * @param tStart - Temps de début
 * @param tEnd - Temps de fin
 * @returns Puissance moyenne
 */
export function calculateAveragePower(signal: number[], tStart: number, tEnd: number): number {
    const dt = (tEnd - tStart) / signal.length;
    const energy = calculateEnergy(signal, dt);
    return energy / (tEnd - tStart);
}

/**
 * Classifie un signal selon son énergie et sa puissance
 * @param energy - Énergie du signal
 * @param avgPower - Puissance moyenne
 * @returns Classification du signal
 */
export function classifySignal(energy: number, avgPower: number): string {
    const THRESHOLD = 1e10;

    if (energy < THRESHOLD && isFinite(energy)) {
        return 'Signal à énergie finie';
    }

    if (avgPower < THRESHOLD && isFinite(avgPower)) {
        return 'Signal à puissance moyenne finie';
    }

    return 'Signal à puissance infinie';
}

/**
 * Trouve les extrema d'un signal
 * @param signal - Tableau de valeurs
 * @returns Min et max
 */
export function findExtrema(signal: number[]): { min: number; max: number } {
    const validValues = signal.filter(v => isFinite(v));

    if (validValues.length === 0) {
        return { min: 0, max: 1 };
    }

    return {
        min: Math.min(...validValues),
        max: Math.max(...validValues)
    };
}

/**
 * Analyse tous les signaux prédéfinis
 * @param signals - Dictionnaire des signaux
 * @param method - Méthode d'intégration
 * @param tStart - Temps de début (par défaut -10)
 * @param tEnd - Temps de fin (par défaut 10)
 * @returns Tableau des résultats d'analyse
 */
export function analyzeAllSignals(
    signals: SignalsDict,
    method: 'trapeze' | 'simpson' = 'trapeze',
    tStart: number = -10,
    tEnd: number = 10
): AnalysisResult[] {
    const results: AnalysisResult[] = [];
    const numPoints = 1000;
    const t = linspace(tStart, tEnd, numPoints);
    const dt = (tEnd - tStart) / (numPoints - 1);

    for (const [signalName, signal] of Object.entries(signals)) {
        try {
            const values = signal.func(t);
            const energy = calculateEnergy(values, dt, method);
            const avgPower = calculateAveragePower(values, tStart, tEnd);
            const classification = classifySignal(energy, avgPower);

            results.push({
                signalName,
                energy,
                classification
            });
        } catch (error) {
            console.error(`Erreur lors de l'analyse du signal ${signalName}:`, error);
            results.push({
                signalName,
                energy: NaN,
                classification: 'Erreur de calcul'
            });
        }
    }

    return results;
}

/**
 * Formate l'énergie pour l'affichage
 * @param energy - Valeur d'énergie
 * @returns String formaté
 */
export function formatEnergy(energy: number): string {
    if (!isFinite(energy)) {
        return '∞';
    }
    if (energy === 0) {
        return '0';
    }
    if (Math.abs(energy) < 0.001 || Math.abs(energy) > 1000) {
        return energy.toExponential(3);
    }
    return energy.toFixed(3);
}