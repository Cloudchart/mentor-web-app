import BaseStorage from './BaseStorage'
import { Role } from '../models'


const tableName = Role.tableName
const adminByUser = `select id from ${tableName} where user_id = :user_id and name = 'admin'`


export default BaseStorage('Role', {
  idsQueries: {
    adminByUser: adminByUser,
  }
})
