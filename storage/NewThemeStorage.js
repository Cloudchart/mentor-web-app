import BaseStorage from './BaseStorage'
import models from '../models'

let storage = BaseStorage('Theme')

const themesTableName       = models.Theme.tableName
const usersThemesTableName  = models.UserTheme.tableName

const AvailableThemesIDsQuery = `
  select
    t.id
  from
    ${themesTableName} as t
  left outer join
    ${usersThemesTableName} as ut
  on
    t.id = ut.theme_id
  where
    (ut.status is null and t.is_default = 1)
    or
    (ut.status in ('visible', 'subscribed') and ut.user_id = :userID)
  order by
    t.name
`.trim().replace(/\s+/g, ' ')

const DefaultThemesIDsQuery = `
  select
    t.id
  from
    ${themesTableName} as t
  where
    t.is_default = 1
  order by
    t.name
`.trim().replace(/\s+/g, ' ')


let loadAvailableThemesForUser = (userID, options = {}) =>
  models.sequelize.query(AvailableThemesIDsQuery, { replacements: { userID } })
    .then(([records]) => records.map(record => record.id))
    .then(storage.loadMany)

let loadDefaultThemes = () =>
  models.sequelize.query(DefaultThemesIDsQuery)
    .then(([records]) => records.map(record => record.id))
    .then(storage.loadMany)


export default Object.assign(storage, {
  loadAvailableThemesForUser,
  loadDefaultThemes
})
