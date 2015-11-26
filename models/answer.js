module.exports = function(sequelize, DataTypes) {
  var Answer = sequelize.define('Answer', {

    id: {
      type:           DataTypes.UUID,
      primaryKey:     true,
      defaultValue:   DataTypes.UUIDV4
    },
    question_id: {
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
    content: {
      type:           DataTypes.TEXT,
      allowNull:      false,
    },
    outro: {
      type:           DataTypes.TEXT,
    },

  }, {

    tableName: 'answers',
    underscored: true,

    indexes: [{
      fields: ['question_id'],
    }],

    classMethods: {
      associate: function(models) {
      }
    }
  });

  return Answer;
};
