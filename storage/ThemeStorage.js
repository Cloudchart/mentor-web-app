import BaseStorage from './BaseStorage'
import models from '../models'

const themesTableName       = models.Theme.tableName
const usersThemesTableName  = models.UserTheme.tableName


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
    'unrelated':  UnrelatedThemesIDsQuery
  }
})
