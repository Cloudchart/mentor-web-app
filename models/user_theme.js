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
        values:         ['available', 'visible', 'subscribed', 'rejected']
      }
    }, {

      tableName:    'users_themes',
      underscored:  true,

      indexes: [{
        fields: ['user_id', 'theme_id'],
        unique: true
      }, {
        fields: ['status']
      }],

      classMethods: {
        associate: function (models) {
        }
      }

    }
  )

  return UserTheme
}
