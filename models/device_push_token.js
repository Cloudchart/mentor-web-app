'use strict';

module.exports = function(sequelize, DataTypes) {
  var DevicePushToken = sequelize.define('DevicePushToken', {
    id: {
      type:           DataTypes.UUID,
      primaryKey:     true,
      defaultValue:   DataTypes.UUIDV4
    },
    user_id: DataTypes.UUID,
    value: DataTypes.STRING
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
