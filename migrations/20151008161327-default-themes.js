var uuid = require('node-uuid')
var themesNames = ['Leadership', 'Investors', 'Product', 'Design', 'Start a startup', 'Growth hacking', 'Team', 'Growth Hacking', 'Overcoming failures', 'Building company culture', 'Hiring people']

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
