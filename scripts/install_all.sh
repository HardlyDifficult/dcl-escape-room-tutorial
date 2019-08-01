#!/usr/bin/env bash
ls | grep -E "^[0-9]{2}" | while read -r folder ; do
    echo "$folder: npm i"
    cd "$folder"
    npm i
    cd ..
done
