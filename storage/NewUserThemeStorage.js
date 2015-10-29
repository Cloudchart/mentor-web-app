import BaseStorage from './BaseStorage'
import models from '../models'

const UserThemeTableName = models.UserTheme.tableName


const UserThemeIDQuery = `
  select
    id
  from
    ${UserThemeTableName}
  where
    user_id = :userID and theme_id = :themeID
`.trim().replace(/\s+/g, ' ')


export default BaseStorage('UserTheme', {
  idsQueries: {
    'userAndTheme': UserThemeIDQuery
  }
})
