'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    Promise.all([
      queryInterface.changeColumn("Posts",
        "votes",
        {
          type: Sequelize.JSON,
          defaultValue: {likes: [], dislikes: []},
          allowNull: false
        }
      ),
    ])
  },

  async down (queryInterface, Sequelize) {
    Promise.all([
      queryInterface.changeColumn("Posts",
        "votes",
        {
          type: Sequelize.JSON,
          defaultValue: {},
          allowNull: false
        }
      )
    ])
  }
};
