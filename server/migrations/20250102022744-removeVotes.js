'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  
  async up (queryInterface, Sequelize) {
    Promise.all([
      queryInterface.removeColumn('Posts', 'votes'),
    ])
  },

  async down (queryInterface, Sequelize) {
    Promise.all([
      queryInterface.addColumn("Posts",
        "votes",
        {
          type: JSON,
          defaultValue: {likes: [], dislikes: []},
          allowNull: false
        }
      ),
    ])
  }
};
