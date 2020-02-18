const { print }  = require('./funcs')
const roundRobin = require('./round-robin')

const schedData1 = [
    { PID: 'P1', AT: 0,   BT: 250 },
    { PID: 'P2', AT: 50,  BT: 170 },
    { PID: 'P3', AT: 130, BT: 75  },
    { PID: 'P4', AT: 190, BT: 100 },
    { PID: 'P5', AT: 210, BT: 130 },
    { PID: 'P6', AT: 350, BT: 50  }
]

const result = roundRobin(schedData1, 100)

print(result)
