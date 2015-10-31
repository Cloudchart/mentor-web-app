'use strict';

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: {
      type:           DataTypes.UUID,
      primaryKey:     true,
      defaultValue:   DataTypes.UUIDV4
    },
    name:             DataTypes.STRING,
    email:            DataTypes.STRING,
    password_digest:  DataTypes.STRING,

    is_active: {
      type:           DataTypes.BOOLEAN,
      defaultValue:   false
    }

  }, {

    tableName: 'users',
    underscored: true,

    instanceMethods: {
    },

    classMethods: {
      associate: function(models) {
      }
    }

  });

  return User;
};
