import BaseStorage from './BaseStorage'
import models from '../models'

import {
  mapReduce
} from './utils'


let storage = BaseStorage('UserTheme')
let storagesForUsers = {}


let finderForUser = (userID) =>
  (ids) =>
    models.UserTheme
      .findAll({where:{user_id:userID,theme_id:{$in:ids}}})
      .then(records => mapReduce(ids, records, 'theme_id', 'UserTheme'))


let forUser = (userID) =>
  storagesForUsers[userID] || (
    storagesForUsers[userID] = BaseStorage('UserTheme', { finder: finderForUser(userID), cache: false })
  )


export default Object.assign(storage, { forUser })
