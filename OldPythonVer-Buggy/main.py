#!/usr/bin/env python3
"""
MegaCalc - Advanced ASCII Calculator
Entry point for the calculator application
"""

import sys
import os
import argparse
from decimal import getcontext

from ui import CalculatorUI
from calculator import Calculator
from graphing import Grapher
from config import Config

def parse_args():
    """Parse command-line arguments"""
    parser = argparse.ArgumentParser(description="MegaCalc - Advanced ASCII Calculator")
    parser.add_argument('--dark', action='store_true', help="Start in dark mode")
    parser.add_argument('--precision', type=int, default=15, 
                        help="Default decimal precision (1-50)")
    parser.add_argument('--graph', action='store_true', 
                        help="Start in graph mode")
    parser.add_argument('--advanced', action='store_true', 
                        help="Start in advanced mode")
    return parser.parse_args()

def main():
    """Main entry point for the application"""
    args = parse_args()
    
    # Setup configuration
    config = Config()
    config.dark_mode = args.dark
    config.precision = max(1, min(50, args.precision))
    config.graph_mode = args.graph
    config.advanced_mode = args.advanced
    
    # Initialize calculator components
    calculator = Calculator(config)
    grapher = Grapher(config)
    
    # Start the UI
    ui = CalculatorUI(calculator, grapher, config)
    try:
        ui.run()
    except KeyboardInterrupt:
        print("\nExiting MegaCalc. Goodbye!")
    except Exception as e:
        print(f"An error occurred: {e}")
        return 1
        
    return 0

if __name__ == "__main__":
    sys.exit(main())