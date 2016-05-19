import BaseStorage from './BaseStorage'
import { Theme, UserTheme } from '../models'


const TableName = Theme.tableName
const UserThemeTableName = UserTheme.tableName


const AllTopicsForAdminQuery = `
  select
    t.id
  from
    ${TableName} as t
  where
    t.name like :query or t.description like :query
  order by
    t.name
`

const AllTopicsQuery = `
  select
    t.id
  from
    ${TableName} as t
  order by
    t.name
`

const DefaultTopicsQuery = `
  select
    t.id,
    @row := @row + 1 as row
  from
    (select @row := 0) as rt,
    ${TableName} as t
  where
    t.is_default = true
  order by
    t.name
`

const SubscribedTopicsQuery = `
  select
    t.id,
    @row := @row + 1 as row
  from
    (select @row := 0) as rt,
    ${TableName} as t
  inner join
    ${UserThemeTableName} as utt
  on
    utt.theme_id = t.id
  where
    utt.user_id = :userID
    and
    utt.status = 'subscribed'
  order by
    t.name
`


const Storage = BaseStorage('Topic', {
  modelName: 'Theme',
  idsQueries: {
    'allForAdmin': AllTopicsForAdminQuery,
    'all': AllTopicsQuery,
    'default': DefaultTopicsQuery,
    'subscribed': SubscribedTopicsQuery,
  },
})


export default {
  ...Storage,
}
