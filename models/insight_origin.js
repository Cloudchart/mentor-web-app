'use strict';

module.exports = function(sequelize, DataTypes) {
  var InsightOrigin = sequelize.define('InsightOrigin', {
    id: {
      type:           DataTypes.UUID,
      primaryKey:     true,
      defaultValue:   DataTypes.UUIDV4
    },
    url: {
      type:           DataTypes.TEXT,
      allowNull:      false,
    },
    title: {
      type:           DataTypes.STRING,
      allowNull:      false,
    },
    duration: {
      type:           DataTypes.INTEGER,
      allowNull:      false,
    },
    author: {
      type:           DataTypes.STRING,
      allowNull:      false,
    },

  }, {

    tableName: 'insight_origins',
    underscored: true,

    classMethods: {
      associate: function(models) {
      }
    }
  });

  return InsightOrigin;
};
