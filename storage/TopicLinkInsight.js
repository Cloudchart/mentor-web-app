import BaseStorage from './BaseStorage'
import { TopicLinkInsight } from '../models'


const TableName = TopicLinkInsight.tableName


const GenericQuery = (options = {}) => `
  select
    id
  from
  ${ options.table ? options.table : TableName }
  ${ options.where ? ' where ' + options.where : '' }
  ${ options.order ? ' order by ' + options.order: '' }
`


const Storage = BaseStorage('TopicLinkInsight', {
  modelName: 'TopicLinkInsight',
  idsQueries: {
    forTopicLink: GenericQuery({
      where: `topic_link_id = :topic_link_id`,
      order: 'created_at'
    })
  }
})


export default {
  ...Storage,
}
