import React, { useState, useEffect } from 'react';
import { parseFormula, validateFormula, availableFunctions, formulaExamples } from '../utils/formulaParser';
import { linspace } from '../utils/signalAnalysis';
import { ArrowRight, AlertCircle, Info, Zap, Calculator } from 'lucide-react';

export const CustomSignal: React.FC = () => {
    const [formula, setFormula] = useState('2*rect(2*t-1)');
    const [tStart, setTStart] = useState(-5);
    const [tEnd, setTEnd] = useState(5);
    const [error, setError] = useState<string | null>(null);
    const [showHelp, setShowHelp] = useState(false);

    // État pour le signal calculé
    const [signalData, setSignalData] = useState<{ t: number[], values: number[] } | null>(null);
    const [energy, setEnergy] = useState<number | null>(null);
    const [classification, setClassification] = useState<string>('');

    const calculateSignal = () => {
        const validation = validateFormula(formula);

        if (!validation.valid) {
            setError(validation.error || 'Formule invalide');
            setSignalData(null);
            return;
        }

        setError(null);

        try {
            const t = linspace(tStart, tEnd, 500);
            const signalFunc = parseFormula(formula);
            const values = signalFunc(t);

            setSignalData({ t, values });

            // Calculer l'énergie
            const dt = (tEnd - tStart) / 500;
            const calculatedEnergy = values.reduce((sum, val) => sum + val * val * dt, 0);
            setEnergy(calculatedEnergy);

            // Classifier le signal
            classifySignal(calculatedEnergy, values, dt);
        } catch (err) {
            setError('Erreur lors du calcul du signal');
            setSignalData(null);
        }
    };

    const classifySignal = (energyValue: number, values: number[], dt: number) => {
        const threshold = 1e10;

        if (energyValue < threshold && isFinite(energyValue)) {
            setClassification('Signal à énergie finie');
        } else {
            // Calculer la puissance moyenne
            const avgPower = energyValue / (tEnd - tStart);

            if (avgPower < threshold && isFinite(avgPower)) {
                setClassification('Signal à puissance moyenne finie');
            } else {
                setClassification('Signal à puissance infinie');
            }
        }
    };

    // Calcul automatique au changement de formule ou intervalle
    useEffect(() => {
        const timer = setTimeout(() => {
            calculateSignal();
        }, 500);
        return () => clearTimeout(timer);
    }, [formula, tStart, tEnd]);

    // Fonction de rendu du graphique
    const renderPlot = () => {
        if (!signalData) return null;

        const { t, values } = signalData;
        const validPoints = t.map((ti, i) => ({ t: ti, v: values[i] }))
            .filter(p => isFinite(p.v));

        if (validPoints.length === 0) return null;

        const minValue = Math.min(...validPoints.map(p => p.v));
        const maxValue = Math.max(...validPoints.map(p => p.v));
        const padding = (maxValue - minValue) * 0.1 || 0.5;

        const yMin = minValue - padding;
        const yMax = maxValue + padding;
        const yRange = yMax - yMin;

        const WIDTH = 700;
        const HEIGHT = 450;
        const MARGIN = { top: 40, right: 40, bottom: 60, left: 60 };
        const plotWidth = WIDTH - MARGIN.left - MARGIN.right;
        const plotHeight = HEIGHT - MARGIN.top - MARGIN.bottom;

        const scaleX = (value: number) => {
            return MARGIN.left + ((value - tStart) / (tEnd - tStart)) * plotWidth;
        };

        const scaleY = (value: number) => {
            return MARGIN.top + plotHeight - ((value - yMin) / yRange) * plotHeight;
        };

        const pathData = validPoints.map((p, i) => {
            const x = scaleX(p.t);
            const y = scaleY(p.v);
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');

        const zeroLineY = scaleY(0);

        return (
            <svg width={WIDTH} height={HEIGHT} className="mx-auto">
                <defs>
                    <linearGradient id="customGridGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f0fdf4" />
                        <stop offset="100%" stopColor="#ffffff" />
                    </linearGradient>
                </defs>

                <rect width={WIDTH} height={HEIGHT} fill="url(#customGridGradient)" />

                {/* Axes */}
                <line
                    x1={MARGIN.left}
                    y1={MARGIN.top}
                    x2={MARGIN.left}
                    y2={HEIGHT - MARGIN.bottom}
                    stroke="#333"
                    strokeWidth={2}
                />
                <line
                    x1={MARGIN.left}
                    y1={HEIGHT - MARGIN.bottom}
                    x2={WIDTH - MARGIN.right}
                    y2={HEIGHT - MARGIN.bottom}
                    stroke="#333"
                    strokeWidth={2}
                />

                {/* Ligne y=0 */}
                {zeroLineY >= MARGIN.top && zeroLineY <= HEIGHT - MARGIN.bottom && (
                    <line
                        x1={MARGIN.left}
                        y1={zeroLineY}
                        x2={WIDTH - MARGIN.right}
                        y2={zeroLineY}
                        stroke="#cbd5e1"
                        strokeWidth={1}
                        strokeDasharray="5,5"
                    />
                )}

                {/* Signal */}
                {pathData && (
                    <path
                        d={pathData}
                        fill="none"
                        stroke="#16a34a"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                )}

                {/* Graduations Y */}
                {Array.from({ length: 5 }).map((_, i) => {
                    const y = yMin + (i / 4) * yRange;
                    const yPixel = scaleY(y);
                    return (
                        <g key={`y-${i}`}>
                            <line
                                x1={MARGIN.left - 5}
                                y1={yPixel}
                                x2={MARGIN.left}
                                y2={yPixel}
                                stroke="#333"
                                strokeWidth={1}
                            />
                            <text
                                x={MARGIN.left - 10}
                                y={yPixel + 4}
                                textAnchor="end"
                                fontSize={12}
                                fill="#666"
                            >
                                {y.toFixed(2)}
                            </text>
                        </g>
                    );
                })}

                {/* Graduations X */}
                {Array.from({ length: 5 }).map((_, i) => {
                    const t_val = tStart + (i / 4) * (tEnd - tStart);
                    const xPixel = scaleX(t_val);
                    return (
                        <g key={`x-${i}`}>
                            <line
                                x1={xPixel}
                                y1={HEIGHT - MARGIN.bottom}
                                x2={xPixel}
                                y2={HEIGHT - MARGIN.bottom + 5}
                                stroke="#333"
                                strokeWidth={1}
                            />
                            <text
                                x={xPixel}
                                y={HEIGHT - MARGIN.bottom + 20}
                                textAnchor="middle"
                                fontSize={12}
                                fill="#666"
                            >
                                {t_val.toFixed(1)}
                            </text>
                        </g>
                    );
                })}

                {/* Labels */}
                <text x={WIDTH / 2} y={HEIGHT - 10} textAnchor="middle" fontSize={14} fill="#333" fontWeight="bold">
                    Time (t)
                </text>
                <text x={20} y={HEIGHT / 2} textAnchor="middle" fontSize={14} fill="#333" fontWeight="bold" transform={`rotate(-90 20 ${HEIGHT / 2})`}>
                    Amplitude
                </text>
            </svg>
        );
    };

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-2">Signal Personnalisé</h2>
                <p className="text-green-50">Créez et analysez vos propres signaux avec des formules mathématiques</p>
            </div>

            {/* Champ de formule */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">Formule du signal x(t)</label>
                            <button
                                onClick={() => setShowHelp(!showHelp)}
                                className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                            >
                                <Info size={16} />
                                {showHelp ? 'Masquer l\'aide' : 'Aide'}
                            </button>
                        </div>
                        <input
                            type="text"
                            value={formula}
                            onChange={(e) => setFormula(e.target.value)}
                            placeholder="Ex: 2*sin(pi*t)*rect(t/2)"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-lg"
                        />
                        {error && (
                            <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Aide */}
                    {showHelp && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-3">
                            <div>
                                <h4 className="font-semibold text-blue-900 mb-2">Fonctions de signal disponibles:</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                    {availableFunctions.signals.map((func, i) => (
                                        <div key={i} className="text-gray-700">
                                            <code className="bg-white px-2 py-1 rounded text-blue-700">{func.name}</code>
                                            <span className="text-xs ml-2">{func.description}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-blue-900 mb-2">Fonctions mathématiques:</h4>
                                <div className="text-sm text-gray-700">
                                    {availableFunctions.math.map((func, i) => (
                                        <div key={i}>
                                            <code className="bg-white px-2 py-1 rounded text-blue-700">{func.name}</code>
                                            <span className="text-xs ml-2">{func.description}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-blue-900 mb-2">Exemples:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {formulaExamples.map((example, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setFormula(example)}
                                            className="bg-white px-3 py-1 rounded border border-blue-300 hover:bg-blue-100 text-sm font-mono text-blue-700"
                                        >
                                            {example}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Paramètres d'intervalle */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">t_start</label>
                            <input
                                type="number"
                                value={tStart}
                                onChange={(e) => setTStart(parseFloat(e.target.value))}
                                step={0.5}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">t_end</label>
                            <input
                                type="number"
                                value={tEnd}
                                onChange={(e) => setTEnd(parseFloat(e.target.value))}
                                step={0.5}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={calculateSignal}
                                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                            >
                                <ArrowRight size={18} />
                                Calculer
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Résultats: Énergie et Classification */}
            {signalData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg border-2 border-yellow-200 shadow-md">
                        <div className="flex items-center gap-3 mb-2">
                            <Zap className="text-yellow-600" size={24} />
                            <h3 className="text-lg font-bold text-gray-800">Énergie</h3>
                        </div>
                        <p className="text-3xl font-bold text-yellow-700">
                            {energy !== null ? energy.toExponential(4) : 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">E = ∫|x(t)|² dt</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border-2 border-purple-200 shadow-md">
                        <div className="flex items-center gap-3 mb-2">
                            <Calculator className="text-purple-600" size={24} />
                            <h3 className="text-lg font-bold text-gray-800">Classification</h3>
                        </div>
                        <p className="text-xl font-semibold text-purple-700">
                            {classification}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">Type de signal</p>
                    </div>
                </div>
            )}

            {/* Graphique */}
            {signalData && (
                <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Graphique: x(t) = {formula}
                    </h3>
                    <div className="overflow-x-auto">
                        {renderPlot()}
                    </div>
                </div>
            )}
        </div>
    );
};