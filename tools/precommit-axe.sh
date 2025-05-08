#!/bin/bash

# Use the PORT from environment variable, or default to 3000
PORT=${PORT:-3000}

# Run lint and display error message if failed
if ! npm run lint; then
  echo "Linting failed. Exiting..."
  exit 1
fi

# Run tests and display error message if failed
if ! npm test; then
  echo "Tests failed. Exiting..."
  exit 1
fi

# Run axe-core accessibility checks on the dynamic port and display error message if failed
if ! npx axe http://localhost:$PORT --save axe-report.json; then
  echo "Accessibility checks failed. Exiting..."
  exit 1
fi