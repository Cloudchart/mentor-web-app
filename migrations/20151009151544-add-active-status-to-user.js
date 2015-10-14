'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'is_active', {
      type:           Sequelize.BOOLEAN,
      defaultValue:   false
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'is_active')
  }
};
