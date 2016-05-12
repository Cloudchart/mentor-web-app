import BaseStorage from './BaseStorage'
import { TopicLink, UserTopicLink } from '../models'


const TableName = TopicLink.tableName
const UserTopicLinkTableName  = UserTopicLink.tableName


const GenericQuery = (options = {}) => `
  select
    id
  from
  ${ options.table ? options.table : TableName }
  ${ options.where ? ' where ' + options.where : '' }
  ${ options.order ? ' order by ' + options.order: '' }
`

const TopicLinkIDsByUser = `
  select
    topic_link_id
  from
    ${UserTopicLinkTableName}
  where
    user_id = :user_id
`

const Storage = BaseStorage('TopicLink', {
  modelName: 'TopicLink',
  idsQueries: {
    'allForTopic': GenericQuery({
      where: `topic_id = :topic_id`,
      order: 'created_at desc'
    }),
    'unreadByUserForTopic': GenericQuery({
      where: `topic_id = :topic_id and id not in (${TopicLinkIDsByUser})`,
      order: 'created_at'
    }),
    'readByUserForTopic': GenericQuery({
      where: `topic_id = :topic_id and id in (${TopicLinkIDsByUser})`,
      order: 'created_at'
    }),
  }
})


export default {
  ...Storage,
}
