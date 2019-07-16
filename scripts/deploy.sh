#!/usr/bin/env bash
if [ -n "$1" ]; then
    cd "$1"
    npm i
    npx dcl build
    npx dcl export
    cd export
    npx now -n "$1" -t "$NOW_TOKEN" --public --scope "hardlydifficult"
else
    echo "please enter tutorial directory name"
fi
