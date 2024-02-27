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
    await User.bulkCreate([
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
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['j.aubrie', 'c.lyon54', 't.dougherty', 'r.frederick', 'l.cardenas'] }
    }, {});
  }
};
