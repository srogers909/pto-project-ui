# PTO Project Alpha UI

A React.js UI scaffolding project with custom configuration and integration with the map-controls library.

## Features

- React.js with TypeScript
- Custom Webpack & Babel setup
- SCSS for styling
- Zustand for state management
- IndexedDB for long-term state storage
- React Router for navigation
- Jest for unit testing
- Map controls integration

## Project Structure

```
ui/
├── .babelrc                # Babel configuration
├── .eslintrc.js            # ESLint configuration
├── .gitignore              # Git ignore file
├── jest.config.js          # Jest configuration
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── webpack.config.js       # Webpack configuration
├── public/                 # Static assets
│   ├── index.html          # HTML template
│   └── favicon.ico         # Favicon
├── src/                    # Source code
│   ├── assets/             # Assets (images, fonts, etc.)
│   ├── components/         # Reusable components
│   │   ├── common/         # Common UI components
│   │   └── map/            # Map-related components
│   ├── hooks/              # Custom React hooks
│   ├── layouts/            # Layout components
│   ├── pages/              # Page components
│   ├── routes/             # Routing configuration
│   ├── store/              # Zustand store
│   ├── styles/             # SCSS styles
│   │   ├── _variables.scss # SCSS variables
│   │   ├── _mixins.scss    # SCSS mixins
│   │   └── main.scss       # Main stylesheet
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main App component
│   ├── index.tsx           # Entry point
│   └── setupTests.ts       # Test setup
└── tests/                  # Test files
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/pto-project-alpha-ui.git
cd pto-project-alpha-ui

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

This will start the development server at http://localhost:3000.

### Building for Production

```bash
# Build for production
npm run build

# Serve production build locally
npm run serve
```

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Map Controls Integration

This project integrates with the map-controls library, which provides functionality for map panning and zooming. The state of the map (zoom level and position) is managed using Zustand and persisted in IndexedDB for long-term storage.

## License

MIT
