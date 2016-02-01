import BaseStorage from './BaseStorage'
import { AuthToken } from '../models'

import {
  mapReduce
} from './utils'

const tableName = AuthToken.tableName
const byUser = `select id from ${tableName} where user_id = :userID`

let storage = BaseStorage('AuthToken', {
  idsQueries: {
    byUser: byUser
  }
})
let storagesForProviders = {}


let finderForProvider = (providerName) =>
  (ids) =>
    AuthToken
      .findAll({where:{provider_name:providerName,provider_id:{$in:ids}}})
      .then(records => mapReduce(ids, records, 'provider_id', 'AuthToken'))


let forProvider = (providerName) =>
  storagesForProviders[providerName] || (
    storagesForProviders[providerName] = BaseStorage('AuthToken', { finder: finderForProvider(providerName), cache: false })
  )


export default Object.assign(storage, { forProvider })
