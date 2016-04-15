'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('UserAnswer', {
    id: {
      type:           DataTypes.UUID,
      primaryKey:     true,
      defaultValue:   DataTypes.UUIDV4
    },
    user_id: {
      type:           DataTypes.UUID,
      allowNull:      false,
    },
    answer_id: {
      type:           DataTypes.UUID,
      allowNull:      false,
    },
  }, {

    tableName: 'users_answers',
    underscored: true,

    classMethods: {
      associate: function(models) {
      }
    }
  });
};
