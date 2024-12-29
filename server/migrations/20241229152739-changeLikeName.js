'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  
  async up (queryInterface, Sequelize) {
    Promise.all([
      queryInterface.renameColumn('Posts', 'likes', 'votes')
    ])
  },

  async down (queryInterface, Sequelize) {
    Promise.all([
      queryInterface.renameColumn('Posts', 'votes', 'likes')
    ])
  }
};
