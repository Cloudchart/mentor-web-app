import Bluebird from 'bluebird'


import UserThemeStorage from '../../storage/UserThemeStorage'
import UserThemeInsightStorage from '../../storage/UserThemeInsightStorage'


let perform = async ({ id }, callback) => {
  let userTheme       = await UserThemeStorage.load(id)
  let ratedInsights   = await UserThemeInsightStorage.loadAll('ratedForTheme', { userID: userTheme.user_id, themeID: userTheme.theme_id })
  let unratedInsights = await UserThemeInsightStorage.loadAll('unratedForTheme', { userID: userTheme.user_id, themeID: userTheme.theme_id })

  console.log(ratedInsights.length)
  console.log(unratedInsights.length)

  callback()
}


let performAsync = Bluebird.promisify(perform)


export default {
  perform: (payload, callback) =>
    callback instanceof Function
      ? perform(payload, callback)
      : performAsync(payload)
}
