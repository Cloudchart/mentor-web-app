import BaseStorage from './BaseStorage'
import models from '../models'

const UserThemeInsightTableName = models.UserInsightTheme.tableName

let positiveInsightsIDsQuery = (includeTheme = false) => `
  select
    id
  from
    ${UserThemeInsightTableName}
  where
    user_id = :userID and
    ${ includeTheme ? 'theme_id = :themeID and' : '' }
    rate > 0
  order by
    updated_at desc
`

let negativeInsightsIDsQuery = (includeTheme = false) => `
  select
    id
  from
    ${UserThemeInsightTableName}
  where
    user_id = :userID and
    ${ includeTheme ? 'theme_id = :themeID and' : '' }
    rate < 0
  order by
    updated_at desc
`

let unratedInsightsIDsQuery = (includeTheme = false) => `
  select
    id
  from
    ${UserThemeInsightTableName}
  where
    user_id = :userID and
    ${ includeTheme ? 'theme_id = :themeID and' : '' }
    rate is null
  order by
    updated_at desc
`

export default BaseStorage('UserInsightTheme', {
  idsQueries: {
    'positive':           positiveInsightsIDsQuery(),
    'positiveForTheme':   positiveInsightsIDsQuery(true),
    'negative':           negativeInsightsIDsQuery(),
    'negativeForTheme':   negativeInsightsIDsQuery(true),
    'unrated':            unratedInsightsIDsQuery(),
    'unratedForTheme':    unratedInsightsIDsQuery(true),
  }
})
