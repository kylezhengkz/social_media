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
        "likes",
        {
          type: Sequelize.DataTypes.INTEGER,
          defaultValue: 0,
          allowNull: false
        }
      ),
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
      queryInterface.removeColumn('Posts', 'likes'),
    ])
  }
};
