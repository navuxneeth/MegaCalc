"""
Calculator module for MegaCalc
Handles all calculation functionality with support for high precision
"""

import re
import math
from decimal import Decimal, getcontext
import mpmath

class Calculator:
    """
    Advanced calculator with support for high precision and large numbers
    """
    
    def __init__(self, config):
        """Initialize the calculator with configuration"""
        self.config = config
        self.history = []
        self.variables = {
            'pi': mpmath.mpf(mpmath.pi),
            'e': mpmath.mpf(mpmath.e),
            'phi': mpmath.mpf((1 + mpmath.sqrt(5)) / 2),  # Golden ratio
        }
        self.set_precision(config.precision)
        
    def set_precision(self, precision):
        """Set the decimal precision"""
        precision = max(1, min(50, precision))
        self.config.precision = precision
        mpmath.mp.dps = precision
        getcontext().prec = precision + 10  # Extra buffer
        
    def evaluate(self, expression):
        """Evaluate a mathematical expression with high precision"""
        if not expression:
            return None
            
        # Save to history
        self.history.append(expression)
        
        try:
            # Clean and prepare the expression
            expression = self._prepare_expression(expression)
            
            # Create a context with our variables and functions
            context = {**self.variables}
            
            # Add mathematical functions
            for func_name in dir(mpmath):
                if callable(getattr(mpmath, func_name)) and not func_name.startswith('_'):
                    context[func_name] = getattr(mpmath, func_name)
            
            # Evaluate using mpmath
            result = mpmath.eval(expression, locals=context)
            
            # Format the result according to current precision
            if isinstance(result, (mpmath.mpf, mpmath.mpc)):
                return result
            return mpmath.mpf(result)
            
        except Exception as e:
            return f"Error: {str(e)}"
            
    def _prepare_expression(self, expr):
        """Prepare expression for evaluation"""
        # Replace '^' with '**' for exponentiation
        expr = expr.replace('^', '**')
        
        # Replace common abbreviations
        expr = expr.replace('ans', 'self.history[-1]' if self.history else '0')
        
        return expr
        
    def format_result(self, result):
        """Format the result based on current precision settings"""
        if isinstance(result, str):
            return result
            
        try:
            # Handle complex numbers
            if isinstance(result, mpmath.mpc):
                real = mpmath.nstr(result.real, n=self.config.precision)
                imag = mpmath.nstr(result.imag, n=self.config.precision)
                if float(imag) >= 0:
                    return f"{real} + {imag}i"
                return f"{real} - {abs(float(imag))}i"
                
            # Format with current precision
            return mpmath.nstr(result, n=self.config.precision)
        except Exception as e:
            return f"Display Error: {str(e)}"
            
    def is_valid_expression(self, expression):
        """Check if an expression is syntactically valid"""
        if not expression:
            return False
            
        try:
            # Simple validation attempt - this doesn't catch all errors
            expression = self._prepare_expression(expression)
            compile(expression, '<string>', 'eval')
            return True
        except:
            return False