'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('users_insights_themes', {
      user_id:      Sequelize.UUID,
      insight_id:   Sequelize.UUID,
      theme_id:     Sequelize.UUID,
      rate:         Sequelize.INTEGER,
      created_at:   Sequelize.DATE,
      updated_at:   Sequelize.DATE
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('users_insights_themes')
  }
};
