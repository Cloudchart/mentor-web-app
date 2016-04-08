import BaseStorage from './BaseStorage'
import models from '../models'


const TableName = models.UserThemeInsight.tableName

const GenericQuery = (options = {}) => `
  select
    id
  from
  ${ options.table ? options.table : TableName }
  ${ options.where ? ' where ' + options.where : '' }
  ${ options.order ? ' order by ' + options.order: '' }
  ${ options.limit ? ' limit ' + options.limit : '' }
`

const UniqueQuery = `
  select
    id
  from
    ${TableName}
  where
    user_id = :user_id
    and
    theme_id = :topic_id
    and
    insight_id = :insight_id
`


const UnratedForUserQuery = `
  select
    id
  from
    ${TableName}
  where
    user_id = :user_id
    and
    rate is null
  order by
    created_at
`

const RatedForUserQuery = `
  select
    id
  from
    ${TableName}
  where
    user_id = :user_id
    and
    rate is not null
  order by
    updated_at desc
`

const PostponedForUserQuery = `
  select
    id
  from
    ${TableName}
  where
    user_id = :user_id
    and
    rate = 0
  order by
    updated_at desc
`


const Storage = BaseStorage('UserTopicInsight', {
  modelName: 'UserThemeInsight',
  idsQueries: {
    'unique':           UniqueQuery,
    'ratedForUser':     RatedForUserQuery,
    'unratedForUser':   UnratedForUserQuery,
    'postponedForUser': PostponedForUserQuery,
    'lastRatedForUser': RatedForUserQuery + ' limit 1'
  }
})


export default {
  ...Storage
}
