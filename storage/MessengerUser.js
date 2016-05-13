import squel from 'squel'
import BaseStorage from './BaseStorage'

import { MessengerUser as Model } from '../models'


const TableName = Model.tableName


const BaseQuery = squel.select()
  .from(TableName)
  .field('id')


const UserQuery = BaseQuery.clone()
  .where('user_id = :user_id')


const Storage = BaseStorage('MessengerUser', {
  idsQueries: {
    forUser: UserQuery.toString()
  }
})


export default {
  ...Storage,
}
