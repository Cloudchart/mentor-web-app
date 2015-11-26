import Bluebird from 'bluebird'

import Algolia from '../../algolia'

import {
  ThemeStorage,
  InsightStorage,
  InsightOriginStorage,
  ThemeInsightStorage
} from '../../storage'


const FetchDelay = 24 * 60 * 60 * 1000


let filterHits = (query) =>
  (hits) =>
    hits.filter(hit => hit.pinboard_tags && hit.pinboard_tags.indexOf(query) >= 0)


let perform = async ({ themeID }, callback) => {
  let now   = new Date
  let theme = await ThemeStorage.load(themeID)

  if (theme.last_fetched_at && (now - theme.last_fetched_at) < FetchDelay )
    return callback()

  let query = theme.name.toLowerCase()
  let hits  = await Algolia(query).then(filterHits(query))

  await InsightStorage.createMany(hits.map(hit => ({
    id: hit.objectID,
    content: hit.content,
    source_url: hit.origin && hit.origin.url,
    source_title: hit.origin && hit.origin.title,
    source_duration: hit.origin && hit.origin.duration,
    source_author: hit.user && hit.user.name,
  })))

  await InsightOriginStorage.createMany(hits
    .filter(hit => hit.origin)
    .map(hit => ({
      id: hit.objectID,
      url: hit.origin.url,
      title: hit.origin.title,
      duration: hit.origin.duration,
      author: hit.user.name,
    }))
  )

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
