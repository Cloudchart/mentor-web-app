import DataLoader from 'dataloader'
import models from '../models'

import {
  mapReduce
} from './utils'


let createStorage = (modelName, options = {}) => {
  let model = models[modelName]

  let finder = (ids) =>
    model
      .findAll({where:{id:{$in:ids}}})
      .then(records => mapReduce(ids, records, 'id', modelName))

  let loader = new DataLoader(finder)

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
        .query(options.idsQueries[key], { replacements: replacements })
        .then(([records]) => records.map(record => record.id))
      : new Error(`Query "${key}" is not supported`)


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
