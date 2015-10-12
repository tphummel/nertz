'use strict'

var gameModel = require('../db/game')

/*
g	w	pts	ppg	wpct
Neela	16	6	252	15.75	0.375
Gavin	17	3	145	8.53	0.176
Tom	15	3	21	1.40	0.200
Tyler 	4	0	18	4.50	0.000
Connor	3	0	-52	-17.33	0.000
Taylor	13	0	-77	-5.92	0.000
Alex	11	0	-30	-2.73	0.000
Molly	7	0	5	0.71	0.000
Kiran	2	0	-1	-0.50	0.000
Marin	7	0	-59	-8.43	0.000
*/

function getReport (opt, cb) {
  gameModel.getGamesByDate({date: opt.date}, function (err, games) {
    if (err) return cb(err)

    var sumByPlayer = games.reduce(function (memo, prev, curr) {
      // TODO: aggregate games into player summaries
      return memo
    }, {})

    var playerSums = Object.keys(sumByPlayer).map(function (playerId) {
      return sumByPlayer[playerId]
    })

    playerSums.sort(function (a, b) {
      return a.points / a.games > b.points / b.games
    })

    return playerSums
  })
}

module.exports = function () {
  console.log('day-summary')
}
