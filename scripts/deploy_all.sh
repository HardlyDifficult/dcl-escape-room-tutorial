set -e

#!/usr/bin/env bash
ls | grep -E "^[0-9]{2}" | while read -r folder ; do
    echo "Starting deploy for $folder"
    ./scripts/deploy.sh "$folder"
done
