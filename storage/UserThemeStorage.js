import BaseStorage from './BaseStorage'
import models from '../models'

import {
  mapReduce
} from './utils'


const tableName = models.UserTheme.tableName
const themesTableName = models.Theme.tableName

let idsQuery = (where) =>
  `
    select
      ut.id as id,
      @row := @row + 1 as row
    from
      (select @row := 0) rt,
      ${tableName} ut
    inner join
      ${themesTableName} t
    on
      t.id = ut.theme_id
    where
      ${where}
      and
      ut.user_id = :userID
    order by
      t.name
  `

const UniqueQuery         = `select id from ${tableName} where user_id = :userID and theme_id = :themeID`
const DefaultIDsQuery     = idsQuery(`t.is_default is true`)
const AvailableIDsQuery   = idsQuery(`ut.status = 'available'`)
const VisibleIDsQuery     = idsQuery(`ut.status = 'visible'`)
const SubscribedIDsQuery  = idsQuery(`ut.status = 'subscribed'`)
const RejectedIDsQuery    = idsQuery(`ut.status = 'rejected'`)
const RelatedIDsQuery     = idsQuery(`ut.status in ('visible', 'subscribed')`)
const UnrelatedIDsQuery   = idsQuery(`ut.status in ('available', 'rejected')`)


let storage = BaseStorage('UserTheme', {
  idsQueries: {
    'unique':       UniqueQuery,
    'default':      DefaultIDsQuery,
    'available':    AvailableIDsQuery,
    'visible':      VisibleIDsQuery,
    'subscribed':   SubscribedIDsQuery,
    'rejected':     RejectedIDsQuery,
    'related':      RelatedIDsQuery,
    'unrelated':    UnrelatedIDsQuery,
  }
})


let destroyAllForUser = (userID) =>
  models.sequelize
    .query(`delete from ${tableName} where user_id = :userID`, { replacements: { userID } })
    .then(() => storage.clearAll())
    .then(() => null)


export default { ...storage, destroyAllForUser }
