#!/usr/bin/env bash
set -u

SCRIPT_DIR=$(cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd)

cd "${SCRIPT_DIR}" || exit

stylelint() {
	"${SCRIPT_DIR}/../bin/stylelint.mjs" "$@"
}

echo "########## Compact formatter ##########"
echo ""
stylelint visual.css --config visual-config.mjs --formatter compact
echo ""

echo ""
echo "########## Default formatter ##########"
stylelint visual.css --config visual-config.json

echo "########## Verbose formatter ##########"
stylelint visual.css --config visual-config.cjs --formatter verbose
