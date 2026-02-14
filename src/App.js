import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { SignalPlot } from './components/SignalPlot';
import { EnergyClassification } from './components/EnergyClassification';
import { PowerCalculation } from './components/PowerCalculation';
import { BarChart3, Zap, Gauge } from 'lucide-react';
export const App = () => {
    const [activeTab, setActiveTab] = useState(0);
    const tabs = [
        {
            label: 'Visualisation',
            icon: BarChart3,
            component: SignalPlot,
        },
        {
            label: 'Classification',
            icon: Zap,
            component: EnergyClassification,
        },
        {
            label: 'Puissance',
            icon: Gauge,
            component: PowerCalculation,
        },
    ];
    const ActiveComponent = tabs[activeTab].component;
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900", children: _jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50/50 to-slate-50/50", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 py-8", children: [_jsxs("header", { className: "mb-8", children: [_jsx("h1", { className: "text-4xl font-bold text-gray-900 mb-2", children: "\uD83D\uDCCA Analyseur de Signaux" }), _jsx("p", { className: "text-gray-600", children: "Visualisez, classifiez et analysez les signaux math\u00E9matiques" })] }), _jsx("nav", { className: "flex gap-2 mb-8 overflow-x-auto", children: tabs.map((tab, idx) => {
                        const Icon = tab.icon;
                        const isActive = idx === activeTab;
                        return (_jsxs("button", { onClick: () => setActiveTab(idx), className: `flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition whitespace-nowrap ${isActive
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`, children: [_jsx(Icon, { size: 20 }), tab.label] }, idx));
                    }) }), _jsx("div", { className: "bg-white rounded-xl shadow-lg border border-gray-200 p-8", children: _jsx(ActiveComponent, {}) }), _jsx("footer", { className: "mt-8 text-center text-sm text-gray-600", children: _jsx("p", { children: "Exercice de Traitement du Signal - Analyse \u00C9nerg\u00E9tique" }) })] }) }) }));
};
export default App;
