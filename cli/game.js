'use strict'

var inq = require('inquirer')
var async = require('async')
var chalk = require('chalk')
var Table = require('cli-table')

var venue = require('../db/venue')
var ruleset = require('../db/ruleset')
var player = require('../db/player')
var game = require('../db/game')
var report = require('../report')

var state = {}
var session = {}

function getCurrentDate () {
  var now = new Date()

  var year = now.getFullYear().toString()
  var month = (now.getMonth() + 1).toString()
  var day = now.getDate().toString()

  return [
    year,
    month.length === 2 ? month : '0' + month[0],
    day.length === 2 ? day : '0' + day[0]
  ].join('-')
}

function chooseDate (defVal, cb) {
  inq.prompt([{
    type: 'input',
    name: 'date',
    message: 'Enter the game\'s date',
    default: defVal
  }], function (answ) {
    cb(null, answ.date)
  })
}

function chooseVenue (defVal, cb) {
  venue.list(function (err, venues) {
    if (err) return cb(err)
    if (venues.length === 0) return cb(new Error('no venues exist in db'))
    var venueChoice = {
      type: 'list',
      name: 'id',
      message: 'Choose the game\'s venue',
      choices: venues.map(function (ven) {
        return {
          name: ven.fullname,
          value: ven.id
        }
      })
    }
    if (defVal) venueChoice.default = defVal
    inq.prompt([venueChoice], function (answ) {
      cb(null, answ.id)
    })
  })
}

function chooseRuleset (defVal, cb) {
  ruleset.list(function (err, rulesets) {
    if (err) return cb(err)
    if (rulesets.length === 0) return cb(new Error('no rulesets exist in db'))
    var rulesetChoice = {
      type: 'list',
      name: 'id',
      message: 'Choose the game\'s default ruleset',
      choices: rulesets.map(function (rset) {
        return {
          name: rset.fullname,
          value: '' + rset.id
        }
      })
    }
    if (defVal) rulesetChoice.default = defVal
    inq.prompt([rulesetChoice], function (answ) {
      cb(null, answ.id)
    })
  })
}

function choosePlayers (defVal, cb) {
  player.list(function (err, players) {
    if (err) return cb(err)
    if (players.length === 0) return cb(new Error('no players exist in db'))
    var playersChoice = {
      type: 'checkbox',
      name: 'id',
      message: 'Choose the game\'s players',
      choices: players.map(function (plyr) {
        return {
          name: plyr.fullname,
          value: '' + plyr.id
        }
      })
    }
    if (defVal) playersChoice.default = defVal
    inq.prompt([playersChoice], function (answ) {
      cb(null, answ.id)
    })
  })
}

function setupGame (prevState, cb) {
  // TODO: need a less brittle way of determining if we're editing or not
  if (Object.keys(prevState).length >= 4 && !session.editFlag) {
    return setImmediate(cb.bind(null, null, prevState))
  }

  async.series({
    date: chooseDate.bind(null, prevState.date || getCurrentDate()),
    venue: chooseVenue.bind(null, prevState.venue),
    ruleset: chooseRuleset.bind(null, prevState.ruleset),
    players: choosePlayers.bind(null, prevState.players)
  }, cb)
}

function captureGamePlayer (playerId, cb) {
  inq.prompt([
    {
      name: 'score',
      type: 'input',
      message: 'Input player score'
    },
    {
      name: 'submit',
      type: 'expand',
      message: 'any special option?',
      default: 'non-pouncer',
      choices: [
        {
          key: 's',
          name: 'Submit, non-pouncer',
          value: 'non-pouncer'
        },
        {
          key: 'w',
          name: 'Submit, pouncer',
          value: 'pouncer'
        },
        {
          key: 'c',
          name: 'Submit, non-pouncer with custom Ruleset',
          value: 'ruleset'
        }
      ]
    },
    {
      name: 'ruleset',
      message: 'Choose player\'s custom ruleset',
      type: 'list',
      choices: function (answ) {
        var rulesetDone = this.async()
        ruleset.list(function (err, rulesets) {
          if (err) return rulesetDone(err)
          var choices = rulesets.map(function (rset) {
            return {
              name: rset.fullname,
              value: '' + rset.id
            }
          })
          rulesetDone(choices)
        })
      },
      when: function (answ) {
        return answ.submit === 'ruleset'
      }
    }
  ], function (answ) {
    answ.playerId = playerId
    cb(null, answ)
  })
}

function captureGame (settings, done) {
  player.getByIds(settings.players, function (err, activePlayers) {
    if (err) return done(err)

    var gamePlayersById = {}

    async.whilst(
      function inProgress () {
        var completed = Object.keys(gamePlayersById).length
        var total = activePlayers.length
        var incomplete = completed < total

        return incomplete
      },
      function capturePlayerResult (cb) {
        var playersChoice = {
          type: 'list',
          name: 'id',
          message: 'Select player to enter result',
          choices: activePlayers.map(function (player) {
            var styledName

            var isComplete = gamePlayersById[player.id]
            var isPouncer = isComplete &&
              gamePlayersById[player.id].submit === 'pouncer'

            if (isPouncer) {
              styledName = chalk.white.bgGreen.underline(
                player.fullname +
                '  -->  ' +
                gamePlayersById[player.id].score
              )
            } else if (isComplete) {
              styledName = chalk.white.bgGreen(
                player.fullname +
                '  -->  ' +
                gamePlayersById[player.id].score
              )
            } else {
              styledName = chalk.white.bgBlue(player.fullname)
            }

            return {
              name: styledName,
              value: '' + player.id
            }
          })
        }
        inq.prompt([playersChoice], function (answ) {
          captureGamePlayer(answ.id, function (err, gp) {
            if (err) return cb(err)

            gamePlayersById[gp.playerId] = gp
            cb(err, gp)
          })
        })
      }, function confirmGame (err) {
        if (err) return done(err)

        printConfirmation(gamePlayersById, function (err) {
          if (err) return done(err)

          inq.prompt([
            {
              name: 'confirm',
              type: 'expand',
              message: 'confirm?',
              default: 'save',
              choices: [
                {
                  key: 's',
                  name: 'Save',
                  value: 'save'
                },
                {
                  key: 'a',
                  name: 'Save with note',
                  value: 'note'
                }
              ]
            },
            {
              name: 'note',
              message: 'Enter note for game',
              type: 'input',
              when: function (answ) {
                return answ.confirm === 'note'
              }
            }
          ], function (answ) {
            if (answ.note) {
              state.note = answ.note
            } else {
              delete state.note
            }

            game.create({
              settings: state,
              results: gamePlayersById
            }, function (err) {
              if (err) done(err)

              if (!session[state.date]) session[state.date] = 0
              session[state.date] += 1

              return done(err)
            })
          })
        })
      }
    )
  })
}

function printConfirmation (gamePlayersById, done) {
  var rulesetId = parseInt(state.ruleset, 10)
  var venueId = parseInt(state.venue, 10)
  var playerIds = state.players.map(function (pl) { return parseInt(pl, 10) })

  async.parallel({
    confPlayers: player.getByIds.bind(null, playerIds),
    confVenue: venue.getById.bind(null, venueId),
    confRuleset: ruleset.getById.bind(null, rulesetId)
  }, function (err, results) {
    if (err) return done(err)

    report.unofficialGame(state, results, gamePlayersById)

    return done()
  })
}

function printLeaderboard (cb) {
  console.log('TODO: current date scoreboard goes here')
  setImmediate(cb)
}

function printSessionSummary (cb) {
  var sessionTable = new Table({
    head: ['Date', 'G'],
    colAligns: ['left', 'right']
  })

  Object.keys(session).forEach(function (sessionDate) {
    sessionTable.push([sessionDate, session[sessionDate]])
  })

  setImmediate(cb)
}

function show (done) {
  async.forever(function (next) {
    async.series([
      function (cb) {
        setupGame(state, function (err, newState) {
          if (err) return cb(err)
          state = newState

          return cb(err)
        })
      },
      function (cb) { captureGame(state, cb) },
      function (cb) { printLeaderboard(cb) },
      function (cb) {
        inq.prompt([{
          type: 'expand',
          message: 'Again?',
          name: 'againOpt',
          default: 'again-same',
          choices: [
            {
              key: 'a',
              name: 'Again, with same players/settings',
              value: 'again-same'
            },
            {
              key: 's',
              name: 'Again, change players/settings',
              value: 'again-reset'
            },
            {
              key: 'q',
              name: 'Quit',
              value: 'quit'
            }
          ]
        }], function (answ) { return cb(null, answ.againOpt) })
      }
    ], function (err, results) {
      if (err) return next(err)

      var againOpt = results.pop()
      if (againOpt === 'quit') return next('quit')
      if (againOpt === 'again-reset') session.editFlag = true

      return next(err)
    })
  }, function (err) {
    if (err) {
      if (err === 'quit') {
        printSessionSummary(done)
      } else {
        return done(err)
      }
    }
  })
}

module.exports = {
  show: show
}
