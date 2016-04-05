import BaseStorage from './BaseStorage'
import { UserTopicLink } from '../models'


const TableName = UserTopicLink.tableName


const GenericQuery = (options = {}) => `
  select
    id
  from
  ${ options.table ? options.table : TableName }
  ${ options.where ? ' where ' + options.where : '' }
  ${ options.order ? ' order by ' + options.order: '' }
`

const Storage = BaseStorage('UserTopicLink', {
  modelName: 'UserTopicLink',
  idsQueries: {
    'allForUserAndTopicLink': GenericQuery({
      where: `topic_link_id = :topic_link_id and user_id = :user_id`,
      order: 'created_at'
    }),
  }
})


export default {
  ...Storage,
}
