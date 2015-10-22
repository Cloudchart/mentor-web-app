'use strict';

module.exports = {
  up: (migration, Sequelize) => {
    return migration.createTable('users_themes', {
      id: {
        type:       Sequelize.UUID,
        primaryKey: true
      },
      user_id: {
        type:       Sequelize.UUID,
        allowNull:  false
      },
      theme_id: {
        type:       Sequelize.UUID,
        allowNull:  false
      },
      status: {
        type:       Sequelize.ENUM,
        values:     ['visible', 'subscribed', 'rejected'],
        allowNull:  false
      },
      created_at:   Sequelize.DATE,
      updated_at:   Sequelize.DATE
    })
    .then(() => {
      return migration.addIndex('users_themes',
        ['user_id', 'theme_id'],
        { unique: true }
      )
    })
    .then(() => {
      return migration.addIndex('users_themes', ['status'])
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('users_themes')
  }
};
