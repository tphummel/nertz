var path = require('path')

var sql = require('sqlite3')

var dbFile = process.env.DBFILE || path.join(__dirname, '../nertz.sqlite3')
var db = new sql.Database(dbFile)

module.exports = db
