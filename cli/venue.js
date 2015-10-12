var inq = require('inquirer')
var columnify = require('columnify')

var model = require('../db/venue')

var editableFields = [
  {
    type: 'input',
    name: 'handle',
    message: 'Enter venue\'s handle'
  },
  {
    type: 'input',
    name: 'fullname',
    message: 'Enter venue\'s full name'
  }
]

function create (cb) {
  inq.prompt(editableFields, function (answers) {
    model.create(answers, cb)
  })
}

function list (cb) {
  model.list(function (err, data) {
    if (err) return cb(err)

    console.log(columnify(data))
    return cb(err)
  })
}

function edit (cb) {
  model.list(function (err, venues) {
    if (err) return cb(err)

    var venueChoice = {
      type: 'list',
      name: 'venueId',
      message: 'choose venue to edit',
      choices: venues.map(function (venue) {
        return {
          name: venue.fullname,
          value: venue.id
        }
      })
    }

    inq.prompt([venueChoice], function (answ) {
      var updateId = answ.venueId
      model.getById(updateId, function (err, current) {
        if (err) return cb(err)
        var updateFields = editableFields.map(function (field) {
          if (current[field.name]) field.default = current[field.name]
          return field
        })

        inq.prompt(updateFields, function (upAnsw) {
          model.update(updateId, upAnsw, cb)
        })
      })
    })
  })
}

function del (cb) {
  model.list(function (err, venues) {
    if (err) return cb(err)

    var venueChoice = {
      type: 'list',
      name: 'id',
      message: 'choose venue to delete',
      choices: venues.map(function (venue) {
        return {
          name: venue.fullname,
          value: venue.id
        }
      })
    }

    inq.prompt([venueChoice], function (answ) {
      model.delete(answ.id, cb)
    })
  })
}

var actions = {
  list: list,
  create: create,
  edit: edit,
  delete: del
}

function show (cb) {
  var questions = [
    {
      type: 'list',
      name: 'action',
      message: 'Choose venue action',
      choices: Object.keys(actions).concat(['quit'])
    }
  ]

  inq.prompt(questions, function (answ) {
    if (answ.action === 'quit') return cb()
    return actions[answ.action](cb)
  })
}

module.exports = {
  show: show
}
