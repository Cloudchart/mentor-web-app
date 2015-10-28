import BaseStorage from './BaseStorage'
import models from '../models'

let storage = BaseStorage('UserInsightTheme')


const UsersThemesInsightsTableName = models.UserInsightTheme.tableName

const PositiveRatedInsightsIDsForUser = `
  select
    id
  from
    ${UsersThemesInsightsTableName}
  where
    user_id = :userID and rate > 0
  order by
    updated_at desc
`.trim().replace(/\s+/g, ' ')


export default Object.assign(storage, {

  loadAllPositiveRatedForUser: (userID) =>
    models.sequelize
      .query(PositiveRatedInsightsIDsForUser, { replacements: { userID }})
      .then(([records]) => records.map(record => record.id))
      .then(storage.loadMany)

})
