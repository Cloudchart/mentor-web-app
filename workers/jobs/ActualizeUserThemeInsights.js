import Bluebird from 'bluebird'
import Immutable from 'immutable'

const DefaultDelta  = 10
const MaxDelta      = 24
const InsightRate   = 1 / (60 * 60 * 1000)

import {
  UserThemeStorage,
  ThemeInsightStorage,
  UserThemeInsightStorage
} from '../../storage'


let perform = async ({ userID, themeID }, done) => {
  let start     = new Date

  let userTheme = await UserThemeStorage.load(userID, themeID)
  if (!userTheme) { return done() }

  let delta               = DefaultDelta
  let themeInsightIDs     = await ThemeInsightStorage.idsForTheme(themeID)
  let userThemeInsights   = await UserThemeInsightStorage.allForUserTheme(userID, themeID)
  let userThemeInsightIDs = Immutable.Seq(userThemeInsights).map(record => record.insight_id)

  if (userThemeInsightIDs.size > 0) {
    delta = 0
    if (userTheme.status == 'subscribed') {
      let now             = + new Date
      let unratedInsights = Immutable.Seq(userThemeInsights).filter(insight => !insight.rate)
      let latestInsight   = Immutable.Seq(userThemeInsights).sortBy(insight => insight.created_at).last()
      let timeDelta       = now - latestInsight.created_at
      delta               = Math.min(MaxDelta - unratedInsights.count(), Math.floor(timeDelta * InsightRate))
      delta               = delta < 0 ? 0 : delta
    }
  }

  if (delta > 0) {
    let newInsightIDs = Immutable.Seq(themeInsightIDs)
      .filterNot(id => userThemeInsightIDs.contains(id))
      .take(delta)

    delta = newInsightIDs.count()

    await UserThemeInsightStorage.create(userID, themeID, newInsightIDs.toArray())
  }

  let finish = new Date

  done(null, [delta, finish - start])
}

let performAsync = Bluebird.promisify(perform)

export default {

  perform:        perform,
  performAsync:   performAsync

}
