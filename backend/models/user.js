'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Customer, { foreignKey: "uid", onDelete: "CASCADE" })
      this.hasMany(models.Pet, { foreignKey: "uid", onDelete: "CASCADE" })
      this.hasMany(models.Schedule, { foreignKey: "uid", onDelete: "CASCADE" })

    }

    toJSON() {
      // Hide user id
      return { ...this.get(), password: undefined, id: undefined };
    };
  };

  User.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
  });
  return User;
};