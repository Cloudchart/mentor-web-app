import BaseStorage from './BaseStorage'
import models from '../models'

const TableName = models.UserCollection.tableName
const UserCollectionInsightTableName = models.UserCollectionInsight.tableName


const UserQuery = `
  select
    id
  from
    ${TableName}
  where
    user_id = :userID
  order by
    created_at
`

const UserAndNameQuery = `
  select
    id
  from
    ${TableName}
  where
    user_id = :userID
    and
    name = :name
`


const Storage = BaseStorage('UserCollection', {
  idsQueries: {
    user: UserQuery,
    userAndName: UserAndNameQuery,
  }
})

export default {
  ...Storage,

  removeAllInsights: async (id) => {
    models.sequelize
      .query(`delete from ${UserCollectionInsightTableName} where user_collection_id = :id`, { replacements: { id } })
      .then(() => Storage.clearAll())
      .then(() => null)
  },

  removeUselessInsights: async (id) => {
    models.sequelize
      .query(`delete from ${UserCollectionInsightTableName} where user_collection_id = :id and is_useless = true`, { replacements: { id } })
      .then(() => Storage.clearAll())
      .then(() => null)
  },
}
