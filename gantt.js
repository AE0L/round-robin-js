const { push } = require('./funcs')

class Gantt {
    constructor() {
        this._record = []
    }

    record(activity) {
        push(this.history, activity)
    }

    get history() {
        return this._record
    }
}

module.exports = Gantt
