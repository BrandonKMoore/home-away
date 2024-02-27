'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.belongsTo(models.User)
    }
  }
  Group.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [5,50],
          msg: 'Name has to include 5 - 50 characters'
        }
      }
    },
    about: {
      type: DataTypes.TEXT,
    },
    type: {
      type: DataTypes.ENUM(['Social', 'Work', 'Study', 'Entertainment', 'Sports']),
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    city: {
      type: DataTypes.STRING,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Group',
    defaultScope: {
      attributes: {
        exclude: ['updatedAt', 'createdAt']
      }
    }
  });
  return Group;
};
