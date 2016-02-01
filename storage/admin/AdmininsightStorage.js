import BaseStorage from '../BaseStorage'
import { Insight } from '../../models'

const tableName = Insight.tableName

const baseQuery = `
  select id from ${tableName}
`

const defaultQuery = `${baseQuery} order by created_at desc`
const searchQuery = `${baseQuery} where content like :query order by created_at desc`


export default BaseStorage('Insight', {
  idsQueries: {
    default: defaultQuery,
    search: searchQuery,
  }
})
