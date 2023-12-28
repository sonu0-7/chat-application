const express = require("express");

const { renderChatPage, renderWelcomePage, userSaveChat } = require("../controller/chat");
const { isUserAuthenticated } = require("../middleware/auth");

const route = express.Router();

route.get("/chat-app", isUserAuthenticated, renderChatPage);
route.post("/chat-save", userSaveChat);
route.get("/", renderWelcomePage);

module.exports = route;
