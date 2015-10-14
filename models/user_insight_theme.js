'use strict';

module.exports = function(sequelize, DataTypes) {
  var UserInsightTheme = sequelize.define('UserInsightTheme', {
    id: {
      type:           DataTypes.UUID,
      primaryKey:     true,
      defaultValue:   DataTypes.UUIDV4
    },
    user_id:          DataTypes.UUID,
    insight_id:       DataTypes.UUID,
    theme_id:         DataTypes.UUID,
    is_positive:      DataTypes.BOOLEAN

  }, {

    tableName: 'users_insights_themes',
    underscored: true,

    classMethods: {
      associate: function(models) {
        UserInsightTheme.belongsTo(models.Insight)
      }
    }
  });

  return UserInsightTheme;
};
