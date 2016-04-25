import squel from 'squel'
import BaseStorage from './BaseStorage'
import { BotReaction } from '../models'


const TableName = BotReaction.tableName

const BaseQuery = squel.select()
  .from(TableName)
  .field('id')
  .where('owner_id = ?', squel.str(':owner_id'))
  .where('owner_type = ?', squel.str(':owner_type'))
  .order('created_at')

const UnchainedQuery = squel.select()
  .from(TableName)
  .field('id')
  .where('owner_id is null')
  .where('owner_type is null')
  .order('created_at')

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
    forOwner: BaseQuery.toString(),
    // forOwner: GenericQuery({
    //   where: `owner_id = :owner_id and owner_type = :owner_type`,
    //   order: 'created_at'
    // }),
    forOwnerWithScope: GenericQuery({
      where: `owner_id = :owner_id and owner_type = :owner_type and scope = :scope`,
      order: 'created_at'
    }),
    forOwnerWithMood: GenericQuery({
      where: `owner_id = :owner_id and owner_type = :owner_type and mood = :mood`,
      order: 'created_at'
    }),
    unchained: UnchainedQuery.toString(),
    // unchained: GenericQuery({
    //   where: `owner_id is null and owner_type is null`,
    //   order: `created_at`
    // }),
    unchainedWithScope: GenericQuery({
      where: `owner_id is null and owner_type is null and scope = :scope`,
      order: `created_at`
    })
  }
})


export default {
  ...Storage,
}
