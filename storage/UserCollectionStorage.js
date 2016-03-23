import BaseStorage from './BaseStorage'
import models from '../models'

const TableName = models.UserCollection.tableName


const UserQuery = `
  select
    id
  from
    ${TableName}
  where
    user_id = :userID
  order by
    created_at
`

const UserAndNameQuery = `
  select
    id
  from
    ${TableName}
  where
    user_id = :userID
    and
    name = :name
`


export default BaseStorage('UserCollection', {
  idsQueries: {
    user: UserQuery,
    userAndName: UserAndNameQuery,
  }
})
