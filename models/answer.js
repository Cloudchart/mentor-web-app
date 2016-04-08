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
    content: {
      type:           DataTypes.TEXT,
      allowNull:      false,
    },
    position: {
      type:           DataTypes.INTEGER.UNSIGNED,
      allowNull:      false,
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
