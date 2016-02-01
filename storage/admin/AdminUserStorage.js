import BaseStorage from '../BaseStorage'
import { User } from '../../models'

const tableName = User.tableName

const baseQuery = `
  select id from ${tableName} where id not in(
    select user_id from roles where name = 'admin'
  )
`

const RegularQuery = `${baseQuery} order by created_at desc`
const SearchQuery = `${baseQuery} and name like :query order by created_at desc`


export default BaseStorage('User', {
  idsQueries: {
    regular: RegularQuery,
    search: SearchQuery,
  }
})
