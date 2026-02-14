import React, { useState } from 'react';
import { SIGNALS } from '../signals';
import { calculateEnergyTrapeze, calculateAveragePower, formatEnergy } from '../utils/SignalAnalysis.ts';
import { Zap, Calculator } from 'lucide-react';

export const PowerCalculation: React.FC = () => {
    const [tStart, setTStart] = useState(0);
    const [tEnd, setTEnd] = useState(10);
    const [energy, setEnergy] = useState<number | null>(null);
    const [power, setPower] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const handleCalculate = () => {
        setLoading(true);
        setTimeout(() => {
            const signalFunc = SIGNALS['x11(t)'].func;
            const e = calculateEnergyTrapeze(signalFunc, tStart, tEnd);
            const p = calculateAveragePower(signalFunc, tStart, tEnd);
            setEnergy(e);
            setPower(p);
            setLoading(false);
        }, 100);
    };

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center text-blue-900">
                    <Zap className="mr-2" /> Signal x11(t) = sin(4π)
                </h3>
                <p className="text-sm text-blue-700">
                    Puissance moyenne sur un intervalle [t_start, t_end]
                </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold mb-4 flex items-center">
                    <Calculator className="mr-2 text-gray-600" size={20} />
                    Paramètres d'Intervalle
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Début (t_start)</label>
                        <input
                            type="number"
                            value={tStart}
                            onChange={(e) => setTStart(parseFloat(e.target.value))}
                            step={0.5}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fin (t_end)</label>
                        <input
                            type="number"
                            value={tEnd}
                            onChange={(e) => setTEnd(parseFloat(e.target.value))}
                            step={0.5}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <button
                    onClick={handleCalculate}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
                >
                    <Zap size={18} />
                    {loading ? 'Calcul en cours...' : 'Calculer la Puissance'}
                </button>
            </div>

            {energy !== null && power !== null && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
                        <p className="text-sm font-medium text-green-600 uppercase tracking-wide mb-2">Énergie Totale</p>
                        <p className="text-3xl font-bold text-green-700">{formatEnergy(energy)}</p>
                        <p className="text-xs text-green-600 mt-2">Joules (J)</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
                        <p className="text-sm font-medium text-blue-600 uppercase tracking-wide mb-2">Puissance Moyenne</p>
                        <p className="text-3xl font-bold text-blue-700">{formatEnergy(power)}</p>
                        <p className="text-xs text-blue-600 mt-2">Watts (W)</p>
                    </div>
                </div>
            )}

            {energy !== null && power !== null && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Détails du Calcul</h4>

                    <div className="space-y-3 text-sm text-gray-700">
                        <div>
                            <p className="font-medium text-gray-900">Formule de Puissance Moyenne</p>
                            <p className="font-mono text-gray-600 mt-1">P = (1/T) × ∫|x(t)|² dt</p>
                        </div>

                        <div className="pt-3 border-t border-gray-200">
                            <p className="font-medium text-gray-900">Paramètres</p>
                            <ul className="list-none space-y-1 mt-2 text-gray-600">
                                <li>• Intervalle: [{tStart}, {tEnd}]</li>
                                <li>• Durée T = {(tEnd - tStart).toFixed(2)} s</li>
                            </ul>
                        </div>

                        <div className="pt-3 border-t border-gray-200">
                            <p className="font-medium text-gray-900">Résultats</p>
                            <ul className="list-none space-y-1 mt-2 text-gray-600 font-mono">
                                <li>• Énergie E = {formatEnergy(energy)} J</li>
                                <li>• Puissance P = {formatEnergy(energy)} / {(tEnd - tStart).toFixed(2)} = {formatEnergy(power)} W</li>
                            </ul>
                        </div>

                        <div className="pt-3 border-t border-gray-200 bg-yellow-50 p-3 rounded">
                            <p className="font-medium text-yellow-900">Note Mathématique</p>
                            <p className="text-yellow-800 text-xs mt-1">
                                x11(t) = sin(4π) est une constante nulle (0), donc:
                            </p>
                            <ul className="list-none space-y-1 mt-2 text-yellow-800 text-xs">
                                <li>• ∫|x(t)|² dt = 0 (pour tout intervalle)</li>
                                <li>• P = 0/T = 0 W (pour tout intervalle non-vide)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
