import Bluebird from 'bluebird'

import Algolia from '../../algolia'

import {
  ThemeStorage,
  InsightStorage,
  ThemeInsightStorage
} from '../../storage'

import PubSub from '../PubSub'


const UpdateRate = 24 * 60 * 60 * 1000


let perform = async ({ themeID }, done) => {
  let now   = new Date
  let theme = await ThemeStorage.load(themeID)

  if (!theme)
    return done(new Error('not found'))

  if (now - theme.last_fetched_at < UpdateRate)
    return done(null, new Date - now)

  let hits = await Algolia(theme.name)

  let insights = await InsightStorage.createMany(hits.map(hit => ({ id: hit.objectID, content: hit.content })))

  await ThemeInsightStorage.deleteAll(themeID)
  await ThemeInsightStorage.createMany(themeID, insights.map(insight => insight.id ))
  await ThemeStorage.update(themeID, { last_fetched_at: new Date })

  return done(null, new Date - now)
}


export default {
  perform:        perform,
  performAsync:   Bluebird.promisify(perform)
}
