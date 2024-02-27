'use strict';

const { Group } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
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
        private: false,
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

  //INSERT INTO groups (organizerId, name, about, type, private, state) VALUES (1, 'Chess Club R Us', 'Chess is life. Fun company we keep.', 'Social', true, 'Florida');

  async down (queryInterface, Sequelize) {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
