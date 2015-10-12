var inq = require('inquirer')
var columnify = require('columnify')

var model = require('../db/player')

var editableFields = [
  {
    type: 'input',
    name: 'handle',
    message: 'Enter player\'s handle'
  },
  {
    type: 'input',
    name: 'fullname',
    message: 'Enter player\'s full name'
  }
]

function create (cb) {
  inq.prompt(editableFields, function (answers) {
    model.create(answers, function (err) {
      if (err) return cb(err)
      inq.prompt([{
        type: 'confirm',
        message: 'Create another player?',
        name: 'again'
      }], function (answ) {
        if (answ.again) {
          return create(cb)
        } else {
          return cb(null)
        }
      })
    })
  })
}

function list (cb) {
  model.list(function (err, data) {
    if (err) return cb(err)
    console.log(columnify(data))
    return cb(null)
  })
}

function edit (cb) {
  model.list(function (err, players) {
    if (err) return cb(err)

    var playerChoice = {
      type: 'list',
      name: 'playerId',
      message: 'choose player to edit',
      choices: players.map(function (player) {
        return {
          name: player.fullname,
          value: player.id
        }
      })
    }

    inq.prompt([playerChoice], function (answ) {
      var updateId = answ.playerId
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
  model.list(function (err, players) {
    if (err) return cb(err)

    var playerChoice = {
      type: 'list',
      name: 'id',
      message: 'choose player to delete',
      choices: players.map(function (player) {
        return {
          name: player.fullname,
          value: player.id
        }
      })
    }

    inq.prompt([playerChoice], function (answ) {
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
      message: 'Choose player action',
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
