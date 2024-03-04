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
        about: 'Chess is life. Fun company we keep. Come join us! Chess is life. Fun company we keep. Come join us! Chess is life. Fun company we keep. Come join us!',
        type: 'In person',
        private: false,
        city: 'Orlando',
        state: 'Florida'
      },
      {
        organizerId: 4,
        name: 'Pick Up Basketball',
        about: 'We post locations and time where we all get together and hoop. We post locations and time where we all get together and hoop. We post locations and time where we all get together and hoop.',
        type: 'In person',
        city: 'Houston',
        private: false,
        state: 'Texas'
      },
      {
        organizerId: 1,
        name: "Nature's Beauty",
        about: 'We get together and capture the beauty that nature presents to us day by day. Grab your camera and come hike with us. We get together and capture the beauty that nature presents to us day by day. Grab your camera and come hike with us.',
        type: 'Online',
        private: true,
        city: 'Knoxville',
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
