const { Sequelize } = require("sequelize");
const userModel = require("./user");
const chatModel = require("./chat");

const sequelize = new Sequelize(process.env.DATABASE, "root", "", {
  host: "localhost",
  logging: false,
  dialect: "mysql",
  pool: { max: 5, min: 0, idle: 1000 },
});

// Verify the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has established with MySQL.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

const User = userModel(sequelize);
const Chat = chatModel(sequelize);

// User.hasMany(Chat, {foreignKey: 'sender_id', as: 'userInfo'});
// Chat.belongsTo(User, {foreignKey: 'sender_id', as: 'chatInfo'});

sequelize
  .sync({ force: false })
  .then(() => console.log("Database and table synced."))
  .catch((err) => console.log("Error synced database:", err));

module.exports = {
  sequelize,
  models: { User, Chat},
};
