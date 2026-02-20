import React, { useState } from 'react';
import { SignalPlot } from './SignalPlot';
import { EnergyClassification } from './EnergyClassification';
import { PowerCalculation } from './PowerCalculation';

type TabType = 'plot' | 'energy' | 'power';

export const SignalAnalysis: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('plot');

    const tabs = [
        { id: 'plot', label: 'Visualisation des Signaux', icon: '📊' },
        { id: 'energy', label: 'Classification Énergétique', icon: '⚡' },
        { id: 'power', label: 'Calcul de Puissance', icon: '🔋' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-8 text-white">
                <h1 className="text-4xl font-bold mb-3">
                    Signaux et Analyse Énergétique
                </h1>
                <p className="text-blue-50 text-lg">
                    Analyse des signaux mathématiques et classification énergétique
                </p>
            </div>

            <div className="flex gap-3 bg-white p-2 rounded-xl shadow-md border border-gray-200">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`flex-1 px-6 py-4 font-semibold text-sm transition-all duration-300 rounded-lg ${
                            activeTab === tab.id
                                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-105'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                        <span className="mr-2 text-lg">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg">
                {activeTab === 'plot' && <SignalPlot />}
                {activeTab === 'energy' && <EnergyClassification />}
                {activeTab === 'power' && <PowerCalculation />}
            </div>
        </div>
    );
};
