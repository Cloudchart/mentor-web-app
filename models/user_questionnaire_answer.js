'use strict';

module.exports = function(sequelize, DataTypes) {
  var UserQuestionnaireAnswer = sequelize.define('UserQuestionnaireAnswer', {
    id: {
      type:           DataTypes.UUID,
      primaryKey:     true,
      defaultValue:   DataTypes.UUIDV4
    },
    user_id: {
      type:           DataTypes.UUID,
      allowNull:      false,
    },
    questionnaire_id: {
      type:           DataTypes.UUID,
      allowNull:      false,
    },
    question_id: {
      type:           DataTypes.UUID,
      allowNull:      false,
    },
    answer_id: {
      type:           DataTypes.UUID,
    },
  }, {

    tableName: 'users_questionnaires_answers',
    underscored: true,

    indexes: [{
      fields: ['user_id', 'questionnaire_id', 'question_id'],
      unique: true,
      name:   'multi_uidx',
    }],

    classMethods: {
      associate: function(models) {
      }
    }
  });

  return UserQuestionnaireAnswer;
};
