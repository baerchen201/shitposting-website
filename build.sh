#!/bin/bash

echo "Installing dependencies from npm..."
npm i

echo "Building TypeScript..."
tsc

echo "Building scss"
node ./node_modules/sass/sass .
