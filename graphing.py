"""
Graphing module for MegaCalc
Provides ASCII-based function plotting capabilities
"""

import mpmath
import numpy as np
from decimal import Decimal

class Grapher:
    """
    Handles function graphing in ASCII
    """
    
    def __init__(self, config):
        """Initialize the grapher with configuration"""
        self.config = config
        self.x_range = (-10, 10)  # Default x-range
        self.y_range = (-10, 10)  # Default y-range
        self.width = 60  # Width of graph in characters
        self.height = 20  # Height of graph in characters
        self.colors = ['*', '+', 'o', '#', '@', '.', ':', '=', '-']
        self.current_color_idx = 0
        self.functions = []
        
    def add_function(self, function_str):
        """Add a function to be graphed"""
        # Create a safe function to evaluate
        try:
            # Test if function can be evaluated
            func = self._create_function(function_str)
            test_x = (self.x_range[0] + self.x_range[1]) / 2
            func(test_x)
            
            self.functions.append({
                'expression': function_str,
                'function': func,
                'color': self.colors[self.current_color_idx % len(self.colors)],
                'visible': True
            })
            
            # Cycle to next color
            self.current_color_idx += 1
            return True
        except Exception as e:
            return False
            
    def _create_function(self, function_str):
        """Create a safe callable function from string"""
        # Replace ^ with ** for exponentiation
        function_str = function_str.replace('^', '**')
        
        # Create a function that uses mpmath for calculation
        def func(x):
            # Create a context with math functions
            context = {'x': mpmath.mpf(x), 'mpmath': mpmath}
            
            # Add all mpmath functions to the context
            for name in dir(mpmath):
                if callable(getattr(mpmath, name)) and not name.startswith('_'):
                    context[name] = getattr(mpmath, name)
                    
            # Evaluate the function
            return mpmath.eval(function_str, locals=context)
            
        return func
        
    def zoom(self, factor):
        """Zoom in or out by the specified factor"""
        mid_x = sum(self.x_range) / 2
        mid_y = sum(self.y_range) / 2
        
        half_width_x = (self.x_range[1] - self.x_range[0]) / 2 * factor
        half_width_y = (self.y_range[1] - self.y_range[0]) / 2 * factor
        
        self.x_range = (mid_x - half_width_x, mid_x + half_width_x)
        self.y_range = (mid_y - half_width_y, mid_y + half_width_y)
        
    def pan(self, x_shift, y_shift):
        """Pan the graph by the specified amount"""
        x_span = self.x_range[1] - self.x_range[0]
        y_span = self.y_range[1] - self.y_range[0]
        
        x_move = x_span * x_shift
        y_move = y_span * y_shift
        
        self.x_range = (self.x_range[0] + x_move, self.x_range[1] + x_move)
        self.y_range = (self.y_range[0] + y_move, self.y_range[1] + y_move)
        
    def generate_graph(self):
        """Generate ASCII graph for all active functions"""
        if not self.functions:
            return ["No functions to graph"]
            
        # Create empty graph grid
        grid = [[' ' for _ in range(self.width)] for _ in range(self.height)]
        
        # Calculate x and y coordinates for each point in the grid
        x_step = (self.x_range[1] - self.x_range[0]) / (self.width - 1)
        y_step = (self.y_range[1] - self.y_range[0]) / (self.height - 1)
        
        # Mark axes if they're in range
        self._draw_axes(grid, x_step, y_step)
        
        # Plot each function
        for func_data in self.functions:
            if not func_data['visible']:
                continue
                
            function = func_data['function']
            color = func_data['color']
            
            # Plot the function
            for i in range(self.width):
                x = self.x_range[0] + i * x_step
                try:
                    y = float(function(x))
                    if not (mpmath.isnan(y) or mpmath.isinf(y)):
                        # Convert y coordinate to grid position
                        y_pos = self.height - 1 - int((y - self.y_range[0]) / y_step)
                        if 0 <= y_pos < self.height:
                            grid[y_pos][i] = color
                except:
                    # Skip points where function can't be evaluated
                    continue
        
        # Convert grid to lines of text
        lines = [''.join(row) for row in grid]
        
        # Add border
        bordered = ['╭' + '─' * self.width + '╮']
        for line in lines:
            bordered.append('│' + line + '│')
        bordered.append('╰' + '─' * self.width + '╯')
        
        return bordered
        
    def _draw_axes(self, grid, x_step, y_step):
        """Draw coordinate axes if they're in range"""
        # Draw y-axis
        if self.x_range[0] <= 0 <= self.x_range[1]:
            x_pos = int(abs(self.x_range[0]) / x_step)
            if 0 <= x_pos < self.width:
                for i in range(self.height):
                    grid[i][x_pos] = '|'
                    
        # Draw x-axis
        if self.y_range[0] <= 0 <= self.y_range[1]:
            y_pos = self.height - 1 - int(abs(self.y_range[0]) / y_step)
            if 0 <= y_pos < self.height:
                for i in range(self.width):
                    grid[y_pos][i] = '-'
                    
        # Mark origin
        if (self.x_range[0] <= 0 <= self.x_range[1] and 
            self.y_range[0] <= 0 <= self.y_range[1]):
            x_pos = int(abs(self.x_range[0]) / x_step)
            y_pos = self.height - 1 - int(abs(self.y_range[0]) / y_step)
            if (0 <= x_pos < self.width and 0 <= y_pos < self.height):
                grid[y_pos][x_pos] = '+'