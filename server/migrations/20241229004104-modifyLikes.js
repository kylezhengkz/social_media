'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    Promise.all([
      queryInterface.changeColumn("Posts",
        "likes",
        {
          type: Sequelize.JSON,
          defaultValue: {}
        }
      ),
    ])
  },

  async down (queryInterface, Sequelize) {
    Promise.all([
      queryInterface.changeColumn("Posts",
        "likes",
        {
          type: Sequelize.DataTypes.INTEGER,
          defaultValue: 0,
          allowNull: false
        }
      )
    ])
  }
};
