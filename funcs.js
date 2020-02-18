const compose = (...fns) => (...args) => fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0]
const curry   = (fn) => function $curry(...args) { return args.length < fn.length ? $curry.bind(null, ...args) : fn.call(null, ...args) }

/** 
 * Documentation:
 *     all     :: (a -> Boolean) -> [a] -> Boolean
 *     div     :: Number -> Number -> Number
 *     forEach :: (a -> ()) -> [a] -> ()
 *     head    :: [a] -> a | Undefined
 *     len     :: [a] | String -> Number
 *     map     :: (a -> a) -> [a] -> [a]
 *     print   :: String -> ()
 *     prop    :: String -> Object -> a | Undefined
 *     push    :: a -> [b] -> ()
 *     reduce  :: ((a, b) -> a) -> a -> [b] -> a
 *     round   :: Nmber -> Number -> Number
 *     set     :: String -> Object -> a -> a
 *     shift   :: [a] -> a
 */
const all     = curry((a, b) => b.every(a))
const div     = curry((a, b) => b / a)
const forEach = curry((a, b) => b.forEach(a))
const head    = (a) => a[0]
const len     = (a) => a.length
const map     = curry((a, b) => b.map(a))
const print   = console.log
const prop    = curry((a, b) => b[a])
const push    = curry((a, b) => a.push(b))
const reduce  = curry((a, b, c) => c.reduce(a, b))
const round   = curry((a, b) => b.toFixed(a))
const set     = curry((a, b, c) => { b[a] = c; return b})
const shift   = (a) => a.shift()

module.exports = {
    all:     all,
    compose: compose,
    curry:   curry,
    div:     div,
    forEach: forEach,
    head:    head,
    len:     len,
    map:     map,
    print:   print,
    prop:    prop,
    push:    push,
    reduce:  reduce,
    round:   round,
    set:     set,
    shift:   shift,
}
