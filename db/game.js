'use strict'

var async = require('async')

var db = require('./index')

function createGame (opt, done) {
  var settings = opt.settings
  var results = opt.results

  async.waterfall([
    function beginTransaction (cb) {
      return db.exec('BEGIN TRANSACTION', cb)
    },
    function getLastSequence (cb) {
      var seqSql = 'SELECT MAX(seq) AS last_seq FROM game WHERE `date` = ?'
      return db.get(seqSql, [settings.date], cb)
    },
    function insertGame (seqRow, cb) {
      var nextSeq = (seqRow.last_seq || 0) + 1

      var gameSql = '' +
        'INSERT INTO game ' +
          '(`date`, seq, ruleset_id, venue_id, note) ' +
        'VALUES ( ' +
          '$date, ' +
          '$seq, ' +
          '$ruleset_id, $venue_id, $note ' +
        ')'

      var gameSqlParams = {
        $date: settings.date,
        $seq: nextSeq,
        $ruleset_id: parseInt(settings.ruleset, 10),
        $venue_id: settings.venue,
        $note: settings.note || ''
      }

      return db.run(gameSql, gameSqlParams, cb)
    },
    function getLastInsert (cb) {
      var getGameIdSql = 'SELECT last_insert_rowid() AS game_id'
      db.get(getGameIdSql, cb)
    },
    function insertGamePlayers (lastInsert, cb) {
      var gamePlayerSql = 'INSERT INTO gameplayer ' +
        '(game_id, player_id, ruleset_id, score, winner) ' +
        'VALUES ($game_id, $player_id, $ruleset_id, $score, $winner)'

      var insertGamePlayer = db.prepare(gamePlayerSql)

      Object.keys(results).forEach(function (pid) {
        var result = results[pid]
        var rulesetId = result.ruleset || settings.ruleset

        insertGamePlayer.run({
          $game_id: lastInsert.game_id,
          $player_id: parseInt(result.playerId, 10),
          $ruleset_id: parseInt(rulesetId, 10),
          $score: parseInt(result.score, 10),
          $winner: result.submit === 'pouncer' ? 1 : 0
        })
      })

      insertGamePlayer.finalize(cb)
    },
    function commitTransaction (cb) { db.exec('COMMIT TRANSACTION', cb) }
  ], done)
}

module.exports = {
  create: createGame,
  getGamesByDate: function (opt, cb) {
    setImmediate(cb)
  }
}
