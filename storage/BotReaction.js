import BaseStorage from './BaseStorage'
import { BotReaction } from '../models'


const TableName = BotReaction.tableName


const GenericQuery = (options = {}) => `
  select
    id
  from
  ${ options.table ? options.table : TableName }
  ${ options.where ? ' where ' + options.where : '' }
  ${ options.order ? ' order by ' + options.order: '' }
`


const Storage = BaseStorage('BotReaction', {
  modelName: 'BotReaction',
  idsQueries: {
    forOwner: GenericQuery({
      where: `owner_id = :owner_id and owner_type = :owner_type`,
      order: 'created_at'
    }),
    forOwnerWithScope: GenericQuery({
      where: `owner_id = :owner_id and owner_type = :owner_type and scope = :scope`,
      order: 'created_at'
    }),
    forOwnerWithMood: GenericQuery({
      where: `owner_id = :owner_id and owner_type = :owner_type and mood = :mood`,
      order: 'created_at'
    }),
    unchained: GenericQuery({
      where: `owner_id is null and owner_type is null`,
      order: `created_at`
    }),
    unchainedWithScope: GenericQuery({
      where: `owner_id is null and owner_type is null and scope = :scope`,
      order: `created_at`
    })
  }
})


export default {
  ...Storage,
}
