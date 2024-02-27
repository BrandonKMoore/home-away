'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Membership.belongsTo(models.User, {
        foreignKey: 'userId'
      })
      Membership.belongsTo(models.Group, {
        foreignKey: 'groupId'
      })
    }
  }
  Membership.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['active', 'suspended', 'banned']],
          msg: 'Please provide status of active, suspended, or banned'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Membership',
    defaultScope: {
      attributes: {
        exclude: ['updatedAt', 'createdAt']
      }
    }
  });
  return Membership;
};
