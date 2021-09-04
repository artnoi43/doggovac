'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: 'uid' })
      this.belongsTo(models.Pet, { foreignKey: 'petId' });
    }

    toJSON() {
      // Hide user id
      return { ...this.get(), uid: undefined };
    };
  };

  Schedule.init({
    vaccine: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }

  }, {
    sequelize,
    modelName: 'Schedule',
    tableName: 'schedules',
    timestamps: false
  });
  return Schedule;
};