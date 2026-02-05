#!/usr/bin/env bash
set -u

SCRIPT_DIR=$(cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd)

cd "${SCRIPT_DIR}" || exit

stylelint() {
	"${SCRIPT_DIR}/../../bin/stylelint.mjs" "$@"
}


stylelint styles.css --config config.mjs
