import DataLoader from 'dataloader'
import Models from '../models'


export const cacheKeyFn = (key) =>
  Object.keys(key).sort().map(part => `${part}:${key[part]}`).join('::')


export const uniqueIDs = (records) =>
  records
    .map(({ id }) => id)
    .filter((value, ii, ids) => ids.indexOf(value) === ii)


export const reduceRecords = (records, fields, { singular }) =>
  records.reduce((memo, record) => {
    let key = fields.reduce((key_memo, field) => {
      key_memo[field] = record[field]
      return key_memo
    }, {})

    memo[key] = singular ? record : (memo[key] || (memo[key] = [])).concat(record)

    return memo
  }, {})


export const buildReplacements = (fields, ids) =>
  fields.reduce((memo, field) => {
    memo[field] = ids.map(id => id[field])
    return memo
  }, {})


let fetch = async (ids) =>
  await Models.sequelize
    .query(`select * from roles where id in (:ids)`, {
      replacements: { ids },
      type: Models.sequelize.QueryTypes.SELECT
    })
    .then(records => {
      records = records.reduce((memo, record) => {
        memo[record.id] = record
        return memo
      }, {})

      return ids.map(id => records[id] || new Error('Not found.'))
    })


let fetchByFields = (query, fields, options) =>
  async (ids) => {

    let singular = options && options.singular === true

    return await Models.sequelize
      .query(query, {
        replacements: buildReplacements(fields, ids),
        type: Models.sequelize.QueryTypes.SELECT
      })
      .then(async (records) => {

        let children = await IDLoader
          .loadMany(uniqueIDs(records))
          .then(children => reduceRecords(children, fields, { singular }))

        return ids.map(id => children[id])
      })
  }


const IDLoader = new DataLoader(fetch)


const Loaders = {

  'user_id': new DataLoader(
    fetchByFields(
      `select id, user_id from roles where user_id in (:user_id)`,
      ['user_id']
    ), { cacheKeyFn } ),

  'user_id_and_name': new DataLoader(
    fetchByFields(
      `select id, user_id, name from roles where user_id in (:user_id) and name in (:name)`,
      ['user_id', 'name'], { singular: true }
    ), { cacheKeyFn })

}


let queryBuilder = (primaryKeyLoader, options = {}) => {

}

queryBuilder({
  query:    `select id from roles where user_id in (:user_id) and name in (:name)`,
  fields:   ['user_id', 'name'],
  singular: true
})

export default {

  load: async (key, id) =>
    await id
      ? Loaders[key].load(id)
      : IDLoader.load(key)
  ,

  loadMany: async (key, ids) =>
    await ids
      ? Loaders[key].loadMany(ids)
      : IDLoader.loadMany(key)
  ,

  clear: async (id) => {
    let record = await IDLoader.load(id)
    IDLoader.clear(id)
    Loaders['user_id'].clear({ user_id: record.user_id })
    Loaders['user_id_and_name'].clear({ user_id: record.user_id, name: record.name })
  }
  ,

  clearAll: () => {
    IDLoader.clearAll()
    Object.keys(Loaders).forEach(loader => loader.clearAll())
  }

}
