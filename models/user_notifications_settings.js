export default (db, Sequelize) => {
  let UserNotificationsSettings = db.define('UserNotificationsSettings',
    {
      id: {
        type:           Sequelize.UUID,
        primaryKey:     true,
      },
      start_at:         Sequelize.STRING,
      finish_at:        Sequelize.STRING,
      utc_offset:       Sequelize.INTEGER,
      times_to_send:    Sequelize.INTEGER,
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
