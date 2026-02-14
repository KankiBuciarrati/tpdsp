export const trapezoidalIntegration = (y, t) => {
    let sum = 0;
    for (let i = 0; i < y.length - 1; i++) {
        const dx = t[i + 1] - t[i];
        sum += (y[i] + y[i + 1]) / 2 * dx;
    }
    return sum;
};
export const simpsonsIntegration = (y, t) => {
    if (y.length < 2)
        return 0;
    let sum = 0;
    for (let i = 0; i < y.length - 2; i += 2) {
        const dx = (t[i + 2] - t[i]) / 2;
        sum += (dx / 3) * (y[i] + 4 * y[i + 1] + y[i + 2]);
    }
    if ((y.length - 1) % 2 === 1) {
        const i = y.length - 2;
        const dx = t[i + 1] - t[i];
        sum += (dx / 2) * (y[i] + y[i + 1]);
    }
    return sum;
};
export const calculateEnergyTrapeze = (signalFunc, tStart = -10, tEnd = 10, numPoints = 10000) => {
    const t = linspace(tStart, tEnd, numPoints);
    const signalValues = signalFunc(t);
    const energyDensity = signalValues.map(v => v * v);
    if (energyDensity.some(e => !isFinite(e))) {
        return Infinity;
    }
    return trapezoidalIntegration(energyDensity, t);
};
export const calculateEnergySimpson = (signalFunc, tStart = -10, tEnd = 10, numPoints = 10001) => {
    let points = numPoints;
    if (points % 2 === 0)
        points += 1;
    const t = linspace(tStart, tEnd, points);
    const signalValues = signalFunc(t);
    const energyDensity = signalValues.map(v => v * v);
    if (energyDensity.some(e => !isFinite(e))) {
        return Infinity;
    }
    return simpsonsIntegration(energyDensity, t);
};
export const calculateAveragePower = (signalFunc, tStart = -10, tEnd = 10, numPoints = 10000) => {
    const T = tEnd - tStart;
    if (T <= 0)
        return NaN;
    const energy = calculateEnergyTrapeze(signalFunc, tStart, tEnd, numPoints);
    if (!isFinite(energy)) {
        return energy;
    }
    return energy / T;
};
export const classifySignal = (energy, thresholdFinite = 1e10) => {
    if (!isFinite(energy)) {
        if (energy === Infinity) {
            return 'Signal de puissance (Power signal)';
        }
        return 'Erreur de calcul';
    }
    else if (energy > thresholdFinite) {
        return 'Signal de puissance (Power signal)';
    }
    else {
        return "Signal d'énergie (Energy signal)";
    }
};
export const analyzeAllSignals = (signalsDict, method = 'trapeze', tStart = -10, tEnd = 10) => {
    const results = [];
    for (const [signalName, signalInfo] of Object.entries(signalsDict)) {
        const signalFunc = signalInfo.func;
        try {
            const energy = method === 'trapeze'
                ? calculateEnergyTrapeze(signalFunc, tStart, tEnd)
                : calculateEnergySimpson(signalFunc, tStart, tEnd);
            const classification = classifySignal(energy);
            results.push({
                signalName,
                energy,
                classification,
            });
        }
        catch (e) {
            results.push({
                signalName,
                energy: NaN,
                classification: `Erreur: ${String(e)}`,
            });
        }
    }
    results.sort((a, b) => {
        if (!isFinite(a.energy) && !isFinite(b.energy))
            return 0;
        if (!isFinite(a.energy))
            return 1;
        if (!isFinite(b.energy))
            return -1;
        return a.energy - b.energy;
    });
    return results;
};
export const linspace = (start, end, num) => {
    const result = [];
    const step = (end - start) / (num - 1);
    for (let i = 0; i < num; i++) {
        result.push(start + step * i);
    }
    return result;
};
export const formatEnergy = (energy) => {
    if (!isFinite(energy)) {
        return '∞';
    }
    if (energy === 0) {
        return '0';
    }
    return energy.toExponential(2);
};
