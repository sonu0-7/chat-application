function isUserAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect("/user/login");
  }
}

function isUserLogin(req, res, next) {
  if (req.session && req.session.user) {
    res.redirect("/chat-app");
  } else {
    next();
  }
}

module.exports = {
  isUserAuthenticated,
  isUserLogin,
};