#!/usr/bin/env bash

echo "Normal:"
node ../dist/cli.js visual.css --config=visual-config.json

echo -e "\n\nVerbose:"
node ../dist/cli.js visual.css --config=visual-config.json --formatter verbose
