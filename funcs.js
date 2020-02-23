const compose  = (...fns) => (...args) => fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0]
const curry    = (fn) => function $curry(...args) { return args.length < fn.length ? $curry.bind(null, ...args) : fn.call(null, ...args) }

// Point-free functions
const all       = curry((a, b) => b.every(a))
const array     = (...a) => [...a]
const backspace = (a) => a.slice(0, -1)
const cat       = (a, ...b) => a.concat(...b)
const div       = curry((a, b) => b / a)
const floor     = (a) => ~~a
const forEach   = curry((a, b) => b.forEach(a))
const getAt     = curry((a, b) => b[a])
const head      = (a) => a[0]
const keys      = (a) => Object.keys(a)
const len       = (a) => a.length
const log       = (a) => { print(a); return a }
const map       = curry((a, b) => b.map(a))
const max       = Math.max
const pop       = (a) => a.pop()
const print     = console.log
const prop      = curry((a, b) => b[a])
const push      = curry((a, b) => a.push(b))
const range     = (a, b = 0) => slice(b, array(...Array(a).keys()))
const reduce    = curry((a, b, c) => c.reduce(a, b))
const repeat    = curry((a, b) => b.repeat(a))
const round     = curry((a, b) => b.toFixed(a))
const set       = curry((a, b, c) => { b[a] = c; return b})
const shift     = (a) => a.shift()
const slice     = curry((a, b) => b.slice(a))
const toString  = (a) => a.toString()
const values    = (a) => Object.values(a)

module.exports = {
    all:       all,
    array:     array,
    backspace: backspace,
    cat:       cat,
    compose:   compose,
    curry:     curry,
    div:       div,
    floor:     floor,
    forEach:   forEach,
    getAt:     getAt,
    head:      head,
    keys:      keys,
    len:       len,
    log:       log,
    map:       map,
    max:       max,
    pop:       pop,
    print:     print,
    prop:      prop,
    push:      push,
    range:     range,
    reduce:    reduce,
    repeat:    repeat,
    round:     round,
    set:       set,
    shift:     shift,
    slice:     slice,
    toString:  toString,
    values:    values,
}
