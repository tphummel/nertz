'use strict'

var db = require('./index')

module.exports = {
  create: function (venue, cb) {
    var sql = 'INSERT INTO venue ' +
      '(handle, fullname) ' +
      'VALUES (?, ?)'

    var params = [
      venue.handle,
      venue.fullname
    ]

    db.run(sql, params, cb)
  },
  list: function (cb) {
    var sql = 'SELECT * FROM venue'
    db.all(sql, [], cb)
  },
  getById: function (id, cb) {
    var sql = 'SELECT * FROM venue WHERE id = ?'
    db.get(sql, [id], cb)
  },
  update: function (id, edited, cb) {
    var sql = 'UPDATE venue ' +
      'SET handle = ?, fullname = ? ,updated = CURRENT_TIMESTAMP ' +
      'WHERE id = ?'
    db.run(sql, [edited.handle, edited.fullname, id], cb)
  },
  delete: function (id, cb) {
    var sql = 'DELETE FROM venue WHERE id = ?'
    db.run(sql, [id], cb)
  }
}
