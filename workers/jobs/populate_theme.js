import {
  ThemesStorage,
  InsightStorage,
  ThemesInsightsStorage
} from '../../storage'

import Algolia from '../../algolia'

export default {
  perform: async ({ id }, done) => {
    console.log('Populating theme with id ' + id + '...')
    let theme     = await ThemesStorage.load(id)
    let hits      = await Algolia(theme.name)
    let insights  = await InsightStorage.createMany(hits.map(hit => ({ id: hit.objectID, content: hit.content })))
    try {
      await ThemesInsightsStorage.deleteForThemeID(theme.id)
      await ThemesInsightsStorage.insertForThemeID(theme.id, insights.map(insight => insight.id))
      await ThemesStorage.update(id, { last_fetched_at: new Date })
    } catch(error) {
      console.log("Error: ", error)
    }
    done()
  }
}
