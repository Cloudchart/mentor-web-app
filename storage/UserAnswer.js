import BaseStorage from './BaseStorage'
import { UserAnswer as Model } from '../models'


const TableName = Model.tableName


const GenericQuery = (options = {}) => `
  select
    id
  from
  ${ options.table ? options.table : TableName }
  ${ options.where ? ' where ' + options.where : '' }
  ${ options.order ? ' order by ' + options.order: '' }
`

const Storage = BaseStorage('UserAnswer', {
  modelName: 'UserAnswer',
  idsQueries: {
    'forUserAndAnswer': GenericQuery({
      where: `answer_id = :answer_id and user_id = :user_id`,
      order: 'created_at'
    }),
  }
})


export default {
  ...Storage,
}
