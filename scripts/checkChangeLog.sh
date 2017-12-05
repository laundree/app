#!/bin/bash

git fetch origin master

if [[ ${TRAVIS_PULL_REQUEST_BRANCH} ]] && ! [[ $TRAVIS_PULL_REQUEST_BRANCH == greenkeeper/* ]] && ! [[ $(git diff HEAD..master -- CHANGELOG.md) ]]
then
    echo "On branch $TRAVIS_PULL_REQUEST_BRANCH"
    echo "Remember to change the change log"
    exit 1
fi
