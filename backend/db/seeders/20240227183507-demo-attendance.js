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
        status: 'attending',
      },
      {
        eventId: 1,
        userId: 2,
        status: 'waitlist',
      },
      {
        eventId: 1,
        userId: 4,
        status: 'attending',
      },
      {
        eventId: 3,
        userId: 2,
        status: 'pending',
      },
      {
        eventId: 1,
        userId: 1,
        status: 'pending',
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
