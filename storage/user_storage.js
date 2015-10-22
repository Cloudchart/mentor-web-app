import DataLoader from 'dataloader'
import models from '../models'
import { mapReduce } from './utils'


let find = (ids) =>
  models.User
    .findAll({ where: { id: { $in: ids } } })
    .then(records => mapReduce(ids, records, 'id'))


let loader = new DataLoader(find)


let load      = (id)  => loader.load(id)
let loadMany  = (ids) => loader.loadMany(ids)
let clear     = (id)  => loader.clear(id)
let clearAll  = ()    => loader.clearAll()


export default {
  loader: loader,
  find:   loader.load,

  waitingForInsights: () =>
    models.UserTheme.findAll({
      attributes: ['user_id', 'theme_id'],
      where: {
        status: 'subscribed'
      }
    })

  ,

  load:       load,
  loadMany:   loadMany,
  clear:      clear,
  clearAll:   clearAll,

  update: (id, attributes = {}) =>
    models.User
      .update(attributes, { where: { id: id }})
      .then(() => clear(id))

}
