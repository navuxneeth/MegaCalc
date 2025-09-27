document.addEventListener('DOMContentLoaded', function() {
    // Initialize calculator
    const calculator = new Calculator();
    
    // Initialize UI elements
    const display = document.getElementById('display');
    const history = document.getElementById('history');
    const precisionSlider = document.getElementById('precisionSlider');
    const precisionValue = document.getElementById('precisionValue');
    const themeToggle = document.getElementById('themeToggle');
    
    // Initialize mode elements
    const simpleMode = document.getElementById('simpleMode');
    const advancedMode = document.getElementById('advancedMode');
    const graphMode = document.getElementById('graphMode');
    const simpleKeypad = document.getElementById('simpleKeypad');
    const advancedKeypad = document.getElementById('advancedKeypad');
    const graphingMode = document.getElementById('graphingMode');
    
    // Initialize graphing calculator
    const graphingCalculator = new GraphingCalculator('graphCanvas');
    
    // Set up event listeners for number buttons
    document.querySelectorAll('.key.number').forEach(button => {
        button.addEventListener('click', () => {
            calculator.appendNumber(button.textContent);
            calculator.updateDisplay(display, history);
        });
    });
    
    // Set up event listeners for operator buttons
    document.querySelectorAll('.key.operator').forEach(button => {
        button.addEventListener('click', () => {
            calculator.chooseOperation(button.textContent);
            calculator.updateDisplay(display, history);
        });
    });
    
    // Set up event listener for equals button
    document.querySelectorAll('.key.equal').forEach(button => {
        button.addEventListener('click', () => {
            calculator.calculate();
            calculator.updateDisplay(display, history);
        });
    });
    
    // Set up event listeners for function buttons
    document.querySelectorAll('.key.function').forEach(button => {
        button.addEventListener('click', () => {
            switch(button.textContent) {
                case 'C':
                    calculator.clear();
                    break;
                case '±':
                    calculator.toggleSign();
                    break;
                case '%':
                    calculator.percentage();
                    break;
                case 'x²':
                    calculator.square();
                    break;
                case 'x³':
                    calculator.cube();
                    break;
                case 'x^y':
                    calculator.chooseOperation('^');
                    break;
                case '√x':
                    calculator.squareRoot();
                    break;
                case '∛x':
                    calculator.nthRoot(3);
                    break;
                case '∜x':
                    calculator.nthRoot(4);
                    break;
                case 'log':
                    calculator.log10();
                    break;
                case 'ln':
                    calculator.ln();
                    break;
                case '!':
                    calculator.factorial();
                    break;
                case 'sin':
                    calculator.sin();
                    break;
                case 'cos':
                    calculator.cos();
                    break;
                case 'tan':
                    calculator.tan();
                    break;
                case 'π':
                    calculator.currentInput = Math.PI.toString();
                    calculator.resetInput = true;
                    break;
                case 'e':
                    calculator.currentInput = Math.E.toString();
                    calculator.resetInput = true;
                    break;
                case 'MC':
                    calculator.memoryClear();
                    break;
                case 'MR':
                    calculator.memoryRecall();
                    break;
                case 'M+':
                    calculator.memoryAdd();
                    break;
                case 'M−':
                    calculator.memorySubtract();
                    break;
                case 'Rand':
                    calculator.random();
                    break;
                case 'Ans':
                    calculator.useAnswer();
                    break;
                case '|x|':
                    calculator.absolute();
                    break;
            }
            calculator.updateDisplay(display, history);
        });
    });
    
    // Set up mode switching
    simpleMode.addEventListener('click', () => {
        simpleMode.classList.add('active');
        advancedMode.classList.remove('active');
        graphMode.classList.remove('active');
        
        simpleKeypad.classList.remove('hidden');
        advancedKeypad.classList.add('hidden');
        graphingMode.classList.add('hidden');
    });
    
    advancedMode.addEventListener('click', () => {
        simpleMode.classList.remove('active');
        advancedMode.classList.add('active');
        graphMode.classList.remove('active');
        
        simpleKeypad.classList.add('hidden');
        advancedKeypad.classList.remove('hidden');
        graphingMode.classList.add('hidden');
    });
    
    graphMode.addEventListener('click', () => {
        simpleMode.classList.remove('active');
        advancedMode.classList.remove('active');
        graphMode.classList.add('active');
        
        simpleKeypad.classList.add('hidden');
        advancedKeypad.classList.add('hidden');
        graphingMode.classList.remove('hidden');
        
        // Make sure the graph is properly sized
        graphingCalculator.resizeCanvas();
    });
    
    // Set up precision slider
    precisionSlider.addEventListener('input', () => {
        const value = precisionSlider.value;
        precisionValue.textContent = value;
        calculator.setPrecision(value);
        calculator.updateDisplay(display, history);
    });
    
    // Set up theme toggle
    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            graphingCalculator.updateTheme(true);
        } else {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            graphingCalculator.updateTheme(false);
        }
    });
    
    // Set up graphing controls
    const functionInput = document.getElementById('functionInput');
    const plotBtn = document.getElementById('plotBtn');
    const xMinInput = document.getElementById('xMinInput');
    const xMaxInput = document.getElementById('xMaxInput');
    const yMinInput = document.getElementById('yMinInput');
    const yMaxInput = document.getElementById('yMaxInput');
    const graphColor = document.getElementById('graphColor');
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const resetZoomBtn = document.getElementById('resetZoom');
    
    plotBtn.addEventListener('click', () => {
        const success = graphingCalculator.drawFunction(functionInput.value);
        if (!success) {
            alert('Invalid function expression. Please check your syntax.');
        }
    });
    
    // Range update event listeners
    [xMinInput, xMaxInput, yMinInput, yMaxInput].forEach(input => {
        input.addEventListener('change', () => {
            graphingCalculator.updateRange(
                parseFloat(xMinInput.value),
                parseFloat(xMaxInput.value),
                parseFloat(yMinInput.value),
                parseFloat(yMaxInput.value)
            );
        });
    });
    
    // Color picker event listener
    graphColor.addEventListener('change', () => {
        graphingCalculator.updateLineColor(graphColor.value);
    });
    
    // Zoom controls
    zoomInBtn.addEventListener('click', () => {
        graphingCalculator.zoomIn();
    });
    
    zoomOutBtn.addEventListener('click', () => {
        graphingCalculator.zoomOut();
    });
    
    resetZoomBtn.addEventListener('click', () => {
        graphingCalculator.resetZoom();
    });
    
    // Initialize keyboard support
    document.addEventListener('keydown', (event) => {
        // Only process keyboard inputs when not in graphing mode
        if (graphMode.classList.contains('active')) {
            return;
        }
        
        if ('0123456789.'.includes(event.key)) {
            calculator.appendNumber(event.key);
        } else if (['+', '-', '*', '/'].includes(event.key)) {
            let operation = event.key;
            if (operation === '-') operation = '−';
            if (operation === '*') operation = '×';
            if (operation === '/') operation = '÷';
            calculator.chooseOperation(operation);
        } else if (event.key === 'Enter' || event.key === '=') {
            calculator.calculate();
        } else if (event.key === 'Escape') {
            calculator.clear();
        } else if (event.key === 'Backspace') {
            // Handle backspace to delete the last character
            if (calculator.currentInput.length > 1) {
                calculator.currentInput = calculator.currentInput.slice(0, -1);
            } else {
                calculator.currentInput = '0';
            }
        }
        
        calculator.updateDisplay(display, history);
    });
    
    // Initial display update
    calculator.updateDisplay(display, history);
});