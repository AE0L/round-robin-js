const { push, shift, head, set, map, prop } = require('./funcs')

class JobQueue {
    constructor() {
        this._queue = []
    }

    enqueue(value) {
        push(this._queue, value)
    }

    dequeue() {
        return shift(this._queue)
    }

    peek() {
        return head(this._queue) || { } 
    }

    decreaseCurrentJobRemainingTime() {
        set('RM', this.peek(), prop('RM', this.peek()) - 1)
    }

    get queue() {
        return this._queue
    }

    get PIDs() {
        return map(prop('PID'), this._queue)
    }
}

module.exports = JobQueue
