import BaseStorage from '../BaseStorage'
import { Theme, ThemeInsight } from '../../models'


const themeTableName = Theme.tableName
const themeInsightTableName = ThemeInsight.tableName

const baseQuery = `
  select id from ${themeTableName}
`

const defaultQuery = `${baseQuery} order by name`

const searchQuery = `${baseQuery} where name like :query order by name`

const byInsightQuery = `${baseQuery} where id in(
  select theme_id from ${themeInsightTableName} where insight_id = :insightID
) order by name`


export default BaseStorage('Theme', {
  idsQueries: {
    default: defaultQuery,
    search: searchQuery,
    byInsight: byInsightQuery,
  }
})
