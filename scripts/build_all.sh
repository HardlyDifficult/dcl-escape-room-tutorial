#!/usr/bin/env bash
ls | grep -E "^[0-9]{2}" | while read -r folder ; do
    echo "Starting deploy for $folder"
    cd "$folder"
    npm i
    npm run build
done
