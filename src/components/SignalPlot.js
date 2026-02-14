import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { SIGNALS } from '../signals';
import { linspace } from '../utils/signalAnalysis';
import { ArrowRight } from 'lucide-react';
export const SignalPlot = () => {
    const [selectedSignal, setSelectedSignal] = useState(Object.keys(SIGNALS)[0]);
    const [tStart, setTStart] = useState(-5);
    const [tEnd, setTEnd] = useState(5);
    const signal = SIGNALS[selectedSignal];
    const t = linspace(tStart, tEnd, 500);
    const values = signal.func(t);
    const validPoints = t.map((ti, i) => ({ t: ti, v: values[i] }))
        .filter(p => isFinite(p.v));
    const minValue = Math.min(...validPoints.map(p => p.v));
    const maxValue = Math.max(...validPoints.map(p => p.v));
    const padding = (maxValue - minValue) * 0.1 || 0.5;
    const yMin = minValue - padding;
    const yMax = maxValue + padding;
    const yRange = yMax - yMin;
    const WIDTH = 600;
    const HEIGHT = 400;
    const MARGIN = { top: 40, right: 40, bottom: 60, left: 60 };
    const plotWidth = WIDTH - MARGIN.left - MARGIN.right;
    const plotHeight = HEIGHT - MARGIN.top - MARGIN.bottom;
    const scaleX = (value) => {
        return MARGIN.left + ((value - tStart) / (tEnd - tStart)) * plotWidth;
    };
    const scaleY = (value) => {
        return MARGIN.top + plotHeight - ((value - yMin) / yRange) * plotHeight;
    };
    const pathData = validPoints.map((p, i) => {
        const x = scaleX(p.t);
        const y = scaleY(p.v);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    const zeroLineY = scaleY(0);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Signal" }), _jsx("select", { value: selectedSignal, onChange: (e) => setSelectedSignal(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: Object.keys(SIGNALS).map(name => (_jsx("option", { value: name, children: name }, name))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "t_start" }), _jsx("input", { type: "number", value: tStart, onChange: (e) => setTStart(parseFloat(e.target.value)), step: 0.5, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "t_end" }), _jsx("input", { type: "number", value: tEnd, onChange: (e) => setTEnd(parseFloat(e.target.value)), step: 0.5, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] }), _jsx("div", { className: "flex items-end", children: _jsxs("button", { className: "w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition", children: [_jsx(ArrowRight, { className: "inline mr-2", size: 18 }), " Plot"] }) })] }), _jsx("div", { className: "bg-blue-50 p-3 rounded-lg border border-blue-200", children: _jsxs("p", { className: "text-sm text-gray-700", children: [_jsx("span", { className: "font-semibold", children: "Formula:" }), " ", selectedSignal, " = ", signal.formula] }) }), _jsx("div", { className: "bg-white border border-gray-200 rounded-lg p-4 overflow-x-auto", children: _jsxs("svg", { width: WIDTH, height: HEIGHT, className: "mx-auto", children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "gridGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "0%", stopColor: "#f0f9ff" }), _jsx("stop", { offset: "100%", stopColor: "#ffffff" })] }) }), _jsx("rect", { width: WIDTH, height: HEIGHT, fill: "url(#gridGradient)" }), _jsx("line", { x1: MARGIN.left, y1: MARGIN.top, x2: MARGIN.left, y2: HEIGHT - MARGIN.bottom, stroke: "#333", strokeWidth: 2 }), _jsx("line", { x1: MARGIN.left, y1: HEIGHT - MARGIN.bottom, x2: WIDTH - MARGIN.right, y2: HEIGHT - MARGIN.bottom, stroke: "#333", strokeWidth: 2 }), validPoints.length > 0 && zeroLineY >= MARGIN.top && zeroLineY <= HEIGHT - MARGIN.bottom && (_jsx("line", { x1: MARGIN.left, y1: zeroLineY, x2: WIDTH - MARGIN.right, y2: zeroLineY, stroke: "#cbd5e1", strokeWidth: 1, strokeDasharray: "5,5" })), pathData && (_jsx("path", { d: pathData, fill: "none", stroke: "#0284c7", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" })), Array.from({ length: 5 }).map((_, i) => {
                    const y = yMin + (i / 4) * yRange;
                    const yPixel = scaleY(y);
                    return (_jsxs("g", { children: [_jsx("line", { x1: MARGIN.left - 5, y1: yPixel, x2: MARGIN.left, y2: yPixel, stroke: "#333", strokeWidth: 1 }), _jsx("text", { x: MARGIN.left - 10, y: yPixel + 4, textAnchor: "end", fontSize: 12, fill: "#666", children: y.toFixed(1) })] }, `y-${i}`));
                }), Array.from({ length: 5 }).map((_, i) => {
                    const t_val = tStart + (i / 4) * (tEnd - tStart);
                    const xPixel = scaleX(t_val);
                    return (_jsxs("g", { children: [_jsx("line", { x1: xPixel, y1: HEIGHT - MARGIN.bottom, x2: xPixel, y2: HEIGHT - MARGIN.bottom + 5, stroke: "#333", strokeWidth: 1 }), _jsx("text", { x: xPixel, y: HEIGHT - MARGIN.bottom + 20, textAnchor: "middle", fontSize: 12, fill: "#666", children: t_val.toFixed(1) })] }, `x-${i}`));
                }), _jsx("text", { x: WIDTH / 2, y: HEIGHT - 10, textAnchor: "middle", fontSize: 14, fill: "#333", fontWeight: "bold", children: "Time (t)" }), _jsx("text", { x: 20, y: HEIGHT / 2, textAnchor: "middle", fontSize: 14, fill: "#333", fontWeight: "bold", transform: `rotate(-90 20 ${HEIGHT / 2})`, children: "Amplitude" })] }) })] }));
};
