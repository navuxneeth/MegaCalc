class Grapher {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.equations = [];
        
        // Default view window
        this.xMin = -10;
        this.xMax = 10;
        this.yMin = -10;
        this.yMax = 10;
        
        // Setup canvas dimensions
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.draw();
    }

    setViewWindow(xMin, xMax, yMin, yMax) {
        this.xMin = parseFloat(xMin);
        this.xMax = parseFloat(xMax);
        this.yMin = parseFloat(yMin);
        this.yMax = parseFloat(yMax);
        return this;
    }

    addEquation(equation, color = '#00FF00') {
        this.equations.push({
            expression: equation,
            color: color
        });
        return this;
    }

    updateEquation(index, equation, color) {
        if (index >= 0 && index < this.equations.length) {
            this.equations[index].expression = equation;
            if (color) {
                this.equations[index].color = color;
            }
        }
        return this;
    }

    removeEquation(index) {
        if (index >= 0 && index < this.equations.length) {
            this.equations.splice(index, 1);
        }
        return this;
    }

    clearEquations() {
        this.equations = [];
        return this;
    }

    zoomIn() {
        const xRange = (this.xMax - this.xMin) * 0.2;
        const yRange = (this.yMax - this.yMin) * 0.2;
        
        this.xMin += xRange;
        this.xMax -= xRange;
        this.yMin += yRange;
        this.yMax -= yRange;
        
        return this;
    }

    zoomOut() {
        const xRange = (this.xMax - this.xMin) * 0.25;
        const yRange = (this.yMax - this.yMin) * 0.25;
        
        this.xMin -= xRange;
        this.xMax += xRange;
        this.yMin -= yRange;
        this.yMax += yRange;
        
        return this;
    }

    resetView() {
        this.xMin = -10;
        this.xMax = 10;
        this.yMin = -10;
        this.yMax = 10;
        
        return this;
    }

    draw() {
        const { width, height } = this.canvas;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, width, height);
        
        // Draw grid and axes
        this.drawGrid();
        
        // Draw each equation
        for (const eq of this.equations) {
            this.drawEquation(eq.expression, eq.color);
        }
    }

    drawGrid() {
        const { width, height } = this.canvas;
        const ctx = this.ctx;
        
        // Style for grid lines
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = '#444444';
        
        // Calculate step sizes
        const xStep = this.calculateStepSize(this.xMax - this.xMin);
        const yStep = this.calculateStepSize(this.yMax - this.yMin);
        
        // Draw vertical grid lines
        let x = Math.floor(this.xMin / xStep) * xStep;
        while (x <= this.xMax) {
            const xPixel = this.mapX(x);
            ctx.beginPath();
            ctx.moveTo(xPixel, 0);
            ctx.lineTo(xPixel, height);
            ctx.stroke();
            x += xStep;
        }
        
        // Draw horizontal grid lines
        let y = Math.floor(this.yMin / yStep) * yStep;
        while (y <= this.yMax) {
            const yPixel = this.mapY(y);
            ctx.beginPath();
            ctx.moveTo(0, yPixel);
            ctx.lineTo(width, yPixel);
            ctx.stroke();
            y += yStep;
        }
        
        // Draw x and y axes with bolder lines
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#888888';
        
        // x-axis
        if (this.yMin <= 0 && this.yMax >= 0) {
            const yPixel = this.mapY(0);
            ctx.beginPath();
            ctx.moveTo(0, yPixel);
            ctx.lineTo(width, yPixel);
            ctx.stroke();
        }
        
        // y-axis
        if (this.xMin <= 0 && this.xMax >= 0) {
            const xPixel = this.mapX(0);
            ctx.beginPath();
            ctx.moveTo(xPixel, 0);
            ctx.lineTo(xPixel, height);
            ctx.stroke();
        }
        
        // Draw labels
        this.drawLabels(xStep, yStep);
    }

    calculateStepSize(range) {
        const rough = range / 10;
        const magnitude = Math.pow(10, Math.floor(Math.log10(rough)));
        
        if (rough / magnitude >= 5) {
            return 5 * magnitude;
        } else if (rough / magnitude >= 2) {
            return 2 * magnitude;
        } else {
            return magnitude;
        }
    }

    drawLabels(xStep, yStep) {
        const ctx = this.ctx;
        ctx.font = '10px "Press Start 2P"';
        ctx.fillStyle = '#70ff70';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        // X-axis labels
        let x = Math.floor(this.xMin / xStep) * xStep;
        while (x <= this.xMax) {
            const xPixel = this.mapX(x);
            if (Math.abs(x) > 1e-10) { // Avoid labeling very close to zero
                ctx.fillText(x.toFixed(1), xPixel, this.mapY(0) + 5);
            }
            x += xStep;
        }
        
        // Y-axis labels
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        
        let y = Math.floor(this.yMin / yStep) * yStep;
        while (y <= this.yMax) {
            const yPixel = this.mapY(y);
            if (Math.abs(y) > 1e-10) { // Avoid labeling very close to zero
                ctx.fillText(y.toFixed(1), this.mapX(0) - 5, yPixel);
            }
            y += yStep;
        }
    }

    drawEquation(equationStr, color = '#00FF00') {
        try {
            const { width } = this.canvas;
            const ctx = this.ctx;
            
            // Compile the expression once for efficiency
            const expr = math.compile(equationStr);
            
            // Set line style
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            
            // Start drawing path
            ctx.beginPath();
            
            let isFirstPoint = true;
            let lastY = null;
            
            // Calculate number of points based on canvas width
            const numPoints = width;
            const step = (this.xMax - this.xMin) / numPoints;
            
            for (let i = 0; i <= numPoints; i++) {
                const x = this.xMin + step * i;
                let y;
                
                try {
                    // Evaluate the expression at x
                    y = expr.evaluate({ x: x });
                    
                    // Check if y is a valid number
                    if (typeof y !== 'number' || isNaN(y) || !isFinite(y)) {
                        if (!isFirstPoint) {
                            isFirstPoint = true;
                        }
                        continue;
                    }
                    
                    // Skip if y is outside the visible range with some margin
                    if (y < this.yMin - 100 || y > this.yMax + 100) {
                        isFirstPoint = true;
                        continue;
                    }
                    
                    // Check for discontinuities
                    if (lastY !== null && Math.abs(y - lastY) > (this.yMax - this.yMin) / 2) {
                        isFirstPoint = true;
                    }
                    
                    const xPixel = this.mapX(x);
                    const yPixel = this.mapY(y);
                    
                    if (isFirstPoint) {
                        ctx.moveTo(xPixel, yPixel);
                        isFirstPoint = false;
                    } else {
                        ctx.lineTo(xPixel, yPixel);
                    }
                    
                    lastY = y;
                } catch (err) {
                    isFirstPoint = true;
                    continue;
                }
            }
            
            ctx.stroke();
        } catch (error) {
            console.error("Error drawing equation:", error);
        }
    }

    mapX(x) {
        return (x - this.xMin) / (this.xMax - this.xMin) * this.canvas.width;
    }

    mapY(y) {
        return (1 - (y - this.yMin) / (this.yMax - this.yMin)) * this.canvas.height;
    }
}