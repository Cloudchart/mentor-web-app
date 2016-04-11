import BaseStorage from './BaseStorage'

import { User } from '../models'


const TableName = User.tableName


const GenericQuery = (options = {}) => `
  select
    id
  from
  ${ options.table ? options.table : TableName }
  ${ options.where ? ' where ' + options.where : '' }
  ${ options.order ? ' order by ' + options.order: '' }
`


const Storage = BaseStorage('User', {
  idsQueries: {
    'named': GenericQuery({ where: `name is not null and name != ''`, order: 'name' })
  }
})


export default {
  ...Storage,
}
