import BaseStorage from './BaseStorage'
import models from '../models'

import {
  mapReduce
} from './utils'


const tableName = models.UserTheme.tableName
const themesTableName = models.Theme.tableName

const DefaultIDsQuery = `
  select
    ut.id,
    @row := @row + 1 as row
  from
    (select @row := 0) rt,
    ${tableName} ut
  inner join
    ${themesTableName} t
  on
    t.id = ut.theme_id
  where
    t.is_default is true
    and
    ut.user_id = :userID
  order by
    t.name
`

export default BaseStorage('UserTheme', {
  idsQueries: {
    'default': DefaultIDsQuery
  }
})
