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
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Signaux et Analyse Énergétique
                </h1>
                <p className="text-gray-600">
                    Analyse des signaux mathématiques et classification énergétique
                </p>
            </div>

            <div className="flex gap-2 border-b border-gray-200">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`px-4 py-3 font-medium text-sm transition-colors ${
                            activeTab === tab.id
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
                {activeTab === 'plot' && <SignalPlot />}
                {activeTab === 'energy' && <EnergyClassification />}
                {activeTab === 'power' && <PowerCalculation />}
            </div>
        </div>
    );
};
