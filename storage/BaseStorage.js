import DataLoader from 'dataloader'
import models from '../models'

import {
  mapReduce
} from './utils'


let createStorage = (modelName) => {
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