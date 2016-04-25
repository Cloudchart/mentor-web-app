import Redis from 'ioredis'
import DataLoader from 'dataloader'
import models from '../models'

import {
  mapReduce
} from './utils'


let createBroadcastPayload = (id) =>
  JSON.stringify({
    pid:  process.pid,
    id:   id
  })


let basicFinder = (storageName, modelName, ids) =>
  (ids) =>
    models[modelName]
      .findAll({where:{id:{$in:ids}}})
      .then(records => mapReduce(ids, records, 'id', storageName))


let createStorage = (storageName, options = {}) => {
  let modelName = options.modelName || storageName

  let model = models[modelName]

  let finder = options.finder || basicFinder(storageName, modelName)

  let loader = new DataLoader(finder, { cache: options.cache !== false })

  let pubRedis = null
  let subRedis = null

  let _initializeSub = () => {
    if (subRedis) return

    subRedis = new Redis()

    subRedis.subscribe(`mentor:${modelName}:clear`, `mentor:${modelName}:clearAll`)

    subRedis.on('message', (channel, message) => {
      let [_, name, action] = channel.split(':')

      if (name !== modelName) return

      let payload = null
      try { payload = JSON.parse(message) } catch(error) {}

      if (!payload || payload.pid === process.pid) return

      if (action === 'clear') {
        console.log('Receibed clear request for id:', payload.id, storageName)
        return loaderMethods.clear(payload.id)
      }

      if (action === 'clearAll') {
        console.log('Receibed clear request for all records', storageName)
        return loaderMethods.clearAll()
      }
    })
  }

  let _initializePub = () => {
    if (pubRedis) return

    pubRedis = new Redis()
  }

  let _initializePubSub = () => {
    _initializePub()
    _initializeSub()
  }

  let loaderMethods = {
    load: (id) => {
      _initializePubSub()
      return loader.load(id)
    },
    loadMany: (ids) => {
      _initializePubSub()
      return loader.loadMany(ids)
    },
    clear: (id, shouldBroadcast) => {
      _initializePubSub()
      if (shouldBroadcast)
        pubRedis.publish(`mentor:${modelName}:clear`, createBroadcastPayload(id))
      return loader.clear(id)
    },

    clearAll: (shouldBroadcast) => {
      _initializePubSub()
      if (shouldBroadcast)
        pubRedis.publish(`mentor:${modelName}:clearAll`, createBroadcastPayload())
      return loader.clearAll()
    }
  }

  let queriesMethods      = {}

  let loadAllIDs = (key, replacements) =>
    options.idsQueries && options.idsQueries[key]
      ? models.sequelize
          .query(options.idsQueries[key].trim().replace(/\s+/g, ' '), { replacements })
          .then(([records]) => records.map(record => record.id))
      : Promise.resolve(new Error(`Query "${key}" is not supported`))


  let loadAll = (key, replacements) =>
    loadAllIDs(key, replacements)
      .then(ids =>
        ids instanceof Error
          ? ids
          : loader.loadMany(ids)
      )

  let count = (key, replacements) =>
    options.idsQueries && options.idsQueries[key]
      ? models.sequelize
          .query(`select count(*) as count from (${options.idsQueries[key]}) c`.trim().replace(/\s+/g, ' '), { replacements })
          .then(([[{count}]]) => count)
      : Promise.resolve(new Error(`Query "${key}" is not supported`))

  let loadOne = (key, replacements = {}) =>
    loadAll(key, replacements)
      .then(records =>
        records instanceof Error
          ? records
          : records[0]
      )

  let create = (attributes) =>
    model.create(attributes)

  let createMany = (attributesArray) => {
    return model.bulkCreate(attributesArray, { ignoreDuplicates: true })
  }

  let update = (id, attributes) =>
    model.update(attributes, {where:{id:id}})

  let destroy = (id) =>
    model.destroy({where:{id:id}})

  return {

    ...loaderMethods,

    ...queriesMethods,

    loader,

    model,

    loadAllIDs,

    loadAll,

    count,

    loadOne,

    create: (attributes = {}) =>
      create(attributes)
        .then(record => loaderMethods.clear(record.id, true).load(record.id))
    ,

    createMany: (attributesArray = []) =>
      createMany(attributesArray)
        .then(result => loaderMethods.clearAll(true))
        .then(result => null)

    ,

    update: (id, attributes = {}) =>
      update(id, attributes)
        .then(record => loaderMethods.clear(id, true).load(id))
    ,

    destroy: async (id) => {
      let record = await loader.load(id)
      await destroy(record.id)
        .then(() => loaderMethods.clear(id, true))
        .then(() => null)
      await options.afterDestroy && options.afterDestroy(record)
      return null
    }

  }
}

export default createStorage
