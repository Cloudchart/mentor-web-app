import DataLoader from 'dataloader'
import models from '../models'
import { mapReduce } from './utils'


let loaders = {}

let idsFinder = (themeIDs) =>
  models.ThemeInsight
    .findAll({
      attributes: ['theme_id', 'insight_id'],
      where: { theme_id: { $in: themeIDs } }
    })
    .then(records => records.reduce((memo, record) => {
      memo[record.theme_id] || (memo[record.theme_id] = [])
      memo[record.theme_id].push(record.insight_id)
      return memo
    }, {}))
    .then(records => themeIDs.map(themeID => records[themeID]))


let idsLoader = new DataLoader(idsFinder, { cache: false })


let loader = (themeID) =>
  loaders[themeID] || (loaders[themeID] = new DataLoader(finder.bind(this, themeID)))


let finder  = (themeID, insightIDs) =>
  models.ThemeInsight.findAll({
    where: {
      theme_id: themeID,
      insight_id: { $in: insightIDs }
    }
  }).then(records => mapReduce(insightIDs, records, 'insight_id') )


let load      = (themeID, insightID)  => loader(themeID).load(insightID)
let loadMany  = (themeID, insightIDs) => loader(themeID).loadMany(insightIDs)
let loadAll   = (themeID)             => idsLoader.load(themeID).then(insightIDs => loadMany(themeID, insightIDs))

let clear = (themeID, insightID) => {
  return loader(themeID).clear(insightID)
}

let clearAll  = (themeID) => {
  idsLoader.clear(themeID)
  return loader(themeID).clearAll()
}


export default {
  load:       load,
  loadMany:   loadMany,
  loadAll:    loadAll,
  clear:      clear,
  clearAll:   clearAll,

  idsForTheme: (themeID) => idsLoader.load(themeID)

  ,

  createMany: (themeID, insightIDs) =>
    models.ThemeInsight
      .bulkCreate(insightIDs.map(insightID => ({ theme_id: themeID, insight_id: insightID })))
      .then(() => clearAll(themeID))
      .then(() => loadAll(themeID))

  ,

  deleteAll: (themeID) =>
    models.ThemeInsight
      .destroy({
        where: { theme_id: themeID }
      })
      .then(() => clearAll(themeID))
      .then(() => [])
}
