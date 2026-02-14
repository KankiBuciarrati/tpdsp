import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { SIGNALS } from '../signals';
import { analyzeAllSignals, formatEnergy } from '../utils/signalAnalysis';
import { Zap, Play } from 'lucide-react';
export const EnergyClassification = () => {
    const [method, setMethod] = useState('trapeze');
    const [results, setResults] = useState([]);
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
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-6", children: [_jsxs("h3", { className: "text-lg font-semibold mb-4 flex items-center", children: [_jsx(Zap, { className: "mr-2 text-yellow-500" }), " M\u00E9thode d'Int\u00E9gration"] }), _jsxs("div", { className: "flex gap-6 mb-6", children: [_jsxs("label", { className: "flex items-center cursor-pointer", children: [_jsx("input", { type: "radio", value: "trapeze", checked: method === 'trapeze', onChange: (e) => setMethod(e.target.value), className: "w-4 h-4" }), _jsx("span", { className: "ml-2 text-gray-700", children: "M\u00E9thode des Trap\u00E8zes" })] }), _jsxs("label", { className: "flex items-center cursor-pointer", children: [_jsx("input", { type: "radio", value: "simpson", checked: method === 'simpson', onChange: (e) => setMethod(e.target.value), className: "w-4 h-4" }), _jsx("span", { className: "ml-2 text-gray-700", children: "M\u00E9thode de Simpson" })] })] }), _jsxs("button", { onClick: handleClassify, disabled: loading, className: "flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition", children: [_jsx(Play, { size: 18 }), loading ? 'Classification en cours...' : 'Classifier les Signaux'] })] }), energyStats && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4", children: [_jsx("p", { className: "text-sm text-green-600 font-medium", children: "Signaux d'\u00C9nergie" }), _jsx("p", { className: "text-2xl font-bold text-green-700", children: energyStats.energyCount })] }), _jsxs("div", { className: "bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4", children: [_jsx("p", { className: "text-sm text-blue-600 font-medium", children: "Signaux de Puissance" }), _jsx("p", { className: "text-2xl font-bold text-blue-700", children: energyStats.powerCount })] }), _jsxs("div", { className: "bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4", children: [_jsx("p", { className: "text-sm text-purple-600 font-medium", children: "Min \u00C9nergie" }), _jsx("p", { className: "text-xl font-bold text-purple-700", children: formatEnergy(energyStats.minEnergy) })] }), _jsxs("div", { className: "bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4", children: [_jsx("p", { className: "text-sm text-orange-600 font-medium", children: "Max \u00C9nergie" }), _jsx("p", { className: "text-xl font-bold text-orange-700", children: formatEnergy(energyStats.maxEnergy) })] })] })), results.length > 0 && (_jsx("div", { className: "bg-white border border-gray-200 rounded-lg overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-200", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 text-left font-semibold text-gray-700", children: "Signal" }), _jsx("th", { className: "px-4 py-3 text-left font-semibold text-gray-700", children: "\u00C9nergie (J)" }), _jsx("th", { className: "px-4 py-3 text-left font-semibold text-gray-700", children: "Classification" })] }) }), _jsx("tbody", { children: results.map((result, idx) => (_jsxs("tr", { className: `border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition`, children: [_jsx("td", { className: "px-4 py-3 font-medium text-gray-900", children: result.signalName }), _jsx("td", { className: "px-4 py-3 font-mono text-gray-700", children: formatEnergy(result.energy) }), _jsx("td", { className: "px-4 py-3", children: _jsx("span", { className: `px-3 py-1 rounded-full text-xs font-semibold ${result.classification.includes('puissance')
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-green-100 text-green-800'}`, children: result.classification }) })] }, idx))) })] }) }) }))] }));
};
