import BaseStorage from './BaseStorage'
import { Role } from '../models'


const tableName = Role.tableName
const adminByUser = `select id from ${tableName} where user_id = :user_id and name = 'admin'`


export default BaseStorage('Role', {
  idsQueries: {
    adminByUser: adminByUser,
    'forUser': `select id from ${tableName} where user_id = :user_id order by created_at`,
    'namedForUser': `select id from ${tableName} where user_id = :user_id and name = :name order by created_at`,
  }
})
