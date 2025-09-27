class Calculator {
    constructor() {
        this.currentValue = new BigNumber(0);
        this.previousValue = null;
        this.operation = null;
        this.lastResult = null;
        this.memory = new BigNumber(0);
        this.history = [];
        this.precision = 10;
        this.isNewCalculation = true;
    }

    setPrecision(precision) {
        this.precision = parseInt(precision);
        BigNumber.config({ DECIMAL_PLACES: this.precision });
        return this;
    }

    appendNumber(number) {
        const currentStr = this.currentValue.toString();
        
        // Check if number is '.' and string already contains a decimal point
        if (number === '.' && currentStr.includes('.')) {
            return this;
        }
        
        // If starting a new calculation, replace the current value
        if (this.isNewCalculation) {
            this.currentValue = new BigNumber(number === '.' ? '0.' : number);
            this.isNewCalculation = false;
        } else {
            // Otherwise append the number
            this.currentValue = new BigNumber(currentStr + number);
        }
        
        return this;
    }

    setOperation(operation) {
        // Complete any pending operation
        if (this.operation !== null) {
            this.calculate();
        }
        
        this.operation = operation;
        this.previousValue = this.currentValue;
        this.currentValue = new BigNumber(0);
        this.isNewCalculation = true;
        
        return this;
    }

    calculate() {
        if (this.previousValue === null || this.operation === null) {
            return this;
        }
        
        let result;
        
        try {
            switch (this.operation) {
                case '+':
                    result = this.previousValue.plus(this.currentValue);
                    break;
                case '-':
                    result = this.previousValue.minus(this.currentValue);
                    break;
                case '×':
                case '*':
                    result = this.previousValue.times(this.currentValue);
                    break;
                case '÷':
                case '/':
                    if (this.currentValue.isZero()) {
                        throw new Error('Division by zero');
                    }
                    result = this.previousValue.dividedBy(this.currentValue);
                    break;
                case '%':
                    result = this.previousValue.modulo(this.currentValue);
                    break;
                case 'xʸ':
                case '^':
                    result = this.previousValue.pow(this.currentValue);
                    break;
                default:
                    return this;
            }
            
            // Add to history
            const historyItem = `${this.previousValue.toString()} ${this.operation} ${this.currentValue.toString()} = ${result.toString()}`;
            this.history.push(historyItem);
            
            // Update current state
            this.currentValue = result;
            this.lastResult = result;
            this.previousValue = null;
            this.operation = null;
            this.isNewCalculation = true;
            
        } catch (error) {
            this.currentValue = new BigNumber(0);
            this.previousValue = null;
            this.operation = null;
            this.isNewCalculation = true;
            console.error(error);
        }
        
        return this;
    }

    clear() {
        this.currentValue = new BigNumber(0);
        this.previousValue = null;
        this.operation = null;
        this.isNewCalculation = true;
        return this;
    }

    negate() {
        this.currentValue = this.currentValue.negated();
        return this;
    }

    percent() {
        this.currentValue = this.currentValue.dividedBy(100);
        return this;
    }

    // Advanced functions
    square() {
        this.currentValue = this.currentValue.pow(2);
        return this;
    }

    cube() {
        this.currentValue = this.currentValue.pow(3);
        return this;
    }

    squareRoot() {
        if (this.currentValue.isNegative()) {
            this.currentValue = new BigNumber(0);
            return this;
        }
        this.currentValue = this.currentValue.sqrt();
        return this;
    }

    cubeRoot() {
        this.currentValue = this.currentValue.isNegative() 
            ? new BigNumber(-1).times(new BigNumber(-1).times(this.currentValue).pow(1/3))
            : this.currentValue.pow(1/3);
        return this;
    }

    reciprocal() {
        if (this.currentValue.isZero()) {
            return this;
        }
        this.currentValue = new BigNumber(1).dividedBy(this.currentValue);
        return this;
    }

    factorial() {
        // Only calculate factorial for non-negative integers up to a reasonable limit
        if (this.currentValue.isNegative() || !this.currentValue.isInteger() || this.currentValue.gt(170)) {
            this.currentValue = new BigNumber(0);
            return this;
        }
        
        let result = new BigNumber(1);
        const n = this.currentValue.toNumber();
        
        for (let i = 2; i <= n; i++) {
            result = result.times(i);
        }
        
        this.currentValue = result;
        return this;
    }

    sin() {
        this.currentValue = new BigNumber(Math.sin(this.currentValue.toNumber()));
        return this;
    }

    cos() {
        this.currentValue = new BigNumber(Math.cos(this.currentValue.toNumber()));
        return this;
    }

    tan() {
        this.currentValue = new BigNumber(Math.tan(this.currentValue.toNumber()));
        return this;
    }

    log() {
        if (this.currentValue.isNegative() || this.currentValue.isZero()) {
            this.currentValue = new BigNumber(0);
            return this;
        }
        this.currentValue = new BigNumber(Math.log10(this.currentValue.toNumber()));
        return this;
    }

    ln() {
        if (this.currentValue.isNegative() || this.currentValue.isZero()) {
            this.currentValue = new BigNumber(0);
            return this;
        }
        this.currentValue = new BigNumber(Math.log(this.currentValue.toNumber()));
        return this;
    }

    abs() {
        this.currentValue = this.currentValue.abs();
        return this;
    }

    pi() {
        this.currentValue = new BigNumber(Math.PI);
        return this;
    }

    e() {
        this.currentValue = new BigNumber(Math.E);
        return this;
    }

    random() {
        this.currentValue = new BigNumber(Math.random());
        return this;
    }

    // Memory functions
    memoryClear() {
        this.memory = new BigNumber(0);
        return this;
    }

    memoryRecall() {
        this.currentValue = this.memory;
        this.isNewCalculation = true;
        return this;
    }

    memoryAdd() {
        this.memory = this.memory.plus(this.currentValue);
        return this;
    }

    memorySubtract() {
        this.memory = this.memory.minus(this.currentValue);
        return this;
    }

    // Get formatted current value
    getDisplayValue() {
        // Format the number based on precision
        if (this.currentValue.toString() === "0") {
            return "0";
        }
        
        // Check if number is too large for normal display
        if (this.currentValue.abs().gt(1e21) || this.currentValue.abs().lt(1e-7) && !this.currentValue.isZero()) {
            return this.currentValue.toExponential(this.precision);
        }
        
        return this.currentValue.toFixed(this.precision).replace(/\.?0+$/, "");
    }

    getHistoryValue() {
        if (this.history.length > 0) {
            return this.history[this.history.length - 1];
        }
        return '';
    }

    useLastResult() {
        if (this.lastResult !== null) {
            this.currentValue = this.lastResult;
            this.isNewCalculation = true;
        }
        return this;
    }
}