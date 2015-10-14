'use strict';
module.exports = function(sequelize, DataTypes) {
  var AuthToken = sequelize.define('AuthToken', {
    id: {
      type:           DataTypes.UUID,
      primaryKey:     true,
      defaultValue:   DataTypes.UUIDV4
    },
    provider_name:    DataTypes.STRING,
    provider_id:      DataTypes.STRING,
    user_id:          DataTypes.UUID,

  }, {

    tableName: 'auth_tokens',
    underscored: true,

    classMethods: {
      associate: function(models) {
        AuthToken.belongsTo(models.User)
      }
    }

  });

  return AuthToken;
};
