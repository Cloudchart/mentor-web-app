'use strict';

module.exports = function(sequelize, DataTypes) {
  var DevicePushToken = sequelize.define('DevicePushToken', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'device_push_tokens',
    underscored: true,

    instanceMethods: {
    },

    classMethods: {
      associate: function(models) {
      }
    }

  });

  return DevicePushToken;
};
