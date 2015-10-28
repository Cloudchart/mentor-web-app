
let mapReduce = (ids, records, key, type) => {
  let reducedRecords = records.reduce((memo, record) => {
    memo[record[key]] = Object.assign(record.get({ plain: true }), { __type: type })
    return memo
  }, {})
  return ids.map(id => reducedRecords[id] || new Error(id))
}

export default {
  mapReduce
}
