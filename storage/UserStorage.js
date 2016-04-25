import squel from 'squel'
import BaseStorage from './BaseStorage'

import { User } from '../models'


const TableName = User.tableName

const BaseQuery = squel.select()
  .from(TableName)
  .field('id')

const NamedUsersQuery = BaseQuery.clone()
  .where(
    squel.expr()
      .and('name is not null')
      .and('name <> ?', '')
  )
  .order('name')


const Storage = BaseStorage('User', {
  idsQueries: {
    'all': BaseQuery.toString(),
    'named': NamedUsersQuery.toString()
  }
})


export default {
  ...Storage,
}
