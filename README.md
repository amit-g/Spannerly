# Spannerly

[![Deploy to GitHub Pages](https://github.com/amit-g/Spannerly/actions/workflows/deploy.yml/badge.svg)](https://github.com/amit-g/Spannerly/actions/workflows/deploy.yml)

A collection of useful web-based tools and utilities built with Next.js, TypeScript, and Material-UI.

## 🤖 AI-Powered Development

> **Important Note**: A significant portion of the code in this repository (~90%) has been generated using AI technologies, specifically GitHub Copilot and other AI coding assistants. This project serves as a demonstration of:

- **AI Code Generation Capabilities**: Showcasing how modern AI can create complex, production-ready applications
- **Learning Tool**: Demonstrating best practices in React, TypeScript, and modern web development through AI-generated examples
- **AI-Human Collaboration**: Illustrating the powerful combination of AI assistance and human guidance in software development
- **Rapid Prototyping**: Showing how AI can accelerate the development process while maintaining code quality

This repository is intended for:
- **Educational purposes** - Learning modern web development patterns and practices
- **AI demonstration** - Showcasing the current capabilities of AI in software development
- **Code reference** - Providing examples of well-structured React/TypeScript applications
- **Experimentation** - Testing and exploring AI-generated code in real-world scenarios

The project demonstrates that AI can produce maintainable, scalable, and well-architected code when properly guided, while also highlighting the importance of human oversight in software development.

## Features

### Implemented Tools
- **Text Tools**: Case conversion, Base64 encoding/decoding, string escape utilities, quote utilities
- **Unit Converters**: Length, temperature, weight, area, volume, time, and **real-time currency conversion**
- **Date & Time Tools**: Japan time display, timezone conversion  
- **Image Tools**: Base64 to image conversion
- **Random Generators**: Password generator, UUID generator, Lorem Ipsum generator, random numbers/strings/colors
- **String Utilities**: Text joiner/splitter, slug generator, case conversion
- **Converters**: HTML/URL encoding, JSON↔XML, number base conversion
- **Validators**: JSON and CSS validation
- **Cryptography**: Hash generation, AES/RSA encryption, Base64 encryption
- **Calculators**: Basic calculator with scientific functions
- **Miscellaneous**: **ASCII art generator** with figlet.js integration

### User Experience Features
- **Placeholder System**: Professional "under development" messages for tools not yet implemented
- **Categorized Navigation**: Filter tools by category and subcategory
- **Real-time API Integration**: Live currency exchange rates via fawazahmed0/exchange-api
- **Theme Customization**: Multiple color schemes and dark/light mode
- **Persistent Settings**: Theme preferences saved locally
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Search Functionality**: Find tools quickly with the search bar

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **UI Library**: Material-UI (MUI) with custom theming
- **State Management**: Redux Toolkit
- **Testing**: Jest with React Testing Library
- **External APIs**: fawazahmed0/exchange-api for real-time currency rates
- **ASCII Art**: figlet.js for text-to-ASCII conversion
- **Deployment**: GitHub Pages with automated CI/CD
- **Development**: AI-assisted coding with GitHub Copilot and other AI tools

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/amit-g/Spannerly.git
cd Spannerly
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run export` - Export static files for deployment

## Deployment

This application is designed to be deployment-agnostic and can be hosted anywhere without code changes.

### Environment Variables

The application uses environment variables to configure deployment paths:

- `NEXT_PUBLIC_BASE_PATH` - Sets the base path for the application (e.g., `/Spannerly` for GitHub Pages)
- `BASE_PATH` - Alternative environment variable name for the same purpose

### Local Development

For local development, no environment variables are needed:

```bash
npm run dev
```

The application will run at `http://localhost:3000` with no base path.

### GitHub Pages Deployment

The application automatically deploys to GitHub Pages via GitHub Actions. The workflow:

1. Builds the application with `NEXT_PUBLIC_BASE_PATH` set to the repository name
2. Generates static files optimized for GitHub Pages
3. Deploys to `https://username.github.io/repository-name`

### Custom Deployment

For deployment to other platforms or custom paths:

```bash
# Set the base path for your deployment
export NEXT_PUBLIC_BASE_PATH="/your-custom-path"
npm run build

# Or for Windows PowerShell
$env:NEXT_PUBLIC_BASE_PATH="/your-custom-path"
npm run build
```

### Supported Deployment Platforms

- **GitHub Pages** (automatic via GitHub Actions)
- **Vercel** (zero config)
- **Netlify** (static export)
- **AWS S3 + CloudFront**
- **Any static hosting service**

## Project Structure

```
src/
├── components/          # React components
│   ├── common/         # Reusable components
│   ├── layout/         # Layout components
│   ├── pages/          # Page components
│   └── tools/          # Tool-specific components
├── services/           # Business logic services
├── store/              # Redux store and slices
├── types/              # TypeScript type definitions
└── styles/             # Global styles
```

## Architecture

### Services Layer
Each tool capability is implemented as a service with a defined interface:
- `TextService` - Text manipulation capabilities
- `MeasurementService` - Unit conversion capabilities  
- `CurrencyService` - **Real-time currency conversion with API integration and caching**
- `DateTimeService` - Date and time utilities
- `ImageService` - Image processing capabilities
- `AsciiArtService` - **ASCII art generation using figlet.js with multiple fonts**
- `RandomGeneratorsService` - Random data generation (passwords, UUIDs, etc.)
- `StringUtilitiesService` - String manipulation and formatting utilities
- `CryptographyService` - Encryption, decryption, and hash generation

### Component Structure
- **Tool Components**: Individual tool implementations
- **Service Integration**: Tools use service layer for business logic
- **State Management**: Redux for global state management
- **Material-UI**: Consistent design system
- **Placeholder System**: Graceful handling of unimplemented tools with informative messages

### Recent Improvements
- **Real-time Currency Conversion**: Integrated fawazahmed0/exchange-api for live exchange rates with smart caching and fallback mechanisms
- **ASCII Art Generation**: Added figlet.js integration with multiple font options and proper browser compatibility
- **Placeholder Tool System**: Professional "under development" messages for tools not yet implemented, showing planned features and categories
- **Enhanced Error Handling**: Comprehensive error handling across all services with user-friendly messages
- **API Integration**: Robust API integration patterns with fallback mechanisms and caching strategies

### Theme Customization
The application supports multiple theme options:
- **Light/Dark Mode**: Toggle between light and dark themes
- **Color Schemes**: Choose from Blue, Green, Purple, Orange, and Red color schemes
- **Quick Presets**: Pre-configured theme combinations
- **Persistent Settings**: Your theme preferences are automatically saved

Access theme settings via the palette icon in the top navigation bar.

### Testing
- Unit tests for all services
- Component tests for UI interactions
- Theme functionality tests
- Coverage reporting with Jest

## Development Status

### Fully Implemented Tools (30+)
The project currently includes over 30 fully functional tools across multiple categories:
- ✅ **Text & String Utilities**: Case conversion, escape utilities, quote handling, text joining/splitting
- ✅ **Unit Converters**: All major unit types with real-time currency conversion
- ✅ **Random Generators**: Passwords, UUIDs, Lorem Ipsum, numbers, strings, colors
- ✅ **Converters**: Base64, HTML/URL encoding, JSON↔XML, number bases
- ✅ **Validators**: JSON and CSS validation
- ✅ **Cryptography**: Hash generation, AES/RSA encryption
- ✅ **Calculators**: Basic arithmetic with scientific functions
- ✅ **Miscellaneous**: ASCII art generation

### Tools with Placeholder Implementation
Some tools show professional "under development" messages:
- 🚧 Financial Calculator (advanced financial calculations)
- 🚧 Scientific Calculator (extended mathematical functions)
- 🚧 Code Beautifiers (JSON, JavaScript formatting)
- 🚧 Code Minifiers (JSON, JavaScript, CSS compression)
- 🚧 Additional String Utilities (word counting, string reversal)

The placeholder system ensures users understand tool availability while maintaining a professional experience.

## Contributing

### AI-Assisted Development

This project embraces AI-assisted development practices:
- Feel free to use AI tools (GitHub Copilot, ChatGPT, etc.) when contributing
- AI-generated code is welcome and encouraged
- Please review and test AI-generated code thoroughly
- Document any AI tools used in your pull request description

### Contributing Guidelines

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

### Code Quality

While this project demonstrates AI capabilities, we maintain high standards:
- All code should be properly tested
- Follow TypeScript best practices
- Maintain consistent code style
- Ensure accessibility compliance

## Deployment

The app is automatically deployed to GitHub Pages when changes are pushed to the main branch. 

### Quick Setup for GitHub Pages:

1. **Enable GitHub Pages**:
   - Go to repository **Settings** → **Pages**
   - Set source to **GitHub Actions**

2. **Deploy**:
   ```bash
   git push origin main
   ```

3. **Access Your Site**:
   - `https://YOUR_USERNAME.github.io/Spannerly`

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Deployment Process:

1. Runs tests
2. Builds the application
3. Exports static files
4. Deploys to GitHub Pages

## License

This project is open source and available under the [MIT License](LICENSE).