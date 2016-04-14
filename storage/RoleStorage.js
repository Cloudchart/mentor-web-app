import BaseStorage from './BaseStorage'
import { Role } from '../models'


const tableName = Role.tableName
const adminByUser = `select id from ${tableName} where user_id = :user_id and name = 'admin'`


const Storage = BaseStorage('Role', {
  idsQueries: {
    adminByUser: adminByUser,
    'forUser': `select id from ${tableName} where user_id = :user_id order by created_at`,
    'namedForUser': `select id from ${tableName} where user_id = :user_id and name = :name order by created_at`,
  },

  queries: {
    forUser: {
      keys:   ['user_id'],
      query:  `select id, user_id from ${tableName} where user_id in (:ids) order by created_at`,
      cache:  true
    }
  }
})


export default {
  ...Storage,
}
