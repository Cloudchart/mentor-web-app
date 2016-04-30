import squel from 'squel'
import BaseStorage from './BaseStorage'

import { TelegramUser as Model } from '../models'


const TableName = Model.tableName

const BaseQuery = squel.select()
  .from(TableName)
  .field('id')

const Storage = BaseStorage('TelegramUser', {
  idsQueries: {
  }
})


export default {
  ...Storage,
}
