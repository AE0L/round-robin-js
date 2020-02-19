const {
    array, compose, floor, forEach, getAt, head, keys, len, log, map, max, print, range, reduce,
    toString, values, repeat, cat
} = require('./funcs')

TLC = '\u250C' // ┌
TRC = '\u2510' // ┐
BLC = '\u2514' // └
BRC = '\u2518' // ┘
HSL = '\u2500' // ─
VSL = '\u2502' // │
LRU = '\u2534' // ┴
LRD = '\u252C' // ┬
UDR = '\u251C' // ├
UDL = '\u2524' // ┤
CRS = '\u253C' // ┼

class CMDTable {
    constructor(data, title = null, margin = 0) {
        this._columns       = keys(head(data))
        this._values        = map(values, data)
        this._rows          = array(this._columns, ...this._values)
        this._title         = title
        this._margin        = repeat(margin, ' ')
        this._columns_width = this._get_columns_width()
        this._width         = this._get_width()
    }

    _get_columns_width() {
        return map((i) => {
            const getColumnLength = compose(len, toString, getAt(i))
            const columnLengths   = map(getColumnLength, this._rows)

            return max(...columnLengths)
        }, range(len(this._columns)))
    }

    _get_width() {
        return reduce((a, c) => a + c + 3, 1, this._columns_width)
    }

    _create_border(left, sep, right) {
        const margin = cat(this._margin, left)
        const cell   = (a) => cat(HSL.repeat(a + 2), sep)
        const row    = (a, b) => cat(a, cell(b))

        return cat(reduce(row, margin, this._columns_width), '\b', right)
    }

    _display_title() {
        const cellWidth   = this._width - 2
        const titleLength = len(this._title)
        const leftPad     = floor((cellWidth - titleLength) / 2)
        const rightPad    = cellWidth - titleLength - leftPad
        const leftSide    = cat(this._margin, VSL, repeat(leftPad, ' '))
        const rightSide   = cat(repeat(rightPad, ' '), VSL)
        const title       = cat(leftSide, this._title, rightSide)

        print(this._create_border(TLC, HSL, TRC))       // Top Border
        print(title)                                    // Centered Title
        print(this._create_border(UDR, LRD, UDL))       // Separator
    }

    _display_row(row) {
        const rowValue   = getAt(row, this._rows)
        const valueRange = range(len(rowValue))
        const leftMargin = cat(this._margin, VSL)
        const remaining  = (val, col) => getAt(col, this._columns_width) - len(toString(val))
        const value      = (row, col) => getAt(col, getAt(row, this._rows))
        const cell       = (val, col) => cat(' ', val, repeat(remaining(val, col), ' '), ' ')
        const createCell = (row) => (acc, col) => cat(acc, cell(value(row, col), col), VSL)

        print(reduce(createCell(row), leftMargin, valueRange))
    }

    display() {
        const printRow = (i) => this._display_row(i)
        const rowRange = range(len(this._rows), 1)

        if (this._title) { this._display_title() }      // Title Cell
        this._display_row(0)                            // Column Header
        print(this._create_border(UDR, CRS, UDL))       // Separator
        forEach(printRow, rowRange)                     // Rows
        print(this._create_border(BLC, LRU, BRC))       // Bottom Border
    }
}

module.exports = CMDTable
