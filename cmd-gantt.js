const { backspace, cat, compose, forEach, len, map, print, prop, range, reduce, repeat, toString } = require('./funcs')

class CMDGantt {
    constructor(schedule, interval, margin=0) {
        this._interval = interval
        this._schedule = schedule
        this._margin   = repeat(margin, ' ')
    }

    display() {
        const times = map(compose(toString, prop('time')), this._schedule)
        const jobs  = map(compose(toString, prop('job')), this._schedule)

        const timeStamps = reduce((a, i) => {
            const job  = jobs[i]
            const time = times[i]
            const timelen = len(time)
            const joblen  = len(job)

            switch (timelen) {
                case 2:  return cat(a, time, repeat(joblen + 1, ' '))
                case 3:  return cat(backspace(a), time, repeat(joblen + 1, ' '))
                case 4:  return cat(backspace(a), time, repeat(joblen, ' '))
                default: return cat(a, time, repeat(joblen + 2, ' '))
            }
        }, this._margin, range(len(times)))

        const lines = reduce((a, i) => {
            last = len(times) - 1

            switch (i) {
                case 0:    return cat(a, UDR)
                case last: return cat(a, repeat(len(jobs[i - 1]) + 2, HSL), UDL)
                default:   return cat(a, repeat(len(jobs[i - 1]) + 2, HSL), CRS)
            }
        }, this._margin, range(len(times)))

        const activities = reduce((a, i) => `${a} ${jobs[i]}  `, ` ${this._margin}`, range(len(jobs) - 1))

        print(timeStamps)
        print(lines)
        print(activities)
    }
}

module.exports = CMDGantt
