import BaseStorage from './BaseStorage'
import models from '../models'


const TableName = models.ThemeInsight.tableName


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


let storage = BaseStorage('ThemeInsight', {
  idsQueries: {
    'allForTheme': AllForThemeQuery
  }
})


let destroyAllForTheme = (themeID) =>
  models.ThemeInsight
    .destroy({ where: { theme_id: themeID }})
    .then(() => storage.clearAll())
    .then(() => null)


export default Object.assign(storage, {

  destroyAllForTheme: destroyAllForTheme

})
