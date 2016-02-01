'use strict';

module.exports = function(sequelize, DataTypes) {
  var Role = sequelize.define('Role', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'roles',
    underscored: true,

    classMethods: {
      associate: function(models) {
      }
    }

  });

  return Role;
};
