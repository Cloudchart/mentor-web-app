import DataLoader from 'dataloader'
import models from '../models'
import { mapReduce } from './utils'


let loaders = {}

let loader  = (themeID) =>
  loaders[themeID] || (loaders[themeID] = new DataLoader(finder.bind(this, themeID)))

let finder  = (themeID, insightIDs) => {
  models.ThemeInsight.findAll({
    where: {
      theme_id: themeID,
      insight_id: { $in: insightIDs }
    }
  }).then(records => mapReduce(insightIDs, records, 'insight_id') )
}

let load      = (themeID, insightID)  => loader(themeID).load(insightID)
let loadMany  = (themeID, insightIDs) => loader(themeID).loadMany(insightIDs)


export default {
  load:       load,
  loadMany:   loadMany,

  idsForTheme: (themeID) =>
    models.ThemeInsight.findAll({
      attributes: ['insight_id'],
      where: { theme_id: themeID }
    }).then(records => records.map(record => record.insight_id))
}
