'use strict';

const date = new Date()

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
        foreignKey: 'eventId',
        onDelete: 'CASCADE',
        hooks:true
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
      allowNull: false,
      validate: {
        notNull: {
          msg: "Name must be at least 5 characters"
        },
        len: {
          args: [5,50],
          msg: "Name must be at least 5 characters"
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Description is required"
        },
        len: {
          args: [1,1000],
          msg: "Description is required"
        }
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Type must be Online or In person"
        },
        isIn: {
          args: [['Online', 'In person']],
          msg: "Type must be Online or In person"
        }
      }
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Capacity must be an integer"
        },
        isInt: {
          msg: "Capacity must be an integer"
        }
      }
    },
    price: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false,
      isDecimal: {
        msg: "Price is invalid"
      }
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Start date must be in the future"
        },
        isAfter: {
          args: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
          msg: "Start date must be in the future"
        }
      }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: "End date is less than start date"
        },
        isAfterStartDate(val) {
          if (val < this.startDate) throw new Error("End date is less than start date")
        }
      }
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
