import React, { useState } from 'react';
import { SIGNALS } from '../signals';
import { analyzeAllSignals, formatEnergy } from '../utils/SignalAnalysis.ts';
import { AnalysisResult } from '../types';
import { Zap, Play } from 'lucide-react';

export const EnergyClassification: React.FC = () => {
    const [method, setMethod] = useState<'trapeze' | 'simpson'>('trapeze');
    const [results, setResults] = useState<AnalysisResult[]>([]);
    const [loading, setLoading] = useState(false);

    const handleClassify = () => {
        setLoading(true);
        setTimeout(() => {
            const analysisResults = analyzeAllSignals(SIGNALS, method);
            setResults(analysisResults);
            setLoading(false);
        }, 100);
    };

    const energyStats = results.length > 0 ? {
        minEnergy: Math.min(...results.filter(r => isFinite(r.energy)).map(r => r.energy)),
        maxEnergy: Math.max(...results.filter(r => isFinite(r.energy)).map(r => r.energy)),
        energyCount: results.filter(r => !r.classification.includes('puissance')).length,
        powerCount: results.filter(r => r.classification.includes('puissance')).length,
    } : null;

    return (
        <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Zap className="mr-2 text-yellow-500" /> Méthode d'Intégration
                </h3>

                <div className="flex gap-6 mb-6">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            value="trapeze"
                            checked={method === 'trapeze'}
                            onChange={(e) => setMethod(e.target.value as 'trapeze')}
                            className="w-4 h-4"
                        />
                        <span className="ml-2 text-gray-700">Méthode des Trapèzes</span>
                    </label>

                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            value="simpson"
                            checked={method === 'simpson'}
                            onChange={(e) => setMethod(e.target.value as 'simpson')}
                            className="w-4 h-4"
                        />
                        <span className="ml-2 text-gray-700">Méthode de Simpson</span>
                    </label>
                </div>

                <button
                    onClick={handleClassify}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
                >
                    <Play size={18} />
                    {loading ? 'Classification en cours...' : 'Classifier les Signaux'}
                </button>
            </div>

            {energyStats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                        <p className="text-sm text-green-600 font-medium">Signaux d'Énergie</p>
                        <p className="text-2xl font-bold text-green-700">{energyStats.energyCount}</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-600 font-medium">Signaux de Puissance</p>
                        <p className="text-2xl font-bold text-blue-700">{energyStats.powerCount}</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                        <p className="text-sm text-purple-600 font-medium">Min Énergie</p>
                        <p className="text-xl font-bold text-purple-700">{formatEnergy(energyStats.minEnergy)}</p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
                        <p className="text-sm text-orange-600 font-medium">Max Énergie</p>
                        <p className="text-xl font-bold text-orange-700">{formatEnergy(energyStats.maxEnergy)}</p>
                    </div>
                </div>
            )}

            {results.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Signal</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Énergie (J)</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Classification</th>
                            </tr>
                            </thead>
                            <tbody>
                            {results.map((result, idx) => (
                                <tr
                                    key={idx}
                                    className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition`}
                                >
                                    <td className="px-4 py-3 font-medium text-gray-900">{result.signalName}</td>
                                    <td className="px-4 py-3 font-mono text-gray-700">{formatEnergy(result.energy)}</td>
                                    <td className="px-4 py-3">
                      <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              result.classification.includes('puissance')
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                          }`}
                      >
                        {result.classification}
                      </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
