'use strict';

const { Group } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await Group.bulkCreate([
      {
        organizerId: 4,
        name: 'Chess Club R Us',
        about: 'Chess is life. Fun company we keep. Come join us!',
        type: 'Social',
        private: false,
        city: 'Orlando',
        state: 'Florida'
      },
      {
        organizerId: 3,
        name: 'Pick Up Basketball',
        about: 'We post locations and time where we all get together and hoop',
        type: 'Sports',
        city: 'Houston',
        state: 'Texas'
      },
      {
        organizerId: 1,
        name: "Nature's Beauty",
        about: 'We get together and capture the beauty that nature presents to us day by day. Grab your camera and come hike with us',
        type: 'Social',
        private: true,
        state: 'Tennessee'
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
