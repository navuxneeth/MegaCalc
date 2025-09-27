# PixelCalc

A retro-styled, advanced calculator web application with graphing capabilities.
<img width="653" height="586" alt="image" src="https://github.com/user-attachments/assets/c41ecc68-a760-4e6d-8ebc-06af82471123" />
<img width="662" height="732" alt="image" src="https://github.com/user-attachments/assets/33dcbfa1-66c2-4b1c-9a6e-f89ffe2d50f1" />
<img width="641" height="841" alt="image" src="https://github.com/user-attachments/assets/f953f053-8675-4ed9-b541-a7e50b57a98f" />

## Features

- 8-bit pixel font style with an old-school LCD display look
- Multiple operation modes:
  - **Simple Mode**: Basic calculator operations
  - **Advanced Mode**: Scientific calculator functions
  - **Graph Mode**: Plot multiple functions with customizable colors
- High precision calculations (up to 50 decimal places)
- Support for very large numbers using BigNumber.js
- Customizable decimal precision with slider
- Dark/light theme toggle
- Responsive design for all screen sizes

## Modes

### Simple Calculator Mode
- Basic arithmetic operations (+, -, ×, ÷)
- Percentage calculations
- Clear and backspace functionality
- Positive/negative toggle

### Advanced Calculator Mode
- All simple mode functions
- Trigonometric functions (sin, cos, tan)
- Logarithmic functions (log, ln)
- Powers (x², x³, xʸ)
- Roots (√, ∛)
- Constants (π, e)
- Memory functions (MC, MR, M+, M-)
- Factorial, absolute value, reciprocal
- Random number generation

### Graph Mode
- Plot multiple equations simultaneously
- Customizable line colors for each equation
- Adjustable x and y ranges
- Zoom in/out functionality
- Grid with labeled axes

## How to Use

1. Open `index.html` in any modern web browser. It's within the HTMLversion folder.
2. Switch between modes using the buttons at the top
3. Adjust decimal precision using the slider
4. Toggle between light and dark themes using the switch in the upper right

### Keyboard Support

When in Simple or Advanced mode:
- Numbers: 0-9
- Decimal point: .
- Operators: +, -, *, /
- Enter or = to calculate
- Escape to clear
- Backspace to delete the last digit

## Technical Details

- Built with vanilla JavaScript, HTML, and CSS
- Uses BigNumber.js for high-precision arithmetic
- Uses Math.js for parsing and evaluating mathematical expressions in graphing mode
- No build process required - just open in a browser

## Browser Compatibility

PixelCalc works in all modern browsers including:
- Chrome/ Chromium-based (recommended)
- Firefox
- Safari
- Edge

## Installation

Simply clone this repository and open `index.html` in a web browser:

```bash
git clone https://github.com/navuxneeth/PixelCalc.git
cd PixelCalc
```

## License

MIT License

Made by Navaneeth Sankar K P [Linkedin](https://www.linkedin.com/in/navaneeth-sankar-k-p)
