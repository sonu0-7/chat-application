const { models } = require("../model");
const { Op } = require("sequelize");
let { Chat, User } = models;

async function renderChatPage(req, res) {
  let userName;
  let users;
  let userId;
  try {
    userName = req.session.user.name;
    userId = req.session.user.id;
    users = await User.findAll({ where: { id: { [Op.ne]: userId } } });
    let firstCharToUpperCase = userName.slice(0, 1).toUpperCase();
    let restOfTheCharToLowerCase = userName.slice(1).toLowerCase();
    userName = firstCharToUpperCase.concat(restOfTheCharToLowerCase);
  } catch (error) {}
  return res.render("chat", { userName, userId, users });
}

function renderWelcomePage(req, res) {
  let userName;
  try {
    userName = req.session.user.name;
    let firstCharToUpperCase = userName.slice(0, 1).toUpperCase();
    let restOfTheCharToLowerCase = userName.slice(1).toLowerCase();
    userName = firstCharToUpperCase.concat(restOfTheCharToLowerCase);
  } catch (error) {}
  return res.render("welcome", { userName });
}

async function userSaveChat(req, res) {
  const body = req.body;
  const chat = {
    sender_id: body.sender_id,
    receiver_id: body.receiver_id,
    message: body.message,
  }
  const entity = await Chat.create(chat);
  return res.status(201).send({success: true, msg: "message inserted!", data: entity});
}

module.exports = {
  renderChatPage,
  renderWelcomePage,
  userSaveChat,
};
