'use strict';

const { Event } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Event.bulkCreate([
      {
        venueId: 2,
        groupId: 2,
        name: "Rucker's Ball-Out Tournament",
        description: 'Teams face off in a 3v3 playoff style tournament',
        type: 'In person',
        capacity: 200,
        price: 5,
        startDate: '2024-05-31',
        endDate: '2024-06-02'
      },
      {
        venueId: 3,
        groupId: 1,
        name: 'Chess Champ Regionals',
        description: 'The best players in the Midwest faceoff for the title of regional champion to move on to the national tournament.',
        type: 'In person',
        capacity: 120,
        price: 10.02,
        startDate: '2024-08-09',
        endDate:  '2024-11-09'
      },
      {
        venueId: 1,
        groupId: 3,
        name: 'Meet at the Angel Oak',
        description: 'Meet and Greet at One of the most beautiful sites in the US. Come explore with us down at the Angel Tree',
        type: 'In person',
        capacity: 100,
        price: 0.00,
        startDate: '2024-04-21',
        endDate: '2024-06-21'
      },
      {
        venueId: 4,
        groupId: 2,
        name: 'Vice at Venice Beach Basketball Showdown',
        description: "We're hosting king of the court. Bring your best 5 out to see if you can take over the beach and show everyone you got what it takes",
        type: 'In person',
        capacity: 250,
        price: 25,
        startDate: '2024-03-16',
        endDate: '2024-04-16'
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
