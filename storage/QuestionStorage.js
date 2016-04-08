import BaseStorage from './BaseStorage'
import { Question as Model } from '../models'


const TableName = Model.tableName


const GenericQuery = (options = {}) => `
  select
    id
  from
  ${ options.table ? options.table : TableName }
  ${ options.where ? ' where ' + options.where : '' }
  ${ options.order ? ' order by ' + options.order : '' }
  ${ options.limit ? ' limit ' + options.limit : '' }
`

const Storage = BaseStorage('Question', {
  idsQueries: {
    'all': GenericQuery({ order: 'created_at desc' })
  }
})


export default {
  ...Storage,
}
