export default function(sequelize, DataTypes) {
  return sequelize.define('MessengerUser', {
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

    gender: {
      type: DataTypes.STRING,
    },

    timezone: {
      type: DataTypes.STRING,
    },

    locale: {
      type: DataTypes.STRING,
    },

    profile_pic: {
      type: DataTypes.TEXT,
    },

  }, {

    tableName: 'messenger_users',
    underscored: true,

    classMethods: {
      associate: function(models) {
      }
    }
  });
};
