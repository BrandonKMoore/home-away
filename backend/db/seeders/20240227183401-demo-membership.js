'use strict';

const { Membership } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Membership.bulkCreate([
      {
        userId: 4,
        groupId: 3,
        status: 'co-host',
      },
      {
        userId: 4,
        groupId: 2,
        status: 'member',
      },
      {
        userId: 3,
        groupId: 2,
        status: 'co-host',
      },
      {
        userId: 1,
        groupId: 2,
        status: 'pending',
      },
      {
        userId: 1,
        groupId: 3,
        status: 'member',
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Memberships';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
