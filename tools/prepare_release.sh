#!/usr/bin/env bash

. secrets/android/release.conf

NPM_VERSION=$(node -p -e "require('./package.json').version")
export VERSION_CODE=$(git rev-list --count HEAD)
export VERSION_NAME=${TRAVIS_TAG:-$NPM_VERSION}

echo "Updating IOS version to version name $VERSION_NAME and version code: $VERSION_CODE"

plutil -replace CFBundleShortVersionString -string "$VERSION_NAME" ios/Laundree/Info.plist
plutil -replace CFBundleVersion -string "$VERSION_CODE" ios/Laundree/Info.plist

if  ! grep -q "^## \[$VERSION_NAME\]" CHANGELOG.md; then
    sed -i "s/^## Unreleased/&\n\n## [$VERSION_NAME]/g" CHANGELOG.md
fi
