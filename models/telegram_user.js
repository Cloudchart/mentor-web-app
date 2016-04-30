export default function(sequelize, DataTypes) {
  return sequelize.define('TelegramUser', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },

    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    last_name: {
      type: DataTypes.STRING,
    },

    username: {
      type: DataTypes.STRING,
    },

  }, {

    tableName: 'telegram_users',
    underscored: true,

    classMethods: {
      associate: function(models) {
      }
    }
  });
};
