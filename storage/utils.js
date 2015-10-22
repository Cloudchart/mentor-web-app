
let mapReduce = (ids, records, key) => {
  let reducedRecords = records.reduce((memo, record) => {
    memo[record[key]] = record.get({ plain: true })
    return memo
  }, {})
  return ids.map(id => reducedRecords[id] || new Error(id))
}

export default {
  mapReduce
}
