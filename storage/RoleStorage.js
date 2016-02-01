import BaseStorage from './BaseStorage'

import { Role } from '../models'

const tableName = Role.tableName
const byNameForUser = `select id from ${tableName} where user_id = :user_id and name = :name`


export default BaseStorage('Role', {
  idsQueries: {
    byNameForUser: byNameForUser
  }
})
