export default (db, Sequelize) => {
  let UserNotificationsSettings = db.define('UserNotificationsSettings',
    {
      id: {
        type:           Sequelize.UUID,
        primaryKey:     true,
      },
      start_at: {
        type:           Sequelize.STRING(5),
        defaultValue:   '00:00',
        allowNull:      false,
      },
      finish_at: {
        type:           Sequelize.STRING(5),
        defaultValue:   '23:59',
        allowNull:      false,
      },
      utc_offset: {
        type:           Sequelize.INTEGER,
        defaultValue:   0,
        allowNull:      false,
      },
      times_to_send: {
        type:           Sequelize.INTEGER,
        defaultValue:   0,
        allowNull:      false,
      },
    }, {

      tableName:    'user_notifications_settings',
      underscored:  true,

      indexes: [],

      classMethods: {
        associate: function (models) {
        }
      }

    }
  )

  return UserNotificationsSettings
}
