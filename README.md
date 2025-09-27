# MegaCalc - Advanced ASCII Calculator

An advanced calculator application with a beautiful ASCII interface that supports graphing functions, high-precision arithmetic, and extensive mathematical operations.

![MegaCalc Demo](./demo.png)

## Features

- 📊 **Graphing Capabilities**: Plot functions in both simple and advanced modes
- 🔢 **High Precision**: Configure up to 50 decimal places of precision
- 🧮 **Gigantic Math**: Handle extremely large calculations with ease
- 🌓 **Theme Options**: Choose between light and dark mode
- 🎛️ **Intuitive Interface**: Simple ASCII-based UI with easy navigation
- 🔀 **Multiple Modes**: Toggle between simple and advanced modes instantly

## Installation

```bash
# Clone the repository
git clone https://github.com/navuxneeth/MegaCalc.git
cd MegaCalc

# Install dependencies
pip install -r requirements.txt

# Run the calculator
python main.py
```

## Usage

### Basic Operation

Navigate through the interface using the arrow keys and Enter. Use Tab to switch between sections.

### Calculation Mode

- Enter mathematical expressions directly
- Adjust decimal precision using the slider
- Access history with up/down arrows

### Graphing Mode

- Enter functions to plot (e.g., `x^2`, `sin(x)`)
- Use +/- keys to zoom in/out
- Toggle between different graph styles with Tab
- Switch colors with number keys (1-9)

## Preview

```
┌────────────────────────────────────────────────────────────────────────────┐
│ MegaCalc v1.0                                          [Simple] [🌙 Dark]   │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  Expression: sin(x) + cos(x)                                               │
│                                                                            │
│  Result: 0.3010299956639811952137388947244930267681898814621085413         │
│                                                                            │
│  Precision: [-------|-------------------------------] 15 decimal places    │
│                                                                            │
│                           ╭                 ╮                              │
│                           |    ****         |                              │
│                           |  **    **       |                              │
│                           | *        *      |                              │
│                           |*          *     |                              │
│             y-axis        |            *    |                              │
│               ^           |             *   |                              │
│               |           |              ** |                              │
│     <---------+---------> |                *|                              │
│              0|x-axis     |               * |                              │
│               |           |              *  |                              │
│               |           |             *   |                              │
│               |           |            *    |                              │
│                           |           *     |                              │
│                           |          *      |                              │
│                           |        **       |                              │
│                           |    ****         |                              │
│                           ╰                 ╯                              │
│                                                                            │
│  [Calculate]  [Graph]  [Settings]  [Help]  [Exit]                         │
└────────────────────────────────────────────────────────────────────────────┘
```

## Dependencies

- mpmath - For high-precision arithmetic
- blessed - Terminal interface library
- numpy - Numerical operations
- ascii_graph - ASCII-based graphing

**Made by Navaneeth Sankar K P** [Linkedin](https://www.linkedin.com/in/navaneeth-sankar-k-p)
## License

This project is licensed under the MIT License - see the LICENSE file for details.
