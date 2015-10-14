'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('themes', 'last_fetched_at', {
      type: Sequelize.DATE
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('themes', 'last_fetched_at')
  }
};
