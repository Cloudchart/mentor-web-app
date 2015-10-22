import {
  UserStorage,
  UserThemeInsightStorage
} from '../../storage'

export default {
  // schedule: '*/30 * * * * *',

  immediate:  true,

  name: 'Fetch users subscribed on themes',

  perform: async (payload, done) => {
    console.log('Fetching users subscribed on themes...')
    let records = await UserStorage.waitingForInsights()
    records.forEach(({ user_id, theme_id }) => {
      UserThemeInsightStorage.statusForUserTheme(user_id, theme_id).then(status => {
        console.log(status)
      })
    })
    done()
  }
}
