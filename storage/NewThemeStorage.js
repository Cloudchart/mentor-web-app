import BaseStorage from './BaseStorage'
import models from '../models'

let storage = BaseStorage('Theme')

const themesTableName       = models.Theme.tableName
const usersThemesTableName  = models.UserTheme.tableName

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

const RelatedThemesIDsQuery = `
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

const UnrelatedThemesIDsQuery = `
  select
    t.id
  from
    ${themesTableName} as t
  left outer join
    ${usersThemesTableName} as ut
  on
    t.id = ut.theme_id
  where
    (ut.status is null and t.is_default = 0)
    or
    (ut.status = 'rejected' and ut.user_id = :userID)
  order by
    t.name
`.trim().replace(/\s+/g, ' ')

const SubscribedThemesIDsQuery = `
  select
    t.id
  from
    ${themesTableName} as t
  left outer join
    ${usersThemesTableName} as ut
  on
    t.id = ut.theme_id
  where
    ut.status = 'subscribed' and ut.user_id = :userID
  order by
    t.name
`.trim().replace(/\s+/g, ' ')


let idsQueries = {
  'default':    DefaultThemesIDsQuery,
  'related':    RelatedThemesIDsQuery,
  'unrelated':  UnrelatedThemesIDsQuery,
  'subscribed': SubscribedThemesIDsQuery
}


let loadAllIDs = (key, replacements = {}) =>
  idsQueries[key]
    ? models.sequelize
      .query(idsQueries[key], { replacements: replacements })
      .then(([records]) => records.map(record => record.id))
    : new Error(`Query "${key}" is not supported`)


let loadAll = (key, replacements = {}) =>
  loadAllIDs(key, replacements)
    .then(ids =>
      ids instanceof Error
        ? ids
        : storage.loadMany(ids)
    )


export default Object.assign(storage, {
  loadAllIDs: loadAllIDs,
  loadAll:    loadAll
})
