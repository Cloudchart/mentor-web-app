import Bluebird from 'bluebird'

import Algolia from '../../algolia'

import {
  ThemeStorage,
  InsightStorage,
  ThemeInsightStorage
} from '../../storage'


const FetchDelay = 24 * 60 * 60 * 1000


let perform = async ({ themeID }, callback) => {
  let now   = new Date
  let theme = await ThemeStorage.load(themeID)

  if (theme.last_fetched_at && (now - theme.last_fetched_at) < FetchDelay )
    return callback()

  let hits = await Algolia(theme.name)

  await InsightStorage.createMany(hits.map(hit => ({ id: hit.objectID, content: hit.content })))
  await ThemeInsightStorage.destroyAllForTheme(themeID)
  await ThemeInsightStorage.createMany(hits.map(hit => ({ insight_id: hit.objectID, theme_id: themeID })))
  await ThemeStorage.update(themeID, { last_fetched_at: now })

  callback()
}


let performAsync = Bluebird.promisify(perform)


export default {
  perform: (payload, callback) =>
    callback instanceof Function
      ? perform(payload, callback)
      : performAsync(payload)
}
