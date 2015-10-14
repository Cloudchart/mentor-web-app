'use strict';

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: {
      type:           DataTypes.UUID,
      primaryKey:     true,
      defaultValue:   DataTypes.UUIDV4
    },
    name:             DataTypes.STRING,
    email:            DataTypes.STRING,
    password_digest:  DataTypes.STRING,

    is_active: {
      type:           DataTypes.BOOLEAN,
      defaultValue:   false
    }

  }, {

    tableName: 'users',
    underscored: true,

    instanceMethods: {
      insightsByTheme: async function(themeID) {
        let { Insight } = require('.')
        let records = await this.getUserInsightThemes({ include: [Insight], where: { theme_id: themeID }})
        return records.map(record => record.Insight)
      },

      favoriteInsights: async function() {
        let { Insight } = require('.')
        let records = await this.getUserInsightThemes({ include: [Insight], where: { is_positive: true }, order: 'created_at' })
        return records.map(record => {
          record = record.get({ plain: true })
          let insight = record.Insight
          return Object.assign(insight, {
            theme_id: record.theme_id
          })
        })
      }
    },

    classMethods: {
      associate: function(models) {
        User.hasMany(models.AuthToken)
        User.belongsToMany(models.Theme, { through: 'users_themes' })
        User.hasMany(models.UserInsightTheme)
        User.belongsToMany(models.Insight, { through: 'users_insights_themes' })
      }
    }

  });

  return User;
};
