import BaseStorage from './BaseStorage'
import models from '../models'

const TableName = models.Device.tableName


const UserQuery = `
  select
    id
  from
    ${TableName}
  where
    user_id = :userID
`


export default BaseStorage('Device', {
  idsQueries: {
    user: UserQuery
  }
})
