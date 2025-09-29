document.addEventListener('DOMContentLoaded', function() {
    // Initialize calculator and grapher
    const calculator = new Calculator();
    const grapher = new Grapher('graph-canvas');
    
    // DOM elements
    const mainDisplay = document.getElementById('main-display');
    const historyDisplay = document.getElementById('history-display');
    const precisionSlider = document.getElementById('precision-slider');
    const precisionValue = document.getElementById('precision-value');
    const modeButtons = document.querySelectorAll('.mode-btn');
    const interfaces = document.querySelectorAll('.calculator-interface');
    const themeToggle = document.getElementById('theme-toggle');
    
    // Set initial precision
    calculator.setPrecision(precisionSlider.value);
    precisionValue.textContent = precisionSlider.value;
    
    // Mode switching
    modeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const mode = this.id.split('-')[0];
            
            // Update active button
            modeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show appropriate interface
            interfaces.forEach(interface => {
                if (interface.id === `${mode}-interface`) {
                    interface.classList.add('active');
                } else {
                    interface.classList.remove('active');
                }
            });
            
            // If switching to graph mode, resize canvas and redraw the graph
            if (mode === 'graph') {
                setTimeout(() => {
                    grapher.resizeCanvas();
                }, 100);
            }
        });
    });
    
    // Theme toggle
    themeToggle.addEventListener('change', function() {
        document.body.classList.toggle('dark-theme', this.checked);
    });
    
    // Precision slider
    precisionSlider.addEventListener('input', function() {
        const precision = this.value;
        precisionValue.textContent = precision;
        calculator.setPrecision(precision);
        updateDisplay();
    });
    
    // History controls
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    const showHistoryBtn = document.getElementById('show-history-btn');
    
    clearHistoryBtn.addEventListener('click', function() {
        calculator.clearHistory();
        updateDisplay();
    });
    
    showHistoryBtn.addEventListener('click', function() {
        showHistoryModal();
    });
    
    // Simple calculator buttons
    document.querySelectorAll('#simple-interface .btn').forEach(button => {
        button.addEventListener('click', function() {
            const value = this.textContent;
            handleButtonClick(value);
        });
    });
    
    // Advanced calculator buttons
    document.querySelectorAll('#advanced-interface .btn').forEach(button => {
        button.addEventListener('click', function() {
            const value = this.textContent;
            handleAdvancedButtonClick(value);
        });
    });
    
    // Graph mode controls
    const addEquationBtn = document.getElementById('add-equation-btn');
    const equationList = document.getElementById('equation-list');
    const plotBtn = document.getElementById('plot-btn');
    const xMinInput = document.getElementById('x-min');
    const xMaxInput = document.getElementById('x-max');
    const yMinInput = document.getElementById('y-min');
    const yMaxInput = document.getElementById('y-max');
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    const resetViewBtn = document.getElementById('reset-view-btn');
    
    // Add equation button
    addEquationBtn.addEventListener('click', function() {
        addEquationEntry();
    });
    
    // Plot button
    plotBtn.addEventListener('click', function() {
        plotEquations();
    });
    
    // Zoom and reset buttons
    zoomInBtn.addEventListener('click', function() {
        grapher.zoomIn().draw();
        updateGraphRangeInputs();
    });
    
    zoomOutBtn.addEventListener('click', function() {
        grapher.zoomOut().draw();
        updateGraphRangeInputs();
    });
    
    resetViewBtn.addEventListener('click', function() {
        grapher.resetView().draw();
        updateGraphRangeInputs();
    });
    
    // Graph range inputs
    [xMinInput, xMaxInput, yMinInput, yMaxInput].forEach(input => {
        input.addEventListener('change', function() {
            updateGraphRange();
        });
    });
    
    // Add initial equation entry
    addEquationEntry();
    
    // Initialize the graph
    grapher.draw();
    
    // Handle keyboard input
    document.addEventListener('keydown', function(e) {
        const key = e.key;
        
        // Get active interface
        const activeInterface = document.querySelector('.calculator-interface.active').id;
        
        // Only handle keyboard input in simple or advanced modes
        if (activeInterface === 'simple-interface' || activeInterface === 'advanced-interface') {
            if ((key >= '0' && key <= '9') || key === '.') {
                handleButtonClick(key);
            } else if (key === '+' || key === '-' || key === '*' || key === '/') {
                const operatorMap = {
                    '*': '×',
                    '/': '÷'
                };
                handleButtonClick(operatorMap[key] || key);
            } else if (key === 'Enter' || key === '=') {
                handleButtonClick('=');
            } else if (key === 'Escape') {
                handleButtonClick('AC');
            } else if (key === 'Backspace') {
                backspace();
            }
        }
        
        // Prevent default behavior for calculator keys
        if ((key >= '0' && key <= '9') || key === '.' || key === '+' || key === '-' || 
            key === '*' || key === '/' || key === 'Enter' || key === '=' || key === 'Escape') {
            e.preventDefault();
        }
    });
    
    // Button click handler
    function handleButtonClick(value) {
        switch(value) {
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '.':
                calculator.appendNumber(value);
                break;
            case '+':
            case '-':
            case '×':
            case '÷':
            case '%':
                calculator.setOperation(value);
                break;
            case '=':
                calculator.calculate();
                break;
            case 'AC':
            case 'C':
                calculator.clear();
                break;
            case '±':
                calculator.negate();
                break;
        }
        
        updateDisplay();
    }
    
    // Advanced button click handler
    function handleAdvancedButtonClick(value) {
        switch(value) {
            case 'MC':
                calculator.memoryClear();
                break;
            case 'MR':
                calculator.memoryRecall();
                break;
            case 'M+':
                calculator.memoryAdd();
                break;
            case 'M-':
                calculator.memorySubtract();
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
            case 'log':
                calculator.log();
                break;
            case 'ln':
                calculator.ln();
                break;
            case 'x²':
                calculator.square();
                break;
            case 'x³':
                calculator.cube();
                break;
            case 'xʸ':
                calculator.setOperation('xʸ');
                break;
            case '√':
                calculator.squareRoot();
                break;
            case '∛':
                calculator.cubeRoot();
                break;
            case 'π':
                calculator.pi();
                break;
            case 'e':
                calculator.e();
                break;
            case 'Rand':
                calculator.random();
                break;
            case '|x|':
                calculator.abs();
                break;
            case '1/x':
                calculator.reciprocal();
                break;
            case 'n!':
                calculator.factorial();
                break;
            case '(':
            case ')':
                // Handle parentheses in future version
                break;
            case 'Ans':
                calculator.useLastResult();
                break;
            default:
                // Handle other buttons with simple handler
                handleButtonClick(value);
                return;
        }
        
        updateDisplay();
    }
    
    // Backspace function
    function backspace() {
        const currentValue = calculator.currentValue.toString();
        if (currentValue.length > 1) {
            calculator.currentValue = new BigNumber(currentValue.slice(0, -1));
        } else {
            calculator.currentValue = new BigNumber(0);
        }
        updateDisplay();
    }
    
    // Update display function
    function updateDisplay() {
        mainDisplay.textContent = calculator.getDisplayValue();
        historyDisplay.textContent = calculator.getHistoryValue();
    }
    
    // Add equation entry to the list
    function addEquationEntry() {
        const index = document.querySelectorAll('.equation-entry').length;
        const entryDiv = document.createElement('div');
        entryDiv.className = 'equation-entry';
        
        const label = document.createElement('label');
        label.className = 'equation-label';
        label.textContent = `f${index + 1}(x) =`;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'equation-input';
        input.placeholder = 'Enter function (e.g. x^2)';
        
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.className = 'color-picker';
        
        // Generate a color based on the index
        const hue = (index * 137) % 360; // Golden angle in degrees
        colorPicker.value = hslToHex(hue, 100, 50);
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-equation-btn';
        removeBtn.textContent = '×';
        removeBtn.addEventListener('click', function() {
            equationList.removeChild(entryDiv);
            // Renumber the labels
            document.querySelectorAll('.equation-entry').forEach((entry, idx) => {
                entry.querySelector('.equation-label').textContent = `f${idx + 1}(x) =`;
            });
        });
        
        entryDiv.appendChild(label);
        entryDiv.appendChild(input);
        entryDiv.appendChild(colorPicker);
        entryDiv.appendChild(removeBtn);
        
        equationList.appendChild(entryDiv);
    }
    
    // Plot equations
    function plotEquations() {
        // Update graph range first
        updateGraphRange();
        
        // Clear existing equations
        grapher.clearEquations();
        
        // Add each equation
        document.querySelectorAll('.equation-entry').forEach(entry => {
            const equation = entry.querySelector('.equation-input').value;
            const color = entry.querySelector('.color-picker').value;
            
            if (equation.trim()) {
                grapher.addEquation(equation, color);
            }
        });
        
        // Draw the graph
        grapher.draw();
    }
    
    // Update graph range
    function updateGraphRange() {
        const xMin = parseFloat(xMinInput.value) || -10;
        const xMax = parseFloat(xMaxInput.value) || 10;
        const yMin = parseFloat(yMinInput.value) || -10;
        const yMax = parseFloat(yMaxInput.value) || 10;
        
        grapher.setViewWindow(xMin, xMax, yMin, yMax);
        grapher.draw();
    }
    
    // Update range inputs to match grapher state
    function updateGraphRangeInputs() {
        xMinInput.value = grapher.xMin;
        xMaxInput.value = grapher.xMax;
        yMinInput.value = grapher.yMin;
        yMaxInput.value = grapher.yMax;
    }
    
    // Helper function to convert HSL to HEX
    function hslToHex(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        const toHex = x => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
    
    // Show history modal
    function showHistoryModal() {
        const history = calculator.getHistory();
        let historyText = 'Calculator History:\n\n';
        
        if (history.length === 0) {
            historyText += 'No calculations performed yet.';
        } else {
            history.forEach((item, index) => {
                historyText += `${index + 1}. ${item}\n`;
            });
        }
        
        alert(historyText);
    }
    
    // Update display to show latest history item
    function updateDisplay() {
        mainDisplay.textContent = calculator.getDisplayValue();
        
        // Show the latest history item in the history display
        const history = calculator.getHistory();
        if (history.length > 0) {
            historyDisplay.textContent = history[history.length - 1];
        } else {
            historyDisplay.textContent = '';
        }
    }
});