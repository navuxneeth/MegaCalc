// Graphing functionality
class GraphingCalculator {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.xMin = -10;
        this.xMax = 10;
        this.yMin = -10;
        this.yMax = 10;
        this.xScale = 1;
        this.yScale = 1;
        this.precision = 10;
        this.currentFunction = null;
        this.lineColor = '#ff0000';
        this.isDarkMode = false;
        
        // Initialize chart
        this.initializeChart();
        
        // Resize canvas to fit container
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        
        // Redraw if we have a function
        if (this.currentFunction) {
            this.drawFunction(this.currentFunction);
        } else {
            this.drawEmptyGrid();
        }
    }
    
    initializeChart() {
        this.chart = new Chart(this.ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Function',
                    data: [],
                    showLine: true,
                    borderColor: this.lineColor,
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 0,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        min: this.xMin,
                        max: this.xMax,
                        grid: {
                            color: this.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            color: this.isDarkMode ? '#ffffff' : '#333333'
                        }
                    },
                    y: {
                        min: this.yMin,
                        max: this.yMax,
                        grid: {
                            color: this.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            color: this.isDarkMode ? '#ffffff' : '#333333'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function(context) {
                                return `(${context.parsed.x.toFixed(2)}, ${context.parsed.y.toFixed(2)})`;
                            }
                        }
                    }
                },
                animation: {
                    duration: 0 // Disable animation for performance
                }
            }
        });
    }
    
    drawEmptyGrid() {
        // Update chart with empty data
        this.chart.data.datasets[0].data = [];
        this.chart.update();
    }
    
    updateRange(xMin, xMax, yMin, yMax) {
        this.xMin = xMin;
        this.xMax = xMax;
        this.yMin = yMin;
        this.yMax = yMax;
        
        // Update chart scales
        this.chart.options.scales.x.min = this.xMin;
        this.chart.options.scales.x.max = this.xMax;
        this.chart.options.scales.y.min = this.yMin;
        this.chart.options.scales.y.max = this.yMax;
        
        // Redraw if we have a function
        if (this.currentFunction) {
            this.drawFunction(this.currentFunction);
        } else {
            this.chart.update();
        }
    }
    
    updateLineColor(color) {
        this.lineColor = color;
        this.chart.data.datasets[0].borderColor = color;
        this.chart.update();
    }
    
    updateTheme(isDarkMode) {
        this.isDarkMode = isDarkMode;
        
        // Update grid and text colors
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const textColor = isDarkMode ? '#ffffff' : '#333333';
        
        this.chart.options.scales.x.grid.color = gridColor;
        this.chart.options.scales.y.grid.color = gridColor;
        this.chart.options.scales.x.ticks.color = textColor;
        this.chart.options.scales.y.ticks.color = textColor;
        
        this.chart.update();
    }
    
    zoomIn() {
        // Zoom in by 20%
        const xCenter = (this.xMin + this.xMax) / 2;
        const yCenter = (this.yMin + this.yMax) / 2;
        const xRange = (this.xMax - this.xMin) * 0.8; // 80% of current range
        const yRange = (this.yMax - this.yMin) * 0.8;
        
        this.updateRange(
            xCenter - xRange / 2,
            xCenter + xRange / 2,
            yCenter - yRange / 2,
            yCenter + yRange / 2
        );
    }
    
    zoomOut() {
        // Zoom out by 20%
        const xCenter = (this.xMin + this.xMax) / 2;
        const yCenter = (this.yMin + this.yMax) / 2;
        const xRange = (this.xMax - this.xMin) * 1.2; // 120% of current range
        const yRange = (this.yMax - this.yMin) * 1.2;
        
        this.updateRange(
            xCenter - xRange / 2,
            xCenter + xRange / 2,
            yCenter - yRange / 2,
            yCenter + yRange / 2
        );
    }
    
    resetZoom() {
        this.updateRange(-10, 10, -10, 10);
    }
    
    drawFunction(functionString) {
        try {
            // Save the function for later reference
            this.currentFunction = functionString;
            
            // Parse the function string to create a JavaScript function
            const functionExpr = this.parseFunctionExpression(functionString);
            
            // Calculate points
            const points = this.calculatePoints(functionExpr);
            
            // Update chart data
            this.chart.data.datasets[0].data = points;
            this.chart.update();
            
            return true;
        } catch (error) {
            console.error("Error drawing function:", error);
            return false;
        }
    }
    
    calculatePoints(func) {
        const points = [];
        const step = (this.xMax - this.xMin) / 500; // 500 points across the x-axis
        
        let x = this.xMin;
        while (x <= this.xMax) {
            try {
                const y = func(x);
                
                // Skip points that are out of y range or invalid
                if (!isNaN(y) && isFinite(y) && y >= this.yMin && y <= this.yMax) {
                    points.push({x, y});
                }
            } catch (e) {
                // Skip errors
            }
            
            x += step;
        }
        
        return points;
    }
    
    parseFunctionExpression(expr) {
        // Replace common math notations with JavaScript equivalents
        expr = expr.replace(/\^/g, '**'); // Replace ^ with ** for exponentiation
        expr = expr.replace(/sin\(/g, 'Math.sin(');
        expr = expr.replace(/cos\(/g, 'Math.cos(');
        expr = expr.replace(/tan\(/g, 'Math.tan(');
        expr = expr.replace(/log\(/g, 'Math.log10(');
        expr = expr.replace(/ln\(/g, 'Math.log(');
        expr = expr.replace(/sqrt\(/g, 'Math.sqrt(');
        expr = expr.replace(/pi/g, 'Math.PI');
        expr = expr.replace(/e(?![a-zA-Z])/g, 'Math.E');
        expr = expr.replace(/abs\(/g, 'Math.abs(');
        
        // Create a function that takes x as an argument
        return function(x) {
            return eval(expr);
        };
    }
}