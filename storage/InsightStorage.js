import BaseStorage from './BaseStorage'
import models from '../models'

const TableName = models.Insight.tableName
const TopicInsightTableName = models.ThemeInsight.tableName
const UserThemeInsightTableName = models.UserThemeInsight.tableName
const UserCollectionInsightTableName = models.UserCollectionInsight.tableName


const AllForAdminQuery = (options = {}) => `
  select
    t.id as id,
    @row := @row + 1 as row
  from
    (select @row := 0) rt,
    ${TableName} t
  inner join
    ${TopicInsightTableName} as tit
  on
    tit.insight_id = t.id
  where
    tit.theme_id = :topicID
  order by
    tit.created_at asc
  ${ options.limit ? 'limit ' + options.limit : '' }
`

let TopicQueryBuilder = (options = {}) => `
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

let UserCollectionQueryBuilder = (options = {}) => `
  select
    t.id as id,
    @row := @row + 1 as row
  from
    (select @row := 0) rt,
    ${TableName} t
  inner join
    ${UserCollectionInsightTableName} as ucit
  on
    ucit.insight_id = t.id
  where
    ucit.user_collection_id = :user_collection_id
    ${ options.where ? ' and ' + options.where : '' }
  order by
    ${ options.order || 'ucit.updated_at desc' }
`


export default BaseStorage('Insight', {
  idsQueries: {
    'admin': AllForAdminQuery(),
    'preview': AllForAdminQuery({ limit: 10 }),

    'allForTopicAndUser': TopicQueryBuilder(),
    'ratedForTopicAndUser': TopicQueryBuilder({ where: `utit.rate is not null`, order: `utit.updated_at desc` }),
    'unratedForTopicAndUser': TopicQueryBuilder({ where: `utit.rate is null` }),
    'likedForTopicAndUser': TopicQueryBuilder({ where: `utit.rate > 0`, order: `utit.updated_at desc` }),
    'dislikedForTopicAndUser': TopicQueryBuilder({ where: `utit.rate < 0`, order: `utit.updated_at desc` }),

    'allForUserCollection': UserCollectionQueryBuilder(),
    'usefulForUserCollection': UserCollectionQueryBuilder({ where: `is_useless = false` }),
    'uselessForUserCollection': UserCollectionQueryBuilder({ where: `is_useless = true` }),
  }
})
