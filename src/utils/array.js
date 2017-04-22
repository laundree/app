// @flow
export function range (start: number, end?: number) {
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
