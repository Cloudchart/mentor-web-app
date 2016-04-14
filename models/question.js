module.exports = function(sequelize, DataTypes) {
  var Question = sequelize.define('Question', {

    id: {
      type:           DataTypes.UUID,
      primaryKey:     true,
      defaultValue:   DataTypes.UUIDV4
    },
    content: {
      type:           DataTypes.TEXT,
      allowNull:      false,
    },
    severity: {
      type:           DataTypes.INTEGER,
      defaultValue:   0,
    },
    is_published: {
      type:           DataTypes.BOOLEAN,
      defaultValue:   false
    }

  }, {

    tableName: 'questions',
    underscored: true,

    classMethods: {
      associate: function(models) {
        models.Question.hasMany(models.BotReaction, {
          foreignKey:   'owner_id',
          constraints:  'false',
          onDelete:     'CASCADE',
          scope: {
            owner_type: 'Question'
          }
        })
      }
    }
  });

  return Question;
};
