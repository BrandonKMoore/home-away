'use strict';
const {
  Model, Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Venue.belongsTo(models.Group, {
        foreignKey: 'groupId'
      })
      Venue.hasMany(models.Event, {
        foreignKey: 'venueId',
        onDelete: 'CASCADE',
        hooks:true
      })
    }
  }
  Venue.init({
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Street Address is required"
        },
        len: {
          args: [1, 50],
          msg: "Street Address is required"
        }
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "City is required"
        },
        len: {
          args: [1, 50],
          msg: "City is required"
        }
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "State is required"
        },
        len: {
          args: [1, 50],
          msg: "State is required"
        }
      }
    },
    lat: {
      type: DataTypes.DECIMAL,
      validate: {
        min: {
          args: -90,
          msg: "Latitude must be within -90 and 90"
        },
        max: {
          args: 90,
          msg: "Latitude must be within -90 and 90"
        }
      }
    },
    lng: {
      type: DataTypes.DECIMAL,
      validate: {
        min: {
          args: -180,
          msg: "Longitude must be within -180 and 180"
        },
        max: {
          args: 180,
          msg: "Latitude must be within -90 and 90"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Venue',
    defaultScope: {
      attributes: {
        exclude: ['updatedAt', 'createdAt']
      }
    },
    validate: {
      bothCoordsOrNone() {
        if ((this.lat === null) !== (this.lng === null)) {
          throw new Error('Latitude and longitude has to both be omitted or used!');
        }
      }
    }
  });
  return Venue;
};
