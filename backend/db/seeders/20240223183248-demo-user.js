'use strict';

const {User} = require('../models');
const bcrypt = require("bcryptjs");

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
    await User.bulkCreate([
      // {
      //   email: 'demo@user.io',
      //   username: 'Demo-lition',
      //   hashedPassword: bcrypt.hashSync('password'),
      // },
      // {
      //   email: 'user1@user.io',
      //   username: 'FakeUser1',
      //   hashedPassword: bcrypt.hashSync('password2')
      // },
      // {
      //   email: 'user2@user.io',
      //   username: 'FakeUser2',
      //   hashedPassword: bcrypt.hashSync('password3')
      // },
      {
        firstName: 'Aubrie',
        lastName: 'Johnston',
        email: 'aubrie.johnston@user.io',
        username: 'j.aubrie',
        hashedPassword: bcrypt.hashSync('AJohnston1!')
      },
      {
        firstName: 'Callie',
        lastName: 'Lyon',
        email: 'callie.lyon@user.io',
        username: 'c.lyon54',
        hashedPassword: bcrypt.hashSync('CLyons2!')
      },
      {
        firstName: 'Tristin',
        lastName: 'Dougherty',
        email: 'tristin.dougherty@user.io',
        username: 't.dougherty',
        hashedPassword: bcrypt.hashSync('TDougherty2!')
      },
      {
        firstName: 'Rolando',
        lastName: 'Frederick',
        email: 'rolando.frederick@user.io',
        username: 'r.frederick',
        hashedPassword: bcrypt.hashSync('RFrederick3!')
      },
      {
        firstName: 'Lillie',
        lastName: 'Cardenas',
        email: 'lillie.cardenas@user.io',
        username: 'l.cardenas',
        hashedPassword: bcrypt.hashSync('LCardenas3!')
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bul kDelete('People', null, {});
     */
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2', 'j.aubrie', 'c.lyon54', 't.dougherty', 'r.frederick', 'l.cardenas'] }
    }, {});
  }
};
