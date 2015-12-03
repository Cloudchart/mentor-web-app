import BaseStorage from './BaseStorage'
import models from '../models'

const TableName = models.UserThemeInsight.tableName

const FollowUpsQuery = `
  select
    id
  from
    ${TableName}
  where
    user_id = :userID
    and
    rate = 1
    and
    updated_at < NOW() - INTERVAL 1 WEEK
  order by
    RAND()
  limit
    5
`

let idsQuery = (where, includeTheme = false) =>
  `
    select
      uti.id as id,
      @row := @row + 1 as row
    from
      (select @row := 0) rt,
      ${TableName} uti
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

let likedInsightsIDsQuery = (includeTheme = false) =>
  idsQuery(`uti.rate = 1`, includeTheme)

let usefulInsightsIDsQuery = (includeTheme = false) =>
  idsQuery(`uti.rate = 2`, includeTheme)

let negativeInsightsIDsQuery = (includeTheme = false) =>
  idsQuery(`uti.rate < 0`, includeTheme)

let dislikedInsightsIDsQuery = (includeTheme = false) =>
  idsQuery(`uti.rate = -1`, includeTheme)

let uselessInsightsIDsQuery = (includeTheme = false) =>
  idsQuery(`uti.rate = -2`, includeTheme)

let ratedInsightsIDsQuery = (includeTheme = false) =>
  idsQuery(`uti.rate is not null`, includeTheme)

let unratedInsightsIDsQuery = (includeTheme = false) =>
  idsQuery(`uti.rate is null`, includeTheme)


 let storage = BaseStorage('UserThemeInsight', {
  idsQueries: {
    'positive':           positiveInsightsIDsQuery(),
    'positiveForTheme':   positiveInsightsIDsQuery(true),
    'liked':              likedInsightsIDsQuery(),
    'likedForTheme':      likedInsightsIDsQuery(true),
    'useful':             usefulInsightsIDsQuery(),
    'usefulForTheme':     usefulInsightsIDsQuery(true),
    'negative':           negativeInsightsIDsQuery(),
    'negativeForTheme':   negativeInsightsIDsQuery(true),
    'disliked':           dislikedInsightsIDsQuery(),
    'dislikedForTheme':   dislikedInsightsIDsQuery(true),
    'useless':            uselessInsightsIDsQuery(),
    'uselessForTheme':    uselessInsightsIDsQuery(true),
    'rated':              ratedInsightsIDsQuery(),
    'ratedForTheme':      ratedInsightsIDsQuery(true),
    'unrated':            unratedInsightsIDsQuery(),
    'unratedForTheme':    unratedInsightsIDsQuery(true),
    'followUps':          FollowUpsQuery,
  }
})


let destroyAllForUser = (userID) =>
  models.sequelize
    .query(`delete from ${TableName} where user_id = :userID`, { replacements: { userID } })
    .then(() => storage.clearAll())
    .then(() => null)


export default { ...storage, destroyAllForUser }
