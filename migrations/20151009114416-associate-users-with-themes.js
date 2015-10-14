'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('users_themes', {
      user_id:      Sequelize.UUID,
      theme_id:     Sequelize.UUID,
      created_at:   Sequelize.DATE,
      updated_at:   Sequelize.DATE
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('users_themes')
  }
};
