import BaseStorage from '../BaseStorage'
import { User } from '../../models'

const tableName = User.tableName

const RegularQuery = `
  select id from ${tableName} where id not in(
    select user_id from roles where name = 'admin'
  )
`

export default BaseStorage('User', {
  idsQueries: {
    regular: RegularQuery
  }
})
