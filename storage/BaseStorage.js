import DataLoader from 'dataloader'
import models from '../models'

import {
  mapReduce
} from './utils'


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

  let loaderMethods = ['load', 'loadMany', 'clear', 'clearAll']
    .reduce(
      (memo, name) => {
        memo[name] = loader[name].bind(loader)
        return memo
      }, {}
    )

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
        .then(record => loader.clear(record.id).load(record.id))
    ,

    createMany: (attributesArray = []) =>
      createMany(attributesArray)
        .then(result => null)

    ,

    update: (id, attributes = {}) =>
      update(id, attributes)
        .then(record => loader.clear(id).load(id))
    ,

    destroy: async (id) => {
      let record = await loader.load(id)
      await destroy(record.id)
        .then(() => loader.clear(id))
        .then(() => null)
      await options.afterDestroy && options.afterDestroy(record)
      return null
    }

  }
}

export default createStorage
