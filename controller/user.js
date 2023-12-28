const { models } = require("../model");
const bcrypt = require("bcrypt");

const User = models.User;

function renderRegisterPage(req, res) {
  return res.render("registration");
}

function renderLoginPage(req, res) {
  return res.render("login");
}

async function handleUserRegister(req, res) {
  try {
    const body = req.body;
    const value = {
      name : body.name,
      email : body.email,
      mobile: body.mobile,
      image : req.file.filename,
      is_active: 0,
    }
    let password = body.password;
    let hashPassword = await bcrypt.hash(password, 10);
    value.password = hashPassword;
    const newUser = await User.build(value);
    await newUser.save();
    if (newUser) return res.redirect("/user/login");
  } catch (error) {
    return res.redirect("/user/signup");
  }
}

async function handleUserLogin(req, res) {
  try {
    const { email, password } = req.body;
    var user = await User.findOne({ where: { email } });
    user = user.dataValues;
    const isValidUser = await bcrypt.compare(password, user.password);
    if (isValidUser) {
      req.session.user = user;
    }
    if (!user) return res.render("login", { error: "Invalid email or password" });
    return res.redirect("/chat-app");
  } catch (error) {
    res.end("Oops! user don't exist");
  }
}

async function handleUserLogout(req, res) {
  req.session = null;
  res.redirect("/user/login");
}

module.exports = {
  renderRegisterPage,
  renderLoginPage,
  handleUserRegister,
  handleUserLogin,
  handleUserLogout,
};