import BaseStorage from './BaseStorage'
import models from '../models'

const UserThemeInsightTableName = models.UserThemeInsight.tableName

let idsQuery = (where, includeTheme = false) =>
  `
    select
      uti.id as id,
      @row := @row + 1 as row
    from
      (select @row := 0) rt,
      ${UserThemeInsightTableName} uti
    where
      ${where}
      and
      uti.user_id = :userID
      ${ includeTheme ? 'and uti.theme_id = :themeID' : '' }
    order by
      uti.updated_at desc
  `

let positiveInsightsIDsQuery = (includeTheme = false) =>
  idsQuery(`uti.rate > 0`, includeTheme)

let negativeInsightsIDsQuery = (includeTheme = false) =>
  idsQuery(`uti.rate < 0`, includeTheme)

let ratedInsightsIDsQuery = (includeTheme = false) =>
  idsQuery(`uti.rate is not null`, includeTheme)

let unratedInsightsIDsQuery = (includeTheme = false) =>
  idsQuery(`uti.rate is null`, includeTheme)


export default BaseStorage('UserInsightTheme', {
  idsQueries: {
    'positive':           positiveInsightsIDsQuery(),
    'positiveForTheme':   positiveInsightsIDsQuery(true),
    'negative':           negativeInsightsIDsQuery(),
    'negativeForTheme':   negativeInsightsIDsQuery(true),
    'rated':              ratedInsightsIDsQuery(),
    'ratedForTheme':      ratedInsightsIDsQuery(true),
    'unrated':            unratedInsightsIDsQuery(),
    'unratedForTheme':    unratedInsightsIDsQuery(true),
  }
})
