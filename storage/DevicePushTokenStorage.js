import BaseStorage from './BaseStorage'
import { DevicePushToken } from '../models'

const tableName = DevicePushToken.tableName
const byValue = `select id from ${tableName} where value = :value`

export default BaseStorage('DevicePushToken', {
  idsQueries: {
    byValue: byValue
  }
})
