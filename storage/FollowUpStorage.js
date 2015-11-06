import BaseStorage from './BaseStorage'
import models from '../models'

const TableName = models.FollowUp.tableName
const UserThemeInsightTableName = models.UserThemeInsight.tableName

let userQueryGenerator = (where) => `
  select
    fu.id as id,
    @row := @row + 1 as row
  from
    (select @row := 0) rows,
    ${TableName} fu
  inner join
    ${UserThemeInsightTableName} uti
  on
    uti.id = fu.id
  where
    user_id = :userID
    ${where ? `and ${where}` : ``}
  order by
    fu.updated_at
`

let lastForUserQuery = (query) => `
  ${query}
  limit 1
`

export default BaseStorage('FollowUp', {
  idsQueries: {
    ratedForUser:       userQueryGenerator(`fu.rate is not null`),
    unratedForUser:     userQueryGenerator(`fu.rate is null`),
    positiveForUser:    userQueryGenerator(`fu.rate > 0`),
    negativeForUser:    userQueryGenerator(`fu.rate < 0`),
    skippedForUser:     userQueryGenerator(`fu.rate = 0`),
    lastRatedForUser:   lastForUserQuery(userQueryGenerator(`fu.rate is not null`)),
  }
})
