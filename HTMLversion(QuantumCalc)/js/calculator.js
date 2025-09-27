// Core calculator functionality
class Calculator {
    constructor() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operation = null;
        this.resetInput = false;
        this.memory = new Decimal(0);
        this.lastAnswer = new Decimal(0);
        this.precision = 10; // Default decimal precision
    }

    updateDisplay(displayElement, historyElement) {
        // Format the current input based on precision
        let formattedValue = this.currentInput;
        
        // If it's a Decimal object, format it with the current precision
        if (formattedValue instanceof Decimal) {
            formattedValue = formattedValue.toFixed(this.precision);
            // Remove trailing zeros and decimal point if needed
            formattedValue = formattedValue.replace(/\.?0+$/, "");
            if (formattedValue === "") formattedValue = "0";
        }
        
        displayElement.textContent = formattedValue;
        
        // Update history display
        if (this.previousInput && this.operation) {
            historyElement.textContent = `${this.previousInput} ${this.operation}`;
        } else {
            historyElement.textContent = '';
        }
    }

    appendNumber(number) {
        // Handle decimal point
        if (number === '.' && this.currentInput.includes('.')) return;
        
        // Replace the display if we're starting a new input
        if (this.resetInput || this.currentInput === '0') {
            // Keep the decimal point if that's what's being entered
            this.currentInput = number === '.' ? '0.' : number;
            this.resetInput = false;
        } else {
            this.currentInput += number;
        }
    }

    chooseOperation(operation) {
        if (this.currentInput === '') return;
        
        if (this.previousInput !== '') {
            this.calculate();
        }
        
        this.operation = operation;
        this.previousInput = this.currentInput;
        this.resetInput = true;
    }

    calculate() {
        let computation;
        const prev = new Decimal(this.previousInput);
        const current = new Decimal(this.currentInput);
        
        switch (this.operation) {
            case '+':
                computation = prev.plus(current);
                break;
            case '−':
                computation = prev.minus(current);
                break;
            case '×':
                computation = prev.times(current);
                break;
            case '÷':
                if (current.equals(0)) {
                    this.currentInput = 'Error';
                    return;
                }
                computation = prev.dividedBy(current);
                break;
            default:
                return;
        }
        
        this.currentInput = computation;
        this.lastAnswer = computation;
        this.operation = null;
        this.previousInput = '';
    }

    clear() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operation = null;
    }

    toggleSign() {
        this.currentInput = new Decimal(this.currentInput).negated().toString();
    }

    percentage() {
        this.currentInput = new Decimal(this.currentInput).dividedBy(100).toString();
    }

    // Advanced functions
    square() {
        const value = new Decimal(this.currentInput);
        this.currentInput = value.times(value);
    }

    cube() {
        const value = new Decimal(this.currentInput);
        this.currentInput = value.times(value).times(value);
    }

    power(exponent) {
        const value = new Decimal(this.currentInput);
        this.currentInput = value.pow(exponent);
    }

    squareRoot() {
        const value = new Decimal(this.currentInput);
        if (value.isNegative()) {
            this.currentInput = 'Error';
            return;
        }
        this.currentInput = value.sqrt();
    }

    nthRoot(n) {
        const value = new Decimal(this.currentInput);
        if (value.isNegative() && n % 2 === 0) {
            this.currentInput = 'Error';
            return;
        }
        this.currentInput = value.pow(new Decimal(1).dividedBy(n));
    }

    log10() {
        const value = new Decimal(this.currentInput);
        if (value.lessThanOrEqualTo(0)) {
            this.currentInput = 'Error';
            return;
        }
        this.currentInput = value.log();
    }

    ln() {
        const value = new Decimal(this.currentInput);
        if (value.lessThanOrEqualTo(0)) {
            this.currentInput = 'Error';
            return;
        }
        this.currentInput = value.ln();
    }

    factorial() {
        const num = parseInt(this.currentInput);
        if (num < 0) {
            this.currentInput = 'Error';
            return;
        }
        if (num > 170) { // Decimal.js has limitations
            this.currentInput = 'Overflow';
            return;
        }

        let result = new Decimal(1);
        for (let i = 2; i <= num; i++) {
            result = result.times(i);
        }
        this.currentInput = result;
    }

    sin() {
        const value = new Decimal(this.currentInput);
        this.currentInput = Decimal.sin(value);
    }

    cos() {
        const value = new Decimal(this.currentInput);
        this.currentInput = Decimal.cos(value);
    }

    tan() {
        const value = new Decimal(this.currentInput);
        const cosValue = Decimal.cos(value);
        if (cosValue.equals(0)) {
            this.currentInput = 'Error';
            return;
        }
        this.currentInput = Decimal.sin(value).dividedBy(cosValue);
    }

    setPrecision(precision) {
        this.precision = parseInt(precision);
    }

    memoryStore() {
        this.memory = new Decimal(this.currentInput);
    }

    memoryRecall() {
        this.currentInput = this.memory;
        this.resetInput = true;
    }

    memoryAdd() {
        this.memory = this.memory.plus(new Decimal(this.currentInput));
    }

    memorySubtract() {
        this.memory = this.memory.minus(new Decimal(this.currentInput));
    }

    memoryClear() {
        this.memory = new Decimal(0);
    }

    useAnswer() {
        this.currentInput = this.lastAnswer;
    }

    random() {
        this.currentInput = new Decimal(Math.random());
    }

    absolute() {
        this.currentInput = new Decimal(this.currentInput).abs();
    }
}