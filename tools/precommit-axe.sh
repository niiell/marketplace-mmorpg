#!/bin/bash

# Use the PORT from environment variable, or default to 3000
PORT=${PORT:-3000}

# Run axe-core accessibility checks on the dynamic port
npx axe http://localhost:$PORT --save axe-report.json || exit 1
