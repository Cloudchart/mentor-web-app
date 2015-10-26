import DataLoader from 'dataloader'
import models from '../models'
import moment from 'moment'
import { mapReduce } from './utils'

let findRecords = (ids) => {
  return models.Theme.findAll({
    where: { id: { $in: ids } }
  }).then(records => mapReduce(ids, records, 'id'))
}

let recordLoader = new DataLoader(findRecords, { cache: false })


let idsForQuery = (query = {}) =>
  models.Theme
    .findAll(Object.assign(query, { attributes: ['id'] }))
    .then(records => records.map(record => record.id))


let idForName = (name) =>
  models.Theme
    .findOne({attributes:['id'],where:{name: name}})
    .then(record => record ? record.id : null)


let create = (attributes = {}) =>
  models.Theme.create(attributes).then(newRecord => recordLoader.load(newRecord.id))


const PopulateTimeout = 3 * 24 * 60 * 60 * 1000


let pendingThemesIDsQuery = () => ({
  attributes: ['id'],
  where: {
    $or: [
      {
        last_fetched_at: { $lt: moment().subtract(PopulateTimeout, 'ms').toDate()}
      }, {
        last_fetched_at: null,
        $or: [
          {
            is_system: true
          }, {
            is_default: true
          }
        ]
      }
    ]
  },
  logging: false
})


export default {

  load: function(id) {
    return recordLoader.load(id)
  },

  loadAll: function() {
    return models.Theme
      .findAll()
      .then(records => records.map(record => record.id))
      .then(ids => recordLoader.loadMany(ids))
  },

  loadByName: async function(name) {
    let id = await idForName(name)
    return id ? recordLoader.load(id) : null
  },

  loadOrCreateByName: async function(name) {
    let id = await idForName(name)
    return id
      ? recordLoader.load(id)
      : create({ name: name })
  },

  loadMany: function(ids) {
    return recordLoader.loadMany(ids)
  },

  loadAllSystem: async function() {
    let ids = await models.Theme.findAll({
      attributes: ['id'],
      where: { is_system: true }
    }).then(records => records.map(record => record.id))
    return recordLoader.loadMany(ids)
  },

  defaultIDs: function() {
    return idsForQuery({ where: { is_default: true } })
  },

  allPendingForPopulate: function() {
    return models.Theme
      .findAll(pendingThemesIDsQuery())
      .then(records => recordLoader.loadMany(records.map(record => record.id)))
  },

  update: function(themeID, attributes) {
    return models.Theme
      .update(attributes, { where: { id: themeID }})
      .then(() => recordLoader.clear(themeID))
  }

}
