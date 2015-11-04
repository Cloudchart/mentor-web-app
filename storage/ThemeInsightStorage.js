import BaseStorage from './BaseStorage'
import models from '../models'


const TableName = models.ThemeInsight.tableName
const UserThemeInsightTableName = models.UserThemeInsight.tableName


const AllForThemeQuery = `
  select
    ti.id as id,
    @row := @row + 1 as row
  from
    (select @row := 0) r,
    ${TableName} ti
  order by
    ti.created_at
`

const NewForUserThemeQuery = `
  select
    ti.insight_id as id,
    @row := @row + 1 as row
  from
    (select @row := 0) r,
    ${TableName} ti
  where
    ti.insight_id not in (
      select
        insight_id
      from
        ${UserThemeInsightTableName}
      where
        user_id = :userID
        and
        theme_id = :themeID
    )
  order by
    ti.created_at
  limit :limit
`


let storage = BaseStorage('ThemeInsight', {
  idsQueries: {
    'allForTheme':      AllForThemeQuery,
    'newForUserTheme':  NewForUserThemeQuery
  }
})


let destroyAllForTheme = (themeID) =>
  models.sequelize
    .query(`delete from ${TableName} where theme_id = :themeID`, { replacements: { themeID }})
    .then(() => storage.clearAll())
    .then(() => null)


export default Object.assign(storage, {

  destroyAllForTheme: destroyAllForTheme

})
