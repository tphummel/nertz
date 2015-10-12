# nertz

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

## what is nertz?

https://en.wikipedia.org/wiki/Nertz

## what does this program do?

Capture Nertz results. View results and reports.

## installation

download and install a release for your platform

## usage

`nertz (game|player|venue|ruleset|report)?`

## dev
install nodejs: https://nodejs.org

```
git clone
cd nertz
npm install
npm test
```

it is helpful to have a sqlite3 cli tool:
```
brew install sqlite3
sqlite3 app.db
.read db/ddl/tables.sql
```

## todo
- before v1
  - model test(s)
  - function test(s)
  - readme
  - package.json

- beyond
  - david-dm
  - greenkeeper
  - on first run, create db, run ddl sql
  - edit match, to add a player i missed
  - validation on ruleset numericals (create, edit)
  - bin scripts in pkg.json, multiple entrypoints?
  - create custom ruleset in game.js?
  - validate exactly one pouncer
  - validate 2+ players
  - reports
    - day summary
    - day "sheet view" - replicate paper view
  - a complete story from install to first game submit
    - https://www.npmjs.com/package/lone
  - an `export` command that doesn't involve using sqlite3 directly
