set -e

#!/usr/bin/env bash
ls | grep -E "^[0-9]{2}" | while read -r folder ; do
    echo "Starting build for $folder"
    cd "$folder"
    npm i
    npm run build
    cd ..
done
