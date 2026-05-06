#!/bin/bash
set -e
cd "$(dirname "$0")"
echo ">>> [frontend] Installing JS test dependencies..."
npm install -D jest ts-jest @types/jest jest-environment-jsdom --silent 2>/dev/null || true
echo ">>> [frontend] Running tests..."
npx jest --coverage --passWithNoTests 2>&1 | tee /tmp/test_out_frontend.txt
echo ">>> [frontend] Done."