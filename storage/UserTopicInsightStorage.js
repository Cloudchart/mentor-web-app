import BaseStorage from './BaseStorage'
import models from '../models'


const TableName = models.UserThemeInsight.tableName


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


const Storage = BaseStorage('UserTopicInsight', {
  modelName: 'UserThemeInsight',
  idsQueries: {
    'unique': UniqueQuery
  }
})


export default {
  ...Storage
}
