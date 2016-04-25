import squel from 'squel'
import BaseStorage from './BaseStorage'
import { UserTopicLink } from '../models'


const TableName = UserTopicLink.tableName


const BaseQuery = squel.select()
  .from(TableName)
  .field('id')

const ForUserAndTopicQuery = BaseQuery.clone()
  .where(
    squel.expr()
      .and('topic_link_id = ?', squel.str(':topic_link_id'))
      .and('user_id = ?', squel.str(':user_id'))
  )
  .order('created_at')


const Storage = BaseStorage('UserTopicLink', {
  modelName: 'UserTopicLink',
  idsQueries: {
    'forUserAndTopicLink': ForUserAndTopicQuery.toString(),
  }
})


export default {
  ...Storage,
}
