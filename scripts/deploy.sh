#!/usr/bin/env bash
if [ -n "$1" ]; then
    cd "$1"
    npm i
    dcl build
    dcl export
    cd export
    now -n "$1" -t "$NOW_TOKEN" --public --scope "hardlydifficult"
else
    echo "please enter tutorial directory name"
fi
