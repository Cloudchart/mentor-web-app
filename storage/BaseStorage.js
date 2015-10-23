import DataLoader from 'dataloader'
import models from '../models'

import {
  mapReduce
} from './utils'


let createStorage = (modelName, modelMethods = {}) => {
  let finder = (ids) =>
    models[modelName]
      .findAll({where:{id:{$in:ids}}})
      .then(records => mapReduce(ids, records, 'id'))


  let loader = new DataLoader(finder)

  let loaderMethods = ['load', 'loadMany', 'clear', 'clearAll']
    .reduce(
      (memo, name) => {
        memo[name] = loader[name].bind(loader)
        return memo
      }, {}
    )


  let create = (attributes) =>
    models[modelName].create(attributes)

  let update = (id, attributes) =>
    models[modelName].update(attributes, {where:{id:id}})

  let destroy = (id) =>
    models[modelName].destroy({where:{id:id}})

  return {

    ...loaderMethods,

    ...modelMethods,

    loader: loader,

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
