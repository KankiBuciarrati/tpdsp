import React, { useState, useRef } from 'react';
import { SIGNALS } from '../signals';
import { linspace } from '../utils/SignalAnalysis.ts';
import { ArrowRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export const SignalPlot: React.FC = () => {
    const [selectedSignal, setSelectedSignal] = useState(Object.keys(SIGNALS)[0]);
    const [tStart, setTStart] = useState(-5);
    const [tEnd, setTEnd] = useState(5);
    const [hoveredPoint, setHoveredPoint] = useState<{ t: number; v: number; x: number; y: number } | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

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

    const scaleX = (value: number) => {
        return MARGIN.left + ((value - tStart) / (tEnd - tStart)) * plotWidth;
    };

    const scaleY = (value: number) => {
        return MARGIN.top + plotHeight - ((value - yMin) / yRange) * plotHeight;
    };

    const unscaleX = (pixel: number) => {
        return tStart + ((pixel - MARGIN.left) / plotWidth) * (tEnd - tStart);
    };

    const unscaleY = (pixel: number) => {
        return yMin + (plotHeight - (pixel - MARGIN.top)) / plotHeight * yRange;
    };

    const pathData = validPoints.map((p, i) => {
        const x = scaleX(p.t);
        const y = scaleY(p.v);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    const zeroLineY = scaleY(0);

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x >= MARGIN.left && x <= WIDTH - MARGIN.right && y >= MARGIN.top && y <= HEIGHT - MARGIN.bottom) {
            const t = unscaleX(x);
            const v = unscaleY(y);
            setHoveredPoint({ t, v, x, y });
        } else {
            setHoveredPoint(null);
        }
    };

    const handleMouseLeave = () => {
        setHoveredPoint(null);
    };

    const zoomIn = () => {
        const center = (tStart + tEnd) / 2;
        const range = (tEnd - tStart) / 2;
        setTStart(center - range / 2);
        setTEnd(center + range / 2);
    };

    const zoomOut = () => {
        const center = (tStart + tEnd) / 2;
        const range = (tEnd - tStart) / 2;
        setTStart(center - range * 2);
        setTEnd(center + range * 2);
    };

    const resetZoom = () => {
        setTStart(-5);
        setTEnd(5);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Signal</label>
                    <select
                        value={selectedSignal}
                        onChange={(e) => setSelectedSignal(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium hover:border-gray-400"
                    >
                        {Object.keys(SIGNALS).map(name => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">t_start</label>
                    <input
                        type="number"
                        value={tStart}
                        onChange={(e) => setTStart(parseFloat(e.target.value))}
                        step={0.5}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">t_end</label>
                    <input
                        type="number"
                        value={tEnd}
                        onChange={(e) => setTEnd(parseFloat(e.target.value))}
                        step={0.5}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400"
                    />
                </div>

                <div className="flex items-end">
                    <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold hover:scale-105 flex items-center justify-center gap-2">
                        <span>Tracer</span>
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border-2 border-blue-200 shadow-sm">
                <p className="text-sm text-gray-700">
                    <span className="font-bold text-blue-700">Formule:</span>
                    <span className="ml-2 font-mono text-base">{selectedSignal} = {signal.formula}</span>
                </p>
            </div>

            <div className="flex gap-2 justify-center mb-4">
                <button
                    onClick={zoomIn}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all hover:scale-105"
                    title="Zoom in"
                >
                    <ZoomIn size={18} />
                    Zoom In
                </button>
                <button
                    onClick={zoomOut}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all hover:scale-105"
                    title="Zoom out"
                >
                    <ZoomOut size={18} />
                    Zoom Out
                </button>
                <button
                    onClick={resetZoom}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all hover:scale-105"
                    title="Reset zoom"
                >
                    <RotateCcw size={18} />
                    Reset
                </button>
            </div>

            <div className="bg-white border-2 border-gray-300 rounded-xl p-4 overflow-x-auto shadow-lg">
                <svg
                    ref={svgRef}
                    width={WIDTH}
                    height={HEIGHT}
                    className="mx-auto cursor-crosshair"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    <defs>
                        <linearGradient id="gridGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f0f9ff" />
                            <stop offset="100%" stopColor="#ffffff" />
                        </linearGradient>
                    </defs>

                    <rect width={WIDTH} height={HEIGHT} fill="url(#gridGradient)" />

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

                    {validPoints.length > 0 && zeroLineY >= MARGIN.top && zeroLineY <= HEIGHT - MARGIN.bottom && (
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

                    {pathData && (
                        <path
                            d={pathData}
                            fill="none"
                            stroke="#0284c7"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    )}

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
                                    {y.toFixed(1)}
                                </text>
                            </g>
                        );
                    })}

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

                    <text x={WIDTH / 2} y={HEIGHT - 10} textAnchor="middle" fontSize={14} fill="#333" fontWeight="bold">
                        Time (t)
                    </text>
                    <text x={20} y={HEIGHT / 2} textAnchor="middle" fontSize={14} fill="#333" fontWeight="bold" transform={`rotate(-90 20 ${HEIGHT / 2})`}>
                        Amplitude
                    </text>

                    {hoveredPoint && (
                        <>
                            <circle
                                cx={hoveredPoint.x}
                                cy={hoveredPoint.y}
                                r={5}
                                fill="#ef4444"
                                opacity={0.8}
                            />
                            <line
                                x1={hoveredPoint.x}
                                y1={MARGIN.top}
                                x2={hoveredPoint.x}
                                y2={HEIGHT - MARGIN.bottom}
                                stroke="#ef4444"
                                strokeWidth={1}
                                strokeDasharray="3,3"
                                opacity={0.5}
                            />
                            <line
                                x1={MARGIN.left}
                                y1={hoveredPoint.y}
                                x2={WIDTH - MARGIN.right}
                                y2={hoveredPoint.y}
                                stroke="#ef4444"
                                strokeWidth={1}
                                strokeDasharray="3,3"
                                opacity={0.5}
                            />
                        </>
                    )}
                </svg>

                {hoveredPoint && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 rounded-xl shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-red-900 mb-3">Coordonnées au curseur</p>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-white/60 backdrop-blur px-4 py-3 rounded-lg border border-red-200">
                                        <p className="text-xs text-red-700 uppercase tracking-widest font-bold">t (time)</p>
                                        <p className="font-mono text-2xl font-bold text-red-900 mt-1">{hoveredPoint.t.toFixed(4)}</p>
                                    </div>
                                    <div className="bg-white/60 backdrop-blur px-4 py-3 rounded-lg border border-red-200">
                                        <p className="text-xs text-red-700 uppercase tracking-widest font-bold">v (amplitude)</p>
                                        <p className="font-mono text-2xl font-bold text-red-900 mt-1">{hoveredPoint.v.toFixed(4)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-red-300 text-4xl">▸</div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-red-200">
                            <p className="text-xs text-red-600">Zoom actif: [{tStart.toFixed(2)}, {tEnd.toFixed(2)}]</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
