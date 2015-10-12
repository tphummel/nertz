'use strict'

var db = require('./index')

module.exports = {
  create: function (player, cb) {
    var sql = 'INSERT INTO player ' +
      '(handle, fullname) ' +
      'VALUES (?, ?)'

    var params = [
      player.handle,
      player.fullname
    ]

    db.run(sql, params, cb)
  },
  list: function (cb) {
    var sql = 'SELECT * FROM player'
    db.all(sql, [], cb)
  },
  getById: function (id, cb) {
    var sql = 'SELECT * FROM player WHERE id = ?'
    db.get(sql, [id], cb)
  },
  getByIds: function (ids, cb) {
    var subs = ids.map(function(id) { return '?' })
    var sql = 'SELECT * FROM player WHERE id IN (' + subs.join(',') +')'
    db.all(sql, ids, cb)
  },
  update: function (id, edited, cb) {
    var sql = 'UPDATE player ' +
      'SET handle = ?, fullname = ? ,updated = CURRENT_TIMESTAMP ' +
      'WHERE id = ?'
    db.run(sql, [edited.handle, edited.fullname, id], cb)
  },
  delete: function (id, cb) {
    var sql = 'DELETE FROM player WHERE id = ?'
    db.run(sql, [id], cb)
  }
}
