export default (db, Sequelize) => {
  let UserTheme = db.define('UserTheme',
    {
      id: {
        type:           Sequelize.UUID,
        primaryKey:     true,
        defaultValue:   Sequelize.UUIDV4
      },
      user_id:          Sequelize.UUID,
      theme_id:         Sequelize.UUID,
      status: {
        type:           Sequelize.ENUM,
        values:         ['visible', 'subscribed', 'rejected']
      }
    },
    {

      tableName:    'users_themes',
      underscored:  true,

      classMethods: {

        associate: (models) => {
          UserTheme.belongsTo(models.Theme)
          UserTheme.belongsTo(models.User)
        }

      }

    }
  )

  return UserTheme
}
