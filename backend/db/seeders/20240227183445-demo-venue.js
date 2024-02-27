'use strict';

const { Venue } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Venue.bulkCreate([
      {
        groupId: 3,
        address: '3688 Angel Oak Rd.',
        city: 'Johns Island',
        state: 'SC',
        lat: 32.71709,
        lng: -80.08043
      },
      {
        groupId: 2,
        address: '280 W 155th St.',
        city: 'New York',
        state: 'NY',
        lat: 40.829564,
        lng: -73.936465
      },
      {
        groupId: 1,
        address: '4657 Maryland Ave.',
        city: 'Saint Louis',
        state: 'MO',
        lat: 38.6444,
        lng: -90.2611
      },
      {
        groupId: 2,
        address: '1800 Ocean Front Walk',
        city: 'Venice',
        state: 'CA',
      },
      {
        groupId: 2,
        address: '1510 W Susquehanna Ave',
        city: 'Philadelphia',
        state: 'PA',
        lat: 39.986260,
        lng: -75.158347
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
