#!/bin/sh
# Based on https://github.com/eldarlabs/ghpages-deploy-script/blob/master/scripts/deploy-ghpages.sh

# abort the script if there is a non-zero error
set -e

remote=$(git config remote.origin.url)

# now lets setup a new repo so we can update the branch
git config --global user.email "$GH_EMAIL" > /dev/null 2>&1
git config --global user.name "$GH_NAME" > /dev/null 2>&1

if ! git diff-index --quiet HEAD --; then
  # stage any changes and new files
  git add -A
  # now commit
  git commit -m "auto-lint"
  # and push, but send any output to /dev/null to hide anything sensitive
  git push --force --quiet origin $CIRCLE_BRANCH > /dev/null 2>&1
fi
