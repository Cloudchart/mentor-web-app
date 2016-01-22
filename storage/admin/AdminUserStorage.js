import BaseStorage from '../BaseStorage'
import { User } from '../../models'

const tableName = User.tableName
const all = `select id from ${tableName}`

export default BaseStorage('User', {
  idsQueries: {
    all: all
  }
})
