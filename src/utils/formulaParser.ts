/**
 * Parser de formules mathématiques pour signaux
 * Supporte: rect, tri, u (step), delta, sin, cos, exp, sqrt, abs, log
 * Opérateurs: +, -, *, /, ^, ()
 * Constantes: pi, e
 */

// Fonctions de base
const rect = (t: number): number => {
    return Math.abs(t) < 0.5 ? 1 : 0;
};

const tri = (t: number): number => {
    return Math.abs(t) < 1 ? 1 - Math.abs(t) : 0;
};

const u = (t: number): number => {
    return t >= 0 ? 1 : 0;
};

const delta = (t: number): number => {
    // Approximation du delta de Dirac
    const epsilon = 0.01;
    return (1 / (epsilon * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * (t / epsilon) ** 2);
};

const ramp = (t: number): number => {
    return t > 0 ? t : 0;
};

// Contexte d'évaluation avec toutes les fonctions disponibles
const mathContext: Record<string, any> = {
    // Fonctions de signal
    rect,
    tri,
    u,
    delta,
    ramp,

    // Fonctions mathématiques standard
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    exp: Math.exp,
    log: Math.log,
    ln: Math.log,
    sqrt: Math.sqrt,
    abs: Math.abs,

    // Constantes
    pi: Math.PI,
    e: Math.E,
};

/**
 * Préprocesse la formule pour la rendre évaluable
 */
function preprocessFormula(formula: string): string {
    let processed = formula
        .replace(/\s+/g, '') // Enlever espaces
        .replace(/π/g, 'pi') // Remplacer π par pi
        .replace(/×/g, '*') // Remplacer × par *
        .replace(/÷/g, '/') // Remplacer ÷ par /
        .replace(/\^/g, '**') // Remplacer ^ par **
        .replace(/(\d+)([a-zA-Z(])/g, '$1*$2') // 2sin -> 2*sin, 3t -> 3*t
        .replace(/\)(\d+)/g, ')*$1') // )2 -> )*2
        .replace(/\)\(/g, ')*('); // )( -> )*(

    return processed;
}

/**
 * Évalue une formule pour une valeur de t donnée
 */
function evaluateForT(formula: string, tValue: number): number {
    try {
        const processed = preprocessFormula(formula);

        // Créer une fonction avec le contexte mathématique
        const funcBody = `
            with (context) {
                const t = ${tValue};
                return ${processed};
            }
        `;

        const func = new Function('context', funcBody);
        const result = func(mathContext);

        return isFinite(result) ? result : 0;
    } catch (error) {
        console.error('Erreur d\'évaluation:', error);
        return 0;
    }
}

/**
 * Crée une fonction signal à partir d'une formule
 */
export function parseFormula(formula: string): (t: number[]) => number[] {
    return (t: number[]) => {
        return t.map(ti => evaluateForT(formula, ti));
    };
}

/**
 * Valide une formule
 */
export function validateFormula(formula: string): { valid: boolean; error?: string } {
    try {
        const testT = [0, 1, -1];
        const func = parseFormula(formula);
        func(testT);
        return { valid: true };
    } catch (error) {
        return {
            valid: false,
            error: error instanceof Error ? error.message : 'Formule invalide'
        };
    }
}

/**
 * Liste des fonctions disponibles pour l'aide
 */
export const availableFunctions = {
    signals: [
        { name: 'rect(t)', description: 'Fonction rectangle (1 si |t|<0.5, 0 sinon)' },
        { name: 'tri(t)', description: 'Fonction triangle (1-|t| si |t|<1, 0 sinon)' },
        { name: 'u(t)', description: 'Fonction échelon (1 si t≥0, 0 sinon)' },
        { name: 'delta(t)', description: 'Impulsion de Dirac (approximation)' },
        { name: 'ramp(t)', description: 'Fonction rampe (t si t>0, 0 sinon)' },
    ],
    math: [
        { name: 'sin(x), cos(x), tan(x)', description: 'Fonctions trigonométriques' },
        { name: 'exp(x), log(x), sqrt(x)', description: 'Fonctions exponentielles et logarithmes' },
        { name: 'abs(x)', description: 'Valeur absolue' },
    ],
    constants: [
        { name: 'pi', description: 'π ≈ 3.14159' },
        { name: 'e', description: 'e ≈ 2.71828' },
    ],
    operators: [
        { name: '+, -, *, /', description: 'Opérateurs arithmétiques' },
        { name: '^', description: 'Puissance (ex: t^2)' },
        { name: '()', description: 'Parenthèses' },
    ],
};

/**
 * Exemples de formules
 */
export const formulaExamples = [
    '2*rect(2*t-1)',
    'sin(pi*t)*rect(t/2)',
    'tri(2*t)',
    'u(t-2)',
    'exp(-t)*u(t)',
    '2*sin(3*t) + cos(t)',
    'rect(t)*tri(t/2)',
    'abs(sin(2*pi*t))',
];