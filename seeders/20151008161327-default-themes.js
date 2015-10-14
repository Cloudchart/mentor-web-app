'use strict';

var uuid = require('node-uuid')
var themesNames = ['design', 'development', 'growth', 'launch', 'investments', 'product', 'team']

module.exports = {
  up: function (queryInterface, Sequelize) {
    var now = new Date()
    var defaultThemes = themesNames.map(function(name) {
      return {
        id:           uuid.v4(),
        name:         name,
        is_system:    true,
        is_default:   true,
        created_at:   now,
        updated_at:   now
      }
    })
    return queryInterface.bulkInsert('themes', defaultThemes, {})
  },

  down: function (queryInterface, Sequelize) {
  }
};
