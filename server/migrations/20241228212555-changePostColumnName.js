'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    Promise.all([
      queryInterface.addColumn("Posts",
        "postTitle",
        {
          type: Sequelize.DataTypes.STRING(100),
          allowNull: false
        }
      ),
      queryInterface.renameColumn('Posts', 'text', 'postBody')
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    Promise.all([
      queryInterface.removeColumn('Posts', 'postTitle'),
      queryInterface.renameColumn('Posts', 'postBody', 'text')
    ])
  }
};
