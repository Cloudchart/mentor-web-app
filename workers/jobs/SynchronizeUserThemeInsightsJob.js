import Bluebird from 'bluebird'

const InitialInsightsCount = 4
const MaxSubscribedInsightsCount = 15
const InsightsRate = 1 / (60 * 1000)


import {
  UserThemeStorage,
  ThemeInsightStorage,
  UserThemeInsightStorage
} from '../../storage'


let perform = async ({ userID, themeID }, callback) => {
  let count           = InitialInsightsCount
  let userTheme       = await UserThemeStorage.loadOne('unique', { userID, themeID })
  let ratedInsights   = await UserThemeInsightStorage.loadAll('ratedForTheme', { userID, themeID })
  let unratedInsights = await UserThemeInsightStorage.loadAll('unratedForTheme', { userID, themeID })

  if ((ratedInsights.length + unratedInsights.length) > 0) {
    count = 0
    let lastUpdate = Math.max(userTheme.updated_at, ratedInsights[0] ? ratedInsights[0].updated_at : 0)
    if (userTheme.status === 'subscribed')
      count = Math.min(
        MaxSubscribedInsightsCount - unratedInsights.length,
        Math.floor((new Date - lastUpdate) * InsightsRate)
      )
  }

  if (count > 0) {
    let newInsightsIDs = await ThemeInsightStorage.loadAllIDs('newForUserTheme', { userID, themeID, limit: count })
    await UserThemeInsightStorage.createMany(newInsightsIDs.map(id => ({ user_id: userID, theme_id: themeID, insight_id: id })))
  }

  callback()
}


let performAsync = Bluebird.promisify(perform)


export default {
  perform: (payload, callback) =>
    callback instanceof Function
      ? perform(payload, callback)
      : performAsync(payload)
}
