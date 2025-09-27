"""
UI module for MegaCalc
Handles ASCII-based user interface rendering and interaction
"""

import os
import sys
import time
from blessed import Terminal

class CalculatorUI:
    """
    ASCII-based UI for the calculator application
    """
    
    def __init__(self, calculator, grapher, config):
        """Initialize the UI with calculator, grapher and config"""
        self.calculator = calculator
        self.grapher = grapher
        self.config = config
        self.term = Terminal()
        self.current_input = ""
        self.current_result = ""
        self.input_history_pos = 0
        self.cursor_pos = 0
        self.mode = "calculate" if not config.graph_mode else "graph"
        self.selected_button = 0
        self.buttons = ["Calculate", "Graph", "Settings", "Help", "Exit"]
        self.menu_active = False
        
    def run(self):
        """Main UI loop"""
        with self.term.fullscreen(), self.term.cbreak(), self.term.hidden_cursor():
            self._render()
            
            while True:
                key = self.term.inkey()
                
                # Handle exit
                if key == '\x1b' or (key.name == 'KEY_ESCAPE'):  # Escape key
                    if self.menu_active:
                        self.menu_active = False
                    else:
                        # Confirm exit
                        if self._confirm_exit():
                            break
                
                # Handle input
                elif self.menu_active:
                    self._handle_menu_input(key)
                elif self.mode == "calculate":
                    self._handle_calculate_input(key)
                elif self.mode == "graph":
                    self._handle_graph_input(key)
                
                # Re-render the UI
                self._render()
    
    def _render(self):
        """Render the complete UI"""
        # Clear the screen
        print(self.term.clear(), end='')
        
        # Get terminal dimensions
        height, width = self.term.height, self.term.width
        
        # Determine colors based on mode
        if self.config.dark_mode:
            border_color = self.term.white
            text_color = self.term.white
            highlight_color = self.term.bright_white_on_blue
            input_color = self.term.bright_white
            result_color = self.term.bright_green
        else:
            border_color = self.term.black
            text_color = self.term.black
            highlight_color = self.term.black_on_bright_white
            input_color = self.term.bright_black
            result_color = self.term.green
        
        # Draw header
        mode_text = "Advanced" if self.config.advanced_mode else "Simple"
        theme_text = "🌙 Dark" if self.config.dark_mode else "☀️ Light"
        header = f" MegaCalc v1.0{' ' * (width - 28)}[{mode_text}] [{theme_text}] "
        
        # Draw top border with header
        print(border_color + "┌" + "─" * (width - 2) + "┐")
        print(border_color + "│" + text_color + header + border_color + "│")
        print(border_color + "├" + "─" * (width - 2) + "┤")
        
        # Draw content based on mode
        if self.mode == "calculate":
            self._render_calculator(width, height, text_color, input_color, result_color, border_color)
        elif self.mode == "graph":
            self._render_grapher(width, height, text_color, input_color, result_color, border_color)
        elif self.mode == "settings":
            self._render_settings(width, height, text_color, input_color, highlight_color, border_color)
        elif self.mode == "help":
            self._render_help(width, height, text_color, border_color)
        
        # Draw buttons
        button_line = " "
        for i, button in enumerate(self.buttons):
            if i == self.selected_button:
                button_line += highlight_color + f"[{button}]" + text_color + "  "
            else:
                button_line += f"[{button}]  "
        
        # Draw bottom border
        print(border_color + "│" + text_color + button_line + " " * (width - len(button_line) - 2) + border_color + "│")
        print(border_color + "└" + "─" * (width - 2) + "┘")
        
        # Flush output
        sys.stdout.flush()
    
    def _render_calculator(self, width, height, text_color, input_color, result_color, border_color):
        """Render calculator mode UI"""
        # Empty line for spacing
        print(border_color + "│" + " " * (width - 2) + border_color + "│")
        
        # Input area
        input_text = f" Expression: {input_color}{self.current_input}"
        print(border_color + "│" + text_color + input_text + " " * (width - len(input_text) - 2) + border_color + "│")
        
        # Empty line for spacing
        print(border_color + "│" + " " * (width - 2) + border_color + "│")
        
        # Result area
        result_text = f" Result: {result_color}{self.current_result}"
        print(border_color + "│" + text_color + result_text + " " * (width - len(result_text) - 2) + border_color + "│")
        
        # Empty line for spacing
        print(border_color + "│" + " " * (width - 2) + border_color + "│")
        
        # Precision slider
        slider_width = 40
        slider_pos = int((self.config.precision / 50) * slider_width)
        slider = f" Precision: [{'-' * slider_pos}|{'-' * (slider_width - slider_pos - 1)}] {self.config.precision} decimal places"
        print(border_color + "│" + text_color + slider + " " * (width - len(slider) - 2) + border_color + "│")
        
        # Empty space for the graph area (will show preview or history here)
        print(border_color + "│" + " " * (width - 2) + border_color + "│")
        
        # Show calculation history
        history_lines = min(height - 17, len(self.calculator.history))
        if history_lines > 0:
            print(border_color + "│" + text_color + " Recent Calculations:" + " " * (width - 21) + border_color + "│")
            for i in range(history_lines):
                idx = len(self.calculator.history) - i - 1
                if idx >= 0:
                    hist_item = f" {i+1}. {self.calculator.history[idx]}"
                    print(border_color + "│" + text_color + hist_item + " " * (width - len(hist_item) - 2) + border_color + "│")
        
        # Fill remaining space
        for _ in range(height - 17 - history_lines):
            print(border_color + "│" + " " * (width - 2) + border_color + "│")
    
    def _render_grapher(self, width, height, text_color, input_color, result_color, border_color):
        """Render grapher mode UI"""
        # Empty line for spacing
        print(border_color + "│" + " " * (width - 2) + border_color + "│")
        
        # Function input
        input_text = f" Function: {input_color}{self.current_input}"
        print(border_color + "│" + text_color + input_text + " " * (width - len(input_text) - 2) + border_color + "│")
        
        # Range display
        range_text = f" X: [{self.grapher.x_range[0]}, {self.grapher.x_range[1]}]  Y: [{self.grapher.y_range[0]}, {self.grapher.y_range[1]}]"
        print(border_color + "│" + text_color + range_text + " " * (width - len(range_text) - 2) + border_color + "│")
        
        # Empty line
        print(border_color + "│" + " " * (width - 2) + border_color + "│")
        
        # Generate and display graph
        graph = self.grapher.generate_graph()
        for line in graph:
            padded_line = " " + line + " " * (width - len(line) - 3)
            print(border_color + "│" + text_color + padded_line + border_color + "│")
        
        # Function list
        print(border_color + "│" + " " * (width - 2) + border_color + "│")
        func_text = " Functions: " + ", ".join([f"{i+1}: {f['expression']} ({f['color']})" 
                                             for i, f in enumerate(self.grapher.functions)])
        if func_text and len(func_text) > width - 4:
            func_text = func_text[:width - 7] + "..."
        print(border_color + "│" + text_color + func_text + " " * (width - len(func_text) - 2) + border_color + "│")
        
        # Help text
        help_text = " [+/-]: Zoom  [←→↑↓]: Pan  [c]: Change color  [d]: Delete function"
        print(border_color + "│" + text_color + help_text + " " * (width - len(help_text) - 2) + border_color + "│")
        
        # Fill remaining space
        remaining_lines = height - 14 - len(graph)
        for _ in range(remaining_lines):
            print(border_color + "│" + " " * (width - 2) + border_color + "│")
    
    def _render_settings(self, width, height, text_color, input_color, highlight_color, border_color):
        """Render settings mode UI"""
        # Empty line for spacing
        print(border_color + "│" + " " * (width - 2) + border_color + "│")
        
        # Settings title
        print(border_color + "│" + text_color + " Settings" + " " * (width - 10) + border_color + "│")
        print(border_color + "│" + " " * (width - 2) + border_color + "│")
        
        # Theme setting
        theme_text = f" 1. Theme: {'Dark Mode' if self.config.dark_mode else 'Light Mode'}"
        print(border_color + "│" + text_color + theme_text + " " * (width - len(theme_text) - 2) + border_color + "│")
        
        # Mode setting
        mode_text = f" 2. Mode: {'Advanced' if self.config.advanced_mode else 'Simple'}"
        print(border_color + "│" + text_color + mode_text + " " * (width - len(mode_text) - 2) + border_color + "│")
        
        # Precision setting
        precision_text = f" 3. Default Precision: {self.config.precision} decimal places"
        print(border_color + "│" + text_color + precision_text + " " * (width - len(precision_text) - 2) + border_color + "│")
        
        # Help text
        help_text = " Press the number to change the setting"
        print(border_color + "│" + text_color + help_text + " " * (width - len(help_text) - 2) + border_color + "│")
        
        # Fill remaining space
        for _ in range(height - 13):
            print(border_color + "│" + " " * (width - 2) + border_color + "│")
    
    def _render_help(self, width, height, text_color, border_color):
        """Render help mode UI"""
        # Help content
        help_content = [
            "MegaCalc Help",
            "",
            "General Keys:",
            "- TAB: Navigate between sections",
            "- Enter: Submit input/Select button",
            "- Escape: Cancel/Back/Exit",
            "",
            "Calculator Mode:",
            "- Enter mathematical expressions (e.g., '2 + 2', 'sin(pi/4)')",
            "- Left/Right arrow: Change precision",
            "- Up/Down arrow: Navigate history",
            "",
            "Graph Mode:",
            "- Enter functions to plot (e.g., 'x^2', 'sin(x)')",
            "- +/-: Zoom in/out",
            "- Arrow keys: Pan the graph",
            "- c: Change color for new functions",
            "- d: Delete the last function",
            "",
            "Settings:",
            "- 1: Toggle dark/light mode",
            "- 2: Toggle simple/advanced mode",
            "- 3: Change default precision",
            "",
            "Press any key to return to previous screen"
        ]
        
        # Empty line for spacing
        print(border_color + "│" + " " * (width - 2) + border_color + "│")
        
        # Display help content
        for line in help_content[:height - 8]:
            text = f" {line}"
            print(border_color + "│" + text_color + text + " " * (width - len(text) - 2) + border_color + "│")
        
        # Fill remaining space
        for _ in range(height - 8 - len(help_content[:height - 8])):
            print(border_color + "│" + " " * (width - 2) + border_color + "│")
    
    def _handle_calculate_input(self, key):
        """Handle input in calculator mode"""
        if key.is_sequence:
            if key.name == 'KEY_ENTER':
                # Submit calculation
                if self.current_input:
                    result = self.calculator.evaluate(self.current_input)
                    self.current_result = self.calculator.format_result(result)
                    self.current_input = ""
            elif key.name == 'KEY_LEFT':
                # Decrease precision
                self.calculator.set_precision(max(1, self.config.precision - 1))
            elif key.name == 'KEY_RIGHT':
                # Increase precision
                self.calculator.set_precision(min(50, self.config.precision + 1))
            elif key.name == 'KEY_UP':
                # Navigate history up
                if self.calculator.history and self.input_history_pos < len(self.calculator.history):
                    self.input_history_pos += 1
                    self.current_input = self.calculator.history[-self.input_history_pos]
            elif key.name == 'KEY_DOWN':
                # Navigate history down
                if self.input_history_pos > 1:
                    self.input_history_pos -= 1
                    self.current_input = self.calculator.history[-self.input_history_pos]
                else:
                    self.input_history_pos = 0
                    self.current_input = ""
            elif key.name == 'KEY_BACKSPACE':
                # Delete character
                if self.current_input:
                    self.current_input = self.current_input[:-1]
            elif key.name == 'KEY_TAB':
                # Navigate buttons
                self.selected_button = (self.selected_button + 1) % len(self.buttons)
        else:
            # Add character to input
            self.current_input += key
            self.input_history_pos = 0
    
    def _handle_graph_input(self, key):
        """Handle input in graph mode"""
        if key.is_sequence:
            if key.name == 'KEY_ENTER':
                # Add function to graph
                if self.current_input:
                    if self.grapher.add_function(self.current_input):
                        self.current_input = ""
            elif key.name == 'KEY_LEFT':
                # Pan left
                self.grapher.pan(-0.1, 0)
            elif key.name == 'KEY_RIGHT':
                # Pan right
                self.grapher.pan(0.1, 0)
            elif key.name == 'KEY_UP':
                # Pan up
                self.grapher.pan(0, 0.1)
            elif key.name == 'KEY_DOWN':
                # Pan down
                self.grapher.pan(0, -0.1)
            elif key.name == 'KEY_BACKSPACE':
                # Delete character
                if self.current_input:
                    self.current_input = self.current_input[:-1]
            elif key.name == 'KEY_TAB':
                # Navigate buttons
                self.selected_button = (self.selected_button + 1) % len(self.buttons)
        elif key == '+':
            # Zoom in
            self.grapher.zoom(0.8)
        elif key == '-':
            # Zoom out
            self.grapher.zoom(1.25)
        elif key == 'c':
            # Change color
            self.grapher.current_color_idx = (self.grapher.current_color_idx + 1) % len(self.grapher.colors)
        elif key == 'd':
            # Delete last function
            if self.grapher.functions:
                self.grapher.functions.pop()
        else:
            # Add character to input
            self.current_input += key
    
    def _handle_menu_input(self, key):
        """Handle input in the menu"""
        self.menu_active = False  # Close menu after any action
        
        if key == '1':
            # Toggle theme
            self.config.dark_mode = not self.config.dark_mode
        elif key == '2':
            # Toggle mode
            self.config.advanced_mode = not self.config.advanced_mode
        elif key == '3':
            # Open precision settings
            self._prompt_precision()
    
    def _confirm_exit(self):
        """Confirm if the user wants to exit"""
        width, height = self.term.width, self.term.height
        
        # Draw confirmation box
        box_width = 40
        box_height = 5
        box_x = (width - box_width) // 2
        box_y = (height - box_height) // 2
        
        # Clear area for the box
        for i in range(box_height):
            print(self.term.move(box_y + i, box_x) + " " * box_width)
        
        # Draw box
        print(self.term.move(box_y, box_x) + "┌" + "─" * (box_width - 2) + "┐")
        print(self.term.move(box_y + 1, box_x) + "│" + " " * (box_width - 2) + "│")
        print(self.term.move(box_y + 2, box_x) + "│  Are you sure you want to exit? (y/n)  │")
        print(self.term.move(box_y + 3, box_x) + "│" + " " * (box_width - 2) + "│")
        print(self.term.move(box_y + 4, box_x) + "└" + "─" * (box_width - 2) + "┘")
        
        # Get response
        while True:
            key = self.term.inkey()
            if key.lower() == 'y':
                return True
            elif key.lower() == 'n' or key.name == 'KEY_ESCAPE':
                return False
    
    def _prompt_precision(self):
        """Prompt for precision setting"""
        width, height = self.term.width, self.term.height
        
        # Draw prompt box
        box_width = 50
        box_height = 5
        box_x = (width - box_width) // 2
        box_y = (height - box_height) // 2
        
        # Clear area for the box
        for i in range(box_height):
            print(self.term.move(box_y + i, box_x) + " " * box_width)
        
        # Draw box
        print(self.term.move(box_y, box_x) + "┌" + "─" * (box_width - 2) + "┐")
        print(self.term.move(box_y + 1, box_x) + "│" + " " * (box_width - 2) + "│")
        print(self.term.move(box_y + 2, box_x) + "│  Enter precision (1-50): " + " " * 23 + "│")
        print(self.term.move(box_y + 3, box_x) + "│" + " " * (box_width - 2) + "│")
        print(self.term.move(box_y + 4, box_x) + "└" + "─" * (box_width - 2) + "┘")
        
        # Get input
        input_text = ""
        cursor_pos = box_x + 26
        print(self.term.move(box_y + 2, cursor_pos), end='')
        
        while True:
            key = self.term.inkey()
            if key.is_sequence:
                if key.name == 'KEY_ENTER':
                    try:
                        value = int(input_text)
                        if 1 <= value <= 50:
                            self.calculator.set_precision(value)
                            break
                    except:
                        pass
                elif key.name == 'KEY_ESCAPE':
                    break
                elif key.name == 'KEY_BACKSPACE' and input_text:
                    input_text = input_text[:-1]
                    print(self.term.move(box_y + 2, cursor_pos) + input_text + " ", end='')
                    cursor_pos = box_x + 26 + len(input_text)
            elif key.isdigit() and len(input_text) < 2:
                input_text += key
                print(self.term.move(box_y + 2, cursor_pos) + input_text, end='')
                cursor_pos = box_x + 26 + len(input_text)
            
            # Move cursor back to input position
            print(self.term.move(box_y + 2, cursor_pos), end='')
            sys.stdout.flush()