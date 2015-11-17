'use strict';

module.exports = function(sequelize, DataTypes) {
  var Device = sequelize.define('Device', {
    id: {
      type:           DataTypes.STRING,
      primaryKey:     true
    },

    user_id:          DataTypes.UUID,
    push_token:       DataTypes.STRING,

  }, {

    tableName: 'devices',
    underscored: true,

    classMethods: {
      associate: function(models) {
      }
    }
  });

  return Device;
};
