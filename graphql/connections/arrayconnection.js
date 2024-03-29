const PREFIX = 'connection:'

let base64Encode = (string) =>
  new Buffer(string, 'utf8').toString('base64')

let base64Decode = (string) =>
  new Buffer(string, 'base64').toString('utf8')

let cursorToId = (cursor) =>
  base64Decode(cursor).slice(PREFIX.length)

let idToCursor = (id) =>
  base64Encode(PREFIX + id)


export function nodeToEdge(node) {
  return { node: node, cursor: idToCursor(node.id) }
}

export function edgesToReturn(edges, { first, last }) {
  if (first)
    if (edges.length > first)
      edges = edges.slice(0, first)

  if (last)
    if (edges.length > last)
      edges = edges.slice(edges.length - last)

  return edges
}

export function applyCursorToEdges(edges, { before, after }) {
  if (after) {
    let afterEdge = edges.find(edge => edge.cursor === after)
    if (afterEdge)
      edges = edges.slice(edges.indexOf(afterEdge) + 1)
  }
  if (before) {
    let beforeEdge = edges.find(edge => edge.cursor === before)
    if (beforeEdge)
      edges = edges.slice(0, edges.indexOf(beforeEdge))
  }
  return edges
}

export function hasPreviousPage(edges, { last }) {
  return !!last && edges.length > last
}

export function hasNextPage(edges, { first }) {
  return !!first && edges.length > first
}

export function connectionFromArray(nodes, { after, before, first, last }) {
  let edges = nodes.map(node => nodeToEdge(node))
  let slicedEdges = applyCursorToEdges(edges, { after, before })

  let hasNextEdge = false
  let hasPreviousEdge = false

  if (before) {
    let edge = edges.find(edge => edge.cursor === before)
    hasNextEdge = edges.indexOf(edge) < edges.length
  }

  if (after) {
    let edge = edges.find(edge => edge.cursor === after)
    hasPreviousEdge = edges.indexOf(edge) > -1
  }

  return {
    edges: edgesToReturn(slicedEdges, { first, last }),
    pageInfo: {
      hasPreviousPage: hasPreviousPage(slicedEdges, { last }) || hasPreviousEdge,
      hasNextPage: hasNextPage(slicedEdges, { first }) || hasNextEdge,
    }
  }
}
