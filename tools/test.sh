#!/usr/bin/env bash

set -e

echo "Testing flow"
if ./node_modules/.bin/flow --one-line --quiet | grep "^src" -q; then
    ./node_modules/.bin/flow
fi
echo "Testing eslint"

./node_modules/.bin/eslint .