import Bluebird from 'bluebird'

const InitialInsightsCount = 10
const MaxSubscribedInsightsCount = 24
const InsightsRate = 1 / (60 * 60 * 1000)


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

  console.log(userTheme.status)
  console.log(ratedInsights.length)
  console.log(unratedInsights.length)

  if ((ratedInsights.length + unratedInsights.length) > 0) {
    throw new Error('Not implemented')
  }

  if (count > 0) {
    let newInsightsIDs = ThemeInsightStorage.loadAllIDs('new', { userID, themeID })
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
