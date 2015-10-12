'use strict'

var db = require('./index')

module.exports = {
  create: function (ruleset, cb) {
    var sql = 'INSERT INTO ruleset ' +
      '(handle, fullname, pile, bonus) ' +
      'VALUES (?, ?, ?, ?)'

    var params = [
      ruleset.handle,
      ruleset.fullname,
      ruleset.pile,
      ruleset.bonus
    ]

    db.run(sql, params, cb)
  },
  list: function (cb) {
    var sql = 'SELECT * FROM ruleset'
    db.all(sql, [], cb)
  },
  getById: function (id, cb) {
    var sql = 'SELECT * FROM ruleset WHERE id = ?'
    db.get(sql, [id], cb)
  },
  update: function (id, edited, cb) {
    var sql = 'UPDATE ruleset ' +
      'SET handle = ?, fullname = ?, pile = ?, bonus = ?, ' +
      'updated = CURRENT_TIMESTAMP ' +
      'WHERE id = ?'

    var values = [edited.handle, edited.fullname, edited.pile, edited.bonus, id]
    db.run(sql, values, cb)
  },
  delete: function (id, cb) {
    var sql = 'DELETE FROM ruleset WHERE id = ?'
    db.run(sql, [id], cb)
  }
}
