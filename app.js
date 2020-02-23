const { print, prop }  = require('./funcs')
const roundRobin = require('./round-robin')
const CMDTable   = require('./cmd-table')
const CMDGantt   = require('./cmd-gantt')

const schedData1 = [
    { PID: 'P1', AT: 0,   BT: 250 },
    { PID: 'P2', AT: 50,  BT: 170 },
    { PID: 'P3', AT: 130, BT: 75  },
    { PID: 'P4', AT: 190, BT: 100 },
    { PID: 'P5', AT: 210, BT: 130 },
    { PID: 'P6', AT: 350, BT: 50  }
]

const schedData2 = [
    {'PID': 'P1', 'AT': 0, 'BT': 10},
    {'PID': 'P2', 'AT': 1, 'BT': 4 },
    {'PID': 'P3', 'AT': 2, 'BT': 5 },
    {'PID': 'P4', 'AT': 3, 'BT': 3 }
]

const quantum       = 3
const result        = roundRobin(schedData2, quantum)
const schedule      = prop('sched', result)
const resultData    = prop('data', result)
const gantt         = prop('gantt', result)

const scheduleTable = new CMDTable(schedule, `Schedule Q=${quantum}`)
const resultTable   = new CMDTable([resultData], 'Result')
const ganttChart    = new CMDGantt(gantt, quantum)

scheduleTable.display()
print('')
resultTable.display()
print('')
ganttChart.display()
