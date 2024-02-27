'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsTo(models.Group, {
        foreignKey: 'groupId'
      })
      Event.belongsTo(models.Venue, {
        foreignKey: 'venueId'
      })
      Event.hasMany(models.EventImage, {
        foreignKey: 'eventId'
      })
      Event.belongsToMany(models.User, {
        through: models.Attendance,
        foreignKey: 'eventId',
        otherKey: 'userId',
        onDelete: 'CASCADE',
        hooks: true
      })
    }
  }
  Event.init({
    venueId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    capacity: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Event',
    defaultScope: {
      attributes: {
        exclude: ['updatedAt', 'createdAt']
      }
    }
  });
  return Event;
};
