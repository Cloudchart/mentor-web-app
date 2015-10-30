import DataLoader from 'dataloader'
import models from '../models'

import {
  mapReduce
} from './utils'


let basicFinder = (modelName, ids) =>
  (ids) =>
    models[modelName]
      .findAll({where:{id:{$in:ids}}})
      .then(records => mapReduce(ids, records, 'id', modelName))


let createStorage = (modelName, options = {}) => {
  let model = models[modelName]

  let finder = options.finder || basicFinder(modelName)

  let loader = new DataLoader(finder, { cache: options.cache !== false })

  let loaderMethods = ['load', 'loadMany', 'clear', 'clearAll']
    .reduce(
      (memo, name) => {
        memo[name] = loader[name].bind(loader)
        return memo
      }, {}
    )


  let loadAllIDs = (key, replacements = {}) =>
    options.idsQueries && options.idsQueries[key]
      ? models.sequelize
        .query(options.idsQueries[key].trim().replace(/\s+/g, ' '), { replacements: replacements })
        .then(([records]) => records.map(record => record.id))
      : Promise.resolve(new Error(`Query "${key}" is not supported`))


  let loadAll = (key, replacements = {}) =>
    loadAllIDs(key, replacements)
      .then(ids =>
        ids instanceof Error
          ? ids
          : loader.loadMany(ids)
      )

  let loadOne = (key, replacements = {}) =>
    loadAll(key, replacements)
      .then(records =>
        records instanceof Error
          ? records
          : records[0]
      )

  let create = (attributes) =>
    model.create(attributes)

  let createMany = (attributesArray) =>
    model.bulkCreate(attributesArray)

  let update = (id, attributes) =>
    model.update(attributes, {where:{id:id}})

  let destroy = (id) =>
    model.destroy({where:{id:id}})

  return {

    ...loaderMethods,

    loader,

    model,

    loadAllIDs,

    loadAll,

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

    destroy: (id) =>
      destroy(id)
        .then(() => loader.clear(id))
        .then(() => null)
  }
}

export default createStorage
