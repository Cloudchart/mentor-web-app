import BaseStorage from './BaseStorage'
import models from '../models'

import {
  mapReduce
} from './utils'


let storage = BaseStorage('AuthToken')
let storagesForProviders = {}


let finderForProvider = (providerName) =>
  (ids) =>
    models.AuthToken
      .findAll({where:{provider_name:providerName,provider_id:{$in:ids}}})
      .then(records => mapReduce(ids, records, 'provider_id', 'AuthToken'))


let forProvider = (providerName) =>
  storagesForProviders[providerName] || (
    storagesForProviders[providerName] = BaseStorage('AuthToken', { finder: finderForProvider(providerName), cache: false })
  )


export default Object.assign(storage, { forProvider })
