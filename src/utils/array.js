/**
 * Created by soeholm on 26.02.17.
 */
function range (start, end) {
    if (start === undefined) throw new Error('Start not given')
    if (end === undefined) {
        end = start
        start = 0
    }
    const array = []
    for (let i = start; i < end; i++) {
        array.push(i)
    }
    return array
}

module.exports = {range}
