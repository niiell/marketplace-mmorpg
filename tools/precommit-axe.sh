#!/bin/sh
# Run axe-core accessibility checks on built pages
npx axe http://localhost:3000 --save axe-report.json || exit 1
