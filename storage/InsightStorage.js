import BaseStorage from './BaseStorage'
import models from '../models'

const TableName = models.Insight.tableName
const UserThemeInsightTableName = models.UserThemeInsight.tableName

let queryBuilder = (options = {}) => `
  select
    t.id as id,
    @row := @row + 1 as row
  from
    (select @row := 0) rt,
    ${TableName} t
  inner join
    ${UserThemeInsightTableName} as utit
  on
    utit.insight_id = t.id
  where
    utit.user_id = :userID
    and
    utit.theme_id = :topicID
    ${ options.where ? ' and ' + options.where : '' }
  order by
    ${ options.order || 'utit.created_at asc' }
`


export default BaseStorage('Insight', {
  idsQueries: {
    'allForTopicAndUser': queryBuilder(),
    'ratedForTopicAndUser': queryBuilder({ where: `utit.rate is not null`, order: `utit.updated_at desc` }),
    'unratedForTopicAndUser': queryBuilder({ where: `utit.rate is null` }),
    'likedForTopicAndUser': queryBuilder({ where: `utit.rate > 0`, order: `utit.updated_at desc` }),
    'dislikedForTopicAndUser': queryBuilder({ where: `utit.rate < 0`, order: `utit.updated_at desc` }),
  }
})
