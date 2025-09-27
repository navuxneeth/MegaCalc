"""
Configuration module for MegaCalc
Handles user preferences and settings
"""

import os
import json

class Config:
    """
    Configuration class for managing application settings
    """
    
    def __init__(self, config_file=None):
        """Initialize with default settings or load from file"""
        self.config_file = config_file or os.path.expanduser('~/.megacalc.json')
        
        # Default settings
        self.dark_mode = True
        self.precision = 15  # Default decimal precision
        self.graph_mode = False  # Start in calculator mode by default
        self.advanced_mode = False  # Start in simple mode by default
        self.history_limit = 100  # Max number of history entries to keep
        
        # Try to load config from file
        self.load()
    
    def load(self):
        """Load configuration from file"""
        try:
            if os.path.exists(self.config_file):
                with open(self.config_file, 'r') as f:
                    config_data = json.load(f)
                    
                    # Apply loaded settings
                    self.dark_mode = config_data.get('dark_mode', self.dark_mode)
                    self.precision = config_data.get('precision', self.precision)
                    self.graph_mode = config_data.get('graph_mode', self.graph_mode)
                    self.advanced_mode = config_data.get('advanced_mode', self.advanced_mode)
                    self.history_limit = config_data.get('history_limit', self.history_limit)
                    
                    # Ensure precision is within valid range
                    self.precision = max(1, min(50, self.precision))
        except Exception as e:
            # If loading fails, use defaults
            print(f"Could not load config: {e}")
    
    def save(self):
        """Save configuration to file"""
        try:
            config_data = {
                'dark_mode': self.dark_mode,
                'precision': self.precision,
                'graph_mode': self.graph_mode,
                'advanced_mode': self.advanced_mode,
                'history_limit': self.history_limit
            }
            
            with open(self.config_file, 'w') as f:
                json.dump(config_data, f, indent=2)
                
        except Exception as e:
            print(f"Could not save config: {e}")