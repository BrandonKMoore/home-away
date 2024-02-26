'use strict';

options = {}

if (process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA;
}

const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Users', 'firstName', {
      type: Sequelize.STRING,
    }, options);
    await queryInterface.addColumn('Users', 'lastName', {
      type: Sequelize.STRING,
    }, options);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    queryInterface.removeColumn('Users', 'lastName', options);
    queryInterface.removeColumn('Users', 'firstName', options);
  }
};
