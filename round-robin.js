const { all, compose, curry, div, forEach, head, len, prop, set, map, print, reduce, round } = require('./funcs')
const JobQueue = require('./job-queue')
const Gantt    = require('./gantt')

/**
 * Documentation:
 *     get...            :: a -> b
 *     set...            :: a -> b -> a
 *     initRemainingTime :: a -> [a]
 *     jobIsComplete     :: a -> Boolean
 *     schedIsComplete   :: a -> Boolean
 *     removeRM          :: a -> ()
 *     calculate...      :: a -> Number
 *     record...         :: a -> ()
 *     accumulator       :: (a -> b) -> a -> b -> a
 *     roundRobin        :: (a, b) -> Object
 */
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
const initRemainingTime = (sched) => map((job) => setRM(job, getBT(job)), sched)
const jobIsComplete     = (job) => getRM(job) === 0
const schedIsComplete   = (sched) => all(jobIsComplete, sched)
const removeRM          = (job) => delete job.RM
const calculateTT       = (job) => getCMP(job) - getAT(job)
const calculateWT       = (job) => getTT(job) - getBT(job)
const recordTT          = (job) => setTT(job, calculateTT(job))
const recordWT          = (job) => setWT(job, calculateWT(job))
const accumulator       = curry((get, acc, curr) => get(curr) + acc)

function roundRobin(rawSched, quantum) {
    const schedule  = initRemainingTime(rawSched)
    const schedSize = len(schedule)
    const queue     = new JobQueue()
    let   gantt     = new Gantt()
    let   time      = 0
    let   q_time    = time + quantum

    const recordTime = (time) => gantt.record({
        time: time,
        job:  getPID(queue.peek()) || 'None'
    })

    // Algotithm START
    while (!(schedIsComplete(schedule))) {
        forEach(job => {
            if (getAT(job) === time) {
                queue.enqueue(job)
                // Do not record job's arrival except for jobs with arrival time of zero
                if (time === 0) { recordTime(time) }
            }
        }, schedule)

        if (time < q_time) {
            if (jobIsComplete(queue.peek())) {
                job    = queue.dequeue()
                q_time = time + quantum

                setCMP(job, time)
                recordTime(time)
            }

            queue.decreaseCurrentJobRemainingTime()
        } else if (time === q_time) {
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

    const lastJob = queue.dequeue()

    setCMP(lastJob, time)
    recordTime(time)
    // Algorithm END

    forEach(removeRM, schedule)
    forEach(recordTT, schedule)
    forEach(recordWT, schedule)

    // total :: ((a, b) -> a) -> Number
    const total   = (acc) => reduce(acc, 0, schedule)
    // Create accumulator -> Get total -> Divide by schedule size -> Round up to two decimal places
    // average :: (a -> b) -> Number
    const average = compose(round(2), div(schedSize), total, accumulator)

    return {
        gantt: gantt.history,
        data:  {
            totalTime: time,
            averageTT: average(getTT),
            averageWT: average(getWT)
        },
        sched: schedule
    }
}

module.exports = roundRobin
