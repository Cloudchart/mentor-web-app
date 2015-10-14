'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {
        type:           Sequelize.UUID,
        primaryKey:     true,
        defaultValue:   Sequelize.UUIDV4
      },
      name: {
        type:           Sequelize.STRING,
        allowNull:      false
      },
      email:            Sequelize.STRING,
      password_digest:  Sequelize.STRING,
      created_at:       Sequelize.DATE,
      updated_at:       Sequelize.DATE
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('users');
  }
};
