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
      allowNull:      true,
    },
    title: {
      type:           DataTypes.STRING,
      allowNull:      true,
    },
    duration: {
      type:           DataTypes.INTEGER,
      allowNull:      true,
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
