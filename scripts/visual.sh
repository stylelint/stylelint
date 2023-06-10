#!/usr/bin/env bash
set -u

echo "########## Compact formatter ##########"
echo ""
node ../bin/stylelint.js visual.css --config visual-config.mjs --formatter compact
echo ""

echo ""
echo "########## Default formatter ##########"
node ../bin/stylelint.js visual.css --config visual-config.json

echo "########## Verbose formatter ##########"
node ../bin/stylelint.js visual.css --config visual-config.cjs --formatter verbose
