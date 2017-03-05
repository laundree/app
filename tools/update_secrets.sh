#!/usr/bin/env bash

rm secrets.tar

tar -cvf secrets.tar secrets

travis --encrypt-file secrets.tar
