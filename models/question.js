module.exports = function(sequelize, DataTypes) {
  var Question = sequelize.define('Question', {

    id: {
      type:           DataTypes.UUID,
      primaryKey:     true,
      defaultValue:   DataTypes.UUIDV4
    },
    questionnaire_id: {
      type:           DataTypes.UUID,
      allowNull:      false,
    },
    position: {
      type:           DataTypes.INTEGER.UNSIGNED,
      allowNull:      false,
    },
    name: {
      type:           DataTypes.STRING,
      allowNull:      false,
    },
    intro: {
      type:           DataTypes.TEXT,
      allowNull:      false,
    },
    outro: {
      type:           DataTypes.TEXT,
      allowNull:      false,
    }

  }, {

    tableName: 'questions',
    underscored: true,

    indexes: [{
      fields: ['questionnaire_id'],
    }],

    classMethods: {
      associate: function(models) {
      }
    }
  });

  return Question;
};
