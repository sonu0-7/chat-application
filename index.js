// import 3rd parties
const express = require("express");
const { createServer } = require("http");
const socket = require("socket.io");
const dotenv = require("dotenv").config();
const nunjucks = require("nunjucks");
const cookieSession = require("cookie-session");
const { Op } = require("sequelize");

const app = express();
const server = createServer(app);
const port = process.env.PORT || 4847;

// import
const chatRouter = require("./routes/chat");
const userRouter = require("./routes/user");
const { models } = require("./model");

var User = models.User;
var Chat = models.Chat;

// middleware
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: false }));

global.io = socket(server);

// connection
require("./model");

// set the view engine
app.set("view engine", "html");

// configure the nunjucks
nunjucks.configure("view", {
  autoescape: true,
  express: app,
});

function convertTimeToUTC530(maxAgeMinutes) {
  const maxAgeMilliseconds = maxAgeMinutes * 60 * 1000;
  return maxAgeMilliseconds;
}

// Cookie-session
app.use(
  cookieSession({
    name: process.env.SESSION_NAME,
    keys: [process.env.SECRET],
    maxAge: convertTimeToUTC530(10),
  })
);

const userNamespace = io.of("/user-namespace");

// socket connection and other stuff
userNamespace.on("connection", async (socket) => {
  var userId = socket.handshake.auth.token;

  await User.update({ is_active: 1 }, { where: { id: userId } });

  socket.broadcast.emit("online-users", { userId });

  socket.on("disconnect", async function () {
    await User.update({ is_active: 0 }, { where: { id: userId } });

    socket.broadcast.emit("offline-users", { userId: userId });
  });

  // chatting
  socket.on("send-message", function (data) {
    socket.broadcast.emit("message-broadcastToUsers", data);
  });

  // load previous-chat
  socket.on("previous-chat", async function(data){
    var chats = await Chat.findAll({
      where: {
        [Op.or]: [
          {
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
          },
          {
            sender_id: data.receiver_id,
            receiver_id: data.sender_id,
          },
        ],
      },
    })
    socket.emit("loadChats", {chats: chats});
  })
});

// Router
app.use("/", chatRouter);
app.use("/user", userRouter);

server.listen(port, () => {
  console.log(`Server is up at: http://localhost:${port}`);
});