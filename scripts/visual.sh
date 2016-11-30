#!/usr/bin/env bash

echo "Normal:"
node ../bin/stylelint.js visual.css --config=visual-config.json

echo -e "\n\nVerbose:"
node ../bin/stylelint.js visual.css --config=visual-config.json --formatter verbose
