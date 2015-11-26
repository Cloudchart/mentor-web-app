'use strict';

module.exports = function(sequelize, DataTypes) {
  var Questionnaire = sequelize.define('Questionnaire', {
    id: {
      type:           DataTypes.UUID,
      primaryKey:     true,
      defaultValue:   DataTypes.UUIDV4
    },
    name:          DataTypes.STRING
  }, {

    tableName: 'questionnaires',
    underscored: true,

    classMethods: {
      associate: function(models) {
      }
    }
  });

  return Questionnaire;
};
