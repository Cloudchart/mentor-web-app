import BaseStorage from './BaseStorage'
import models from '../models'

const TableName = models.UserCollection.tableName
const UserCollectionInsightTableName = models.UserCollectionInsight.tableName


const GenericQuery = (options = {}) => `
  select
    id
  from
  ${ options.table ? options.table : TableName }
  ${ options.where ? ' where ' + options.where : '' }
  ${ options.order ? ' order by ' + options.order: '' }
`

const Storage = BaseStorage('UserCollection', {
  idsQueries: {
    user: GenericQuery({ where: `user_id = :user_id` }),
    userAndName: GenericQuery({ where: `user_id = :user_id and name = :name` }),
  }
})

export default {
  ...Storage,

  loadOrCreateBy: async (attributes) => {
    return await Storage.loadOne('userAndName', attributes).catch(() => null) || await Storage.create(attributes)
  },

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
