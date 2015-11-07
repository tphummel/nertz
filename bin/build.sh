#!/usr/bin/env bash

set -o nounset
set -o errexit
set -o pipefail
IFS=$'\n\t'

cleanup() {
  local pattern="{test*,doc*,example*,bench*,image*,tool*,lcov-report*}"
  "rm -rf ./node_modules/**/$pattern"
  "rm -rf ./node_modules/**/node_modules/**/$pattern"
  "rm -rf ./node_modules/**/node_modules/**/node_modules/**/$pattern"
  "rm -rf ./node_modules/**/node_modules/.bin"
  "rm -rf ./node_modules/**/node_modules/**/node_modules/.bin"
}

main() {
  # cleanup
  npm dedupe

  local pkg_name=`cat package.json | node_modules/.bin/json name`
  local dist_name=`uname -m`
  local full_name="${pkg_name}_${dist_name}"

  ./node_modules/.bin/lone

  mv "./.lone/dist/$pkg_name" "./.lone/dist/$full_name"

}

main
