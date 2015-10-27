const PREFIX = 'records-connection:'

let base64Encode = (string) =>
  new Buffer(string, 'utf8').toString('base64')

let base64Decode = (string) =>
  new Buffer(string, 'base64').toString('utf8')

let nodeToEdge = (node) =>
  ({ node: node, cursor: idToCursor(node.id) })

let cursorToId = (cursor) =>
  base64Decode(cursor).slice(PREFIX.length)

let idToCursor = (id) =>
  base64Encode(PREFIX + id)

let connectionFromRecordsSlice = (records, { after, before, first, last }, { sliceStart, recordsLength } ) => {

  let ids = records.map(record => record.id)

  let sliceEnd      = sliceStart + records.length

  let afterOffset   = after   ? ids.indexOf(cursorToId(after))  : -1
  let beforeOffset  = before  ? ids.indexOf(cursorToId(before)) : recordsLength

  let startOffset   = Math.max(afterOffset, sliceStart - 1, -1) + 1
  let endOffset     = Math.min(beforeOffset, sliceEnd, recordsLength)

  if (last != null)
    startOffset = Math.max(startOffset, endOffset - last)

  if (first != null)
    endOffset = Math.min(endOffset, startOffset + first)

  let slice = records.slice(Math.max(startOffset - sliceStart, 0), records.length - (sliceEnd - endOffset))

  let edges     = slice.map(node => nodeToEdge(node))
  let firstEdge = edges[0]
  let lastEdge  = edges[edges.length - 1]

  let lowerBound  = after   ? afterOffset + 1 : 0
  let upperBound  = before  ? beforeOffset    : recordsLength

  return {
    edges,
    pageInfo: {
      startCursor:      firstEdge ? firstEdge.cursor  : null,
      endCursor:        lastEdge  ? lastEdge.cursor   : null,
      hasPreviousPage:  last  == null ? false : startOffset > lowerBound,
      hasNextPage:      first == null ? false : endOffset   < upperBound
    }
  }

}

export {
  nodeToEdge,
  cursorToId,
  idToCursor,
  connectionFromRecordsSlice
}
