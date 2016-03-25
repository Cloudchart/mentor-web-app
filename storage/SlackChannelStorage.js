import BaseStorage from './BaseStorage'
import models from '../models'

const TableName = models.SlackChannel.tableName

const UserQuery = `
  select
    id
  from
    ${TableName}
  where
    user_id = :user_id
`


const Storage = BaseStorage('SlackChannel', {

  idsQueries: {
    'forUser': UserQuery
  }

})

export default {
  ...Storage
}
