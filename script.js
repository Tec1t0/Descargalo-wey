// --- FUNCIONES Y VARIABLES GLOBALES DE LA CALCULADORA PRINCIPAL ---
const form = document.getElementById('bisection-form');
const resultsTableBody = document.getElementById('results-table-body');
const errorMessage = document.getElementById('error-message');
const summaryResult = document.getElementById('summary-result');
const chartCanvas = document.getElementById('function-chart');
let functionChart;

// Referencia al nuevo botón de zoom
const resetZoomButton = document.getElementById('reset-zoom-btn'); 

// Variables y elementos del Desafío (Minijuego)
const challengeGuessForm = document.getElementById('challenge-guess-form');
const guessInput = document.getElementById('guess-input');
// Elementos de la nueva barra de EXP
const levelDisplay = document.getElementById('level-display');
const expBarFill = document.getElementById('exp-bar-fill');
const expBarText = document.getElementById('exp-bar-text');

let currentLevel = 1;
let currentEXP = 0; // EXP en el nivel actual
const EXP_PER_LEVEL = 100; // EXP fija para subir de nivel

/**
 * Actualiza la barra de EXP y el nivel.
 */
function updateExpUI() {
    let requiredExp = EXP_PER_LEVEL;
    
    // Calcular nivel actual
    while (currentEXP >= requiredExp) {
        currentEXP -= requiredExp;
        currentLevel++;
        // Si quieres que el requisito de EXP aumente con el nivel:
        // requiredExp = Math.round(EXP_PER_LEVEL * (1 + (currentLevel - 1) * 0.2)); 
    }

    const percentage = (currentEXP / requiredExp) * 100;

    levelDisplay.textContent = `Nivel: ${currentLevel}`;
    expBarFill.style.width = `${percentage}%`;
    expBarText.textContent = `${currentEXP} / ${requiredExp} EXP`;
}

/**
 * Maneja el manejo de errores.
 * @param {string} message Mensaje de error a mostrar.
 */
function displayError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    // Asegurar que el mensaje de error del desafío se borre
    document.getElementById('challenge-feedback').classList.add('hidden');
}

/**
 * Evalúa una expresión matemática con un valor dado para x.
 * @param {string} expression La expresión matemática (ej: "x^2 - 3").
 * @param {number} x El valor para la variable x.
 * @returns {number} El resultado de la evaluación.
 */
function evaluateFunction(expression, x) {
    try {
        // Compila la expresión una vez para una evaluación más rápida
        const compiled = math.compile(expression);
        // Define el ámbito con el valor de x
        const scope = { x: x };
        return compiled.evaluate(scope);
    } catch (e) {
        // MENSAJE DE ERROR: Función inválida
        throw new Error("Función inválida o malformada. Revisa la sintaxis.");
    }
}

/**
 * Implementa el Método de Bisección usando la fórmula de error de la Cota Superior.
 * @param {string} f_expr La expresión de la función f(x).
 * @param {number} a El límite inferior del intervalo.
 * @param {number} b El límite superior del intervalo.
 * @param {number} max_iterations El número máximo de iteraciones.
 * @returns {Array<Object>} Un array de objetos con los resultados de cada iteración.
 */
function calculateBisection(f_expr, a, b, max_iterations = 15) {
    let results = [];
    let fa, fb;
    
    // Almacenamos el ancho del intervalo inicial para el cálculo de la cota de error
    const a_initial = Math.min(a, b);
    const b_initial = Math.max(a, b);
    const initial_range = b_initial - a_initial;

    try {
        fa = evaluateFunction(f_expr, a);
        fb = evaluateFunction(f_expr, b);
    } catch (e) {
        throw new Error(`Error de sintaxis en la función: ${e.message}`);
    }
    
    if (fa * fb >= 0) {
        throw new Error(`f(a) y f(b) deben tener signos opuestos (Teorema de Bolzano). f(a)=${fa.toFixed(4)}, f(b)=${fb.toFixed(4)}.`);
    }

    let m_previous = null; 
    let current_a = a_initial; // Asegurar a < b
    let current_b = b_initial;
    

    for (let n = 1; n <= max_iterations; n++) {
        const m = (current_a + current_b) / 2;
        let fm;
        try {
            fm = evaluateFunction(f_expr, m);
        } catch (e) {
            throw new Error("Error durante la evaluación de la función. Revisa el punto y la sintaxis.");
        }

        // --- CORRECCIÓN DEL CÁLCULO DEL ERROR: Usando la Cota Absoluta Máxima ---
        // La cota de error porcentual E_n = ((b_0 - a_0) / (2^n)) / (b_0 - a_0) * 100 
        // Simplificado: E_n = (1 / 2^n) * 100
        const displayError = (1 / (2**n)) * 100; 

        // Almacenamos la cota de error
        results.push({ n, a: current_a, b: current_b, m, fm, error: displayError });

        if (fa * fm < 0) {
            current_b = m;
            fb = fm;
        } else if (fm * fb < 0) {
            current_a = m;
            fa = fm;
        } else if (fm === 0) {
            break; 
        }

        m_previous = m; // Mantener por si se cambia la lógica de error más tarde
    }

    return results;
}


/**
 * Muestra los resultados en la tabla.
 */
function displayResults(results) {
    resultsTableBody.innerHTML = '';
    
    const lastResult = results[results.length - 1];
    
    // El 'error' ahora es la Cota de Error Absoluto Máximo Porcentual.
    summaryResult.innerHTML = `
        <p style="font-weight: bold;">Raíz Aproximada (m): <span style="color: var(--primary-color); font-weight: bold;">${lastResult.m.toFixed(8)}</span></p>
        <p>Valor de f(m): ${lastResult.fm.toExponential(4)}</p>
        <p>Cota de Error Máximo Final: ${lastResult.error !== null ? lastResult.error.toFixed(4) + ' %' : 'N/A'}</p>
        <p>Iteraciones realizadas: ${lastResult.n}</p>
    `;

    results.forEach(res => {
        const row = resultsTableBody.insertRow();
        row.classList.add('result-row', 'text-sm'); 
        
        const formatNum = (num, fixed = 6) => {
            // Usar notación científica si el número es muy pequeño o grande (excepto para m)
            if (Math.abs(num) < 0.000001 && num !== 0) {
                return num.toExponential(4);
            }
            return num.toFixed(fixed);
        };

        row.insertCell().textContent = res.n;
        row.insertCell().textContent = formatNum(res.a);
        row.insertCell().textContent = formatNum(res.b);
        // La columna 'm' siempre con alta precisión
        row.insertCell().textContent = res.m.toFixed(8); 
        row.insertCell().textContent = formatNum(res.fm, 4);
        row.insertCell().textContent = res.error !== null ? formatNum(res.error, 4) + ' %' : '---';
    });
}

/**
 * Grafica la función y la convergencia de la raíz (Estilo Geogebra).
 */
function plotFunction(f_expr, a, b, results) {
    if (functionChart) {
        functionChart.destroy();
    }

    // Asegurar el orden correcto de los límites para el gráfico
    const plotStart = Math.min(a, b);
    const plotEnd = Math.max(a, b);
    
    // Extender el rango X ligeramente para mejor visualización
    const rangeExtension = (plotEnd - plotStart) * 0.1;
    const rangeStart = plotStart - rangeExtension;
    const rangeEnd = plotEnd + rangeExtension;
    
    const numPoints = 100;
    const step = (rangeEnd - rangeStart) / numPoints;
    let dataPoints = [];
    let iterationPoints = []; // Puntos de las iteraciones (m, f(m))
    let rootPoints = [];
    let minVal = 0;
    let maxVal = 0;
    const finalRoot = results[results.length - 1].m;

    // 1. Generar puntos de la función y determinar el rango Y
    for (let i = 0; i <= numPoints; i++) {
        const x = rangeStart + i * step;
        let y;
        try {
            y = evaluateFunction(f_expr, x);
            if (!isNaN(y) && isFinite(y) && Math.abs(y) < 1e10) { // Límite para evitar explosiones
                dataPoints.push({ x: x, y: y });
                if (y < minVal) minVal = y;
                if (y > maxVal) maxVal = y;
            }
        } catch (e) {}
    }
    
    // 2. Generar puntos de las iteraciones (m, f(m))
    results.forEach(res => {
        const isFinal = res.n === results.length;
        // Marcar el último punto de convergencia con color distinto
        iterationPoints.push({ x: res.m, y: res.fm, n: res.n, pointStyle: isFinal ? 'triangle' : 'circle' });
        if (res.fm < minVal) minVal = res.fm;
        if (res.fm > maxVal) maxVal = res.fm;
    });

    // 3. Punto final de la raíz
    rootPoints.push({ x: finalRoot, y: 0 });
    
    // Ajustar el rango Y con margen
    const yMargin = (maxVal - minVal) * 0.15;
    let scaleMinY = minVal - yMargin;
    let scaleMaxY = maxVal + yMargin;

    const ctx = chartCanvas.getContext('2d');
    functionChart = new Chart(ctx, {
        type: 'scatter', 
        data: {
            datasets: [
            {
                label: 'Función f(x)',
                data: dataPoints,
                // Color y estilo Geogebra: azul y línea suave
                borderColor: 'rgb(0, 150, 255)', 
                backgroundColor: 'rgba(0, 150, 255, 0.1)',
                borderWidth: 3,
                showLine: true,
                pointRadius: 0,
                tension: 0.3, // Línea más suave
                order: 1 
            },
            {
                label: 'Puntos de Iteración m',
                data: iterationPoints.slice(0, iterationPoints.length - 1), // Todos menos el último
                backgroundColor: 'rgb(255, 165, 0)', // Naranja para pasos intermedios
                borderColor: 'rgb(255, 165, 0)',
                pointRadius: 5,
                pointHoverRadius: 7,
                showLine: false,
                order: 2
            },
            {
                label: 'Última Iteración (m final)',
                data: iterationPoints.slice(-1), // Solo el último
                backgroundColor: 'rgb(92, 184, 92)', // Verde para el punto final
                borderColor: 'rgb(92, 184, 92)',
                pointRadius: 7,
                pointStyle: 'star',
                pointHoverRadius: 9,
                showLine: false,
                order: 3
            },
            {
                label: `Raíz $\\approx$ ${finalRoot.toFixed(6)}`,
                data: rootPoints,
                // Rojo para la Raíz
                backgroundColor: 'rgba(217, 83, 79, 1)', 
                borderColor: 'rgb(217, 83, 79)',
                borderWidth: 2,
                pointRadius: 8, 
                pointHoverRadius: 10,
                pointStyle: 'circle',
                order: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { font: { family: 'Inter', } } },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.dataset.label.includes('Iteración')) {
                                const point = context.dataset.data[context.dataIndex];
                                return [
                                    `Iteración: ${point.n || results.length}`,
                                    `m: ${point.x.toFixed(6)}`,
                                    `f(m): ${point.y.toExponential(4)}`
                                ];
                            }
                            return `${context.parsed.x.toFixed(4)}, ${context.parsed.y.toFixed(4)}`;
                        }
                    }
                },
                // PLUGIN DE ZOOM PARA LA INTERACTIVIDAD TIPO GEOGEBRA
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'xy',
                    },
                    zoom: {
                        wheel: { enabled: true },
                        pinch: { enabled: true },
                        mode: 'xy',
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear', position: 'bottom',
                    title: { display: true, text: 'x', font: { family: 'Inter', size: 14, weight: 'bold' } },
                    grid: { 
                        color: (context) => context.tick.value === 0 ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.05)',
                        lineWidth: (context) => context.tick.value === 0 ? 1.5 : 1,
                    },
                },
                y: {
                    title: { display: true, text: 'f(x)', font: { family: 'Inter', size: 14, weight: 'bold' } },
                    grid: { 
                        // Hacer que la línea en y=0 sea más visible
                        color: (context) => context.tick.value === 0 ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.05)',
                        lineWidth: (context) => context.tick.value === 0 ? 1.5 : 1,
                    },
                    min: scaleMinY,
                    max: scaleMaxY
                }
            }
        }
    });
}

// Agregar el listener al botón de zoom 
resetZoomButton.addEventListener('click', () => {
    if (functionChart) {
        functionChart.resetZoom();
    }
});


// Manejador del evento de envío del formulario
form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorMessage.classList.add('hidden'); 
    
    resultsTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 1rem; color: #aaa;">Calculando...</td></tr>';
    summaryResult.textContent = 'Calculando...';

    const f_expr = document.getElementById('function-input').value.trim();
    const a = parseFloat(document.getElementById('interval-a').value);
    const b = parseFloat(document.getElementById('interval-b').value);
    const max_iterations = parseInt(document.getElementById('iterations').value);
    
    // MENSAJES DE ERROR: Validación de formulario
    if (a === b) { return displayError("El intervalo [a] no puede ser igual al intervalo [b]."); }
    if (max_iterations < 3 || max_iterations > 15 || isNaN(max_iterations)) { return displayError("El número de iteraciones debe ser un entero entre 3 y 15."); }
    if (f_expr === "") { return displayError("Por favor, ingresa una función válida."); }
    
    try {
        const results = calculateBisection(f_expr, a, b, max_iterations);
        displayResults(results);
        plotFunction(f_expr, a, b, results);
    } catch (error) {
        // MENSAJE DE ERROR: Catch general
        displayError(`Error de Cálculo: ${error.message}`);
        resultsTableBody.innerHTML = '';
        summaryResult.textContent = 'Error: No se pudo completar el cálculo.';
        if (functionChart) { functionChart.destroy(); functionChart = null; }
    }
});

// Ejecutar el cálculo inicial al cargar la página con los valores por defecto
window.onload = () => {
    // Establecer la función y el intervalo solicitados por el usuario
    document.getElementById('function-input').value = 'x^2 - 4*x + 1';
    document.getElementById('interval-a').value = 0;
    document.getElementById('interval-b').value = 3;
    document.getElementById('iterations').value = 6; // Usamos 6 iteraciones

    // Disparar el cálculo inicial
    form.dispatchEvent(new Event('submit'));
    updateExpUI(); // Inicializar la barra de EXP
};

// --- LÓGICA DEL MINIJUEGO CON P5.JS ---

// Define un conjunto de desafíos con raíces conocidas en el intervalo
const challenges = [
    // Función: x^2 - 4*x + 1. Raíces: 0.2679 y 3.7321.
    { f: "x^2 - 4*x + 1", a: 0, b: 1, root: 0.267949, tolerance: 0.05, name: "Cuadrática 1" }, 
    { f: "x^3 - 4*x - 9", a: 2, b: 3, root: 2.706530, tolerance: 0.01, name: "Cúbica" }, 
    { f: "x - cos(x)", a: 0.5, b: 1, root: 0.739085, tolerance: 0.02, name: "Trigonométrica" }, 
    { f: "exp(-x) - x", a: 0, b: 1, root: 0.567143, tolerance: 0.03, name: "Exponencial" }, 
];

let currentChallenge = null;
let isSolved = false;
let userGuess = null; // Almacenará el valor de la adivinanza ingresado en el input
const CANVAS_WIDTH = 350;
const CANVAS_HEIGHT = 200;
const PADDING = 20;

// Manejador del envío del formulario de adivinanza
challengeGuessForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (isSolved) return;

    const guess = parseFloat(guessInput.value);
    if (isNaN(guess)) {
        // MENSAJE DE ERROR: Input de número
        displayChallengeFeedback("Por favor, ingresa un valor numérico válido.", 'error');
        return;
    }
    
    // Almacenar el valor exacto ingresado en el input
    userGuess = guess; 
    checkGuess(userGuess);
    p5Instance.redraw(); // Redibujar el gráfico para mostrar la línea de la adivinanza
});

/**
 * Calcula y aplica la recompensa de EXP.
 * @param {number} absoluteError El error absoluto de la adivinanza.
 * @returns {number} Puntos de EXP ganados.
 */
function calculateExpReward(absoluteError) {
    const maxExp = 100;
    const range = currentChallenge.b - currentChallenge.a; // Escala del intervalo
    
    // Normalizar el error: error 0 -> 100%, error = rango -> 0%
    let expFactor = 1 - (absoluteError / range);
    
    // Asegurar que el factor esté entre 0 y 1
    expFactor = Math.max(0, Math.min(1, expFactor));

    let exp = Math.round(maxExp * expFactor);
    
    // EXP mínima para un acierto (si está dentro de la tolerancia)
    if (absoluteError <= currentChallenge.tolerance) {
        exp = Math.max(exp, 50); // Mínimo de 50 EXP por un acierto válido
    }
    
    return exp;
}

/**
 * Muestra el feedback específico del desafío.
 * @param {string} message Mensaje a mostrar.
 * @param {string} type 'success' o 'error'.
 */
function displayChallengeFeedback(message, type) {
    const feedbackDiv = document.getElementById('challenge-feedback');
    feedbackDiv.classList.remove('hidden', 'error', 'success', 'bg-red-100', 'bg-green-100', 'text-red-700', 'text-green-700');
    
    if (type === 'success') {
        feedbackDiv.classList.add('bg-green-100', 'text-green-700');
    } else {
        feedbackDiv.classList.add('bg-red-100', 'text-red-700');
    }
    feedbackDiv.innerHTML = message;
}

/**
 * Verifica si la adivinanza es correcta y actualiza la EXP.
 * @param {number} guess La estimación del usuario.
 */
function checkGuess(guess) {
    const actualRoot = currentChallenge.root;
    const tolerance = currentChallenge.tolerance;
    const absoluteError = Math.abs(guess - actualRoot); 
    
    isSolved = true;
    
    document.getElementById('check-guess-btn').disabled = true; // Deshabilitar después del intento
    guessInput.disabled = true;

    if (absoluteError <= tolerance) {
        const expGained = calculateExpReward(absoluteError);
        currentEXP += expGained; // Sumar EXP al nivel actual
        updateExpUI();
        
        // MENSAJE DE ÉXITO. Muestra el valor exacto de la adivinanza
        displayChallengeFeedback(
            `¡Éxito! Tu estimación <strong class="font-bold">${guess.toFixed(6)}</strong> está dentro de la tolerancia (${tolerance}). 
             Has ganado <strong style="color: var(--success-color);">${expGained} EXP</strong>.`, 
            'success'
        );
    } else {
        // MENSAJE DE FALLO. Muestra el valor exacto de la adivinanza
        displayChallengeFeedback(
            `Fallaste. Tu estimación <strong class="font-bold">${guess.toFixed(6)}</strong> (Error Absoluto: ${absoluteError.toExponential(2)}). 
             La raíz real era ${actualRoot.toFixed(6)}. Clica 'Nuevo Desafío' para continuar.`, 
            'error'
        );
    }
}


const sketch = function(p) {
    let scaleX;
    let scaleY;

    p.setup = function() {
        // Crear el lienzo dentro del contenedor específico
        const canvas = p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        canvas.parent('p5-canvas-container');
        p.noLoop(); // Solo dibujar cuando es necesario
        document.getElementById('new-challenge-btn').addEventListener('click', startNewChallenge);
        p.startNewChallenge(); // Iniciar el primer desafío
    };

    p.startNewChallenge = function(challenge = null) {
        isSolved = false;
        userGuess = null;
        // Habilitar inputs/botones
        document.getElementById('check-guess-btn').disabled = false;
        guessInput.disabled = false;
        guessInput.value = '';
        
        // Selecciona un desafío aleatorio si no se proporciona uno
        currentChallenge = challenge || challenges[p.floor(p.random(challenges.length))];
        
        // Limpiar feedback
        document.getElementById('challenge-feedback').classList.add('hidden');
        
        // Mostrar información del desafío
        document.getElementById('challenge-func').textContent = currentChallenge.f;
        document.getElementById('challenge-interval').textContent = `[${currentChallenge.a}, ${currentChallenge.b}]`;
        
        p.redraw(); // Forzar el redibujo del nuevo desafío
    };

    p.draw = function() {
        p.background(255);
        if (!currentChallenge) return;

        const { a, b, f } = currentChallenge;
        
        // 1. Configuración de escalas
        const range = b - a;
        
        // Determinar el rango Y y la escala Y
        let yValues = [];
        const step = range / 50;
        let minY = Infinity;
        let maxY = -Infinity;
        
        for (let x = a; x <= b; x += step) {
            try {
                let y = evaluateFunction(f, x);
                if (!isNaN(y) && isFinite(y)) {
                    yValues.push({ x, y });
                    minY = p.min(minY, y);
                    maxY = p.max(maxY, y);
                }
            } catch (e) {}
        }

        // Asegurar que el eje X (y=0) esté incluido
        minY = p.min(minY, 0);
        maxY = p.max(maxY, 0);
        
        const yRange = maxY - minY;
        
        // Ajustar las escalas
        scaleX = (CANVAS_WIDTH - 2 * PADDING) / range;
        scaleY = (CANVAS_HEIGHT - 2 * PADDING) / yRange;
        
        // Función para transformar coordenadas de usuario a coordenadas de pantalla (Y)
        const yToScreen = (y) => p.map(y, minY, maxY, CANVAS_HEIGHT - PADDING, PADDING);
        // Función para transformar coordenadas de usuario a coordenadas de pantalla (X)
        const xToScreen = (x) => p.map(x, a, b, PADDING, CANVAS_WIDTH - PADDING);

        // 2. Dibujar Ejes
        p.stroke(150);
        p.strokeWeight(1);
        
        // Eje X (en y=0) - Línea más gruesa
        const xAxisY = yToScreen(0);
        p.stroke(100);
        p.line(PADDING, xAxisY, CANVAS_WIDTH - PADDING, xAxisY);
        
        // Eje Y (en x=a) - Marcador del límite del intervalo
        p.stroke(150);
        p.line(xToScreen(a), PADDING, xToScreen(a), CANVAS_HEIGHT - PADDING);

        // 3. Dibujar la Función
        p.noFill();
        p.stroke(0, 150, 255); // Color primario (Azul)
        p.strokeWeight(3);
        
        p.beginShape();
        yValues.forEach(point => {
            p.vertex(xToScreen(point.x), yToScreen(point.y));
        });
        p.endShape();
        
        // 4. Dibujar la adivinanza del usuario (si ya se hizo un intento)
        if (userGuess !== null) {
            // Solo dibujar la línea si la adivinanza está dentro del rango visible [a, b]
            if (userGuess >= a && userGuess <= b) {
                 p.stroke(217, 83, 79); // Rojo para la adivinanza
                 p.strokeWeight(2);
                 // Dibuja una línea vertical para la adivinanza
                 p.line(xToScreen(userGuess), PADDING, xToScreen(userGuess), CANVAS_HEIGHT - PADDING);
                 
                 // Dibuja el punto en el eje X
                 p.fill(217, 83, 79);
                 p.noStroke();
                 p.circle(xToScreen(userGuess), xAxisY, 8);
                 
                 // Etiqueta del error (opcional)
                 p.textAlign(p.LEFT, p.TOP);
                 p.textSize(10);
                 p.text('Tu Est.', xToScreen(userGuess) + 5, xAxisY - 10);

            }
        }

        // 5. Dibujar la raíz real (solo si está resuelto)
        if (isSolved) {
            const actualRoot = currentChallenge.root;
            p.fill(92, 184, 92); // Verde para el éxito
            p.noStroke();
            p.circle(xToScreen(actualRoot), xAxisY, 10);
            
            // Etiqueta de la raíz real
            p.fill(0);
            p.textAlign(p.RIGHT, p.TOP);
            p.textSize(10);
            p.text('Raíz', xToScreen(actualRoot) - 5, xAxisY + 5);
        }
    };
    
    // Función para iniciar un nuevo desafío (llamada desde el botón)
    p.startNewChallenge = p.startNewChallenge;
    
};

// Crear la instancia de p5.js para el minijuego
let p5Instance = new p5(sketch);

// La función del botón debe llamar a startNewChallenge en la instancia de p5
function startNewChallenge() {
    if (p5Instance && p5Instance.startNewChallenge) {
        p5Instance.startNewChallenge();
    }
}