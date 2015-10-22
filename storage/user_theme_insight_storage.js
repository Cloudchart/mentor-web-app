import DataLoader from 'dataloader'
import models from '../models'
import { mapReduce } from './utils'


let loaders = {}

let loader = (userID, themeID) =>
  loaders[`${userID}:${themeID}`] || (loaders[`${userID}:${themeID}`] = new DataLoader(finder.bind(this, userID, themeID)))

let finder = (userID, themeID, insightIDs) =>
  models.UserInsightTheme.findAll({
    where: {
      user_id:    userID,
      theme_id:   themeID,
      insight_id: { $in: insightIDs }
    }
  }).then(records => mapReduce(insightIDs, records, 'insight_id'))


let load      = (userID, themeID, insightID)  => loader(userID, themeID).load(insightID)
let loadMany  = (userID, themeID, insightIDs) => loader(userID, themeID).loadMany(insightIDs)
let clear     = (userID, themeID, insightID)  => loader(userID, themeID).clear(insightID)
let clearAll  = (userID, themeID)             => loader(userID, themeID).clearAll()


let idsForUserTheme = (userID, themeID) =>
  models.UserInsightTheme.findAll({
    attributes: ['insight_id'],
    where: { user_id: userID, theme_id: themeID }
  }).then(records => records.map(record => record.insight_id))


export default {

  load:       load,
  loadMany:   loadMany,
  clear:      clear,
  clearAll:   clearAll,

  idsForUserTheme: idsForUserTheme,

  allForUserTheme: (userID, themeID) =>
    idsForUserTheme(userID, themeID)
      .then(insightIDs => loadMany(userID, themeID, insightIDs))
  ,

  create: (userID, themeID, insightIDs) =>
    models.UserInsightTheme.bulkCreate(insightIDs.map(insightID => ({
      user_id:    userID,
      theme_id:   themeID,
      insight_id: insightID
    }))).then(() => clearAll(userID, themeID))

  ,

  update: (userID, themeID, insightID, attributes = {}) =>
    models.UserInsightTheme.update(attributes, {
      where: {
        user_id:      userID,
        theme_id:     themeID,
        insight_id:   insightID
      }
    }).then(() => clear(userID, themeID, insightID))

}
