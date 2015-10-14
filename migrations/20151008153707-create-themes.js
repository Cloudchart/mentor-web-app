'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('themes', {
      id: {
        type:           Sequelize.UUID,
        primaryKey:     true,
        defaultValue:   Sequelize.UUIDV4
      },
      user_id: {
        type:           Sequelize.UUID,
        allowNull:      false
      },
      name: {
        type:           Sequelize.STRING,
        allowNull:      false
      },
      is_system: {
        type:           Sequelize.BOOLEAN,
        defaultValue:   false
      },
      is_default: {
        type:           Sequelize.BOOLEAN,
        defaultValue:   false
      },
      created_at:       Sequelize.DATE,
      updated_at:       Sequelize.DATE
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('themes');
  }
};
