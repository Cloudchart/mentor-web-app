import DataLoader from 'dataloader'
import models from '../models'
import moment from 'moment'
import { mapReduce } from './utils'

import PubSub from '../workers/PubSub'

let findRecords = (ids) => {
  return models.Theme.findAll({
    where: { id: { $in: ids } }
  }).then(records => mapReduce(ids, records, 'id'))
}

let recordLoader = new DataLoader(findRecords, { cache: false })


PubSub.subscribe('model:Theme:cache-clear', (_, message) => {
  console.log('Clearing cache for theme "' + message + '"')
  recordLoader.clear(message)
})


let idsForQuery = (query = {}) =>
  models.Theme
    .findAll(Object.assign(query, { attributes: ['id'] }))
    .then(records => records.map(record => record.id))


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

  loadByName: function(name) {
    return models.Theme.find({
      attributes: ['id'],
      where:      { name: name }
    }).then(record => {
      if (!record) return null
      return recordLoader.load(record.id)
    })
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
