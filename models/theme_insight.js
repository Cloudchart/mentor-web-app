module.exports = function(sequelize, DataTypes) {
  var ThemeInsight = sequelize.define('ThemeInsight', {

    theme_id: {
      type: DataTypes.UUID
    },
    insight_id: {
      type: DataTypes.UUID
    }

  }, {

    tableName: 'themes_insights',
    underscored: true,

    indexes: [
      {
        fields: ['theme_id', 'insight_id'],
        unique: true
      }
    ],

    classMethods: {
      associate: function(models) {
      }
    }
  });

  ThemeInsight.removeAttribute('id')

  return ThemeInsight;
};
