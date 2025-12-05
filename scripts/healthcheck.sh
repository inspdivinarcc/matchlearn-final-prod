#!/usr/bin/env sh
set -e
curl -fsSL ${1:-http://localhost:3000} >/dev/null && echo OK || (echo FAIL; exit 1)
