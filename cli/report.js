'use strict'

var inq = require('inquirer')
var reports = require('../report/index')

function show () {
  var questions = [
    {
      type: 'list',
      name: 'report',
      message: 'Choose report to view',
      choices: Object.keys(reports)
    }
  ]

  inq.prompt(questions, function (answ) { reports[answ.report]() })
}

module.exports = {
  show: show
}
