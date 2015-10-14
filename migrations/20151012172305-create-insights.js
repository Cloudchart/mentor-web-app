'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('insights', {
      id: {
        type:           Sequelize.UUID,
        primaryKey:     true,
        defaultValue:   Sequelize.UUIDV4
      },
      content: {
        type:           Sequelize.TEXT
      },
      created_at:       Sequelize.DATE,
      updated_at:       Sequelize.DATE
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('insights');
  }
};
