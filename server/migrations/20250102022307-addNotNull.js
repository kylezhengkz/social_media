'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    Promise.all([
      queryInterface.changeColumn("Posts",
        "userId",
        {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false
        }
      ),
    ])
  },

  async down (queryInterface, Sequelize) {
    Promise.all([
      queryInterface.changeColumn("Posts",
        "userId",
        {
          type: Sequelize.DataTypes.INTEGER
        }
      )
    ])
  }
};
