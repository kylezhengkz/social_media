'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  
  async up (queryInterface, Sequelize) {
    Promise.all([
      queryInterface.renameColumn('Posts', 'UserId', 'userId')
    ])
  },

  async down (queryInterface, Sequelize) {
    Promise.all([
      queryInterface.renameColumn('Posts', 'userId', 'UserId')
    ])
  }
};
