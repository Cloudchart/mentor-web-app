import { ThemesStorage } from '../../storage'
import enqueue from '../enqueue'

export default {
  schedule: '*/30 * * * * *',

  // immediate:  true,

  name: 'Fetch themes pending for population',

  perform: async (payload, done) => {
    // console.log('>> Fetching themes pending for population...')
    let themes = await ThemesStorage.allPendingForPopulate()
    console.log(`<< Fetched ${themes.length} pending theme(s)`)
    themes.forEach(theme => enqueue('populateTheme', { id: theme.id }))
    done()
  }
}
