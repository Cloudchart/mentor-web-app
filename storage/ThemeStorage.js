import BaseStorage from './BaseStorage'
import models from '../models'

const themesTableName       = models.Theme.tableName
const usersThemesTableName  = models.UserTheme.tableName

const DefaultThemesIDsQuery = `
  select
    t.id,
    @row := @row + 1 as row
  from
    (select @row := 0) rt,
    ${themesTableName} t
  where
    t.is_default = 1
  order by
    t.name
`.trim().replace(/\s+/g, ' ')

const RelatedThemesIDsQuery = `
  select
    t.id,
    @row := @row + 1 as row
  from
    (select @row := 0) rt,
    ${themesTableName} t
  left join
    ${usersThemesTableName} ut
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
    t.id,
    @row := @row + 1 as row
  from
    (select @row := 0) rt,
    ${themesTableName} t
  where
    t.id not in (
      select
        ut.theme_id
      from
        ${usersThemesTableName} ut
      where
        ut.user_id = :userID
    )
  order by
    t.name
`.trim().replace(/\s+/g, ' ')

const SubscribedThemesIDsQuery = `
  select
    t.id,
    @row := @row + 1 as row
  from
    (select @row := 0) rt,
    ${themesTableName} t
  left join
    ${usersThemesTableName} ut
  on
    t.id = ut.theme_id
  where
    ut.status = 'subscribed' and ut.user_id = :userID
  order by
    t.name
`.trim().replace(/\s+/g, ' ')


export default BaseStorage('Theme', {
  idsQueries: {
    'default':    DefaultThemesIDsQuery,
    'related':    RelatedThemesIDsQuery,
    'unrelated':  UnrelatedThemesIDsQuery,
    'subscribed': SubscribedThemesIDsQuery
  }
})
