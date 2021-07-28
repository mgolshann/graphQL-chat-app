'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => [
    queryInterface.renameColumn('users', 'usename', 'username')
  ],

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
