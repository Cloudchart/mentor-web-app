import {
  ThemeStorage
} from '../../storage'

import enqueue from '../enqueue'

export default {

  schedule: '*/30 * * * * *',

  immediate: true,

  perform: async ({}, done) => {
    console.log('Performing...')
    ThemeStorage.loadAll()
      .then(themes => {
        themes.forEach(theme => enqueue('ActualizeThemeInsights', { themeID: theme.id }))
        done()
      })
  }

}
