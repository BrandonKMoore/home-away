'use strict';

const { Attendance } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await Attendance.bulkCreate([
      {
        eventId: 1,
        userId: 3,
        status: 'Going',
      },
      {
        eventId: 4,
        userId: 3,
        status: 'Going',
      },
      {
        eventId: 2,
        userId: 4,
        status: 'Going',
      },
      {
        eventId: 3,
        userId: 2,
        status: 'Tentative',
      },
      {
        eventId: 1,
        userId: 1,
        status: 'Tentative',
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Attendances';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
