'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('auth_tokens', {
      id: {
        type:           Sequelize.UUID,
        primaryKey:     true,
        defaultValue:   Sequelize.UUIDV4
      },
      provider_name: {
        type:           Sequelize.STRING,
        allowNull:      false
      },
      provider_id: {
        type:           Sequelize.STRING,
        allowNull:      false
      },
      user_id: {
        type:           Sequelize.UUID,
        allowNull:      false
      },
      created_at:       Sequelize.DATE,
      updated_at:       Sequelize.DATE
    });
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('auth_tokens');
  }
};
