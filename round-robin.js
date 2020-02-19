const { all, compose, curry, div, forEach, head, len, prop, set, map, print, reduce, round } = require('./funcs')
const JobQueue = require('./job-queue')
const Gantt = require('./gantt')

/* Setters & Getters */
const getPID            = prop('PID')
const getAT             = prop('AT')
const getBT             = prop('BT')
const getRM             = prop('RM')
const getCMP            = prop('CMP')
const getTT             = prop('TT')
const getWT             = prop('WT')
const setRM             = set('RM')
const setCMP            = set('CMP')
const setTT             = set('TT')
const setWT             = set('WT')
/* Jobs & Schedule */
const initRemainingTime = (sched) => map((job) => setRM(job, getBT(job)), sched)
const jobIsComplete     = (job) => getRM(job) === 0
const schedIsComplete   = (sched) => all(jobIsComplete, sched)
const removeRM          = (job) => delete job.RM
/* TT & WT */
const calculateTT       = (job) => getCMP(job) - getAT(job)
const calculateWT       = (job) => getTT(job) - getBT(job)
const recordTT          = (job) => setTT(job, calculateTT(job))
const recordWT          = (job) => setWT(job, calculateWT(job))
/* etc. */
const accumulator       = curry((get, acc, curr) => get(curr) + acc)

function roundRobin(rawSchedData, quantum) {
    const schedule  = initRemainingTime(rawSchedData)
    const schedSize = len(schedule)
    const queue     = new JobQueue()
    let gantt       = new Gantt()
    let time        = 0
    let q_time      = time + quantum

    const recordTime = (time) => gantt.record({
        time: time,
        job: getPID(queue.peek()) || 'None'
    })

    /*=Algorithm START============================================================================*/
    while (!(schedIsComplete(schedule))) {
        // Check all jobs for their arrival time, if the their AT is the same with the current
        // time, add to queue.
        forEach(job => {
            if (getAT(job) === time) {
                queue.enqueue(job)

                // Do not record job's arrival except for job/s with arrival time of zero.
                if (time === 0) { recordTime(time) }
            }
        }, schedule)

        if (time < q_time) {
            // if the current job finished before the Q-Time change the next Q-Time based on the
            // current time.
            if (jobIsComplete(queue.peek())) {
                job    = queue.dequeue()
                q_time = time + quantum

                setCMP(job, time)
                recordTime(time)
            }

            queue.decreaseCurrentJobRemainingTime()
        } else if (time === q_time) {
            // if current job reaches the Q-Time put it at the back of the queue if not yet finished,
            // otherwise remove it from the queue.
            job     = queue.dequeue()
            q_time += quantum

            if (jobIsComplete(job))
                setCMP(job, time)
            else
                queue.enqueue(job)

            queue.decreaseCurrentJobRemainingTime()
            recordTime(time)
        }

        time += 1
    }

    // Finish and record the last job in the queue
    const lastJob = queue.dequeue()
    setCMP(lastJob, time)
    recordTime(time)
    /*=Algorithm END==============================================================================*/

    forEach(removeRM, schedule)
    forEach(recordTT, schedule)
    forEach(recordWT, schedule)

    const total   = (acc) => reduce(acc, 0, schedule)
    // Compose average function:
    // Create accumulator -> Get total -> Divide by schedule size -> Round up to two decimal places
    const average = compose(round(2), div(schedSize), total, accumulator)

    return {
        gantt: gantt.history,
        data: {
            'Total Time': time,
            'Average TT': average(getTT),
            'Average WT': average(getWT)
        },
        sched: schedule
    }
}

module.exports = roundRobin