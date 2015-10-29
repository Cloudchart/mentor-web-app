import BaseStorage from './BaseStorage'
import models from '../models'

let storagesForUsers = {}

let storage = BaseStorage('UserTheme')

const ThemeIDsQuery = `
  select
    id
  from
    ${models.UserTheme.tableName}
  where
    user_id = :userID and theme_id in (:themesIDs)
`.trim().replace(/\s+/g, ' ')


let finderForUser = (userID) =>
  (ids) =>
    models.sequelize
      .query(ThemeIDsQuery, { replacements: { userID, themesIDs: ids }})
      .then(([records]) => records.map(record => record.id))
      .then(ids => storage.loadMany(ids))


let forUser = (userID) =>
  storagesForUsers[userID] || (
    storagesForUsers[userID] = BaseStorage('UserTheme', { finder: finderForUser(userID), cache: false })
  )

export default Object.assign(storage, { forUser })
