import BaseStorage from './BaseStorage'
import models from '../models'


const themesTableName       = models.Theme.tableName
const usersThemesTableName  = models.UserTheme.tableName

const AllThemesIDsQuery = `
  select
    t.id,
    @row := @row + 1 as row
  from
    (select @row := 0) rt,
    ${themesTableName} t
  order by
    t.name
`

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
`


export default BaseStorage('Theme', {
  idsQueries: {
    'all': AllThemesIDsQuery,
    'unrelated':  UnrelatedThemesIDsQuery
  }
})
