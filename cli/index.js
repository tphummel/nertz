var path = require('path')
var fs = require('fs')

var async = require('async')
var inquirer = require('inquirer')
var firstRun = require('first-run')

var db = require(path.join(__dirname, '../db'))

var subModules = {}
var subCmds = ['game', 'player', 'ruleset', 'venue', 'report']
subCmds.forEach(function (cmd) {
  subModules[cmd] = require(path.join(__dirname, cmd))
})

function initDb (cb) {
  console.log('first run of program: initializing db...')
  var initFile = path.join(__dirname, '../db/sql/tables.sql')

  fs.readFile(initFile, 'utf8', function (err, initSql) {
    if (err) return cb(err)
    return db.exec(initSql, cb)
  })
}

function show () {
  async.forever(function (next) {
    inquirer.prompt([
      {
        name: 'mode',
        message: 'Choose module',
        type: 'list',
        choices: subCmds.concat(['quit'])
      }
    ], function (answ) {
      if (answ.mode === 'quit') return process.exit(0)
      subModules[answ.mode].show(next)
    })
  })
}

if (firstRun()) {
  initDb(show)
} else {
  show()
}
