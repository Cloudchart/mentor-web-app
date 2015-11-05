import Bluebird from 'bluebird'

import ThemeStorage from '../../storage/ThemeStorage'
import UserThemeStorage from '../../storage/UserThemeStorage'


let perform = async ({ userID }, callback) => {
  let unrelatedThemesIDs = await ThemeStorage
    .loadAll('unrelated', { userID })
    .then(records => records.map(record => record.id))

  await UserThemeStorage
    .createMany(unrelatedThemesIDs.map(id => ({ theme_id: id, user_id: userID, status: 'available' })))
    .catch(e => console.log("ERROR:", e))

  callback()
}


let performAsync = Bluebird.promisify(perform)


export default {
  perform: (payload, callback) =>
    callback instanceof Function
      ? perform(payload, callback)
      : performAsync(payload)
}
