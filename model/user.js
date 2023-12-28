const { DataTypes } = require("sequelize");

const userModel = (sequelize) => {
  const User = sequelize.define("user", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0,
    },
  });

  return User;
};

module.exports = userModel;