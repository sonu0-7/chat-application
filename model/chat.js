const { DataTypes } = require("sequelize");

const chatModel = (sequelize) => {
  const Chat = sequelize.define("chat", {
    sender_id: {
      type: DataTypes.STRING,
    },
    receiver_id: {
      type: DataTypes.STRING,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Chat;
};

module.exports = chatModel;
