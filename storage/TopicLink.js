import BaseStorage from './BaseStorage'
import { TopicLink } from '../models'


const TableName = TopicLink.tableName


const GenericQuery = (options = {}) => `
  select
    id
  from
  ${ options.table ? options.table : TableName }
  ${ options.where ? ' where ' + options.where : '' }
  ${ options.order ? ' order by ' + options.order: '' }
`


const Storage = BaseStorage('TopicLink', {
  modelName: 'TopicLink',
  idsQueries: {
    forTopic: GenericQuery({
      where: `topic_id = :topic_id`,
      order: 'created_at'
    })
  }
})


export default {
  ...Storage,
}
