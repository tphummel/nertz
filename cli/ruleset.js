var inq = require('inquirer')
var columnify = require('columnify')

var model = require('../db/ruleset')

var editableFields = [
  {
    type: 'input',
    name: 'handle',
    message: 'Enter ruleset\'s handle'
  },
  {
    type: 'input',
    name: 'fullname',
    message: 'Enter ruleset\'s full name'
  },
  {
    type: 'input',
    name: 'pile',
    message: 'Enter ruleset\'s pounce pile starting count'
  },
  {
    type: 'input',
    name: 'bonus',
    message: 'Enter ruleset\'s pouncer bonus score'
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
  model.list(function (err, rulesets) {
    if (err) return cb(err)

    var rulesetChoice = {
      type: 'list',
      name: 'rulesetId',
      message: 'choose ruleset to edit',
      choices: rulesets.map(function (ruleset) {
        return {
          name: ruleset.fullname,
          value: ruleset.id
        }
      })
    }

    inq.prompt([rulesetChoice], function (answ) {
      var updateId = answ.rulesetId
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
  model.list(function (err, rulesets) {
    if (err) return cb(err)

    var rulesetChoice = {
      type: 'list',
      name: 'id',
      message: 'choose ruleset to delete',
      choices: rulesets.map(function (ruleset) {
        return {
          name: ruleset.fullname,
          value: ruleset.id
        }
      })
    }

    inq.prompt([rulesetChoice], function (answ) {
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
      message: 'Choose ruleset action',
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
