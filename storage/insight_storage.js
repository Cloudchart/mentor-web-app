import DataLoader from 'dataloader'
import models from '../models'
import { mapReduce } from './utils'


let findRecords = (ids) => {
  return models.Insight.findAll({
    where: { id: { $in: ids } }
  }).then(records => mapReduce(ids, records, 'id'))
}


let loader = new DataLoader(findRecords)


export default {

  load: (id) => loader.load(id)

  ,

  loadMany: (ids) => loader.loadMany(ids)

  ,

  createMany: (records) => {
    return models.Insight
      .bulkCreate(records, { ignoreDuplicates: true })
      .then(() => loader.loadMany(records.map(record => record.id)))
  }

  ,

  loadOrCreate: async ({ id, content }) => {
    try {
      return await loader.load(id)
    } catch(error) {
      await models.Insight.create({ id, content })
      return await loader.clear(id).load(id)
    }
  }

}
