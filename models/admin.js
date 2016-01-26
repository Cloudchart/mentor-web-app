'use strict';

module.exports = function(sequelize, DataTypes) {
  var Admin = sequelize.define('Admin', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password_digest: DataTypes.STRING,

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }

  }, {

    tableName: 'users',
    underscored: true
  });

  return Admin;
};
