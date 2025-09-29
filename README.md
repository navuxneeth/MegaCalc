# PixelCalc

A retro-styled, advanced calculator web application with graphing capabilities.

<img width="653" height="586" alt="image" src="https://github.com/user-attachments/assets/c41ecc68-a760-4e6d-8ebc-06af82471123" />
<img width="662" height="732" alt="image" src="https://github.com/user-attachments/assets/33dcbfa1-66c2-4b1c-9a6e-f89ffe2d50f1" />
<img width="561" height="546" alt="image" src="https://github.com/user-attachments/assets/49e9a2ac-d20b-41d1-9099-15ff249a09c2" />

## Features

- 8-bit pixel font style with an old-school LCD display look
- Multiple operation modes:
  - **Simple Mode**: Basic calculator operations
  - **Advanced Mode**: Scientific calculator functions
  - **Graph Mode**: Plot multiple functions with customizable colors
- High precision calculations (up to 50 decimal places)
- Self-contained with no external dependencies
- Customizable decimal precision with slider
- Calculation history with clear history option
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
- Supports complex mathematical functions (sin, cos, tan, log, exp, etc.)
- Customizable line colors for each equation
- Adjustable x and y ranges
- Zoom in/out functionality
- Grid with labeled axes
- Input validation and error handling

## How to Use

1. Open `index.html` in any modern web browser. It's within the HTMLversion folder.
2. Switch between modes using the buttons at the top
3. Adjust decimal precision using the slider
4. Toggle between light and dark themes using the switch in the upper right
5. View calculation history using "Show History" button
6. Clear calculation history using "Clear History" button

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
- Self-contained with simplified BigNumber implementation for high-precision arithmetic
- Custom Math expression parser for graphing functionality
- No external dependencies or CDN requirements
- No build process required - just open in a browser
- Works offline once loaded

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

Code assist by [Claude](https://claude.ai/login?returnTo=%2F%3F) 3.7 Thinking and 4 Sonnet
