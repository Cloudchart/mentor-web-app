import Immutable from 'immutable'

let ids = Immutable.Seq([
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7'
])

let cursor = '3'
let count = 5

ids = ids.reverse()

console.log(ids.skip(ids.indexOf(cursor) + 1).take(count).reverse())
