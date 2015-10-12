'use strict'
var Table = require('cli-table')

function printSingleGameReport (state, lookups, gamePlayersById) {
  var gameMeta = [
    state.date,
    lookups.confVenue.fullname,
    lookups.confRuleset.fullname
  ]

  var metaTable = new Table({
    head: ['Date', 'Venue', 'Ruleset'],
    border: [],
    compact: true
  })

  metaTable.push(gameMeta)
  console.log(metaTable.toString())

  var gpTable = new Table({
    head: ['Player', 'Score', 'Win'],
    border: [],
    colAligns: ['left', 'right', 'left'],
    compact: true
  })

  var byPlayer = lookups.confPlayers.map(function (pl) {
    return [
      pl.fullname,
      gamePlayersById['' + pl.id].score,
      (gamePlayersById['' + pl.id].submit === 'pouncer' ? '**' : '')
    ]
  })

  byPlayer.forEach(function (bp) {
    gpTable.push(bp)
  })

  console.log(gpTable.toString())
}

module.exports = printSingleGameReport
