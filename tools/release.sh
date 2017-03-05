#!/usr/bin/env bash

. secrets/android/release.conf

NPM_VERSION=$(node -p -e "require('./package.json').version")
export VERSION_CODE=$(git rev-list --count HEAD)
export VERSION_NAME=${TRAVIS_TAG:-$NPM_VERSION}
echo "Would have beeen RELEASING ANDROID VERSION: $VERSION_NAME VERSION CODE: $VERSION_CODE"

cp secrets/android/my-release-key.keystore android/app/my-release-key.keystore
cp secrets/android/service-account-credentials.json android/app/service-account-credentials.json

cd android && ./gradlew assembleRelease && ./gradlew publishApkRelease
