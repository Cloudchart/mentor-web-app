import BaseStorage from './BaseStorage'
import models from '../models'

const TableName = models.UserCollectionInsight.tableName

const GenericQuery = (options = {}) => `
  select
    id
  from
  ${ options.table ? options.table : TableName }
  ${ options.where ? ' where ' + options.where : '' }
  ${ options.order ? ' order by ' + options.order: '' }
`


const Storage = BaseStorage('UserCollectionInsight', {
  idsQueries: {
    'allForUserCollection': GenericQuery({ where: `user_collection_id = :user_collection_id` }),
    'usefulForUserCollection': GenericQuery({ where: `user_collection_id = :user_collection_id and is_useless = false` }),
    'uselessForUserCollection': GenericQuery({ where: `user_collection_id = :user_collection_id and is_useless = true` }),
    'forUserCollectionAndInsight': GenericQuery({ where: `user_collection_id = :user_collection_id and insight_id = :insight_id` })
  }
})


export default {
  ...Storage,

  loadOrCreateByUserCollectionAndInsight: async (attributes = {}) => {
    let { user_collection_id, insight_id, is_useless } = attributes
    attributes = { user_collection_id, insight_id, is_useless }
    return await Storage.loadOne('forUserCollectionAndInsight', attributes).catch(() => null) || await Storage.create(attributes)
  }
}
